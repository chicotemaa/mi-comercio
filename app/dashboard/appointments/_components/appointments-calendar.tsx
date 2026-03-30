"use client";

import { useEffect, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import type { EventInput } from "@fullcalendar/core";

import {
  formatAppointmentTime,
  getStatusLabel,
  type AppointmentRecord,
  type BookingSettingsRecord,
  type BusinessHourRecord,
  type StaffWorkingHourRecord,
} from "@/lib/business-shared";
import {
  getCalendarBoundsForDates,
  getCalendarDayWindow,
  getAppointmentDurationWithBuffer,
  slotIsBlocked,
  timeStringToMinutes,
} from "@/lib/appointment-scheduling";

import type { AgendaViewMode } from "../appointment-types";
import { getWeekDateKeys } from "../appointment-utils";

function mapViewModeToFullCalendarView(viewMode: AgendaViewMode) {
  switch (viewMode) {
    case "day":
      return "timeGridDay";
    case "week":
      return "timeGridWeek";
    case "month":
      return "dayGridMonth";
    case "year":
      return "multiMonthYear";
    default:
      return "timeGridWeek";
  }
}

function formatDateTimeLocal(date: Date) {
  return `${getDateKeyFromDate(date)}T${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}:00`;
}

function buildCalendarEvents(
  appointments: AppointmentRecord[],
  bookingSettings: BookingSettingsRecord,
) {
  return [...appointments]
    .sort((left, right) => {
      if (left.appointmentDate !== right.appointmentDate) {
        return left.appointmentDate.localeCompare(right.appointmentDate);
      }

      if (left.appointmentTime !== right.appointmentTime) {
        return left.appointmentTime.localeCompare(right.appointmentTime);
      }

      return left.customerName.localeCompare(right.customerName);
    })
    .map((appointment) => {
      const start = `${appointment.appointmentDate}T${appointment.appointmentTime}`;
      const startDate = new Date(start);
      const endDate = new Date(
        startDate.getTime() +
          getAppointmentDurationWithBuffer(
            appointment.durationMinutes,
            bookingSettings,
          ) *
            60000,
      );

      const palette =
        appointment.status === "cancelled"
          ? {
              backgroundColor: "#ffe4e6",
              borderColor: "#fb7185",
              textColor: "#881337",
            }
          : appointment.status === "completed"
            ? {
                backgroundColor: "#e0f2fe",
                borderColor: "#38bdf8",
                textColor: "#0c4a6e",
              }
            : appointment.status === "pending"
              ? {
                  backgroundColor: "#fef3c7",
                  borderColor: "#f59e0b",
                  textColor: "#78350f",
                }
              : {
                  backgroundColor: "#dcfce7",
                  borderColor: "#22c55e",
                  textColor: "#14532d",
                };

      return {
        id: appointment.id,
        title: appointment.customerName,
        start,
        end: formatDateTimeLocal(endDate),
        extendedProps: {
          appointment,
        },
        ...palette,
      } satisfies EventInput;
    });
}

function buildBreakBackgroundEvents(
  dateKeys: string[],
  businessHours: BusinessHourRecord[],
  staffMemberId: string | null,
  staffWorkingHours: StaffWorkingHourRecord[],
) {
  return dateKeys.flatMap((dateKey) => {
    const dayWindow = getCalendarDayWindow({
      businessHours,
      dateKey,
      staffMemberId,
      staffWorkingHours,
    });

    if (!dayWindow.isOpen) {
      return [];
    }

    return dayWindow.blockedRanges.map((blockedRange, index) => ({
      id: `break-${dateKey}-${index}`,
      start: `${dateKey}T${String(Math.floor(blockedRange.startMinutes / 60)).padStart(2, "0")}:${String(blockedRange.startMinutes % 60).padStart(2, "0")}:00`,
      end: `${dateKey}T${String(Math.floor(blockedRange.endMinutes / 60)).padStart(2, "0")}:${String(blockedRange.endMinutes % 60).padStart(2, "0")}:00`,
      display: "background",
      backgroundColor:
        blockedRange.kind === "staff_break" ? "#fef3c7" : "#e2e8f0",
    }));
  });
}

function buildBusinessHours(
  businessHours: BusinessHourRecord[],
  staffMemberId: string | null,
  staffWorkingHours: StaffWorkingHourRecord[],
) {
  return businessHours.flatMap((businessDay) => {
    if (!businessDay.isOpen || !businessDay.openTime || !businessDay.closeTime) {
      return [];
    }

    if (!staffMemberId) {
      return [
        {
          daysOfWeek: [businessDay.dayOfWeek],
          startTime: businessDay.openTime,
          endTime: businessDay.closeTime,
        },
      ];
    }

    const staffDay = staffWorkingHours.find(
      (workingHour) =>
        workingHour.staffMemberId === staffMemberId &&
        workingHour.dayOfWeek === businessDay.dayOfWeek &&
        workingHour.isActive &&
        workingHour.startTime &&
        workingHour.endTime,
    );

    if (!staffDay || !staffDay.startTime || !staffDay.endTime) {
      return [];
    }

    const businessStart = timeStringToMinutes(businessDay.openTime);
    const businessEnd = timeStringToMinutes(businessDay.closeTime);
    const staffStart = timeStringToMinutes(staffDay.startTime);
    const staffEnd = timeStringToMinutes(staffDay.endTime);

    if (
      businessStart === null ||
      businessEnd === null ||
      staffStart === null ||
      staffEnd === null
    ) {
      return [];
    }

    const openMinutes = Math.max(businessStart, staffStart);
    const closeMinutes = Math.min(businessEnd, staffEnd);

    if (openMinutes >= closeMinutes) {
      return [];
    }

    return [
      {
        daysOfWeek: [businessDay.dayOfWeek],
        startTime: `${String(Math.floor(openMinutes / 60)).padStart(2, "0")}:${String(openMinutes % 60).padStart(2, "0")}:00`,
        endTime: `${String(Math.floor(closeMinutes / 60)).padStart(2, "0")}:${String(closeMinutes % 60).padStart(2, "0")}:00`,
      },
    ];
  });
}

function getDateKeyFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTimeValueFromDate(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

interface AppointmentsCalendarProps {
  appointments: AppointmentRecord[];
  bookingSettings: BookingSettingsRecord;
  businessHours: BusinessHourRecord[];
  focusDateKey: string;
  onDateClick: (dateKey: string, time?: string) => void;
  onEventClick: (appointmentId: string, dateKey: string) => void;
  onEventDrop: (
    appointmentId: string,
    nextDateKey: string,
    nextTime: string,
    revert: () => void,
  ) => void;
  onVisibleDateChange: (dateKey: string) => void;
  selectedAppointmentId: string | null;
  selectedStaffId: string | null;
  staffWorkingHours: StaffWorkingHourRecord[];
  viewMode: AgendaViewMode;
}

export function AppointmentsCalendar({
  appointments,
  bookingSettings,
  businessHours,
  focusDateKey,
  onDateClick,
  onEventClick,
  onEventDrop,
  onVisibleDateChange,
  selectedAppointmentId,
  selectedStaffId,
  staffWorkingHours,
  viewMode,
}: AppointmentsCalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const fullCalendarView = mapViewModeToFullCalendarView(viewMode);

  useEffect(() => {
    const api = calendarRef.current?.getApi();

    if (!api) {
      return;
    }

    if (api.view.type !== fullCalendarView) {
      api.changeView(fullCalendarView);
    }

    if (api.getDate().toISOString().slice(0, 10) !== focusDateKey) {
      api.gotoDate(focusDateKey);
    }
  }, [focusDateKey, fullCalendarView]);

  const weekDateKeys = useMemo(
    () => getWeekDateKeys(focusDateKey),
    [focusDateKey],
  );

  const visibleDateKeys = useMemo(
    () =>
      viewMode === "day"
        ? [focusDateKey]
        : viewMode === "week"
          ? weekDateKeys
          : [],
    [focusDateKey, viewMode, weekDateKeys],
  );

  const calendarBounds = useMemo(
    () =>
      visibleDateKeys.length > 0
        ? getCalendarBoundsForDates({
            businessHours,
            dateKeys: visibleDateKeys,
            staffMemberId: selectedStaffId,
            staffWorkingHours,
          })
        : { earliest: 8 * 60, latest: 22 * 60, dayWindows: [] },
    [businessHours, selectedStaffId, staffWorkingHours, visibleDateKeys],
  );

  const events = useMemo(
    () => buildCalendarEvents(appointments, bookingSettings),
    [appointments, bookingSettings],
  );
  const breakBackgroundEvents = useMemo(
    () =>
      viewMode === "day" || viewMode === "week"
        ? buildBreakBackgroundEvents(
            visibleDateKeys,
            businessHours,
            selectedStaffId,
            staffWorkingHours,
          )
        : [],
    [businessHours, selectedStaffId, staffWorkingHours, viewMode, visibleDateKeys],
  );

  const businessHoursConfig = useMemo(
    () => buildBusinessHours(businessHours, selectedStaffId, staffWorkingHours),
    [businessHours, selectedStaffId, staffWorkingHours],
  );

  function handleDateClick(info: DateClickArg) {
    const dateKey = info.dateStr.slice(0, 10);
    const timeValue = info.allDay ? undefined : getTimeValueFromDate(info.date);

    if (timeValue) {
      const slotMinutes = timeStringToMinutes(timeValue);
      const dayWindow = getCalendarDayWindow({
        businessHours,
        dateKey,
        staffMemberId: selectedStaffId,
        staffWorkingHours,
      });

      if (
        slotMinutes === null ||
        !dayWindow.isOpen ||
        dayWindow.openMinutes === null ||
        dayWindow.closeMinutes === null ||
        slotMinutes < dayWindow.openMinutes ||
        slotMinutes >= dayWindow.closeMinutes ||
        slotIsBlocked(
          slotMinutes,
          bookingSettings.slotIntervalMinutes,
          dayWindow.blockedRanges,
        )
      ) {
        return;
      }
    }

    onDateClick(dateKey, timeValue);
  }

  function handleEventClick(info: EventClickArg) {
    const appointmentId = info.event.id;
    const dateKey = info.event.start ? getDateKeyFromDate(info.event.start) : focusDateKey;
    onEventClick(appointmentId, dateKey);
  }

  function handleEventDrop(info: EventDropArg) {
    if (!info.event.start) {
      info.revert();
      return;
    }

    onEventDrop(
      info.event.id,
      getDateKeyFromDate(info.event.start),
      getTimeValueFromDate(info.event.start),
      info.revert,
    );
  }

  function handleEventAllow(
    dropInfo: { start: Date | null },
    draggedEvent:
      | { extendedProps?: { appointment?: AppointmentRecord } }
      | null,
  ) {
    const appointment = draggedEvent?.extendedProps?.appointment;

    if (!appointment || !dropInfo.start) {
      return false;
    }

    const dateKey = getDateKeyFromDate(dropInfo.start);
    const timeValue = getTimeValueFromDate(dropInfo.start);
    const slotMinutes = timeStringToMinutes(timeValue);
    const dayWindow = getCalendarDayWindow({
      businessHours,
      dateKey,
      staffMemberId: appointment.staffMemberId ?? selectedStaffId,
      staffWorkingHours,
    });

    if (
      slotMinutes === null ||
      !dayWindow.isOpen ||
      dayWindow.openMinutes === null ||
      dayWindow.closeMinutes === null ||
      slotMinutes < dayWindow.openMinutes ||
      slotMinutes >= dayWindow.closeMinutes ||
      slotIsBlocked(
        slotMinutes,
        getAppointmentDurationWithBuffer(
          appointment.durationMinutes,
          bookingSettings,
        ),
        dayWindow.blockedRanges,
      )
    ) {
      return false;
    }

    return true;
  }

  return (
    <div className="appointments-calendar rounded-3xl border border-slate-200 bg-white p-3">
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        initialView={fullCalendarView}
        initialDate={focusDateKey}
        locale={esLocale}
        headerToolbar={false}
        height="auto"
        editable={viewMode === "day" || viewMode === "week" || viewMode === "month"}
        selectable={false}
        weekends
        slotDuration={`${String(Math.floor(bookingSettings.slotIntervalMinutes / 60)).padStart(2, "0")}:${String(bookingSettings.slotIntervalMinutes % 60).padStart(2, "0")}:00`}
        slotMinTime={`${String(Math.floor(calendarBounds.earliest / 60)).padStart(2, "0")}:${String(calendarBounds.earliest % 60).padStart(2, "0")}:00`}
        slotMaxTime={`${String(Math.floor(calendarBounds.latest / 60)).padStart(2, "0")}:${String(calendarBounds.latest % 60).padStart(2, "0")}:00`}
        nowIndicator
        allDaySlot={false}
        expandRows
        dayMaxEventRows={viewMode === "month" || viewMode === "year" ? 4 : undefined}
        eventOrder="start,-duration,title"
        eventOrderStrict
        events={[...events, ...breakBackgroundEvents]}
        businessHours={businessHoursConfig}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventAllow={handleEventAllow}
        eventOverlap={(stillEvent, movingEvent) => {
          const stillAppointment = stillEvent.extendedProps
            .appointment as AppointmentRecord | undefined;
          const movingAppointment = movingEvent?.extendedProps
            .appointment as AppointmentRecord | undefined;

          if (!stillAppointment || !movingAppointment) {
            return true;
          }

          if (stillAppointment.id === movingAppointment.id) {
            return true;
          }

          if (
            stillAppointment.status === "cancelled" ||
            movingAppointment.status === "cancelled"
          ) {
            return true;
          }

          return stillAppointment.staffMemberId !== movingAppointment.staffMemberId;
        }}
        datesSet={(info) => {
          onVisibleDateChange(getDateKeyFromDate(info.view.currentStart));
        }}
        eventClassNames={(arg) =>
          arg.event.id === selectedAppointmentId ? ["is-selected-event"] : []
        }
        eventContent={(contentArg) => {
          const appointment = contentArg.event.extendedProps
            .appointment as AppointmentRecord | undefined;

          if (!appointment) {
            return <span>{contentArg.event.title}</span>;
          }

          return (
            <div className="fc-appointment-event">
              <div className="fc-appointment-event__time">
                {formatAppointmentTime(appointment.appointmentTime)}
              </div>
              <div className="fc-appointment-event__title">
                {appointment.customerName}
              </div>
              <div className="fc-appointment-event__meta">
                {appointment.serviceName} · {getStatusLabel(appointment.status)}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

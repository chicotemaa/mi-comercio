"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatAppointmentTime,
  getStatusBadgeClassName,
  getStatusLabel,
} from "@/lib/business-shared";
import type { AppointmentRecord } from "@/lib/business-shared";
import { Plus } from "lucide-react";

import { formatAgendaShortDay } from "../appointment-utils";

interface AppointmentsWeekViewProps {
  appointments: AppointmentRecord[];
  onCreate: (dateKey: string) => void;
  onSelectAppointment: (appointmentId: string, dateKey: string) => void;
  onSelectDate: (dateKey: string) => void;
  selectedAppointmentId: string | null;
  selectedDateKey: string;
  timeZone: string;
  weekDateKeys: string[];
}

export function AppointmentsWeekView({
  appointments,
  onCreate,
  onSelectAppointment,
  onSelectDate,
  selectedAppointmentId,
  selectedDateKey,
  timeZone,
  weekDateKeys,
}: AppointmentsWeekViewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-7">
      {weekDateKeys.map((dateKey) => {
        const dayAppointments = appointments.filter(
          (appointment) => appointment.appointmentDate === dateKey,
        );

        return (
          <div
            className={`rounded-3xl border p-4 ${
              selectedDateKey === dateKey
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white"
            }`}
            key={dateKey}
          >
            <div className="flex items-start justify-between gap-3">
              <button
                className="text-left"
                onClick={() => onSelectDate(dateKey)}
                type="button"
              >
                <p className="text-sm font-semibold capitalize">
                  {formatAgendaShortDay(dateKey, timeZone)}
                </p>
                <p
                  className={
                    selectedDateKey === dateKey
                      ? "text-xs text-slate-300"
                      : "text-xs text-slate-500"
                  }
                >
                  {dayAppointments.length} turnos
                </p>
              </button>

              <Button
                className={
                  selectedDateKey === dateKey
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : ""
                }
                onClick={() => onCreate(dateKey)}
                size="icon"
                type="button"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {dayAppointments.length === 0 ? (
                <div
                  className={`rounded-2xl border border-dashed px-3 py-4 text-sm ${
                    selectedDateKey === dateKey
                      ? "border-white/20 text-slate-300"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  Sin turnos cargados.
                </div>
              ) : (
                dayAppointments.map((appointment) => (
                  <button
                    className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                      selectedAppointmentId === appointment.id
                        ? "border-sky-400 bg-sky-500/15"
                        : selectedDateKey === dateKey
                          ? "border-white/15 bg-white/10 hover:bg-white/15"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                    key={appointment.id}
                    onClick={() => onSelectAppointment(appointment.id, dateKey)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        {formatAppointmentTime(appointment.appointmentTime)}
                      </p>
                      <Badge
                        className={
                          selectedDateKey === dateKey
                            ? "bg-white/15 text-white"
                            : getStatusBadgeClassName(appointment.status)
                        }
                      >
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {appointment.customerName}
                    </p>
                    <p
                      className={
                        selectedDateKey === dateKey
                          ? "text-xs text-slate-300"
                          : "text-xs text-slate-500"
                      }
                    >
                      {appointment.serviceName}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

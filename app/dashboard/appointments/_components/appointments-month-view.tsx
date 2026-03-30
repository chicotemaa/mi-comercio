"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAppointmentTime } from "@/lib/business-shared";
import type { AppointmentRecord } from "@/lib/business-shared";
import { Plus } from "lucide-react";

interface AppointmentsMonthViewProps {
  appointments: AppointmentRecord[];
  monthGridDays: Array<{ dateKey: string; inCurrentMonth: boolean }>;
  onCreate: (dateKey: string) => void;
  onSelectAppointment: (appointmentId: string, dateKey: string) => void;
  onSelectDate: (dateKey: string) => void;
  selectedDateKey: string;
  todayKey: string;
}

const WEEKDAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function AppointmentsMonthView({
  appointments,
  monthGridDays,
  onCreate,
  onSelectAppointment,
  onSelectDate,
  selectedDateKey,
  todayKey,
}: AppointmentsMonthViewProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAY_HEADERS.map((weekday) => (
          <div
            className="px-2 py-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
            key={weekday}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {monthGridDays.map((day) => {
          const dayAppointments = appointments.filter(
            (appointment) => appointment.appointmentDate === day.dateKey,
          );
          const isSelected = selectedDateKey === day.dateKey;
          const isToday = todayKey === day.dateKey;

          return (
            <div
              className={`rounded-3xl border p-3 ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : day.inCurrentMonth
                    ? "border-slate-200 bg-white"
                    : "border-slate-200 bg-slate-50/80"
              }`}
              key={day.dateKey}
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  className="text-left"
                  onClick={() => onSelectDate(day.dateKey)}
                  type="button"
                >
                  <p className="text-sm font-semibold">
                    {day.dateKey.slice(-2)}
                  </p>
                  {isToday ? (
                    <p
                      className={
                        isSelected
                          ? "text-[11px] text-slate-300"
                          : "text-[11px] text-sky-700"
                      }
                    >
                      Hoy
                    </p>
                  ) : null}
                </button>

                <Button
                  className={
                    isSelected
                      ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                      : ""
                  }
                  onClick={() => onCreate(day.dateKey)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                {dayAppointments.length > 0 ? (
                  <Badge
                    className={
                      isSelected
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-800"
                    }
                  >
                    {dayAppointments.length} turnos
                  </Badge>
                ) : null}

                {dayAppointments.slice(0, 3).map((appointment) => (
                  <button
                    className={`w-full rounded-2xl border px-2 py-2 text-left transition ${
                      isSelected
                        ? "border-white/15 bg-white/10 hover:bg-white/15"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                    key={appointment.id}
                    onClick={() => onSelectAppointment(appointment.id, day.dateKey)}
                    type="button"
                  >
                    <p className="text-xs font-semibold">
                      {formatAppointmentTime(appointment.appointmentTime)} ·{" "}
                      {appointment.customerName}
                    </p>
                    <p
                      className={
                        isSelected
                          ? "text-[11px] text-slate-300"
                          : "text-[11px] text-slate-500"
                      }
                    >
                      {appointment.serviceName}
                    </p>
                  </button>
                ))}

                {dayAppointments.length > 3 ? (
                  <div
                    className={
                      isSelected
                        ? "text-[11px] text-slate-300"
                        : "text-[11px] text-slate-500"
                    }
                  >
                    +{dayAppointments.length - 3} más
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

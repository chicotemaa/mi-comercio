"use client";

import { Button } from "@/components/ui/button";
import { formatAppointmentTime, getStatusBadgeClassName } from "@/lib/business-shared";
import { minutesToTimeString } from "@/lib/appointment-scheduling";
import type { AppointmentRecord } from "@/lib/business-shared";
import { Plus } from "lucide-react";

interface AppointmentsDayViewProps {
  appointments: AppointmentRecord[];
  earliestMinutes: number;
  latestMinutes: number;
  onCreate: (time: string) => void;
  onSelectAppointment: (appointmentId: string) => void;
  selectedAppointmentId: string | null;
  slotIntervalMinutes: number;
}

export function AppointmentsDayView({
  appointments,
  earliestMinutes,
  latestMinutes,
  onCreate,
  onSelectAppointment,
  selectedAppointmentId,
  slotIntervalMinutes,
}: AppointmentsDayViewProps) {
  const slots: string[] = [];

  for (
    let cursor = earliestMinutes;
    cursor <= latestMinutes;
    cursor += slotIntervalMinutes
  ) {
    slots.push(minutesToTimeString(cursor).slice(0, 5));
  }

  return (
    <div className="space-y-2">
      {slots.map((slot) => {
        const slotAppointments = appointments.filter(
          (appointment) => appointment.appointmentTime.slice(0, 5) === slot,
        );

        return (
          <div
            className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-[90px_1fr]"
            key={slot}
          >
            <div className="flex items-center justify-between gap-2 md:block">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatAppointmentTime(slot)}
                </p>
                <p className="text-xs text-slate-500">Inicio de bloque</p>
              </div>
              <Button
                onClick={() => onCreate(slot)}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>

            {slotAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-sm text-slate-500">
                Sin turnos asignados en este horario.
              </div>
            ) : (
              <div className="grid gap-2 xl:grid-cols-2">
                {slotAppointments.map((appointment) => (
                  <button
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selectedAppointmentId === appointment.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                    key={appointment.id}
                    onClick={() => onSelectAppointment(appointment.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{appointment.customerName}</p>
                        <p
                          className={
                            selectedAppointmentId === appointment.id
                              ? "text-sm text-slate-200"
                              : "text-sm text-slate-600"
                          }
                        >
                          {appointment.serviceName}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                          selectedAppointmentId === appointment.id
                            ? "bg-white/15 text-white"
                            : getStatusBadgeClassName(appointment.status)
                        }`}
                      >
                        {appointment.staffName ?? "Sin profesional"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

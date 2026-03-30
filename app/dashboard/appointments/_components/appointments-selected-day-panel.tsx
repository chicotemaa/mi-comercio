"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatAppointmentTime,
  formatCurrency,
  getChannelLabel,
  getStatusBadgeClassName,
  getStatusLabel,
} from "@/lib/business-shared";
import type { AppointmentRecord } from "@/lib/business-shared";
import { Check, Pencil, Plus, Scissors, XCircle } from "lucide-react";

import { formatAgendaDayLabel } from "../appointment-utils";

interface AppointmentsSelectedDayPanelProps {
  appointments: AppointmentRecord[];
  dateKey: string;
  onCreate: () => void;
  onEdit: (appointment: AppointmentRecord) => void;
  onSelectAppointment: (appointmentId: string) => void;
  onStatusChange: (
    appointment: AppointmentRecord,
    nextStatus: AppointmentRecord["status"],
  ) => void;
  selectedAppointmentId: string | null;
  timeZone: string;
}

export function AppointmentsSelectedDayPanel({
  appointments,
  dateKey,
  onCreate,
  onEdit,
  onSelectAppointment,
  onStatusChange,
  selectedAppointmentId,
  timeZone,
}: AppointmentsSelectedDayPanelProps) {
  const estimatedRevenue = appointments
    .filter(
      (appointment) =>
        appointment.status === "confirmed" ||
        appointment.status === "completed",
    )
    .reduce((total, appointment) => total + appointment.price, 0);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold capitalize text-slate-900">
            {formatAgendaDayLabel(dateKey, timeZone)}
          </p>
          <p className="text-sm text-slate-500">
            {appointments.length} turnos · {formatCurrency(estimatedRevenue)}
          </p>
        </div>

        <Button onClick={onCreate} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          No hay turnos cargados para este día.
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => {
            const isSelected = selectedAppointmentId === appointment.id;

            return (
              <div
                className={`rounded-3xl border p-4 ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50"
                }`}
                key={appointment.id}
              >
                <button
                  className="w-full text-left"
                  onClick={() => onSelectAppointment(appointment.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {formatAppointmentTime(appointment.appointmentTime)} ·{" "}
                        {appointment.customerName}
                      </p>
                      <p
                        className={
                          isSelected
                            ? "text-sm text-slate-300"
                            : "text-sm text-slate-600"
                        }
                      >
                        {appointment.serviceName} ·{" "}
                        {appointment.staffName ?? "Sin profesional"}
                      </p>
                    </div>
                    <Badge
                      className={
                        isSelected
                          ? "bg-white/15 text-white"
                          : getStatusBadgeClassName(appointment.status)
                      }
                    >
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                </button>

                <div
                  className={`mt-3 grid gap-3 text-sm ${
                    isSelected ? "text-slate-200" : "text-slate-600"
                  }`}
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-current/10 px-3 py-1">
                      {getChannelLabel(appointment.channel)}
                    </span>
                    <span className="rounded-full border border-current/10 px-3 py-1">
                      {formatCurrency(appointment.price)}
                    </span>
                    <span className="rounded-full border border-current/10 px-3 py-1">
                      {appointment.customerContact}
                    </span>
                  </div>

                  {appointment.notes ? <p>{appointment.notes}</p> : null}
                  {appointment.internalNotes ? (
                    <p
                      className={
                        isSelected
                          ? "rounded-2xl bg-white/10 px-3 py-2 text-slate-100"
                          : "rounded-2xl bg-white px-3 py-2 text-slate-700"
                      }
                    >
                      Interna: {appointment.internalNotes}
                    </p>
                  ) : null}
                  {appointment.cancellationReason ? (
                    <p
                      className={
                        isSelected
                          ? "rounded-2xl bg-rose-500/20 px-3 py-2 text-rose-100"
                          : "rounded-2xl bg-rose-50 px-3 py-2 text-rose-900"
                      }
                    >
                      Motivo: {appointment.cancellationReason}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    className={isSelected ? "border-white/15 bg-white/10 text-white hover:bg-white/15" : ""}
                    onClick={() => onEdit(appointment)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>

                  {appointment.status === "pending" ? (
                    <Button
                      className={isSelected ? "bg-emerald-500 text-white hover:bg-emerald-400" : ""}
                      onClick={() => onStatusChange(appointment, "confirmed")}
                      size="sm"
                      type="button"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar
                    </Button>
                  ) : null}

                  {appointment.status === "confirmed" ? (
                    <Button
                      className={isSelected ? "bg-sky-500 text-white hover:bg-sky-400" : ""}
                      onClick={() => onStatusChange(appointment, "completed")}
                      size="sm"
                      type="button"
                    >
                      <Scissors className="mr-2 h-4 w-4" />
                      Completar
                    </Button>
                  ) : null}

                  {appointment.status !== "cancelled" ? (
                    <Button
                      className={isSelected ? "border-rose-300/20 bg-rose-500/15 text-rose-100 hover:bg-rose-500/20" : ""}
                      onClick={() => onStatusChange(appointment, "cancelled")}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

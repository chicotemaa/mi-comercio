"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/business-shared";
import type { AppointmentRecord } from "@/lib/business-shared";
import { ArrowRight } from "lucide-react";

import { formatAgendaMonthLabel } from "../appointment-utils";

interface AppointmentsYearViewProps {
  appointments: AppointmentRecord[];
  monthDateKeys: string[];
  onOpenMonth: (dateKey: string) => void;
  timeZone: string;
}

export function AppointmentsYearView({
  appointments,
  monthDateKeys,
  onOpenMonth,
  timeZone,
}: AppointmentsYearViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {monthDateKeys.map((dateKey) => {
        const monthPrefix = dateKey.slice(0, 7);
        const monthAppointments = appointments.filter((appointment) =>
          appointment.appointmentDate.startsWith(monthPrefix),
        );
        const monthRevenue = monthAppointments
          .filter(
            (appointment) =>
              appointment.status === "confirmed" ||
              appointment.status === "completed",
          )
          .reduce((total, appointment) => total + appointment.price, 0);

        const busiestDay = Array.from(
          monthAppointments.reduce((map, appointment) => {
            map.set(
              appointment.appointmentDate,
              (map.get(appointment.appointmentDate) ?? 0) + 1,
            );
            return map;
          }, new Map<string, number>()),
        ).sort((left, right) => right[1] - left[1])[0];

        return (
          <div
            className="rounded-3xl border border-slate-200 bg-white p-5"
            key={dateKey}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold capitalize text-slate-900">
                  {formatAgendaMonthLabel(dateKey, timeZone)}
                </p>
                <p className="text-xs text-slate-500">
                  {monthAppointments.length} turnos en el mes
                </p>
              </div>
              <Button
                onClick={() => onOpenMonth(dateKey)}
                size="sm"
                type="button"
                variant="outline"
              >
                Ver mes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Ingreso estimado
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {formatCurrency(monthRevenue)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Día más cargado
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {busiestDay ? busiestDay[0].slice(-2) : "--"}
                </p>
                <p className="text-xs text-slate-500">
                  {busiestDay ? `${busiestDay[1]} turnos` : "Sin actividad"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

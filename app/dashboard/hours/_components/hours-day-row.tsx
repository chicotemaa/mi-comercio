"use client"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import type { HoursDayFormState } from "../hours-types"

interface HoursDayRowProps {
  day: HoursDayFormState
  onTimeChange: (dayOfWeek: number, field: "openTime" | "closeTime", value: string) => void
  onToggleOpen: (dayOfWeek: number, checked: boolean) => void
}

export function HoursDayRow({ day, onTimeChange, onToggleOpen }: HoursDayRowProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 p-4 lg:grid-cols-[160px_1fr_1fr_auto] lg:items-center">
      <div className="flex items-center gap-3">
        <Switch checked={day.isOpen} onCheckedChange={(checked) => onToggleOpen(day.dayOfWeek, checked)} />
        <div>
          <p className="font-medium text-slate-900">{day.label}</p>
          <p className="text-xs text-slate-500">Disponibilidad general del negocio</p>
        </div>
      </div>

      <Input
        className="w-full"
        disabled={!day.isOpen}
        onChange={(event) => onTimeChange(day.dayOfWeek, "openTime", event.target.value)}
        type="time"
        value={day.openTime}
      />

      <Input
        className="w-full"
        disabled={!day.isOpen}
        onChange={(event) => onTimeChange(day.dayOfWeek, "closeTime", event.target.value)}
        type="time"
        value={day.closeTime}
      />

      <Badge className={day.isOpen ? "bg-emerald-100 text-emerald-900" : "bg-slate-200 text-slate-800"}>
        {day.isOpen ? "Abierto" : "Cerrado"}
      </Badge>
    </div>
  )
}

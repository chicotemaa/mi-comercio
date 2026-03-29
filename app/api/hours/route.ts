import { NextResponse } from "next/server"

import { parseBusinessSchedulePayload, type BusinessSchedulePayload } from "@/lib/business-schedule"
import { getManagedBusiness } from "@/lib/managed-business"

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function PUT(request: Request) {
  const businessResult = await getManagedBusiness()

  if (businessResult.error || !businessResult.data) {
    return NextResponse.json({ error: businessResult.error ?? "No se pudo resolver el negocio." }, { status: 500 })
  }

  const payload = (await request.json()) as BusinessSchedulePayload
  const parsed = parseBusinessSchedulePayload(payload)

  if (parsed.error || !parsed.data) {
    return badRequest(parsed.error ?? "Solicitud inválida.")
  }

  const { supabase, business } = businessResult.data
  const timestamp = new Date().toISOString()

  const { error: bookingSettingsError } = await supabase.from("booking_settings").upsert(
    {
      business_id: business.id,
      slot_interval_minutes: parsed.data.bookingSettings.slotIntervalMinutes,
      lead_time_minutes: parsed.data.bookingSettings.leadTimeMinutes,
      max_booking_days_in_advance: parsed.data.bookingSettings.maxBookingDaysInAdvance,
      buffer_between_appointments_minutes: parsed.data.bookingSettings.bufferBetweenAppointmentsMinutes,
      updated_at: timestamp,
    },
    { onConflict: "business_id" },
  )

  if (bookingSettingsError) {
    return NextResponse.json(
      {
        error: "No se pudieron guardar las reglas de reserva. Ejecuta la última versión de schema.sql en Supabase.",
      },
      { status: 500 },
    )
  }

  const { error: hoursError } = await supabase.from("business_hours").upsert(
    parsed.data.days.map((day) => ({
      business_id: business.id,
      day_of_week: day.dayOfWeek,
      label: day.label,
      open_time: day.openTime,
      close_time: day.closeTime,
      is_open: day.isOpen,
    })),
    { onConflict: "business_id,day_of_week" },
  )

  if (hoursError) {
    return NextResponse.json({ error: "No se pudieron guardar los horarios generales." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

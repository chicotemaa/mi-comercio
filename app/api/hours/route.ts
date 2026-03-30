import { NextResponse } from "next/server";

import {
  parseBusinessSchedulePayload,
  type BusinessSchedulePayload,
} from "@/lib/business-schedule";
import { getManagedBusiness } from "@/lib/managed-business";
import { isMissingScheduleBreakColumnsError } from "@/lib/schedule-schema";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function PUT(request: Request) {
  const businessResult = await getManagedBusiness();

  if (businessResult.error || !businessResult.data) {
    return NextResponse.json(
      { error: businessResult.error ?? "No se pudo resolver el negocio." },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as BusinessSchedulePayload;
  const parsed = parseBusinessSchedulePayload(payload);

  if (parsed.error || !parsed.data) {
    return badRequest(parsed.error ?? "Solicitud inválida.");
  }

  const { supabase, business } = businessResult.data;
  const timestamp = new Date().toISOString();
  let warning: string | null = null;

  let hoursError = (
    await supabase.from("business_hours").upsert(
      parsed.data.days.map((day) => ({
        business_id: business.id,
        day_of_week: day.dayOfWeek,
        label: day.label,
        open_time: day.openTime,
        close_time: day.closeTime,
        break_start_time: day.breakStartTime,
        break_end_time: day.breakEndTime,
        is_open: day.isOpen,
      })),
      { onConflict: "business_id,day_of_week" },
    )
  ).error;

  if (hoursError && isMissingScheduleBreakColumnsError(hoursError)) {
    hoursError = (
      await supabase.from("business_hours").upsert(
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
    ).error;

    if (!hoursError) {
      warning =
        "Los horarios semanales se guardaron, pero la pausa general de almuerzo no porque falta aplicar la última versión de schema.sql en Supabase.";
    }
  }

  if (hoursError) {
    return NextResponse.json(
      { error: "No se pudieron guardar los horarios generales." },
      { status: 500 },
    );
  }

  const { error: bookingSettingsError } = await supabase
    .from("booking_settings")
    .upsert(
      {
        business_id: business.id,
        slot_interval_minutes: parsed.data.bookingSettings.slotIntervalMinutes,
        lead_time_minutes: parsed.data.bookingSettings.leadTimeMinutes,
        max_booking_days_in_advance:
          parsed.data.bookingSettings.maxBookingDaysInAdvance,
        buffer_between_appointments_minutes:
          parsed.data.bookingSettings.bufferBetweenAppointmentsMinutes,
        updated_at: timestamp,
      },
      { onConflict: "business_id" },
    );

  if (bookingSettingsError) {
    const bookingWarning =
      bookingSettingsError.code === "PGRST205"
        ? "Los horarios semanales se guardaron, pero las reglas avanzadas no porque falta aplicar la última versión de schema.sql en Supabase."
        : "Los horarios semanales se guardaron, pero las reglas avanzadas no pudieron actualizarse.";

    return NextResponse.json({
      success: true,
      warning: warning ? `${warning} ${bookingWarning}` : bookingWarning,
    });
  }

  return NextResponse.json({ success: true, warning });
}

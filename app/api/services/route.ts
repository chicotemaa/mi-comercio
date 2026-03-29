import { NextResponse } from "next/server"

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin"
import { getDefaultDurationMinutes, SERVICE_CATEGORIES } from "@/lib/service-catalog"
import type { ServiceCategory } from "@/lib/business-shared"

interface ServicePayload {
  name?: unknown
  description?: unknown
  price?: unknown
  category?: unknown
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

function parsePayload(payload: ServicePayload) {
  const name = typeof payload.name === "string" ? payload.name.trim() : ""
  const description = typeof payload.description === "string" ? payload.description.trim() : ""
  const price = typeof payload.price === "number" ? payload.price : Number(payload.price)
  const category = typeof payload.category === "string" ? payload.category.trim().toLowerCase() : ""

  if (!name) {
    return { error: "El nombre es obligatorio." } as const
  }

  if (!Number.isFinite(price) || price < 0) {
    return { error: "El costo debe ser un número válido mayor o igual a cero." } as const
  }

  if (!SERVICE_CATEGORIES.includes(category as ServiceCategory)) {
    return { error: "La categoría debe ser corte, coloraciones o tratamiento." } as const
  }

  return {
    data: {
      name,
      description: description || null,
      price,
      category: category as ServiceCategory,
      durationMinutes: getDefaultDurationMinutes(category as ServiceCategory),
    },
  } as const
}

async function getManagedBusiness() {
  const businessSlug = process.env.BUSINESS_SLUG

  if (!businessSlug || !hasSupabaseAdminConfig()) {
    return { error: "Falta la configuración de Supabase o BUSINESS_SLUG." } as const
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return { error: "No se pudo crear el cliente administrador de Supabase." } as const
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("slug", businessSlug)
    .maybeSingle()

  if (error || !business) {
    return { error: "No se encontró el negocio configurado." } as const
  }

  return { supabase, business } as const
}

export async function POST(request: Request) {
  const businessResult = await getManagedBusiness()

  if ("error" in businessResult) {
    return NextResponse.json({ error: businessResult.error }, { status: 500 })
  }

  const payload = (await request.json()) as ServicePayload
  const parsed = parsePayload(payload)

  if ("error" in parsed) {
    return badRequest(parsed.error ?? "Solicitud inválida.")
  }

  const { supabase, business } = businessResult

  const { data: existingService, error: existingError } = await supabase
    .from("services")
    .select("id")
    .eq("business_id", business.id)
    .ilike("name", parsed.data.name)
    .maybeSingle()

  if (existingError) {
    return NextResponse.json({ error: "No se pudo validar si el servicio ya existe." }, { status: 500 })
  }

  if (existingService) {
    return badRequest("Ya existe un servicio con ese nombre.")
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      business_id: business.id,
      name: parsed.data.name,
      description: parsed.data.description,
      duration_minutes: parsed.data.durationMinutes,
      price: parsed.data.price,
      category: parsed.data.category,
      is_active: true,
      booking_enabled: true,
      updated_at: new Date().toISOString(),
    })
    .select("id, name, description, duration_minutes, price, is_active, category")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "No se pudo crear el servicio." }, { status: 500 })
  }

  await supabase.from("service_price_variants").insert({
    service_id: data.id,
    variant_name: "Base",
    variant_code: "base",
    price: parsed.data.price,
    duration_minutes: parsed.data.durationMinutes,
    is_default: true,
    is_active: true,
    display_order: 1,
    notes: "Variante base creada desde el CRUD del backoffice.",
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({ service: data }, { status: 201 })
}

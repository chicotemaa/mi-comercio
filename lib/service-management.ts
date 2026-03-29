import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin"
import { getDefaultDurationMinutes, SERVICE_CATEGORIES } from "@/lib/service-catalog"
import type { ServiceCategory } from "@/lib/business-shared"

export interface ServicePayload {
  name?: unknown
  description?: unknown
  price?: unknown
  category?: unknown
  durationMinutes?: unknown
  isActive?: unknown
}

export interface ManagedBusinessContext {
  supabase: SupabaseClient
  business: {
    id: string
    slug: string
  }
}

export interface ParsedServicePayload {
  name: string
  description: string | null
  price: number
  category: ServiceCategory
  durationMinutes: number
  isActive: boolean
}

export function parseServicePayload(payload: ServicePayload): { data?: ParsedServicePayload; error?: string } {
  const name = typeof payload.name === "string" ? payload.name.trim() : ""
  const description = typeof payload.description === "string" ? payload.description.trim() : ""
  const price = typeof payload.price === "number" ? payload.price : Number(payload.price)
  const category = typeof payload.category === "string" ? payload.category.trim().toLowerCase() : ""
  const durationMinutes =
    typeof payload.durationMinutes === "number"
      ? payload.durationMinutes
      : payload.durationMinutes === undefined || payload.durationMinutes === null
        ? getDefaultDurationMinutes(category as ServiceCategory)
        : Number(payload.durationMinutes)
  const isActive = typeof payload.isActive === "boolean" ? payload.isActive : true

  if (!name) {
    return { error: "El nombre es obligatorio." }
  }

  if (!Number.isFinite(price) || price < 0) {
    return { error: "El costo debe ser un número válido mayor o igual a cero." }
  }

  if (!SERVICE_CATEGORIES.includes(category as ServiceCategory)) {
    return { error: "La categoría debe ser corte, coloraciones o tratamiento." }
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return { error: "La duración debe ser un número válido mayor a cero." }
  }

  return {
    data: {
      name,
      description: description || null,
      price,
      category: category as ServiceCategory,
      durationMinutes,
      isActive,
    },
  }
}

export function parseServiceStatusPayload(payload: Pick<ServicePayload, "isActive">): { isActive?: boolean; error?: string } {
  if (typeof payload.isActive !== "boolean") {
    return { error: "El estado activo debe ser booleano." }
  }

  return { isActive: payload.isActive }
}

export async function getManagedBusiness(): Promise<{ data?: ManagedBusinessContext; error?: string }> {
  const businessSlug = process.env.BUSINESS_SLUG

  if (!businessSlug || !hasSupabaseAdminConfig()) {
    return { error: "Falta la configuración de Supabase o BUSINESS_SLUG." }
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return { error: "No se pudo crear el cliente administrador de Supabase." }
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("slug", businessSlug)
    .maybeSingle()

  if (error || !business) {
    return { error: "No se encontró el negocio configurado." }
  }

  return {
    data: {
      supabase,
      business,
    },
  }
}

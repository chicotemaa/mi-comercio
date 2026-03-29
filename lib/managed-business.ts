import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin"

export interface ManagedBusinessContext {
  supabase: SupabaseClient
  business: {
    id: string
    slug: string
  }
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

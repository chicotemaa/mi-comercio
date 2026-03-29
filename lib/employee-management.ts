import "server-only"

import { createDefaultBusinessHours, createDefaultCategoryRateMap, type ServiceCategory, type StaffCompensationType } from "@/lib/business-shared"
import type { ManagedBusinessContext } from "@/lib/managed-business"
export { getManagedBusiness } from "@/lib/managed-business"
import { SERVICE_CATEGORIES } from "@/lib/service-catalog"
export type { ManagedBusinessContext } from "@/lib/managed-business"

export interface EmployeeWorkingHourPayload {
  dayOfWeek?: unknown
  isActive?: unknown
  startTime?: unknown
  endTime?: unknown
}

export interface EmployeePayload {
  fullName?: unknown
  role?: unknown
  email?: unknown
  phone?: unknown
  employeeCode?: unknown
  bio?: unknown
  joinDate?: unknown
  isActive?: unknown
  compensationType?: unknown
  hourlyRate?: unknown
  assignedServiceIds?: unknown
  workingHours?: unknown
  categoryRates?: unknown
}

export interface ParsedEmployeePayload {
  fullName: string
  role: string | null
  email: string | null
  phone: string | null
  employeeCode: string | null
  bio: string | null
  joinDate: string | null
  isActive: boolean
  compensationType: StaffCompensationType
  hourlyRate: number
  assignedServiceIds: string[]
  workingHours: Array<{
    dayOfWeek: number
    isActive: boolean
    startTime: string | null
    endTime: string | null
  }>
  categoryRates: Record<ServiceCategory, number>
}

function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null
  }

  const normalizedValue = value.trim()
  return normalizedValue.length > 0 ? normalizedValue : null
}

function normalizeTime(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  if (typeof value !== "string") {
    return undefined
  }

  const normalizedValue = value.trim()

  if (!/^\d{2}:\d{2}$/.test(normalizedValue)) {
    return undefined
  }

  return `${normalizedValue}:00`
}

function parseWorkingHours(input: unknown) {
  const defaultWorkingHours = createDefaultBusinessHours().map((day) => ({
    dayOfWeek: day.dayOfWeek,
    isActive: day.isOpen,
    startTime: day.openTime,
    endTime: day.closeTime,
  }))

  if (!Array.isArray(input)) {
    return { data: defaultWorkingHours }
  }

  const byDay = new Map<number, (typeof defaultWorkingHours)[number]>()

  for (const rawDay of input as EmployeeWorkingHourPayload[]) {
    const dayOfWeek = typeof rawDay.dayOfWeek === "number" ? rawDay.dayOfWeek : Number(rawDay.dayOfWeek)
    const isActive = typeof rawDay.isActive === "boolean" ? rawDay.isActive : false
    const startTime = normalizeTime(rawDay.startTime)
    const endTime = normalizeTime(rawDay.endTime)

    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return { error: "Cada día del horario semanal debe tener un valor entre 0 y 6." }
    }

    if (byDay.has(dayOfWeek)) {
      return { error: "No puede haber días repetidos en el horario semanal del empleado." }
    }

    if (isActive) {
      if (!startTime || !endTime) {
        return { error: `El día ${dayOfWeek} del horario semanal debe tener apertura y cierre.` }
      }

      if (startTime >= endTime) {
        return { error: `El día ${dayOfWeek} del horario semanal debe cerrar después de abrir.` }
      }
    }

    byDay.set(dayOfWeek, {
      dayOfWeek,
      isActive,
      startTime: isActive ? startTime ?? null : null,
      endTime: isActive ? endTime ?? null : null,
    })
  }

  if (byDay.size !== 7) {
    return { error: "Debes enviar los 7 días del horario semanal del empleado." }
  }

  return {
    data: Array.from(byDay.values()).sort((left, right) => left.dayOfWeek - right.dayOfWeek),
  }
}

function parseCategoryRates(input: unknown) {
  const defaultCategoryRates = createDefaultCategoryRateMap()

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { data: defaultCategoryRates }
  }

  const parsedRates = { ...defaultCategoryRates }

  for (const category of SERVICE_CATEGORIES) {
    const rawValue = (input as Record<string, unknown>)[category]
    const parsedValue = rawValue === undefined || rawValue === null || rawValue === "" ? 0 : Number(rawValue)

    if (!Number.isFinite(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      return { error: `El porcentaje de ${category} debe ser un número entre 0 y 100.` }
    }

    parsedRates[category] = parsedValue
  }

  return { data: parsedRates }
}

export function parseEmployeePayload(payload: EmployeePayload): { data?: ParsedEmployeePayload; error?: string } {
  const fullName = typeof payload.fullName === "string" ? payload.fullName.trim() : ""
  const employeeCode = normalizeOptionalText(payload.employeeCode)?.toUpperCase() ?? null
  const compensationType =
    payload.compensationType === "category_percentage" ? "category_percentage" : "hourly"
  const hourlyRate = payload.hourlyRate === undefined || payload.hourlyRate === null || payload.hourlyRate === "" ? 0 : Number(payload.hourlyRate)
  const assignedServiceIds = Array.isArray(payload.assignedServiceIds)
    ? Array.from(
        new Set(payload.assignedServiceIds.filter((value): value is string => typeof value === "string" && value.length > 0)),
      )
    : []

  if (!fullName) {
    return { error: "El nombre del profesional es obligatorio." }
  }

  if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
    return { error: "El valor por hora debe ser un número válido mayor o igual a cero." }
  }

  const workingHours = parseWorkingHours(payload.workingHours)

  if (workingHours.error || !workingHours.data) {
    return { error: workingHours.error ?? "El horario semanal es inválido." }
  }

  const categoryRates = parseCategoryRates(payload.categoryRates)

  if (categoryRates.error || !categoryRates.data) {
    return { error: categoryRates.error ?? "Los porcentajes por categoría son inválidos." }
  }

  return {
    data: {
      fullName,
      role: normalizeOptionalText(payload.role),
      email: normalizeOptionalText(payload.email),
      phone: normalizeOptionalText(payload.phone),
      employeeCode,
      bio: normalizeOptionalText(payload.bio),
      joinDate: normalizeOptionalText(payload.joinDate),
      isActive: typeof payload.isActive === "boolean" ? payload.isActive : true,
      compensationType,
      hourlyRate,
      assignedServiceIds,
      workingHours: workingHours.data,
      categoryRates: categoryRates.data,
    },
  }
}

export function parseEmployeeStatusPayload(payload: Pick<EmployeePayload, "isActive">) {
  if (typeof payload.isActive !== "boolean") {
    return { error: "El estado activo debe ser booleano." }
  }

  return { isActive: payload.isActive }
}

export async function validateAssignedServices(context: ManagedBusinessContext, serviceIds: string[]) {
  if (serviceIds.length === 0) {
    return { data: [] as string[] }
  }

  const { data, error } = await context.supabase
    .from("services")
    .select("id")
    .eq("business_id", context.business.id)
    .in("id", serviceIds)

  if (error) {
    return { error: "No se pudieron validar los servicios asignados." }
  }

  const validServiceIds = (data ?? []).map((service) => service.id)

  if (validServiceIds.length !== serviceIds.length) {
    return { error: "Hay servicios asignados que no existen o no pertenecen al negocio." }
  }

  return { data: validServiceIds }
}

export async function syncEmployeeRelations(context: ManagedBusinessContext, staffMemberId: string, payload: ParsedEmployeePayload) {
  const timestamp = new Date().toISOString()

  const { error: workingHoursError } = await context.supabase.from("staff_member_working_hours").upsert(
    payload.workingHours.map((day) => ({
      staff_member_id: staffMemberId,
      day_of_week: day.dayOfWeek,
      start_time: day.startTime,
      end_time: day.endTime,
      is_active: day.isActive,
    })),
    { onConflict: "staff_member_id,day_of_week" },
  )

  if (workingHoursError) {
    return { error: "No se pudo guardar el horario semanal del profesional." }
  }

  const { error: assignmentsDeleteError } = await context.supabase
    .from("staff_member_services")
    .delete()
    .eq("staff_member_id", staffMemberId)

  if (assignmentsDeleteError) {
    return { error: "No se pudieron actualizar los servicios asignados del profesional." }
  }

  if (payload.assignedServiceIds.length > 0) {
    const { error: assignmentsInsertError } = await context.supabase.from("staff_member_services").insert(
      payload.assignedServiceIds.map((serviceId) => ({
        staff_member_id: staffMemberId,
        service_id: serviceId,
      })),
    )

    if (assignmentsInsertError) {
      return { error: "No se pudieron guardar los servicios asignados del profesional." }
    }
  }

  const { error: categoryRatesError } = await context.supabase.from("staff_member_category_rates").upsert(
    SERVICE_CATEGORIES.map((category) => ({
      staff_member_id: staffMemberId,
      service_category: category,
      percentage: payload.categoryRates[category],
      updated_at: timestamp,
    })),
    { onConflict: "staff_member_id,service_category" },
  )

  if (categoryRatesError) {
    return {
      error:
        categoryRatesError.code === "PGRST205"
          ? "Falta aplicar la última versión de schema.sql en Supabase para guardar los porcentajes por categoría."
          : "No se pudieron guardar los porcentajes por categoría del profesional.",
    }
  }

  return { data: true as const }
}

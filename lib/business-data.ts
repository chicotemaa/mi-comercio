import "server-only"

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin"
import type {
  AppointmentRecord,
  AppointmentStatus,
  BookingChannel,
  BookingSettingsRecord,
  BusinessHourRecord,
  BusinessRecord,
  CustomerRecord,
  ExpenseRecord,
  PaymentRecord,
  PaymentStatus,
  PayoutRecord,
  ServiceRecord,
  ServicePriceVariantRecord,
  StaffRecord,
  StaffTimeLogRecord,
} from "@/lib/business-shared"
import {
  createDefaultBookingSettings,
  createDefaultBusinessHours,
  getBusinessDayLabel,
} from "@/lib/business-shared"

export interface BusinessDataBundle {
  business: BusinessRecord
  services: ServiceRecord[]
  staffMembers: StaffRecord[]
  appointments: AppointmentRecord[]
  isLive: boolean
}

export interface BusinessOperationsBundle {
  business: BusinessRecord
  customers: CustomerRecord[]
  payments: PaymentRecord[]
  expenses: ExpenseRecord[]
  payouts: PayoutRecord[]
  staffTimeLogs: StaffTimeLogRecord[]
  servicePriceVariants: ServicePriceVariantRecord[]
  isLive: boolean
}

export interface BusinessScheduleBundle {
  business: BusinessRecord
  businessHours: BusinessHourRecord[]
  bookingSettings: BookingSettingsRecord
  isLive: boolean
}

interface SupabaseBusinessRow {
  id: string
  name: string
  slug: string
  description: string | null
  time_zone: string | null
}

interface SupabaseServiceRow {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number | string
  is_active: boolean
  category: ServiceRecord["category"]
}

interface SupabaseStaffRow {
  id: string
  full_name: string
  role: string | null
  email: string | null
  phone: string | null
  is_active: boolean
  employee_code?: string | null
  hourly_rate?: number | string | null
}

interface SupabaseAppointmentRow {
  id: string
  customer_name: string
  customer_contact: string
  customer_email: string | null
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  channel: BookingChannel
  service_id: string | null
  service_name_snapshot: string
  staff_member_id: string | null
  staff_name_snapshot: string | null
  price_snapshot: number | string
  duration_snapshot: number
  notes: string | null
  created_at: string
}

interface SupabaseCustomerRow {
  id: string
  full_name: string
  primary_contact: string
  email: string | null
  phone: string | null
  status: CustomerRecord["status"]
  preferred_services: string[] | null
  notes: string | null
  last_visit_at: string | null
  total_appointments: number
  total_spent: number | string
  joined_at: string
}

interface SupabasePaymentRelationRow {
  full_name?: string | null
  name?: string | null
  number?: string | null
}

interface SupabasePaymentRow {
  id: string
  description: string
  amount: number | string
  method: PaymentRecord["method"]
  status: PaymentStatus
  processed_at: string | null
  created_at: string
  notes: string | null
  customer: SupabasePaymentRelationRow | SupabasePaymentRelationRow[] | null
  staff_member: SupabasePaymentRelationRow | SupabasePaymentRelationRow[] | null
  invoice: SupabasePaymentRelationRow | SupabasePaymentRelationRow[] | null
}

interface SupabaseExpenseRow {
  id: string
  expense_date: string
  category: string
  subcategory: string | null
  description: string
  vendor_name: string | null
  amount: number | string
  method: ExpenseRecord["method"]
  source: string
  notes: string | null
}

interface SupabasePayoutRow {
  id: string
  payout_date: string
  recipient_name: string
  recipient_type: string
  category: string
  amount: number | string
  method: PayoutRecord["method"]
  source: string
  notes: string | null
  staff_member_id: string | null
  staff_member: SupabasePaymentRelationRow | SupabasePaymentRelationRow[] | null
}

interface SupabaseStaffTimeLogRow {
  id: string
  staff_member_id: string
  work_date: string
  start_time: string | null
  end_time: string | null
  hours_worked: number | string
  entry_type: string
  source: string
  notes: string | null
  staff_member: SupabasePaymentRelationRow | SupabasePaymentRelationRow[] | null
}

interface SupabaseServicePriceVariantRow {
  id: string
  service_id: string
  variant_name: string
  variant_code: string | null
  price: number | string
  duration_minutes: number
  is_default: boolean
  is_active: boolean
  display_order: number
  notes: string | null
  service: SupabasePaymentRelationRow | SupabasePaymentRelationRow[] | null
}

interface SupabaseBusinessHourRow {
  id: string
  day_of_week: number
  label: string
  open_time: string | null
  close_time: string | null
  is_open: boolean
}

interface SupabaseBookingSettingsRow {
  id: string
  slot_interval_minutes: number
  lead_time_minutes: number
  max_booking_days_in_advance: number
  buffer_between_appointments_minutes: number
}

function addDays(baseDate: Date, days: number) {
  const date = new Date(baseDate)
  date.setDate(date.getDate() + days)
  return date
}

function formatDateForSql(date: Date) {
  return date.toISOString().slice(0, 10)
}

function createDemoBundle(): BusinessDataBundle {
  const today = new Date()
  const tomorrow = addDays(today, 1)
  const dayAfterTomorrow = addDays(today, 2)

  const business: BusinessRecord = {
    id: "demo-business",
    name: "Nerea Aylen Barber",
    slug: "nerea-aylen-barber",
    description: "Barberia conectada en modo demo hasta configurar Supabase.",
    timeZone: "America/Argentina/Cordoba",
  }

  const services: ServiceRecord[] = [
    {
      id: "service-fade",
      name: "Fade / degrade",
      description: "Laterales prolijos y volumen trabajado arriba.",
      durationMinutes: 45,
      price: 18000,
      isActive: true,
      category: "corte",
    },
    {
      id: "service-barba",
      name: "Perfilado de barba",
      description: "Lineas, contornos y terminacion natural.",
      durationMinutes: 30,
      price: 12000,
      isActive: true,
      category: "corte",
    },
    {
      id: "service-combo",
      name: "Combo corte + barba",
      description: "Servicio completo para resolver el turno en una sola visita.",
      durationMinutes: 60,
      price: 26000,
      isActive: true,
      category: "corte",
    },
  ]

  const staffMembers: StaffRecord[] = [
    {
      id: "staff-nerea",
      fullName: "Nerea Aylen",
      role: "Barbera principal",
      email: "nerea@demo.local",
      phone: "+54 362 400-0000",
      isActive: true,
    },
  ]

  const appointments: AppointmentRecord[] = [
    {
      id: "apt-1",
      customerName: "Lucas Ferreyra",
      customerContact: "+54 362 455-0011",
      customerEmail: "lucas@email.com",
      appointmentDate: formatDateForSql(today),
      appointmentTime: "11:00:00",
      status: "confirmed",
      channel: "website",
      serviceId: services[0].id,
      serviceName: services[0].name,
      staffMemberId: staffMembers[0].id,
      staffName: staffMembers[0].fullName,
      price: services[0].price,
      durationMinutes: services[0].durationMinutes,
      notes: "Primer turno desde la web.",
      createdAt: new Date(today.getTime() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "apt-2",
      customerName: "Bruno Sosa",
      customerContact: "@brunososa",
      customerEmail: null,
      appointmentDate: formatDateForSql(today),
      appointmentTime: "14:30:00",
      status: "pending",
      channel: "instagram",
      serviceId: services[1].id,
      serviceName: services[1].name,
      staffMemberId: staffMembers[0].id,
      staffName: staffMembers[0].fullName,
      price: services[1].price,
      durationMinutes: services[1].durationMinutes,
      notes: null,
      createdAt: new Date(today.getTime() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "apt-3",
      customerName: "Matias Vera",
      customerContact: "+54 362 455-8899",
      customerEmail: null,
      appointmentDate: formatDateForSql(tomorrow),
      appointmentTime: "17:30:00",
      status: "confirmed",
      channel: "website",
      serviceId: services[2].id,
      serviceName: services[2].name,
      staffMemberId: staffMembers[0].id,
      staffName: staffMembers[0].fullName,
      price: services[2].price,
      durationMinutes: services[2].durationMinutes,
      notes: null,
      createdAt: new Date(today.getTime() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "apt-4",
      customerName: "Ivan Lezcano",
      customerContact: "+54 362 411-7722",
      customerEmail: "ivan@email.com",
      appointmentDate: formatDateForSql(dayAfterTomorrow),
      appointmentTime: "20:30:00",
      status: "pending",
      channel: "website",
      serviceId: services[0].id,
      serviceName: services[0].name,
      staffMemberId: staffMembers[0].id,
      staffName: staffMembers[0].fullName,
      price: services[0].price,
      durationMinutes: services[0].durationMinutes,
      notes: "Pidio confirmar por WhatsApp.",
      createdAt: new Date().toISOString(),
    },
  ]

  return {
    business,
    services,
    staffMembers,
    appointments,
    isLive: false,
  }
}

function createDemoOperationsBundle(): BusinessOperationsBundle {
  const demoBundle = createDemoBundle()
  const customers: CustomerRecord[] = [
    {
      id: "customer-lucas",
      fullName: "Lucas Ferreyra",
      primaryContact: "+54 362 455-0011",
      email: "lucas@email.com",
      phone: "+54 362 455-0011",
      status: "active",
      preferredServices: ["Fade / degrade"],
      notes: "Cliente demo generado para el backoffice.",
      lastVisitAt: demoBundle.appointments[0]?.appointmentDate ?? null,
      totalAppointments: 1,
      totalSpent: 18000,
      joinedAt: demoBundle.appointments[0]?.createdAt ?? new Date().toISOString(),
    },
    {
      id: "customer-bruno",
      fullName: "Bruno Sosa",
      primaryContact: "@brunososa",
      email: null,
      phone: null,
      status: "lead",
      preferredServices: ["Perfilado de barba"],
      notes: "Consulta habitual por Instagram.",
      lastVisitAt: null,
      totalAppointments: 0,
      totalSpent: 0,
      joinedAt: new Date().toISOString(),
    },
  ]

  const payments: PaymentRecord[] = [
    {
      id: "payment-demo-1",
      description: "Seña web - Fade / degrade",
      amount: 18000,
      method: "transfer",
      status: "completed",
      customerName: customers[0].fullName,
      staffName: demoBundle.staffMembers[0]?.fullName ?? null,
      invoiceNumber: null,
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notes: "Pago demo asociado a una reserva confirmada.",
    },
  ]

  const expenses: ExpenseRecord[] = [
    {
      id: "expense-demo-1",
      expenseDate: new Date().toISOString().slice(0, 10),
      category: "Insumos",
      subcategory: "Barbería",
      description: "Reposición de hojas y productos básicos.",
      vendorName: "Proveedor demo",
      amount: 22000,
      method: "cash",
      source: "manual",
      notes: null,
    },
  ]

  const payouts: PayoutRecord[] = [
    {
      id: "payout-demo-1",
      payoutDate: new Date().toISOString().slice(0, 10),
      recipientName: "Nerea Aylen",
      recipientType: "staff",
      category: "honorarios",
      staffMemberId: demoBundle.staffMembers[0]?.id ?? null,
      staffName: demoBundle.staffMembers[0]?.fullName ?? null,
      amount: 35000,
      method: "transfer",
      source: "manual",
      notes: "Cierre demo del módulo de distribuciones.",
    },
  ]

  const staffTimeLogs: StaffTimeLogRecord[] = [
    {
      id: "time-log-demo-1",
      staffMemberId: demoBundle.staffMembers[0]?.id ?? "staff-nerea",
      staffName: demoBundle.staffMembers[0]?.fullName ?? "Nerea Aylen",
      workDate: new Date().toISOString().slice(0, 10),
      startTime: "11:00:00",
      endTime: "19:30:00",
      hoursWorked: 8.5,
      entryType: "shift",
      source: "manual",
      notes: "Jornada demo.",
    },
  ]

  const servicePriceVariants: ServicePriceVariantRecord[] = demoBundle.services.map((service) => ({
    id: `variant-${service.id}`,
    serviceId: service.id,
    serviceName: service.name,
    variantName: "Base",
    variantCode: "base",
    price: service.price,
    durationMinutes: service.durationMinutes,
    isDefault: true,
    isActive: service.isActive,
    displayOrder: 1,
    notes: "Variante demo construida desde el servicio base.",
  }))

  return {
    business: demoBundle.business,
    customers,
    payments,
    expenses,
    payouts,
    staffTimeLogs,
    servicePriceVariants,
    isLive: false,
  }
}

function createDemoScheduleBundle(): BusinessScheduleBundle {
  const demoBundle = createDemoBundle()

  return {
    business: demoBundle.business,
    businessHours: createDefaultBusinessHours(),
    bookingSettings: createDefaultBookingSettings(),
    isLive: false,
  }
}

function pickSingleRelation<T>(value: T | T[] | null) {
  if (!value) {
    return null
  }

  return Array.isArray(value) ? value[0] ?? null : value
}

function mapBusiness(row: SupabaseBusinessRow): BusinessRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    timeZone: row.time_zone ?? "America/Argentina/Cordoba",
  }
}

function mapService(row: SupabaseServiceRow): ServiceRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    price: Number(row.price),
    isActive: row.is_active,
    category: row.category,
  }
}

function mapStaff(row: SupabaseStaffRow): StaffRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    role: row.role,
    email: row.email,
    phone: row.phone,
    isActive: row.is_active,
    employeeCode: row.employee_code ?? null,
    hourlyRate: Number(row.hourly_rate ?? 0),
  }
}

function mapAppointment(row: SupabaseAppointmentRow): AppointmentRecord {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerContact: row.customer_contact,
    customerEmail: row.customer_email,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    status: row.status,
    channel: row.channel,
    serviceId: row.service_id,
    serviceName: row.service_name_snapshot,
    staffMemberId: row.staff_member_id,
    staffName: row.staff_name_snapshot,
    price: Number(row.price_snapshot),
    durationMinutes: row.duration_snapshot,
    notes: row.notes,
    createdAt: row.created_at,
  }
}

function mapCustomer(row: SupabaseCustomerRow): CustomerRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    primaryContact: row.primary_contact,
    email: row.email,
    phone: row.phone,
    status: row.status,
    preferredServices: row.preferred_services ?? [],
    notes: row.notes,
    lastVisitAt: row.last_visit_at,
    totalAppointments: row.total_appointments,
    totalSpent: Number(row.total_spent),
    joinedAt: row.joined_at,
  }
}

function mapPayment(row: SupabasePaymentRow): PaymentRecord {
  const customer = pickSingleRelation(row.customer)
  const staffMember = pickSingleRelation(row.staff_member)
  const invoice = pickSingleRelation(row.invoice)

  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    method: row.method,
    status: row.status,
    customerName: typeof customer?.full_name === "string" ? customer.full_name : null,
    staffName: typeof staffMember?.full_name === "string" ? staffMember.full_name : null,
    invoiceNumber: typeof invoice?.number === "string" ? invoice.number : null,
    processedAt: row.processed_at,
    createdAt: row.created_at,
    notes: row.notes,
  }
}

function mapExpense(row: SupabaseExpenseRow): ExpenseRecord {
  return {
    id: row.id,
    expenseDate: row.expense_date,
    category: row.category,
    subcategory: row.subcategory,
    description: row.description,
    vendorName: row.vendor_name,
    amount: Number(row.amount),
    method: row.method,
    source: row.source,
    notes: row.notes,
  }
}

function mapPayout(row: SupabasePayoutRow): PayoutRecord {
  const staffMember = pickSingleRelation(row.staff_member)

  return {
    id: row.id,
    payoutDate: row.payout_date,
    recipientName: row.recipient_name,
    recipientType: row.recipient_type,
    category: row.category,
    staffMemberId: row.staff_member_id,
    staffName: typeof staffMember?.full_name === "string" ? staffMember.full_name : null,
    amount: Number(row.amount),
    method: row.method,
    source: row.source,
    notes: row.notes,
  }
}

function mapStaffTimeLog(row: SupabaseStaffTimeLogRow): StaffTimeLogRecord {
  const staffMember = pickSingleRelation(row.staff_member)

  return {
    id: row.id,
    staffMemberId: row.staff_member_id,
    staffName: typeof staffMember?.full_name === "string" ? staffMember.full_name : null,
    workDate: row.work_date,
    startTime: row.start_time,
    endTime: row.end_time,
    hoursWorked: Number(row.hours_worked),
    entryType: row.entry_type,
    source: row.source,
    notes: row.notes,
  }
}

function mapServicePriceVariant(row: SupabaseServicePriceVariantRow): ServicePriceVariantRecord {
  const service = pickSingleRelation(row.service)

  return {
    id: row.id,
    serviceId: row.service_id,
    serviceName: typeof service?.name === "string" ? service.name : null,
    variantName: row.variant_name,
    variantCode: row.variant_code,
    price: Number(row.price),
    durationMinutes: row.duration_minutes,
    isDefault: row.is_default,
    isActive: row.is_active,
    displayOrder: row.display_order,
    notes: row.notes,
  }
}

function mapBusinessHour(row: SupabaseBusinessHourRow): BusinessHourRecord {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    label: row.label || getBusinessDayLabel(row.day_of_week),
    openTime: row.open_time,
    closeTime: row.close_time,
    isOpen: row.is_open,
  }
}

function mapBookingSettings(row: SupabaseBookingSettingsRow): BookingSettingsRecord {
  return {
    id: row.id,
    slotIntervalMinutes: row.slot_interval_minutes,
    leadTimeMinutes: row.lead_time_minutes,
    maxBookingDaysInAdvance: row.max_booking_days_in_advance,
    bufferBetweenAppointmentsMinutes: row.buffer_between_appointments_minutes,
  }
}

function mergeBusinessHours(rows: BusinessHourRecord[]) {
  const defaults = createDefaultBusinessHours()
  const byDay = new Map(rows.map((row) => [row.dayOfWeek, row]))

  return defaults.map((defaultRow) => byDay.get(defaultRow.dayOfWeek) ?? defaultRow)
}

export async function getBusinessDataBundle(): Promise<BusinessDataBundle> {
  const businessSlug = process.env.BUSINESS_SLUG

  if (!businessSlug || !hasSupabaseAdminConfig()) {
    return createDemoBundle()
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return createDemoBundle()
  }

  try {
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, slug, description, time_zone")
      .eq("slug", businessSlug)
      .maybeSingle()

    if (businessError || !business) {
      console.error("Supabase business lookup failed", businessError)
      return createDemoBundle()
    }

    const [{ data: services, error: servicesError }, { data: staffMembers, error: staffError }, { data: appointments, error: appointmentsError }] =
      await Promise.all([
        supabase
          .from("services")
          .select("id, name, description, duration_minutes, price, is_active, category")
          .eq("business_id", business.id)
          .order("display_order", { ascending: true }),
        supabase
          .from("staff_members")
          .select("id, full_name, role, email, phone, is_active")
          .eq("business_id", business.id)
          .order("display_order", { ascending: true }),
        supabase
          .from("appointments")
          .select(
            "id, customer_name, customer_contact, customer_email, appointment_date, appointment_time, status, channel, service_id, service_name_snapshot, staff_member_id, staff_name_snapshot, price_snapshot, duration_snapshot, notes, created_at",
          )
          .eq("business_id", business.id)
          .order("appointment_date", { ascending: true })
          .order("appointment_time", { ascending: true }),
      ])

    if (servicesError || staffError || appointmentsError) {
      console.error("Supabase bundle lookup failed", {
        servicesError,
        staffError,
        appointmentsError,
      })
      return createDemoBundle()
    }

    return {
      business: mapBusiness(business as SupabaseBusinessRow),
      services: (services as SupabaseServiceRow[] | null)?.map(mapService) ?? [],
      staffMembers: (staffMembers as SupabaseStaffRow[] | null)?.map(mapStaff) ?? [],
      appointments: (appointments as SupabaseAppointmentRow[] | null)?.map(mapAppointment) ?? [],
      isLive: true,
    }
  } catch (error) {
    console.error("Supabase bundle lookup crashed", error)
    return createDemoBundle()
  }
}

export async function getBusinessOperationsBundle(): Promise<BusinessOperationsBundle> {
  const businessSlug = process.env.BUSINESS_SLUG

  if (!businessSlug || !hasSupabaseAdminConfig()) {
    return createDemoOperationsBundle()
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return createDemoOperationsBundle()
  }

  try {
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, slug, description, time_zone")
      .eq("slug", businessSlug)
      .maybeSingle()

    if (businessError || !business) {
      console.error("Supabase business lookup for operations failed", businessError)
      return createDemoOperationsBundle()
    }

    const [
      { data: customers, error: customersError },
      { data: payments, error: paymentsError },
      { data: expenses, error: expensesError },
      { data: payouts, error: payoutsError },
      { data: staffTimeLogs, error: staffTimeLogsError },
      { data: services, error: servicesError },
    ] = await Promise.all([
      supabase
        .from("customers")
        .select(
          "id, full_name, primary_contact, email, phone, status, preferred_services, notes, last_visit_at, total_appointments, total_spent, joined_at",
        )
        .eq("business_id", business.id)
        .order("total_spent", { ascending: false }),
      supabase
        .from("payments")
        .select(
          "id, description, amount, method, status, processed_at, created_at, notes, customer:customers(full_name), staff_member:staff_members(full_name), invoice:invoices(number)",
        )
        .eq("business_id", business.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("expenses")
        .select("id, expense_date, category, subcategory, description, vendor_name, amount, method, source, notes")
        .eq("business_id", business.id)
        .order("expense_date", { ascending: false }),
      supabase
        .from("payouts")
        .select(
          "id, payout_date, recipient_name, recipient_type, category, amount, method, source, notes, staff_member_id, staff_member:staff_members(full_name)",
        )
        .eq("business_id", business.id)
        .order("payout_date", { ascending: false }),
      supabase
        .from("staff_time_logs")
        .select(
          "id, staff_member_id, work_date, start_time, end_time, hours_worked, entry_type, source, notes, staff_member:staff_members(full_name)",
        )
        .eq("business_id", business.id)
        .order("work_date", { ascending: false }),
      supabase.from("services").select("id, name").eq("business_id", business.id).order("display_order", { ascending: true }),
    ])

    if (customersError || paymentsError || expensesError || payoutsError || staffTimeLogsError || servicesError) {
      console.error("Supabase operations lookup failed", {
        customersError,
        paymentsError,
        expensesError,
        payoutsError,
        staffTimeLogsError,
        servicesError,
      })
      return createDemoOperationsBundle()
    }

    const serviceIds = (services ?? []).map((service) => service.id)
    let servicePriceVariants: SupabaseServicePriceVariantRow[] | null = []

    if (serviceIds.length > 0) {
      const { data: variants, error: variantsError } = await supabase
        .from("service_price_variants")
        .select(
          "id, service_id, variant_name, variant_code, price, duration_minutes, is_default, is_active, display_order, notes, service:services(name)",
        )
        .in("service_id", serviceIds)
        .order("display_order", { ascending: true })

      if (variantsError) {
        console.error("Supabase service price variants lookup failed", variantsError)
        return createDemoOperationsBundle()
      }

      servicePriceVariants = variants as SupabaseServicePriceVariantRow[] | null
    }

    return {
      business: mapBusiness(business as SupabaseBusinessRow),
      customers: (customers as SupabaseCustomerRow[] | null)?.map(mapCustomer) ?? [],
      payments: (payments as SupabasePaymentRow[] | null)?.map(mapPayment) ?? [],
      expenses: (expenses as SupabaseExpenseRow[] | null)?.map(mapExpense) ?? [],
      payouts: (payouts as SupabasePayoutRow[] | null)?.map(mapPayout) ?? [],
      staffTimeLogs: (staffTimeLogs as SupabaseStaffTimeLogRow[] | null)?.map(mapStaffTimeLog) ?? [],
      servicePriceVariants: (servicePriceVariants ?? []).map(mapServicePriceVariant),
      isLive: true,
    }
  } catch (error) {
    console.error("Supabase operations lookup crashed", error)
    return createDemoOperationsBundle()
  }
}

export async function getBusinessScheduleBundle(): Promise<BusinessScheduleBundle> {
  const businessSlug = process.env.BUSINESS_SLUG

  if (!businessSlug || !hasSupabaseAdminConfig()) {
    return createDemoScheduleBundle()
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return createDemoScheduleBundle()
  }

  try {
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, name, slug, description, time_zone")
      .eq("slug", businessSlug)
      .maybeSingle()

    if (businessError || !business) {
      console.error("Supabase business lookup for schedule failed", businessError)
      return createDemoScheduleBundle()
    }

    const [{ data: businessHours, error: businessHoursError }, { data: bookingSettings, error: bookingSettingsError }] =
      await Promise.all([
        supabase
          .from("business_hours")
          .select("id, day_of_week, label, open_time, close_time, is_open")
          .eq("business_id", business.id)
          .order("day_of_week", { ascending: true }),
        supabase
          .from("booking_settings")
          .select(
            "id, slot_interval_minutes, lead_time_minutes, max_booking_days_in_advance, buffer_between_appointments_minutes",
          )
          .eq("business_id", business.id)
          .maybeSingle(),
      ])

    const isBookingSettingsMissing = bookingSettingsError?.code === "PGRST205"

    if (businessHoursError || (bookingSettingsError && !isBookingSettingsMissing)) {
      console.error("Supabase schedule lookup failed", {
        businessHoursError,
        bookingSettingsError,
      })
      return createDemoScheduleBundle()
    }

    if (isBookingSettingsMissing) {
      console.warn("Supabase booking settings table is missing. Falling back to default booking settings.")
    }

    return {
      business: mapBusiness(business as SupabaseBusinessRow),
      businessHours: mergeBusinessHours((businessHours as SupabaseBusinessHourRow[] | null)?.map(mapBusinessHour) ?? []),
      bookingSettings: bookingSettings && !isBookingSettingsMissing
        ? mapBookingSettings(bookingSettings as SupabaseBookingSettingsRow)
        : createDefaultBookingSettings(),
      isLive: true,
    }
  } catch (error) {
    console.error("Supabase schedule lookup crashed", error)
    return createDemoScheduleBundle()
  }
}

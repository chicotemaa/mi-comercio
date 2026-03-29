import "server-only"

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin"
import type {
  AppointmentRecord,
  AppointmentStatus,
  BookingChannel,
  BusinessRecord,
  ServiceRecord,
  StaffRecord,
} from "@/lib/business-shared"

export interface BusinessDataBundle {
  business: BusinessRecord
  services: ServiceRecord[]
  staffMembers: StaffRecord[]
  appointments: AppointmentRecord[]
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
}

interface SupabaseStaffRow {
  id: string
  full_name: string
  role: string | null
  email: string | null
  phone: string | null
  is_active: boolean
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
    },
    {
      id: "service-barba",
      name: "Perfilado de barba",
      description: "Lineas, contornos y terminacion natural.",
      durationMinutes: 30,
      price: 12000,
      isActive: true,
    },
    {
      id: "service-combo",
      name: "Combo corte + barba",
      description: "Servicio completo para resolver el turno en una sola visita.",
      durationMinutes: 60,
      price: 26000,
      isActive: true,
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
          .select("id, name, description, duration_minutes, price, is_active")
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

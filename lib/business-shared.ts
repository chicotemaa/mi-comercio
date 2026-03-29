export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed"
export type BookingChannel = "website" | "whatsapp" | "instagram" | "manual"

export interface BusinessRecord {
  id: string
  name: string
  slug: string
  description: string | null
  timeZone: string
}

export interface ServiceRecord {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
}

export interface StaffRecord {
  id: string
  fullName: string
  role: string | null
  email: string | null
  phone: string | null
  isActive: boolean
}

export interface AppointmentRecord {
  id: string
  customerName: string
  customerContact: string
  customerEmail: string | null
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  channel: BookingChannel
  serviceId: string | null
  serviceName: string
  staffMemberId: string | null
  staffName: string | null
  price: number
  durationMinutes: number
  notes: string | null
  createdAt: string
}

export function getDateKeyInTimeZone(timeZone: string, date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatAppointmentDate(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeZone,
  }).format(new Date(`${value}T12:00:00`))
}

export function formatAppointmentTime(value: string) {
  return value.slice(0, 5)
}

export function getStatusLabel(status: AppointmentStatus) {
  switch (status) {
    case "pending":
      return "Pendiente"
    case "confirmed":
      return "Confirmada"
    case "cancelled":
      return "Cancelada"
    case "completed":
      return "Completada"
    default:
      return status
  }
}

export function getStatusBadgeClassName(status: AppointmentStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-900"
    case "confirmed":
      return "bg-emerald-100 text-emerald-900"
    case "cancelled":
      return "bg-rose-100 text-rose-900"
    case "completed":
      return "bg-sky-100 text-sky-900"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

export function getChannelLabel(channel: BookingChannel) {
  switch (channel) {
    case "website":
      return "Web"
    case "whatsapp":
      return "WhatsApp"
    case "instagram":
      return "Instagram"
    case "manual":
      return "Manual"
    default:
      return channel
  }
}

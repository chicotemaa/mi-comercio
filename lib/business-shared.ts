export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed"
export type BookingChannel = "website" | "whatsapp" | "instagram" | "manual"
export type CustomerStatus = "active" | "inactive" | "vip" | "lead"
export type PaymentMethod = "cash" | "card" | "transfer" | "mercado_pago" | "other"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"
export type ServiceCategory = "corte" | "coloraciones" | "tratamiento"

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
  category: ServiceCategory | null
}

export interface StaffRecord {
  id: string
  fullName: string
  role: string | null
  email: string | null
  phone: string | null
  isActive: boolean
  employeeCode?: string | null
  hourlyRate?: number
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

export interface CustomerRecord {
  id: string
  fullName: string
  primaryContact: string
  email: string | null
  phone: string | null
  status: CustomerStatus
  preferredServices: string[]
  notes: string | null
  lastVisitAt: string | null
  totalAppointments: number
  totalSpent: number
  joinedAt: string
}

export interface PaymentRecord {
  id: string
  description: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  customerName: string | null
  staffName: string | null
  invoiceNumber: string | null
  processedAt: string | null
  createdAt: string
  notes: string | null
}

export interface ExpenseRecord {
  id: string
  expenseDate: string
  category: string
  subcategory: string | null
  description: string
  vendorName: string | null
  amount: number
  method: PaymentMethod
  source: string
  notes: string | null
}

export interface PayoutRecord {
  id: string
  payoutDate: string
  recipientName: string
  recipientType: string
  category: string
  staffMemberId: string | null
  staffName: string | null
  amount: number
  method: PaymentMethod
  source: string
  notes: string | null
}

export interface StaffTimeLogRecord {
  id: string
  staffMemberId: string
  staffName: string | null
  workDate: string
  startTime: string | null
  endTime: string | null
  hoursWorked: number
  entryType: string
  source: string
  notes: string | null
}

export interface ServicePriceVariantRecord {
  id: string
  serviceId: string
  serviceName: string | null
  variantName: string
  variantCode: string | null
  price: number
  durationMinutes: number
  isDefault: boolean
  isActive: boolean
  displayOrder: number
  notes: string | null
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

export function getPaymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "cash":
      return "Efectivo"
    case "card":
      return "Tarjeta"
    case "transfer":
      return "Transferencia"
    case "mercado_pago":
      return "Mercado Pago"
    case "other":
      return "Otro"
    default:
      return method
  }
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  switch (status) {
    case "pending":
      return "Pendiente"
    case "completed":
      return "Completado"
    case "failed":
      return "Fallido"
    case "refunded":
      return "Reintegrado"
    default:
      return status
  }
}

export function getPaymentStatusBadgeClassName(status: PaymentStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-900"
    case "completed":
      return "bg-emerald-100 text-emerald-900"
    case "failed":
      return "bg-rose-100 text-rose-900"
    case "refunded":
      return "bg-slate-200 text-slate-900"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

export function getCustomerStatusLabel(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "Activo"
    case "inactive":
      return "Inactivo"
    case "vip":
      return "VIP"
    case "lead":
      return "Lead"
    default:
      return status
  }
}

export function getCustomerStatusBadgeClassName(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-900"
    case "inactive":
      return "bg-slate-100 text-slate-800"
    case "vip":
      return "bg-fuchsia-100 text-fuchsia-900"
    case "lead":
      return "bg-sky-100 text-sky-900"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

export function formatDisplayDate(value: string | null, timeZone: string) {
  if (!value) {
    return "Sin dato"
  }

  const date = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`)

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeZone,
  }).format(date)
}

export function getServiceCategoryLabel(category: ServiceCategory | null) {
  switch (category) {
    case "corte":
      return "Corte"
    case "coloraciones":
      return "Coloraciones"
    case "tratamiento":
      return "Tratamiento"
    default:
      return "Sin categoría"
  }
}

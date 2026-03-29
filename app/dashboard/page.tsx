import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatCurrency,
  getChannelLabel,
  getDateKeyInTimeZone,
  getStatusBadgeClassName,
  getStatusLabel,
} from "@/lib/business-shared"
import { getBusinessDataBundle } from "@/lib/business-data"
import { Calendar, Clock3, DollarSign, Scissors, Users } from "lucide-react"

function getShortWeekdayLabel(dateValue: string, timeZone: string) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    timeZone,
  }).format(new Date(`${dateValue}T12:00:00`))
}

function getDateKeyOffset(baseDate: Date, offset: number) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + offset)
  return nextDate.toISOString().slice(0, 10)
}

export default async function DashboardPage() {
  const { business, appointments, services, staffMembers, isLive } = await getBusinessDataBundle()
  const today = new Date()
  const todayKey = getDateKeyInTimeZone(business.timeZone, today)
  const upcomingAppointments = appointments.filter((appointment) => appointment.appointmentDate >= todayKey)
  const todaysAppointments = appointments.filter((appointment) => appointment.appointmentDate === todayKey)
  const pendingAppointments = appointments.filter((appointment) => appointment.status === "pending")
  const todaysRevenue = todaysAppointments
    .filter((appointment) => appointment.status === "confirmed" || appointment.status === "completed")
    .reduce((total, appointment) => total + appointment.price, 0)
  const activeServices = services.filter((service) => service.isActive).length

  const weeklyAppointments = Array.from({ length: 7 }, (_, index) => {
    const dateKey = getDateKeyOffset(today, index)
    return {
      dateKey,
      label: getShortWeekdayLabel(dateKey, business.timeZone),
      appointments: appointments.filter((appointment) => appointment.appointmentDate === dateKey).length,
    }
  })

  const maxWeeklyAppointments = Math.max(...weeklyAppointments.map((entry) => entry.appointments), 1)
  const popularServices = services
    .map((service) => ({
      ...service,
      bookings: appointments.filter((appointment) => appointment.serviceId === service.id).length,
    }))
    .sort((left, right) => right.bookings - left.bookings)
    .slice(0, 3)

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Panel del negocio</p>
          <h1 className="text-3xl font-bold text-slate-900">{business.name}</h1>
          <p className="text-slate-600">
            {isLive
              ? "Datos en vivo desde Supabase compartidos con ns-barber."
              : "Modo demo activo. Configura Supabase para ver reservas reales."}
          </p>
        </div>
        <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
          {isLive ? "Conectado a Supabase" : "Modo demo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas de hoy</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{todaysAppointments.length}</div>
            <p className="text-sm text-slate-600">{formatAppointmentDate(todayKey, business.timeZone)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos confirmados</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(todaysRevenue)}</div>
            <p className="text-sm text-slate-600">Solo citas confirmadas o completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock3 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{pendingAppointments.length}</div>
            <p className="text-sm text-slate-600">Reservas esperando confirmacion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalogo activo</CardTitle>
            <Scissors className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeServices}</div>
            <p className="text-sm text-slate-600">
              {staffMembers.length} {staffMembers.length === 1 ? "profesional" : "profesionales"} disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Proximas citas</CardTitle>
            <CardDescription>Las siguientes reservas creadas desde web, redes o carga manual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.slice(0, 6).map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{appointment.customerName}</p>
                    <Badge className={getStatusBadgeClassName(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {appointment.serviceName}
                    {appointment.staffName ? ` con ${appointment.staffName}` : ""}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatAppointmentDate(appointment.appointmentDate, business.timeZone)} a las{" "}
                    {formatAppointmentTime(appointment.appointmentTime)}
                  </p>
                </div>
                <div className="text-sm text-slate-500 lg:text-right">
                  <p>{appointment.customerContact}</p>
                  <p>{getChannelLabel(appointment.channel)}</p>
                </div>
              </div>
            ))}

            {upcomingAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                No hay citas futuras cargadas todavia.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda de 7 dias</CardTitle>
            <CardDescription>Actividad proyectada para la proxima semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-3">
              {weeklyAppointments.map((entry) => (
                <div key={entry.dateKey} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-2xl bg-slate-900"
                      style={{ height: `${Math.max((entry.appointments / maxWeeklyAppointments) * 100, 8)}%` }}
                    />
                  </div>
                  <div className="text-center text-xs text-slate-500">
                    <p className="font-medium uppercase">{entry.label.replace(".", "")}</p>
                    <p>{entry.appointments}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Servicios mas reservados</CardTitle>
            <CardDescription>Top del catalogo en la base compartida</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{service.name}</p>
                  <p className="text-sm text-slate-500">
                    {service.durationMinutes} min · {formatCurrency(service.price)}
                  </p>
                </div>
                <Badge variant="outline">{service.bookings} reservas</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipo conectado</CardTitle>
            <CardDescription>Profesionales visibles en la web y en el panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {staffMembers.map((staffMember) => {
              const relatedAppointments = appointments.filter((appointment) => appointment.staffMemberId === staffMember.id)

              return (
                <div key={staffMember.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{staffMember.fullName}</p>
                      <p className="text-sm text-slate-500">{staffMember.role ?? "Profesional"}</p>
                    </div>
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {relatedAppointments.length} citas registradas · {staffMember.isActive ? "Visible" : "Oculto"} en la web
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

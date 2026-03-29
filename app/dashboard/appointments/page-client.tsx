"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatCurrency,
  getChannelLabel,
  getStatusBadgeClassName,
  getStatusLabel,
} from "@/lib/business-shared"
import type { AppointmentRecord } from "@/lib/business-shared"
import { Calendar, Search } from "lucide-react"

interface AppointmentsPageClientProps {
  appointments: AppointmentRecord[]
  businessName: string
  isLive: boolean
  todayKey: string
  timeZone: string
}

export function AppointmentsPageClient({
  appointments,
  businessName,
  isLive,
  todayKey,
  timeZone,
}: AppointmentsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customerContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && appointment.appointmentDate === todayKey) ||
      (dateFilter === "upcoming" && appointment.appointmentDate >= todayKey)

    return matchesSearch && matchesStatus && matchesDate
  })

  const confirmedRevenue = filteredAppointments
    .filter((appointment) => appointment.status === "confirmed" || appointment.status === "completed")
    .reduce((total, appointment) => total + appointment.price, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agenda y citas</h1>
          <p className="text-slate-600">
            {businessName} {isLive ? "sincroniza" : "muestra en demo"} las reservas generadas desde ns-barber.
          </p>
        </div>
        <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
          {isLive ? "Supabase activo" : "Modo demo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Citas visibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{filteredAppointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {filteredAppointments.filter((appointment) => appointment.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(confirmedRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busqueda rápida sobre la misma base compartida con el sitio público</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por cliente, contacto o servicio"
              value={searchTerm}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-52">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full lg:w-52">
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Solo hoy</SelectItem>
              <SelectItem value="upcoming">Hoy y proximas</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>Las inserciones públicas llegan como pendientes por defecto</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No hay reservas que coincidan con los filtros.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{appointment.customerName}</p>
                        <p className="text-sm text-slate-500">{appointment.customerContact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{appointment.serviceName}</p>
                        <p className="text-sm text-slate-500">{appointment.staffName ?? "Sin profesional asignado"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div>
                          <p>{formatAppointmentDate(appointment.appointmentDate, timeZone)}</p>
                          <p className="text-sm text-slate-500">{formatAppointmentTime(appointment.appointmentTime)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getChannelLabel(appointment.channel)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClassName(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(appointment.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

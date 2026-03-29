"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users } from "lucide-react"

interface EmployeeSummary {
  id: string
  fullName: string
  role: string | null
  email: string | null
  phone: string | null
  isActive: boolean
  totalAppointments: number
  pendingAppointments: number
  generatedRevenue: number
  averageTicket: number
  formattedRevenue: string
  formattedAverageTicket: string
}

interface EmployeesPageClientProps {
  businessName: string
  employees: EmployeeSummary[]
  isLive: boolean
}

export function EmployeesPageClient({ businessName, employees, isLive }: EmployeesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter((employee) => {
    const normalizedSearch = searchTerm.toLowerCase()

    return (
      employee.fullName.toLowerCase().includes(normalizedSearch) ||
      employee.role?.toLowerCase().includes(normalizedSearch) ||
      employee.email?.toLowerCase().includes(normalizedSearch)
    )
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Equipo</h1>
          <p className="text-slate-600">
            {businessName} usa el mismo staff para mostrar opciones en ns-barber y medir actividad en el panel.
          </p>
        </div>
        <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
          {isLive ? "Staff sincronizado" : "Staff demo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profesionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{employees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {employees.filter((employee) => employee.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Citas asignadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {employees.reduce((total, employee) => total + employee.totalAppointments, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {employees.reduce((total, employee) => total + employee.pendingAppointments, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar profesional</CardTitle>
          <CardDescription>Filtra por nombre, rol o email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej: nerea, barbera, email..."
              value={searchTerm}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipo conectado</CardTitle>
          <CardDescription>Este staff es el que puede quedar expuesto para toma de turnos</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No hay profesionales que coincidan con la búsqueda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Citas</TableHead>
                  <TableHead>Pendientes</TableHead>
                  <TableHead>Facturación</TableHead>
                  <TableHead>Ticket medio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <p className="font-medium text-slate-900">{employee.fullName}</p>
                        </div>
                        <p className="text-sm text-slate-500">{employee.email ?? employee.phone ?? "Sin contacto cargado"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role ?? "Profesional"}</TableCell>
                    <TableCell>{employee.totalAppointments}</TableCell>
                    <TableCell>{employee.pendingAppointments}</TableCell>
                    <TableCell>{employee.formattedRevenue}</TableCell>
                    <TableCell>{employee.formattedAverageTicket}</TableCell>
                    <TableCell>
                      <Badge className={employee.isActive ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"}>
                        {employee.isActive ? "Activo" : "Oculto"}
                      </Badge>
                    </TableCell>
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
} from "lucide-react"

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [viewMode, setViewMode] = useState("week")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const appointments = [
    {
      id: 1,
      client: "Ana Rodríguez",
      email: "ana@email.com",
      phone: "+54 11 1234-5678",
      service: "Corte y peinado",
      employee: "María García",
      date: "2024-01-15",
      time: "10:00",
      duration: 60,
      price: 35.0,
      status: "confirmed",
      notes: "Cliente prefiere corte bob",
    },
    {
      id: 2,
      client: "Carlos López",
      email: "carlos@email.com",
      phone: "+54 11 8765-4321",
      service: "Barba y bigote",
      employee: "Juan Pérez",
      date: "2024-01-15",
      time: "11:30",
      duration: 45,
      price: 20.0,
      status: "pending",
      notes: "",
    },
    {
      id: 3,
      client: "Laura Martín",
      email: "laura@email.com",
      phone: "+54 11 5555-0000",
      service: "Manicura completa",
      employee: "Ana Silva",
      date: "2024-01-15",
      time: "14:00",
      duration: 60,
      price: 25.0,
      status: "confirmed",
      notes: "Esmalte rojo",
    },
    {
      id: 4,
      client: "Roberto Silva",
      email: "roberto@email.com",
      phone: "+54 11 9999-1111",
      service: "Corte de cabello",
      employee: "María García",
      date: "2024-01-16",
      time: "09:00",
      duration: 45,
      price: 25.0,
      status: "confirmed",
      notes: "",
    },
    {
      id: 5,
      client: "Patricia Gómez",
      email: "patricia@email.com",
      phone: "+54 11 7777-2222",
      service: "Tratamiento facial",
      employee: "Ana Silva",
      date: "2024-01-16",
      time: "15:30",
      duration: 75,
      price: 40.0,
      status: "cancelled",
      notes: "Canceló por enfermedad",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      case "completed":
        return "Completada"
      default:
        return "Desconocido"
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const todayAppointments = appointments.filter((apt) => apt.date === "2024-01-15")
  const upcomingAppointments = appointments.filter((apt) => new Date(apt.date) > new Date("2024-01-15"))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda y Citas</h1>
          <p className="text-gray-600">Gestiona las citas de tu negocio</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Enero 2024</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Hoy
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 + 1
                  const isToday = day === 15
                  const hasAppointments = [15, 16, 18, 22].includes(day)

                  return (
                    <div
                      key={i}
                      className={`
                        min-h-20 p-2 border rounded-lg cursor-pointer hover:bg-gray-50
                        ${isToday ? "bg-blue-50 border-blue-200" : ""}
                        ${day < 1 || day > 31 ? "text-gray-300" : ""}
                      `}
                    >
                      <div className={`text-sm ${isToday ? "font-bold text-blue-600" : ""}`}>
                        {day > 0 && day <= 31 ? day : ""}
                      </div>
                      {hasAppointments && day > 0 && day <= 31 && (
                        <div className="mt-1 space-y-1">
                          <div className="text-xs bg-green-100 text-green-800 px-1 rounded">10:00 Ana R.</div>
                          {day === 15 && (
                            <>
                              <div className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">11:30 Carlos L.</div>
                              <div className="text-xs bg-green-100 text-green-800 px-1 rounded">14:00 Laura M.</div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Semana del 15 - 21 Enero 2024</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Semana actual
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-2">
                <div className="p-2"></div>
                {["Lun 15", "Mar 16", "Mié 17", "Jue 18", "Vie 19", "Sáb 20", "Dom 21"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium border-b">
                    {day}
                  </div>
                ))}

                {Array.from({ length: 12 }, (_, hour) => {
                  const time = `${(hour + 8).toString().padStart(2, "0")}:00`
                  return (
                    <div key={hour} className="contents">
                      <div className="p-2 text-xs text-gray-500 text-right">{time}</div>
                      {Array.from({ length: 7 }, (_, day) => (
                        <div key={day} className="min-h-12 border border-gray-100 p-1">
                          {/* Citas específicas */}
                          {day === 0 && hour === 2 && (
                            <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1">10:00 Ana R.</div>
                          )}
                          {day === 0 && hour === 3 && (
                            <div className="bg-yellow-100 text-yellow-800 text-xs p-1 rounded mb-1">
                              11:30 Carlos L.
                            </div>
                          )}
                          {day === 0 && hour === 6 && (
                            <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1">14:00 Laura M.</div>
                          )}
                          {day === 1 && hour === 1 && (
                            <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1">09:00 Roberto S.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por cliente o servicio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="confirmed">Confirmadas</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Citas de hoy */}
          <Card>
            <CardHeader>
              <CardTitle>Citas de hoy ({todayAppointments.length})</CardTitle>
              <CardDescription>Citas programadas para hoy, 15 de enero</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{appointment.client}</h4>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.employee}</span>
                          <span>•</span>
                          <span>${appointment.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximas citas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas citas ({upcomingAppointments.length})</CardTitle>
              <CardDescription>Citas programadas para los próximos días</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments
                    .filter((apt) => new Date(apt.date) > new Date("2024-01-15"))
                    .map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.client}</div>
                            <div className="text-sm text-gray-500">{appointment.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.date}</div>
                            <div className="text-sm text-gray-500">{appointment.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.employee}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver detalles de la cita */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la cita</DialogTitle>
            <DialogDescription>Información completa de la cita seleccionada</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Información del cliente</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedAppointment.client}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedAppointment.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedAppointment.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Detalles del servicio</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Servicio:</strong> {selectedAppointment.service}
                    </div>
                    <div>
                      <strong>Empleado:</strong> {selectedAppointment.employee}
                    </div>
                    <div>
                      <strong>Duración:</strong> {selectedAppointment.duration} minutos
                    </div>
                    <div>
                      <strong>Precio:</strong> ${selectedAppointment.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Fecha y hora</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedAppointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedAppointment.time}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Estado</h3>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {getStatusText(selectedAppointment.status)}
                  </Badge>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notas</h3>
                    <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Cerrar
            </Button>
            <Button variant="outline">Editar cita</Button>
            <Button>Confirmar cita</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

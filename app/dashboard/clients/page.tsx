"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  Star,
} from "lucide-react"

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<null | typeof clients[0]>(null)

  const clients = [
    {
      id: 1,
      name: "Ana Rodríguez",
      email: "ana@email.com",
      phone: "+54 11 1234-5678",
      address: "Av. Corrientes 1234, CABA",
      joinDate: "2023-06-15",
      totalAppointments: 12,
      totalSpent: 420.0,
      lastVisit: "2024-01-10",
      preferredServices: ["Corte de cabello", "Peinado"],
      notes: "Prefiere citas por la mañana. Alérgica a ciertos productos.",
      status: "active",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@email.com",
      phone: "+54 11 8765-4321",
      address: "San Martín 567, CABA",
      joinDate: "2023-08-22",
      totalAppointments: 8,
      totalSpent: 160.0,
      lastVisit: "2024-01-08",
      preferredServices: ["Barba y bigote"],
      notes: "Cliente puntual, siempre llega 5 minutos antes.",
      status: "active",
      rating: 4,
    },
    {
      id: 3,
      name: "Laura Martín",
      email: "laura@email.com",
      phone: "+54 11 5555-0000",
      address: "Rivadavia 890, CABA",
      joinDate: "2023-03-10",
      totalAppointments: 15,
      totalSpent: 375.0,
      lastVisit: "2024-01-12",
      preferredServices: ["Manicura", "Pedicura"],
      notes: "Le gusta probar colores nuevos. Muy sociable.",
      status: "active",
      rating: 5,
    },
    {
      id: 4,
      name: "Roberto Silva",
      email: "roberto@email.com",
      phone: "+54 11 9999-1111",
      address: "Belgrano 456, CABA",
      joinDate: "2023-11-05",
      totalAppointments: 4,
      totalSpent: 100.0,
      lastVisit: "2023-12-20",
      preferredServices: ["Corte de cabello"],
      notes: "Cliente nuevo, aún explorando servicios.",
      status: "inactive",
      rating: 4,
    },
  ]

  const clientHistory = [
    {
      id: 1,
      date: "2024-01-10",
      service: "Corte y peinado",
      employee: "María García",
      price: 35.0,
      status: "completed",
    },
    {
      id: 2,
      date: "2023-12-15",
      service: "Corte de cabello",
      employee: "María García",
      price: 25.0,
      status: "completed",
    },
    {
      id: 3,
      date: "2023-11-20",
      service: "Peinado para evento",
      employee: "Ana Silva",
      price: 45.0,
      status: "completed",
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )

  const activeClients = clients.filter((c) => c.status === "active")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra tu base de clientes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">{activeClients.length} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos este mes</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+25% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$263</div>
            <p className="text-xs text-muted-foreground">Por cliente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">Promedio de calificaciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({filteredClients.length})</CardTitle>
          <CardDescription>Lista completa de tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Última visita</TableHead>
                <TableHead>Total gastado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.totalAppointments} citas</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {client.lastVisit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />${client.totalSpent.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.status === "active" ? "default" : "secondary"}>
                      {client.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para ver detalles del cliente */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Perfil del cliente</DialogTitle>
            <DialogDescription>Información completa y historial del cliente</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="preferences">Preferencias</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback className="text-lg">
                          {selectedClient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < selectedClient.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">({selectedClient.rating}/5)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{selectedClient.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                        <span>Cliente desde {selectedClient.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold">{selectedClient.totalAppointments}</div>
                          <p className="text-sm text-gray-600">Total de citas</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold">${selectedClient.totalSpent.toFixed(2)}</div>
                          <p className="text-sm text-gray-600">Total gastado</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Servicios preferidos</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.preferredServices.map((service, index) => (
                          <Badge key={index} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Notas</h4>
                      <p className="text-sm text-gray-600">{selectedClient.notes}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Historial de citas</h4>
                  <div className="space-y-3">
                    {clientHistory.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium">{appointment.service}</h5>
                            <p className="text-sm text-gray-600">
                              {appointment.date} • {appointment.employee}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${appointment.price.toFixed(2)}</div>
                          <Badge variant="outline" className="text-xs">
                            {appointment.status === "completed" ? "Completada" : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Preferencias de comunicación</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Recordatorios por email</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Recordatorios por WhatsApp</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Promociones y ofertas</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Horarios preferidos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Día preferido</label>
                        <p className="font-medium">Martes y Jueves</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Horario preferido</label>
                        <p className="font-medium">10:00 - 12:00</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Alergias y observaciones</h4>
                    <p className="text-sm text-gray-600">
                      Alérgica a productos con sulfatos. Prefiere productos naturales.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              Cerrar
            </Button>
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar mensaje
            </Button>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Nueva cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardPageShell } from "@/components/dashboard/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Clock, CreditCard, Upload, Save, Plus } from "lucide-react"

export default function SettingsPage() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Salón de Belleza María",
    description: "Salón de belleza especializado en cortes, peinados y tratamientos de belleza",
    address: "Av. Corrientes 1234, CABA",
    phone: "+54 11 1234-5678",
    email: "info@salonmaria.com",
    website: "www.salonmaria.com",
    cuit: "20-12345678-9",
    logo: "/placeholder.svg?height=100&width=100",
  })

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "María García",
      email: "maria@salon.com",
      role: "owner",
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Juan Pérez",
      email: "juan@salon.com",
      role: "employee",
      status: "active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Ana Silva",
      email: "ana@salon.com",
      role: "employee",
      status: "active",
      lastLogin: "2024-01-13",
    },
  ])

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const getRoleText = (role: string) => {
    switch (role) {
      case "owner":
        return "Propietario"
      case "admin":
        return "Administrador"
      case "employee":
        return "Empleado"
      case "receptionist":
        return "Recepcionista"
      default:
        return "Usuario"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-violet-100 text-violet-800"
      case "admin":
        return "bg-sky-100 text-sky-800"
      case "employee":
        return "bg-emerald-100 text-emerald-800"
      case "receptionist":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleSaveBusinessInfo = () => {
    // Simular guardado
    console.log("Guardando información del negocio:", businessInfo)
  }

  const handleInviteUser = () => {
    // Simular invitación
    setIsInviteDialogOpen(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        description="Administra la configuración del negocio, el acceso del equipo y las integraciones operativas."
        eyebrow="Ajustes"
        title="Configuración"
      />

      <Tabs defaultValue="business" className="w-full">
        <div className="overflow-x-auto pb-1">
          <TabsList className="min-w-max">
            <TabsTrigger value="business">Negocio</TabsTrigger>
            <TabsTrigger value="hours">Horarios</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Información del negocio</span>
              </CardTitle>
              <CardDescription>Actualiza los datos públicos de tu negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo del negocio</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={businessInfo.logo || "/placeholder.svg"} />
                        <AvatarFallback>
                          <Building2 className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Cambiar logo
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Nombre del negocio</Label>
                      <Input
                        id="business-name"
                        value={businessInfo.name}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Teléfono</Label>
                      <Input
                        id="business-phone"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-description">Descripción</Label>
                    <Textarea
                      id="business-description"
                      rows={3}
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email</Label>
                      <Input
                        id="business-email"
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-website">Sitio web</Label>
                      <Input
                        id="business-website"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Dirección</Label>
                    <Input
                      id="business-address"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-cuit">CUIT/CUIL</Label>
                    <Input
                      id="business-cuit"
                      value={businessInfo.cuit}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, cuit: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveBusinessInfo}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Horarios de atención</span>
              </CardTitle>
              <CardDescription>La disponibilidad semanal y las reglas de turnos ahora viven en un módulo dedicado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm text-slate-700">
                  Desde ahí puedes abrir o cerrar días, definir horarios de atención y acotar la apertura de turnos con
                  intervalo, anticipación mínima, días máximos y colchón entre reservas.
                </p>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/dashboard/hours">Abrir módulo de horarios</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Políticas de cancelación</CardTitle>
              <CardDescription>Define las reglas para cancelaciones y reprogramaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancellation-hours">Horas mínimas para cancelar</Label>
                <Select defaultValue="24">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 horas</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="12">12 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                    <SelectItem value="48">48 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="charge-cancellation" />
                <Label htmlFor="charge-cancellation">Cobrar penalización por cancelación tardía</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cancellation-fee">Monto de penalización (%)</Label>
                <Input id="cancellation-fee" type="number" placeholder="50" className="w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Métodos de pago</span>
              </CardTitle>
              <CardDescription>Configura las integraciones de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Mercado Pago</h4>
                      <p className="text-sm text-slate-600">Pagos con tarjeta y transferencias</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Stripe</h4>
                      <p className="text-sm text-slate-600">Procesamiento global de pagos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge variant="outline">No conectado</Badge>
                    <Button variant="outline" size="sm">
                      Conectar
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Efectivo</h4>
                      <p className="text-sm text-slate-600">Pagos en efectivo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Switch defaultChecked />
                    <span className="text-sm">Habilitado</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Configuración de facturación</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tasa de IVA (%)</Label>
                    <Input id="tax-rate" type="number" defaultValue="21" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select defaultValue="ARS">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                        <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-invoice" defaultChecked />
                  <Label htmlFor="auto-invoice">Generar facturas automáticamente</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones disponibles</CardTitle>
              <CardDescription>Conecta tu negocio con herramientas externas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Google Calendar",
                    description: "Sincroniza citas con Google Calendar",
                    icon: "📅",
                    connected: true,
                  },
                  {
                    name: "WhatsApp Business",
                    description: "Envía recordatorios por WhatsApp",
                    icon: "💬",
                    connected: true,
                  },
                  {
                    name: "Instagram",
                    description: "Permite reservas desde Instagram",
                    icon: "📸",
                    connected: false,
                  },
                  {
                    name: "Facebook",
                    description: "Gestiona reservas desde Facebook",
                    icon: "👥",
                    connected: false,
                  },
                ].map((integration, index) => (
                  <div key={index} className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-slate-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {integration.connected ? (
                        <>
                          <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                          <Button variant="outline" size="sm">
                            Configurar
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm">
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Gestión de usuarios</CardTitle>
                  <CardDescription>Administra el acceso al sistema</CardDescription>
                </div>
                <Button className="self-start sm:self-auto" onClick={() => setIsInviteDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invitar usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <p className="text-xs text-slate-500">Último acceso: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                      {user.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permisos y roles</CardTitle>
              <CardDescription>Define qué puede hacer cada tipo de usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    role: "owner",
                    name: "Propietario",
                    permissions: ["Acceso completo", "Gestión de usuarios", "Configuración", "Reportes"],
                  },
                  {
                    role: "admin",
                    name: "Administrador",
                    permissions: ["Gestión de citas", "Clientes", "Empleados", "Reportes básicos"],
                  },
                  {
                    role: "employee",
                    name: "Empleado",
                    permissions: ["Ver sus citas", "Gestionar clientes", "Actualizar servicios"],
                  },
                  {
                    role: "receptionist",
                    name: "Recepcionista",
                    permissions: ["Gestión de citas", "Clientes", "Pagos"],
                  },
                ].map((role, index) => (
                  <div key={index} className="rounded-xl border p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-semibold">{role.name}</h4>
                      <Badge className={getRoleColor(role.role)}>{role.name}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, pIndex) => (
                        <Badge key={pIndex} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Notificaciones por email</h4>
                <div className="space-y-3">
                  {[
                    { id: "new-appointment", label: "Nueva cita reservada", defaultChecked: true },
                    { id: "cancelled-appointment", label: "Cita cancelada", defaultChecked: true },
                    { id: "payment-received", label: "Pago recibido", defaultChecked: true },
                    { id: "daily-summary", label: "Resumen diario", defaultChecked: false },
                    { id: "weekly-report", label: "Reporte semanal", defaultChecked: true },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between gap-4">
                      <Label htmlFor={notification.id}>{notification.label}</Label>
                      <Switch id={notification.id} defaultChecked={notification.defaultChecked} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Recordatorios automáticos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="reminder-clients">Recordar citas a clientes</Label>
                    <Switch id="reminder-clients" defaultChecked />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Recordatorio por WhatsApp</Label>
                      <Select defaultValue="24">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 horas antes</SelectItem>
                          <SelectItem value="4">4 horas antes</SelectItem>
                          <SelectItem value="24">24 horas antes</SelectItem>
                          <SelectItem value="48">48 horas antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Recordatorio por email</Label>
                      <Select defaultValue="48">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 horas antes</SelectItem>
                          <SelectItem value="48">48 horas antes</SelectItem>
                          <SelectItem value="72">72 horas antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para invitar usuario */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invitar nuevo usuario</DialogTitle>
            <DialogDescription>
              Envía acceso al panel con un rol inicial para tu equipo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input id="invite-email" type="email" placeholder="usuario@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Rol</Label>
              <Select defaultValue="employee">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="employee">Empleado</SelectItem>
                  <SelectItem value="receptionist">Recepcionista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-message">Mensaje personalizado (opcional)</Label>
              <Textarea id="invite-message" placeholder="Te invitamos a formar parte de nuestro equipo..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInviteUser}>Enviar invitación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  )
}

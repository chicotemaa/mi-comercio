"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
  Users,
  MessageCircle,
  Settings,
} from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Nueva cita reservada",
      message: "Ana Rodríguez reservó una cita para Corte y peinado el 16/01 a las 10:00",
      time: "Hace 5 minutos",
      read: false,
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      type: "payment",
      title: "Pago recibido",
      message: "Se recibió un pago de $35.00 por el servicio de Carlos López",
      time: "Hace 15 minutos",
      read: false,
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      type: "cancellation",
      title: "Cita cancelada",
      message: "Laura Martín canceló su cita del 16/01 a las 14:00",
      time: "Hace 1 hora",
      read: true,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      id: 4,
      type: "employee",
      title: "Empleado agregado",
      message: "Se agregó a Juan Pérez como nuevo empleado del equipo",
      time: "Hace 2 horas",
      read: true,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 5,
      type: "campaign",
      title: "Campaña enviada",
      message: "Se envió la campaña 'Promoción Verano 2024' a 45 clientes",
      time: "Hace 3 horas",
      read: true,
      icon: MessageCircle,
      color: "bg-orange-100 text-orange-600",
    },
  ])

  const activities = [
    {
      id: 1,
      user: "María García",
      action: "completó una cita",
      details: "Corte de cabello para Ana Rodríguez",
      time: "10:30 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      user: "Juan Pérez",
      action: "actualizó su perfil",
      details: "Agregó nuevos servicios disponibles",
      time: "09:45 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      user: "Sistema",
      action: "envió recordatorios",
      details: "5 recordatorios de cita enviados por WhatsApp",
      time: "09:00 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      user: "Ana Silva",
      action: "registró un nuevo cliente",
      details: "Patricia Gómez se registró en el sistema",
      time: "08:30 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Notificaciones y Actividad</h1>
          <p className="text-slate-600">Mantente al día con todo lo que sucede en tu negocio</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Resumen de notificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin leer</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Notificaciones pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Notificaciones recibidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas nuevas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">En las últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Acciones realizadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <div className="overflow-x-auto pb-1">
          <TabsList className="min-w-max">
            <TabsTrigger value="notifications">
              Notificaciones
              {unreadCount > 0 && <Badge className="ml-2 bg-red-500 px-2 py-0.5 text-xs text-white">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="activity">Actividad del equipo</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones recientes</CardTitle>
              <CardDescription>Mantente informado sobre eventos importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex flex-col gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-start ${
                      !notification.read ? "border-sky-200 bg-sky-50/80" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${notification.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <notification.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className={`font-semibold ${!notification.read ? "text-slate-900" : "text-slate-700"}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{notification.time}</span>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marcar como leída
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad del equipo</CardTitle>
              <CardDescription>Registro de acciones realizadas por tu equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>
                          <span className="text-slate-600"> {activity.action}</span>
                        </p>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado del sistema</CardTitle>
              <CardDescription>Información sobre el funcionamiento de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">Servicios operativos</h4>
                      <p className="text-sm text-slate-600">Todos los sistemas funcionando correctamente</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">Respaldos automáticos</h4>
                      <p className="text-sm text-slate-600">Último respaldo: Hoy a las 03:00 AM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completado</Badge>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">Actualización programada</h4>
                      <p className="text-sm text-slate-600">Nuevas funciones disponibles el 20/01</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Programada</Badge>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Próximas mejoras</h4>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Estamos trabajando en nuevas funciones de inteligencia artificial para optimizar tu agenda.
                    ¡Mantente atento a las actualizaciones!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

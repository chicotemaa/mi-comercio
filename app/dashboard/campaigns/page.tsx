"use client"

import {  useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Plus, Send, Eye, Edit, Trash2, MessageCircle, Mail, Users, Target, Clock, CheckCircle } from "lucide-react"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Promoción Verano 2024",
      type: "whatsapp",
      status: "sent",
      audience: "Clientes VIP",
      recipients: 45,
      sent: 45,
      delivered: 43,
      opened: 38,
      clicked: 12,
      createdDate: "2024-01-10",
      sentDate: "2024-01-12",
      message: "¡Descuento especial del 20% en todos nuestros servicios de verano! Válido hasta el 31 de enero.",
    },
    {
      id: 2,
      name: "Recordatorio Citas",
      type: "email",
      status: "scheduled",
      audience: "Clientes con citas",
      recipients: 23,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      createdDate: "2024-01-15",
      sentDate: "2024-01-16",
      message: "Te recordamos tu cita programada para mañana. ¡Te esperamos!",
    },
    {
      id: 3,
      name: "Nuevos Servicios",
      type: "whatsapp",
      status: "draft",
      audience: "Todos los clientes",
      recipients: 245,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      createdDate: "2024-01-14",
      sentDate: null,
      message: "¡Conoce nuestros nuevos servicios de tratamientos faciales! Agenda tu cita ahora.",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<null | {
    id: number;
    name: string;
    type: string;
    status: string;
    audience: string;
    recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    createdDate: string;
    sentDate: string | null;
    message: string;
    subject?: string; // Added subject property
  }>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<null | {
    id: number;
    name: string;
    type: string;
    status: string;
    audience: string;
    recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    createdDate: string;
    sentDate: string | null;
    message: string;
  }>(null)

  const audiences = [
    { id: "all", name: "Todos los clientes", count: 245 },
    { id: "vip", name: "Clientes VIP", count: 45 },
    { id: "frequent", name: "Clientes frecuentes", count: 89 },
    { id: "new", name: "Clientes nuevos", count: 23 },
    { id: "inactive", name: "Clientes inactivos", count: 67 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviada"
      case "scheduled":
        return "Programada"
      case "draft":
        return "Borrador"
      case "failed":
        return "Fallida"
      default:
        return "Desconocido"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "whatsapp":
        return <MessageCircle className="w-4 h-4" />
      case "email":
        return <Mail className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const handleCreateCampaign = () => {
    setEditingCampaign(null)
    setIsDialogOpen(true)
  }

  const handleEditCampaign = (campaign: { id: number; name: string; type: string; status: string; audience: string; recipients: number; sent: number; delivered: number; opened: number; clicked: number; createdDate: string; sentDate: string | null; message: string }) => {
      setEditingCampaign(campaign)
      setIsDialogOpen(true)
  }

  const handleDeleteCampaign = (campaignId: number) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaignId))
  }

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalDelivered = campaigns.reduce((sum, c) => sum + c.delivered, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campañas y Comunicación</h1>
          <p className="text-gray-600">Gestiona tus campañas de marketing y comunicación</p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter((c) => c.status === "sent").length} enviadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes enviados</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de entrega</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{totalDelivered} entregados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de apertura</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{totalOpened} aperturas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campañas ({campaigns.length})</CardTitle>
              <CardDescription>Gestiona todas tus campañas de marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaña</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Audiencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Métricas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">
                            Creada: {campaign.createdDate}
                            {campaign.sentDate && ` • Enviada: ${campaign.sentDate}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(campaign.type)}
                          <span className="capitalize">{campaign.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.audience}</div>
                          <div className="text-sm text-gray-500">{campaign.recipients} destinatarios</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>{getStatusText(campaign.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.status === "sent" ? (
                          <div className="text-sm">
                            <div>📤 {campaign.sent} enviados</div>
                            <div>✅ {campaign.delivered} entregados</div>
                            <div>👁️ {campaign.opened} abiertos</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedCampaign(campaign)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de mensajes</CardTitle>
              <CardDescription>Crea y gestiona plantillas reutilizables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Recordatorio de cita",
                    type: "whatsapp",
                    preview: "Hola {nombre}, te recordamos tu cita para mañana a las {hora}...",
                  },
                  {
                    name: "Promoción descuento",
                    type: "email",
                    preview: "¡Oferta especial! Obtén un {descuento}% de descuento en...",
                  },
                  {
                    name: "Bienvenida nuevo cliente",
                    type: "whatsapp",
                    preview: "¡Bienvenido/a {nombre}! Gracias por elegir nuestros servicios...",
                  },
                  {
                    name: "Seguimiento post-servicio",
                    type: "email",
                    preview: "Esperamos que hayas disfrutado tu {servicio}. Nos encantaría...",
                  },
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        {getTypeIcon(template.type)}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.preview}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Usar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por canal</CardTitle>
                <CardDescription>Comparación de efectividad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: "WhatsApp", sent: 45, opened: 38, rate: 84 },
                    { channel: "Email", sent: 23, opened: 15, rate: 65 },
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(channel.channel.toLowerCase())}
                        <div>
                          <h4 className="font-semibold">{channel.channel}</h4>
                          <p className="text-sm text-gray-600">{channel.sent} enviados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{channel.rate}%</div>
                        <div className="text-sm text-gray-500">{channel.opened} abiertos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mejores horarios de envío</CardTitle>
                <CardDescription>Tasa de apertura por hora</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "09:00 - 11:00", rate: 78 },
                    { time: "11:00 - 13:00", rate: 85 },
                    { time: "13:00 - 15:00", rate: 62 },
                    { time: "15:00 - 17:00", rate: 71 },
                    { time: "17:00 - 19:00", rate: 89 },
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{slot.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${slot.rate}%` }} />
                        </div>
                        <span className="text-sm font-semibold w-8">{slot.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para crear/editar campaña */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCampaign ? "Editar Campaña" : "Nueva Campaña"}</DialogTitle>
            <DialogDescription>
              {editingCampaign ? "Modifica los datos de la campaña" : "Crea una nueva campaña de marketing"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Información básica</TabsTrigger>
              <TabsTrigger value="audience">Audiencia</TabsTrigger>
              <TabsTrigger value="message">Mensaje</TabsTrigger>
              <TabsTrigger value="schedule">Programación</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Nombre de la campaña</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Ej: Promoción Verano 2024"
                    defaultValue={editingCampaign?.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Tipo de campaña</Label>
                  <Select defaultValue={editingCampaign?.type || "whatsapp"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-description">Descripción (opcional)</Label>
                <Textarea id="campaign-description" placeholder="Describe el objetivo de esta campaña..." rows={3} />
              </div>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <div className="space-y-4">
                <Label>Selecciona tu audiencia</Label>
                {audiences.map((audience) => (
                  <label
                    key={audience.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="audience" value={audience.id} />
                      <div>
                        <div className="font-medium">{audience.name}</div>
                        <div className="text-sm text-gray-500">{audience.count} clientes</div>
                      </div>
                    </div>
                    <Users className="w-4 h-4 text-gray-400" />
                  </label>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="message" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-subject">Asunto (solo para email)</Label>
                <Input
                  id="campaign-subject"
                  placeholder="Ej: ¡Oferta especial solo para ti!"
                  defaultValue={editingCampaign?.subject || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-message">Mensaje</Label>
                <Textarea
                  id="campaign-message"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  defaultValue={editingCampaign?.message || ""}
                />
                <div className="text-sm text-gray-500">
                  Puedes usar variables como {"{nombre}"}, {"{servicio}"}, {"{fecha}"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vista previa</Label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm">
                    <strong>Para:</strong> Ana Rodríguez
                  </div>
                  <div className="mt-2 text-sm">{editingCampaign?.message || "Tu mensaje aparecerá aquí..."}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="send-now" />
                  <Label htmlFor="send-now">Enviar ahora</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Fecha de envío</Label>
                    <Input id="schedule-date" type="date" defaultValue="2024-01-16" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Hora de envío</Label>
                    <Input id="schedule-time" type="time" defaultValue="10:00" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">La campaña se enviará el 16 de enero a las 10:00 AM</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="outline">Guardar borrador</Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingCampaign ? "Actualizar campaña" : "Crear campaña"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalles de campaña */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la campaña</DialogTitle>
            <DialogDescription>Información completa y métricas de la campaña</DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Información general</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nombre:</span>
                        <span className="text-sm font-medium">{selectedCampaign.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tipo:</span>
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(selectedCampaign.type)}
                          <span className="text-sm font-medium capitalize">{selectedCampaign.type}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Estado:</span>
                        <Badge className={getStatusColor(selectedCampaign.status)}>
                          {getStatusText(selectedCampaign.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Audiencia:</span>
                        <span className="text-sm font-medium">{selectedCampaign.audience}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Métricas</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Destinatarios:</span>
                        <span className="text-sm font-medium">{selectedCampaign.recipients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Enviados:</span>
                        <span className="text-sm font-medium">{selectedCampaign.sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entregados:</span>
                        <span className="text-sm font-medium">{selectedCampaign.delivered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Abiertos:</span>
                        <span className="text-sm font-medium">{selectedCampaign.opened}</span>
                      </div>
                      {selectedCampaign.delivered > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tasa de apertura:</span>
                          <span className="text-sm font-medium">
                            {Math.round((selectedCampaign.opened / selectedCampaign.delivered) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mensaje enviado</h4>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm">{selectedCampaign.message}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
              Cerrar
            </Button>
            <Button variant="outline" onClick={() => selectedCampaign && handleEditCampaign(selectedCampaign)}>
              Editar campaña
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
 
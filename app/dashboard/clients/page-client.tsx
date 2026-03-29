"use client"

import { useMemo, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CustomerRecord } from "@/lib/business-shared"
import {
  formatCurrency,
  formatDisplayDate,
  getCustomerStatusBadgeClassName,
  getCustomerStatusLabel,
} from "@/lib/business-shared"
import { Calendar, Eye, Search, Star, User, UserRoundCheck } from "lucide-react"

interface ClientsPageClientProps {
  businessName: string
  customers: CustomerRecord[]
  isLive: boolean
  timeZone: string
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

export function ClientsPageClient({ businessName, customers, isLive, timeZone }: ClientsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<CustomerRecord | null>(null)

  const filteredClients = useMemo(() => {
    return customers.filter((client) => {
      const haystack = [
        client.fullName,
        client.email ?? "",
        client.primaryContact,
        client.phone ?? "",
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch = haystack.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || client.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  const activeClients = customers.filter((client) => client.status === "active").length
  const repeatClients = customers.filter((client) => client.totalAppointments > 1).length
  const newClientsThisMonth = customers.filter((client) => {
    const joinedAt = new Date(client.joinedAt)
    const limit = new Date()
    limit.setDate(limit.getDate() - 30)
    return joinedAt >= limit
  }).length
  const totalSpent = customers.reduce((sum, client) => sum + client.totalSpent, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600">
            {businessName} {isLive ? "lee" : "muestra en demo"} la base de clientes consolidada desde reservas y caja.
          </p>
        </div>
        <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
          {isLive ? "Supabase activo" : "Modo demo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{customers.length}</div>
            <p className="text-xs text-slate-500">{activeClients} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nuevos 30 días</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{newClientsThisMonth}</div>
            <p className="text-xs text-slate-500">Altas recientes en el backoffice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes recurrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{repeatClients}</div>
            <p className="text-xs text-slate-500">Con más de una cita registrada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos acumulados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-slate-500">Total atribuido a clientes registrados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Búsqueda por nombre, contacto o email</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar cliente"
              value={searchTerm}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-52">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Base de clientes</CardTitle>
          <CardDescription>{filteredClients.length} registros visibles</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No hay clientes que coincidan con los filtros.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Última visita</TableHead>
                  <TableHead className="text-right">Citas</TableHead>
                  <TableHead className="text-right">Total gastado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-20 text-right">Detalle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(client.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{client.fullName}</p>
                          <p className="text-sm text-slate-500">{formatDisplayDate(client.joinedAt, timeZone)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{client.primaryContact}</p>
                        <p className="text-sm text-slate-500">{client.email ?? client.phone ?? "Sin email ni teléfono"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDisplayDate(client.lastVisitAt, timeZone)}</TableCell>
                    <TableCell className="text-right font-medium">{client.totalAppointments}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(client.totalSpent)}</TableCell>
                    <TableCell>
                      <Badge className={getCustomerStatusBadgeClassName(client.status)}>
                        {getCustomerStatusLabel(client.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedClient !== null} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ficha del cliente</DialogTitle>
            <DialogDescription>Resumen operativo para seguimiento y atención</DialogDescription>
          </DialogHeader>

          {selectedClient ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback>{getInitials(selectedClient.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedClient.fullName}</h3>
                    <p className="text-sm text-slate-500">{selectedClient.primaryContact}</p>
                  </div>
                </div>
                <Badge className={getCustomerStatusBadgeClassName(selectedClient.status)}>
                  {getCustomerStatusLabel(selectedClient.status)}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Citas</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{selectedClient.totalAppointments}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">Valor</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(selectedClient.totalSpent)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Última visita</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-900">
                      {formatDisplayDate(selectedClient.lastVisitAt, timeZone)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <UserRoundCheck className="h-4 w-4" />
                      <span className="text-sm">Alta</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-900">
                      {formatDisplayDate(selectedClient.joinedAt, timeZone)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contacto</h4>
                    <div className="mt-2 space-y-2 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                      <p>
                        <span className="font-medium text-slate-900">Principal:</span> {selectedClient.primaryContact}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Email:</span> {selectedClient.email ?? "Sin email"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Teléfono:</span>{" "}
                        {selectedClient.phone ?? "Sin teléfono"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notas</h4>
                    <div className="mt-2 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                      {selectedClient.notes?.trim() ? selectedClient.notes : "Sin observaciones todavía."}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Servicios preferidos</h4>
                  <div className="mt-2 rounded-2xl border border-slate-200 p-4">
                    {selectedClient.preferredServices.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.preferredServices.map((service) => (
                          <Badge key={service} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Todavía no hay preferencias consolidadas.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

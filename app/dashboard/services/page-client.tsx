"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/business-shared"
import { Clock3, Search, Scissors } from "lucide-react"

interface ServiceSummary {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
  bookings: number
}

interface ServicesPageClientProps {
  businessName: string
  isLive: boolean
  services: ServiceSummary[]
}

export function ServicesPageClient({ businessName, isLive, services }: ServicesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredServices = services.filter((service) => {
    const normalizedSearch = searchTerm.toLowerCase()

    return (
      service.name.toLowerCase().includes(normalizedSearch) ||
      service.description?.toLowerCase().includes(normalizedSearch)
    )
  })

  const averageTicket =
    services.length > 0 ? services.reduce((total, service) => total + service.price, 0) / services.length : 0

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Servicios</h1>
          <p className="text-slate-600">
            {businessName} mantiene este catálogo compartido entre el sitio público y el panel.
          </p>
        </div>
        <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
          {isLive ? "Catálogo en vivo" : "Catálogo demo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Servicios activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {services.filter((service) => service.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(averageTicket)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reservas acumuladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {services.reduce((total, service) => total + service.bookings, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar servicio</CardTitle>
          <CardDescription>Filtra por nombre o descripción</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej: fade, barba, combo..."
              value={searchTerm}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo</CardTitle>
          <CardDescription>Estos servicios son los que ve ns-barber al momento de reservar</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No hay servicios que coincidan con la búsqueda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Reservas</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-slate-400" />
                          <p className="font-medium text-slate-900">{service.name}</p>
                        </div>
                        <p className="text-sm text-slate-500">{service.description ?? "Sin descripción"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock3 className="h-4 w-4 text-slate-400" />
                        {service.durationMinutes} min
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(service.price)}</TableCell>
                    <TableCell>{service.bookings}</TableCell>
                    <TableCell>
                      <Badge className={service.isActive ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"}>
                        {service.isActive ? "Activo" : "Oculto"}
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

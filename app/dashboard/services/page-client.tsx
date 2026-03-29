"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { SERVICE_CATEGORIES } from "@/lib/service-catalog"
import type { ServiceCategory } from "@/lib/business-shared"
import { formatCurrency, getServiceCategoryLabel } from "@/lib/business-shared"
import { Clock3, Pencil, Plus, Scissors, Search, Trash2 } from "lucide-react"

interface ServiceSummary {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
  bookings: number
  category: ServiceCategory | null
}

interface ServicesPageClientProps {
  businessName: string
  isLive: boolean
  services: ServiceSummary[]
}

interface ServiceFormState {
  name: string
  description: string
  price: string
  category: ServiceCategory
}

const INITIAL_FORM: ServiceFormState = {
  name: "",
  description: "",
  price: "",
  category: "corte",
}

function categoryBadgeClassName(category: ServiceCategory | null) {
  switch (category) {
    case "corte":
      return "bg-sky-100 text-sky-900"
    case "coloraciones":
      return "bg-fuchsia-100 text-fuchsia-900"
    case "tratamiento":
      return "bg-emerald-100 text-emerald-900"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

export function ServicesPageClient({ businessName, isLive, services }: ServicesPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [formState, setFormState] = useState<ServiceFormState>(INITIAL_FORM)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const normalizedSearch = searchTerm.toLowerCase()
      const matchesSearch =
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description?.toLowerCase().includes(normalizedSearch) ||
        getServiceCategoryLabel(service.category).toLowerCase().includes(normalizedSearch)

      const matchesCategory = categoryFilter === "all" || service.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, searchTerm, services])

  const averageTicket =
    services.length > 0 ? services.reduce((total, service) => total + service.price, 0) / services.length : 0

  function resetForm() {
    setFormState(INITIAL_FORM)
    setEditingServiceId(null)
    setErrorMessage(null)
  }

  function openCreateDialog() {
    resetForm()
    setIsDialogOpen(true)
  }

  function openEditDialog(service: ServiceSummary) {
    setFormState({
      name: service.name,
      description: service.description ?? "",
      price: String(service.price),
      category: service.category ?? "corte",
    })
    setEditingServiceId(service.id)
    setErrorMessage(null)
    setIsDialogOpen(true)
  }

  async function submitForm() {
    setErrorMessage(null)
    setFeedback(null)

    const endpoint = editingServiceId ? `/api/services/${editingServiceId}` : "/api/services"
    const method = editingServiceId ? "PATCH" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formState.name,
        description: formState.description,
        price: Number(formState.price),
        category: formState.category,
      }),
    })

    const body = (await response.json().catch(() => null)) as { error?: string } | null

    if (!response.ok) {
      setErrorMessage(body?.error ?? "No se pudo guardar el servicio.")
      return
    }

    setIsDialogOpen(false)
    resetForm()
    setFeedback(editingServiceId ? "Servicio actualizado." : "Servicio creado.")
    startTransition(() => {
      router.refresh()
    })
  }

  async function handleDelete(service: ServiceSummary) {
    const confirmed = window.confirm(`Se va a eliminar "${service.name}". Esta acción no se puede deshacer.`)

    if (!confirmed) {
      return
    }

    setErrorMessage(null)
    setFeedback(null)

    const response = await fetch(`/api/services/${service.id}`, { method: "DELETE" })
    const body = (await response.json().catch(() => null)) as { error?: string } | null

    if (!response.ok) {
      setErrorMessage(body?.error ?? "No se pudo eliminar el servicio.")
      return
    }

    setFeedback("Servicio eliminado.")
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Servicios</h1>
          <p className="text-slate-600">
            {businessName} mantiene este catálogo compartido entre el sitio público y el panel.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
            {isLive ? "Catálogo en vivo" : "Catálogo demo"}
          </Badge>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
          </Button>
        </div>
      </div>

      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {feedback}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {errorMessage}
        </div>
      ) : null}

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
          <CardDescription>Filtra por nombre, descripción o categoría</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej: corte, balayage, nanoplastia..."
              value={searchTerm}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-56">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {SERVICE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {getServiceCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo</CardTitle>
          <CardDescription>Estos servicios son los que ve `ns-barber` al momento de reservar</CardDescription>
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
                  <TableHead>Categoría</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Reservas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24 text-right">Acciones</TableHead>
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
                      <Badge className={categoryBadgeClassName(service.category)}>
                        {getServiceCategoryLabel(service.category)}
                      </Badge>
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(service)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingServiceId ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
            <DialogDescription>
              El panel guarda nombre, descripción, costo y categoría. La duración se deriva automáticamente según la categoría.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Nombre</Label>
              <Input
                id="service-name"
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">Descripción</Label>
              <Textarea
                id="service-description"
                rows={4}
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-price">Costo</Label>
                <Input
                  id="service-price"
                  inputMode="decimal"
                  placeholder="26000"
                  value={formState.price}
                  onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) =>
                    setFormState((current) => ({ ...current, category: value as ServiceCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getServiceCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={isPending} onClick={() => void submitForm()}>
              {editingServiceId ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

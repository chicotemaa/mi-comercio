"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SERVICE_CATEGORIES } from "@/lib/service-catalog"
import { formatCurrency, getServiceCategoryLabel } from "@/lib/business-shared"
import { Plus, Search } from "lucide-react"

import { ServiceDeleteDialog } from "./_components/service-delete-dialog"
import { ServiceFeedbackDialog } from "./_components/service-feedback-dialog"
import { ServiceFormDialog } from "./_components/service-form-dialog"
import { ServicesTable } from "./_components/services-table"
import type { ServiceSummary } from "./service-types"
import { useServicesController } from "./use-services-controller"

interface ServicesPageClientProps {
  businessName: string
  isLive: boolean
  services: ServiceSummary[]
}

export function ServicesPageClient({ businessName, isLive, services }: ServicesPageClientProps) {
  const controller = useServicesController(services)

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
          <Button onClick={controller.openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
          </Button>
        </div>
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
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(controller.averageTicket)}</div>
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
              onChange={(event) => controller.setSearchTerm(event.target.value)}
              placeholder="Ej: corte, balayage, nanoplastia..."
              value={controller.searchTerm}
            />
          </div>
          <Select value={controller.categoryFilter} onValueChange={controller.setCategoryFilter}>
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
          {controller.filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
              No hay servicios que coincidan con la búsqueda.
            </div>
          ) : (
            <ServicesTable
              onDelete={controller.openDeleteDialog}
              onEdit={controller.openEditDialog}
              services={controller.filteredServices}
            />
          )}
        </CardContent>
      </Card>

      <ServiceFormDialog
        errorMessage={controller.formError}
        formState={controller.formState}
        isOpen={controller.isFormOpen}
        isSubmitting={controller.isSubmitting || controller.isRefreshing}
        onOpenChange={controller.handleFormOpenChange}
        onSubmit={() => void controller.submitForm()}
        onUpdateField={controller.updateFormField}
        serviceBeingEdited={controller.editingService}
      />

      <ServiceDeleteDialog
        isDeleting={controller.isDeleting || controller.isRefreshing}
        onConfirm={() => void controller.confirmDelete()}
        onOpenChange={(open) => {
          if (!open) {
            controller.closeDeleteDialog()
          }
        }}
        service={controller.selectedServiceToDelete}
      />

      <ServiceFeedbackDialog
        feedback={controller.feedbackState}
        onOpenChange={(open) => {
          if (!open) {
            controller.closeFeedbackDialog()
          }
        }}
      />
    </div>
  )
}

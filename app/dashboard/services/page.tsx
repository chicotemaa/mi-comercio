"use client"

import { SetStateAction, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, Clock, DollarSign } from "lucide-react"

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Corte de cabello",
      category: "Cabello",
      duration: 45,
      price: 25.0,
      description: "Corte personalizado según el estilo del cliente",
      active: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Manicura completa",
      category: "Uñas",
      duration: 60,
      price: 20.0,
      description: "Manicura con esmaltado y diseño básico",
      active: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Peinado para eventos",
      category: "Cabello",
      duration: 90,
      price: 45.0,
      description: "Peinado elegante para ocasiones especiales",
      active: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Tratamiento facial",
      category: "Facial",
      duration: 75,
      price: 35.0,
      description: "Limpieza profunda y hidratación facial",
      active: false,
      image: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<{
    id: number
    name: string
    category: string
    duration: number
    price: number
    description: string
    active: boolean
    image: string
  } | null>(null)

  const categories = ["Cabello", "Uñas", "Facial", "Corporal", "Depilación"]

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddService = () => {
    setEditingService(null)
    setIsDialogOpen(true)
  }

  const handleEditService = (service: {
    id: number
    name: string
    category: string
    duration: number
    price: number
    description: string
    active: boolean
    image: string
  }) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDeleteService = (serviceId: number) => {
    setServices(services.filter((s) => s.id !== serviceId))
  }

  const toggleServiceStatus = (serviceId: number) => {
    setServices(services.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s)))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600">Administra los servicios de tu negocio</p>
        </div>
        <Button onClick={handleAddService}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios ({filteredServices.length})</CardTitle>
          <CardDescription>Lista de todos los servicios disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {service.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />${service.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={service.active} onCheckedChange={() => toggleServiceStatus(service.id)} />
                      <span className="text-sm">{service.active ? "Activo" : "Inactivo"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
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

      {/* Dialog para crear/editar servicio */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingService ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Modifica los datos del servicio" : "Completa la información del nuevo servicio"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Nombre del servicio</Label>
                <Input id="service-name" placeholder="Ej: Corte de cabello" defaultValue={editingService?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-category">Categoría</Label>
                <Select defaultValue={editingService?.category || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-duration">Duración (min)</Label>
                  <Input
                    id="service-duration"
                    type="number"
                    placeholder="60"
                    defaultValue={editingService?.duration || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-price">Precio ($)</Label>
                  <Input
                    id="service-price"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    defaultValue={editingService?.price || ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-description">Descripción</Label>
                <Textarea
                  id="service-description"
                  placeholder="Describe el servicio..."
                  rows={3}
                  defaultValue={editingService?.description || ""}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Imagen del servicio</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Arrastra una imagen aquí</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Configuración adicional</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Servicio activo</span>
                    <Switch defaultChecked={editingService?.active ?? true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Requiere cita previa</span>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Permite cancelación</span>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingService ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

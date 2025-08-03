"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Search, Calendar, Clock, User, Mail, Phone } from "lucide-react"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "María García",
      email: "maria@salon.com",
      phone: "+54 11 1111-1111",
      role: "Estilista Senior",
      services: ["Corte de cabello", "Peinado", "Tratamientos"],
      schedule: {
        monday: { start: "09:00", end: "17:00", active: true },
        tuesday: { start: "09:00", end: "17:00", active: true },
        wednesday: { start: "09:00", end: "17:00", active: true },
        thursday: { start: "09:00", end: "17:00", active: true },
        friday: { start: "09:00", end: "17:00", active: true },
        saturday: { start: "09:00", end: "14:00", active: true },
        sunday: { start: "", end: "", active: false },
      },
      active: true,
      joinDate: "2023-01-15",
      totalAppointments: 245,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Juan Pérez",
      email: "juan@salon.com",
      phone: "+54 11 2222-2222",
      role: "Barbero",
      services: ["Corte masculino", "Barba y bigote", "Afeitado"],
      schedule: {
        monday: { start: "10:00", end: "18:00", active: true },
        tuesday: { start: "10:00", end: "18:00", active: true },
        wednesday: { start: "", end: "", active: false },
        thursday: { start: "10:00", end: "18:00", active: true },
        friday: { start: "10:00", end: "18:00", active: true },
        saturday: { start: "09:00", end: "15:00", active: true },
        sunday: { start: "", end: "", active: false },
      },
      active: true,
      joinDate: "2023-03-20",
      totalAppointments: 189,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Ana Silva",
      email: "ana@salon.com",
      phone: "+54 11 3333-3333",
      role: "Especialista en Uñas",
      services: ["Manicura", "Pedicura", "Nail Art"],
      schedule: {
        monday: { start: "09:00", end: "16:00", active: true },
        tuesday: { start: "09:00", end: "16:00", active: true },
        wednesday: { start: "09:00", end: "16:00", active: true },
        thursday: { start: "09:00", end: "16:00", active: true },
        friday: { start: "09:00", end: "16:00", active: true },
        saturday: { start: "", end: "", active: false },
        sunday: { start: "", end: "", active: false },
      },
      active: true,
      joinDate: "2023-06-10",
      totalAppointments: 156,
      rating: 4.9,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<null | typeof employees[0]>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<null | typeof employees[0]>(null)

  const services = ["Corte de cabello", "Peinado", "Manicura", "Pedicura", "Barba y bigote", "Tratamientos", "Nail Art"]
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: typeof employees[0]) => {
      setEditingEmployee(employee)
      setIsDialogOpen(true)
  }

  const toggleEmployeeStatus = (employeeId: number) => {
    setEmployees(employees.map((emp) => (emp.id === employeeId ? { ...emp, active: !emp.active } : emp)))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600">Administra tu equipo de trabajo</p>
        </div>
        <Button onClick={handleAddEmployee}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">{employees.filter((e) => e.active).length} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas completadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.reduce((sum, emp) => sum + emp.totalAppointments, 0)}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Promedio semanal</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de empleados */}
      <Card>
        <CardHeader>
          <CardTitle>Empleados ({filteredEmployees.length})</CardTitle>
          <CardDescription>Gestiona tu equipo de trabajo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Citas completadas</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {employee.services.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{employee.services.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{employee.totalAppointments}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{employee.rating}</span>
                      <span className="text-gray-400 ml-1">/5.0</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={employee.active} onCheckedChange={() => toggleEmployeeStatus(employee.id)} />
                      <span className="text-sm">{employee.active ? "Activo" : "Inactivo"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(employee)}>
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
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

      {/* Dialog para crear/editar empleado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
            <DialogDescription>
              {editingEmployee ? "Modifica los datos del empleado" : "Completa la información del nuevo empleado"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="schedule">Horarios</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-name">Nombre completo</Label>
                    <Input
                      id="employee-name"
                      placeholder="Ej: María García"
                      defaultValue={editingEmployee?.name || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      placeholder="maria@salon.com"
                      defaultValue={editingEmployee?.email || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-phone">Teléfono</Label>
                    <Input
                      id="employee-phone"
                      placeholder="+54 11 1234-5678"
                      defaultValue={editingEmployee?.phone || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-role">Rol/Especialidad</Label>
                    <Select defaultValue={editingEmployee?.role || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Estilista Senior">Estilista Senior</SelectItem>
                        <SelectItem value="Estilista Junior">Estilista Junior</SelectItem>
                        <SelectItem value="Barbero">Barbero</SelectItem>
                        <SelectItem value="Especialista en Uñas">Especialista en Uñas</SelectItem>
                        <SelectItem value="Masajista">Masajista</SelectItem>
                        <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Foto del empleado</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                        <AvatarFallback>
                          <Plus className="w-8 h-8 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-gray-600">Arrastra una foto aquí</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Seleccionar archivo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado del empleado</Label>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked={editingEmployee?.active ?? true} />
                      <span className="text-sm">Empleado activo</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Servicios que puede realizar</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona los servicios que este empleado está capacitado para realizar
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {services.map((service) => (
                    <label key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={editingEmployee?.services.includes(service)}
                        className="rounded"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Horarios de trabajo</Label>
                <p className="text-sm text-gray-600 mb-4">Define los horarios de trabajo para cada día de la semana</p>
                <div className="space-y-4">
                  {days.map((day, index) => (
                    <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-20">
                        <Switch defaultChecked={editingEmployee?.schedule[day as keyof typeof editingEmployee.schedule]?.active ?? false} />
                      </div>
                      <div className="w-24 font-medium">{dayNames[index]}</div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue={editingEmployee?.schedule[day as keyof typeof editingEmployee.schedule]?.start || "09:00"}
                          className="w-32"
                        />
                        <span>a</span>
                        <Input
                          type="time"
                          defaultValue={editingEmployee?.schedule[day as keyof typeof editingEmployee.schedule]?.end || "17:00"}
                          className="w-32"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingEmployee ? "Guardar cambios" : "Crear empleado"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver calendario del empleado */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Calendario de {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>Horarios y disponibilidad del empleado</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Información del empleado</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.role}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Estadísticas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Citas completadas:</span>
                      <span className="text-sm font-medium">{selectedEmployee.totalAppointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Calificación:</span>
                      <span className="text-sm font-medium">{selectedEmployee.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Desde:</span>
                      <span className="text-sm font-medium">{selectedEmployee.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Horarios de trabajo</h4>
                <div className="space-y-2">
                  {days.map((day, index) => {
                    const schedule = selectedEmployee.schedule[day as keyof typeof selectedEmployee.schedule]
                    return (
                      <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{dayNames[index]}</span>
                        {schedule.active ? (
                          <span className="text-sm text-green-600">
                            {schedule.start} - {schedule.end}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No disponible</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Servicios</h4>
                <div className="flex flex-wrap gap-2">
                {selectedEmployee.services.map((service: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {service}
                  </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
              Cerrar
            </Button>
            <Button onClick={() => selectedEmployee && handleEditEmployee(selectedEmployee)}>Editar empleado</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

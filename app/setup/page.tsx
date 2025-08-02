"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, Upload, Plus, Trash2 } from "lucide-react"

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [services, setServices] = useState([{ name: "", duration: "", price: "", description: "" }])
  const [employees, setEmployees] = useState([{ name: "", email: "", services: [] }])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const addService = () => {
    setServices([...services, { name: "", duration: "", price: "", description: "" }])
  }

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index))
  }

  const addEmployee = () => {
    setEmployees([...employees, { name: "", email: "", services: [] }])
  }

  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      window.location.href = "/dashboard"
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración inicial</h1>
          <p className="text-gray-600">Configura tu negocio en pocos pasos</p>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              Paso {currentStep} de {totalSteps}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Información básica"}
              {currentStep === 2 && "Servicios y horarios"}
              {currentStep === 3 && "Facturación y pagos"}
              {currentStep === 4 && "Empleados"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Cuéntanos sobre tu negocio"}
              {currentStep === 2 && "Define tus servicios y horarios de atención"}
              {currentStep === 3 && "Configura los métodos de pago"}
              {currentStep === 4 && "Añade a tu equipo de trabajo"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nombre del negocio</Label>
                  <Input id="business-name" placeholder="Ej: Salón de Belleza María" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-logo">Logo del negocio</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Arrastra tu logo aquí o haz clic para seleccionar</p>
                    <Button variant="outline" className="mt-2 bg-transparent">
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-description">Descripción</Label>
                  <Textarea
                    id="business-description"
                    placeholder="Describe brevemente tu negocio y servicios"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-category">Rubro</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el rubro de tu negocio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beauty">Belleza y Estética</SelectItem>
                      <SelectItem value="health">Salud y Bienestar</SelectItem>
                      <SelectItem value="fitness">Fitness y Deporte</SelectItem>
                      <SelectItem value="automotive">Automotriz</SelectItem>
                      <SelectItem value="professional">Servicios Profesionales</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Horarios de atención</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hora de apertura</Label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora de cierre</Label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Servicios iniciales</h3>
                    <Button onClick={addService} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir servicio
                    </Button>
                  </div>
                  {services.map((service, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre del servicio</Label>
                          <Input
                            placeholder="Ej: Corte de cabello"
                            value={service.name}
                            onChange={(e) => {
                              const newServices = [...services]
                              newServices[index].name = e.target.value
                              setServices(newServices)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duración (minutos)</Label>
                          <Input
                            type="number"
                            placeholder="60"
                            value={service.duration}
                            onChange={(e) => {
                              const newServices = [...services]
                              newServices[index].duration = e.target.value
                              setServices(newServices)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Precio</Label>
                          <Input
                            type="number"
                            placeholder="25.00"
                            value={service.price}
                            onChange={(e) => {
                              const newServices = [...services]
                              newServices[index].price = e.target.value
                              setServices(newServices)
                            }}
                          />
                        </div>
                        <div className="space-y-2 flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(index)}
                            disabled={services.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label>Descripción</Label>
                        <Textarea
                          placeholder="Describe el servicio"
                          rows={2}
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...services]
                            newServices[index].description = e.target.value
                            setServices(newServices)
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Datos de facturación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Razón social</Label>
                      <Input placeholder="Nombre de la empresa" />
                    </div>
                    <div className="space-y-2">
                      <Label>CUIT/CUIL</Label>
                      <Input placeholder="20-12345678-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Dirección fiscal</Label>
                    <Input placeholder="Dirección completa" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Métodos de pago</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Access Token de Mercado Pago</Label>
                      <Input placeholder="APP_USR-..." type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key de Unicobros (opcional)</Label>
                      <Input placeholder="uk_..." type="password" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Empleados</h3>
                    <Button onClick={addEmployee} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir empleado
                    </Button>
                  </div>
                  {employees.map((employee, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre completo</Label>
                          <Input
                            placeholder="Ej: Ana García"
                            value={employee.name}
                            onChange={(e) => {
                              const newEmployees = [...employees]
                              newEmployees[index].name = e.target.value
                              setEmployees(newEmployees)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="ana@email.com"
                            value={employee.email}
                            onChange={(e) => {
                              const newEmployees = [...employees]
                              newEmployees[index].email = e.target.value
                              setEmployees(newEmployees)
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label>Servicios que realiza</Label>
                        <div className="flex flex-wrap gap-2">
                          {services.map((service, serviceIndex) => (
                            <Badge key={serviceIndex} variant="outline" className="cursor-pointer">
                              {service.name || `Servicio ${serviceIndex + 1}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {employees.length > 1 && (
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => removeEmployee(index)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar empleado
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">¡Casi listo!</h4>
                  </div>
                  <p className="text-green-700 mt-1">
                    Una vez completada la configuración, podrás acceder a tu panel de administración.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button onClick={nextStep}>
            {currentStep === totalSteps ? "Finalizar configuración" : "Siguiente"}
            {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

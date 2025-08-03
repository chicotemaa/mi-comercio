"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Scissors } from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last30days")

  const revenueData = [
    { period: "Ene", revenue: 2400, appointments: 45 },
    { period: "Feb", revenue: 2800, appointments: 52 },
    { period: "Mar", revenue: 3200, appointments: 58 },
    { period: "Abr", revenue: 2900, appointments: 48 },
    { period: "May", revenue: 3600, appointments: 65 },
    { period: "Jun", revenue: 4100, appointments: 72 },
  ]

  const topServices = [
    { service: "Corte de cabello", bookings: 156, revenue: 3900, percentage: 35 },
    { service: "Manicura", bookings: 89, revenue: 2225, percentage: 20 },
    { service: "Peinado", bookings: 67, revenue: 3015, percentage: 27 },
    { service: "Barba y bigote", bookings: 45, revenue: 900, percentage: 8 },
    { service: "Tratamiento facial", bookings: 23, revenue: 1150, percentage: 10 },
  ]

  const employeeStats = [
    { name: "María García", appointments: 89, revenue: 3115, rating: 4.8, efficiency: 92 },
    { name: "Juan Pérez", appointments: 67, revenue: 1675, rating: 4.6, efficiency: 88 },
    { name: "Ana Silva", appointments: 54, revenue: 1890, rating: 4.9, efficiency: 95 },
  ]

  const clientStats = {
    total: 245,
    new: 23,
    returning: 222,
    retention: 91,
    avgSpending: 28.5,
    topClients: [
      { name: "Ana Rodríguez", visits: 12, spent: 420 },
      { name: "Laura Martín", visits: 15, spent: 375 },
      { name: "Carlos López", visits: 8, spent: 160 },
    ],
  }

  const exportReport = (format: string) => {
    // Simular exportación
    console.log(`Exportando reporte en formato ${format}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600">Analiza el rendimiento de tu negocio</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport("csv")}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport("pdf")}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 días</SelectItem>
                  <SelectItem value="last30days">Últimos 30 días</SelectItem>
                  <SelectItem value="last3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="lastyear">Último año</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Desde</Label>
              <Input type="date" defaultValue="2024-01-01" />
            </div>
            <div className="space-y-2">
              <Label>Hasta</Label>
              <Input type="date" defaultValue="2024-01-31" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18,450</div>
                <p className="text-xs text-muted-foreground">+15% vs período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de citas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">340</div>
                <p className="text-xs text-muted-foreground">+8% vs período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes únicos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+12% vs período anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$54.26</div>
                <p className="text-xs text-muted-foreground">+3% vs período anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de ingresos</CardTitle>
                <CardDescription>Ingresos mensuales de los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-64 space-x-2">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(data.revenue / 4100) * 100}%` }}
                      />
                      <div className="text-xs mt-2 text-gray-600">{data.period}</div>
                      <div className="text-xs font-semibold">${data.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por servicios</CardTitle>
                <CardDescription>Ingresos por tipo de servicio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServices.slice(0, 4).map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                        <span className="text-sm">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${service.revenue}</div>
                        <div className="text-xs text-gray-500">{service.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ingresos detallados</CardTitle>
                <CardDescription>Análisis mensual de ingresos y citas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{data.period} 2024</h4>
                          <p className="text-sm text-gray-600">{data.appointments} citas completadas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">${data.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          ${(data.revenue / data.appointments).toFixed(2)} promedio
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de pago</CardTitle>
                <CardDescription>Distribución de ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: "Mercado Pago", amount: 8300, percentage: 45 },
                    { method: "Efectivo", amount: 5535, percentage: 30 },
                    { method: "Tarjeta", amount: 3690, percentage: 20 },
                    { method: "Transferencia", amount: 925, percentage: 5 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{item.method}</span>
                        <span className="text-sm font-semibold">${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <div className="text-xs text-gray-500">{item.percentage}% del total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por servicio</CardTitle>
              <CardDescription>Análisis detallado de cada servicio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Scissors className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{service.service}</h4>
                        <p className="text-sm text-gray-600">{service.bookings} reservas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${service.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{service.percentage}% del total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Servicios más demandados</CardTitle>
                <CardDescription>Por número de reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 space-x-2">
                  {topServices.slice(0, 5).map((service, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(service.bookings / 156) * 100}%` }}
                      />
                      <div className="text-xs mt-2 text-gray-600 text-center">{service.service.split(" ")[0]}</div>
                      <div className="text-xs font-semibold">{service.bookings}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horarios más ocupados</CardTitle>
                <CardDescription>Distribución por franja horaria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "09:00 - 11:00", bookings: 45, percentage: 25 },
                    { time: "11:00 - 13:00", bookings: 67, percentage: 37 },
                    { time: "13:00 - 15:00", bookings: 34, percentage: 19 },
                    { time: "15:00 - 17:00", bookings: 56, percentage: 31 },
                    { time: "17:00 - 19:00", bookings: 23, percentage: 13 },
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{slot.time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${slot.percentage}%` }} />
                        </div>
                        <span className="text-sm font-semibold w-8">{slot.bookings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento del equipo</CardTitle>
              <CardDescription>Estadísticas de cada empleado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeStats.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{employee.name}</h4>
                        <p className="text-sm text-gray-600">
                          {employee.appointments} citas • ⭐ {employee.rating}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${employee.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{employee.efficiency}% eficiencia</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Citas por empleado</CardTitle>
                <CardDescription>Distribución de la carga de trabajo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 space-x-2">
                  {employeeStats.map((employee, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-purple-500 rounded-t"
                        style={{ height: `${(employee.appointments / 89) * 100}%` }}
                      />
                      <div className="text-xs mt-2 text-gray-600 text-center">{employee.name.split(" ")[0]}</div>
                      <div className="text-xs font-semibold">{employee.appointments}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calificaciones promedio</CardTitle>
                <CardDescription>Satisfacción del cliente por empleado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employeeStats.map((employee, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{employee.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full mr-1 ${
                                i < Math.floor(employee.rating) ? "bg-yellow-400" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{employee.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientStats.total}</div>
                <p className="text-xs text-muted-foreground">Base de clientes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes nuevos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientStats.new}</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de retención</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientStats.retention}%</div>
                <p className="text-xs text-muted-foreground">Clientes recurrentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gasto promedio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${clientStats.avgSpending}</div>
                <p className="text-xs text-muted-foreground">Por cliente</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mejores clientes</CardTitle>
                <CardDescription>Por valor total gastado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientStats.topClients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.visits} visitas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${client.spent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmentación de clientes</CardTitle>
                <CardDescription>Por frecuencia de visitas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { segment: "VIP (10+ visitas)", count: 15, percentage: 6 },
                    { segment: "Frecuentes (5-9 visitas)", count: 45, percentage: 18 },
                    { segment: "Regulares (2-4 visitas)", count: 98, percentage: 40 },
                    { segment: "Nuevos (1 visita)", count: 87, percentage: 36 },
                  ].map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{segment.segment}</span>
                        <span className="text-sm font-semibold">{segment.count} clientes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${segment.percentage}%` }} />
                      </div>
                      <div className="text-xs text-gray-500">{segment.percentage}% del total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

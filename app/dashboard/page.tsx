import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Users, TrendingUp, Clock, Eye } from "lucide-react"

export default function DashboardPage() {
  const todayAppointments = [
    {
      id: 1,
      client: "Ana Rodríguez",
      service: "Corte y peinado",
      time: "10:00",
      employee: "María",
      status: "confirmed",
      phone: "+54 11 1234-5678",
    },
    {
      id: 2,
      client: "Carlos López",
      service: "Barba y bigote",
      time: "11:30",
      employee: "Juan",
      status: "pending",
      phone: "+54 11 8765-4321",
    },
    {
      id: 3,
      client: "Laura Martín",
      service: "Manicura",
      time: "14:00",
      employee: "Ana",
      status: "confirmed",
      phone: "+54 11 5555-0000",
    },
    {
      id: 4,
      client: "Roberto Silva",
      service: "Corte de cabello",
      time: "16:30",
      employee: "María",
      status: "confirmed",
      phone: "+54 11 9999-1111",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu negocio hoy</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas de hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-xs text-muted-foreground">+15% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de ausentismo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8%</div>
            <p className="text-xs text-muted-foreground">-2% desde la semana pasada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios más solicitados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Corte</div>
            <p className="text-xs text-muted-foreground">45% del total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas citas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximas citas de hoy</CardTitle>
            <CardDescription>Gestiona las citas programadas para hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.client}</h4>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{appointment.time}</span>
                        <span>•</span>
                        <span>{appointment.employee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen semanal</CardTitle>
            <CardDescription>Estadísticas de los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total de citas</span>
              <span className="font-semibold">84</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Ingresos totales</span>
              <span className="font-semibold">$16,800</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Nuevos clientes</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Servicios realizados</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 mb-2">Servicios más populares</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Corte de cabello</span>
                  <span>38</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Manicura</span>
                  <span>24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Peinado</span>
                  <span>18</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico simple de citas por día */}
      <Card>
        <CardHeader>
          <CardTitle>Citas por día (última semana)</CardTitle>
          <CardDescription>Visualización de la actividad semanal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 space-x-2">
            {[
              { day: "Lun", appointments: 8 },
              { day: "Mar", appointments: 12 },
              { day: "Mié", appointments: 15 },
              { day: "Jue", appointments: 10 },
              { day: "Vie", appointments: 18 },
              { day: "Sáb", appointments: 14 },
              { day: "Dom", appointments: 7 },
            ].map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(data.appointments / 18) * 100}%` }}
                />
                <div className="text-xs mt-2 text-gray-600">{data.day}</div>
                <div className="text-xs font-semibold">{data.appointments}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

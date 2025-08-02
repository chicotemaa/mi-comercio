"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  CreditCard,
  DollarSign,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)

  const payments = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      client: "Ana Rodríguez",
      service: "Corte y peinado",
      amount: 35.0,
      method: "Mercado Pago",
      status: "completed",
      date: "2024-01-15",
      time: "10:30",
      employee: "María García",
      transactionId: "MP-123456789",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      client: "Carlos López",
      service: "Barba y bigote",
      amount: 20.0,
      method: "Efectivo",
      status: "completed",
      date: "2024-01-15",
      time: "11:45",
      employee: "Juan Pérez",
      transactionId: null,
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      client: "Laura Martín",
      service: "Manicura completa",
      amount: 25.0,
      method: "Tarjeta",
      status: "pending",
      date: "2024-01-16",
      time: "14:00",
      employee: "Ana Silva",
      transactionId: "TC-987654321",
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      client: "Roberto Silva",
      service: "Corte de cabello",
      amount: 25.0,
      method: "Transferencia",
      status: "failed",
      date: "2024-01-16",
      time: "09:15",
      employee: "María García",
      transactionId: "TR-456789123",
    },
  ]

  const invoices = [
    {
      id: 1,
      number: "INV-2024-001",
      client: "Ana Rodríguez",
      amount: 35.0,
      date: "2024-01-15",
      dueDate: "2024-01-30",
      status: "paid",
      items: [{ service: "Corte y peinado", quantity: 1, price: 35.0 }],
    },
    {
      id: 2,
      number: "INV-2024-002",
      client: "Carlos López",
      amount: 20.0,
      date: "2024-01-15",
      dueDate: "2024-01-30",
      status: "paid",
      items: [{ service: "Barba y bigote", quantity: 1, price: 20.0 }],
    },
    {
      id: 3,
      number: "INV-2024-003",
      client: "Laura Martín",
      amount: 25.0,
      date: "2024-01-16",
      dueDate: "2024-01-31",
      status: "pending",
      items: [{ service: "Manicura completa", quantity: 1, price: 25.0 }],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "paid":
        return "Pagada"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallido"
      case "overdue":
        return "Vencida"
      default:
        return "Desconocido"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "failed":
      case "overdue":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagos y Facturación</h1>
          <p className="text-gray-600">Gestiona los pagos e invoices de tu negocio</p>
        </div>
        <Button onClick={() => setIsInvoiceDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending").length} pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas emitidas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de cobro</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Pagos exitosos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar pagos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="completed">Completados</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="failed">Fallidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de pagos */}
          <Card>
            <CardHeader>
              <CardTitle>Pagos recibidos ({filteredPayments.length})</CardTitle>
              <CardDescription>Historial de todos los pagos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">
                            {payment.date} {payment.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell>{payment.service}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                          {payment.method}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span>{getStatusText(payment.status)}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
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

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Facturas emitidas ({invoices.length})</CardTitle>
              <CardDescription>Gestiona las facturas de tu negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha emisión</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="font-medium">{invoice.number}</div>
                      </TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <div className="font-semibold">${invoice.amount.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="w-4 h-4" />
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

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por método de pago</CardTitle>
                <CardDescription>Distribución de pagos por método</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: "Mercado Pago", amount: 450, percentage: 45 },
                    { method: "Efectivo", amount: 300, percentage: 30 },
                    { method: "Tarjeta", amount: 200, percentage: 20 },
                    { method: "Transferencia", amount: 50, percentage: 5 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 bg-blue-500 rounded"
                          style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                        />
                        <span className="text-sm">{item.method}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.amount}</div>
                        <div className="text-xs text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencia de ingresos</CardTitle>
                <CardDescription>Últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 space-x-2">
                  {[
                    { day: "Lun", amount: 120 },
                    { day: "Mar", amount: 180 },
                    { day: "Mié", amount: 220 },
                    { day: "Jue", amount: 160 },
                    { day: "Vie", amount: 280 },
                    { day: "Sáb", amount: 240 },
                    { day: "Dom", amount: 100 },
                  ].map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(data.amount / 280) * 100}%` }}
                      />
                      <div className="text-xs mt-2 text-gray-600">{data.day}</div>
                      <div className="text-xs font-semibold">${data.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver detalles del pago */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del pago</DialogTitle>
            <DialogDescription>Información completa de la transacción</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Información del pago</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Factura:</span>
                      <span className="text-sm font-medium">{selectedPayment.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cliente:</span>
                      <span className="text-sm font-medium">{selectedPayment.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Servicio:</span>
                      <span className="text-sm font-medium">{selectedPayment.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Empleado:</span>
                      <span className="text-sm font-medium">{selectedPayment.employee}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Detalles de la transacción</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Método:</span>
                      <span className="text-sm font-medium">{selectedPayment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Importe:</span>
                      <span className="text-sm font-medium">${selectedPayment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fecha:</span>
                      <span className="text-sm font-medium">
                        {selectedPayment.date} {selectedPayment.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estado:</span>
                      <Badge className={getStatusColor(selectedPayment.status)}>
                        {getStatusText(selectedPayment.status)}
                      </Badge>
                    </div>
                    {selectedPayment.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID Transacción:</span>
                        <span className="text-sm font-mono">{selectedPayment.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedPayment(null)}>
              Cerrar
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Descargar recibo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para nueva factura */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Factura</DialogTitle>
            <DialogDescription>Crea una nueva factura para un cliente</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-client">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana">Ana Rodríguez</SelectItem>
                    <SelectItem value="carlos">Carlos López</SelectItem>
                    <SelectItem value="laura">Laura Martín</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-date">Fecha de emisión</Label>
                <Input id="invoice-date" type="date" defaultValue="2024-01-16" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-due">Fecha de vencimiento</Label>
                <Input id="invoice-due" type="date" defaultValue="2024-01-31" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Servicios</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Corte de cabello</span>
                    <span className="text-sm font-medium">$25.00</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar servicio
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm">$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">IVA (21%):</span>
                  <span className="text-sm">$5.25</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>$30.25</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsInvoiceDialogOpen(false)}>Crear factura</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

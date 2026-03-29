"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ExpenseRecord, PaymentRecord, PayoutRecord } from "@/lib/business-shared"
import {
  formatCurrency,
  formatDisplayDate,
  getPaymentMethodLabel,
  getPaymentStatusBadgeClassName,
  getPaymentStatusLabel,
} from "@/lib/business-shared"
import { ArrowDownCircle, ArrowUpCircle, Eye, Search, Wallet } from "lucide-react"

interface PaymentsPageClientProps {
  businessName: string
  expenses: ExpenseRecord[]
  isLive: boolean
  payments: PaymentRecord[]
  payouts: PayoutRecord[]
  timeZone: string
}

type SelectedMovement =
  | { kind: "payment"; data: PaymentRecord }
  | { kind: "expense"; data: ExpenseRecord }
  | { kind: "payout"; data: PayoutRecord }
  | null

export function PaymentsPageClient({
  businessName,
  expenses,
  isLive,
  payments,
  payouts,
  timeZone,
}: PaymentsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMovement, setSelectedMovement] = useState<SelectedMovement>(null)

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const haystack = [
        payment.description,
        payment.customerName ?? "",
        payment.staffName ?? "",
        payment.invoiceNumber ?? "",
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch = haystack.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [payments, searchTerm, statusFilter])

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const haystack = [expense.description, expense.category, expense.subcategory ?? "", expense.vendorName ?? ""]
        .join(" ")
        .toLowerCase()

      return haystack.includes(searchTerm.toLowerCase())
    })
  }, [expenses, searchTerm])

  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      const haystack = [payout.recipientName, payout.category, payout.staffName ?? "", payout.notes ?? ""]
        .join(" ")
        .toLowerCase()

      return haystack.includes(searchTerm.toLowerCase())
    })
  }, [payouts, searchTerm])

  const completedRevenue = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const pendingRevenue = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount, 0)
  const netResult = completedRevenue - totalExpenses - totalPayouts

  const paymentMethods = Array.from(
    payments
      .filter((payment) => payment.status === "completed")
      .reduce((map, payment) => {
        map.set(payment.method, (map.get(payment.method) ?? 0) + payment.amount)
        return map
      }, new Map<PaymentRecord["method"], number>()),
  )

  const expenseCategories = Array.from(
    expenses.reduce((map, expense) => {
      map.set(expense.category, (map.get(expense.category) ?? 0) + expense.amount)
      return map
    }, new Map<string, number>()),
  ).sort((left, right) => right[1] - left[1])

  const payoutRecipients = Array.from(
    payouts.reduce((map, payout) => {
      map.set(payout.recipientName, (map.get(payout.recipientName) ?? 0) + payout.amount)
      return map
    }, new Map<string, number>()),
  ).sort((left, right) => right[1] - left[1])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Caja y movimientos</h1>
          <p className="text-slate-600">
            {businessName} {isLive ? "trabaja" : "simula"} cobros, gastos y distribuciones sobre la misma base operativa.
          </p>
        </div>
        <Badge className={isLive ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>
          {isLive ? "Supabase activo" : "Modo demo"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cobrado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(completedRevenue)}</div>
            <p className="text-xs text-slate-500">{payments.filter((payment) => payment.status === "completed").length} cobros</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(pendingRevenue)}</div>
            <p className="text-xs text-slate-500">Cobros sin cerrar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-slate-500">{expenses.length} movimientos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribuciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalPayouts)}</div>
            <p className="text-xs text-slate-500">{payouts.length} salidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resultado neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(netResult)}</div>
            <p className="text-xs text-slate-500">Cobrado menos egresos y distribuciones</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>La búsqueda aplica sobre cobros, gastos y distribuciones</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar movimiento"
              value={searchTerm}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-52">
              <SelectValue placeholder="Estado de cobro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cobros</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="failed">Fallidos</SelectItem>
              <SelectItem value="refunded">Reintegrados</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList>
          <TabsTrigger value="payments">Cobros</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="payouts">Distribuciones</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cobros registrados</CardTitle>
              <CardDescription>{filteredPayments.length} registros encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPayments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                  No hay cobros que coincidan con los filtros.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                      <TableHead className="w-20 text-right">Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDisplayDate(payment.processedAt ?? payment.createdAt, timeZone)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{payment.description}</p>
                            <p className="text-sm text-slate-500">{payment.staffName ?? "Sin staff asociado"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.customerName ?? "Sin cliente asociado"}</TableCell>
                        <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusBadgeClassName(payment.status)}>
                            {getPaymentStatusLabel(payment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedMovement({ kind: "payment", data: payment })}>
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
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gastos del negocio</CardTitle>
              <CardDescription>{filteredExpenses.length} egresos visibles</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                  No hay gastos que coincidan con la búsqueda.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Detalle</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                      <TableHead className="w-20 text-right">Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDisplayDate(expense.expenseDate, timeZone)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{expense.category}</p>
                            <p className="text-sm text-slate-500">{expense.subcategory ?? "Sin subtipo"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.vendorName ?? "Sin proveedor"}</TableCell>
                        <TableCell>{getPaymentMethodLabel(expense.method)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedMovement({ kind: "expense", data: expense })}>
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
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuciones y pagos a terceros</CardTitle>
              <CardDescription>{filteredPayouts.length} movimientos visibles</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPayouts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                  No hay distribuciones que coincidan con la búsqueda.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Destinatario</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                      <TableHead className="w-20 text-right">Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{formatDisplayDate(payout.payoutDate, timeZone)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{payout.recipientName}</p>
                            <p className="text-sm text-slate-500">{payout.staffName ?? payout.recipientType}</p>
                          </div>
                        </TableCell>
                        <TableCell>{payout.category}</TableCell>
                        <TableCell>{getPaymentMethodLabel(payout.method)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(payout.amount)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedMovement({ kind: "payout", data: payout })}>
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
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Cobros por método</CardTitle>
                <CardDescription>Solo pagos completados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map(([method, amount]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{getPaymentMethodLabel(method)}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Sin cobros completados todavía.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gastos por categoría</CardTitle>
                <CardDescription>Top egresos cargados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {expenseCategories.length > 0 ? (
                  expenseCategories.slice(0, 5).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{category}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Sin gastos registrados todavía.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuciones principales</CardTitle>
                <CardDescription>Salidas por destinatario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {payoutRecipients.length > 0 ? (
                  payoutRecipients.slice(0, 5).map(([recipient, amount]) => (
                    <div key={recipient} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{recipient}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Sin distribuciones registradas todavía.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <ArrowDownCircle className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-500">Entrada real</p>
                  <p className="text-xl font-semibold text-slate-900">{formatCurrency(completedRevenue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <ArrowUpCircle className="h-8 w-8 text-rose-600" />
                <div>
                  <p className="text-sm text-slate-500">Salida operativa</p>
                  <p className="text-xl font-semibold text-slate-900">{formatCurrency(totalExpenses + totalPayouts)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <Wallet className="h-8 w-8 text-sky-600" />
                <div>
                  <p className="text-sm text-slate-500">Caja neta</p>
                  <p className="text-xl font-semibold text-slate-900">{formatCurrency(netResult)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={selectedMovement !== null} onOpenChange={() => setSelectedMovement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del movimiento</DialogTitle>
            <DialogDescription>Vista puntual del registro operativo</DialogDescription>
          </DialogHeader>

          {selectedMovement?.kind === "payment" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Concepto:</span> {selectedMovement.data.description}</p>
                  <p><span className="font-medium text-slate-900">Cliente:</span> {selectedMovement.data.customerName ?? "Sin cliente"}</p>
                  <p><span className="font-medium text-slate-900">Staff:</span> {selectedMovement.data.staffName ?? "Sin staff"}</p>
                  <p><span className="font-medium text-slate-900">Factura:</span> {selectedMovement.data.invoiceNumber ?? "Sin factura"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Método:</span> {getPaymentMethodLabel(selectedMovement.data.method)}</p>
                  <p><span className="font-medium text-slate-900">Estado:</span> {getPaymentStatusLabel(selectedMovement.data.status)}</p>
                  <p><span className="font-medium text-slate-900">Fecha:</span> {formatDisplayDate(selectedMovement.data.processedAt ?? selectedMovement.data.createdAt, timeZone)}</p>
                  <p><span className="font-medium text-slate-900">Importe:</span> {formatCurrency(selectedMovement.data.amount)}</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Notas:</span> {selectedMovement.data.notes ?? "Sin notas"}</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {selectedMovement?.kind === "expense" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Categoría:</span> {selectedMovement.data.category}</p>
                  <p><span className="font-medium text-slate-900">Subcategoría:</span> {selectedMovement.data.subcategory ?? "Sin subtipo"}</p>
                  <p><span className="font-medium text-slate-900">Detalle:</span> {selectedMovement.data.description}</p>
                  <p><span className="font-medium text-slate-900">Proveedor:</span> {selectedMovement.data.vendorName ?? "Sin proveedor"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Método:</span> {getPaymentMethodLabel(selectedMovement.data.method)}</p>
                  <p><span className="font-medium text-slate-900">Fecha:</span> {formatDisplayDate(selectedMovement.data.expenseDate, timeZone)}</p>
                  <p><span className="font-medium text-slate-900">Importe:</span> {formatCurrency(selectedMovement.data.amount)}</p>
                  <p><span className="font-medium text-slate-900">Origen:</span> {selectedMovement.data.source}</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Notas:</span> {selectedMovement.data.notes ?? "Sin notas"}</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {selectedMovement?.kind === "payout" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Destinatario:</span> {selectedMovement.data.recipientName}</p>
                  <p><span className="font-medium text-slate-900">Tipo:</span> {selectedMovement.data.recipientType}</p>
                  <p><span className="font-medium text-slate-900">Categoría:</span> {selectedMovement.data.category}</p>
                  <p><span className="font-medium text-slate-900">Staff asociado:</span> {selectedMovement.data.staffName ?? "Sin staff"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Método:</span> {getPaymentMethodLabel(selectedMovement.data.method)}</p>
                  <p><span className="font-medium text-slate-900">Fecha:</span> {formatDisplayDate(selectedMovement.data.payoutDate, timeZone)}</p>
                  <p><span className="font-medium text-slate-900">Importe:</span> {formatCurrency(selectedMovement.data.amount)}</p>
                  <p><span className="font-medium text-slate-900">Origen:</span> {selectedMovement.data.source}</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="pt-6 text-sm text-slate-700">
                  <p><span className="font-medium text-slate-900">Notas:</span> {selectedMovement.data.notes ?? "Sin notas"}</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

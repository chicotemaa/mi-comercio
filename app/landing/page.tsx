"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Calendar,
  CreditCard,
  MessageCircle,
  Scissors,
  Settings,
  Users,
} from "lucide-react"

const modules = [
  {
    icon: Calendar,
    title: "Agenda",
    description: "Recibe reservas desde ns-barber, confirma turnos y ordena la jornada.",
  },
  {
    icon: Scissors,
    title: "Servicios",
    description: "Mantén sincronizado el catálogo que ve el cliente al reservar.",
  },
  {
    icon: Users,
    title: "Equipo y clientes",
    description: "Centraliza staff, clientes frecuentes y su historial operativo.",
  },
  {
    icon: CreditCard,
    title: "Pagos",
    description: "Prepara la base para caja, facturación e integraciones de cobro.",
  },
  {
    icon: MessageCircle,
    title: "Campañas",
    description: "Organiza recordatorios y acciones comerciales desde un solo panel.",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Concentra eventos importantes del negocio en una bandeja interna.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-slate-900 text-white hover:bg-slate-900">Backoffice único</Badge>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Mi Comercio ahora funciona como backend de Nerea Aylen Barber.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Este proyecto deja de actuar como SaaS multi-negocio por ahora. Su rol es operar agenda, catálogo,
              clientes, pagos, campañas y configuración del negocio conectado al front público `ns-barber`.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth">
                <Button size="lg">Entrar al backoffice</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Abrir dashboard
                </Button>
              </Link>
            </div>
          </div>

          <Card className="w-full max-w-md border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Rol del sistema</CardTitle>
              <CardDescription>Una sola barbería, dos proyectos, una sola base de datos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">ns-barber:</span> sitio público, branding y reservas.
              </p>
              <p>
                <span className="font-semibold text-slate-900">mi-comercio-app:</span> panel interno de gestión.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Supabase:</span> fuente única para servicios, staff,
                clientes, citas y el resto del backend.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900">Módulos que debe cubrir el backend</h2>
          <p className="mt-3 text-slate-600">
            El objetivo ahora no es vender una plataforma genérica. Es concentrar toda la operación de la barbería en
            un solo panel conectado al sitio público.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.title} className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <module.icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between">
          <p>La siguiente etapa natural es conectar configuración, clientes, pagos y campañas a Supabase.</p>
          <Link href="/dashboard/settings" className="inline-flex items-center gap-2 font-medium text-slate-900">
            <Settings className="h-4 w-4" />
            Ir a configuración
          </Link>
        </div>
      </section>
    </div>
  )
}

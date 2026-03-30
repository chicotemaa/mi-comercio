"use client"

import type React from "react"

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Scissors,
  Users,
  Calendar,
  Clock3,
  UserCheck,
  CreditCard,
  BarChart3,
  Megaphone,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Building2,
  CalendarDays,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Servicios", url: "/dashboard/services", icon: Scissors },
  { title: "Empleados", url: "/dashboard/employees", icon: Users },
  { title: "Agenda", url: "/dashboard/appointments", icon: Calendar },
  { title: "Horarios", url: "/dashboard/hours", icon: Clock3 },
  { title: "Clientes", url: "/dashboard/clients", icon: UserCheck },
  { title: "Pagos", url: "/dashboard/payments", icon: CreditCard },
  { title: "Reportes", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Campañas", url: "/dashboard/campaigns", icon: Megaphone },
  { title: "Configuración", url: "/dashboard/settings", icon: Settings },
  { title: "Notificaciones", url: "/dashboard/notifications", icon: Bell },
]

const routeMeta = [
  {
    match: "/dashboard/services",
    title: "Catálogo compartido",
    subtitle: "Servicios visibles en web y en backoffice.",
  },
  {
    match: "/dashboard/employees",
    title: "Equipo y liquidaciones",
    subtitle: "Disponibilidad, esquemas de pago y asignaciones.",
  },
  {
    match: "/dashboard/appointments",
    title: "Agenda operativa",
    subtitle: "Reservas centralizadas desde todos los canales.",
  },
  {
    match: "/dashboard/hours",
    title: "Disponibilidad general",
    subtitle: "Reglas base para apertura de turnos.",
  },
  {
    match: "/dashboard/clients",
    title: "Relación con clientes",
    subtitle: "Historial, valor acumulado y seguimiento.",
  },
  {
    match: "/dashboard/payments",
    title: "Caja y movimientos",
    subtitle: "Cobros, gastos y distribuciones en un mismo flujo.",
  },
  {
    match: "/dashboard/reports",
    title: "Inteligencia del negocio",
    subtitle: "Lectura consolidada de operación, ingresos y crecimiento.",
  },
  {
    match: "/dashboard/campaigns",
    title: "Campañas y comunicación",
    subtitle: "Mensajes, audiencias y resultados del canal.",
  },
  {
    match: "/dashboard/settings",
    title: "Configuración del negocio",
    subtitle: "Datos base, usuarios e integraciones.",
  },
  {
    match: "/dashboard/notifications",
    title: "Actividad del sistema",
    subtitle: "Eventos recientes, avisos y seguimiento interno.",
  },
]

function getRouteMeta(pathname: string) {
  if (pathname === "/dashboard") {
    return {
      title: "Panel general",
      subtitle: "Vista rápida de agenda, caja y operación diaria.",
    }
  }

  return routeMeta.find((item) => pathname.startsWith(item.match)) ?? routeMeta[0]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentRoute = getRouteMeta(pathname)
  const todayLabel = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date())

  return (
    <SidebarProvider className="bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      <Sidebar variant="inset" className="border-none">
        <SidebarHeader className="px-4 pb-4 pt-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 shadow-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-slate-900">Mi Comercio</h2>
                <p className="text-xs text-slate-500">Backoffice operativo conectado</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Panel listo para operar en tiempo real
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Operación
            </SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-10 rounded-xl px-3 text-slate-700 transition-all data-[active=true]:bg-slate-950 data-[active=true]:text-white data-[active=true]:shadow-sm hover:bg-white/80"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3 pt-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-auto w-full rounded-2xl border border-slate-200/80 bg-white/90 p-3 hover:bg-white">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-900">Equipo admin</p>
                      <p className="text-xs text-slate-500">Backoffice</p>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-transparent">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="rounded-xl border border-slate-200 bg-white shadow-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{currentRoute.title}</p>
            <p className="hidden truncate text-xs text-slate-500 md:block">{currentRoute.subtitle}</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm lg:flex">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="capitalize">{todayLabel}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl border border-transparent hover:border-slate-200 hover:bg-white">
            <Bell className="w-4 h-4" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.08),transparent_30%)]">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

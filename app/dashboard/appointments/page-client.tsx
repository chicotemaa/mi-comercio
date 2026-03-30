"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { DashboardPageShell } from "@/components/dashboard/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  type AppointmentRecord,
  type BookingSettingsRecord,
  type BusinessHourRecord,
  type CustomerRecord,
  type ServiceRecord,
  type StaffRecord,
  type StaffServiceAssignmentRecord,
  type StaffWorkingHourRecord,
} from "@/lib/business-shared";
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Plus,
  Search,
} from "lucide-react";

import { AppointmentFeedbackDialog } from "./_components/appointment-feedback-dialog";
import { AppointmentsCalendar } from "./_components/appointments-calendar";
import { AppointmentFormDialog } from "./_components/appointment-form-dialog";
import { AppointmentStatusDialog } from "./_components/appointment-status-dialog";
import { AppointmentsSelectedDayPanel } from "./_components/appointments-selected-day-panel";
import type { AgendaViewMode } from "./appointment-types";
import { useAppointmentsController } from "./use-appointments-controller";

interface AppointmentsPageClientProps {
  appointments: AppointmentRecord[];
  bookingSettings: BookingSettingsRecord;
  businessHours: BusinessHourRecord[];
  businessName: string;
  customers: CustomerRecord[];
  isLive: boolean;
  services: ServiceRecord[];
  staffMembers: StaffRecord[];
  staffServiceAssignments: StaffServiceAssignmentRecord[];
  staffWorkingHours: StaffWorkingHourRecord[];
  timeZone: string;
  todayKey: string;
}

const AGENDA_VIEW_OPTIONS: Array<{ label: string; value: AgendaViewMode }> = [
  { label: "Día", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
  { label: "Año", value: "year" },
];

export function AppointmentsPageClient({
  appointments,
  bookingSettings,
  businessHours,
  businessName,
  customers,
  isLive,
  services,
  staffMembers,
  staffServiceAssignments,
  staffWorkingHours,
  timeZone,
  todayKey,
}: AppointmentsPageClientProps) {
  const controller = useAppointmentsController({
    appointments,
    bookingSettings,
    businessHours,
    customers,
    services,
    staffMembers,
    staffServiceAssignments,
    staffWorkingHours,
    timeZone,
    todayKey,
  });

  function handleSelectAppointment(appointmentId: string, dateKey?: string) {
    if (dateKey) {
      controller.selectDate(dateKey);
    }

    controller.setSelectedAppointmentId(appointmentId);
  }

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        actions={
          <Button onClick={() => controller.openCreateDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo turno
          </Button>
        }
        badge={
          <Badge
            className={
              isLive
                ? "bg-emerald-100 text-emerald-900"
                : "bg-amber-100 text-amber-900"
            }
          >
            {isLive ? "Agenda en vivo" : "Agenda demo"}
          </Badge>
        }
        description={`${businessName} administra aquí la agenda completa: altas manuales, edición, reprogramación y cancelaciones.`}
        eyebrow="Agenda"
        supporting={
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
            <CalendarRange className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-900">
              {controller.rangeMeta.subtitle}
            </span>
            <span className="capitalize">{controller.rangeMeta.title}</span>
          </div>
        }
        title="Calendario operativo"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Turnos visibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {controller.agendaMetrics.total}
            </div>
            <p className="text-xs text-slate-500">
              En la vista actual del calendario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {controller.agendaMetrics.pending}
            </div>
            <p className="text-xs text-slate-500">
              Requieren seguimiento o confirmación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {controller.agendaMetrics.completed}
            </div>
            <p className="text-xs text-slate-500">Atenciones realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Facturación estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {formatCurrency(controller.agendaMetrics.revenue)}
            </div>
            <p className="text-xs text-slate-500">
              Confirmados y completados visibles
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListFilter className="h-5 w-5" />
            Navegación y filtros
          </CardTitle>
          <CardDescription>
            Cambia la escala del calendario y filtra por cliente, estado o
            profesional sin salir de la agenda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Tabs
              value={controller.viewMode}
              onValueChange={(value) =>
                controller.changeViewMode(value as AgendaViewMode)
              }
            >
              <TabsList className="grid w-full grid-cols-4 xl:w-[420px]">
                {AGENDA_VIEW_OPTIONS.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => controller.navigate(-1)}
                type="button"
                variant="outline"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              <Button
                onClick={controller.goToToday}
                type="button"
                variant="outline"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Hoy
              </Button>
              <Button
                onClick={() => controller.navigate(1)}
                type="button"
                variant="outline"
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Buscar por cliente, contacto, servicio o notas"
                value={controller.searchTerm}
                onChange={(event) => controller.setSearchTerm(event.target.value)}
              />
            </div>

            <Select
              value={controller.staffFilter}
              onValueChange={controller.setStaffFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Profesional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el equipo</SelectItem>
                {staffMembers
                  .filter((staffMember) => staffMember.isActive)
                  .map((staffMember) => (
                    <SelectItem key={staffMember.id} value={staffMember.id}>
                      {staffMember.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={controller.statusFilter}
              onValueChange={(value) =>
                controller.setStatusFilter(value as "all" | AppointmentRecord["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">
              {controller.rangeMeta.title}
            </CardTitle>
            <CardDescription>
              La agenda usa intervalos de {bookingSettings.slotIntervalMinutes}{" "}
              minutos y respeta la disponibilidad general y del personal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentsCalendar
              appointments={controller.visibleAppointments}
              bookingSettings={bookingSettings}
              businessHours={businessHours}
              focusDateKey={controller.focusDateKey}
              onDateClick={(dateKey, time) => {
                controller.selectDate(dateKey);
                controller.openCreateDialog({ dateKey, time });
              }}
              onEventClick={handleSelectAppointment}
              onEventDrop={(appointmentId, nextDateKey, nextTime, revert) =>
                void controller.moveAppointment(
                  appointmentId,
                  nextDateKey,
                  nextTime,
                  revert,
                )
              }
              onVisibleDateChange={controller.syncVisibleRangeStart}
              selectedAppointmentId={controller.selectedAppointmentId}
              selectedStaffId={
                controller.staffFilter === "all" ? null : controller.staffFilter
              }
              staffWorkingHours={staffWorkingHours}
              viewMode={controller.viewMode}
            />
          </CardContent>
        </Card>

        <AppointmentsSelectedDayPanel
          appointments={controller.selectedDateAppointments}
          dateKey={controller.selectedDateKey}
          onCreate={() =>
            controller.openCreateDialog({ dateKey: controller.selectedDateKey })
          }
          onEdit={controller.openEditDialog}
          onSelectAppointment={controller.setSelectedAppointmentId}
          onStatusChange={controller.openStatusDialog}
          selectedAppointmentId={controller.selectedAppointmentId}
          timeZone={timeZone}
        />
      </div>

      <AppointmentFormDialog
        appointmentBeingEdited={controller.editingAppointment}
        availableTimeOptions={controller.availableTimeOptions}
        customers={controller.customers}
        errorMessage={controller.formError}
        formState={controller.formState}
        isOpen={controller.isFormOpen}
        isSubmitting={controller.isSubmitting || controller.isRefreshing}
        onOpenChange={(open) => {
          if (!open) {
            controller.closeFormDialog();
          }
        }}
        onSubmit={() => void controller.submitForm()}
        onUpdateField={controller.updateFormField}
        services={controller.services}
        staffMembers={controller.compatibleStaffMembers}
      />

      <AppointmentStatusDialog
        dialogState={controller.statusDialogState}
        isSubmitting={controller.isStatusSubmitting || controller.isRefreshing}
        onConfirm={() => void controller.confirmStatusChange()}
        onOpenChange={(open) => {
          if (!open) {
            controller.closeStatusDialog();
          }
        }}
        onReasonChange={controller.setStatusReason}
        reason={controller.statusReason}
      />

      <AppointmentFeedbackDialog
        feedback={controller.feedbackState}
        onOpenChange={(open) => {
          if (!open) {
            controller.closeFeedbackDialog();
          }
        }}
      />
    </DashboardPageShell>
  );
}

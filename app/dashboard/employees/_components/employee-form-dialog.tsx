"use client";

import { Button } from "@/components/ui/button";
import { DayAvailabilityRow } from "@/components/schedule/day-availability-row";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getServiceCategoryLabel,
  getStaffCompensationTypeLabel,
  type ServiceCategory,
  type StaffCompensationType,
} from "@/lib/business-shared";
import { SERVICE_CATEGORIES } from "@/lib/service-catalog";

import type {
  EmployeeFormState,
  EmployeeServiceOption,
  EmployeeSummary,
} from "../employee-types";
import { categoryRatePillClassName } from "../employee-utils";

interface EmployeeFormDialogProps {
  employeeBeingEdited: EmployeeSummary | null;
  errorMessage: string | null;
  formState: EmployeeFormState;
  isOpen: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onToggleAssignedService: (serviceId: string) => void;
  onUpdateCategoryRate: (category: ServiceCategory, value: string) => void;
  onUpdateField: <K extends keyof EmployeeFormState>(
    field: K,
    value: EmployeeFormState[K],
  ) => void;
  onUpdateWorkingHour: (
    dayOfWeek: number,
    field:
      | "startTime"
      | "endTime"
      | "breakStartTime"
      | "breakEndTime"
      | "isActive",
    value: string | boolean,
  ) => void;
  serviceOptions: EmployeeServiceOption[];
}

export function EmployeeFormDialog({
  employeeBeingEdited,
  errorMessage,
  formState,
  isOpen,
  isSubmitting,
  onOpenChange,
  onSubmit,
  onToggleAssignedService,
  onUpdateCategoryRate,
  onUpdateField,
  onUpdateWorkingHour,
  serviceOptions,
}: EmployeeFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employeeBeingEdited ? "Editar profesional" : "Nuevo profesional"}
          </DialogTitle>
          <DialogDescription>
            Configura datos del equipo, servicios asignados, horario semanal y
            forma de liquidación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employee-full-name">Nombre completo</Label>
              <Input
                id="employee-full-name"
                value={formState.fullName}
                onChange={(event) =>
                  onUpdateField("fullName", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-role">Rol</Label>
              <Input
                id="employee-role"
                placeholder="Barbera principal"
                value={formState.role}
                onChange={(event) => onUpdateField("role", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-email">Email</Label>
              <Input
                id="employee-email"
                type="email"
                value={formState.email}
                onChange={(event) => onUpdateField("email", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-phone">Teléfono</Label>
              <Input
                id="employee-phone"
                value={formState.phone}
                onChange={(event) => onUpdateField("phone", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-code">Código interno</Label>
              <Input
                id="employee-code"
                placeholder="NERE"
                value={formState.employeeCode}
                onChange={(event) =>
                  onUpdateField(
                    "employeeCode",
                    event.target.value.toUpperCase(),
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-join-date">Fecha de ingreso</Label>
              <Input
                id="employee-join-date"
                type="date"
                value={formState.joinDate}
                onChange={(event) =>
                  onUpdateField("joinDate", event.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee-bio">Bio</Label>
            <Textarea
              id="employee-bio"
              rows={3}
              value={formState.bio}
              onChange={(event) => onUpdateField("bio", event.target.value)}
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="space-y-2">
                <Label>Tipo de liquidación</Label>
                <Select
                  value={formState.compensationType}
                  onValueChange={(value) =>
                    onUpdateField(
                      "compensationType",
                      value as StaffCompensationType,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">
                      {getStaffCompensationTypeLabel("hourly")}
                    </SelectItem>
                    <SelectItem value="category_percentage">
                      {getStaffCompensationTypeLabel("category_percentage")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-hourly-rate">Valor por hora</Label>
                <Input
                  id="employee-hourly-rate"
                  inputMode="decimal"
                  value={formState.hourlyRate}
                  onChange={(event) =>
                    onUpdateField("hourlyRate", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Porcentaje por categoría
                </p>
                <p className="text-xs text-slate-500">
                  Si eliges liquidación por porcentaje, se calcula sobre el
                  valor del servicio según su categoría.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {SERVICE_CATEGORIES.map((category) => (
                  <div className="space-y-2" key={category}>
                    <Label htmlFor={`employee-rate-${category}`}>
                      {getServiceCategoryLabel(category)}
                    </Label>
                    <Input
                      id={`employee-rate-${category}`}
                      inputMode="decimal"
                      value={formState.categoryRates[category]}
                      onChange={(event) =>
                        onUpdateCategoryRate(category, event.target.value)
                      }
                    />
                    <div
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${categoryRatePillClassName(category)}`}
                    >
                      {formState.categoryRates[category]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Servicios asignados
              </p>
              <p className="text-xs text-slate-500">
                Selecciona qué servicios puede tomar este profesional.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => {
                const isSelected = formState.assignedServiceIds.includes(
                  service.id,
                );

                return (
                  <Button
                    className={
                      isSelected ? undefined : "border-slate-300 text-slate-700"
                    }
                    key={service.id}
                    onClick={() => onToggleAssignedService(service.id)}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                  >
                    {service.name}
                    {service.category
                      ? ` · ${getServiceCategoryLabel(service.category)}`
                      : ""}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Horario semanal
              </p>
              <p className="text-xs text-slate-500">
                Este horario define cuándo puede atender el profesional. Si no
                corta para almorzar, deja esa franja vacía.
              </p>
            </div>
            <div className="space-y-3">
              {formState.workingHours.map((day) => (
                <DayAvailabilityRow
                  day={{
                    dayOfWeek: day.dayOfWeek,
                    label: day.label,
                    isEnabled: day.isActive,
                    startTime: day.startTime,
                    endTime: day.endTime,
                    breakStartTime: day.breakStartTime,
                    breakEndTime: day.breakEndTime,
                  }}
                  description="Disponibilidad del profesional"
                  disabledLabel="Sin atención"
                  enabledLabel="Disponible"
                  key={day.dayOfWeek}
                  onTimeChange={(dayOfWeek, field, value) =>
                    onUpdateWorkingHour(dayOfWeek, field, value)
                  }
                  onToggleEnabled={(dayOfWeek, checked) =>
                    onUpdateWorkingHour(dayOfWeek, "isActive", checked)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={isSubmitting} onClick={onSubmit}>
            {employeeBeingEdited ? "Guardar cambios" : "Crear profesional"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

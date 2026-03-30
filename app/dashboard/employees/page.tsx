import {
  createDefaultCategoryRateMap,
  formatCurrency,
} from "@/lib/business-shared";
import { getBusinessTeamBundle } from "@/lib/business-data";

import { createDefaultEmployeeWorkingHours } from "./employee-utils";
import { EmployeesPageClient } from "./page-client";

export const dynamic = "force-dynamic";

function formatHoursWorked(value: number) {
  return `${value.toFixed(1).replace(".", ",")} hs`;
}

export default async function EmployeesPage() {
  const {
    business,
    services,
    staffMembers,
    appointments,
    staffTimeLogs,
    staffWorkingHours,
    staffCategoryRates,
    staffServiceAssignments,
    isLive,
  } = await getBusinessTeamBundle();

  const serviceMap = new Map(services.map((service) => [service.id, service]));
  const defaultWorkingHours = createDefaultEmployeeWorkingHours();
  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.name,
    category: service.category,
    isActive: service.isActive,
  }));

  const employeeSummaries = staffMembers.map((staffMember) => {
    const relatedAppointments = appointments.filter(
      (appointment) => appointment.staffMemberId === staffMember.id,
    );
    const completedAppointments = relatedAppointments.filter(
      (appointment) => appointment.status === "completed",
    );
    const activeAppointments = relatedAppointments.filter(
      (appointment) => appointment.status !== "cancelled",
    );
    const generatedRevenue = activeAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );
    const averageTicket =
      activeAppointments.length > 0
        ? generatedRevenue / activeAppointments.length
        : 0;
    const totalHoursWorked = staffTimeLogs
      .filter((timeLog) => timeLog.staffMemberId === staffMember.id)
      .reduce((total, timeLog) => total + timeLog.hoursWorked, 0);
    const assignedServiceIds = staffServiceAssignments
      .filter((assignment) => assignment.staffMemberId === staffMember.id)
      .map((assignment) => assignment.serviceId);
    const workingHours = staffWorkingHours
      .filter((workingHour) => workingHour.staffMemberId === staffMember.id)
      .map((workingHour) => ({
        dayOfWeek: workingHour.dayOfWeek,
        label:
          defaultWorkingHours.find(
            (day) => day.dayOfWeek === workingHour.dayOfWeek,
          )?.label ?? `Día ${workingHour.dayOfWeek}`,
        isActive: workingHour.isActive,
        startTime: workingHour.startTime?.slice(0, 5) ?? "",
        endTime: workingHour.endTime?.slice(0, 5) ?? "",
        breakStartTime: workingHour.breakStartTime?.slice(0, 5) ?? "",
        breakEndTime: workingHour.breakEndTime?.slice(0, 5) ?? "",
      }));
    const categoryRates = createDefaultCategoryRateMap();

    for (const rate of staffCategoryRates.filter(
      (entry) => entry.staffMemberId === staffMember.id,
    )) {
      categoryRates[rate.category] = rate.percentage;
    }

    const estimatedCompensation =
      staffMember.compensationType === "category_percentage"
        ? completedAppointments.reduce((total, appointment) => {
            const appointmentCategory = appointment.serviceId
              ? serviceMap.get(appointment.serviceId)?.category
              : null;
            const percentage = appointmentCategory
              ? (categoryRates[appointmentCategory] ?? 0)
              : 0;
            return total + appointment.price * (percentage / 100);
          }, 0)
        : totalHoursWorked * (staffMember.hourlyRate ?? 0);

    return {
      ...staffMember,
      bio: staffMember.bio ?? null,
      joinDate: staffMember.joinDate ?? null,
      employeeCode: staffMember.employeeCode ?? null,
      hourlyRate: staffMember.hourlyRate ?? 0,
      rating: staffMember.rating ?? 5,
      compensationType: staffMember.compensationType ?? "hourly",
      assignedServiceIds,
      workingHours:
        workingHours.length > 0 ? workingHours : defaultWorkingHours,
      categoryRates,
      totalAppointments: relatedAppointments.length,
      pendingAppointments: relatedAppointments.filter(
        (appointment) => appointment.status === "pending",
      ).length,
      completedAppointments: completedAppointments.length,
      generatedRevenue,
      averageTicket,
      totalHoursWorked,
      estimatedCompensation,
      formattedRevenue: formatCurrency(generatedRevenue),
      formattedAverageTicket: formatCurrency(averageTicket),
      formattedHoursWorked: formatHoursWorked(totalHoursWorked),
      formattedEstimatedCompensation: formatCurrency(estimatedCompensation),
      formattedHourlyRate: formatCurrency(staffMember.hourlyRate ?? 0),
    };
  });

  return (
    <EmployeesPageClient
      businessName={business.name}
      employees={employeeSummaries}
      isLive={isLive}
      serviceOptions={serviceOptions}
    />
  );
}

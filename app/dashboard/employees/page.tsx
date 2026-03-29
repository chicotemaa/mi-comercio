import { getBusinessDataBundle } from "@/lib/business-data"
import { formatCurrency } from "@/lib/business-shared"

import { EmployeesPageClient } from "./page-client"

export default async function EmployeesPage() {
  const { business, staffMembers, appointments, isLive } = await getBusinessDataBundle()
  const employeeSummaries = staffMembers.map((staffMember) => {
    const relatedAppointments = appointments.filter((appointment) => appointment.staffMemberId === staffMember.id)

    return {
      ...staffMember,
      totalAppointments: relatedAppointments.length,
      pendingAppointments: relatedAppointments.filter((appointment) => appointment.status === "pending").length,
      generatedRevenue: relatedAppointments
        .filter((appointment) => appointment.status !== "cancelled")
        .reduce((total, appointment) => total + appointment.price, 0),
      averageTicket:
        relatedAppointments.length > 0
          ? relatedAppointments.reduce((total, appointment) => total + appointment.price, 0) / relatedAppointments.length
          : 0,
      formattedRevenue: formatCurrency(
        relatedAppointments
          .filter((appointment) => appointment.status !== "cancelled")
          .reduce((total, appointment) => total + appointment.price, 0),
      ),
      formattedAverageTicket: formatCurrency(
        relatedAppointments.length > 0
          ? relatedAppointments.reduce((total, appointment) => total + appointment.price, 0) / relatedAppointments.length
          : 0,
      ),
    }
  })

  return <EmployeesPageClient businessName={business.name} employees={employeeSummaries} isLive={isLive} />
}

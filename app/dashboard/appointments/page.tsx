import { getBusinessDataBundle } from "@/lib/business-data"
import { getDateKeyInTimeZone } from "@/lib/business-shared"

import { AppointmentsPageClient } from "./page-client"

export default async function AppointmentsPage() {
  const { business, appointments, isLive } = await getBusinessDataBundle()

  return (
    <AppointmentsPageClient
      appointments={appointments}
      businessName={business.name}
      isLive={isLive}
      todayKey={getDateKeyInTimeZone(business.timeZone)}
      timeZone={business.timeZone}
    />
  )
}

import { getBusinessScheduleBundle } from "@/lib/business-data"

import { HoursPageClient } from "./page-client"

export default async function HoursPage() {
  const { business, businessHours, bookingSettings, isLive } = await getBusinessScheduleBundle()

  return (
    <HoursPageClient
      bookingSettings={bookingSettings}
      businessHours={businessHours}
      businessName={business.name}
      isLive={isLive}
    />
  )
}

import { getBusinessDataBundle } from "@/lib/business-data"

import { ServicesPageClient } from "./page-client"

export default async function ServicesPage() {
  const { business, services, appointments, isLive } = await getBusinessDataBundle()
  const serviceSummaries = services.map((service) => ({
    ...service,
    bookings: appointments.filter((appointment) => appointment.serviceId === service.id).length,
  }))

  return <ServicesPageClient businessName={business.name} isLive={isLive} services={serviceSummaries} />
}

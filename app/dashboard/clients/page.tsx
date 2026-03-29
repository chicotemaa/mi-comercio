import { getBusinessOperationsBundle } from "@/lib/business-data"

import { ClientsPageClient } from "./page-client"

export default async function ClientsPage() {
  const { business, customers, isLive } = await getBusinessOperationsBundle()

  return <ClientsPageClient businessName={business.name} customers={customers} isLive={isLive} timeZone={business.timeZone} />
}

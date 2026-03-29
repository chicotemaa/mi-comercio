import { getBusinessOperationsBundle } from "@/lib/business-data"

import { PaymentsPageClient } from "./page-client"

export default async function PaymentsPage() {
  const { business, payments, expenses, payouts, isLive } = await getBusinessOperationsBundle()

  return (
    <PaymentsPageClient
      businessName={business.name}
      expenses={expenses}
      isLive={isLive}
      payments={payments}
      payouts={payouts}
      timeZone={business.timeZone}
    />
  )
}

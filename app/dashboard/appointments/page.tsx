import { getBusinessAgendaBundle } from "@/lib/business-data";
import { getDateKeyInTimeZone } from "@/lib/business-shared";

import { AppointmentsPageClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const {
    appointments,
    bookingSettings,
    business,
    businessHours,
    customers,
    isLive,
    services,
    staffMembers,
    staffServiceAssignments,
    staffWorkingHours,
  } = await getBusinessAgendaBundle();

  return (
    <AppointmentsPageClient
      appointments={appointments}
      bookingSettings={bookingSettings}
      businessHours={businessHours}
      businessName={business.name}
      customers={customers}
      isLive={isLive}
      services={services}
      staffMembers={staffMembers}
      staffServiceAssignments={staffServiceAssignments}
      staffWorkingHours={staffWorkingHours}
      timeZone={business.timeZone}
      todayKey={getDateKeyInTimeZone(business.timeZone)}
    />
  );
}

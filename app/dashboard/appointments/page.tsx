import { getBusinessAgendaBundle } from "@/lib/business-data";
import { getDateKeyInTimeZone } from "@/lib/business-shared";

import { AppointmentsPageClient } from "./page-client";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
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
  const selected = appointments.find((a) => a.id === query.appointment);
  const todayKey = getDateKeyInTimeZone(business.timeZone);
  const initialDateKey = selected?.appointmentDate || todayKey;
  const initialCreate = query.new === "1";

  return (
    <AppointmentsPageClient
      key={`${selected?.id || ""}:${initialDateKey}:${initialCreate}`}
      initialDateKey={initialDateKey}
      initialAppointmentId={selected?.id || null}
      initialCreate={initialCreate}
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
      todayKey={todayKey}
    />
  );
}

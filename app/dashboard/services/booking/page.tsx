import { cookies } from "next/headers";
import { backendUrl, sessionCookie } from "@/lib/backend/config";
import ServiceBookingForm, {
  type BookingCatalogSettings,
} from "./service-booking-form";
export const dynamic = "force-dynamic";
export default async function ServiceBookingPage() {
  const token = (await cookies()).get(sessionCookie)?.value;
  const response = await fetch(
    `${backendUrl()}/api/backoffice/service-booking`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error("No se pudo consultar la configuración de servicios.");
  return (
    <ServiceBookingForm
      initial={(await response.json()) as BookingCatalogSettings}
    />
  );
}

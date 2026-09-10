import Link from "next/link";
import { getManagedBusiness } from "@/lib/managed-business";
import { BrandSettings } from "./brand-settings";
import BusinessForm from "./business-form";
import { CashSettings } from "./cash-settings";
export default async function SettingsPage() {
  const result = await getManagedBusiness();
  if (!result.data) throw new Error(result.error);
  const { data, error } = await result.data.backend
    .from("businesses")
    .select()
    .eq("id", result.data.business.id)
    .single();
  if (error || !data) throw new Error("No se pudo cargar la configuración.");
  const people = await result.data.backend.from("staff_members").select().eq("business_id", result.data.business.id);
  if (people.error) throw new Error(people.error.message);
  const fields = [
    "name",
    "description",
    "address",
    "phone",
    "email",
    "website",
    "cuit",
    "instagram_handle",
    "whatsapp_phone",
  ] as const;
  const initial = Object.fromEntries(
    fields.map((field) => [field, String(data[field] ?? "")]),
  );
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold">Configuración del negocio</h1>
      <BusinessForm initial={initial} />
      <BrandSettings initial={{ brand_palette:String(data.brand_palette||"bronze"),brand_initials:String(data.brand_initials||"NA"),short_name:String(data.short_name||data.name),hero_headline:String(data.hero_headline||"Tu estilo, en buenas manos."),hero_copy:String(data.hero_copy||"Cortes, barbas y atención personalizada. Un momento para vos, con cada detalle cuidado."),booking_intro:String(data.booking_intro||"Elegí el servicio y el momento para vos. Te contactaremos para confirmar tu turno.") }} />
      <CashSettings initialTarget={Number(data.monthly_collection_target || 0)} staff={(people.data || []).map(p => ({ id: p.id, name: p.full_name, rate: Number(p.collection_commission_rate || 0) }))} />
      <div className="rounded-2xl border bg-white p-6 space-y-3">
        <h2 className="text-xl font-semibold">Accesos y horarios</h2>
        <p>
          Las cuentas autorizadas se administran desde Strapi, en Usuarios. El
          rol Business Manager permite acceder a Mi Comercio.
        </p>
        <Link className="underline" href="/dashboard/hours">
          Administrar horarios y reglas de reserva
        </Link>
      </div>
    </div>
  );
}

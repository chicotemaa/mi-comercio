import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { getBusinessDataBundle } from "@/lib/business-data";
import { getCheckout } from "@/lib/checkout-server";
import {
  formatCurrency,
  getStatusLabel,
  getDateKeyInTimeZone,
} from "@/lib/business-shared";
import { CheckoutWorkspace } from "./workspace";
export const dynamic = "force-dynamic";
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ appointment?: string; q?: string; date?: string }>;
}) {
  const params = await searchParams;
  if (params.appointment && /^[1-9]\d*$/.test(params.appointment))
    return (
      <CheckoutWorkspace
        initial={await getCheckout(params.appointment)}
        key={params.appointment}
      />
    );
  const { appointments, business } = await getBusinessDataBundle(),
    today = getDateKeyInTimeZone(business.timeZone),
    q = (params.q || "").toLocaleLowerCase("es");
  const rows = appointments
    .filter(
      (a) =>
        (!q ||
          `${a.customerName} ${a.serviceName}`
            .toLocaleLowerCase("es")
            .includes(q)) &&
        (!params.date || a.appointmentDate === params.date),
    )
    .sort(
      (a, b) =>
        Number(b.appointmentDate === today) -
          Number(a.appointmentDate === today) ||
        b.appointmentDate.localeCompare(a.appointmentDate) ||
        a.appointmentTime.localeCompare(b.appointmentTime),
    );
  return (
    <div className="space-y-7 p-4 md:p-7">
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="section-kicker">Recepción y caja</p>
          <h1 className="page-title">Un turno. Todo a mano.</h1>
          <p className="mt-2 text-sm text-slate-500">
            Abrí la ficha para revisar la atención, ajustar el importe y cobrar.
          </p>
        </div>
        <Link className="brand-button" href="/dashboard/appointments?new=1">
          Nuevo turno <ArrowUpRight size={16} />
        </Link>
      </header>
      <form className="flex flex-wrap gap-3 rounded-2xl border bg-white p-4">
        <label className="flex min-w-[200px] flex-1 items-center gap-2">
          <Search size={17} />
          <input
            className="w-full bg-transparent p-2 outline-none"
            aria-label="Buscar cliente o servicio"
            name="q"
            defaultValue={params.q}
            placeholder="Buscar cliente o servicio…"
          />
        </label>
        <input
          className="rounded-xl border px-3 py-2"
          type="date"
          name="date"
          aria-label="Fecha del turno"
          defaultValue={params.date}
        />
        <button className="brand-button">Buscar</button>
        <Link
          className="px-3 py-3 text-sm underline"
          href={`/dashboard/checkout?date=${today}`}
        >
          Hoy
        </Link>
      </form>
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.slice(0, 100).map((a) => (
          <Link
            key={a.id}
            className="checkout-appointment-card group"
            href={`/dashboard/checkout?appointment=${a.id}`}
          >
            <div className="flex items-start gap-4">
              <div className="brand-avatar">
                {a.customerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{a.customerName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {a.serviceName} · {a.staffName || "Sin profesional"}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {a.appointmentDate.split("-").reverse().join("/")} ·{" "}
                  {a.appointmentTime.slice(0, 5)} · {getStatusLabel(a.status)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(a.price)}</p>
                <ArrowUpRight
                  className="ml-auto mt-3 text-slate-400 transition-transform group-hover:-translate-y-1"
                  size={19}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!rows.length && (
        <p className="rounded-2xl border bg-white p-10 text-center text-slate-500">
          No hay turnos con esos filtros. Podés cargar uno desde Nuevo turno.
        </p>
      )}
      {rows.length > 100 && (
        <p className="text-sm text-slate-500">
          Se muestran 100 turnos. Usá la búsqueda o elegí una fecha para
          encontrar uno anterior.
        </p>
      )}
    </div>
  );
}

import Link from "next/link";
import { cookies } from "next/headers";
import { backendUrl, sessionCookie } from "@/lib/backend/config";
export const dynamic = "force-dynamic";
type State = {
  enabled: boolean;
  ready: boolean;
  requested: boolean;
  mode: string;
  missing: string[];
  googleConfigured: boolean;
  depositPercent: number;
  cancellationHours: number;
  holdMinutes: number;
  bookings: {
    id: string;
    status: string;
    customer: string;
    service: string;
    date: string;
    time: string;
    depositCents: number;
    paidCents: number;
    appointmentId: string | null;
    reviewReason: string | null;
  }[];
  paymentReviews: {
    id: string;
    status: string;
    amountCents: number;
    reason: string;
  }[];
  mailIssues: {
    id: number;
    recipient: string;
    status: string;
    error: string;
  }[];
};
const money = (cents: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(cents / 100);
const statuses: Record<string, string> = {
  awaiting_payment: "Esperando seña",
  confirmed: "Confirmada",
  expired: "Vencida",
  cancelled: "Cancelada",
  review: "Revisar pago",
};
export default async function OnlineBookingPage() {
  const token = (await cookies()).get(sessionCookie)?.value;
  const res = await fetch(`${backendUrl()}/api/backoffice/online-booking`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok)
    throw new Error(
      "No se pudo consultar la configuración de reservas online.",
    );
  const data = (await res.json()) as State;
  const providers = [
    {
      name: "Mercado Pago",
      ready: !data.missing.some((k) => k.startsWith("MP_")),
      detail: "Seña del 50% y acreditación automática",
    },
    {
      name: "Ingreso con Google",
      ready: data.googleConfigured,
      detail: "Acceso de clientes con su cuenta",
    },
    {
      name: "Correo de reservas",
      ready: !data.missing.some(
        (k) => k.startsWith("CLOUDFLARE_") || k === "NOTIFICATION_EMAIL_FROM",
      ),
      detail: "Códigos de acceso y confirmaciones",
    },
  ];
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <Link className="text-sm underline" href="/dashboard/settings">
        Configuración
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Reservas online</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuentas de clientes, señas y avisos de la web.
          </p>
        </div>
        <a href="/dashboard/settings/online-booking" className="brand-button">
          Actualizar
        </a>
      </div>
      <section className="rounded-2xl border bg-card p-5">
        <p className="font-semibold">
          {data.enabled
            ? "Reservas con seña habilitadas"
            : "Integración preparada · pendiente de activación"}
        </p>
        <p className="mt-2 text-sm leading-6">
          {data.enabled
            ? `Modo ${data.mode === "production" ? "producción" : "pruebas"}. Los turnos se confirman cuando se acredita la seña.`
            : "La web conserva la solicitud de turnos actual. El nuevo circuito se habilita al completar la configuración y las pruebas de acceso, cobro y correo."}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {providers.map((p) => (
            <div key={p.name} className="rounded-xl border p-4">
              <h2 className="font-medium">{p.name}</h2>
              <p className="mt-1 text-sm">
                {p.ready
                  ? "Configurado · verificar funcionamiento"
                  : "Pendiente de configurar"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{p.detail}</p>
            </div>
          ))}
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Seña</dt>
            <dd className="mt-1 font-medium">
              {data.depositPercent}% del servicio
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Tiempo para pagar</dt>
            <dd className="mt-1 font-medium">{data.holdMinutes} minutos</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Cancelación del cliente
            </dt>
            <dd className="mt-1 font-medium">
              {data.cancellationHours} h antes · sin devolución
            </dd>
          </div>
        </dl>
        {data.missing.length > 0 && (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm">
              Configuración técnica pendiente
            </summary>
            <p className="mt-3 break-words text-xs leading-6">
              {data.missing.join(" · ")}
            </p>
            <p className="mt-2 text-xs">
              Las claves se configuran en el servidor. Nunca se muestran en este
              panel.
            </p>
          </details>
        )}
      </section>
      {data.paymentReviews.length > 0 && (
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="text-xl font-semibold">
            Pagos que necesitan revisión
          </h2>
          <p className="mt-2 text-sm leading-6">
            Contrastá el movimiento con Mercado Pago y conciliá Caja y las
            liquidaciones. Estos casos no generan devoluciones automáticas.
          </p>
          <div className="mt-4 space-y-3">
            {data.paymentReviews.map((p) => (
              <div className="rounded-xl border p-4" key={p.id}>
                <p className="font-medium">
                  {money(p.amountCents)} · Pago {p.id}
                </p>
                <p className="mt-1 text-sm">{p.reason}</p>
                <p className="mt-1 text-xs">
                  Estado en Mercado Pago: {p.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.mailIssues.length > 0 && (
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="text-xl font-semibold">Avisos por correo</h2>
          <div className="mt-4 space-y-3">
            {data.mailIssues.map((m) => (
              <div key={m.id} className="rounded-xl border p-4 text-sm">
                <p className="break-all font-medium">{m.recipient}</p>
                <p className="mt-1">{m.error}</p>
                <p className="mt-1 text-xs">
                  {m.status === "unknown"
                    ? "Comprobar el envío en Cloudflare antes de reenviar."
                    : "El envío se reintenta de forma limitada."}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-semibold">Últimas reservas con seña</h2>
        {data.bookings.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Todavía no hay reservas realizadas con el nuevo circuito.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {data.bookings.map((b) => (
              <article
                key={b.id}
                className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium">{b.customer}</p>
                  <p className="mt-1 break-words text-sm">{b.service}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {b.date} · {b.time} · {statuses[b.status] || b.status}
                  </p>
                  {b.reviewReason && (
                    <p className="mt-2 text-sm">{b.reviewReason}</p>
                  )}
                </div>
                <div className="text-sm">
                  <p>Seña: {money(b.depositCents)}</p>
                  <p>Abonado: {money(b.paidCents)}</p>
                  {b.appointmentId && (
                    <Link
                      className="mt-2 inline-block underline"
                      href={`/dashboard/checkout?appointment=${b.appointmentId}`}
                    >
                      Abrir checkout
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { getOperationAlerts } from "@/lib/operation-alerts-server";
import { ALERT_LABELS, type AlertKind } from "@/lib/operation-alerts";
import { formatCurrency, formatDisplayDate } from "@/lib/business-shared";
import { RefreshNotifications } from "./refresh-notifications";
export async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [data, query] = await Promise.all([getOperationAlerts(), searchParams]);
  const kind =
    typeof query.tipo === "string" && Object.hasOwn(ALERT_LABELS, query.tipo)
      ? (query.tipo as AlertKind)
      : null;
  const filtered = data.alerts.filter((a) => !kind || a.kind === kind);
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Seguimiento del negocio</p>
          <h1 className="text-3xl font-semibold">Avisos y tareas</h1>
          <p className="mt-2 text-slate-600">
            {data.attentionCount} acciones pendientes. Los avisos se actualizan
            al gestionar turnos, cobros y pagos.
          </p>
        </div>
        <RefreshNotifications />
      </header>
      <nav
        aria-label="Tipos de aviso"
        className="grid grid-cols-2 gap-3 md:grid-cols-3"
      >
        {(Object.keys(ALERT_LABELS) as AlertKind[]).map((key) => (
          <Link
            key={key}
            href={`/dashboard/notifications?tipo=${key}`}
            className={`rounded-xl border p-4 ${kind === key ? "border-slate-900 bg-slate-900 text-white" : "bg-white"}`}
          >
            <p className="text-sm">{ALERT_LABELS[key]}</p>
            <strong className="mt-1 block text-2xl">{data.counts[key]}</strong>
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-between">
        <Link className="text-sm underline" href="/dashboard/notifications">
          Ver todos
        </Link>
        <Link
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
          href="/dashboard/appointments?new=1"
        >
          Cargar turno
        </Link>
      </div>
      <p className="text-sm text-slate-500">
        {kind ? ALERT_LABELS[kind] : "Todos los avisos"} · {filtered.length}{" "}
        registros. Actualización automática cada minuto mientras esta pantalla
        está abierta.
      </p>
      <ul className="space-y-3">
        {filtered.slice(0, 100).map((alert) => (
          <li
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-4"
            key={alert.id}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {ALERT_LABELS[alert.kind]}
              </p>
              <p className="mt-1 font-semibold">{alert.title}</p>
              <p className="text-sm text-slate-600">{alert.detail}</p>
              <p className="mt-1 text-sm text-slate-500">
                {formatDisplayDate(
                  alert.date,
                  "America/Argentina/Buenos_Aires",
                )}
                {alert.time ? ` · ${alert.time}` : ""}
                {alert.amount != null
                  ? ` · ${formatCurrency(alert.amount)} pendiente`
                  : ""}
              </p>
            </div>
            <Link
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50"
              href={alert.href}
            >
              {alert.action}
            </Link>
          </li>
        ))}
      </ul>
      {!filtered.length && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="font-semibold">Todo al día</h2>
          <p className="mt-2 text-sm text-slate-500">
            No hay avisos en esta categoría. Podés cargar un turno o consultar
            la agenda.
          </p>
        </div>
      )}
      {filtered.length > 100 && (
        <p className="text-sm text-slate-500">
          Se muestran los primeros 100 avisos. Usá las categorías para ordenar
          el seguimiento.
        </p>
      )}
    </div>
  );
}

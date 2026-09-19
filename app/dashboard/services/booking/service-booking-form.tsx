"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number | null;
  bookingEnabled: boolean;
  professionals: { id: string; name: string }[];
  variants: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number | null;
  }[];
};
export type BookingCatalogSettings = { revision: string; services: Service[] };
const field = "mt-2 w-full min-w-0 rounded-xl border bg-background p-3 text-sm";
const categoryNames: Record<string, string> = {
  corte: "Cortes",
  coloraciones: "Coloraciones",
  tratamiento: "Tratamientos y peinados",
};
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const ready = (service: Service) =>
  !!service.durationMinutes && service.professionals.length > 0;
const online = (service: Service) => ready(service) && service.bookingEnabled;
const payload = (s: Service) => ({
  id: s.id,
  durationMinutes: s.durationMinutes,
  bookingEnabled: s.bookingEnabled,
  variants: s.variants.map((v) => ({
    id: v.id,
    durationMinutes: v.durationMinutes,
  })),
});
const money = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(n);
export default function ServiceBookingForm({
  initial,
}: {
  initial: BookingCatalogSettings;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial);
  const [services, setServices] = useState(initial.services);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [bulkMinutes, setBulkMinutes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const visible = services.filter(
    (s) =>
      normalize(s.name).includes(normalize(search)) &&
      (category === "all" || s.category === category) &&
      (!pendingOnly || !online(s)),
  );
  const changed = services.filter(
    (s) =>
      JSON.stringify(payload(s)) !==
      JSON.stringify(payload(saved.services.find((old) => old.id === s.id)!)),
  );
  function update(id: string, change: Partial<Service>) {
    setServices((rows) =>
      rows.map((s) => (s.id === id ? { ...s, ...change } : s)),
    );
    setMessage("");
    setError("");
  }
  function select(id: string, checked: boolean) {
    setSelected((old) => {
      const next = new Set(old);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }
  function applyDuration() {
    const value = Number(bulkMinutes);
    if (!Number.isInteger(value) || value < 1 || value > 1440) {
      setError("Ingresá una duración entre 1 y 1440 minutos.");
      return;
    }
    setServices((rows) =>
      rows.map((s) =>
        selected.has(s.id)
          ? {
              ...s,
              durationMinutes: value,
              variants: s.variants.map((v) => ({
                ...v,
                durationMinutes: null,
              })),
            }
          : s,
      ),
    );
    setMessage(
      "Duración aplicada a los seleccionados. Podés ajustar cada variante antes de guardar.",
    );
    setError("");
  }
  function enableSelected() {
    const incomplete = services.filter((s) => selected.has(s.id) && !ready(s));
    if (incomplete.length) {
      setError(
        `Falta la duración o el profesional en ${incomplete.length} de los servicios seleccionados.`,
      );
      return;
    }
    setServices((rows) =>
      rows.map((s) =>
        selected.has(s.id) ? { ...s, bookingEnabled: true } : s,
      ),
    );
    setMessage("");
    setError("");
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !changed.length) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/service-booking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: saved.revision,
          changes: changed.map(payload),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo guardar.");
      setSaved(result);
      setServices(result.services);
      setSelected(new Set());
      setMessage(
        "Configuración guardada. Las nuevas reservas ya usan estos tiempos.",
      );
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo guardar. Intentá nuevamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
      <Link className="text-sm underline" href="/dashboard/services">
        Servicios
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Reservas por servicio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Definí cuánto tiempo ocupa cada trabajo y habilitalo en la web.
            Podés usar un tiempo general o uno distinto por largo.
          </p>
        </div>
        <Link
          className="text-sm underline"
          href="/dashboard/settings/online-booking"
        >
          Seña, Google y correo
        </Link>
      </div>
      <section className="rounded-2xl border bg-card p-5">
        <p className="text-lg font-semibold">
          {saved.services.filter(online).length} de {services.length} servicios
          habilitados para reservar
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Completá los tiempos pendientes y revisá los{" "}
          <Link className="underline" href="/dashboard/hours">
            horarios de atención
          </Link>{" "}
          antes de habilitarlos.
        </p>
      </section>
      <form onSubmit={save} className="space-y-5">
        <fieldset disabled={busy} className="min-w-0 space-y-5">
          <section className="rounded-2xl border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Buscar servicio
                <input
                  className={field}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Corte, balayage, nutrición…"
                  type="search"
                />
              </label>
              <label className="text-sm font-medium">
                Categoría
                <select
                  className={field}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {Object.entries(categoryNames).map(([key, label]) => (
                    <option value={key} key={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                />
                Solo pendientes
              </label>
              <button
                type="button"
                className="underline"
                disabled={!visible.length}
                onClick={() => setSelected(new Set(visible.map((s) => s.id)))}
              >
                Seleccionar los {visible.length} visibles
              </button>
              {selected.size > 0 && (
                <button
                  type="button"
                  className="underline"
                  onClick={() => setSelected(new Set())}
                >
                  Quitar selección
                </button>
              )}
            </div>
            {selected.size > 0 && (
              <div className="mt-5 rounded-xl border bg-background p-4">
                <p className="text-sm font-semibold">
                  {selected.size} servicios seleccionados
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <label className="min-w-0 flex-1 text-sm">
                    Duración en minutos
                    <input
                      type="number"
                      min={1}
                      max={1440}
                      step={1}
                      className={field}
                      value={bulkMinutes}
                      onChange={(e) => setBulkMinutes(e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="min-h-11 rounded-xl border bg-card px-4 text-sm"
                    onClick={applyDuration}
                  >
                    Aplicar duración
                  </button>
                  <button
                    type="button"
                    className="brand-button min-h-11"
                    onClick={enableSelected}
                  >
                    Habilitar seleccionados
                  </button>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Aplicar duración usa el mismo tiempo en todas sus variantes.
                  Podés ajustar cada largo abajo. Los cambios se publican al
                  guardar.
                </p>
              </div>
            )}
          </section>
          <div className="space-y-3">
            {!visible.length && (
              <p className="rounded-2xl border bg-card p-5 text-sm">
                No hay servicios con estos filtros.
              </p>
            )}
            {visible.map((service) => (
              <section
                key={service.id}
                className="min-w-0 rounded-2xl border bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <input
                    className="mt-1 size-4 shrink-0"
                    type="checkbox"
                    aria-label={`Seleccionar ${service.name}`}
                    checked={selected.has(service.id)}
                    onChange={(e) => select(service.id, e.target.checked)}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words font-semibold">
                      {service.name}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {categoryNames[service.category] || service.category} ·{" "}
                      {service.variants.length > 1 ? "Desde " : ""}
                      {money(service.price)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {online(service)
                      ? "Reservable"
                      : !service.durationMinutes
                        ? "Falta duración"
                        : !service.professionals.length
                          ? "Falta profesional"
                          : "Desactivado"}
                  </span>
                </div>
                <div className="mt-4 grid items-center gap-4 sm:grid-cols-[180px_1fr_auto]">
                  <label className="text-sm">
                    Tiempo general (min)
                    <input
                      aria-label={`Duración de ${service.name}`}
                      className={field}
                      type="number"
                      min={1}
                      max={1440}
                      step={1}
                      required={service.bookingEnabled}
                      value={service.durationMinutes ?? ""}
                      onChange={(e) =>
                        update(service.id, {
                          durationMinutes:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                      placeholder="Sin definir"
                    />
                  </label>
                  <div className="min-w-0 text-xs leading-5 text-muted-foreground">
                    <p>Profesionales</p>
                    <p className="mt-1 break-words text-foreground">
                      {service.professionals.map((p) => p.name).join(", ") ||
                        "Asigná un profesional desde Equipo"}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={service.bookingEnabled}
                      disabled={!ready(service) && !service.bookingEnabled}
                      onChange={(e) =>
                        update(service.id, { bookingEnabled: e.target.checked })
                      }
                    />
                    Reservas online
                  </label>
                </div>
                {service.variants.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm">
                      Tiempos por variante ({service.variants.length})
                    </summary>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Dejá vacío para usar el tiempo general del servicio.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {service.variants.map((variant) => (
                        <label key={variant.id} className="min-w-0 text-sm">
                          {variant.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {money(variant.price)}
                          </span>
                          <input
                            aria-label={`${service.name} · ${variant.name} (minutos)`}
                            className={field}
                            type="number"
                            min={1}
                            max={1440}
                            step={1}
                            value={variant.durationMinutes ?? ""}
                            placeholder={
                              service.durationMinutes
                                ? `General: ${service.durationMinutes} min`
                                : "Tiempo general"
                            }
                            onChange={(e) =>
                              update(service.id, {
                                variants: service.variants.map((v) =>
                                  v.id === variant.id
                                    ? {
                                        ...v,
                                        durationMinutes:
                                          e.target.value === ""
                                            ? null
                                            : Number(e.target.value),
                                      }
                                    : v,
                                ),
                              })
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </details>
                )}
              </section>
            ))}
          </div>
        </fieldset>
        <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 rounded-2xl border bg-card p-4 shadow-sm lg:bottom-3">
          {error && (
            <p role="alert" className="mb-3 text-sm">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="mb-3 text-sm">
              {message}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {changed.length} servicios con cambios. Se conservan los precios y
              turnos anteriores.
            </p>
            <button
              className="brand-button min-h-11 w-full sm:w-auto"
              disabled={busy || !changed.length}
              type="submit"
            >
              {busy ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

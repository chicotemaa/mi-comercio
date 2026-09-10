import type {
  AppointmentRecord,
  BusinessHourRecord,
  WorkRecord,
} from "./business-shared";

// A history entry cannot be passed to appointment mutations: its channel and
// identifier belong to a work record, and its time exists only in this view.
export interface HistoricalAgendaEntry
  extends Omit<AppointmentRecord, "channel" | "createdAt"> {
  channel: "history";
  workRecord: WorkRecord;
}
export type AgendaEntry = AppointmentRecord | HistoricalAgendaEntry;
export type AgendaSourceFilter = "all" | "appointments" | "history";
export function isHistoricalEntry(
  entry: AgendaEntry,
): entry is HistoricalAgendaEntry {
  return entry.channel === "history";
}

const minutes = (time: string) =>
  Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
const timeLabel = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
type Range = { start: number; end: number };
function subtract(ranges: Range[], blocked: Range): Range[] {
  return ranges.flatMap((range) => {
    if (blocked.end <= range.start || blocked.start >= range.end)
      return [range];
    return [
      { start: range.start, end: Math.min(range.end, blocked.start) },
      { start: Math.max(range.start, blocked.end), end: range.end },
    ].filter((part) => part.end > part.start);
  });
}

export function buildHistoricalAgendaEntries(
  works: WorkRecord[],
  appointments: AppointmentRecord[],
  businessHours: BusinessHourRecord[],
): HistoricalAgendaEntry[] {
  const byDate = new Map<string, WorkRecord[]>();
  // Only identical database IDs are deduplicated. Repeat visits are legitimate.
  for (const work of new Map(works.map((work) => [work.id, work])).values()) {
    const day = byDate.get(work.workDate) ?? [];
    day.push(work);
    byDate.set(work.workDate, day);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([date, rows]) => {
      const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
      const hours = businessHours.find(
        (day) => day.dayOfWeek === weekday && day.isOpen,
      );
      let start = hours?.openTime ? minutes(hours.openTime) : 9 * 60;
      let end = hours?.closeTime ? minutes(hours.closeTime) : 18 * 60;
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        start = 9 * 60;
        end = 18 * 60;
      }
      let ranges: Range[] = [{ start, end }];
      if (hours?.breakStartTime && hours.breakEndTime) {
        ranges = subtract(ranges, {
          start: minutes(hours.breakStartTime),
          end: minutes(hours.breakEndTime),
        });
      }
      const baseRanges = ranges;
      for (const appointment of appointments) {
        if (
          appointment.appointmentDate !== date ||
          appointment.status === "cancelled"
        )
          continue;
        const occupiedStart = minutes(appointment.appointmentTime);
        ranges = subtract(ranges, {
          start: occupiedStart,
          end: occupiedStart + appointment.durationMinutes,
        });
      }
      // Prefer free visual space. Even a closed or fully booked day retains all
      // historical work: these estimated blocks never consume booking availability.
      const slots = (
        ranges.some((range) => range.end - range.start >= 15)
          ? ranges
          : baseRanges
      ).flatMap((range) => {
        const result: Range[] = [];
        for (let value = range.start; value + 15 <= range.end; value += 30) {
          result.push({ start: value, end: Math.min(value + 30, range.end) });
        }
        return result;
      });
      if (!slots.length) slots.push({ start, end: Math.min(start + 30, end) });
      return [...rows]
        .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }))
        .map((work, index) => {
          const slot = slots[index % slots.length];
          return {
            id: `history:${work.id}`,
            workRecord: work,
            channel: "history" as const,
            customerId: work.customerId,
            customerName: work.customerName,
            customerContact: "",
            customerEmail: null,
            appointmentDate: work.workDate,
            appointmentTime: timeLabel(slot.start),
            status: "completed" as const,
            serviceId: work.serviceId,
            serviceName: work.serviceName,
            staffMemberId: work.staffMemberId,
            staffName: work.staffName,
            price: work.amount,
            durationMinutes: slot.end - slot.start,
            notes: work.notes,
          };
        });
    });
}

export function matchesAgendaSource(
  entry: AgendaEntry,
  source: AgendaSourceFilter,
) {
  return (
    source === "all" ||
    (source === "history"
      ? isHistoricalEntry(entry)
      : !isHistoricalEntry(entry))
  );
}

export function getAgendaEventTiming(
  entry: AgendaEntry,
  bufferMinutes: number,
) {
  const historical = isHistoricalEntry(entry);
  return {
    durationMinutes: entry.durationMinutes + (historical ? 0 : bufferMinutes),
    startEditable: !historical,
    durationEditable: false,
  };
}

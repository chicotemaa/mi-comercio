import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseBusinessHoursScheduleRow {
  id: string;
  day_of_week: number;
  label: string;
  open_time: string | null;
  close_time: string | null;
  break_start_time?: string | null;
  break_end_time?: string | null;
  is_open: boolean;
}

export interface SupabaseStaffWorkingHoursScheduleRow {
  id: string;
  staff_member_id: string;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  break_start_time?: string | null;
  break_end_time?: string | null;
  is_active: boolean;
}

const BUSINESS_HOURS_SELECT_FIELDS =
  "id, day_of_week, label, open_time, close_time, break_start_time, break_end_time, is_open";
const LEGACY_BUSINESS_HOURS_SELECT_FIELDS =
  "id, day_of_week, label, open_time, close_time, is_open";
const STAFF_WORKING_HOURS_SELECT_FIELDS =
  "id, staff_member_id, day_of_week, start_time, end_time, break_start_time, break_end_time, is_active";
const LEGACY_STAFF_WORKING_HOURS_SELECT_FIELDS =
  "id, staff_member_id, day_of_week, start_time, end_time, is_active";

interface ScheduleErrorLike {
  code?: string | null;
  details?: string | null;
  hint?: string | null;
  message?: string | null;
}

export function isMissingScheduleBreakColumnsError(
  error: ScheduleErrorLike | null | undefined,
) {
  if (!error) {
    return false;
  }

  const normalizedMessage =
    `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();

  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    normalizedMessage.includes("break_start_time") ||
    normalizedMessage.includes("break_end_time")
  );
}

export async function fetchBusinessHoursRows(
  supabase: SupabaseClient,
  businessId: string,
) {
  const primaryResponse = await supabase
    .from("business_hours")
    .select(BUSINESS_HOURS_SELECT_FIELDS)
    .eq("business_id", businessId)
    .order("day_of_week", { ascending: true });

  if (!primaryResponse.error) {
    return {
      data: primaryResponse.data as SupabaseBusinessHoursScheduleRow[] | null,
      error: null,
      hasBreakColumns: true,
    };
  }

  if (!isMissingScheduleBreakColumnsError(primaryResponse.error)) {
    return {
      data: null,
      error: primaryResponse.error,
      hasBreakColumns: true,
    };
  }

  const legacyResponse = await supabase
    .from("business_hours")
    .select(LEGACY_BUSINESS_HOURS_SELECT_FIELDS)
    .eq("business_id", businessId)
    .order("day_of_week", { ascending: true });

  if (legacyResponse.error) {
    return {
      data: null,
      error: legacyResponse.error,
      hasBreakColumns: false,
    };
  }

  return {
    data:
      (
        legacyResponse.data as
          | Omit<
              SupabaseBusinessHoursScheduleRow,
              "break_start_time" | "break_end_time"
            >[]
          | null
      )?.map((row) => ({
        ...row,
        break_start_time: null,
        break_end_time: null,
      })) ?? [],
    error: null,
    hasBreakColumns: false,
  };
}

export async function fetchStaffWorkingHoursRows(supabase: SupabaseClient) {
  const primaryResponse = await supabase
    .from("staff_member_working_hours")
    .select(STAFF_WORKING_HOURS_SELECT_FIELDS)
    .order("day_of_week", { ascending: true });

  if (!primaryResponse.error) {
    return {
      data: primaryResponse.data as
        | SupabaseStaffWorkingHoursScheduleRow[]
        | null,
      error: null,
      hasBreakColumns: true,
    };
  }

  if (!isMissingScheduleBreakColumnsError(primaryResponse.error)) {
    return {
      data: null,
      error: primaryResponse.error,
      hasBreakColumns: true,
    };
  }

  const legacyResponse = await supabase
    .from("staff_member_working_hours")
    .select(LEGACY_STAFF_WORKING_HOURS_SELECT_FIELDS)
    .order("day_of_week", { ascending: true });

  if (legacyResponse.error) {
    return {
      data: null,
      error: legacyResponse.error,
      hasBreakColumns: false,
    };
  }

  return {
    data:
      (
        legacyResponse.data as
          | Omit<
              SupabaseStaffWorkingHoursScheduleRow,
              "break_start_time" | "break_end_time"
            >[]
          | null
      )?.map((row) => ({
        ...row,
        break_start_time: null,
        break_end_time: null,
      })) ?? [],
    error: null,
    hasBreakColumns: false,
  };
}

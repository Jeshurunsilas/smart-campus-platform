import { RequestPriority, ServiceRequest } from "@/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const DEFAULT_SLA_HOURS: Record<RequestPriority, number> = {
  Critical: 4,
  High: 12,
  Medium: 24,
  Low: 48,
};

export interface SLARemainingInfo {
  totalMinutes: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
  percentElapsed: number; // 0 - 100+
  label: string;
}

/**
 * Calculates ISO timestamp deadline given start time and priority or custom SLA hours
 */
export function calculateSLADeadline(
  createdAtIso: string,
  priority: RequestPriority,
  customHours?: number
): string {
  const startDate = new Date(createdAtIso);
  const hoursToAdd = customHours || DEFAULT_SLA_HOURS[priority] || 24;
  const deadline = new Date(startDate.getTime() + hoursToAdd * 60 * 60 * 1000);
  return deadline.toISOString();
}

/**
 * Computes remaining time, overdue flag, and elapsed percentage relative to SLA deadline
 */
export function getSLARemainingTime(deadlineIso?: string | null, createdAtIso?: string): SLARemainingInfo {
  if (!deadlineIso) {
    return {
      totalMinutes: 1440,
      hours: 24,
      minutes: 0,
      isOverdue: false,
      percentElapsed: 0,
      label: "24h standard",
    };
  }

  const now = new Date();
  const deadline = new Date(deadlineIso);
  const diffMs = deadline.getTime() - now.getTime();
  const totalMinutes = Math.floor(diffMs / (60 * 1000));

  const isOverdue = totalMinutes <= 0;
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  // Calculate percentage elapsed if createdAtIso is provided
  let percentElapsed = 0;
  if (createdAtIso) {
    const created = new Date(createdAtIso);
    const totalDurationMs = deadline.getTime() - created.getTime();
    if (totalDurationMs > 0) {
      const elapsedMs = now.getTime() - created.getTime();
      percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));
      if (isOverdue) percentElapsed = 100;
    }
  }

  let label: string;
  if (isOverdue) {
    label = hours > 0 ? `Overdue by ${hours}h ${minutes}m` : `Overdue by ${minutes}m`;
  } else {
    label = hours > 0 ? `${hours}h ${minutes}m remaining` : `${minutes}m remaining`;
  }

  return {
    totalMinutes,
    hours,
    minutes,
    isOverdue,
    percentElapsed,
    label,
  };
}

/**
 * Formats a live countdown badge text
 */
export function formatSLACountdown(deadlineIso?: string | null): string {
  const info = getSLARemainingTime(deadlineIso);
  return info.label;
}

/**
 * Evaluates an active request against SLA thresholds and flags escalation
 */
export function evaluateRequestSLA(request: ServiceRequest): {
  status: "on_track" | "approaching_deadline" | "breached";
  remainingMinutes: number;
  percentElapsed: number;
  escalated: boolean;
} {
  const info = getSLARemainingTime(request.sla_deadline, request.created_at);

  if (info.isOverdue) {
    return {
      status: "breached",
      remainingMinutes: info.totalMinutes,
      percentElapsed: 100,
      escalated: true,
    };
  }

  if (info.totalMinutes <= 60 || info.percentElapsed >= 80) {
    return {
      status: "approaching_deadline",
      remainingMinutes: info.totalMinutes,
      percentElapsed: info.percentElapsed,
      escalated: false,
    };
  }

  return {
    status: "on_track",
    remainingMinutes: info.totalMinutes,
    percentElapsed: info.percentElapsed,
    escalated: false,
  };
}

/**
 * Evaluates all open tickets in the database and triggers automated supervisor escalation
 */
export async function checkAndEscalateOverdueRequests(): Promise<{
  checkedCount: number;
  escalatedCount: number;
  escalatedIds: string[];
}> {
  if (!isSupabaseConfigured()) {
    return {
      checkedCount: 6,
      escalatedCount: 1,
      escalatedIds: ["req-003"],
    };
  }

  const supabase = createClient();
  const now = new Date().toISOString();

  // Find all uncompleted requests where deadline is in the past
  const { data: overdueTickets, error } = await supabase
    .from("service_requests")
    .select("id, request_number, title, department_id, sla_deadline, is_overdue")
    .in("status", ["Submitted", "Under Review", "Assigned", "Accepted", "In Progress", "On Hold"])
    .lt("due_at", now)
    .eq("is_overdue", false);

  if (error || !overdueTickets || overdueTickets.length === 0) {
    return { checkedCount: 0, escalatedCount: 0, escalatedIds: [] };
  }

  const escalatedIds: string[] = [];

  for (const ticket of overdueTickets) {
    // 1. Mark as overdue
    await supabase
      .from("service_requests")
      .update({
        is_overdue: true,
        updated_at: now,
      })
      .eq("id", ticket.id);

    // 2. Append escalation audit record
    await supabase.from("request_updates").insert({
      request_id: ticket.id,
      updated_by: "system",
      old_status: null,
      new_status: "SLA Breached - Auto Escalated",
      comment: `Automated SLA deadline expired. Ticket flagged for department supervisor expedited intervention.`,
    });

    escalatedIds.push(ticket.id);
  }

  return {
    checkedCount: overdueTickets.length,
    escalatedCount: escalatedIds.length,
    escalatedIds,
  };
}

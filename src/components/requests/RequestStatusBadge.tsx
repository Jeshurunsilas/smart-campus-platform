import React from "react";
import { RequestStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  Eye,
  UserCheck,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  CheckCheck,
  Archive,
  XCircle,
} from "lucide-react";

export interface RequestStatusBadgeProps {
  status: RequestStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function RequestStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className,
}: RequestStatusBadgeProps) {
  const statusConfig: Record<
    RequestStatus,
    { label: string; icon: React.ElementType; classes: string }
  > = {
    Submitted: {
      label: "Submitted",
      icon: Clock,
      classes: "bg-sky-50 text-sky-700 border-sky-200",
    },
    "Under Review": {
      label: "Under Review",
      icon: Eye,
      classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    Assigned: {
      label: "Assigned",
      icon: UserCheck,
      classes: "bg-blue-50 text-blue-700 border-blue-200",
    },
    Accepted: {
      label: "Accepted",
      icon: CheckCircle,
      classes: "bg-teal-50 text-teal-700 border-teal-200",
    },
    "In Progress": {
      label: "In Progress",
      icon: PlayCircle,
      classes: "bg-amber-50 text-amber-700 border-amber-200",
    },
    "On Hold": {
      label: "On Hold",
      icon: PauseCircle,
      classes: "bg-orange-50 text-orange-700 border-orange-200",
    },
    Resolved: {
      label: "Resolved",
      icon: CheckCheck,
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    Closed: {
      label: "Closed",
      icon: Archive,
      classes: "bg-slate-100 text-slate-700 border-slate-200",
    },
    Rejected: {
      label: "Rejected",
      icon: XCircle,
      classes: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const current = statusConfig[status] || {
    label: status,
    icon: Clock,
    classes: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const Icon = current.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        current.classes,
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3 shrink-0" : "w-3.5 h-3.5 shrink-0"} />}
      {current.label}
    </span>
  );
}

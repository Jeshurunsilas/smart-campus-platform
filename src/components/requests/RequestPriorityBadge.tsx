import React from "react";
import { RequestPriority } from "@/types";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ArrowDown, Flame } from "lucide-react";

export interface RequestPriorityBadgeProps {
  priority: RequestPriority;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function RequestPriorityBadge({
  priority,
  size = "md",
  showIcon = true,
  className,
}: RequestPriorityBadgeProps) {
  const priorityConfig: Record<
    RequestPriority,
    { label: string; icon: React.ElementType; classes: string }
  > = {
    Low: {
      label: "Low",
      icon: ArrowDown,
      classes: "bg-slate-100 text-slate-700 border-slate-200",
    },
    Medium: {
      label: "Medium",
      icon: AlertCircle,
      classes: "bg-blue-50 text-blue-700 border-blue-200",
    },
    High: {
      label: "High",
      icon: AlertTriangle,
      classes: "bg-amber-50 text-amber-800 border-amber-200",
    },
    Critical: {
      label: "Critical",
      icon: Flame,
      classes: "bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse",
    },
  };

  const current = priorityConfig[priority] || priorityConfig.Low;
  const Icon = current.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold rounded-md border whitespace-nowrap",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        current.classes,
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "w-2.5 h-2.5 shrink-0" : "w-3 h-3 shrink-0"} />}
      {current.label}
    </span>
  );
}

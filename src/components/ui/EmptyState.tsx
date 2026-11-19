import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-12 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-1.5 text-xs text-slate-500 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

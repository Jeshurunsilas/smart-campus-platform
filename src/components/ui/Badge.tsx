import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "teal" | "purple";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    default: "bg-slate-900 text-white border-transparent",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    destructive: "bg-rose-50 text-rose-700 border-rose-200",
    outline: "text-slate-700 border-slate-300 bg-white",
    teal: "bg-teal-50 text-teal-800 border-teal-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors shadow-2xs",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

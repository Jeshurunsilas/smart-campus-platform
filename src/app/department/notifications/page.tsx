"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { CheckCheck, Clock, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DepartmentNotificationsPage() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DashboardShell role="staff">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dispatch Notifications
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Emergency dispatches, ticket assignments, and supervisor priority escalation alerts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          leftIcon={<CheckCheck className="w-4 h-4 text-teal-700" />}
        >
          Mark all as read
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-5 flex items-start justify-between gap-4 transition-colors ${
              notif.read ? "bg-white" : "bg-amber-50/40"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl border shrink-0 ${
                  notif.read
                    ? "bg-slate-50 border-slate-200 text-slate-600"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                }`}
              >
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {notif.message}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(notif.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

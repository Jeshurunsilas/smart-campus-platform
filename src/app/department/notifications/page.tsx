"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { CheckCheck, Clock, Wrench, Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/services/notifications";
import { InAppNotification } from "@/types";

export default function DepartmentNotificationsPage() {
  const [notifications, setNotifications] = useState<InAppNotification[]>(DEMO_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getUserNotifications()
      .then((data) => {
        if (isMounted) {
          setNotifications(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not load notifications:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.warn("Failed to mark all as read:", err);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.warn("Failed to mark read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-teal-700" />}
          >
            Mark all ({unreadCount}) as read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading dispatch notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No new notifications in your inbox.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && handleMarkSingleRead(notif.id)}
              className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                notif.read ? "bg-white hover:bg-slate-50/60" : "bg-amber-50/40 hover:bg-amber-50/70"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-2xl border shrink-0 ${
                    notif.read
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : notif.title.toLowerCase().includes("urgent") || notif.title.toLowerCase().includes("critical")
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  {notif.title.toLowerCase().includes("urgent") || notif.title.toLowerCase().includes("critical") ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Wrench className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(notif.created_at)}</span>
                  </div>
                </div>
              </div>

              {!notif.read && (
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                  New
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";
import { InAppNotification } from "@/types";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotifications,
} from "@/lib/services/notifications";
import { getCurrentUserProfile } from "@/lib/services/auth";
import { formatDate } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  Clock,
  CheckCircle2,
  UserCheck,
  Megaphone,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FacultyNotificationsPage() {
  const [notifications, setNotifications] = useState<InAppNotification[]>(DEMO_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getUserNotifications()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setNotifications(data);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    let sub: { unsubscribe: () => void } | undefined;
    getCurrentUserProfile().then((u) => {
      if (u && isMounted) {
        sub = subscribeToNotifications(u.id, (newNotif) => {
          setNotifications((prev) => [newNotif, ...prev]);
        });
      }
    });

    return () => {
      isMounted = false;
      if (sub) sub.unsubscribe();
    };
  }, []);

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notif: InAppNotification) => {
    if (notif.read) return;
    try {
      await markNotificationAsRead(notif.id);
    } catch {
      // Silent error
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
  };

  const displayedNotifications = filterUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "status_change":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "announcement":
        return <Megaphone className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <DashboardShell role="faculty">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Faculty Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time status updates on lab equipment, scheduled facilities work, and campus alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterUnreadOnly ? "teal" : "outline"}
            size="sm"
            onClick={() => setFilterUnreadOnly((prev) => !prev)}
          >
            {filterUnreadOnly ? "Show All" : "Unread Only"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            isLoading={markingAll}
            disabled={unreadCount === 0}
            leftIcon={<CheckCheck className="w-4 h-4 text-teal-700" />}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Loading notifications...</span>
        </div>
      ) : displayedNotifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500">
            {filterUnreadOnly
              ? "You have caught up with all your notifications!"
              : "You do not have any notification records right now."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-50/70 ${
                notif.read ? "bg-white" : "bg-emerald-50/30"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-2xl border shrink-0 ${
                    notif.read
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs"
                  }`}
                >
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
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

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 capitalize whitespace-nowrap">
                  {notif.type.replace("_", " ")}
                </span>
                {!notif.read && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Click to read
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

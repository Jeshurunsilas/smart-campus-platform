"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import {
  Menu,
  Bell,
  Search,
  Clock,
  ChevronDown,
  Sparkles,
  Shield,
  GraduationCap,
  Briefcase,
  Wrench,
} from "lucide-react";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";

interface TopNavbarProps {
  role: UserRole;
  userName?: string;
  onToggleMobileMenu: () => void;
}

export function TopNavbar({
  role,
  userName = "Demo User",
  onToggleMobileMenu,
}: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const roles = [
    { name: "Student", role: "student" as const, href: "/student/dashboard", icon: GraduationCap },
    { name: "Faculty", role: "faculty" as const, href: "/faculty/dashboard", icon: Briefcase },
    { name: "Staff Dispatch", role: "staff" as const, href: "/department/dashboard", icon: Wrench },
    { name: "Administrator", role: "administrator" as const, href: "/admin/dashboard", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search service requests, locations, staff..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right: Quick Role Switcher (Demo Feature) & Notifications & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSwitcher(!showRoleSwitcher);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-semibold hover:bg-teal-100/80 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden md:inline">Switch Role:</span>
            <span className="capitalize font-bold">{role}</span>
            <ChevronDown className="w-3 h-3 text-teal-700 ml-0.5" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Demonstration Switcher
              </div>
              <div className="space-y-1">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = role === r.role;
                  return (
                    <Link
                      key={r.name}
                      href={r.href}
                      onClick={() => setShowRoleSwitcher(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                        isCurrent
                          ? "bg-slate-900 text-white font-semibold"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isCurrent ? "text-teal-400" : "text-slate-500")} />
                      <span>{r.name} Portal</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSwitcher(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown p-4 z-50 animate-in fade-in zoom-in-95 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-teal-700 hover:text-teal-800 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-3 rounded-xl border text-xs transition-colors",
                        notif.read
                          ? "bg-white border-slate-100 text-slate-600"
                          : "bg-teal-50/50 border-teal-100 text-slate-900"
                      )}
                    >
                      <div className="font-semibold">{notif.title}</div>
                      <p className="mt-0.5 text-slate-500 leading-relaxed text-[11px]">
                        {notif.message}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>Just now</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-xs shadow-2xs">
            {userName.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden lg:inline">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}

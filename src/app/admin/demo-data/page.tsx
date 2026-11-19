"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Database,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  FolderTree,
  MapPin,
  ClipboardList,
  UserCheck,
  History,
  Bell,
  Megaphone,
  Star,
  Copy,
  Check,
  Shield,
  GraduationCap,
  Briefcase,
  Wrench,
  ExternalLink,
} from "lucide-react";

interface DemoCounts {
  users: number;
  departments: number;
  categories: number;
  locations: number;
  serviceRequests: number;
  assignments: number;
  requestUpdates: number;
  notifications: number;
  announcements: number;
  feedback: number;
}

interface DemoUserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  identifier: string;
}

interface DepartmentData {
  id: string;
  name: string;
  description: string;
  department_head: string;
}

interface LocationData {
  id: string;
  building_name: string;
  floor: string;
  room_number: string;
  qr_code: string;
}

export default function AdminDemoDataPage() {
  const [isSeeded, setIsSeeded] = useState(false);
  const [counts, setCounts] = useState<DemoCounts>({
    users: 0,
    departments: 0,
    categories: 0,
    locations: 0,
    serviceRequests: 0,
    assignments: 0,
    requestUpdates: 0,
    notifications: 0,
    announcements: 0,
    feedback: 0,
  });
  const [demoUsers, setDemoUsers] = useState<DemoUserData[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/demo-data");
      if (res.ok) {
        const data = await res.json();
        setIsSeeded(data.isSeeded);
        setCounts(data.counts);
        setDemoUsers(data.demoUsers || []);
        setDepartments(data.departments || []);
        setLocations(data.locations || []);
      }
    } catch (e) {
      console.error("Failed to load demo status", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/demo-data")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        setIsSeeded(data.isSeeded);
        setCounts(data.counts);
        setDemoUsers(data.demoUsers || []);
        setDepartments(data.departments || []);
        setLocations(data.locations || []);
      })
      .catch((e) => {
        console.error("Failed to load initial demo status", e);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/demo-data", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to seed demo database");
      }
      setMessage({ type: "success", text: data.message || "Demo dataset seeded successfully!" });
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error executing seed operation";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/demo-data", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to clean demo data");
      }
      setIsResetModalOpen(false);
      setMessage({ type: "success", text: data.message || "Demo dataset cleaned successfully." });
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resetting demo database";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsResetting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const metricCards = [
    { title: "Demo Users", count: counts.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Departments", count: counts.departments, icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Issue Categories", count: counts.categories, icon: FolderTree, color: "text-teal-600", bg: "bg-teal-50" },
    { title: "Campus Locations", count: counts.locations, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Sample Requests", count: counts.serviceRequests, icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Staff Assignments", count: counts.assignments, icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Update Logs", count: counts.requestUpdates, icon: History, color: "text-slate-600", bg: "bg-slate-100" },
    { title: "Notifications", count: counts.notifications, icon: Bell, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Announcements", count: counts.announcements, icon: Megaphone, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Feedback Ratings", count: counts.feedback, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const roleIcons: Record<string, React.ElementType> = {
    administrator: Shield,
    student: GraduationCap,
    faculty: Briefcase,
    department_staff: Wrench,
  };

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Demo Data Management
                  </h1>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                      isSeeded
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSeeded ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    {isSeeded ? "Seeded & Operational" : "Unseeded"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Deterministic demo dataset with 4 role-based personas, 8 departments, 10 locations, and 26 realistic tickets.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              disabled={isSeeding || isResetting || !isSeeded}
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              leftIcon={<Trash2 className="w-4 h-4 text-rose-600" />}
            >
              Reset Demo Data
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSeed}
              isLoading={isSeeding}
              disabled={isResetting}
              leftIcon={
                isSeeded ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4 text-teal-300" />
                )
              }
            >
              {isSeeded ? "Re-apply / Sync Seed" : "Seed Demo Database"}
            </Button>
          </div>
        </div>

        {/* Status / Alert Message */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {isLoading ? "..." : card.count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Personas Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Pre-Configured Demo Accounts
              </h2>
              <p className="text-xs text-slate-500">
                These 4 deterministic accounts provide immediate access across every authorization boundary.
              </p>
            </div>
            <div className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
              Password: <span className="font-bold text-teal-800">DEMO_USER_PASSWORD</span> from .env.local
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {demoUsers.map((user) => {
              const RoleIcon = roleIcons[user.role] || Shield;
              const isCopied = copiedEmail === user.email;

              return (
                <div
                  key={user.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {user.role.replace("_", " ")}
                      </span>
                      <div className="p-1 rounded-md bg-white border border-slate-200 text-teal-600">
                        <RoleIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{user.full_name}</h3>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        ID: {user.identifier}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600 font-mono truncate">{user.email}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.email)}
                      className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                      title="Copy Email"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8 Departments & 10 Campus Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                8 Operational Campus Departments
              </h2>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {departments.length} Units
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{dept.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Head: {dept.department_head}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                10 Configured Campus Locations (with QR Codes)
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {locations.length} Locations
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{loc.building_name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {loc.floor} &bull; {loc.room_number}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 truncate max-w-[140px]">
                    QR Ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-sm">Need to execute seed via terminal?</div>
            <div className="text-xs text-slate-400">
              Run <code className="text-teal-400 font-mono">npm run seed</code> or apply the SQL migration at{" "}
              <code className="text-teal-400 font-mono">database/seed.sql</code>.
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/login", "_blank")}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 shrink-0"
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Open /login in New Tab
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirm Demo Data Reset"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Important Safety Guarantee:</span> This operation removes ONLY deterministic demo fixtures matching the 4 demo profiles and seeded requests. Genuine user accounts, approved registrations, and production tickets will be safely preserved.
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Are you sure you want to clean the demo data? You can re-seed anytime with the &quot;Seed Demo Database&quot; button.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              isLoading={isResetting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Yes, Clean Demo Records
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}

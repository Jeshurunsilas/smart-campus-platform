"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_ENROLMENTS,
  DEMO_COURSES,
  updateEnrolmentStatus,
} from "@/lib/services/academic-services";
import { CourseEnrolment, UserProfile } from "@/types";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
  Check,
  X,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function AdminEnrolmentsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.admin);
  const [enrolments, setEnrolments] = useState<CourseEnrolment[]>(DEMO_ENROLMENTS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState<string | null>(null);

  const filteredEnrolments = enrolments.filter(
    (e) => statusFilter === "all" || e.status === statusFilter
  );

  const handleApprove = async (id: string) => {
    const res = await updateEnrolmentStatus(id, "approved");
    if (res.success && res.enrolment) {
      setEnrolments((prev) =>
        prev.map((e) => (e.id === id ? (res.enrolment as CourseEnrolment) : e))
      );
      setNotification("Enrolment seat confirmed.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleReject = async (id: string) => {
    const res = await updateEnrolmentStatus(id, "rejected", "Administrative capacity allocation cap reached");
    if (res.success && res.enrolment) {
      setEnrolments((prev) =>
        prev.map((e) => (e.id === id ? (res.enrolment as CourseEnrolment) : e))
      );
      setNotification("Enrolment rejected and notification queued.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleBatchApprovePending = async () => {
    const pendings = enrolments.filter((e) => e.status === "pending");
    for (const p of pendings) {
      await updateEnrolmentStatus(p.id, "approved");
    }
    setEnrolments((prev) =>
      prev.map((e) => (e.status === "pending" ? { ...e, status: "approved" } : e))
    );
    setNotification(`Successfully processed all ${pendings.length} pending candidate registrations.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <DashboardShell
      title="University Enrolment & Seat Capacity Oversight"
      subtitle="Oversee cross-departmental registration requests, quota distributions, and waitlist allocations"
      role="administrator"
      user={user}
    >
      {notification && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Total Registrations"
          value={enrolments.length}
          icon={Users}
        />
        <StatsCard
          title="Confirmed Seats"
          value={enrolments.filter((e) => e.status === "approved").length}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Pending Approvals"
          value={enrolments.filter((e) => e.status === "pending").length}
          icon={Clock}
          className={
            enrolments.filter((e) => e.status === "pending").length > 0
              ? "border-amber-500/40 bg-amber-500/5"
              : ""
          }
        />
        <StatsCard
          title="Waitlisted Students"
          value={enrolments.filter((e) => e.status === "waitlisted").length}
          icon={Layers}
        />
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">All Enrolments</option>
            <option value="approved">Approved / Confirmed</option>
            <option value="pending">Pending Approval</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {enrolments.some((e) => e.status === "pending") && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleBatchApprovePending}
            className="flex items-center gap-1.5 shadow-sm text-xs"
          >
            <Check className="h-4 w-4" /> Batch Approve All Pending
          </Button>
        )}
      </div>

      {/* Enrolments Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Enrolment Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredEnrolments.map((enr) => (
                <tr key={enr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {enr.student?.full_name || "Aarav Sharma"}
                    </p>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {enr.student?.student_id || "2024-CSE-042"}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {enr.course?.course_code || "CS301"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {enr.course?.title || "Operating Systems"}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    Section {enr.section?.section_name || "A"}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {enr.enrolled_at}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        enr.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : enr.status === "pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          : enr.status === "waitlisted"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {enr.status === "approved" && <CheckCircle2 className="h-3 w-3" />}
                      {enr.status === "pending" && <Clock className="h-3 w-3" />}
                      {enr.status === "waitlisted" && <Layers className="h-3 w-3" />}
                      {enr.status === "rejected" && <XCircle className="h-3 w-3" />}
                      {enr.status.toUpperCase()}
                      {enr.waitlist_position && ` (#${enr.waitlist_position})`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {enr.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(enr.id)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Check className="h-3 w-3" /> Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(enr.id)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No action required</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

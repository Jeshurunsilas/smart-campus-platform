"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  DEMO_COURSE_REQUESTS,
  DEMO_COURSE_MEMBERSHIPS,
  reviewCourseRequest,
} from "@/lib/services/academic-services";
import {
  AcademicCourse,
  CourseEnrolmentRequest,
  UserProfile,
} from "@/types";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  AlertTriangle,
  Building2,
  ShieldAlert,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function AdminCourseRequestsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.admin);
  const [requests, setRequests] = useState<CourseEnrolmentRequest[]>(DEMO_COURSE_REQUESTS);
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reject modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (typeFilter !== "all" && r.request_type !== typeFilter) return false;
    if (courseFilter !== "all" && r.course_id !== courseFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.applicant_id.toLowerCase().includes(q) ||
        r.course_id.toLowerCase().includes(q) ||
        (r.reason ? r.reason.toLowerCase().includes(q) : false)
      );
    }
    return true;
  });

  const handleApprove = async (requestId: string) => {
    const res = await reviewCourseRequest(requestId, "approve", user.id);
    if (res.success && res.request) {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? res.request! : r)));
      setNotification({
        type: "success",
        message: "Administrative approval recorded and membership granted.",
      });
    } else {
      setNotification({
        type: "error",
        message: res.error || "Approval failed.",
      });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    const res = await reviewCourseRequest(
      rejectingId,
      "reject",
      user.id,
      rejectionReason || "Institutional policy administrative override."
    );

    if (res.success && res.request) {
      setRequests((prev) => prev.map((r) => (r.id === rejectingId ? res.request! : r)));
      setNotification({
        type: "success",
        message: "Request rejected under administrative authority.",
      });
      setRejectingId(null);
      setRejectionReason("");
    } else {
      setNotification({
        type: "error",
        message: res.error || "Rejection failed.",
      });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "WAITLISTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Waitlisted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case "CANCELLED":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Cancelled
          </span>
        );
    }
  };

  return (
    <DashboardShell
      title="Campus-Wide Course Enrolment & Capacity Oversight"
      subtitle="Institutional request auditing: inspect enrolment pressures, resolve waitlist bottlenecks, and execute administrative overrides."
      role="administrator"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Management
          </Link>
          <Link href="/admin/course-approvals">
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Course Approvals
            </Button>
          </Link>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={requests.length}
            icon={Users}
          />
          <StatsCard
            title="Pending Review"
            value={requests.filter((r) => r.status === "PENDING").length}
            icon={Clock}
          />
          <StatsCard
            title="Waitlisted Students"
            value={requests.filter((r) => r.status === "WAITLISTED").length}
            icon={AlertTriangle}
          />
          <StatsCard
            title="Approved Memberships"
            value={requests.filter((r) => r.status === "APPROVED").length}
            icon={CheckCircle2}
          />
        </div>

        {/* Course Capacity Pressure Monitor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Seat Saturation & Bottleneck Analytics
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Real-time transactional seat tracking
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.slice(0, 4).map((c) => {
              const enrolled = DEMO_COURSE_MEMBERSHIPS.filter(
                (m) =>
                  m.course_id === c.id &&
                  (m.role === "student" || m.membership_role === "student") &&
                  (m.status === "ACTIVE" || m.status === "active")
              ).length;
              const cap = c.max_enrolment_capacity || 50;
              const percent = Math.min(100, Math.round((enrolled / cap) * 100));
              const isBottleneck = percent >= 90;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border ${
                    isBottleneck
                      ? "border-amber-300 bg-amber-50/40"
                      : "border-slate-200 bg-slate-50/50"
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{c.course_code}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isBottleneck
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {percent}% Capacity
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 truncate">{c.title}</h4>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isBottleneck ? "bg-amber-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Enrolled: {enrolled}</span>
                    <span>Max: {cap}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_code}: {c.title}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white outline-none"
            >
              <option value="all">All Request Types</option>
              <option value="student_join">Student Join</option>
              <option value="faculty_collaboration">Faculty Collaboration</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicant ID, course, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Applicant ID</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Target Course</th>
                  <th className="py-3 px-4">Application Type</th>
                  <th className="py-3 px-4">Statement / Justification</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No course enrolment or collaboration requests match filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const targetCourse = courses.find((c) => c.id === req.course_id);

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          {req.applicant_id}
                        </td>
                        <td className="py-3 px-4 capitalize">{req.applicant_role}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900">
                            {targetCourse?.course_code || req.course_id}
                          </span>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {targetCourse?.title}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              req.request_type === "faculty_collaboration"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {req.request_type === "faculty_collaboration"
                              ? `Collab: ${req.requested_role}`
                              : "Student Enrolment"}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">{req.reason}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{req.created_at.split("T")[0]}</td>
                        <td className="py-3 px-4">{getStatusBadge(req.status)}</td>
                        <td className="py-3 px-4 text-right">
                          {req.status === "PENDING" || req.status === "WAITLISTED" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(req.id)}
                                className="h-7 text-xs px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              >
                                Override Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRejectingId(req.id)}
                                className="h-7 text-xs px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Administrative Override Rejection</h3>
            </div>
            <p className="text-xs text-slate-600">
              Specify the administrative or policy justification for declining this course enrolment application.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Administrative quota re-allocation or degree programme curriculum mismatch..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRejectConfirm}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

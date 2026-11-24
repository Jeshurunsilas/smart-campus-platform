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
  reviewCourseRequest,
  bulkApproveStudentRequests,
} from "@/lib/services/academic-services";
import { CourseEnrolmentRequest, AcademicCourse, UserProfile } from "@/types";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  CheckCheck,
  AlertTriangle,
  FileText,
  UserPlus,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function FacultyCourseRequestsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [requests, setRequests] = useState<CourseEnrolmentRequest[]>(DEMO_COURSE_REQUESTS);
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);

  // Filters
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Selection for bulk actions
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

  // Reject modal state
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Feedback notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Courses owned by this faculty
  const myCourses = courses.filter((c) => c.faculty_owner_id === user.id);
  const myCourseIds = new Set(myCourses.map((c) => c.id));

  // Requests related to courses owned by this faculty
  const myCourseRequests = requests.filter((r) => myCourseIds.has(r.course_id));

  const filteredRequests = myCourseRequests.filter((r) => {
    if (courseFilter !== "all" && r.course_id !== courseFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (typeFilter !== "all" && r.request_type !== typeFilter) return false;
    return true;
  });

  const pendingRequests = myCourseRequests.filter((r) => r.status === "PENDING");
  const pendingStudentRequests = pendingRequests.filter((r) => r.request_type === "student_join");

  const handleSelectAllPendingStudents = () => {
    if (selectedRequestIds.length === pendingStudentRequests.length) {
      setSelectedRequestIds([]);
    } else {
      setSelectedRequestIds(pendingStudentRequests.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedRequestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApprove = async (requestId: string) => {
    const res = await reviewCourseRequest(requestId, "approve", user.id);
    if (res.success && res.request) {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? res.request! : r)));
      setNotification({
        type: "success",
        message: "Request approved! Student enrolled and membership record created successfully.",
      });
      setSelectedRequestIds((prev) => prev.filter((id) => id !== requestId));
    } else {
      setNotification({
        type: "error",
        message: res.error || "Failed to approve request.",
      });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingRequestId) return;
    const res = await reviewCourseRequest(
      rejectingRequestId,
      "reject",
      user.id,
      rejectionReason || "Prerequisites or capacity criteria not met."
    );

    if (res.success && res.request) {
      setRequests((prev) => prev.map((r) => (r.id === rejectingRequestId ? res.request! : r)));
      setNotification({
        type: "success",
        message: "Request rejected with formal justification recorded.",
      });
      setSelectedRequestIds((prev) => prev.filter((id) => id !== rejectingRequestId));
      setRejectingRequestId(null);
      setRejectionReason("");
    } else {
      setNotification({
        type: "error",
        message: res.error || "Failed to reject request.",
      });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBulkApprove = async () => {
    if (selectedRequestIds.length === 0) return;
    const res = await bulkApproveStudentRequests(selectedRequestIds, user.id);
    if (res.success) {
      setRequests((prev) =>
        prev.map((r) =>
          selectedRequestIds.includes(r.id)
            ? { ...r, status: "APPROVED", reviewed_by: user.id, reviewed_at: new Date().toISOString() }
            : r
        )
      );
      setNotification({
        type: "success",
        message: `Successfully bulk approved ${res.approvedCount} student join requests!`,
      });
      setSelectedRequestIds([]);
    } else {
      setNotification({
        type: "error",
        message: res.errors.join(", ") || "Failed to bulk approve.",
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Cancelled
          </span>
        );
    }
  };

  return (
    <DashboardShell
      title="Course Enrolment & Collaboration Requests"
      subtitle="Review pending student join applications and faculty co-instruction collaboration proposals."
      role="faculty"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/faculty/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Courses
          </Link>
          {selectedRequestIds.length > 0 && (
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
              <span className="text-xs font-semibold text-indigo-900">
                {selectedRequestIds.length} request(s) selected
              </span>
              <Button
                size="sm"
                onClick={handleBulkApprove}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Bulk Approve Selected
              </Button>
            </div>
          )}
        </div>

        {/* Notifications */}
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
            value={myCourseRequests.length}
            icon={FileText}
          />
          <StatsCard
            title="Pending Student Joins"
            value={pendingStudentRequests.length}
            icon={Users}
          />
          <StatsCard
            title="Faculty Collab Requests"
            value={myCourseRequests.filter((r) => r.request_type === "faculty_collaboration" && r.status === "PENDING").length}
            icon={UserPlus}
          />
          <StatsCard
            title="Approved Total"
            value={myCourseRequests.filter((r) => r.status === "APPROVED").length}
            icon={CheckCircle2}
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters:
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All My Courses ({myCourses.length})</option>
              {myCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_code}: {c.title}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Request Types</option>
              <option value="student_join">Student Join Requests</option>
              <option value="faculty_collaboration">Faculty Collaboration</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved Only</option>
              <option value="WAITLISTED">Waitlisted Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          {pendingStudentRequests.length > 0 && (
            <button
              onClick={handleSelectAllPendingStudents}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {selectedRequestIds.length === pendingStudentRequests.length
                ? "Deselect All"
                : `Select All Pending Students (${pendingStudentRequests.length})`}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Target Course</th>
                  <th className="py-3 px-4">Request Type / Role</th>
                  <th className="py-3 px-4">Application Reason</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No course requests match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const targetCourse = courses.find((c) => c.id === req.course_id);
                    const isSelectable = req.status === "PENDING" && req.request_type === "student_join";

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          {isSelectable && (
                            <input
                              type="checkbox"
                              checked={selectedRequestIds.includes(req.id)}
                              onChange={() => handleToggleSelect(req.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{req.applicant_id}</div>
                          <span className="text-[11px] text-slate-400 capitalize">
                            Role: {req.applicant_role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {targetCourse?.course_code || req.course_id}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
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
                        <td className="py-3 px-4 max-w-xs">
                          <p className="line-clamp-2 text-slate-700">{req.reason}</p>
                          {req.rejection_reason && (
                            <p className="text-[11px] text-rose-600 mt-0.5">
                              Rejection note: {req.rejection_reason}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {req.created_at.split("T")[0]}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(req.status)}</td>
                        <td className="py-3 px-4 text-right">
                          {req.status === "PENDING" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(req.id)}
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-7 text-xs"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRejectingRequestId(req.id)}
                                className="text-rose-600 border-rose-200 hover:bg-rose-50 h-7 text-xs"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Reviewed {req.reviewed_at ? req.reviewed_at.split("T")[0] : ""}
                            </span>
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

      {/* Rejection Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Decline Course Application</h3>
            </div>
            <p className="text-xs text-slate-600">
              Provide a valid academic justification for declining this application. The applicant will be informed.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Inadequate prerequisite credits or laboratory workbench saturation..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRejectingRequestId(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRejectConfirm}
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

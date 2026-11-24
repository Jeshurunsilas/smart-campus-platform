"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  adminReviewCourse,
  adminToggleCoursePublication,
} from "@/lib/services/academic-services";
import { AcademicCourse, CourseApprovalStatus, UserProfile } from "@/types";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  BookOpen,
  Filter,
  Search,
  Eye,
  EyeOff,
  Send,
  FileText,
  Building2,
  User,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export default function AdminCourseApprovalsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.admin);
  const [courses, setCourses] = useState<AcademicCourse[]>(DEMO_COURSES);

  // Active status tab
  const [activeTab, setActiveTab] = useState<"ALL" | CourseApprovalStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  // Detail Modal
  const [inspectCourse, setInspectCourse] = useState<AcademicCourse | null>(null);

  // Action Modals
  const [rejectingCourseId, setRejectingCourseId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [modifyingCourseId, setModifyingCourseId] = useState<string | null>(null);
  const [modificationNotes, setModificationNotes] = useState("");

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    if (activeTab !== "ALL" && c.approval_status !== activeTab) return false;
    if (deptFilter !== "all" && c.department_id !== deptFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.course_code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.faculty_owner_id && c.faculty_owner_id.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = courses.filter((c) => c.approval_status === "PENDING_APPROVAL").length;
  const approvedCount = courses.filter((c) => c.approval_status === "APPROVED").length;
  const rejectedCount = courses.filter((c) => c.approval_status === "REJECTED").length;
  const modReqCount = courses.filter((c) => c.approval_status === "MODIFICATIONS_REQUESTED").length;

  const handleApprove = async (courseId: string) => {
    const res = await adminReviewCourse(courseId, "approve", user.id);
    if (res.success && res.course) {
      setCourses((prev) => prev.map((c) => (c.id === courseId ? res.course! : c)));
      if (inspectCourse?.id === courseId) setInspectCourse(res.course);
      setNotification({
        type: "success",
        message: `Course ${res.course.course_code} approved and published to student catalogue!`,
      });
    } else {
      setNotification({ type: "error", message: res.error || "Approval failed." });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingCourseId) return;
    const res = await adminReviewCourse(
      rejectingCourseId,
      "reject",
      user.id,
      rejectionReason || "Course does not satisfy institutional curriculum standards."
    );

    if (res.success && res.course) {
      setCourses((prev) => prev.map((c) => (c.id === rejectingCourseId ? res.course! : c)));
      if (inspectCourse?.id === rejectingCourseId) setInspectCourse(res.course);
      setNotification({
        type: "success",
        message: `Course ${res.course.course_code} rejected. Faculty notified.`,
      });
      setRejectingCourseId(null);
      setRejectionReason("");
    } else {
      setNotification({ type: "error", message: res.error || "Rejection failed." });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleModificationConfirm = async () => {
    if (!modifyingCourseId) return;
    const res = await adminReviewCourse(
      modifyingCourseId,
      "request_modifications",
      user.id,
      undefined,
      modificationNotes || "Please update syllabus objectives and prerequisites."
    );

    if (res.success && res.course) {
      setCourses((prev) => prev.map((c) => (c.id === modifyingCourseId ? res.course! : c)));
      if (inspectCourse?.id === modifyingCourseId) setInspectCourse(res.course);
      setNotification({
        type: "success",
        message: `Modifications requested for ${res.course.course_code}. Returned to faculty.`,
      });
      setModifyingCourseId(null);
      setModificationNotes("");
    } else {
      setNotification({ type: "error", message: res.error || "Request failed." });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTogglePublication = async (courseId: string, publish: boolean) => {
    const res = await adminToggleCoursePublication(courseId, publish);
    if (res.success && res.course) {
      setCourses((prev) => prev.map((c) => (c.id === courseId ? res.course! : c)));
      if (inspectCourse?.id === courseId) setInspectCourse(res.course);
      setNotification({
        type: "success",
        message: `Course ${res.course.course_code} ${publish ? "published" : "unpublished"} successfully.`,
      });
    } else {
      setNotification({ type: "error", message: res.error || "Publication toggle failed." });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const getApprovalBadge = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "PENDING_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case "MODIFICATIONS_REQUESTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertCircle className="w-3.5 h-3.5" /> Modifications Requested
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  return (
    <DashboardShell
      title="Course Approval Management"
      subtitle="Institutional curriculum governance: review faculty submissions, verify academic standards, and manage catalogue publication."
      role="administrator"
      user={user}
    >
      <div className="space-y-6">
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
                <AlertCircle className="w-4 h-4 text-rose-600" />
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
            title="Pending Approval"
            value={pendingCount}
            icon={Clock}
          />
          <StatsCard
            title="Approved Courses"
            value={approvedCount}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Modifications Pending"
            value={modReqCount}
            icon={AlertCircle}
          />
          <StatsCard
            title="Curriculum Rejected"
            value={rejectedCount}
            icon={XCircle}
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "ALL"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab("PENDING_APPROVAL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "PENDING_APPROVAL"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("APPROVED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "APPROVED"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab("MODIFICATIONS_REQUESTED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "MODIFICATIONS_REQUESTED"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              Modifications ({modReqCount})
            </button>
            <button
              onClick={() => setActiveTab("REJECTED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "REJECTED"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search & Dept */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, code, instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white outline-none"
            >
              <option value="all">All Depts</option>
              <option value="dept-cse">CSE</option>
              <option value="dept-ece">ECE</option>
            </select>
          </div>
        </div>

        {/* Course Approvals Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Course Code & Title</th>
                  <th className="py-3 px-4">Faculty Creator</th>
                  <th className="py-3 px-4">Department & Term</th>
                  <th className="py-3 px-4">Credits & Capacity</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4">Catalogue State</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No courses found matching this approval filter.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {c.course_code}
                        </div>
                        <div className="font-semibold text-slate-900 line-clamp-1">{c.title}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{c.faculty_owner_id}</div>
                        <span className="text-[11px] text-slate-400">Faculty Author</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{c.department_id}</span>
                        <div className="text-[11px] text-slate-500">{c.semester}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span>{c.credits} Credits ({c.course_category})</span>
                        <div className="text-[11px] text-slate-500">Cap: {c.max_enrolment_capacity} seats</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {c.submitted_at ? c.submitted_at.split("T")[0] : "Draft"}
                      </td>
                      <td className="py-3 px-4">{getApprovalBadge(c.approval_status)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            c.is_published
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {c.is_published ? "Live in Catalogue" : "Unpublished"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInspectCourse(c)}
                            className="h-7 text-xs px-2 gap-1 text-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect
                          </Button>

                          {c.approval_status === "PENDING_APPROVAL" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(c.id)}
                                className="h-7 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setModifyingCourseId(c.id)}
                                className="h-7 text-xs px-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                              >
                                Modify
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRejectingCourseId(c.id)}
                                className="h-7 text-xs px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {c.approval_status === "APPROVED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePublication(c.id, !c.is_published)}
                              className={`h-7 text-xs px-2 ${
                                c.is_published
                                  ? "text-slate-600 border-slate-200 hover:bg-slate-100"
                                  : "text-blue-600 border-blue-200 hover:bg-blue-50"
                              }`}
                            >
                              {c.is_published ? "Unpublish" : "Publish"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inspect Course Modal */}
      {inspectCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600">
                  {inspectCourse.course_code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">{inspectCourse.title}</h3>
              </div>
              <button
                onClick={() => setInspectCourse(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Abstract & Pedagogical Focus
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{inspectCourse.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400">Department:</span>
                  <div className="font-semibold text-slate-800">{inspectCourse.department_id}</div>
                </div>
                <div>
                  <span className="text-slate-400">Programme:</span>
                  <div className="font-semibold text-slate-800">{inspectCourse.programme_id}</div>
                </div>
                <div>
                  <span className="text-slate-400">Credits:</span>
                  <div className="font-semibold text-slate-800">
                    {inspectCourse.credits} ({inspectCourse.course_category})
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Capacity:</span>
                  <div className="font-semibold text-slate-800">{inspectCourse.max_enrolment_capacity} seats</div>
                </div>
                <div>
                  <span className="text-slate-400">Schedule:</span>
                  <div className="font-semibold text-slate-800">{inspectCourse.class_schedule || "TBD"}</div>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>
                  <div className="font-semibold text-slate-800">
                    {inspectCourse.classroom_location || "TBD"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Enrolment Deadline:</span>
                  <div className="font-semibold text-slate-800">{inspectCourse.enrolment_deadline}</div>
                </div>
                <div>
                  <span className="text-slate-400">Faculty Author:</span>
                  <div className="font-semibold text-slate-800">{inspectCourse.faculty_owner_id}</div>
                </div>
              </div>

              {inspectCourse.learning_objectives && inspectCourse.learning_objectives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Learning Objectives
                  </h4>
                  <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                    {inspectCourse.learning_objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {inspectCourse.prerequisites && inspectCourse.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Prerequisites
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectCourse.prerequisites.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {inspectCourse.rejection_reason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <p className="font-semibold">Recorded Rejection Reason:</p>
                  <p className="mt-0.5">{inspectCourse.rejection_reason}</p>
                </div>
              )}

              {inspectCourse.modification_notes && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800">
                  <p className="font-semibold">Modification Request Notes:</p>
                  <p className="mt-0.5">{inspectCourse.modification_notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Current Approval: {getApprovalBadge(inspectCourse.approval_status)}
              </div>
              <div className="flex items-center gap-2">
                {inspectCourse.approval_status === "PENDING_APPROVAL" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleApprove(inspectCourse.id);
                        setInspectCourse(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      Approve & Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setModifyingCourseId(inspectCourse.id);
                        setInspectCourse(null);
                      }}
                      className="text-orange-600 border-orange-200 text-xs"
                    >
                      Request Modifications
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRejectingCourseId(inspectCourse.id);
                        setInspectCourse(null);
                      }}
                      className="text-rose-600 border-rose-200 text-xs"
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={() => setInspectCourse(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingCourseId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <XCircle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Decline Course Submission</h3>
            </div>
            <p className="text-xs text-slate-600">
              Provide specific institutional feedback explaining why this course cannot be approved for the academic catalogue.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Overlaps 70% with existing CS302 syllabus or lacks sufficient prerequisite rigor..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRejectingCourseId(null);
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

      {/* Modifications Request Modal */}
      {modifyingCourseId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Request Curriculum Modifications</h3>
            </div>
            <p className="text-xs text-slate-600">
              Detail the adjustments the faculty creator must address prior to catalogue approval. The course status will become MODIFICATIONS_REQUESTED.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Please clarify week 6-8 lab requirements and adjust course credits to 4..."
              value={modificationNotes}
              onChange={(e) => setModificationNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setModifyingCourseId(null);
                  setModificationNotes("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleModificationConfirm}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Send Feedback to Faculty
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

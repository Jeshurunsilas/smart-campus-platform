"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  DEMO_SECTIONS,
  DEMO_ENROLMENTS,
  DEMO_COURSE_REQUESTS,
  updateEnrolmentStatus,
} from "@/lib/services/academic-services";
import { AcademicCourse, CourseSection, CourseEnrolment, UserProfile } from "@/types";
import {
  BookOpen,
  PlusCircle,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  GraduationCap,
  Calendar,
  Search,
  Check,
  X,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Send,
  UserPlus,
} from "lucide-react";

export default function FacultyCoursesPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);
  const [sections] = useState<CourseSection[]>(DEMO_SECTIONS);
  const [enrolments, setEnrolments] = useState<CourseEnrolment[]>(DEMO_ENROLMENTS);
  const [activeTab, setActiveTab] = useState<"courses" | "enrolments">("courses");
  const [selectedSection, setSelectedSection] = useState<string>("sec-cs301-a");
  const [rejectModalEnrolmentId, setRejectModalEnrolmentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filter courses owned or taught by this faculty member
  const myCourses = courses.filter((c) => c.faculty_owner_id === user.id);
  const activeSection = sections.find((s) => s.id === selectedSection) || sections[0];
  const sectionEnrolments = enrolments.filter((e) => e.section_id === selectedSection);
  const pendingRequestsCount = DEMO_COURSE_REQUESTS.filter(
    (r) => r.status === "PENDING" && myCourses.some((c) => c.id === r.course_id)
  ).length;

  const handleApprove = async (enrolmentId: string) => {
    const res = await updateEnrolmentStatus(enrolmentId, "approved");
    if (res.success && res.enrolment) {
      setEnrolments((prev) =>
        prev.map((e) => (e.id === enrolmentId ? (res.enrolment as CourseEnrolment) : e))
      );
      setActionSuccess("Student enrolment approved successfully.");
      setTimeout(() => setActionSuccess(null), 3500);
    }
  };

  const handleReject = async () => {
    if (!rejectModalEnrolmentId) return;
    const res = await updateEnrolmentStatus(
      rejectModalEnrolmentId,
      "rejected",
      rejectionReason || "Prerequisites or departmental criteria not met"
    );
    if (res.success && res.enrolment) {
      setEnrolments((prev) =>
        prev.map((e) => (e.id === rejectModalEnrolmentId ? (res.enrolment as CourseEnrolment) : e))
      );
      setRejectModalEnrolmentId(null);
      setRejectionReason("");
      setActionSuccess("Student enrolment rejected with justification notice.");
      setTimeout(() => setActionSuccess(null), 3500);
    }
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
            <Clock className="w-3.5 h-3.5" /> Pending Approval
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
      title="Faculty Course Management & Instruction Space"
      subtitle="Create curriculum courses, manage student enrolment rosters, and collaborate with peer faculty."
      role="faculty"
      user={user}
    >
      {actionSuccess && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium">{actionSuccess}</p>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Action Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Academic Operations
          </span>
          <h2 className="text-xl font-bold mt-1">Faculty Curriculum & Instruction Hub</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Design new courses, inspect submitted syllabus proposals, review student join requests, and collaborate across departments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/faculty/courses/create">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-semibold gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Course
            </Button>
          </Link>
          <Link href="/faculty/course-requests">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2 relative"
            >
              <Users className="w-4 h-4" />
              Course Requests
              {pendingRequestsCount > 0 && (
                <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                  {pendingRequestsCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/faculty/collaboration">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Faculty Collaboration
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Authored Courses"
          value={myCourses.length}
          icon={BookOpen}
        />
        <StatsCard
          title="Active Sections"
          value={sections.length}
          icon={Layers}
        />
        <StatsCard
          title="Total Enrolled Students"
          value={enrolments.filter((e) => e.status === "approved").length}
          icon={GraduationCap}
        />
        <StatsCard
          title="Pending Join Requests"
          value={pendingRequestsCount}
          icon={Clock}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "courses"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          My Courses ({myCourses.length})
        </button>
        <button
          onClick={() => setActiveTab("enrolments")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "enrolments"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Section Rosters & Approvals ({sectionEnrolments.length})
        </button>
      </div>

      {activeTab === "courses" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Assigned & Authored Courses
            </h3>
            <Link
              href="/faculty/courses/create"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Another Course
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="relative h-36 bg-slate-100 overflow-hidden">
                    {course.course_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.course_image_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
                      {course.course_code}
                    </div>
                    <div className="absolute top-3 right-3">{getApprovalBadge(course.approval_status)}</div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {course.course_category} • {course.credits} Credits • {course.semester}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                    {/* Modification notes alert if returned by Admin */}
                    {course.approval_status === "MODIFICATIONS_REQUESTED" && course.modification_notes && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                        <p className="font-semibold flex items-center gap-1 text-amber-800">
                          <AlertCircle className="w-3.5 h-3.5" /> Admin Feedback:
                        </p>
                        <p className="mt-0.5">{course.modification_notes}</p>
                      </div>
                    )}

                    {/* Rejection reason alert */}
                    {course.approval_status === "REJECTED" && course.rejection_reason && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                        <p className="font-semibold flex items-center gap-1 text-rose-800">
                          <XCircle className="w-3.5 h-3.5" /> Rejection Justification:
                        </p>
                        <p className="mt-0.5">{course.rejection_reason}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-600">
                      <div>
                        <span className="text-slate-400">Schedule:</span>{" "}
                        <span className="font-medium text-slate-800">{course.class_schedule || "TBD"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Capacity:</span>{" "}
                        <span className="font-medium text-slate-800">{course.max_enrolment_capacity} Seats</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Enrolment:</span>{" "}
                        <span className="font-medium text-slate-800">
                          {course.allow_enrolment ? "Open" : "Closed"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Collab:</span>{" "}
                        <span className="font-medium text-slate-800">
                          {course.allow_faculty_collaboration ? "Permitted" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link href={`/faculty/course-requests?courseId=${course.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Join Requests
                    </Button>
                  </Link>
                  <Link href={`/faculty/courses/${course.id}`} className="flex-1">
                    <Button size="sm" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                      Workspace <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Section Enrolments View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Select Teaching Section:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSection === sec.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {sec.section_code} ({sec.enrolled_count}/{sec.max_seats})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activeSection.section_code} Student Enrolment Registry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Room: {typeof activeSection.room === "string" ? activeSection.room : (activeSection.room?.room_name || activeSection.room?.room_number || "TBD")} • Schedule: {activeSection.schedule || "TBD"} • Max Capacity: {activeSection.max_seats}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                {sectionEnrolments.length} Registrations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4">Enrolment Status</th>
                    <th className="py-3 px-4">Waitlist Pos</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {sectionEnrolments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No enrolment registrations submitted for this section yet.
                      </td>
                    </tr>
                  ) : (
                    sectionEnrolments.map((enr) => (
                      <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          {enr.student_id}
                        </td>
                        <td className="py-3 px-4">{enr.enrolled_at.split("T")[0]}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              enr.status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : enr.status === "pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : enr.status === "waitlisted"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {enr.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {enr.waitlist_position ? `#${enr.waitlist_position}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {enr.status === "pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(enr.id)}
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-7 text-xs"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRejectModalEnrolmentId(enr.id)}
                                className="text-rose-600 border-rose-200 hover:bg-rose-50 h-7 text-xs"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalEnrolmentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-slate-900">Provide Rejection Justification</h3>
            </div>
            <p className="text-xs text-slate-600">
              Please specify the academic or prerequisite criterion that led to this rejection. The student will be officially notified.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Incomplete prerequisite courses or lab section capacity saturated..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRejectModalEnrolmentId(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

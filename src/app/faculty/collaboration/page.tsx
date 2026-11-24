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
  submitFacultyCollaborationRequest,
} from "@/lib/services/academic-services";
import {
  AcademicCourse,
  CourseEnrolmentRequest,
  CourseRequestedRole,
  UserProfile,
} from "@/types";
import {
  UserPlus,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Search,
  Filter,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";

export default function FacultyCollaborationPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);
  const [requests, setRequests] = useState<CourseEnrolmentRequest[]>(DEMO_COURSE_REQUESTS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AcademicCourse | null>(null);
  const [requestedRole, setRequestedRole] = useState<CourseRequestedRole>("co_instructor");
  const [collaborationReason, setCollaborationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  // Courses available for collaboration (owned by other faculty members, allowing collab)
  const collaborativeCourses = courses.filter((c) => {
    if (c.faculty_owner_id === user.id) return false;
    if (!c.allow_faculty_collaboration) return false;
    if (deptFilter !== "all" && c.department_id !== deptFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.course_code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Collaboration requests initiated by this faculty member
  const mySentCollabRequests = requests.filter(
    (r) => r.applicant_id === user.id && r.request_type === "faculty_collaboration"
  );

  const handleOpenCollabModal = (course: AcademicCourse) => {
    setSelectedCourse(course);
    setRequestedRole("co_instructor");
    setCollaborationReason("");
    setIsModalOpen(true);
  };

  const handleSubmitCollab = async () => {
    if (!selectedCourse) return;
    if (!collaborationReason.trim()) {
      setFeedback({ type: "error", message: "Please specify your pedagogical rationale for collaboration." });
      return;
    }

    setIsSubmitting(true);
    const res = await submitFacultyCollaborationRequest(
      user.id,
      selectedCourse.id,
      requestedRole,
      collaborationReason.trim()
    );
    setIsSubmitting(false);

    if (res.success && res.request) {
      setRequests((prev) => [res.request!, ...prev]);
      setIsModalOpen(false);
      setFeedback({
        type: "success",
        message: `Collaboration proposal for ${selectedCourse.course_code} submitted to the course owner!`,
      });
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to submit collaboration request.",
      });
    }
    setTimeout(() => setFeedback(null), 4000);
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
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardShell
      title="Inter-Departmental Faculty Collaboration"
      subtitle="Co-instruct, supervise laboratories, and exchange pedagogical resources with peer professors."
      role="faculty"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/faculty/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Management
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Institutional Collaboration Policy: Collaborators receive instruction access without modifying course ownership.
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Available Collab Courses"
            value={collaborativeCourses.length}
            icon={BookOpen}
          />
          <StatsCard
            title="My Submitted Proposals"
            value={mySentCollabRequests.length}
            icon={UserPlus}
          />
          <StatsCard
            title="Active Co-Instruction Roles"
            value={mySentCollabRequests.filter((r) => r.status === "APPROVED").length}
            icon={CheckCircle2}
          />
        </div>

        {/* Submitted Proposals Section */}
        {mySentCollabRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">My Collaboration Request History</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySentCollabRequests.map((req) => {
                const course = courses.find((c) => c.id === req.course_id);
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-indigo-600">
                          {course?.course_code || req.course_id}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                          {course?.title || "Academic Course"}
                        </h4>
                        <span className="text-xs text-slate-500">
                          Role: <strong className="text-slate-800 capitalize">{req.requested_role}</strong>
                        </span>
                      </div>
                      <div>{getStatusBadge(req.status)}</div>
                    </div>
                    <p className="text-xs text-slate-600 italic">&ldquo;{req.reason}&rdquo;</p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                      <span>Submitted: {req.created_at.split("T")[0]}</span>
                      {req.reviewed_at && <span>Reviewed: {req.reviewed_at.split("T")[0]}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search course title, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5" /> Dept:
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
            >
              <option value="all">All Departments</option>
              <option value="dept-cse">Computer Science</option>
              <option value="dept-ece">Electronics & Comm</option>
              <option value="dept-mech">Mechanical</option>
            </select>
          </div>
        </div>

        {/* Courses Available for Collaboration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborativeCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              No courses matching collaboration criteria found.
            </div>
          ) : (
            collaborativeCourses.map((course) => {
              const existingReq = mySentCollabRequests.find((r) => r.course_id === course.id);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-indigo-200 transition-all"
                >
                  <div>
                    <div className="relative h-32 bg-slate-100 overflow-hidden">
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
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-semibold px-2 py-0.5 rounded">
                        {course.course_category} • {course.credits} Credits
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Owner: Dr. Rajesh Kumar • {course.semester}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                      <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 text-slate-600">
                        <div>
                          <span className="text-slate-400">Schedule:</span>{" "}
                          <span className="font-medium text-slate-800">{course.class_schedule || "TBD"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Location:</span>{" "}
                          <span className="font-medium text-slate-800">
                            {course.classroom_location || "TBD"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    {existingReq ? (
                      <div className="w-full text-center text-xs text-slate-600 font-semibold">
                        Request Status: {getStatusBadge(existingReq.status)}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenCollabModal(course)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Request Faculty Collaboration
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Collaboration Application Modal */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Apply for Faculty Collaboration: {selectedCourse.course_code}
                </h3>
                <p className="text-xs text-slate-500">{selectedCourse.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Target Collaboration Role
                </label>
                <select
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value as CourseRequestedRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="co_instructor">Co-Instructor (Co-teach lectures, formulate examinations)</option>
                  <option value="teaching_assistant">Teaching Assistant (Coordinate labs, evaluate assignments)</option>
                  <option value="contributor">Course Contributor (Provide datasets, guest modules, exercises)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Pedagogical Rationale & Contribution Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your domain expertise, syllabus modules you plan to deliver, or research resources you will provide..."
                  value={collaborationReason}
                  onChange={(e) => setCollaborationReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <p className="font-semibold flex items-center gap-1 text-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Permission Policy Notice:
                </p>
                <p className="mt-0.5">
                  Approval by the course owner grants instructional access to materials and gradebook. It does not transfer course ownership or deletion rights.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitCollab}
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Send Proposal to Course Owner"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

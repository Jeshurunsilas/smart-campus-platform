"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  DEMO_SECTIONS,
  DEMO_COURSE_REQUESTS,
  DEMO_COURSE_MEMBERSHIPS,
  submitStudentCourseJoinRequest,
} from "@/lib/services/academic-services";
import { AcademicCourse, CourseCategory, CourseEnrolmentRequest, UserProfile } from "@/types";
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Users,
  Award,
  AlertCircle,
  PlusCircle,
  Calendar,
  Filter,
  Check,
  Send,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function StudentCourseCataloguePage() {
  const [user] = useState<UserProfile>(DEMO_USERS.student); // Aarav Sharma
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);
  const [requests, setRequests] = useState<CourseEnrolmentRequest[]>(DEMO_COURSE_REQUESTS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Join Request Modal
  const [selectedCourse, setSelectedCourse] = useState<AcademicCourse | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Only approved and published courses allowing enrolment are shown in student catalogue
  const eligibleCourses = courses.filter((c) => {
    if (c.approval_status !== "APPROVED" || !c.is_published || !c.allow_enrolment) {
      return false;
    }
    if (deptFilter !== "all" && c.department_id !== deptFilter) return false;
    if (semesterFilter !== "all" && c.semester !== semesterFilter) return false;
    if (categoryFilter !== "all" && c.course_category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.course_code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const myRequests = requests.filter((r) => r.applicant_id === user.id);
  const myEnrolledCourseIds = new Set(
    DEMO_COURSE_MEMBERSHIPS.filter(
      (m) => m.user_id === user.id && (m.status === "ACTIVE" || m.status === "active")
    ).map((m) => m.course_id)
  );

  const handleOpenJoinModal = (course: AcademicCourse) => {
    setSelectedCourse(course);
    setRequestReason("");
    setFeedback(null);
  };

  const handleConfirmJoinRequest = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    setFeedback(null);

    const section = DEMO_SECTIONS.find((s) => s.course_id === selectedCourse.id);
    const res = await submitStudentCourseJoinRequest(
      user.id,
      selectedCourse.id,
      section?.id,
      requestReason.trim() || `Course registration for ${selectedCourse.course_code}`
    );

    setIsSubmitting(false);

    if (res.success && res.request) {
      setRequests((prev) => [res.request!, ...prev]);
      setFeedback({
        type: "success",
        text:
          res.request.status === "WAITLISTED"
            ? `Course capacity reached. Your request for ${selectedCourse.course_code} has been placed on the priority WAITLIST.`
            : `Your join request for ${selectedCourse.course_code} has been submitted! Current status: PENDING approval by course instructor.`,
      });
      setSelectedCourse(null);
    } else {
      setFeedback({
        type: "error",
        text: res.error || "Unable to submit join request.",
      });
    }
  };

  return (
    <DashboardShell
      title="Academic Course Catalogue"
      subtitle="Discover published degree curriculum, inspect prerequisites, and submit semester join requests."
      role="student"
      user={user}
    >
      <div className="space-y-6">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Student Academic Portal
            </span>
            <h2 className="text-xl font-bold mt-1">Explore & Enrol in University Courses</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Select elective and core courses for your study plan. Requests undergo automated prerequisite checking and instructor capacity review.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/course-requests">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2 relative"
              >
                <Clock className="w-4 h-4" />
                My Course Requests
                {myRequests.filter((r) => r.status === "PENDING").length > 0 && (
                  <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                    {myRequests.filter((r) => r.status === "PENDING").length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/student/my-courses">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold shadow-md">
                <BookOpen className="w-4 h-4" />
                My Enrolled Courses
              </Button>
            </Link>
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
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search course title, course code, or curriculum description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
            >
              <option value="all">All Departments</option>
              <option value="dept-cse">Computer Science</option>
              <option value="dept-ece">Electronics & Comm</option>
            </select>

            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
            >
              <option value="all">All Semesters</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 8">Semester 8</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
              <option value="Lab">Lab</option>
              <option value="Open Elective">Open Elective</option>
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eligibleCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              No approved courses match your filter criteria.
            </div>
          ) : (
            eligibleCourses.map((course) => {
              const isEnrolled = myEnrolledCourseIds.has(course.id);
              const userRequest = myRequests.find((r) => r.course_id === course.id);

              // Calculate seat occupancy
              const enrolledCount = DEMO_COURSE_MEMBERSHIPS.filter(
                (m) =>
                  m.course_id === course.id &&
                  (m.role === "student" || m.membership_role === "student") &&
                  (m.status === "ACTIVE" || m.status === "active")
              ).length;
              const maxCap = course.max_enrolment_capacity || 50;
              const seatsAvailable = Math.max(0, maxCap - enrolledCount);
              const isFull = seatsAvailable === 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition-all hover:shadow-md"
                >
                  <div>
                    {/* Course Banner */}
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      {course.course_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.course_image_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-mono font-bold px-2.5 py-1 rounded shadow-sm">
                        {course.course_code}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold px-2 py-0.5 rounded shadow-sm">
                        {course.course_category} • {course.credits} Credits
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Lead Faculty: Dr. Elena Rostova • {course.semester} ({course.academic_year})
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Prerequisites */}
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-slate-400 font-medium">Prereqs:</span>
                          {course.prerequisites.map((p, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Logistical Details */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
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
                        <div>
                          <span className="text-slate-400">Availability:</span>{" "}
                          <span
                            className={`font-semibold ${
                              isFull ? "text-rose-600" : "text-emerald-700"
                            }`}
                          >
                            {isFull ? "Full (Waitlist Only)" : `${seatsAvailable} seats open`}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Deadline:</span>{" "}
                          <span className="font-medium text-slate-800">
                            {course.enrolment_deadline || "TBD"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    {isEnrolled ? (
                      <div className="w-full flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                        </span>
                        <Link href={`/student/courses/${course.id}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                            Open Workspace <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ) : userRequest ? (
                      <div className="w-full flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            userRequest.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : userRequest.status === "WAITLISTED"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          Request: {userRequest.status}
                        </span>
                        <Link href="/student/course-requests">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Status
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenJoinModal(course)}
                        className={`w-full text-xs font-semibold gap-1.5 ${
                          isFull
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        {isFull ? "Request Waitlist Seat" : "Request to Join"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Join Request Confirmation Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Confirm Course Join Request: {selectedCourse.course_code}
                </h3>
                <p className="text-xs text-slate-500">{selectedCourse.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-800">{selectedCourse.department_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Credits:</span>
                  <span className="font-semibold text-slate-800">{selectedCourse.credits} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-semibold text-slate-800">{selectedCourse.class_schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="font-semibold text-slate-800">{selectedCourse.enrolment_deadline}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">
                  Statement of Academic Interest / Purpose (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why you wish to enrol in this course, your specialization focus, or capstone preparation..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900">
                <p className="font-semibold flex items-center gap-1 text-indigo-800">
                  <Sparkles className="w-3.5 h-3.5" /> Automated Verification:
                </p>
                <p className="mt-0.5">
                  Submitting will check prerequisite compliance and timetable concurrency against your existing semester timetable.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCourse(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmJoinRequest}
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isSubmitting ? "Verifying & Submitting..." : "Submit Join Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

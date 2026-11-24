"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  getCourseWorkspaceDetails,
  DEMO_ASSIGNMENTS,
  DEMO_EXAMINATIONS,
  DEMO_GRADES,
} from "@/lib/services/academic-services";
import { CourseLearningMaterial, UserProfile } from "@/types";
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  FileCode,
  Presentation,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ExternalLink,
  Users,
  Building2,
  HelpCircle,
  Megaphone,
} from "lucide-react";

export default function StudentCourseWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const [user] = useState<UserProfile>(DEMO_USERS.student); // Aarav Sharma

  const { course, materials, memberships, isMember } = getCourseWorkspaceDetails(
    courseId,
    user.id,
    "student"
  );

  const [activeTab, setActiveTab] = useState<"overview" | "materials" | "assignments" | "exams">("overview");

  if (!course) {
    return (
      <DashboardShell title="Course Not Found" role="student" user={user}>
        <div className="py-16 text-center space-y-4">
          <p className="text-slate-600">The requested course could not be located in academic records.</p>
          <Link href="/student/courses">
            <Button>Back to Course Catalogue</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const courseAssignments = DEMO_ASSIGNMENTS.filter((a) => a.course_id === course.id);
  const courseExams = DEMO_EXAMINATIONS.filter((e) => e.course_id === course.id);
  const myGradeRecord = DEMO_GRADES.find((g) => g.course_id === course.id && g.student_id === user.id);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "slides":
        return <Presentation className="w-5 h-5 text-indigo-600" />;
      case "code":
        return <FileCode className="w-5 h-5 text-emerald-600" />;
      case "syllabus":
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case "notes":
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <DashboardShell
      title={`${course.course_code}: ${course.title}`}
      subtitle={`Student Learning Space • ${course.semester} (${course.academic_year})`}
      role="student"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/student/my-courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Courses
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Student Member
            </span>
            {course.syllabus_url && (
              <a href={course.syllabus_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" /> Official Syllabus
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {course.course_code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {course.course_category} • {course.credits} Credits
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {course.semester}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{course.title}</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{course.description}</p>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span>Lead Instructor: <strong>Dr. Elena Rostova</strong></span>
              <span>•</span>
              <span>Department: <strong>Computer Science & Engineering</strong></span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
              Timetable & Room Logistics
            </h4>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Schedule:</span>
              <span className="font-semibold text-slate-800">{course.class_schedule || "TBD"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Classroom:</span>
              <span className="font-semibold text-slate-800">
                {course.classroom_location || "TBD"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Academic Standing:</span>
              <span className="font-semibold text-emerald-700">92% (Pass Band)</span>
            </div>
            {myGradeRecord && (
              <div className="flex justify-between py-1 border-t border-slate-200 pt-1">
                <span className="text-slate-500">Internal Score:</span>
                <span className="font-bold text-indigo-700">
                  {myGradeRecord.total_score || myGradeRecord.marks_obtained}% ({myGradeRecord.letter_grade || "A"})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Objectives & Syllabus
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "materials"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Learning Materials ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "assignments"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Assignments ({courseAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === "exams"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Examinations ({courseExams.length})
          </button>
        </div>

        {/* Tab 1: Objectives & Syllabus */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Key Learning Objectives</h3>
              </div>
              <div className="space-y-2">
                {course.learning_objectives?.map((obj, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Announcement */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
              <Megaphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Instructor Announcement • Spring 2026
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Lab Session 03 will take place in the Turing Supercomputing Wing. Please review the POSIX thread synchronisation slides prior to Wednesday&apos;s workbench.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Learning Materials */}
        {activeTab === "materials" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Approved Course Slides, Notes & Code Repositories
                </h3>
              </div>
              <span className="text-xs text-slate-500">{materials.length} deliverables available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3 hover:border-indigo-200 transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shrink-0">
                    {getMaterialIcon(mat.material_type || "notes")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{mat.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 shrink-0">
                        {mat.material_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mat.description}</p>
                    <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                      <span>Published: {mat.created_at.split("T")[0]}</span>
                      <a
                        href={mat.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Download Deliverable
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Assignments */}
        {activeTab === "assignments" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Course Assignments</h3>
              <Link href="/student/assignments">
                <Button size="sm" variant="outline" className="text-xs">
                  All Assignments
                </Button>
              </Link>
            </div>
            {courseAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No assignments scheduled for this course yet.
              </p>
            ) : (
              <div className="space-y-3">
                {courseAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{asg.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{asg.instructions}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                        <span>Max Marks: {asg.max_marks}</span>
                        <span>•</span>
                        <span>Due: {asg.due_date ? asg.due_date.split("T")[0] : "TBD"}</span>
                      </div>
                    </div>
                    <Link href="/student/assignments">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Submit Solution
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Examinations */}
        {activeTab === "exams" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Examinations & Formal Assessments</h3>
              <Link href="/student/examinations">
                <Button size="sm" variant="outline" className="text-xs">
                  All Exams
                </Button>
              </Link>
            </div>
            {courseExams.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No examinations scheduled for this course currently.
              </p>
            ) : (
              <div className="space-y-3">
                {courseExams.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{ex.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                        <span>Type: {ex.exam_type}</span>
                        <span>•</span>
                        <span>Total Marks: {ex.total_marks}</span>
                        <span>•</span>
                        <span>Duration: {ex.duration_minutes} mins</span>
                      </div>
                    </div>
                    <Link href="/student/examinations">
                      <Button size="sm" variant="outline" className="text-xs">
                        Exam Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

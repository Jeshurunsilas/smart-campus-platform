"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  getCourseWorkspaceDetails,
  addCourseLearningMaterial,
} from "@/lib/services/academic-services";
import { CourseLearningMaterial, UserProfile } from "@/types";
import {
  BookOpen,
  ArrowLeft,
  Users,
  Layers,
  GraduationCap,
  Calendar,
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Plus,
  ShieldCheck,
  FileCode,
  Presentation,
  ExternalLink,
} from "lucide-react";

export default function FacultyCourseWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);

  const initialDetails = getCourseWorkspaceDetails(courseId, user.id, "faculty");
  const [course] = useState(initialDetails.course);
  const [materials, setMaterials] = useState<CourseLearningMaterial[]>(initialDetails.materials);
  const [memberships] = useState(initialDetails.memberships);

  // New Material Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"syllabus" | "slides" | "notes" | "assignment" | "code">("slides");
  const [newUrl, setNewUrl] = useState("https://campus.edu/materials/slides_module.pdf");
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  if (!course) {
    return (
      <DashboardShell title="Course Not Found" role="faculty" user={user}>
        <div className="py-16 text-center space-y-4">
          <p className="text-slate-600">The requested course could not be located in academic records.</p>
          <Link href="/faculty/courses">
            <Button>Back to Course Management</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const studentMembers = memberships.filter(
    (m) => m.role === "student" || m.membership_role === "student"
  );
  const facultyMembers = memberships.filter(
    (m) => m.role !== "student" && m.membership_role !== "student"
  );

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await addCourseLearningMaterial(
      course.id,
      {
        title: newTitle.trim(),
        description: newDescription.trim(),
        material_type: newType,
        file_url: newUrl,
        file_size_bytes: 2097152,
      },
      user.id
    );

    if (res.success && res.material) {
      setMaterials((prev) => [...prev, res.material!]);
      setIsUploadModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setUploadSuccess("Learning deliverable successfully published to student learning space.");
      setTimeout(() => setUploadSuccess(null), 3500);
    }
  };

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
      subtitle={`Faculty Workspace • ${course.semester} (${course.academic_year})`}
      role="faculty"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/faculty/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Courses
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/faculty/course-requests?courseId=${course.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Manage Requests
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Material
            </Button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {course.course_code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {course.course_category} • {course.credits} Credits
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {course.approval_status}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{course.title}</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{course.description}</p>
            </div>

            {/* Quick links to assignments, tests, gradebook */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <Link href="/faculty/assignments">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Assignments
                </Button>
              </Link>
              <Link href="/faculty/examinations">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Examinations
                </Button>
              </Link>
              <Link href="/faculty/attendance">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Attendance Tracker
                </Button>
              </Link>
              <Link href="/faculty/gradebook">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Gradebook
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
              Instructional Logistics
            </h4>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Schedule:</span>
              <span className="font-semibold text-slate-800">{course.class_schedule || "TBD"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">{course.classroom_location || "TBD"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Enrolled Students:</span>
              <span className="font-semibold text-slate-800">
                {studentMembers.length} / {course.max_enrolment_capacity}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Prerequisites:</span>
              <span className="font-semibold text-slate-800">
                {course.prerequisites?.join(", ") || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Learning Materials */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Course Learning Materials & Resources</h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Material
            </Button>
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
                    <span>Uploaded: {mat.created_at.split("T")[0]}</span>
                    <a
                      href={mat.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download Resource
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Faculty Collaborators & Student Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collaborators */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Instruction Team & Collaborators</h3>
              </div>
              <Link
                href={`/faculty/course-requests?courseId=${course.id}`}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Review Requests
              </Link>
            </div>

            <div className="space-y-3">
              {facultyMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900 font-mono">{m.user_id}</p>
                    <span className="text-[11px] text-slate-500">
                      Approved: {m.created_at.split("T")[0]}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 capitalize">
                    {(m.role || m.membership_role || "member").replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Student Roster ({studentMembers.length} Enrolled)
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Capacity: {course.max_enrolment_capacity}
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {studentMembers.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No students currently enrolled in this course.
                </p>
              ) : (
                studentMembers.map((sm) => (
                  <div
                    key={sm.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-mono font-medium text-slate-900">{sm.user_id}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      Active Enrolment
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Material Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Upload Course Learning Material</h3>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture 05: Distributed Consensus Protocols"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Material Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-none"
                >
                  <option value="slides">Lecture Slides</option>
                  <option value="syllabus">Syllabus & Course Outline</option>
                  <option value="code">Code Repository / Makefile</option>
                  <option value="notes">Lecture Notes & Handouts</option>
                  <option value="assignment">Assignment Starter Kit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the material and study expectations..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Resource Storage URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Publish Material
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

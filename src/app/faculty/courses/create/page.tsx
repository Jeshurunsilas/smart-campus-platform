"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  createFacultyCourse,
  DEMO_PROGRAMMES,
  DEMO_ACADEMIC_YEARS,
} from "@/lib/services/academic-services";
import { CourseCategory, UserProfile } from "@/types";
import {
  BookOpen,
  ArrowLeft,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Calendar,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);

  // Form State
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("dept-cse");
  const [programmeId, setProgrammeId] = useState("prg-btech-cse");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [semester, setSemester] = useState("Semester 6");
  const [credits, setCredits] = useState<number>(4);
  const [lectureHours, setLectureHours] = useState<number>(3);
  const [labHours, setLabHours] = useState<number>(2);
  const [tutorialHours, setTutorialHours] = useState<number>(0);
  const [courseCategory, setCourseCategory] = useState<CourseCategory>("Core");
  const [maxCapacity, setMaxCapacity] = useState<number>(50);
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-05-30");
  const [schedule, setSchedule] = useState("Mon, Wed 10:00 - 11:30 AM");
  const [location, setLocation] = useState("Turing Hall 304");
  const [prerequisitesInput, setPrerequisitesInput] = useState("CS201, CS204");
  const [objectives, setObjectives] = useState<string[]>([
    "Master foundational core principles and architecture",
    "Implement real-world laboratory exercises and benchmarks",
  ]);
  const [newObjective, setNewObjective] = useState("");
  const [syllabusUrl, setSyllabusUrl] = useState("https://campus.edu/syllabi/course_syllabus.pdf");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80");
  const [allowEnrolment, setAllowEnrolment] = useState(true);
  const [allowFacultyCollab, setAllowFacultyCollab] = useState(true);
  const [enrolmentDeadline, setEnrolmentDeadline] = useState("2026-04-30");

  // UI state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title.trim()) return "Course Title is required.";
    if (!courseCode.trim()) return "Course Code is required.";
    if (!description.trim()) return "Course Description is required.";
    if (!credits || credits < 1) return "Credits must be at least 1.";
    if (!maxCapacity || maxCapacity < 5) return "Maximum capacity must be at least 5.";
    if (!enrolmentDeadline) return "Enrolment deadline is required.";
    return null;
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const parsedPrerequisites = prerequisitesInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const result = await createFacultyCourse(
      {
        title: title.trim(),
        course_code: courseCode.trim().toUpperCase(),
        description: description.trim(),
        department_id: departmentId,
        programme_id: programmeId,
        academic_year: academicYear,
        semester,
        credits: Number(credits),
        lecture_hours: Number(lectureHours),
        lab_hours: Number(labHours),
        tutorial_hours: Number(tutorialHours),
        course_category: courseCategory,
        max_enrolment_capacity: Number(maxCapacity),
        course_start_date: startDate,
        course_end_date: endDate,
        class_schedule: schedule,
        classroom_location: location,
        prerequisites: parsedPrerequisites,
        learning_objectives: objectives,
        syllabus_url: syllabusUrl,
        course_image_url: imageUrl,
        allow_enrolment: allowEnrolment,
        allow_faculty_collaboration: allowFacultyCollab,
        enrolment_deadline: enrolmentDeadline,
        faculty_owner_id: user.id,
      },
      saveAsDraft
    );

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Failed to create course. Please review the details.");
      return;
    }

    setSuccessMessage(
      saveAsDraft
        ? "Course saved as Draft successfully. You can edit and submit it later."
        : "Course submitted for Administrative Approval! Current status: PENDING_APPROVAL."
    );

    setTimeout(() => {
      router.push("/faculty/courses");
    }, 2000);
  };

  return (
    <DashboardShell
      title="Create New Academic Course"
      subtitle="Design, configure curriculum details, and submit for institutional administrative review."
      role="faculty"
      user={user}
    >
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Navigation & Status Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/faculty/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Management
          </Link>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Course
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </Button>
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Validation Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Success!</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Card 1: Basic Course Identity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Course Identification & Core Metadata</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Computing & Microservices"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS305"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <span className="text-[11px] text-slate-500">Unique identifier within academic period</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Comprehensive academic abstract, pedagogical focus, and industry relevance..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="dept-cse">Computer Science & Engineering</option>
                  <option value="dept-ece">Electronics & Communication</option>
                  <option value="dept-mech">Mechanical Engineering</option>
                  <option value="dept-math">Applied Mathematics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Programme</label>
                <select
                  value={programmeId}
                  onChange={(e) => setProgrammeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  {DEMO_PROGRAMMES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  {DEMO_ACADEMIC_YEARS.map((y) => (
                    <option key={y.id} value={y.year_label}>
                      {y.year_label} {y.is_current ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Academic Weighting & Capacity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Curriculum Credits & Scheduling Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Category</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value as CourseCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                  <option value="Lab">Lab</option>
                  <option value="Open Elective">Open Elective</option>
                  <option value="Capstone">Capstone</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Lecture Hrs/Wk</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={lectureHours}
                  onChange={(e) => setLectureHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Lab Hrs/Wk</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={labHours}
                  onChange={(e) => setLabHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Max Capacity</label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Class Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed 10:00 - 11:30 AM"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Classroom / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Hall 304, Turing Wing"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Enrolment Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={enrolmentDeadline}
                  onChange={(e) => setEnrolmentDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Prerequisites & Learning Objectives */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Prerequisites & Learning Objectives</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Course Prerequisites (Comma Separated Codes)
              </label>
              <input
                type="text"
                placeholder="e.g. CS201, CS204, MATH201"
                value={prerequisitesInput}
                onChange={(e) => setPrerequisitesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <span className="text-xs text-slate-500">
                Automated validation will check student transcript history prior to join approval.
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Key Learning Objectives
              </label>
              <div className="space-y-2">
                {objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      {obj}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add specific learning objective..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddObjective();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <Button type="button" variant="outline" onClick={handleAddObjective} className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Add Objective
                </Button>
              </div>
            </div>
          </div>

          {/* Card 4: Media, Syllabi & Collaboration Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Materials, Thumbnail & Policy Controls</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Course Syllabus URL / Storage Path
                </label>
                <input
                  type="url"
                  placeholder="https://campus.edu/syllabi/CS305.pdf"
                  value={syllabusUrl}
                  onChange={(e) => setSyllabusUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Course Thumbnail / Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <input
                  type="checkbox"
                  id="allowEnrolment"
                  checked={allowEnrolment}
                  onChange={(e) => setAllowEnrolment(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div>
                  <label htmlFor="allowEnrolment" className="text-sm font-semibold text-slate-900 cursor-pointer">
                    Allow Student Enrolment Requests
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">
                    When active, students can discover this course in the catalogue and submit join requests.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <input
                  type="checkbox"
                  id="allowFacultyCollab"
                  checked={allowFacultyCollab}
                  onChange={(e) => setAllowFacultyCollab(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div>
                  <label htmlFor="allowFacultyCollab" className="text-sm font-semibold text-slate-900 cursor-pointer">
                    Allow Faculty Collaboration Requests
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Permits peer faculty to apply for co-instruction, TA duties, or guest contributor roles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/faculty/courses">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Student Catalogue Preview</h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={title || "Course"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-sm">
                  {courseCode || "CODE101"}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                  {courseCategory} • {credits} Credits
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">{title || "Untitled Course Preview"}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lead Instructor: {user.full_name} • {semester} ({academicYear})
                </p>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                  {description || "No description provided yet."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Schedule:</span>{" "}
                  <span className="font-semibold text-slate-800">{schedule || "TBD"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Location:</span>{" "}
                  <span className="font-semibold text-slate-800">{location || "TBD"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Capacity:</span>{" "}
                  <span className="font-semibold text-slate-800">{maxCapacity} Seats</span>
                </div>
                <div>
                  <span className="text-slate-500">Deadline:</span>{" "}
                  <span className="font-semibold text-slate-800">{enrolmentDeadline}</span>
                </div>
              </div>

              {objectives.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Learning Objectives
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button type="button" onClick={() => setIsPreviewOpen(false)}>
                Back to Editing
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

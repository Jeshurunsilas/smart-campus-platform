"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  DEMO_PROGRAMMES,
  createAcademicCourse,
  toggleCoursePublish,
} from "@/lib/services/academic-services";
import { AcademicCourse, UserProfile } from "@/types";
import {
  BookOpen,
  PlusCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  GraduationCap,
  Users,
  Search,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminCoursesPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.admin);
  const [courses, setCourses] = useState<AcademicCourse[]>(DEMO_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New course form
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState(4);
  const [lectureHours, setLectureHours] = useState(3);
  const [labHours, setLabHours] = useState(2);
  const [capacity, setCapacity] = useState(60);
  const [prereqInput, setPrereqInput] = useState("");

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProg = selectedProgramme === "all" || c.programme_id === selectedProgramme;
    return matchesSearch && matchesProg;
  });

  const handleTogglePublish = async (courseId: string) => {
    const res = await toggleCoursePublish(courseId);
    if (res.success) {
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, is_published: res.is_published } : c))
      );
      setNotification(`Course availability status updated.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createAcademicCourse({
      course_code: courseCode,
      title,
      description,
      credits: Number(credits),
      lecture_hours: Number(lectureHours),
      lab_hours: Number(labHours),
      max_enrolment_capacity: Number(capacity),
      prerequisites: prereqInput ? prereqInput.split(",").map((s) => s.trim()) : [],
      is_published: true,
    });

    setCourses((prev) => [created, ...prev]);
    setIsCreateOpen(false);
    setCourseCode("");
    setTitle("");
    setDescription("");
    setNotification("Course successfully added to university syllabus registry.");
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <DashboardShell
      title="University Course Catalogue & Curriculum"
      subtitle="Curate university degree programmes, course syllabi, prerequisite rules, and faculty section assignments"
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
          title="Total Registered Courses"
          value={courses.length}
          icon={BookOpen}
        />
        <StatsCard
          title="Published Syllabi"
          value={courses.filter((c) => c.is_published).length}
          icon={Eye}
        />
        <StatsCard
          title="Degree Programmes"
          value={DEMO_PROGRAMMES.length}
          icon={GraduationCap}
        />
        <StatsCard
          title="Total Course Capacity"
          value={courses.reduce((sum, c) => sum + c.max_enrolment_capacity, 0)}
          icon={Users}
        />
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by course code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={selectedProgramme}
            onChange={(e) => setSelectedProgramme(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">All Programmes</option>
            {DEMO_PROGRAMMES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} ({p.degree_type})
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Add Academic Course
        </Button>
      </div>

      {/* Courses Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Credits (L+P)</th>
                <th className="py-3 px-4">Enrolment Cap</th>
                <th className="py-3 px-4">Prerequisites</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {c.course_code}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {c.description}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {c.credits} cr ({c.lecture_hours}L + {c.lab_hours}P)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">{c.max_enrolment_capacity} seats</td>
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                    {c.prerequisites.length > 0 ? c.prerequisites.join(", ") : "None"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        c.is_published
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {c.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(c.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      {c.is_published ? (
                        <>
                          <EyeOff className="h-3 w-3" /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" /> Publish
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCourse}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-indigo-500" />
              Add Course to University Curriculum
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Define accreditation credits, contact hours, and enrolment quotas
            </p>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS401"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-mono uppercase text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus Systems"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Syllabus Scope
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline major units, learning outcomes, and technical domains..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lecture Hrs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={lectureHours}
                    onChange={(e) => setLectureHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lab Hrs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={labHours}
                    onChange={(e) => setLabHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prerequisites (comma-separated codes)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS201 - Data Structures, CS204 - Discrete Math"
                  value={prereqInput}
                  onChange={(e) => setPrereqInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Register & Publish Course
              </Button>
            </div>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}

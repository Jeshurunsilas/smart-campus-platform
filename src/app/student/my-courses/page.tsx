"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  DEMO_COURSE_MEMBERSHIPS,
  DEMO_COURSE_MATERIALS,
} from "@/lib/services/academic-services";
import { AcademicCourse, UserProfile } from "@/types";
import {
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  GraduationCap,
  Users,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function StudentMyCoursesPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.student); // Aarav Sharma
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);

  // Find enrolled courses
  const enrolledCourseIds = new Set(
    DEMO_COURSE_MEMBERSHIPS.filter(
      (m) =>
        m.user_id === user.id &&
        (m.role === "student" || m.membership_role === "student") &&
        (m.status === "ACTIVE" || m.status === "active")
    ).map((m) => m.course_id)
  );

  const myEnrolledCourses = courses.filter((c) => enrolledCourseIds.has(c.id));
  const totalCredits = myEnrolledCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <DashboardShell
      title="My Enrolled Degree Courses"
      subtitle="Access your active semester course workspaces, study materials, announcements, and grades."
      role="student"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Spring Semester 2026
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Registered Credits: <strong>{totalCredits}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/course-requests">
              <Button variant="outline" size="sm" className="gap-2">
                <Clock className="w-4 h-4" />
                Join Requests
              </Button>
            </Link>
            <Link href="/student/courses">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold">
                <BookOpen className="w-4 h-4" />
                Course Catalogue
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Enrolled Courses"
            value={myEnrolledCourses.length}
            icon={BookOpen}
          />
          <StatsCard
            title="Registered Credits"
            value={`${totalCredits} Units`}
            icon={Award}
          />
          <StatsCard
            title="Active Attendance Status"
            value="Good Standing (92%)"
            icon={CheckCircle2}
          />
        </div>

        {/* Enrolled Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEnrolledCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700 text-base">No active course enrolments</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the course catalogue and submit join requests to register for your degree modules.
              </p>
              <div className="mt-4">
                <Link href="/student/courses">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Explore Catalogue
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            myEnrolledCourses.map((course) => {
              const materialCount = DEMO_COURSE_MATERIALS.filter(
                (m) => m.course_id === course.id
              ).length;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition-all hover:shadow-md"
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
                      <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                        {course.course_code}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold px-2 py-0.5 rounded shadow-sm">
                        {course.credits} Credits • {course.course_category}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Lead Faculty: Dr. Elena Rostova • {course.semester}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Schedule:</span>
                          <span className="font-medium text-slate-800">{course.class_schedule || "TBD"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="font-medium text-slate-800">
                            {course.classroom_location || "TBD"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resources:</span>
                          <span className="font-medium text-indigo-600">
                            {materialCount} files published
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                    </span>
                    <Link href={`/student/courses/${course.id}`}>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1">
                        Open Workspace <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

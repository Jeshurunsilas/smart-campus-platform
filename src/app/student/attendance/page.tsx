"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import { UserProfile, AttendanceSession, AttendanceRecord } from "@/types";
import { getStudentAttendanceHistory } from "@/lib/services/academic-services";
import {
  CalendarCheck2,
  CalendarX2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";

export default function StudentAttendancePage() {
  const [user] = useState<UserProfile>(DEMO_USERS.student);
  const [attendanceData, setAttendanceData] = useState<{
    sessions: AttendanceSession[];
    records: AttendanceRecord[];
    overallPercentage: number;
    courseBreakdown: Array<{
      courseCode: string;
      courseTitle: string;
      totalSessions: number;
      attended: number;
      percentage: number;
      isAtRisk: boolean;
    }>;
  } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentAttendanceHistory(user.id).then((data) => {
      setAttendanceData(data);
      setIsLoading(false);
    });
  }, [user.id]);

  const atRiskCourses = attendanceData?.courseBreakdown.filter((c) => c.isAtRisk) || [];

  return (
    <DashboardShell
      title="Academic Attendance"
      subtitle="Track course lecture attendance, verified physical session records, and academic standing"
      role="student"
      user={user}
    >
      {/* At-Risk Warning Alert */}
      {atRiskCourses.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-700 dark:text-red-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                Attendance Shortage Notice (&lt; 75% Threshold)
              </h3>
              <p className="mt-1 text-sm text-red-800/90 dark:text-red-300/90">
                You have dropped below the mandatory 75% minimum attendance requirement in:{" "}
                <span className="font-semibold">
                  {atRiskCourses.map((c) => `${c.courseCode} (${c.percentage}%)`).join(", ")}
                </span>
                . Falling below 75% may disqualify you from appearing in final examinations.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="danger">
                  Request Medical / Absence Condonation
                </Button>
                <Button size="sm" variant="outline">
                  Contact Course Faculty
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Overall Attendance"
          value={attendanceData ? `${attendanceData.overallPercentage}%` : "..."}
          icon={TrendingUp}
          trend={
            attendanceData && attendanceData.overallPercentage >= 75
              ? { value: "Eligible for Exams", isPositive: true }
              : { value: "Shortage Alert", isPositive: false }
          }
        />
        <StatsCard
          title="Total Lectures Logged"
          value={attendanceData ? attendanceData.courseBreakdown.reduce((sum, c) => sum + c.totalSessions, 0) : 0}
          icon={CalendarCheck2}
        />
        <StatsCard
          title="Sessions Attended"
          value={attendanceData ? attendanceData.courseBreakdown.reduce((sum, c) => sum + c.attended, 0) : 0}
          icon={CheckCircle2}
        />
        <StatsCard
          title="At-Risk Courses"
          value={atRiskCourses.length}
          icon={AlertTriangle}
          className={atRiskCourses.length > 0 ? "border-amber-500/50 bg-amber-500/5" : ""}
        />
      </div>

      {/* Course Breakdown */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          Course-Wise Attendance Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendanceData?.courseBreakdown.map((course) => {
            const isCritical = course.percentage < 75;
            const isWarning = course.percentage >= 75 && course.percentage < 85;

            return (
              <div
                key={course.courseCode}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.courseCode}
                    </span>
                    <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {course.courseTitle}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-2xl font-bold ${
                        isCritical
                          ? "text-red-500"
                          : isWarning
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {course.percentage}%
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {course.attended} / {course.totalSessions} sessions
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCritical
                        ? "bg-red-500"
                        : isWarning
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Minimum req: 75%</span>
                  {isCritical ? (
                    <span className="font-semibold text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Shortage: Needs 5 consecutive classes
                    </span>
                  ) : (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Good Standing
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Session Log Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 p-5">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Session-by-Session Lecture Log</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biometrically verified and faculty-recorded class attendance logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Courses</option>
              <option value="CS301">CS301 - Operating Systems</option>
              <option value="CS302">CS302 - AI & Neural Networks</option>
              <option value="CS303">CS303 - Database Engineering</option>
              <option value="EC305">EC305 - Embedded IoT Systems</option>
            </select>
            <Button size="sm" variant="outline" className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Topic Covered</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {[
                {
                  id: "1",
                  date: "2026-03-24",
                  time: "09:00 - 10:00 AM",
                  code: "CS301",
                  topic: "Virtual Memory Paging & Replacement Algorithms",
                  room: "AB1-204",
                  status: "present",
                },
                {
                  id: "2",
                  date: "2026-03-24",
                  time: "11:00 - 12:00 PM",
                  code: "CS302",
                  topic: "Convolutional Neural Networks & Feature Maps",
                  room: "AB1-302",
                  status: "present",
                },
                {
                  id: "3",
                  date: "2026-03-23",
                  time: "02:00 - 04:00 PM",
                  code: "CS303",
                  topic: "Database Indexing: B+ Trees vs Hash Indexing",
                  room: "AB1-105",
                  status: "absent",
                },
                {
                  id: "4",
                  date: "2026-03-22",
                  time: "10:00 - 11:00 AM",
                  code: "EC305",
                  topic: "I2C Bus Protocol & Accelerometer Interfacing",
                  room: "AB2-201",
                  status: "present",
                },
                {
                  id: "5",
                  date: "2026-03-21",
                  time: "09:00 - 10:00 AM",
                  code: "CS301",
                  topic: "Process Synchronization & Semaphores",
                  room: "AB1-204",
                  status: "present",
                },
              ]
                .filter((r) => selectedCourse === "all" || r.code === selectedCourse)
                .map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {row.date}
                    </td>
                    <td className="py-3 px-4 text-xs">{row.time}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {row.code}
                    </td>
                    <td className="py-3 px-4">{row.topic}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                      {row.room}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.status === "present"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {row.status === "present" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Present
                          </>
                        ) : (
                          <>
                            <CalendarX2 className="h-3 w-3" /> Absent
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

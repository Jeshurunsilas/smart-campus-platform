"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  recordAttendanceSession,
  DEMO_SECTIONS,
} from "@/lib/services/academic-services";
import { UserProfile, AttendanceSession } from "@/types";
import {
  CalendarCheck2,
  CheckCircle2,
  CalendarX2,
  Users,
  Clock,
  Save,
  CheckCheck,
  AlertCircle,
} from "lucide-react";

interface StudentRosterRow {
  studentId: string;
  name: string;
  rollNo: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export default function FacultyAttendancePage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [selectedSection, setSelectedSection] = useState("sec-cs301-a");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [slotTime, setSlotTime] = useState("09:00 - 10:00 AM");
  const [topicCovered, setTopicCovered] = useState("Distributed Consensus & Raft Leader Election");

  const [roster, setRoster] = useState<StudentRosterRow[]>([
    {
      studentId: "d0000001-0000-0000-0000-000000000001",
      name: "Aarav Sharma",
      rollNo: "2024-CSE-042",
      status: "present",
    },
    {
      studentId: "usr-student-02",
      name: "Diya Patel",
      rollNo: "2024-CSE-019",
      status: "present",
    },
    {
      studentId: "usr-student-03",
      name: "Rohan Verma",
      rollNo: "2024-CSE-055",
      status: "absent",
    },
    {
      studentId: "usr-student-04",
      name: "Ananya Iyer",
      rollNo: "2024-CSE-008",
      status: "present",
    },
    {
      studentId: "usr-student-05",
      name: "Vikram Malhotra",
      rollNo: "2024-CSE-071",
      status: "present",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleMarkAll = (status: "present" | "absent") => {
    setRoster((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleToggleStatus = (index: number, status: "present" | "absent" | "late") => {
    setRoster((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status };
      return updated;
    });
  };

  const handleSaveAttendance = async () => {
    const res = await recordAttendanceSession({
      sectionId: selectedSection,
      facultyId: user.id,
      sessionDate,
      slotTime,
      topicCovered,
      records: roster.map((s) => ({
        studentId: s.studentId,
        status: s.status,
      })),
    });

    if (res.success) {
      setNotification(res.message || "Attendance recorded successfully.");
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const presentCount = roster.filter((r) => r.status === "present" || r.status === "late").length;
  const absentCount = roster.filter((r) => r.status === "absent").length;
  const attendanceRate = Math.round((presentCount / (roster.length || 1)) * 100);

  return (
    <DashboardShell
      title="Daily Lecture Attendance Recording"
      subtitle="Log classroom and laboratory session attendance with instant verification and shortage tracking"
      role="faculty"
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
          title="Session Attendance Rate"
          value={`${attendanceRate}%`}
          icon={CalendarCheck2}
          trend={{ value: `${presentCount} of ${roster.length} present`, isPositive: attendanceRate >= 75 }}
        />
        <StatsCard
          title="Students Present"
          value={presentCount}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Students Absent"
          value={absentCount}
          icon={CalendarX2}
          className={absentCount > 0 ? "border-amber-500/40 bg-amber-500/5" : ""}
        />
        <StatsCard
          title="Enrolled in Section"
          value={roster.length}
          icon={Users}
        />
      </div>

      {/* Session Metadata Controls */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Session Lecture Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="sec-cs301-a">CS301 - Operating Systems (Sec A)</option>
              <option value="sec-cs302-a">CS302 - AI & Neural Networks (Sec A)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Slot Time
            </label>
            <input
              type="text"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic / Syllabus Unit
            </label>
            <input
              type="text"
              value={topicCovered}
              onChange={(e) => setTopicCovered(e.target.value)}
              placeholder="e.g. Distributed Consensus"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Roster Sheet */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 p-5">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Student Attendance Marking Sheet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click individual status buttons or batch mark all candidates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("present")}
              className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll("absent")}
              className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400"
            >
              <CalendarX2 className="h-3.5 w-3.5" /> Mark All Absent
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAttendance}
              className="flex items-center gap-1.5 shadow-sm"
            >
              <Save className="h-4 w-4" /> Save Attendance Sheet
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {roster.map((student, idx) => (
                <tr key={student.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-xs font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {student.rollNo}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => handleToggleStatus(idx, "present")}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                          student.status === "present"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleToggleStatus(idx, "late")}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                          student.status === "late"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleToggleStatus(idx, "absent")}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                          student.status === "absent"
                            ? "bg-red-600 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
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

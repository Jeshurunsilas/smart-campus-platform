"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import { DEMO_GRADES, publishGradesForSection } from "@/lib/services/academic-services";
import { AcademicGradeRecord, UserProfile } from "@/types";
import {
  GraduationCap,
  Download,
  Upload,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Award,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

interface StudentGradeRow {
  studentId: string;
  studentName: string;
  rollNo: string;
  internal1: number;
  internal2: number;
  assignments: number;
  practicals: number;
  endSem: number;
  isPublished: boolean;
}

export default function FacultyGradebookPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [selectedSection, setSelectedSection] = useState<string>("sec-cs301-a");

  // Roster marks state
  const [rows, setRows] = useState<StudentGradeRow[]>([
    {
      studentId: "d0000001-0000-0000-0000-000000000001",
      studentName: "Aarav Sharma",
      rollNo: "2024-CSE-042",
      internal1: 18,
      internal2: 19,
      assignments: 9,
      practicals: 19,
      endSem: 28,
      isPublished: true,
    },
    {
      studentId: "usr-student-02",
      studentName: "Diya Patel",
      rollNo: "2024-CSE-019",
      internal1: 17,
      internal2: 18,
      assignments: 10,
      practicals: 18,
      endSem: 27,
      isPublished: true,
    },
    {
      studentId: "usr-student-03",
      studentName: "Rohan Verma",
      rollNo: "2024-CSE-055",
      internal1: 14,
      internal2: 15,
      assignments: 8,
      practicals: 16,
      endSem: 23,
      isPublished: false,
    },
    {
      studentId: "usr-student-04",
      studentName: "Ananya Iyer",
      rollNo: "2024-CSE-008",
      internal1: 19,
      internal2: 20,
      assignments: 10,
      practicals: 20,
      endSem: 29,
      isPublished: true,
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const calculateTotal = (row: StudentGradeRow) => {
    return row.internal1 + row.internal2 + row.assignments + row.practicals + row.endSem;
  };

  const getLetterGrade = (total: number) => {
    if (total >= 90) return { letter: "O", gpa: 10.0, color: "text-emerald-600 dark:text-emerald-400" };
    if (total >= 80) return { letter: "A+", gpa: 9.0, color: "text-indigo-600 dark:text-indigo-400" };
    if (total >= 70) return { letter: "A", gpa: 8.0, color: "text-blue-600 dark:text-blue-400" };
    if (total >= 60) return { letter: "B+", gpa: 7.0, color: "text-amber-600 dark:text-amber-400" };
    if (total >= 50) return { letter: "B", gpa: 6.0, color: "text-orange-600 dark:text-orange-400" };
    return { letter: "F", gpa: 0.0, color: "text-red-600 dark:text-red-400" };
  };

  const handleScoreChange = (index: number, field: keyof StudentGradeRow, val: number) => {
    const updated = [...rows];
    (updated[index] as any)[field] = isNaN(val) ? 0 : val;
    setRows(updated);
  };

  const handlePublishAll = async () => {
    await publishGradesForSection(selectedSection);
    setRows((prev) => prev.map((r) => ({ ...r, isPublished: true })));
    setNotification("All grade records signed and published to official student transcripts.");
    setTimeout(() => setNotification(null), 4000);
  };

  const averageScore = Math.round(
    rows.reduce((sum, r) => sum + calculateTotal(r), 0) / (rows.length || 1)
  );

  return (
    <DashboardShell
      title="Official Gradebook & Marks Matrix"
      subtitle="Input assessment components, compute weighted final marks, and publish grades with audit trail"
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
          title="Class Average"
          value={`${averageScore} / 100`}
          icon={TrendingUp}
          trend={{ value: "Grade A Band", isPositive: true }}
        />
        <StatsCard
          title="Students in Section"
          value={rows.length}
          icon={GraduationCap}
        />
        <StatsCard
          title="Published Records"
          value={rows.filter((r) => r.isPublished).length}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Draft / Unpublished"
          value={rows.filter((r) => !r.isPublished).length}
          icon={Lock}
          className={
            rows.filter((r) => !r.isPublished).length > 0
              ? "border-amber-500/40 bg-amber-500/5"
              : ""
          }
        />
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Course Section:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white"
          >
            <option value="sec-cs301-a">CS301 - Operating Systems (Section A)</option>
            <option value="sec-cs302-a">CS302 - AI & Neural Networks (Section A)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNotification("Grade sheet exported as academic CSV archive.");
              setTimeout(() => setNotification(null), 3000);
            }}
            className="flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNotification("CSV parsed: 4 student rows validated with 0 errors.");
              setTimeout(() => setNotification(null), 3000);
            }}
            className="flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4" /> Import CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublishAll}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <Unlock className="h-4 w-4" /> Publish All Grades
          </Button>
        </div>
      </div>

      {/* Gradebook Matrix Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-3 text-center">
                  Internal 1<br />
                  <span className="font-normal text-[11px]">(20m)</span>
                </th>
                <th className="py-3 px-3 text-center">
                  Internal 2<br />
                  <span className="font-normal text-[11px]">(20m)</span>
                </th>
                <th className="py-3 px-3 text-center">
                  Assignments<br />
                  <span className="font-normal text-[11px]">(10m)</span>
                </th>
                <th className="py-3 px-3 text-center">
                  Practical / Lab<br />
                  <span className="font-normal text-[11px]">(20m)</span>
                </th>
                <th className="py-3 px-3 text-center">
                  End Sem<br />
                  <span className="font-normal text-[11px]">(30m)</span>
                </th>
                <th className="py-3 px-4 text-center">
                  Total<br />
                  <span className="font-normal text-[11px]">(100m)</span>
                </th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {rows.map((row, index) => {
                const total = calculateTotal(row);
                const grade = getLetterGrade(total);

                return (
                  <tr key={row.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {row.studentName}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {row.rollNo}
                    </td>

                    {/* Editable cell: Internal 1 */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={row.internal1}
                        onChange={(e) => handleScoreChange(index, "internal1", Number(e.target.value))}
                        className="w-16 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Editable cell: Internal 2 */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={row.internal2}
                        onChange={(e) => handleScoreChange(index, "internal2", Number(e.target.value))}
                        className="w-16 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Editable cell: Assignments */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={row.assignments}
                        onChange={(e) => handleScoreChange(index, "assignments", Number(e.target.value))}
                        className="w-16 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Editable cell: Practicals */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={row.practicals}
                        onChange={(e) => handleScoreChange(index, "practicals", Number(e.target.value))}
                        className="w-16 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Editable cell: End Sem */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={row.endSem}
                        onChange={(e) => handleScoreChange(index, "endSem", Number(e.target.value))}
                        className="w-16 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                      {total}
                    </td>

                    {/* Letter Grade */}
                    <td className={`py-3 px-4 text-center font-bold ${grade.color}`}>
                      {grade.letter} ({grade.gpa.toFixed(1)})
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          row.isPublished
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {row.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

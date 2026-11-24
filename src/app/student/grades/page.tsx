"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_GRADES } from "@/lib/services/academic-services";
import {
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  FileText,
  Calendar,
  ShieldCheck,
  Download,
} from "lucide-react";

export default function StudentGradesPage() {
  const [grades] = useState(DEMO_GRADES);

  return (
    <DashboardShell role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Official Academic Record & Transcript</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Grades, Continuous Evaluation & GPA
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verified assessment components, published grade distributions, and cumulative performance metrics.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              Student ID: STU-2026-001
            </span>
          </div>
        </div>

        {/* GPA Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative CGPA</div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              9.38 <span className="text-sm font-semibold text-slate-400">/ 10.0</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> First Class with Distinction
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spring 2026 Term GPA</div>
            <div className="text-3xl font-black text-teal-700 font-mono">
              9.50 <span className="text-sm font-semibold text-slate-400">/ 10.0</span>
            </div>
            <div className="text-[11px] text-slate-500">Based on 11 registered credits</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits Completed</div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              84 <span className="text-sm font-semibold text-slate-400">/ 160 Total</span>
            </div>
            <div className="text-[11px] text-slate-500">On-track for 2027 graduation</div>
          </div>
        </div>

        {/* Published Marks Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Published Assessment Component Marks
            </h2>
            <span className="text-xs text-slate-400 font-mono">Spring 2026 Semester</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Assessment Component</th>
                  <th className="py-2.5 px-3">Marks Scored</th>
                  <th className="py-2.5 px-3">Weightage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Published Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((grd) => (
                  <tr key={grd.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-teal-800">CS301</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{grd.component_name}</td>
                    <td className="py-3 px-3 font-mono font-black text-slate-900">
                      {grd.marks_obtained} / {grd.max_marks} pts
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{grd.weightage_pct}%</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Official Published
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {grd.published_at ? new Date(grd.published_at).toLocaleDateString() : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import React, { useState } from "react";
import { DEMO_DEPARTMENT_SCORECARDS } from "@/lib/demo-data";
import { DepartmentScorecard as DepartmentScorecardType } from "@/types";
import { Star, Clock, Award } from "lucide-react";

export function DepartmentScorecard() {
  const [scorecards] = useState<DepartmentScorecardType[]>(DEMO_DEPARTMENT_SCORECARDS);
  const [sortBy, setSortBy] = useState<"compliance" | "rating" | "velocity">("compliance");

  const sorted = [...scorecards].sort((a, b) => {
    if (sortBy === "compliance") {
      return b.completion_rate_percentage - a.completion_rate_percentage;
    }
    if (sortBy === "rating") {
      return b.avg_satisfaction_rating - a.avg_satisfaction_rating;
    }
    return a.avg_resolution_hours - b.avg_resolution_hours;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Operational Department Scorecards
          </h3>
          <p className="text-xs text-slate-500">
            Comparative performance telemetry measuring SLA adherence and student/faculty CSAT ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Rank by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "compliance" | "rating" | "velocity")}
            className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="compliance">Highest SLA Compliance</option>
            <option value="rating">Highest Satisfaction Rating</option>
            <option value="velocity">Fastest Resolution Time</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Total Load</th>
              <th className="py-3 px-4">Open Active</th>
              <th className="py-3 px-4">Resolved</th>
              <th className="py-3 px-4">Mean Resolution</th>
              <th className="py-3 px-4">SLA Compliance</th>
              <th className="py-3 px-4 text-right">CSAT Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {sorted.map((sc, index) => (
              <tr key={sc.department_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-600 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-900">{sc.department_name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono">{sc.total_requests}</td>
                <td className="py-3.5 px-4 font-semibold text-amber-700">
                  {sc.open_requests + sc.in_progress_requests}
                </td>
                <td className="py-3.5 px-4 font-semibold text-emerald-700">
                  {sc.resolved_requests}
                </td>
                <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {sc.avg_resolution_hours} hrs
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sc.completion_rate_percentage >= 90
                            ? "bg-emerald-500"
                            : sc.completion_rate_percentage >= 80
                            ? "bg-teal-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${sc.completion_rate_percentage}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">
                      {sc.completion_rate_percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{sc.avg_satisfaction_rating}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

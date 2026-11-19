"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TrendsBarChart } from "@/components/dashboard/TrendsBarChart";
import { DepartmentPerformanceChart } from "@/components/dashboard/DepartmentPerformanceChart";
import { DEMO_DEPARTMENT_SCORECARDS } from "@/lib/demo-data";
import { Star, Clock, CheckCircle2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const scorecards = DEMO_DEPARTMENT_SCORECARDS;

  return (
    <DashboardShell role="administrator">
      <div className="pb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Service Analytics &amp; Intelligence
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Executive performance telemetry, resolution velocity metrics, and user satisfaction scorecards.
        </p>
      </div>

      {/* Top 3 Metric Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Campus Satisfaction Index
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              4.68
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              +0.3 vs last semester
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mean Resolution Time
            </span>
            <div className="text-3xl font-extrabold text-teal-800 mt-1">
              4.2 <span className="text-base font-medium text-slate-500">hours</span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              Under 6.0h SLA target
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              SLA Compliance Rate
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">
              93.8%
            </div>
            <span className="text-xs text-slate-500 font-medium mt-1 block">
              Across 6 dispatch departments
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Service Request Intake vs Resolution
          </h3>
          <p className="text-xs text-slate-500 mb-4">6-Month longitudinal trend</p>
          <TrendsBarChart />
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Department SLA Resolution Rates
          </h3>
          <p className="text-xs text-slate-500 mb-4">Percentage completed within deadline</p>
          <DepartmentPerformanceChart />
        </div>
      </div>

      {/* Department Scorecard Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Department Performance Scorecard
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Detailed metrics showing workload, completion percentage, and user satisfaction ratings.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total Requests</th>
                <th className="py-3 px-4">Active Orders</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">Avg Resolution</th>
                <th className="py-3 px-4">SLA Compliance</th>
                <th className="py-3 px-4 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scorecards.map((sc) => (
                <tr key={sc.department_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {sc.department_name}
                  </td>
                  <td className="py-3.5 px-4">{sc.total_requests}</td>
                  <td className="py-3.5 px-4 text-amber-600 font-semibold">
                    {sc.in_progress_requests + sc.open_requests}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold">
                    {sc.resolved_requests}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{sc.avg_resolution_hours} hrs</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-teal-700">
                      {sc.completion_rate_percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {sc.avg_satisfaction_rating}
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

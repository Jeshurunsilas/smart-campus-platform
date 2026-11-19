"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TrendsBarChart } from "@/components/dashboard/TrendsBarChart";
import { DepartmentPerformanceChart } from "@/components/dashboard/DepartmentPerformanceChart";
import { CampusHeatmap } from "@/components/dashboard/CampusHeatmap";
import { DepartmentScorecard } from "@/components/dashboard/DepartmentScorecard";
import { FeedbackAnalysis } from "@/components/dashboard/FeedbackAnalysis";
import { Star, Clock, CheckCircle2, Map, BarChart3, Award, MessageSquare } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "departments" | "feedback">("overview");

  return (
    <DashboardShell role="administrator">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Service Analytics &amp; Intelligence
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Executive performance telemetry, incident heatmaps, resolution velocity, and CSAT feedback.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Trends &amp; Metrics
          </button>
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "heatmap"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Campus Heatmap
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "departments"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Scorecards
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "feedback"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            CSAT &amp; Feedback
          </button>
        </div>
      </div>

      {/* Top 3 Executive Metric Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Campus Satisfaction Index
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              4.72
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
              Mean Resolution Velocity
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

      {/* Tab 1: Overview & Charts */}
      {activeTab === "overview" && (
        <div className="space-y-6">
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

          <DepartmentScorecard />
        </div>
      )}

      {/* Tab 2: Campus Incident Heatmap */}
      {activeTab === "heatmap" && (
        <CampusHeatmap />
      )}

      {/* Tab 3: Department Scorecards */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <DepartmentScorecard />
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Resolution Velocity by Department
            </h3>
            <p className="text-xs text-slate-500 mb-4">Comparative compliance trends</p>
            <DepartmentPerformanceChart />
          </div>
        </div>
      )}

      {/* Tab 4: Recipient CSAT & Feedback */}
      {activeTab === "feedback" && (
        <FeedbackAnalysis />
      )}
    </DashboardShell>
  );
}

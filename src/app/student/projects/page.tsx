"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_PROJECTS } from "@/lib/services/academic-services";
import { AcademicProject, ProjectReview } from "@/types";
import {
  FolderKanban,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Upload,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function StudentProjectsPage() {
  const [projects] = useState<AcademicProject[]>(DEMO_PROJECTS);
  const [activeProject] = useState<AcademicProject>(projects[0]);

  return (
    <DashboardShell role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <FolderKanban className="w-4 h-4 text-teal-600" />
              <span>Capstone & Academic Research Projects</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Project Registration, Reviews & Rubric Evaluation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track project milestones, faculty guide advisory, panel review schedules, and multi-criteria rubric evaluation scores.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
            Stage: First Review Completed
          </span>
        </div>

        {activeProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Project Details & Rubrics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    {activeProject.category} Project
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Status: {activeProject.status.replace("_", " ")}
                  </span>
                </div>

                <h2 className="text-lg font-black text-slate-900 leading-snug">{activeProject.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {activeProject.abstract}
                </p>

                {/* Team Members & Guide */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Faculty Guide</div>
                    <div className="font-extrabold text-slate-900">Dr. Priya Sharma</div>
                    <div className="text-[10px] text-slate-500">Department of Computer Science</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Team Lead & Members</div>
                    <div className="font-extrabold text-slate-900">Rahul Kumar (Lead)</div>
                    <div className="text-[10px] text-slate-500">Autonomous edge drone architecture</div>
                  </div>
                </div>
              </div>

              {/* Multi-Stage Rubric Evaluation History */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Panel Review Rubric Scores & Breakdown
                  </h3>
                </div>

                {activeProject.reviews?.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-purple-900">{rev.review_stage}</span>
                      <span className="text-sm font-black text-purple-800 font-mono">
                        {rev.total_score} / {rev.max_score} pts
                      </span>
                    </div>

                    {/* Rubric Category Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {Object.entries(rev.rubric_breakdown).map(([criteria, score]) => (
                        <div key={criteria} className="p-2 rounded-lg bg-white border border-purple-100 space-y-0.5">
                          <div className="capitalize text-slate-500 text-[10px] font-semibold">{criteria.replace("_", " ")}</div>
                          <div className="font-mono font-bold text-slate-900">{score} pts</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-purple-900 bg-white/80 p-3 rounded-lg border border-purple-200/60">
                      <span className="font-bold">Panel Feedback: </span>
                      {rev.feedback_comments}
                    </div>

                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Recommendation: {rev.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Milestone Uploads */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900">Milestone Deliverable</h3>
                  <p className="text-xs text-slate-500">Upload midterm demonstration reports and slides</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-teal-400 transition-colors bg-slate-50/50 space-y-1">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="text-xs font-semibold text-slate-700">Project Presentation / Report</div>
                  <p className="text-[10px] text-slate-400">PDF, PPTX, or ZIP archive (max 50MB)</p>
                </div>

                <Button variant="primary" size="sm" className="w-full text-xs">
                  Submit Deliverable
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}

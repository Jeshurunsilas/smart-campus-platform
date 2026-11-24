"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import { DEMO_PROJECTS, evaluateCapstoneProject } from "@/lib/services/academic-services";
import { AcademicProject, UserProfile } from "@/types";
import {
  FolderKanban,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Sliders,
} from "lucide-react";

export default function FacultyProjectsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [projects, setProjects] = useState<AcademicProject[]>(DEMO_PROJECTS);
  const [evaluatingProject, setEvaluatingProject] = useState<AcademicProject | null>(null);

  // Rubric state (Total 100)
  const [rubric, setRubric] = useState({
    problemDefinition: 18, // / 20
    technicalArchitecture: 23, // / 25
    innovation: 18, // / 20
    testingValidation: 19, // / 20
    presentationViva: 14, // / 15
  });
  const [comments, setComments] = useState("");
  const [reviewStage, setReviewStage] = useState<
    "Abstract Review" | "First Review" | "Second Review" | "Final Evaluation"
  >("Final Evaluation");
  const [notification, setNotification] = useState<string | null>(null);

  const totalRubricScore =
    rubric.problemDefinition +
    rubric.technicalArchitecture +
    rubric.innovation +
    rubric.testingValidation +
    rubric.presentationViva;

  const handleRubricSubmit = async () => {
    if (!evaluatingProject) return;
    const res = await evaluateCapstoneProject(
      evaluatingProject.id,
      reviewStage,
      rubric,
      comments || "Comprehensive architecture and functional demo demonstrated."
    );
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === evaluatingProject.id
            ? {
                ...p,
                status: totalRubricScore >= 75 ? "approved" : "revision_required",
              }
            : p
        )
      );
      setEvaluatingProject(null);
      setNotification(`Project review recorded: Score ${totalRubricScore}/100.`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <DashboardShell
      title="Capstone & Project Viva Evaluation"
      subtitle="Supervise undergraduate and postgraduate research projects with structured multi-stage rubric evaluation"
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
          title="Assigned Projects"
          value={projects.length}
          icon={FolderKanban}
        />
        <StatsCard
          title="Supervised Students"
          value={projects.reduce((sum, p) => sum + (p.members?.length || 2), 0)}
          icon={Users}
        />
        <StatsCard
          title="Final Approvals"
          value={projects.filter((p) => p.status === "approved").length}
          icon={Award}
        />
        <StatsCard
          title="Reviews Due"
          value={projects.filter((p) => p.status !== "approved").length}
          icon={Clock}
          className={
            projects.filter((p) => p.status !== "approved").length > 0
              ? "border-amber-500/40 bg-amber-500/5"
              : ""
          }
        />
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold px-2 py-0.5 text-xs">
                    {(proj.category || "capstone").toUpperCase()} • 2025-26
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      proj.status === "approved"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}
                  >
                    {proj.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {proj.title}
                </h3>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setEvaluatingProject(proj)}
                className="flex items-center gap-1.5 self-start md:self-auto shadow-sm"
              >
                <Sliders className="h-4 w-4" /> Conduct Rubric Evaluation
              </Button>
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {proj.abstract}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Student Team Members:</span>
                <ul className="space-y-0.5 font-medium text-slate-700 dark:text-slate-300">
                  {proj.members?.map((m) => (
                    <li key={m.id} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {m.student?.full_name} ({m.role.replace("_", " ")})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Evaluation Milestones:</span>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {proj.reviews?.length || 0} Stage(s) Completed
                </p>
                {proj.reviews && proj.reviews.length > 0 && (
                  <p className="text-[11px] text-slate-500">
                    Latest: {proj.reviews[proj.reviews.length - 1].review_stage} (
                    {proj.reviews[proj.reviews.length - 1].total_score}/100)
                  </p>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Guide Recommendation:</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {proj.reviews && proj.reviews.length > 0
                    ? proj.reviews[proj.reviews.length - 1].recommendation
                    : "Ready for Viva Presentation"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rubric Scoring Modal */}
      {evaluatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Capstone Assessment Rubric (100 Points)
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Evaluating: <span className="font-semibold">{evaluatingProject.title}</span>
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Evaluation Review Stage
                </label>
                <select
                  value={reviewStage}
                  onChange={(e) => setReviewStage(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Abstract Review">Stage 1: Abstract & Feasibility Review</option>
                  <option value="First Review">Stage 2: Architecture & Design Review</option>
                  <option value="Second Review">Stage 3: Implementation & Demo Review</option>
                  <option value="Final Evaluation">Stage 4: Final Evaluation & Viva Voce</option>
                </select>
              </div>

              {/* Rubric Sliders */}
              <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Problem Definition & Literature Survey</span>
                    <span>{rubric.problemDefinition} / 20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={rubric.problemDefinition}
                    onChange={(e) =>
                      setRubric({ ...rubric, problemDefinition: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Technical Architecture & Engineering Quality</span>
                    <span>{rubric.technicalArchitecture} / 25</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={rubric.technicalArchitecture}
                    onChange={(e) =>
                      setRubric({ ...rubric, technicalArchitecture: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Innovation, Originality & Practical Value</span>
                    <span>{rubric.innovation} / 20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={rubric.innovation}
                    onChange={(e) => setRubric({ ...rubric, innovation: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Testing, Empirical Validation & Benchmarks</span>
                    <span>{rubric.testingValidation} / 20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={rubric.testingValidation}
                    onChange={(e) =>
                      setRubric({ ...rubric, testingValidation: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Presentation, Documentation & Viva Voce</span>
                    <span>{rubric.presentationViva} / 15</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={rubric.presentationViva}
                    onChange={(e) =>
                      setRubric({ ...rubric, presentationViva: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm">
                  <span>Aggregate Total Score:</span>
                  <span
                    className={
                      totalRubricScore >= 75
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-500"
                    }
                  >
                    {totalRubricScore} / 100
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Panel Feedback & Improvement Recommendations
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Notes on methodology, security testing, and final viva defence..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEvaluatingProject(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleRubricSubmit}>
                Submit Official Scorecard
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

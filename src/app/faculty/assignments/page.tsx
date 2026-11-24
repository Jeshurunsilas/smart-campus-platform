"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_ASSIGNMENTS,
  DEMO_SUBMISSIONS,
  createAcademicAssignment,
  evaluateAssignmentSubmission,
} from "@/lib/services/academic-services";
import { AcademicAssignment, AssignmentSubmission, UserProfile } from "@/types";
import {
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  Award,
  Edit3,
  ExternalLink,
} from "lucide-react";

export default function FacultyAssignmentsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [assignments, setAssignments] = useState<AcademicAssignment[]>(DEMO_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(DEMO_SUBMISSIONS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [evaluatingSubmission, setEvaluatingSubmission] = useState<AssignmentSubmission | null>(null);
  const [marksInput, setMarksInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [newDueDate, setNewDueDate] = useState("2026-04-15");
  const [newMaxMarks, setNewMaxMarks] = useState(100);
  const [newWeightage, setNewWeightage] = useState(15);
  const [allowLate, setAllowLate] = useState(true);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createAcademicAssignment({
      title: newTitle,
      instructions: newInstructions,
      due_date: newDueDate,
      max_marks: Number(newMaxMarks),
      weightage_pct: Number(newWeightage),
      late_submission_allowed: allowLate,
    });
    if (created.assignment) {
      setAssignments((prev) => [created.assignment!, ...prev]);
    }
    setIsCreateOpen(false);
    setNewTitle("");
    setNewInstructions("");
    setActionSuccess("Assignment published to student portals successfully.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleEvaluateSubmit = async () => {
    if (!evaluatingSubmission) return;
    const res = await evaluateAssignmentSubmission(
      evaluatingSubmission.id,
      marksInput,
      feedbackInput
    );
    if (res.success) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === evaluatingSubmission.id
            ? {
                ...s,
                marks_obtained: marksInput,
                faculty_feedback: feedbackInput,
                status: "evaluated",
              }
            : s
        )
      );
      setEvaluatingSubmission(null);
      setActionSuccess("Evaluation and grades recorded successfully.");
      setTimeout(() => setActionSuccess(null), 3500);
    }
  };

  return (
    <DashboardShell
      title="Assignment & Assessment Management"
      subtitle="Publish academic coursework, review student submissions, and grade deliverables with feedback"
      role="faculty"
      user={user}
    >
      {actionSuccess && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium">{actionSuccess}</p>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Published Assignments"
          value={assignments.length}
          icon={FileText}
        />
        <StatsCard
          title="Submissions Received"
          value={submissions.length}
          icon={Clock}
        />
        <StatsCard
          title="Evaluated Deliverables"
          value={submissions.filter((s) => s.status === "evaluated").length}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Pending Evaluation"
          value={submissions.filter((s) => s.status !== "evaluated").length}
          icon={AlertCircle}
          className={
            submissions.filter((s) => s.status !== "evaluated").length > 0
              ? "border-amber-500/40 bg-amber-500/5"
              : ""
          }
        />
      </div>

      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Coursework Tasks</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Term assessments and lab deliverables for the current semester
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold px-2 py-0.5 text-xs">
                  {asg.course?.course_code || "CS301"}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {asg.title}
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {asg.weightage_pct}% Weightage
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {asg.instructions}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Due: {asg.due_date}
              </span>
              <span>Max Marks: {asg.max_marks}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white">Student Submissions & Evaluation Queue</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review uploaded files, input marks, and record qualitative feedback
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assignment</th>
                <th className="py-3 px-4">Deliverable File</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Marks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {sub.student?.full_name || "Aarav Sharma"}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium">{sub.assignment?.title || "OS Kernel"}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className="flex items-center gap-1 font-mono text-indigo-600 dark:text-indigo-400">
                      <Download className="h-3.5 w-3.5" />
                      {sub.file_name || "submission.pdf"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {new Date(sub.submitted_at).toLocaleDateString()}
                    {sub.is_late && (
                      <span className="ml-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
                        LATE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {sub.marks_obtained !== undefined && sub.marks_obtained !== null ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {sub.marks_obtained} / {sub.assignment?.max_marks || 100}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal italic">Ungraded</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        sub.status === "evaluated"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {sub.status === "evaluated" ? "Evaluated" : "Pending Review"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEvaluatingSubmission(sub);
                        setMarksInput(sub.marks_obtained || 85);
                        setFeedbackInput(sub.faculty_feedback || "");
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Edit3 className="h-3 w-3" /> Grade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation Modal */}
      {evaluatingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Grade Student Submission
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Evaluating submission by {evaluatingSubmission.student?.full_name} for{" "}
              {evaluatingSubmission.assignment?.title}
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Marks Awarded (out of {evaluatingSubmission.assignment?.max_marks || 100})
                </label>
                <input
                  type="number"
                  min="0"
                  max={evaluatingSubmission.assignment?.max_marks || 100}
                  value={marksInput}
                  onChange={(e) => setMarksInput(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Qualitative Faculty Feedback
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Provide constructive feedback on technical accuracy, structure, and design..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEvaluatingSubmission(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleEvaluateSubmit}>
                Save Evaluation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleCreateAssignment}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-indigo-500" />
              Create New Assignment
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Publish task specifications and submission deadlines to registered students
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Engine"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Requirements
                </label>
                <textarea
                  required
                  placeholder="Detailed guidelines, algorithmic constraints, and expected output format..."
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Weightage %
                  </label>
                  <input
                    type="number"
                    required
                    value={newWeightage}
                    onChange={(e) => setNewWeightage(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={allowLate}
                  onChange={(e) => setAllowLate(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="allowLate" className="text-xs text-slate-700 dark:text-slate-300">
                  Allow late submissions with penalty flag
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Publish Assignment
              </Button>
            </div>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}

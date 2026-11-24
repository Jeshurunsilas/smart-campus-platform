"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import {
  DEMO_ASSIGNMENTS,
  DEMO_SUBMISSIONS,
  submitStudentAssignment,
} from "@/lib/services/academic-services";
import { AcademicAssignment, AssignmentSubmission } from "@/types";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Star,
  Download,
  AlertTriangle,
} from "lucide-react";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AcademicAssignment[]>(DEMO_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(DEMO_SUBMISSIONS);
  const [selectedAsgId, setSelectedAsgId] = useState(assignments[0]?.id || "");
  const [submissionText, setSubmissionText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectedAsg = assignments.find((a) => a.id === selectedAsgId);
  const existingSub = submissions.find((s) => s.assignment_id === selectedAsgId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName && !submissionText) {
      setMessage({ type: "error", text: "Please select a file to upload or enter your solution text." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    const studentId = "d0000001-0000-0000-0000-000000000002"; // Rahul Kumar

    const res = await submitStudentAssignment({
      assignmentId: selectedAsgId,
      studentId,
      fileName: fileName || "rahul_kumar_assignment_submission.zip",
      submissionText,
    });

    if (res.success && res.submission) {
      setMessage({ type: "success", text: res.message || "Assignment deliverable submitted successfully." });
      setSubmissions((prev) => [res.submission!, ...prev.filter((s) => s.assignment_id !== selectedAsgId)]);
      setSubmissionText("");
      setFileName("");
    } else {
      setMessage({ type: "error", text: res.message || "Failed to submit assignment." });
    }
    setIsSubmitting(false);
  };

  return (
    <DashboardShell role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Coursework & Continuous Assessment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Assignments & Submissions Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit lab deliverables, view automated submission timestamps, and check faculty evaluation feedback.
            </p>
          </div>
        </div>

        {/* Status Toast */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2 animate-in fade-in ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Main Grid: Assignment List & Active Submission Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment Cards (1 col) */}
          <div className="space-y-3">
            {assignments.map((asg) => {
              const isSelected = asg.id === selectedAsgId;
              const sub = submissions.find((s) => s.assignment_id === asg.id);

              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAsgId(asg.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white border-slate-200 hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected ? "bg-slate-800 text-teal-300" : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {asg.weightage_pct}% Weight
                    </span>

                    {sub ? (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {sub.status}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Pending
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-xs line-clamp-1">{asg.title}</h3>
                  <div
                    className={`text-[10px] flex items-center justify-between pt-1 border-t ${
                      isSelected ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
                    }`}
                  >
                    <span>Max Marks: {asg.max_marks}</span>
                    <span>Due: {new Date(asg.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission and Evaluation Inspector (2 cols) */}
          <div className="lg:col-span-2">
            {selectedAsg ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Weight: {selectedAsg.weightage_pct}%
                    </span>
                    <span className="text-xs text-slate-500">Max Score: {selectedAsg.max_marks} pts</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">{selectedAsg.title}</h2>
                </div>

                {/* Instructions */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-800 uppercase text-[10px]">Instructions</div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {selectedAsg.instructions}
                  </p>
                </div>

                {/* Evaluated Marks Notice if already graded */}
                {existingSub?.status === "evaluated" && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        Faculty Evaluation Published
                      </div>
                      <div className="text-base font-black text-emerald-800 font-mono">
                        {existingSub.marks_obtained} / {selectedAsg.max_marks} pts
                      </div>
                    </div>
                    <div className="text-xs text-emerald-800 bg-white/80 p-3 rounded-lg border border-emerald-200">
                      <span className="font-semibold">Faculty Comment: </span>
                      {existingSub.faculty_feedback}
                    </div>
                  </div>
                )}

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="font-bold text-xs text-slate-900">
                    {existingSub ? "Upload Resubmission (Version Increment)" : "Submit Solution"}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Deliverable File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-teal-400 transition-colors bg-slate-50/50">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <input
                        type="file"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Allowed: {(selectedAsg.allowed_file_types || ["pdf", "zip"]).join(", ")} &bull; Max size: {selectedAsg.max_file_size_mb || 10}MB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Submission Notes / Summary</label>
                    <textarea
                      rows={3}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Explain your approach, testing methodology, and any prerequisites..."
                      className="w-full bg-slate-50 text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    className="w-full text-xs"
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                  >
                    {existingSub ? "Upload New Version" : "Submit Assignment"}
                  </Button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

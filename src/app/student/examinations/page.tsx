"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_EXAMINATIONS } from "@/lib/services/academic-services";
import { AcademicExamination, ExaminationQuestion } from "@/types";
import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  HelpCircle,
  FileCheck,
} from "lucide-react";

export default function StudentExaminationsPage() {
  const [exams, setExams] = useState<AcademicExamination[]>(DEMO_EXAMINATIONS);
  const [activeExam, setActiveExam] = useState<AcademicExamination | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedScore, setSubmittedScore] = useState<{ score: number; maxScore: number } | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const startExam = (exam: AcademicExamination) => {
    setActiveExam(exam);
    setUserAnswers({});
    setSubmittedScore(null);
    setIsTestRunning(true);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleFinishExam = () => {
    if (!activeExam?.questions) return;
    let earned = 0;
    let max = 0;

    activeExam.questions.forEach((q) => {
      const qMarks = q.marks || q.max_marks || 0;
      max += qMarks;
      if (q.correct_answer && userAnswers[q.id] === q.correct_answer) {
        earned += qMarks;
      }
    });

    setSubmittedScore({ score: earned, maxScore: max });
    setIsTestRunning(false);
  };

  return (
    <DashboardShell role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Assessment & Academic Evaluations</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Online Examination & Quiz Engine
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Scheduled midterms and quizzes with automated objective question grading and secure submission timestamps.
            </p>
          </div>
        </div>

        {/* Test Engine Modal/Area */}
        {isTestRunning && activeExam ? (
          <div className="bg-white p-6 rounded-3xl border border-teal-500 shadow-xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
                  {activeExam.exam_type} Examination &bull; Active Attempt
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">{activeExam.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Duration: {activeExam.duration_minutes} Mins</span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {activeExam.questions?.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">
                      Question {idx + 1} ({q.marks} Marks)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{q.question_type}</span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold">{q.question_text}</p>

                  {/* MCQ Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = userAnswers[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                              isSelected
                                ? "bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-2xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Short Answer Input */}
                  {q.question_type === "short_answer" && (
                    <textarea
                      rows={2}
                      value={userAnswers[q.id] || ""}
                      onChange={(e) => handleSelectOption(q.id, e.target.value)}
                      placeholder="Type your explanation here..."
                      className="w-full bg-white text-xs text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsTestRunning(false)}>
                Cancel Attempt
              </Button>
              <Button variant="primary" size="sm" onClick={handleFinishExam} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Submit Answers & Evaluate
              </Button>
            </div>
          </div>
        ) : null}

        {/* Evaluation Result Toast */}
        {submittedScore && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-sm flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Examination Submitted & Objective Questions Evaluated
              </div>
              <div className="text-xl font-black text-emerald-800 font-mono">
                {submittedScore.score} / {submittedScore.maxScore} pts (Objective Auto-Score)
              </div>
            </div>
            <p className="text-xs text-emerald-800">
              Your submission timestamp has been recorded. Descriptive questions are in faculty evaluation queue.
            </p>
          </div>
        )}

        {/* Scheduled Examinations List */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Scheduled Tests for Enrolled Courses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
                      {exam.exam_type}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Weightage: {exam.weightage_pct}%</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900">{exam.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{exam.instructions}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Duration: {exam.duration_minutes} Mins</span>
                    <span className="font-bold text-slate-900">Total: {exam.total_marks} Marks</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => startExam(exam)}
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                  >
                    Start Test Attempt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

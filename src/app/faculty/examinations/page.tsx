"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_EXAMINATIONS,
  createAcademicExamination,
} from "@/lib/services/academic-services";
import { AcademicExamination, ExaminationQuestion, UserProfile } from "@/types";
import {
  FileQuestion,
  PlusCircle,
  Calendar,
  Clock,
  CheckCircle2,
  ListOrdered,
  HelpCircle,
  Edit2,
  Trash2,
} from "lucide-react";

export default function FacultyExaminationsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [examinations, setExaminations] = useState<AcademicExamination[]>(DEMO_EXAMINATIONS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New exam form state
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState<"quiz" | "internal" | "midterm" | "final">("midterm");
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(50);
  const [weightage, setWeightage] = useState(25);
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState<Partial<ExaminationQuestion>[]>([
    {
      question_number: 1,
      question_type: "mcq",
      question_text: "Which page replacement algorithm suffers from Belady's anomaly?",
      options: [
        { id: "A", text: "FIFO (First In First Out)" },
        { id: "B", text: "LRU (Least Recently Used)" },
        { id: "C", text: "Optimal Page Replacement" },
        { id: "D", text: "Clock Algorithm" },
      ],
      correct_answer: "A",
      marks: 5,
    },
    {
      question_number: 2,
      question_type: "short_answer",
      question_text: "Differentiate between hard real-time systems and soft real-time systems.",
      marks: 10,
      rubric: "5 marks for definition/deadline criticality, 5 marks for illustrative industrial examples.",
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question_number: prev.length + 1,
        question_type: "mcq",
        question_text: "",
        options: [
          { id: "A", text: "" },
          { id: "B", text: "" },
          { id: "C", text: "" },
          { id: "D", text: "" },
        ],
        correct_answer: "A",
        marks: 5,
      },
    ]);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await createAcademicExamination({
      title,
      exam_type: examType,
      duration_minutes: duration,
      total_marks: totalMarks,
      weightage_pct: weightage,
      instructions,
      questions: questions as ExaminationQuestion[],
    });

    if (created.examination) {
      setExaminations((prev) => [created.examination!, ...prev]);
    }
    setIsCreateOpen(false);
    setTitle("");
    setNotification("Examination scheduled and questions compiled to testing engine.");
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <DashboardShell
      title="Examination & Online Testing Engine"
      subtitle="Schedule digital assessments, build question banks with auto-grading rules, and oversee student submissions"
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
          title="Scheduled Exams"
          value={examinations.length}
          icon={FileQuestion}
        />
        <StatsCard
          title="Active Test Windows"
          value={examinations.filter((e) => e.status === "active").length}
          icon={Clock}
        />
        <StatsCard
          title="Question Bank Items"
          value={examinations.reduce((sum, e) => sum + (e.questions?.length || 0), 0)}
          icon={ListOrdered}
        />
        <StatsCard
          title="Evaluation Auto-Scored"
          value="100%"
          icon={CheckCircle2}
          trend={{ value: "Objective Questions", isPositive: true }}
        />
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Examination Schedules</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Midterm examinations, internal assessments, and lab objective quizzes
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Schedule Examination
        </Button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {examinations.map((exam) => (
          <div
            key={exam.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold px-2 py-0.5 text-xs">
                  {exam.exam_type.toUpperCase()} • {exam.course?.course_code || "CS301"}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {exam.title}
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {exam.weightage_pct}% Weightage
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              {exam.instructions || "Standard university examination protocol in effect."}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="block text-[10px] text-slate-400">Duration</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {exam.duration_minutes} Mins
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Total Marks</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {exam.total_marks} Marks
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Questions</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {exam.questions?.length || 2} Items
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Exam Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-indigo-500" />
              Schedule New Examination & Configure Questions
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Set testing window, duration, and objective auto-grading criteria
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Examination Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Semester Written Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="internal">Internal Assessment</option>
                    <option value="midterm">Midterm</option>
                    <option value="final">Final Exam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
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
                    value={weightage}
                    onChange={(e) => setWeightage(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Examination Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Rules on negative marking, duration, tab switching restrictions..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Questions Builder Section */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Questions & Auto-Evaluation Keys ({questions.length})
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1 text-xs"
                  >
                    <PlusCircle className="h-3 w-3" /> Add Question
                  </Button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Q{idx + 1} ({q.question_type?.toUpperCase()}) - {q.marks} Marks
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Key: {q.correct_answer || "Rubric Specified"}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Question prompt..."
                        value={q.question_text}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].question_text = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Schedule & Publish Examination
              </Button>
            </div>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}

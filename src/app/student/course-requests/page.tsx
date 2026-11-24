"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  DEMO_COURSES,
  DEMO_COURSE_REQUESTS,
  cancelCourseRequest,
} from "@/lib/services/academic-services";
import { CourseEnrolmentRequest, AcademicCourse, UserProfile } from "@/types";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Filter,
  Trash2,
  HelpCircle,
  FileText,
  Calendar,
} from "lucide-react";

export default function StudentCourseRequestsPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.student); // Aarav Sharma
  const [requests, setRequests] = useState<CourseEnrolmentRequest[]>(DEMO_COURSE_REQUESTS);
  const [courses] = useState<AcademicCourse[]>(DEMO_COURSES);
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const myRequests = requests.filter((r) => r.applicant_id === user.id);

  const filteredRequests = myRequests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const handleCancel = async (requestId: string) => {
    const res = await cancelCourseRequest(requestId, user.id);
    if (res.success) {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "CANCELLED" } : r))
      );
      setNotification({
        type: "success",
        message: "Your course join application has been cancelled.",
      });
    } else {
      setNotification({
        type: "error",
        message: res.error || "Unable to cancel request.",
      });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case "WAITLISTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <AlertCircle className="w-3.5 h-3.5" /> Waitlisted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      case "CANCELLED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Cancelled
          </span>
        );
    }
  };

  return (
    <DashboardShell
      title="My Course Enrolment Applications"
      subtitle="Track approval progress, inspect faculty feedback, and manage your semester join requests."
      role="student"
      user={user}
    >
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/student/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Catalogue
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/student/my-courses">
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Enrolled Courses
              </Button>
            </Link>
            <Link href="/student/courses">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                Browse Catalogue
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={myRequests.length}
            icon={FileText}
          />
          <StatsCard
            title="Approved Courses"
            value={myRequests.filter((r) => r.status === "APPROVED").length}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Pending Review"
            value={myRequests.filter((r) => r.status === "PENDING").length}
            icon={Clock}
          />
          <StatsCard
            title="Waitlist Position"
            value={myRequests.filter((r) => r.status === "WAITLISTED").length}
            icon={AlertCircle}
          />
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white outline-none"
            >
              <option value="all">All Applications ({myRequests.length})</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved Only</option>
              <option value="WAITLISTED">Waitlisted Only</option>
              <option value="REJECTED">Declined Only</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">No applications match this filter</p>
              <p className="text-xs text-slate-500 mt-1">
                Browse our university course catalogue to discover and enrol in new modules.
              </p>
              <div className="mt-4">
                <Link href="/student/courses">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Explore Catalogue
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const course = courses.find((c) => c.id === req.course_id);
              const isCancellable = req.status === "PENDING" || req.status === "WAITLISTED";

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {course?.course_code || req.course_id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">
                        {course?.title || "Academic Course"}
                      </h3>
                      <div>{getStatusBadge(req.status)}</div>
                    </div>

                    <p className="text-xs text-slate-600 italic">
                      Application statement: &ldquo;{req.reason}&rdquo;
                    </p>

                    {/* Rejection Justification Alert */}
                    {req.status === "REJECTED" && req.rejection_reason && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                        <span className="font-semibold">Faculty Feedback:</span> {req.rejection_reason}
                      </div>
                    )}

                    {/* Waitlist Notice */}
                    {req.status === "WAITLISTED" && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800">
                        <span className="font-semibold">Capacity Alert:</span> Course section is at capacity. You will be automatically enrolled if a registered student drops.
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Submitted: {req.created_at.split("T")[0]}</span>
                      {req.reviewed_at && (
                        <span>
                          Reviewed: {req.reviewed_at.split("T")[0]} by Faculty Instructor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    {req.status === "APPROVED" && (
                      <Link href={`/student/courses/${req.course_id}`}>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
                          Open Course Workspace <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}

                    {isCancellable && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(req.id)}
                        className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Cancel Application
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { RequestTable } from "@/components/requests/RequestTable";
import { TrendsBarChart } from "@/components/dashboard/TrendsBarChart";
import { DepartmentPerformanceChart } from "@/components/dashboard/DepartmentPerformanceChart";
import {
  DEMO_REQUESTS,
  DEMO_PENDING_APPROVALS,
} from "@/lib/demo-data";
import {
  Shield,
  GraduationCap,
  Briefcase,
  Wrench,
  ClipboardList,
  Clock,
  PlayCircle,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const pendingApprovals = DEMO_PENDING_APPROVALS;

  return (
    <DashboardShell role="administrator">
      {/* Admin Executive Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-slate-900 to-purple-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            Campus Administration Executive HQ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Operations Command
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Centralized governance for university services, cross-departmental SLA compliance, staff dispatches, and user approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/approvals">
            <Button
              variant="teal"
              size="md"
              leftIcon={<UserCheck className="w-4 h-4" />}
            >
              Account Approvals ({pendingApprovals.length})
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Full Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: User Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Registered Campus Population
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value="4,820"
            subtitle="Enrolled active accounts"
            icon={GraduationCap}
            trend={{ value: 12, isPositive: true }}
            colorVariant="blue"
          />
          <StatsCard
            title="Total Faculty"
            value="340"
            subtitle="Verified professors & staff"
            icon={Briefcase}
            colorVariant="emerald"
          />
          <StatsCard
            title="Department Staff"
            value="85"
            subtitle="Active field technicians"
            icon={Wrench}
            colorVariant="amber"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals.length}
            subtitle="Awaiting manual review"
            icon={UserCheck}
            colorVariant="purple"
          />
        </div>
      </div>

      {/* Row 2: Service Request Operations Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Service Operations Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Requests"
            value="1,421"
            subtitle="Recorded tickets this term"
            icon={ClipboardList}
            trend={{ value: 8, isPositive: true }}
            colorVariant="default"
          />
          <StatsCard
            title="Pending Triage"
            value="14"
            subtitle="Unassigned to departments"
            icon={Clock}
            colorVariant="amber"
          />
          <StatsCard
            title="In Progress"
            value="23"
            subtitle="Work orders underway"
            icon={PlayCircle}
            colorVariant="teal"
          />
          <StatsCard
            title="Overdue SLA Tickets"
            value="9"
            subtitle="Escalated for priority action"
            icon={AlertTriangle}
            colorVariant="rose"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Request Trends */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Request Trends</h3>
              <p className="text-xs text-slate-500">Submitted vs Resolved vs Overdue SLA</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              +94% Completion
            </span>
          </div>
          <TrendsBarChart />
        </div>

        {/* Department Performance Scorecard */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Resolution Efficiency</h3>
              <p className="text-xs text-slate-500">SLA completion rate (%) across units</p>
            </div>
            <Link
              href="/admin/departments"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Manage Units &rarr;
            </Link>
          </div>
          <DepartmentPerformanceChart />
        </div>
      </div>

      {/* Pending Account Approvals Widget */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600" />
              Pending Account Approvals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and grant role-based platform access to new registrations.
            </p>
          </div>
          <Link href="/admin/approvals">
            <Button variant="outline" size="sm">
              Open Approvals Manager
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {pendingApprovals.map((app) => (
            <div
              key={app.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{app.full_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      app.role === "student"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {app.role === "student" ? "Student" : "Faculty"}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {app.email} &bull; ID: <span className="font-mono">{app.student_id || app.faculty_id}</span> &bull; {app.department_name}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50">
                  Reject
                </Button>
                <Button variant="primary" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700">
                  Approve Account
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus-Wide Recent Requests Table */}
      <RequestTable
        requests={DEMO_REQUESTS}
        title="Campus-Wide Service Operations Queue"
        showDepartment={true}
      />
    </DashboardShell>
  );
}

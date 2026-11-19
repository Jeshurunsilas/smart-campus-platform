"use client";

import React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { RequestTable } from "@/components/requests/RequestTable";
import {
  DEMO_USERS,
  DEMO_REQUESTS,
} from "@/lib/demo-data";
import {
  Briefcase,
  Beaker,
  Monitor,
  Zap,
  CheckCircle2,
  Clock,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function FacultyDashboardPage() {
  const facultyUser = DEMO_USERS.faculty;
  const facultyRequests = DEMO_REQUESTS.filter(
    (r) => r.user_id === "usr-faculty-01"
  );

  const totalCount = facultyRequests.length;
  const pendingCount = facultyRequests.filter(
    (r) => r.status === "Submitted" || r.status === "Under Review"
  ).length;
  const inProgressCount = facultyRequests.filter(
    (r) => r.status === "In Progress" || r.status === "Assigned" || r.status === "Accepted"
  ).length;
  const resolvedCount = facultyRequests.filter(
    (r) => r.status === "Resolved" || r.status === "Closed"
  ).length;

  const quickCategories = [
    {
      title: "Lab Apparatus Fault",
      desc: "Spectrophotometers, centrifuges, fume hoods",
      icon: Beaker,
      href: "/faculty/requests/new",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Classroom AV & Display",
      desc: "Projectors, audio systems, smart podiums",
      icon: Monitor,
      href: "/faculty/requests/new",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Power & Electrical Outage",
      desc: "Breakers, wall circuits, emergency UPS",
      icon: Zap,
      href: "/faculty/requests/new",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Campus Network & IT",
      desc: "High-speed lab ethernet, access points",
      icon: Briefcase,
      href: "/faculty/requests/new",
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
  ];

  return (
    <DashboardShell role="faculty">
      {/* Faculty Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Faculty Service Command
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {facultyUser.full_name}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Fast-track equipment repairs for laboratories, lecture theatres, and research facilities with priority SLA routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/faculty/requests/new">
            <Button
              variant="teal"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Report Issue
            </Button>
          </Link>
          <Link href="/faculty/requests">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              All Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Requests"
          value={totalCount}
          subtitle="All academic tickets"
          icon={Briefcase}
          colorVariant="emerald"
        />
        <StatsCard
          title="Under Review"
          value={pendingCount}
          subtitle="Awaiting dispatch"
          icon={Clock}
          colorVariant="amber"
        />
        <StatsCard
          title="Active Work Orders"
          value={inProgressCount}
          subtitle="Staff on-site"
          icon={Flame}
          colorVariant="blue"
        />
        <StatsCard
          title="Completed & Closed"
          value={resolvedCount}
          subtitle="Verified operational"
          icon={CheckCircle2}
          colorVariant="teal"
        />
      </div>

      {/* Quick Reporting Hub */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Specialized Faculty Issue Dispatch
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCategories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${item.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>Fast Report</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Requests Table */}
      <RequestTable
        requests={facultyRequests}
        title="Recent Faculty Service Tickets"
        showDepartment={true}
      />
    </DashboardShell>
  );
}

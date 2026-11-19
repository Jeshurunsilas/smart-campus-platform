"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { RequestTable } from "@/components/requests/RequestTable";
import { StatusOverviewChart } from "@/components/dashboard/StatusOverviewChart";
import {
  DEMO_USERS,
  DEMO_REQUESTS,
  DEMO_ANNOUNCEMENTS,
} from "@/lib/demo-data";
import { ServiceRequest, UserProfile, CampusAnnouncement } from "@/types";
import { getUserServiceRequests } from "@/lib/services/requests";
import { getCurrentUserProfile } from "@/lib/services/auth";
import { getCampusAnnouncements } from "@/lib/services/announcements";
import {
  ClipboardList,
  Clock,
  PlayCircle,
  CheckCircle2,
  PlusCircle,
  Megaphone,
  Sparkles,
  QrCode,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [user, setUser] = useState<UserProfile>(DEMO_USERS.student);
  const [requests, setRequests] = useState<ServiceRequest[]>(
    DEMO_REQUESTS.filter((r) => r.user_id === "usr-student-01")
  );
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(DEMO_ANNOUNCEMENTS);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(() => {
    Promise.all([
      getCurrentUserProfile(),
      getUserServiceRequests(),
      getCampusAnnouncements("student"),
    ]).then(([profileData, requestsData, announcementsData]) => {
      if (profileData) setUser(profileData);
      if (requestsData && requestsData.length > 0) {
        setRequests(requestsData);
      }
      if (announcementsData && announcementsData.length > 0) {
        setAnnouncements(announcementsData);
      }
    }).catch(() => {
      // Fallback
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getCurrentUserProfile(),
      getUserServiceRequests(),
      getCampusAnnouncements("student"),
    ]).then(([profileData, requestsData, announcementsData]) => {
      if (!isMounted) return;
      if (profileData) setUser(profileData);
      if (requestsData && requestsData.length > 0) {
        setRequests(requestsData);
      }
      if (announcementsData && announcementsData.length > 0) {
        setAnnouncements(announcementsData);
      }
    }).catch(() => {
      // Fallback
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSubmitted = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "Submitted" || r.status === "Under Review"
  ).length;
  const inProgressCount = requests.filter(
    (r) =>
      r.status === "In Progress" ||
      r.status === "Assigned" ||
      r.status === "Accepted"
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === "Resolved" || r.status === "Closed"
  ).length;

  return (
    <DashboardShell role="student">
      {/* Welcome & Quick Action Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-slate-900 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.full_name}!
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Report maintenance, IT issues, or facilities problems across classrooms, labs, and student halls in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/student/requests/new">
            <Button
              variant="teal"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              New Service Request
            </Button>
          </Link>
          <Link href="/student/requests">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              View My History
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Synchronizing campus database...</span>
        </div>
      ) : (
        <>
          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Submitted"
              value={totalSubmitted}
              subtitle="All lifetime requests"
              icon={ClipboardList}
              colorVariant="blue"
            />
            <StatsCard
              title="Pending Review"
              value={pendingCount}
              subtitle="Under evaluation"
              icon={Clock}
              colorVariant="amber"
            />
            <StatsCard
              title="In Progress"
              value={inProgressCount}
              subtitle="Assigned to field staff"
              icon={PlayCircle}
              colorVariant="teal"
            />
            <StatsCard
              title="Resolved & Closed"
              value={completedCount}
              subtitle="Work verified complete"
              icon={CheckCircle2}
              colorVariant="emerald"
            />
          </div>

          {/* Analytics & Announcements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Breakdown Chart */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Request Status Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">Live distribution of your tickets</p>
              </div>
              <StatusOverviewChart />
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Resolution Rate</span>
                <span className="font-bold text-emerald-600">
                  {totalSubmitted > 0
                    ? `${Math.round((completedCount / totalSubmitted) * 100)}% Resolved`
                    : "100% Up to date"}
                </span>
              </div>
            </div>

            {/* Campus Announcements */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Campus Announcements</h3>
                </div>
                <Link
                  href="/student/announcements"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="divide-y divide-slate-100 my-2">
                {announcements.slice(0, 2).map((anc) => (
                  <div key={anc.id} className="py-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        {anc.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(anc.created_at)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{anc.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {anc.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <QrCode className="w-3.5 h-3.5" />
                  Classroom QR reporting active campus-wide
                </span>
              </div>
            </div>
          </div>

          {/* Recent Requests Activity Table */}
          <RequestTable
            requests={requests}
            title="Recent Service Request Activity"
            showDepartment={true}
            onRequestCancelled={() => {
              loadDashboardData();
            }}
          />
        </>
      )}
    </DashboardShell>
  );
}

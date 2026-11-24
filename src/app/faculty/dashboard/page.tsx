"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { RequestTable } from "@/components/requests/RequestTable";
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
  Loader2,
  Megaphone,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FacultyDashboardPage() {
  const [user, setUser] = useState<UserProfile>(DEMO_USERS.faculty);
  const [requests, setRequests] = useState<ServiceRequest[]>(
    DEMO_REQUESTS.filter((r) => r.user_id === "usr-faculty-01")
  );
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(DEMO_ANNOUNCEMENTS);
  const [isLoading, setIsLoading] = useState(true);

  const loadFacultyData = useCallback(() => {
    Promise.all([
      getCurrentUserProfile(),
      getUserServiceRequests(),
      getCampusAnnouncements("faculty"),
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
      getCampusAnnouncements("faculty"),
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

  const totalCount = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "Submitted" || r.status === "Under Review"
  ).length;
  const inProgressCount = requests.filter(
    (r) =>
      r.status === "In Progress" ||
      r.status === "Assigned" ||
      r.status === "Accepted"
  ).length;
  const resolvedCount = requests.filter(
    (r) => r.status === "Resolved" || r.status === "Closed"
  ).length;

  const quickCategories = [
    {
      title: "Classroom AV & Display",
      desc: "Projectors, audio systems, smart podiums, digital boards",
      icon: Monitor,
      deptId: "dept-it",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Lab Apparatus Fault",
      desc: "Spectrophotometers, centrifuges, fume hoods, sensors",
      icon: Beaker,
      deptId: "dept-lab",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Campus Network & IT",
      desc: "High-speed lab ethernet, access points, server racks",
      icon: Briefcase,
      deptId: "dept-it",
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      title: "Power & Electrical Lines",
      desc: "Breakers, high-load circuits, emergency backup UPS",
      icon: Zap,
      deptId: "dept-electrical",
      color: "text-purple-600 bg-purple-50 border-purple-200",
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
            Welcome, {user.full_name}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Fast-track equipment repairs for laboratories, lecture theatres, and research facilities with priority SLA routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/faculty/courses/create">
            <Button
              variant="primary"
              size="md"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-semibold"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Create Course
            </Button>
          </Link>
          <Link href="/faculty/courses">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              My Courses
            </Button>
          </Link>
          <Link href="/faculty/course-requests">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Course Requests
            </Button>
          </Link>
          <Link href="/faculty/requests/new">
            <Button
              variant="teal"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Synchronizing faculty portal data...</span>
        </div>
      ) : (
        <>
          {/* Quick Problem Reporting Shortcuts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Priority Academic Problem Categories
                </h3>
                <p className="text-xs text-slate-500">
                  Click to pre-fill service request parameters for academic spaces.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickCategories.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    href={`/faculty/requests/new?dept=${item.deptId}`}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${item.color}`}
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

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                      <span>Log Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="My Department Tickets"
              value={totalCount}
              subtitle="All academic service calls"
              icon={Briefcase}
              colorVariant="blue"
            />
            <StatsCard
              title="Pending Review"
              value={pendingCount}
              subtitle="Queued for dispatch"
              icon={Clock}
              colorVariant="amber"
            />
            <StatsCard
              title="Active Work Orders"
              value={inProgressCount}
              subtitle="Technician on site"
              icon={Flame}
              colorVariant="teal"
            />
            <StatsCard
              title="Resolved Tickets"
              value={resolvedCount}
              subtitle="Fully tested & closed"
              icon={CheckCircle2}
              colorVariant="emerald"
            />
          </div>

          {/* Recent Campus Announcements */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Faculty Notices & Announcements</h3>
              </div>
              <Link
                href="/faculty/announcements"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.slice(0, 2).map((anc) => (
                <div
                  key={anc.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
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
          </div>

          {/* Recent Requests Table */}
          <RequestTable
            requests={requests}
            title="Recent Academic Space Requests"
            showDepartment={true}
            onRequestCancelled={() => {
              loadFacultyData();
            }}
          />
        </>
      )}
    </DashboardShell>
  );
}

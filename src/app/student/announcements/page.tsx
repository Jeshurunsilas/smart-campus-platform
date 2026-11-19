"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_ANNOUNCEMENTS } from "@/lib/demo-data";
import { CampusAnnouncement } from "@/types";
import { getCampusAnnouncements } from "@/lib/services/announcements";
import { formatDate } from "@/lib/utils";
import { Calendar, Search, Megaphone, Loader2 } from "lucide-react";

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(DEMO_ANNOUNCEMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCampusAnnouncements("student")
      .then((data) => {
        if (data && data.length > 0) setAnnouncements(data);
      })
      .catch(() => {
        // Fallback to demo
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filtered = announcements.filter((anc) => {
    const matchesCat = filterCategory === "all" || anc.category === filterCategory;
    const matchesSearch =
      anc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anc.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <DashboardShell role="student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Megaphone className="w-3.5 h-3.5 text-teal-600" />
            Official Broadcast Channel
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Announcements
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Important notices regarding facility maintenance schedules, power upgrades, and safety advisories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Maintenance">Maintenance</option>
            <option value="General">General</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Fetching announcements...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Announcements Found</h3>
          <p className="text-xs text-slate-500">Try modifying your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((anc) => (
            <div
              key={anc.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {anc.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(anc.created_at)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {anc.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {anc.content}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-500">
                  Published by University Administration
                </span>
                <span className="capitalize font-semibold text-slate-600">
                  Priority: {anc.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

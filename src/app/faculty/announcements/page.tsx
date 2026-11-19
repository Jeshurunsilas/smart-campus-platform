"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_ANNOUNCEMENTS } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default function FacultyAnnouncementsPage() {
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = DEMO_ANNOUNCEMENTS.filter((anc) => {
    return filterCategory === "all" || anc.category === filterCategory;
  });

  return (
    <DashboardShell role="faculty">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic &amp; Operations Announcements
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Advisories on campus utility maintenance, lab safety audits, and building upgrades.
          </p>
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="Maintenance">Maintenance</option>
          <option value="General">General</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((anc) => (
          <div
            key={anc.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {anc.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Target: Faculty &amp; Academic Staff</span>
              <span className="capitalize font-semibold text-slate-600">
                Priority: {anc.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

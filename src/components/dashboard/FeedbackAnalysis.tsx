"use client";

import React from "react";
import { Star, MessageSquare, CheckCircle2, HeartHandshake } from "lucide-react";

export function FeedbackAnalysis() {
  const ratingDistribution = [
    { stars: 5, count: 48, percentage: 75 },
    { stars: 4, count: 12, percentage: 19 },
    { stars: 3, count: 3, percentage: 4 },
    { stars: 2, count: 1, percentage: 1.5 },
    { stars: 1, count: 0, percentage: 0.5 },
  ];

  const sentimentPillars = [
    { label: "Technician Punctuality & Response Time", score: "96%", positive: true },
    { label: "Worksite Cleanliness After Completion", score: "94%", positive: true },
    { label: "Clear Status Notifications & Updates", score: "91%", positive: true },
    { label: "First-Time Resolution Effectiveness", score: "88%", positive: true },
  ];

  const recentReviews = [
    {
      author: "Dr. Evelyn Reed (Faculty, Computer Science)",
      rating: 5,
      date: "2 days ago",
      comment:
        "The server room HVAC temperature spike was addressed within 45 minutes of submitting the Critical request. Technician logged clear diagnostic notes and verified cooling stability.",
      department: "Facilities & Mechanical",
    },
    {
      author: "Alex Rivera (Student, Bio-Engineering)",
      rating: 5,
      date: "3 days ago",
      comment:
        "Lab 304 chemical exhaust hood damper was repaired rapidly. Appreciated the photo confirmation and real-time status notifications sent straight to my student dashboard.",
      department: "Lab Safety Operations",
    },
    {
      author: "Marcus Vance (Student Union Coordinator)",
      rating: 4,
      date: "5 days ago",
      comment:
        "Lighting fixture in study lounge replaced promptly. Courteous staff and cleaned up packaging materials thoroughly before leaving.",
      department: "Electrical Maintenance",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              CSAT Score Distribution
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              4.72 Overall Average
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <div className="w-12 flex items-center gap-1 font-semibold text-slate-700">
                  <span>{item.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right font-mono text-slate-500">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Total Verified User Reviews:</span>
              <strong className="text-slate-800 font-mono">64 Verified</strong>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between mt-1">
              <span>Net Promoter Score (NPS):</span>
              <strong className="text-emerald-700 font-mono">+74 (World Class)</strong>
            </div>
          </div>
        </div>

        {/* Sentiment Pillars */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              Service Quality Sentiment Drivers
            </h4>
            <span className="text-xs text-slate-400">Past 90 Days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {sentimentPillars.map((pillar) => (
              <div
                key={pillar.label}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1"
              >
                <div className="text-xs text-slate-600 font-medium">{pillar.label}</div>
                <div className="text-xl font-extrabold text-teal-800 flex items-center gap-1.5">
                  {pillar.score}
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Positive user feedback
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Qualitative Reviews */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <MessageSquare className="w-4 h-4 text-teal-600" />
          Recent Verified Recipient Reviews &amp; Testimonials
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReviews.map((rev, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                <div className="font-bold text-slate-900">{rev.author}</div>
                <div className="text-slate-400">{rev.department}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

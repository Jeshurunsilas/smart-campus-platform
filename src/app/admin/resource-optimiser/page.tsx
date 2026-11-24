"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_RESOURCE_RECOMMENDATIONS, DEMO_CAMPUS_ROOMS } from "@/lib/services/campus-operations";
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function ResourceOptimiserPage() {
  const [recommendations, setRecommendations] = useState(DEMO_RESOURCE_RECOMMENDATIONS);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleApply = (id: string) => {
    setAppliedId(id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_applied: true, applied_at: new Date().toISOString() } : r))
    );
  };

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Campus Facility Allocation Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Resource & Classroom Optimization Engine
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated facility capacity balancing, predictive reallocation for maintenance outages, and scheduling recommendations.
            </p>
          </div>
        </div>

        {/* AI Recommendations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Active System Recommendations
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Evaluated against real-time occupancy and asset faults
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        {rec.resource_type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        Optimization Score: {rec.score}/100
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{rec.title}</h3>
                  </div>

                  {rec.is_applied ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Applied & Dispatched
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApply(rec.id)}
                      className="text-xs"
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Authorize Recommendation
                    </Button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rec.impact_description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Room Capacity & Occupancy Availability Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Live Facility Capacity & Utilization Grid
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_CAMPUS_ROOMS.map((rm) => {
              const utilPct = Math.round((rm.current_occupancy / rm.capacity) * 100);
              return (
                <div key={rm.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{rm.room_name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{rm.room_number}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Occupancy:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {rm.current_occupancy} / {rm.capacity} ({utilPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        utilPct > 80 ? "bg-rose-500" : utilPct > 50 ? "bg-amber-500" : "bg-teal-500"
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

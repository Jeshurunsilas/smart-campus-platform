"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_CAMPUS_INCIDENTS } from "@/lib/services/campus-operations";
import {
  Flame,
  AlertTriangle,
  ShieldAlert,
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(DEMO_CAMPUS_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || "");
  const [isExitBlocked, setIsExitBlocked] = useState(false);
  const [isDrillActive, setIsDrillActive] = useState(false);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  const handleAcknowledge = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "investigating" } : inc))
    );
  };

  const handleResolve = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? { ...inc, status: "resolved", resolved_at: new Date().toISOString() }
          : inc
      )
    );
  };

  const toggleDrill = () => {
    setIsDrillActive(!isDrillActive);
  };

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Campus Safety & Incident Management</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Incidents, Response Tracking & Drill Simulation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time incident response coordination, dynamic evacuation routing, and automated emergency safety drill testing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant={isDrillActive ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleDrill}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              {isDrillActive ? "Stop Emergency Drill" : "Simulate Campus Drill"}
            </Button>
          </div>
        </div>

        {/* Drill Active Banner */}
        {isDrillActive && (
          <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-lg flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-white shrink-0" />
              <div>
                <div className="font-extrabold text-sm">
                  [SIMULATION ACTIVE] Campus-Wide Fire Evacuation Drill In Progress
                </div>
                <div className="text-xs text-rose-100">
                  Broadcast alert simulated across all digital signage, mobile app notifications, and exit pathways. Human safety systems remain manual.
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white text-rose-700 px-3 py-1 rounded-xl">
              DRILL: ACTIVE
            </span>
          </div>
        )}

        {/* Main Grid: Incident List & Dynamic Evacuation Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
                Registered Incidents ({incidents.length})
              </h2>
            </div>

            <div className="space-y-3">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncidentId;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold">{inc.incident_number}</span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          inc.severity === "critical"
                            ? "bg-rose-500 text-white"
                            : inc.severity === "high"
                            ? "bg-amber-500 text-white"
                            : "bg-teal-500 text-white"
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>

                    <div className="font-bold text-xs line-clamp-1">{inc.title}</div>
                    <div
                      className={`text-[10px] flex items-center justify-between pt-1 border-t ${
                        isSelected ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
                      }`}
                    >
                      <span className="capitalize">Status: {inc.status}</span>
                      <span>{new Date(inc.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Details & Evacuation Route Simulator (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {selectedIncident ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 uppercase">
                      Category: {selectedIncident.category.replace("_", " ")}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
                      {selectedIncident.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">{selectedIncident.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedIncident.status !== "resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(selectedIncident.id)}
                        className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>

                {/* Evacuation Route Visualizer Simulator */}
                <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                      <Compass className="w-4 h-4 text-teal-400" />
                      <span>Dynamic Evacuation Route Visualizer</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsExitBlocked(!isExitBlocked)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                        isExitBlocked
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      {isExitBlocked ? "Exit Blocked (Alternative Rerouted)" : "Simulate Primary Exit Blockage"}
                    </button>
                  </div>

                  {/* Route Corridor Flowchart */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Location</div>
                      <div className="font-bold text-white">Zone Origin</div>
                      <div className="text-[11px] text-slate-400">Server Room 103</div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border transition-all space-y-1 ${
                        isExitBlocked
                          ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                          : "bg-teal-950/40 border-teal-500/50 text-teal-200"
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider">
                        {isExitBlocked ? "FAILOVER ROUTE" : "PRIMARY EXIT"}
                      </div>
                      <div className="font-extrabold text-sm">
                        {isExitBlocked
                          ? "Main Lobby East Ramp"
                          : selectedIncident.evacuation_route_json?.primary_exit || "Stairwell B Plaza"}
                      </div>
                      <div className="text-[10px] opacity-80 font-mono">
                        {isExitBlocked ? "Clear Corridor &bull; Automated signage active" : "Nominal emergency egress"}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider">ASSEMBLY POINT</div>
                      <div className="font-extrabold text-sm">
                        {selectedIncident.evacuation_route_json?.assembly_point || "Campus Quad Zone A"}
                      </div>
                      <div className="text-[10px] text-emerald-300 font-mono">Capacity: 800 people</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>
                      Notice: Digital Twin dynamic routing demonstrates failover logic. Real building emergency systems remain under authorized human safety protocols.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                Select an incident to view details and evacuation routing.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import React, { useState } from "react";
import {
  MapPin,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Building2,
  ChevronRight,
  Filter,
} from "lucide-react";

export interface CampusZoneIncidentData {
  id: string;
  name: string;
  code: string;
  totalIncidents: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  primaryCategory: string;
  status: "critical" | "warning" | "moderate" | "normal";
  coordinates: { x: number; y: number; width: number; height: number };
}

const DEFAULT_CAMPUS_ZONES: CampusZoneIncidentData[] = [
  {
    id: "zone-science",
    name: "Science & Chemistry Complex",
    code: "SCI",
    totalIncidents: 12,
    criticalCount: 2,
    highCount: 4,
    mediumCount: 5,
    lowCount: 1,
    primaryCategory: "Chemical Fume Hoods & Plumbing",
    status: "critical",
    coordinates: { x: 15, y: 15, width: 26, height: 32 },
  },
  {
    id: "zone-engineering",
    name: "Engineering & Robotics Hall",
    code: "ENG",
    totalIncidents: 8,
    criticalCount: 1,
    highCount: 3,
    mediumCount: 3,
    lowCount: 1,
    primaryCategory: "Power Substation & HVAC",
    status: "warning",
    coordinates: { x: 45, y: 15, width: 24, height: 32 },
  },
  {
    id: "zone-tech",
    name: "Technology & Computing Center",
    code: "TECH",
    totalIncidents: 5,
    criticalCount: 0,
    highCount: 2,
    mediumCount: 2,
    lowCount: 1,
    primaryCategory: "Server Cooling & Networking",
    status: "moderate",
    coordinates: { x: 73, y: 15, width: 22, height: 32 },
  },
  {
    id: "zone-library",
    name: "Central University Library",
    code: "LIB",
    totalIncidents: 4,
    criticalCount: 0,
    highCount: 1,
    mediumCount: 2,
    lowCount: 1,
    primaryCategory: "Study Pavilion Lighting & Outlets",
    status: "moderate",
    coordinates: { x: 15, y: 55, width: 26, height: 34 },
  },
  {
    id: "zone-student-union",
    name: "Student Union & Dining Hall",
    code: "UNION",
    totalIncidents: 6,
    criticalCount: 0,
    highCount: 2,
    mediumCount: 3,
    lowCount: 1,
    primaryCategory: "Refrigeration & Hot Water",
    status: "warning",
    coordinates: { x: 45, y: 55, width: 24, height: 34 },
  },
  {
    id: "zone-residence",
    name: "North Quad Student Housing",
    code: "QUAD",
    totalIncidents: 3,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 2,
    lowCount: 1,
    primaryCategory: "Door Locks & Window Latches",
    status: "normal",
    coordinates: { x: 73, y: 55, width: 22, height: 34 },
  },
];

export function CampusHeatmap() {
  const [zones] = useState<CampusZoneIncidentData[]>(DEFAULT_CAMPUS_ZONES);
  const [selectedZone, setSelectedZone] = useState<CampusZoneIncidentData>(DEFAULT_CAMPUS_ZONES[0]!);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning">("all");

  const totalIncidents = zones.reduce((acc, z) => acc + z.totalIncidents, 0);
  const criticalHotspots = zones.filter((z) => z.status === "critical").length;

  const filteredZones = zones.filter((z) => {
    if (filterSeverity === "critical") return z.status === "critical";
    if (filterSeverity === "warning") return z.status === "warning" || z.status === "critical";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Telemetry Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Campus Incidents
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalIncidents}</div>
          <span className="text-[11px] text-slate-500">Across 6 primary facilities</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Critical Hotspots
          </span>
          <div className="text-2xl font-extrabold text-rose-600 mt-0.5 flex items-center gap-1.5">
            {criticalHotspots}
            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
          <span className="text-[11px] text-rose-600 font-semibold">Immediate technician dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Highest Volume Zone
          </span>
          <div className="text-sm font-extrabold text-slate-900 mt-1 truncate">Science Complex</div>
          <span className="text-[11px] text-amber-700 font-semibold">12 reported issues</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Facility Health Index
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">88.4%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Normal operational baseline</span>
        </div>
      </div>

      {/* Main Heatmap Visualization & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap 2D Architectural Grid */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                Live Campus Incident Density Heatmap
              </h3>
              <p className="text-xs text-slate-500">
                Color density reflects cumulative ticket frequency and safety severity weighting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as "all" | "critical" | "warning")}
                className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">All Zones</option>
                <option value="warning">Elevated &amp; Hotspots</option>
                <option value="critical">Critical Hotspots Only</option>
              </select>
            </div>
          </div>

          {/* Interactive Campus Map Canvas Container */}
          <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4 select-none">
            {/* Grid Backdrop Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

            {/* Walking Path Connectors */}
            <div className="absolute top-[48%] left-[10%] right-[10%] h-0.5 border-t border-dashed border-slate-700/60 pointer-events-none" />
            <div className="absolute left-[40%] top-[10%] bottom-[10%] w-0.5 border-l border-dashed border-slate-700/60 pointer-events-none" />
            <div className="absolute left-[68%] top-[10%] bottom-[10%] w-0.5 border-l border-dashed border-slate-700/60 pointer-events-none" />

            {/* Render Interactive Building Nodes */}
            {filteredZones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              let bgClass = "bg-emerald-950/80 border-emerald-500/50 text-emerald-300";
              let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

              if (zone.status === "critical") {
                bgClass = isSelected
                  ? "bg-rose-950 border-rose-500 ring-2 ring-rose-400 text-rose-200"
                  : "bg-rose-950/80 border-rose-600/70 text-rose-200";
                badgeColor = "bg-rose-500/30 text-rose-300 border-rose-500/50";
              } else if (zone.status === "warning") {
                bgClass = isSelected
                  ? "bg-amber-950 border-amber-500 ring-2 ring-amber-400 text-amber-200"
                  : "bg-amber-950/80 border-amber-600/70 text-amber-200";
                badgeColor = "bg-amber-500/30 text-amber-300 border-amber-500/50";
              } else if (zone.status === "moderate") {
                bgClass = isSelected
                  ? "bg-teal-950 border-teal-500 ring-2 ring-teal-400 text-teal-200"
                  : "bg-teal-950/80 border-teal-600/70 text-teal-200";
                badgeColor = "bg-teal-500/30 text-teal-300 border-teal-500/50";
              }

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    position: "absolute",
                    left: `${zone.coordinates.x}%`,
                    top: `${zone.coordinates.y}%`,
                    width: `${zone.coordinates.width}%`,
                    height: `${zone.coordinates.height}%`,
                  }}
                  className={`rounded-2xl border p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-md ${bgClass} hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono font-extrabold text-[11px] uppercase tracking-wider">
                      {zone.code}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}
                    >
                      {zone.totalIncidents} tickets
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold truncate leading-tight">{zone.name}</div>
                    <div className="text-[10px] opacity-75 truncate mt-0.5">
                      {zone.primaryCategory}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Incident Severity Density:</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Critical Hotspot (&gt;10 or Safety Issue)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Elevated (6-10 Tickets)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Moderate (4-5 Tickets)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Nominal (&lt;4 Tickets)
              </span>
            </div>
          </div>
        </div>

        {/* Selected Zone Inspector Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900">Facility Diagnostics</h4>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                  selectedZone.status === "critical"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : selectedZone.status === "warning"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-teal-50 text-teal-700 border-teal-200"
                }`}
              >
                {selectedZone.status}
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-extrabold text-slate-900">{selectedZone.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Dominant Incident Type:{" "}
                <span className="font-semibold text-slate-700">{selectedZone.primaryCategory}</span>
              </p>
            </div>

            {/* Severity Breakdown Bar */}
            <div className="mt-5 space-y-2.5">
              <span className="text-xs font-bold text-slate-700">Ticket Severity Distribution:</span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Critical Safety Issues:
                  </span>
                  <span className="font-mono font-bold">{selectedZone.criticalCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold">High Priority Work:</span>
                  <span className="font-mono font-bold">{selectedZone.highCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Standard / Moderate:</span>
                  <span className="font-mono font-bold">{selectedZone.mediumCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Minor / Cosmetic:</span>
                  <span className="font-mono font-bold">{selectedZone.lowCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Diagnostic Insights */}
            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Root Cause Intelligence
              </div>
              <p className="leading-relaxed">
                Repetitive alerts detected in electrical &amp; ventilation subsystems. Scheduled preventive maintenance recommended to stabilize zone health.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Building Code: <strong className="font-mono text-slate-800">{selectedZone.code}</strong></span>
            <div className="flex items-center gap-1 font-semibold text-teal-700 cursor-pointer hover:underline">
              <span>View tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

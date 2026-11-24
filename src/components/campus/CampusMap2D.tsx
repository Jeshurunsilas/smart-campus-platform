"use client";

import React, { useState } from "react";
import { CampusBuilding, CampusRoom, CampusIncident } from "@/types";
import {
  Building2,
  AlertTriangle,
  Zap,
  Droplet,
  Users,
  Search,
  Eye,
  Layers,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface CampusMap2DProps {
  buildings: CampusBuilding[];
  rooms: CampusRoom[];
  incidents: CampusIncident[];
  selectedBuildingId: string | null;
  onSelectBuilding: (building: CampusBuilding | null) => void;
  showHeatmap: boolean;
  showAnomalies: boolean;
}

export function CampusMap2D({
  buildings,
  rooms,
  incidents,
  selectedBuildingId,
  onSelectBuilding,
  showHeatmap,
  showAnomalies,
}: CampusMap2DProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full h-[520px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner select-none flex flex-col">
      {/* Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search buildings or facilities..."
            className="w-full bg-slate-800/90 backdrop-blur-md text-xs text-white pl-8 pr-3 py-1.5 rounded-xl border border-slate-700/80 focus:outline-hidden focus:border-teal-500 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 text-[11px] text-slate-300">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Interactive 2D Campus Grid</span>
          <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold">
            {buildings.length} Blocks
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 w-full h-full relative overflow-auto">
        <svg
          viewBox="0 0 850 820"
          className="w-full h-full min-w-[700px] min-h-[500px]"
          style={{ background: "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)" }}
        >
          {/* Campus Roads and Paths */}
          <g stroke="#334155" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Main Ring Road */}
            <path d="M 120 720 L 120 180 Q 120 120 200 120 L 680 120 Q 740 120 740 180 L 740 720 Q 740 760 680 760 L 200 760 Q 120 760 120 720 Z" />
            {/* Central Avenue */}
            <line x1="120" y1="420" x2="740" y2="420" stroke="#475569" strokeWidth="14" />
            {/* North-South Spine */}
            <line x1="420" y1="120" x2="420" y2="760" stroke="#475569" strokeWidth="14" />
          </g>

          {/* Road Markings */}
          <g stroke="#64748b" strokeWidth="2" strokeDasharray="6,6" fill="none">
            <path d="M 120 720 L 120 180 Q 120 120 200 120 L 680 120 Q 740 120 740 180 L 740 720 Q 740 760 680 760 L 200 760 Q 120 760 120 720 Z" />
            <line x1="120" y1="420" x2="740" y2="420" />
            <line x1="420" y1="120" x2="420" y2="760" />
          </g>

          {/* Central Lawn & Courtyard Plaza */}
          <ellipse cx="420" cy="420" rx="90" ry="70" fill="#065f46" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="420" y="424" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold" opacity="0.8">
            Central University Quad Plaza
          </text>

          {/* Render Buildings */}
          {filteredBuildings.map((bld) => {
            const isSelected = selectedBuildingId === bld.id;
            const bldIncidents = incidents.filter((i) => i.building_id === bld.id && i.status !== "resolved");
            const hasIncident = bldIncidents.length > 0;
            const bldRooms = rooms.filter((r) => r.building_id === bld.id);
            const totalCapacity = bldRooms.reduce((acc, r) => acc + r.capacity, 0) || 100;
            const totalOccupancy = bldRooms.reduce((acc, r) => acc + r.current_occupancy, 0);
            const occPct = Math.round((totalOccupancy / totalCapacity) * 100);

            // Heatmap color
            let heatColor = "#14b8a6";
            if (occPct > 80) heatColor = "#ef4444";
            else if (occPct > 60) heatColor = "#f59e0b";

            return (
              <g
                key={bld.id}
                onClick={() => onSelectBuilding(isSelected ? null : bld)}
                className="cursor-pointer group transition-transform duration-200"
              >
                {/* Building Footprint Rectangle */}
                <rect
                  x={bld.coordinates_x - 65}
                  y={bld.coordinates_y - 45}
                  width="130"
                  height="90"
                  rx="12"
                  fill={isSelected ? "#0f766e" : "#1e293b"}
                  stroke={isSelected ? "#2dd4bf" : hasIncident ? "#f43f5e" : "#475569"}
                  strokeWidth={isSelected ? "3" : hasIncident ? "2.5" : "1.5"}
                  className="filter drop-shadow-md group-hover:fill-slate-800 transition-colors"
                />

                {/* Simulated Occupancy Heatmap overlay */}
                {showHeatmap && (
                  <rect
                    x={bld.coordinates_x - 65}
                    y={bld.coordinates_y - 45}
                    width="130"
                    height="90"
                    rx="12"
                    fill={heatColor}
                    fillOpacity="0.22"
                    stroke={heatColor}
                    strokeWidth="1.5"
                  />
                )}

                {/* Building Header / Code */}
                <rect
                  x={bld.coordinates_x - 60}
                  y={bld.coordinates_y - 38}
                  width="120"
                  height="22"
                  rx="6"
                  fill="#0f172a"
                  fillOpacity="0.75"
                />
                <text
                  x={bld.coordinates_x}
                  y={bld.coordinates_y - 23}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  className="tracking-tight"
                >
                  {bld.code}
                </text>

                {/* Floors Count / Area */}
                <text
                  x={bld.coordinates_x}
                  y={bld.coordinates_y - 3}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                >
                  {bld.floors_count} Floors &bull; {bld.total_area_sqft / 1000}k sq.ft
                </text>

                {/* Occupancy Badge */}
                <rect
                  x={bld.coordinates_x - 45}
                  y={bld.coordinates_y + 12}
                  width="90"
                  height="18"
                  rx="9"
                  fill="#020617"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={bld.coordinates_x}
                  y={bld.coordinates_y + 24}
                  textAnchor="middle"
                  fill={showHeatmap ? heatColor : "#38bdf8"}
                  fontSize="8.5"
                  fontWeight="bold"
                >
                  {occPct}% Occupied
                </text>

                {/* Active Incident Warning Marker */}
                {hasIncident && (
                  <g transform={`translate(${bld.coordinates_x + 48}, ${bld.coordinates_y - 40})`}>
                    <circle cx="0" cy="0" r="10" fill="#f43f5e" />
                    <text x="0" y="3.5" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                      !
                    </text>
                  </g>
                )}

                {/* Energy & Water Anomaly Badges */}
                {showAnomalies && (
                  <g transform={`translate(${bld.coordinates_x - 52}, ${bld.coordinates_y - 38})`}>
                    <circle cx="0" cy="0" r="7" fill="#eab308" />
                    <text x="0" y="3" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">
                      ⚡
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Footer Legend */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Moderate Load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            Active Incident / High Crowd
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Click any building to inspect floor plans & assets
        </div>
      </div>
    </div>
  );
}

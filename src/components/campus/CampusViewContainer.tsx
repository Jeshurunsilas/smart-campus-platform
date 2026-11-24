"use client";

import React, { useState } from "react";
import { CampusBuilding, CampusRoom, CampusIncident, CampusAsset } from "@/types";
import { CampusMap2D } from "./CampusMap2D";
import { CampusDigitalTwin3D } from "./CampusDigitalTwin3D";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  Box,
  Map,
  X,
  Building2,
  Users,
  Zap,
  Droplet,
  AlertTriangle,
  PlusCircle,
  Wrench,
  CheckCircle2,
} from "lucide-react";

interface CampusViewContainerProps {
  buildings: CampusBuilding[];
  rooms: CampusRoom[];
  incidents: CampusIncident[];
  assets: CampusAsset[];
}

export function CampusViewContainer({
  buildings,
  rooms,
  incidents,
  assets,
}: CampusViewContainerProps) {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showAnomalies, setShowAnomalies] = useState(true);

  const selectedBldRooms = selectedBuilding
    ? rooms.filter((r) => r.building_id === selectedBuilding.id)
    : [];

  const selectedBldAssets = selectedBuilding
    ? assets.filter((a) => a.building_id === selectedBuilding.id)
    : [];

  const selectedBldIncidents = selectedBuilding
    ? incidents.filter((i) => i.building_id === selectedBuilding.id && i.status !== "resolved")
    : [];

  return (
    <div className="space-y-4">
      {/* Top Visualizer Header & Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            Interactive Campus Spatial Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single shared spatial model across 2D Vector Blueprint and 3D WebGL Digital Twin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Overlay Toggles */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showHeatmap
                ? "bg-teal-50 border-teal-500 text-teal-800 shadow-2xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Occupancy Heatmap
          </button>

          <button
            type="button"
            onClick={() => setShowAnomalies(!showAnomalies)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showAnomalies
                ? "bg-amber-50 border-amber-500 text-amber-800 shadow-2xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            Telemetry Alerts
          </button>

          {/* 2D / 3D Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("2D")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "2D"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Map className="w-3.5 h-3.5 text-teal-600" />
              2D Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3D")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "3D"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Box className="w-3.5 h-3.5 text-teal-600" />
              3D Digital Twin
            </button>
          </div>
        </div>
      </div>

      {/* Main View Port & Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visualizer Area (2 cols on desktop) */}
        <div className={selectedBuilding ? "lg:col-span-2" : "lg:col-span-3"}>
          {viewMode === "2D" ? (
            <CampusMap2D
              buildings={buildings}
              rooms={rooms}
              incidents={incidents}
              selectedBuildingId={selectedBuilding?.id || null}
              onSelectBuilding={(b) => setSelectedBuilding(b)}
              showHeatmap={showHeatmap}
              showAnomalies={showAnomalies}
            />
          ) : (
            <CampusDigitalTwin3D
              buildings={buildings}
              incidents={incidents}
              selectedBuildingId={selectedBuilding?.id || null}
              onSelectBuilding={(b) => setSelectedBuilding(b)}
              showHeatmap={showHeatmap}
              showEnergyPulse={showAnomalies}
            />
          )}
        </div>

        {/* Selected Building Details Sidebar */}
        {selectedBuilding && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {selectedBuilding.code}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {selectedBuilding.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBuilding(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600">{selectedBuilding.description}</p>

              {/* Key Baseline Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Energy Baseline
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {selectedBuilding.baseline_energy_kwh} kWh
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-blue-500" /> Water Baseline
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {selectedBuilding.baseline_water_liters} L/day
                  </div>
                </div>
              </div>

              {/* Incidents if any */}
              {selectedBldIncidents.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1.5">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Active Maintenance Incident
                  </div>
                  {selectedBldIncidents.map((inc) => (
                    <div key={inc.id} className="text-rose-700 text-[11px]">
                      &bull; {inc.title} ({inc.severity})
                    </div>
                  ))}
                </div>
              )}

              {/* Registered Rooms */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Registered Facilities & Rooms</span>
                  <span className="text-[10px] text-slate-500">
                    {selectedBldRooms.length} rooms
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {selectedBldRooms.map((rm) => (
                    <div
                      key={rm.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">{rm.room_name}</div>
                        <div className="text-[10px] text-slate-500">{rm.room_number} &bull; {rm.room_type}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        {rm.current_occupancy}/{rm.capacity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assets Overview */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Critical Monitored Assets</span>
                  <span className="text-[10px] text-slate-500">
                    {selectedBldAssets.length} assets
                  </span>
                </div>
                <div className="space-y-1">
                  {selectedBldAssets.map((ast) => (
                    <div
                      key={ast.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 text-[11px]">{ast.name}</div>
                        <div className="text-[10px] text-slate-500">{ast.asset_tag} &bull; Health: {ast.health_score}%</div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          ast.operational_status === "operational"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {ast.operational_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => (window.location.href = `/student/requests/new?building=${selectedBuilding.id}`)}
                leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              >
                Report Issue Here
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

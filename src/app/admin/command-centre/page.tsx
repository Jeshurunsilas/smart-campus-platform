"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CampusViewContainer } from "@/components/campus/CampusViewContainer";
import { Button } from "@/components/ui/Button";
import {
  getCampusBuildings,
  getCampusRooms,
  getCampusIncidents,
  getCampusAssets,
  getMaintenancePredictions,
} from "@/lib/services/campus-operations";
import { getIoTSimulationState } from "@/lib/services/iot-simulator";
import {
  CampusBuilding,
  CampusRoom,
  CampusIncident,
  CampusAsset,
  MaintenancePrediction,
} from "@/types";
import {
  Radio,
  Flame,
  Activity,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  Zap,
  Droplet,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function OperationsCommandCentrePage() {
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);
  const [rooms, setRooms] = useState<CampusRoom[]>([]);
  const [incidents, setIncidents] = useState<CampusIncident[]>([]);
  const [assets, setAssets] = useState<CampusAsset[]>([]);
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>([]);
  const [iotState, setIotState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [blds, rms, incs, asts, preds, iot] = await Promise.all([
        getCampusBuildings(),
        getCampusRooms(),
        getCampusIncidents(),
        getCampusAssets(),
        getMaintenancePredictions(),
        getIoTSimulationState(),
      ]);
      setBuildings(blds);
      setRooms(rms);
      setIncidents(incs);
      setAssets(asts);
      setPredictions(preds);
      setIotState(iot);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (e) {
      console.error("Error loading command centre metrics", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live update interval
    const interval = setInterval(loadData, 45000);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved" && i.status !== "closed");
  const criticalPredictions = predictions.filter((p) => p.risk_level === "critical" || p.risk_level === "high");
  const degradedAssets = assets.filter((a) => a.operational_status !== "operational");

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Command Centre Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                Live Operations HQ &bull; Realtime Telemetry Grid
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Unified Campus Operations Command Centre
            </h1>
            <p className="text-xs text-slate-400">
              Aggregated observability across facilities, assets, active emergency response, IoT telemetry, and SLA dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-mono">Telemetry Synchronized</div>
              <div className="text-xs font-bold text-slate-200 font-mono">{lastRefreshed}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              isLoading={isLoading}
              className="border-slate-700 text-slate-200 hover:bg-slate-800"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh Feeds
            </Button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>ACTIVE INCIDENTS</span>
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600 mt-2">
              {activeIncidents.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">1 Critical &bull; 1 High</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>PREDICTIVE RISKS</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {criticalPredictions.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Impedance & laser wear</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>DEGRADED ASSETS</span>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {degradedAssets.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Out of {assets.length} monitored</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>CAMPUS OCCUPANCY</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              64%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Peak in Science block</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>TELEMETRY RATE</span>
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {iotState?.activeSensors || 7}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Active sensor streams</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>DISPATCH SLA</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">
              94.2%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Within target SLA</div>
          </div>
        </div>

        {/* Embedded Interactive 2D & 3D Spatial Visualizer */}
        <div className="space-y-2">
          <CampusViewContainer
            buildings={buildings}
            rooms={rooms}
            incidents={incidents}
            assets={assets}
          />
        </div>

        {/* Operational Timeline & Incident Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Incidents Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                Active Incidents & Emergency Telemetry
              </h2>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {activeIncidents.length} Requiring Action
              </span>
            </div>

            <div className="space-y-3">
              {activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-rose-900">{inc.title}</span>
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{inc.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-rose-100">
                    <span>Incident: {inc.incident_number}</span>
                    <span className="font-semibold text-rose-700">Status: {inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Operational Activity Stream */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Unified Campus Operations Timeline
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">Chronological Log</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Tagore Auditorium HVAC Setback Activated</div>
                  <div className="text-[11px] text-slate-500">Resource optimizer applied off-peak shedding saving ~420 kWh.</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Today at 18:00 &bull; System Automation</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">INC-2026-0042 Solenoid Valve Seal Alert</div>
                  <div className="text-[11px] text-slate-500">CS Server Room precision chilled water telemetry flagged moisture variance.</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Today at 06:15 &bull; Telemetry Ingestion</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Aryabhata Substation Phase Inversion Mitigated</div>
                  <div className="text-[11px] text-slate-500">Electrical Maintenance dispatched team; secondary feeder restored.</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Today at 07:20 &bull; Dispatch Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

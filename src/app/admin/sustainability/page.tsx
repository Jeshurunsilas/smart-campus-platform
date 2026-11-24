"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_CAMPUS_BUILDINGS } from "@/lib/services/campus-operations";
import {
  Zap,
  Droplet,
  Flame,
  Leaf,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Calendar,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SustainabilityPage() {
  const [emissionFactor, setEmissionFactor] = useState(0.75); // kg CO2 per kWh
  const [timeRange, setTimeRange] = useState("week");

  const totalBaselineKwh = DEMO_CAMPUS_BUILDINGS.reduce((acc, b) => acc + b.baseline_energy_kwh, 0);
  const totalWaterLiters = DEMO_CAMPUS_BUILDINGS.reduce((acc, b) => acc + b.baseline_water_liters, 0);
  const estimatedCarbonKg = Math.round(totalBaselineKwh * emissionFactor);

  const buildingConsumptionData = DEMO_CAMPUS_BUILDINGS.map((b) => ({
    name: b.code,
    energy: b.baseline_energy_kwh,
    water: Math.round(b.baseline_water_liters / 10),
  }));

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Environmental & Sustainability Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Energy, Water & Carbon Emission Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Comprehensive telemetry accounting of campus utility consumption, automated waste detection, and carbon footprint modeling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Period:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 text-xs text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 font-bold cursor-pointer"
            >
              <option value="day">Today (24h)</option>
              <option value="week">Past 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Sustainability KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>CAMPUS ELECTRICITY DEMAND</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {totalBaselineKwh.toLocaleString()} <span className="text-sm font-semibold text-slate-500">kWh/day</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>4.2% lower than prior week baseline</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>WATER CONSUMPTION</span>
              <Droplet className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {totalWaterLiters.toLocaleString()} <span className="text-sm font-semibold text-slate-500">L/day</span>
            </div>
            <div className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Elevated flow in Hostel A (Solenoid alert)</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>ESTIMATED CARBON FOOTPRINT</span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {estimatedCarbonKg.toLocaleString()} <span className="text-sm font-semibold text-slate-500">kg CO₂e/day</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Factor: {emissionFactor} kg CO₂ / kWh
            </div>
          </div>
        </div>

        {/* Building-by-Building Consumption Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Building-Wise Utility Consumption Breakdown
              </h2>
              <p className="text-xs text-slate-500">Comparative electricity (kWh) and scaled water metrics across blocks</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="energy" fill="#0d9488" radius={[6, 6, 0, 0]} name="Energy (kWh)" />
                <Bar dataKey="water" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Water (x10 L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Energy-Saving Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Automated Sustainability Interventions
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-emerald-900">Tagore Auditorium Off-Peak Chiller Shedding</div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Scheduled setback shuts auxiliary air handlers after 18:00, preventing 420 kWh excess daily load.
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-300">
                ACTIVE & SAVING
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-900">Central Library Nighttime LED Auto-Dimming</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Motion sensor integration reduces lighting consumption by 65% between 23:00 and 06:00.
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                ENABLED
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

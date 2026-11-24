"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import {
  CONFIGURED_SENSORS,
  getIoTSimulationState,
  setSimulationActiveState,
  getSensorTimeSeriesHistory,
  TelemetrySummary,
} from "@/lib/services/iot-simulator";
import { SensorType } from "@/types";
import {
  Zap,
  Play,
  Square,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Sliders,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function IoTSimulatorPage() {
  const [telemetry, setTelemetry] = useState<TelemetrySummary | null>(null);
  const [selectedSensorType, setSelectedSensorType] = useState<SensorType>("temperature");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchState = async () => {
    setIsUpdating(true);
    const data = await getIoTSimulationState();
    setTelemetry(data);
    setHistoryData(getSensorTimeSeriesHistory(selectedSensorType));
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 20000);
    return () => clearInterval(interval);
  }, [selectedSensorType]);

  const handleToggleSimulation = () => {
    if (!telemetry) return;
    const newState = !telemetry.isSimulationActive;
    setSimulationActiveState(newState);
    fetchState();
  };

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-teal-600" />
              <span>Modular IoT Telemetry Ingestion</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Simulated IoT Platform & Sensor Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Provider-independent sensor layer with threshold anomaly alerts. Modular design ready for physical ESP32 / MQTT hardware.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant={telemetry?.isSimulationActive ? "destructive" : "primary"}
              size="sm"
              onClick={handleToggleSimulation}
              leftIcon={telemetry?.isSimulationActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            >
              {telemetry?.isSimulationActive ? "Halt Telemetry Engine" : "Start Telemetry Engine"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchState}
              isLoading={isUpdating}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Poll Now
            </Button>
          </div>
        </div>

        {/* Telemetry Indicator Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="font-bold text-teal-300">
              {telemetry?.sourceLabel || "SIMULATED TELEMETRY"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Sampling Interval: 15-30s</span>
            <span>&bull;</span>
            <span>Total Streams: {CONFIGURED_SENSORS.length}</span>
            <span>&bull;</span>
            <span className="text-amber-400">Anomalies: {telemetry?.anomaliesDetected || 0}</span>
          </div>
        </div>

        {/* Time-Series Graph */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Live Telemetry Time-Series Waveform
              </h2>
              <p className="text-xs text-slate-500">24-hour baseline comparison with threshold bands</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Metric:</span>
              <select
                value={selectedSensorType}
                onChange={(e) => setSelectedSensorType(e.target.value as SensorType)}
                className="bg-slate-50 text-xs text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="temperature">Temperature (°C)</option>
                <option value="humidity">Humidity (%)</option>
                <option value="electricity_meter">Electricity Feeder (kW)</option>
                <option value="occupancy">Turnstile Occupancy (people)</option>
                <option value="water_meter">Water Flow (L/min)</option>
                <option value="vibration">Compressor Vibration (mm/s)</option>
              </select>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2.5} fill="url(#telemetryGrad)" />
                <Area type="monotone" dataKey="baseline" stroke="#64748b" strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Ingestion Feeds Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              Registered Sensor Endpoints
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Device EUI</th>
                  <th className="py-2.5 px-3">Sensor Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Current Value</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Anomaly Detection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CONFIGURED_SENSORS.map((sensor, idx) => {
                  const reading = telemetry?.latestReadings?.find((r) => r.sensor_id === sensor.id);
                  const isAnomaly = reading?.is_anomaly;

                  return (
                    <tr key={sensor.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{sensor.device_eui}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{sensor.name}</td>
                      <td className="py-3 px-3 capitalize text-slate-600">{sensor.sensor_type.replace("_", " ")}</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">
                        {reading ? `${reading.value} ${reading.unit}` : `-- ${sensor.unit}`}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Stream
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {isAnomaly ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Threshold Exceeded
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full w-max inline-block">
                            Nominal Range
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

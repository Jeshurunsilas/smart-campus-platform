"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { DEMO_USERS } from "@/lib/demo-data";
import { UserProfile } from "@/types";
import {
  Sparkles,
  Monitor,
  Projector,
  Wifi,
  Wind,
  Thermometer,
  Mic2,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function FacultyClassroomReadinessPage() {
  const [user] = useState<UserProfile>(DEMO_USERS.faculty);
  const [selectedRoom, setSelectedRoom] = useState("AB1-204");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportedModal, setReportedModal] = useState<string | null>(null);

  const roomsData: Record<
    string,
    {
      name: string;
      building: string;
      readinessScore: number;
      devices: Array<{
        name: string;
        category: string;
        icon: any;
        status: "operational" | "warning" | "fault";
        detail: string;
      }>;
    }
  > = {
    "AB1-204": {
      name: "Multimedia Lecture Hall AB1-204",
      building: "Academic Block 1",
      readinessScore: 98,
      devices: [
        {
          name: "4K Laser Projector & Dual Motorized Screen",
          category: "Visuals",
          icon: Projector,
          status: "operational",
          detail: "Laser engine healthy (320/20,000 hrs). HDMI-1 & Wireless Cast live.",
        },
        {
          name: "Interactive Smart Podium & Wacom Stylus",
          category: "Compute",
          icon: Monitor,
          status: "operational",
          detail: "Firmware v4.8 up-to-date. Calibrated response 2ms.",
        },
        {
          name: "HVAC Zone 2 Climate System",
          category: "Climate",
          icon: Thermometer,
          status: "operational",
          detail: "Temp: 21.8°C (Setpoint 22.0°C). Airflow balanced.",
        },
        {
          name: "IoT Environmental & CO2 Sensor",
          category: "Sensors",
          icon: Wind,
          status: "operational",
          detail: "CO2: 435 ppm (Clean Air Standard). Humidity: 46%.",
        },
        {
          name: "High-Density Wi-Fi 6 Access Point",
          category: "Network",
          icon: Wifi,
          status: "operational",
          detail: "Latency 4ms. Channel 36 clear. 54 active devices.",
        },
        {
          name: "Wireless UHF Lapel & Handheld Microphones",
          category: "Audio",
          icon: Mic2,
          status: "operational",
          detail: "Battery 94%. Automatic frequency hopping active.",
        },
      ],
    },
    "AB1-302": {
      name: "AI & Distributed Computing Lab AB1-302",
      building: "Academic Block 1",
      readinessScore: 84,
      devices: [
        {
          name: "Interactive Smart Screen",
          category: "Visuals",
          icon: Monitor,
          status: "operational",
          detail: "Touch grid responsive. 4K HDR enabled.",
        },
        {
          name: "HVAC Unit 3",
          category: "Climate",
          icon: Thermometer,
          status: "warning",
          detail: "Thermal variance +2.8°C above target. Filter cleaning due.",
        },
        {
          name: "Gigabit Ethernet Switch (Workstations)",
          category: "Network",
          icon: Wifi,
          status: "operational",
          detail: "32/32 ports linked at 1000 Mbps full duplex.",
        },
        {
          name: "IoT Air Quality & VOC Sensor",
          category: "Sensors",
          icon: Wind,
          status: "operational",
          detail: "Indoor Air Quality index: Good (AQI 32).",
        },
      ],
    },
  };

  const currentRoom = roomsData[selectedRoom] || roomsData["AB1-204"];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <DashboardShell
      title="Classroom & Lab Diagnostic Readiness"
      subtitle="Real-time telemetry and equipment operational verification before scheduled lectures"
      role="faculty"
      user={user}
    >
      {/* Top Selector & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Selected Facility:
          </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white"
          >
            <option value="AB1-204">AB1-204 • Multimedia Lecture Hall</option>
            <option value="AB1-302">AB1-302 • AI & Distributed Computing Lab</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Run Live Diagnostics
          </Button>

          <Link href={`/faculty/requests?new=true&building=Academic+Block+1&room=${selectedRoom}`}>
            <Button variant="danger" size="sm" className="flex items-center gap-1.5 text-xs">
              <Wrench className="h-3.5 w-3.5" /> Report Immediate Fault
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Overall Readiness Score"
          value={`${currentRoom.readinessScore}%`}
          icon={Sparkles}
          trend={{
            value: currentRoom.readinessScore >= 90 ? "Fully Operational" : "Action Recommended",
            isPositive: currentRoom.readinessScore >= 90,
          }}
        />
        <StatsCard
          title="Diagnostic Tests Passed"
          value={`${currentRoom.devices.filter((d) => d.status === "operational").length} / ${currentRoom.devices.length}`}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Ambient Temperature"
          value="21.8°C"
          icon={Thermometer}
        />
        <StatsCard
          title="Wi-Fi 6 Link Latency"
          value="4 ms"
          icon={Wifi}
        />
      </div>

      {/* Devices Diagnostic Matrix */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-8">
        <div className="border-b border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Equipment & IoT Health Diagnostics: {currentRoom.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated continuous ping and sensor telemetry updated every 30 seconds
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Diagnostics OK
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="p-5 space-y-4">
            {currentRoom.devices.slice(0, 3).map((dev, idx) => {
              const Icon = dev.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/30 flex items-start gap-3.5"
                >
                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2.5 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {dev.name}
                      </h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          dev.status === "operational"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {dev.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {dev.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-5 space-y-4">
            {currentRoom.devices.slice(3).map((dev, idx) => {
              const Icon = dev.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/30 flex items-start gap-3.5"
                >
                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2.5 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {dev.name}
                      </h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          dev.status === "operational"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {dev.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {dev.detail}
                    </p>
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

"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Clock, AlertTriangle, CheckCircle2, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [criticalSLA, setCriticalSLA] = useState("4");
  const [highSLA, setHighSLA] = useState("12");
  const [mediumSLA, setMediumSLA] = useState("24");
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell role="administrator">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Configuration &amp; Governance
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure automated SLA thresholds, administrative auto-escalations, and system policies.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Platform configuration settings updated successfully!
            </div>
          )}

          {/* Section 1: SLA Target Hours */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-teal-600" />
              Standard Service Level Agreement (SLA) Targets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Critical Priority SLA (Hours)"
                type="number"
                value={criticalSLA}
                onChange={(e) => setCriticalSLA(e.target.value)}
                helperText="Applies to gas leaks, power outages, and chemical spills."
              />

              <Input
                label="High Priority SLA (Hours)"
                type="number"
                value={highSLA}
                onChange={(e) => setHighSLA(e.target.value)}
                helperText="Classroom projectors, AC failures."
              />

              <Input
                label="Medium Priority SLA (Hours)"
                type="number"
                value={mediumSLA}
                onChange={(e) => setMediumSLA(e.target.value)}
                helperText="Standard maintenance requests."
              />
            </div>
          </div>

          {/* Section 2: Automated Escalations */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Automated Escalation Engine
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEscalate}
                  onChange={(e) => setAutoEscalate(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Auto-flag overdue tickets to Campus Director
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed block mt-0.5">
                    If an assigned ticket exceeds 100% of its SLA deadline without status progression to In Progress, notify department heads automatically.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Realtime Email Dispatches for Critical Severity Tickets
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed block mt-0.5">
                    Immediately send emergency notification SMS/Email to on-duty staff when Critical safety items are submitted.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Configuration Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

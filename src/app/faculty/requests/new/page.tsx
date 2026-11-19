"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestForm } from "@/components/requests/RequestForm";

export default function FacultyNewRequestPage() {
  return (
    <DashboardShell role="faculty">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Log Faculty Service Request
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Submit issues for classroom audiovisual fixtures, lab equipment calibration, or electrical lines.
          </p>
        </div>

        <RequestForm rolePrefix="/faculty" />
      </div>
    </DashboardShell>
  );
}

"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestForm } from "@/components/requests/RequestForm";

export default function StudentNewRequestPage() {
  return (
    <DashboardShell role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Service Request
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Submit a campus maintenance or equipment ticket. Our smart triage engine will route it to the right department.
          </p>
        </div>

        <RequestForm rolePrefix="/student" />
      </div>
    </DashboardShell>
  );
}

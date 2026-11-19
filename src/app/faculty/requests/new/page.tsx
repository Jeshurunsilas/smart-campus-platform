"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestForm } from "@/components/requests/RequestForm";

function FacultyRequestFormContent() {
  const searchParams = useSearchParams();
  const defaultDept = searchParams.get("dept") || undefined;

  return <RequestForm rolePrefix="/faculty" defaultDepartmentId={defaultDept} />;
}

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

        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading form...</div>}>
          <FacultyRequestFormContent />
        </Suspense>
      </div>
    </DashboardShell>
  );
}

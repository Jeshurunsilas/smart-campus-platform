"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { DEMO_REQUESTS } from "@/lib/demo-data";

export default function DepartmentRequestHistoryPage() {
  const historyRequests = DEMO_REQUESTS.filter(
    (r) => r.status === "Resolved" || r.status === "Closed"
  );

  return (
    <DashboardShell role="staff">
      <div className="pb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Completed Work Order History
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Past resolved requests, completion logs, and recipient satisfaction feedback.
        </p>
      </div>

      <RequestTable
        requests={historyRequests}
        title="Resolved &amp; Closed Work Orders"
        showDepartment={true}
      />
    </DashboardShell>
  );
}

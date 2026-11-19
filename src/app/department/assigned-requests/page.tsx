"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { DEMO_REQUESTS } from "@/lib/demo-data";

export default function DepartmentAssignedRequestsPage() {
  const assigned = DEMO_REQUESTS.filter(
    (r) => r.status !== "Closed"
  );

  return (
    <DashboardShell role="staff">
      <div className="pb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Assigned Work Orders
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Current service and maintenance assignments dispatched to your team.
        </p>
      </div>

      <RequestTable
        requests={assigned}
        title="Active Dispatch Queue"
        showDepartment={false}
      />
    </DashboardShell>
  );
}

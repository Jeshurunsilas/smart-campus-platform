"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { StatsCard } from "@/components/ui/StatsCard";
import { DEMO_REQUESTS } from "@/lib/demo-data";
import { ClipboardList, Clock, AlertTriangle } from "lucide-react";

export default function AdminRequestsPage() {
  const requests = DEMO_REQUESTS;

  return (
    <DashboardShell role="administrator">
      <div className="pb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus-Wide Service Requests
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Oversee, reassign, override priorities, and monitor resolution SLA deadlines across all academic departments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Requests"
          value={requests.length}
          subtitle="All campus tickets"
          icon={ClipboardList}
          colorVariant="default"
        />
        <StatsCard
          title="Awaiting Triage"
          value={requests.filter((r) => r.status === "Submitted" || r.status === "Under Review").length}
          subtitle="Pending assignment"
          icon={Clock}
          colorVariant="amber"
        />
        <StatsCard
          title="Active Work Orders"
          value={requests.filter((r) => r.status === "In Progress" || r.status === "Assigned").length}
          subtitle="Staff currently assigned"
          icon={ClipboardList}
          colorVariant="blue"
        />
        <StatsCard
          title="Overdue SLA"
          value={requests.filter((r) => r.is_overdue).length}
          subtitle="Urgent escalation"
          icon={AlertTriangle}
          colorVariant="rose"
        />
      </div>

      <RequestTable
        requests={requests}
        title="Comprehensive Service Ticket Command Log"
        showDepartment={true}
      />
    </DashboardShell>
  );
}

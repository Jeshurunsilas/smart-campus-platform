"use client";

import React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { Button } from "@/components/ui/Button";
import { DEMO_REQUESTS } from "@/lib/demo-data";
import { PlusCircle } from "lucide-react";

export default function FacultyRequestsPage() {
  const facultyRequests = DEMO_REQUESTS.filter(
    (r) => r.user_id === "usr-faculty-01"
  );

  return (
    <DashboardShell role="faculty">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Faculty Service Tickets
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time status tracking for classroom and laboratory work orders.
          </p>
        </div>

        <Link href="/faculty/requests/new">
          <Button
            variant="teal"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Report Problem
          </Button>
        </Link>
      </div>

      <RequestTable
        requests={facultyRequests}
        title="All Faculty Work Orders"
        showDepartment={true}
      />
    </DashboardShell>
  );
}

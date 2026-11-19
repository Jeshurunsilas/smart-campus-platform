"use client";

import React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { Button } from "@/components/ui/Button";
import { DEMO_REQUESTS } from "@/lib/demo-data";
import { PlusCircle } from "lucide-react";

export default function StudentRequestsPage() {
  const studentRequests = DEMO_REQUESTS.filter(
    (r) => r.user_id === "usr-student-01"
  );

  return (
    <DashboardShell role="student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Service Requests
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track live resolution progress, SLA timers, and service ratings for all your submitted tickets.
          </p>
        </div>

        <Link href="/student/requests/new">
          <Button
            variant="teal"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Request
          </Button>
        </Link>
      </div>

      <RequestTable
        requests={studentRequests}
        title="All My Requests"
        showDepartment={true}
      />
    </DashboardShell>
  );
}

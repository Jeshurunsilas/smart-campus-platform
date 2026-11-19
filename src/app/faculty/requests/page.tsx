"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { Button } from "@/components/ui/Button";
import { DEMO_REQUESTS } from "@/lib/demo-data";
import { ServiceRequest } from "@/types";
import { getUserServiceRequests } from "@/lib/services/requests";
import { PlusCircle, Loader2 } from "lucide-react";

export default function FacultyRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(
    DEMO_REQUESTS.filter((r) => r.user_id === "usr-faculty-01")
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchFacultyRequests = useCallback(() => {
    getUserServiceRequests()
      .then((data) => {
        if (data && data.length > 0) {
          setRequests(data);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    getUserServiceRequests()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setRequests(data);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardShell role="faculty">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Maintenance &amp; Equipment History
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track real-time status, technician work orders, and resolution timelines for departmental requests.
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

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Loading academic service records...</span>
        </div>
      ) : (
        <RequestTable
          requests={requests}
          title="All Department Requests"
          showDepartment={true}
          onRequestCancelled={() => {
            fetchFacultyRequests();
          }}
        />
      )}
    </DashboardShell>
  );
}

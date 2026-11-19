"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequestTable } from "@/components/requests/RequestTable";
import { StatsCard } from "@/components/ui/StatsCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DEMO_REQUESTS, DEMO_USERS } from "@/lib/demo-data";
import { ServiceRequest, RequestPriority } from "@/types";
import {
  getAllRequestsAdmin,
  assignRequestToStaff,
  updateRequestPriority,
} from "@/lib/services/requests";
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  PlayCircle,
  Loader2,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(DEMO_REQUESTS);
  const [isLoading, setIsLoading] = useState(true);

  // Assignment Modal
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState("usr-staff-01");
  const [selectedPriority, setSelectedPriority] = useState<RequestPriority>("High");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchRequests = useCallback(() => {
    getAllRequestsAdmin()
      .then((data) => {
        if (data && data.length > 0) setRequests(data);
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
    getAllRequestsAdmin()
      .then((data) => {
        if (isMounted && data && data.length > 0) setRequests(data);
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

  const handleAssignAndDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setIsSubmittingAction(true);
    setActionSuccess(null);
    try {
      await assignRequestToStaff(selectedRequest.id, selectedStaffId, assignmentNote);
      if (selectedPriority !== selectedRequest.priority) {
        await updateRequestPriority(
          selectedRequest.id,
          selectedPriority,
          "Priority updated during staff assignment dispatch."
        );
      }
      setActionSuccess(`Request ${selectedRequest.tracking_number} successfully dispatched!`);
      setSelectedRequest(null);
      fetchRequests();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch {
      // Error
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const pendingCount = requests.filter(
    (r) => r.status === "Submitted" || r.status === "Under Review"
  ).length;
  const inProgressCount = requests.filter(
    (r) => r.status === "In Progress" || r.status === "Assigned" || r.status === "Accepted"
  ).length;
  const now = new Date();
  const overdueCount = requests.filter(
    (r) =>
      r.is_overdue ||
      (r.due_at && new Date(r.due_at) < now && r.status !== "Resolved" && r.status !== "Closed")
  ).length;

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus-Wide Service Requests
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Oversee, reassign, override priorities, and monitor resolution SLA deadlines across all academic departments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const firstPending = requests.find((r) => r.status === "Submitted" || r.status === "Under Review");
            if (firstPending) {
              setSelectedRequest(firstPending);
              setSelectedPriority(firstPending.priority);
            }
          }}
          disabled={pendingCount === 0}
          leftIcon={<UserCheck className="w-4 h-4 text-purple-600" />}
        >
          Dispatch Next Pending ({pendingCount})
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* Stats Cards */}
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
          value={pendingCount}
          subtitle="Pending staff assignment"
          icon={Clock}
          colorVariant="amber"
        />
        <StatsCard
          title="Active Work Orders"
          value={inProgressCount}
          subtitle="Technicians dispatched"
          icon={PlayCircle}
          colorVariant="blue"
        />
        <StatsCard
          title="Overdue SLA"
          value={overdueCount}
          subtitle="Immediate administrative escalation"
          icon={AlertTriangle}
          colorVariant="rose"
        />
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span>Synchronizing campus request queue...</span>
        </div>
      ) : (
        <RequestTable
          requests={requests}
          title="Comprehensive Service Ticket Command Log"
          showDepartment={true}
          onRequestCancelled={() => {
            fetchRequests();
          }}
        />
      )}

      {/* Fast Dispatch & Priority Override Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Dispatch ${selectedRequest?.tracking_number}`}
        description="Assign a field technician, override SLA priority, or provide technical dispatch instructions."
      >
        {selectedRequest && (
          <form onSubmit={handleAssignAndDispatch} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900">{selectedRequest.title}</div>
              <div className="text-slate-500">
                Location: {selectedRequest.location?.building} — {selectedRequest.location?.room_number} &bull;{" "}
                Category: {selectedRequest.category?.name || "General"}
              </div>
            </div>

            <Select
              label="Assigned Technician"
              required
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              options={[
                { value: "usr-staff-01", label: `${DEMO_USERS.staff.full_name} (Facilities & Electrical Ops)` },
                { value: "usr-staff-02", label: "Devin Zhao (IT & AV Infrastructure)" },
                { value: "usr-staff-03", label: "Samantha Reed (Lab Science Maintenance)" },
              ]}
            />

            <Select
              label="SLA Priority Level"
              required
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as RequestPriority)}
              options={[
                { value: "Critical", label: "Critical (SLA: 4 Hours)" },
                { value: "High", label: "High (SLA: 12 Hours)" },
                { value: "Medium", label: "Medium (SLA: 24 Hours)" },
                { value: "Low", label: "Low (SLA: 48 Hours)" },
              ]}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dispatch Instructions / Special Notes
              </label>
              <textarea
                rows={3}
                placeholder="Specific instructions for technician, gate passes required, or special equipment needed..."
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedRequest(null)}
                disabled={isSubmittingAction}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingAction}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Confirm Dispatch
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardShell>
  );
}

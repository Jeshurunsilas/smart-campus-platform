"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { RequestPriorityBadge } from "@/components/requests/RequestPriorityBadge";
import { RequestDetailModal } from "@/components/requests/RequestDetailModal";
import { Modal } from "@/components/ui/Modal";
import { DEMO_REQUESTS, DEMO_USERS } from "@/lib/demo-data";
import { ServiceRequest, RequestStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { updateServiceRequestStatus } from "@/lib/services/requests";
import {
  Wrench,
  Clock,
  PlayCircle,
  CheckCircle2,
  MapPin,
  Camera,
} from "lucide-react";

export default function DepartmentDashboardPage() {
  const staffUser = DEMO_USERS.staff;
  const [requests, setRequests] = useState<ServiceRequest[]>(DEMO_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Status Update Modal State
  const [updatingRequest, setUpdatingRequest] = useState<ServiceRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RequestStatus>("In Progress");
  const [workNotes, setWorkNotes] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const assignedTasks = requests.filter(
    (r) => r.department_id === "dept-facilities" || r.status === "Assigned" || r.status === "In Progress"
  );

  const pendingTasks = assignedTasks.filter(
    (r) => r.status === "Assigned" || r.status === "Under Review" || r.status === "Submitted"
  ).length;

  const inProgressTasks = assignedTasks.filter(
    (r) => r.status === "In Progress" || r.status === "Accepted"
  ).length;

  const completedTasks = assignedTasks.filter(
    (r) => r.status === "Resolved" || r.status === "Closed"
  ).length;

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingRequest) return;

    try {
      await updateServiceRequestStatus(
        updatingRequest.id,
        newStatus,
        workNotes,
        updatingRequest.status
      );

      setRequests((prev) =>
        prev.map((r) =>
          r.id === updatingRequest.id
            ? {
                ...r,
                status: newStatus,
                resolved_at: newStatus === "Resolved" ? new Date().toISOString() : r.resolved_at,
                updated_at: new Date().toISOString(),
              }
            : r
        )
      );

      setSuccessMsg(`Ticket ${updatingRequest.tracking_number} updated to ${newStatus}.`);
      setUpdatingRequest(null);
      setWorkNotes("");
      setPhotoName("");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      setSuccessMsg(`Failed to update status: ${msg}`);
    }
  };

  return (
    <DashboardShell role="staff">
      {/* Staff Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-slate-900 to-amber-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            Facilities Operations Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Field Technician: {staffUser.full_name}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage your daily work orders, accept dispatch assignments, log diagnostic updates, and upload completion photo evidence.
          </p>
        </div>

        <Link href="/department/assigned-requests">
          <Button variant="teal" size="md">
            View All Work Orders ({assignedTasks.length})
          </Button>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* 4 Workload Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Assigned Tasks"
          value={assignedTasks.length}
          subtitle="Department work queue"
          icon={Wrench}
          colorVariant="amber"
        />
        <StatsCard
          title="Pending Dispatch"
          value={pendingTasks}
          subtitle="Awaiting technician review"
          icon={Clock}
          colorVariant="blue"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks}
          subtitle="Active on-site repair"
          icon={PlayCircle}
          colorVariant="teal"
        />
        <StatsCard
          title="Completed & Tested"
          value={completedTasks}
          subtitle="Closed work orders"
          icon={CheckCircle2}
          colorVariant="emerald"
        />
      </div>

      {/* Assigned Requests Queue Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Field Assignment Queue
            </h3>
            <p className="text-xs text-slate-500">
              Select any work order to inspect notes or update resolution status.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {assignedTasks.length} Active Tasks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Title &amp; Issue</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assignedTasks.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {req.tracking_number}
                  </td>
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <div className="font-semibold text-slate-900 truncate">
                      {req.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {req.category?.name}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.location?.room_number || req.location?.building}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <RequestPriorityBadge priority={req.priority} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <RequestStatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {req.sla_deadline ? formatDate(req.sla_deadline) : "24h standard"}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpdatingRequest(req);
                        setNewStatus(req.status === "Assigned" ? "In Progress" : "Resolved");
                      }}
                      className="text-xs"
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Viewer Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      {/* Status & Resolution Work Update Modal */}
      <Modal
        isOpen={!!updatingRequest}
        onClose={() => setUpdatingRequest(null)}
        title={`Update Status: ${updatingRequest?.tracking_number}`}
        description="Record field diagnostic progress, change work order status, and submit proof."
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select New Request Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="Accepted">Accepted (Technician acknowledging work order)</option>
              <option value="In Progress">In Progress (Active on-site repair)</option>
              <option value="On Hold">On Hold (Awaiting spare parts / access)</option>
              <option value="Resolved">Resolved (Work completed and verified)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Technician Field Notes / Work Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Replaced faulty ballast on overhead fixture; tested circuit breaker."
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {newStatus === "Resolved" && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Upload Completion Photograph (Verification Proof)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPhotoName(e.target.files[0].name);
                  }
                }}
                className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white cursor-pointer"
              />
              {photoName && (
                <div className="mt-2 text-xs font-semibold text-emerald-700">
                  Attached: {photoName}
                </div>
              )}
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setUpdatingRequest(null)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Work Order Progress
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}

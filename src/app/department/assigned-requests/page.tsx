"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_REQUESTS } from "@/lib/demo-data";
import { ServiceRequest, RequestStatus } from "@/types";
import {
  getStaffAssignedRequests,
  acceptRequestAssignment,
  startRequestWork,
  rejectRequestAssignment,
  addRequestWorkNote,
  resolveServiceRequest,
} from "@/lib/services/requests";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { RequestPriorityBadge } from "@/components/requests/RequestPriorityBadge";
import { RequestDetailModal } from "@/components/requests/RequestDetailModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  Play,
  XCircle,
  FileText,
  Camera,
  MapPin,
  Clock,
  Wrench,
  AlertCircle,
} from "lucide-react";

export default function DepartmentAssignedRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(DEMO_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Decline Modal
  const [decliningRequest, setDecliningRequest] = useState<ServiceRequest | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  // Add Note Modal
  const [notingRequest, setNotingRequest] = useState<ServiceRequest | null>(null);
  const [workNote, setWorkNote] = useState("");

  // Resolve Modal
  const [resolvingRequest, setResolvingRequest] = useState<ServiceRequest | null>(null);
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState<string>("");

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getStaffAssignedRequests()
      .then((data) => {
        if (isMounted) {
          setRequests(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load staff assigned requests:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Filter requests
  const filtered = requests.filter((r) => {
    if (r.status === "Closed") return false;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      (r.location?.building && r.location.building.toLowerCase().includes(search.toLowerCase())) ||
      (r.location?.room_number && r.location.room_number.toLowerCase().includes(search.toLowerCase()));

    const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Action Handlers
  const handleAccept = async (req: ServiceRequest) => {
    try {
      await acceptRequestAssignment(req.id);
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "Accepted" as RequestStatus } : r))
      );
      showNotification(`Acknowledged & accepted ticket ${req.tracking_number}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to accept.";
      showNotification(msg, "error");
    }
  };

  const handleStartWork = async (req: ServiceRequest) => {
    try {
      await startRequestWork(req.id);
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "In Progress" as RequestStatus } : r))
      );
      showNotification(`Ticket ${req.tracking_number} is now marked In Progress`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to start work.";
      showNotification(msg, "error");
    }
  };

  const handleConfirmDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningRequest || !declineReason) return;
    setIsSubmitting(true);
    try {
      await rejectRequestAssignment(decliningRequest.id, declineReason);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === decliningRequest.id ? { ...r, status: "Under Review" as RequestStatus } : r
        )
      );
      showNotification(`Declined assignment for ${decliningRequest.tracking_number}. Re-routed to administrator.`);
      setDecliningRequest(null);
      setDeclineReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to decline.";
      showNotification(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notingRequest || !workNote) return;
    setIsSubmitting(true);
    try {
      await addRequestWorkNote(notingRequest.id, workNote);
      showNotification(`Field note logged to audit trail for ${notingRequest.tracking_number}`);
      setNotingRequest(null);
      setWorkNote("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save note.";
      showNotification(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingRequest || !resolutionDetails) return;
    setIsSubmitting(true);
    try {
      await resolveServiceRequest(
        resolvingRequest.id,
        resolutionDetails,
        completionPhoto ? `https://storage.supabase.local/${completionPhoto}` : undefined
      );
      setRequests((prev) =>
        prev.map((r) =>
          r.id === resolvingRequest.id
            ? {
                ...r,
                status: "Resolved" as RequestStatus,
                resolved_at: new Date().toISOString(),
              }
            : r
        )
      );
      showNotification(`Work order ${resolvingRequest.tracking_number} successfully resolved and verified.`);
      setResolvingRequest(null);
      setResolutionDetails("");
      setCompletionPhoto("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resolve.";
      showNotification(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell role="staff">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Assigned Work Orders
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Accept assignments, update diagnosis milestones, and upload verified completion photos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {filtered.length} Active in Queue
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ticket ID, issue title, or room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Priority:
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Active</option>
            <option value="Assigned">Assigned (New)</option>
            <option value="Accepted">Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading work orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <Wrench className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No work orders match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Summary &amp; Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA Deadline</th>
                  <th className="py-3 px-4 text-right">Technician Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {req.tracking_number}
                    </td>
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-semibold text-slate-900 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {req.category?.name || "General Maintenance"} • {req.creator?.full_name || "Campus User"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.location?.room_number || req.location?.building || "Campus"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RequestPriorityBadge priority={req.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RequestStatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.sla_deadline ? formatDate(req.sla_deadline) : "24h standard"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === "Assigned" && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAccept(req)}
                              className="text-[11px] h-7 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                            >
                              Accept
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDecliningRequest(req);
                                setDeclineReason("");
                              }}
                              className="text-[11px] h-7 px-2 text-rose-600 hover:bg-rose-50"
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {(req.status === "Accepted" || req.status === "Assigned") && (
                          <Button
                            variant="teal"
                            size="sm"
                            onClick={() => handleStartWork(req)}
                            leftIcon={<Play className="w-3 h-3" />}
                            className="text-[11px] h-7 px-2.5"
                          >
                            Start Work
                          </Button>
                        )}

                        {req.status === "In Progress" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setNotingRequest(req);
                                setWorkNote("");
                              }}
                              leftIcon={<FileText className="w-3 h-3" />}
                              className="text-[11px] h-7 px-2"
                            >
                              Note
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setResolvingRequest(req);
                                setResolutionDetails("");
                                setCompletionPhoto("");
                              }}
                              leftIcon={<CheckCircle2 className="w-3 h-3" />}
                              className="text-[11px] h-7 px-2.5 bg-emerald-700 hover:bg-emerald-800 border-none text-white"
                            >
                              Resolve
                            </Button>
                          </>
                        )}

                        {req.status === "Resolved" && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      {/* Decline Assignment Modal */}
      <Modal
        isOpen={!!decliningRequest}
        onClose={() => setDecliningRequest(null)}
        title={`Decline Assignment: ${decliningRequest?.tracking_number}`}
        description="Provide a mandatory justification reason to re-queue this work order to the campus supervisor."
      >
        <form onSubmit={handleConfirmDecline} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Declining <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Requires specialized high-voltage electrician certification; currently dispatched on emergency chiller maintenance."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => setDecliningRequest(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="submit"
              disabled={isSubmitting}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              {isSubmitting ? "Submitting..." : "Confirm Decline & Return"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Work Note Modal */}
      <Modal
        isOpen={!!notingRequest}
        onClose={() => setNotingRequest(null)}
        title={`Log Diagnostic Note: ${notingRequest?.tracking_number}`}
        description="Append a timestamped progress note to the service ticket's public audit trail."
      >
        <form onSubmit={handleConfirmAddNote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Work Progress Update <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Inspecting condenser coil. Replaced 15A fuse, testing amperage draw."
              value={workNote}
              onChange={(e) => setWorkNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => setNotingRequest(null)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add to Audit Trail"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Resolve Work Order Modal */}
      <Modal
        isOpen={!!resolvingRequest}
        onClose={() => setResolvingRequest(null)}
        title={`Resolve Work Order: ${resolvingRequest?.tracking_number}`}
        description="Document the corrective action performed and attach verification proof."
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Corrective Action Taken <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Replaced faulty ballast and LED tube in fixture #3. Circuit tested clear and fully operational."
              value={resolutionDetails}
              onChange={(e) => setResolutionDetails(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

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
                  setCompletionPhoto(e.target.files[0].name);
                }
              }}
              className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white cursor-pointer"
            />
            {completionPhoto && (
              <div className="mt-2 text-xs font-semibold text-emerald-700">
                Attached: {completionPhoto}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => setResolvingRequest(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {isSubmitting ? "Submitting..." : "Mark as Resolved & Complete"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}

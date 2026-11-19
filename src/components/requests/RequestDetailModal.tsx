"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ServiceRequest, RequestStatus } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  isRequestCancellable,
  cancelServiceRequest,
  getRequestUpdates,
  RequestUpdateItem,
} from "@/lib/services/requests";
import {
  Building2,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Star,
  FileText,
  AlertTriangle,
  XCircle,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface RequestDetailModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (newStatus: RequestStatus) => void;
  onRequestCancelled?: (requestId: string) => void;
}

export function RequestDetailModal({
  request,
  isOpen,
  onClose,
  onStatusUpdate,
  onRequestCancelled,
}: RequestDetailModalProps) {
  const [timeline, setTimeline] = useState<RequestUpdateItem[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    if (!request || !isOpen) return;

    let isMounted = true;
    getRequestUpdates(request.id)
      .then((updates) => {
        if (isMounted) setTimeline(updates);
      })
      .catch(() => {
        if (isMounted) setTimeline([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingTimeline(false);
      });

    return () => {
      isMounted = false;
    };
  }, [request, isOpen]);

  const handleCloseModal = () => {
    setShowCancelConfirm(false);
    setCancelReason("");
    setCancelError(null);
    setCancelSuccess(false);
    onClose();
  };

  if (!request) return null;

  const cancellable = isRequestCancellable(request.status);

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelServiceRequest(request.id, cancelReason || "Cancelled by user via portal");
      setCancelSuccess(true);
      if (onStatusUpdate) onStatusUpdate("Closed");
      if (onRequestCancelled) onRequestCancelled(request.id);
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel request.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={request.tracking_number}
      description={`Submitted on ${formatDate(request.created_at)}`}
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>
              SLA Deadline:{" "}
              {request.sla_deadline ? formatDate(request.sla_deadline) : "Standard (12-24h)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cancellable && !cancelSuccess && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(true)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
              >
                Cancel Request
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Title & Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <RequestStatusBadge status={cancelSuccess ? "Closed" : request.status} />
            <RequestPriorityBadge priority={request.priority} />
            {request.is_overdue && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                OVERDUE
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {request.title}
          </h2>
        </div>

        {/* Cancel Confirmation Prompt */}
        {showCancelConfirm && !cancelSuccess && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">Confirm Request Cancellation</h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Are you sure you want to cancel this service request? This ticket will be marked as Closed.
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Reason for cancellation (optional)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-rose-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />

            {cancelError && (
              <p className="text-xs text-rose-600 font-semibold">{cancelError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
              >
                Never mind
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleConfirmCancel}
                isLoading={isCancelling}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Cancel Request
              </Button>
            </div>
          </div>
        )}

        {/* Cancellation Success Banner */}
        {cancelSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Your service request has been cancelled. Closing window...
          </div>
        )}

        {/* Location & Department Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Department
              </span>
              <span className="font-semibold">{request.department?.name || "General Facilities"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Location
              </span>
              <span className="font-semibold">
                {request.location?.building} — {request.location?.floor || "Floor 2"}, {request.location?.room_number}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Reported By
              </span>
              <span className="font-semibold">
                {request.creator?.full_name || "Campus User"} ({request.creator?.role || "student"})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Service Category
              </span>
              <span className="font-semibold">{request.category?.name || "General Service"}</span>
            </div>
          </div>
        </div>

        {/* Detailed Issue Description */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
            Detailed Problem Description
          </h4>
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </div>
        </div>

        {/* Attached Photograph (if uploaded) */}
        {request.image_url && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              Attached Incident Photograph
            </h4>
            <div className="relative w-full max-w-sm h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900/5">
              <Image
                src={request.image_url}
                alt="Request incident photo"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Resolution Feedback (if resolved) */}
        {request.feedback && (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Service Satisfaction Rating
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < request.feedback!.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {request.feedback.comment && (
              <p className="text-xs text-slate-600 italic">
                &ldquo;{request.feedback.comment}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Visual Lifecycle Progress Audit Trail */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
            Lifecycle Progress Audit Trail
          </h4>

          {isLoadingTimeline ? (
            <div className="py-4 text-center text-xs text-slate-400">Loading timeline...</div>
          ) : timeline.length === 0 ? (
            <div className="border-l-2 border-slate-200 ml-2 space-y-4 text-xs">
              <div className="relative pl-4">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">Request Registered in System</div>
                <div className="text-[11px] text-slate-500">{formatDate(request.created_at)}</div>
              </div>
            </div>
          ) : (
            <div className="border-l-2 border-slate-200 ml-2 space-y-4 text-xs">
              {timeline.map((item, index) => {
                const isFinal = index === timeline.length - 1;
                const nodeColor =
                  item.new_status === "Resolved"
                    ? "bg-emerald-500"
                    : item.new_status === "Closed" || item.new_status === "Rejected"
                    ? "bg-slate-500"
                    : item.new_status === "In Progress" || item.new_status === "Assigned"
                    ? "bg-blue-500"
                    : "bg-teal-500";

                return (
                  <div key={item.id} className="relative pl-4">
                    <div
                      className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full ${nodeColor} ring-4 ring-white`}
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {item.new_status}
                      </span>
                      {isFinal && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600 mt-0.5">{item.comment}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

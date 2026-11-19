"use client";

import React from "react";
import { ServiceRequest } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Star,
  FileText,
} from "lucide-react";

interface RequestDetailModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (newStatus: string) => void;
}

export function RequestDetailModal({
  request,
  isOpen,
  onClose,
}: RequestDetailModalProps) {
  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={request.tracking_number}
      description={`Submitted on ${formatDate(request.created_at)}`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>
              SLA Deadline:{" "}
              {request.sla_deadline ? formatDate(request.sla_deadline) : "Standard (24h)"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Title & Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <RequestStatusBadge status={request.status} />
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
                {request.location?.building} — {request.location?.room_number}
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
                {request.creator?.full_name} ({request.creator?.role})
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
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {request.description}
          </div>
        </div>

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

        {/* Lifecycle Audit Log */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
            Lifecycle Progress Audit Trail
          </h4>
          <div className="border-l-2 border-slate-200 ml-2 space-y-4 text-xs">
            <div className="relative pl-4">
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white" />
              <div className="font-semibold text-slate-900">Request Registered in System</div>
              <div className="text-[11px] text-slate-500">{formatDate(request.created_at)}</div>
            </div>

            {request.status !== "Submitted" && (
              <div className="relative pl-4">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">
                  Reviewed &amp; Dispatched to {request.department?.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {formatDate(request.updated_at)}
                </div>
              </div>
            )}

            {request.resolved_at && (
              <div className="relative pl-4">
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">
                  Work Confirmed Resolved &amp; Tested
                </div>
                <div className="text-[11px] text-slate-500">
                  {formatDate(request.resolved_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

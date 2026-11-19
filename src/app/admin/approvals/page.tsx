"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_PENDING_APPROVALS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  FileCheck,
  Mail,
  Building,
} from "lucide-react";

interface PendingApprovalItem {
  id: string;
  full_name: string;
  email: string;
  role: "student" | "faculty";
  student_id?: string;
  faculty_id?: string;
  department_name: string;
  submitted_at: string;
  verification_documents: string;
}

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>(DEMO_PENDING_APPROVALS);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<PendingApprovalItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (id: string, name: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    setActionSuccess(`Account for ${name} has been approved and granted system access.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleReject = () => {
    if (!selectedUser) return;
    setApprovals((prev) => prev.filter((a) => a.id !== selectedUser.id));
    setActionSuccess(`Registration for ${selectedUser.full_name} was rejected.`);
    setSelectedUser(null);
    setRejectReason("");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Approval Queue
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Verify academic credentials and grant service request permissions to new campus registrations.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          {approvals.length} Pending Verification
        </span>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {approvals.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All Approvals Clear!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no outstanding student or faculty account registrations pending review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      app.role === "student"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {app.role === "student" ? "Student Applicant" : "Faculty Applicant"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(app.submitted_at)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{app.full_name}</h3>
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.department_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>ID: {app.student_id || app.faculty_id}</span>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{app.verification_documents}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(app)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(app.id, app.full_name)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                >
                  Approve Access
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Reject Account Registration"
        description="Provide a justification for rejecting this account. An automated advisory email will be dispatched to the applicant."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReject}
            >
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Rejecting registration for <strong>{selectedUser?.full_name}</strong> (
            {selectedUser?.email}).
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rejection Reason / Missing Documentation
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Student ID scan unreadable or department enrollment record not found in university directory."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_DEPARTMENTS } from "@/lib/demo-data";
import { Department } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentWorkloadStats,
  DepartmentWorkload,
} from "@/lib/services/departments";
import {
  Plus,
  Mail,
  User,
  Star,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(DEMO_DEPARTMENTS);
  const [workloads, setWorkloads] = useState<DepartmentWorkload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add/Edit Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [headName, setHeadName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDepts = useCallback(() => {
    Promise.all([getDepartments(), getDepartmentWorkloadStats()])
      .then(([deptsData, workloadsData]) => {
        if (deptsData && deptsData.length > 0) setDepartments(deptsData);
        if (workloadsData && workloadsData.length > 0) setWorkloads(workloadsData);
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
    Promise.all([getDepartments(), getDepartmentWorkloadStats()])
      .then(([deptsData, workloadsData]) => {
        if (!isMounted) return;
        if (deptsData && deptsData.length > 0) setDepartments(deptsData);
        if (workloadsData && workloadsData.length > 0) setWorkloads(workloadsData);
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

  const openAddModal = () => {
    setEditingDept(null);
    setName("");
    setDescription("");
    setHeadName("");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description || "");
    setHeadName(dept.head_name || "");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Department name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, name.trim(), description.trim(), headName.trim());
        setFeedbackMsg(`Department ${name} updated successfully.`);
      } else {
        await createDepartment(name.trim(), description.trim(), headName.trim());
        setFeedbackMsg(`Department ${name} created successfully.`);
      }
      setIsModalOpen(false);
      fetchDepts();
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteDepartment(id);
      setDeleteConfirmId(null);
      setFeedbackMsg("Department deleted successfully.");
      fetchDepts();
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: unknown) {
      setFeedbackMsg(err instanceof Error ? err.message : "Failed to delete department.");
      setTimeout(() => setFeedbackMsg(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Service Departments
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure operational departments, dispatch units, team heads, and monitor cross-unit workloads.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Department
        </Button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          {feedbackMsg}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span>Loading department performance data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const workload = workloads.find((w) => w.departmentId === dept.id);

            return (
              <div
                key={dept.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                      {dept.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Unit
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                    {dept.description || "University operational service unit."}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Head: <strong>{dept.head_name || "Assigned by Dean"}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{dept.contact_email || `${dept.code.toLowerCase()}@campus.edu`}</span>
                    </div>
                  </div>

                  {/* Workload Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-[11px]">
                    <div>
                      <div className="font-bold text-slate-900">{workload?.totalRequests || 0}</div>
                      <div className="text-slate-400 text-[10px]">Total Tickets</div>
                    </div>
                    <div>
                      <div className="font-bold text-teal-700">{workload?.inProgressRequests || 0}</div>
                      <div className="text-slate-400 text-[10px]">Active Work</div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-700 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {workload?.satisfactionRating || 4.8}
                      </div>
                      <div className="text-slate-400 text-[10px]">Rating</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(dept)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(dept.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700">
                    {workload?.resolutionRatePercentage || 94}% SLA
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? `Edit ${editingDept.name}` : "Create Service Department"}
        description="Establish a centralized campus dispatch unit and appoint operational leadership."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Department Name"
            required
            placeholder="e.g. Information Technology Services"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Department Head / Lead Technician"
            placeholder="e.g. Dr. Robert Chen"
            value={headName}
            onChange={(e) => setHeadName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description &amp; Operational Scope
            </label>
            <textarea
              rows={3}
              placeholder="Responsibilities, equipment domains, and coverage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {formError}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingDept ? "Save Changes" : "Create Department"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Department Deletion"
        description="Are you sure you want to delete this department? This action will check for active requests before proceeding."
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Departments with linked historical or open tickets cannot be deleted for data integrity and SLA audit compliance.
          </p>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              isLoading={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete Department
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}

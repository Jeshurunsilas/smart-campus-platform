"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_CATEGORIES, DEMO_DEPARTMENTS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RequestPriorityBadge } from "@/components/requests/RequestPriorityBadge";
import { Clock, Plus, CheckCircle2, Sliders, Tag } from "lucide-react";
import { ServiceCategory, RequestPriority } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(DEMO_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  // Add form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState(DEMO_DEPARTMENTS[0]?.id || "dept-facilities");
  const [defaultPriority, setDefaultPriority] = useState<RequestPriority>("Medium");
  const [slaHours, setSlaHours] = useState("24");

  // Edit SLA form fields
  const [editSlaHours, setEditSlaHours] = useState("");
  const [editPriority, setEditPriority] = useState<RequestPriority>("Medium");

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat: ServiceCategory = {
      id: `cat-${Date.now()}`,
      department_id: departmentId,
      name: name.trim(),
      description: description.trim(),
      default_priority: defaultPriority,
      estimated_sla_hours: parseInt(slaHours, 10) || 24,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setCategories((prev) => [newCat, ...prev]);
    setShowAddModal(false);
    setName("");
    setDescription("");
    setSlaHours("24");
    showToast(`Service category "${newCat.name}" created successfully.`);
  };

  const handleSaveEditSLA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const hours = parseInt(editSlaHours, 10) || editingCategory.estimated_sla_hours;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? { ...c, estimated_sla_hours: hours, default_priority: editPriority }
          : c
      )
    );

    showToast(`Updated SLA for ${editingCategory.name} to ${hours} hours.`);
    setEditingCategory(null);
  };

  return (
    <DashboardShell role="administrator">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Service Request Categories &amp; SLAs
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Define ticket categories, automated SLA resolution targets, and default priority classifications.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service Category
        </Button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Assigned Department</th>
              <th className="py-3 px-4">Default Priority</th>
              <th className="py-3 px-4">Target Resolution SLA</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {categories.map((cat) => {
              const dept = DEMO_DEPARTMENTS.find((d) => d.id === cat.department_id);
              return (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{cat.name}</div>
                    <div className="text-[11px] text-slate-400 max-w-sm truncate">
                      {cat.description || "Campus service requests for this domain"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {dept?.name || "Facilities Management"}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <RequestPriorityBadge priority={cat.default_priority} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-teal-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {cat.estimated_sla_hours} Hours
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditSlaHours(String(cat.estimated_sla_hours));
                        setEditPriority(cat.default_priority);
                      }}
                      leftIcon={<Sliders className="w-3.5 h-3.5" />}
                    >
                      Edit SLA
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Service Category"
        description="Configure a new service issue type and establish its baseline resolution SLA."
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Category Name"
            required
            placeholder="e.g. Elevators &amp; Lifts"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<Tag className="w-4 h-4" />}
          />

          <Select
            label="Assigned Campus Department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            options={DEMO_DEPARTMENTS.map((d) => ({
              value: d.id,
              label: d.name,
            }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Default Priority"
              value={defaultPriority}
              onChange={(e) => setDefaultPriority(e.target.value as RequestPriority)}
              options={[
                { value: "Low", label: "Low (48h)" },
                { value: "Medium", label: "Medium (24h)" },
                { value: "High", label: "High (12h)" },
                { value: "Critical", label: "Critical (4h)" },
              ]}
            />

            <Input
              label="Target Resolution SLA (Hours)"
              type="number"
              required
              min="1"
              max="168"
              value={slaHours}
              onChange={(e) => setSlaHours(e.target.value)}
              leftIcon={<Clock className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Scope / Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe what campus equipment or facilities this category covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit SLA Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Adjust SLA: ${editingCategory?.name}`}
        description="Modify the target resolution SLA hours and baseline dispatch priority."
      >
        <form onSubmit={handleSaveEditSLA} className="space-y-4">
          <Input
            label="Resolution SLA Target (Hours)"
            type="number"
            required
            min="1"
            max="168"
            value={editSlaHours}
            onChange={(e) => setEditSlaHours(e.target.value)}
            leftIcon={<Clock className="w-4 h-4" />}
            helperText="Staff performance compliance will be scored against this hourly threshold."
          />

          <Select
            label="Default Classification Priority"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as RequestPriority)}
            options={[
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
              { value: "Critical", label: "Critical" },
            ]}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Apply SLA Policy
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}

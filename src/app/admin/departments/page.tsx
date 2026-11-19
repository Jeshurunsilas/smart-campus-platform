"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_DEPARTMENTS, DEMO_DEPARTMENT_SCORECARDS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Plus, Mail, Phone, User, Star } from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState(DEMO_DEPARTMENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newHead, setNewHead] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    const newDept = {
      id: `dept-${Date.now()}`,
      name: newDeptName,
      code: newDeptCode || "GEN",
      head_name: newHead || "Department Head",
      contact_email: newEmail || "contact@campus.edu",
      contact_phone: "+1 (555) 000-0000",
      description: "University operational service unit.",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDepartments((prev) => [...prev, newDept]);
    setShowAddModal(false);
    setNewDeptName("");
    setNewDeptCode("");
    setNewHead("");
    setNewEmail("");
  };

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Service Departments
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure operational departments, dispatch units, team heads, and contact routing.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const scorecard = DEMO_DEPARTMENT_SCORECARDS.find(
            (s) => s.department_id === dept.id
          );

          return (
            <div
              key={dept.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
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
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  {dept.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Head: {dept.head_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.contact_email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dept.contact_phone}</span>
                  </div>
                </div>
              </div>

              {scorecard && (
                <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Tickets
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {scorecard.total_requests}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Avg Time
                    </div>
                    <div className="font-bold text-teal-700 mt-0.5">
                      {scorecard.avg_resolution_hours}h
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Rating
                    </div>
                    <div className="font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {scorecard.avg_satisfaction_rating}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Campus Department"
        description="Register a new operational unit to handle campus service tickets."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Department Full Name"
            required
            placeholder="e.g. Grounds & Landscape Operations"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department Code"
              required
              placeholder="e.g. GLO"
              value={newDeptCode}
              onChange={(e) => setNewDeptCode(e.target.value)}
            />
            <Input
              label="Department Head"
              placeholder="e.g. Dr. Jane Smith"
              value={newHead}
              onChange={(e) => setNewHead(e.target.value)}
            />
          </div>

          <Input
            label="Dispatch Email Address"
            type="email"
            placeholder="e.g. grounds@campus.edu"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}

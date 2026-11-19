"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_ANNOUNCEMENTS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Calendar } from "lucide-react";
import { UserRole } from "@/types";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(DEMO_ANNOUNCEMENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"Maintenance" | "General" | "Emergency">("Maintenance");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const newAnc = {
      id: `anc-${Date.now()}`,
      title,
      content,
      category,
      priority,
      target_roles: ["student", "faculty", "staff", "administrator"] as UserRole[],
      published_by: "usr-admin-01",
      is_published: true,
      created_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    setShowAddModal(false);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Announcements Manager
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Publish official advisories, scheduled outage warnings, and facility notices to students and faculty.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publish Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {anc.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(anc.created_at)}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {anc.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 capitalize">
                Priority: <strong>{anc.priority}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(anc.id)}
                className="text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Announcement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Broadcast Campus Announcement"
        description="Write an official notice to be displayed on student and faculty dashboards."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Announcement Title"
            required
            placeholder="e.g. Science Quad Water Pressure Upgrade Scheduled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as "Maintenance" | "General" | "Emergency")}
              options={[
                { value: "Maintenance", label: "Maintenance" },
                { value: "General", label: "General" },
                { value: "Emergency", label: "Emergency Alert" },
              ]}
            />

            <Select
              label="Urgency Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Message Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide exact timings, affected buildings, emergency contact numbers..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}

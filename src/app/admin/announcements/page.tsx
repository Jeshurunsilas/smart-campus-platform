"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_ANNOUNCEMENTS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Calendar, CheckCircle2, Megaphone } from "lucide-react";
import { UserRole, CampusAnnouncement } from "@/types";
import {
  getCampusAnnouncements,
  createCampusAnnouncement,
  deleteCampusAnnouncement,
} from "@/lib/services/announcements";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(DEMO_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"Maintenance" | "General" | "Emergency">("Maintenance");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [targetAudience, setTargetAudience] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCampusAnnouncements("all")
      .then((data) => {
        if (isMounted) {
          setAnnouncements(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load announcements:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);

    try {
      await createCampusAnnouncement(title.trim(), content.trim(), targetAudience);
      const newAnc: CampusAnnouncement = {
        id: `anc-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
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
      showToast("Campus advisory announcement published successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish notice.";
      showToast(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCampusAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast("Announcement removed from public feed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete notice.";
      showToast(`Error: ${msg}`);
    }
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

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
          <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          No announcements published. Broadcast an advisory to campus users above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      anc.category === "Emergency"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : anc.category === "Maintenance"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-teal-50 text-teal-700 border-teal-200"
                    }`}
                  >
                    {anc.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(anc.created_at)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {anc.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 capitalize">
                  Priority: <strong className="text-slate-800">{anc.priority}</strong>
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
      )}

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <Select
              label="Target Audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              options={[
                { value: "all", label: "All Campus Users" },
                { value: "student", label: "Students Only" },
                { value: "faculty", label: "Faculty Only" },
                { value: "department_staff", label: "Staff Only" },
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
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Broadcasting..." : "Broadcast Notice"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { UserProfile, Department } from "@/types";
import {
  getRegisteredUsers,
  toggleUserStatus,
  provisionStaffAccount,
} from "@/lib/services/profiles";
import { getDepartments } from "@/lib/services/departments";
import { formatDate } from "@/lib/utils";
import {
  Search,
  UserPlus,
  Shield,
  GraduationCap,
  Briefcase,
  Wrench,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffDeptId, setNewStaffDeptId] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"department_staff" | "administrator">("department_staff");
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [isSubmittingProvision, setIsSubmittingProvision] = useState(false);

  const fetchUsers = useCallback(() => {
    Promise.all([
      getRegisteredUsers(searchTerm, roleFilter, statusFilter),
      getDepartments(),
    ])
      .then(([userData, depts]) => {
        if (userData) setUsers(userData);
        if (depts) setDepartments(depts);
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getRegisteredUsers(searchTerm, roleFilter, statusFilter),
      getDepartments(),
    ])
      .then(([userData, depts]) => {
        if (!isMounted) return;
        if (userData) setUsers(userData);
        if (depts) setDepartments(depts);
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
  }, [searchTerm, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.approval_status === "approved" ? "rejected" : "approved";
    setActionLoadingId(user.id);
    try {
      await toggleUserStatus(user.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, approval_status: nextStatus } : u))
      );
    } catch {
      // Error
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleProvisionStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffDeptId) {
      setProvisionError("Please complete all required fields.");
      return;
    }

    setIsSubmittingProvision(true);
    setProvisionError(null);
    try {
      await provisionStaffAccount({
        full_name: newStaffName.trim(),
        email: newStaffEmail.trim(),
        department_id: newStaffDeptId,
        role: newStaffRole,
      });
      setIsProvisionModalOpen(false);
      setNewStaffName("");
      setNewStaffEmail("");
      fetchUsers();
    } catch (err: unknown) {
      setProvisionError(err instanceof Error ? err.message : "Failed to provision account.");
    } finally {
      setIsSubmittingProvision(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
      case "faculty":
        return <Briefcase className="w-3.5 h-3.5 text-emerald-600" />;
      case "department_staff":
      case "staff":
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Management Directory
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Browse, inspect, and manage permissions for all registered students, faculty, and field technicians.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          onClick={() => {
            if (departments.length > 0 && !newStaffDeptId) {
              setNewStaffDeptId(departments[0].id);
            }
            setIsProvisionModalOpen(true);
          }}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Provision Staff Account
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name or official email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Department Staff</option>
            <option value="administrator">Administrators</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved / Active</option>
            <option value="pending">Pending Approval</option>
            <option value="rejected">Rejected / Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span>Synchronizing user directory records...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Users Found</h3>
          <p className="text-xs text-slate-500">Try modifying your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Identifier / ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => {
                  const dept = departments.find((d) => d.id === u.department_id);
                  const isApproved = u.approval_status === "approved";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{u.full_name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold capitalize text-xs bg-slate-100 text-slate-800">
                          {getRoleIcon(u.role)}
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                        {u.student_id || u.faculty_id || u.staff_id || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {dept?.name || "General Campus"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : u.approval_status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          {u.approval_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(u)}
                            leftIcon={<Eye className="w-3.5 h-3.5 text-slate-400" />}
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(u)}
                            isLoading={actionLoadingId === u.id}
                            className={
                              isApproved
                                ? "text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
                            }
                          >
                            {isApproved ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision Staff Modal */}
      <Modal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        title="Provision Department Staff Account"
        description="Authorize and issue credentials for university service department technicians and dispatch administrators."
      >
        <form onSubmit={handleProvisionStaff} className="space-y-4">
          <Input
            label="Technician Full Name"
            required
            placeholder="e.g. John Doe"
            value={newStaffName}
            onChange={(e) => setNewStaffName(e.target.value)}
          />

          <Input
            label="Official University Staff Email"
            required
            type="email"
            placeholder="e.g. j.doe@staff.campus.edu"
            value={newStaffEmail}
            onChange={(e) => setNewStaffEmail(e.target.value)}
          />

          <Select
            label="Assigned Service Department"
            required
            value={newStaffDeptId}
            onChange={(e) => setNewStaffDeptId(e.target.value)}
            options={departments.map((d) => ({
              value: d.id,
              label: `${d.name} (${d.code})`,
            }))}
          />

          <Select
            label="Access Privilege Role"
            required
            value={newStaffRole}
            onChange={(e) =>
              setNewStaffRole(e.target.value as "department_staff" | "administrator")
            }
            options={[
              { value: "department_staff", label: "Department Field Technician" },
              { value: "administrator", label: "Operations Administrator" },
            ]}
          />

          {provisionError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {provisionError}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProvisionModalOpen(false)}
              disabled={isSubmittingProvision}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmittingProvision}>
              Provision &amp; Approve
            </Button>
          </div>
        </form>
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Account Record"
        description="Comprehensive credentials and role authorization details."
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Legal Name:</span>
                <span className="font-bold text-slate-900">{selectedUser.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Campus Email:</span>
                <span className="font-semibold text-slate-800">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">System Role:</span>
                <span className="font-semibold capitalize text-teal-700">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Identification Number:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedUser.student_id || selectedUser.faculty_id || selectedUser.staff_id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Approval Status:</span>
                <span className="font-bold uppercase text-emerald-700">
                  {selectedUser.approval_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Created:</span>
                <span className="text-slate-700">{formatDate(selectedUser.created_at)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}

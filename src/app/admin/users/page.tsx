"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: "u-1",
      name: "Alex Morgan",
      email: "alex.morgan@campus.edu",
      role: "student",
      identifier: "CS-2024-8841",
      department: "Computer Science",
      status: "approved",
      joined: "2024-09-01T08:00:00Z",
    },
    {
      id: "u-2",
      name: "Dr. Elena Vance",
      email: "elena.vance@campus.edu",
      role: "faculty",
      identifier: "FAC-ENG-402",
      department: "Electrical Engineering",
      status: "approved",
      joined: "2023-01-15T09:30:00Z",
    },
    {
      id: "u-3",
      name: "Marcus Brody",
      email: "marcus.brody@campus.edu",
      role: "staff",
      identifier: "STF-OPS-109",
      department: "Facilities & Maintenance",
      status: "approved",
      joined: "2022-06-10T11:00:00Z",
    },
    {
      id: "u-4",
      name: "Daniel Cho",
      email: "daniel.cho@student.campus.edu",
      role: "student",
      identifier: "CS-2026-1049",
      department: "Computer Science",
      status: "pending",
      joined: "2026-11-19T10:14:00Z",
    },
    {
      id: "u-5",
      name: "Prof. Kenneth Sterling",
      email: "k.sterling@faculty.campus.edu",
      role: "faculty",
      identifier: "FAC-PHY-290",
      department: "Physics",
      status: "pending",
      joined: "2026-11-19T08:30:00Z",
    },
  ];

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.identifier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <DashboardShell role="administrator">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Management Directory
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Browse and manage student, faculty, and service department staff accounts across the university.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Department Staff</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">ID Number</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === "student"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : u.role === "faculty"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  {u.identifier}
                </td>
                <td className="py-3 px-4">{u.department}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{formatDate(u.joined)}</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

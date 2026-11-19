"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_CATEGORIES, DEMO_DEPARTMENTS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { RequestPriorityBadge } from "@/components/requests/RequestPriorityBadge";
import { Clock, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const categories = DEMO_CATEGORIES;

  return (
    <DashboardShell role="administrator">
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
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service Category
        </Button>
      </div>

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
                      {cat.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {dept?.name || "Facilities"}
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
                    <Button variant="ghost" size="sm">
                      Edit SLA
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

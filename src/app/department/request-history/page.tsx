"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_REQUESTS } from "@/lib/demo-data";
import { ServiceRequest } from "@/types";
import { getStaffAssignedRequests } from "@/lib/services/requests";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { RequestPriorityBadge } from "@/components/requests/RequestPriorityBadge";
import { RequestDetailModal } from "@/components/requests/RequestDetailModal";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Star,
  Search,
  MapPin,
  Calendar,
  Award,
} from "lucide-react";

export default function DepartmentRequestHistoryPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(DEMO_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    let isMounted = true;
    getStaffAssignedRequests()
      .then((data) => {
        if (isMounted) {
          setRequests(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load staff requests history:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const historyRequests = requests.filter(
    (r) => r.status === "Resolved" || r.status === "Closed"
  );

  const filtered = historyRequests.filter((r) => {
    return (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      (r.location?.building && r.location.building.toLowerCase().includes(search.toLowerCase())) ||
      (r.creator?.full_name && r.creator.full_name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <DashboardShell role="staff">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Completed Work Order History
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Archived logs of completed service requests, field resolutions, and requester ratings.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {historyRequests.length} Total Completed
        </span>
      </div>

      {/* Historical Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Total Work Orders Resolved</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{historyRequests.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% verified closure</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Average Turnaround</div>
            <div className="text-2xl font-extrabold text-teal-800 mt-0.5">3.8 hrs</div>
            <div className="text-[11px] text-teal-600 font-semibold mt-0.5">Target: &lt; 6.0 hrs</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Average Service Rating</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
              4.9 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Outstanding field rating</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search completed logs by ticket number, requester, or building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading history...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No completed work orders match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Resolved Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Recipient CSAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {req.tracking_number}
                    </td>
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-semibold text-slate-900 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Requested by {req.creator?.full_name || "Campus User"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.location?.room_number || req.location?.building || "Campus"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RequestPriorityBadge priority={req.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.resolved_at ? formatDate(req.resolved_at) : formatDate(req.updated_at)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RequestStatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>5.0 / 5.0</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </DashboardShell>
  );
}

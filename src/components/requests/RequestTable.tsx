"use client";

import React, { useState, useMemo } from "react";
import { ServiceRequest } from "@/types";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { RequestDetailModal } from "./RequestDetailModal";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Eye,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RequestTableProps {
  requests: ServiceRequest[];
  title?: string;
  showDepartment?: boolean;
  emptyMessage?: string;
}

export function RequestTable({
  requests,
  title,
  showDepartment = true,
  emptyMessage = "No service requests found matching your filter criteria.",
}: RequestTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.location?.room_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || req.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      {/* Table Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {title && <h3 className="text-sm font-bold text-slate-900">{title}</h3>}

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracking #, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Tracking ID</th>
              <th className="py-3 px-4">Title &amp; Category</th>
              {showDepartment && <th className="py-3 px-4">Department</th>}
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={showDepartment ? 8 : 7}
                  className="py-10 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {req.tracking_number}
                  </td>
                  <td className="py-3 px-4 max-w-[260px]">
                    <div className="font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                      {req.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {req.category?.name || "General"}
                    </div>
                  </td>
                  {showDepartment && (
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {req.department?.name || "Facilities"}
                    </td>
                  )}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.location?.room_number || req.location?.building}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <RequestPriorityBadge priority={req.priority} size="sm" />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <RequestStatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(req.created_at)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {filteredRequests.length === 0 ? (
          <div className="py-8 px-4 text-center text-xs text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="p-4 space-y-2.5 active:bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {req.tracking_number}
                </span>
                <RequestStatusBadge status={req.status} size="sm" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {req.title}
              </h4>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{req.location?.room_number}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatDate(req.created_at)}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <RequestPriorityBadge priority={req.priority} size="sm" />
                <span className="text-xs font-semibold text-teal-700">View Details &rarr;</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Detail Viewer */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}

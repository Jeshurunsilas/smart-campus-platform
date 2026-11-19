"use client";

import React, { useState, useMemo } from "react";
import { ServiceRequest, RequestStatus } from "@/types";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { RequestDetailModal } from "./RequestDetailModal";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Eye,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RequestTableProps {
  requests: ServiceRequest[];
  title?: string;
  showDepartment?: boolean;
  emptyMessage?: string;
  onRequestCancelled?: (requestId: string) => void;
}

export function RequestTable({
  requests,
  title,
  showDepartment = true,
  emptyMessage = "No service requests found matching your filter criteria.",
  onRequestCancelled,
}: RequestTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority" | "status">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Extract unique department names from requests
  const uniqueDepartments = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.department?.name) set.add(r.department.name);
    });
    return Array.from(set);
  }, [requests]);

  // Filtering and Sorting
  const filteredAndSortedRequests = useMemo(() => {
    const priorityWeights: Record<string, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const result = requests.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.location?.room_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || req.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || req.priority === priorityFilter;
      const matchesDepartment =
        departmentFilter === "all" || (req.department?.name || "") === departmentFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "priority") {
        return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [requests, searchTerm, statusFilter, priorityFilter, departmentFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSortedRequests.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedRequests.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedRequests, currentPage, pageSize]);

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (selectedRequest) {
      setSelectedRequest({
        ...selectedRequest,
        status: newStatus,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      {/* Table Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {title && <h3 className="text-sm font-bold text-slate-900">{title}</h3>}

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracking #, title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
            />
          </div>

          {/* Department Filter */}
          {showDepartment && uniqueDepartments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
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
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Sorting */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (High-Low)</option>
              <option value="status">Status</option>
            </select>
          </div>
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
            {paginatedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={showDepartment ? 8 : 7}
                  className="py-10 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req) => (
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
        {paginatedRequests.length === 0 ? (
          <div className="py-8 px-4 text-center text-xs text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          paginatedRequests.map((req) => (
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

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{totalItems}</span> requests
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modal Detail Viewer */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onStatusUpdate={handleStatusChange}
        onRequestCancelled={(id) => {
          if (onRequestCancelled) onRequestCancelled(id);
        }}
      />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Megaphone,
  Bell,
  User,
  Users,
  UserCheck,
  Building2,
  FolderTree,
  BarChart3,
  Settings,
  Wrench,
  History,
  LogOut,
  Shield,
  GraduationCap,
  Briefcase,
  Database,
  BookOpen,
  FileText,
  Award,
  Calendar,
  FolderKanban,
  Radio,
  Activity,
  Zap,
  Compass,
  Flame,
  Clock,
} from "lucide-react";

interface RoleSidebarProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  onCloseMobile?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export function RoleSidebar({
  role,
  userName = "Demo User",
  userEmail = "demo@campus.edu",
  onCloseMobile,
}: RoleSidebarProps) {
  const pathname = usePathname();

  const roleNavItems: Record<UserRole, NavItem[]> = {
    student: [
      { title: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
      { title: "Course Catalogue", href: "/student/courses", icon: BookOpen },
      { title: "My Courses", href: "/student/my-courses", icon: GraduationCap },
      { title: "My Course Requests", href: "/student/course-requests", icon: Clock },
      { title: "Assignments", href: "/student/assignments", icon: FileText, badge: 2 },
      { title: "Tests & Exams", href: "/student/examinations", icon: Award },
      { title: "Marks & Grades", href: "/student/grades", icon: BarChart3 },
      { title: "Capstone Projects", href: "/student/projects", icon: FolderKanban },
      { title: "Attendance", href: "/student/attendance", icon: Calendar },
      { title: "My Requests", href: "/student/requests", icon: ClipboardList, badge: 3 },
      { title: "Create Request", href: "/student/requests/new", icon: PlusCircle },
      { title: "Announcements", href: "/student/announcements", icon: Megaphone },
      { title: "Notifications", href: "/student/notifications", icon: Bell, badge: 2 },
      { title: "My Profile", href: "/student/profile", icon: User },
    ],
    faculty: [
      { title: "Overview", href: "/faculty/dashboard", icon: LayoutDashboard },
      { title: "My Courses", href: "/faculty/courses", icon: BookOpen },
      { title: "Create Course", href: "/faculty/courses/create", icon: PlusCircle },
      { title: "Course Requests", href: "/faculty/course-requests", icon: Users, badge: 2 },
      { title: "Faculty Collaboration", href: "/faculty/collaboration", icon: UserCheck },
      { title: "Assignments", href: "/faculty/assignments", icon: FileText, badge: 3 },
      { title: "Tests & Exams", href: "/faculty/examinations", icon: Calendar },
      { title: "Gradebook", href: "/faculty/gradebook", icon: Award },
      { title: "Project Reviews", href: "/faculty/projects", icon: FolderKanban },
      { title: "Attendance", href: "/faculty/attendance", icon: Clock },
      { title: "Classroom Readiness", href: "/faculty/readiness", icon: Activity },
      { title: "My Requests", href: "/faculty/requests", icon: ClipboardList, badge: 4 },
      { title: "Create Request", href: "/faculty/requests/new", icon: PlusCircle },
      { title: "Announcements", href: "/faculty/announcements", icon: Megaphone },
      { title: "Notifications", href: "/faculty/notifications", icon: Bell, badge: 1 },
      { title: "My Profile", href: "/faculty/profile", icon: User },
    ],
    administrator: [
      { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "All Courses", href: "/admin/courses", icon: BookOpen },
      { title: "Course Approval", href: "/admin/course-approvals", icon: Shield, badge: 1 },
      { title: "Course Requests", href: "/admin/course-requests", icon: Users },
      { title: "Enrolment Management", href: "/admin/enrolments", icon: UserCheck, badge: 4 },
      { title: "Command Centre", href: "/admin/command-centre", icon: Radio, badge: "LIVE" },
      { title: "Incident Management", href: "/admin/incidents", icon: Flame, badge: 1 },
      { title: "Predictive Maintenance", href: "/admin/predictive-maintenance", icon: Activity, badge: 2 },
      { title: "Asset Lifecycle & QR", href: "/admin/assets", icon: Wrench },
      { title: "IoT Sensor Simulator", href: "/admin/iot-simulator", icon: Zap },
      { title: "Sustainability & Energy", href: "/admin/sustainability", icon: Zap },
      { title: "Resource Optimiser", href: "/admin/resource-optimiser", icon: Compass },
      { title: "User Management", href: "/admin/users", icon: Users },
      { title: "Account Approvals", href: "/admin/approvals", icon: UserCheck, badge: 3 },
      { title: "Service Requests", href: "/admin/requests", icon: ClipboardList, badge: 7 },
      { title: "Departments", href: "/admin/departments", icon: Building2 },
      { title: "Categories", href: "/admin/categories", icon: FolderTree },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { title: "Demo Data", href: "/admin/demo-data", icon: Database },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
    staff: [
      { title: "Overview", href: "/department/dashboard", icon: LayoutDashboard },
      { title: "Assigned Requests", href: "/department/assigned-requests", icon: Wrench, badge: 2 },
      { title: "Monitored Assets", href: "/department/assets", icon: Activity },
      { title: "Request History", href: "/department/request-history", icon: History },
      { title: "Notifications", href: "/department/notifications", icon: Bell, badge: 1 },
      { title: "My Profile", href: "/department/profile", icon: User },
    ],
  };

  const navItems = roleNavItems[role] || roleNavItems.student;

  const roleMeta: Record<
    UserRole,
    { label: string; icon: React.ElementType; color: string; badgeBg: string }
  > = {
    student: {
      label: "Student Portal",
      icon: GraduationCap,
      color: "text-blue-400",
      badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    faculty: {
      label: "Faculty Portal",
      icon: Briefcase,
      color: "text-emerald-400",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    administrator: {
      label: "Administrator HQ",
      icon: Shield,
      color: "text-purple-400",
      badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    staff: {
      label: "Department Dispatch",
      icon: Wrench,
      color: "text-amber-400",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  };

  const currentRole = roleMeta[role];
  const RoleIcon = currentRole.icon;

  return (
    <aside className="w-64 bg-[#101828] text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            SC
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight leading-none">
              SmartCampus
            </div>
            <div className="text-[11px] text-teal-400 font-medium mt-0.5">
              Service Management
            </div>
          </div>
        </Link>
      </div>

      {/* Active Role Indicator */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50">
        <div
          className={cn(
            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold",
            currentRole.badgeBg
          )}
        >
          <RoleIcon className={cn("w-3.5 h-3.5", currentRole.color)} />
          <span>{currentRole.label}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                isActive
                  ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/70"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.title}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-teal-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{userName}</div>
              <div className="text-[11px] text-slate-400 truncate">{userEmail}</div>
            </div>
          </div>
        </div>

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

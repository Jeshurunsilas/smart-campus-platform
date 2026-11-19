"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { RoleSidebar } from "./RoleSidebar";
import { TopNavbar } from "./TopNavbar";
import { DEMO_USERS } from "@/lib/demo-data";

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = DEMO_USERS[role] || DEMO_USERS.student;

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden text-slate-900">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <RoleSidebar
          role={role}
          userName={currentUser.full_name}
          userEmail={currentUser.email}
        />
      </div>

      {/* Mobile Sidebar Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#101828] z-10 animate-in slide-in-from-left">
            <RoleSidebar
              role={role}
              userName={currentUser.full_name}
              userEmail={currentUser.email}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          role={role}
          userName={currentUser.full_name}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_USERS } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";

export default function DepartmentProfilePage() {
  const user = DEMO_USERS.staff;
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardShell role="staff">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Staff Member Profile
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Field service credentials, assigned maintenance department, and mobile contact details.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-3xl bg-amber-950 text-amber-400 font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{user.full_name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Authorized Staff
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff ID: <span className="font-mono font-bold text-slate-700">{user.staff_id}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={user.full_name}
                disabled
              />
              <Input
                label="Staff Badge ID"
                value={user.staff_id || ""}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Department Email"
                value={user.email}
                disabled
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Radio / Dispatch Mobile Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {saved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Contact details updated successfully!
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}

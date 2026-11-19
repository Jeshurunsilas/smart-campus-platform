"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DEMO_DEPARTMENTS } from "@/lib/demo-data";
import {
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  BadgeAlert,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"student" | "faculty">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState(""); // Student ID or Faculty ID
  const [departmentId, setDepartmentId] = useState(DEMO_DEPARTMENTS[0].id);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.length < 2) {
      errs.fullName = "Please enter your full legal name.";
    }
    if (!email.trim() || !email.includes("@")) {
      errs.email = "Please enter a valid campus email address.";
    }
    if (!identifier.trim()) {
      errs.identifier =
        role === "student" ? "Student Registration Number is required." : "Faculty Employee ID is required.";
    }
    if (!password || password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 700);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Pending Administrator Approval
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-4">
            Registration Submitted
          </h2>
          <p className="mt-3 text-xs text-slate-600 leading-relaxed">
            Thank you, <strong>{fullName}</strong>. In accordance with university campus security policy, new {role} accounts require administrator credential verification.
          </p>
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 text-slate-600">
            <div>
              <strong>Email:</strong> {email}
            </div>
            <div>
              <strong>Role:</strong> {role === "student" ? "Student" : "Faculty Member"}
            </div>
            <div>
              <strong>ID:</strong> {identifier}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="primary" onClick={() => router.push("/login")}>
              Go to Login Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#101828] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            SC
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            SmartCampus
          </span>
        </Link>
        <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your Campus Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Select your campus affiliation to get started with service tracking.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === "student"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Student Registration</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("faculty")}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === "faculty"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Faculty Registration</span>
          </button>
        </div>

        {/* Registration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              required
              leftIcon={<User className="w-4 h-4" />}
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
            />

            <Input
              label={role === "student" ? "University Student Email" : "University Faculty Email"}
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder={role === "student" ? "student.name@student.campus.edu" : "prof.name@faculty.campus.edu"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={role === "student" ? "Registration Number" : "Faculty Employee ID"}
                required
                placeholder={role === "student" ? "e.g. CS-2026-8841" : "e.g. FAC-ENG-402"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={errors.identifier}
              />

              <Select
                label="Academic Department"
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                options={DEMO_DEPARTMENTS.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password (min. 8 characters)"
                type="password"
                required
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />
            </div>

            {/* Approval Notice */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <BadgeAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Approval Requirement:</strong> New {role} registrations require manual administrative verification before service submission privileges are granted.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Registration for Approval
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an approved account?{" "}
            <Link
              href="/login"
              className="font-bold text-slate-900 hover:text-teal-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

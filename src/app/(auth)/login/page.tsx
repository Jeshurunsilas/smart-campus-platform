"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signInWithEmail } from "@/lib/services/auth";
import {
  GraduationCap,
  Briefcase,
  Shield,
  Wrench,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "DemoCampus2026!";

const DEMO_PROFILES = [
  {
    role: "student",
    name: "Rahul Kumar",
    email: "student@smartcampus.demo",
    label: "Student",
    icon: GraduationCap,
    iconColor: "text-blue-600",
    bgColor: "hover:bg-blue-50 border-blue-200",
    desc: "Create and track campus service tickets",
  },
  {
    role: "faculty",
    name: "Priya Sharma",
    email: "faculty@smartcampus.demo",
    label: "Faculty",
    icon: Briefcase,
    iconColor: "text-emerald-600",
    bgColor: "hover:bg-emerald-50 border-emerald-200",
    desc: "Submit priority academic & facility requests",
  },
  {
    role: "staff",
    name: "Arjun Kumar",
    email: "staff@smartcampus.demo",
    label: "Department Staff",
    icon: Wrench,
    iconColor: "text-amber-600",
    bgColor: "hover:bg-amber-50 border-amber-200",
    desc: "Manage tickets, update status & SLA",
  },
  {
    role: "admin",
    name: "Campus Administrator",
    email: "admin@smartcampus.demo",
    label: "Administrator",
    icon: Shield,
    iconColor: "text-purple-600",
    bgColor: "hover:bg-purple-50 border-purple-200",
    desc: "Platform governance, analytics & seeding",
  },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("student@smartcampus.demo");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "account_pending_approval"
      ? "Your account is currently pending administrator verification. Please check back later."
      : ""
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithEmail(email, password);

      if (result.isDemo) {
        if (result.demoRole === "faculty") {
          router.push("/faculty/dashboard");
        } else if (result.demoRole === "staff" || result.demoRole === "department_staff") {
          router.push("/department/dashboard");
        } else if (result.demoRole === "administrator" || result.demoRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } else if (result.profile) {
        const role = result.profile.role;
        if (role === "faculty") {
          router.push("/faculty/dashboard");
        } else if (role === "department_staff") {
          router.push("/department/dashboard");
        } else if (role === "administrator") {
          router.push("/admin/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please check your credentials.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoRole = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#101828] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            SC
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            SmartCampus
          </span>
        </Link>
        <h2 className="mt-4 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Service Management Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to access your role-specific dashboard and campus service tickets.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        {/* Dedicated Demo Accounts Section */}
        <div className="mb-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Demo Accounts (Instant One-Click Pre-fill)</span>
            </div>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
              4 Roles Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {DEMO_PROFILES.map((p) => {
              const Icon = p.icon;
              const isSelected = email === p.email;
              return (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => selectDemoRole(p.email)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-teal-50/70 border-teal-500 ring-1 ring-teal-500 shadow-2xs"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/80"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 ${p.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 truncate">{p.name}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">
                        {p.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{p.email}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Initial Administrator Setup Alert Callout */}
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">Initial campus deployment? Setup your root administrator:</span>
          </div>
          <Link
            href="/setup-admin"
            className="text-amber-800 font-bold hover:text-amber-900 underline ml-2 shrink-0"
          >
            Setup Admin &rarr;
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Campus Email Address"
              type="email"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@campus.edu"
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-slate-600">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-slate-900 hover:text-teal-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
            &larr; Back to Platform Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center text-xs text-slate-500">Loading portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

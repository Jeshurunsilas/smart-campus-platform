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

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("alex.morgan@campus.edu");
  const [password, setPassword] = useState("password123");
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
        } else if (result.demoRole === "staff") {
          router.push("/department/dashboard");
        } else if (result.demoRole === "administrator") {
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

  const selectDemoRole = (role: "student" | "faculty" | "staff" | "admin") => {
    if (role === "student") {
      setEmail("alex.morgan@campus.edu");
      setPassword("password123");
    } else if (role === "faculty") {
      setEmail("elena.vance@campus.edu");
      setPassword("password123");
    } else if (role === "staff") {
      setEmail("marcus.brody@campus.edu");
      setPassword("password123");
    } else {
      setEmail("sarah.jenkins@campus.edu");
      setPassword("password123");
    }
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
          Sign in to access your role-specific dashboard and service tickets.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {/* Quick Demo Role Picker Banner */}
        <div className="mb-4 p-4 rounded-2xl bg-teal-50 border border-teal-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Phase 3 Authentication Quick-Fill:
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => selectDemoRole("student")}
              className="py-1.5 px-2 rounded-lg bg-white border border-teal-200 text-slate-700 hover:bg-teal-100 font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <GraduationCap className="w-3 h-3 text-blue-600" />
              Student
            </button>
            <button
              type="button"
              onClick={() => selectDemoRole("faculty")}
              className="py-1.5 px-2 rounded-lg bg-white border border-teal-200 text-slate-700 hover:bg-teal-100 font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Briefcase className="w-3 h-3 text-emerald-600" />
              Faculty
            </button>
            <button
              type="button"
              onClick={() => selectDemoRole("staff")}
              className="py-1.5 px-2 rounded-lg bg-white border border-teal-200 text-slate-700 hover:bg-teal-100 font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Wrench className="w-3 h-3 text-amber-600" />
              Staff
            </button>
            <button
              type="button"
              onClick={() => selectDemoRole("admin")}
              className="py-1.5 px-2 rounded-lg bg-white border border-teal-200 text-slate-700 hover:bg-teal-100 font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-purple-600" />
              Admin
            </button>
          </div>
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
} from "lucide-react";

export default function SetupAdminPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [setupAvailable, setSetupAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/setup")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setSetupAvailable(!!data.setupAvailable);
          setIsCheckingSetup(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSetupAvailable(true);
          setIsCheckingSetup(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize administrator account.");
      }

      setSuccessMsg("Administrator account provisioned successfully! Redirecting to command center...");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error during administrator creation.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#101828] text-white shadow-xl mb-4">
          <Building2 className="w-7 h-7 text-teal-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Initial Administrator Provisioning
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Establish the root executive administrator identity for the Smart Campus Platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Checking Setup State */}
          {isCheckingSetup ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-3">
              <Loader2 className="w-7 h-7 text-teal-600 animate-spin mx-auto" />
              <p>Verifying campus platform administration status...</p>
            </div>
          ) : !setupAvailable ? (
            /* Disabled / Already Initialized View */
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Initial Setup is Permanently Disabled
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  An administrator account has already been initialized for this university installation. Public administrator registration is restricted.
                </p>
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                  Existing administrators can provision additional staff or admin identities directly from{" "}
                  <strong className="text-slate-800">/admin/users</strong>.
                </div>
              </div>

              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" className="w-full justify-center">
                    Return to Campus Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Setup Form */
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs text-teal-950 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span>
                  <strong>One-Time Secure Initialization:</strong> Once created, this page will be permanently locked against public access.
                </span>
              </div>

              <Input
                label="Full Legal Name"
                required
                placeholder="e.g. Dr. Arthur Pendelton"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                disabled={isSubmitting}
              />

              <Input
                label="Institutional Email Address"
                type="email"
                required
                placeholder="admin@smartcampus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                disabled={isSubmitting}
                helperText="This email will receive priority dispatch alerts and supervisor notifications."
              />

              <Input
                label="Master Administrator Password"
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isSubmitting}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isSubmitting}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center bg-[#101828] hover:bg-slate-800 text-white"
                  disabled={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isSubmitting ? "Provisioning Administrator..." : "Create Administrator Account"}
                </Button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-teal-700 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

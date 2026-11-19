"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid campus email address.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email and we will send you secure recovery instructions.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Check Your Campus Inbox
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Registered Email Address"
                type="email"
                required
                leftIcon={<Mail className="w-4 h-4" />}
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Password Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DEMO_USERS } from "@/lib/demo-data";
import { UserProfile } from "@/types";
import { getCurrentUserProfile } from "@/lib/services/auth";
import { updateUserProfile } from "@/lib/services/profiles";
import { uploadProfileAvatar, validateImageFile } from "@/lib/services/storage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Mail,
  ShieldCheck,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  Loader2,
  Lock,
} from "lucide-react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<UserProfile>(DEMO_USERS.student);
  const [fullName, setFullName] = useState(user.full_name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url || null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserProfile()
      .then((profile) => {
        if (profile) {
          setUser(profile);
          setFullName(profile.full_name);
          setPhoneNumber(profile.phone_number || "");
          setAvatarUrl(profile.avatar_url || null);
        }
      })
      .catch(() => {
        // Fallback to demo
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setErrorMsg(validation.error || "Invalid image file.");
        return;
      }

      setIsUploadingPhoto(true);
      try {
        const uploadedUrl = await uploadProfileAvatar(file);
        setAvatarUrl(uploadedUrl);
        await updateUserProfile(user.id, { avatar_url: uploadedUrl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to upload avatar.");
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Full legal name cannot be blank.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    try {
      await updateUserProfile(user.id, {
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        avatar_url: avatarUrl || undefined,
      });
      setUser((prev) => ({
        ...prev,
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Profile
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            View your campus enrollment details, verified credentials, and communication preferences.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 flex items-center justify-center gap-3 text-slate-500 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <span>Loading user profile...</span>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
            {/* Approval Status Banner */}
            {user.approval_status === "approved" ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Account Verified: Full campus service privileges active.</span>
                </div>
                <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px] uppercase">
                  Approved
                </span>
              </div>
            ) : user.approval_status === "pending" ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pending Administrator Verification. Standard services remain preview only.</span>
                </div>
                <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[10px] uppercase">
                  Pending Approval
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/90 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-rose-900 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Account registration was rejected. Please contact campus administration.</span>
                </div>
                <span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 text-[10px] uppercase">
                  Rejected
                </span>
              </div>
            )}

            {/* Avatar & User Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 text-teal-400 font-extrabold text-2xl flex items-center justify-center shadow-md overflow-hidden relative border-2 border-slate-100">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={user.full_name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    user.full_name.charAt(0)
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 p-2 rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-700 cursor-pointer transition-transform hover:scale-105">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{user.full_name}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 capitalize">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Registration No:{" "}
                  <span className="font-mono font-bold text-slate-700">
                    {user.student_id || "STU-2026-REG"}
                  </span>
                </p>
                {isUploadingPhoto && (
                  <p className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading photograph...
                  </p>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  helperText="Your official campus display name."
                />
                <div className="relative">
                  <Input
                    label="Student Registration Number"
                    value={user.student_id || "STU-2026-REG"}
                    disabled
                    helperText="Fixed credential assigned by Registrar."
                  />
                  <Lock className="absolute right-3 top-8 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Official Campus Email"
                    value={user.email}
                    disabled
                    leftIcon={<Mail className="w-4 h-4" />}
                    helperText="Institutional Google Workspace email."
                  />
                  <Lock className="absolute right-3 top-8 w-3.5 h-3.5 text-slate-400" />
                </div>
                <Input
                  label="Contact Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  placeholder="+1 (555) 000-0000"
                  helperText="Used for SMS dispatch alerts."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Platform Role"
                    value={user.role}
                    disabled
                    helperText="Protected field: Role cannot be modified."
                  />
                  <Lock className="absolute right-3 top-8 w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="relative">
                  <Input
                    label="Account Approval Status"
                    value={user.approval_status}
                    disabled
                    helperText="Protected field: Controlled by campus administrator."
                  />
                  <Lock className="absolute right-3 top-8 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Profile preferences saved successfully!
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" isLoading={isSaving}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

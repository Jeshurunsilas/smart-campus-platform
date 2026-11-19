"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RequestSeverity, RequestPriority, Department, ServiceCategory, CampusLocation } from "@/types";
import {
  DEMO_DEPARTMENTS,
  DEMO_CATEGORIES,
  DEMO_LOCATIONS,
  DEMO_REQUESTS,
} from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createServiceRequest } from "@/lib/services/requests";
import { getDepartments, getServiceCategories, getCampusLocations } from "@/lib/services/departments";
import { validateImageFile, uploadServiceRequestImage } from "@/lib/services/storage";
import {
  QrCode,
  Sparkles,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

interface RequestFormProps {
  defaultDepartmentId?: string;
  defaultCategoryId?: string;
  rolePrefix?: string; // "/student" or "/faculty"
}

export function RequestForm({
  defaultDepartmentId = "",
  defaultCategoryId = "",
  rolePrefix = "/student",
}: RequestFormProps) {
  const router = useRouter();

  // Dynamic Lookup Data
  const [departments, setDepartments] = useState<Department[]>(DEMO_DEPARTMENTS);
  const [categories, setCategories] = useState<ServiceCategory[]>(DEMO_CATEGORIES);
  const [locations, setLocations] = useState<CampusLocation[]>(DEMO_LOCATIONS);

  // Form Fields
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId || DEMO_DEPARTMENTS[0].id);
  const [categoryId, setCategoryId] = useState(defaultCategoryId || "");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("Floor 2");
  const [roomNumber, setRoomNumber] = useState("");
  const [severity, setSeverity] = useState<RequestSeverity>("Medium");
  const [description, setDescription] = useState("");

  // Photograph Upload State
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // QR State
  const [qrScanned, setQrScanned] = useState(false);

  // Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTrackingNumber, setCreatedTrackingNumber] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getDepartments(),
      getServiceCategories(),
      getCampusLocations(),
    ]).then(([depts, cats, locs]) => {
      if (mounted) {
        if (depts.length > 0) setDepartments(depts);
        if (cats.length > 0) setCategories(cats);
        if (locs.length > 0) setLocations(locs);
      }
    }).catch(() => {
      // Keep demo fallbacks
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered categories for selected department
  const availableCategories = categories.filter(
    (c) => c.department_id === departmentId
  );

  // Smart Priority Engine calculation
  const computedSuggestedPriority: RequestPriority =
    severity === "Critical"
      ? "Critical"
      : severity === "High"
      ? "High"
      : severity === "Medium"
      ? "Medium"
      : "Low";

  // Duplicate ticket detection simulation
  const potentialDuplicate = DEMO_REQUESTS.find(
    (r) =>
      roomNumber &&
      r.location?.room_number?.toLowerCase().includes(roomNumber.toLowerCase()) &&
      r.department_id === departmentId &&
      r.status !== "Resolved" &&
      r.status !== "Closed"
  );

  // Simulate QR Code Scan
  const handleSimulateQrScan = () => {
    const sampleLoc = locations[1] || DEMO_LOCATIONS[1];
    setBuilding(sampleLoc.building);
    setFloor(sampleLoc.floor || "Floor 2");
    setRoomNumber(sampleLoc.room_number || "Room 204");
    setQrScanned(true);
  };

  // Handle Photograph Selection with Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setPhotoError(validation.error || "Invalid photograph file.");
        return;
      }
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    setPhotoError(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5) {
      errs.title = "Title must be at least 5 characters.";
    }
    if (!departmentId) {
      errs.departmentId = "Please select a responsible department.";
    }
    if (!categoryId) {
      errs.categoryId = "Please select an issue category.";
    }
    if (!building.trim()) {
      errs.building = "Campus building name is required.";
    }
    if (!roomNumber.trim()) {
      errs.roomNumber = "Room / laboratory number is required.";
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = "Please provide an issue description (minimum 15 characters).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate rapid clicks
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Upload photograph if attached
      let uploadedImageUrl: string | undefined;
      if (selectedPhoto) {
        uploadedImageUrl = await uploadServiceRequestImage(selectedPhoto);
      }

      // 2. Resolve campus location
      const matchedLoc =
        locations.find(
          (l) =>
            l.room_number?.toLowerCase() === roomNumber.toLowerCase() &&
            l.building.toLowerCase() === building.toLowerCase()
        ) || locations[0] || DEMO_LOCATIONS[0];

      // 3. Create service request
      const res = await createServiceRequest({
        title: title.trim(),
        description: description.trim(),
        departmentId,
        categoryId,
        locationId: matchedLoc.id,
        severity,
        priority: computedSuggestedPriority,
        imageUrl: uploadedImageUrl,
      });

      const trackNumber =
        res.data?.request_number ||
        `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      setCreatedTrackingNumber(trackNumber);
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create service request.";
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (isSuccess) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center max-w-xl mx-auto animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Request Submitted Successfully
        </span>

        <h2 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
          Service Ticket Logged
        </h2>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Tracking Number:</span>
            <span className="font-mono font-bold text-slate-900">{createdTrackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Title:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[240px]">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[240px]">
              {building} — {floor}, {roomNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Suggested Priority:</span>
            <span className="font-bold text-teal-700">{computedSuggestedPriority}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated SLA:</span>
            <span className="font-semibold text-slate-700">12 - 24 Hours</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          The responsible department has been notified. You can track status changes and staff dispatch from your request dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => router.push(`${rolePrefix}/requests`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Track in My Requests
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsSuccess(false);
              setTitle("");
              setDescription("");
              setBuilding("");
              setRoomNumber("");
              setSelectedPhoto(null);
              setPhotoPreview(null);
              setQrScanned(false);
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Smart QR Code Auto-fill Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-teal-200 uppercase tracking-wider">
              Smart Feature
            </div>
            <div className="text-sm font-semibold">QR-Based Campus Room Auto-Detection</div>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleSimulateQrScan}
          leftIcon={<QrCode className="w-3.5 h-3.5 text-teal-700" />}
        >
          {qrScanned ? "Re-scan Plaque" : "Simulate QR Scan"}
        </Button>
      </div>

      {/* Global Form Error Alert */}
      {errors.form && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Submission Error:</span>
            <p className="mt-0.5">{errors.form}</p>
          </div>
        </div>
      )}

      {/* Duplicate Request Detection Banner */}
      {potentialDuplicate && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Potential Duplicate Request Detected!</span>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              An open request already exists for this room:{" "}
              <strong className="underline">{potentialDuplicate.title}</strong> (
              {potentialDuplicate.tracking_number} — {potentialDuplicate.status}). If your issue is the same, our team is already working on it.
            </p>
          </div>
        </div>
      )}

      {/* Main Request Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" />
          Service Request Details
        </h3>

        {/* Title */}
        <Input
          label="Request Summary / Title"
          required
          placeholder="e.g. Overhead Projector HDMI Port Dead in LH-101"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          helperText="Provide a short, specific summary of the problem."
        />

        {/* Department & Category Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Responsible Department"
            required
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setCategoryId("");
            }}
            options={departments.map((d) => ({
              value: d.id,
              label: `${d.name} (${d.code})`,
            }))}
          />

          <Select
            label="Problem Category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            error={errors.categoryId}
            placeholder="Select a category..."
            options={availableCategories.map((c) => ({
              value: c.id,
              label: `${c.name} [SLA: ~${c.estimated_sla_hours}h]`,
            }))}
          />
        </div>

        {/* Building, Floor & Room Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Campus Building"
            required
            placeholder="e.g. Engineering Block A"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            error={errors.building}
          />

          <Select
            label="Floor"
            required
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            options={[
              { value: "Ground Floor", label: "Ground Floor" },
              { value: "Floor 1", label: "Floor 1" },
              { value: "Floor 2", label: "Floor 2" },
              { value: "Floor 3", label: "Floor 3" },
              { value: "Floor 4", label: "Floor 4" },
              { value: "Basement", label: "Basement" },
            ]}
          />

          <Input
            label="Room Number / Location Details"
            required
            placeholder="e.g. Room 204 / East Wing"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            error={errors.roomNumber}
          />
        </div>

        {/* Severity & Smart Priority Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Issue Severity Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["Low", "Medium", "High", "Critical"] as RequestSeverity[]).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    severity === sev
                      ? sev === "Critical"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : sev === "High"
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Priority Suggestion Badge */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/90 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-900">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Smart Priority Engine
            </div>
            <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
              System recommended priority:{" "}
              <span className="font-bold text-teal-800">{computedSuggestedPriority}</span>{" "}
              (Administrators can adjust upon review).
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Detailed Problem Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what occurred, any error messages displayed, equipment serial tags, or safety hazards..."
            className={`w-full rounded-xl border bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs transition-all ${
              errors.description ? "border-rose-400 focus:ring-rose-500" : "border-slate-200"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Secure Photograph Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Upload Issue Photograph (Optional)
          </label>

          {!photoPreview ? (
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-center transition-colors">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-700">
                Click to select or drag and drop photographs
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Supports PNG, JPG, or WEBP up to 5MB
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
              />
            </div>
          ) : (
            <div className="relative inline-block mt-2">
              <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <Image
                  src={photoPreview}
                  alt="Issue preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="mt-1 text-[11px] text-slate-500 font-medium truncate max-w-[160px]">
                {selectedPhoto?.name}
              </div>
            </div>
          )}

          {photoError && (
            <p className="mt-2 text-xs text-rose-600 font-medium">{photoError}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Submit Service Request
          </Button>
        </div>
      </div>
    </form>
  );
}

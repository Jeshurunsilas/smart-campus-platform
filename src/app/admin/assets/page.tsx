"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DEMO_CAMPUS_ASSETS, DEMO_CAMPUS_BUILDINGS } from "@/lib/services/campus-operations";
import { CampusAsset } from "@/types";
import {
  Wrench,
  Search,
  QrCode,
  Shield,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function AssetManagementPage() {
  const [assets, setAssets] = useState<CampusAsset[]>(DEMO_CAMPUS_ASSETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<CampusAsset | null>(assets[0] || null);

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-teal-600" />
              <span>Asset Lifecycle & Reliability</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Smart Asset Directory & QR Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete inventory of critical campus HVAC, electrical, laboratory, and AV infrastructure with QR validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              {assets.length} Assets Registered
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by asset tag, name, or manufacturer..."
              className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="hvac">HVAC & Chilling</option>
            <option value="electrical">Electrical & UPS</option>
            <option value="lab_instrument">Laboratory Equipment</option>
            <option value="av_projector">AV & Display</option>
            <option value="safety">Safety & Ventilation</option>
          </select>
        </div>

        {/* Assets Grid & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              const building = DEMO_CAMPUS_BUILDINGS.find((b) => b.id === asset.building_id);

              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white border-slate-200 hover:border-teal-300"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected ? "bg-slate-800 text-teal-300" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {asset.asset_tag}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        {asset.category.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm">{asset.name}</h3>
                    <div
                      className={`text-[11px] ${
                        isSelected ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {asset.manufacturer} &bull; Model: {asset.model_number} &bull; {building?.name}
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                        asset.operational_status === "operational"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {asset.operational_status}
                    </span>
                    <div className="text-xs font-mono font-black">
                      Health: {asset.health_score}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Asset Detail & QR Preview */}
          <div>
            {selectedAsset ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 sticky top-6">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedAsset.asset_tag}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">{selectedAsset.name}</h3>
                </div>

                {/* QR Code Presentation */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center shadow-2xs">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Token: {selectedAsset.qr_code || `CAMPUS:ASSET:${selectedAsset.asset_tag}`}
                  </div>
                  <span className="text-[9px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                    Scan with Mobile Camera to Dispatch
                  </span>
                </div>

                {/* Specifications List */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Manufacturer</span>
                    <span className="font-semibold text-slate-900">{selectedAsset.manufacturer}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Model Number</span>
                    <span className="font-mono text-slate-900">{selectedAsset.model_number}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Installation Date</span>
                    <span className="font-mono text-slate-900">{selectedAsset.installation_date}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Warranty Expiry</span>
                    <span className="font-mono text-slate-900">{selectedAsset.warranty_expiry}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Inspection Cycle</span>
                    <span className="font-semibold text-slate-900">Every {selectedAsset.maintenance_interval_days} Days</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => alert(`QR verification token active for ${selectedAsset.asset_tag}`)}
                  leftIcon={<QrCode className="w-3.5 h-3.5" />}
                >
                  Verify QR Integrity
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

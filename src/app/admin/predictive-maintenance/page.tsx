"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { DEMO_CAMPUS_ASSETS, DEMO_PREDICTIVE_MAINTENANCE } from "@/lib/services/campus-operations";
import {
  convertPredictionToServiceRequest,
  dismissMaintenancePrediction,
} from "@/lib/services/predictive-maintenance";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
} from "lucide-react";

export default function PredictiveMaintenancePage() {
  const [predictions, setPredictions] = useState(DEMO_PREDICTIVE_MAINTENANCE);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConvert = async (predictionId: string) => {
    setLoadingId(predictionId);
    setActionMessage(null);
    const pred = predictions.find((p) => p.id === predictionId);
    const asset = DEMO_CAMPUS_ASSETS.find((a) => a.id === pred?.asset_id) || DEMO_CAMPUS_ASSETS[0];

    try {
      const res = await convertPredictionToServiceRequest(predictionId, asset);
      if (res.success) {
        setActionMessage(res.message);
        setPredictions((prev) =>
          prev.map((p) => (p.id === predictionId ? { ...p, status: "converted_to_request" } : p))
        );
      }
    } catch {
      setActionMessage("Error generating service ticket.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDismiss = (predictionId: string) => {
    dismissMaintenancePrediction(predictionId, "Dismissed by operations engineer inspection.");
    setPredictions((prev) =>
      prev.map((p) => (p.id === predictionId ? { ...p, status: "dismissed" } : p))
    );
    setActionMessage("Recommendation marked as dismissed.");
  };

  return (
    <DashboardShell role="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>AI & Statistical Predictive Analytics</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Predictive Maintenance & Asset Health Scores
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Explainable multi-factor failure probability modeling grounded in equipment duty cycles, thermal variances, and telemetry.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-600 font-mono">
            Model: <span className="font-bold text-slate-900">Explainable Multi-Factor MTBF Engine</span>
          </div>
        </div>

        {/* Action Toast */}
        {actionMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Predictions Feed */}
        <div className="space-y-4">
          {predictions.map((pred) => {
            const asset = DEMO_CAMPUS_ASSETS.find((a) => a.id === pred.asset_id) || DEMO_CAMPUS_ASSETS[0];

            return (
              <div
                key={pred.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Card Top */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {asset.asset_tag}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          pred.risk_level === "critical"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : pred.risk_level === "high"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-teal-100 text-teal-800 border border-teal-300"
                        }`}
                      >
                        {pred.risk_level} Risk ({pred.risk_score}/100)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Confidence: {pred.confidence_pct}%
                      </span>
                    </div>

                    <h3 className="font-black text-base text-slate-900">{asset.name}</h3>
                    <div className="text-xs text-rose-700 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Predicted Mode: {pred.failure_mode}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Recommended Action Date</div>
                    <div className="text-xs font-mono font-extrabold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {pred.recommended_date}
                    </div>
                  </div>
                </div>

                {/* Contributing Explainability Factors */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    Explainable Risk Factor Breakdown:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {pred.contributing_factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-[11px]">{factor.factor}</span>
                          <span className="text-[10px] font-mono font-bold text-teal-700">
                            {factor.weight_pct}% Weight
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{factor.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Engineering Action */}
                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-teal-900">Recommended Action: </span>
                    <span className="text-teal-800">{pred.recommended_action}</span>
                  </div>

                  {pred.status === "active" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismiss(pred.id)}
                        className="text-slate-600 border-slate-300 hover:bg-slate-100 text-xs"
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConvert(pred.id)}
                        isLoading={loadingId === pred.id}
                        className="text-xs"
                        leftIcon={<Wrench className="w-3.5 h-3.5" />}
                      >
                        Create Work Order
                      </Button>
                    </div>
                  ) : pred.status === "converted_to_request" ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                      Work Order Generated
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      Dismissed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}

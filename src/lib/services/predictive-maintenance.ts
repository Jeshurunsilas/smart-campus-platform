import { CampusAsset, MaintenancePrediction, RequestPriority, RequestSeverity } from "@/types";
import { createServiceRequest } from "./requests";
import { DEMO_PREDICTIVE_MAINTENANCE } from "./campus-operations";

export interface RiskEvaluationInput {
  operatingHours: number;
  expectedLifespanHours: number;
  averageTemperatureC: number;
  baselineTemperatureC: number;
  peakVibrationMmS: number;
  recentRepairsCount: number;
}

export interface CalculatedRiskProfile {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  contributingFactors: Array<{ factor: string; weight_pct: number; description: string }>;
  recommendedAction: string;
  recommendedInspectionDate: string;
}

/**
 * Transparent, explainable statistical scoring for asset failure probability.
 * Does not pretend to use unvalidated neural networks.
 */
export function calculateAssetRiskScore(input: RiskEvaluationInput): CalculatedRiskProfile {
  const {
    operatingHours,
    expectedLifespanHours,
    averageTemperatureC,
    baselineTemperatureC,
    peakVibrationMmS,
    recentRepairsCount,
  } = input;

  // Factor 1: Age / Lifespan ratio (max 35 points)
  const ageRatio = Math.min(1.5, operatingHours / Math.max(1000, expectedLifespanHours));
  const ageScore = Math.min(35, ageRatio * 35);

  // Factor 2: Thermal Delta Exceedance (max 25 points)
  const tempDelta = Math.max(0, averageTemperatureC - baselineTemperatureC);
  const tempScore = Math.min(25, (tempDelta / 15) * 25);

  // Factor 3: Harmonic Vibration Severity (max 25 points)
  // Normal is < 2.5 mm/s, critical is > 4.5 mm/s
  const vibExcess = Math.max(0, peakVibrationMmS - 2.0);
  const vibScore = Math.min(25, (vibExcess / 3.0) * 25);

  // Factor 4: Recent Breakdown Frequency (max 15 points)
  const repairScore = Math.min(15, recentRepairsCount * 5);

  const rawScore = ageScore + tempScore + vibScore + repairScore;
  const riskScore = Number(Math.min(100, Math.max(5, rawScore)).toFixed(1));

  let riskLevel: "low" | "medium" | "high" | "critical" = "low";
  if (riskScore >= 85) riskLevel = "critical";
  else if (riskScore >= 70) riskLevel = "high";
  else if (riskScore >= 40) riskLevel = "medium";

  const totalFactors = ageScore + tempScore + vibScore + repairScore || 1;
  const contributingFactors = [
    {
      factor: "Equipment Runtime & Duty Cycle",
      weight_pct: Math.round((ageScore / totalFactors) * 100),
      description: `${Math.round(ageRatio * 100)}% of manufacturer-rated lifespan accumulated (${operatingHours} hrs)`,
    },
    {
      factor: "Thermal Exhaust Variance",
      weight_pct: Math.round((tempScore / totalFactors) * 100),
      description: `Operating at +${tempDelta.toFixed(1)}°C above engineering design baseline`,
    },
    {
      factor: "Mechanical Harmonic Vibration",
      weight_pct: Math.round((vibScore / totalFactors) * 100),
      description: `Measured at ${peakVibrationMmS.toFixed(2)} mm/s (normal threshold < 2.5 mm/s)`,
    },
    {
      factor: "Repeat Breakdown Pattern",
      weight_pct: Math.round((repairScore / totalFactors) * 100),
      description: `${recentRepairsCount} maintenance interventions recorded in previous 90-day cycle`,
    },
  ];

  let recommendedAction = "Continue regular telemetry monitoring.";
  let daysUntilInspection = 60;

  if (riskLevel === "critical") {
    recommendedAction = "Immediate overhaul required. Schedule emergency technician inspection and order replacement components.";
    daysUntilInspection = 2;
  } else if (riskLevel === "high") {
    recommendedAction = "Elevated wear profile detected. Advance upcoming preventive maintenance and conduct thermal imaging.";
    daysUntilInspection = 7;
  } else if (riskLevel === "medium") {
    recommendedAction = "Minor variance observed. Inspect lubrication, filter cleanability, and electrical connections.";
    daysUntilInspection = 21;
  }

  const recDate = new Date();
  recDate.setDate(recDate.getDate() + daysUntilInspection);
  const recommendedInspectionDate = recDate.toISOString().split("T")[0];

  return {
    riskScore,
    riskLevel,
    contributingFactors,
    recommendedAction,
    recommendedInspectionDate,
  };
}

/**
 * Converts an active predictive recommendation into an authorized campus service request.
 */
export async function convertPredictionToServiceRequest(
  predictionId: string,
  asset: CampusAsset,
  departmentId = "d0000002-0000-0000-0000-000000000001"
): Promise<{ success: boolean; requestNumber?: string; message: string }> {
  const prediction = DEMO_PREDICTIVE_MAINTENANCE.find((p) => p.id === predictionId);
  if (!prediction) {
    throw new Error("Prediction record not found.");
  }

  const severityMap: Record<string, RequestSeverity> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  const priorityMap: Record<string, RequestPriority> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  const res = await createServiceRequest({
    title: `[PREDICTIVE] ${prediction.failure_mode} on ${asset.name}`,
    description: `Automated Preventive Action Triggered from Smart Operations Intelligence.\nAsset Tag: ${asset.asset_tag}\nFailure Mode: ${prediction.failure_mode}\nConfidence: ${prediction.confidence_pct}%\nRecommended Action: ${prediction.recommended_action}\nDue by: ${prediction.recommended_date}`,
    departmentId: asset.department_id || departmentId,
    categoryId: "cat-elec-maint",
    locationId: asset.building_id || "loc-01",
    severity: severityMap[prediction.risk_level] || "High",
    priority: priorityMap[prediction.risk_level] || "High",
  });

  if (res.success && res.data) {
    prediction.status = "converted_to_request";
    prediction.converted_request_id = res.data.id;
    return {
      success: true,
      requestNumber: res.data.request_number,
      message: `Preventive maintenance ticket ${res.data.request_number} generated successfully and assigned to department dispatch.`,
    };
  }

  return { success: false, message: "Could not generate maintenance ticket." };
}

/**
 * Allows an authorized administrator or engineer to dismiss a false prediction.
 */
export function dismissMaintenancePrediction(predictionId: string, reason: string): boolean {
  const prediction = DEMO_PREDICTIVE_MAINTENANCE.find((p) => p.id === predictionId);
  if (!prediction) return false;
  prediction.status = "dismissed";
  return true;
}

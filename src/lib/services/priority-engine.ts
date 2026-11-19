import { RequestPriority, RequestSeverity } from "@/types";

export interface PriorityEvaluationInput {
  severity: RequestSeverity;
  categoryDefaultPriority?: RequestPriority;
  building?: string;
  roomNumber?: string;
  isExamPeriod?: boolean;
  recentIncidentsInLocationCount?: number;
}

export interface PriorityRecommendation {
  recommendedPriority: RequestPriority;
  score: number; // 0 - 100
  factors: string[];
  isEmergency: boolean;
  confidence: number; // 0 - 1.0
}

/**
 * High-sensitivity campus zones that receive a priority multiplier
 */
const CRITICAL_CAMPUS_ZONES = [
  "server room",
  "data center",
  "chemistry lab",
  "biology lab",
  "hazardous materials",
  "main substation",
  "exam hall",
  "central library",
  "dining hall",
  "infirmary",
  "health center",
  "science",
  "engineering",
  "complex",
];

/**
 * Multi-factor Smart Priority Calculation Engine
 * Balances user-reported severity with location criticality, default SLA, and localized ticket spikes.
 */
export function calculateSmartPriority(input: PriorityEvaluationInput): PriorityRecommendation {
  let score = 0;
  const factors: string[] = [];

  // 1. Severity Base Scoring (Max 55 points)
  switch (input.severity) {
    case "Critical":
      score += 55;
      factors.push("Safety/Security critical severity reported (+55 pts)");
      break;
    case "High":
      score += 32;
      factors.push("High operational disruption severity (+32 pts)");
      break;
    case "Medium":
      score += 18;
      factors.push("Moderate equipment disruption (+18 pts)");
      break;
    case "Low":
    default:
      score += 8;
      factors.push("Cosmetic or minor convenience issue (+8 pts)");
      break;
  }

  // 2. Location Impact Assessment (Max 25 points)
  const locIdentifier = `${input.building || ""} ${input.roomNumber || ""}`.toLowerCase();
  const isCriticalZone = CRITICAL_CAMPUS_ZONES.some((zone) => locIdentifier.includes(zone));

  if (isCriticalZone) {
    score += 25;
    factors.push("High-impact campus facility (Lab / Server / Medical / Dining / Science Complex) (+25 pts)");
  } else if (input.building?.toLowerCase().includes("academic") || input.building?.toLowerCase().includes("hall")) {
    score += 18;
    factors.push("Primary academic instruction building (+18 pts)");
  } else {
    score += 8;
    factors.push("Standard campus office or residential quarters (+8 pts)");
  }

  // 3. Category Baseline Alignment (Max 20 points)
  if (input.categoryDefaultPriority) {
    switch (input.categoryDefaultPriority) {
      case "Critical":
        score += 20;
        factors.push("Category SLA configured with Critical default SLA (+20 pts)");
        break;
      case "High":
        score += 14;
        factors.push("Category SLA configured with High urgency (+14 pts)");
        break;
      case "Medium":
        score += 8;
        factors.push("Category SLA standard priority (+8 pts)");
        break;
      case "Low":
        score += 4;
        factors.push("Category SLA low priority (+4 pts)");
        break;
    }
  }

  // 4. Incident Spike / Hotspot Detection (Max 15 points)
  const spikeCount = input.recentIncidentsInLocationCount || 0;
  if (spikeCount >= 3) {
    score += 15;
    factors.push(`Spike detected: ${spikeCount} recurring reports in this exact facility (+15 pts)`);
  } else if (spikeCount >= 1) {
    score += 8;
    factors.push(`Multiple issues reported at this location within 48h (+8 pts)`);
  }

  // Determine Final Recommended Classification
  let recommendedPriority: RequestPriority = "Low";
  let isEmergency = false;

  if (score >= 70 || input.severity === "Critical") {
    recommendedPriority = "Critical";
    isEmergency = true;
  } else if (score >= 48) {
    recommendedPriority = "High";
  } else if (score >= 25) {
    recommendedPriority = "Medium";
  } else {
    recommendedPriority = "Low";
  }

  return {
    recommendedPriority,
    score: Math.min(100, score),
    factors,
    isEmergency,
    confidence: 0.94,
  };
}

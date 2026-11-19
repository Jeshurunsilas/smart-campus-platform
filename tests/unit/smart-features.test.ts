import { describe, it, expect } from "vitest";
import { calculateSmartPriority } from "@/lib/services/priority-engine";
import {
  calculateSLADeadline,
  getSLARemainingTime,
  formatSLACountdown,
  evaluateRequestSLA,
  checkAndEscalateOverdueRequests,
  DEFAULT_SLA_HOURS,
} from "@/lib/services/sla";
import {
  generateLocationQRCode,
  parseLocationQRCode,
  validateCampusQRToken,
} from "@/lib/services/qr";
import { ServiceRequest } from "@/types";

describe("Phase 6: Smart Campus Features Engine", () => {
  describe("Multi-Factor Smart Priority Engine", () => {
    it("assigns Critical priority to safety-critical severity reports", () => {
      const result = calculateSmartPriority({
        severity: "Critical",
        building: "Main Academic Hall",
        roomNumber: "101",
      });

      expect(result.recommendedPriority).toBe("Critical");
      expect(result.isEmergency).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.factors.some((f) => f.includes("critical"))).toBe(true);
    });

    it("elevates priority score for sensitive campus zones (Labs, Server Rooms)", () => {
      const normalOfficeResult = calculateSmartPriority({
        severity: "Medium",
        building: "Administration",
        roomNumber: "Office 202",
      });

      const serverRoomResult = calculateSmartPriority({
        severity: "Medium",
        building: "Technology Center",
        roomNumber: "Main Server Room",
      });

      expect(serverRoomResult.score).toBeGreaterThan(normalOfficeResult.score);
      expect(serverRoomResult.factors.some((f) => f.includes("High-impact campus facility"))).toBe(true);
    });

    it("detects localized recurring issue spikes and increases urgency", () => {
      const baselineResult = calculateSmartPriority({
        severity: "Medium",
        building: "Science Complex",
        roomNumber: "Lab 304",
        recentIncidentsInLocationCount: 0,
      });

      const spikeResult = calculateSmartPriority({
        severity: "Medium",
        building: "Science Complex",
        roomNumber: "Lab 304",
        recentIncidentsInLocationCount: 4,
      });

      expect(spikeResult.score).toBeGreaterThan(baselineResult.score);
      expect(spikeResult.factors.some((f) => f.includes("Spike detected"))).toBe(true);
    });
  });

  describe("SLA Calculation & Escalation Engine", () => {
    it("accurately calculates deadlines based on priority standards", () => {
      const createdAt = "2026-03-01T10:00:00.000Z";

      const criticalDeadline = calculateSLADeadline(createdAt, "Critical");
      expect(criticalDeadline).toBe("2026-03-01T14:00:00.000Z"); // +4 hours

      const highDeadline = calculateSLADeadline(createdAt, "High");
      expect(highDeadline).toBe("2026-03-01T22:00:00.000Z"); // +12 hours

      expect(DEFAULT_SLA_HOURS.Critical).toBe(4);
      expect(DEFAULT_SLA_HOURS.High).toBe(12);

      const remaining = getSLARemainingTime(criticalDeadline, createdAt);
      expect(remaining.isOverdue).toBeDefined();

      const countdownText = formatSLACountdown(criticalDeadline);
      expect(countdownText).toBeDefined();

      const mediumDeadline = calculateSLADeadline(createdAt, "Medium");
      expect(mediumDeadline).toBe("2026-03-02T10:00:00.000Z"); // +24 hours

      const lowDeadline = calculateSLADeadline(createdAt, "Low");
      expect(lowDeadline).toBe("2026-03-03T10:00:00.000Z"); // +48 hours
    });

    it("evaluates active requests and detects overdue breaches", () => {
      const pastDeadline = new Date(Date.now() - 3600 * 1000).toISOString(); // 1 hour ago
      const mockRequest: ServiceRequest = {
        id: "req-overdue-test",
        tracking_number: "REQ-2026-9999",
        title: "Chiller failure",
        description: "AC not cooling server rack",
        user_id: "usr-01",
        department_id: "dept-facilities",
        category_id: "cat-01",
        location_id: "loc-01",
        severity: "High",
        priority: "High",
        status: "In Progress",
        sla_deadline: pastDeadline,
        is_overdue: true,
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      };

      const evalResult = evaluateRequestSLA(mockRequest);
      expect(evalResult.status).toBe("breached");
      expect(evalResult.escalated).toBe(true);
    });

    it("triggers automated supervisor escalation for overdue tickets", async () => {
      const result = await checkAndEscalateOverdueRequests();
      expect(result).toBeDefined();
      expect(result.checkedCount).toBeGreaterThanOrEqual(0);
      expect(result.escalatedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Campus QR Code Generation & Parsing", () => {
    it("encodes valid location parameters into standard campus QR token", () => {
      const token = generateLocationQRCode("Science Complex", "Floor 3", "Lab 304", "dept-facilities");
      expect(token).toMatch(/^CAMPUS:LOC:Science%20Complex:Floor%203:Lab%20304:dept-facilities$/);
      expect(validateCampusQRToken(token)).toBe(true);
    });

    it("decodes QR token and extracts building, floor, and room", () => {
      const token = "CAMPUS:LOC:Central%20Library:Floor%202:Study%20Pod%20B:dept-it";
      const parsed = parseLocationQRCode(token);

      expect(parsed.valid).toBe(true);
      expect(parsed.building).toBe("Central Library");
      expect(parsed.floor).toBe("Floor 2");
      expect(parsed.roomNumber).toBe("Study Pod B");
      expect(parsed.departmentId).toBe("dept-it");
      expect(parsed.suggestedTitle).toBe("Issue at Central Library - Study Pod B");
    });

    it("gracefully flags invalid or malformed QR tokens as invalid", () => {
      const invalidToken = "https://external-website.com/invalid";
      const parsed = parseLocationQRCode(invalidToken);

      expect(parsed.valid).toBe(false);
      expect(validateCampusQRToken(invalidToken)).toBe(false);
    });
  });
});

import { describe, it, expect } from "vitest";
import {
  approveUserAccount,
  rejectUserAccount,
  provisionStaffAccount,
  toggleUserStatus,
  getRegisteredUsers,
} from "@/lib/services/profiles";
import {
  updateRequestPriority,
  acceptRequestAssignment,
  startRequestWork,
  rejectRequestAssignment,
  addRequestWorkNote,
  resolveServiceRequest,
} from "@/lib/services/requests";
import { getDepartmentWorkloadStats } from "@/lib/services/departments";

describe("Phase 5: Administrator & Department Staff Module Core Logic", () => {
  describe("Administrator User Management & Account Approvals", () => {
    it("approves pending user registration successfully", async () => {
      const result = await approveUserAccount("appr-01");
      expect(result).toBe(true);
    });

    it("rejects pending user registration with reason", async () => {
      const result = await rejectUserAccount("appr-02", "Incomplete student enrollment paperwork");
      expect(result).toBe(true);
    });

    it("toggles user active/inactive account status", async () => {
      const result = await toggleUserStatus("usr-student-01", false);
      expect(result.success).toBe(true);
    });

    it("provisions a new department staff technician account", async () => {
      const staffInput = {
        fullName: "Marcus Holloway",
        email: "m.holloway@campus.edu",
        departmentId: "dept-facilities",
        staffId: "STF-2026-88",
        phoneNumber: "+1 (555) 777-9999",
      };

      const result = await provisionStaffAccount(staffInput);
      expect(result.success).toBe(true);
      expect(result.staffProfile).toBeDefined();
      expect(result.staffProfile?.full_name).toBe("Marcus Holloway");
      expect(result.staffProfile?.role).toBe("department_staff");
    });

    it("retrieves registered users list with role filtering", async () => {
      const users = await getRegisteredUsers();
      expect(users.length).toBeGreaterThan(0);
      expect(users.some((u) => u.role === "student")).toBe(true);
      expect(users.some((u) => u.role === "faculty")).toBe(true);
      expect(users.some((u) => u.role === "staff")).toBe(true);
    });
  });

  describe("Administrative Service Request Triage & Priority Override", () => {
    it("updates ticket priority with administrative justification reason", async () => {
      const result = await updateRequestPriority(
        "req-002",
        "High",
        "Executive lecture scheduled in this auditorium"
      );
      expect(result).toBe(true);
    });
  });

  describe("Department Staff Field Operations Workflow", () => {
    it("allows a technician to accept an assigned work order", async () => {
      const result = await acceptRequestAssignment(
        "req-001",
        "Technician accepted work order and dispatched"
      );
      expect(result).toBe(true);
    });

    it("transitions an accepted work order to In Progress", async () => {
      const result = await startRequestWork(
        "req-001",
        "Technician arrived on site and inspected wiring"
      );
      expect(result).toBe(true);
    });

    it("allows technician to decline assignment with required justification", async () => {
      const result = await rejectRequestAssignment(
        "req-002",
        "Requires licensed master plumber certification"
      );
      expect(result).toBe(true);
    });

    it("logs timestamped diagnostic field notes to audit trail", async () => {
      const result = await addRequestWorkNote(
        "req-001",
        "Replaced 20A circuit breaker; running load test."
      );
      expect(result).toBe(true);
    });

    it("resolves work order with corrective actions summary and photo evidence", async () => {
      const result = await resolveServiceRequest(
        "req-001",
        "Replaced faulty ballast in ceiling fixture #4. Illuminated and fully operational.",
        "https://storage.supabase.local/service-request-images/resolution_fixture4.jpg"
      );
      expect(result).toBe(true);
    });
  });

  describe("Department Workload Scorecards & Statistics", () => {
    it("calculates accurate department metrics (total, pending, resolved, SLA compliance)", async () => {
      const stats = await getDepartmentWorkloadStats();
      expect(stats.length).toBeGreaterThan(0);

      const facilities = stats.find((s) => s.departmentName.includes("Facilities"));
      expect(facilities).toBeDefined();
      if (facilities) {
        expect(facilities.totalRequests).toBeGreaterThanOrEqual(1);
        expect(facilities.resolutionRatePercentage).toBeGreaterThanOrEqual(0);
        expect(facilities.satisfactionRating).toBeGreaterThanOrEqual(4.0);
      }
    });
  });
});

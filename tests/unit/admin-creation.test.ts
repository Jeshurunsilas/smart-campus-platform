import { describe, it, expect } from "vitest";
import {
  hasAnyAdministrator,
  provisionInitialAdministrator,
  provisionAdditionalAdministrator,
} from "@/lib/supabase/admin";

describe("Admin Account Creation System", () => {
  describe("Initial Admin Setup Guard (hasAnyAdministrator)", () => {
    it("returns a boolean indicating if an administrator account is present", async () => {
      const exists = await hasAnyAdministrator();
      expect(typeof exists).toBe("boolean");
    });
  });

  describe("Initial Administrator Provisioning", () => {
    it("validates that all required parameters are provided", async () => {
      // Missing full name
      const res1 = await provisionInitialAdministrator({
        fullName: "",
        email: "superadmin@campus.edu",
        password: "SecurePassword123!",
      });
      expect(res1.success).toBe(false);
      expect(res1.error).toMatch(/full name/i);

      // Weak/short password (< 8 chars)
      const res2 = await provisionInitialAdministrator({
        fullName: "System Admin",
        email: "admin2@campus.edu",
        password: "short",
      });
      expect(res2.success).toBe(false);
      expect(res2.error).toMatch(/at least 8 characters/i);
    });

    it("prevents multiple initial administrator registrations once an admin exists", async () => {
      // In seeded/configured system, admin already exists
      const adminExists = await hasAnyAdministrator();
      if (adminExists) {
        const res = await provisionInitialAdministrator({
          fullName: "Intruder Admin",
          email: "intruder@campus.edu",
          password: "SecurePassword123!",
        });
        expect(res.success).toBe(false);
        expect(res.error).toMatch(/already exists|disabled/i);
      }
    });
  });

  describe("Additional Admin Management by Existing Admin", () => {
    it("requires creator admin authorization ID", async () => {
      const res = await provisionAdditionalAdministrator({
        creatorAdminId: "",
        fullName: "Secondary Administrator",
        email: "secadmin@campus.edu",
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/admin id/i);
    });

    it("successfully provisions secondary administrator when authorized", async () => {
      const res = await provisionAdditionalAdministrator({
        creatorAdminId: "d0000001-0000-0000-0000-000000000001",
        fullName: "Secondary Administrator",
        email: "secadmin@campus.edu",
        temporaryPassword: "CustomTempPass2026!",
      });

      expect(res.success).toBe(true);
      expect(res.user?.email).toBe("secadmin@campus.edu");
      expect(res.user?.role).toBe("administrator");
      expect(res.user?.approved_by).toBe("d0000001-0000-0000-0000-000000000001");
      expect(res.temporaryPassword).toBe("CustomTempPass2026!");
    });

    it("generates random temporary password when none is provided", async () => {
      const res = await provisionAdditionalAdministrator({
        creatorAdminId: "d0000001-0000-0000-0000-000000000001",
        fullName: "Auto Pass Admin",
        email: "autopass@campus.edu",
      });

      expect(res.success).toBe(true);
      expect(res.temporaryPassword).toBeDefined();
      expect(res.temporaryPassword!.length).toBeGreaterThanOrEqual(12);
    });
  });
});

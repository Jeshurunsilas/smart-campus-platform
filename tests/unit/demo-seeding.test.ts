import { describe, it, expect, afterAll } from "vitest";
import {
  checkIsDemoSeeded,
  getDemoRecordCounts,
  seedDemoDatabase,
  cleanDemoDatabase,
  DEMO_USER_CONFIG,
  DEMO_DEPARTMENTS_CONFIG,
  DEMO_LOCATIONS_CONFIG,
} from "@/lib/services/seed-service";

describe("Demo Database Seeding System", () => {
  describe("Deterministic Identifiers & Configurations", () => {
    it("has 4 configured demo roles with unique deterministic UUIDs", () => {
      expect(DEMO_USER_CONFIG).toHaveLength(4);
      const roles = DEMO_USER_CONFIG.map((u) => u.role);
      expect(roles).toContain("administrator");
      expect(roles).toContain("student");
      expect(roles).toContain("faculty");
      expect(roles).toContain("department_staff");

      const uniqueIds = new Set(DEMO_USER_CONFIG.map((u) => u.id));
      expect(uniqueIds.size).toBe(4);
    });

    it("has 8 operational campus departments matching the specification", () => {
      expect(DEMO_DEPARTMENTS_CONFIG).toHaveLength(8);
      const names = DEMO_DEPARTMENTS_CONFIG.map((d) => d.name);
      expect(names).toContain("IT Support");
      expect(names).toContain("Electrical Maintenance");
      expect(names).toContain("Civil Maintenance");
      expect(names).toContain("Hostel Management");
      expect(names).toContain("Laboratory Management");
      expect(names).toContain("Transport Services");
      expect(names).toContain("Library Services");
      expect(names).toContain("Housekeeping");
    });

    it("has 10 campus locations equipped with QR code bindings", () => {
      expect(DEMO_LOCATIONS_CONFIG).toHaveLength(10);
      DEMO_LOCATIONS_CONFIG.forEach((loc) => {
        expect(loc.qr_code).toMatch(/^CAMPUS:LOC:/);
        expect(loc.building_name).toBeDefined();
        expect(loc.floor).toBeDefined();
        expect(loc.room_number).toBeDefined();
      });
    });
  });

  describe("Seeding Execution & Idempotency", () => {
    it("executes seedDemoDatabase and returns complete record inventory", async () => {
      const res = await seedDemoDatabase();
      expect(res.success).toBe(true);
      expect(res.counts.users).toBe(4);
      expect(res.counts.departments).toBe(8);
      expect(res.counts.categories).toBeGreaterThanOrEqual(19);
      expect(res.counts.locations).toBe(10);
      expect(res.counts.serviceRequests).toBeGreaterThanOrEqual(25);
      expect(res.counts.announcements).toBeGreaterThanOrEqual(5);
    });

    it("verifies idempotency: running seed twice produces identical counts without duplicate records", async () => {
      const firstRun = await seedDemoDatabase();
      const secondRun = await seedDemoDatabase();

      expect(firstRun.counts.users).toBe(secondRun.counts.users);
      expect(firstRun.counts.departments).toBe(secondRun.counts.departments);
      expect(firstRun.counts.categories).toBe(secondRun.counts.categories);
      expect(firstRun.counts.locations).toBe(secondRun.counts.locations);
      expect(firstRun.counts.serviceRequests).toBe(secondRun.counts.serviceRequests);
      expect(firstRun.counts.announcements).toBe(secondRun.counts.announcements);
    });

    it("confirms checkIsDemoSeeded returns true after seeding", async () => {
      const seeded = await checkIsDemoSeeded();
      expect(seeded).toBe(true);
    });
  });

  describe("Demo Dataset Cleanup & Production Protection", () => {
    it("cleans demo records safely while preserving system stability", async () => {
      const cleanRes = await cleanDemoDatabase();
      expect(cleanRes.success).toBe(true);
      expect(cleanRes.message).toContain("preserved");

      const counts = await getDemoRecordCounts();
      expect(counts.serviceRequests).toBe(0);
    });

    it("enforces production safety violation guard when in production mode without override", async () => {
      const prevEnv = process.env.NODE_ENV;
      const prevOverride = process.env.ALLOW_PROD_DEMO_RESET;

      try {
        // @ts-expect-error simulating production environment
        process.env.NODE_ENV = "production";
        delete process.env.ALLOW_PROD_DEMO_RESET;

        await expect(cleanDemoDatabase()).rejects.toThrow(/Safety violation/i);
      } finally {
        // @ts-expect-error restoring env
        process.env.NODE_ENV = prevEnv;
        if (prevOverride) process.env.ALLOW_PROD_DEMO_RESET = prevOverride;
      }
    });

    // Re-seed at the end of the test suite so the application remains seeded
    afterAll(async () => {
      await seedDemoDatabase();
    });
  });
});

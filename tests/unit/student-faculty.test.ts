import { describe, it, expect, afterAll } from "vitest";
import {
  isRequestCancellable,
  cancelServiceRequest,
  createServiceRequest,
} from "@/lib/services/requests";
import { validateImageFile } from "@/lib/services/storage";
import { updateUserProfile } from "@/lib/services/profiles";
import { getCampusAnnouncements } from "@/lib/services/announcements";
import { DEMO_USERS } from "@/lib/demo-data";

describe("Phase 4: Student & Faculty Module Core Logic", () => {
  describe("Photograph File Validation", () => {
    it("accepts valid image formats under 5MB", () => {
      const validFile = new File(["test-image-content"], "photo.jpg", {
        type: "image/jpeg",
      });
      const result = validateImageFile(validFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects non-image files such as PDF", () => {
      const pdfFile = new File(["pdf-binary"], "document.pdf", {
        type: "application/pdf",
      });
      const result = validateImageFile(pdfFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid file type");
    });

    it("rejects image files exceeding 5MB", () => {
      // Mock large file > 5MB (6MB)
      const largeFile = {
        name: "heavy.png",
        size: 6 * 1024 * 1024,
        type: "image/png",
      } as unknown as File;

      const result = validateImageFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("5 MB");
    });
  });

  describe("Request Cancellation Eligibility", () => {
    it("permits cancellation for 'Submitted' and 'Under Review' statuses", () => {
      expect(isRequestCancellable("Submitted")).toBe(true);
      expect(isRequestCancellable("Under Review")).toBe(true);
    });

    it("disallows cancellation for active or completed requests", () => {
      expect(isRequestCancellable("Assigned")).toBe(false);
      expect(isRequestCancellable("In Progress")).toBe(false);
      expect(isRequestCancellable("Resolved")).toBe(false);
      expect(isRequestCancellable("Closed")).toBe(false);
      expect(isRequestCancellable("Rejected")).toBe(false);
    });

    it("successfully cancels eligible request in simulation mode", async () => {
      const result = await cancelServiceRequest("req-002", "Duplicate submission");
      expect(result.success).toBe(true);
      expect(result.message).toContain("cancelled successfully");
    });

    it("throws an error when cancelling an in-progress request", async () => {
      await expect(
        cancelServiceRequest("req-001", "Want to cancel")
      ).rejects.toThrow(/cannot be cancelled/i);
    });
  });

  describe("Service Request Creation", () => {
    it("creates a request with generated request number and Submitted status", async () => {
      const res = await createServiceRequest({
        title: "Broken LCD display in Lab 102",
        description: "Screen flickers continuously when HDMI 2 is connected to laptop",
        departmentId: "dept-it",
        categoryId: "cat-it-av",
        locationId: "loc-02",
        severity: "High",
      });

      expect(res.success).toBe(true);
      expect(res.data?.request_number).toMatch(/^REQ-2026-\d{4}$/);
      expect(res.data?.title).toBe("Broken LCD display in Lab 102");
    });
  });

  describe("Profile Management & Field Protection", () => {
    it("updates permitted fields (full_name, phone_number) successfully", async () => {
      const res = await updateUserProfile("usr-student-01", {
        full_name: "Alex Rivera",
        phone_number: "+1 (555) 987-6543",
      });

      expect(res.success).toBe(true);
      expect(DEMO_USERS.student.full_name).toBe("Alex Rivera");
      expect(DEMO_USERS.student.phone_number).toBe("+1 (555) 987-6543");
    });

    it("prevents changing protected credentials (role, student_id, approval_status)", async () => {
      // Attempting to send protected fields casted as any
      const inputWithProtected = {
        full_name: "Alex Rivera",
        role: "administrator",
        approval_status: "approved",
      } as unknown as { full_name: string };

      await updateUserProfile("usr-student-01", inputWithProtected);

      // Verify that user role remains student
      expect(DEMO_USERS.student.role).toBe("student");
    });

    afterAll(() => {
      DEMO_USERS.student.full_name = "Rahul Kumar";
    });
  });

  describe("Announcements Filtering by Role", () => {
    it("returns announcements targeted for students and all audiences", async () => {
      const announcements = await getCampusAnnouncements("student");
      expect(announcements.length).toBeGreaterThan(0);
      announcements.forEach((a) => {
        const roles = a.target_roles || [];
        const isEligible =
          roles.includes("student") ||
          (roles as string[]).includes("all");
        expect(isEligible).toBe(true);
      });
    });

    it("returns announcements targeted for faculty and all audiences", async () => {
      const announcements = await getCampusAnnouncements("faculty");
      expect(announcements.length).toBeGreaterThan(0);
      announcements.forEach((a) => {
        const roles = a.target_roles || [];
        const isEligible =
          roles.includes("faculty") ||
          (roles as string[]).includes("all");
        expect(isEligible).toBe(true);
      });
    });
  });
});

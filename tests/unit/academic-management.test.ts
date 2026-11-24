import { describe, it, expect } from "vitest";
import {
  submitCourseEnrolment,
  submitStudentAssignment,
  evaluateAssignmentSubmission,
  calculateStudentAcademicRisk,
  createAcademicCourse,
  toggleCoursePublish,
  evaluateCapstoneProject,
  publishGradesForSection,
  getStudentAttendanceHistory,
  DEMO_SECTIONS,
  DEMO_ASSIGNMENTS,
} from "@/lib/services/academic-services";

describe("Academic Management, LMS & University Evaluation System", () => {
  describe("Course Enrolment & Capacity Guardrails", () => {
    it("successfully creates enrolment registration for valid student and open section", async () => {
      const result = await submitCourseEnrolment(
        "test-new-student-99",
        "sec-cs302-a",
        "crs-cs302",
        "sem-spring-2026"
      );

      expect(result.success).toBe(true);
      expect(result.enrolment).toBeDefined();
      expect(result.enrolment?.status).toBe("pending");
      expect(result.enrolment?.course_id).toBe("crs-cs302");
    });

    it("prevents duplicate enrolment in the same course", async () => {
      const studentId = "test-dup-student-01";
      const courseId = "crs-cs303";
      const sectionId = "sec-cs301-a";

      // First enrolment succeeds
      const first = await submitCourseEnrolment(
        studentId,
        sectionId,
        courseId,
        "sem-spring-2026"
      );
      expect(first.success).toBe(true);

      // Duplicate attempt must be rejected
      const second = await submitCourseEnrolment(
        studentId,
        sectionId,
        courseId,
        "sem-spring-2026"
      );
      expect(second.success).toBe(false);
      expect(second.message).toContain("already registered");
    });

    it("enforces waitlist placement when section seat capacity is reached", async () => {
      const targetSection = DEMO_SECTIONS[0];
      const previousEnrolled = targetSection.enrolled_count;
      targetSection.enrolled_count = targetSection.max_seats; // Artificially saturate section

      const res = await submitCourseEnrolment(
        `test-waitlist-student-${Date.now()}`,
        targetSection.id,
        targetSection.course_id,
        "sem-spring-2026"
      );

      expect(res.success).toBe(true);
      expect(res.enrolment?.status).toBe("waitlisted");
      expect(res.enrolment?.waitlist_position).toBeGreaterThan(0);
      expect(res.message).toContain("waitlist");

      // Reset section count
      targetSection.enrolled_count = previousEnrolled;
    });
  });

  describe("Assignment Submission & Deadline Validation", () => {
    it("validates on-time assignment submission and records deliverable metadata", async () => {
      const asg = DEMO_ASSIGNMENTS[0];
      const result = await submitStudentAssignment({
        assignmentId: asg.id,
        studentId: "test-student-sub-1",
        fileName: "kernel_driver.pdf",
        submissionText: "Implemented page table allocator with LRU eviction.",
      });

      expect(result.success).toBe(true);
      expect(result.submission).toBeDefined();
      expect(result.submission?.version).toBe(1);
      expect(result.submission?.file_name).toBe("kernel_driver.pdf");
      expect(result.submission?.status).toBe("submitted");
    });

    it("allows faculty to evaluate submission and record qualitative marks", async () => {
      const asg = DEMO_ASSIGNMENTS[0];
      const subRes = await submitStudentAssignment({
        assignmentId: asg.id,
        studentId: "test-student-sub-2",
        fileName: "analysis.pdf",
        submissionText: "Test submission text.",
      });

      const submissionId = subRes.submission!.id;
      const evalRes = await evaluateAssignmentSubmission(
        submissionId,
        92,
        "Clean architecture and robust semaphore locks."
      );

      expect(evalRes.success).toBe(true);
      expect(evalRes.message).toContain("evaluated");
    });
  });

  describe("Academic Risk Indicator Engine", () => {
    it("identifies students with attendance below mandatory 75% threshold", async () => {
      const history = await getStudentAttendanceHistory("d0000001-0000-0000-0000-000000000001");
      expect(history.overallPercentage).toBeGreaterThanOrEqual(0);
      expect(history.courseBreakdown.length).toBeGreaterThan(0);

      // Verify that course CS303 has attendance < 75% flagged as atRisk
      const cs303 = history.courseBreakdown.find((c) => c.courseCode === "CS303");
      expect(cs303).toBeDefined();
      expect(cs303?.percentage).toBe(70);
      expect(cs303?.isAtRisk).toBe(true);
    });

    it("calculates transparent risk breakdown with specific contributing factors", async () => {
      const risk = await calculateStudentAcademicRisk("usr-student-01");
      expect(risk.attendancePercentage).toBeDefined();
      expect(typeof risk.isAtRisk).toBe("boolean");
      expect(Array.isArray(risk.reasons)).toBe(true);
    });
  });

  describe("Curriculum Administration & Publishing", () => {
    it("allows administrators to create new academic courses and toggle publishing", async () => {
      const newCourse = await createAcademicCourse({
        course_code: "CS499",
        title: "Autonomous Agent Architectures",
        description: "Cognitive architectures, multi-agent swarms, and safety alignment.",
        credits: 4,
        lecture_hours: 3,
        lab_hours: 2,
        max_enrolment_capacity: 45,
      });

      expect(newCourse.id).toBeDefined();
      expect(newCourse.course_code).toBe("CS499");
      expect(newCourse.is_published).toBe(true);

      // Toggle unpublish
      const unpub = await toggleCoursePublish(newCourse.id);
      expect(unpub.success).toBe(true);
      expect(unpub.is_published).toBe(false);

      // Toggle publish again
      const repub = await toggleCoursePublish(newCourse.id);
      expect(repub.success).toBe(true);
      expect(repub.is_published).toBe(true);
    });

    it("supports multi-stage capstone project rubric scoring", async () => {
      const evalRes = await evaluateCapstoneProject(
        "proj-01",
        "Final Evaluation",
        {
          problemDefinition: 19,
          technicalArchitecture: 24,
          innovation: 18,
          testingValidation: 19,
          presentationViva: 14,
        },
        "Exemplary demonstration of edge compute mesh and low-latency fallbacks."
      );

      expect(evalRes.success).toBe(true);
      expect(evalRes.message).toContain("94/100");
    });

    it("publishes gradebook records for section with official sign-off", async () => {
      const pubRes = await publishGradesForSection("sec-cs301-a");
      expect(pubRes.success).toBe(true);
      expect(pubRes.count).toBeGreaterThanOrEqual(0);
    });
  });
});

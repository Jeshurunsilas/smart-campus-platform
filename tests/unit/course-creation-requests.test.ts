import { describe, it, expect } from "vitest";
import {
  createFacultyCourse,
  adminReviewCourse,
  adminToggleCoursePublication,
  getStudentCourseCatalogue,
  submitStudentCourseJoinRequest,
  submitFacultyCollaborationRequest,
  reviewCourseRequest,
  bulkApproveStudentRequests,
  cancelCourseRequest,
  getCourseWorkspaceDetails,
  DEMO_COURSES,
  DEMO_COURSE_REQUESTS,
  DEMO_COURSE_MEMBERSHIPS,
} from "@/lib/services/academic-services";

describe("Course Creation, Join Requests & Lifecycle Workflows", () => {
  const facultyId = "d0000001-0000-0000-0000-000000000003"; // Dr. Elena Rostova
  const adminId = "d0000001-0000-0000-0000-000000000004";

  describe("Section A: Faculty Course Creation & Drafts", () => {
    it("allows faculty to save a course as Draft", async () => {
      const res = await createFacultyCourse(
        {
          course_code: "TEST-DRAFT-101",
          title: "Introduction to Compilers",
          description: "Lexical analysis, AST generation, and LLVM intermediate representation.",
          credits: 4,
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        true // saveAsDraft
      );

      expect(res.success).toBe(true);
      expect(res.course).toBeDefined();
      expect(res.course?.approval_status).toBe("DRAFT");
      expect(res.course?.publication_status).toBe("DRAFT");
      expect(res.course?.is_published).toBe(false);
    });

    it("sets status to PENDING_APPROVAL when submitted for administrative review", async () => {
      const res = await createFacultyCourse(
        {
          course_code: "TEST-PEND-102",
          title: "Advanced Database Internals",
          description: "B-Tree indexing, write-ahead logging, and query optimizer cost models.",
          credits: 3,
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        false // submit for approval
      );

      expect(res.success).toBe(true);
      expect(res.course?.approval_status).toBe("PENDING_APPROVAL");
      expect(res.course?.is_published).toBe(false);
      expect(res.course?.submitted_at).toBeDefined();
    });

    it("prevents duplicate course codes within the same academic period", async () => {
      const first = await createFacultyCourse(
        {
          course_code: "TEST-DUP-103",
          title: "Computer Networks I",
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        false
      );
      expect(first.success).toBe(true);

      const duplicate = await createFacultyCourse(
        {
          course_code: "TEST-DUP-103",
          title: "Computer Networks Duplicate",
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        false
      );

      expect(duplicate.success).toBe(false);
      expect(duplicate.error).toContain("already exists");
    });
  });

  describe("Section B: Administrator Review & Catalogue Publishing", () => {
    it("allows administrator to approve course and publish to catalogue", async () => {
      const created = await createFacultyCourse(
        {
          course_code: "TEST-APP-201",
          title: "Cyber-Physical Systems Security",
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        false
      );

      const review = await adminReviewCourse(created.course!.id, "approve", adminId);
      expect(review.success).toBe(true);
      expect(review.course?.approval_status).toBe("APPROVED");
      expect(review.course?.is_published).toBe(true);
      expect(review.course?.publication_status).toBe("PUBLISHED");

      // Verify course appears in student catalogue
      const catalogue = getStudentCourseCatalogue();
      const inCatalogue = catalogue.find((c) => c.id === created.course!.id);
      expect(inCatalogue).toBeDefined();
    });

    it("records formal rejection reason when an administrator declines a course", async () => {
      const created = await createFacultyCourse(
        {
          course_code: "TEST-REJ-202",
          title: "Experimental Quantum Machine Learning",
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        false
      );

      const rejectReason = "Insufficient prerequisite laboratory infrastructure.";
      const review = await adminReviewCourse(
        created.course!.id,
        "reject",
        adminId,
        rejectReason
      );

      expect(review.success).toBe(true);
      expect(review.course?.approval_status).toBe("REJECTED");
      expect(review.course?.rejection_reason).toBe(rejectReason);
      expect(review.course?.is_published).toBe(false);
    });

    it("supports requesting curriculum modifications with feedback notes", async () => {
      const created = await createFacultyCourse(
        {
          course_code: "TEST-MOD-203",
          title: "Unmanned Aerial Robotics",
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        false
      );

      const modNotes = "Please add safety regulations module and FAA guidelines.";
      const review = await adminReviewCourse(
        created.course!.id,
        "request_modifications",
        adminId,
        undefined,
        modNotes
      );

      expect(review.success).toBe(true);
      expect(review.course?.approval_status).toBe("MODIFICATIONS_REQUESTED");
      expect(review.course?.modification_notes).toBe(modNotes);
    });

    it("prevents publishing unapproved courses to student catalogue", async () => {
      const draftCourse = await createFacultyCourse(
        {
          course_code: "TEST-UNAPP-204",
          title: "Draft Syllabus Course",
          academic_year: "2025-2026",
          faculty_owner_id: facultyId,
        },
        true
      );

      const toggleRes = await adminToggleCoursePublication(draftCourse.course!.id, true);
      expect(toggleRes.success).toBe(false);
      expect(toggleRes.error).toContain("approved");
    });
  });

  describe("Section C: Student Course Join Requests & Validations", () => {
    it("submits student course join request in PENDING status", async () => {
      const targetCourse = DEMO_COURSES.find(
        (c) => c.approval_status === "APPROVED" && c.is_published
      )!;

      const studentId = `test-stu-${Date.now()}-1`;
      const reqRes = await submitStudentCourseJoinRequest(
        studentId,
        targetCourse.id,
        undefined,
        "Excited to enrol in this course for specialisation."
      );

      expect(reqRes.success).toBe(true);
      expect(reqRes.request).toBeDefined();
      expect(reqRes.request?.status).toBe("PENDING");
      expect(reqRes.request?.applicant_role).toBe("student");
    });

    it("prevents duplicate join requests for the same course", async () => {
      const targetCourse = DEMO_COURSES.find(
        (c) => c.approval_status === "APPROVED" && c.is_published
      )!;

      const studentIdDup = `test-dup-${Date.now()}`;
      const first = await submitStudentCourseJoinRequest(studentIdDup, targetCourse.id);
      expect(first.success).toBe(true);

      const second = await submitStudentCourseJoinRequest(studentIdDup, targetCourse.id);
      expect(second.success).toBe(false);
      expect(second.error).toContain("already have an active or approved request");
    });

    it("enforces enrolment deadlines and rejects late submissions", async () => {
      const expiredCourse = await createFacultyCourse(
        {
          course_code: "TEST-EXP-301",
          title: "Expired Registration Course",
          academic_year: "2025-2026",
          enrolment_deadline: "2025-01-01", // in past
        },
        false
      );

      await adminReviewCourse(expiredCourse.course!.id, "approve", adminId);

      const lateReq = await submitStudentCourseJoinRequest(
        "student-late-01",
        expiredCourse.course!.id
      );

      expect(lateReq.success).toBe(false);
      expect(lateReq.error).toContain("deadline");
    });

    it("places request on WAITLIST when course capacity is reached", async () => {
      const fullCourse = await createFacultyCourse(
        {
          course_code: "TEST-CAP-302",
          title: "Full Capacity Seminar",
          max_enrolment_capacity: 1, // Only 1 seat
          academic_year: "2025-2026",
          enrolment_deadline: "2027-05-30",
        },
        false
      );

      await adminReviewCourse(fullCourse.course!.id, "approve", adminId);

      // Saturate capacity with 1 active student membership
      DEMO_COURSE_MEMBERSHIPS.push({
        id: `mem-cap-${Date.now()}`,
        course_id: fullCourse.course!.id,
        user_id: "student-existing-seated",
        role: "student",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const waitlistReq = await submitStudentCourseJoinRequest(
        "student-waitlist-test-01",
        fullCourse.course!.id
      );

      expect(waitlistReq.success).toBe(true);
      expect(waitlistReq.request?.status).toBe("WAITLISTED");
    });

    it("allows student to cancel their own pending request", async () => {
      const targetCourse = DEMO_COURSES.find(
        (c) => c.approval_status === "APPROVED" && c.is_published
      )!;

      const studentIdCancel = `student-cancel-${Date.now()}`;
      const req = await submitStudentCourseJoinRequest(studentIdCancel, targetCourse.id);
      expect(req.success).toBe(true);

      const cancelRes = await cancelCourseRequest(req.request!.id, studentIdCancel);
      expect(cancelRes.success).toBe(true);

      const cancelledItem = DEMO_COURSE_REQUESTS.find((r) => r.id === req.request!.id);
      expect(cancelledItem?.status).toBe("CANCELLED");
    });
  });

  describe("Section D & E: Faculty Collaboration & Request Approvals", () => {
    it("submits faculty collaboration request for peer course", async () => {
      const peerCourse = await createFacultyCourse(
        {
          course_code: "TEST-COL-401",
          title: "Parallel Architectures",
          faculty_owner_id: "usr-faculty-owner-99",
          allow_faculty_collaboration: true,
          enrolment_deadline: "2027-05-30",
        },
        false
      );
      await adminReviewCourse(peerCourse.course!.id, "approve", adminId);

      const collabRes = await submitFacultyCollaborationRequest(
        facultyId,
        peerCourse.course!.id,
        "co_instructor",
        "Offer to deliver parallel laboratory tracks and seminar guest lectures."
      );

      expect(collabRes.success).toBe(true);
      expect(collabRes.request?.request_type).toBe("faculty_collaboration");
      expect(collabRes.request?.requested_role).toBe("co_instructor");
      expect(collabRes.request?.status).toBe("PENDING");
    });

    it("approving request creates active course membership without changing course owner", async () => {
      const collabCourse = await createFacultyCourse(
        {
          course_code: "TEST-COL-402",
          title: "Robotic Perception Lab",
          faculty_owner_id: facultyId,
          allow_faculty_collaboration: true,
          enrolment_deadline: "2027-05-30",
        },
        false
      );
      await adminReviewCourse(collabCourse.course!.id, "approve", adminId);

      const applicantFaculty = `usr-collab-${Date.now()}`;
      const collabReq = await submitFacultyCollaborationRequest(
        applicantFaculty,
        collabCourse.course!.id,
        "teaching_assistant",
        "Assist with grading weekly programming deliverables."
      );

      expect(collabReq.success).toBe(true);
      const approveRes = await reviewCourseRequest(collabReq.request!.id, "approve", facultyId);
      expect(approveRes.success).toBe(true);
      expect(approveRes.request?.status).toBe("APPROVED");
      expect(approveRes.membership).toBeDefined();
      expect(approveRes.membership?.role).toBe("teaching_assistant");

      // Verify course owner has not changed
      expect(collabCourse.course?.faculty_owner_id).toBe(facultyId);
    });

    it("supports bulk approval of eligible student requests", async () => {
      const bulkCourse = await createFacultyCourse(
        {
          course_code: "TEST-BULK-403",
          title: "Big Data Stream Processing",
          faculty_owner_id: facultyId,
          enrolment_deadline: "2027-05-30",
        },
        false
      );
      await adminReviewCourse(bulkCourse.course!.id, "approve", adminId);

      const req1 = await submitStudentCourseJoinRequest(`bulk-stu-1-${Date.now()}`, bulkCourse.course!.id);
      const req2 = await submitStudentCourseJoinRequest(`bulk-stu-2-${Date.now()}`, bulkCourse.course!.id);

      expect(req1.success).toBe(true);
      expect(req2.success).toBe(true);

      const bulkRes = await bulkApproveStudentRequests(
        [req1.request!.id, req2.request!.id],
        facultyId
      );

      expect(bulkRes.success).toBe(true);
      expect(bulkRes.approvedCount).toBe(2);
    });
  });

  describe("Section F: Course Workspace & Access Control", () => {
    it("provides course workspace details with correct role permissions", () => {
      const details = getCourseWorkspaceDetails("crs-cs301", facultyId, "faculty");
      expect(details.course).toBeDefined();
      expect(details.isMember).toBe(true);
      expect(details.userMembershipRole).toBe("course_owner");
      expect(details.materials.length).toBeGreaterThan(0);
    });

    it("denies active member status to non-enrolled students", () => {
      const details = getCourseWorkspaceDetails(
        "crs-cs301",
        "random-unregistered-student",
        "student"
      );
      expect(details.isMember).toBe(false);
      expect(details.userMembershipRole).toBeUndefined();
    });
  });
});

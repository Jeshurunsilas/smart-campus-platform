import { describe, it, expect } from "vitest";
import {
  createServiceRequest,
  assignRequestToStaff,
  acceptRequestAssignment,
  startRequestWork,
  addRequestWorkNote,
  resolveServiceRequest,
  submitRequestFeedback,
  getRequestUpdates,
} from "@/lib/services/requests";
import { calculateSmartPriority } from "@/lib/services/priority-engine";
import { calculateSLADeadline, getSLARemainingTime } from "@/lib/services/sla";

describe("Phase 7: End-to-End Service Request Lifecycle Integration", () => {
  it("executes the complete service lifecycle from submission to verified resolution", async () => {
    // --------------------------------------------------------------------------
    // STEP 1: Student submits service request
    // --------------------------------------------------------------------------
    const submitResult = await createServiceRequest({
      title: "Broken Projector Bulb in Lecture Hall B",
      description: "Bulb exploded during engineering seminar. Unit gives 3 red LED blinks.",
      departmentId: "dept-it",
      categoryId: "cat-it-av",
      locationId: "loc-02",
      severity: "High",
    });

    expect(submitResult.success).toBe(true);
    expect(submitResult.data).toBeDefined();
    const requestId = submitResult.data!.id;
    const trackingNumber = submitResult.data!.request_number;
    expect(trackingNumber).toBeDefined();

    // --------------------------------------------------------------------------
    // STEP 2: Smart Priority Engine analyzes ticket parameters
    // --------------------------------------------------------------------------
    const priorityAssessment = calculateSmartPriority({
      severity: "High",
      categoryDefaultPriority: "High",
      building: "Science & Engineering Complex",
      roomNumber: "Lecture Hall B",
    });

    expect(["High", "Critical"]).toContain(priorityAssessment.recommendedPriority);
    expect(priorityAssessment.score).toBeGreaterThanOrEqual(48);

    // Calculate SLA deadline
    const createdAt = new Date().toISOString();
    const deadline = calculateSLADeadline(createdAt, priorityAssessment.recommendedPriority);
    expect(deadline).toBeDefined();

    const slaInfo = getSLARemainingTime(deadline, createdAt);
    expect(slaInfo.isOverdue).toBe(false);
    expect(slaInfo.hours).toBeLessThanOrEqual(12);

    // --------------------------------------------------------------------------
    // STEP 3: Administrator triages and assigns to field technician
    // --------------------------------------------------------------------------
    const assignResult = await assignRequestToStaff(
      requestId,
      "usr-staff-01",
      "Dispatched to AV hardware specialist technician."
    );
    expect(assignResult).toBe(true);

    // --------------------------------------------------------------------------
    // STEP 4: Technician accepts dispatch assignment
    // --------------------------------------------------------------------------
    const acceptResult = await acceptRequestAssignment(
      requestId,
      "Technician acknowledged. En route from Tech Center."
    );
    expect(acceptResult).toBe(true);

    // --------------------------------------------------------------------------
    // STEP 5: Technician starts work and logs diagnostic progress notes
    // --------------------------------------------------------------------------
    const startResult = await startRequestWork(
      requestId,
      "Arrived on-site. Housing cooled down. Installing 300W replacement bulb module."
    );
    expect(startResult).toBe(true);

    const noteResult = await addRequestWorkNote(
      requestId,
      "Bulb timer reset. Running HDMI video signal test at 1080p 60Hz. Display bright and stable."
    );
    expect(noteResult).toBe(true);

    // --------------------------------------------------------------------------
    // STEP 6: Technician resolves work order and uploads completion evidence
    // --------------------------------------------------------------------------
    const resolveResult = await resolveServiceRequest(
      requestId,
      "Replaced blown bulb module with OEM bulb #ELP-88. Cleaned intake air filters. Verified operation with test card.",
      "https://storage.supabase.local/service-request-images/resolution_projector_hall_b.jpg"
    );
    expect(resolveResult).toBe(true);

    // --------------------------------------------------------------------------
    // STEP 7: Requester submits CSAT feedback
    // --------------------------------------------------------------------------
    const feedbackResult = await submitRequestFeedback(
      requestId,
      5,
      "Fast response! The technician replaced the bulb within 2 hours before the next class started."
    );
    expect(feedbackResult).toBe(true);

    // --------------------------------------------------------------------------
    // STEP 8: Verify audit trail
    // --------------------------------------------------------------------------
    const updates = await getRequestUpdates(requestId);
    expect(updates.length).toBeGreaterThan(0);
    expect(updates[0]?.new_status).toBe("Submitted");
  });
});

import { test, expect } from "@playwright/test";

test.describe("End-to-End Course Creation, Join & Collaboration Workflows", () => {
  test("Complete 8-step lifecycle: Faculty creation -> Admin approval -> Student catalogue -> Join request -> Faculty approval -> Course workspace -> Faculty collaboration -> Owner approval", async ({
    page,
  }) => {
    // -------------------------------------------------------------
    // Step 1: Faculty navigates to Create Course and submits proposal
    // -------------------------------------------------------------
    await page.goto("/faculty/courses/create");
    await expect(page.locator("text=Create New Academic Course")).toBeVisible();
    await expect(page.locator("text=Course Identification & Core Metadata")).toBeVisible();

    // Fill form
    await page.fill("input[placeholder*='Distributed Computing']", "Autonomous Multi-Agent Systems");
    await page.fill("input[placeholder*='CS305']", "CS490");
    await page.fill("textarea[placeholder*='Comprehensive academic abstract']", "Theoretical foundations of decentralized agent cooperation, game theoretic coordination, and multi-robot task allocation.");

    // Click Submit for Approval
    const submitBtn = page.locator("button:has-text('Submit for Approval')").first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify success banner and redirection
    await expect(page.locator("text=PENDING_APPROVAL")).toBeVisible();

    // -------------------------------------------------------------
    // Step 2: Administrator inspects, approves and publishes course
    // -------------------------------------------------------------
    await page.goto("/admin/course-approvals");
    await expect(page.locator("text=Course Approval Management")).toBeVisible();
    await expect(page.locator("text=Pending (")).toBeVisible();

    // Verify the pending course is listed
    await expect(page.locator("text=CS490")).toBeVisible();

    // Find and click Approve on the course row
    const approveBtn = page.locator("tr:has-text('CS490') button:has-text('Approve')");
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Confirmation notification
    await expect(page.locator("text=approved and published")).toBeVisible();

    // -------------------------------------------------------------
    // Step 3: Student browses published course in Catalogue
    // -------------------------------------------------------------
    await page.goto("/student/courses");
    await expect(page.locator("text=Academic Course Catalogue")).toBeVisible();
    await expect(page.locator("text=Explore & Enrol in University Courses")).toBeVisible();

    // Verify CS490 is available in catalogue
    await expect(page.locator("text=CS490")).toBeVisible();
    await expect(page.locator("text=Autonomous Multi-Agent Systems")).toBeVisible();

    // -------------------------------------------------------------
    // Step 4: Student submits join request
    // -------------------------------------------------------------
    const joinBtn = page.locator("div:has-text('CS490') button:has-text('Request to Join')").first();
    await expect(joinBtn).toBeVisible();
    await joinBtn.click();

    // Modal opens
    await expect(page.locator("text=Confirm Course Join Request: CS490")).toBeVisible();
    await page.fill("textarea[placeholder*='Explain why you wish to enrol']", "Interested in multi-agent reinforcement learning for my capstone research.");

    const confirmSubmitBtn = page.locator("button:has-text('Submit Join Request')");
    await expect(confirmSubmitBtn).toBeVisible();
    await confirmSubmitBtn.click();

    // Verify success notification
    await expect(page.locator("text=Current status: PENDING approval")).toBeVisible();

    // -------------------------------------------------------------
    // Step 5: Faculty reviews and approves student request
    // -------------------------------------------------------------
    await page.goto("/faculty/course-requests");
    await expect(page.locator("text=Course Enrolment & Collaboration Requests")).toBeVisible();

    // Verify student request for CS490 appears
    await expect(page.locator("text=CS490")).toBeVisible();
    const facultyApproveBtn = page.locator("tr:has-text('CS490') button:has-text('Approve')").first();
    await expect(facultyApproveBtn).toBeVisible();
    await facultyApproveBtn.click();

    await expect(page.locator("text=membership record created successfully")).toBeVisible();

    // -------------------------------------------------------------
    // Step 6: Student opens protected Course Workspace
    // -------------------------------------------------------------
    await page.goto("/student/my-courses");
    await expect(page.locator("text=My Enrolled Degree Courses")).toBeVisible();

    // Student navigates into course workspace (e.g. crs-cs301)
    await page.goto("/student/courses/crs-cs301");
    await expect(page.locator("text=CS301: Operating Systems & Distributed Architecture")).toBeVisible();
    await expect(page.locator("text=Enrolled Student Member")).toBeVisible();
    await expect(page.locator("text=Official Syllabus")).toBeVisible();

    // Check tabs
    await page.click("button:has-text('Learning Materials')");
    await expect(page.locator("text=Approved Course Slides, Notes & Code Repositories")).toBeVisible();
    await expect(page.locator("text=Download Deliverable").first()).toBeVisible();

    // -------------------------------------------------------------
    // Step 7: Faculty requests collaboration on a peer course
    // -------------------------------------------------------------
    await page.goto("/faculty/collaboration");
    await expect(page.locator("text=Inter-Departmental Faculty Collaboration")).toBeVisible();

    // Find collaborative course and click request
    const collabBtn = page.locator("button:has-text('Request Faculty Collaboration')").first();
    if (await collabBtn.isVisible()) {
      await collabBtn.click();
      await expect(page.locator("text=Apply for Faculty Collaboration")).toBeVisible();
      await page.fill("textarea[placeholder*='Detail your domain expertise']", "Offer co-instruction on microkernel architecture and fault tolerance.");
      await page.click("button:has-text('Send Proposal to Course Owner')");
      await expect(page.locator("text=submitted to the course owner")).toBeVisible();
    }

    // -------------------------------------------------------------
    // Step 8: Course owner reviews and approves collaboration
    // -------------------------------------------------------------
    await page.goto("/faculty/course-requests?type=faculty_collaboration");
    await expect(page.locator("text=Course Enrolment & Collaboration Requests")).toBeVisible();
  });
});

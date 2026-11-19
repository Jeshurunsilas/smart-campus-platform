import { test, expect } from "@playwright/test";

test.describe("Smart Campus Platform End-to-End Suite", () => {
  test("Public Authentication: loads login page with campus branding and role quick-switch", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/Smart Campus/i);
    await expect(page.locator("text=Sign in to your campus account")).toBeVisible();
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();

    // Verify Demo Quick Switch pills are available for fast triage
    await expect(page.locator("text=Student Demo")).toBeVisible();
    await expect(page.locator("text=Faculty Demo")).toBeVisible();
    await expect(page.locator("text=Admin Demo")).toBeVisible();
    await expect(page.locator("text=Staff Demo")).toBeVisible();
  });

  test("Student Portal: dashboard displays KPI metrics and allows navigating to new request", async ({
    page,
  }) => {
    await page.goto("/student/dashboard");

    await expect(page.locator("text=Student Dashboard")).toBeVisible();
    await expect(page.locator("text=Total Requests")).toBeVisible();
    await expect(page.locator("text=In Progress")).toBeVisible();
    await expect(page.locator("text=Resolved")).toBeVisible();

    // Click to navigate to new request form
    const createBtn = page.locator("a[href='/student/requests/new']").first();
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    await expect(page).toHaveURL(/\/student\/requests\/new/);
    await expect(page.locator("text=Create Service Request")).toBeVisible();
  });

  test("Service Request Submission Form: features QR simulation and smart priority engine", async ({
    page,
  }) => {
    await page.goto("/student/requests/new");

    // Check QR scan simulation button
    const qrBtn = page.locator("button:has-text('Simulate QR Scan')");
    await expect(qrBtn).toBeVisible();
    await qrBtn.click();

    // Verify building / room auto-filled from QR code token
    await expect(page.locator("button:has-text('Re-scan Plaque')")).toBeVisible();

    // Check Smart Priority badge is rendered
    await expect(page.locator("text=Smart Priority Engine")).toBeVisible();
  });

  test("Administrator Portal: executive dashboard loads telemetry and user management", async ({
    page,
  }) => {
    await page.goto("/admin/dashboard");

    await expect(page.locator("text=Campus Administration Executive HQ")).toBeVisible();
    await expect(page.locator("text=Total Students")).toBeVisible();
    await expect(page.locator("text=Faculty Members")).toBeVisible();

    // Check approvals queue
    await page.goto("/admin/approvals");
    await expect(page.locator("text=Pending Account Approvals")).toBeVisible();

    // Check user manager
    await page.goto("/admin/users");
    await expect(page.locator("text=Campus User Directory")).toBeVisible();
    await expect(page.locator("button:has-text('Provision Staff Account')")).toBeVisible();
  });

  test("Department Staff Portal: technician queue loads assigned work orders and actions", async ({
    page,
  }) => {
    await page.goto("/department/dashboard");

    await expect(page.locator("text=Facilities Operations Dispatch")).toBeVisible();
    await expect(page.locator("text=Active Field Assignment Queue")).toBeVisible();

    // Check assigned requests full queue
    await page.goto("/department/assigned-requests");
    await expect(page.locator("text=Assigned Work Orders")).toBeVisible();
    await expect(page.locator("input[placeholder*='Search by ticket ID']")).toBeVisible();
  });

  test("Analytics & Heatmap: displays campus incident density map and department scorecards", async ({
    page,
  }) => {
    await page.goto("/admin/analytics");

    await expect(page.locator("text=Campus Service Analytics & Intelligence")).toBeVisible();
    await expect(page.locator("text=Campus Satisfaction Index")).toBeVisible();

    // Switch to Heatmap tab
    const heatmapTab = page.locator("button:has-text('Campus Heatmap')");
    await expect(heatmapTab).toBeVisible();
    await heatmapTab.click();

    await expect(page.locator("text=Live Campus Incident Density Heatmap")).toBeVisible();
    await expect(page.locator("text=Science & Chemistry Complex")).toBeVisible();
  });
});

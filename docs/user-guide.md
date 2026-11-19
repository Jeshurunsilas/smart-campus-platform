# Smart Campus Platform - User Operations Guide

---

## 1. Role-Based Navigation & Portals

The platform separates responsibilities across 4 dedicated role experiences:
1. **Student Portal:** `/student/dashboard`
2. **Faculty Portal:** `/faculty/dashboard`
3. **Administrator Command Center:** `/admin/dashboard`
4. **Department Staff Operations:** `/department/dashboard`

---

## 2. Student User Guide

### 2.1 Submitting a New Service Request
1. Log in to your campus account and navigate to **Student Dashboard**.
2. Click the teal **"Submit Service Request"** button.
3. If reporting from a room equipped with a digital plaque, click **"Simulate QR Scan"** to instantly auto-fill building, floor, and room number.
4. Select the responsible **Campus Department** and **Issue Category**.
5. Provide a clear **Request Summary** and detailed **Problem Description**.
6. Select the issue **Severity Level** (`Low`, `Medium`, `High`, or `Critical`).
   - Notice the **Smart Priority Engine** badge displaying calculated urgency.
7. (Optional) Click **Upload Photograph** to attach a photo showing the malfunction (JPEG/PNG up to 5MB).
8. Click **Submit Service Request**. You will immediately receive a unique tracking number (`REQ-2026-XXXX`).

### 2.2 Tracking Ticket Progress & Lifecycle
1. Navigate to `/student/requests` to view your active and resolved tickets.
2. Use the search bar to locate tickets by tracking number, title, or room.
3. Click any row to open the **Lifecycle Audit Trail Modal** to view technician progress notes and timestamps.
4. If a ticket is in `Submitted` or `Under Review` status and was created in error, click **Cancel Request** to withdraw it.

### 2.3 Submitting Service Feedback
1. Once your request status transitions to **Resolved**, a rating prompt appears on your dashboard.
2. Select 1 to 5 stars and enter optional feedback to score the technician's repair quality.

---

## 3. Faculty User Guide

Faculty members enjoy all student capabilities, plus:
- **Priority Classroom AV Triage:** Faster SLA routing for lecture hall projectors, classroom microphones, and podium connectivity.
- **Office & Research Lab Tagging:** Immediate dispatch routing to Lab Safety Operations for chemical fume hoods, vacuum lines, and pure water systems.

---

## 4. Administrator Command Center Guide

### 4.1 Executive Dashboard Telemetry
- Inspect live KPI statistics: Total Students, Faculty Members, Dispatched Technicians, Active Orders, and Overdue SLA Breaches.
- Fast dispatch table allows triaging newly submitted campus tickets directly from the dashboard.

### 4.2 Account Approval Queue (`/admin/approvals`)
- Review newly registered student and faculty credentials.
- Click **Approve Account** to grant immediate system access.
- Click **Reject** and provide a reason if credentials fail verification.

### 4.3 User Directory Management (`/admin/users`)
- Search all registered campus users by name or institutional email.
- Toggle active/inactive account status to suspend or reactivate accounts.
- Click **Provision Staff Account** to issue credentials to new maintenance technicians.

### 4.4 Department & Category Management (`/admin/departments`, `/admin/categories`)
- Create new university operational departments.
- Define custom ticket categories and establish legal SLA hourly targets (e.g. 4h, 12h, 24h, 48h).

### 4.5 Campus Incident Heatmap & Analytics (`/admin/analytics`)
- View the 2D architectural campus heatmap to identify incident hotspots and recurring maintenance problem zones.
- Review department scorecards, resolution velocity curves, and CSAT ratings.

---

## 5. Department Staff & Technician Guide

### 5.1 Receiving & Accepting Dispatches
1. Navigate to `/department/assigned-requests`.
2. New work orders appear with status `Assigned`.
3. Click **Accept** to acknowledge receipt of the dispatch.
4. If the work order requires special licensing or outside vendors, click **Decline** and provide a reason to re-route to administration.

### 5.2 Performing Work & Logging Notes
1. Upon arriving at the campus location, click **Start Work** to move the ticket to `In Progress`.
2. Click **Note** to log interim diagnostic findings (e.g. "Replaced 15A fuse; running diagnostic cycle").

### 5.3 Work Order Resolution & Evidence
1. Click **Resolve**.
2. Document the corrective actions performed in the mandatory summary field.
3. Upload a verification completion photograph proving the repair was completed to university standards.
4. Click **Mark as Resolved & Complete**.

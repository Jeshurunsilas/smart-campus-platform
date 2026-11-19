# Smart Campus Platform - Enterprise Confluence Knowledge Base

**Space Key:** `SMARTCAMPUS`  
**Space Name:** Smart Campus Platform Engineering & Operations  
**Classification:** Internal Enterprise Documentation  
**Version:** 1.0.0  

---

## 1. Executive Summary & Platform Purpose
The **Integrated Smart Campus and Service Request Management Platform** is a university-wide enterprise SaaS application connecting over 25,000 students, faculty, campus operations personnel, and administrators through a unified incident intake, routing, and resolution engine.

### Core Business Objectives:
1. **Reduce Mean Time to Resolution (MTTR):** Cut campus facility repair times from 38 hours to under 6 hours via automated triage and location-aware dispatch.
2. **Eliminate Lost Tickets:** Establish a 100% immutable audit trail for every maintenance issue from submission to photographic sign-off.
3. **Prevent Safety Hazards:** Automatically elevate critical chemical, electrical, and structural hazards to urgent emergency dispatches with 4-hour SLA guarantees.
4. **Transparent Communication:** Provide students and faculty with real-time status notifications and duplicate warnings to eliminate duplicate complaints.

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Selection of Next.js 16 with App Router & Webpack
- **Status:** Approved & Implemented
- **Context:** The platform requires server-side rendering for administrative dashboards, instant static generation for public auth portals, and clean API route ergonomics.
- **Decision:** Utilize Next.js 16 with App Router. For Windows production stability and compatibility with Tailwind CSS v4, configure Webpack bundler (`next build --webpack`).
- **Consequences:** Ensures zero Turbopack IPC worker timeouts on Windows nodes while providing fast prerendering across all 40+ dynamic routes.

### ADR-002: Supabase as Managed PostgreSQL, Auth, and Storage Backend
- **Status:** Approved & Implemented
- **Context:** Building standalone auth servers, S3 storage wrappers, and database connection pools would increase infrastructure management overhead.
- **Decision:** Adopt Supabase PostgreSQL with built-in Row-Level Security (RLS), Supabase Auth JWT verification, S3-compatible file storage, and Realtime Postgres CDC.
- **Consequences:** Client and server access can be tightly controlled via Postgres RLS policies. Browser bundles only use the public anon key with zero service-role leakage.

### ADR-003: Multi-Factor Smart Priority Engine
- **Status:** Approved & Implemented
- **Context:** Relying strictly on student self-reported severity leads to ticket bloat (e.g. students marking burnt-out lamps as "Critical").
- **Decision:** Implement a hybrid scoring engine factoring in:
  1. User-reported severity (max 55 pts)
  2. Campus location impact (labs, server rooms, and medical zones receive +25 pts)
  3. Category baseline SLA (max 20 pts)
  4. Localized repeat ticket spikes (+15 pts for 3+ tickets in 48 hours)
- **Consequences:** Tickets are automatically classified with high precision, and human administrators can override priority with a logged audit reason.

---

## 3. Standard Operating Procedures (SOPs)

### SOP-101: Field Technician Daily Work Order Execution
1. **Shift Login:** Log in to `/login` using assigned staff credentials or staff badge ID.
2. **Queue Review:** Navigate to `/department/assigned-requests`. Filter by `Assigned` to view newly dispatched tickets.
3. **Acceptance:** Click **Accept** on assigned work orders. This timestamps the acknowledgment and notifies the requester.
4. **On-Site Commencing:** Upon reaching the physical campus location, click **Start Work** to transition ticket status to `In Progress`.
5. **Work Notes:** If parts are required, log an audit work note (e.g. "Ordered replacement condenser fuse").
6. **Resolution & Evidence:** When repair is complete and verified:
   - Click **Resolve Work Order**.
   - Enter detailed corrective actions in the summary text.
   - Attach a clear photograph showing the completed repair.
   - Click **Mark as Resolved**.

### SOP-102: Administrative Overdue Ticket Escalation
1. **Automated Cron:** The system invokes `/api/cron/escalate` every 15 minutes to evaluate tickets where `sla_deadline < now()`.
2. **Supervisor Alert:** Overdue tickets are automatically updated with `is_overdue = true` and logged into `escalation_history`.
3. **Manual Reassignment:** Administrators inspect `/admin/requests`, filter by `Overdue`, and can reassign the work order to an on-duty supervisor or outside vendor.

---

## 4. Disaster Recovery & Security Runbook

### Supabase Database Backup & Migration SOP:
- Automated daily logical backups are retained on Supabase for 30 days.
- In the event of a staging restoration:
  ```bash
  psql -h db.fnpkjczdfikachurbsgb.supabase.co -U postgres -d postgres -f database/migrations/01_initial_schema.sql
  psql -h db.fnpkjczdfikachurbsgb.supabase.co -U postgres -d postgres -f database/migrations/02_row_level_security.sql
  psql -h db.fnpkjczdfikachurbsgb.supabase.co -U postgres -d postgres -f database/migrations/03_storage_and_seed_data.sql
  psql -h db.fnpkjczdfikachurbsgb.supabase.co -U postgres -d postgres -f database/migrations/04_smart_features_and_escalation.sql
  ```

### Storage Bucket Access Control Policy:
- Bucket Name: `service-request-images`
- Max File Size: 5 Megabytes
- Permitted MIME Types: `image/jpeg`, `image/png`, `image/webp`
- Access Control: Public Read, Authenticated Write only with validated MIME inspection.

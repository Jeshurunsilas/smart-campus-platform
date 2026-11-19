# Smart Campus Platform - JIRA Agile Project Plan & Work Breakdown Structure (WBS)

## Project Title
**Development of an Integrated Smart Campus and Service Request Management Platform with Automated Testing and Deployment**

**Project Key:** `SCP`  
**Methodology:** Agile Scrum (2-Week Sprints)  
**Total Epics:** 9  
**Total User Stories:** 36  
**Total Estimated Story Points:** 168 pts  

---

## EPIC Breakdown & Roadmaps

### EPIC-1: Foundation, Toolchain & Design System
**Key:** `SCP-EPIC-1` | **Story Points:** 13 | **Status:** Closed
- **Description:** Initialize repository, Next.js 16 App Router, TypeScript 5, Tailwind CSS, Lucide icons, and base UI layout shell.
- **Stories:**
  - `SCP-101`: Project scaffolding with App Router and Webpack compilation (3 pts)
  - `SCP-102`: Design tokens setup (#101828 Deep Navy, #0D9488 Teal, #F5F7FA Background) (3 pts)
  - `SCP-103`: Reusable atomic UI components (Button, Modal, Input, Select, StatsCard) (5 pts)
  - `SCP-104`: Layout shells for Student, Faculty, Staff, and Admin (2 pts)

---

### EPIC-2: Public Authentication & Onboarding
**Key:** `SCP-EPIC-2` | **Story Points:** 16 | **Status:** Closed
- **Description:** Implement role-based authentication flows, registration with credential capture, pending approval gate, and fast-demo profile switching.
- **Stories:**
  - `SCP-201`: Login page with validation and role redirect (5 pts)
  - `SCP-202`: Registration flow with role-specific identification (Registration Number / Faculty ID) (5 pts)
  - `SCP-203`: Password reset and account recovery workflow (3 pts)
  - `SCP-204`: Demo credentials quick-switch widget for evaluation (3 pts)

---

### EPIC-3: Database Architecture, Security & Storage
**Key:** `SCP-EPIC-3` | **Story Points:** 21 | **Status:** Closed
- **Description:** Design normalized PostgreSQL relational database schema on Supabase, configure Row-Level Security (RLS), and provision S3 storage bucket.
- **Stories:**
  - `SCP-301`: Relational table schema design (11 tables) and migrations (8 pts)
  - `SCP-302`: Row Level Security (RLS) policies isolating user roles and data boundaries (5 pts)
  - `SCP-303`: Secure image storage bucket with 5MB validation and MIME enforcement (5 pts)
  - `SCP-304`: Realtime Postgres CDC subscriptions for live in-app notifications (3 pts)

---

### EPIC-4: Student & Faculty Self-Service Portals
**Key:** `SCP-EPIC-4` | **Story Points:** 24 | **Status:** Closed
- **Description:** Build student and faculty user dashboards, multi-step ticket creation form, duplicate ticket warnings, QR plaque simulation, and audit trail timeline.
- **Stories:**
  - `SCP-401`: Student dashboard with dynamic ticket status indicators (5 pts)
  - `SCP-402`: Service request submission form with photograph upload and validation (8 pts)
  - `SCP-403`: Duplicate ticket detection based on building/room collisions (3 pts)
  - `SCP-404`: Request tracking table with search, priority filtering, and lifecycle audit modal (5 pts)
  - `SCP-405`: Ticket cancellation self-service for eligible request states (3 pts)

---

### EPIC-5: Administrator & Department Staff Operations
**Key:** `SCP-EPIC-5` | **Story Points:** 28 | **Status:** Closed
- **Description:** Build administrative command center, user directory, registration approval queue, manual priority override, technician dispatch queue, and resolution evidence logging.
- **Stories:**
  - `SCP-501`: Admin executive dashboard with live KPI metrics and queue counters (5 pts)
  - `SCP-502`: Account approval workflow for student and faculty registrations (5 pts)
  - `SCP-503`: Campus user directory with activate/deactivate toggles and staff provisioning (5 pts)
  - `SCP-504`: Department and service category CRUD with hourly SLA configuration (5 pts)
  - `SCP-505`: Staff technician assignment queue with Accept, Decline, Start, and Work Notes (5 pts)
  - `SCP-506`: Ticket resolution workflow requiring completion summary and photo proof (3 pts)

---

### EPIC-6: Smart Campus Features & Automation
**Key:** `SCP-EPIC-6` | **Story Points:** 26 | **Status:** Closed
- **Description:** Implement multi-factor smart priority engine, automated SLA countdown and overdue escalation engine, interactive campus incident density heatmap, and CSAT scorecards.
- **Stories:**
  - `SCP-601`: Multi-factor smart priority recommendation algorithm (5 pts)
  - `SCP-602`: SLA deadline calculator and dynamic countdown countdown timer (5 pts)
  - `SCP-603`: Automated cron escalation route (`/api/cron/escalate`) with audit updates (5 pts)
  - `SCP-604`: Campus QR code generator and parser for instant location auto-fill (3 pts)
  - `SCP-605`: Interactive 2D architectural incident density heatmap component (5 pts)
  - `SCP-606`: Department performance scorecard and CSAT qualitative review analytics (3 pts)

---

### EPIC-7: Comprehensive Automated Testing
**Key:** `SCP-EPIC-7` | **Story Points:** 18 | **Status:** Closed
- **Description:** Implement unit tests, integration test suites, and Playwright end-to-end browser tests across all application portals.
- **Stories:**
  - `SCP-701`: Unit test suite for utilities, image validation, and profile management (5 pts)
  - `SCP-702`: Unit test suite for smart priority calculation, SLA engine, and QR parsing (5 pts)
  - `SCP-703`: Unit test suite for admin user approval and staff technician workflows (3 pts)
  - `SCP-704`: End-to-end request lifecycle integration test (3 pts)
  - `SCP-705`: Playwright E2E test specs for all 4 user roles (2 pts)

---

### EPIC-8: Docker Containerization & CI/CD Pipelines
**Key:** `SCP-EPIC-8` | **Story Points:** 16 | **Status:** Closed
- **Description:** Containerize the Next.js application with a hardened multi-stage Dockerfile, docker-compose orchestration, and create automated Jenkins and GitHub Actions CI pipelines.
- **Stories:**
  - `SCP-801`: Multi-stage Dockerfile (deps, builder, runner) with unprivileged nextjs user (5 pts)
  - `SCP-802`: Docker Compose orchestration with automated healthchecks (3 pts)
  - `SCP-803`: 10-stage declarative Jenkinsfile with quality gates and staging deployment (5 pts)
  - `SCP-804`: GitHub Actions CI workflow for pull requests and branch merges (3 pts)

---

### EPIC-9: Production Deployment & Knowledge Base Documentation
**Key:** `SCP-EPIC-9` | **Story Points:** 12 | **Status:** Closed
- **Description:** Deploy to production environments, configure Vercel settings, and document architecture, database design, API references, user guides, and runbooks.
- **Stories:**
  - `SCP-901`: Vercel configuration (`vercel.json`) with HTTP security headers (3 pts)
  - `SCP-902`: Architecture design document and C4 system diagrams (3 pts)
  - `SCP-903`: Database schema documentation and data dictionary (2 pts)
  - `SCP-904`: Role-based user manual with step-by-step guides (2 pts)
  - `SCP-905`: Confluence knowledge base space and API documentation (2 pts)

---

## Detailed Sprint Backlog Sample

### User Story `SCP-601`: Multi-Factor Smart Priority Recommendation
- **As a:** Campus Service Administrator / Student
- **I want:** The system to automatically compute and recommend a ticket priority based on safety severity, building criticality, and historical incident spikes
- **So that:** Critical hazards and high-impact infrastructure failures are prioritized and resolved without delay.
- **Acceptance Criteria:**
  1. Safety-critical reports must always be classified as `Critical` priority and flagged as an emergency.
  2. High-sensitivity zones (chemistry labs, server rooms, medical clinic) receive a +25 point priority boost.
  3. Locations with 3 or more tickets in a 48-hour window are flagged as incident spikes.
  4. The calculated priority and explanation rationale are visibly rendered on the submission form.
  5. The calculation must execute in under 10ms with 100% test coverage.
- **Story Points:** 5
- **Subtasks:**
  - `SCP-601.1`: Create `src/lib/services/priority-engine.ts`
  - `SCP-601.2`: Define scoring matrix for severity, location, and category
  - `SCP-601.3`: Connect engine to `RequestForm.tsx`
  - `SCP-601.4`: Write unit test assertions in `tests/unit/smart-features.test.ts`

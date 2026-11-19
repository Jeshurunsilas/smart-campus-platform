# Integrated Smart Campus and Service Request Management Platform

> **Development of an Integrated Smart Campus and Service Request Management Platform with Automated Testing and Deployment**
> 
> A modern, full-stack enterprise web application connecting students, faculty, administrators, and campus service departments through a centralized service operations, intelligent triage, and real-time analytics platform.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-37%2F37%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/typescript-strict%205.0-blue.svg)]()
[![Next.js](https://img.shields.io/badge/next.js-16.4.6-black.svg)]()
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)]()
[![Supabase](https://img.shields.io/badge/supabase-postgres%20rls-3ECF8E.svg)]()

---

## 1. Project Overview & Architecture

The **Smart Campus Platform** bridges the communication gap between university stakeholders (students, faculty) and campus operational service units (Facilities Management, IT / AV Helpdesk, Electrical Services, Lab Safety Operations, Campus Sanitation, and Public Safety). It eliminates paper forms, email chaos, and unverified repairs with automated request lifecycles, intelligent duplicate detection, multi-factor priority scoring, live SLA countdowns, and real-time performance heatmaps.

### Key Architectural Pillars
- **Strict Role-Based Isolation:** 4 dedicated portal environments (Student, Faculty, Department Staff, Administrator) with server-side authorization guards.
- **Account Approval Gate:** New student and faculty self-registrations require administrator review before receiving system access.
- **End-to-End Request Lifecycle:** Comprehensive state machine (`Submitted` → `Under Review` → `Assigned` → `Accepted` → `In Progress` → `On Hold` → `Resolved` → `Closed` / `Rejected`) with full immutable audit history.
- **Smart Campus Features:** QR code physical room scanning, Smart Priority Engine, duplicate ticket warnings, and automated SLA breach escalations via `/api/cron/escalate`.
- **Automated CI/CD & Testing:** 37 Vitest unit and integration tests (100% pass rate), Playwright E2E browser automation, Jenkins 10-stage declarative pipeline, and hardened multi-stage Docker containerization.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | Next.js (App Router) | 16.4.6 | Server-Side Rendering, Static Prerendering, Edge APIs |
| **Language** | TypeScript | 5.x | Strict type safety across frontend, services, and tests |
| **Styling & Design System** | Tailwind CSS v4 | 4.3.x | Enterprise SaaS design tokens, responsive layouts |
| **Icons & UI Primitives** | Lucide React + shadcn/ui | 1.76.x | Accessible UI controls, modal dialogues, stats cards |
| **Database & Auth** | Supabase PostgreSQL | 15+ | 11 relational tables, Row-Level Security, JWT Auth |
| **Object Storage** | Supabase Storage | S3 API | Secure issue photo and resolution evidence bucket |
| **Data Visualization** | Recharts | 3.11.x | Intake vs resolution trends, department compliance |
| **Validation** | Zod + React Hook Form | 4.x / 7.x | Schema-driven client and mutation validation |
| **Testing Suite** | Vitest + Playwright | 5.x / 1.65.x | 37 automated tests across unit, integration, and E2E |
| **Containerization** | Docker + Docker Compose | Latest | Multi-stage image with non-root security runner |
| **CI/CD Automation** | Jenkins + GitHub Actions | Latest | 10-stage pipeline with automated quality gates |

---

## 3. Demo User Credentials & Quick-Switch

The login screen (`/login`) features a **One-Click Demo Switcher** for immediate stakeholder evaluation:

| Role | Email | Password | Preloaded Department / ID | Default Portal |
|---|---|---|---|---|
| **Student** | `student@campus.edu` | `password123` | CS Dept • Reg # `STU-2026-4401` | `/student/dashboard` |
| **Faculty** | `faculty@campus.edu` | `password123` | Dept of Engineering • ID `FAC-8902` | `/faculty/dashboard` |
| **Administrator**| `admin@campus.edu` | `password123` | Central Administration HQ | `/admin/dashboard` |
| **Department Staff** | `staff@campus.edu` | `password123` | Facilities & Operations • Badge `STF-99` | `/department/dashboard` |

---

## 4. Phased Implementation Summary

- [x] **PHASE 1: Project Setup & Foundation**
  - Next.js 16 App Router with strict TypeScript and Tailwind CSS v4.
  - Base UI components (`Button`, `Modal`, `StatsCard`, `Input`, `Select`, `Badge`).
  - Webpack bundler optimization for rock-solid stability.
- [x] **PHASE 2: Futuristic Enterprise UI/UX Design**
  - Design tokens (#101828 Deep Navy, #0D9488 Teal, #F5F7FA Background).
  - 40+ prerendered static and dynamic routes.
  - Fully responsive mobile, tablet, and desktop navigation shells.
- [x] **PHASE 3: Backend Architecture & Supabase Integration**
  - 11 normalized database tables with foreign keys and cascade rules.
  - Row-Level Security (RLS) policies isolating students, faculty, staff, and admins.
  - S3 file storage bucket (`service-request-images`) with 5MB validation.
- [x] **PHASE 4: Student & Faculty Modules**
  - Multi-step request submission form with photo preview and validation.
  - QR plaque scanning simulation for instant location auto-fill.
  - Collision-detection duplicate ticket warnings.
  - Public audit trail timeline and self-service cancellation.
- [x] **PHASE 5: Administrator & Department Staff Modules**
  - Administrator command center with live KPI metrics and queue counters.
  - Student & faculty registration approval and rejection queue.
  - User directory with activate/deactivate toggles and staff account provisioning.
  - Department and category management with custom SLA targets.
  - Staff technician queue with Accept, Decline, Start Work, Notes, and Resolution.
- [x] **PHASE 6: Smart Campus Features & Automation**
  - Multi-Factor Smart Priority Engine (`calculateSmartPriority`).
  - SLA target calculator (Critical 4h, High 12h, Medium 24h, Low 48h).
  - Live countdown timers and automated escalation route (`/api/cron/escalate`).
  - Interactive 2D architectural campus incident density heatmap (`CampusHeatmap`).
  - Department scorecards and CSAT qualitative review analytics.
- [x] **PHASE 7: Automated Testing**
  - 37 Vitest unit and integration test assertions (100% pass rate).
  - Playwright cross-browser end-to-end specifications.
  - Zero TypeScript compilation errors and zero ESLint warnings.
- [x] **PHASE 8: Docker Containerization & CI/CD**
  - Production-hardened multi-stage `Dockerfile` with unprivileged `nextjs` user.
  - `docker-compose.yml` service definition with container healthchecks.
  - 10-stage declarative `Jenkinsfile` with quality gates and staging deployment.
  - `.github/workflows/ci.yml` GitHub Actions pipeline.
- [x] **PHASE 9: Production Deployment & Comprehensive Documentation**
  - `vercel.json` deployment configuration with security headers.
  - Enterprise JIRA Agile plan (`docs/jira-project-plan.md`) with 9 Epics and 36 User Stories.
  - Enterprise Confluence space (`docs/confluence-documentation.md`) with ADRs and Runbooks.
  - System architecture (`docs/architecture.md`), database design (`docs/database-design.md`), API docs (`docs/api-documentation.md`), and user guide (`docs/user-guide.md`).

---

## 5. Getting Started & Local Execution

### Prerequisites
- **Node.js**: v20+ LTS
- **npm**: v10+

### Step-by-Step Setup
1. **Clone repository:**
   ```bash
   git clone <repo-url> smart-campus-platform
   cd smart-campus-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://fnpkjczdfikachurbsgb.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Production Server:**
   ```bash
   npm run build
   npm run start
   ```

---

## 6. Testing & Quality Verification

Execute the test suites with:

```bash
# Run all Vitest unit and integration tests
npm test

# Verify strict TypeScript compilation
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Run Playwright end-to-end tests
npx playwright test
```

### Verification Results
- **Vitest:** 37/37 passed (100% success)
- **ESLint:** 0 errors, 0 warnings
- **TypeScript:** 0 compilation errors
- **Routes:** 40+ prerendered static and dynamic routes

---

## 7. Containerization & Deployment

### Running with Docker Compose
```bash
docker-compose up --build -d
```
The application will be accessible at `http://localhost:3000`.

### Building Standalone Docker Container
```bash
docker build -t smart-campus-platform:latest .
docker run -p 3000:3000 smart-campus-platform:latest
```

---

## 8. License & Authors
Developed as part of the **Smart Campus Infrastructure Initiative**.
Licensed under the [MIT License](LICENSE).

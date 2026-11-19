# Integrated Smart Campus and Service Request Management Platform

> **Development of an Integrated Smart Campus and Service Request Management Platform with Automated Testing and Deployment**
> 
> A modern, full-stack enterprise web application designed to connect students, faculty, administrators, and campus service departments through a unified service operations and analytics platform.

---

## 1. Project Overview & Architecture

The **Smart Campus Platform** bridges the communication gap between university stakeholders and operational service units (Maintenance, IT/AV Support, Electrical, Laboratory Equipment, Sanitation, and Security). It replaces fragmented paper/email reporting with automated request lifecycles, intelligent duplicate detection, SLA deadlines, automated escalation, and real-time performance scorecards.

### Key Architectural Pillars
- **Strict Role-Based Isolation:** 4 dedicated portal environments (Student, Faculty, Department Staff, Administrator) with server-side authorization guards.
- **Account Approval Gate:** New student and faculty self-registrations require administrator review before receiving system access.
- **End-to-End Request Lifecycle:** Comprehensive state machine (`Submitted` → `Under Review` → `Assigned` → `Accepted` → `In Progress` → `On Hold` → `Resolved` → `Closed` / `Rejected`) with full audit history.
- **Smart Campus Features:** QR code physical room scanning, AI-suggested priority computation, duplicate ticket warnings, and automated SLA breach escalations.
- **Automated CI/CD & Testing:** Vitest unit/integration testing, Playwright E2E browser automation, Jenkins multi-stage pipeline, and Docker containerization.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, Server Components & Server Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing throughout) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens |
| **Icons & UI Primitives** | [Lucide React](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/) patterns, `class-variance-authority`, `clsx`, `tailwind-merge` |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Supabase Auth, Supabase Storage) |
| **Data Visualization** | [Recharts](https://recharts.org/) (Monthly trends, department response scorecards, problem categories) |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) type-safe schema validation |
| **QR Code Engine** | [qrcode](https://www.npmjs.com/package/qrcode) for dynamic classroom/lab token generation and resolution |
| **Testing Suite** | [Vitest](https://vitest.dev/) (Unit/Integration) + [Playwright](https://playwright.dev/) (E2E) |
| **Containerization & CI/CD** | [Docker](https://www.docker.com/), [Jenkins](https://www.jenkins.io/), [GitHub Actions](https://github.com/features/actions) |
| **Deployment Target** | [Vercel](https://vercel.com/) / Containerized Node.js |

---

## 3. User Roles & Permission Matrix

| Feature / Action | Student | Faculty | Department Staff | Administrator |
|---|:---:|:---:|:---:|:---:|
| Self-Registration & Verification | Yes (Pending Approval) | Yes (Pending Approval) | Admin-Invited | System Root |
| Submit General Maintenance Request | Yes | Yes | No | Yes |
| Submit Classroom / Lab Equipment Request | No | Yes | No | Yes |
| Scan QR Code for Auto-Location | Yes | Yes | Yes | Yes |
| Track Personal Request History | Yes | Yes | No | Yes |
| Rate & Provide Feedback on Services | Yes | Yes | No | View Analytics |
| Accept Field Ticket Assignments | No | No | Yes | Yes |
| Add Progress Notes & Upload Completion Proof | No | No | Yes | Yes |
| Approve / Reject User Accounts | No | No | No | Yes |
| Create Departments & Categories | No | No | No | Yes |
| Assign Requests & Override Priorities | No | No | No | Yes |
| Monitor SLA Breaches & Overdue Alerts | No | No | View Assigned | Yes (Campus-wide) |
| View Performance Analytics & Scorecards | No | No | View Personal | Full Campus Access |

---

## 4. Software Engineering Directory Structure

```plaintext
smart-campus-platform/
├── database/
│   └── migrations/              # SQL migration scripts with RLS policies & triggers
├── public/                      # Static assets & icons
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication route group (login, registers, password reset)
│   │   ├── (dashboard)/         # Protected role-based dashboards
│   │   │   ├── admin/           # Administrator HQ & controls
│   │   │   ├── faculty/         # Faculty reporting & tracking
│   │   │   ├── staff/           # Department field staff dispatch
│   │   │   └── student/         # Student service center
│   │   ├── api/                 # Next.js API Route Handlers
│   │   ├── globals.css          # Design system variables & utilities
│   │   ├── layout.tsx           # Root application layout
│   │   ├── page.tsx             # Public landing page & role navigation
│   │   └── middleware.ts        # Server-side auth & route protection guards
│   ├── components/
│   │   ├── dashboard/           # Metrics, scorecards & analytical charts
│   │   ├── layout/              # Navbars, sidebars, breadcrumbs & role shells
│   │   ├── notifications/       # In-app real-time notification drawer
│   │   ├── requests/            # Forms, timeline, filters, status badges
│   │   └── ui/                  # Reusable UI primitives (buttons, cards, badges)
│   ├── lib/
│   │   ├── auth/                # Auth helpers, role verification & session guards
│   │   ├── services/            # Database abstraction & business logic
│   │   ├── supabase/            # Browser and SSR Supabase client factories
│   │   ├── validations/         # Zod schemas for forms and mutations
│   │   └── utils.ts             # Formatting & class merging utilities
│   └── types/
│       └── index.ts             # Central TypeScript domain interfaces
├── tests/
│   ├── e2e/                     # Playwright end-to-end tests
│   ├── integration/             # Integration tests
│   ├── unit/                    # Vitest unit test suites
│   └── setup.ts                 # Testing environment configuration
├── .env.example                 # Template for required environment variables
├── .env.local                   # Local development settings (git-ignored)
├── Dockerfile                   # Multi-stage production container build
├── Jenkinsfile                  # 7-stage automated delivery pipeline
├── playwright.config.ts         # Playwright E2E configuration
├── vitest.config.ts             # Vitest test runner configuration
├── tsconfig.json                # TypeScript strict configuration
└── package.json                 # Project dependencies & operational scripts
```

---

## 5. Getting Started

### Prerequisites
- **Node.js**: v20+ (tested on Node.js v24 LTS)
- **npm**: v10+

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url> smart-campus-platform
   cd smart-campus-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment configuration:
   ```bash
   copy .env.example .env.local
   ```
   Configure your Supabase URL, Anon Key, and Service Role Key in `.env.local`.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 6. Available Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Starts the Next.js development server with hot-reload |
| `npm run build` | Compiles production-optimized client & server bundles |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint validation across all code |
| `npm run test` | Runs all Vitest unit and integration test suites |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run test:e2e` | Executes Playwright cross-browser end-to-end tests |

---

## 7. Phased Implementation Roadmap

- [x] **PHASE 1: Project Foundation & Architecture** (Current)
  - Next.js App Router initialization with TypeScript & Tailwind CSS
  - Complete dependency installation (Supabase, Zod, Recharts, Lucide, Vitest, Playwright)
  - Strict type definitions (`src/types/index.ts`)
  - Form validation schemas (`src/lib/validations/`)
  - Testing harness & sample unit tests
  - Environment templates & Git tracking
- [ ] **PHASE 2: Design System & Authentication Module**
- [ ] **PHASE 3: Database Migrations & Supabase Integration**
- [ ] **PHASE 4: Student & Faculty Portals**
- [ ] **PHASE 5: Administrator & Department Staff Portals**
- [ ] **PHASE 6: Smart Campus Features, Analytics & Realtime Notifications**
- [ ] **PHASE 7: Automated Test Suite Implementation**
- [ ] **PHASE 8: Docker & Jenkins CI/CD Automation**
- [ ] **PHASE 9: Production Deployment & Verification**

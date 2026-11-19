# Automated Testing Strategy & Execution Manual

## 1. Testing Philosophy
The Smart Campus Platform employs a **Test Pyramid** strategy with multi-layered verification:
1. **Unit Tests (Vitest):** Fast, isolated tests for pure functions, math calculations, priority scoring, SLA computation, and image validators.
2. **Integration Tests (Vitest):** End-to-end service state transitions simulating the full ticket lifecycle from submission to resolution.
3. **End-to-End Tests (Playwright):** Real browser tests exercising user flows across all 4 role portals.

---

## 2. Test Suite Breakdown

| Suite | File Path | Focus | Assertion Count |
|---|---|---|---|
| **Utils & Formatting** | `tests/unit/utils.test.ts` | Date formatting, initials, class merging | 3 |
| **Student & Faculty Logic** | `tests/unit/student-faculty.test.ts` | Image MIME checks, cancellation, role filters | 12 |
| **Smart Campus Features** | `tests/unit/smart-features.test.ts` | Smart priority scoring, SLA deadlines, QR parser | 9 |
| **Admin & Staff Operations** | `tests/unit/admin-staff.test.ts` | User approvals, staff provisioning, technician queue | 12 |
| **Request Lifecycle** | `tests/integration/request-lifecycle.test.ts` | End-to-end 8-step lifecycle simulation | 1 |
| **Total Automated Assertions** | | | **37 Passed (100%)** |

---

## 3. Running Tests Locally

### Unit & Integration Testing (Vitest)
```bash
# Run all test suites once
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npx vitest run tests/unit/smart-features.test.ts
```

### End-to-End Testing (Playwright)
```bash
# Run Playwright tests headlessly
npm run test:e2e

# Run Playwright with interactive UI
npx playwright test --ui
```

---

## 4. Mocking & Simulation Architecture
- When running in an environment without live Supabase database connectivity, services automatically fall back to deterministic mock data (`src/lib/demo-data.ts`).
- Storage tests use synthetic `File` blobs to verify 5MB thresholds and MIME rejections.

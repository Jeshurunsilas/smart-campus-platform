# Smart Campus Platform - API Reference Documentation

---

## 1. REST Endpoints

### 1.1 Automated SLA Escalation Engine
Evaluates all open campus work orders against their target resolution deadlines and escalates overdue tickets.

- **Endpoint:** `/api/cron/escalate`
- **Methods:** `GET`, `POST`
- **Authentication:** Unrestricted (Cron worker or automated health monitor)
- **Response Format:** JSON

#### Success Response (200 OK):
```json
{
  "success": true,
  "timestamp": "2026-11-19T16:45:00.000Z",
  "checkedCount": 14,
  "escalatedCount": 2,
  "escalatedTicketIds": ["req-003", "req-008"],
  "message": "Evaluated 14 active tickets; escalated 2 overdue service orders."
}
```

#### Error Response (500 Internal Server Error):
```json
{
  "success": false,
  "error": "Database connection timeout during escalation evaluation."
}
```

---

## 2. Core Service Methods Reference

### 2.1 Request Service (`src/lib/services/requests.ts`)

#### `createServiceRequest(input: CreateRequestInput): Promise<{ success: boolean; data?: ServiceRequest }>`
Submits a new campus maintenance or service ticket.
- **Parameters:**
  - `title` (string): Brief summary of issue.
  - `description` (string): Detailed problem description.
  - `departmentId` (string): Target department UUID.
  - `categoryId` (string): Category UUID.
  - `locationId` (string): Location UUID.
  - `severity` (`"Low" | "Medium" | "High" | "Critical"`).
  - `imageUrl` (optional string): Public URL of uploaded photograph.

#### `updateServiceRequestStatus(requestId: string, newStatus: RequestStatus, comment: string): Promise<boolean>`
Updates ticket state and automatically appends an audit record to `request_updates`.

#### `resolveServiceRequest(requestId: string, resolutionDetails: string, completionPhotoUrl?: string): Promise<boolean>`
Marks a work order as `Resolved`, records completion timestamp, and notifies the original requester.

---

### 2.2 Smart Priority Engine (`src/lib/services/priority-engine.ts`)

#### `calculateSmartPriority(input: PriorityEvaluationInput): PriorityRecommendation`
Calculates dynamic priority based on severity, location sensitivity, category default, and localized ticket spikes.
- **Input Parameters:**
  - `severity` (`RequestSeverity`)
  - `categoryDefaultPriority` (optional `RequestPriority`)
  - `building` (optional string)
  - `roomNumber` (optional string)
  - `recentIncidentsInLocationCount` (optional number)
- **Returns:**
  - `recommendedPriority`: `"Critical" | "High" | "Medium" | "Low"`
  - `score`: number (0 to 100)
  - `factors`: string[] (detailed explanations)
  - `isEmergency`: boolean
  - `confidence`: number

---

### 2.3 SLA Engine (`src/lib/services/sla.ts`)

#### `calculateSLADeadline(createdAt: string, priority: RequestPriority, customHours?: number): string`
Returns an ISO timestamp deadline calculated from priority standards:
- `Critical`: +4 hours
- `High`: +12 hours
- `Medium`: +24 hours
- `Low`: +48 hours

#### `getSLARemainingTime(deadlineIso?: string, createdAtIso?: string): SLARemainingInfo`
Returns remaining duration, overdue boolean, elapsed percentage (0-100%), and countdown badge text.

---

### 2.4 QR Code Service (`src/lib/services/qr.ts`)

#### `generateLocationQRCode(building: string, floor?: string, room?: string, departmentId?: string): string`
Encodes campus facility parameters into a URI-safe QR token:
`CAMPUS:LOC:<building>:<floor>:<room>:<departmentId>`

#### `parseLocationQRCode(rawPayload: string): ParsedCampusQR`
Decodes QR token into `{ valid: boolean, building: string, floor: string, roomNumber: string, departmentId?: string }`.

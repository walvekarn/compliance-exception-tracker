# Specification: Compliance Exception Tracker

## 1. Overview

### 1.1 Purpose
A centralized system for compliance analysts and their managers to track all active compliance violations and exceptions across all vendors—replacing email-based tracking with a single source of truth, clear ownership, and full auditability.

### 1.2 Users
| Role | Description |
|------|-------------|
| **Compliance Analyst** | Creates and manages exceptions; assigned to resolve violations; updates status and details. |
| **Manager** | Oversees all exceptions; assigns ownership; monitors open days and severity; approves or escalates. |

### 1.3 Problem Statement
- **Exceptions managed over emails** — No single record, hard to search, easy to lose context.
- **No central view** — Cannot see all active violations or vendor-wise breakdown at a glance.
- **No ownership tracking** — Unclear who is responsible for each exception; no accountability or SLA visibility.

---

## 2. Functional Requirements

### 2.1 Core Entity: Exception

Each **exception** represents one compliance violation or deviation for a vendor.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **Vendor** | Reference / Lookup | Yes | Vendor (or vendor ID) this exception belongs to. Supports vendor-wise filtering and grouping. |
| **Exception** | Text (short) | Yes | Short title or identifier for the exception (e.g. "Missing SOC2 report Q3"). |
| **Exception Type** | Enum / Lookup | Yes | Category of exception (e.g. "Documentation", "Control Gap", "Audit Finding", "Policy Deviation"). Configurable list. |
| **Severity** | Enum | Yes | e.g. Critical, High, Medium, Low. Drives prioritization and reporting. |
| **Assigned To** | User reference | Yes | Compliance analyst (or team) responsible for resolution. |
| **Manager** | User reference | Yes | Manager overseeing this exception (for visibility and escalation). |
| **Status** | Enum | Yes | e.g. Open, In Progress, Pending Review, Resolved, Closed, Escalated. |
| **Date Created** | Date (and optionally time) | Yes | When the exception was first recorded. |
| **Open Days** | Computed | — | Number of days from **Date Created** (or from last "reopened") until **Resolved/Closed**, or until today if still open. Display-only, calculated. |
| **Description** | Long text | Optional | Full description, context, and any notes. |

**Additional suggested fields (optional in v1):**
- **Due Date** — Target resolution date.
- **Date Resolved / Date Closed** — For SLA and reporting.
- **Resolution Notes** — How it was resolved (for audit).

### 2.2 Vendor-Wise View
- **List/table of exceptions** filterable and groupable by **Vendor**.
- **Vendor summary**: e.g. count of open exceptions per vendor, count by severity.
- Ability to drill from vendor summary into that vendor’s exceptions.

### 2.3 Ownership and Assignment
- **Assigned To** and **Manager** are explicit fields; both visible in list and detail views.
- Only assigned user (or manager) can change status/assignment (or permissions configurable by role).
- Reassignment history captured in **Action log** (see below).

### 2.4 Status Workflow
- Define allowed status transitions (e.g. Open → In Progress → Pending Review → Resolved → Closed).
- **Open days** calculated from creation (or reopen) until status is Resolved/Closed (or today).

---

## 3. Audit Log

### 3.1 Purpose
Immutable record of *what* changed on an exception (and optionally on vendors or reference data) for compliance and accountability.

### 3.2 Requirements
| Requirement | Description |
|-------------|-------------|
| **What to log** | All changes to exception fields (before/after values), and optionally create/delete of exceptions. |
| **Who & when** | User ID (or email) and timestamp (UTC) for each change. |
| **Where** | Per-exception audit trail (e.g. "Exception X – History" tab) and optionally a global audit log (admin). |
| **Immutability** | Append-only; no user-editable or deletable audit records. |
| **Retention** | Retention policy defined (e.g. retain for 7 years for compliance). |

### 3.3 Example Audit Log Entry
```text
[2025-03-05 14:32:00 UTC] user@company.com
  Exception #12345
  - Status: "Open" → "In Progress"
  - Assigned To: "jane@company.com" → "john@company.com"
```

---

## 4. Action Log

### 4.1 Purpose
Explicit log of *actions* taken on an exception (comments, status changes, assignments, attachments, approvals)—user-facing “activity feed” and evidence of due diligence.

### 4.2 Requirements
| Requirement | Description |
|-------------|-------------|
| **What to log** | User-driven actions: status change, assignment change, comment added, attachment added, escalation, approval, etc. |
| **Who & when** | User and timestamp for each action. |
| **Content** | Action type + optional message (e.g. "Status set to In Progress – Awaiting vendor response."). |
| **Visibility** | Visible on exception detail view (e.g. "Activity" or "Action log" section). |
| **Immutability** | Append-only; edits only to correct typo with "corrected" marker, no deletion of actions. |

### 4.3 Example Action Log Entry
```text
[2025-03-05 14:32] John Doe
  Reassigned to Jane Smith. Reason: "Vendor contact changed; Jane owns this relationship."
```

---

## 5. Validations

### 5.1 Data Validations (Create/Update Exception)
| Rule | Implementation |
|------|----------------|
| **Required fields** | Vendor, Exception (title), Exception Type, Severity, Assigned To, Manager, Status, Date Created must be non-empty. |
| **Vendor** | Must exist in vendor list/master data. |
| **Exception Type** | Must be from configured exception type list. |
| **Severity** | Must be from configured severity list (e.g. Critical, High, Medium, Low). |
| **Assigned To / Manager** | Must be valid users in the system (and optionally must have compliance analyst / manager role). |
| **Status** | Must be from configured status list. |
| **Date Created** | Must be a valid date; not in the future. |
| **Open Days** | Read-only, calculated; no user input. |

### 5.2 Business Rule Validations
| Rule | Description |
|------|-------------|
| **Status transition** | Only allow valid next statuses (e.g. cannot move from Resolved back to Open without "Reopen" action). |
| **Reassignment** | Optional: require a short reason when changing Assigned To (stored in action log). |
| **Severity change** | Optional: log in audit log when severity is changed (for critical/high). |

### 5.3 Concurrency (Optional but Recommended)
- Optimistic locking (e.g. version field) so two users cannot overwrite each other’s changes; show clear error and refresh.

---

## 6. Non-Functional Requirements

### 6.1 Access Control
- Only authenticated compliance analysts and managers can access the tracker.
- Role-based visibility: analysts see their assigned exceptions (and team’s); managers see all exceptions (e.g. by team or org).
- Optional: vendor-based restrictions (e.g. analyst sees only vendors they own).

### 6.2 Performance
- Vendor-wise list and summary should load quickly (pagination, indexing on Vendor, Status, Assigned To, Date Created).
- Audit and action logs loaded on demand (e.g. when opening exception detail) or paginated.

### 6.3 Export & Reporting
- Export exceptions (e.g. CSV/Excel) with filters (vendor, status, severity, date range).
- Simple reports: open count by vendor, by severity, by assigned analyst, average open days.

---

## 7. Summary: Must-Have vs Nice-to-Have

| Must-Have | Nice-to-Have |
|-----------|----------------|
| Exception CRUD with all core fields | Due Date, Date Resolved, Resolution Notes |
| Vendor-wise list and filtering | Vendor summary dashboard |
| Assigned To + Manager | Reassignment reason required |
| Open days (calculated) | SLA alerts (e.g. critical > 30 days) |
| Audit log (field-level changes) | Global admin audit log |
| Action log (user actions + comments) | Attachments on exceptions |
| Validations (required, lookup, status transition) | Optimistic locking |
| Role-based access (analyst vs manager) | Export & reports |

---

## 8. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-03-05 | — | Initial spec: core exception model, vendor view, audit log, action log, validations. |

---

*This specification can be used for implementation (e.g. database schema, API contracts, and UI flows) and for stakeholder sign-off.*

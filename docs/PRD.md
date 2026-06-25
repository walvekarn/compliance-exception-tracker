# Product Requirements Document: Compliance Exception Tracker

## 1. Objectives
- Replace email-based exception tracking with a single source of truth.
- Provide a central view of all active compliance violations across vendors.
- Enforce clear ownership (Assigned To, Manager) and full auditability (audit log, action log).

## 2. User Personas
| Persona | Description | Goals |
|----------|-------------|--------|
| Compliance Analyst | Day-to-day exception handling | Create/update exceptions; see assigned items; update status; add context. |
| Manager | Oversees team and vendor risk | View all exceptions; assign/reassign; monitor open days and severity; approve or escalate. |

## 3. Functional Requirements (from SPEC)
- **Exception entity**: Vendor, Exception (title), Exception Type, Severity, Assigned To, Manager, Status, Date Created, Open Days (computed), Description. Optional: Due Date, Date Resolved, Resolution Notes.
- **Vendor-wise view**: List filterable and groupable by vendor; vendor summary (open/total counts); drill from summary to filtered list.
- **Ownership**: Assigned To and Manager visible in list and detail; reassignment captured in action log (optional reason).
- **Status workflow**: Defined transitions (e.g. Open → In Progress → Pending Review → Resolved → Closed); Reopen (Resolved/Closed → Open).
- **Audit log**: Append-only; field-level before/after; who and when (UTC); per-exception trail.
- **Action log**: Append-only; action type + message; visible on exception detail.
- **Validations**: Required fields; vendor/user reference checks; enum checks; date not future; status transition rules.

## 4. Non-Functional Requirements
- **Access control**: Role-based visibility (analyst: assigned only; manager: all). Mock user for v1.
- **Performance**: Pagination/indexing on list; audit/action loaded on demand.
- **Export**: CSV export with current filters.

## 5. Success Metrics
- All active exceptions visible in one place.
- Every change to an exception recorded in audit log; key actions in action log.
- No invalid status transitions or invalid references (validations enforced).

## 6. Release Criteria
- Exception CRUD working with all core fields and validations.
- List with vendor/status/severity/assigned-to filters; sort by open days.
- Detail page with audit and action log.
- Create and edit forms with validation feedback; status transition enforcement.
- Export CSV; error and loading states in place.

## 7. Appendix
- **Glossary**: Exception = one compliance violation for a vendor; Open days = days from creation (or reopen) until resolved/closed or today.
- **Reference**: [SPEC_COMPLIANCE_EXCEPTION_TRACKER.md](../SPEC_COMPLIANCE_EXCEPTION_TRACKER.md).

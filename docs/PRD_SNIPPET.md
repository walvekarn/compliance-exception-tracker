# Compliance Exception Tracker — PRD Snippet

## Problem
- Exceptions are managed over email: no single record, hard to search, easy to lose context.
- No central view of all active violations or vendor-wise breakdown.
- No ownership tracking: unclear who is responsible; no accountability or SLA visibility.

## Users
- **Compliance Analyst**: Creates and manages exceptions; assigned to resolve violations.
- **Manager**: Oversees all exceptions; assigns ownership; monitors open days and severity.

## Solution
A centralized web application (Next.js, TypeScript, Tailwind) for tracking compliance exceptions across vendors with:
- **Exception CRUD** with core fields: vendor, title, type, severity, assigned to, manager, status, date created, open days (computed), description.
- **Vendor-wise view**: list filterable/groupable by vendor; optional summary (open count per vendor).
- **Audit log**: immutable, append-only record of field-level changes (who, when, what).
- **Action log**: user-facing activity feed (status changes, reassignments, comments).
- **Validations**: required fields, reference checks (vendor, users), enum checks, date not future, status transition rules.

## Out of scope (v1)
- Full authentication (SSO, session); using mock user/headers for dev.
- Due date, date resolved, resolution notes (optional fields only).
- SLA alerts, attachments, global admin audit view, optimistic locking.

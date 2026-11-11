Status: Deployed demo, mock data

# Compliance Exception Tracker

A prototype for compliance analysts and managers to track compliance exceptions across vendors in one place, with an owner, a status workflow and an audit trail for each record. It is built to replace email-based tracking and runs on in-memory mock data.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Jest. No external services required (runs on local mock data). Deploys to Vercel with no extra configuration.

## Project Management View

- **Business problem:** Exceptions tracked over email have no single record, no clear owner and no view of how long each one has been open.
- **User:** Compliance analysts who log and work exceptions; managers who assign and oversee them.
- **Scope:** In: exception create and edit, status workflow, vendor-wise view, audit log, action log, CSV export. Out (v1, per `docs/PRD_SNIPPET.md`): authentication, SLA alerts, attachments, optimistic locking.
- **Key requirements and decisions:** Status changes follow an allowed-transition table (Open cannot go straight to Closed). Audit and action logs are append-only. Validation rejects missing fields, unknown vendor or user IDs and future dates.
- **Acceptance criteria:** Given/When/Then scenarios in `docs/BDD_ACCEPTANCE_CRITERIA.md`; release criteria in `docs/PRD.md`.
- **What is tested:** 37 Jest tests on validation, status transitions, open-days calculation, the data layer and API-level flows. Not tested: UI pages, CSV export, browser flows.
- **Known limitations:** Data lives in memory and resets on restart. No login. Role-based visibility in the PRD is not enforced. No pagination.
- **What production would need:** A database, real authentication and roles, SLA alerts, end-to-end tests, and an audit-log retention policy.

## Problem

Compliance exceptions get managed over email: no single record, hard to search, easy to lose context, no ownership or SLA visibility. This prototype puts them in one system with an audit trail.

## Features

- **Exception register:** create, edit, assign and resolve exceptions with severity, status and open-day tracking
- **Vendor-wise view:** exceptions grouped by vendor, with open and total counts
- **Ownership and open days:** an owner and a manager on each exception, plus an open-days counter (no SLA alerts yet)
- **Audit trail:** field-level audit log and a separate action log for status changes and reassignments
- **Roles:** analyst and manager users in the seed data; no login or role enforcement in this prototype

## Product artifacts

The repo includes product documentation alongside the code:

- `docs/PRD.md`: PRD (objectives, personas, functional and non-functional requirements, success metrics, release criteria)
- `docs/BDD_ACCEPTANCE_CRITERIA.md`: Given/When/Then acceptance scenarios
- `docs/schemas/`: JSON schemas for exception, audit-log, action-log
- `SPEC_COMPLIANCE_EXCEPTION_TRACKER.md`: system specification

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Jest test suite
npm run build    # production build
```

## Deploy

Import the repo at [vercel.com](https://vercel.com) → Deploy. Next.js is auto-detected; no environment variables required.

---
Built by [Nikita Walvekar](https://www.linkedin.com/in/nikitaw3) · part of a vendor & compliance operations prototype suite.

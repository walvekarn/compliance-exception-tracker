# Compliance Exception Tracker

A centralized system for compliance analysts and managers to track every active compliance violation and exception across all vendors — replacing email-based tracking with a single source of truth, clear ownership, and full auditability.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Jest. No external services required (runs on local mock data) — deploys to Vercel with zero configuration.

## Problem

Compliance exceptions get managed over email: no single record, hard to search, easy to lose context, no ownership or SLA visibility. This app replaces that with one auditable system.

## Features

- **Exception register** — create, edit, assign, and resolve exceptions with severity, status, and open-day tracking
- **Vendor-wise view** — see all active violations broken down by vendor at a glance
- **Ownership & SLA** — clear owner per exception, open-days counter, manager oversight
- **Full audit trail** — every status change and action logged (audit-log + action-log)
- **Roles** — Compliance Analyst (manage) and Manager (assign, approve, escalate)

## Product artifacts

This repo ships with real product documentation, not just code:

- `docs/PRD.md` — full PRD (objectives, personas, functional + non-functional requirements, success metrics, release criteria)
- `docs/BDD_ACCEPTANCE_CRITERIA.md` — Given/When/Then acceptance scenarios
- `docs/schemas/` — JSON schemas for exception, audit-log, action-log
- `SPEC_COMPLIANCE_EXCEPTION_TRACKER.md` — system specification

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

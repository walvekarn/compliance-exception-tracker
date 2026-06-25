/**
 * Exception entity and related types per SPEC Section 2.1
 */

export const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const EXCEPTION_TYPES = [
  "Documentation",
  "Control Gap",
  "Audit Finding",
  "Policy Deviation",
] as const;
export type ExceptionType = (typeof EXCEPTION_TYPES)[number];

export const STATUSES = [
  "Open",
  "In Progress",
  "Pending Review",
  "Resolved",
  "Closed",
  "Escalated",
] as const;
export type Status = (typeof STATUSES)[number];

export interface Exception {
  id: string;
  vendorId: string;
  title: string;
  exceptionType: ExceptionType;
  severity: Severity;
  assignedToId: string;
  managerId: string;
  status: Status;
  dateCreated: string; // ISO date
  description?: string;
  dueDate?: string; // ISO date, optional v1
  dateResolved?: string; // ISO date, optional v1
  resolutionNotes?: string; // optional v1
}

export interface ExceptionCreate {
  vendorId: string;
  title: string;
  exceptionType: ExceptionType;
  severity: Severity;
  assignedToId: string;
  managerId: string;
  status: Status;
  dateCreated: string;
  description?: string;
  dueDate?: string;
}

export interface ExceptionUpdate {
  vendorId?: string;
  title?: string;
  exceptionType?: ExceptionType;
  severity?: Severity;
  assignedToId?: string;
  managerId?: string;
  status?: Status;
  dateCreated?: string;
  description?: string;
  dueDate?: string;
  dateResolved?: string;
  resolutionNotes?: string;
}

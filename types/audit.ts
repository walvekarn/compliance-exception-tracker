/**
 * Audit log entry: immutable record of what changed on an exception.
 */

export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface AuditEntry {
  id: string;
  exceptionId: string;
  userId: string;
  timestampUtc: string; // ISO
  changes: AuditChange[];
}

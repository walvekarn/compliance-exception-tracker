import type { AuditEntry, AuditChange } from "@/types/audit";
import type { Exception } from "@/types/exception";

const auditLog: AuditEntry[] = [];
let nextId = 1;

function generateId(): string {
  return `audit-${Date.now()}-${nextId++}`;
}

function getChangeKeys(prev: Partial<Exception>, next: Partial<Exception>): (keyof Exception)[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)] as (keyof Exception)[]);
  return Array.from(keys).filter((k) => k !== "id" && prev[k] !== next[k]);
}

export function appendAuditEntry(
  exceptionId: string,
  userId: string,
  previous: Partial<Exception> | null,
  current: Exception
): AuditEntry {
  const changes: AuditChange[] = [];
  if (!previous) {
    // Create: all current values as "new"
    const keys: (keyof Exception)[] = [
      "vendorId", "title", "exceptionType", "severity", "assignedToId", "managerId",
      "status", "dateCreated", "description", "dueDate", "dateResolved", "resolutionNotes",
    ];
    for (const k of keys) {
      const v = current[k];
      if (v !== undefined && v !== null && v !== "") {
        changes.push({ field: k, oldValue: null, newValue: v });
      }
    }
  } else {
    const keys = getChangeKeys(previous, current);
    for (const k of keys) {
      changes.push({
        field: k,
        oldValue: previous[k] ?? null,
        newValue: current[k] ?? null,
      });
    }
  }

  const entry: AuditEntry = {
    id: generateId(),
    exceptionId,
    userId,
    timestampUtc: new Date().toISOString(),
    changes,
  };
  auditLog.push(entry);
  return entry;
}

export function getAuditEntriesByExceptionId(
  exceptionId: string,
  options?: { limit?: number; offset?: number }
): AuditEntry[] {
  const filtered = auditLog.filter((e) => e.exceptionId === exceptionId);
  const sorted = [...filtered].reverse(); // newest first
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? 50;
  return sorted.slice(offset, offset + limit);
}

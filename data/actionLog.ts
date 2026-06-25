import type { ActionEntry, ActionType } from "@/types/action";

const actionLog: ActionEntry[] = [];
let nextId = 1;

function generateId(): string {
  return `action-${Date.now()}-${nextId++}`;
}

export function appendActionEntry(
  exceptionId: string,
  userId: string,
  userName: string,
  actionType: ActionType,
  message?: string
): ActionEntry {
  const entry: ActionEntry = {
    id: generateId(),
    exceptionId,
    userId,
    userName,
    timestampUtc: new Date().toISOString(),
    actionType,
    message,
  };
  actionLog.push(entry);
  return entry;
}

export function getActionEntriesByExceptionId(
  exceptionId: string,
  options?: { limit?: number; offset?: number }
): ActionEntry[] {
  const filtered = actionLog.filter((e) => e.exceptionId === exceptionId);
  const sorted = [...filtered].reverse(); // newest first
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? 50;
  return sorted.slice(offset, offset + limit);
}

/**
 * Action log entry: user-driven actions (status change, reassignment, comment, etc.)
 */

export const ACTION_TYPES = [
  "created",
  "status_change",
  "reassigned",
  "comment",
  "updated",
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export interface ActionEntry {
  id: string;
  exceptionId: string;
  userId: string;
  userName: string;
  timestampUtc: string; // ISO
  actionType: ActionType;
  message?: string;
}

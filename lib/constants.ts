/**
 * Application constants: severity, exception types, statuses, and allowed status transitions.
 * Per SPEC Section 2.4.
 */

import type { Status } from "@/types/exception";

export {
  SEVERITIES,
  EXCEPTION_TYPES,
  STATUSES,
} from "@/types/exception";
export type { Status } from "@/types/exception";

/**
 * Allowed status transitions: from status -> list of valid next statuses.
 * Reopen: Resolved/Closed -> Open is allowed for reopening.
 */
export const STATUS_TRANSITIONS: Record<Status, Status[]> = {
  Open: ["In Progress", "Escalated"],
  "In Progress": ["Pending Review", "Escalated", "Open"],
  "Pending Review": ["Resolved", "In Progress", "Escalated"],
  Resolved: ["Closed", "Open"], // Open = Reopen
  Closed: ["Open"], // Reopen only
  Escalated: ["In Progress", "Pending Review", "Open"],
};

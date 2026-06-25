import type { Status } from "@/types/exception";
import { STATUS_TRANSITIONS } from "@/lib/constants";

/**
 * Returns the list of statuses that are valid next states from the current status.
 */
export function getNextAllowedStatuses(current: Status): Status[] {
  return [...(STATUS_TRANSITIONS[current] ?? [])];
}

/**
 * Returns true if transitioning from `from` to `to` is allowed.
 */
export function canTransition(from: Status, to: Status): boolean {
  const allowed = STATUS_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

import type { Exception } from "@/types/exception";

/**
 * Compute open days: from dateCreated (or reopen) until resolved/closed, or until today if still open.
 * Per SPEC: Open days = days from date created until status is Resolved/Closed, else until today.
 */
export function computeOpenDays(exception: Exception): number {
  const created = new Date(exception.dateCreated);
  const endDate =
    (exception.status === "Resolved" || exception.status === "Closed") && exception.dateResolved
      ? new Date(exception.dateResolved)
      : new Date();

  const diff = endDate.getTime() - created.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

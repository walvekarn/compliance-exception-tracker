import { STATUS_TRANSITIONS, STATUSES } from "@/lib/constants";
import type { Status } from "@/types/exception";

describe("STATUS_TRANSITIONS", () => {
  it("defines transitions for every status", () => {
    for (const status of STATUSES) {
      expect(STATUS_TRANSITIONS[status]).toBeDefined();
      expect(Array.isArray(STATUS_TRANSITIONS[status])).toBe(true);
    }
  });

  it("Open can transition to In Progress and Escalated", () => {
    expect(STATUS_TRANSITIONS.Open).toContain("In Progress");
    expect(STATUS_TRANSITIONS.Open).toContain("Escalated");
  });

  it("Resolved can transition to Closed or Open (Reopen)", () => {
    expect(STATUS_TRANSITIONS.Resolved).toContain("Closed");
    expect(STATUS_TRANSITIONS.Resolved).toContain("Open");
  });

  it("Closed can only Reopen to Open", () => {
    expect(STATUS_TRANSITIONS.Closed).toEqual(["Open"]);
  });

  it("all next statuses are valid statuses", () => {
    const validSet = new Set<Status>(STATUSES);
    for (const status of STATUSES) {
      for (const next of STATUS_TRANSITIONS[status]) {
        expect(validSet.has(next)).toBe(true);
      }
    }
  });
});

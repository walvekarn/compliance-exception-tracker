import { getNextAllowedStatuses, canTransition } from "@/lib/validations/status";

describe("getNextAllowedStatuses", () => {
  it("Open can transition to In Progress and Escalated", () => {
    const next = getNextAllowedStatuses("Open");
    expect(next).toContain("In Progress");
    expect(next).toContain("Escalated");
  });

  it("Resolved can transition to Closed or Open (Reopen)", () => {
    const next = getNextAllowedStatuses("Resolved");
    expect(next).toContain("Closed");
    expect(next).toContain("Open");
  });

  it("Closed returns only Open", () => {
    expect(getNextAllowedStatuses("Closed")).toEqual(["Open"]);
  });
});

describe("canTransition", () => {
  it("allows Open -> In Progress", () => {
    expect(canTransition("Open", "In Progress")).toBe(true);
  });

  it("allows Resolved -> Open (Reopen)", () => {
    expect(canTransition("Resolved", "Open")).toBe(true);
  });

  it("disallows Resolved -> In Progress directly", () => {
    expect(canTransition("Resolved", "In Progress")).toBe(false);
  });

  it("disallows Open -> Closed", () => {
    expect(canTransition("Open", "Closed")).toBe(false);
  });
});

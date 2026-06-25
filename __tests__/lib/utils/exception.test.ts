import { computeOpenDays } from "@/lib/utils/exception";
import type { Exception } from "@/types/exception";

describe("computeOpenDays", () => {
  it("returns open days from dateCreated to today for open exception", () => {
    const created = new Date();
    created.setDate(created.getDate() - 10);
    const ex: Exception = {
      id: "1",
      vendorId: "v1",
      title: "Test",
      exceptionType: "Documentation",
      severity: "Low",
      assignedToId: "u1",
      managerId: "u5",
      status: "Open",
      dateCreated: created.toISOString().slice(0, 10),
    };
    const days = computeOpenDays(ex);
    expect(days).toBe(10);
  });

  it("returns days from dateCreated to dateResolved for resolved exception", () => {
    const ex: Exception = {
      id: "1",
      vendorId: "v1",
      title: "Test",
      exceptionType: "Documentation",
      severity: "Low",
      assignedToId: "u1",
      managerId: "u5",
      status: "Resolved",
      dateCreated: "2024-01-01",
      dateResolved: "2024-01-15",
    };
    const days = computeOpenDays(ex);
    expect(days).toBe(14);
  });

  it("returns 0 when created and resolved same day", () => {
    const ex: Exception = {
      id: "1",
      vendorId: "v1",
      title: "Test",
      exceptionType: "Documentation",
      severity: "Low",
      assignedToId: "u1",
      managerId: "u5",
      status: "Closed",
      dateCreated: "2024-06-01",
      dateResolved: "2024-06-01",
    };
    expect(computeOpenDays(ex)).toBe(0);
  });
});

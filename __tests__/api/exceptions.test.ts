/**
 * API-layer integration tests (without importing Next route handlers to avoid Request dependency).
 * Tests the same logic the API uses: filters, validation, create, update, status transition, audit/action.
 */
import { getAllExceptions, getExceptionById, createException, updateException } from "@/data/exceptions";
import { validateExceptionCreate, validateExceptionUpdate } from "@/lib/validations/exception";
import { canTransition } from "@/lib/validations/status";
import { appendAuditEntry } from "@/data/auditLog";
import { getAuditEntriesByExceptionId } from "@/data/auditLog";
import { appendActionEntry } from "@/data/actionLog";
import { getActionEntriesByExceptionId } from "@/data/actionLog";
import { computeOpenDays } from "@/lib/utils/exception";

describe("API integration: GET list with filters", () => {
  it("returns all exceptions when no filters", () => {
    const list = getAllExceptions();
    expect(list.length).toBeGreaterThanOrEqual(15);
  });

  it("filters by vendorId", () => {
    const list = getAllExceptions({ vendorId: "v1" });
    expect(list.every((e) => e.vendorId === "v1")).toBe(true);
  });

  it("filters by status and assignedToId", () => {
    const list = getAllExceptions({ status: "Open", assignedToId: "u1" });
    expect(list.every((e) => e.status === "Open" && e.assignedToId === "u1")).toBe(true);
  });
});

describe("API integration: POST create", () => {
  it("validates and rejects invalid payload", () => {
    const result = validateExceptionCreate({ title: "Only title" });
    expect(result.success).toBe(false);
    expect(result.errors?.vendorId).toBeDefined();
  });

  it("validates and creates; audit and action entries appended", () => {
    const payload = {
      vendorId: "v1",
      title: "Integration test exception",
      exceptionType: "Documentation",
      severity: "Low",
      assignedToId: "u1",
      managerId: "u5",
      status: "Open",
      dateCreated: "2024-07-01",
    };
    const validation = validateExceptionCreate(payload);
    expect(validation.success).toBe(true);
    const created = createException(validation.data!);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(payload.title);
    appendAuditEntry(created.id, "u1", null, created);
    appendActionEntry(created.id, "u1", "Test User", "created", "Exception created.");
    const auditEntries = getAuditEntriesByExceptionId(created.id);
    const actionEntries = getActionEntriesByExceptionId(created.id);
    expect(auditEntries.length).toBeGreaterThanOrEqual(1);
    expect(actionEntries.some((a) => a.actionType === "created")).toBe(true);
  });
});

describe("API integration: GET by id and PATCH", () => {
  it("returns 404 for unknown id", () => {
    expect(getExceptionById("nonexistent-id-xyz")).toBeUndefined();
  });

  it("rejects invalid status transition", () => {
    const ex = getExceptionById("e1");
    expect(ex).toBeDefined();
    if (!ex) return;
    expect(canTransition(ex.status, "Closed")).toBe(false);
  });

  it("accepts valid transition and update persists; audit/action appended", () => {
    const ex = getExceptionById("e1");
    expect(ex).toBeDefined();
    if (!ex) return;
    expect(canTransition(ex.status, "In Progress")).toBe(true);
    const updated = updateException("e1", { status: "In Progress" });
    expect(updated?.status).toBe("In Progress");
    appendAuditEntry("e1", "u1", ex, updated!);
    appendActionEntry("e1", "u1", "Test", "status_change", "Status changed.");
    const actions = getActionEntriesByExceptionId("e1");
    expect(actions.some((a) => a.actionType === "status_change")).toBe(true);
  });
});

describe("API integration: open days in response", () => {
  it("computeOpenDays is defined for every exception in list", () => {
    const list = getAllExceptions();
    list.forEach((e) => {
      const days = computeOpenDays(e);
      expect(typeof days).toBe("number");
      expect(days).toBeGreaterThanOrEqual(0);
    });
  });
});

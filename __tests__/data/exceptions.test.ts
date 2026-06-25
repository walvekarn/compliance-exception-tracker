import {
  getAllExceptions,
  getExceptionById,
  getExceptionsByVendor,
  createException,
  updateException,
} from "@/data/exceptions";

describe("exceptions data layer", () => {
  it("getAllExceptions returns all when no filters", () => {
    const list = getAllExceptions();
    expect(list.length).toBeGreaterThanOrEqual(15);
  });

  it("getByVendor filters correctly", () => {
    const all = getAllExceptions();
    const vendorId = all[0].vendorId;
    const byVendor = getExceptionsByVendor(vendorId);
    expect(byVendor.every((e) => e.vendorId === vendorId)).toBe(true);
    expect(getExceptionsByVendor("nonexistent")).toEqual([]);
  });

  it("getExceptionById returns exception or undefined", () => {
    const all = getAllExceptions();
    const first = getExceptionById(all[0].id);
    expect(first).toBeDefined();
    expect(first?.id).toBe(all[0].id);
    expect(getExceptionById("nonexistent")).toBeUndefined();
  });

  it("createException returns id and dateCreated", () => {
    const created = createException({
      vendorId: "v1",
      title: "Test exception",
      exceptionType: "Documentation",
      severity: "Low",
      assignedToId: "u1",
      managerId: "u5",
      status: "Open",
      dateCreated: "2025-01-01",
    });
    expect(created.id).toBeDefined();
    expect(created.dateCreated).toBe("2025-01-01");
    expect(created.title).toBe("Test exception");
  });

  it("updateException persists changes", () => {
    const created = createException({
      vendorId: "v1",
      title: "To update",
      exceptionType: "Control Gap",
      severity: "Medium",
      assignedToId: "u1",
      managerId: "u5",
      status: "Open",
      dateCreated: "2025-01-02",
    });
    const updated = updateException(created.id, { status: "In Progress", title: "Updated title" });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe("In Progress");
    expect(updated?.title).toBe("Updated title");
    const fetched = getExceptionById(created.id);
    expect(fetched?.status).toBe("In Progress");
  });
});

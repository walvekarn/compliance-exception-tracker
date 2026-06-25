import { validateExceptionCreate, validateExceptionUpdate } from "@/lib/validations/exception";

const validCreate = {
  vendorId: "v1",
  title: "Test exception",
  exceptionType: "Documentation",
  severity: "Low",
  assignedToId: "u1",
  managerId: "u5",
  status: "Open",
  dateCreated: "2024-01-15",
};

describe("validateExceptionCreate", () => {
  it("returns success for valid payload", () => {
    const result = validateExceptionCreate(validCreate);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.title).toBe("Test exception");
  });

  it("returns errors when required field is missing", () => {
    const { vendorId, ...rest } = validCreate;
    const result = validateExceptionCreate(rest);
    expect(result.success).toBe(false);
    expect(result.errors?.vendorId).toBeDefined();
  });

  it("returns error for invalid vendor id", () => {
    const result = validateExceptionCreate({ ...validCreate, vendorId: "invalid-vendor" });
    expect(result.success).toBe(false);
    expect(result.errors?.vendorId).toContain("not found");
  });

  it("returns error when dateCreated is in the future", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const result = validateExceptionCreate({
      ...validCreate,
      dateCreated: future.toISOString().slice(0, 10),
    });
    expect(result.success).toBe(false);
    expect(result.errors?.dateCreated).toBeDefined();
  });

  it("returns error for invalid enum values", () => {
    const result = validateExceptionCreate({
      ...validCreate,
      severity: "InvalidSeverity" as never,
    });
    expect(result.success).toBe(false);
    expect(result.errors?.severity).toBeDefined();
  });
});

describe("validateExceptionUpdate", () => {
  it("returns success for valid partial update", () => {
    const result = validateExceptionUpdate({ status: "In Progress" });
    expect(result.success).toBe(true);
    expect(result.data?.status).toBe("In Progress");
  });

  it("returns errors when provided vendor id is invalid", () => {
    const result = validateExceptionUpdate({ vendorId: "bad-id" });
    expect(result.success).toBe(false);
    expect(result.errors?.vendorId).toBeDefined();
  });

  it("accepts empty object", () => {
    const result = validateExceptionUpdate({});
    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });
});

import type { ExceptionCreate, ExceptionUpdate, Severity, ExceptionType, Status } from "@/types/exception";
import { SEVERITIES, EXCEPTION_TYPES, STATUSES } from "@/types/exception";
import { getVendorById } from "@/data/vendors";
import { getUserById } from "@/data/users";

export interface ValidationResult<T = unknown> {
  success: boolean;
  errors?: Record<string, string>;
  data?: T;
}

function isSeverity(s: string): s is Severity {
  return (SEVERITIES as readonly string[]).includes(s);
}
function isExceptionType(s: string): s is ExceptionType {
  return (EXCEPTION_TYPES as readonly string[]).includes(s);
}
function isStatus(s: string): s is Status {
  return (STATUSES as readonly string[]).includes(s);
}

function validDate(s: string): boolean {
  const d = new Date(s);
  return !isNaN(d.getTime());
}

function notFutureDate(s: string): boolean {
  const d = new Date(s);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d.getTime() <= today.getTime();
}

export function validateExceptionCreate(input: unknown): ValidationResult<ExceptionCreate> {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object") {
    return { success: false, errors: { _form: "Invalid payload" } };
  }
  const o = input as Record<string, unknown>;

  const vendorId = o.vendorId;
  if (typeof vendorId !== "string" || !vendorId.trim()) {
    errors.vendorId = "Vendor is required";
  } else if (!getVendorById(vendorId)) {
    errors.vendorId = "Vendor not found";
  }

  const title = o.title;
  if (typeof title !== "string" || !title.trim()) {
    errors.title = "Exception title is required";
  }

  const exceptionType = o.exceptionType;
  if (typeof exceptionType !== "string" || !isExceptionType(exceptionType)) {
    errors.exceptionType = "Valid exception type is required";
  }

  const severity = o.severity;
  if (typeof severity !== "string" || !isSeverity(severity)) {
    errors.severity = "Valid severity is required";
  }

  const assignedToId = o.assignedToId;
  if (typeof assignedToId !== "string" || !assignedToId.trim()) {
    errors.assignedToId = "Assigned to is required";
  } else if (!getUserById(assignedToId)) {
    errors.assignedToId = "User not found";
  }

  const managerId = o.managerId;
  if (typeof managerId !== "string" || !managerId.trim()) {
    errors.managerId = "Manager is required";
  } else if (!getUserById(managerId)) {
    errors.managerId = "User not found";
  }

  const status = o.status;
  if (typeof status !== "string" || !isStatus(status)) {
    errors.status = "Valid status is required";
  }

  const dateCreated = o.dateCreated;
  if (typeof dateCreated !== "string" || !dateCreated.trim()) {
    errors.dateCreated = "Date created is required";
  } else if (!validDate(dateCreated)) {
    errors.dateCreated = "Invalid date";
  } else if (!notFutureDate(dateCreated)) {
    errors.dateCreated = "Date created cannot be in the future";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, data: undefined };
  }

  const data: ExceptionCreate = {
    vendorId: (vendorId as string).trim(),
    title: (title as string).trim(),
    exceptionType: exceptionType as ExceptionType,
    severity: severity as Severity,
    assignedToId: (assignedToId as string).trim(),
    managerId: (managerId as string).trim(),
    status: status as Status,
    dateCreated: (dateCreated as string).trim(),
    description: typeof o.description === "string" ? o.description.trim() || undefined : undefined,
    dueDate: typeof o.dueDate === "string" && o.dueDate.trim() ? o.dueDate.trim() : undefined,
  };
  return { success: true, data };
}

export function validateExceptionUpdate(input: unknown): ValidationResult<ExceptionUpdate> {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object") {
    return { success: false, errors: { _form: "Invalid payload" } };
  }
  const o = input as Record<string, unknown>;

  if (o.vendorId !== undefined) {
    const vendorId = o.vendorId;
    if (typeof vendorId !== "string" || !vendorId.trim()) {
      errors.vendorId = "Vendor cannot be empty";
    } else if (!getVendorById(vendorId)) {
      errors.vendorId = "Vendor not found";
    }
  }

  if (o.title !== undefined && (typeof o.title !== "string" || !(o.title as string).trim())) {
    errors.title = "Exception title cannot be empty";
  }

  if (o.exceptionType !== undefined && (typeof o.exceptionType !== "string" || !isExceptionType(o.exceptionType as string))) {
    errors.exceptionType = "Invalid exception type";
  }

  if (o.severity !== undefined && (typeof o.severity !== "string" || !isSeverity(o.severity as string))) {
    errors.severity = "Invalid severity";
  }

  if (o.assignedToId !== undefined) {
    const assignedToId = o.assignedToId;
    if (typeof assignedToId !== "string" || !assignedToId.trim()) {
      errors.assignedToId = "Assigned to cannot be empty";
    } else if (!getUserById(assignedToId)) {
      errors.assignedToId = "User not found";
    }
  }

  if (o.managerId !== undefined) {
    const managerId = o.managerId;
    if (typeof managerId !== "string" || !managerId.trim()) {
      errors.managerId = "Manager cannot be empty";
    } else if (!getUserById(managerId)) {
      errors.managerId = "User not found";
    }
  }

  if (o.status !== undefined && (typeof o.status !== "string" || !isStatus(o.status as string))) {
    errors.status = "Invalid status";
  }

  if (o.dateCreated !== undefined) {
    const dateCreated = o.dateCreated;
    if (typeof dateCreated !== "string" || !dateCreated.trim()) {
      errors.dateCreated = "Date created is required";
    } else if (!validDate(dateCreated as string)) {
      errors.dateCreated = "Invalid date";
    } else if (!notFutureDate(dateCreated as string)) {
      errors.dateCreated = "Date created cannot be in the future";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, data: undefined };
  }

  const data: ExceptionUpdate = {};
  if (o.vendorId !== undefined) data.vendorId = (o.vendorId as string).trim();
  if (o.title !== undefined) data.title = (o.title as string).trim();
  if (o.exceptionType !== undefined) data.exceptionType = o.exceptionType as ExceptionType;
  if (o.severity !== undefined) data.severity = o.severity as Severity;
  if (o.assignedToId !== undefined) data.assignedToId = (o.assignedToId as string).trim();
  if (o.managerId !== undefined) data.managerId = (o.managerId as string).trim();
  if (o.status !== undefined) data.status = o.status as Status;
  if (o.dateCreated !== undefined) data.dateCreated = (o.dateCreated as string).trim();
  if (o.description !== undefined) data.description = typeof o.description === "string" ? o.description.trim() || undefined : undefined;
  if (o.dueDate !== undefined) data.dueDate = typeof o.dueDate === "string" && o.dueDate.trim() ? (o.dueDate as string).trim() : undefined;
  if (o.dateResolved !== undefined) data.dateResolved = typeof o.dateResolved === "string" && o.dateResolved.trim() ? (o.dateResolved as string).trim() : undefined;
  if (o.resolutionNotes !== undefined) data.resolutionNotes = typeof o.resolutionNotes === "string" ? o.resolutionNotes.trim() || undefined : undefined;

  return { success: true, data };
}

import type { Exception, ExceptionCreate, ExceptionUpdate } from "@/types/exception";
import { seedExceptions } from "./seed";

const exceptions: Exception[] = seedExceptions.map((e) => ({ ...e }));

let nextId = 1;
function generateId(): string {
  return `e${Date.now()}-${nextId++}`;
}

export interface ExceptionFilters {
  vendorId?: string;
  status?: string;
  assignedToId?: string;
}

export function getAllExceptions(filters?: ExceptionFilters): Exception[] {
  let result = [...exceptions];
  if (filters?.vendorId) {
    result = result.filter((e) => e.vendorId === filters.vendorId);
  }
  if (filters?.status) {
    result = result.filter((e) => e.status === filters.status);
  }
  if (filters?.assignedToId) {
    result = result.filter((e) => e.assignedToId === filters.assignedToId);
  }
  return result;
}

export function getExceptionById(id: string): Exception | undefined {
  return exceptions.find((e) => e.id === id);
}

export function getExceptionsByVendor(vendorId: string): Exception[] {
  return exceptions.filter((e) => e.vendorId === vendorId);
}

export function createException(input: ExceptionCreate): Exception {
  const created: Exception = {
    id: generateId(),
    vendorId: input.vendorId,
    title: input.title,
    exceptionType: input.exceptionType,
    severity: input.severity,
    assignedToId: input.assignedToId,
    managerId: input.managerId,
    status: input.status,
    dateCreated: input.dateCreated,
    description: input.description,
    dueDate: input.dueDate,
  };
  exceptions.push(created);
  return { ...created };
}

export function updateException(id: string, input: ExceptionUpdate): Exception | undefined {
  const index = exceptions.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  const existing = exceptions[index];
  const updated: Exception = {
    ...existing,
    ...input,
    id: existing.id,
  };
  exceptions[index] = updated;
  return { ...updated };
}

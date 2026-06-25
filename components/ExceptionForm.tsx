"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Exception } from "@/types/exception";
import type { Vendor } from "@/types/vendor";
import type { User } from "@/types/user";
import { SEVERITIES, EXCEPTION_TYPES, STATUSES } from "@/lib/constants";
import { getNextAllowedStatuses } from "@/lib/validations/status";

interface ExceptionFormProps {
  vendors: Vendor[];
  users: User[];
  initial?: Exception;
}

export function ExceptionForm({ vendors, users, initial }: ExceptionFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const nextStatuses = initial ? getNextAllowedStatuses(initial.status) : STATUSES;

  const [vendorId, setVendorId] = useState(initial?.vendorId ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [exceptionType, setExceptionType] = useState(initial?.exceptionType ?? "Documentation");
  const [severity, setSeverity] = useState(initial?.severity ?? "Medium");
  const [assignedToId, setAssignedToId] = useState(initial?.assignedToId ?? "");
  const [managerId, setManagerId] = useState(initial?.managerId ?? "");
  const [status, setStatus] = useState(initial?.status ?? "Open");
  const [dateCreated, setDateCreated] = useState(initial?.dateCreated ?? new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [reassignmentReason, setReassignmentReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      if (isEdit && initial) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (assignedToId !== initial.assignedToId && reassignmentReason) {
          headers["X-Reassignment-Reason"] = reassignmentReason;
        }
        const res = await fetch(`/api/exceptions/${initial.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            vendorId,
            title,
            exceptionType,
            severity,
            assignedToId,
            managerId,
            status,
            dateCreated,
            description: description || undefined,
          }),
        });
        if (res.ok) {
          router.push(`/exceptions/${initial.id}`);
          router.refresh();
          return;
        }
        const data = await res.json();
        if (data.errors) setErrors(data.errors);
        else setErrors({ _form: data.error ?? "Update failed" });
      } else {
        const res = await fetch("/api/exceptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId,
            title,
            exceptionType,
            severity,
            assignedToId,
            managerId,
            status,
            dateCreated,
            description: description || undefined,
          }),
        });
        if (res.ok) {
          const { data } = await res.json();
          router.push(`/exceptions/${data.id}`);
          router.refresh();
          return;
        }
        const data = await res.json();
        if (data.errors) setErrors(data.errors);
        else setErrors({ _form: data.error ?? "Create failed" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {errors._form && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">
          {errors._form}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor *</label>
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select vendor</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {errors.vendorId && <p className="mt-0.5 text-sm text-red-600">{errors.vendorId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Exception title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.title && <p className="mt-0.5 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type *</label>
          <select
            value={exceptionType}
            onChange={(e) => setExceptionType(e.target.value as typeof exceptionType)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {EXCEPTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Severity *</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as typeof severity)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned To *</label>
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {users.filter((u) => u.role === "analyst").map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          {errors.assignedToId && <p className="mt-0.5 text-sm text-red-600">{errors.assignedToId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Manager *</label>
          <select
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {users.filter((u) => u.role === "manager").map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          {errors.managerId && <p className="mt-0.5 text-sm text-red-600">{errors.managerId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {isEdit ? nextStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            )) : STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.status && <p className="mt-0.5 text-sm text-red-600">{errors.status}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Created *</label>
          <input
            type="date"
            value={dateCreated}
            onChange={(e) => setDateCreated(e.target.value)}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.dateCreated && <p className="mt-0.5 text-sm text-red-600">{errors.dateCreated}</p>}
        </div>
      </div>
      {isEdit && initial && assignedToId !== initial.assignedToId && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Reassignment reason (optional)</label>
          <input
            type="text"
            value={reassignmentReason}
            onChange={(e) => setReassignmentReason(e.target.value)}
            placeholder="Reason for reassignment"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

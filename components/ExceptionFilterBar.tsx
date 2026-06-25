"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Vendor } from "@/types/vendor";
import type { User } from "@/types/user";
import { SEVERITIES, STATUSES } from "@/lib/constants";

interface ExceptionFilterBarProps {
  vendors: Vendor[];
  users: User[];
}

export function ExceptionFilterBar({ vendors, users }: ExceptionFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vendorId = searchParams.get("vendorId") ?? "";
  const status = searchParams.get("status") ?? "";
  const assignedToId = searchParams.get("assignedToId") ?? "";
  const severity = searchParams.get("severity") ?? "";

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/exceptions?${next.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Vendor</span>
        <select
          value={vendorId}
          onChange={(e) => updateFilter("vendorId", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">All</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Status</span>
        <select
          value={status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Severity</span>
        <select
          value={severity}
          onChange={(e) => updateFilter("severity", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">All</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Assigned To</span>
        <select
          value={assignedToId}
          onChange={(e) => updateFilter("assignedToId", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">All</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => router.push("/exceptions")}
        className="text-sm text-gray-600 underline hover:text-gray-900"
      >
        Clear filters
      </button>
    </div>
  );
}

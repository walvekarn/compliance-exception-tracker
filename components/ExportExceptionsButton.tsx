"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function ExportExceptionsButton() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const vendorId = searchParams.get("vendorId");
      const status = searchParams.get("status");
      const assignedToId = searchParams.get("assignedToId");
      const severity = searchParams.get("severity");
      if (vendorId) params.set("vendorId", vendorId);
      if (status) params.set("status", status);
      if (assignedToId) params.set("assignedToId", assignedToId);
      if (severity) params.set("severity", severity);
      const res = await fetch(`/api/exceptions?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");
      const { data } = await res.json();
      const headers = [
        "Vendor",
        "Exception",
        "Type",
        "Severity",
        "Assigned To",
        "Manager",
        "Status",
        "Open Days",
        "Date Created",
        "Description",
      ];
      const rows = data.map(
        (e: {
          vendorName?: string;
          title: string;
          exceptionType: string;
          severity: string;
          assignedToName?: string;
          managerName?: string;
          status: string;
          openDays: number;
          dateCreated: string;
          description?: string;
        }) => [
          e.vendorName ?? "",
          e.title,
          e.exceptionType,
          e.severity,
          e.assignedToName ?? "",
          e.managerName ?? "",
          e.status,
          String(e.openDays),
          e.dateCreated,
          (e.description ?? "").replace(/"/g, '""'),
        ]
      );
      const csv =
        headers.join(",") +
        "\n" +
        rows.map((r: string[]) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exceptions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  );
}

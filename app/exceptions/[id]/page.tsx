import Link from "next/link";
import { notFound } from "next/navigation";
import { getExceptionById } from "@/data/exceptions";
import { getVendorById } from "@/data/vendors";
import { getUserById } from "@/data/users";
import { getAuditEntriesByExceptionId } from "@/data/auditLog";
import { getActionEntriesByExceptionId } from "@/data/actionLog";
import { computeOpenDays } from "@/lib/utils/exception";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExceptionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const exception = getExceptionById(id);
  if (!exception) notFound();

  const openDays = computeOpenDays(exception);
  const vendorName = getVendorById(exception.vendorId)?.name;
  const assignedToName = getUserById(exception.assignedToId)?.name;
  const managerName = getUserById(exception.managerId)?.name;

  const auditEntries = getAuditEntriesByExceptionId(id);
  const actionEntries = getActionEntriesByExceptionId(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/exceptions"
          className="text-sm text-gray-600 no-underline hover:text-gray-900"
        >
          ← Back to Exceptions
        </Link>
        <Link
          href={`/exceptions/${id}/edit`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-blue-700"
        >
          Edit
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">{exception.title}</h1>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Vendor</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{vendorName ?? exception.vendorId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Type</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{exception.exceptionType}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Severity</dt>
            <dd className="mt-0.5">
              <span
                className={
                  exception.severity === "Critical"
                    ? "rounded bg-red-100 px-2 py-0.5 text-sm text-red-800"
                    : exception.severity === "High"
                      ? "rounded bg-orange-100 px-2 py-0.5 text-sm text-orange-800"
                      : "rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-800"
                }
              >
                {exception.severity}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Assigned To</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{assignedToName ?? exception.assignedToId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Manager</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{managerName ?? exception.managerId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Status</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{exception.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Open Days</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{openDays}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Date Created</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{exception.dateCreated}</dd>
          </div>
        </dl>
        {exception.description && (
          <div className="mt-4">
            <dt className="text-xs font-medium uppercase text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{exception.description}</dd>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Action Log</h2>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {actionEntries.length === 0 ? (
              <li className="text-sm text-gray-500">No actions yet.</li>
            ) : (
              actionEntries.map((entry) => (
                <li key={entry.id} className="border-l-2 border-gray-200 pl-3 text-sm">
                  <span className="font-medium text-gray-700">{entry.userName}</span>
                  <span className="text-gray-500"> · {entry.actionType}</span>
                  <span className="block text-gray-600">{entry.message}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.timestampUtc).toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {auditEntries.length === 0 ? (
              <li className="text-sm text-gray-500">No audit entries yet.</li>
            ) : (
              auditEntries.map((entry) => (
                <li key={entry.id} className="border-l-2 border-gray-200 pl-3 text-sm">
                  <span className="text-xs text-gray-400">
                    {new Date(entry.timestampUtc).toLocaleString()} UTC
                  </span>
                  <ul className="mt-1 list-inside list-disc text-gray-600">
                    {entry.changes.map((c, i) => (
                      <li key={i}>
                        {c.field}: {String(c.oldValue ?? "—")} → {String(c.newValue ?? "—")}
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

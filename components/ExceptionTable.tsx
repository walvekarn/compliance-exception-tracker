import Link from "next/link";

interface ExceptionRow {
  id: string;
  vendorId: string;
  vendorName?: string;
  title: string;
  exceptionType: string;
  severity: string;
  assignedToId: string;
  assignedToName?: string;
  managerId: string;
  managerName?: string;
  status: string;
  openDays: number;
  dateCreated: string;
  description?: string;
}

interface ExceptionTableProps {
  exceptions: ExceptionRow[];
}

export function ExceptionTable({ exceptions }: ExceptionTableProps) {
  if (exceptions.length === 0) {
    return (
      <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        No exceptions match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Vendor
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Exception
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Severity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Assigned To
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Manager
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Open Days
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {exceptions.map((ex) => (
            <tr key={ex.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {ex.vendorName ?? ex.vendorId}
              </td>
              <td className="px-4 py-3 text-sm">
                <Link
                  href={`/exceptions/${ex.id}`}
                  className="font-medium text-blue-600 no-underline hover:underline"
                >
                  {ex.title}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {ex.exceptionType}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span
                  className={
                    ex.severity === "Critical"
                      ? "rounded bg-red-100 px-2 py-0.5 text-red-800"
                      : ex.severity === "High"
                        ? "rounded bg-orange-100 px-2 py-0.5 text-orange-800"
                        : ex.severity === "Medium"
                          ? "rounded bg-yellow-100 px-2 py-0.5 text-yellow-800"
                          : "rounded bg-gray-100 px-2 py-0.5 text-gray-800"
                  }
                >
                  {ex.severity}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {ex.assignedToName ?? ex.assignedToId}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {ex.managerName ?? ex.managerId}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {ex.status}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">
                {ex.openDays}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {ex.dateCreated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

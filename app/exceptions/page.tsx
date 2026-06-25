import Link from "next/link";
import { Suspense } from "react";
import { getAllExceptions } from "@/data/exceptions";
import { getAllVendors } from "@/data/vendors";
import { getAllUsers } from "@/data/users";
import { getVendorById } from "@/data/vendors";
import { getUserById } from "@/data/users";
import { computeOpenDays } from "@/lib/utils/exception";
import { ExceptionFilterBar } from "@/components/ExceptionFilterBar";
import { ExceptionTable } from "@/components/ExceptionTable";
import { ExportExceptionsButton } from "@/components/ExportExceptionsButton";

interface PageProps {
  searchParams: Promise<{ vendorId?: string; status?: string; assignedToId?: string; severity?: string }>;
}

export default async function ExceptionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const vendorId = params.vendorId ?? undefined;
  const status = params.status ?? undefined;
  const assignedToId = params.assignedToId ?? undefined;
  const severity = params.severity ?? undefined;

  let list = getAllExceptions({ vendorId, status, assignedToId });
  if (severity) {
    list = list.filter((e) => e.severity === severity);
  }
  list = [...list].sort((a, b) => computeOpenDays(b) - computeOpenDays(a)); // sort by open days desc

  const withMeta = list.map((e) => ({
    ...e,
    openDays: computeOpenDays(e),
    vendorName: getVendorById(e.vendorId)?.name,
    assignedToName: getUserById(e.assignedToId)?.name,
    managerName: getUserById(e.managerId)?.name,
  }));

  const vendors = getAllVendors();
  const users = getAllUsers();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Exceptions</h1>
        <div className="flex gap-2">
          <Suspense fallback={null}>
            <ExportExceptionsButton />
          </Suspense>
          <Link
            href="/exceptions/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-blue-700"
          >
            New Exception
          </Link>
        </div>
      </div>
      <Suspense fallback={<div className="mb-4 h-12 animate-pulse rounded bg-gray-200" />}>
        <ExceptionFilterBar vendors={vendors} users={users} />
      </Suspense>
      <ExceptionTable exceptions={withMeta} />
    </div>
  );
}

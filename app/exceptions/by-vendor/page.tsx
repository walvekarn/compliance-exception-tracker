import Link from "next/link";
import { getAllVendors } from "@/data/vendors";
import { getExceptionsByVendor } from "@/data/exceptions";

export default async function ByVendorPage() {
  const vendors = getAllVendors();
  const summary = vendors.map((v) => {
    const exceptions = getExceptionsByVendor(v.id);
    const openCount = exceptions.filter(
      (e) => e.status !== "Resolved" && e.status !== "Closed"
    ).length;
    return { vendor: v, total: exceptions.length, openCount };
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Exceptions by Vendor</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map(({ vendor, total, openCount }) => (
          <Link
            key={vendor.id}
            href={`/exceptions?vendorId=${vendor.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 no-underline shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <h2 className="font-semibold text-gray-900">{vendor.name}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {openCount} open / {total} total
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

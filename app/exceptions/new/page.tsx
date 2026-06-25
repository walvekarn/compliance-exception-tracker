import Link from "next/link";
import { getAllVendors } from "@/data/vendors";
import { getAllUsers } from "@/data/users";
import { ExceptionForm } from "@/components/ExceptionForm";

export default async function NewExceptionPage() {
  const vendors = getAllVendors();
  const users = getAllUsers();
  return (
    <div>
      <Link
        href="/exceptions"
        className="mb-4 inline-block text-sm text-gray-600 no-underline hover:text-gray-900"
      >
        ← Back to Exceptions
      </Link>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">New Exception</h1>
      <ExceptionForm vendors={vendors} users={users} />
    </div>
  );
}

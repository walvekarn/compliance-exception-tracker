import Link from "next/link";
import { notFound } from "next/navigation";
import { getExceptionById } from "@/data/exceptions";
import { getAllVendors } from "@/data/vendors";
import { getAllUsers } from "@/data/users";
import { ExceptionForm } from "@/components/ExceptionForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExceptionPage({ params }: PageProps) {
  const { id } = await params;
  const exception = getExceptionById(id);
  if (!exception) notFound();

  const vendors = getAllVendors();
  const users = getAllUsers();

  return (
    <div>
      <Link
        href={`/exceptions/${id}`}
        className="mb-4 inline-block text-sm text-gray-600 no-underline hover:text-gray-900"
      >
        ← Back to Exception
      </Link>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Edit Exception</h1>
      <ExceptionForm vendors={vendors} users={users} initial={exception} />
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Compliance Exception Tracker
      </h1>
      <p className="mt-2 text-gray-600">
        Central view of all compliance exceptions across vendors.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/exceptions"
          className="rounded-md bg-blue-600 px-4 py-2 text-white no-underline hover:bg-blue-700"
        >
          View Exceptions
        </Link>
        <Link
          href="/exceptions/new"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 no-underline hover:bg-gray-50"
        >
          New Exception
        </Link>
      </div>
    </div>
  );
}

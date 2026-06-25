"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ExceptionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">{error.message}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
        <Link
          href="/exceptions"
          className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 no-underline hover:bg-red-100"
        >
          Back to list
        </Link>
      </div>
    </div>
  );
}

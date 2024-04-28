/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Frown className="w-10 text-gray-400" />
      <span className="rounded-lg bg-blue-300 text-blue-600 font-bold text-xs p-1.5">
        404 Error
      </span>
      <h1 className="text-4xl font-semibold">We've lost this page</h1>
      <p>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/login"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}

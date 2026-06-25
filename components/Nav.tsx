"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/exceptions", label: "Exceptions" },
  { href: "/exceptions/by-vendor", label: "By Vendor" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-6">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-900 no-underline"
        >
          Compliance Exception Tracker
        </Link>
        <ul className="flex gap-4">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "font-medium text-blue-600 no-underline"
                    : "text-gray-600 no-underline hover:text-gray-900"
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

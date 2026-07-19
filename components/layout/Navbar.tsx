"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/antrenman", label: "Antrenman" },
  { href: "/sinav", label: "Sınav Simülasyonu" },
  { href: "/ders", label: "Dersler" },
  { href: "/kurumlar", label: "Kurumlar" },
  { href: "/mulakat", label: "Mülakat" },
  { href: "/dashboard", label: "Panel" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/70 backdrop-blur-md dark:border-neutral-800/70 dark:bg-neutral-950/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Katibim
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

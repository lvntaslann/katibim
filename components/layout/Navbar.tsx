"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/antrenman", label: "Antrenman" },
  { href: "/sinav", label: "Sınav Simülasyonu" },
  { href: "/ders", label: "Dersler" },
  { href: "/kurumlar", label: "Kurumlar" },
  { href: "/mulakat", label: "Mülakat" },
  { href: "/dashboard", label: "Panel" },
];

/**
 * Top masthead: full-width bar with a single hairline rule beneath it,
 * understated text links (no pill/rounded nav chrome).
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-base">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
          Katibim
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 py-1 text-sm tracking-wide transition-colors ${
                  active
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:border-hairline hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

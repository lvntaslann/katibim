"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import { AvatarMenu } from "./AvatarMenu";

const LINKS = [
  { href: "/practice", label: "Antrenman" },
  { href: "/exam", label: "Sınav Simülasyonu" },
  { href: "/lessons", label: "Dersler" },
  { href: "/speed-test", label: "Hız Testi" },
  { href: "/leaderboard", label: "Liderlik Tablosu" },
  { href: "/institutions", label: "Kurumlar" },
  { href: "/interview", label: "Mülakat" },
  { href: "/dashboard", label: "Panel" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header className={`sticky top-0 z-50 border-b border-hairline/80 transition-colors ${isOpen ? "bg-base dark:bg-[#141413]" : "bg-base/90 backdrop-blur-xl dark:bg-[#181715]/90"}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink transition-opacity hover:opacity-80"
        >
          <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/20 font-mono text-lg font-black text-accent shadow-sm dark:border-accent-strong/30 dark:bg-accent/25 dark:text-accent-strong">
            K
          </span>
          <span>Katibim</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-2.5 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-all xl:px-3 xl:text-sm ${
                  active
                    ? "bg-accent/15 text-accent font-semibold dark:bg-accent/20 dark:text-accent-strong"
                    : "text-ink-muted hover:bg-surface hover:text-ink dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <AvatarMenu />
              <Link
                href="/exam"
                className="rounded-full bg-accent px-4 py-2 text-xs font-bold whitespace-nowrap text-base shadow-md transition-all hover:scale-105 hover:bg-accent-strong hover:shadow-lg"
              >
                Hemen Başla
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-2 text-xs font-bold whitespace-nowrap text-base shadow-md transition-all hover:scale-105 hover:bg-accent-strong hover:shadow-lg"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={isOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline/80 bg-surface/80 text-ink shadow-sm transition-all hover:bg-surface hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-white/5"
          >
            {isOpen ? <X className="h-6 w-6 text-accent" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Glassmorphic Drawer Overlay - Solid Opaque Background */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[61px] z-50 flex h-[calc(100dvh-61px)] flex-col justify-between bg-base p-6 transition-all lg:hidden dark:bg-[#141413]">
          <div className="flex flex-col gap-2 overflow-y-auto">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              Menü Navigasyonu
            </p>
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-[52px] items-center justify-between rounded-2xl px-5 py-3 text-base font-semibold transition-all ${
                    active
                      ? "border border-accent/30 bg-accent/15 text-accent shadow-sm dark:border-accent/40 dark:bg-accent/20 dark:text-accent-strong"
                      : "border border-transparent text-ink-muted hover:border-hairline hover:bg-surface hover:text-ink dark:hover:border-white/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`h-5 w-5 ${active ? "text-accent dark:text-accent-strong" : "text-ink-muted opacity-60"}`} />
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-hairline/80 pt-6 dark:border-white/10">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-hairline py-3.5 text-center text-base font-semibold text-ink dark:border-white/10"
                >
                  Profilim
                </Link>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-hairline py-3.5 text-center text-base font-semibold text-ink-muted dark:border-white/10"
                  >
                    Çıkış Yap
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-accent py-3.5 text-center text-base font-bold text-accent"
                >
                  Kayıt Ol
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-hairline py-3.5 text-center text-base font-semibold text-ink-muted dark:border-white/10"
                >
                  Giriş Yap
                </Link>
              </>
            )}
            <Link
              href="/exam"
              onClick={() => setIsOpen(false)}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-center text-base font-bold text-base shadow-lg transition-transform active:scale-95"
            >
              <span>Resmî Sınav Simülasyonu</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
            <p className="text-center text-xs text-ink-muted">
              Zabıt Kâtipliği & Yargıtay Sınav Platformu
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

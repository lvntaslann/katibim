"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import { AvatarMenu } from "./AvatarMenu";
import { Logo } from "./Logo";

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
  const router = useRouter();
  const { user, signOut, isSigningOut } = useAuth();
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
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-hairline/80 bg-base transition-colors dark:bg-[#141413]"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div onClick={() => setIsOpen(false)}>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 xl:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-2.5 py-2 font-mono text-[0.6875rem] font-medium tracking-wide whitespace-nowrap uppercase transition-all duration-200 hover:-translate-y-0.5 xl:px-3 ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="navbar-active-underline"
                    className="absolute inset-x-2.5 -bottom-px h-0.5 bg-accent dark:bg-accent-strong"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : (
                  <span className="absolute inset-x-2.5 -bottom-px h-0.5 origin-left scale-x-0 bg-accent/50 transition-transform duration-200 ease-out group-hover:scale-x-100 dark:bg-accent-strong/50" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-5 xl:flex">
          <ThemeToggle />
          {user || isSigningOut ? (
            <>
              <AvatarMenu />
              <Link
                href="/exam"
                className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-bold tracking-wide whitespace-nowrap text-base uppercase transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-md active:translate-y-0"
              >
                Hemen Başla
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-xs font-medium tracking-wide whitespace-nowrap text-ink-muted uppercase transition-colors hover:text-ink"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-bold tracking-wide whitespace-nowrap text-base uppercase transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-md active:translate-y-0"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 xl:hidden">
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
        <div className="fixed inset-x-0 top-[61px] z-50 flex h-[calc(100dvh-61px)] flex-col justify-between bg-base p-6 transition-all xl:hidden dark:bg-[#141413]">
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
                <button
                  type="button"
                  onClick={async () => {
                    setIsOpen(false);
                    await signOut();
                    router.refresh();
                  }}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-hairline py-3.5 text-center text-base font-semibold text-ink-muted dark:border-white/10"
                >
                  Çıkış Yap
                </button>
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
    </motion.header>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function AvatarMenu() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const label = profile?.display_name ?? user.email ?? "Kullanıcı";
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  const showEmailSeparately = Boolean(profile?.display_name && user.email);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Hesap menüsü"
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-hairline/80 bg-accent/15 font-mono text-sm font-bold text-accent transition-transform hover:scale-105 dark:border-white/10 dark:bg-accent/20 dark:text-accent-strong"
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- external OAuth-provided avatar URL, not a local asset.
          <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-hairline bg-surface/95 p-1.5 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#181715]/95">
          <div className="px-2.5 py-1.5">
            <p className="truncate text-sm font-semibold text-ink">{label}</p>
            {showEmailSeparately && <p className="truncate text-xs text-ink-muted">{user.email}</p>}
          </div>
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-ink transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <UserIcon className="h-4 w-4" /> Profil
          </Link>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-ink transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Çıkış Yap
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

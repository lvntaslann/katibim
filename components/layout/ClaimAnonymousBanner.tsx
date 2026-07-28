"use client";

import { useAuth } from "./AuthProvider";

export function ClaimAnonymousBanner() {
  const { showClaimBanner, acceptClaim, dismissClaim } = useAuth();
  if (!showClaimBanner) return null;

  return (
    <div className="border-b border-hairline/80 bg-accent/10 dark:border-white/10 dark:bg-accent/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-ink">Bu tarayıcıda kaydedilmiş anonim sonuçların var. Hesabına aktarmak ister misin?</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void acceptClaim()}
            className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-base transition-transform hover:scale-105"
          >
            Evet, aktar
          </button>
          <button
            type="button"
            onClick={dismissClaim}
            className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink dark:border-white/10"
          >
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
}

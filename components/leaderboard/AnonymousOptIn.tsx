"use client";

import { useState } from "react";

export function AnonymousOptIn({
  onSubmit,
  onSkip,
}: {
  onSubmit: (name: string) => void;
  onSkip: () => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-hairline bg-surface/60 p-5">
      <p className="text-sm font-medium text-ink">Liderlik tablosunda görünmek ister misin?</p>
      <p className="text-xs text-ink-muted">
        Hesap açmadan, sadece bu tarayıcıda hatırlanan bir isimle katılabilirsin. İstersen sonra hesap açıp bu
        sonucu hesabına aktarabilirsin.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Görünecek isim"
          maxLength={40}
          className="flex-1 rounded-lg border border-hairline bg-base px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5"
        />
        <button
          type="button"
          disabled={!name.trim()}
          onClick={() => onSubmit(name.trim())}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-base transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          Katıl
        </button>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="self-start text-xs text-ink-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-ink"
      >
        Şimdi değil
      </button>
    </div>
  );
}

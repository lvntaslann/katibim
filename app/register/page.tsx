"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { hasAnonymousActivity, markPendingClaim } from "@/lib/anonymous-identity";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

const inputClass =
  "w-full rounded-lg border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setError("Kayıt oluşturulamadı. E-posta zaten kullanılıyor olabilir.");
      return;
    }
    if (hasAnonymousActivity()) markPendingClaim();
    if (data.session) {
      router.push(next);
      router.refresh();
    } else {
      setAwaitingConfirmation(true);
    }
  }

  async function handleGoogle() {
    if (hasAnonymousActivity()) markPendingClaim();
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        scopes: "profile email",
      },
    });
  }

  if (awaitingConfirmation) {
    return (
      <main className="mx-auto flex max-w-md flex-col gap-4 px-6 py-14">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Hesap</span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">E-postanı kontrol et</h1>
        <p className="text-sm text-ink-muted">
          {email} adresine bir onay bağlantısı gönderdik. Bağlantıya tıkladığında hesabın aktifleşecek.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-2 text-left">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Hesap</span>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Kayıt Ol</h1>
        <p className="text-sm text-ink-muted">
          Liderlik tablosunda görün, aktivite grafiğini takip et, sonuçların cihazlar arasında senkron kalsın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="displayName" className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Ad
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm font-semibold text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 self-start border border-accent px-8 py-3 text-lg font-medium text-accent transition-colors hover:bg-accent hover:text-base disabled:opacity-50"
        >
          {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
        </button>
      </form>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-xs text-ink-muted">veya</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="flex items-center justify-center gap-2.5 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <GoogleIcon className="h-4 w-4" />
        Google ile kayıt ol
      </button>

      <p className="text-center text-sm text-ink-muted">
        Zaten hesabın var mı?{" "}
        <Link href="/login" className="text-accent underline decoration-hairline underline-offset-4">
          Giriş yap
        </Link>
      </p>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}

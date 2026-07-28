import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-hairline/80 bg-surface/30 pt-16 pb-12 transition-colors dark:border-white/10 dark:bg-[#141413]/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8">
        {/* Brand Col */}
        <div className="flex flex-col items-start gap-4 sm:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 font-mono text-base font-black text-accent shadow-sm dark:bg-accent/25 dark:text-accent-strong">
              K
            </span>
            <span>Katibim</span>
          </Link>
          <p className="max-w-md text-xs leading-relaxed text-ink-muted">
            Adalet Bakanlığı, Yargıtay, Danıştay ve Sayıştay zabıt kâtipliği sınavlarına özel yapay zeka destekli, gerçekçi on parmak hazırlık platformu.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-hairline/80 bg-base/80 px-3 py-1.5 text-[11px] font-medium text-ink-muted dark:border-white/10 dark:bg-black/40">
            <ShieldCheck size={14} className="text-accent dark:text-accent-strong" />
            <span>Verileriniz tarayıcınızda (IndexedDB) yerel olarak şifrelenir.</span>
          </div>
        </div>

        {/* Quick Links Col */}
        <div className="flex flex-col gap-3 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Pratik & Sınav</p>
          <div className="flex flex-col gap-2 text-xs text-ink-muted">
            <Link href="/sinav" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              Sınav Simülasyonu
            </Link>
            <Link href="/antrenman" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              Serbest Antrenman
            </Link>
            <Link href="/ders" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              Adım Adım Dersler
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              Yapay Zeka Tuş Analitiği
            </Link>
          </div>
        </div>

        {/* Institutional Guides Col */}
        <div className="flex flex-col gap-3 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Kurumsal Rehber</p>
          <div className="flex flex-col gap-2 text-xs text-ink-muted">
            <Link href="/kurumlar" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              Hedef Kurum Profilleri
            </Link>
            <Link href="/mulakat" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              Sözlü Mülakat Rehberi
            </Link>
            <Link href="/ders" className="transition-colors hover:text-accent dark:hover:text-accent-strong">
              F & Q Klavye Düzeni
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-hairline/60 px-4 pt-8 text-center text-[11px] text-ink-muted sm:flex-row sm:px-6 sm:text-left dark:border-white/5">
        <p>© 2026 Katibim. Tüm hakları saklıdır. Bağımsız bir sınav hazırlık aracıdır.</p>
        <p className="opacity-75">Resmî kurum ilan ve metinleri esastır.</p>
      </div>
    </footer>
  );
}

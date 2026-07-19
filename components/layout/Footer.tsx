import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white/60 py-10 dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Katibim</p>
        <p className="max-w-xl text-xs text-neutral-500 dark:text-neutral-400">
          Bu platform bağımsız bir hazırlık aracıdır; herhangi bir resmî kurumla bağlantılı değildir. Kesin
          sınav ve mülakat bilgileri için ilgili kurumun güncel ilan metnini kontrol ediniz.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <Link href="/kurumlar" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Kurum Rehberi
          </Link>
          <Link href="/mulakat" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Mülakat Hazırlığı
          </Link>
          <Link href="/ders" className="hover:text-neutral-800 dark:hover:text-neutral-200">
            Dersler
          </Link>
        </div>
      </div>
    </footer>
  );
}

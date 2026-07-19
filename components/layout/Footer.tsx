import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-hairline py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 text-left">
        <p className="text-sm font-semibold text-ink">Katibim</p>
        <p className="max-w-xl text-xs leading-relaxed text-ink-muted">
          Bu platform bağımsız bir hazırlık aracıdır; herhangi bir resmî kurumla bağlantılı değildir. Kesin
          sınav ve mülakat bilgileri için ilgili kurumun güncel ilan metnini kontrol ediniz.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
          <Link href="/kurumlar" className="hover:text-ink">
            Kurum Rehberi
          </Link>
          <Link href="/mulakat" className="hover:text-ink">
            Mülakat Hazırlığı
          </Link>
          <Link href="/ders" className="hover:text-ink">
            Dersler
          </Link>
        </div>
      </div>
    </footer>
  );
}

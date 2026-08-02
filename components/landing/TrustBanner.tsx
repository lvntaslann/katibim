const TRUSTED_INSTITUTIONS = ["Adalet Bakanlığı", "Yargıtay", "Danıştay", "Sayıştay", "Bakanlıklar / KİT'ler"];

export function TrustBanner() {
  return (
    <section className="border-y border-hairline/60 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono shrink-0 text-xs font-bold tracking-[0.25em] text-ink-muted uppercase">
          Hedeflenen Resmî Kurumlar
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {TRUSTED_INSTITUTIONS.map((name) => (
            <span key={name} className="text-sm font-medium text-ink-muted">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

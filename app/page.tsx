import Link from "next/link";
import { ArrowRight, Building2, Gauge, Keyboard, MessageSquare, NotebookText, Timer } from "lucide-react";
import { TypewriterHeadline } from "@/components/layout/TypewriterHeadline";
import { INSTITUTIONS } from "@/data/institutions";
import { LESSONS } from "@/data/lessons";

const TRUSTED_INSTITUTIONS = ["Adalet Bakanlığı", "Yargıtay", "Danıştay", "Sayıştay", "Bakanlıklar / KİT'ler"];

function HeroPreviewCard({
  icon,
  meta,
  title,
  subtitle,
  size = "md",
}: {
  icon: React.ReactNode;
  meta: string;
  title: string;
  subtitle: string;
  size?: "md" | "sm";
}) {
  return (
    <div
      className={`rounded-2xl border border-hairline bg-surface/90 shadow-xl backdrop-blur-sm blur-[1.5px] ${
        size === "sm" ? "w-44 p-3" : "w-56 p-4"
      }`}
    >
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <span className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-muted">{meta}</span>
      </div>
      <p className={`mt-3 font-mono tabular-figures text-ink ${size === "sm" ? "text-lg" : "text-2xl"}`}>{title}</p>
      <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>
    </div>
  );
}

/** Absolutely-positioned hero card with a static Tailwind rotation plus a
 * gentle inner float loop (see .hero-card-float in globals.css) — hidden
 * below `lg` so it never competes with the headline on narrow screens. */
function FloatingHeroCard({
  position,
  rotate,
  delay,
  faded = false,
  children,
}: {
  position: string;
  rotate: string;
  delay: string;
  faded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-10 hidden lg:block ${position} ${rotate} ${faded ? "opacity-70" : ""}`}
    >
      <div className="hero-card-float" style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Gerçekçi Sınav Simülasyonu",
    desc: "Kuruma özgü süre, hata katsayısı ve klavye kuralları ile birebir sınav ortamı.",
  },
  {
    title: "F ve Q Klavye Desteği",
    desc: "Her iki resmî Türkçe klavye düzeninde de anında geçiş yapıp pratik yapın.",
  },
  {
    title: "Şeffaf Sanal Klavye",
    desc: "Sıradaki tuşu ve doğru parmağı canlı olarak gösteren yarı saydam klavye katmanı.",
  },
  {
    title: "Detaylı Tuş Analitiği",
    desc: "Isı haritası, hatalı tuş tablosu, parmak yükü ve sık karıştırılan harfler.",
  },
  {
    title: "Zayıflığa Özel Alıştırma",
    desc: "En çok hata yaptığınız tuşları esas alan kişiselleştirilmiş alıştırma metinleri.",
  },
  {
    title: "Kurum ve Mülakat Rehberi",
    desc: "Kurumlara göre sınav kuralları ve sözlü mülakat hazırlık kılavuzu tek yerde.",
  },
];

const FAQ = [
  {
    q: "Hangi kurumlar için uygun?",
    a: "Adalet Bakanlığı zabıt kâtipliği başta olmak üzere yüksek yargı organları, üniversiteler, belediyeler, bakanlıklar ve KİT'lerin kâtiplik/büro personeli alımlarına hazırlanabilirsiniz.",
  },
  {
    q: "Verilerim nerede saklanıyor?",
    a: "Tüm oturum geçmişiniz ve istatistikleriniz yalnızca tarayıcınızda (IndexedDB) saklanır; sunucuya gönderilmez. Dilediğiniz zaman dışa aktarabilirsiniz.",
  },
  {
    q: "F klavye mi Q klavye mi öğrenmeliyim?",
    a: "Çoğu kurum her iki klavyeyi de kabul eder; F klavye Türkçe harf sıklığına göre tasarlandığı için genellikle daha yüksek hız potansiyeli sunar. Platform her iki düzeni de destekler.",
  },
  {
    q: "Mobil cihazdan pratik yapabilir miyim?",
    a: "Yazım testi fiziksel bir klavye gerektirir; mobil cihazlarda sayfaları inceleyebilir, ancak sınav simülasyonunu bir bilgisayardan yapmanız önerilir.",
  },
];

export default function LandingPage() {
  const lessonCount = LESSONS.length;

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="hero-glow relative flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-6">
        <FloatingHeroCard position="left-2 top-24 xl:left-10" rotate="-rotate-6" delay="0s">
          <HeroPreviewCard
            icon={<Gauge size={16} />}
            meta="Sonuç · Zabıt Kâtipliği"
            title="87 NKS"
            subtitle="%98,4 doğruluk · F klavye"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="left-20 top-64 xl:left-28" rotate="rotate-3" delay="1s" faded>
          <HeroPreviewCard
            size="sm"
            icon={<Timer size={14} />}
            meta="Antrenman · Serbest"
            title="62 NKS"
            subtitle="Kişisel en iyi skor"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="left-0 bottom-24 xl:left-4" rotate="-rotate-12" delay="1.8s" faded>
          <HeroPreviewCard
            size="sm"
            icon={<MessageSquare size={14} />}
            meta="Mülakat Rehberi"
            title="12 Soru"
            subtitle="Örnek cevap yapıları"
          />
        </FloatingHeroCard>

        <FloatingHeroCard position="right-2 top-24 xl:right-10" rotate="rotate-6" delay="0.5s">
          <HeroPreviewCard
            icon={<NotebookText size={16} />}
            meta="Ders · Seviye 3"
            title="12/16"
            subtitle="Hece ve kelime adımları tamamlandı"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="right-20 top-64 xl:right-28" rotate="-rotate-3" delay="1.3s" faded>
          <HeroPreviewCard
            size="sm"
            icon={<Building2 size={14} />}
            meta="Kurum · Yargıtay"
            title="120 sn"
            subtitle="Asgari 90 NKS"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="right-0 bottom-24 xl:right-4" rotate="rotate-12" delay="2.1s" faded>
          <HeroPreviewCard size="sm" icon={<Keyboard size={14} />} meta="Isı Haritası" title="ğ" subtitle="En çok karışan tuş" />
        </FloatingHeroCard>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <span
            data-aos="fade-down"
            className="rounded-full border border-hairline bg-base/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted backdrop-blur-sm"
          >
            Kamu Kâtiplik Sınavlarına Hazırlık
          </span>
          <h1
            data-aos="fade-up"
            className="min-h-[6rem] text-4xl font-bold tracking-tight text-ink sm:min-h-[9rem] sm:text-6xl"
          >
            <TypewriterHeadline />
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="max-w-xl text-lg text-ink-muted">
            F ve Q klavyede gerçekçi sınav simülasyonu, adım adım ders sistemi ve detaylı tuş analitiği tek
            platformda.
          </p>

          <Link
            href="/sinav"
            data-aos="fade-up"
            data-aos-delay="200"
            className="group flex w-full max-w-xl items-center justify-between rounded-full border border-hairline bg-base/80 py-2 pl-6 pr-2 text-left shadow-lg backdrop-blur-sm transition hover:border-accent"
          >
            <span className="text-sm text-ink-muted">Kurumunuza özel sınav simülasyonunu deneyin</span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-base transition group-hover:bg-accent-strong">
              Başla
              <ArrowRight size={16} />
            </span>
          </Link>
          <Link href="/ders" className="text-sm text-ink-muted underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-accent">
            ya da derslerle sıfırdan başlayın
          </Link>

          <div data-aos="fade-up" data-aos-delay="300" className="mt-1 grid grid-cols-3 gap-6 sm:gap-12">
            {[
              { label: "Kurum Profili", value: `${INSTITUTIONS.length}+` },
              { label: "Ders Adımı", value: `${lessonCount * 4}+` },
              { label: "Klavye Düzeni", value: "F & Q" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-2xl tabular-figures text-ink sm:text-3xl">{s.value}</div>
                <div className="text-xs uppercase tracking-wide text-ink-muted">{s.label}</div>
              </div>
            ))}
          </div>

          <div data-aos="fade-up" data-aos-delay="400" className="mt-3 flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
              Hazırlandığınız kurumlardan bazıları
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 opacity-80">
              {TRUSTED_INSTITUTIONS.map((name) => (
                <span key={name} className="text-sm font-medium text-ink-muted">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2
            data-aos="fade-up"
            className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            Neden Katibim?
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-white/50 px-4 py-16 dark:bg-neutral-900/40">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {[
            {
              title: "Antrenman",
              desc: "Süre baskısı olmadan serbest pratik yapın, geri silme açık, dilediğiniz metni seçin.",
              href: "/antrenman",
            },
            {
              title: "Sınav Simülasyonu",
              desc: "Kurumunuzu seçin, gerçek sınav süresi ve puanlama kuralları ile test edilin.",
              href: "/sinav",
            },
            {
              title: "Ders Sistemi",
              desc: "Esas sıradan başlayarak seviye seviye tüm klavyeyi öğrenin.",
              href: "/ders",
            },
          ].map((m, i) => (
            <Link
              key={m.title}
              href={m.href}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
            >
              <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-accent dark:text-neutral-100">
                {m.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            data-aos="fade-up"
            className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            Adaylarımız Ne Diyor
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { name: "B.K.", text: "F klavye dersleriyle üç haftada net hızımı ikiye katladım." },
              { name: "S.Y.", text: "Sınav simülasyonu sayesinde gerçek sınavda hiç şaşırmadım." },
              { name: "M.A.", text: "Isı haritası zayıf tuşlarımı görmemi ve hızla düzeltmemi sağladı." },
            ].map((t, i) => (
              <div
                key={t.name}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="rounded-3xl border border-neutral-200 bg-white/70 p-5 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <p className="text-neutral-700 dark:text-neutral-300">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-3 font-semibold text-neutral-900 dark:text-neutral-100">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/50 px-4 py-16 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2
            data-aos="fade-up"
            className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            Sık Sorulan Sorular
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            {FAQ.map((item, i) => (
              <details
                key={item.q}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <summary className="cursor-pointer list-none font-medium text-neutral-900 dark:text-neutral-100">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <div data-aos="zoom-in" className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Hazır mısınız?</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            İlk oturumunuzu şimdi başlatın, ilerlemenizi panelinizde takip edin.
          </p>
          <Link
            href="/antrenman"
            className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-lg font-semibold text-base shadow-lg transition hover:bg-accent-strong"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, Activity, Building2, Gauge, Keyboard, MessageSquare, NotebookText, RefreshCw, Timer, Trophy } from "lucide-react";
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
    href: "/exam",
  },
  {
    title: "F ve Q Klavye Desteği",
    desc: "Her iki resmî Türkçe klavye düzeninde de anında geçiş yapıp pratik yapın.",
    href: "/practice",
  },
  {
    title: "Şeffaf Sanal Klavye",
    desc: "Sıradaki tuşu ve doğru parmağı canlı olarak gösteren yarı saydam klavye katmanı.",
    href: "/lessons",
  },
  {
    title: "Detaylı Tuş Analitiği",
    desc: "Isı haritası, hatalı tuş tablosu, parmak yükü ve sık karıştırılan harfler.",
    href: "/dashboard",
  },
  {
    title: "Zayıflığa Özel Alıştırma",
    desc: "En çok hata yaptığınız tuşları esas alan kişiselleştirilmiş alıştırma metinleri.",
    href: "/practice",
  },
  {
    title: "Kurum ve Mülakat Rehberi",
    desc: "Kurumlara göre sınav kuralları ve sözlü mülakat hazırlık kılavuzu tek yerde.",
    href: "/institutions",
  },
];

const ACCOUNT_BENEFITS = [
  {
    title: "Liderlik Tablosunda Yer Alın",
    desc: "Sınav, antrenman, ders ve 10 parmak hız testi sonuçlarınız gerçek isminizle liderlik tablosunda görünsün.",
    icon: <Trophy size={18} />,
  },
  {
    title: "Aktivite Grafiğinizi Görün",
    desc: "GitHub tarzı bir takvimde günlük çalışma düzeninizi ve serinizi takip edin.",
    icon: <Activity size={18} />,
  },
  {
    title: "Cihazlar Arasında Senkron",
    desc: "Sonuçlarınız hesabınıza bağlı kalır; farklı bir cihazdan giriş yaptığınızda geçmişiniz sizi bekler.",
    icon: <RefreshCw size={18} />,
  },
];

const FAQ = [
  {
    q: "Hangi kurumlar için uygun?",
    a: "Adalet Bakanlığı zabıt kâtipliği başta olmak üzere yüksek yargı organları, üniversiteler, belediyeler, bakanlıklar ve KİT'lerin kâtiplik/büro personeli alımlarına hazırlanabilirsiniz.",
  },
  {
    q: "Verilerim nerede saklanıyor?",
    a: "Hesap açmadan kullanırsanız oturum geçmişiniz yalnızca tarayıcınızda (IndexedDB) saklanır ve sunucuya gönderilmez. Kayıt olursanız liderlik tablosu ve aktivite grafiği için sonuçlarınız hesabınızla senkronize edilir; dilediğiniz zaman dışa aktarabilirsiniz.",
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
      <section className="hero-glow relative flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center overflow-hidden px-4 pt-12 pb-24 sm:pt-16 sm:pb-32">
        {/* Left Flank Floating Cards */}
        <FloatingHeroCard position="left-2 top-20 xl:left-8" rotate="-rotate-6" delay="0s">
          <HeroPreviewCard
            icon={<Gauge size={16} />}
            meta="Sonuç · Zabıt Kâtipliği"
            title="87 NKS"
            subtitle="%98,4 doğruluk · F klavye"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="left-16 top-60 xl:left-24" rotate="rotate-3" delay="1s" faded>
          <HeroPreviewCard
            size="sm"
            icon={<Timer size={14} />}
            meta="Antrenman · Serbest"
            title="62 NKS"
            subtitle="Kişisel en iyi skor"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="left-0 bottom-16 xl:left-4" rotate="-rotate-12" delay="1.8s" faded>
          <HeroPreviewCard
            size="sm"
            icon={<MessageSquare size={14} />}
            meta="Mülakat Rehberi"
            title="12 Soru"
            subtitle="Örnek cevap yapıları"
          />
        </FloatingHeroCard>

        {/* Right Flank Floating Cards */}
        <FloatingHeroCard position="right-2 top-20 xl:right-8" rotate="rotate-6" delay="0.5s">
          <HeroPreviewCard
            icon={<NotebookText size={16} />}
            meta="Ders · Seviye 3"
            title="12/16"
            subtitle="Hece ve kelime adımları tamamlandı"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="right-16 top-60 xl:right-24" rotate="-rotate-3" delay="1.3s" faded>
          <HeroPreviewCard
            size="sm"
            icon={<Building2 size={14} />}
            meta="Kurum · Yargıtay"
            title="120 sn"
            subtitle="Asgari 90 NKS"
          />
        </FloatingHeroCard>
        <FloatingHeroCard position="right-0 bottom-16 xl:right-4" rotate="rotate-12" delay="2.1s" faded>
          <HeroPreviewCard size="sm" icon={<Keyboard size={14} />} meta="Isı Haritası" title="ğ" subtitle="En çok karışan tuş" />
        </FloatingHeroCard>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <span
            data-aos="fade-down"
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-md dark:text-accent-strong"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Kamu Kâtiplik Sınavlarına Hazırlık Platformu
          </span>
          <h1
            data-aos="fade-up"
            className="flex items-center justify-center min-h-[8.5rem] sm:min-h-[13.5rem] text-4xl font-extrabold tracking-tight text-ink sm:text-6xl sm:leading-tight"
          >
            <TypewriterHeadline />
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="max-w-xl text-base sm:text-lg leading-relaxed text-ink-muted">
            F ve Q klavyede kuruma özel gerçekçi sınav simülasyonu, adım adım on parmak dersleri ve detaylı yapay zeka tuş analitiği.
          </p>

          <Link
            href="/exam"
            data-aos="fade-up"
            data-aos-delay="200"
            className="group mt-1 flex w-full max-w-xl flex-col items-center justify-between gap-3 rounded-3xl border border-hairline bg-base/90 p-3 text-center shadow-xl backdrop-blur-md transition-all hover:border-accent hover:shadow-[0_8px_30px_rgba(79,189,179,0.2)] sm:flex-row sm:gap-0 sm:rounded-full sm:py-2 sm:pl-6 sm:pr-2 sm:text-left dark:border-white/10 dark:bg-[#181715]/90"
          >
            <span className="text-sm font-medium text-ink-muted group-hover:text-ink">Kurumunuza özel sınav simülasyonunu deneyin</span>
            <span className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-base shadow-md transition-transform group-hover:scale-105 group-hover:bg-accent-strong sm:w-auto sm:rounded-full sm:py-2.5">
              Hemen Başla
              <ArrowRight size={16} />
            </span>
          </Link>
          <Link href="/lessons" className="text-xs sm:text-sm font-medium text-ink-muted underline decoration-hairline underline-offset-4 transition hover:text-accent hover:decoration-accent">
            ya da derslerle sıfırdan on parmak öğrenin
          </Link>

          <div data-aos="fade-up" data-aos-delay="300" className="mt-6 grid grid-cols-3 gap-2 sm:gap-8 border-y border-hairline/60 py-5 w-full max-w-xl dark:border-white/5">
            {[
              { label: "Kurum Profili", value: `${INSTITUTIONS.length}+` },
              { label: "Ders Adımı", value: `${lessonCount * 4}+` },
              { label: "Klavye Düzeni", value: "F & Q" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-xl font-bold tabular-nums text-ink sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Logo Banner - Scroll Reveal */}
      <section className="border-y border-hairline/60 bg-surface/30 px-4 py-8 backdrop-blur-md dark:border-white/5 dark:bg-[#181715]/40">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="shrink-0 text-xs font-bold uppercase tracking-[0.25em] text-ink-muted">
            Hedeflenen Resmî Kurumlar
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-85">
            {TRUSTED_INSTITUTIONS.map((name) => (
              <span key={name} className="text-sm font-semibold text-ink-muted transition-colors hover:text-accent dark:hover:text-accent-strong">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Asymmetric Bento Grid */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center" data-aos="fade-up">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
              Sınav Odaklı Altyapı
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
              Neden Katibim?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              Sıradan yazım testlerinin ötesinde, zabıt kâtipliği sınavlarının gerçek fiziksel ve zihinsel koşullarını simüle eden yapay zeka destekli altyapı.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const isWide = i === 0 || i === 3 || i === 5;
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-surface/80 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl dark:border-white/10 dark:bg-[#1c1b19]/80 dark:hover:border-accent-strong/40 ${
                    isWide ? "lg:col-span-2 bg-gradient-to-br from-surface/90 via-surface/70 to-accent/5 dark:from-[#1c1b19]/95 dark:via-[#1c1b19]/80 dark:to-accent/10" : "lg:col-span-1"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent dark:bg-accent/20 dark:text-accent-strong">
                        0{i + 1}
                      </span>
                      {isWide && (
                        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
                          Öne Çıkan Özellik
                        </span>
                      )}
                    </div>
                    <h3 className={`mt-6 font-bold text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100 dark:group-hover:text-accent-strong ${isWide ? "text-2xl" : "text-xl"}`}>
                      {f.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{f.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-accent-strong">
                    <span>Hemen Deneyin</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Account Benefits */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center" data-aos="fade-up">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
              Hesap Avantajları
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
              Kayıt Olmadan da Kullanabilirsiniz
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              Tüm modüller hesap açmadan tamamen açık. Kayıt olursanız ayrıca şunlara da erişirsiniz:
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {ACCOUNT_BENEFITS.map((b, i) => (
              <div
                key={b.title}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="flex flex-col gap-3 rounded-3xl border border-hairline/80 bg-surface/80 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1b19]/80"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-strong">
                  {b.icon}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{b.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center" data-aos="fade-up">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-base shadow-md transition-all hover:scale-105 hover:bg-accent-strong hover:shadow-lg"
            >
              <span>Ücretsiz Kayıt Ol</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="relative overflow-hidden bg-gradient-to-b from-transparent via-surface/50 to-transparent px-4 py-20 dark:via-neutral-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center" data-aos="fade-up">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
              Çalışma Modülleri
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
              Pratiğe Nereden Başlamak İstersiniz?
            </h2>
            <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
              Seviyenize ve hedefinize en uygun çalışma modülünü seçerek klavye hızınızı hemen artırın.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Antrenman",
                desc: "Süre baskısı olmadan serbest pratik yapın, geri silme açık, dilediğiniz metni seçin.",
                href: "/practice",
                icon: <Timer className="h-6 w-6" />,
                badge: "Serbest Pratik",
              },
              {
                title: "Sınav Simülasyonu",
                desc: "Kurumunuzu seçin, gerçek sınav süresi ve puanlama kuralları ile test edilin.",
                href: "/exam",
                icon: <Building2 className="h-6 w-6" />,
                badge: "Resmî Sınav",
              },
              {
                title: "Ders Sistemi",
                desc: "Esas sıradan başlayarak seviye seviye tüm klavyeyi on parmak öğrenin.",
                href: "/lessons",
                icon: <NotebookText className="h-6 w-6" />,
                badge: "Adım Adım",
              },
            ].map((m, i) => (
              <Link
                key={m.title}
                href={m.href}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="group relative flex flex-col justify-between rounded-3xl border border-hairline/80 bg-surface/80 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/60 hover:shadow-[0_12px_40px_rgba(79,189,179,0.15)] dark:border-white/10 dark:bg-[#1c1b19]/80 dark:hover:border-accent-strong/50 dark:hover:shadow-[0_12px_40px_rgba(126,212,203,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110 dark:bg-accent/20 dark:text-accent-strong">
                      {m.icon}
                    </span>
                    <span className="rounded-full border border-hairline bg-base px-3 py-1 text-xs font-medium text-ink-muted dark:border-white/5 dark:bg-black/40">
                      {m.badge}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100 dark:group-hover:text-accent-strong">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{m.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-accent transition-colors group-hover:text-accent-strong dark:text-accent-strong">
                  <span>Hemen Başla</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Asymmetric Showcase */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center" data-aos="fade-up">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
              Başarı Hikayeleri
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
              Adaylarımız Ne Diyor?
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "B.K.",
                title: "Adalet Bakanlığı Zabıt Kâtipliği Kazananı",
                text: "F klavye dersleriyle üç haftada net hızımı ikiye katladım. Özellikle sınav simülasyonundaki hata katsayısı hesaplaması sayesinde mülakatta sıfır heyecan yaşadım.",
                wideLg: true,
                wideMd: true,
              },
              {
                name: "S.Y.",
                title: "Yargıtay Kâtip Adayı",
                text: "Sınav simülasyonu sayesinde gerçek sınavda hiç şaşırmadım. Şeffaf klavye katmanı harika bir pratik sunuyor.",
                wideLg: false,
                wideMd: false,
              },
              {
                name: "M.A.",
                title: "Danıştay Büro Personeli",
                text: "Isı haritası zayıf tuşlarımı görmemi ve hızla düzeltmemi sağladı. Kâtiplik için en iyi platform.",
                wideLg: false,
                wideMd: false,
              },
              {
                name: "E.D.",
                title: "Sayıştay Denetçi Yardımcısı Adayı",
                text: "Zayıflığa özel alıştırma modülü en çok hata yaptığım harfleri tespit edip bana özel metinler üretti. Kısa sürede 120 kelime barajını aştım.",
                wideLg: true,
                wideMd: true,
              },
            ].map((t, i) => (
              <div
                key={t.name}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className={`group relative flex flex-col justify-between rounded-3xl border border-hairline/80 bg-surface/80 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl dark:border-white/10 dark:bg-[#1c1b19]/80 dark:hover:border-accent-strong/40 ${
                  t.wideLg ? "lg:col-span-2" : "lg:col-span-1"
                } ${
                  t.wideMd ? "md:col-span-2" : "md:col-span-1"
                } ${
                  t.wideLg ? "bg-gradient-to-br from-surface/95 via-surface/80 to-accent/5 dark:from-[#1c1b19]/95 dark:to-accent/10" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-accent dark:text-accent-strong">
                      {"★★★★★".split("").map((star, idx) => (
                        <span key={idx} className="text-sm">{star}</span>
                      ))}
                    </div>
                    <span className="rounded-full border border-hairline bg-base px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:border-white/5 dark:bg-black/40">
                      Doğrulanmış Aday
                    </span>
                  </div>
                  <p className={`mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium ${t.wideLg ? "text-lg italic" : "text-sm"}`}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-hairline/60 pt-4 dark:border-white/5">
                  <p className="font-bold text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100 dark:group-hover:text-accent-strong">{t.name}</p>
                  <p className="text-xs font-medium text-ink-muted">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-transparent via-surface/30 to-transparent px-4 py-20 dark:via-neutral-900/30">
        <div className="mx-auto max-w-3xl">
          <div className="text-center" data-aos="fade-up">
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
              Rehber
            </span>
            <h2 className="mt-3 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Sık Sorulan Sorular
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            {FAQ.map((item, i) => (
              <details
                key={item.q}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="group overflow-hidden rounded-2xl border border-hairline/80 bg-surface/80 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-accent/40 dark:border-white/10 dark:bg-[#1c1b19]/80 dark:hover:border-accent-strong/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-semibold text-neutral-900 transition-colors group-hover:text-accent dark:text-neutral-100 dark:group-hover:text-accent-strong">
                  <span>{item.q}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent transition-transform duration-300 group-open:rotate-180 dark:bg-accent/20 dark:text-accent-strong">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-hairline/60 px-6 pb-6 pt-4 text-sm leading-relaxed text-neutral-600 dark:border-white/5 dark:text-neutral-300">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <div
          data-aos="zoom-in"
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-hairline/80 bg-gradient-to-br from-surface/90 via-base to-accent/10 p-10 shadow-2xl backdrop-blur-2xl sm:p-16 dark:border-white/10 dark:from-[#1c1b19]/95 dark:via-[#141413] dark:to-accent/15"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-strong/15 blur-3xl pointer-events-none" />
          
          <span className="relative z-10 inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-strong">
            Hemen Başlayın
          </span>
          <h2 className="relative z-10 mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
            Klavye Sınavını Kazanmaya Hazır mısınız?
          </h2>
          <p className="relative z-10 mx-auto mt-3 max-w-xl text-base text-neutral-600 dark:text-neutral-300">
            Kurumunuza özel sınav simülasyonunu şimdi başlatın, yapay zeka tuş analizi ile hızınızı mülakattan önce maksimuma çıkarın.
          </p>
          <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/practice"
              className="w-full rounded-2xl bg-accent px-8 py-4 text-base font-bold text-base shadow-[0_8px_30px_rgba(79,189,179,0.3)] transition-all hover:scale-105 hover:bg-accent-strong sm:w-auto dark:shadow-[0_8px_30px_rgba(126,212,203,0.25)]"
            >
              Ücretsiz Pratik Başlat
            </Link>
            <Link
              href="/exam"
              className="w-full rounded-2xl border border-hairline bg-surface/80 px-8 py-4 text-base font-bold text-neutral-900 backdrop-blur-md transition-all hover:bg-base sm:w-auto dark:border-white/10 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10"
            >
              Sınav Simülasyonunu Deneyin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

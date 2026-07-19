import Link from "next/link";
import { INSTITUTIONS } from "@/data/institutions";
import { LESSONS } from "@/data/lessons";

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
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <span
            data-aos="fade-down"
            className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
          >
            Kamu Kâtiplik Sınavlarına Hazırlık
          </span>
          <h1
            data-aos="fade-up"
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-100"
          >
            Uygulamalı klavye sınavına <span className="text-blue-600">emin adımlarla</span> hazırlanın
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-300"
          >
            Zabıt kâtibi, icra kâtibi ve diğer kamu kâtiplik sınavları için F ve Q klavye ile gerçekçi sınav
            simülasyonu, adım adım ders sistemi ve detaylı tuş analitiği tek platformda.
          </p>
          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sinav"
              className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              Sınav Simülasyonunu Dene
            </Link>
            <Link
              href="/ders"
              className="rounded-full border border-neutral-300 bg-white px-8 py-3 text-lg font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Derslerle Başla
            </Link>
          </div>

          <div data-aos="fade-up" data-aos-delay="300" className="mt-6 grid grid-cols-3 gap-6 sm:gap-12">
            {[
              { label: "Kurum Profili", value: `${INSTITUTIONS.length}+` },
              { label: "Ders Adımı", value: `${lessonCount * 4}+` },
              { label: "Klavye Düzeni", value: "F & Q" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-100">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {s.label}
                </div>
              </div>
            ))}
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
              <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100">
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
            className="mt-6 inline-block rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </section>
    </main>
  );
}

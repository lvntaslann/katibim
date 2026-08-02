"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

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

function FaqItem({ item }: { item: (typeof FAQ)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.6"] });
  // Scale-and-focus in, distinct from the slide/rotate/parallax used in the
  // sections above.
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }}>
      <details className="group border-t border-hairline/60 py-5 last:border-b">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
          <span>{item.q}</span>
          <ChevronDown
            size={18}
            className="shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
      </details>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section className="border-t border-hairline/60 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase dark:text-accent-strong">
            Rehber
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Sık Sorulan Sorular
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col">
          {FAQ.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

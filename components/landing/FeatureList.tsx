"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

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

function FeatureRow({ f, i }: { f: (typeof FEATURES)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.5"] });

  // Alternating entry direction per row, plus the index numeral drifting at
  // its own (slower) rate — two independently-moving parts in one row
  // instead of the whole block translating together.
  const fromX = i % 2 === 0 ? -48 : 48;
  const x = useTransform(scrollYProgress, [0, 1], [fromX, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const numberX = useTransform(scrollYProgress, [0, 1], [fromX * 1.8, 0]);

  return (
    <motion.div ref={ref} style={{ opacity }}>
      <Link
        href={f.href}
        className="group flex items-center gap-6 border-t border-hairline/60 py-6 transition-colors last:border-b hover:text-accent dark:hover:text-accent-strong"
      >
        <motion.span style={{ x: numberX }} className="font-display w-10 shrink-0 text-2xl font-medium text-ink-muted/50 sm:text-3xl">
          {String(i + 1).padStart(2, "0")}
        </motion.span>
        <motion.div style={{ x }} className="flex-1">
          <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-accent sm:text-xl dark:group-hover:text-accent-strong">
            {f.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
        </motion.div>
        <ArrowUpRight
          size={20}
          className="shrink-0 text-ink-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-hover:opacity-100 dark:group-hover:text-accent-strong"
        />
      </Link>
    </motion.div>
  );
}

export function FeatureList() {
  return (
    <section className="border-t border-hairline/60 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase dark:text-accent-strong">
            Sınav Odaklı Altyapı
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Neden Katibim?
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

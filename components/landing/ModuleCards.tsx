"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Building2, NotebookText, Timer } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const MODULES = [
  {
    title: "Antrenman",
    desc: "Süre baskısı olmadan serbest pratik yapın, geri silme açık, dilediğiniz metni seçin.",
    href: "/practice",
    icon: Timer,
    badge: "Serbest Pratik",
    parallax: 36,
  },
  {
    title: "Sınav Simülasyonu",
    desc: "Kurumunuzu seçin, gerçek sınav süresi ve puanlama kuralları ile test edilin.",
    href: "/exam",
    icon: Building2,
    badge: "Resmî Sınav",
    parallax: -24,
  },
  {
    title: "Ders Sistemi",
    desc: "Esas sıradan başlayarak seviye seviye tüm klavyeyi on parmak öğrenin.",
    href: "/lessons",
    icon: NotebookText,
    badge: "Adım Adım",
    parallax: 48,
  },
];

function ModuleCard({ m }: { m: (typeof MODULES)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  // Each card drifts vertically at its own rate for the whole time it's in
  // the viewport (continuous parallax), not just a one-time enter animation.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [m.parallax, -m.parallax]);

  return (
    <motion.div ref={ref} style={{ y }}>
      <Link
        href={m.href}
        className="group flex h-full flex-col justify-between rounded-md border border-hairline/80 p-6 transition-colors hover:border-accent/60 dark:border-white/10"
      >
        <div>
          <div className="flex items-center justify-between">
            <m.icon size={22} className="text-accent dark:text-accent-strong" />
            <span className="font-mono text-[11px] font-medium tracking-wide text-ink-muted uppercase">{m.badge}</span>
          </div>
          <h3 className="mt-5 text-lg font-bold text-ink transition-colors group-hover:text-accent dark:group-hover:text-accent-strong">
            {m.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.desc}</p>
        </div>
        <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-accent dark:text-accent-strong">
          <span>Hemen Başla</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}

export function ModuleCards() {
  return (
    <section className="border-t border-hairline/60 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase dark:text-accent-strong">
            Çalışma Modülleri
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Pratiğe Nereden Başlamak İstersiniz?
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {MODULES.map((m) => (
            <ModuleCard key={m.title} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

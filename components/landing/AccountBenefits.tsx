"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, ArrowRight, RefreshCw, Trophy } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const ACCOUNT_BENEFITS = [
  {
    title: "Liderlik Tablosunda Yer Alın",
    desc: "Sınav, antrenman, ders ve 10 parmak hız testi sonuçlarınız gerçek isminizle liderlik tablosunda görünsün.",
    icon: Trophy,
  },
  {
    title: "Aktivite Grafiğinizi Görün",
    desc: "GitHub tarzı bir takvimde günlük çalışma düzeninizi ve serinizi takip edin.",
    icon: Activity,
  },
  {
    title: "Cihazlar Arasında Senkron",
    desc: "Sonuçlarınız hesabınıza bağlı kalır; farklı bir cihazdan giriş yaptığınızda geçmişiniz sizi bekler.",
    icon: RefreshCw,
  },
];

function BenefitCard({ b }: { b: (typeof ACCOUNT_BENEFITS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.5"] });

  // Icon spins in from -120° while scaling up; text block trails slightly
  // behind on opacity only — two different motions on one card.
  const iconRotate = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const iconScale = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 1], [0, 1]);

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <motion.div style={{ rotate: iconRotate, scale: iconScale }}>
        <b.icon size={22} className="text-accent dark:text-accent-strong" />
      </motion.div>
      <motion.div style={{ opacity: textOpacity }}>
        <h3 className="text-base font-bold text-ink">{b.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{b.desc}</p>
      </motion.div>
    </div>
  );
}

export function AccountBenefits() {
  return (
    <section className="border-t border-hairline/60 bg-surface/40 px-4 py-20 sm:px-6 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase dark:text-accent-strong">
            Hesap Avantajları
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Kayıt Olmadan da Kullanabilirsiniz
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            Tüm modüller hesap açmadan tamamen açık. Kayıt olursanız ayrıca şunlara da erişirsiniz:
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {ACCOUNT_BENEFITS.map((b) => (
            <BenefitCard key={b.title} b={b} />
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-strong dark:text-accent-strong"
          >
            Ücretsiz Kayıt Ol
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

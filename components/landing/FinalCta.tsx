"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

export function FinalCta() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.9", "start 0.3"] });
  // A glow that converges/intensifies as the section arrives — a closing
  // motion distinct from the slide/rotate/parallax/line-draw/scale used
  // earlier on the page.
  const glowScale = useTransform(scrollYProgress, [0, 1], [1.6, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="hero-glow relative overflow-hidden px-4 py-24 text-center sm:px-6">
      <motion.div
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--color-accent)_35%,transparent),transparent_70%)]"
      />
      <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4">
        <span className="font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase dark:text-accent-strong">
          Hemen Başlayın
        </span>
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Klavye Sınavını Kazanmaya Hazır mısınız?
        </h2>
        <p className="max-w-xl text-base text-ink-muted">
          Kurumunuza özel sınav simülasyonunu şimdi başlatın, tuş analiziyle hızınızı mülakattan önce artırın.
        </p>
        <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/practice"
            className="group flex w-full items-center justify-center gap-2 rounded-md bg-accent px-8 py-3.5 text-sm font-semibold text-base transition-colors hover:bg-accent-strong sm:w-auto"
          >
            Ücretsiz Pratik Başlat
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/exam"
            className="w-full rounded-md border border-hairline px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent sm:w-auto dark:border-white/10 dark:hover:border-accent-strong dark:hover:text-accent-strong"
          >
            Sınav Simülasyonunu Deneyin
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

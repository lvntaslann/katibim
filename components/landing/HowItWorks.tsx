"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Keyboard, Gauge, Flame, LineChart } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const STEPS = [
  {
    title: "Kurumunuzu ve klavye düzeninizi seçin",
    desc: "Sınav süresi, hata katsayısı ve metin teslim şekli hedeflediğiniz kuruma göre otomatik ayarlanır.",
    icon: Keyboard,
  },
  {
    title: "Şeffaf klavye katmanı doğru parmağı gösterir",
    desc: "Sıradaki tuş ekranın üzerinde yarı saydam bir katmanla işaretlenir — bakmadan yazmayı öğrenirsiniz.",
    icon: Gauge,
  },
  {
    title: "Her tuş vuruşu anlık puanlanır",
    desc: "Net kelime/dakika ve hata katsayısı, gerçek sınav formülüyle, siz yazarken hesaplanır.",
    icon: LineChart,
  },
  {
    title: "Isı haritası zayıf noktalarınızı gösterir",
    desc: "En çok karıştırdığınız tuşlar tespit edilir ve size özel bir alıştırma metni üretilir.",
    icon: Flame,
  },
];

export function HowItWorks() {
  const listRef = useRef<HTMLDivElement>(null);
  // A single connecting line grows down the step list as you scroll through
  // it — one continuous draw, not a per-item fade.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="border-t border-hairline/60 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-accent uppercase dark:text-accent-strong">
            Nasıl Çalışır
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Yazarken Analiz Eden Bir Sistem
          </h2>
        </Reveal>

        <div ref={listRef} className="relative mt-14 pl-10">
          <div className="absolute top-1 bottom-1 left-[15px] w-px bg-hairline/70 dark:bg-white/10">
            <motion.div
              style={{ height: lineHeight }}
              className="w-px bg-accent dark:bg-accent-strong"
            />
          </div>

          <div className="flex flex-col gap-12">
            {STEPS.map((step) => (
              <div key={step.title} className="relative">
                <span className="absolute top-0.5 -left-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-base dark:border-accent-strong dark:bg-[#141413]">
                  <step.icon size={14} className="text-accent dark:text-accent-strong" />
                </span>
                <h3 className="text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

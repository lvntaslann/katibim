"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BarChart3, BookOpen, Gauge, Keyboard, Target, Timer } from "lucide-react";
import { HeroQuickBar } from "@/components/landing/HeroQuickBar";

// Scattered at uneven heights/offsets on purpose — a mirrored corner grid
// read as too tidy/staged; these deliberately don't line up. Spread across
// the full height (into the grid-floor band too, not just the "sky" above
// it) so the lower half of the hero doesn't read as an empty gap before the
// quick bar. Each carries its own tilt so the set reads as scattered.
const FLOATING_CARDS = [
  { icon: Timer, label: "Gerçek Sınav Temposu", className: "top-[11%] left-[4%] xl:left-[7%]", tilt: -3 },
  { icon: Keyboard, label: "F & Q Klavye Desteği", className: "top-[19%] right-[3%] xl:right-[10%]", tilt: 2.5 },
  { icon: Target, label: "Kişiye Özel Alıştırma", className: "top-[34%] left-[2%] xl:left-[6%]", tilt: 2 },
  { icon: Gauge, label: "Tuş Bazlı Analiz", className: "top-[40%] right-[6%] xl:right-[15%]", tilt: -2.5 },
  { icon: BarChart3, label: "Detaylı Raporlama", className: "top-[58%] left-[6%] xl:left-[13%]", tilt: -1.5 },
  { icon: BookOpen, label: "Adım Adım Dersler", className: "top-[62%] right-[5%] xl:right-[12%]", tilt: 2 },
] as const;

// Soft glass pills — low-contrast fill so they read as ambient depth cues
// rather than competing UI, an icon "coin" for a bit more visual craft than
// a plain icon+label row, and a light static tilt (on top of the pointer
// drift) so the set reads as scattered rather than snapped to a grid.
function FloatingCard({
  icon: Icon,
  label,
  className,
  tilt,
  x,
  y,
  opacity,
}: {
  icon: typeof Timer;
  label: string;
  className: string;
  tilt: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden
      style={{ x, y, opacity, rotate: tilt }}
      className={`pointer-events-none absolute z-10 hidden items-center gap-2.5 rounded-2xl border border-hairline/25 bg-base/20 py-2 pr-4 pl-2 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none ${className}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 dark:bg-accent-strong/15">
        <Icon size={14} className="text-accent dark:text-accent-strong" />
      </span>
      <span className="font-mono text-[11px] font-semibold tracking-wide text-ink-muted uppercase">{label}</span>
    </motion.div>
  );
}

/**
 * Hero stage: a soft, slowly drifting gradient floor beneath the headline
 * (plain CSS blobs + blur, no grid — see `.hero-flow-floor`). It keeps
 * transforming (scaling, fading) as the user scrolls through this section's
 * extra height via `position: sticky`. The copy fades/lifts out early so
 * the floor is the last thing on screen before the next section takes over.
 *
 * On top of the scroll choreography, the pointer drives a second, spring-
 * smoothed layer of motion: the floor drifts opposite to the cursor while
 * the copy and the floating value-prop cards drift with it — the same
 * depth-parallax split as a live-wallpaper hero, minus a background
 * wordmark (nothing reads well as a giant ghost letter/word on its own).
 */
export function HeroScrollStage({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const floorScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.6]);
  const floorOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.35], reduceMotion ? [0, 0] : [0, -50]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 40, damping: 20, mass: 0.8 };
  const springX = useSpring(pointerX, springConfig);
  const springY = useSpring(pointerY, springConfig);

  const floorParallaxX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [14, -14]);
  const copyParallaxX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-14, 14]);

  // Fixed set (not derived from FLOATING_CARDS.map) so these hooks run in a
  // stable order every render — hooks can't be called from inside .map.
  // Each card gets its own amplitude so the five drift at visibly different
  // rates instead of moving as one rigid, obviously-mirrored unit.
  const cardAX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-19, 19]);
  const cardAY = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-12, 12]);
  const cardBX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-13, 13]);
  const cardBY = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-8.5, 8.5]);
  const cardCX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-17, 17]);
  const cardCY = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-11, 11]);
  const cardDX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-24, 24]);
  const cardDY = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-15, 15]);
  const cardEX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-15.5, 15.5]);
  const cardEY = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-9.8, 9.8]);
  const cardFX = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-21, 21]);
  const cardFY = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-13.5, 13.5]);
  const cardX = [cardAX, cardBX, cardCX, cardDX, cardEX, cardFX];
  const cardY = [cardAY, cardBY, cardCY, cardDY, cardEY, cardFY];

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      id="hero"
      ref={containerRef}
      className={`hero-glow relative ${reduceMotion ? "h-[calc(100dvh-4.5rem)]" : "h-[calc(190dvh-4.5rem)]"}`}
    >
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="sticky top-[4.5rem] flex h-[calc(100dvh-4.5rem)] flex-col items-center overflow-hidden"
      >
        {/* Fluid gradient floor, bottom-anchored. The scroll/pointer scale+pan
            lives on this wrapper; the CSS drift animation lives on the inner
            div so the two transforms don't fight over the same element. */}
        <motion.div
          aria-hidden
          style={{ scale: floorScale, opacity: floorOpacity, x: floorParallaxX }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] origin-bottom overflow-hidden sm:h-[50%]"
        >
          <div className="hero-flow-floor h-full w-full" />
        </motion.div>

        {/* Value-prop cards, drifting with the copy rather than a background wordmark */}
        {FLOATING_CARDS.map((card, i) => (
          <FloatingCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            className={card.className}
            tilt={card.tilt}
            x={cardX[i]}
            y={cardY[i]}
            opacity={copyOpacity}
          />
        ))}

        {/* Copy — natural height, always clear of the floor */}
        <motion.div
          style={{ opacity: copyOpacity, y: copyY, x: copyParallaxX }}
          className="relative z-10 flex w-full flex-col items-center px-4 pt-10 text-center sm:px-6 sm:pt-14"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center">{children}</div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-6 z-20 px-4 sm:px-6">
          <HeroQuickBar />
        </div>
      </div>
    </div>
  );
}

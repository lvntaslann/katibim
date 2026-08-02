"use client";

import { Building2, ChevronDown, ShieldCheck, TrendingUp, Zap } from "lucide-react";

// Trust/value chips, not nav links — the navbar above already owns
// navigation, so this bar shows quick facts instead of repeating it.
const LEFT_ITEMS = [
  { icon: ShieldCheck, label: "Kurulum Gerekmez" },
  { icon: Zap, label: "Ücretsiz Başlayın" },
];

const RIGHT_ITEMS = [
  { icon: TrendingUp, label: "Anlık İlerleme Takibi" },
  { icon: Building2, label: "Kuruma Özel Kurallar" },
];

function scrollToNextSection() {
  const hero = document.getElementById("hero");
  if (!hero) return;
  window.scrollTo({ top: hero.offsetHeight + hero.offsetTop, behavior: "smooth" });
}

export function HeroQuickBar() {
  return (
    // Grid, not flex + justify-between: with three unequal children a flex
    // row leaves the middle one wherever the side widths happen to push it.
    // A fixed center column keeps the scroll button exactly centered no
    // matter how many chips sit on either side.
    <div className="relative z-20 mx-auto grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center rounded-full border border-hairline/70 bg-base/80 px-3 py-2 shadow-lg backdrop-blur-md sm:px-4 dark:border-white/10 dark:bg-[#141413]/80">
      <div className="hidden items-center gap-5 justify-self-start sm:flex">
        {LEFT_ITEMS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
            <item.icon size={13} className="text-accent dark:text-accent-strong" />
            {item.label}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={scrollToNextSection}
        aria-label="Aşağı kaydır"
        className="col-start-2 flex h-11 w-11 shrink-0 items-center justify-center justify-self-center rounded-full bg-accent text-base transition-transform hover:scale-110"
      >
        <ChevronDown size={20} className="animate-bounce" />
      </button>

      <div className="hidden items-center gap-5 justify-self-end sm:flex">
        {RIGHT_ITEMS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
            <item.icon size={13} className="text-accent dark:text-accent-strong" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

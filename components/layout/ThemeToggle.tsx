"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const CYCLE = ["light", "dark", "system"] as const;
type ThemeChoice = (typeof CYCLE)[number];

const ICONS: Record<ThemeChoice, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };
const LABELS: Record<ThemeChoice, string> = { light: "Açık", dark: "Koyu", system: "Sistem" };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid rendering theme-dependent output until mounted: next-themes only
  // knows the real value client-side, and rendering a guess would mismatch
  // the server-rendered markup.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag, the standard next-themes hydration-safety pattern.
    setMounted(true);
  }, []);

  const current: ThemeChoice = mounted && CYCLE.includes(theme as ThemeChoice) ? (theme as ThemeChoice) : "system";
  const Icon = ICONS[current];

  function cycle() {
    const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Tema: ${LABELS[current]}. Değiştirmek için tıklayın.`}
      className="flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-xl border border-hairline/80 bg-surface/80 text-ink shadow-sm transition-all hover:bg-surface hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-white/5"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FINGER_LABELS_TR,
  FINGER_MAP,
  KEYBOARD_GEOMETRY,
  fingerToHand,
  findKeyForChar,
  getLayoutMap,
  type Finger,
} from "@/lib/keyboard-layouts";
import type { TypingEngine } from "@/lib/typing-engine";
import type { KeyboardLayout } from "@/types";

interface KeyboardOverlayProps {
  engine: TypingEngine;
  layout: KeyboardLayout;
  active: boolean;
}

const FINGER_COLORS: Record<Finger, string> = {
  "left-pinky": "#a78bfa",
  "right-pinky": "#a78bfa",
  "left-ring": "#38bdf8",
  "right-ring": "#38bdf8",
  "left-middle": "#fbbf24",
  "right-middle": "#fbbf24",
  "left-index": "#34d399",
  "right-index": "#34d399",
  "left-thumb": "#94a3b8",
  "right-thumb": "#94a3b8",
};

const CONTROL_LABELS: Record<string, string> = {
  Backspace: "⌫",
  Tab: "Tab",
  CapsLock: "Caps",
  Enter: "Enter",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Ctrl",
  ControlRight: "Ctrl",
  AltLeft: "Alt",
  AltRight: "Alt",
  Space: "boşluk",
};

const KEY_UNIT_REM = 2.75;
const FLASH_MS = 150;

export function KeyboardOverlay({ engine, layout, active }: KeyboardOverlayProps) {
  const [opacity, setOpacity] = useState(0.85);
  const [docked, setDocked] = useState(true);
  const keyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastCaretRef = useRef(0);
  const highlightedRef = useRef<{ code: string; shiftCode?: string } | null>(null);
  const flashTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const layoutMap = useMemo(() => getLayoutMap(layout), [layout]);
  const rows = useMemo(() => {
    const byRow = new Map<number, typeof KEYBOARD_GEOMETRY>();
    for (const k of KEYBOARD_GEOMETRY) {
      const arr = byRow.get(k.row) ?? [];
      arr.push(k);
      byRow.set(k.row, arr);
    }
    return Array.from(byRow.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, keys]) => keys);
  }, []);

  function clearHighlight() {
    const prev = highlightedRef.current;
    if (!prev) return;
    keyRefs.current[prev.code]?.classList.remove("ring-2", "ring-blue-500");
    if (prev.shiftCode) keyRefs.current[prev.shiftCode]?.classList.remove("ring-2", "ring-blue-400/60");
    highlightedRef.current = null;
  }

  function updateNextKeyHighlight() {
    clearHighlight();
    const idx = engine.getCaretIndex();
    const expectedChar = engine.text[idx];
    if (expectedChar === undefined) return;
    const info = findKeyForChar(layout, expectedChar);
    if (!info) return;
    keyRefs.current[info.code]?.classList.add("ring-2", "ring-blue-500");
    let shiftCode: string | undefined;
    if (info.shifted) {
      const hand = fingerToHand(FINGER_MAP[info.code] ?? "right-index");
      shiftCode = hand === "left" ? "ShiftRight" : "ShiftLeft";
      keyRefs.current[shiftCode]?.classList.add("ring-2", "ring-blue-400/60");
    }
    highlightedRef.current = { code: info.code, shiftCode };
  }

  function flashKey(code: string, correct: boolean) {
    const el = keyRefs.current[code];
    if (!el) return;
    clearTimeout(flashTimeouts.current[code]);
    el.classList.remove("bg-emerald-400/70", "bg-red-400/70");
    el.classList.add(correct ? "bg-emerald-400/70" : "bg-red-400/70");
    flashTimeouts.current[code] = setTimeout(() => {
      el.classList.remove("bg-emerald-400/70", "bg-red-400/70");
    }, FLASH_MS);
  }

  useEffect(() => {
    if (!active) return;
    lastCaretRef.current = engine.getCaretIndex();
    updateNextKeyHighlight();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.code !== "Backspace") {
        const newCaret = engine.getCaretIndex();
        const flashIndex = newCaret > lastCaretRef.current ? lastCaretRef.current : newCaret;
        const state = engine.getCharStates()[flashIndex];
        if (state === "correct" || state === "incorrect") {
          flashKey(e.code, state === "correct");
        }
        lastCaretRef.current = newCaret;
      } else {
        lastCaretRef.current = engine.getCaretIndex();
      }
      updateNextKeyHighlight();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, engine, layout]);

  return (
    <div
      className={
        docked
          ? "w-full max-w-4xl"
          : "fixed bottom-6 right-6 z-20 max-w-[min(90vw,48rem)]"
      }
      style={{ opacity }}
    >
      <div className="rounded-3xl border border-neutral-200/70 bg-white/40 p-4 shadow-lg backdrop-blur-md dark:border-neutral-700/70 dark:bg-neutral-900/40">
        <div className="flex flex-col gap-1">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((k) => {
                const chars = layoutMap[k.code];
                const finger = FINGER_MAP[k.code];
                const label = chars ? chars.base : CONTROL_LABELS[k.code] ?? "";
                return (
                  <div
                    key={k.code}
                    ref={(el) => {
                      keyRefs.current[k.code] = el;
                    }}
                    style={{
                      width: `${k.width * KEY_UNIT_REM}rem`,
                      backgroundColor: finger ? `${FINGER_COLORS[finger]}22` : undefined,
                    }}
                    className="flex h-10 items-center justify-center rounded-lg border border-neutral-300/60 text-sm font-medium text-neutral-700 transition-colors duration-100 dark:border-neutral-600/60 dark:text-neutral-200"
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/60 pt-3 text-xs text-neutral-500 dark:border-neutral-700/60 dark:text-neutral-400">
          <div className="flex flex-wrap gap-3">
            {(Object.keys(FINGER_LABELS_TR) as Finger[])
              .filter((f) => f.startsWith("left"))
              .map((f) => (
                <span key={f} className="flex items-center gap-1">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: FINGER_COLORS[f] }}
                  />
                  {FINGER_LABELS_TR[f]}
                </span>
              ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              Opaklık
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="accent-blue-600"
              />
            </label>
            <button
              type="button"
              onClick={() => setDocked((d) => !d)}
              className="rounded-full bg-neutral-200/70 px-3 py-1 font-medium text-neutral-700 hover:bg-neutral-300/70 dark:bg-neutral-700/70 dark:text-neutral-200"
            >
              {docked ? "Yüzdür" : "Sabitle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

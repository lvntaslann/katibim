"use client";

import { useEffect, useState } from "react";

const HEADLINES = [
  "Sınava emin adımlarla hazırlanın",
  "Gerçek sınav temposunu yakalayın",
  "F ve Q'da hızınızı bulun",
  "Zabıt kâtipliğine özel çalışın",
];

const TYPE_MS = 38;
const DELETE_MS = 22;
const HOLD_MS = 1600;

/**
 * Types out a full headline sentence, holds, deletes, then moves to the
 * next — the whole sentence rotates (not just a fill-in segment) each
 * cycle. Skips the animation entirely under prefers-reduced-motion (see
 * AosInit.tsx for the same check elsewhere in this codebase) and just
 * shows the first headline, static.
 */
export function TypewriterHeadline() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const full = HEADLINES[index];

    if (phase === "typing") {
      if (text.length < full.length) {
        const id = setTimeout(() => setText(full.slice(0, text.length + 1)), TYPE_MS);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("holding"), HOLD_MS);
      return () => clearTimeout(id);
    }

    if (phase === "holding") {
      const id = setTimeout(() => setPhase("deleting"), HOLD_MS);
      return () => clearTimeout(id);
    }

    // deleting
    if (text.length > 0) {
      const id = setTimeout(() => setText(full.slice(0, text.length - 1)), DELETE_MS);
      return () => clearTimeout(id);
    }
    setIndex((i) => (i + 1) % HEADLINES.length);
    setPhase("typing");
  }, [reducedMotion, text, phase, index]);

  const display = reducedMotion ? HEADLINES[0] : text;

  return (
    <span className="relative grid w-full place-items-center">
      {/* Invisible longest text to reserve exact layout height and prevent jumping */}
      <span className="invisible col-start-1 row-start-1 w-full" aria-hidden="true">
        {HEADLINES[0]}
      </span>
      <span className="col-start-1 row-start-1 w-full text-center">
        {display}
        {!reducedMotion && <span className="typewriter-cursor ml-0.5 inline-block text-accent">|</span>}
      </span>
    </span>
  );
}

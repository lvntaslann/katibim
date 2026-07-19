"use client";

import { useEffect } from "react";

export function AosInit() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("aos").then(({ default: AOS }) => {
      AOS.init({ duration: 600, once: true, disable: reducedMotion });
    });
  }, []);
  return null;
}

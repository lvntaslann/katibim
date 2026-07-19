"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ResultsRevealProps {
  children: React.ReactNode;
  /** Re-run the reveal whenever this changes (e.g. session id). */
  revealKey: string;
}

/**
 * Staggers the results page's badge/stat cards in on mount via GSAP, as
 * specified for the "results-reveal timeline". Skips animation entirely
 * under prefers-reduced-motion.
 */
export function ResultsReveal({ children, revealKey }: ResultsRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = el.querySelectorAll("[data-reveal]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 16, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }
      );
    }, el);

    return () => ctx.revert();
  }, [revealKey]);

  return (
    <div ref={containerRef} className="contents">
      {children}
    </div>
  );
}

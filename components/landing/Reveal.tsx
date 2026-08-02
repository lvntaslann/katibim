"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export interface RevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** Accepted for call-site compatibility; continuous scroll-linking makes
   * an explicit stagger unnecessary — each element's own position in the
   * document already staggers it naturally. */
  delay?: number;
}

/**
 * Scroll-linked reveal: opacity/translate are driven continuously by the
 * element's own scroll position (not a binary "in view" trigger), so
 * content scrubs in smoothly as the user scrolls instead of popping in at
 * a fixed threshold — the same continuity language as HeroScrollStage,
 * applied to the rest of the page.
 */
export function Reveal({ children, delay: _delay, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [28, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} {...props}>
      {children}
    </motion.div>
  );
}

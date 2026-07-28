"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  glowOnHover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={glowOnHover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`relative overflow-hidden rounded-2xl border border-hairline/80 bg-surface/75 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#1c1b19]/75 dark:shadow-black/40 ${
        glowOnHover
          ? "hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(79,189,179,0.12)] dark:hover:border-accent-strong/40 dark:hover:shadow-[0_8px_30px_rgba(126,212,203,0.12)]"
          : ""
      } ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/5 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-accent-strong/5" />
      {children}
    </motion.div>
  );
}

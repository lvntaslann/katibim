"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export interface KineticCounterProps {
  value: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function KineticCounter({
  value,
  decimals = 0,
  className = "",
  suffix = "",
  prefix = "",
}: KineticCounterProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Spring animation physics from Stitch Design Taste
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 15,
    mass: 1,
  });

  const displayValue = useTransform(springValue, (current) => {
    return current.toFixed(decimals);
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  if (!isClient) {
    return (
      <span className={className}>
        {prefix}{value.toFixed(decimals)}{suffix}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-mono font-bold tracking-tight ${className}`}>
      {prefix && <span>{prefix}</span>}
      <motion.span>{displayValue}</motion.span>
      {suffix && <span className="ml-0.5 text-xs font-normal text-ink-muted">{suffix}</span>}
    </span>
  );
}

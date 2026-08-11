"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Logo({ size = "md" }: { size?: "md" | "sm" }) {
  const textClass = size === "sm" ? "text-xl" : "text-2xl sm:text-3xl";
  // logo.png's real aspect ratio is 624x852 (taller than wide) — sizing by
  // height + w-auto keeps that ratio instead of squashing it into a square
  // box. Height is CSS-driven so it can keep growing at the lg breakpoint.
  const iconClass = size === "sm" ? "h-8 w-auto" : "h-9 w-auto lg:h-12";

  const [displayText, setDisplayText] = useState("");
  const fullText = "Katibim";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(fullText);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 60); // fast and punchy

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/"
      onClick={() => {
        if (window.location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="group inline-flex items-center gap-2 font-display font-semibold tracking-tight text-ink"
    >
      <Image src="/logo.png" alt="" width={624} height={852} className={`shrink-0 ${iconClass}`} priority />
      <span className={`inline-flex items-center ${textClass}`}>
        <span className="relative flex items-center">
          {/* Invisible placeholder reserves the exact width for text + cursor to prevent layout shift */}
          <span className="invisible flex items-center" aria-hidden="true">
            <span>{fullText}</span>
            <span className="ml-1 inline-block h-[1em] w-[0.15em]" />
          </span>
          {/* The actual typing text and the cursor that follows it */}
          <span className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap">
            <span>{displayText}</span>
            <span
              aria-hidden
              className="typewriter-cursor ml-1 inline-block h-[1em] w-[0.15em] bg-accent dark:bg-accent-strong shrink-0"
            />
          </span>
        </span>
      </span>
    </Link>
  );
}

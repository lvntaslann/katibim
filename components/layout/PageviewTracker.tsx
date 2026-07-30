"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/layout/AuthProvider";
import { flushPageDuration, trackPageview } from "@/lib/tracking/track";

/** Skip tracking the operator's own visits so they don't pollute the data. */
const SKIP_PREFIXES = ["/insights"];

export function PageviewTracker() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const isOperator = profile?.role === "admin";

  useEffect(() => {
    if (isOperator || SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;
    trackPageview(pathname, user?.id ?? null);
  }, [pathname, user?.id, isOperator]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushPageDuration();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", flushPageDuration);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", flushPageDuration);
    };
  }, []);

  return null;
}

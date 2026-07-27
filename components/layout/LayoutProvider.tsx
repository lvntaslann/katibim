"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout } from "@/types";

interface LayoutContextValue {
  layout: KeyboardLayout;
  setLayout: (newLayout: KeyboardLayout) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

const COOKIE_KEY = "katibim:layout";
const LS_LAYOUT_KEY = "katibim:layout";

function sanitizeLayout(val: unknown): KeyboardLayout {
  return val === "Q" ? "Q" : "F";
}

function persistLayout(rawLayout: unknown) {
  if (typeof window === "undefined") return;
  const safeLayout = sanitizeLayout(rawLayout);
  try {
    window.localStorage.setItem(LS_LAYOUT_KEY, safeLayout);
  } catch {}
  try {
    const isSecure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_KEY}=${safeLayout}; path=/; max-age=31536000; SameSite=Lax${isSecure}`;
  } catch {}
}

export function LayoutProvider({
  children,
  initialLayout = "F",
}: {
  children: React.ReactNode;
  initialLayout?: KeyboardLayout;
}) {
  const [layout, setLayoutState] = useState<KeyboardLayout>(() => sanitizeLayout(initialLayout));

  // Keep repository (IndexedDB / backend settings) in sync on client mount
  useEffect(() => {
    let cancelled = false;
    getRepository()
      .getSettings()
      .then((settings) => {
        if (!cancelled && settings && settings.defaultLayout) {
          const safeLayout = sanitizeLayout(settings.defaultLayout);
          if (safeLayout !== layout) {
            setLayoutState(safeLayout);
            persistLayout(safeLayout);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [layout]);

  const setLayout = useCallback((newLayout: KeyboardLayout) => {
    const safeLayout = sanitizeLayout(newLayout);
    setLayoutState(safeLayout);
    persistLayout(safeLayout);

    getRepository()
      .getSettings()
      .then((settings) => {
        return getRepository().saveSettings({ ...settings, defaultLayout: safeLayout });
      })
      .catch(() => {});
  }, []);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(fallback: KeyboardLayout = "F") {
  const context = useContext(LayoutContext);
  if (!context) {
    const [layout, setLayoutState] = useState<KeyboardLayout>(() => sanitizeLayout(fallback));
    const setLayout = useCallback((newLayout: KeyboardLayout) => {
      const safeLayout = sanitizeLayout(newLayout);
      setLayoutState(safeLayout);
      persistLayout(safeLayout);
    }, []);
    return [layout, setLayout] as const;
  }
  return [context.layout, context.setLayout] as const;
}

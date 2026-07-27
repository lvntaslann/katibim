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

function persistLayout(layout: KeyboardLayout) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_LAYOUT_KEY, layout);
  } catch {}
  try {
    document.cookie = `${COOKIE_KEY}=${layout}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
}

export function LayoutProvider({
  children,
  initialLayout = "F",
}: {
  children: React.ReactNode;
  initialLayout?: KeyboardLayout;
}) {
  const [layout, setLayoutState] = useState<KeyboardLayout>(initialLayout);

  // Keep repository (IndexedDB / backend settings) in sync on client mount
  useEffect(() => {
    let cancelled = false;
    getRepository()
      .getSettings()
      .then((settings) => {
        if (!cancelled && settings && settings.defaultLayout) {
          if (settings.defaultLayout !== layout) {
            setLayoutState(settings.defaultLayout);
            persistLayout(settings.defaultLayout);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [layout]);

  const setLayout = useCallback((newLayout: KeyboardLayout) => {
    setLayoutState(newLayout);
    persistLayout(newLayout);

    getRepository()
      .getSettings()
      .then((settings) => {
        return getRepository().saveSettings({ ...settings, defaultLayout: newLayout });
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
    const [layout, setLayoutState] = useState<KeyboardLayout>(fallback);
    const setLayout = useCallback((newLayout: KeyboardLayout) => {
      setLayoutState(newLayout);
      persistLayout(newLayout);
    }, []);
    return [layout, setLayout] as const;
  }
  return [context.layout, context.setLayout] as const;
}

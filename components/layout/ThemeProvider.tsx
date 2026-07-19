"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Thin re-export so app/layout.tsx (a server component) can render a
 * client-only provider. attribute="class" toggles Tailwind's `.dark`
 * selector (see the @custom-variant in app/globals.css); next-themes
 * injects its own blocking pre-hydration script so the correct theme
 * applies before first paint — no manual anti-flash script needed.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}

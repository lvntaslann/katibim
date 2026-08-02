import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import { cookies } from "next/headers";
import "aos/dist/aos.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AosInit } from "@/components/layout/AosInit";
import { PageTransition } from "@/components/layout/PageTransition";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutProvider } from "@/components/layout/LayoutProvider";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { ClaimAnonymousBanner } from "@/components/layout/ClaimAnonymousBanner";
import { PageviewTracker } from "@/components/layout/PageviewTracker";
import { createClient } from "@/utils/supabase/server";
import type { KeyboardLayout } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
});

// Display face for the landing page's hero/section headings only — never
// used on app surfaces (typing/exam/dashboard) or in Navbar/Footer, see
// docs/design-system.md's "two registers".
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Katibim — Kamu Kâtiplik Sınavı Hazırlık Platformu",
  description:
    "Zabıt kâtibi, icra kâtibi ve diğer kamu kâtiplik sınavlarına F ve Q klavye ile hazırlanın: uygulamalı sınav simülasyonu, ders sistemi ve detaylı klavye analitiği.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("katibim:layout")?.value;
  const initialLayout: KeyboardLayout = rawCookie === "Q" ? "Q" : "F";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safeUser = user
    ? {
        id: user.id,
        email: user.email,
        user_metadata: {
          display_name: user.user_metadata?.display_name,
          full_name: user.user_metadata?.full_name,
          name: user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
          picture: user.user_metadata?.picture,
        },
        app_metadata: {},
        aud: user.aud,
        created_at: user.created_at,
      }
    : null;

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${bricolageGrotesque.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-base text-ink">
        <ThemeProvider>
          <LayoutProvider initialLayout={initialLayout}>
            <AuthProvider initialUser={safeUser as any}>
              <AosInit />
              <PageviewTracker />
              <Navbar />
              <ClaimAnonymousBanner />
              <PageTransition>{children}</PageTransition>
              <Footer />
            </AuthProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

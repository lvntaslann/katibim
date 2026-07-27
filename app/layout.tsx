import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "aos/dist/aos.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AosInit } from "@/components/layout/AosInit";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutProvider } from "@/components/layout/LayoutProvider";
import type { KeyboardLayout } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
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

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-base text-ink">
        <ThemeProvider>
          <LayoutProvider initialLayout={initialLayout}>
            <AosInit />
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "aos/dist/aos.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AosInit } from "@/components/layout/AosInit";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-base text-ink">
        <ThemeProvider>
          <AosInit />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

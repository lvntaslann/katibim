import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "aos/dist/aos.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AosInit } from "@/components/layout/AosInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <AosInit />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

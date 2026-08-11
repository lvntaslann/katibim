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
import { NavigationLoader } from "@/components/layout/NavigationLoader";
import { JsonLd } from "@/components/seo/JsonLd";
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

const SITE_URL = "https://katibim.bbclub.space";
const SITE_NAME = "Katibim";
const SITE_DESCRIPTION =
  "Zabıt kâtibi, icra kâtibi ve diğer kamu kâtiplik sınavlarına F ve Q klavye ile hazırlanın: uygulamalı sınav simülasyonu, adım adım on parmak dersleri, hız testi ve detaylı klavye analitiği.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Katibim — Kamu Kâtiplik Sınavı Hazırlık Platformu",
    template: "%s | Katibim",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "katibim",
    "zabıt katibi sınavı",
    "katiplik sınavı hazırlık",
    "icra katibi sınavı",
    "klavye hız testi",
    "on parmak klavye dersi",
    "F klavye antrenman",
    "Q klavye antrenman",
    "sınav simülasyonu",
    "kamu personeli alımı",
    "klavye pratik",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Katibim — Kamu Kâtiplik Sınavı Hazırlık Platformu",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Katibim Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katibim — Kamu Kâtiplik Sınavı Hazırlık Platformu",
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "education",
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            description: SITE_DESCRIPTION,
            sameAs: [],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "tr",
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: SITE_NAME,
            url: SITE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "All",
            description: SITE_DESCRIPTION,
            inLanguage: "tr",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "TRY",
            },
          }}
        />
        <ThemeProvider>
          <LayoutProvider initialLayout={initialLayout}>
            <AuthProvider initialUser={safeUser as any}>
              <AosInit />
              <PageviewTracker />
              <Navbar />
              <ClaimAnonymousBanner />
              <NavigationLoader />
              <PageTransition>{children}</PageTransition>
              <Footer />
            </AuthProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

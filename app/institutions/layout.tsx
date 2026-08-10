import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurumlar — Kâtiplik Alımı Yapan Kamu Kurumları",
  description:
    "Zabıt kâtibi, icra kâtibi ve büro personeli alımı yapan tüm kamu kurumlarını inceleyin. Adalet Bakanlığı, yüksek yargı organları, üniversiteler, belediyeler ve KİT'lerin sınav detayları ve gereklilikleri.",
  openGraph: {
    title: "Kurumlar — Kâtiplik Alımı Yapan Kamu Kurumları | Katibim",
    description:
      "Zabıt kâtibi ve icra kâtibi alımı yapan tüm kamu kurumlarını inceleyin. Sınav detayları ve gereklilikler.",
    url: "https://katibim.com/institutions",
  },
  alternates: {
    canonical: "/institutions",
  },
};

export default function InstitutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

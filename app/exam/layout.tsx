import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sınav Simülasyonu — Gerçekçi Kâtiplik Denemesi",
  description:
    "Adalet Bakanlığı, yüksek yargı ve diğer kurumların kâtiplik sınavlarını birebir simüle edin. Gerçek sınav koşullarında F ve Q klavye ile pratik yapın, net hızınızı ve doğruluğunuzu ölçün.",
  openGraph: {
    title: "Sınav Simülasyonu — Gerçekçi Kâtiplik Denemesi | Katibim",
    description:
      "Adalet Bakanlığı ve diğer kurumların kâtiplik sınavlarını birebir simüle edin. Gerçek sınav koşullarında pratik yapın.",
    url: "https://katibim.bbclub.space/exam",
  },
  alternates: {
    canonical: "/exam",
  },
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: "Kâtiplik Sınav Simülasyonu",
          description:
            "Kamu kâtiplik sınavlarını birebir simüle eden online deneme sınavı. F ve Q klavye desteği, gerçek sınav süreleri ve kuralları.",
          educationalLevel: "Professional",
          inLanguage: "tr",
          provider: {
            "@type": "Organization",
            name: "Katibim",
            url: "https://katibim.bbclub.space",
          },
        }}
      />
      {children}
    </>
  );
}

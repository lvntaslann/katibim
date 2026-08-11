import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "On Parmak Klavye Dersleri — F ve Q Klavye Eğitimi",
  description:
    "Sıfırdan on parmak klavye öğrenin. F klavye ve Q klavye için adım adım yapılandırılmış derslerle kâtiplik sınavına hazırlanın. Her derste hedef tuşlar, alıştırmalar ve ilerleme takibi.",
  openGraph: {
    title: "On Parmak Klavye Dersleri — F ve Q Klavye Eğitimi | Katibim",
    description:
      "Sıfırdan on parmak klavye öğrenin. F ve Q klavye için adım adım yapılandırılmış derslerle kâtiplik sınavına hazırlanın.",
    url: "https://katibim.bbclub.space/lessons",
  },
  alternates: {
    canonical: "/lessons",
  },
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "On Parmak Klavye Dersleri",
          description:
            "F klavye ve Q klavye için sıfırdan ileri seviyeye yapılandırılmış on parmak klavye eğitim programı. Kamu kâtiplik sınavlarına hazırlık odaklı.",
          provider: {
            "@type": "Organization",
            name: "Katibim",
            url: "https://katibim.bbclub.space",
          },
          inLanguage: "tr",
          isAccessibleForFree: true,
          educationalLevel: "Beginner",
          teaches: "On parmak klavye kullanımı, F klavye, Q klavye",
        }}
      />
      {children}
    </>
  );
}

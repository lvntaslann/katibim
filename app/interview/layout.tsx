import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mülakat Hazırlık — Kâtiplik Sözlü Sınav Rehberi",
  description:
    "Kamu kâtiplik mülakatına hazırlanın. Değerlendirme kriterleri, örnek mülakat soruları ve cevap stratejileri. Zabıt kâtibi, icra kâtibi ve büro personeli sözlü sınav rehberi.",
  openGraph: {
    title: "Mülakat Hazırlık — Kâtiplik Sözlü Sınav Rehberi | Katibim",
    description:
      "Kamu kâtiplik mülakatına hazırlanın. Değerlendirme kriterleri, örnek sorular ve cevap stratejileri.",
    url: "https://katibim.com/interview",
  },
  alternates: {
    canonical: "/interview",
  },
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}

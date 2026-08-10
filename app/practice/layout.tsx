import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Antrenman — Klavye Pratik Modülü",
  description:
    "F ve Q klavye ile on parmak antrenman yapın. Genel, hukuki ve resmî yazışma metinleriyle pratik yaparak kâtiplik sınavına hazırlanın. Serbest mod ve süreli antrenman seçenekleri.",
  openGraph: {
    title: "Antrenman — Klavye Pratik Modülü | Katibim",
    description:
      "F ve Q klavye ile on parmak antrenman yapın. Genel, hukuki ve resmî yazışma metinleriyle pratik yaparak kâtiplik sınavına hazırlanın.",
    url: "https://katibim.com/practice",
  },
  alternates: {
    canonical: "/practice",
  },
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel — Klavye Analitik ve İlerleme",
  description:
    "Kişisel klavye analitiğinizi görün: tuş bazlı doğruluk oranları, parmak yük dağılımı, hız grafiği ve zayıf tuş analizi. Kâtiplik sınavı hazırlığınızı veriyle takip edin.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

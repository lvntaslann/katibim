import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description:
    "Katibim'e ücretsiz kayıt olun. Kâtiplik sınavı hazırlığınızı kişiselleştirin, ilerlemenizi kaydedin, liderlik tablosunda yerinizi alın ve tüm cihazlarınızdan erişin.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

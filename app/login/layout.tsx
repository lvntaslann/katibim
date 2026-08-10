import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description:
    "Katibim hesabınıza giriş yapın. Kâtiplik sınavı hazırlık ilerlemenizi takip edin, liderlik tablosunda yerinizi görün ve tüm cihazlarınızda senkronize çalışın.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

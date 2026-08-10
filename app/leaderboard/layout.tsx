import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liderlik Tablosu — En Hızlı Yazanlar",
  description:
    "Katibim kullanıcıları arasında en yüksek net WPM (dakikada kelime) skorlarını görün. Hız testi, sınav simülasyonu ve antrenman modlarında F ve Q klavye sıralaması.",
  openGraph: {
    title: "Liderlik Tablosu — En Hızlı Yazanlar | Katibim",
    description:
      "Katibim kullanıcıları arasında en yüksek net WPM skorlarını görün. Hız testi, sınav ve antrenman sıralaması.",
    url: "https://katibim.com/leaderboard",
  },
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klavye Hız Testi — Dakikada Kaç Kelime Yazıyorsunuz?",
  description:
    "10 parmak klavye hız testinizi yapın ve dakikada kaç kelime (WPM) yazdığınızı öğrenin. F ve Q klavye desteği ile net hızınızı ölçün, liderlik tablosunda yerinizi görün.",
  openGraph: {
    title: "Klavye Hız Testi — Dakikada Kaç Kelime Yazıyorsunuz? | Katibim",
    description:
      "10 parmak klavye hız testinizi yapın ve WPM skorunuzu öğrenin. F ve Q klavye desteği.",
    url: "https://katibim.bbclub.space/speed-test",
  },
  alternates: {
    canonical: "/speed-test",
  },
};

export default function SpeedTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}

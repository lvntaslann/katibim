import { Hero } from "@/components/landing/Hero";
import { TrustBanner } from "@/components/landing/TrustBanner";
import { FeatureList } from "@/components/landing/FeatureList";
import { AccountBenefits } from "@/components/landing/AccountBenefits";
import { ModuleCards } from "@/components/landing/ModuleCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <TrustBanner />
      <FeatureList />
      <AccountBenefits />
      <ModuleCards />
      <HowItWorks />
      <Faq />
      <FinalCta />
    </main>
  );
}

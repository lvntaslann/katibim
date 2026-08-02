import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TypewriterHeadline } from "@/components/layout/TypewriterHeadline";
import { HeroScrollStage } from "@/components/landing/HeroScrollStage";
import { HeroStats } from "@/components/landing/HeroStats";

export function Hero() {
  return (
    <HeroScrollStage>
      <div className="flex flex-col items-center gap-5">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase dark:text-accent-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Kamu Kâtiplik Sınavlarına Hazırlık
          </span>

          <h1 className="mt-3 flex min-h-[6.5rem] items-center justify-center font-display text-4xl leading-[1.1] font-medium tracking-tight text-ink sm:min-h-[9.5rem] sm:text-6xl lg:text-7xl">
            <TypewriterHeadline />
          </h1>
        </div>

        <p className="max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
          F ve Q klavyede gerçekçi sınav simülasyonu ve adım adım on parmak dersleri.
        </p>

        <div className="mt-1 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/exam"
            className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-base transition-colors hover:bg-accent-strong"
          >
            Sınav Simülasyonunu Deneyin
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/lessons"
            className="text-sm font-medium text-ink-muted underline decoration-hairline underline-offset-4 transition hover:text-accent hover:decoration-accent"
          >
            ya da derslerle sıfırdan on parmak öğrenin
          </Link>
        </div>

        <HeroStats />
      </div>
    </HeroScrollStage>
  );
}

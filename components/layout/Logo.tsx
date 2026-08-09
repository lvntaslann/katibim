import Image from "next/image";
import Link from "next/link";

export function Logo({ size = "md" }: { size?: "md" | "sm" }) {
  const text = size === "sm" ? "text-xl" : "text-2xl sm:text-3xl";
  // logo.png's real aspect ratio is 624x852 (taller than wide) — sizing by
  // height + w-auto keeps that ratio instead of squashing it into a square
  // box. Height is CSS-driven so it can keep growing at the lg breakpoint.
  const iconClass = size === "sm" ? "h-8 w-auto" : "h-9 w-auto lg:h-12";

  return (
    <Link href="/" className="group inline-flex items-center gap-2 font-display font-semibold tracking-tight text-ink">
      <Image src="/logo.png" alt="" width={624} height={852} className={`shrink-0 ${iconClass}`} priority />
      <span className="inline-flex items-baseline">
        <span className={text}>Katibim</span>
        <span
          aria-hidden
          className="typewriter-cursor ml-1 inline-block h-[0.85em] w-[0.15em] translate-y-[0.08em] bg-accent dark:bg-accent-strong"
        />
      </span>
    </Link>
  );
}

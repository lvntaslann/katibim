import Link from "next/link";

export function Logo({ size = "md" }: { size?: "md" | "sm" }) {
  const text = size === "sm" ? "text-xl" : "text-2xl sm:text-3xl";

  return (
    <Link href="/" className="group inline-flex items-center font-display font-semibold tracking-tight text-ink">
      <span className={text}>Katibim</span>
      <span
        aria-hidden
        className="typewriter-cursor ml-0.5 inline-block h-[0.7em] w-[0.1em] translate-y-[0.05em] bg-accent dark:bg-accent-strong"
      />
    </Link>
  );
}

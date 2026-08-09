/** Returns an internal path only; untrusted values always fall back to `/`. */
export function safeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) return "/";

  try {
    const decoded = decodeURIComponent(value);
    // A second slash or backslash can be interpreted as a scheme-relative URL
    // by browsers and routers after normalization.
    if (
      value.startsWith("//") ||
      value.startsWith("/\\") ||
      decoded.startsWith("//") ||
      decoded.startsWith("/\\")
    ) {
      return "/";
    }

    const base = "https://katibim.invalid";
    const target = new URL(value, base);
    if (target.origin !== base) return "/";

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

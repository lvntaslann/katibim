import type { KeyboardLayout } from "@/types";
import { F_KLAVYE } from "./f-klavye";
import { Q_KLAVYE } from "./q-klavye";
import type { LayoutKeyMap } from "./types";

export * from "./types";
export * from "./finger-map";
export * from "./geometry";
export { F_KLAVYE } from "./f-klavye";
export { Q_KLAVYE } from "./q-klavye";

export function getLayoutMap(layout: KeyboardLayout): LayoutKeyMap {
  return layout === "F" ? F_KLAVYE : Q_KLAVYE;
}

/** Find the physical key (event.code) that produces a given character on a layout. */
export function findKeyForChar(
  layout: KeyboardLayout,
  char: string
): { code: string; shifted: boolean } | undefined {
  const map = getLayoutMap(layout);
  for (const code in map) {
    const chars = map[code];
    if (chars.base === char) return { code, shifted: false };
    if (chars.shift === char) return { code, shifted: true };
  }
  return undefined;
}

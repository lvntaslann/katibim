import { getLayoutMap } from "@/lib/keyboard-layouts";
import type { KeyStat, KeyboardLayout, PracticeText } from "@/types";
import { toKeyStatRows } from "./keystat-helpers";

const VOWELS_TR = ["a", "e", "i", "ı", "o", "ö", "u", "ü"];
const LETTER_RE = /^[a-zçğıöşü]$/i;

/**
 * Builds a synthetic drill text that over-samples the user's worst keys
 * (highest error-rate × latency), alternating them with vowels to keep the
 * result pronounceable/typable rather than random noise.
 */
export function generateWeaknessDrill(
  keyStats: KeyStat[],
  layout: KeyboardLayout,
  options?: { wordCount?: number }
): PracticeText {
  const layoutMap = getLayoutMap(layout);
  const rows = toKeyStatRows(keyStats, layout)
    .filter((r) => LETTER_RE.test(r.label))
    .sort((a, b) => b.errorRate * b.avgLatencyMs - a.errorRate * a.avgLatencyMs)
    .slice(0, 8);

  const worstChars = rows.map((r) => r.label);
  const chars = worstChars.length > 0 ? worstChars : Object.values(layoutMap).slice(0, 6).map((c) => c.base);

  const wordCount = options?.wordCount ?? 40;
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const len = 3 + (i % 3);
    let word = "";
    for (let j = 0; j < len; j++) {
      word += j % 2 === 0 ? chars[(i + j) % chars.length] : VOWELS_TR[(i + j) % VOWELS_TR.length];
    }
    words.push(word);
  }

  return {
    id: `drill-${Date.now()}`,
    category: "genel",
    difficulty: "orta",
    title: "Zayıf Tuşlar Alıştırması",
    body: words.join(" ") + ".",
    generated: true,
  };
}

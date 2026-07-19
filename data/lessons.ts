import type { Lesson, LessonStep, KeyboardLayout } from "@/types";
import { getLayoutMap } from "@/lib/keyboard-layouts";
import { PRACTICE_TEXTS } from "./practice-texts";

/**
 * Lesson curriculum, generated from the verified layout maps in
 * lib/keyboard-layouts so drill text can never reference a character the
 * learner hasn't been introduced to yet. 5 levels × 4 steps = 20 steps per
 * layout, matching prompt.md's progressive letter-pair -> syllable -> word
 * -> sentence/paragraph structure. Add a new track by appending to
 * LESSONS_BY_LAYOUT below; see README.md.
 */

const LEVEL_KEYS: Record<number, string[]> = {
  1: ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  2: ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  3: ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"],
  4: ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"],
  5: ["Backslash", "BracketLeft", "BracketRight", "Semicolon", "Quote", "KeyI", "Comma", "Period"],
};

const LEVEL_TITLES: Record<number, string> = {
  1: "Esas Sıra (Ana Satır)",
  2: "Üst Sıra",
  3: "Alt Sıra",
  4: "Sayılar ve Noktalama",
  5: "Türkçe Karakterler ve Paragraflar",
};

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "Parmaklarınızı ana satırdan (esas sıra) kaldırmadan bu tuşları tanıyın.",
  2: "Üst sıradaki tuşlara işaret parmaklarınızı esas sıradan uzatarak ulaşın.",
  3: "Alt sıradaki tuşlar için parmaklarınızı esas sıradan aşağı indirin.",
  4: "Sayı ve noktalama tuşlarına göz teması kurmadan ulaşmayı pratik edin.",
  5: "Öğrendiğiniz tüm tuşları Türkçe karakterler ve tam paragraflarla pekiştirin.",
};

const VOWELS_TR = ["a", "e", "i", "ı", "o", "ö", "u", "ü"];

function charsForLevel(layout: KeyboardLayout, level: number): string[] {
  const map = getLayoutMap(layout);
  const seen = new Set<string>();
  const chars: string[] = [];
  for (const code of LEVEL_KEYS[level]) {
    const c = map[code]?.base;
    if (c && c !== " " && !seen.has(c)) {
      seen.add(c);
      chars.push(c);
    }
  }
  return chars;
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function buildHarfCiftiPrompt(chars: string[]): string {
  const pairs: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = pick(chars, i);
    const b = pick(chars, i + 1);
    pairs.push(a + b, b + a);
  }
  return pairs.join(" ");
}

function buildHeceToken(chars: string[], vowels: string[], seed: number): string {
  if (vowels.length === 0) {
    return pick(chars, seed) + pick(chars, seed + 1) + pick(chars, seed + 2);
  }
  return pick(chars, seed) + pick(vowels, seed) + pick(chars, seed + 1);
}

function buildHecePrompt(chars: string[], vowels: string[]): string {
  return Array.from({ length: 8 }, (_, i) => buildHeceToken(chars, vowels, i)).join(" ");
}

function buildKelimePrompt(chars: string[], vowels: string[]): string {
  return Array.from({ length: 6 }, (_, i) =>
    buildHeceToken(chars, vowels, i) + buildHeceToken(chars, vowels, i + 3)
  ).join(" ");
}

function buildCumlePrompt(chars: string[], vowels: string[]): string {
  const words = Array.from(
    { length: 5 },
    (_, i) => buildHeceToken(chars, vowels, i * 2) + buildHeceToken(chars, vowels, i * 2 + 1)
  );
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function buildLevel(layout: KeyboardLayout, level: number): Lesson {
  const chars = charsForLevel(layout, level);
  const vowels = chars.filter((c) => VOWELS_TR.includes(c));

  const steps: LessonStep[] = [
    { id: `${layout}-${level}-1`, kind: "harf-cifti", prompt: buildHarfCiftiPrompt(chars), minAccuracy: 75 },
    { id: `${layout}-${level}-2`, kind: "hece", prompt: buildHecePrompt(chars, vowels), minAccuracy: 80 },
    { id: `${layout}-${level}-3`, kind: "kelime", prompt: buildKelimePrompt(chars, vowels), minAccuracy: 85 },
    level === 5
      ? {
          id: `${layout}-${level}-4`,
          kind: "paragraf",
          prompt: PRACTICE_TEXTS.find((t) => t.category === "hukuki")?.body ?? buildCumlePrompt(chars, vowels),
          minAccuracy: 90,
        }
      : { id: `${layout}-${level}-4`, kind: "cumle", prompt: buildCumlePrompt(chars, vowels), minAccuracy: 90 },
  ];

  return {
    id: `${layout}-level-${level}`,
    layout,
    level: level as Lesson["level"],
    title: LEVEL_TITLES[level],
    description: LEVEL_DESCRIPTIONS[level],
    targetKeys: LEVEL_KEYS[level],
    steps,
    order: level,
  };
}

function buildTrack(layout: KeyboardLayout): Lesson[] {
  return [1, 2, 3, 4, 5].map((level) => buildLevel(layout, level));
}

export const LESSONS: Lesson[] = [...buildTrack("F"), ...buildTrack("Q")];

export function getLessonsForLayout(layout: KeyboardLayout): Lesson[] {
  return LESSONS.filter((l) => l.layout === layout).sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

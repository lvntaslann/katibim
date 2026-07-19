/** Turkish typing-exam scoring convention: 1 kelime = 5 karakter (boşluk dahil). */
export const CHARS_PER_WORD = 5;

export interface ScoringInput {
  correctChars: number;
  incorrectChars: number;
  errorCount: number;
  elapsedMs: number;
  /** Net puan hesaplamasında hata başına düşülen kelime katsayısı. */
  penaltyPerError: number;
}

export interface ScoringResult {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
}

/** Brüt hız: (doğru+yanlış karakter) / 5 karakter, dakika başına. */
export function computeGrossWpm(totalChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return totalChars / CHARS_PER_WORD / minutes;
}

export function computeAccuracy(correctChars: number, incorrectChars: number): number {
  const total = correctChars + incorrectChars;
  if (total === 0) return 100;
  return (correctChars / total) * 100;
}

export function computeNetWpm(grossWpm: number, errorCount: number, penaltyPerError: number): number {
  return Math.max(0, grossWpm - errorCount * penaltyPerError);
}

export function computeScoring(input: ScoringInput): ScoringResult {
  const totalChars = input.correctChars + input.incorrectChars;
  const grossWpm = computeGrossWpm(totalChars, input.elapsedMs);
  return {
    grossWpm,
    netWpm: computeNetWpm(grossWpm, input.errorCount, input.penaltyPerError),
    accuracy: computeAccuracy(input.correctChars, input.incorrectChars),
  };
}

import type { KeyEvent } from "@/types";
import { computeAccuracy, computeGrossWpm } from "@/lib/scoring";

export interface SpeedPoint {
  tSec: number;
  grossWpm: number;
  accuracy: number;
}

/** Buckets a session's key events into fixed windows for a speed-over-time chart. */
export function computeSpeedSeries(keyEvents: KeyEvent[], bucketMs = 5000): SpeedPoint[] {
  if (keyEvents.length === 0) return [];
  const maxT = keyEvents[keyEvents.length - 1].t;
  const bucketCount = Math.max(1, Math.ceil(maxT / bucketMs));
  const points: SpeedPoint[] = [];

  let correctSoFar = 0;
  let incorrectSoFar = 0;
  let eventIdx = 0;

  for (let b = 1; b <= bucketCount; b++) {
    const bucketEnd = b * bucketMs;
    while (eventIdx < keyEvents.length && keyEvents[eventIdx].t <= bucketEnd) {
      if (keyEvents[eventIdx].correct) correctSoFar += 1;
      else incorrectSoFar += 1;
      eventIdx += 1;
    }
    points.push({
      tSec: bucketEnd / 1000,
      grossWpm: computeGrossWpm(correctSoFar + incorrectSoFar, bucketEnd),
      accuracy: computeAccuracy(correctSoFar, incorrectSoFar),
    });
  }

  return points;
}

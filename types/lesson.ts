import type { KeyboardLayout } from "./institution";

export type LessonStepKind = "harf-cifti" | "hece" | "kelime" | "cumle" | "paragraf";

export interface LessonStep {
  id: string;
  kind: LessonStepKind;
  /** The text the learner must type for this step. */
  prompt: string;
  /** Minimum accuracy % required to consider this step passed. */
  minAccuracy: number;
}

export interface Lesson {
  id: string;
  layout: KeyboardLayout;
  /** 1 = esas sıra (home row) ... 5 = full paragraphs / Turkish-specific chars. */
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  /** Physical keys (event.code) this lesson focuses on. */
  targetKeys: string[];
  steps: LessonStep[];
  /** Order within its layout track, used for sequential unlocking. */
  order: number;
}

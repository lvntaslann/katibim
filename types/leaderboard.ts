import type { KeyboardLayout } from "./institution";
import type { SessionMode } from "./session";

export type LeaderboardMode = Extract<SessionMode, "exam" | "practice" | "lesson" | "speed-test">;

export interface LeaderboardRow {
  identityKey: string;
  userId: string | null;
  displayName: string;
  avatarUrl: string | null;
  mode: LeaderboardMode;
  layout: KeyboardLayout;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  institutionId: string | null;
  createdAt: string;
}

export interface TestResultInput {
  mode: LeaderboardMode;
  layout: KeyboardLayout;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  durationSec: number;
  institutionId?: string;
  lessonId?: string;
  passed?: boolean;
  clientSessionId: string;
}

export interface AnonymousIdentity {
  clientId: string;
  name: string | null;
}

export interface ContributionDay {
  date: string;
  count: number;
}

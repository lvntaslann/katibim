import { v4 as uuid } from "uuid";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout, Session, SessionMode } from "@/types";
import type { TypingEngine } from "./engine";
import { deriveKeyStats, deriveSubstitutionStats } from "./aggregate";

/**
 * Builds a Session from a finished engine, persists it (session + derived
 * per-key/substitution stats) and returns it. Shared by every runner
 * (classic paragraph mode and word-focus mode) so completion handling can't
 * drift between them.
 */
export async function persistSession(
  engine: TypingEngine,
  mode: SessionMode,
  textId: string,
  layout: KeyboardLayout,
  institutionId?: string,
  lessonId?: string
): Promise<Session> {
  const built = engine.buildSession(mode, textId, institutionId, lessonId);
  const session: Session = { id: uuid(), ...built };

  const repo = getRepository();
  await repo.addSession(session);
  await repo.upsertKeyStats(deriveKeyStats(session.keyEvents, layout));
  await repo.upsertSubstitutionStats(deriveSubstitutionStats(session.keyEvents, layout));

  return session;
}

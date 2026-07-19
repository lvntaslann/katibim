import type { KeyStat, Session, Settings, SubstitutionStat } from "@/types";

export interface ExportedData {
  version: 1;
  exportedAt: string;
  sessions: Session[];
  keyStats: KeyStat[];
  substitutionStats: SubstitutionStat[];
  settings: Settings;
}

/**
 * Storage-agnostic persistence contract. UI/engine code depends only on
 * this interface, never on IndexedDB/localStorage directly, so a real
 * backend can be substituted later.
 */
export interface Repository {
  addSession(session: Session): Promise<void>;
  getSession(id: string): Promise<Session | undefined>;
  listSessions(): Promise<Session[]>;

  upsertKeyStats(stats: KeyStat[]): Promise<void>;
  listKeyStats(layout?: Session["layout"]): Promise<KeyStat[]>;

  upsertSubstitutionStats(stats: SubstitutionStat[]): Promise<void>;
  listSubstitutionStats(layout?: Session["layout"]): Promise<SubstitutionStat[]>;

  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<void>;

  exportAll(): Promise<ExportedData>;
  importAll(data: ExportedData): Promise<void>;
  clearAll(): Promise<void>;
}

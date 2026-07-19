import type { KeyStat, Session, Settings, SubstitutionStat } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import type { ExportedData, Repository } from "./types";

const LS_SESSIONS = "katibim:sessions";
const LS_KEY_STATS = "katibim:keyStats";
const LS_SUBSTITUTIONS = "katibim:substitutionStats";
const LS_SETTINGS = "katibim:settings";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function keyStatId(stat: Pick<KeyStat, "layout" | "keyCode">): string {
  return `${stat.layout}:${stat.keyCode}`;
}

function substitutionId(stat: Pick<SubstitutionStat, "layout" | "expectedChar" | "typedChar">): string {
  return `${stat.layout}:${stat.expectedChar}:${stat.typedChar}`;
}

/**
 * Fallback used when IndexedDB is unavailable (e.g. private-browsing modes
 * that block it). Same Repository contract, backed by localStorage.
 */
export class LocalStorageRepository implements Repository {
  async addSession(session: Session): Promise<void> {
    const sessions = read<Session[]>(LS_SESSIONS, []);
    write(LS_SESSIONS, [...sessions.filter((s) => s.id !== session.id), session]);
  }

  async getSession(id: string): Promise<Session | undefined> {
    return read<Session[]>(LS_SESSIONS, []).find((s) => s.id === id);
  }

  async listSessions(): Promise<Session[]> {
    return read<Session[]>(LS_SESSIONS, []).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  }

  async upsertKeyStats(stats: KeyStat[]): Promise<void> {
    const existing = read<Record<string, KeyStat>>(LS_KEY_STATS, {});
    for (const delta of stats) {
      const id = keyStatId(delta);
      const prev = existing[id];
      existing[id] = prev
        ? {
            layout: prev.layout,
            keyCode: prev.keyCode,
            pressCount: prev.pressCount + delta.pressCount,
            errorCount: prev.errorCount + delta.errorCount,
            totalLatencyMs: prev.totalLatencyMs + delta.totalLatencyMs,
            lastUpdated: delta.lastUpdated,
          }
        : delta;
    }
    write(LS_KEY_STATS, existing);
  }

  async listKeyStats(layout?: Session["layout"]): Promise<KeyStat[]> {
    const all = Object.values(read<Record<string, KeyStat>>(LS_KEY_STATS, {}));
    return layout ? all.filter((s) => s.layout === layout) : all;
  }

  async upsertSubstitutionStats(stats: SubstitutionStat[]): Promise<void> {
    const existing = read<Record<string, SubstitutionStat>>(LS_SUBSTITUTIONS, {});
    for (const delta of stats) {
      const id = substitutionId(delta);
      const prev = existing[id];
      existing[id] = prev ? { ...prev, count: prev.count + delta.count } : delta;
    }
    write(LS_SUBSTITUTIONS, existing);
  }

  async listSubstitutionStats(layout?: Session["layout"]): Promise<SubstitutionStat[]> {
    const all = Object.values(read<Record<string, SubstitutionStat>>(LS_SUBSTITUTIONS, {}));
    return layout ? all.filter((s) => s.layout === layout) : all;
  }

  async getSettings(): Promise<Settings> {
    return read<Settings>(LS_SETTINGS, DEFAULT_SETTINGS);
  }

  async saveSettings(settings: Settings): Promise<void> {
    write(LS_SETTINGS, settings);
  }

  async exportAll(): Promise<ExportedData> {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: await this.listSessions(),
      keyStats: await this.listKeyStats(),
      substitutionStats: await this.listSubstitutionStats(),
      settings: await this.getSettings(),
    };
  }

  async importAll(data: ExportedData): Promise<void> {
    write(LS_SESSIONS, data.sessions);
    write(
      LS_KEY_STATS,
      Object.fromEntries(data.keyStats.map((s) => [keyStatId(s), s]))
    );
    write(
      LS_SUBSTITUTIONS,
      Object.fromEntries(data.substitutionStats.map((s) => [substitutionId(s), s]))
    );
    write(LS_SETTINGS, data.settings);
  }

  async clearAll(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(LS_SESSIONS);
    window.localStorage.removeItem(LS_KEY_STATS);
    window.localStorage.removeItem(LS_SUBSTITUTIONS);
    window.localStorage.removeItem(LS_SETTINGS);
  }
}

import { openDB, type IDBPDatabase } from "idb";
import type { KeyStat, Session, Settings, SubstitutionStat } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import type { ExportedData, Repository } from "./types";

const DB_NAME = "katibim";
const DB_VERSION = 1;

const STORE_SESSIONS = "sessions";
const STORE_KEY_STATS = "keyStats";
const STORE_SUBSTITUTIONS = "substitutionStats";
const STORE_SETTINGS = "settings";
const SETTINGS_KEY = "app-settings";

function keyStatId(stat: Pick<KeyStat, "layout" | "keyCode">): string {
  return `${stat.layout}:${stat.keyCode}`;
}

function substitutionId(stat: Pick<SubstitutionStat, "layout" | "expectedChar" | "typedChar">): string {
  return `${stat.layout}:${stat.expectedChar}:${stat.typedChar}`;
}

async function openDatabase(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        db.createObjectStore(STORE_SESSIONS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_KEY_STATS)) {
        db.createObjectStore(STORE_KEY_STATS);
      }
      if (!db.objectStoreNames.contains(STORE_SUBSTITUTIONS)) {
        db.createObjectStore(STORE_SUBSTITUTIONS);
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }
    },
  });
}

export class IndexedDbRepository implements Repository {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDatabase();
  }

  async addSession(session: Session): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_SESSIONS, session);
  }

  async getSession(id: string): Promise<Session | undefined> {
    const db = await this.dbPromise;
    return db.get(STORE_SESSIONS, id);
  }

  async listSessions(): Promise<Session[]> {
    const db = await this.dbPromise;
    const all = await db.getAll(STORE_SESSIONS);
    return all.sort((a: Session, b: Session) => a.startedAt.localeCompare(b.startedAt));
  }

  async upsertKeyStats(stats: KeyStat[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_KEY_STATS, "readwrite");
    for (const delta of stats) {
      const id = keyStatId(delta);
      const existing: KeyStat | undefined = await tx.store.get(id);
      const merged: KeyStat = existing
        ? {
            layout: existing.layout,
            keyCode: existing.keyCode,
            pressCount: existing.pressCount + delta.pressCount,
            errorCount: existing.errorCount + delta.errorCount,
            totalLatencyMs: existing.totalLatencyMs + delta.totalLatencyMs,
            lastUpdated: delta.lastUpdated,
          }
        : delta;
      await tx.store.put(merged, id);
    }
    await tx.done;
  }

  async listKeyStats(layout?: Session["layout"]): Promise<KeyStat[]> {
    const db = await this.dbPromise;
    const all: KeyStat[] = await db.getAll(STORE_KEY_STATS);
    return layout ? all.filter((s) => s.layout === layout) : all;
  }

  async upsertSubstitutionStats(stats: SubstitutionStat[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_SUBSTITUTIONS, "readwrite");
    for (const delta of stats) {
      const id = substitutionId(delta);
      const existing: SubstitutionStat | undefined = await tx.store.get(id);
      const merged: SubstitutionStat = existing
        ? { ...existing, count: existing.count + delta.count }
        : delta;
      await tx.store.put(merged, id);
    }
    await tx.done;
  }

  async listSubstitutionStats(layout?: Session["layout"]): Promise<SubstitutionStat[]> {
    const db = await this.dbPromise;
    const all: SubstitutionStat[] = await db.getAll(STORE_SUBSTITUTIONS);
    return layout ? all.filter((s) => s.layout === layout) : all;
  }

  async getSettings(): Promise<Settings> {
    const db = await this.dbPromise;
    const stored: Settings | undefined = await db.get(STORE_SETTINGS, SETTINGS_KEY);
    return stored ?? DEFAULT_SETTINGS;
  }

  async saveSettings(settings: Settings): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_SETTINGS, settings, SETTINGS_KEY);
  }

  async exportAll(): Promise<ExportedData> {
    const [sessions, keyStats, substitutionStats, settings] = await Promise.all([
      this.listSessions(),
      this.listKeyStats(),
      this.listSubstitutionStats(),
      this.getSettings(),
    ]);
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions,
      keyStats,
      substitutionStats,
      settings,
    };
  }

  async importAll(data: ExportedData): Promise<void> {
    const db = await this.dbPromise;
    await this.clearAll();
    const tx = db.transaction(
      [STORE_SESSIONS, STORE_KEY_STATS, STORE_SUBSTITUTIONS, STORE_SETTINGS],
      "readwrite"
    );
    for (const session of data.sessions) {
      await tx.objectStore(STORE_SESSIONS).put(session);
    }
    for (const stat of data.keyStats) {
      await tx.objectStore(STORE_KEY_STATS).put(stat, keyStatId(stat));
    }
    for (const stat of data.substitutionStats) {
      await tx.objectStore(STORE_SUBSTITUTIONS).put(stat, substitutionId(stat));
    }
    await tx.objectStore(STORE_SETTINGS).put(data.settings, SETTINGS_KEY);
    await tx.done;
  }

  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(
      [STORE_SESSIONS, STORE_KEY_STATS, STORE_SUBSTITUTIONS, STORE_SETTINGS],
      "readwrite"
    );
    await tx.objectStore(STORE_SESSIONS).clear();
    await tx.objectStore(STORE_KEY_STATS).clear();
    await tx.objectStore(STORE_SUBSTITUTIONS).clear();
    await tx.objectStore(STORE_SETTINGS).clear();
    await tx.done;
  }
}

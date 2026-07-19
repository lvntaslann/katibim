import { IndexedDbRepository } from "./indexeddb";
import { LocalStorageRepository } from "./local-storage";
import type { Repository } from "./types";

export * from "./types";

let instance: Repository | null = null;

function indexedDbAvailable(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

/**
 * Lazily creates a single shared Repository instance for the app: IndexedDB
 * when available, localStorage otherwise. Client-only (returns a fresh
 * localStorage-backed instance on the server, never persisted there).
 */
export function getRepository(): Repository {
  if (instance) return instance;
  instance = indexedDbAvailable() ? new IndexedDbRepository() : new LocalStorageRepository();
  return instance;
}

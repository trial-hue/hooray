import fs from "node:fs";
import path from "node:path";
import { emptyDb, type DB } from "./types";

// One JSON file on disk, held in a globalThis singleton so it survives HMR.
// DATA_MODE=memory keeps everything in memory (for a read-only host).

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const MEMORY = process.env.DATA_MODE === "memory";

declare global {
  // eslint-disable-next-line no-var
  var __hoorayDb: DB | undefined;
  // eslint-disable-next-line no-var
  var __hoorayDbMtime: number | undefined;
}

function fileMtime(): number {
  try {
    return fs.statSync(DB_PATH).mtimeMs;
  } catch {
    return 0;
  }
}

function load(): DB {
  if (MEMORY) return emptyDb();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as DB;
    return { ...emptyDb(), ...parsed };
  } catch {
    return emptyDb();
  }
}

function persist(db: DB): void {
  if (MEMORY) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 1));
  fs.renameSync(tmp, DB_PATH);
  globalThis.__hoorayDbMtime = fileMtime();
}

export function getDb(): DB {
  // Reload if another process (a script) rewrote the file since we last read it.
  const m = MEMORY ? 0 : fileMtime();
  if (!globalThis.__hoorayDb || (!MEMORY && m !== globalThis.__hoorayDbMtime)) {
    globalThis.__hoorayDb = load();
    globalThis.__hoorayDbMtime = m;
  }
  return globalThis.__hoorayDb;
}

/** Apply a mutation and persist atomically. Async so the fn may await (drafting). */
export async function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const db = getDb();
  const out = await fn(db);
  persist(db);
  return out;
}

export function resetDb(): DB {
  globalThis.__hoorayDb = emptyDb();
  persist(globalThis.__hoorayDb);
  return globalThis.__hoorayDb;
}

export function logEvent(db: DB, event: string): void {
  db.clock.log.push({ at: db.clock.today, event });
  if (db.clock.log.length > 400) db.clock.log.splice(0, db.clock.log.length - 400);
}

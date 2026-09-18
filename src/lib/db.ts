import fs from "node:fs";
import path from "node:path";
import { emptyDb, type DB } from "./types";

// One JSON file per workspace, held in a globalThis map so it survives HMR and
// reloaded whenever another process rewrites the file.
//   business → data/db.json        (a firm and its roster)
//   personal → data/personal.json  (one person and the people they care about)
// DATA_MODE=memory keeps everything in memory (for a read-only host).

export type Workspace = "business" | "personal";
export const WORKSPACES: Workspace[] = ["business", "personal"];

const DATA_DIR = path.join(process.cwd(), "data");
const MEMORY = process.env.DATA_MODE === "memory";

function fileFor(ws: Workspace): string {
  return path.join(DATA_DIR, ws === "business" ? "db.json" : "personal.json");
}

declare global {
  // eslint-disable-next-line no-var
  var __hoorayDbs: Partial<Record<Workspace, { db: DB; mtime: number }>> | undefined;
}

function fileMtime(ws: Workspace): number {
  try {
    return fs.statSync(fileFor(ws)).mtimeMs;
  } catch {
    return 0;
  }
}

function load(ws: Workspace): DB {
  if (MEMORY) return emptyDb();
  try {
    const parsed = JSON.parse(fs.readFileSync(fileFor(ws), "utf8")) as DB;
    return { ...emptyDb(), ...parsed };
  } catch {
    return emptyDb();
  }
}

function persist(ws: Workspace, db: DB): void {
  if (MEMORY) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const file = fileFor(ws);
  fs.writeFileSync(file + ".tmp", JSON.stringify(db, null, 1));
  fs.renameSync(file + ".tmp", file);
  const slot = globalThis.__hoorayDbs?.[ws];
  if (slot) slot.mtime = fileMtime(ws);
}

export function isWorkspace(x: unknown): x is Workspace {
  return x === "business" || x === "personal";
}

export function getDb(ws: Workspace = "business"): DB {
  globalThis.__hoorayDbs ??= {};
  const m = MEMORY ? 0 : fileMtime(ws);
  const slot = globalThis.__hoorayDbs[ws];
  if (!slot || (!MEMORY && m !== slot.mtime)) {
    globalThis.__hoorayDbs[ws] = { db: load(ws), mtime: m };
  }
  return globalThis.__hoorayDbs[ws]!.db;
}

/** Apply a mutation and persist atomically. `mutate(fn)` is the business workspace; `mutate(ws, fn)` picks one. */
export async function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T>;
export async function mutate<T>(ws: Workspace, fn: (db: DB) => T | Promise<T>): Promise<T>;
export async function mutate<T>(a: Workspace | ((db: DB) => T | Promise<T>), b?: (db: DB) => T | Promise<T>): Promise<T> {
  const ws: Workspace = typeof a === "function" ? "business" : a;
  const fn = (typeof a === "function" ? a : b)!;
  const db = getDb(ws);
  const out = await fn(db);
  persist(ws, db);
  return out;
}

export function resetDb(ws: Workspace = "business"): DB {
  globalThis.__hoorayDbs ??= {};
  const db = emptyDb();
  globalThis.__hoorayDbs[ws] = { db, mtime: 0 };
  persist(ws, db);
  return db;
}

export function logEvent(db: DB, event: string): void {
  db.clock.log.push({ at: db.clock.today, event });
  if (db.clock.log.length > 400) db.clock.log.splice(0, db.clock.log.length - 400);
}

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { DraftVersion } from "../types";

const DIR = path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "data"), "drafts");

export function draftCacheKey(parts: Record<string, unknown>): string {
  return crypto.createHash("sha1").update(JSON.stringify(parts)).digest("hex");
}

export function readCachedDraft(key: string): DraftVersion | undefined {
  try {
    const raw = fs.readFileSync(path.join(DIR, `${key}.json`), "utf8");
    return JSON.parse(raw) as DraftVersion;
  } catch {
    return undefined;
  }
}

export function writeCachedDraft(key: string, v: DraftVersion): void {
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(path.join(DIR, `${key}.json`), JSON.stringify(v, null, 1));
  } catch {
    // cache is best-effort
  }
}

export function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
}

// Optional AI-generated picture for a card front. Needs an image model with its own key:
//   IMAGE_PROVIDER=openai   OPENAI_API_KEY=sk-...   (gpt-image-1, portrait)
// Without a key, nothing is generated and the card keeps its brand artwork.
import fs from "node:fs";
import path from "node:path";
import { logEvent } from "./db";
import { currentDraft, type Card, type DB } from "./types";

const DIR = path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "data"), "images");

export function imageConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function imageProvider(): string {
  return process.env.IMAGE_PROVIDER ?? (process.env.OPENAI_API_KEY ? "openai" : "none");
}

/** The prompt we send: the user's words if given, otherwise the card's own artwork brief, always in the brand's palette. */
export function imagePromptFor(db: DB, card: Card, userPrompt: string): string {
  const d = currentDraft(card);
  const brand = db.company?.brandHex ?? "#1F3A5F";
  const accent = db.company?.accentHex ?? "#D4A24C";
  const subject = userPrompt || d?.artwork_brief.style_note || "a warm, simple illustration for a greeting card";
  return [
    `Greeting card front illustration: ${subject}.`,
    `Flat, printed-card style with visible paper texture; restrained palette built around ${brand} with ${accent} as an accent on an off-white ground.`,
    "Leave the bottom-left third calm and uncluttered so a headline can sit there.",
    "No text, no letters, no logos, no borders, no people's faces.",
  ].join(" ");
}

export function imagePath(cardId: string): string {
  return path.join(DIR, `${cardId}.png`);
}

export async function generateCardImage(db: DB, card: Card, userPrompt: string): Promise<{ ok: boolean; error?: string }> {
  const prompt = imagePromptFor(db, card, userPrompt);
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    logEvent(db, `Picture requested for ${card.id} but no image key is set`);
    return { ok: false, error: "No image key set. Add OPENAI_API_KEY to .env.local." };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.IMAGE_MODEL ?? "gpt-image-1", prompt, size: "1024x1536", quality: process.env.IMAGE_QUALITY ?? "medium", n: 1 }),
    });
    const json = (await res.json()) as { data?: { b64_json?: string }[]; error?: { message?: string } };
    const b64 = json.data?.[0]?.b64_json;
    if (!res.ok || !b64) return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` };
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(imagePath(card.id), Buffer.from(b64, "base64"));
    card.image = { prompt: userPrompt || "(from the card's artwork brief)", provider: "openai", file: `data/images/${card.id}.png`, at: db.clock.today };
    card.history.push({ at: db.clock.today, status: card.status, note: `Picture generated${userPrompt ? `: “${userPrompt.slice(0, 60)}”` : ""}` });
    logEvent(db, `Picture generated for ${card.id}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function removeCardImage(card: Card): void {
  try {
    fs.unlinkSync(imagePath(card.id));
  } catch {
    // already gone
  }
  card.image = undefined;
}

export function readCardImage(cardId: string): Buffer | undefined {
  try {
    return fs.readFileSync(imagePath(cardId));
  } catch {
    return undefined;
  }
}

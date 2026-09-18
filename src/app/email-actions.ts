"use server";

// Email actions live here rather than in actions.ts so the digest email can be
// worked on without touching the file every other button depends on.
import { revalidatePath } from "next/cache";
import { mutate } from "@/lib/db";
import { sendDigest } from "@/lib/digestEmail";

export type SendDigestState = { ok: true; mode: "sent" | "outbox"; to: string; id?: string; outboxPath: string } | { ok: false; error: string } | null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendDigestAction(_prev: SendDigestState, _formData: FormData): Promise<SendDigestState> {
  const r = await mutate((db) => sendDigest(db));
  revalidatePath("/", "layout");
  if ("error" in r && r.error) return { ok: false, error: r.error };
  if (!("mode" in r)) return { ok: false, error: "Nothing sent." };
  return { ok: true, mode: r.mode, to: r.to, id: r.id, outboxPath: r.outboxPath };
}

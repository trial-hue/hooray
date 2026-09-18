"use server";

import { revalidatePath } from "next/cache";
import { isWorkspace, mutate } from "@/lib/db";
import { renderCardPdf } from "@/lib/pdf";
import { buildStannpPayload, sendStannpTest } from "@/lib/stannp";
import { logEvent } from "@/lib/db";

export async function sendStannpTestAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const wsParam = formData.get("ws");
  const ws = isWorkspace(wsParam) ? wsParam : "business";
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  await mutate(ws, async (db) => {
    const card = db.cards.find((c) => c.id === id);
    if (!card) return;
    const payload = buildStannpPayload(db, card, `${origin}/api/cards/${id}/pdf?download=1&ws=${ws}`);
    if (!payload) return;
    const pdf = await renderCardPdf(id, { marks: false, origin, ws });
    const res = await sendStannpTest(payload, pdf, `hooray-${id}.pdf`);
    if (res.ok) {
      card.proof = { provider: "stannp", id: res.id, pdfUrl: res.pdf, cost: res.cost, status: res.status, at: db.clock.today };
      logEvent(db, `Stannp test proof #${res.id} for ${id} (cost ${res.cost})`);
    } else {
      card.proof = { provider: "stannp", id: "", pdfUrl: "", cost: "", status: "error", at: db.clock.today, error: res.error };
      logEvent(db, `Stannp test failed for ${id}: ${res.error}`);
    }
  });
  revalidatePath("/", "layout");
}

import { getDb, mutate, logEvent } from "../src/lib/db";
import { renderCardPdf } from "../src/lib/pdf";
import { buildStannpPayload, sendStannpTest } from "../src/lib/stannp";
async function main() {
  const db = getDb();
  const card = db.cards.find((c) => c.personId === (process.argv[2] ?? "rob-sinclair") && c.versions.length) ?? db.cards.find((c) => c.versions.length);
  if (!card) throw new Error("no drafted card");
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const payload = buildStannpPayload(db, card, `${origin}/api/cards/${card.id}/pdf?download=1`)!;
  console.log("to:", payload["recipient[firstname]"], payload["recipient[lastname]"], "·", payload["recipient[address1]"], payload["recipient[postcode]"]);
  const t0 = Date.now();
  const pdf = await renderCardPdf(card.id, { marks: false, origin });
  console.log(`pdf ${Math.round(pdf.length / 1024)}KB in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  const res = await sendStannpTest(payload, pdf, `hooray-${card.id}.pdf`);
  console.log(res);
  if (res.ok) {
    await mutate((db) => {
      const c = db.cards.find((x) => x.id === card.id)!;
      c.proof = { provider: "stannp", id: res.id, pdfUrl: res.pdf, cost: res.cost, status: res.status, at: db.clock.today };
      logEvent(db, `Stannp test proof #${res.id} for ${c.id} (would cost £${res.cost})`);
    });
  }
  process.exit(res.ok ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });

// End-to-end loop check, headless. Run with:
//   AI_DISABLED=1 npx tsx scripts/smoke.ts      (template drafts, no API key)
//   node --env-file=.env.local --import tsx scripts/smoke.ts   (real drafts, cached after first run)
import { resetDb, mutate, getDb } from "../src/lib/db";
import { loadDemoRoster, tick, approveCard, editCard, submitDigest, openDigest } from "../src/lib/engine";
import { currentDraft, finalTextOf } from "../src/lib/types";

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok  ", msg);
}

async function main() {
  resetDb();
  const t0 = Date.now();
  const r = await mutate((db) => loadDemoRoster(db));
  console.log(`roster loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s`, r);
  let db = getDb();
  const d1 = openDigest(db);
  assert(d1 && d1.coversFrom === "2026-09-28", "digest 1 covers 28 Sep");
  const cards1 = d1!.cardIds.map((id) => db.cards.find((c) => c.id === id)!);
  console.table(
    cards1.map((c) => {
      const p = db.people.find((x) => x.id === c.personId)!;
      return { who: `${p.firstName} ${p.lastName}`, due: c.dueDate, status: c.status, src: c.versions.at(-1)?.source ?? "-", flags: c.flags.length, headline: currentDraft(c)?.front_headline ?? "", cost: c.aiCostGbp.toFixed(3) };
    }),
  );
  assert(cards1.length === 9, `digest 1 has 9 cards (${cards1.length})`);
  assert(cards1.filter((c) => c.status === "held").length === 1, "1 held (no address)");
  assert(cards1.filter((c) => c.status === "skipped").length === 1, "1 skipped (opted out)");
  const priya = cards1.find((c) => c.personId === "priya-shah")!;
  assert(priya.flags.some((f) => f.kind === "gate"), "Priya's card carries an on-leave flag");

  await mutate((db) => {
    for (const c of cards1) if (c.status === "drafted" || c.status === "needs_review") approveCard(db, c, "rachel-okafor");
    const daniel = cards1.find((c) => c.personId === "daniel-osei")!;
    editCard(db, daniel, finalTextOf(daniel)!.inside_message + " The kettle is on the third floor.", "rachel-okafor");
    const res = submitDigest(db, d1!);
    assert(res.sent === 7, `submitted 7 cards (${res.sent})`);
  });

  await mutate((db) => tick(db, "2026-09-22"));
  db = getDb();
  assert(cards1.filter((c) => c.status === "printed").length === 7, "+1 day: 7 printed");
  await mutate((db) => tick(db, "2026-09-23"));
  assert(cards1.filter((c) => c.status === "posted").length === 7, "+1 day: 7 posted");
  await mutate((db) => tick(db, "2026-09-28"));
  db = getDb();
  assert(cards1.filter((c) => c.status === "delivered").length === 7, "+1 week: 7 delivered");
  const d2 = openDigest(db);
  assert(d2 && d2.coversFrom === "2026-10-05", "digest 2 exists for 5 Oct");
  const kettle = d2!.cardIds.map((id) => db.cards.find((c) => c.id === id)!).find((c) => c.personId === "harriet-kettlewell");
  assert(kettle && kettle.status !== "held", "Kettlewell milestone drafted");
  const total = db.cards.reduce((s, c) => s + c.aiCostGbp, 0);
  console.log(`\nAI spend so far: £${total.toFixed(3)} across ${db.cards.filter((c) => c.versions.length).length} drafted cards`);
  console.log("log:\n " + db.clock.log.map((l) => `${l.at} ${l.event}`).join("\n "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

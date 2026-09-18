// End-to-end loop check, headless. Run with:
//   AI_DISABLED=1 npx tsx scripts/smoke.ts      (template drafts, no API key)
//   node --env-file=.env.local --import tsx scripts/smoke.ts   (real drafts, cached after first run)
process.env.NO_EMAIL = "1";
import { resetDb, mutate, getDb } from "../src/lib/db";
import { loadDemoRoster, tick, approveCard, editCard, markLeaving, pendingCards } from "../src/lib/engine";
import { contribute, potPence } from "../src/lib/collections";
import { currentDraft, finalTextOf } from "../src/lib/types";
import { addDays } from "../src/lib/dates";
import { loadExampleContacts, startPersonal } from "../src/lib/engine";

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
  const q = pendingCards(db);
  console.table(
    q.map((c) => {
      const p = db.people.find((x) => x.id === c.personId)!;
      return { who: `${p.firstName} ${p.lastName}`, due: c.dueDate, dispatch: c.dispatchOn, status: c.status, src: c.versions.at(-1)?.source ?? "-", flags: c.flags.length, headline: currentDraft(c)?.front_headline ?? "", cost: c.aiCostGbp.toFixed(3) };
    }),
  );
  assert(q.length >= 4, `queue has cards due within 10 days (${q.length})`);
  assert(q.some((c) => c.personId === "daniel-osei"), "Daniel's welcome is queued");
  assert(q.some((c) => c.personId === "chloe-bennett"), "Chloe's 5-year anniversary is queued");
  assert(q.find((c) => c.personId === "sophie-nkemelu")?.status === "held", "Sophie held (no home address)");
  const chloeCol = db.collections.find((c) => c.personId === "chloe-bennett");
  assert(chloeCol && chloeCol.status === "open", "5-year milestone opened a team collection");

  // approve two, edit one
  await mutate((db) => {
    const chloe = db.cards.find((c) => c.personId === "chloe-bennett")!;
    const marcus = db.cards.find((c) => c.personId === "marcus-reid")!;
    const daniel = db.cards.find((c) => c.personId === "daniel-osei")!;
    approveCard(db, chloe, "rachel-okafor");
    approveCard(db, marcus, "rachel-okafor");
    editCard(db, daniel, finalTextOf(daniel)!.inside_message + " The kettle is on the third floor.", "rachel-okafor");
  });

  // leaver on stage
  await mutate(async (db) => {
    const rob = db.people.find((p) => p.id === "rob-sinclair")!;
    const card = await markLeaving(db, rob, addDays(db.clock.today, 14), false);
    assert(card && card.collectionId, "leaver card created with a collection");
    const col = db.collections.find((c) => c.id === card!.collectionId)!;
    assert(col.teamIds.length >= 6, `team-scoped collection invited ${col.teamIds.length} colleagues`);
    col.teamIds.slice(0, 8).forEach((id, i) => contribute(db, col, id, 1000, `Line ${i + 1}`));
    assert(col.contributions.length === 8 && potPence(col) === 8000, "eight contributions, £80 pot");
  });

  // advance to dispatch of the first cards: Daniel due 28 Sep → dispatch 23 Sep
  await mutate((db) => tick(db, "2026-09-23"));
  db = getDb();
  const daniel = db.cards.find((c) => c.personId === "daniel-osei")!;
  assert(daniel.status === "sent_to_print", `Daniel dispatched on 23 Sep (${daniel.status})`);
  await mutate((db) => tick(db, "2026-09-26"));
  db = getDb();
  const priya = db.cards.find((c) => c.personId === "priya-shah")!;
  assert(priya.autoApproved === true, "Priya's untouched card was auto-approved at dispatch");
  await mutate((db) => tick(db, "2026-10-01"));
  db = getDb();
  assert(db.cards.find((c) => c.personId === "daniel-osei")!.status === "delivered", "Daniel's card delivered");
  const robCard = db.cards.find((c) => c.personId === "rob-sinclair")!;
  const robCol = db.collections.find((c) => c.id === robCard.collectionId)!;
  assert(robCol.status === "closed" && robCard.status !== "drafted", "Rob's collection closed at dispatch and card sent");

  // a full year
  const t1 = Date.now();
  await mutate((db) => tick(db, "2027-09-21"));
  db = getDb();
  const sent = db.cards.filter((c) => ["sent_to_print", "printed", "posted", "delivered"].includes(c.status)).length;
  const auto = db.cards.filter((c) => c.autoApproved).length;
  console.log(`\nyear simulated in ${((Date.now() - t1) / 1000).toFixed(1)}s: ${db.cards.length} cards, ${sent} sent, ${auto} auto-approved, ${db.collections.length} collections, ${db.printJobs.length} print jobs`);
  assert(sent > 80, "a year produces a steady stream of sent cards");
  const gifted = db.cards.filter((c) => c.gift);
  const staffGifts = gifted.filter((c) => c.gift!.reason === "staff-milestone");
  const clientGifts = gifted.filter((c) => c.gift!.reason === "client");
  assert(staffGifts.length >= 1, `at least one staff milestone card carries a company gift (${staffGifts.length})`);
  assert(clientGifts.length >= 1, `at least one client card carries a company gift (${clientGifts.length})`);
  const giftTotal = gifted.reduce((s, c) => s + c.gift!.valuePence, 0) / 100 + db.collections.reduce((s, c) => s + potPence(c), 0) / 100;
  assert(giftTotal > 0, `gift value under management is non-zero (£${giftTotal.toFixed(0)})`);
  assert(db.cards.filter((c) => c.gift && (db.occasions.find((o) => o.id === c.occasionId)?.type === "leaver")).length === 0, "leavers carry no company gift");
  const total = db.cards.reduce((s, c) => s + c.aiCostGbp, 0);
  console.log(`AI spend: £${total.toFixed(3)} across ${db.cards.filter((c) => c.versions.length).length} drafted cards`);
  console.log("log (last 12):\n " + db.clock.log.slice(-12).map((l) => `${l.at} ${l.event}`).join("\n "));

  // Personal workspace: pay-per-card accounts wait for a tap at dispatch.
  resetDb("personal");
  await mutate("personal", async (p) => {
    await startPersonal(p, { name: "Akshay Devon", brandHex: "#1F3A5F", toneWords: ["warm"], signOff: "Lots of love", address: { line1: "7 Ridgeway Gardens", town: "London", postcode: "N6 5RB" } });
    await loadExampleContacts(p);
  });
  const pdb = getDb("personal");
  const meera = pdb.cards.find((c) => c.personId.startsWith("meera"))!;
  assert(meera && meera.status === "drafted", "personal: Meera's card drafted");
  await mutate("personal", (p) => tick(p, addDays(meera.dispatchOn, 1)));
  const after = getDb("personal").cards.find((c) => c.id === meera.id)!;
  assert(after.status === "drafted" && !after.autoApproved, `personal: pending card still pending after dispatch day (${after.status})`);
  assert(getDb("personal").clock.log.some((l) => l.event.includes("waiting for a tap")), "personal: logged as waiting for a tap");
  await mutate("personal", async (p) => { p.company!.subscription = true; await tick(p, addDays(p.clock.today, 1)); });
  const subbed = getDb("personal").cards.find((c) => c.id === meera.id)!;
  assert(subbed.status === "sent_to_print" && subbed.autoApproved === true, "personal: subscribed account sends automatically");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

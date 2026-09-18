import { resetDb, mutate, getDb } from "../src/lib/db";
import { loadDemoRoster, markLeaving, approveCard, editCard } from "../src/lib/engine";
import { contribute } from "../src/lib/collections";
import { addDays } from "../src/lib/dates";
import { finalTextOf } from "../src/lib/types";
async function main() {
  resetDb();
  await mutate((db) => loadDemoRoster(db));
  if (process.argv.includes("--staged")) {
    await mutate(async (db) => {
      const rob = db.people.find((p) => p.id === "rob-sinclair")!;
      const card = await markLeaving(db, rob, addDays(db.clock.today, 14), false);
      const col = db.collections.find((c) => c.id === card!.collectionId)!;
      const lines = ["Going to miss you, Rob. Who do I ask now?", "Thank you for the patience, the pivot tables and the bacon rolls.", "Best of luck. Don't be a stranger.", "The Friday order will never be the same.", "Thanks for everything. Genuinely.", "You made this place better.", "Eight years and never a late payroll.", "All the best from the Leeds lot."];
      col.teamIds.slice(0, 8).forEach((id, i) => contribute(db, col, id, 1000, lines[i]));
      const chloe = db.cards.find((c) => c.personId === "chloe-bennett")!;
      approveCard(db, chloe, "rachel-okafor");
      const daniel = db.cards.find((c) => c.personId === "daniel-osei")!;
      editCard(db, daniel, finalTextOf(daniel)!.inside_message + " The kettle is on the third floor.", "rachel-okafor");
    });
  }
  const db = getDb();
  console.log("cards:", db.cards.map((c) => `${c.id} ${c.personId} ${c.status}`).join("\n       "));
  console.log("collections:", db.collections.map((c) => `${c.id} ${c.personId} ${c.contributions.length}`).join(", "));
}
main();

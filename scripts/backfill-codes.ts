import { mutate } from "../src/lib/db";
import { fnv1a } from "../src/lib/rng";
async function main() {
for (const ws of ["personal", "business"] as const) {
  await mutate(ws, (db) => {
    if (ws === "personal" && db.company && !db.company.circleToken) db.company.circleToken = fnv1a(`circle:${db.company.shortName}`).toString(36).padStart(8, "0").slice(0, 8);
    for (const c of db.cards) if (!c.shareCode || c.shareCode.length < 6) c.shareCode = fnv1a(`share:${c.occurrenceKey}`).toString(36).padStart(6, "0").slice(0, 6);
    console.log(ws, db.company?.circleToken ?? "-", db.cards.length, "cards coded");
  });
}
}
main();

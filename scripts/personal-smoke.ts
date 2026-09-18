import crypto from "node:crypto";
import fs from "node:fs";
import { getDb, mutate, resetDb } from "../src/lib/db";
import { loadExampleContacts, startPersonal, tick } from "../src/lib/engine";
import { currentDraft } from "../src/lib/types";
const hash = (f: string) => { try { return crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10); } catch { return "none"; } };
async function main() {
  const before = hash("data/db.json");
  resetDb("personal");
  await mutate("personal", async (db) => {
    await startPersonal(db, { name: "Akshay Devon", brandHex: "#1F3A5F", toneWords: ["warm", "a bit silly", "says what I actually mean"], signOff: "Lots of love", address: { line1: "7 Ridgeway Gardens", town: "London", postcode: "N6 5RB" } });
    await loadExampleContacts(db);
  });
  let db = getDb("personal");
  console.table(db.cards.map((c) => { const p = db.people.find((x) => x.id === c.personId)!; const d = currentDraft(c); return { who: `${p.firstName} (${p.relationship})`, due: c.dueDate, status: c.status, src: c.versions.at(-1)?.source, signer: db.people.find((x) => x.id === c.signerId)?.firstName, headline: d?.front_headline, msg: d?.inside_message.slice(0, 90) }; }));
  await mutate("personal", (db) => tick(db, "2026-10-05"));
  db = getDb("personal");
  console.log("cards:", db.cards.length, "sent:", db.cards.filter((c) => ["sent_to_print","printed","posted","delivered"].includes(c.status)).length, "collections:", db.collections.length, "owner signs all:", db.cards.every((c) => c.signerId === db.company?.managingPartnerId));
  for (const c of db.cards) { const d = currentDraft(c); if (d) console.log(`\n— ${db.people.find((x) => x.id === c.personId)?.firstName}: ${d.front_headline}\n${d.inside_message}\n${d.sign_off} ${d.signature_line}`); }
  console.log("\nbusiness db unchanged:", before === hash("data/db.json"));
}
main().catch((e) => { console.error(e); process.exit(1); });

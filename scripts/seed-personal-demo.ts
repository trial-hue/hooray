// Richer personal demo: eight more people whose dates fall every week or so from late September, so each
// "Next week" produces a card and an email. Idempotent: skips anyone already on the list.
// Usage: npx tsx scripts/seed-personal-demo.ts            (seeds; sends emails for cards drafted now unless NO_EMAIL=1)
//        npx tsx scripts/seed-personal-demo.ts --prewarm  (also drafts the next 90 days into the cache, then restores the file)
import { promises as fs } from "node:fs";
import path from "node:path";
import { getDb, mutate } from "../src/lib/db";
import { addContact, addHumanOccasion, tick } from "../src/lib/engine";
import { addDays } from "../src/lib/dates";

const DATA = process.env.DATA_DIR ?? path.join(process.cwd(), "data");

const PEOPLE = [
  { firstName: "Ruairidh", lastName: "Forgan", relationship: "founder of Telemachus, where I spent a day building this", birthday: undefined as string | undefined, homeAddress: { line1: "Telemachus, 60 Cheapside", town: "London", postcode: "EC2V 6AX" }, publicFacts: ["Cambridge physics, then Fox & Fable, then Telemachus", "Asked for a Moonpig clone in a day"], human: { kind: "congratulations" as const, date: "2026-09-26", label: "Proof of concept: the card that sends itself" } },
  { firstName: "Hannah", lastName: "Cole", relationship: "my friend from uni", birthday: "02-11", homeAddress: { line1: "7 Beechwood Avenue", town: "Sheffield", postcode: "S10 3DP" }, publicFacts: ["Baby Wren arrived on 15 September", "Still the only person who laughs at my puns"], human: { kind: "new-baby" as const, date: "2026-09-25", label: "Baby Wren" } },
  { firstName: "Priya", lastName: "Shah", relationship: "my cousin", birthday: "10-08", homeAddress: { line1: "31 Kenton Lane", town: "Harrow", postcode: "HA3 8TX" }, publicFacts: ["Just qualified as a vet", "Has beaten me at Scrabble every Christmas since 2015"] },
  { firstName: "Dev", lastName: "Devon", relationship: "my little brother", birthday: "10-15", dob: "1996-10-15", homeAddress: { line1: "Flat 3, 88 Chatsworth Road", town: "London", postcode: "E5 0LS" }, publicFacts: ["Ran his first marathon in April", "Still owes me a tenner from 2019"] },
  { firstName: "Kamla", lastName: "Devon", relationship: "my nan", birthday: "10-22", dob: "1946-10-22", homeAddress: { line1: "14 Melton Road", town: "Leicester", postcode: "LE4 5EA" }, publicFacts: ["Makes the best dhokla in Leicester", "Learned WhatsApp this year and now sends more memes than I do"] },
  { firstName: "Sam", lastName: "Whitfield", relationship: "my old flatmate", birthday: "10-29", homeAddress: { line1: "52 Burton Road", town: "Manchester", postcode: "M20 3EB" }, publicFacts: ["Finally got the allotment after four years on the list", "Still cannot cook rice"] },
  { firstName: "Leah", lastName: "Morris", relationship: "my sister", birthday: "11-05", homeAddress: { line1: "9 Clifton Vale", town: "Bristol", postcode: "BS8 4PT" }, publicFacts: ["Just started a pottery business from the garage", "Married Callum on 12 November 2023"], milestones: [{ date: "2026-11-12", label: "Third wedding anniversary with Callum" }] },
  { firstName: "Jonah", lastName: "Clarke", relationship: "my godson", birthday: "11-19", dob: "2016-11-19", homeAddress: { line1: "3 Meadow Way", town: "Norwich", postcode: "NR4 6QH" }, publicFacts: ["Football mad, plays for the under-11s", "Wants to be a marine biologist this week"] },
];

async function main() {
  const prewarm = process.argv.includes("--prewarm");
  await mutate("personal", async (db) => {
    if (!db.company) throw new Error("no personal account; start one first");
    for (const p of PEOPLE) {
      const exists = db.people.some((x) => x.firstName === p.firstName && x.lastName === p.lastName);
      const { human, ...contact } = p;
      const person = exists ? db.people.find((x) => x.firstName === p.firstName && x.lastName === p.lastName)! : await addContact(db, { ...contact, role: "", team: "", office: "" });
      if (human) await addHumanOccasion(db, person, human.kind, human.date, human.label);
      console.log(exists ? "kept  " : "added ", `${p.firstName} ${p.lastName}`);
    }
  });
  const db = getDb("personal");
  console.log("today", db.clock.today, "people", db.people.length, "cards", db.cards.map((c) => `${c.occurrenceKey.split(":")[0]}:${c.status}`).join(", "));

  if (prewarm) {
    const file = path.join(DATA, "personal.json");
    const backup = await fs.readFile(file, "utf8");
    process.env.NO_EMAIL = "1";
    try {
      await mutate("personal", (d) => tick(d, addDays(d.clock.startedOn, 90)));
      const warmed = getDb("personal");
      console.log("prewarmed to", warmed.clock.today, "cards", warmed.cards.length);
    } finally {
      await fs.writeFile(file, backup);
      console.log("restored", file);
    }
  }
}
main();

// Exercises the three data-moat loops against a scratch copy of the personal workspace. AI_DISABLED=1 NO_EMAIL=1 recommended.
import { promises as fs } from "node:fs";
import { getDb, mutate } from "../src/lib/db";
import { addContact, editCard, recordSignup } from "../src/lib/engine";
import { companyBlock } from "../src/lib/ai/prompts";

function ok(c: boolean, m: string) { console.log((c ? "ok   " : "FAIL ") + m); if (!c) process.exitCode = 1; }

async function main() {
  const backup = await fs.readFile("data/personal.json", "utf8");
  try {
    await mutate("personal", async (db) => {
      const before = db.people.length;
      await addContact(db, { firstName: "Priya", lastName: "Shah", role: "", team: "", office: "", relationship: "cousin", birthday: "10-01", source: "circle" });
      ok(db.people.length === before + 1 && db.people.at(-1)!.source === "circle", "circle join adds a contact tagged via link");
      ok(db.clock.log.some((e) => e.event.includes("through your circle link")), "circle join logged");

      const card = db.cards.find((c) => ["drafted", "needs_review", "approved", "edited"].includes(c.status) && c.versions.length);
      if (!card) { ok(false, "no editable card"); return; }
      const draft = card.versions.at(-1)!.draft.inside_message;
      editCard(db, card, draft + " Love always.", "Akshay");
      ok((db.company!.voiceExamples?.length ?? 0) === 1, "an edit is kept as a voice example");
      ok(companyBlock(db.company!).includes("How this account edits drafts"), "voice examples reach the prompt");
      editCard(db, card, card.finalText!.inside_message, "Akshay"); // no change
      ok((db.company!.voiceExamples?.length ?? 0) === 1, "an unchanged edit is not learned");

      ok(Boolean(card.shareCode) && card.shareCode!.length === 6, `card carries a share code (${card.shareCode})`);
      recordSignup(db, { name: "Meera Devon", fromCardId: card.id });
      ok(db.signups?.length === 1 && db.signups[0].fromCardId === card.id, "recipient signup recorded against the card");
    });
    ok(getDb("personal").company!.circleToken !== undefined, "personal account has a circle token");
  } finally {
    await fs.writeFile("data/personal.json", backup);
  }
}
main();

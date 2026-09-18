// Start the personal workspace's year again, keeping the account and its people. AI_DISABLED=1 for a template-only run.
import { getDb, mutate } from "../src/lib/db";
import { restartClock } from "../src/lib/engine";
mutate("personal", (db) => restartClock(db)).then(() => {
  const db = getDb("personal");
  console.log("personal clock", db.clock.today, "cards", db.cards.length, "people", db.people.length);
});

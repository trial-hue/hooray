// Build this week's digest from data/db.json and send it (or write it to
// data/outbox/ when RESEND_API_KEY is unset). Usage:
//   node --env-file=.env.local --import tsx scripts/send-digest.ts [--preview]
import { spawnSync } from "node:child_process";
import { getDb, mutate } from "../src/lib/db";
import { buildDigestEmail, sendDigest } from "../src/lib/digestEmail";

async function main() {
  const preview = process.argv.includes("--preview");
  const db = getDb();
  if (!db.company) {
    console.error("No company loaded. Run the app and load a roster first, or `AI_DISABLED=1 npx tsx scripts/reset-demo.ts --staged`.");
    process.exit(1);
  }
  const built = buildDigestEmail(db);
  if (!built) {
    console.error("No recipient: set DIGEST_TO in .env.local.");
    process.exit(1);
  }
  console.log(`to:      ${built.summary.to} (${built.summary.toName})`);
  console.log(`subject: ${built.email.subject}`);
  console.log(`cards:   ${built.summary.total} · ${built.summary.needs} need a decision · ${built.summary.ready} ready · ${built.summary.done} handled`);
  if (preview) {
    console.log("\n" + built.email.text);
    return;
  }
  const r = await mutate((d) => sendDigest(d));
  if ("error" in r && r.error) {
    console.error(`FAILED: ${r.error}`);
    process.exit(1);
  }
  if (!("mode" in r)) return;
  console.log(r.mode === "sent" ? `sent · id ${r.id}` : `outbox only (no RESEND_API_KEY)`);
  console.log(`copy:    ${r.outboxPath}`);
  if (process.argv.includes("--open")) spawnSync("open", [r.outboxPath]);
}

main();

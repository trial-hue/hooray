// Personal workspace: one email per occasion when its card is drafted, ten days out.
// Same table-based HTML and transport as the weekly digest.
import { daysBetween } from "./dates";
import { logEvent } from "./db";
import { sendEmail, type OutboundEmail, type SendResult } from "./email";
import { occasionTitle } from "./occasions";
import { currentDraft, displayName, fullName, type Card, type DB } from "./types";

const BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The account owner's address; DIGEST_TO stands in for the demo. */
export function personalRecipient(db: DB): string | undefined {
  return db.company?.email?.trim() || process.env.DIGEST_TO?.trim() || undefined;
}

export function buildOccasionEmail(db: DB, card: Card): OutboundEmail | undefined {
  const company = db.company;
  const to = personalRecipient(db);
  const person = db.people.find((p) => p.id === card.personId);
  const occ = db.occasions.find((o) => o.id === card.occasionId);
  const draft = currentDraft(card);
  if (!company || !to || !person || !occ || !draft) return undefined;
  const days = Math.max(0, daysBetween(db.clock.today, card.dueDate));
  const who = displayName(person);
  const what = occasionTitle(occ).toLowerCase();
  const subject = `${who}'s ${what} is in ${days} day${days === 1 ? "" : "s"}`;
  const link = `${BASE}/me/cards/${card.id}`;
  const brand = company.brandHex || "#1F3A5F";
  const owner = company.shortName;

  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:24px 0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #dcd5c7;border-radius:12px">
<tr><td style="padding:28px 32px 8px;font:600 11px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b6f76">Hooray · ${esc(what)} in ${days} day${days === 1 ? "" : "s"}</td></tr>
<tr><td style="padding:0 32px 8px;font:600 26px/1.15 Georgia,serif;color:#1b1b1b">${esc(who)}${person.relationship ? ` <span style="font:400 15px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6b6f76">${esc(person.relationship)}</span>` : ""}</td></tr>
<tr><td style="padding:8px 32px 0;font:400 15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#4a4a48">Here is the card we have drafted. Tap to send it as it is, change a word, or skip it.</td></tr>
<tr><td style="padding:20px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #dcd5c7;border-radius:10px"><tr><td style="padding:20px 22px">
<div style="font:600 20px/1.2 Georgia,serif;color:#1b1b1b">${esc(draft.front_headline)}</div>
<div style="padding-top:12px;font:400 16px/1.6 Georgia,serif;color:#1b1b1b">${esc(draft.inside_message)}</div>
<div style="padding-top:12px;font:400 14px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#4a4a48">${esc(draft.sign_off)} <em>${esc(owner)}</em></div>
</td></tr></table></td></tr>
<tr><td style="padding:22px 32px 30px"><a href="${link}" style="display:inline-block;background:${brand};color:#ffffff;text-decoration:none;font:600 14px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;padding:13px 20px;border-radius:8px">See the card</a>
<div style="padding-top:12px;font:400 12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#8a8e95">Nothing goes until you tap. Posted five days before the date.</div></td></tr>
</table></td></tr></table>`;

  const text = `${who}'s ${what} is in ${days} day${days === 1 ? "" : "s"}.\n\n${draft.front_headline}\n${draft.inside_message}\n${draft.sign_off} ${owner}\n\nSee the card, send it, change a word, or skip it:\n${link}\n\nNothing goes until you tap. Posted five days before the date.`;
  return { to, subject, html, text };
}

export async function sendOccasionEmail(db: DB, card: Card): Promise<SendResult | undefined> {
  if (db.company?.kind !== "personal") return undefined;
  const email = buildOccasionEmail(db, card);
  if (!email) return undefined;
  const person = db.people.find((p) => p.id === card.personId);
  const result = await sendEmail(email, { stamp: `${db.clock.today}-occasion-${card.id}` });
  const who = person ? fullName(person) : card.personId;
  if (result.error) logEvent(db, `Occasion email for ${who} failed: ${result.error}`);
  else logEvent(db, `Occasion email ${result.mode === "sent" ? "sent to" : "written to outbox for"} ${email.to}: ${email.subject}`);
  return result;
}

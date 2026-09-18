// The weekly approval digest as an email. Same queue as /digest, rendered as
// table-based HTML with inline styles (what email clients actually support),
// plus a plaintext twin. Pure: takes the db, returns the message.
import { addDays, formatLong, formatRange, formatShort } from "./dates";
import { pendingCards } from "./engine";
import { GATE_LABEL } from "./gate";
import { occasionTitle } from "./occasions";
import { DISPATCH_DAYS, LEAD_DAYS, displayName, finalTextOf, fullName, type Card, type DB, type Person } from "./types";
import { sendEmail, type OutboundEmail, type SendResult } from "./email";
import { logEvent } from "./db";

const BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type DigestEmailSummary = {
  to: string;
  toName: string;
  total: number;
  needs: number;
  ready: number;
  done: number;
  nextDispatch?: string;
};

/** Who the digest goes to: DIGEST_TO for the demo, otherwise the approver's roster email. */
export function digestRecipient(db: DB): { email: string; person?: Person } | undefined {
  const approver = db.people.find((p) => p.id === db.company?.approverId) ?? db.people.find((p) => p.id === db.company?.managingPartnerId);
  const override = process.env.DIGEST_TO?.trim();
  if (override) return { email: override, person: approver };
  if (approver?.email) return { email: approver.email, person: approver };
  return undefined;
}

export function buildDigestEmail(db: DB): { email: OutboundEmail; summary: DigestEmailSummary } | undefined {
  const company = db.company;
  const rcpt = digestRecipient(db);
  if (!company || !rcpt) return undefined;

  const today = db.clock.today;
  const cards = pendingCards(db);
  const needs = cards.filter((c) => c.status === "held" || c.status === "needs_review");
  const ready = cards.filter((c) => c.status === "drafted");
  const done = cards.filter((c) => ["approved", "edited", "skipped"].includes(c.status));
  const nextDispatch = cards.filter((c) => c.status !== "skipped").map((c) => c.dispatchOn).sort()[0];
  const range = formatRange(today, addDays(today, LEAD_DAYS));
  const brand = company.brandHex || "#1F3A5F";
  const firstName = rcpt.person ? displayName(rcpt.person) : "there";

  const person = (c: Card) => db.people.find((p) => p.id === c.personId);
  const occasion = (c: Card) => db.occasions.find((o) => o.id === c.occasionId);
  const signer = (c: Card) => db.people.find((p) => p.id === c.signerId);
  const link = (c: Card) => `${BASE}/cards/${c.id}`;

  // ---- HTML ----
  const th = (label: string, sub: string) =>
    `<tr><td style="padding:28px 0 10px;font:600 11px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b6f76">${esc(label)}<span style="font-weight:400;letter-spacing:0;text-transform:none;color:#8a8e95"> · ${esc(sub)}</span></td></tr>`;

  const cardRow = (c: Card, kind: "needs" | "ready" | "done"): string => {
    const p = person(c);
    const o = occasion(c);
    const s = signer(c);
    if (!p || !o) return "";
    const text = finalTextOf(c);
    const flags = c.flags.map((f) => f.text);
    const reason = c.holdReason ? GATE_LABEL[c.holdReason] : c.status === "needs_review" ? "Wording check" : undefined;
    const status =
      kind === "done"
        ? c.status === "skipped"
          ? "Skipped"
          : c.status === "edited"
            ? "Edited"
            : "Approved"
        : undefined;
    const badge = reason
      ? `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#fdecec;color:#9b1c1c;font:600 11px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${esc(reason)}</span>`
      : status
        ? `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#e9f5ec;color:#1e6b3a;font:600 11px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${esc(status)}</span>`
        : "";
    const message =
      kind !== "done" && text
        ? `<p style="margin:10px 0 0;font:15px/1.5 Georgia,'Times New Roman',serif;color:#1c1e21"><strong style="font-weight:600">${esc(text.front_headline)}</strong><br>${esc(text.inside_message)}</p>
           <p style="margin:6px 0 0;font:13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6b6f76">${esc(text.sign_off.replace(/[,\s]+$/, ""))}, ${esc(text.signature_line)}</p>`
        : "";
    const flagList = flags.length
      ? `<p style="margin:8px 0 0;font:13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#9b1c1c">${flags.map(esc).join("<br>")}</p>`
      : "";
    const cta =
      kind === "needs"
        ? `<a href="${link(c)}" style="display:inline-block;margin-top:12px;padding:8px 14px;border-radius:6px;background:${brand};color:#fff;font:600 13px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-decoration:none">Decide</a>`
        : kind === "ready"
          ? `<a href="${link(c)}" style="display:inline-block;margin-top:12px;font:600 13px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${brand};text-decoration:none">Open the card &rarr;</a>`
          : "";
    return `<tr><td style="padding:16px 18px;border:1px solid #e6e8eb;border-radius:10px;background:#fff">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font:600 16px/1.3 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1c1e21">${esc(fullName(p))}
          <span style="font-weight:400;color:#6b6f76"> · ${esc(occasionTitle(o))} · ${esc(formatShort(c.dueDate))}</span></td>
        <td align="right" style="white-space:nowrap">${badge}</td>
      </tr></table>
      ${message}${flagList}
      <p style="margin:8px 0 0;font:12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#8a8e95">${s ? `Signed by ${esc(fullName(s))} · ` : ""}posts ${esc(formatShort(c.dispatchOn))}</p>
      ${cta}
    </td></tr><tr><td style="height:10px"></td></tr>`;
  };

  const section = (label: string, sub: string, rows: Card[], kind: "needs" | "ready" | "done") => (rows.length ? th(label, sub) + rows.map((c) => cardRow(c, kind)).join("") : "");

  const intro =
    cards.length === 0
      ? `Nothing is waiting for you this week.`
      : `${cards.length} card${cards.length === 1 ? " is" : "s are"} lined up for ${range}. ${
          needs.length ? `${needs.length} need${needs.length === 1 ? "s" : ""} a decision from you; ` : ""
        }everything else goes out on its own${nextDispatch ? ` from ${formatLong(nextDispatch)}` : ""} unless you change it.`;

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(company.shortName)} cards</title></head>
<body style="margin:0;padding:0;background:#f3f4f6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
  <tr><td style="padding:22px 24px;border-radius:12px 12px 0 0;background:${brand};color:#fff">
    <div style="font:600 12px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;opacity:.8">Hooray · ${esc(company.shortName)}</div>
    <div style="margin-top:6px;font:600 22px/1.25 Georgia,'Times New Roman',serif">This week's cards</div>
    <div style="margin-top:4px;font:13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;opacity:.85">${esc(formatLong(today))}</div>
  </td></tr>
  <tr><td style="padding:24px 24px 8px;background:#fff;border:1px solid #e6e8eb;border-top:0">
    <p style="margin:0;font:16px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1c1e21">Hi ${esc(firstName)},</p>
    <p style="margin:12px 0 0;font:16px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1c1e21">${esc(intro)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${section("Needs a decision", "nothing goes out until you say so", needs, "needs")}
      ${section("Ready", "approve, edit a line, or leave it and it sends itself", ready, "ready")}
      ${section("Already handled", "frozen as you left them", done, "done")}
    </table>
    <p style="margin:24px 0 0;font:13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6b6f76">
      Cards are drafted ${LEAD_DAYS} days before the date and posted ${DISPATCH_DAYS} days before. Anything untouched at posting is approved automatically, so nothing is missed if this email sits in your inbox.
    </p>
    <p style="margin:16px 0 0"><a href="${BASE}/digest" style="display:inline-block;padding:10px 16px;border-radius:6px;background:${brand};color:#fff;font:600 14px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-decoration:none">Open the full queue</a></p>
  </td></tr>
  <tr><td style="padding:16px 24px;border-radius:0 0 12px 12px;background:#fafafa;border:1px solid #e6e8eb;border-top:0;font:12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#8a8e95">
    Sent by Hooray for ${esc(company.name)}. Reply to this email and a person will read it.
  </td></tr>
</table></td></tr></table></body></html>`;

  // ---- plain text ----
  const line = (c: Card, kind: "needs" | "ready" | "done") => {
    const p = person(c);
    const o = occasion(c);
    if (!p || !o) return "";
    const t = finalTextOf(c);
    const head = `- ${fullName(p)} · ${occasionTitle(o)} · ${formatShort(c.dueDate)}`;
    const reason = c.holdReason ? `  [${GATE_LABEL[c.holdReason]}]` : c.status === "needs_review" ? "  [Wording check]" : kind === "done" ? `  [${c.status}]` : "";
    const body = kind !== "done" && t ? `\n  "${t.front_headline}" — ${t.inside_message}` : "";
    const flags = c.flags.length ? `\n  ! ${c.flags.map((f) => f.text).join("\n  ! ")}` : "";
    return `${head}${reason}${body}${flags}\n  ${link(c)}`;
  };
  const textSection = (label: string, rows: Card[], kind: "needs" | "ready" | "done") => (rows.length ? `\n${label.toUpperCase()}\n${rows.map((c) => line(c, kind)).join("\n")}\n` : "");
  const text = `Hi ${firstName},\n\n${intro}\n${textSection("Needs a decision", needs, "needs")}${textSection("Ready", ready, "ready")}${textSection("Already handled", done, "done")}\nFull queue: ${BASE}/digest\n\nCards are drafted ${LEAD_DAYS} days before the date and posted ${DISPATCH_DAYS} days before. Anything untouched at posting is approved automatically.\n`;

  const subject =
    cards.length === 0
      ? `${company.shortName}: nothing to approve this week`
      : `${company.shortName}: ${cards.length} card${cards.length === 1 ? "" : "s"} for ${range}${needs.length ? ` · ${needs.length} need${needs.length === 1 ? "s" : ""} a decision` : ""}`;

  return {
    email: { to: rcpt.email, subject, html, text },
    summary: { to: rcpt.email, toName: rcpt.person ? fullName(rcpt.person) : rcpt.email, total: cards.length, needs: needs.length, ready: ready.length, done: done.length, nextDispatch },
  };
}

/** Build and send this week's digest, recording the outcome in the activity log. */
export async function sendDigest(db: DB): Promise<(SendResult & { summary: DigestEmailSummary }) | { error: string }> {
  const built = buildDigestEmail(db);
  if (!built) return { error: db.company ? "No approver email on the roster. Set DIGEST_TO in .env.local." : "No company loaded." };
  const result = await sendEmail(built.email, { stamp: `${db.clock.today}-digest` });
  const { summary } = built;
  if (result.error) logEvent(db, `Digest email to ${summary.to} failed: ${result.error}`);
  else logEvent(db, `Digest ${result.mode === "sent" ? "emailed to" : "written to outbox for"} ${summary.to}: ${summary.total} card${summary.total === 1 ? "" : "s"}, ${summary.needs} needing a decision`);
  return { ...result, summary };
}

// Outbound email. Resend over plain fetch (no SDK), with an on-disk outbox so
// every send is inspectable and the app works without a key.
//
//   RESEND_API_KEY   set → real send; unset → outbox only
//   EMAIL_FROM       default "Hooray <onboarding@resend.dev>" (Resend's sandbox sender;
//                    it can only deliver to the address that owns the Resend account)
//   DIGEST_TO        overrides the approver's roster email for the demo
import fs from "node:fs";
import path from "node:path";

export type OutboundEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendResult = {
  mode: "sent" | "outbox";
  to: string;
  from: string;
  subject: string;
  id?: string; // provider message id
  outboxPath: string;
  error?: string;
};

const OUTBOX_DIR = path.join(process.cwd(), "data", "outbox");
const FROM = process.env.EMAIL_FROM ?? "Hooray <onboarding@resend.dev>";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function writeOutbox(email: OutboundEmail, stamp: string): string {
  if (process.env.DATA_MODE === "memory") return "(memory)";
  fs.mkdirSync(OUTBOX_DIR, { recursive: true });
  const slug = email.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const file = path.join(OUTBOX_DIR, `${stamp}-${slug}.html`);
  const header = `<!-- to: ${email.to}\n     from: ${FROM}\n     subject: ${email.subject} -->\n`;
  fs.writeFileSync(file, header + email.html);
  fs.writeFileSync(file.replace(/\.html$/, ".txt"), email.text);
  return file;
}

/** Send one email. Never throws: a provider failure comes back as `error` with the outbox copy still written. */
export async function sendEmail(email: OutboundEmail, opts: { stamp?: string } = {}): Promise<SendResult> {
  const stamp = opts.stamp ?? new Date().toISOString().replace(/[:.]/g, "-");
  const outboxPath = writeOutbox(email, stamp);
  const base: SendResult = { mode: "outbox", to: email.to, from: FROM, subject: email.subject, outboxPath };
  const key = process.env.RESEND_API_KEY;
  if (!key) return base;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [email.to], subject: email.subject, html: email.html, text: email.text }),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (!res.ok) return { ...base, error: `${res.status} ${body.message ?? body.name ?? res.statusText}` };
    return { ...base, mode: "sent", id: body.id };
  } catch (err) {
    return { ...base, error: String(err).slice(0, 200) };
  }
}

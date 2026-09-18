// Outbound email. Three transports behind one function, chosen by env, plus an
// on-disk outbox so every send is inspectable and the app works with no key.
//
//   EMAIL_PROVIDER   resend | brevo | mail-app | outbox   (default: whichever key is set, else outbox)
//   RESEND_API_KEY   Resend. Sandbox sender only delivers to the account owner's address.
//   BREVO_API_KEY    Brevo. Sender must be a verified address on the account; delivers anywhere.
//   mail-app         Mail.app on this Mac via AppleScript, from the default account. Plain text only.
//   EMAIL_FROM       "Hooray <you@example.com>". Resend default is its sandbox sender.
//   DIGEST_TO        overrides the approver's roster email for the demo
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type OutboundEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailProvider = "resend" | "brevo" | "mail-app" | "outbox";

export type SendResult = {
  mode: "sent" | "outbox";
  provider: EmailProvider;
  to: string;
  from: string;
  subject: string;
  id?: string; // provider message id
  outboxPath: string;
  error?: string;
};

const OUTBOX_DIR = path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "data"), "outbox");

export function emailProvider(): EmailProvider {
  const p = process.env.EMAIL_PROVIDER as EmailProvider | undefined;
  if (p && ["resend", "brevo", "mail-app", "outbox"].includes(p)) return p;
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.BREVO_API_KEY) return "brevo";
  return "outbox";
}

export function emailConfigured(): boolean {
  return emailProvider() !== "outbox";
}

function fromAddress(provider: EmailProvider): string {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (provider === "resend") return "Hooray <onboarding@resend.dev>";
  return "Hooray <hooray@example.com>";
}

function parseFrom(s: string): { name: string; email: string } {
  const m = s.match(/^\s*(?:"?([^"<]*)"?\s*)?<([^>]+)>\s*$/);
  return m ? { name: (m[1] ?? "").trim() || "Hooray", email: m[2].trim() } : { name: "Hooray", email: s.trim() };
}

function writeOutbox(email: OutboundEmail, from: string, stamp: string): string {
  if (process.env.DATA_MODE === "memory") return "(memory)";
  fs.mkdirSync(OUTBOX_DIR, { recursive: true });
  const slug = email.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const file = path.join(OUTBOX_DIR, `${stamp}-${slug}.html`);
  fs.writeFileSync(file, `<!-- to: ${email.to}\n     from: ${from}\n     subject: ${email.subject} -->\n` + email.html);
  fs.writeFileSync(file.replace(/\.html$/, ".txt"), email.text);
  return file;
}

// ---- transports ----

async function viaResend(email: OutboundEmail, from: string): Promise<{ id?: string; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [email.to], subject: email.subject, html: email.html, text: email.text }),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
  if (!res.ok) return { error: `${res.status} ${body.message ?? body.name ?? res.statusText}` };
  return { id: body.id };
}

async function viaBrevo(email: OutboundEmail, from: string): Promise<{ id?: string; error?: string }> {
  const sender = parseFrom(from);
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY ?? "", "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sender, to: [{ email: email.to }], subject: email.subject, htmlContent: email.html, textContent: email.text }),
  });
  const body = (await res.json().catch(() => ({}))) as { messageId?: string; message?: string; code?: string };
  if (!res.ok) return { error: `${res.status} ${body.message ?? body.code ?? res.statusText}` };
  return { id: body.messageId };
}

/** Mail.app on this Mac. Sends the plaintext version from the default account; no signup, no key. */
async function viaMailApp(email: OutboundEmail): Promise<{ id?: string; error?: string }> {
  const q = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const script = `
    tell application "Mail"
      set m to make new outgoing message with properties {subject:"${q(email.subject)}", content:"${q(email.text)}", visible:false}
      tell m to make new to recipient at end of to recipients with properties {address:"${q(email.to)}"}
      send m
    end tell`;
  try {
    await execFileAsync("osascript", ["-e", script], { timeout: 30_000 });
    return { id: `mail-app-${Date.now()}` };
  } catch (err) {
    return { error: String((err as { stderr?: string }).stderr ?? err).trim().slice(0, 200) };
  }
}

/** Send one email. Never throws: a provider failure comes back as `error` with the outbox copy still written. */
export async function sendEmail(email: OutboundEmail, opts: { stamp?: string } = {}): Promise<SendResult> {
  const provider = emailProvider();
  const from = provider === "mail-app" ? "Mail.app default account" : fromAddress(provider);
  const stamp = opts.stamp ?? new Date().toISOString().replace(/[:.]/g, "-");
  const outboxPath = writeOutbox(email, from, stamp);
  const base: SendResult = { mode: "outbox", provider, to: email.to, from, subject: email.subject, outboxPath };
  if (provider === "outbox") return base;
  try {
    const r = provider === "resend" ? await viaResend(email, from) : provider === "brevo" ? await viaBrevo(email, from) : await viaMailApp(email);
    if (r.error) return { ...base, error: r.error };
    return { ...base, mode: "sent", id: r.id };
  } catch (err) {
    return { ...base, error: String(err).slice(0, 200) };
  }
}

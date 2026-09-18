// Post-generation checks. Each returns a human-readable violation, fed back on retry.
import { BANNED_PHRASES, type DraftContext } from "./prompts";
import type { DraftOutput } from "./schema";
import { ART_TEMPLATES } from "../types";

const STOP = new Set(["about", "their", "there", "which", "would", "could", "should", "because", "after", "before", "until", "while", "these", "those", "other", "return", "leave", "keep", "since"]);

function words(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
function sentences(s: string): number {
  return s.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim().length > 0).length;
}
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

export function runChecks(draft: DraftOutput, ctx: DraftContext, otherCompanyNames: string[] = []): string[] {
  const v: string[] = [];
  const all = [draft.front_headline, draft.inside_message, draft.sign_off, draft.signature_line].join(" ");
  const r = ctx.recipient;
  const name = r.preferredName ?? r.firstName;

  // 1 headline
  const hw = words(draft.front_headline);
  if (hw < 2 || hw > 6) v.push(`front_headline must be 2–6 words (was ${hw})`);
  if (draft.front_headline.length > 40) v.push("front_headline must be at most 40 characters");
  if (/\.$/.test(draft.front_headline.trim())) v.push("front_headline must not end with a full stop");

  // 2 message
  const mw = words(draft.inside_message);
  const ms = sentences(draft.inside_message);
  if (mw < 12 || mw > 55) v.push(`inside_message must be 15–50 words (was ${mw})`);
  if (ms < 1 || ms > 3) v.push(`inside_message must be 1–3 sentences (was ${ms})`);

  // 3 exclamation marks
  const ex = (all.match(/!/g) ?? []).length;
  if (ex > ctx.rules.maxExclamations) v.push(`at most ${ctx.rules.maxExclamations} exclamation mark(s) allowed (found ${ex})`);

  // 4 emoji
  if (/\p{Extended_Pictographic}/u.test(all)) v.push("no emoji or pictographic symbols");

  // 5 recipient name present and exactly spelled
  const textForName = `${draft.front_headline} ${draft.inside_message}`;
  const hasName = new RegExp(`\\b${escapeRe(name)}\\b`).test(textForName);
  const companyOk = r.kind === "client" && r.clientCompanyName && textForName.includes(r.clientCompanyName);
  if (!hasName && !companyOk) v.push(`the recipient's name "${name}" must appear in the headline or message`);
  for (const w of textForName.split(/[^\p{L}'’-]+/u)) {
    if (w.length >= 3 && w[0] === name[0] && w !== name) {
      const d = levenshtein(w.toLowerCase(), name.toLowerCase());
      if (d >= 1 && d <= 2 && w.toLowerCase() !== name.toLowerCase()) v.push(`"${w}" looks like a misspelling of "${name}"`);
    }
  }

  // 6 signer
  const s = ctx.signer;
  if (!draft.signature_line.includes(s.lastName)) v.push(`signature_line must include the signer's surname "${s.lastName}"`);
  if (ctx.coSigner && !draft.signature_line.includes(ctx.coSigner.lastName)) v.push(`signature_line must also include the co-signer "${ctx.coSigner.firstName} ${ctx.coSigner.lastName}"`);
  if (draft.signature_line.includes(r.lastName) && r.lastName !== s.lastName) v.push("signature_line must not contain the recipient's name");

  // 7 banned phrases
  const lower = all.toLowerCase();
  for (const p of BANNED_PHRASES) if (lower.includes(p)) v.push(`banned phrase: "${p}"`);

  // 8 age guard
  if (/\b(1[6-9]|[2-9]\d)(st|nd|rd|th)?\b(?=[^.]*\b(birthday|years? old|years young|today))/i.test(all)) v.push("do not state or hint at the recipient's age");
  if (/\b(twenties|thirties|forties|fifties|sixties|big [1-9]0|half a century|\d decades)\b/i.test(all)) v.push("do not hint at the recipient's age or decade");

  // 9 health/family guard
  const facts = r.publicFacts.join(" ").toLowerCase();
  const hf = all.match(/\b(health|recover\w*|illness|hospital|baby|pregnan\w*|maternity|paternity|wedding|your (husband|wife|partner)|kids|children|family|loss|passed away|funeral|divorce)\b/i);
  if (hf && !facts.includes(hf[0].toLowerCase()) && ctx.occasion.type !== "sympathy" && ctx.occasion.type !== "get-well") v.push(`do not mention "${hf[0]}" unless it is in the public facts`);

  // 10 private-note tripwire
  const priv = r.privateNotes.join(" ").toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 5 && !STOP.has(w));
  const hits = new Set(priv.filter((w) => lower.includes(w)));
  if (hits.size >= 2) v.push(`draft appears to reference private notes (${[...hits].slice(0, 3).join(", ")})`);

  // 11 cross-tenant leak
  for (const n of otherCompanyNames) if (n && all.includes(n)) v.push(`mentions another company: ${n}`);

  // 12 occasion coherence
  const t = ctx.occasion.type;
  if (t === "birthday" && !/birthday/i.test(all)) v.push("a birthday card should say birthday");
  if ((t === "work-anniversary" || t === "client-anniversary") && ctx.occasion.ordinal) {
    const n = ctx.occasion.ordinal;
    const wordsN = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? "";
    const hasN = new RegExp(`\\b(${n}|${wordsN || "NO_WORD"})\\b`, "i").test(all) || (n === 10 && /\bdecade\b/i.test(all)) || (n === 1 && /\b(first year|a year|one year)\b/i.test(all));
    if (!hasN) v.push(`the anniversary number (${n}) must appear`);
  }
  if (t === "welcome" && /\b(has been|it's been|it has been) (great|a pleasure|lovely) working with you\b/i.test(all)) v.push("welcome cards must not claim to know the person already");

  // 13 spelling locale
  const us = all.match(/\b(color|favorite|honor|organiz\w*|realiz\w*|recogniz\w*|center|gotten)\b/i);
  if (us) v.push(`use British spelling ("${us[0]}")`);

  // 14 artwork
  if (!(ART_TEMPLATES as readonly string[]).includes(draft.artwork_brief.template)) v.push("artwork template not in the allowed list");

  // 15 rationale/flags
  if (!draft.rationale.trim() || draft.rationale.length > 220) v.push("rationale must be one sentence up to 220 characters");
  if (draft.flags.some((f) => f.length > 180)) v.push("each flag must be at most 180 characters");

  return v;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

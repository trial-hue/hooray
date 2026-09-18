// Drafting eval: ten cases through the real model, checks and a table. ~£0.20.
//   node --env-file=.env.local --import tsx scripts/eval.ts
import { generateDraft } from "../src/lib/ai/draft";
import type { DraftContext } from "../src/lib/ai/prompts";
import { rulesFor } from "../src/lib/rules";
import { seedCompany } from "../src/lib/seed";
import type { Occasion, Person } from "../src/lib/types";

const company = seedCompany();
const P = (p: Partial<Person> & Pick<Person, "id" | "firstName" | "lastName" | "role">): Person => ({ kind: "staff", team: "Audit", office: "Manchester", status: "active", optOut: false, consentOccasions: true, deliverTo: "office", publicFacts: [], privateNotes: [], ...p });
const O = (personId: string, type: Occasion["type"], date: string, extra: Partial<Occasion> = {}): Occasion => ({ id: `${personId}:${type}:${date}`, occurrenceKey: `${personId}:${type}:${date}`, personId, type, date, createdBy: "roster", ...extra });

const sarah = P({ id: "sarah", firstName: "Sarah", lastName: "Lindqvist", role: "Audit Manager", preferredSignature: "Sarah Lindqvist, Audit Manager", voiceSample: "Brilliant work on this. Genuinely. Now go home." });
const james = P({ id: "james", firstName: "James", lastName: "Hartley", role: "Managing Partner", preferredSignature: "James Hartley, Managing Partner", voiceSample: "Right. Good week, everyone. See you Monday." });
const nadia = P({ id: "nadia", firstName: "Nadia", lastName: "Crane", role: "Tax Partner", preferredSignature: "Nadia Crane, Tax Partner" });

type Case = { name: string; ctx: DraftContext; expect?: (text: string) => string | null };
const ctx = (recipient: Person, occasion: Occasion, signer: Person, relationship: string, extra: Partial<DraftContext> = {}): DraftContext => ({ company, occasion, recipient, signer, relationship, rules: rulesFor(recipient, occasion, company), recentCards: [], ...extra });

const cases: Case[] = [
  { name: "1 birthday, rich facts", ctx: ctx(P({ id: "chloe", firstName: "Chloe", lastName: "Bennett", role: "Audit Senior", publicFacts: ["Led the Northgate audit close in June", "Runs the Thursday lunchtime 5k club"] }), O("chloe", "birthday", "2026-10-03"), sarah, "line manager"), expect: (t) => (/northgate|5k/i.test(t) ? null : "no fact referenced") },
  { name: "2 birthday, zero facts", ctx: ctx(P({ id: "amelia", firstName: "Amelia", lastName: "Walker", role: "Audit Associate" }), O("amelia", "birthday", "2026-10-03"), sarah, "line manager") },
  { name: "3 birthday, dob known", ctx: ctx(P({ id: "gary", firstName: "Gary", lastName: "Thompson", role: "Office Coordinator", dob: "1976-10-03", publicFacts: ["Ran the Leeds office move in 2023"] }), O("gary", "birthday", "2026-10-03", { isMilestone: true }), sarah, "line manager"), expect: (t) => (/\b50\b|fifty|half a century/i.test(t) ? "age leaked" : null) },
  { name: "4 first anniversary", ctx: ctx(P({ id: "emma", firstName: "Emma", lastName: "Clarke", role: "Audit Associate", publicFacts: ["Took over the Ribble Print Works fieldwork in her first month"] }), O("emma", "work-anniversary", "2026-10-07", { ordinal: 1 }), sarah, "line manager"), expect: (t) => (/one year|first year|a year|\b1\b/i.test(t) ? null : "ordinal missing") },
  { name: "5 twenty-five years, MP", ctx: ctx(P({ id: "helen", firstName: "Helen", lastName: "Marsh", role: "Tax Manager", publicFacts: ["Joined as a trainee in 2001", "Built the Tax team from three people to thirty", "Trained most of the current partners"] }), O("helen", "work-anniversary", "2026-10-07", { ordinal: 25 }), james, "Managing Partner; not her line manager"), expect: (t) => (/\b25\b|twenty-five/i.test(t) ? null : "25 missing") },
  { name: "6 welcome", ctx: ctx(P({ id: "daniel", firstName: "Daniel", lastName: "Osei", role: "Graduate Trainee", team: "Tax", startDate: "2026-09-28", publicFacts: ["Joining from Manchester Metropolitan", "Will sit with Helen's team on the third floor"] }), O("daniel", "welcome", "2026-09-28"), james, "Managing Partner"), expect: (t) => (/\btax\b/i.test(t) ? null : "team not named") },
  { name: "7 client 5th, private note", ctx: ctx(P({ id: "alison", kind: "client", firstName: "Alison", lastName: "Reid", role: "Finance Director", team: "Bramley Holdings", clientCompanyName: "Bramley Holdings", startDate: "2021-10-02", deliverTo: "client-registered", publicFacts: ["Moved to fully outsourced finance in 2022"], privateNotes: ["retention risk, considering leaving for a cheaper firm"] }), O("alison", "client-anniversary", "2026-10-02", { ordinal: 5 }), nadia, "relationship partner for Bramley Holdings"), expect: (t) => (/!/.test(t) ? "exclamation on client card" : /retention|cheaper/i.test(t) ? "private note leaked" : null) },
  { name: "8 leaver, 8 years", ctx: ctx(P({ id: "rob", firstName: "Rob", lastName: "Sinclair", role: "Payroll Specialist", team: "Outsourcing", office: "Leeds", publicFacts: ["Never once missed a payroll run in eight years", "Famous for the Friday bacon-roll order"] }), O("rob", "leaver", "2026-10-05", { ordinal: 8 }), P({ id: "lucy", firstName: "Lucy", lastName: "Pemberton", role: "Outsourcing Manager", preferredSignature: "Lucy Pemberton, Outsourcing Manager" }), "line manager"), expect: (t) => (/next chapter|journey/i.test(t) ? "banned phrase" : null) },
  { name: "9 birthday on parental leave", ctx: ctx(P({ id: "priya", firstName: "Priya", lastName: "Shah", role: "Tax Manager", status: "on-leave", leaveReason: "parental", publicFacts: ["Runs the Tax team's graduate mentoring scheme"] }), O("priya", "birthday", "2026-10-01"), nadia, "line manager", { onLeaveNote: "The recipient is currently on leave from work. Keep the card personal. Do not mention work, the team, deadlines, workload or their return." }), expect: (t) => (/baby|maternity|back at work|return/i.test(t) ? "mentions leave/return" : null) },
  { name: "10 unusual name spelling", ctx: ctx(P({ id: "siobhan", firstName: "Siobhán", lastName: "Ní Bhriain", role: "Tax Senior" }), O("siobhan", "birthday", "2026-10-03"), nadia, "line manager"), expect: (t) => (/Siobhán/.test(t) ? null : "name respelled") },
];

async function main() {
  let fails = 0;
  let cost = 0;
  const rows: Record<string, string | number>[] = [];
  for (const c of cases) {
    const r = await generateDraft(c.ctx, { bypassCache: true });
    const text = `${r.draft.front_headline} ${r.draft.inside_message} ${r.draft.sign_off} ${r.draft.signature_line}`;
    const extra = c.expect ? c.expect(text) : null;
    const problems = [...r.violations, ...(extra ? [extra] : [])];
    if (problems.length || r.source !== "claude") fails++;
    const { aiCostGbp } = await import("../src/lib/costs");
    const gbp = aiCostGbp(r.model, r.usage);
    cost += gbp;
    rows.push({ case: c.name, ok: problems.length === 0 && r.source === "claude" ? "✓" : "✗", src: r.source, tries: r.attempts, words: r.draft.inside_message.split(/\s+/).length, s: (r.ms / 1000).toFixed(1), "£": gbp.toFixed(4), problems: problems.join("; ").slice(0, 80) });
    console.log(`\n── ${c.name} ──\n${r.draft.front_headline}\n${r.draft.inside_message}\n${r.draft.sign_off} ${r.draft.signature_line}\n[${r.draft.artwork_brief.template}/${r.draft.artwork_brief.palette_variant}] ${r.draft.rationale}${r.draft.flags.length ? `\nflags: ${r.draft.flags.join(" | ")}` : ""}`);
  }
  console.log();
  console.table(rows);
  console.log(`total £${cost.toFixed(3)} · ${fails} failing`);
  process.exit(fails ? 1 : 0);
}
main();

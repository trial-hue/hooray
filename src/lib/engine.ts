import { addDays, isMonday } from "./dates";
import { logEvent } from "./db";
import { resolveDelivery } from "./delivery";
import { gate } from "./gate";
import { materialiseOccasions } from "./occasions";
import { rulesFor } from "./rules";
import { chooseSigners, relationshipOf } from "./signers";
import { generateDraft, DRAFT_MODEL } from "./ai/draft";
import { templateDraft } from "./ai/template";
import type { DraftContext, RecentCard } from "./ai/prompts";
import { aiCostGbp } from "./costs";
import { fnv1a } from "./rng";
import { parseRoster, toCsv } from "./roster";
import { seedCompany, seedPeople } from "./seed";
import { submitBatch, progressPrintJobs } from "./printPartner";
import { SIM_START, type Card, type CardStatus, type DB, type Digest, type DraftVersion, type ISODate, type Occasion, type Person, type Usage } from "./types";

const AI_DISABLED = process.env.AI_DISABLED === "1";
const CONCURRENCY = 4;

// ---------- clock ----------

export async function tick(db: DB, target: ISODate): Promise<void> {
  while (db.clock.today < target) {
    db.clock.today = addDays(db.clock.today, 1);
    for (const e of progressPrintJobs(db)) logEvent(db, e);
    if (isMonday(db.clock.today)) await buildDigest(db, db.clock.today);
  }
}

// ---------- roster ----------

export async function loadDemoRoster(db: DB): Promise<{ staff: number; clients: number; warnings: string[] }> {
  const csv = toCsv(seedPeople(), new Map(seedPeople().map((p) => [p.id, p])));
  return importRoster(db, csv, seedCompany());
}

export async function importRoster(db: DB, csv: string, company = db.company): Promise<{ staff: number; clients: number; warnings: string[] }> {
  const { people, warnings } = parseRoster(csv);
  db.company = company ?? db.company;
  db.people = people;
  db.occasions = [];
  db.cards = [];
  db.digests = [];
  db.printJobs = [];
  db.clock = { today: SIM_START, startedOn: SIM_START, log: [] };
  const staff = people.filter((p) => p.kind === "staff").length;
  const clients = people.length - staff;
  logEvent(db, `Imported roster: ${staff} staff, ${clients} clients${warnings.length ? ` (${warnings.length} warnings)` : ""}`);
  await buildDigest(db, db.clock.today);
  return { staff, clients, warnings };
}

// ---------- digest ----------

export async function buildDigest(db: DB, monday: ISODate): Promise<Digest | undefined> {
  if (!db.company || db.people.length === 0) return undefined;
  const id = `digest-${monday}`;
  if (db.digests.some((d) => d.id === id)) return undefined;
  const from = addDays(monday, 7);
  const to = addDays(monday, 13);
  const occs = materialiseOccasions(db, from, to);
  const digest: Digest = { id, weekStart: monday, coversFrom: from, coversTo: to, cardIds: [], status: "open", createdOn: monday };

  const toDraft: Card[] = [];
  let held = 0;
  let skipped = 0;
  for (const occ of occs) {
    if (db.cards.some((c) => c.occurrenceKey === occ.occurrenceKey)) continue;
    if (!db.occasions.some((o) => o.id === occ.id)) db.occasions.push(occ);
    const person = db.people.find((p) => p.id === occ.personId);
    if (!person) continue;
    const signers = chooseSigners(db, person, occ);
    const signer = signers ? db.people.find((p) => p.id === signers.signerId) : undefined;
    const delivery = resolveDelivery(person, db.company, occ.date);
    const g = gate(person, occ, signer, delivery?.address, false);
    const card: Card = {
      id: `card-${fnv1a(occ.occurrenceKey).toString(36)}`,
      occurrenceKey: occ.occurrenceKey,
      occasionId: occ.id,
      personId: person.id,
      signerId: signers?.signerId ?? db.company.managingPartnerId ?? "",
      coSignerId: signers?.coSignerId,
      dueDate: occ.date,
      status: "held",
      flags: [],
      versions: [],
      seed: fnv1a(occ.occurrenceKey),
      digestId: id,
      history: [],
      aiCostGbp: 0,
    };
    if (!g.ok) {
      card.holdReason = g.reason;
      if (g.reason === "opted-out" || g.reason === "left-company") {
        card.status = "skipped";
        card.skipReason = g.message;
        skipped++;
      } else {
        card.status = "held";
        card.flags.push({ kind: "gate", text: g.message });
        held++;
      }
      card.history.push({ at: monday, status: card.status, note: g.message });
    } else {
      for (const w of g.warnings) card.flags.push({ kind: "gate", text: w.message });
      toDraft.push(card);
    }
    db.cards.push(card);
    digest.cardIds.push(card.id);
  }
  db.digests.push(digest);
  logEvent(db, `Detected ${occs.length} occasions for ${from} – ${to}${held ? `, ${held} held` : ""}${skipped ? `, ${skipped} skipped` : ""}`);

  if (toDraft.length) {
    const t0 = Date.now();
    const stats = await draftMany(db, toDraft);
    logEvent(db, `Drafted ${toDraft.length} cards in ${((Date.now() - t0) / 1000).toFixed(1)}s (${stats.cache} cached, ${stats.claude} live, ${stats.template} template)`);
  }
  return digest;
}

async function draftMany(db: DB, cards: Card[]): Promise<{ cache: number; claude: number; template: number }> {
  const stats = { cache: 0, claude: 0, template: 0 };
  let i = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, cards.length) }, async () => {
    while (i < cards.length) {
      const c = cards[i++];
      const src = await draftCard(db, c);
      stats[src]++;
    }
  });
  await Promise.all(workers);
  return stats;
}

// ---------- drafting ----------

export function buildContext(db: DB, card: Card): DraftContext | undefined {
  const occ = db.occasions.find((o) => o.id === card.occasionId);
  const recipient = db.people.find((p) => p.id === card.personId);
  const signer = db.people.find((p) => p.id === card.signerId);
  if (!occ || !recipient || !signer || !db.company) return undefined;
  const coSigner = card.coSignerId ? db.people.find((p) => p.id === card.coSignerId) : undefined;
  const recentCards: RecentCard[] = db.cards
    .filter((c) => c.personId === recipient.id && c.id !== card.id && c.finalText)
    .slice(-2)
    .map((c) => ({ type: db.occasions.find((o) => o.id === c.occasionId)?.type ?? "card", date: c.dueDate, front_headline: c.finalText!.front_headline, inside_message: c.finalText!.inside_message }));
  const onLeave = recipient.status === "on-leave";
  return {
    company: db.company,
    occasion: occ,
    recipient,
    signer,
    coSigner,
    relationship: relationshipOf(signer, recipient, db.company),
    rules: rulesFor(recipient, occ, db.company),
    recentCards,
    onLeaveNote: onLeave ? "The recipient is currently on leave from work. Keep the card personal. Do not mention work, the team, deadlines, workload or their return." : undefined,
  };
}

export async function draftCard(db: DB, card: Card, opts: { hint?: string; bypassCache?: boolean } = {}): Promise<"cache" | "claude" | "template"> {
  const ctx = buildContext(db, card);
  if (!ctx) {
    card.status = "held";
    card.flags.push({ kind: "gate", text: "Could not build drafting context (missing person, signer or occasion)." });
    return "template";
  }
  const previous = card.versions[card.versions.length - 1]?.draft;
  let version: DraftVersion;
  let violations: string[] = [];
  if (AI_DISABLED) {
    version = { draft: templateDraft(ctx), createdAt: db.clock.today, promptHash: "disabled", model: "template", usage: zeroUsage(), attempts: 0, source: "template" };
  } else {
    const r = await generateDraft(ctx, { hint: opts.hint, previous: opts.hint ? previous : undefined, bypassCache: opts.bypassCache, otherCompanyNames: [] });
    version = { draft: r.draft, createdAt: db.clock.today, hint: opts.hint, promptHash: r.promptHash, model: r.model, usage: r.usage, attempts: r.attempts, source: r.source, ms: r.ms };
    violations = r.violations;
  }
  card.versions.push(version);
  card.aiCostGbp += aiCostGbp(version.model, version.usage);
  // rebuild flags: keep gate flags, replace model/check flags
  card.flags = card.flags.filter((f) => f.kind === "gate");
  for (const f of version.draft.flags) card.flags.push({ kind: "model", text: f });
  for (const v of violations) card.flags.push({ kind: "check", text: v });
  card.violations = violations.length ? violations : undefined;
  card.status = violations.length ? "needs_review" : "drafted";
  card.history.push({ at: db.clock.today, status: card.status, note: opts.hint ? `Regenerated: ${opts.hint}` : `${version.source} draft` });
  return version.source;
}

function zeroUsage(): Usage {
  return { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
}

// ---------- card actions ----------

const FROZEN: CardStatus[] = ["approved", "edited", "skipped", "sent_to_print", "printed", "posted", "delivered"];

export function isFrozen(card: Card): boolean {
  return FROZEN.includes(card.status);
}

export function approveCard(db: DB, card: Card, by: string): void {
  if (isFrozen(card)) return;
  const d = card.versions[card.versions.length - 1]?.draft;
  if (!d) return;
  card.finalText = card.finalText ?? { front_headline: d.front_headline, inside_message: d.inside_message, sign_off: d.sign_off, signature_line: d.signature_line };
  card.status = "approved";
  card.approvedBy = by;
  card.approvedAt = db.clock.today;
  card.history.push({ at: db.clock.today, status: "approved" });
}

export function editCard(db: DB, card: Card, insideMessage: string, by: string): void {
  if (FROZEN.includes(card.status) && card.status !== "approved" && card.status !== "edited") return;
  const d = card.versions[card.versions.length - 1]?.draft;
  if (!d) return;
  const base = card.finalText ?? { front_headline: d.front_headline, inside_message: d.inside_message, sign_off: d.sign_off, signature_line: d.signature_line };
  card.finalText = { ...base, inside_message: insideMessage.trim() };
  card.status = "edited";
  card.editedAt = db.clock.today;
  card.approvedBy = by;
  card.approvedAt = db.clock.today;
  card.flags = card.flags.filter((f) => f.kind !== "check");
  card.history.push({ at: db.clock.today, status: "edited", note: "Inside message edited by approver" });
}

export function skipCard(db: DB, card: Card, reason: string): void {
  if (["sent_to_print", "printed", "posted", "delivered"].includes(card.status)) return;
  card.status = "skipped";
  card.skipReason = reason;
  card.history.push({ at: db.clock.today, status: "skipped", note: reason });
}

export function changeSigner(db: DB, card: Card, signerId: string): void {
  if (isFrozen(card)) return;
  const s = db.people.find((p) => p.id === signerId);
  if (!s) return;
  card.signerId = signerId;
  card.coSignerId = undefined;
  const d = card.versions[card.versions.length - 1]?.draft;
  if (d) d.signature_line = s.preferredSignature ?? `${s.firstName} ${s.lastName}, ${s.role}`;
  card.history.push({ at: db.clock.today, status: card.status, note: `Signer changed to ${s.firstName} ${s.lastName}` });
}

export async function releaseHeld(db: DB, card: Card): Promise<void> {
  if (card.status !== "held" && card.status !== "skipped") return;
  const person = db.people.find((p) => p.id === card.personId);
  const occ = db.occasions.find((o) => o.id === card.occasionId);
  if (person && occ && !card.signerId) {
    const s = chooseSigners(db, person, occ);
    if (s) {
      card.signerId = s.signerId;
      card.coSignerId = s.coSignerId;
    }
  }
  card.history.push({ at: db.clock.today, status: card.status, note: "Released by approver" });
  await draftCard(db, card);
}

export function submitDigest(db: DB, digest: Digest): { job?: ReturnType<typeof submitBatch>; sent: number } {
  const cards = digest.cardIds
    .map((id) => db.cards.find((c) => c.id === id)!)
    .filter((c) => c && (c.status === "approved" || c.status === "edited"));
  if (cards.length === 0) return { sent: 0 };
  const job = submitBatch(db, digest, cards);
  for (const c of cards) {
    c.status = "sent_to_print";
    c.printJobId = job.id;
    c.history.push({ at: db.clock.today, status: "sent_to_print", note: job.ref });
  }
  digest.status = "submitted";
  digest.submittedOn = db.clock.today;
  logEvent(db, `Submitted ${cards.length} cards to print as ${job.ref}`);
  return { job, sent: cards.length };
}

export function openDigest(db: DB): Digest | undefined {
  return [...db.digests].reverse().find((d) => d.status === "open");
}

export function personOf(db: DB, id: string): Person | undefined {
  return db.people.find((p) => p.id === id);
}

export function occasionOf(db: DB, card: Card): Occasion | undefined {
  return db.occasions.find((o) => o.id === card.occasionId);
}

export { DRAFT_MODEL };

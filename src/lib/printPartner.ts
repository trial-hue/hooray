import fs from "node:fs";
import path from "node:path";
import { addBusinessDays } from "./dates";
import { resolveDelivery } from "./delivery";
import { finalTextOf, type Card, type DB, type Digest, type PrintJob } from "./types";

// Mock print partner. Writes a Prodigi-shaped order and returns a job whose
// status is a pure function of the simulated date.

const PRINT_SPEC = {
  product: "greeting-card-a5-folded",
  sku: "GLOBAL-GRE-A5-330",
  stock: "330gsm silk, FSC",
  finish: "matt",
  flat_size_mm: [297, 210],
  bleed_mm: 3,
  pages: 2,
  duplex: "short-edge",
  fold: "vertical-centre",
  envelope: "C5 white, sealed, recipient name printed",
};

export function submitBatch(db: DB, digest: Digest | undefined, cards: Card[]): PrintJob {
  const n = db.printJobs.length + 1;
  const ref = `MOCK-${String(n).padStart(4, "0")}`;
  const today = db.clock.today;
  const job: PrintJob = {
    id: `job-${n}`,
    digestId: digest?.id,
    cardIds: cards.map((c) => c.id),
    submittedOn: today,
    provider: "mock-prodigi",
    ref,
    expected: {
      printed: addBusinessDays(today, 1),
      posted: addBusinessDays(today, 2),
      delivered: addBusinessDays(today, 4),
    },
  };
  const order = {
    merchantReference: ref,
    shippingMethod: "Budget",
    submittedOn: today,
    spec: PRINT_SPEC,
    items: cards.map((c) => {
      const p = db.people.find((x) => x.id === c.personId)!;
      const d = resolveDelivery(p, db.company, c.dueDate);
      const t = finalTextOf(c);
      return {
        cardId: c.id,
        sku: PRINT_SPEC.sku,
        copies: 1,
        recipient: d ? { name: d.attention, address: d.address, envelopeLine: d.envelopeLine, mode: d.mode } : null,
        assets: [{ printArea: "default", url: `/api/cards/${c.id}/pdf?download=1` }],
        headline: t?.front_headline,
        dueDate: c.dueDate,
      };
    }),
  };
  try {
    const dir = path.join(process.cwd(), "data", "print-orders");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${ref}.json`);
    fs.writeFileSync(file, JSON.stringify(order, null, 1));
    job.orderPath = `data/print-orders/${ref}.json`;
  } catch {
    // best effort on read-only hosts
  }
  db.printJobs.push(job);
  return job;
}

/** Advance card statuses according to the simulated date. */
export function progressPrintJobs(db: DB): string[] {
  const events: string[] = [];
  const today = db.clock.today;
  for (const job of db.printJobs) {
    const counts = { printed: 0, posted: 0, delivered: 0 };
    for (const id of job.cardIds) {
      const c = db.cards.find((x) => x.id === id);
      if (!c) continue;
      const order: Card["status"][] = ["sent_to_print", "printed", "posted", "delivered"];
      let idx = order.indexOf(c.status);
      if (idx < 0) continue;
      const target = today >= job.expected.delivered ? 3 : today >= job.expected.posted ? 2 : today >= job.expected.printed ? 1 : 0;
      while (idx < target) {
        idx++;
        c.status = order[idx];
        c.history.push({ at: today, status: c.status });
        counts[order[idx] as "printed" | "posted" | "delivered"]++;
      }
    }
    for (const k of ["printed", "posted", "delivered"] as const) {
      if (counts[k] > 0) events.push(`${job.ref}: ${counts[k]} card${counts[k] === 1 ? "" : "s"} ${k}`);
    }
  }
  return events;
}

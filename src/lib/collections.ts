// Team collections: fire on the occasions people actually give for.
import { fnv1a } from "./rng";
import type { Card, Collection, DB, Occasion, Person } from "./types";

export const SUGGESTED_PENCE = 1000;

export const GIFT_RANGE: { id: string; name: string; fromPence: number; blurb: string }[] = [
  { id: "hamper", name: "Northern food hamper", fromPence: 6000, blurb: "Cheese, chutney and beer from makers within an hour of the office." },
  { id: "experience", name: "Experience voucher", fromPence: 7500, blurb: "Cookery school, a day at the races, or a spa afternoon." },
  { id: "garden", name: "Garden centre gift card", fromPence: 5000, blurb: "For people who say they are going to spend more time outdoors." },
  { id: "books", name: "Independent bookshop credit", fromPence: 4000, blurb: "A year of good reading, chosen by them." },
  { id: "dinner", name: "Dinner for two", fromPence: 8000, blurb: "At one of six restaurants the team has already argued about." },
  { id: "charity", name: "Donation in their name", fromPence: 0, blurb: "To a charity they choose. The card says so." },
  { id: "cash", name: "Just the money", fromPence: 0, blurb: "Always allowed. Transferred with the card." },
];

/** Immediate team: same manager, plus the manager, plus direct reports. Never the whole firm. */
export function teamOf(db: DB, person: Person): Person[] {
  const ids = new Set<string>();
  if (person.managerId) ids.add(person.managerId);
  for (const p of db.people) {
    if (p.kind !== "staff" || p.status === "left" || p.id === person.id) continue;
    if (person.managerId && p.managerId === person.managerId) ids.add(p.id);
    if (p.managerId === person.id) ids.add(p.id);
  }
  return [...ids].map((id) => db.people.find((p) => p.id === id)!).filter(Boolean);
}

export function openCollection(db: DB, person: Person, occ: Occasion, card: Card, closesOn: string): Collection {
  const team = teamOf(db, person);
  const c: Collection = {
    id: `col-${fnv1a(occ.occurrenceKey).toString(36)}`,
    occasionId: occ.id,
    personId: person.id,
    cardId: card.id,
    teamIds: team.map((p) => p.id),
    suggestedPence: SUGGESTED_PENCE,
    closesOn,
    status: "open",
    contributions: [],
    openedOn: db.clock.today,
  };
  db.collections.push(c);
  card.collectionId = c.id;
  return c;
}

export function contribute(db: DB, col: Collection, contributorId: string, amountPence: number, message: string): void {
  if (col.status !== "open") return;
  const existing = col.contributions.find((x) => x.contributorId === contributorId);
  if (existing) {
    existing.amountPence = amountPence;
    existing.message = message;
    existing.at = db.clock.today;
  } else {
    col.contributions.push({ contributorId, amountPence, message, at: db.clock.today });
  }
}

export function potPence(col: Collection): number {
  return col.contributions.reduce((s, c) => s + c.amountPence, 0);
}

export function closeCollection(db: DB, col: Collection): void {
  if (col.status === "closed") return;
  col.status = "closed";
}

export function chooseGift(col: Collection, giftId: string): void {
  col.giftChoice = giftId;
}

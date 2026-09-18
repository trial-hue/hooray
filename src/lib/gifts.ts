// Company-paid gifts: attached by policy to staff milestones and client dates.
// Recorded, priced and shown; fulfilment is a later job.
import { GIFT_RANGE } from "./collections";
import { UNIT } from "./costs";
import type { Card, CardGift, Occasion, Person } from "./types";

export function defaultGiftFor(occ: Occasion, person: Person): CardGift | undefined {
  if (!occ.companyGiftEligible) return undefined;
  const reason: CardGift["reason"] = person.kind === "client" ? "client" : "staff-milestone";
  const valuePence = Math.round((reason === "client" ? UNIT.clientGiftValueGbp : UNIT.staffMilestoneGiftValueGbp) * 100);
  const priced = GIFT_RANGE.filter((g) => g.fromPence > 0);
  const pick = priced.filter((g) => g.fromPence <= valuePence).sort((a, b) => b.fromPence - a.fromPence)[0] ?? priced.sort((a, b) => a.fromPence - b.fromPence)[0];
  return { id: pick.id, name: pick.name, valuePence: Math.max(pick.fromPence, valuePence), paidBy: "company", reason };
}

export function setCardGift(card: Card, giftId: string | null): void {
  if (!giftId) {
    card.gift = undefined;
    return;
  }
  const g = GIFT_RANGE.find((x) => x.id === giftId);
  if (!g) return;
  const reason = card.gift?.reason ?? "staff-milestone";
  const base = reason === "client" ? UNIT.clientGiftValueGbp : UNIT.staffMilestoneGiftValueGbp;
  card.gift = { id: g.id, name: g.name, valuePence: Math.max(g.fromPence, Math.round(base * 100)), paidBy: "company", reason };
}

export function giftLabel(g: CardGift): string {
  return `${g.name} · £${(g.valuePence / 100).toFixed(0)}`;
}

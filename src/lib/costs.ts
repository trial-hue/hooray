// Unit economics. One place to edit. All GBP. Sources: docs/BUSINESS_PLAN.md.
import type { Usage } from "./types";

export const PRICES_USD_PER_MTOK: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number }> = {
  "claude-opus-5": { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
  "claude-sonnet-5": { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
};
export const USD_GBP = Number(process.env.USD_GBP ?? 0.78);

export const UNIT = {
  /** Pricing: all-inclusive per seat. Covers every company occasion plus six personal cards a year. */
  pricePerEmployeePerYearGbp: 30,
  /** Client contacts on the roster: platform fee per contact per year, plus per card at Moonpig for Business parity. */
  clientPlatformPerContactGbp: 0.5,
  clientCardPriceGbp: 3.6,
  /** Card cost, all-in (A5 card, C5 envelope, economy post). Production: Docmail. Prototype: Stannp. */
  cardCostProductionGbp: 1.39,
  cardCostPrototypeGbp: 1.15,
  aiFallbackGbp: 0.02,
  /** Occasions per employee per year the seat is expected to cover (birthday + anniversary, plus welcomes/leavers). */
  occasionsPerEmployeePerYear: 2,
  personalCardsPerEmployee: 6,
  personalAllowanceTakeUp: 0.4,
  manualMinutesPerCard: 8,
  digestSecondsPerCard: 20,
  /** Collections: blended take on the pot (2% fee on cash/gift card, 25% margin on sourced gifts). */
  collectionBlendedTake: 0.11,
  /** Client gifts [E]: one in ten client contacts a year at ~£50. Gift value under management, not revenue. */
  clientGiftRate: 0.1,
  clientGiftValueGbp: 50,
  teamSize: 4,
};

export const MOONPIG = {
  revenueGbp: 373_000_000,
  grossMargin: 0.584,
  ebitdaGbp: 104_600_000,
  marketingGbp: 38_700_000, // 10.4% of revenue
  employees: 676,
  ordersPerYear: 36_000_000,
  activeCustomers: 12_300_000,
  ordersPerCustomer: 2.92,
  aov: 9.32,
  consumerCardPrice: 3.99,
  consumerPostage: 1.9,
  businessCardPrice: 3.6, // Moonpig for Business
  remindersStored: 113_000_000,
  segmentGrossMargin: 0.559, // [V] Moonpig segment; the group figure blends in Experiences
  experiencesGrossMargin: 0.938, // [V]
  shippingGbp: 88_200_000, // [V] shipping and logistics, 23.6% of revenue, grew 9.4%
  inventoryCostPct: 0.145, // [V]
  cardsRevenueGbp: 203_500_000, // [V] Moonpig plus Greetz, cards
  attachedGiftingGbp: 123_800_000, // [V]
  standaloneGiftingGbp: 8_200_000, // [V]
  cardsAndGiftsRevenueGbp: 335_500_000, // [V] Moonpig plus Greetz: £203.5m cards + £132m gifts
  ordersChangeFy22ToFy26: -0.095, // [V] category volume shrinking; AOV +21%
  aovChangeFy22ToFy26: 0.21, // [V]
  giftAttachRate: 0.179, // [V]
  giftRevenuePerAttachedOrder: 19, // [V] ~£19
  cardsPerCustomerPerYear: 3.5, // [V]
  occasionCaptureRate: 0.18, // [V] 3.5 cards against ~19 bought
  groupCardMaxContributors: 50, // [V] Moonpig group cards, shared by link
};
export const MOONPIG_DERIVED = {
  revenuePerEmployee: MOONPIG.revenueGbp / MOONPIG.employees, // ~£552k
  marketingPct: MOONPIG.marketingGbp / MOONPIG.revenueGbp, // 10.4%
  marketingPerOrder: MOONPIG.marketingGbp / MOONPIG.ordersPerYear, // £1.08
  consumerAllIn: MOONPIG.consumerCardPrice + MOONPIG.consumerPostage, // £5.89
  internalCardCostEstimate: 1.05, // [E] business plan estimate
  cogsPerOrder: MOONPIG.aov * (1 - MOONPIG.grossMargin),
  // Shipping figures are context only. Never show a card-cost comparison against Moonpig: a sub-scale
  // entrant pays an estimated £0.30–0.60 MORE per card than Moonpig does. Our margin is the seat.
  shippingPerOrder: MOONPIG.shippingGbp / MOONPIG.ordersPerYear, // [D] ~£2.45
  shippingPct: MOONPIG.shippingGbp / MOONPIG.revenueGbp, // [D] 23.6%
  giftShareOfRevenue: (MOONPIG.attachedGiftingGbp + MOONPIG.standaloneGiftingGbp) / MOONPIG.cardsAndGiftsRevenueGbp, // [D] £132m / £335.5m ≈ 39%
};

/** Seat margin: the cost story. Print is ~£2.78 of a £30 seat (two company cards a year at £1.39). */
export function seatMargin(cardCostGbp = UNIT.cardCostProductionGbp, aiGbp = UNIT.aiFallbackGbp) {
  const price = UNIT.pricePerEmployeePerYearGbp;
  const printPerSeat = UNIT.occasionsPerEmployeePerYear * cardCostGbp; // £2.78 at £1.39 [V]
  const aiPerSeat = UNIT.occasionsPerEmployeePerYear * aiGbp;
  const infraPerSeat = 120 / 200; // [E] £120 of infrastructure per 200-seat account
  const cost = printPerSeat + aiPerSeat + infraPerSeat;
  return { price, printPerSeat, aiPerSeat, infraPerSeat, cost, margin: (price - cost) / price };
}

/** Phase 2 consumer pricing. DESIGNED, NOT TESTED [E]. No consumer UI today; used only for the dashboard's phase 2 line. */
export const CONSUMER = {
  perCardGbp: 5.49, // including post; matches Moonpig's £5.89 within a few pence
  subscriptionMonthlyGbp: 4.99, // up to twelve cards a year, sent automatically
  subscriptionCardsPerYear: 12,
  subscriberCardsUsed: 8, // [E]
  payPerCardCardsPerYear: 3.5, // [A] Moonpig's own frequency
  subscriberShare: 0.1, // [E]
  employeeActivation: 0.3, // [E] share of employees who activate a personal account
};

export function aiCostGbp(model: string, u: Usage): number {
  const p = PRICES_USD_PER_MTOK[model] ?? PRICES_USD_PER_MTOK["claude-opus-5"];
  const usd = (u.input_tokens * p.input + u.output_tokens * p.output + u.cache_read_input_tokens * p.cacheRead + u.cache_creation_input_tokens * p.cacheWrite) / 1e6;
  return usd * USD_GBP;
}

/** Cost of one card, all in. */
export function cardCost(aiGbp = UNIT.aiFallbackGbp, tier: "production" | "prototype" = "production"): { print: number; ai: number; total: number } {
  const print = tier === "production" ? UNIT.cardCostProductionGbp : UNIT.cardCostPrototypeGbp;
  return { print, ai: aiGbp, total: print + aiGbp };
}

/** Account A from the business plan, scaled to this roster. */
export function seatEconomics(staff: number, cardsPerYear: number, aiGbp = UNIT.aiFallbackGbp) {
  const revenue = staff * UNIT.pricePerEmployeePerYearGbp;
  const companyCards = cardsPerYear;
  const personalCards = staff * UNIT.personalCardsPerEmployee * UNIT.personalAllowanceTakeUp;
  const cost = (companyCards + personalCards) * (UNIT.cardCostProductionGbp + aiGbp) + 120;
  return { revenue, cost, grossProfit: revenue - cost, margin: revenue > 0 ? (revenue - cost) / revenue : 0, companyCards, personalCards };
}

export function gbp(n: number, dp = 2): string {
  return `£${n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
}
export function pence(n: number): string {
  return n < 0.1 ? `${(n * 100).toFixed(1)}p` : gbp(n);
}
export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

// Unit economics. One place to edit. All GBP.
import type { Usage } from "./types";

export const PRICES_USD_PER_MTOK: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number }> = {
  "claude-opus-5": { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
  "claude-sonnet-5": { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
};
export const USD_GBP = Number(process.env.USD_GBP ?? 0.78);

export const UNIT = {
  printGbp: 1.3, // Prodigi A5 330gsm classic card, envelope included (from £1.10)
  postageStaffBatchedGbp: 0.6, // one tracked parcel to the office, ~8 cards
  postageClientGbp: 1.2, // business 2nd class letter + handling
  postageFirstClassGbp: 1.7,
  aiFallbackGbp: 0.02,
  priceGbp: 6.0,
  pricePerEmployeePerYearGbp: 12.0,
  manualMinutesPerCard: 8,
  digestSecondsPerCard: 20,
};

export const MOONPIG = {
  aov: 9.32,
  grossMargin: 0.584,
  ordersPerYear: 36_000_000,
  marketingPerYearGbp: 75_000_000,
  revenueGbp: 373_000_000,
  employees: 763,
  cardPrice: 3.99,
  postageFirstClass: 1.7,
  postageTracked: 2.79,
};
export const MOONPIG_DERIVED = {
  cogsPerOrder: MOONPIG.aov * (1 - MOONPIG.grossMargin), // £3.88
  grossProfitPerOrder: MOONPIG.aov * MOONPIG.grossMargin, // £5.44
  marketingPerOrder: MOONPIG.marketingPerYearGbp / MOONPIG.ordersPerYear, // £2.08
  contributionPerOrder: MOONPIG.aov * MOONPIG.grossMargin - MOONPIG.marketingPerYearGbp / MOONPIG.ordersPerYear, // £3.36
  revenuePerEmployee: MOONPIG.revenueGbp / MOONPIG.employees, // £489k
  customerPaysPerCard: MOONPIG.cardPrice + MOONPIG.postageFirstClass, // £5.69
};

export function aiCostGbp(model: string, u: Usage): number {
  const p = PRICES_USD_PER_MTOK[model] ?? PRICES_USD_PER_MTOK["claude-opus-5"];
  const usd = (u.input_tokens * p.input + u.output_tokens * p.output + u.cache_read_input_tokens * p.cacheRead + u.cache_creation_input_tokens * p.cacheWrite) / 1e6;
  return usd * USD_GBP;
}

export type PostageMode = "staff-batched" | "client" | "first-class";

export function postageFor(mode: PostageMode): number {
  return mode === "staff-batched" ? UNIT.postageStaffBatchedGbp : mode === "client" ? UNIT.postageClientGbp : UNIT.postageFirstClassGbp;
}

export function cardCost(mode: PostageMode, aiGbp = UNIT.aiFallbackGbp): { print: number; postage: number; ai: number; total: number; margin: number } {
  const print = UNIT.printGbp;
  const postage = postageFor(mode);
  const total = print + postage + aiGbp;
  return { print, postage, ai: aiGbp, total, margin: (UNIT.priceGbp - total) / UNIT.priceGbp };
}

export function gbp(n: number, dp = 2): string {
  return `£${n.toFixed(dp)}`;
}
export function pence(n: number): string {
  return n < 0.1 ? `${(n * 100).toFixed(1)}p` : gbp(n);
}
export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

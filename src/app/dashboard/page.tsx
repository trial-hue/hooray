import { Fragment } from "react";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { getDb } from "@/lib/db";
import { addDays, daysBetween, formatLong } from "@/lib/dates";
import { cardCost, CONSUMER, gbp, MOONPIG, MOONPIG_DERIVED, pct, pence, seatEconomics, seatMargin, UNIT } from "@/lib/costs";
import { materialiseOccasions } from "@/lib/occasions";
import { potPence } from "@/lib/collections";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const staff = db.people.filter((p) => p.kind === "staff" && p.status !== "left");
  const clients = db.people.filter((p) => p.kind === "client");
  const daysRun = Math.max(1, daysBetween(db.clock.startedOn, db.clock.today));
  const yearAhead = materialiseOccasions(db, db.clock.today, addDays(db.clock.today, 365));

  const sent = db.cards.filter((c) => ["sent_to_print", "printed", "posted", "delivered"].includes(c.status));
  const drafted = db.cards.filter((c) => c.versions.length > 0);
  const decided = db.cards.filter((c) => ["approved", "edited", "skipped", "sent_to_print", "printed", "posted", "delivered"].includes(c.status));
  const editedCount = db.cards.filter((c) => c.history.some((h) => h.status === "edited")).length;
  const skipped = db.cards.filter((c) => c.status === "skipped").length;
  const approvedUnedited = decided.filter((c) => c.status !== "skipped" && !c.history.some((h) => h.status === "edited")).length;
  const approveRate = decided.length - skipped > 0 ? approvedUnedited / (decided.length - skipped) : 0;
  const autoApproved = db.cards.filter((c) => c.autoApproved).length;
  const aiTotal = drafted.reduce((s, c) => s + c.aiCostGbp, 0);
  const aiPerCard = drafted.length ? aiTotal / drafted.length : UNIT.aiFallbackGbp;
  const liveDrafts = drafted.filter((c) => c.versions.some((v) => v.source === "claude")).length;
  const cost = cardCost(aiPerCard);
  const touches = db.cards.reduce((s, c) => s + c.history.filter((h) => ["approved", "edited", "skipped"].includes(h.status) && h.note !== "Auto-approved at dispatch").length, 0);
  const hoursSaved = (sent.length * (UNIT.manualMinutesPerCard - UNIT.digestSecondsPerCard / 60)) / 60;
  const cardsPerYear = yearAhead.length;
  const seats = seatEconomics(staff.length, cardsPerYear, aiPerCard);
  const collections = db.collections;
  const potTotal = collections.reduce((s, c) => s + potPence(c), 0) / 100;
  const contributors = collections.reduce((s, c) => s + c.contributions.length, 0);
  const moonpigAdminPerCard = (UNIT.manualMinutesPerCard / 60) * 15;
  const clientGiftValue = clients.length * UNIT.clientGiftRate * UNIT.clientGiftValueGbp; // [E]
  const giftUnderManagement = potTotal + clientGiftValue;
  const seat = seatMargin(UNIT.cardCostProductionGbp, aiPerCard);
  const seatDoubled = seatMargin(UNIT.cardCostProductionGbp * 2, aiPerCard);

  const versus: [string, string, string, string, string][] = [
    ["Gross margin", pct(seats.margin), `on ${gbp(seats.revenue, 0)} of seats for this roster`, pct(MOONPIG.segmentGrossMargin), "Moonpig segment, FY26 [V]"],
    ["Where the margin sits", `${gbp(seat.printPerSeat)} of £30`, `print in a seat: two cards a year at ${gbp(UNIT.cardCostProductionGbp)} [V] · the seat clears ${pct(seatDoubled.margin)} even if card cost doubles [D]`, `${pct(MOONPIG_DERIVED.shippingPct)} of revenue`, "shipping and logistics, £88.2m, growing 9.4% against 6.5% revenue growth [V]"],
    ["Marketing to win an order", "≈ £0", "one signature per firm; the roster does the reminding", gbp(MOONPIG_DERIVED.marketingPerOrder), `£38.7m a year across 36m orders [D]`],
    ["Cost structure", `${UNIT.teamSize} people`, `~${gbp(3_100_000 / UNIT.teamSize / 1000, 0)}k revenue each at £3.1m ARR. A cost structure, not a defence: the defence is the contract, the roster and the collection`, `${MOONPIG.employees} people`, `${gbp(MOONPIG_DERIVED.revenuePerEmployee / 1000, 0)}k revenue each [V]`],
    ["Team collections", "Built in", "open themselves on leaver, retirement, milestones, weddings, babies; team-scoped, with a pot and the recipient's gift choice", "Group cards", `up to ${MOONPIG.groupCardMaxContributors} contributors, shared by link. No pot, no roster trigger, no gift choice [V]`],
  ];

  return (
    <>
      <ClockBar active="/dashboard" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6">
          <p className="label mb-1">
            {db.company.shortName} · day {daysRun} · {formatLong(db.clock.today)}
          </p>
          <h1 className="h1">The year so far, in numbers</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Hero value={String(sent.length)} label="cards sent" sub={`${cardsPerYear} occasions under management for ${staff.length} staff and ${clients.length} clients`} />
          <Hero value={pct(approveRate)} label="approved without an edit" sub={`${decided.length - skipped} approved · ${editedCount} edited · ${autoApproved} went out by themselves`} accent="hooray" />
          <Hero value={pct(seat.margin)} label="seat margin" sub={`print is ${gbp(seat.printPerSeat)} of a £30 seat (two cards at ${gbp(UNIT.cardCostProductionGbp)}) · AI ${pence(seat.aiPerSeat)} · still ${pct(seatDoubled.margin)} if card cost doubles [D]`} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Tile label="Gift value under management" value={gbp(giftUnderManagement, 0)} sub={`${gbp(potTotal, 0)} in collection pots · ${gbp(clientGiftValue, 0)} client gifts [E] · Moonpig attaches a gift to ${pct(MOONPIG.giftAttachRate)} of orders`} accent="gold" />
          <Tile label="Collections" value={String(collections.length)} sub={`${contributors} contributions · ${gbp(potTotal, 0)} raised`} accent="gold" />
          <Tile label="Human minutes" value={String(Math.round((touches * UNIT.digestSecondsPerCard) / 60))} sub={`${touches} touches · ${hoursSaved.toFixed(1)} hours saved against doing it by hand`} />
          <Tile label="AI spend, measured" value={gbp(aiTotal, 2)} sub={`${drafted.length} drafts · ${liveDrafts} live · ${pence(aiPerCard)} a card at Claude Opus 5 prices`} />
        </div>

        <section className="card-panel mt-8 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="h2">Next to Moonpig</h2>
            <span className="hint">Moonpig Group FY26 · £373m revenue · 676 people · Moonpig for Business at £3.60 a card · [V] verified, [D] derived, [E] estimate</span>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] gap-x-6">
            <div className="label">Hooray</div>
            <div />
            <div className="label text-right">Moonpig</div>
            {versus.map(([k, a, aSub, b, bSub]) => (
              <Fragment key={k}>
                <div className="border-t border-line py-4">
                  <div className="stat text-navy">{a}</div>
                  <div className="hint mt-1">{aSub}</div>
                </div>
                <div className="label self-center border-t border-line py-4 text-center">{k}</div>
                <div className="border-t border-line py-4 text-right">
                  <div className="stat text-ink-3">{b}</div>
                  <div className="hint mt-1">{bSub}</div>
                </div>
              </Fragment>
            ))}
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm underline">Full comparison</summary>
            <table className="mt-3 w-full text-sm">
              <tbody className="divide-y divide-line">
                <Row k="What the firm pays" a={`${gbp(UNIT.pricePerEmployeePerYearGbp, 0)} per employee per year, all occasions, plus six personal cards each`} b={`${gbp(MOONPIG.businessCardPrice)} a card at Moonpig for Business. Consumer: ${gbp(MOONPIG.consumerCardPrice)} + ${gbp(MOONPIG.consumerPostage)} post = ${gbp(MOONPIG_DERIVED.consumerAllIn)}`} />
                <Row k="For this roster" a={`${gbp(seats.revenue, 0)} a year for ${staff.length} seats covering ~${cardsPerYear} occasions`} b={`${gbp(cardsPerYear * MOONPIG.businessCardPrice, 0)} in cards, plus ~${gbp(cardsPerYear * moonpigAdminPerCard, 0)} of an office manager's time`} />
                <Row k="Print in the seat" a={`${gbp(seat.printPerSeat)} of £30: two cards a year at ${gbp(UNIT.cardCostProductionGbp)} all in (Docmail; Stannp ${gbp(UNIT.cardCostPrototypeGbp)} for prototypes) [V]. A sub-scale entrant pays more per card than Moonpig, not less [E]; the margin is the seat.`} b={`Shipping and logistics ${pct(MOONPIG_DERIVED.shippingPct)} of revenue, growing faster than revenue [V]`} />
                <Row k="Gifts" a={`Collections are the attach mechanism: the pot buys a sourced gift, the client roster buys a £50 one [E]`} b={`${pct(MOONPIG_DERIVED.giftShareOfRevenue)} of Moonpig and Greetz revenue is gifts (£132m of £335.5m; £123.8m attached, £8.2m standalone) on a ${pct(MOONPIG.giftAttachRate)} attach rate at ~£${MOONPIG.giftRevenuePerAttachedOrder} each [V]`} />
                <Row k="Occasions captured" a="Every occasion on the roster, the day the export lands. A 200-person firm produces ~400 a year whether or not the category grows." b={`${pct(MOONPIG.occasionCaptureRate)}: ${MOONPIG.cardsPerCustomerPerYear} cards a year against ~19 bought [V]. Category orders fell 9.5% FY22 to FY26 while AOV rose 21% [V]`} />
                <Row k="Phase 2, employees as consumers [E]" a={`Designed, not tested: ${gbp(CONSUMER.perCardGbp)} a card including post, or ${gbp(CONSUMER.subscriptionMonthlyGbp)} a month for up to ${CONSUMER.subscriptionCardsPerYear} cards sent automatically. No consumer UI today.`} b={`${gbp(MOONPIG_DERIVED.consumerAllIn)} a card including post`} />
                <Row k="Who remembers the date" a="The roster. Every occasion is known the day the HR export lands." b={`The customer, prompted by ${(MOONPIG.remindersStored / 1e6).toFixed(0)}m stored reminders driving ~40% of orders`} />
                <Row k="Human minutes per card" a="≈ 0.3 · one glance in the weekly queue" b={`≈ ${UNIT.manualMinutesPerCard} · remember, choose, write, address, pay`} />
              </tbody>
            </table>
          </details>
        </section>

        <section className="card-panel mt-8 p-5">
          <h2 className="h2">Activity</h2>
          <ul className="mt-2 max-h-56 overflow-auto text-xs text-ink-2">
            {[...db.clock.log].reverse().map((l, i) => (
              <li key={i} className="border-b border-line py-1 last:border-0">
                <span className="text-ink-3">{l.at}</span> · {l.event}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

function Hero({ value, label, sub, accent }: { value: string; label: string; sub: string; accent?: "hooray" }) {
  return (
    <div className="card-panel-hero p-6">
      <div className={`stat ${accent === "hooray" ? "text-hooray" : ""}`}>{value}</div>
      <div className="mt-1 text-sm text-ink-2">{label}</div>
      <div className="hint mt-2 text-xs">{sub}</div>
    </div>
  );
}

function Tile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: "gold" }) {
  return (
    <div className={`card-panel px-4 py-3 ${accent === "gold" ? "border-l-[3px] border-l-gold" : ""}`}>
      <div className="label">{label}</div>
      <div className="mt-1 font-display text-[28px] leading-none">{value}</div>
      <div className="hint mt-1 text-xs">{sub}</div>
    </div>
  );
}

function Row({ k, a, b }: { k: string; a: string; b: string }) {
  return (
    <tr>
      <td className="py-2.5 pr-4 align-top font-medium">{k}</td>
      <td className="py-2.5 pr-4 align-top text-ink">{a}</td>
      <td className="py-2.5 align-top text-ink-2">{b}</td>
    </tr>
  );
}

import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { getDb } from "@/lib/db";
import { daysBetween, formatLong } from "@/lib/dates";
import { cardCost, gbp, MOONPIG, MOONPIG_DERIVED, pct, pence, seatEconomics, UNIT } from "@/lib/costs";
import { materialiseOccasions } from "@/lib/occasions";
import { addDays } from "@/lib/dates";
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
  const moonpigAdminPerCard = (UNIT.manualMinutesPerCard / 60) * 15; // office manager at ~£15/hour choosing, writing, scheduling

  return (
    <>
      <ClockBar active="/dashboard" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6">
          <p className="label">
            {db.company.shortName} · day {daysRun} · {formatLong(db.clock.today)}
          </p>
          <h1 className="font-display text-3xl">
            {sent.length} cards sent, {pct(approveRate)} approved without an edit
          </h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Tile label="Occasions under management" value={String(cardsPerYear)} sub={`next 12 months · ${staff.length} staff, ${clients.length} clients`} />
          <Tile label="Drafted · approved · edited" value={`${drafted.length} · ${decided.length - skipped} · ${editedCount}`} sub={`${autoApproved} auto-approved at dispatch · ${skipped} skipped`} />
          <Tile label="Approve-without-edit" value={pct(approveRate)} sub="the drafting is good enough when this holds above 60%" />
          <Tile label="Cost per card" value={gbp(cost.total)} sub={`${gbp(UNIT.cardCostProductionGbp)} print, envelope and post · AI ${pence(aiPerCard)}`} />
          <Tile label="Human minutes spent" value={String(Math.round((touches * UNIT.digestSecondsPerCard) / 60))} sub={`${touches} approver touches · ${hoursSaved.toFixed(1)} hours saved vs doing it by hand`} />
          <Tile label="Collections" value={String(collections.length)} sub={`${contributors} contributions · ${gbp(potTotal, 0)} raised · leaver, retirement and milestones only`} />
        </div>

        <section className="card-panel mt-8 overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl">Next to Moonpig</h2>
            <p className="text-xs text-ink-3">Moonpig Group FY26 (year to 30 April 2026): £373m revenue, 58.4% gross margin, £38.7m marketing (10.4%), 676 average employees, 36m orders at £9.32. Moonpig for Business: £3.60 a card, CSV upload, 90-day scheduling, no HR sync, no drafting, no collections.</p>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-ink-3">
              <tr className="border-b border-line">
                <th className="px-5 py-2 font-medium">Line</th>
                <th className="px-5 py-2 font-medium">Occasionally</th>
                <th className="px-5 py-2 font-medium">Moonpig</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <Row k="What the firm pays" a={`${gbp(UNIT.pricePerEmployeePerYearGbp, 0)} per employee per year, all occasions included, plus six personal cards each`} b={`Moonpig for Business: ${gbp(MOONPIG.businessCardPrice)} a card, someone still has to run it. Consumer: ${gbp(MOONPIG.consumerCardPrice)} + ${gbp(MOONPIG.consumerPostage)} post = ${gbp(MOONPIG_DERIVED.consumerAllIn)}`} />
              <Row k="For this roster" a={`${gbp(seats.revenue, 0)} a year for ${staff.length} seats covering ~${cardsPerYear} occasions`} b={`${gbp(cardsPerYear * MOONPIG.businessCardPrice, 0)} in cards at £3.60, plus ~${gbp(cardsPerYear * moonpigAdminPerCard, 0)} of an office manager's time (${UNIT.manualMinutesPerCard} min a card)`} />
              <Row k="Card cost, all in" a={`${gbp(UNIT.cardCostProductionGbp)} Docmail production (A5, C5 envelope, economy post) · ${gbp(UNIT.cardCostPrototypeGbp)} Stannp prototype · AI ${pence(aiPerCard)}`} b={`~${gbp(MOONPIG_DERIVED.internalCardCostEstimate)} internal estimate, three factories and Royal Mail contracts`} />
              <Row k="Gross margin on the seat" a={`${pct(seats.margin)} (${gbp(seats.grossProfit, 0)} on ${gbp(seats.revenue, 0)})`} b={`${pct(MOONPIG.grossMargin)} group`} />
              <Row k="Marketing to win the order" a="≈ £0 · one signature per firm, then the roster does the reminding" b={`${gbp(MOONPIG_DERIVED.marketingPerOrder)} per order · ${gbp(MOONPIG.marketingGbp / 1e6, 1)}m a year to re-win 12.3m customers`} />
              <Row k="Who remembers the date" a="The roster. Every occasion is known the day the HR export lands." b={`The customer, prompted by ${(MOONPIG.remindersStored / 1e6).toFixed(0)}m stored reminders driving ~40% of orders`} />
              <Row k="Peer collections" a={`Fire from the roster on leaver, retirement and milestones. ${collections.length} so far, team-scoped, amounts hidden.`} b="Not offered" />
              <Row k="People" a={`${UNIT.teamSize}, at £3.1m ARR that is ~${gbp(3_100_000 / UNIT.teamSize / 1000, 0)}k each`} b={`${MOONPIG.employees} · ${gbp(MOONPIG_DERIVED.revenuePerEmployee / 1000, 0)}k revenue per employee`} />
            </tbody>
          </table>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="card-panel p-5">
            <h2 className="font-display text-xl">AI spend, measured</h2>
            <p className="mt-1 text-sm text-ink-2">
              {drafted.length} drafts · {liveDrafts} live calls · {gbp(aiTotal, 3)} total · {pence(aiPerCard)} per card, from real token usage at Claude Opus 5 pricing.
            </p>
            <p className="mt-2 text-xs text-ink-3">Every draft is cached by occasion, signer and prompt version, so re-running the clock never re-bills. Approved and edited text is frozen.</p>
          </div>
          <div className="card-panel p-5">
            <h2 className="font-display text-xl">Activity</h2>
            <ul className="mt-2 max-h-72 overflow-auto text-xs text-ink-2">
              {[...db.clock.log].reverse().map((l, i) => (
                <li key={i} className="border-b border-line py-1 last:border-0">
                  <span className="text-ink-3">{l.at}</span> · {l.event}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card-panel p-4">
      <div className="label">{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
      <div className="mt-1 text-xs text-ink-3">{sub}</div>
    </div>
  );
}

function Row({ k, a, b }: { k: string; a: string; b: string }) {
  return (
    <tr>
      <td className="px-5 py-2.5 align-top font-medium">{k}</td>
      <td className="px-5 py-2.5 align-top text-ink">{a}</td>
      <td className="px-5 py-2.5 align-top text-ink-2">{b}</td>
    </tr>
  );
}

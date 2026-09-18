import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { ContributeForm } from "@/components/ContributeForm";
import { CardSheet, SHEET_H, SHEET_W } from "@/components/Card";
import { Scaled } from "@/components/CardPreview";
import { chooseGiftAction, closeCollectionAction, contributeManyAction } from "@/app/actions";
import { getDb } from "@/lib/db";
import { formatLong } from "@/lib/dates";
import { GIFT_RANGE, potPence } from "@/lib/collections";
import { occasionTitle } from "@/lib/occasions";
import { renderableCard } from "@/lib/render";
import { fullName, type Person } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: PageProps<"/collections/[id]">) {
  const { id } = await params;
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const col = db.collections.find((c) => c.id === id);
  if (!col) notFound();
  const person = db.people.find((p) => p.id === col.personId)!;
  const occ = db.occasions.find((o) => o.id === col.occasionId)!;
  const card = db.cards.find((c) => c.id === col.cardId);
  const rc = card ? renderableCard(db, card) : undefined;
  const team = col.teamIds.map((tid) => db.people.find((p) => p.id === tid)).filter((p): p is Person => Boolean(p));
  const contributed = new Set(col.contributions.map((c) => c.contributorId));
  const pot = potPence(col);
  const open = col.status === "open";
  const gift = col.giftChoice ? GIFT_RANGE.find((g) => g.id === col.giftChoice) : undefined;
  const pct = Math.round((100 * col.contributions.length) / Math.max(1, team.length));
  const verb = occ.type === "leaver" ? "leaves" : occ.type === "retirement" ? "retires" : "marks the occasion";

  return (
    <>
      <ClockBar active="/people" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label mb-1">
              <Link href="/people" className="hover:underline">
                People
              </Link>{" "}
              › Team collection · {occasionTitle(occ)}
            </p>
            <h1 className="h1">{open ? `Chip in for ${person.firstName}` : gift ? `${person.firstName} chose ${gift.name.toLowerCase()}` : `${person.firstName}'s collection has closed`}</h1>
            <p className="hint mt-1.5 max-w-2xl">
              {open ? (
                <>
                  {fullName(person)} {verb} on {formatLong(occ.date)}. Only the {person.team} team in {person.office} has been asked. Amounts are never shown to anyone, including {person.firstName}. Closes {formatLong(col.closesOn)} when the card goes to print, or when you close it.
                </>
              ) : (
                <>Closed with {col.contributions.length} signatures. The card went to print with every line inside.</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {open && contributed.size < team.length && (
              <form action={contributeManyAction}>
                <input type="hidden" name="collectionId" value={col.id} />
                <button className="btn">Demo: team chips in</button>
              </form>
            )}
            {open && (
              <form action={closeCollectionAction}>
                <input type="hidden" name="collectionId" value={col.id} />
                <button className="btn btn-primary" disabled={col.contributions.length === 0}>
                  Close and let {person.firstName} choose
                </button>
              </form>
            )}
            {!open && card && (
              <Link href={`/cards/${card.id}`} className="btn btn-primary">
                Open the card
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <section className="card-panel p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="h2">
                {col.contributions.length} of {team.length} colleagues
              </h2>
              <span className="hint text-xs">Suggested £{(col.suggestedPence / 100).toFixed(0)} · pot is private</span>
            </div>
            <div className="bar mt-3 w-full">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <ul className="mt-3 divide-y divide-line">
              {team.map((p) => {
                const c = col.contributions.find((x) => x.contributorId === p.id);
                return (
                  <li key={p.id} className="py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm">
                        <span className="font-medium">{fullName(p)}</span>
                        <span className="text-ink-3"> · {p.role}</span>
                      </span>
                      {c ? <span className="chip chip-green">signed</span> : open ? <ContributeForm collectionId={col.id} contributorId={p.id} suggested={col.suggestedPence / 100} /> : <span className="chip chip-muted">did not sign</span>}
                    </div>
                    {c?.message && (
                      <p className="mt-1 font-script text-lg leading-tight text-ink-2">
                        “{c.message}” <span className="font-body text-xs text-ink-3">— {p.firstName}</span>
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="grid min-w-0 content-start gap-6">
            <section className="card-panel-hero p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="h2">The card, inside</h2>
                {card && (
                  <Link href={`/cards/${card.id}`} className="text-sm underline">
                    Open full card
                  </Link>
                )}
              </div>
              <p className="hint mt-0.5">Every line signed on the left is printed on the left-hand panel with the name.</p>
              {rc ? (
                <div className="mt-4">
                  <Scaled widthMm={SHEET_W} heightMm={SHEET_H}>
                    <CardSheet card={rc} side="inside" />
                  </Scaled>
                </div>
              ) : (
                <p className="hint mt-3">The card is still being drafted.</p>
              )}
            </section>

            <section className="card-panel p-5">
              <h2 className="h2">{gift ? `${person.firstName}'s pick: ${gift.name}` : `${person.firstName} chooses the gift`}</h2>
              {open ? (
                <p className="hint mt-1">Once it closes, the pot is offered as a curated range and {person.firstName} picks. No wishlist to maintain. Cash is always allowed.</p>
              ) : gift ? (
                <p className="mt-1 text-sm text-ink-2">
                  {gift.blurb} <span className="text-ink-3">The pot came to £{(pot / 100).toFixed(0)}.</span>
                </p>
              ) : (
                <>
                  <p className="hint mt-1">The pot came to £{(pot / 100).toFixed(0)}. Pick on {person.firstName}&apos;s behalf for the demo.</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {GIFT_RANGE.map((g) => {
                      const short = g.fromPence > pot;
                      return (
                        <li key={g.id}>
                          <form action={chooseGiftAction} className={`flex h-full flex-col justify-between gap-2 rounded-lg border border-line p-3 ${short ? "opacity-50" : "hover:border-navy hover:bg-white"}`}>
                            <input type="hidden" name="collectionId" value={col.id} />
                            <input type="hidden" name="giftId" value={g.id} />
                            <span className="text-sm">
                              <span className="font-medium">{g.name}</span>
                              <span className="block text-xs text-ink-3">{g.blurb}</span>
                            </span>
                            <button className="btn btn-sm self-start" disabled={short}>
                              {short ? `from £${g.fromPence / 100}` : "Choose"}
                            </button>
                          </form>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

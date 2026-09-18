import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { ContributeForm } from "@/components/ContributeForm";
import { chooseGiftAction, contributeManyAction } from "@/app/actions";
import { getDb } from "@/lib/db";
import { formatLong } from "@/lib/dates";
import { GIFT_RANGE, potPence } from "@/lib/collections";
import { occasionTitle } from "@/lib/occasions";
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
  const team = col.teamIds.map((tid) => db.people.find((p) => p.id === tid)).filter((p): p is Person => Boolean(p));
  const contributed = new Set(col.contributions.map((c) => c.contributorId));
  const pot = potPence(col);
  const open = col.status === "open";
  const gift = col.giftChoice ? GIFT_RANGE.find((g) => g.id === col.giftChoice) : undefined;

  return (
    <>
      <ClockBar active="/digest" />
      <main className="mx-auto w-full max-w-5xl px-5 py-8">
        <p className="label">Team collection · {occasionTitle(occ)}</p>
        <h1 className="font-display text-3xl">
          {open ? `Chip in for ${person.firstName}` : `${person.firstName}'s collection has closed`}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-2">
          {open ? (
            <>
              {fullName(person)} {occ.type === "leaver" ? "leaves" : occ.type === "retirement" ? "retires" : "marks the occasion"} on {formatLong(occ.date)}. Only the {person.team} team in {person.office} has been asked. Contributions are optional and amounts are never shown to anyone, including {person.firstName}. Closes {formatLong(col.closesOn)}, when the card goes to print.
            </>
          ) : (
            <>Closed {formatLong(col.closesOn)}. The card went to print with {col.contributions.length} signatures.</>
          )}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <section className="card-panel p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl">{col.contributions.length} of {team.length} colleagues</h2>
              <span className="text-xs text-ink-3">Suggested £{(col.suggestedPence / 100).toFixed(0)} · pot is private</span>
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
                      {c ? <span className="chip bg-[var(--green-bg)] text-[var(--green-fg)]">signed</span> : open ? <ContributeForm collectionId={col.id} contributorId={p.id} suggested={col.suggestedPence / 100} /> : <span className="chip bg-paper-2 text-ink-3">did not sign</span>}
                    </div>
                    {c?.message && <p className="mt-1 font-script text-lg leading-tight text-ink-2">“{c.message}” <span className="font-body text-xs text-ink-3">— {p.firstName}</span></p>}
                  </li>
                );
              })}
            </ul>
            {open && contributed.size < team.length && (
              <form action={contributeManyAction} className="mt-4 border-t border-line pt-3">
                <input type="hidden" name="collectionId" value={col.id} />
                <button className="btn text-xs">Demo: eight colleagues chip in</button>
              </form>
            )}
          </section>

          <section className="grid gap-4">
            <div className="card-panel p-5">
              <h2 className="font-display text-xl">The card</h2>
              <p className="mt-1 text-sm text-ink-2">
                The company card is drafted and signed by {person.firstName}&apos;s manager. Every line above is printed inside the left panel with the contributor&apos;s name, so the card arrives with {col.contributions.length || "the team's"} signatures.
              </p>
              {card && (
                <Link href={`/cards/${card.id}`} className="btn mt-3">
                  Open the card
                </Link>
              )}
            </div>

            <div className="card-panel p-5">
              <h2 className="font-display text-xl">{gift ? `${person.firstName} chose: ${gift.name}` : `${person.firstName} chooses the gift`}</h2>
              <p className="mt-1 text-sm text-ink-2">
                {open ? "Once the collection closes, the pot is offered as a curated range and the recipient picks. No wishlist to maintain. Cash is always allowed." : `The pot came to £${(pot / 100).toFixed(0)}. ${gift ? "" : "Pick on their behalf for the demo:"}`}
              </p>
              {!open && !gift && (
                <ul className="mt-3 grid gap-2">
                  {GIFT_RANGE.map((g) => (
                    <li key={g.id}>
                      <form action={chooseGiftAction} className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 hover:bg-paper-2">
                        <input type="hidden" name="collectionId" value={col.id} />
                        <input type="hidden" name="giftId" value={g.id} />
                        <span className="text-sm">
                          <span className="font-medium">{g.name}</span>
                          <span className="block text-xs text-ink-3">{g.blurb}</span>
                        </span>
                        <button className="btn text-xs" disabled={g.fromPence > pot}>
                          {g.fromPence > pot ? `from £${g.fromPence / 100}` : "Choose"}
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
              {gift && <p className="mt-2 text-sm text-ink-2">{gift.blurb}</p>}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

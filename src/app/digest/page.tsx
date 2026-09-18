import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { DigestRow } from "@/components/DigestRow";
import { approveAllAction, sendNowAction } from "@/app/actions";
import { getDb } from "@/lib/db";
import { addDays, formatLong, formatRange } from "@/lib/dates";
import { pendingCards } from "@/lib/engine";
import { occasionTitle } from "@/lib/occasions";
import { DISPATCH_DAYS, LEAD_DAYS, fullName, type Card } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function DigestPage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const cards = pendingCards(db);
  const needs = cards.filter((c) => c.status === "held" || c.status === "needs_review");
  const ready = cards.filter((c) => c.status === "drafted");
  const done = cards.filter((c) => ["approved", "edited", "skipped"].includes(c.status));
  const sendable = cards.filter((c) => c.status === "approved" || c.status === "edited").length;
  const unflagged = ready.filter((c) => c.flags.length === 0).length;
  const staff = db.people.filter((p) => p.kind === "staff" && p.status !== "left");
  const nextDispatch = cards.filter((c) => c.status !== "skipped").map((c) => c.dispatchOn).sort()[0];

  const row = (c: Card) => {
    const p = db.people.find((x) => x.id === c.personId)!;
    const occ = db.occasions.find((o) => o.id === c.occasionId)!;
    const signer = db.people.find((x) => x.id === c.signerId);
    const co = c.coSignerId ? db.people.find((x) => x.id === c.coSignerId) : undefined;
    const col = c.collectionId ? db.collections.find((x) => x.id === c.collectionId) : undefined;
    return (
      <DigestRow
        key={c.id}
        card={c}
        person={p}
        occasionLabel={occasionTitle(occ)}
        signerName={signer ? fullName(signer) : "—"}
        coSignerName={co ? fullName(co) : undefined}
        signers={staff.map((s) => ({ id: s.id, name: `${fullName(s)} · ${s.role}` }))}
        brandHex={db.company!.brandHex}
        accentHex={db.company!.accentHex}
        shortName={db.company!.shortName}
        occasionType={occ.type}
        ordinal={occ.ordinal}
        collection={col ? { id: col.id, contributors: col.contributions.length, invited: col.teamIds.length, status: col.status } : undefined}
      />
    );
  };

  return (
    <>
      <ClockBar active="/digest" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">Approval queue · {formatLong(db.clock.today)}</p>
            <h1 className="font-display text-3xl">
              {cards.length === 0 ? "Nothing waiting" : `${cards.length} card${cards.length === 1 ? "" : "s"} for ${formatRange(db.clock.today, addDays(db.clock.today, LEAD_DAYS))}`}
            </h1>
            <p className="mt-1 text-sm text-ink-2">
              Drafted {LEAD_DAYS} days out. Anything still pending {DISPATCH_DAYS} days before the occasion is approved and sent automatically, so nobody has to think about it.
              {nextDispatch && <> Next dispatch {formatLong(nextDispatch)}.</>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <form action={approveAllAction}>
              <button className="btn" disabled={unflagged === 0}>
                Approve all unflagged ({unflagged})
              </button>
            </form>
            <form action={sendNowAction}>
              <button className="btn btn-primary" disabled={sendable === 0}>
                Send {sendable} now
              </button>
            </form>
          </div>
        </div>

        {cards.length === 0 && (
          <p className="text-ink-2">
            Advance the clock and the next occasions will be drafted. Or{" "}
            <Link href="/people" className="underline">
              mark someone as leaving
            </Link>{" "}
            to see a collection open.
          </p>
        )}

        {needs.length > 0 && (
          <Section title="Needs a decision" hint="Held by the gate or flagged by a wording check. Nothing here goes out until you say so.">
            {needs.map(row)}
          </Section>
        )}
        {ready.length > 0 && (
          <Section title="Ready" hint="Drafted from context. Approve, edit one line, change the signer, or skip. Untouched cards go out automatically.">
            {ready.map(row)}
          </Section>
        )}
        {done.length > 0 && (
          <Section title="Done" hint="Frozen. These go to print on their dispatch day, or now.">
            {done.map(row)}
          </Section>
        )}
      </main>
    </>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-2 flex items-baseline gap-3">
        <h2 className="font-display text-xl">{title}</h2>
        <span className="text-xs text-ink-3">{hint}</span>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { StatusChip } from "@/components/StatusChip";
import { getDb } from "@/lib/db";
import { addDays, formatRange, formatShort, mondayOf } from "@/lib/dates";
import { materialiseOccasions, occasionTitle } from "@/lib/occasions";
import { displayName, fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const start = mondayOf(db.clock.today);
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const from = addDays(start, i * 7);
    const to = addDays(from, 6);
    return { from, to, occs: materialiseOccasions(db, from, to) };
  });
  const total = weeks.reduce((s, w) => s + w.occs.length, 0);
  return (
    <>
      <ClockBar active="/calendar" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="label">Next eight weeks</p>
            <h1 className="font-display text-3xl">{total} occasions on the roster</h1>
          </div>
          <p className="text-sm text-ink-3">Cards are drafted the Monday before the week they are due.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {weeks.map((w) => {
            const digest = db.digests.find((d) => d.coversFrom === w.from);
            return (
              <section key={w.from} className="card-panel p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-display text-lg">{formatRange(w.from, w.to)}</h2>
                  {digest ? (
                    <Link href="/digest" className="text-xs text-navy underline">
                      {digest.status === "open" ? "in digest" : "submitted"}
                    </Link>
                  ) : (
                    <span className="text-xs text-ink-3">not yet drafted</span>
                  )}
                </div>
                {w.occs.length === 0 ? (
                  <p className="text-sm text-ink-3">Nothing due.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {w.occs.map((o) => {
                      const p = db.people.find((x) => x.id === o.personId)!;
                      const card = db.cards.find((c) => c.occurrenceKey === o.occurrenceKey);
                      return (
                        <li key={o.id} className="flex items-center gap-3 py-2 text-sm">
                          <span className="w-12 shrink-0 text-ink-3">{formatShort(o.date)}</span>
                          <span className="min-w-0 flex-1 truncate">
                            <span className="font-medium">{card ? <Link href={`/cards/${card.id}`} className="hover:underline">{fullName(p)}</Link> : fullName(p)}</span>
                            <span className="text-ink-3"> · {occasionTitle(o)}</span>
                            {p.kind === "client" && <span className="text-ink-3"> · {p.clientCompanyName}</span>}
                          </span>
                          {card ? <StatusChip status={card.status} /> : p.optOut ? <span className="chip bg-paper-2 text-ink-3">opted out</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-ink-3">{db.people.filter((p) => p.kind === "staff").length} staff and {db.people.filter((p) => p.kind === "client").length} clients on the roster. First names: {db.people.slice(0, 3).map(displayName).join(", ")}…</p>
      </main>
    </>
  );
}

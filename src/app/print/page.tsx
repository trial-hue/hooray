import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { StatusTimeline } from "@/components/StatusTimeline";
import { getDb } from "@/lib/db";
import { formatLong, formatShort } from "@/lib/dates";
import { resolveDelivery } from "@/lib/delivery";
import { occasionTitle } from "@/lib/occasions";
import { fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function PrintPage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const jobs = [...db.printJobs].reverse();
  return (
    <>
      <ClockBar active="/print" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6">
          <p className="label">Print partner · mock Prodigi</p>
          <h1 className="font-display text-3xl">{jobs.length === 0 ? "Nothing at the printer yet" : `${jobs.length} print job${jobs.length === 1 ? "" : "s"}`}</h1>
          <p className="mt-1 text-sm text-ink-2">Cards are printed the next working day, posted the day after, and land within four. Advance the clock to watch them move.</p>
        </div>
        {jobs.map((job) => (
          <section key={job.id} className="card-panel mb-5 p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl">
                {job.ref} <span className="text-sm text-ink-3">· submitted {formatLong(job.submittedOn)} · {job.cardIds.length} cards</span>
              </h2>
              <span className="text-xs text-ink-3">
                expected: printed {formatShort(job.expected.printed)} · posted {formatShort(job.expected.posted)} · delivered {formatShort(job.expected.delivered)}
                {job.orderPath && <> · order JSON at {job.orderPath}</>}
              </span>
            </div>
            <ul className="divide-y divide-line">
              {job.cardIds.map((id) => {
                const c = db.cards.find((x) => x.id === id)!;
                const p = db.people.find((x) => x.id === c.personId)!;
                const occ = db.occasions.find((o) => o.id === c.occasionId)!;
                const d = resolveDelivery(p, db.company, c.dueDate);
                return (
                  <li key={id} className="grid items-center gap-3 py-2.5 text-sm md:grid-cols-[1.3fr_1.4fr_auto]">
                    <div className="min-w-0">
                      <Link href={`/cards/${c.id}`} className="font-medium hover:underline">
                        {fullName(p)}
                      </Link>
                      <span className="text-ink-3"> · {occasionTitle(occ)} · due {formatShort(c.dueDate)}</span>
                    </div>
                    <div className="truncate text-xs text-ink-3">
                      {d ? `${d.mode === "office-batch" ? "Office parcel" : "Posted"} → ${d.address.line1}, ${d.address.town} ${d.address.postcode}` : "no address"}
                    </div>
                    <StatusTimeline status={c.status} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}

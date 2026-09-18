import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { PersonMenu } from "@/components/MarkLeavingForm";
import { getDb } from "@/lib/db";
import { formatShort } from "@/lib/dates";
import { occasionTitle } from "@/lib/occasions";
import { fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function PeoplePage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const staff = db.people.filter((p) => p.kind === "staff").sort((a, b) => a.team.localeCompare(b.team) || a.lastName.localeCompare(b.lastName));
  const clients = db.people.filter((p) => p.kind === "client");
  const collections = [...db.collections].reverse();
  return (
    <>
      <ClockBar active="/people" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6">
          <p className="label mb-1">Roster</p>
          <h1 className="h1">
            {staff.length} staff · {clients.length} clients
          </h1>
          <p className="hint mt-1.5">Record a leaver, a wedding or a new baby and the rest happens by itself.</p>
        </div>

        {collections.length > 0 && (
          <section className="mb-8">
            <h2 className="h2">Collections</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {collections.map((c) => {
                const p = db.people.find((x) => x.id === c.personId)!;
                const occ = db.occasions.find((o) => o.id === c.occasionId)!;
                const pct = Math.round((100 * c.contributions.length) / Math.max(1, c.teamIds.length));
                return (
                  <Link key={c.id} href={`/collections/${c.id}`} className="card-panel border-l-[3px] border-l-gold px-4 py-3 transition hover:bg-paper-2/60">
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">{fullName(p)}</span>
                      <span className={`chip ${c.status === "open" ? "chip-gold" : "chip-muted"}`}>{c.status === "open" ? "open" : c.giftChoice ? "gift chosen" : "closed"}</span>
                    </div>
                    <div className="hint text-xs">{occasionTitle(occ)}</div>
                    <div className="bar mt-2 w-full">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="hint mt-1 text-xs">
                      {c.contributions.length} of {c.teamIds.length} chipped in · {c.status === "open" ? `closes ${formatShort(c.closesOn)}` : "closed"}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="card-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-ink-3">
              <tr className="border-b border-line">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Team</th>
                <th className="px-4 py-2.5 font-medium">Joined</th>
                <th className="px-4 py-2.5 font-medium">Birthday</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {staff.map((p) => (
                <tr key={p.id} className={`hover:bg-paper-2/60 ${p.endDate ? "opacity-60" : ""}`}>
                  <td className="px-4 py-2">
                    <div className="font-medium">{fullName(p)}</div>
                    <div className="text-xs text-ink-3">{p.role}</div>
                  </td>
                  <td className="px-4 py-2 text-ink-2">
                    {p.team} · {p.office}
                  </td>
                  <td className="px-4 py-2 text-ink-2">{p.startDate ? formatShort(p.startDate) + " " + p.startDate.slice(0, 4) : "—"}</td>
                  <td className="px-4 py-2 text-ink-2">{p.birthday ? formatShort(`2026-${p.birthday}`) : "—"}</td>
                  <td className="px-4 py-2">
                    {p.optOut ? (
                      <span className="chip chip-muted">opted out</span>
                    ) : !p.consentOccasions ? (
                      <span className="chip chip-amber">no birthday consent</span>
                    ) : p.status === "on-leave" ? (
                      <span className="chip chip-amber">on {p.leaveReason ?? ""} leave</span>
                    ) : p.endDate ? (
                      <span className="chip chip-gold">
                        {p.retiring ? "retiring" : "leaving"} {formatShort(p.endDate)}
                      </span>
                    ) : (
                      <span className="chip chip-muted">active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end">{!p.endDate && <PersonMenu personId={p.id} />}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

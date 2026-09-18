import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { MarkLeavingForm } from "@/components/MarkLeavingForm";
import { AddOccasionForm } from "@/components/AddOccasionForm";
import { getDb } from "@/lib/db";
import { formatShort } from "@/lib/dates";
import { fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function PeoplePage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const staff = db.people.filter((p) => p.kind === "staff").sort((a, b) => a.team.localeCompare(b.team) || a.lastName.localeCompare(b.lastName));
  const clients = db.people.filter((p) => p.kind === "client");
  return (
    <>
      <ClockBar active="/people" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6">
          <p className="label">Roster</p>
          <h1 className="font-display text-3xl">
            {staff.length} staff · {clients.length} clients
          </h1>
          <p className="mt-1 text-sm text-ink-2">The roster is the asset. Mark someone as leaving and a team collection opens the same day, before anyone has to organise anything. Weddings and new babies open one too; routine birthdays never do. Everyone was asked once whether they want birthdays marked.</p>
        </div>
        <div className="card-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-ink-3">
              <tr className="border-b border-line">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Team</th>
                <th className="px-4 py-2 font-medium">Joined</th>
                <th className="px-4 py-2 font-medium">Birthday</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {staff.map((p) => (
                <tr key={p.id} className={p.endDate ? "opacity-60" : ""}>
                  <td className="px-4 py-2">
                    <span className="font-medium">{fullName(p)}</span>
                    <span className="text-ink-3"> · {p.role}</span>
                  </td>
                  <td className="px-4 py-2 text-ink-2">
                    {p.team} · {p.office}
                  </td>
                  <td className="px-4 py-2 text-ink-2">{p.startDate}</td>
                  <td className="px-4 py-2 text-ink-2">{p.birthday ? formatShort(`2026-${p.birthday}`) : "—"}</td>
                  <td className="px-4 py-2 text-ink-2">
                    {p.optOut ? "opted out" : !p.consentOccasions ? "no birthday consent" : p.status === "on-leave" ? `on ${p.leaveReason ?? ""} leave` : p.endDate ? `${p.retiring ? "retiring" : "leaving"} ${formatShort(p.endDate)}` : "active"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      {!p.endDate && <AddOccasionForm personId={p.id} />}
                      {!p.endDate && <MarkLeavingForm personId={p.id} name={p.firstName} />}
                    </div>
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

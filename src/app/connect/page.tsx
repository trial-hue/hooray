import Link from "next/link";
import { ClockBar } from "@/components/ClockBar";
import { CONNECTORS } from "@/lib/connectors";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ConnectPage() {
  const db = getDb();
  const src = db.company?.source;
  const hr = CONNECTORS.filter((c) => c.kind === "hr");
  const crm = CONNECTORS.filter((c) => c.kind === "crm");
  return (
    <>
      <ClockBar active="/people" />
      <main className="mx-auto w-full max-w-4xl px-5 py-8">
        <p className="label mb-1">
          <Link href="/people" className="hover:underline">
            People
          </Link>{" "}
          › Connect
        </p>
        <h1 className="h1">Connect your HR system or CRM</h1>
        <p className="hint mt-2 max-w-2xl">
          Connect once and the roster keeps itself up to date: new starters, leavers and client wins arrive without anyone uploading anything. Read-only access, and dates of birth are only used for staff who have said yes.
        </p>
        {src && (
          <p className="mt-3 text-sm text-ink-2">
            Currently synced from <span className="font-medium">{src.provider}</span>
            {src.simulated ? " (simulated for the demo)" : ""} on {src.syncedOn}.
          </p>
        )}

        <h2 className="h2 mt-8">Staff</h2>
        <p className="hint mt-0.5">Birthdays, anniversaries, welcomes and leavers come from here.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {hr.map((c) => (
            <Link key={c.id} href={`/connect/${c.id}`} className="card-panel p-4 transition hover:bg-paper-2/60">
              <div className="font-display text-xl">{c.name}</div>
              <p className="hint mt-1">{c.blurb}</p>
            </Link>
          ))}
        </div>

        <h2 className="h2 mt-8">Clients</h2>
        <p className="hint mt-0.5">Client anniversaries and milestones, signed by the partner who owns the relationship.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {crm.map((c) => (
            <Link key={c.id} href={`/connect/${c.id}`} className="card-panel p-4 transition hover:bg-paper-2/60">
              <div className="font-display text-xl">{c.name}</div>
              <p className="hint mt-1">{c.blurb}</p>
            </Link>
          ))}
          <Link href="/onboarding" className="card-panel p-4 transition hover:bg-paper-2/60">
            <div className="font-display text-xl">A spreadsheet</div>
            <p className="hint mt-1">Upload a CSV export from anything else.</p>
          </Link>
        </div>
      </main>
    </>
  );
}

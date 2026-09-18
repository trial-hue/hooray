import Link from "next/link";
import { getDb } from "@/lib/db";
import { addDays, dayOfWeek, formatLong } from "@/lib/dates";
import { openDigest } from "@/lib/engine";
import { ClockControls } from "./ClockControls";

export function ClockBar({ active }: { active: string }) {
  const db = getDb();
  const digest = openDigest(db);
  const openCount = digest ? digest.cardIds.filter((id) => ["drafted", "needs_review", "held"].includes(db.cards.find((c) => c.id === id)?.status ?? "")).length : 0;
  const nav: [string, string][] = [
    ["/calendar", "Calendar"],
    ["/digest", "Digest"],
    ["/print", "Print"],
    ["/dashboard", "Dashboard"],
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="font-display text-xl tracking-tight text-navy">
          Occasionally
        </Link>
        {db.company && (
          <span className="text-sm text-ink-3">
            for <span className="text-ink-2">{db.company.shortName}</span>
          </span>
        )}
        <nav className="flex items-center gap-1 text-sm">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className={`rounded-md px-2.5 py-1 ${active === href ? "bg-white shadow-sm text-ink" : "text-ink-2 hover:bg-paper-2"}`}>
              {label}
              {href === "/digest" && openCount > 0 && <span className="ml-1.5 rounded-full bg-navy px-1.5 text-[10px] text-white">{openCount}</span>}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-[10px] uppercase tracking-wide text-ink-3">Simulated today</div>
            <div className="text-sm font-medium">{formatLong(db.clock.today)}</div>
          </div>
          <ClockControls hasCompany={Boolean(db.company)} nextMonday={nextMondayLabel(db.clock.today)} />
        </div>
      </div>
    </header>
  );
}

function nextMondayLabel(today: string): string {
  const dow = dayOfWeek(today);
  const days = dow === 1 ? 7 : ((8 - dow) % 7 || 7);
  return formatLong(addDays(today, days));
}

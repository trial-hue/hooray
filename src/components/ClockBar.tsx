import Link from "next/link";
import { getDb } from "@/lib/db";
import { addDays, formatLong } from "@/lib/dates";
import { materialiseOccasions } from "@/lib/occasions";
import { LEAD_DAYS, type DB } from "@/lib/types";
import { ClockControls, type ClockPreview } from "./ClockControls";

function preview(db: DB, days: number): ClockPreview {
  const today = db.clock.today;
  const target = addDays(today, days);
  const dispatch = db.cards.filter((c) => c.dispatchOn <= target && ["needs_review", "drafted", "approved", "edited"].includes(c.status)).length;
  const drafts = db.company
    ? materialiseOccasions(db, addDays(today, LEAD_DAYS + 1), addDays(target, LEAD_DAYS)).filter((o) => !db.cards.some((c) => c.occurrenceKey === o.occurrenceKey)).length
    : 0;
  const closing = db.collections.filter((c) => c.status === "open" && c.closesOn <= target).length;
  return { days, label: formatLong(target), dispatch, drafts, closing };
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
        <rect x="2" y="5" width="3" height="6" rx="0.8" fill="var(--hooray)" transform="rotate(-25 3.5 8)" />
        <rect x="7" y="2" width="3" height="6" rx="0.8" fill="var(--gold)" transform="rotate(15 8.5 5)" />
        <rect x="11" y="7" width="3" height="6" rx="0.8" fill="var(--navy)" transform="rotate(35 12.5 10)" />
      </svg>
      <span className="font-display text-xl tracking-tight text-navy">Hooray</span>
    </span>
  );
}

export function ClockBar({ active }: { active: string }) {
  const db = getDb();
  const openCount = db.cards.filter((c) => ["drafted", "needs_review", "held"].includes(c.status)).length;
  const openCollections = db.collections.filter((c) => c.status === "open").length;
  const nav: [string, string][] = [
    ["/digest", "This week"],
    ["/people", "People"],
    ["/dashboard", "Numbers"],
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5">
        <Link href="/" className="flex items-baseline gap-2">
          <Wordmark />
          {db.company && <span className="text-sm text-ink-3">· {db.company.shortName}</span>}
        </Link>
        {db.company && (
          <nav className="flex items-center gap-0.5 text-sm">
            {nav.map(([href, label]) => (
              <Link key={href} href={href} className={`rounded-md px-2.5 py-1.5 ${active === href || (href === "/digest" && (active === "/calendar" || active === "/print")) ? "bg-white text-ink shadow-sm" : "text-ink-2 hover:bg-paper-2"}`}>
                {label}
                {href === "/digest" && openCount > 0 && <span className="ml-1.5 rounded-full bg-navy px-1.5 text-[10px] text-white">{openCount}</span>}
                {href === "/people" && openCollections > 0 && <span className="ml-1.5 rounded-full bg-gold px-1.5 text-[10px] text-white">{openCollections}</span>}
              </Link>
            ))}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink-3">Today</div>
            <div className="font-display text-[15px]">{formatLong(db.clock.today)}</div>
          </div>
          <ClockControls hasCompany={Boolean(db.company)} previews={[preview(db, 1), preview(db, 7), preview(db, 30)]} />
        </div>
      </div>
    </header>
  );
}

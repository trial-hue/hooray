// Materialise occasion instances from the roster for a date window.
import { onYear, yearOf, yearsBetween } from "./dates";
import type { DB, ISODate, Occasion, OccasionType, Person } from "./types";

export function occurrenceKey(personId: string, type: OccasionType, date: ISODate): string {
  return `${personId}:${type}:${date}`;
}

function make(p: Person, type: OccasionType, date: ISODate, extra: Partial<Occasion> = {}): Occasion {
  const key = occurrenceKey(p.id, type, date);
  return { id: key, occurrenceKey: key, personId: p.id, type, date, createdBy: "roster", ...extra };
}

function inWindow(d: ISODate, from: ISODate, to: ISODate): boolean {
  return d >= from && d <= to;
}

/** All occasions with a date in [from, to] (inclusive), including human-created ones already stored. */
export function materialiseOccasions(db: DB, from: ISODate, to: ISODate): Occasion[] {
  const out: Occasion[] = [];
  const years = new Set([yearOf(from), yearOf(to)]);

  for (const p of db.people) {
    if (p.status === "left") continue;

    if (p.birthday) {
      for (const y of years) {
        const d = onYear(p.birthday, y);
        if (inWindow(d, from, to)) out.push(make(p, "birthday", d));
      }
    }

    if (p.startDate) {
      if (p.kind === "staff") {
        // Welcome: start date falls inside the window and is after the sim start
        if (inWindow(p.startDate, from, to) && p.startDate > db.clock.startedOn) {
          out.push(make(p, "welcome", p.startDate));
        }
        for (const y of years) {
          const d = onYear(p.startDate.slice(5), y);
          if (inWindow(d, from, to) && d > p.startDate) {
            const n = yearsBetween(p.startDate, d);
            if (n >= 1) out.push(make(p, "work-anniversary", d, { ordinal: n }));
          }
        }
      } else {
        for (const y of years) {
          const d = onYear(p.startDate.slice(5), y);
          if (inWindow(d, from, to) && d > p.startDate) {
            const n = yearsBetween(p.startDate, d);
            if (n >= 1) out.push(make(p, "client-anniversary", d, { ordinal: n }));
          }
        }
      }
    }

    for (const m of p.milestones ?? []) {
      if (inWindow(m.date, from, to)) {
        out.push(make(p, "client-milestone", m.date, { label: m.label, createdBy: "human" }));
      }
    }
  }

  for (const o of db.occasions) {
    if (o.createdBy === "human" && inWindow(o.date, from, to) && !out.some((x) => x.id === o.id)) out.push(o);
  }

  // de-dupe and sort
  const seen = new Set<string>();
  return out
    .filter((o) => (seen.has(o.id) ? false : (seen.add(o.id), true)))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.personId.localeCompare(b.personId)));
}

export const OCCASION_LABEL: Record<OccasionType, string> = {
  birthday: "Birthday",
  "work-anniversary": "Work anniversary",
  welcome: "Welcome",
  "client-anniversary": "Client anniversary",
  "client-milestone": "Client milestone",
  sympathy: "Sympathy",
  "get-well": "Get well",
  congratulations: "Congratulations",
};

export function occasionTitle(o: Occasion): string {
  switch (o.type) {
    case "work-anniversary":
      return `${o.ordinal}-year work anniversary`;
    case "client-anniversary":
      return `${o.ordinal} years as a client`;
    case "client-milestone":
      return o.label ? `Milestone: ${o.label}` : "Client milestone";
    case "welcome":
      return "First day";
    default:
      return OCCASION_LABEL[o.type];
  }
}

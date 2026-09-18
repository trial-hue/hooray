// Pure string-date helpers. ISO 'YYYY-MM-DD' in, ISO out. UTC throughout so
// the simulated clock never drifts with the machine's timezone.

import type { ISODate } from "./types";

const DAY_MS = 86_400_000;

export function toUtc(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function fromUtc(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: ISODate, n: number): ISODate {
  return fromUtc(new Date(toUtc(iso).getTime() + n * DAY_MS));
}

export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / DAY_MS);
}

/** 0 = Sunday … 6 = Saturday */
export function dayOfWeek(iso: ISODate): number {
  return toUtc(iso).getUTCDay();
}

export function isMonday(iso: ISODate): boolean {
  return dayOfWeek(iso) === 1;
}

/** Monday on or before the given date. */
export function mondayOf(iso: ISODate): ISODate {
  const dow = dayOfWeek(iso);
  const back = dow === 0 ? 6 : dow - 1;
  return addDays(iso, -back);
}

export function addBusinessDays(iso: ISODate, n: number): ISODate {
  let cur = iso;
  let left = n;
  while (left > 0) {
    cur = addDays(cur, 1);
    const dow = dayOfWeek(cur);
    if (dow !== 0 && dow !== 6) left -= 1;
  }
  return cur;
}

export function yearOf(iso: ISODate): number {
  return Number(iso.slice(0, 4));
}

export function monthDay(iso: ISODate): string {
  return iso.slice(5);
}

/** 'MM-DD' + year → ISO. 29 Feb in a non-leap year becomes 28 Feb. */
export function onYear(mmdd: string, year: number): ISODate {
  const [m, d] = mmdd.split("-").map(Number);
  const last = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return fromUtc(new Date(Date.UTC(year, m - 1, Math.min(d, last))));
}

/** Whole years between two ISO dates (birthday-style). */
export function yearsBetween(from: ISODate, to: ISODate): number {
  const a = toUtc(from);
  const b = toUtc(to);
  let years = b.getUTCFullYear() - a.getUTCFullYear();
  const beforeAnniv =
    b.getUTCMonth() < a.getUTCMonth() ||
    (b.getUTCMonth() === a.getUTCMonth() && b.getUTCDate() < a.getUTCDate());
  if (beforeAnniv) years -= 1;
  return years;
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MON_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "Mon 28 Sep 2026" */
export function formatLong(iso: ISODate): string {
  const d = toUtc(iso);
  return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "28 Sep" */
export function formatShort(iso: ISODate): string {
  const d = toUtc(iso);
  return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
}

/** "Monday 28 September" */
export function formatSpoken(iso: ISODate): string {
  const d = toUtc(iso);
  const dow = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][d.getUTCDay()];
  return `${dow} ${d.getUTCDate()} ${MON_LONG[d.getUTCMonth()]}`;
}

/** "28 Sep – 4 Oct" */
export function formatRange(from: ISODate, to: ISODate): string {
  return `${formatShort(from)} – ${formatShort(to)}`;
}

export function ordinalWord(n: number): string {
  const words = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  return n >= 1 && n <= 10 ? words[n] : String(n);
}

export function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function clampIso(iso: string): ISODate {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : "";
}

// CSV roster import/export. One file, `kind` discriminates staff from clients.
import Papa from "papaparse";
import type { Address, LeaveReason, Person, PersonStatus } from "./types";

export const CSV_COLUMNS = [
  "kind",
  "first_name",
  "last_name",
  "preferred_name",
  "email",
  "role",
  "team",
  "office",
  "start_date",
  "birthday",
  "manager_email",
  "client_since",
  "client_company",
  "relationship_owner_email",
  "address_line1",
  "address_line2",
  "town",
  "postcode",
  "deliver_to",
  "opt_out",
  "status",
  "leave_reason",
  "leave_until",
  "public_facts",
  "private_notes",
  "sign_as",
  "preferred_signature",
  "voice_sample",
  "milestones",
] as const;

type Row = Record<(typeof CSV_COLUMNS)[number], string>;

export function slugId(s: string): string {
  return s
    .toLowerCase()
    .replace(/@.*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitList(s: string | undefined): string[] {
  return (s ?? "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

function addr(r: Row): Address | undefined {
  if (!r.address_line1?.trim() || !r.postcode?.trim()) return undefined;
  return {
    line1: r.address_line1.trim(),
    line2: r.address_line2?.trim() || undefined,
    town: r.town?.trim() ?? "",
    postcode: r.postcode.trim(),
  };
}

export type ImportResult = { people: Person[]; warnings: string[] };

export function parseRoster(csv: string): ImportResult {
  const parsed = Papa.parse<Row>(csv.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  const warnings: string[] = [];
  const people: Person[] = [];
  const byEmail = new Map<string, string>();

  for (const r of parsed.data) {
    const kind = r.kind?.trim() === "client" ? "client" : "staff";
    const first = r.first_name?.trim();
    const last = r.last_name?.trim();
    if (!first || !last) {
      warnings.push(`Row skipped: missing name (${JSON.stringify(r).slice(0, 60)})`);
      continue;
    }
    const email = r.email?.trim() || `${first}.${last}@example.invalid`;
    const id = slugId(email);
    if (byEmail.has(email.toLowerCase())) {
      warnings.push(`Duplicate email ${email}; second row skipped`);
      continue;
    }
    byEmail.set(email.toLowerCase(), id);
    const status = (["active", "on-leave", "left"].includes(r.status?.trim())
      ? r.status.trim()
      : "active") as PersonStatus;
    const leaveReason = r.leave_reason?.trim() as LeaveReason | "";
    const a = addr(r);
    const deliverTo =
      kind === "client"
        ? "client-registered"
        : r.deliver_to?.trim() === "home"
          ? "home"
          : "office";
    const milestones = splitList(r.milestones)
      .map((m) => {
        const [date, ...label] = m.split(":");
        return { date: date.trim(), label: label.join(":").trim() };
      })
      .filter((m) => /^\d{4}-\d{2}-\d{2}$/.test(m.date) && m.label);

    const p: Person = {
      id,
      kind,
      firstName: first,
      lastName: last,
      preferredName: r.preferred_name?.trim() || undefined,
      email,
      role: r.role?.trim() || (kind === "client" ? "Contact" : "Staff"),
      team: kind === "client" ? r.client_company?.trim() || r.team?.trim() || "" : r.team?.trim() || "",
      office: r.office?.trim() || "",
      startDate: (kind === "client" ? r.client_since : r.start_date)?.trim() || undefined,
      birthday: normaliseBirthday(r.birthday, warnings, `${first} ${last}`),
      clientCompanyName: kind === "client" ? r.client_company?.trim() || undefined : undefined,
      status,
      leaveReason: leaveReason || undefined,
      leaveUntil: r.leave_until?.trim() || undefined,
      optOut: /^(true|yes|1)$/i.test(r.opt_out?.trim() ?? ""),
      deliverTo,
      homeAddress: kind === "staff" && deliverTo === "home" ? a : undefined,
      registeredAddress: kind === "client" ? a : undefined,
      publicFacts: splitList(r.public_facts),
      privateNotes: splitList(r.private_notes),
      signAs: r.sign_as?.trim() || undefined,
      preferredSignature: r.preferred_signature?.trim() || undefined,
      voiceSample: r.voice_sample?.trim() || undefined,
      milestones: milestones.length ? milestones : undefined,
    };
    // stash emails for second pass
    (p as Person & { _mgr?: string; _own?: string })._mgr = r.manager_email?.trim().toLowerCase();
    (p as Person & { _mgr?: string; _own?: string })._own = r.relationship_owner_email?.trim().toLowerCase();
    people.push(p);
  }

  for (const p of people) {
    const x = p as Person & { _mgr?: string; _own?: string };
    if (x._mgr) {
      const m = byEmail.get(x._mgr);
      if (m) p.managerId = m;
      else warnings.push(`${p.firstName} ${p.lastName}: manager ${x._mgr} not found`);
    }
    if (x._own) {
      const o = byEmail.get(x._own);
      if (o) p.accountOwnerId = o;
      else warnings.push(`${p.firstName} ${p.lastName}: relationship owner ${x._own} not found`);
    }
    delete x._mgr;
    delete x._own;
  }
  return { people, warnings };
}

function normaliseBirthday(raw: string | undefined, warnings: string[], who: string): string | undefined {
  const s = raw?.trim();
  if (!s) return undefined;
  // Accept YYYY-MM-DD (year dropped) or MM-DD or DD/MM
  let m = s.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}`;
  m = s.match(/^(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/);
  if (m) return `${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  warnings.push(`${who}: unrecognised birthday "${s}"`);
  return undefined;
}

export function toCsv(people: Person[], byId: Map<string, Person>): string {
  const rows = people.map((p) => {
    const a = p.kind === "client" ? p.registeredAddress : p.homeAddress;
    const row: Row = {
      kind: p.kind,
      first_name: p.firstName,
      last_name: p.lastName,
      preferred_name: p.preferredName ?? "",
      email: p.email ?? "",
      role: p.role,
      team: p.kind === "client" ? "" : p.team,
      office: p.office,
      start_date: p.kind === "staff" ? (p.startDate ?? "") : "",
      birthday: p.birthday ?? "",
      manager_email: p.managerId ? (byId.get(p.managerId)?.email ?? "") : "",
      client_since: p.kind === "client" ? (p.startDate ?? "") : "",
      client_company: p.clientCompanyName ?? "",
      relationship_owner_email: p.accountOwnerId ? (byId.get(p.accountOwnerId)?.email ?? "") : "",
      address_line1: a?.line1 ?? "",
      address_line2: a?.line2 ?? "",
      town: a?.town ?? "",
      postcode: a?.postcode ?? "",
      deliver_to: p.deliverTo,
      opt_out: p.optOut ? "true" : "",
      status: p.status,
      leave_reason: p.leaveReason ?? "",
      leave_until: p.leaveUntil ?? "",
      public_facts: p.publicFacts.join(" | "),
      private_notes: p.privateNotes.join(" | "),
      sign_as: p.signAs ?? "",
      preferred_signature: p.preferredSignature ?? "",
      voice_sample: p.voiceSample ?? "",
      milestones: (p.milestones ?? []).map((m) => `${m.date}:${m.label}`).join(" | "),
    };
    return row;
  });
  return Papa.unparse({ fields: [...CSV_COLUMNS], data: rows.map((r) => CSV_COLUMNS.map((c) => r[c])) });
}

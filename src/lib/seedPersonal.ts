// A personal account: one owner, and the people they care about.
import type { Company, Person } from "./types";

export function seedPersonalAccount(opts: { name: string; brandHex: string; toneWords: string[]; signOff: string; address?: Person["homeAddress"]; email?: string }): { company: Company; owner: Person } {
  const first = opts.name.trim().split(/\s+/)[0] || "Me";
  const last = opts.name.trim().split(/\s+/).slice(1).join(" ") || "";
  const id = `me-${first.toLowerCase()}`;
  const company: Company = {
    id: `personal-${first.toLowerCase()}`,
    kind: "personal",
    subscription: false,
    email: opts.email?.trim() || undefined,
    name: opts.name.trim(),
    shortName: first,
    sector: "other",
    toneWords: opts.toneWords.length ? opts.toneWords : ["warm", "a bit silly", "says what I actually mean"],
    formality: "low",
    brandHex: opts.brandHex,
    offices: opts.address ? { Home: opts.address } : {},
    primaryOffice: "Home",
    neverMention: [],
    signOff: opts.signOff || "Lots of love",
    approverId: id,
    managingPartnerId: id,
    allowAgeMentions: false,
  };
  const owner: Person = {
    id,
    kind: "staff",
    firstName: first,
    lastName: last,
    role: "",
    team: "",
    office: "Home",
    status: "active",
    optOut: true, // the owner never gets a card from themselves
    consentOccasions: false,
    deliverTo: "home",
    homeAddress: opts.address,
    publicFacts: [],
    privateNotes: [],
    signAs: first,
    preferredSignature: first,
  };
  return { company, owner };
}

type ContactInput = Omit<Person, "id" | "kind" | "status" | "optOut" | "consentOccasions" | "deliverTo" | "publicFacts" | "privateNotes" | "managerId"> & { publicFacts?: string[] };

export function seedPersonalContacts(): ContactInput[] {
  return [
    {
      firstName: "Meera",
      lastName: "Devon",
      role: "",
      team: "",
      office: "",
      relationship: "my mum",
      birthday: "09-30",
      homeAddress: { line1: "18 Orchard Close", town: "Harrow", postcode: "HA1 3QT" },
      publicFacts: ["Just took up watercolours and is better than she admits", "Still rings every Sunday at six"],
      signAs: undefined,
      preferredSignature: undefined,
    },
    {
      firstName: "Tom",
      lastName: "Okafor",
      role: "",
      team: "",
      office: "",
      relationship: "my best friend since school",
      birthday: "03-14",
      homeAddress: { line1: "4 Wharf Street", town: "Bristol", postcode: "BS1 4RH" },
      publicFacts: ["Married Sam on 3 October 2021", "Runs a coffee cart at the Saturday market"],
      milestones: [{ date: "2026-10-03", label: "Fifth wedding anniversary with Sam" }],
    },
    {
      firstName: "Isla",
      lastName: "Bennett",
      role: "",
      team: "",
      office: "",
      relationship: "my goddaughter, she's turning seven",
      birthday: "10-02",
      dob: "2019-10-02",
      homeAddress: { line1: "22 Ferndale Road", town: "Leeds", postcode: "LS8 2PY" },
      publicFacts: ["Obsessed with dinosaurs and swimming", "Lost her first tooth in August"],
    },
  ];
}

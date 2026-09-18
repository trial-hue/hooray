// Core domain types for Occasionally.
// All simulated dates are ISO 'YYYY-MM-DD' strings. Never store Date objects in state.

export type ISODate = string;

export type Address = {
  line1: string;
  line2?: string;
  town: string;
  postcode: string;
};

export type Sector =
  | "accountancy"
  | "law"
  | "ifa"
  | "estate-agency"
  | "recruitment"
  | "other";

export type Formality = "low" | "medium" | "high";

export type Company = {
  id: string;
  name: string; // "Hartley & Crane LLP"
  shortName: string; // "Hartley & Crane"
  sector: Sector;
  sizeNote?: string; // "120 staff, offices in Manchester and Leeds"
  toneWords: string[];
  formality: Formality;
  brandHex: string;
  brandSecondaryHex?: string;
  accentHex?: string;
  logoUrl?: string;
  offices: Record<string, Address>;
  primaryOffice: string;
  neverMention: string[];
  signOff: string; // "Warm wishes"
  approverId?: string;
  managingPartnerId?: string;
  allowAgeMentions: boolean;
};

export type PersonKind = "staff" | "client";
export type PersonStatus = "active" | "on-leave" | "left";
export type LeaveReason =
  | "parental"
  | "sick"
  | "sabbatical"
  | "bereavement"
  | "other";

export type Person = {
  id: string;
  kind: PersonKind;
  firstName: string;
  lastName: string;
  preferredName?: string;
  pronouns?: string;
  email?: string;
  role: string;
  team: string; // clients: the client company name
  office: string;
  startDate?: ISODate; // staff: joined; clients: client since
  birthday?: string; // 'MM-DD' (derived from dob when dob is given)
  dob?: ISODate; // full date of birth, only when the roster supplies it (milestone birthdays)
  endDate?: ISODate; // leaving date; set to trigger a leaver/retirement occasion
  retiring?: boolean;
  managerId?: string; // staff: line manager
  accountOwnerId?: string; // client: relationship partner
  clientCompanyName?: string;
  status: PersonStatus;
  leaveReason?: LeaveReason;
  leaveUntil?: ISODate;
  bereavementUntil?: ISODate;
  optOut: boolean;
  consentOccasions: boolean; // asked once at onboarding; payroll DOB cannot be reused for a birthday without it
  deliverTo: "office" | "home" | "client-registered";
  homeAddress?: Address;
  registeredAddress?: Address;
  publicFacts: string[]; // may be used in card copy
  privateNotes: string[]; // NEVER sent to the model
  signAs?: string; // handwritten name when signing: "Tom"
  preferredSignature?: string; // "Tom Whitfield, Audit Partner"
  voiceSample?: string;
  milestones?: { date: ISODate; label: string }[];
};

export type OccasionType =
  | "birthday"
  | "work-anniversary"
  | "welcome"
  | "leaver"
  | "retirement"
  | "client-anniversary"
  | "client-milestone"
  | "sympathy"
  | "get-well"
  | "congratulations";

export type Occasion = {
  id: string; // === occurrenceKey
  personId: string;
  type: OccasionType;
  date: ISODate; // the day the card should be in hand
  ordinal?: number; // 5 for "5th work anniversary"
  label?: string; // milestone label
  createdBy: "roster" | "human";
  occurrenceKey: string; // `${personId}:${type}:${date}`
  isMilestone?: boolean; // milestone birthday (30/40/50/60) or anniversary (1/3/5/10/15/20)
  collectionEligible?: boolean;
};

export type CardStatus =
  | "held"
  | "needs_review"
  | "drafted"
  | "edited"
  | "approved"
  | "skipped"
  | "sent_to_print"
  | "printed"
  | "posted"
  | "delivered";

export const ART_TEMPLATES = [
  "confetti",
  "rings",
  "numeral",
  "bands",
  "sprig",
  "sparks",
  "dots",
  "waves",
] as const;
export type ArtTemplate = (typeof ART_TEMPLATES)[number];

export const PALETTE_VARIANTS = ["bright", "formal", "muted"] as const;
export type PaletteVariant = (typeof PALETTE_VARIANTS)[number];

export type ArtworkBrief = {
  template: ArtTemplate;
  palette_variant: PaletteVariant;
  style_note: string;
};

export type Draft = {
  front_headline: string;
  inside_message: string;
  sign_off: string;
  signature_line: string;
  artwork_brief: ArtworkBrief;
  flags: string[];
  rationale: string;
};

export type FinalText = Pick<
  Draft,
  "front_headline" | "inside_message" | "sign_off" | "signature_line"
>;

export type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
};

export type DraftSource = "claude" | "cache" | "template";

export type DraftVersion = {
  draft: Draft;
  createdAt: ISODate;
  hint?: string;
  promptHash: string;
  model: string;
  usage: Usage;
  attempts: number;
  source: DraftSource;
  ms?: number;
};

export type GateReason =
  | "left-company"
  | "opted-out"
  | "no-consent"
  | "on-leave-sick"
  | "on-leave-other"
  | "bereavement-window"
  | "address-missing"
  | "signer-missing"
  | "signer-left"
  | "signer-is-recipient"
  | "start-date-in-future"
  | "duplicate-occurrence";

export type CardFlag = {
  kind: "gate" | "model" | "check";
  text: string;
};

export type Card = {
  id: string;
  occurrenceKey: string;
  occasionId: string;
  personId: string;
  signerId: string;
  coSignerId?: string;
  dueDate: ISODate;
  status: CardStatus;
  holdReason?: GateReason;
  violations?: string[];
  flags: CardFlag[];
  versions: DraftVersion[];
  finalText?: FinalText; // frozen on approve/edit
  seed: number;
  approvedBy?: string;
  approvedAt?: ISODate;
  editedAt?: ISODate;
  skipReason?: string;
  digestId?: string;
  printJobId?: string;
  collectionId?: string;
  autoApproved?: boolean;
  dispatchOn: ISODate; // dueDate - DISPATCH_DAYS
  proof?: { provider: "stannp"; id: string; pdfUrl: string; cost: string; status: string; at: ISODate; error?: string };
  history: { at: ISODate; status: CardStatus; note?: string }[];
  aiCostGbp: number;
};

export type Contribution = {
  contributorId: string;
  amountPence: number;
  message: string;
  at: ISODate;
};

export type Collection = {
  id: string;
  occasionId: string;
  personId: string;
  cardId: string;
  teamIds: string[]; // colleagues invited (immediate team)
  suggestedPence: number;
  closesOn: ISODate;
  status: "open" | "closed";
  giftChoice?: string;
  contributions: Contribution[];
  openedOn: ISODate;
};

export type Digest = {
  id: string;
  weekStart: ISODate; // Monday the digest was created
  coversFrom: ISODate;
  coversTo: ISODate; // inclusive
  cardIds: string[];
  status: "open" | "submitted";
  createdOn: ISODate;
  submittedOn?: ISODate;
};

export type PrintJob = {
  id: string;
  digestId?: string;
  cardIds: string[];
  submittedOn: ISODate;
  provider: "mock-prodigi";
  ref: string;
  expected: { printed: ISODate; posted: ISODate; delivered: ISODate };
  orderPath?: string;
};

export type SimClock = {
  today: ISODate;
  startedOn: ISODate;
  log: { at: ISODate; event: string }[];
};

export type DB = {
  company?: Company;
  people: Person[];
  occasions: Occasion[];
  cards: Card[];
  digests: Digest[];
  printJobs: PrintJob[];
  collections: Collection[];
  clock: SimClock;
  settings: { pricePerCard: number };
};

export const SIM_START: ISODate = "2026-09-21"; // Monday
export const LEAD_DAYS = 10; // drafts are created this many days before the occasion
export const DISPATCH_DAYS = 5; // anything still pending is auto-approved and sent this many days before
export const MILESTONE_AGES = [30, 40, 50, 60];
export const MILESTONE_YEARS = [1, 3, 5, 10, 15, 20];

export function emptyDb(): DB {
  return {
    company: undefined,
    people: [],
    occasions: [],
    cards: [],
    digests: [],
    printJobs: [],
    collections: [],
    clock: { today: SIM_START, startedOn: SIM_START, log: [] },
    settings: { pricePerCard: 6 },
  };
}

export function currentDraft(card: Card): Draft | undefined {
  return card.versions[card.versions.length - 1]?.draft;
}

export function finalTextOf(card: Card): FinalText | undefined {
  if (card.finalText) return card.finalText;
  const d = currentDraft(card);
  if (!d) return undefined;
  return {
    front_headline: d.front_headline,
    inside_message: d.inside_message,
    sign_off: d.sign_off,
    signature_line: d.signature_line,
  };
}

export function displayName(p: Person): string {
  return p.preferredName || p.firstName;
}

export function fullName(p: Person): string {
  return `${p.firstName} ${p.lastName}`;
}

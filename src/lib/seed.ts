// Deterministic demo roster: Hartley & Crane LLP, chartered accountants.
// 50 staff and 10 clients, dates spread through the year, plus hero cases that script the demo.
import { mulberry32, pick } from "./rng";
import { onYear } from "./dates";
import type { Address, Company, Person } from "./types";

export const DEMO_COMPANY: Company = {
  id: "hartley-crane",
  name: "Hartley & Crane LLP",
  shortName: "Hartley & Crane",
  sector: "accountancy",
  sizeNote: "50 staff, offices in Manchester and Leeds",
  toneWords: ["warm", "understated", "Northern", "first names", "a firm that remembers"],
  formality: "medium",
  brandHex: "#1F3A5F",
  brandSecondaryHex: "#7FA38C",
  accentHex: "#D4A24C",
  offices: {
    Manchester: { line1: "Hartley & Crane LLP", line2: "14 King Street", town: "Manchester", postcode: "M2 6AQ" },
    Leeds: { line1: "Hartley & Crane LLP", line2: "3 Park Row", town: "Leeds", postcode: "LS1 5HD" },
  },
  primaryOffice: "Manchester",
  neverMention: ["the 2024 Leeds lease dispute"],
  signOff: "Warm wishes",
  approverId: "rachel-okafor",
  managingPartnerId: "james-hartley",
  allowAgeMentions: false,
};

const FIRST = ["Amelia", "Oliver", "Isla", "George", "Ava", "Noah", "Mia", "Arthur", "Freya", "Leo", "Grace", "Oscar", "Sophia", "Harry", "Lily", "Jack", "Ella", "Charlie", "Evie", "Jacob", "Zara", "Hamza", "Yusuf", "Maryam", "Ibrahim", "Ngozi", "Tariq", "Meera", "Rohan", "Anjali", "Sean", "Niamh", "Ciaran", "Aoife", "Ewan", "Bethan", "Rhys", "Carys", "Dylan", "Ines", "Mateusz", "Agnieszka", "Chen", "Wei", "Yuki", "Omar", "Layla", "Hannah", "Joel"];
const LAST = ["Walker", "Hughes", "Wright", "Green", "Hall", "Wood", "Harris", "Martin", "Cooper", "Ward", "Turner", "Hill", "Moore", "Baker", "Bell", "Cox", "Kelly", "Murphy", "Doyle", "Byrne", "Quinn", "Jones", "Davies", "Evans", "Owen", "Morgan", "Price", "Khan", "Ahmed", "Ali", "Begum", "Patel", "Singh", "Kaur", "Okonkwo", "Adeyemi", "Nowak", "Kowalski", "Lee", "Nguyen", "Tanaka", "Rossi", "Silva", "Fischer", "Novak", "Larsson", "Berg", "Dubois", "Jensen", "Costa"];
const TOWNS: [string, string][] = [["Manchester", "M"], ["Leeds", "LS"], ["Stockport", "SK"], ["Bolton", "BL"], ["Harrogate", "HG"], ["Sheffield", "S"], ["Bradford", "BD"], ["Chester", "CH"], ["Warrington", "WA"], ["York", "YO"]];
const STREETS = ["Mill Lane", "Station Road", "Church Street", "Victoria Road", "Park Avenue", "The Crescent", "Moor Lane", "High Street", "Canal Street", "Oak Drive"];
const CLIENT_COMPANIES = ["Fenwick Marine Ltd", "Ashworth Dental Group", "Pennine Timber Frames", "Calder Valley Brewing", "Ribble Print Works", "Marsden Veterinary Practice", "Northgate Property", "Aire Engineering", "Holroyd Fasteners", "Whitworth Textiles"];
const CLIENT_ROLES = ["Managing Director", "Finance Director", "Owner", "Founder", "Financial Controller", "Operations Director"];

// Keep generated occasions out of the first scripted fortnight so the opening digest is curated.
const AVOID_WINDOWS: [string, string][] = [["09-21", "10-08"]];
const inAvoid = (mmdd: string) => AVOID_WINDOWS.some(([a, b]) => mmdd >= a && mmdd <= b);

function homeAddress(rng: () => number): Address {
  const [town, pc] = pick(rng, TOWNS);
  return {
    line1: `${1 + Math.floor(rng() * 120)} ${pick(rng, STREETS)}`,
    town,
    postcode: `${pc}${1 + Math.floor(rng() * 40)} ${1 + Math.floor(rng() * 9)}${String.fromCharCode(65 + Math.floor(rng() * 26))}${String.fromCharCode(65 + Math.floor(rng() * 26))}`,
  };
}

function randomMmdd(rng: () => number): string {
  for (;;) {
    const m = 1 + Math.floor(rng() * 12);
    const d = 1 + Math.floor(rng() * 28);
    const mmdd = `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (!inAvoid(mmdd)) return mmdd;
  }
}

function randomDate(rng: () => number, fromYear: number, toYear: number, before = "2026-09-01"): string {
  for (;;) {
    const y = fromYear + Math.floor(rng() * (toYear - fromYear + 1));
    const d = onYear(randomMmdd(rng), y);
    if (d <= before) return d;
  }
}

function staff(p: Partial<Person> & Pick<Person, "id" | "firstName" | "lastName" | "role" | "team" | "office">): Person {
  return { kind: "staff", email: `${p.id}@hartleycrane.co.uk`, status: "active", optOut: false, consentOccasions: true, deliverTo: "office", publicFacts: [], privateNotes: [], ...p };
}

export function seedPeople(): Person[] {
  const rng = mulberry32(20260918);
  const people: Person[] = [];
  const used = new Set<string>();

  // Leadership and managers (11)
  people.push(
    staff({ id: "james-hartley", firstName: "James", lastName: "Hartley", role: "Managing Partner", team: "Partners", office: "Manchester", startDate: "2004-03-01", dob: "1968-05-14", signAs: "James", preferredSignature: "James Hartley, Managing Partner", voiceSample: "Right. Good week, everyone. Thanks to the Audit team for getting Northgate over the line. See you Monday.", publicFacts: ["Founded the firm with Nadia Crane in 2004"] }),
    staff({ id: "nadia-crane", firstName: "Nadia", lastName: "Crane", role: "Tax Partner", team: "Tax", office: "Manchester", startDate: "2004-03-01", dob: "1971-11-02", signAs: "Nadia", preferredSignature: "Nadia Crane, Tax Partner", voiceSample: "Thank you for trusting us with this. We'll keep it straightforward and keep you informed." }),
    staff({ id: "tom-whitfield", firstName: "Tom", lastName: "Whitfield", role: "Audit Partner", team: "Audit", office: "Manchester", startDate: "2009-06-15", dob: "1976-02-20", signAs: "Tom", preferredSignature: "Tom Whitfield, Audit Partner", voiceSample: "Nice one. Right, who's got the Northgate file? Pub at six, first round's mine." }),
    staff({ id: "aisha-rahman", firstName: "Aisha", lastName: "Rahman", role: "Advisory Partner", team: "Advisory", office: "Manchester", startDate: "2013-01-07", dob: "1980-07-19", signAs: "Aisha", preferredSignature: "Aisha Rahman, Advisory Partner", voiceSample: "Lovely to see this land. Let's make sure the client feels it too." }),
    staff({ id: "mark-ellison", firstName: "Mark", lastName: "Ellison", role: "Partner, Leeds", team: "Partners", office: "Leeds", startDate: "2011-09-05", dob: "1973-12-08", signAs: "Mark", preferredSignature: "Mark Ellison, Partner", voiceSample: "Good stuff. Leeds keeps delivering. Keep it up." }),
    staff({ id: "rachel-okafor", firstName: "Rachel", lastName: "Okafor", role: "Head of People", team: "Operations", office: "Manchester", startDate: "2017-04-03", dob: "1984-03-27", managerId: "james-hartley", signAs: "Rachel", preferredSignature: "Rachel Okafor, Head of People" }),
    staff({ id: "sarah-lindqvist", firstName: "Sarah", lastName: "Lindqvist", role: "Audit Manager", team: "Audit", office: "Manchester", startDate: "2015-02-09", dob: "1987-08-21", managerId: "tom-whitfield", signAs: "Sarah", preferredSignature: "Sarah Lindqvist, Audit Manager", voiceSample: "Brilliant work on this. Genuinely. Now go home." }),
    staff({ id: "helen-marsh", firstName: "Helen", lastName: "Marsh", role: "Tax Manager", team: "Tax", office: "Manchester", startDate: "2014-05-12", dob: "1982-01-30", managerId: "nadia-crane", signAs: "Helen", preferredSignature: "Helen Marsh, Tax Manager", voiceSample: "Welcome aboard. Ask anything, twice if you need to. The kettle is on the third floor." }),
    staff({ id: "priya-shah", firstName: "Priya", lastName: "Shah", role: "Tax Manager", team: "Tax", office: "Manchester", startDate: "2018-03-05", dob: "1989-10-01", managerId: "nadia-crane", status: "on-leave", leaveReason: "parental", leaveUntil: "2027-02-01", deliverTo: "home", homeAddress: { line1: "42 Moor Lane", town: "Stockport", postcode: "SK4 3JR" }, publicFacts: ["Runs the Tax team's graduate mentoring scheme"], privateNotes: ["On parental leave since 10 Aug; keep workload conversations for her return in February"], signAs: "Priya", preferredSignature: "Priya Shah, Tax Manager" }),
    staff({ id: "oliver-grant", firstName: "Oliver", lastName: "Grant", role: "Advisory Manager", team: "Advisory", office: "Manchester", startDate: "2019-01-14", dob: "1990-04-11", managerId: "aisha-rahman", signAs: "Oli", preferredSignature: "Oliver Grant, Advisory Manager" }),
    staff({ id: "lucy-pemberton", firstName: "Lucy", lastName: "Pemberton", role: "Outsourcing Manager", team: "Outsourcing", office: "Leeds", startDate: "2017-08-28", dob: "1985-09-12", managerId: "mark-ellison", signAs: "Lucy", preferredSignature: "Lucy Pemberton, Outsourcing Manager", voiceSample: "Thanks for everything, honestly. The payroll run has never once been late on your watch." }),
  );

  // Hero staff (13): scripted occasions in the first fortnight and a leaver candidate
  people.push(
    staff({ id: "chloe-bennett", firstName: "Chloe", lastName: "Bennett", role: "Audit Senior", team: "Audit", office: "Manchester", startDate: "2021-09-30", dob: "1996-03-08", managerId: "sarah-lindqvist", publicFacts: ["Led the Northgate audit close in June", "Runs the Thursday lunchtime 5k club", "Qualified ACA in 2024"] }),
    staff({ id: "daniel-osei", firstName: "Daniel", lastName: "Osei", role: "Graduate Trainee", team: "Tax", office: "Manchester", startDate: "2026-09-28", dob: "2003-06-17", managerId: "helen-marsh", publicFacts: ["Joining from Manchester Metropolitan, accounting and finance", "Will sit with Helen's team on the third floor", "Interviewed brilliantly on R&D tax credits"] }),
    staff({ id: "marcus-reid", firstName: "Marcus", lastName: "Reid", role: "Audit Associate", team: "Audit", office: "Manchester", startDate: "2023-09-04", dob: "1999-09-29", managerId: "sarah-lindqvist", publicFacts: ["Passed his final ACA exams in July", "Volunteers on the firm's Number Partners school scheme"] }),
    staff({ id: "fatima-hussain", firstName: "Fatima", lastName: "Hussain", role: "Advisory Consultant", team: "Advisory", office: "Manchester", startDate: "2022-02-14", dob: "1993-10-02", managerId: "oliver-grant", publicFacts: ["Led the Calder Valley Brewing valuation this summer"] }),
    staff({ id: "gary-thompson", firstName: "Gary", lastName: "Thompson", role: "Office Coordinator", team: "Operations", office: "Leeds", startDate: "2012-06-11", dob: "1976-10-03", managerId: "lucy-pemberton", publicFacts: ["Organises the Leeds Friday fruit delivery", "Ran the Leeds office move in 2023"] }),
    staff({ id: "ian-fletcher", firstName: "Ian", lastName: "Fletcher", role: "Systems Administrator", team: "Operations", office: "Manchester", startDate: "2019-11-04", dob: "1981-10-02", managerId: "rachel-okafor", optOut: true }),
    staff({ id: "sophie-nkemelu", firstName: "Sophie", lastName: "Nkemelu", role: "Bookkeeper", team: "Outsourcing", office: "Leeds", startDate: "2024-01-08", dob: "1997-09-30", managerId: "lucy-pemberton", deliverTo: "home", publicFacts: ["Works from home three days a week"] }),
    staff({ id: "amy-walsh", firstName: "Amy", lastName: "Walsh", role: "Tax Senior", team: "Tax", office: "Manchester", startDate: "2020-07-06", dob: "1994-10-06", managerId: "helen-marsh", publicFacts: ["Ran the Making Tax Digital rollout for sole-trader clients"] }),
    staff({ id: "kwame-mensah", firstName: "Kwame", lastName: "Mensah", role: "Audit Associate", team: "Audit", office: "Leeds", startDate: "2024-09-02", dob: "2000-10-08", managerId: "sarah-lindqvist", publicFacts: ["Captain of the firm's five-a-side team"] }),
    staff({ id: "emma-clarke", firstName: "Emma", lastName: "Clarke", role: "Audit Associate", team: "Audit", office: "Manchester", startDate: "2025-10-07", dob: "2001-02-02", managerId: "sarah-lindqvist", publicFacts: ["Joined from a Big Four graduate scheme", "Took over the Ribble Print Works fieldwork in her first month"] }),
    // The leaver candidate: mark Rob as leaving on stage. His team is Outsourcing, Leeds, under Lucy.
    staff({ id: "rob-sinclair", firstName: "Rob", lastName: "Sinclair", role: "Payroll Specialist", team: "Outsourcing", office: "Leeds", startDate: "2018-09-03", dob: "1988-10-11", managerId: "lucy-pemberton", publicFacts: ["Never once missed a payroll run in eight years", "Taught half the Leeds office to use pivot tables", "Famous for the Friday bacon-roll order"] }),
    staff({ id: "ben-achebe", firstName: "Ben", lastName: "Achebe", role: "Management Accountant", team: "Outsourcing", office: "Leeds", startDate: "2016-10-17", dob: "1986-06-03", managerId: "lucy-pemberton", publicFacts: ["Runs the month-end close for twenty clients"] }),
    staff({ id: "dev-patel", firstName: "Dev", lastName: "Patel", role: "IT Manager", team: "Operations", office: "Manchester", startDate: "2016-03-21", dob: "1983-11-25", managerId: "rachel-okafor", signAs: "Dev", preferredSignature: "Dev Patel, IT Manager" }),
    // Declined the consent question at onboarding: work anniversaries only, never a birthday.
    staff({ id: "hannah-quinn", firstName: "Hannah", lastName: "Quinn", role: "Audit Senior", team: "Audit", office: "Manchester", startDate: "2020-10-12", dob: "1992-09-30", managerId: "sarah-lindqvist", consentOccasions: false }),
  );
  for (const p of people) used.add(`${p.firstName} ${p.lastName}`);

  // Generated staff to reach 50, dates spread through the year
  const teams: { name: string; managerId: string; office: string; size: number; roles: string[] }[] = [
    { name: "Audit", managerId: "sarah-lindqvist", office: "Manchester", size: 7, roles: ["Audit Associate", "Audit Senior", "Audit Assistant Manager"] },
    { name: "Tax", managerId: "helen-marsh", office: "Manchester", size: 6, roles: ["Tax Associate", "Tax Senior"] },
    { name: "Advisory", managerId: "oliver-grant", office: "Manchester", size: 5, roles: ["Advisory Analyst", "Advisory Consultant"] },
    { name: "Outsourcing", managerId: "lucy-pemberton", office: "Leeds", size: 5, roles: ["Bookkeeper", "Payroll Specialist", "Management Accountant"] },
    { name: "Operations", managerId: "rachel-okafor", office: "Manchester", size: 2, roles: ["Receptionist", "People Advisor"] },
  ];
  const GENERIC = ["Organises the office bake sale for Macmillan every autumn", "Recently completed the CIMA case study", "Runs the Wednesday walking group", "Mentors two of this year's graduates", "Plays in a Sunday league football team", "Took the lead on the new timesheet system rollout", "Speaks fluent Polish and helps with the Kowalski group accounts", "Has the tidiest desk in the building"];
  for (const t of teams) {
    let made = 0;
    while (made < t.size) {
      const f = pick(rng, FIRST);
      const l = pick(rng, LAST);
      if (used.has(`${f} ${l}`)) continue;
      used.add(`${f} ${l}`);
      // Sprinkle milestone ages: some born in 1996/1986/1976 turn 30/40/50 this year.
      const yearPool = [1996, 1986, 1976, 1966, 1990, 1993, 1998, 2001, 1984, 1979, 1988, 1995];
      const by = rng() < 0.3 ? pick(rng, yearPool.slice(0, 4)) : pick(rng, yearPool.slice(4));
      people.push(
        staff({
          id: `${f}-${l}`.toLowerCase(),
          firstName: f,
          lastName: l,
          role: pick(rng, t.roles),
          team: t.name,
          office: t.office,
          startDate: randomDate(rng, 2012, 2026),
          dob: onYear(randomMmdd(rng), by),
          managerId: t.managerId,
          publicFacts: rng() < 0.4 ? [pick(rng, GENERIC)] : [],
        }),
      );
      made++;
    }
  }

  // Clients (10): one hero plus generated
  const partners = ["nadia-crane", "tom-whitfield", "aisha-rahman", "mark-ellison"];
  const clients: Person[] = [
    client("alison-reid", "Alison", "Reid", "Finance Director", "Bramley Holdings", "2016-10-02", "nadia-crane", { line1: "Bramley House", line2: "22 Deansgate", town: "Manchester", postcode: "M3 4LQ" }, ["Started with annual accounts in 2016 and moved to fully outsourced finance in 2022", "Alison has been the main contact throughout"], ["Renewal conversation due in November; price sensitive"]),
    client("harriet-kettlewell", "Harriet", "Kettlewell", "Founder", "Kettlewell Coffee Roasters", "2020-03-16", "aisha-rahman", { line1: "Unit 4, Dean Clough Mills", town: "Halifax", postcode: "HX3 5AX" }, ["Grew from one roastery to three in six years", "Aisha advised on the 2024 growth funding"], [], [{ date: "2026-10-08", label: "Opening of the third roastery in Harrogate" }]),
  ];
  let ci = 0;
  while (clients.length < 10) {
    const f = pick(rng, FIRST);
    const l = pick(rng, LAST);
    if (used.has(`${f} ${l}`)) continue;
    used.add(`${f} ${l}`);
    clients.push(client(`${f}-${l}`.toLowerCase(), f, l, pick(rng, CLIENT_ROLES), CLIENT_COMPANIES[ci++], randomDate(rng, 2010, 2025), pick(rng, partners), homeAddress(rng), rng() < 0.5 ? ["Long-standing client"] : [], []));
  }
  people.push(...clients);
  return people;
}

function client(id: string, first: string, last: string, role: string, company: string, since: string, ownerId: string, address: Address, facts: string[], priv: string[], milestones?: { date: string; label: string }[]): Person {
  return {
    id,
    kind: "client",
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]+/g, "")}.co.uk`,
    role,
    team: company,
    office: "",
    startDate: since,
    clientCompanyName: company,
    accountOwnerId: ownerId,
    status: "active",
    optOut: false,
    consentOccasions: true,
    deliverTo: "client-registered",
    registeredAddress: { ...address, line1: /^\d/.test(address.line1) ? `${company}, ${address.line1}` : address.line1 },
    publicFacts: facts,
    privateNotes: priv,
    milestones,
  };
}

export function seedCompany(): Company {
  return { ...DEMO_COMPANY, offices: { ...DEMO_COMPANY.offices } };
}

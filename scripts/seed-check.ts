import { seedPeople, seedCompany } from "../src/lib/seed";
import { parseRoster, toCsv } from "../src/lib/roster";
import { materialiseOccasions, occasionTitle } from "../src/lib/occasions";
import { emptyDb } from "../src/lib/types";
import fs from "node:fs";
const people = seedPeople();
const byId = new Map(people.map(p => [p.id, p]));
const csv = toCsv(people, byId);
fs.mkdirSync("data/demo", { recursive: true });
fs.writeFileSync("data/demo/hartley-crane.csv", csv);
const { people: re, warnings } = parseRoster(csv);
console.log("staff", people.filter(p=>p.kind==="staff").length, "clients", people.filter(p=>p.kind==="client").length, "reimported", re.length, "warnings", warnings.length, warnings.slice(0,5));
const db = { ...emptyDb(), company: seedCompany(), people: re };
for (const [a,b] of [["2026-09-28","2026-10-04"],["2026-10-05","2026-10-11"],["2026-10-12","2026-10-18"]]) {
  const occ = materialiseOccasions(db, a, b);
  console.log(`\n${a}..${b}: ${occ.length}`);
  for (const o of occ) { const p = byId.get(o.personId)!; console.log(" ", o.date, p.firstName, p.lastName, "-", occasionTitle(o), p.optOut?"(opt-out)":"", p.status!=="active"?`(${p.status})`:""); }
}
const mgrMissing = re.filter(p=>p.kind==="staff" && !p.managerId && !["james-hartley","nadia-crane","tom-whitfield","aisha-rahman","mark-ellison"].includes(p.id));
console.log("\nstaff without manager:", mgrMissing.map(p=>p.id));

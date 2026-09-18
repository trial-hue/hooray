// Who signs what. Policy lives in code, never in the model.
import type { Company, DB, Occasion, Person } from "./types";

export type SignerChoice = { signerId: string; coSignerId?: string };

export function chooseSigners(db: DB, person: Person, occ: Occasion): SignerChoice | undefined {
  const c = db.company;
  const mp = c?.managingPartnerId;
  const mgr = person.managerId;
  const owner = person.accountOwnerId;
  const alive = (id?: string) => (id && db.people.find((p) => p.id === id && p.status !== "left") ? id : undefined);

  switch (occ.type) {
    case "birthday":
    case "sympathy":
    case "get-well":
    case "congratulations": {
      if (person.kind === "client") return one(alive(owner) ?? alive(mp));
      return one(alive(mgr) ?? alive(mp));
    }
    case "work-anniversary": {
      const s = alive(mgr) ?? alive(mp);
      if (!s) return undefined;
      const big = (occ.ordinal ?? 0) >= 5 && (occ.ordinal ?? 0) % 5 === 0;
      const co = big && alive(mp) && mp !== s ? mp : undefined;
      return { signerId: s, coSignerId: co };
    }
    case "welcome": {
      const s = alive(mp) ?? alive(mgr);
      if (!s) return undefined;
      const co = alive(mgr) && mgr !== s ? mgr : undefined;
      return { signerId: s, coSignerId: co };
    }
    case "client-anniversary":
    case "client-milestone":
      return one(alive(owner) ?? alive(mp));
  }
}

function one(id?: string): SignerChoice | undefined {
  return id ? { signerId: id } : undefined;
}

export function relationshipOf(signer: Person, recipient: Person, company: Company | undefined): string {
  if (recipient.kind === "client") {
    return recipient.accountOwnerId === signer.id
      ? `relationship partner for ${recipient.clientCompanyName ?? recipient.team}`
      : `${signer.role} at ${company?.shortName ?? "the firm"}; not the day-to-day contact`;
  }
  if (recipient.managerId === signer.id) return "line manager";
  if (company?.managingPartnerId === signer.id) return `Managing Partner; not their line manager; knows them from the ${recipient.office} office`;
  return `${signer.role}; not their line manager`;
}

export function signatureLineFor(p: Person): string {
  return p.preferredSignature ?? `${p.firstName} ${p.lastName}, ${p.role}`;
}

export function signAsFor(p: Person): string {
  return p.signAs ?? p.preferredName ?? p.firstName;
}

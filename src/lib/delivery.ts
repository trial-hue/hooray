// Where a card physically goes, and how postage is costed.
import { formatSpoken } from "./dates";
import type { Address, Company, ISODate, Person } from "./types";

export type Delivery = {
  address: Address;
  attention: string;
  envelopeLine: string;
  mode: "office-batch" | "individual";
};

export function resolveDelivery(p: Person, company: Company | undefined, dueDate: ISODate): Delivery | undefined {
  const name = `${p.firstName} ${p.lastName}`;
  if (p.kind === "client") {
    if (!p.registeredAddress) return undefined;
    return {
      address: p.registeredAddress,
      attention: `${name}, ${p.role}`,
      envelopeLine: `${name}, ${p.clientCompanyName ?? p.team}`,
      mode: "individual",
    };
  }
  if (p.kind === "friend" || p.deliverTo === "home" || p.status === "on-leave") {
    if (!p.homeAddress) return undefined;
    return { address: p.homeAddress, attention: name, envelopeLine: name, mode: "individual" };
  }
  const office = company?.offices[p.office] ?? (company ? company.offices[company.primaryOffice] : undefined);
  if (!office) return undefined;
  return {
    address: office,
    attention: `Private — ${name}`,
    envelopeLine: `Please hand to ${p.preferredName ?? p.firstName} on ${formatSpoken(dueDate)}`,
    mode: "office-batch",
  };
}

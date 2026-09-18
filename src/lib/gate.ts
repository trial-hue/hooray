// The "do not send" gate. Runs before any API call. Blocks become held cards
// that appear in the digest under "Needs a decision"; never silently dropped.
import type { Address, GateReason, Occasion, Person } from "./types";

export type GateResult =
  | { ok: true; warnings: { reason: GateReason; message: string }[] }
  | { ok: false; reason: GateReason; message: string };

const block = (reason: GateReason, message: string): GateResult => ({ ok: false, reason, message });

export function gate(p: Person, occ: Occasion, signer: Person | undefined, addr: Address | undefined, existing: boolean): GateResult {
  const name = p.preferredName ?? p.firstName;
  if (existing) return block("duplicate-occurrence", "A card already exists for this occasion.");
  if (p.status === "left") return block("left-company", `${name} has left; no card.`);
  if (p.optOut) return block("opted-out", `${name} has opted out of cards.`);
  if (occ.type === "birthday" && p.kind === "staff" && !p.consentOccasions) return block("no-consent", `${name} has not consented to birthdays being marked. Payroll date of birth cannot be reused without it.`);
  if (p.status === "on-leave" && p.leaveReason === "sick") return block("on-leave-sick", `${name} is on sick leave. Send anyway?`);
  if (p.bereavementUntil && occ.date <= p.bereavementUntil && occ.type !== "sympathy")
    return block("bereavement-window", `${name} had a recent bereavement; a ${occ.type.replace("-", " ")} card may land badly.`);
  if (!addr) return block("address-missing", `No delivery address for ${name}.`);
  if (!signer) return block("signer-missing", "No signer configured for this occasion.");
  if (signer.status === "left") return block("signer-left", `Signer ${signer.firstName} has left the firm.`);
  if (signer.id === p.id) return block("signer-is-recipient", "Signer and recipient are the same person.");

  const warnings: { reason: GateReason; message: string }[] = [];
  if (p.status === "on-leave") {
    const why = p.leaveReason === "parental" ? "parental leave" : p.leaveReason === "sabbatical" ? "sabbatical" : "leave";
    warnings.push({
      reason: "on-leave-other",
      message: `${name} is on ${why}${p.leaveUntil ? ` until ${p.leaveUntil}` : ""}. Card goes to their home address and avoids work talk. Check before sending.`,
    });
  }
  if (p.startDate && p.startDate > occ.date && occ.type !== "welcome") {
    warnings.push({ reason: "start-date-in-future", message: `${name} has not started yet (${p.startDate}).` });
  }
  return { ok: true, warnings };
}

export const GATE_LABEL: Record<GateReason, string> = {
  "left-company": "Left the firm",
  "opted-out": "Opted out",
  "no-consent": "No consent",
  "on-leave-sick": "On sick leave",
  "on-leave-other": "On leave",
  "bereavement-window": "Recent bereavement",
  "address-missing": "No address",
  "signer-missing": "No signer",
  "signer-left": "Signer left",
  "signer-is-recipient": "Signer is recipient",
  "start-date-in-future": "Not started yet",
  "duplicate-occurrence": "Duplicate",
};

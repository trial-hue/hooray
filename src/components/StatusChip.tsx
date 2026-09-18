import type { CardStatus } from "@/lib/types";

const STYLE: Record<CardStatus, [string, string]> = {
  held: ["Needs a decision", "bg-[var(--amber-bg)] text-[var(--amber-fg)]"],
  needs_review: ["Check wording", "bg-[var(--amber-bg)] text-[var(--amber-fg)]"],
  drafted: ["Drafted", "bg-paper-2 text-ink-2"],
  edited: ["Edited", "bg-[var(--green-bg)] text-[var(--green-fg)]"],
  approved: ["Approved", "bg-[var(--green-bg)] text-[var(--green-fg)]"],
  skipped: ["Skipped", "bg-paper-2 text-ink-3"],
  sent_to_print: ["At the printer", "bg-navy/10 text-navy"],
  printed: ["Printed", "bg-navy/10 text-navy"],
  posted: ["Posted", "bg-navy/10 text-navy"],
  delivered: ["Delivered", "bg-[var(--green-bg)] text-[var(--green-fg)]"],
};

export function StatusChip({ status }: { status: CardStatus }) {
  const [label, cls] = STYLE[status];
  return <span className={`chip ${cls}`}>{label}</span>;
}

export function statusLabel(status: CardStatus): string {
  return STYLE[status][0];
}

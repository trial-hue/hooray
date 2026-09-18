import type { CardStatus } from "@/lib/types";

const STYLE: Record<CardStatus, [string, string]> = {
  held: ["Needs a decision", "chip-amber"],
  needs_review: ["Check wording", "chip-amber"],
  drafted: ["Drafted", "chip-muted"],
  edited: ["Edited", "chip-green"],
  approved: ["Approved", "chip-green"],
  skipped: ["Skipped", "chip-muted"],
  sent_to_print: ["At the printer", "chip-navy"],
  printed: ["Printed", "chip-navy"],
  posted: ["Posted", "chip-navy"],
  delivered: ["Delivered", "chip-green"],
};

export function StatusChip({ status }: { status: CardStatus }) {
  const [label, cls] = STYLE[status];
  return <span className={`chip ${cls}`}>{label}</span>;
}

export function statusLabel(status: CardStatus): string {
  return STYLE[status][0];
}

import type { CardStatus } from "@/lib/types";

const STEPS: [CardStatus, string][] = [
  ["sent_to_print", "Sent"],
  ["printed", "Printed"],
  ["posted", "Posted"],
  ["delivered", "Delivered"],
];

export function StatusTimeline({ status }: { status: CardStatus }) {
  const idx = STEPS.findIndex(([s]) => s === status);
  return (
    <ol className="flex items-center gap-1">
      {STEPS.map(([s, label], i) => {
        const on = i <= idx;
        return (
          <li key={s} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${on ? (i === idx ? "bg-navy" : "bg-navy/50") : "bg-line"}`} />
            <span className={`text-[11px] ${on ? "text-ink" : "text-ink-3"}`}>{label}</span>
            {i < STEPS.length - 1 && <span className={`mx-0.5 h-px w-4 ${i < idx ? "bg-navy/50" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

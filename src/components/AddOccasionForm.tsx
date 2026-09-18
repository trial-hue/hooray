"use client";

import { useFormStatus } from "react-dom";
import { addOccasionAction } from "@/app/actions";

function Item({ label, sub }: { label: string; sub?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`menu-item ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Drafting…" : label}
      {sub && <span className="block text-xs text-ink-3">{sub}</span>}
    </button>
  );
}

const KINDS: [string, string, string][] = [
  ["wedding", "Wedding", "opens a team collection"],
  ["new-baby", "New baby", "opens a team collection"],
  ["congratulations", "Congratulations", "company card only"],
  ["get-well", "Get well", "company card only"],
  ["sympathy", "Sympathy", "company card only"],
];

export function AddOccasionForm({ personId }: { personId: string }) {
  return (
    <details className="menu-host">
      <summary className="btn btn-sm btn-ghost">Add occasion ▾</summary>
      <div className="menu">
        {KINDS.map(([kind, label, sub]) => (
          <form key={kind} action={addOccasionAction}>
            <input type="hidden" name="personId" value={personId} />
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="days" value="14" />
            <Item label={label} sub={sub} />
          </form>
        ))}
      </div>
    </details>
  );
}

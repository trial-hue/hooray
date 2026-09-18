"use client";

import { useFormStatus } from "react-dom";
import { addOccasionAction, markLeavingAction } from "@/app/actions";

function Item({ label, sub }: { label: string; sub?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`menu-item ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "One moment…" : label}
      {sub && <span className="block text-xs text-ink-3">{sub}</span>}
    </button>
  );
}

/** One menu per person: everything a manager might record about them. */
export function PersonMenu({ personId }: { personId: string }) {
  return (
    <details className="menu-host">
      <summary className="btn btn-sm">Record ▾</summary>
      <div className="menu">
        <form action={markLeavingAction}>
          <input type="hidden" name="personId" value={personId} />
          <input type="hidden" name="days" value="14" />
          <input type="hidden" name="retiring" value="false" />
          <Item label="Leaving in two weeks" sub="opens a team collection today" />
        </form>
        <form action={markLeavingAction}>
          <input type="hidden" name="personId" value={personId} />
          <input type="hidden" name="days" value="28" />
          <input type="hidden" name="retiring" value="true" />
          <Item label="Retiring in four weeks" sub="opens a team collection today" />
        </form>
        <div className="my-1 border-t border-line" />
        {(
          [
            ["wedding", "Wedding", "opens a team collection"],
            ["new-baby", "New baby", "opens a team collection"],
            ["congratulations", "Congratulations", "company card only"],
            ["get-well", "Get well", "company card only"],
            ["sympathy", "Sympathy", "company card only"],
          ] as [string, string, string][]
        ).map(([kind, label, sub]) => (
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

export { PersonMenu as MarkLeavingForm };

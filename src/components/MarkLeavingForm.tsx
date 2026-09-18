"use client";

import { useFormStatus } from "react-dom";
import { markLeavingAction } from "@/app/actions";

function Submit({ label, className }: { label: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" name="days" value="14" className={`${className} ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Opening collection…" : label}
    </button>
  );
}

function Item({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`menu-item ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Opening collection…" : label}
    </button>
  );
}

export function MarkLeavingForm({ personId }: { personId: string; name?: string }) {
  return (
    <div className="flex items-center">
      <form action={markLeavingAction}>
        <input type="hidden" name="personId" value={personId} />
        <Submit label="Leaving in 2 weeks" className="btn btn-sm rounded-r-none" />
      </form>
      <details className="menu-host">
        <summary className="btn btn-sm rounded-l-none border-l-0 px-1.5" aria-label="More leaving options">
          ▾
        </summary>
        <div className="menu">
          {[
            ["7", "false", "Leaving in a week"],
            ["28", "false", "Leaving in four weeks"],
            ["28", "true", "Retiring in four weeks"],
          ].map(([d, r, l]) => (
            <form key={l} action={markLeavingAction}>
              <input type="hidden" name="personId" value={personId} />
              <input type="hidden" name="days" value={d} />
              <input type="hidden" name="retiring" value={r} />
              <Item label={l} />
            </form>
          ))}
        </div>
      </details>
    </div>
  );
}

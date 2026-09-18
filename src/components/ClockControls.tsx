"use client";

import { useFormStatus } from "react-dom";
import { advanceClockAction, resetDemoAction } from "@/app/actions";

function Btn({ label, pending }: { label: string; pending: string }) {
  const s = useFormStatus();
  return (
    <button type="submit" className={`btn ${s.pending ? "pulse-soft" : ""}`} disabled={s.pending}>
      {s.pending ? pending : label}
    </button>
  );
}

export function ClockControls({ hasCompany }: { hasCompany: boolean; nextMonday?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {[
        ["1", "+1 day", "…"],
        ["7", "+1 week", "Drafting…"],
        ["30", "+1 month", "Running a month…"],
      ].map(([d, label, pending]) => (
        <form key={d} action={advanceClockAction}>
          <input type="hidden" name="days" value={d} />
          <Btn label={label} pending={pending} />
        </form>
      ))}
      {hasCompany && (
        <form action={resetDemoAction}>
          <button type="submit" className="btn btn-ghost text-ink-3" title="Reset the demo">
            Reset
          </button>
        </form>
      )}
    </div>
  );
}

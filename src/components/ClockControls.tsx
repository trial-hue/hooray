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

export function ClockControls({ hasCompany, nextMonday }: { hasCompany: boolean; nextMonday: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <form action={advanceClockAction}>
        <input type="hidden" name="days" value="1" />
        <Btn label="+1 day" pending="…" />
      </form>
      <form action={advanceClockAction}>
        <input type="hidden" name="days" value="7" />
        <Btn label="+1 week" pending={`Drafting for ${nextMonday}…`} />
      </form>
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

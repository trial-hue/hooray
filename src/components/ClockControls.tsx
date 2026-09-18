"use client";

import { useFormStatus } from "react-dom";
import { advanceClockAction, resetDemoAction, resetPersonalAction, restartClockAction } from "@/app/actions";

export type ClockPreview = { days: number; label: string; dispatch: number; drafts: number; closing: number };

function summary(p: ClockPreview): string {
  const parts = [
    p.dispatch ? `${p.dispatch} to print` : "",
    p.drafts ? `${p.drafts} new draft${p.drafts === 1 ? "" : "s"}` : "",
    p.closing ? `${p.closing} collection${p.closing === 1 ? "" : "s"} close${p.closing === 1 ? "s" : ""}` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "a quiet stretch";
}

function Primary({ p }: { p: ClockPreview }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary flex-col items-start gap-0 py-1.5 leading-tight ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      <span>{pending ? `Running to ${p.label.slice(0, -5)}…` : `Next week → ${p.label.slice(0, -5)}`}</span>
      <span className="text-[11px] font-normal opacity-80">{summary(p)}</span>
    </button>
  );
}

function MenuItem({ title, sub }: { title: string; sub?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`menu-item ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Running…" : title}
      {sub && <span className="block text-xs text-ink-3">{sub}</span>}
    </button>
  );
}

export function ClockControls({ hasCompany, previews, ws = "business" }: { hasCompany: boolean; previews: ClockPreview[]; ws?: "business" | "personal" }) {
  const [day, week, month] = previews;
  if (!hasCompany) return null;
  return (
    <div className="flex items-center gap-1.5">
      <form action={advanceClockAction}>
        <input type="hidden" name="ws" value={ws} />
        <input type="hidden" name="days" value="7" />
        <Primary p={week} />
      </form>
      <details className="menu-host">
        <summary className="btn btn-ghost">More ▾</summary>
        <div className="menu">
          <form action={advanceClockAction}>
            <input type="hidden" name="ws" value={ws} />
            <input type="hidden" name="days" value="1" />
            <MenuItem title="Tomorrow" sub={summary(day)} />
          </form>
          <form action={advanceClockAction}>
            <input type="hidden" name="ws" value={ws} />
            <input type="hidden" name="days" value="30" />
            <MenuItem title={`A month on → ${month.label.slice(0, -5)}`} sub={summary(month)} />
          </form>
          <div className="my-1 border-t border-line" />
          {ws === "personal" && (
            <form action={restartClockAction}>
              <input type="hidden" name="ws" value={ws} />
              <MenuItem title="Restart the clock" sub="Back to 21 Sep; your people, email and voice stay" />
            </form>
          )}
          <form action={ws === "personal" ? resetPersonalAction : resetDemoAction}>
            <MenuItem title={ws === "personal" ? "Start again" : "Reset the demo"} sub={ws === "personal" ? "Clears this personal account" : "Back to a fresh roster on 21 Sep"} />
          </form>
        </div>
      </details>
    </div>
  );
}

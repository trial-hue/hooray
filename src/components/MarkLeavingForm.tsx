"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { markLeavingAction } from "@/app/actions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary text-xs ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Opening collection…" : label}
    </button>
  );
}

export function MarkLeavingForm({ personId, name }: { personId: string; name: string }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" className="btn btn-ghost text-xs text-ink-3" onClick={() => setOpen(true)}>
        Mark as leaving
      </button>
    );
  return (
    <form action={markLeavingAction} className="flex flex-wrap items-center justify-end gap-1.5">
      <input type="hidden" name="personId" value={personId} />
      <span className="text-xs text-ink-3">{name} leaves in</span>
      <select name="days" defaultValue="14" className="rounded-md border border-line bg-white px-1.5 py-1 text-xs">
        <option value="7">a week</option>
        <option value="14">two weeks</option>
        <option value="28">four weeks</option>
      </select>
      <select name="retiring" defaultValue="false" className="rounded-md border border-line bg-white px-1.5 py-1 text-xs">
        <option value="false">leaving</option>
        <option value="true">retiring</option>
      </select>
      <Submit label="Confirm" />
      <button type="button" className="btn btn-ghost text-xs" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

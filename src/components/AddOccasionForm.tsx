"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { addOccasionAction } from "@/app/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary text-xs ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "Drafting…" : "Add"}
    </button>
  );
}

export function AddOccasionForm({ personId }: { personId: string }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" className="btn btn-ghost text-xs text-ink-3" onClick={() => setOpen(true)}>
        Add occasion
      </button>
    );
  return (
    <form action={addOccasionAction} className="flex flex-wrap items-center justify-end gap-1.5">
      <input type="hidden" name="personId" value={personId} />
      <select name="kind" defaultValue="wedding" className="rounded-md border border-line bg-white px-1.5 py-1 text-xs">
        <option value="wedding">Wedding (collection)</option>
        <option value="new-baby">New baby (collection)</option>
        <option value="congratulations">Congratulations</option>
        <option value="get-well">Get well</option>
        <option value="sympathy">Sympathy</option>
      </select>
      <input name="label" placeholder="what happened, one line" className="w-40 rounded-md border border-line bg-white px-1.5 py-1 text-xs" />
      <span className="text-xs text-ink-3">in</span>
      <select name="days" defaultValue="14" className="rounded-md border border-line bg-white px-1.5 py-1 text-xs">
        <option value="3">3 days</option>
        <option value="7">a week</option>
        <option value="14">two weeks</option>
        <option value="28">four weeks</option>
      </select>
      <Submit />
      <button type="button" className="btn btn-ghost text-xs" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

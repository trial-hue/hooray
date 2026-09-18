"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { contributeAction } from "@/app/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary text-xs ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? "…" : "Chip in and sign"}
    </button>
  );
}

export function ContributeForm({ collectionId, contributorId, suggested }: { collectionId: string; contributorId: string; suggested: number }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button type="button" className="btn text-xs" onClick={() => setOpen(true)}>
        Chip in
      </button>
    );
  return (
    <form action={contributeAction} className="flex flex-wrap items-center gap-1.5">
      <input type="hidden" name="collectionId" value={collectionId} />
      <input type="hidden" name="contributorId" value={contributorId} />
      <span className="text-xs text-ink-3">£</span>
      <input name="amount" type="number" min={0} step={1} defaultValue={suggested} className="w-14 rounded-md border border-line bg-white px-1.5 py-1 text-xs" />
      <input name="message" placeholder="A line for the card" className="w-44 rounded-md border border-line bg-white px-1.5 py-1 text-xs" autoFocus />
      <Submit />
    </form>
  );
}

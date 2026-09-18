"use client";

import { useFormStatus } from "react-dom";
import { simulateSyncAction } from "@/app/actions";

function Btn({ provider }: { provider: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-primary ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? `Syncing from ${provider} and drafting this week…` : `Simulate a ${provider} sync`}
    </button>
  );
}

export function SimulateSyncButton({ provider, kind }: { provider: string; kind: "hr" | "crm" }) {
  return (
    <form action={simulateSyncAction}>
      <input type="hidden" name="provider" value={provider} />
      <input type="hidden" name="kind" value={kind} />
      <Btn provider={provider} />
    </form>
  );
}

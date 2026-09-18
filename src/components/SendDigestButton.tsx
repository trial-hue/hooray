"use client";

import { useActionState } from "react";
import { sendDigestAction, type SendDigestState } from "@/app/email-actions";

export function SendDigestButton({ disabled, live }: { disabled: boolean; live: boolean }) {
  const [state, action, pending] = useActionState<SendDigestState, FormData>(sendDigestAction, null);
  return (
    <div className="flex flex-col items-end gap-1">
      <form action={action}>
        <button className="btn btn-primary" disabled={disabled || pending}>
          {pending ? "Sending…" : live ? "Email the digest now" : "Write to outbox"}
        </button>
      </form>
      {state && state.ok && (
        <p className="text-xs text-ink-2">
          {state.mode === "sent" ? (
            <>
              Sent to {state.to}
              {state.id ? ` · Resend id ${state.id}` : ""}
            </>
          ) : (
            <>Written to {state.outboxPath.replace(/^.*\/data\//, "data/")}</>
          )}
        </p>
      )}
      {state && !state.ok && <p className="text-xs text-red-700">{state.error}</p>}
    </div>
  );
}

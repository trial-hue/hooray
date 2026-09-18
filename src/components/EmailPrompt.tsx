import { setPersonalEmailAction } from "@/app/actions";

/** Shown wherever a personal account has no reminder address yet. One field, one button. */
export function EmailPrompt({ email, compact = false }: { email?: string; compact?: boolean }) {
  if (email) return null;
  return (
    <form action={setPersonalEmailAction} className={`card-panel-hero mb-6 border-l-[3px] border-l-hooray p-4 ${compact ? "" : "sm:p-5"}`}>
      <p className="label">Where should reminders go?</p>
      <p className="mt-1 text-sm text-ink-2">Ten days before each date you get one email with the card and a button. Nothing is sent until you tap it.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input name="email" type="email" required className="input min-w-[260px] flex-1" placeholder="you@example.com" autoComplete="email" />
        <button className="btn btn-primary">Send them here</button>
      </div>
    </form>
  );
}

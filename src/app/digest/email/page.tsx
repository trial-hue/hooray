import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { SendDigestButton } from "@/components/SendDigestButton";
import { getDb } from "@/lib/db";
import { buildDigestEmail } from "@/lib/digestEmail";
import { emailConfigured, emailProvider } from "@/lib/email";

export const dynamic = "force-dynamic";

/** The weekly digest as the approver will receive it, with a real send button. */
export default function DigestEmailPage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const built = buildDigestEmail(db);
  const live = emailConfigured();
  const provider = emailProvider();
  return (
    <>
      <ClockBar active="/digest" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">
              <Link href="/digest" className="underline-offset-2 hover:underline">
                Approval queue
              </Link>{" "}
              · Email
            </p>
            <h1 className="font-display text-3xl">The digest as an email</h1>
            <p className="mt-1 text-sm text-ink-2">
              {built ? (
                <>
                  Goes to <strong>{built.summary.toName}</strong> ({built.summary.to}). {built.summary.total} card{built.summary.total === 1 ? "" : "s"}, {built.summary.needs} needing a decision.{" "}
                  {live ? `Sending is live via ${provider === "mail-app" ? "Mail.app (plain text)" : provider === "brevo" ? "Brevo" : "Resend"}.` : "No email provider configured: sends are written to data/outbox/ instead."}
                </>
              ) : (
                <>No recipient. Set <code>DIGEST_TO</code> in <code>.env.local</code> or give the approver an email on the roster.</>
              )}
            </p>
          </div>
          <SendDigestButton disabled={!built} live={live} />
        </div>

        {built && (
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="border-b border-line px-4 py-2 text-xs text-ink-2">
              <span className="font-medium text-ink">Subject:</span> {built.email.subject}
            </div>
            <iframe title="Digest email preview" srcDoc={built.email.html} className="h-[80vh] w-full" />
          </div>
        )}
      </main>
    </>
  );
}

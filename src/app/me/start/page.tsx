import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { loadExampleContactsAction, startPersonalAction } from "@/app/actions";
import { getDb } from "@/lib/db";
import { CONSUMER, gbp } from "@/lib/costs";

export const dynamic = "force-dynamic";

export default function StartPersonalPage() {
  const db = getDb("personal");
  if (db.company) redirect("/me");
  return (
    <>
      <ClockBar active="/me/start" ws="personal" />
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-14 text-center">
        <p className="label mb-3">Hooray for people</p>
        <h1 className="h1 text-[40px]">Never miss a birthday again, without doing anything.</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-2">
          Add the people you care about, or import their birthdays from Google. Hooray drafts a card in your voice, you change a word if you want, and it&apos;s printed and posted five days before the date.
        </p>
        <p className="hint mt-3">
          Free for {CONSUMER.freeCardsPerYear} cards a year. Circle is {gbp(CONSUMER.subscriptionYearlyGbp)} a year for {CONSUMER.subscriptionCardsPerYear} cards sent automatically. Beyond that, {gbp(CONSUMER.perCardGbp)} a card, posted. Launching soon; today is a free try.
        </p>

        <form action={loadExampleContactsAction} className="mt-8">
          <button className="btn btn-primary px-6 py-3 text-base">Try it with three example people</button>
        </form>
        <p className="hint mt-2">A mum, a best friend with a wedding anniversary, and a goddaughter turning seven.</p>

        <details className="card-panel mt-12 text-left">
          <summary className="cursor-pointer px-6 py-4 font-display text-lg">Or start with your own name</summary>
          <form action={startPersonalAction} className="grid gap-3 px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Your name</label>
                <input name="name" className="input" placeholder="Akshay Devon" required />
              </div>
              <div>
                <label className="label">Your email</label>
                <input name="email" type="email" className="input" placeholder="you@example.com" />
                <p className="mt-1 text-[11px] text-ink-3">One email per occasion, ten days out, with the card and a button.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">A colour for your cards</label>
                <input name="brandHex" type="color" defaultValue="#1F3A5F" className="h-9 w-full cursor-pointer rounded-md border border-line bg-white" />
              </div>
              <div>
                <label className="label">How you sign off</label>
                <input name="signOff" className="input" placeholder="Lots of love" />
              </div>
            </div>
            <div>
              <label className="label">How you talk, in a few words</label>
              <input name="toneWords" className="input" placeholder="warm, a bit silly, says what I actually mean" />
            </div>
            <button type="submit" className="btn btn-primary justify-center">
              Start, then add people
            </button>
          </form>
        </details>

        <p className="hint mt-10">
          Sending cards for a company?{" "}
          <Link href="/onboarding" className="underline underline-offset-2 hover:text-ink">
            Hooray for businesses
          </Link>
          .
        </p>
      </main>
    </>
  );
}

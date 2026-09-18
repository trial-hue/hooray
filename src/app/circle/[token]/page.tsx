import Link from "next/link";
import { notFound } from "next/navigation";
import { Wordmark } from "@/components/ClockBar";
import { joinCircleAction } from "@/app/actions";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Public page: someone adds their own date to the account owner's list. No login. */
export default async function CirclePage({ params, searchParams }: PageProps<"/circle/[token]">) {
  const { token } = await params;
  const sp = await searchParams;
  const db = getDb("personal");
  if (!db.company?.circleToken || db.company.circleToken !== token) notFound();
  const owner = db.company.shortName;
  const done = sp.done === "1";
  return (
    <main className="mx-auto w-full max-w-md px-5 pb-16 pt-14">
      <Wordmark />
      {done ? (
        <div className="card-panel mt-8 p-6 text-center">
          <h1 className="h2">You&apos;re on {owner}&apos;s list</h1>
          <p className="hint mt-2">A card will find you on the day. Nothing else happens with your details.</p>
          <p className="mt-6 text-sm text-ink-2">
            Want one of these for the people you never forget?{" "}
            <Link href="/me/start" className="underline underline-offset-2">
              Start your own list
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <p className="label mb-2 mt-8">{owner} asked</p>
          <h1 className="h1">Tell me your birthday</h1>
          <p className="hint mt-2">So a card turns up on the day. Takes ten seconds. Only {owner} sees it.</p>
          <form action={joinCircleAction} className="card-panel mt-6 grid gap-3 p-5">
            <input type="hidden" name="token" value={token} />
            <div>
              <label className="label">Your name</label>
              <input name="name" className="input" placeholder="Priya Shah" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Birthday</label>
                <input name="birthday" className="input" placeholder="10-01 or 1989-10-01" required />
              </div>
              <div>
                <label className="label">Who you are to {owner}</label>
                <input name="relationship" className="input" placeholder="cousin, old flatmate…" />
              </div>
            </div>
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
              <div>
                <label className="label">Address (optional)</label>
                <input name="line1" className="input" placeholder="18 Orchard Close" />
              </div>
              <div>
                <label className="label">Town</label>
                <input name="town" className="input" placeholder="Harrow" />
              </div>
              <div>
                <label className="label">Postcode</label>
                <input name="postcode" className="input" placeholder="HA1 3QT" />
              </div>
            </div>
            <button className="btn btn-primary justify-center">Add me</button>
          </form>
        </>
      )}
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Wordmark } from "@/components/ClockBar";
import { FrontPanel, PANEL_H, PANEL_W } from "@/components/Card";
import { Scaled } from "@/components/CardPreview";
import { recipientSignupAction } from "@/app/actions";
import { getDb, type Workspace } from "@/lib/db";
import { renderableCard } from "@/lib/render";
import { fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Public page reached from the code on the back of a printed card. The recipient starts their own list, sender pre-filled. */
export default async function CardCodePage({ params, searchParams }: PageProps<"/c/[code]">) {
  const { code } = await params;
  const sp = await searchParams;
  let ws: Workspace = "personal";
  let db = getDb(ws);
  let card = db.cards.find((c) => c.shareCode === code);
  if (!card) {
    ws = "business";
    db = getDb(ws);
    card = db.cards.find((c) => c.shareCode === code);
  }
  if (!card || !db.company) notFound();
  const signer = db.people.find((p) => p.id === card.signerId);
  const recipient = db.people.find((p) => p.id === card.personId);
  const rc = renderableCard(db, card);
  const sender = ws === "personal" ? db.company.shortName : signer ? fullName(signer) : db.company.shortName;
  const senderFirst = sender.split(" ")[0];
  const done = sp.done === "1";
  return (
    <main className="mx-auto w-full max-w-md px-5 pb-16 pt-14">
      <Wordmark />
      {rc && (
        <div className="mx-auto mt-8 w-[180px]">
          <Scaled widthMm={PANEL_W} heightMm={PANEL_H} shadow={false}>
            <div className="paper-shadow overflow-hidden rounded-[4px]">
              <FrontPanel card={rc} />
            </div>
          </Scaled>
        </div>
      )}
      {done ? (
        <div className="card-panel mt-8 p-6 text-center">
          <h1 className="h2">Your list has started</h1>
          <p className="hint mt-2">{senderFirst}&apos;s date is on it. We&apos;ll email you when your first card is ready to send.</p>
        </div>
      ) : (
        <>
          <p className="label mb-2 mt-8">This card came from {sender}</p>
          <h1 className="h1">Never miss {senderFirst}&apos;s next one.</h1>
          <p className="hint mt-2">
            Start your own list and {senderFirst}
            {ws === "business" && db.company ? ` at ${db.company.shortName}` : ""} is already on it. Ten days before a date, a card exists. One tap sends it.
          </p>
          <form action={recipientSignupAction} className="card-panel mt-6 grid gap-3 p-5">
            <input type="hidden" name="code" value={code} />
            <div>
              <label className="label">Your name</label>
              <input name="name" className="input" defaultValue={recipient ? fullName(recipient) : ""} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Your email</label>
                <input name="email" type="email" className="input" placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">{senderFirst}&apos;s birthday, if you know it</label>
                <input name="birthday" className="input" placeholder="05-14" />
              </div>
            </div>
            <button className="btn btn-primary justify-center">Start my list with {senderFirst} on it</button>
            <p className="hint text-xs">Free for two cards a year. Personal accounts open with phase 2; today this records your place.</p>
          </form>
          <p className="hint mt-6 text-center">
            <Link href="/me/start" className="underline underline-offset-2">
              What is Hooray?
            </Link>
          </p>
        </>
      )}
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { AddContactForm } from "@/components/AddContactForm";
import { setPersonalEmailAction } from "@/app/actions";
import { PersonMenu } from "@/components/MarkLeavingForm";
import { getDb } from "@/lib/db";
import { formatShort } from "@/lib/dates";
import { fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function MyPeoplePage() {
  const db = getDb("personal");
  if (!db.company) redirect("/me/start");
  const contacts = db.people.filter((p) => p.kind === "friend");
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const circleUrl = db.company.circleToken ? `${base}/circle/${db.company.circleToken}` : undefined;
  const viaCircle = contacts.filter((p) => p.source === "circle").length;
  const datesKnown = contacts.filter((p) => p.birthday || p.milestones?.length).length;
  const addresses = contacts.filter((p) => p.homeAddress).length;
  const learned = db.company.voiceExamples?.length ?? 0;
  const signups = db.signups?.length ?? 0;
  return (
    <>
      <ClockBar active="/me/people" ws="personal" />
      <main className="mx-auto w-full max-w-4xl px-5 py-8">
        <div className="mb-6">
          <p className="label mb-1">My people</p>
          <h1 className="h1">{contacts.length === 0 ? "Who do you never want to forget?" : `${contacts.length} ${contacts.length === 1 ? "person" : "people"} you never forget`}</h1>
          <p className="hint mt-1.5">
            A name, a date and one line about them is all a good card needs.{" "}
            <Link href="/me/connect" className="underline underline-offset-2 hover:text-ink">
              Import birthdays from Google
            </Link>
            .
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["People", String(contacts.length), "on your list"],
            ["Dates known", String(datesKnown), "birthdays and anniversaries"],
            ["Addresses", String(addresses), "ready to post to"],
            ["Joined via your link", String(viaCircle), "added their own date"],
            ["Voice", learned ? `${learned} edit${learned === 1 ? "" : "s"}` : "—", learned ? "learned; shaping new drafts" : "edit a card and it learns"],
          ].map(([k, v, sub]) => (
            <div key={k} className="card-panel px-4 py-3">
              <div className="label">{k}</div>
              <div className="mt-1 font-display text-[26px] leading-none">{v}</div>
              <div className="hint mt-1 text-xs">{sub}</div>
            </div>
          ))}
        </div>
        {signups > 0 && <p className="hint mb-6">{signups} {signups === 1 ? "person who received one of your cards has" : "people who received your cards have"} started their own list from the code on the back.</p>}

        <form action={setPersonalEmailAction} className="card-panel mb-6 flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-[260px] flex-1">
            <label className="label">Reminders go to</label>
            <input name="email" type="email" className="input" defaultValue={db.company.email ?? ""} placeholder="you@example.com" />
            <p className="mt-1 text-[11px] text-ink-3">
              One email per occasion, ten days out, with the card and a button.{!db.company.email && process.env.DIGEST_TO ? ` Until you set one, they go to ${process.env.DIGEST_TO}.` : ""}
            </p>
          </div>
          <button className="btn btn-sm">Save</button>
        </form>

        {circleUrl && (
          <section className="card-panel-hero mb-6 border-l-[3px] border-l-gold p-5">
            <h2 className="h2">Ask your circle</h2>
            <p className="hint mt-0.5">Send this link once. Each person adds their own date. Works in a WhatsApp group, a story, a post.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-md border border-line bg-white px-3 py-2 text-sm">{circleUrl}</code>
              <Link href={`/circle/${db.company.circleToken}`} className="btn btn-sm" target="_blank">
                See what they see
              </Link>
            </div>
          </section>
        )}

        <section className="card-panel mb-8 p-5">
          <h2 className="h2">Add someone</h2>
          <AddContactForm />
        </section>

        {contacts.length > 0 && (
          <div className="card-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-ink-3">
                <tr className="border-b border-line">
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Birthday</th>
                  <th className="px-4 py-2.5 font-medium">About them</th>
                  <th className="px-4 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {contacts.map((p) => (
                  <tr key={p.id} className="hover:bg-paper-2/60">
                    <td className="px-4 py-2">
                      <div className="font-medium">{fullName(p)}</div>
                      <div className="text-xs text-ink-3">
                        {p.relationship ?? "friend"}
                        {p.source === "circle" && <span className="chip chip-gold ml-2">via your link</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-ink-2">{p.birthday ? formatShort(`2026-${p.birthday}`) : "—"}</td>
                    <td className="px-4 py-2 text-ink-2">{p.publicFacts.join(" · ") || <span className="text-ink-3">nothing yet</span>}</td>
                    <td className="px-4 py-2 text-right">
                      <PersonMenu personId={p.id} ws="personal" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

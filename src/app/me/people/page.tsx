import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { AddContactForm } from "@/components/AddContactForm";
import { PersonMenu } from "@/components/MarkLeavingForm";
import { getDb } from "@/lib/db";
import { formatShort } from "@/lib/dates";
import { fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function MyPeoplePage() {
  const db = getDb("personal");
  if (!db.company) redirect("/me/start");
  const contacts = db.people.filter((p) => p.kind === "friend");
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
                      <div className="text-xs text-ink-3">{p.relationship ?? "friend"}</div>
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

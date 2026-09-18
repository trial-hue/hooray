import Link from "next/link";
import { ClockBar } from "@/components/ClockBar";
import { loadExampleContactsAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export default function MyConnectPage() {
  return (
    <>
      <ClockBar active="/me/people" ws="personal" />
      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <p className="label mb-1">
          <Link href="/me/people" className="hover:underline">
            My people
          </Link>{" "}
          › Import
        </p>
        <h1 className="h1">Import birthdays from Google</h1>
        <p className="hint mt-2">One consent screen, and every birthday already in your Google contacts lands on your list. Nothing is written back and nothing else is read.</p>

        <section className="card-panel mt-6 p-5">
          <h2 className="h2">What Hooray reads</h2>
          <ul className="mt-2 grid gap-1.5 text-sm text-ink-2">
            <li className="flex gap-2">
              <span className="text-sage">✓</span>Names and birthdays from your Google contacts (the People API, <code className="text-xs">contacts.readonly</code>)
            </li>
            <li className="flex gap-2">
              <span className="text-sage">✓</span>Postal addresses where you&apos;ve saved one
            </li>
            <li className="flex gap-2">
              <span className="text-ink-3">✗</span>Nothing else: no email, no calendar events, no messages
            </li>
          </ul>
          <p className="hint mt-3">Most contact books have birthdays for a handful of people. Treat the import as a start, then add the rest by hand.</p>
        </section>

        <section className="card-panel mt-4 p-5">
          <h2 className="h2">Apple contacts</h2>
          <p className="mt-1 text-sm text-ink-2">On iPhone, apps can only see the contacts you hand-pick, and there&apos;s no web import. So Apple users type people in, or share a contact card to Hooray one at a time. That&apos;s next on the list.</p>
        </section>

        <section className="card-panel-hero mt-4 p-5">
          <h2 className="h2">Connect</h2>
          <p className="mt-1 text-sm text-ink-2">The live Google connection is next, not in today&apos;s build. For the demo, load three example people instead.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <form action={loadExampleContactsAction}>
              <button className="btn btn-primary">Load three example people</button>
            </form>
            <Link href="/me/people" className="btn btn-ghost">
              Add someone by hand
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

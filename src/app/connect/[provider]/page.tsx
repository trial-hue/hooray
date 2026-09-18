import Link from "next/link";
import { notFound } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { SimulateSyncButton } from "@/components/SimulateSyncButton";
import { connector } from "@/lib/connectors";

export const dynamic = "force-dynamic";

export default async function ConnectProviderPage({ params }: PageProps<"/connect/[provider]">) {
  const { provider } = await params;
  const c = connector(provider);
  if (!c) notFound();
  return (
    <>
      <ClockBar active="/people" />
      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <p className="label mb-1">
          <Link href="/connect" className="hover:underline">
            Connect
          </Link>{" "}
          › {c.name}
        </p>
        <h1 className="h1">Connect {c.name}</h1>
        <p className="hint mt-2">{c.blurb}</p>

        <section className="card-panel mt-6 p-5">
          <h2 className="h2">What Hooray reads</h2>
          <ul className="mt-2 grid gap-1.5 text-sm text-ink-2">
            {c.reads.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="text-sage">✓</span>
                {r}
              </li>
            ))}
          </ul>
          <p className="hint mt-3">{c.method}. Read-only. Nothing is written back.</p>
        </section>

        <section className="card-panel mt-4 p-5">
          <h2 className="h2">Consent</h2>
          <p className="mt-1 text-sm text-ink-2">
            A date of birth held for payroll can&apos;t be reused to mark a birthday without the person&apos;s say-so. After the first sync, every staff member gets one email asking whether they want birthdays marked and where cards should go. Anniversaries, welcomes and leavers don&apos;t need it.
          </p>
        </section>

        <section className="card-panel-hero mt-4 p-5">
          <h2 className="h2">Connect</h2>
          <p className="mt-1 text-sm text-ink-2">
            The live {c.name} connection is next on the list, not in today&apos;s build. For the demo you can run a simulated sync: it loads the demo roster and marks it as coming from {c.name}.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SimulateSyncButton provider={c.name} kind={c.kind} />
            <Link href="/onboarding" className="btn btn-ghost">
              Upload a spreadsheet instead
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

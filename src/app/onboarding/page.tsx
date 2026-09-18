import { ClockBar } from "@/components/ClockBar";
import { importCsvAction, loadDemoRosterAction } from "@/app/actions";
import { CSV_COLUMNS } from "@/lib/roster";
import { LoadDemoButton } from "@/components/LoadDemoButton";

export const dynamic = "force-dynamic";

export default function Onboarding() {
  return (
    <>
      <ClockBar active="/onboarding" />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="max-w-2xl">
          <p className="label mb-3">Set-and-forget occasion cards for companies</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight">
            Send us your roster once. Every birthday, anniversary and welcome gets a printed card, drafted from context, signed by the right person, posted to the right address.
          </h1>
          <p className="mt-4 max-w-xl text-ink-2">
            The only human touch is a weekly digest where one person approves, edits a line, or skips. Nothing goes out unseen.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="card-panel p-6">
            <h2 className="font-display text-2xl">Try it with a demo firm</h2>
            <p className="mt-2 text-sm text-ink-2">
              Hartley &amp; Crane LLP, chartered accountants. 120 staff across Manchester and Leeds, 40 clients. Includes a five-year anniversary, a new starter, a partner on leave, an opted-out colleague and a ten-year client.
            </p>
            <form action={loadDemoRosterAction} className="mt-5">
              <LoadDemoButton />
            </form>
          </section>

          <section className="card-panel p-6">
            <h2 className="font-display text-2xl">Or upload your own</h2>
            <form action={importCsvAction} className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Firm name</label>
                  <input name="name" className="input" placeholder="Hartley & Crane LLP" required />
                </div>
                <div>
                  <label className="label">Short name (on the card)</label>
                  <input name="shortName" className="input" placeholder="Hartley & Crane" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Brand colour</label>
                  <input name="brandHex" type="color" defaultValue="#1F3A5F" className="h-9 w-full cursor-pointer rounded-md border border-line bg-white" />
                </div>
                <div>
                  <label className="label">Formality</label>
                  <select name="formality" className="input" defaultValue="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="label">Sign-off</label>
                  <input name="signOff" className="input" placeholder="With best wishes" />
                </div>
              </div>
              <div>
                <label className="label">Tone, in your words</label>
                <input name="toneWords" className="input" placeholder="warm, understated, first names, no exclamation marks" />
              </div>
              <div>
                <label className="label">Office address (line 1, line 2, town, postcode)</label>
                <input name="officeAddress" className="input" placeholder="14 King Street, , Manchester, M2 6AQ" />
              </div>
              <div>
                <label className="label">Roster CSV</label>
                <input name="file" type="file" accept=".csv,text/csv" className="input" required />
                <p className="mt-1 text-[11px] text-ink-3">
                  Columns: {CSV_COLUMNS.slice(0, 12).join(", ")}, … (
                  <a className="underline" href="/demo-roster.csv" download>
                    download the demo CSV as a template
                  </a>
                  )
                </p>
              </div>
              <button type="submit" className="btn btn-primary justify-center">
                Import and draft next week&apos;s cards
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

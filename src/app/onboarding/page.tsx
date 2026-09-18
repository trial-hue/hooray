import { ClockBar } from "@/components/ClockBar";
import { importCsvAction, loadDemoRosterAction } from "@/app/actions";
import { CSV_COLUMNS } from "@/lib/roster";
import { LoadDemoButton } from "@/components/LoadDemoButton";

export const dynamic = "force-dynamic";

export default function Onboarding() {
  return (
    <>
      <ClockBar active="/onboarding" />
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-14 text-center">
        <p className="label mb-3">Occasion cards and collections for companies</p>
        <h1 className="h1 text-[40px]">Send us your roster once. Every occasion gets a printed card.</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-2">
          Birthdays, anniversaries, welcomes and leavers, drafted from what the firm knows, signed by the right person, posted to the right address. One person glances at a queue each week. Nothing goes out unseen, and nothing waits on anyone.
        </p>
        <form action={loadDemoRosterAction} className="mt-8">
          <LoadDemoButton />
        </form>
        <p className="hint mt-3">Hartley &amp; Crane LLP, chartered accountants. 50 staff in Manchester and Leeds, 10 clients. A leaver, a parental leave, an opted-out colleague, a milestone birthday.</p>

        <details className="card-panel mt-12 text-left">
          <summary className="cursor-pointer px-6 py-4 font-display text-lg">Or upload your own roster</summary>
          <form action={importCsvAction} className="grid gap-3 px-6 pb-6">
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
                Columns: {CSV_COLUMNS.slice(0, 10).join(", ")}, … (
                <a className="underline" href="/demo-roster.csv" download>
                  download the demo CSV as a template
                </a>
                )
              </p>
            </div>
            <button type="submit" className="btn btn-primary justify-center">
              Import and draft this week&apos;s cards
            </button>
          </form>
        </details>
      </main>
    </>
  );
}

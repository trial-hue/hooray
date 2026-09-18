import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { DigestRow } from "@/components/DigestRow";
import { CardThumb } from "@/components/CardThumb";
import { StatusChip } from "@/components/StatusChip";
import { FrontPanel, PANEL_H, PANEL_W } from "@/components/Card";
import { Scaled } from "@/components/CardPreview";
import { advanceClockAction } from "@/app/actions";
import { getDb, type Workspace } from "@/lib/db";
import { formatLong, formatShort, formatSpoken } from "@/lib/dates";
import { pendingCards } from "@/lib/engine";
import { occasionTitle } from "@/lib/occasions";
import { paths } from "@/lib/paths";
import { renderableCard } from "@/lib/render";
import { currentDraft, finalTextOf, fullName, type Card } from "@/lib/types";

/** "This week" for either workspace. */
export function QueueView({ ws }: { ws: Workspace }) {
  const db = getDb(ws);
  const P = paths(ws);
  if (!db.company) redirect(P.start);
  const personal = ws === "personal";
  const cards = pendingCards(db);
  const needs = cards.filter((c) => c.status === "held" || c.status === "needs_review");
  const ready = cards.filter((c) => c.status === "drafted");
  const done = cards.filter((c) => ["approved", "edited", "skipped"].includes(c.status));
  const sendable = cards.filter((c) => c.status === "approved" || c.status === "edited").length;
  const signers = db.people.filter((p) => p.kind === "staff" && p.status !== "left");
  const nextDispatch = cards.filter((c) => c.status !== "skipped").map((c) => c.dispatchOn).sort()[0];
  const openCols = db.collections.filter((c) => c.status === "open");
  const inPost = db.cards.filter((c) => ["sent_to_print", "printed", "posted"].includes(c.status)).length;
  const firstCol = openCols[0];
  const firstColPerson = firstCol ? db.people.find((p) => p.id === firstCol.personId) : undefined;
  const contacts = db.people.filter((p) => p.kind === "friend").length;

  const row = (c: Card) => {
    const p = db.people.find((x) => x.id === c.personId)!;
    const occ = db.occasions.find((o) => o.id === c.occasionId)!;
    const signer = db.people.find((x) => x.id === c.signerId);
    const co = c.coSignerId ? db.people.find((x) => x.id === c.coSignerId) : undefined;
    const col = c.collectionId ? db.collections.find((x) => x.id === c.collectionId) : undefined;
    const rc = renderableCard(db, c);
    return (
      <DigestRow
        key={c.id}
        ws={ws}
        card={c}
        person={p}
        occasionLabel={occasionTitle(occ)}
        signerName={signer ? fullName(signer) : "—"}
        coSignerName={co ? fullName(co) : undefined}
        signers={signers.map((s) => ({ id: s.id, name: `${fullName(s)}${s.role ? ` · ${s.role}` : ""}` }))}
        brandHex={db.company!.brandHex}
        accentHex={db.company!.accentHex}
        occasionType={occ.type}
        ordinal={occ.ordinal}
        collection={col ? { id: col.id, contributors: col.contributions.length, invited: col.teamIds.length, status: col.status } : undefined}
        gift={c.gift}
        preview={
          rc ? (
            <div className="w-[200px]">
              <Scaled widthMm={PANEL_W} heightMm={PANEL_H} shadow={false}>
                <div className="paper-shadow overflow-hidden rounded-[4px]">
                  <FrontPanel card={rc} />
                </div>
              </Scaled>
            </div>
          ) : undefined
        }
      />
    );
  };

  return (
    <>
      <ClockBar active={P.home} ws={ws} />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label mb-1">This week · {formatLong(db.clock.today)}</p>
            <h1 className="h1">{cards.length === 0 ? "Nothing waiting. Enjoy the quiet." : `${needs.length + ready.length} card${needs.length + ready.length === 1 ? "" : "s"} waiting on you`}</h1>
            <p className="hint mt-2 max-w-3xl">
              Anything you don&apos;t touch goes out by itself{nextDispatch ? <>, next on {formatSpoken(nextDispatch)}</> : null}.
              {sendable > 0 && <> {sendable} already approved.</>}
              {!personal && openCols.length > 0 && firstCol && firstColPerson && (
                <>
                  {" "}
                  <Link href={`/collections/${firstCol.id}`} className="underline underline-offset-2 hover:text-ink">
                    {openCols.length === 1 ? `${firstColPerson.firstName}'s collection` : `${openCols.length} collections`}
                  </Link>{" "}
                  open{openCols.length === 1 ? `, ${firstCol.contributions.length} of ${firstCol.teamIds.length} chipped in` : ""}.
                </>
              )}
              {inPost > 0 && !personal && (
                <>
                  {" "}
                  <Link href={P.post} className="underline underline-offset-2 hover:text-ink">
                    {inPost} in the post
                  </Link>
                  .
                </>
              )}
              {inPost > 0 && personal && <> {inPost} in the post.</>}
              {!personal && (
                <>
                  {" "}
                  <Link href={P.calendar} className="underline underline-offset-2 hover:text-ink">
                    What&apos;s coming up
                  </Link>
                  .
                </>
              )}
              {personal && (
                <>
                  {" "}
                  <Link href={P.people} className="underline underline-offset-2 hover:text-ink">
                    {contacts} {contacts === 1 ? "person" : "people"} on your list
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
          {!personal && cards.length > 0 && (
            <Link href="/digest/email" className="btn btn-ghost">
              Email this week
            </Link>
          )}
        </div>

        {cards.length === 0 && (
          <div className="card-panel mx-auto max-w-lg p-8 text-center">
            <h2 className="h2">{personal && contacts === 0 ? "Add the people you care about" : "Run the clock forward"}</h2>
            <p className="hint mt-1">{personal && contacts === 0 ? "A name, a date, and one line about them is all a good card needs." : "The next occasions will be drafted as they come into range."}</p>
            {personal && contacts === 0 ? (
              <Link href={P.people} className="btn btn-primary mt-4">
                Add someone
              </Link>
            ) : (
              <form action={advanceClockAction} className="mt-4 inline-block">
                <input type="hidden" name="ws" value={ws} />
                <input type="hidden" name="days" value="7" />
                <button className="btn btn-primary">Run to next week</button>
              </form>
            )}
            {!personal && (
              <p className="hint mt-3">
                Or go to{" "}
                <Link href="/people" className="underline">
                  People
                </Link>{" "}
                and mark someone as leaving.
              </p>
            )}
          </div>
        )}

        {needs.length > 0 && (
          <Section title="Needs a decision" hint={personal ? "Something to check before it goes." : "Held by the gate or flagged by a wording check. Nothing here goes out until you say so."}>
            {needs.map(row)}
          </Section>
        )}
        {ready.length > 0 && (
          <Section title="Ready" hint="Approve, edit a line, or let them go out as they are.">
            {ready.map(row)}
          </Section>
        )}
        {done.length > 0 && (
          <section className="mb-10">
            <h2 className="h2">
              Done <span className="font-body text-sm text-ink-3">· {done.length} frozen, to print {nextDispatch ? formatSpoken(nextDispatch) : "now"}</span>
            </h2>
            <ul className="card-panel mt-3 divide-y divide-line bg-sage-bg/40">
              {done.map((c) => {
                const p = db.people.find((x) => x.id === c.personId)!;
                const occ = db.occasions.find((o) => o.id === c.occasionId)!;
                const d = currentDraft(c);
                const t = finalTextOf(c);
                return (
                  <li key={c.id} className={`flex items-center gap-3 px-4 py-2 text-sm ${c.status === "skipped" ? "opacity-60" : ""}`}>
                    <CardThumb width={30} brandHex={db.company!.brandHex} accentHex={db.company!.accentHex} template={d?.artwork_brief.template} variant={d?.artwork_brief.palette_variant} occasionType={occ.type} ordinal={occ.ordinal} seed={c.seed} headline="" />
                    <Link href={P.card(c.id)} className="font-medium hover:underline">
                      {fullName(p)}
                    </Link>
                    <span className="text-ink-2">{occasionTitle(occ)}</span>
                    {t && <span className="hidden truncate text-ink-3 md:inline">“{t.front_headline}”</span>}
                    <span className="ml-auto flex items-center gap-3">
                      <StatusChip status={c.status} />
                      <span className="text-xs text-ink-3">{c.status === "skipped" ? c.skipReason : `dispatches ${formatShort(c.dispatchOn)}`}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="h2">{title}</h2>
      <p className="hint mt-0.5">{hint}</p>
      <div className="mt-3 grid gap-4">{children}</div>
    </section>
  );
}

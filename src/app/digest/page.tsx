import Link from "next/link";
import { redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { DigestRow } from "@/components/DigestRow";
import { CardThumb } from "@/components/CardThumb";
import { StatusChip } from "@/components/StatusChip";
import { FrontPanel, PANEL_H, PANEL_W } from "@/components/Card";
import { Scaled } from "@/components/CardPreview";
import { advanceClockAction, approveAllAction, sendNowAction } from "@/app/actions";
import { getDb } from "@/lib/db";
import { formatLong, formatShort, formatSpoken } from "@/lib/dates";
import { pendingCards } from "@/lib/engine";
import { occasionTitle } from "@/lib/occasions";
import { renderableCard } from "@/lib/render";
import { currentDraft, finalTextOf, fullName, type Card } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function DigestPage() {
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const cards = pendingCards(db);
  const needs = cards.filter((c) => c.status === "held" || c.status === "needs_review");
  const ready = cards.filter((c) => c.status === "drafted");
  const done = cards.filter((c) => ["approved", "edited", "skipped"].includes(c.status));
  const sendable = cards.filter((c) => c.status === "approved" || c.status === "edited").length;
  const unflagged = ready.filter((c) => c.flags.length === 0).length;
  const staff = db.people.filter((p) => p.kind === "staff" && p.status !== "left");
  const nextDispatch = cards.filter((c) => c.status !== "skipped").map((c) => c.dispatchOn).sort()[0];
  const openCols = db.collections.filter((c) => c.status === "open");
  const inPost = db.cards.filter((c) => ["sent_to_print", "printed", "posted"].includes(c.status)).length;
  const firstCol = openCols[0];
  const firstColPerson = firstCol ? db.people.find((p) => p.id === firstCol.personId) : undefined;

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
        card={c}
        person={p}
        occasionLabel={occasionTitle(occ)}
        signerName={signer ? fullName(signer) : "—"}
        coSignerName={co ? fullName(co) : undefined}
        signers={staff.map((s) => ({ id: s.id, name: `${fullName(s)} · ${s.role}` }))}
        brandHex={db.company!.brandHex}
        accentHex={db.company!.accentHex}
        occasionType={occ.type}
        ordinal={occ.ordinal}
        collection={col ? { id: col.id, contributors: col.contributions.length, invited: col.teamIds.length, status: col.status } : undefined}
        preview={
          rc ? (
            <div className="w-[200px]">
              <Scaled widthMm={PANEL_W} heightMm={PANEL_H} shadow={false}>
                <div className="paper-shadow rounded-[4px] overflow-hidden">
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
      <ClockBar active="/digest" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label mb-1">This week · {formatLong(db.clock.today)}</p>
            <h1 className="h1">{cards.length === 0 ? "Nothing waiting. Enjoy the quiet." : `${needs.length + ready.length} card${needs.length + ready.length === 1 ? "" : "s"} waiting on you`}</h1>
            <p className="hint mt-1.5">Drafted ten days out. Anything you don&apos;t touch goes out by itself five days before the date.</p>
          </div>
          {cards.length > 0 && (
            <div className="flex items-center gap-2">
              <form action={approveAllAction}>
                <button className="btn" disabled={unflagged === 0}>
                  Approve all unflagged{unflagged ? ` (${unflagged})` : ""}
                </button>
              </form>
              <form action={sendNowAction}>
                <button className="btn btn-primary" disabled={sendable === 0}>
                  Send {sendable || ""} to print now
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Waiting on you" value={String(needs.length + ready.length)} sub={needs.length ? `${needs.length} need a decision` : "all drafted, none flagged"} accent="hooray" />
          <Stat label="Next dispatch" value={nextDispatch ? formatShort(nextDispatch) : "—"} sub={nextDispatch ? `${sendable} approved · others go by themselves` : "nothing scheduled"} />
          <Stat
            label="Open collections"
            value={String(openCols.length)}
            sub={firstCol && firstColPerson ? `${firstColPerson.firstName} · ${firstCol.contributions.length} of ${firstCol.teamIds.length} chipped in` : "none open"}
            href={firstCol ? `/collections/${firstCol.id}` : undefined}
            accent="gold"
          />
          <Stat label="In the post" value={String(inPost)} sub="printed or on their way" href="/print" accent="sage" />
        </div>

        {cards.length === 0 && (
          <div className="card-panel mx-auto max-w-lg p-8 text-center">
            <h2 className="h2">Run the clock forward</h2>
            <p className="hint mt-1">The next occasions will be drafted as they come into range.</p>
            <form action={advanceClockAction} className="mt-4 inline-block">
              <input type="hidden" name="days" value="7" />
              <button className="btn btn-primary">Run to next Monday</button>
            </form>
            <p className="hint mt-3">
              Or{" "}
              <Link href="/people" className="underline">
                mark someone as leaving
              </Link>{" "}
              and watch a collection open.
            </p>
          </div>
        )}

        {needs.length > 0 && (
          <Section title="Needs a decision" hint="Held by the gate or flagged by a wording check. Nothing here goes out until you say so.">
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
                    <Link href={`/cards/${c.id}`} className="font-medium hover:underline">
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

function Stat({ label, value, sub, href, accent }: { label: string; value: string; sub: string; href?: string; accent?: "hooray" | "gold" | "sage" }) {
  const accentCls = accent === "gold" ? "border-l-[3px] border-l-gold" : accent === "sage" ? "border-l-[3px] border-l-sage" : accent === "hooray" ? "border-l-[3px] border-l-hooray" : "";
  const inner = (
    <>
      <div className="label">{label}</div>
      <div className={`mt-1 font-display text-[28px] leading-none ${accent === "hooray" ? "text-hooray" : ""}`}>{value}</div>
      <div className="hint mt-1 truncate text-xs">{sub}</div>
    </>
  );
  const cls = `card-panel px-4 py-3 ${accentCls} ${href ? "transition hover:bg-paper-2/60" : ""}`;
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

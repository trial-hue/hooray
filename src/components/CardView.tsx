import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { CardSheet, SHEET_H, SHEET_W } from "@/components/Card";
import { Scaled } from "@/components/CardPreview";
import { StatusChip, statusLabel } from "@/components/StatusChip";
import { sendStannpTestAction } from "@/app/proof-actions";
import { getDb, type Workspace } from "@/lib/db";
import { formatLong } from "@/lib/dates";
import { resolveDelivery } from "@/lib/delivery";
import { occasionTitle } from "@/lib/occasions";
import { paths } from "@/lib/paths";
import { renderableCard } from "@/lib/render";
import { buildStannpPayload, stannpCurl } from "@/lib/stannp";
import { cardCost, gbp, pence, UNIT } from "@/lib/costs";
import { currentDraft, fullName } from "@/lib/types";

export function CardView({ ws, id }: { ws: Workspace; id: string }) {
  const db = getDb(ws);
  const P = paths(ws);
  if (!db.company) redirect(P.start);
  const card = db.cards.find((c) => c.id === id);
  if (!card) notFound();
  const person = db.people.find((p) => p.id === card.personId)!;
  const occ = db.occasions.find((o) => o.id === card.occasionId)!;
  const signer = db.people.find((p) => p.id === card.signerId);
  const rc = renderableCard(db, card);
  const draft = currentDraft(card);
  const last = card.versions[card.versions.length - 1];
  const delivery = resolveDelivery(person, db.company, card.dueDate);
  const pdfPath = P.pdf(card.id);
  const sep = pdfPath.includes("?") ? "&" : "?";
  const payload = buildStannpPayload(db, card, `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}${pdfPath}${sep}download=1`);
  const col = card.collectionId ? db.collections.find((c) => c.id === card.collectionId) : undefined;
  const hasStannp = Boolean(process.env.STANNP_API_KEY);
  const cost = cardCost(card.aiCostGbp || UNIT.aiFallbackGbp);
  const personal = ws === "personal";

  return (
    <>
      <ClockBar active={P.home} ws={ws} />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label mb-1">
              <Link href={P.home} className="hover:underline">
                This week
              </Link>{" "}
              › {occasionTitle(occ)} · due {formatLong(card.dueDate)}
            </p>
            <h1 className="h1">{fullName(person)}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-ink-2">
              <StatusChip status={card.status} />
              {signer && !personal && <span>signed by {fullName(signer)}</span>}
              {personal && person.relationship && <span>{person.relationship}</span>}
              {col && (
                <Link href={`/collections/${col.id}`} className="chip chip-gold">
                  collection · {col.contributions.length} signed
                </Link>
              )}
              {card.autoApproved && <span className="chip chip-muted">went out by itself</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasStannp && payload && !card.proof && (
              <form action={sendStannpTestAction}>
                <input type="hidden" name="id" value={card.id} />
                <input type="hidden" name="ws" value={ws} />
                <button className="btn">Send test to Stannp</button>
              </form>
            )}
            <a href={`${pdfPath}${sep}download=1&marks=1`} className="btn btn-primary">
              Download print PDF
            </a>
          </div>
        </div>

        {rc ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="grid min-w-0 gap-6">
              <section className="card-panel-hero p-5">
                <p className="label mb-3">
                  Outside · back and front · {SHEET_W}×{SHEET_H}mm with 3mm bleed
                </p>
                <Scaled widthMm={SHEET_W} heightMm={SHEET_H}>
                  <CardSheet card={rc} side="outside" />
                </Scaled>
              </section>
              <section className="card-panel-hero p-5">
                <p className="label mb-3">Inside · {rc.signatures?.length ? `${rc.signatures.length} team signatures and the message` : "message"}</p>
                <Scaled widthMm={SHEET_W} heightMm={SHEET_H}>
                  <CardSheet card={rc} side="inside" />
                </Scaled>
              </section>
            </div>

            <aside className="grid min-w-0 content-start gap-3 text-sm">
              <details className="card-panel" open>
                <summary className="cursor-pointer px-4 py-3 font-display text-lg">Delivery and cost</summary>
                <div className="px-4 pb-4">
                  {delivery ? (
                    <p className="text-ink-2">
                      {delivery.mode === "office-batch" ? "In the weekly office parcel" : "Posted"} to {delivery.address.line1}
                      {delivery.address.line2 ? `, ${delivery.address.line2}` : ""}, {delivery.address.town} {delivery.address.postcode}.
                      {!personal && <span className="mt-1 block text-ink-3">Envelope: {delivery.envelopeLine}</span>}
                    </p>
                  ) : (
                    <p className="text-[var(--amber-fg)]">No delivery address.</p>
                  )}
                  {card.gift && (
                    <p className="mt-3 text-ink-2">
                      Company gift: {card.gift.name}, £{(card.gift.valuePence / 100).toFixed(0)}. Fulfilled separately by drop-ship.
                    </p>
                  )}
                  <p className="mt-3 font-display text-2xl">{personal ? gbp(5.49) : gbp(cost.total)}</p>
                  <p className="hint text-xs">{personal ? `including post · launching soon · costs ${gbp(cost.print)} to print and post` : `${gbp(cost.print)} print, envelope and post via Docmail · AI ${pence(cost.ai)}`}</p>
                </div>
              </details>

              <details className="card-panel" open>
                <summary className="cursor-pointer px-4 py-3 font-display text-lg">How it was drafted</summary>
                <div className="px-4 pb-4">
                  {last && (
                    <p className="text-ink-2">
                      {last.source === "claude" ? "Live Claude draft" : last.source === "cache" ? "Cached Claude draft" : "Template copy"} · {last.usage.input_tokens + last.usage.cache_read_input_tokens} in / {last.usage.output_tokens} out · {pence(card.aiCostGbp)}
                      {last.ms ? ` · ${(last.ms / 1000).toFixed(1)}s` : ""}
                    </p>
                  )}
                  {draft?.rationale && (
                    <p className="mt-2 text-xs text-ink-3">
                      <span className="font-medium text-ink-2">Why: </span>
                      {draft.rationale}
                    </p>
                  )}
                  {draft?.artwork_brief && (
                    <p className="mt-1 text-xs text-ink-3">
                      Artwork: {draft.artwork_brief.template}, {draft.artwork_brief.palette_variant}. {draft.artwork_brief.style_note}
                    </p>
                  )}
                  {card.flags.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {card.flags.map((f, i) => (
                        <li key={i} className={`chip ${f.kind === "check" ? "chip-red" : "chip-amber"}`}>
                          {f.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {person.publicFacts.length > 0 && <p className="mt-2 text-xs text-ink-3">Context used: {person.publicFacts.join(" · ")}</p>}
                </div>
              </details>

              <details className="card-panel">
                <summary className="cursor-pointer px-4 py-3 font-display text-lg">More</summary>
                <div className="px-4 pb-4">
                  <p className="label mb-2">Print partner</p>
                  <p className="text-ink-2">
                    Production: Docmail, {gbp(UNIT.cardCostProductionGbp)} all in. Prototype: Stannp, {gbp(UNIT.cardCostPrototypeGbp)}. {hasStannp ? "A key is configured; send a test to get a real proof back." : "No Stannp key today, so the PDF is rendered locally and this is the exact request that would go."}
                  </p>
                  {card.proof && (
                    <p className="mt-2 text-ink">
                      Stannp test #{card.proof.id} · {card.proof.status} · cost {card.proof.cost} ·{" "}
                      <a className="underline" href={card.proof.pdfUrl} target="_blank" rel="noreferrer">
                        proof PDF
                      </a>
                    </p>
                  )}
                  {payload && <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-ink p-3 text-[10.5px] leading-relaxed text-paper">{stannpCurl(payload)}</pre>}
                  <a href={pdfPath} target="_blank" rel="noreferrer" className="btn btn-sm mt-3">
                    Open PDF in a tab
                  </a>
                  <p className="label mb-2 mt-5">History</p>
                  <ul className="text-xs text-ink-2">
                    {card.history.map((h, i) => (
                      <li key={i} className="py-0.5">
                        <span className="text-ink-3">{h.at}</span> · {statusLabel(h.status)}
                        {h.note ? ` · ${h.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </aside>
          </div>
        ) : (
          <div className="card-panel mx-auto max-w-lg p-8 text-center">
            <h2 className="h2">Nothing to show yet</h2>
            <p className="hint mt-1">
              This card is held{card.holdReason ? ` (${card.holdReason.replace(/-/g, " ")})` : ""}. Release it from This week to draft it.
            </p>
            <Link href={P.home} className="btn btn-primary mt-4">
              Back to This week
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

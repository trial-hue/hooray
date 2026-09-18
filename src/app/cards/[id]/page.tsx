import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClockBar } from "@/components/ClockBar";
import { CardSheet, SHEET_H, SHEET_W } from "@/components/Card";
import { Scaled } from "@/components/CardPreview";
import { StatusChip, statusLabel } from "@/components/StatusChip";
import { sendStannpTestAction } from "@/app/proof-actions";
import { getDb } from "@/lib/db";
import { formatLong } from "@/lib/dates";
import { resolveDelivery } from "@/lib/delivery";
import { occasionTitle } from "@/lib/occasions";
import { renderableCard } from "@/lib/render";
import { buildStannpPayload, stannpCurl } from "@/lib/stannp";
import { cardCost, gbp, pence, UNIT } from "@/lib/costs";
import { currentDraft, fullName } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CardPage({ params }: PageProps<"/cards/[id]">) {
  const { id } = await params;
  const db = getDb();
  if (!db.company) redirect("/onboarding");
  const card = db.cards.find((c) => c.id === id);
  if (!card) notFound();
  const person = db.people.find((p) => p.id === card.personId)!;
  const occ = db.occasions.find((o) => o.id === card.occasionId)!;
  const signer = db.people.find((p) => p.id === card.signerId);
  const rc = renderableCard(db, card);
  const draft = currentDraft(card);
  const last = card.versions[card.versions.length - 1];
  const delivery = resolveDelivery(person, db.company, card.dueDate);
  const pdfPath = `/api/cards/${card.id}/pdf`;
  const payload = buildStannpPayload(db, card, `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}${pdfPath}?download=1`);
  const col = card.collectionId ? db.collections.find((c) => c.id === card.collectionId) : undefined;
  const hasStannp = Boolean(process.env.STANNP_API_KEY);
  const cost = cardCost(card.aiCostGbp || UNIT.aiFallbackGbp);

  return (
    <>
      <ClockBar active="/digest" />
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label">
              <Link href="/digest" className="hover:underline">
                Digest
              </Link>{" "}
              · {occasionTitle(occ)} · due {formatLong(card.dueDate)}
            </p>
            <h1 className="font-display text-3xl">{fullName(person)}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-2">
              <StatusChip status={card.status} />
              {signer && <span>signed by {fullName(signer)}</span>}
              {col && (
                <Link href={`/collections/${col.id}`} className="chip bg-gold/15 text-[var(--amber-fg)]">
                  collection · {col.contributions.length} signed
                </Link>
              )}
              {card.autoApproved && <span className="chip bg-paper-2 text-ink-3">auto-approved</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`${pdfPath}?download=1&marks=1`} className="btn btn-primary">
              Download print PDF
            </a>
            <a href={pdfPath} target="_blank" rel="noreferrer" className="btn">
              Open PDF
            </a>
          </div>
        </div>

        {rc ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-5">
              <div>
                <p className="label mb-2">Outside · back and front · {SHEET_W}×{SHEET_H}mm with 3mm bleed</p>
                <Scaled widthMm={SHEET_W} heightMm={SHEET_H}>
                  <CardSheet card={rc} side="outside" />
                </Scaled>
              </div>
              <div>
                <p className="label mb-2">Inside · {rc.signatures?.length ? `${rc.signatures.length} team signatures and` : "blank and"} message</p>
                <Scaled widthMm={SHEET_W} heightMm={SHEET_H}>
                  <CardSheet card={rc} side="inside" />
                </Scaled>
              </div>
            </div>

            <aside className="grid content-start gap-4">
              <section className="card-panel p-4 text-sm">
                <h2 className="font-display text-lg">Delivery</h2>
                {delivery ? (
                  <p className="mt-1 text-ink-2">
                    {delivery.mode === "office-batch" ? "In the weekly office parcel" : "Posted individually"} to {delivery.address.line1}
                    {delivery.address.line2 ? `, ${delivery.address.line2}` : ""}, {delivery.address.town} {delivery.address.postcode}.
                    <br />
                    <span className="text-ink-3">Envelope: {delivery.envelopeLine}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[var(--amber-fg)]">No delivery address.</p>
                )}
                <p className="mt-2 text-xs text-ink-3">
                  Cost {gbp(cost.total)}: {gbp(cost.print)} print, envelope and post via Docmail · AI {pence(cost.ai)}
                </p>
              </section>

              <section className="card-panel p-4 text-sm">
                <h2 className="font-display text-lg">Draft</h2>
                {last && (
                  <p className="mt-1 text-ink-2">
                    {last.source === "claude" ? "Live Claude draft" : last.source === "cache" ? "Cached Claude draft" : "Template copy"} · {last.model} · {last.usage.input_tokens + last.usage.cache_read_input_tokens} in / {last.usage.output_tokens} out · {pence(card.aiCostGbp)}
                    {last.ms ? ` · ${(last.ms / 1000).toFixed(1)}s` : ""}
                  </p>
                )}
                {draft?.rationale && <p className="mt-2 text-xs text-ink-3">{draft.rationale}</p>}
                {draft?.artwork_brief && (
                  <p className="mt-1 text-xs text-ink-3">
                    Artwork: {draft.artwork_brief.template}, {draft.artwork_brief.palette_variant}. {draft.artwork_brief.style_note}
                  </p>
                )}
                {card.flags.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {card.flags.map((f, i) => (
                      <li key={i} className={`chip ${f.kind === "check" ? "bg-[var(--red-bg)] text-[var(--red-fg)]" : "bg-[var(--amber-bg)] text-[var(--amber-fg)]"}`}>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                )}
                {person.publicFacts.length > 0 && <p className="mt-2 text-xs text-ink-3">Context used: {person.publicFacts.join(" · ")}</p>}
              </section>

              <section className="card-panel p-4 text-sm">
                <h2 className="font-display text-lg">Print partner</h2>
                <p className="mt-1 text-ink-2">
                  Production: Docmail, {gbp(UNIT.cardCostProductionGbp)} all in. Prototype: Stannp, {gbp(UNIT.cardCostPrototypeGbp)}. {hasStannp ? "A key is configured; send a test to get a real proof back." : "No Stannp key today, so the PDF is rendered locally and this is the exact request that would go."}
                </p>
                {card.proof ? (
                  <p className="mt-2 text-ink">
                    Stannp test #{card.proof.id} · {card.proof.status} · cost {card.proof.cost} ·{" "}
                    <a className="underline" href={card.proof.pdfUrl} target="_blank" rel="noreferrer">
                      proof PDF
                    </a>
                  </p>
                ) : hasStannp && payload ? (
                  <form action={sendStannpTestAction} className="mt-2">
                    <input type="hidden" name="id" value={card.id} />
                    <button className="btn btn-primary">Send test to Stannp</button>
                  </form>
                ) : null}
                {payload && <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-ink p-3 text-[10.5px] leading-relaxed text-paper">{stannpCurl(payload)}</pre>}
              </section>

              <section className="card-panel p-4 text-sm">
                <h2 className="font-display text-lg">History</h2>
                <ul className="mt-1 text-xs text-ink-2">
                  {card.history.map((h, i) => (
                    <li key={i} className="py-0.5">
                      <span className="text-ink-3">{h.at}</span> · {statusLabel(h.status)}
                      {h.note ? ` · ${h.note}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        ) : (
          <p className="text-ink-2">This card has no draft yet{card.holdReason ? ` (${card.holdReason})` : ""}. Release it from the digest to draft it.</p>
        )}
      </main>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { approveCardAction, changeSignerAction, editCardAction, generateImageAction, regenerateCardAction, releaseHeldAction, removeImageAction, setCardGiftAction, skipCardAction } from "@/app/actions";
import { GIFT_RANGE } from "@/lib/collections";
import { giftLabel } from "@/lib/gifts";
import { StatusChip } from "./StatusChip";
import { CardThumb } from "./CardThumb";
import { formatShort } from "@/lib/dates";
import { currentDraft, finalTextOf, fullName, type Card, type CardGift, type OccasionType, type Person } from "@/lib/types";

type Props = {
  card: Card;
  person: Person;
  occasionLabel: string;
  occasionType: OccasionType;
  ordinal?: number;
  signerName: string;
  coSignerName?: string;
  signers: { id: string; name: string }[];
  brandHex: string;
  accentHex?: string;
  collection?: { id: string; contributors: number; invited: number; status: "open" | "closed" };
  preview?: React.ReactNode;
  ws?: "business" | "personal";
  gift?: CardGift;
  imageReady?: boolean; // an image key is configured
};

function Pending({ label, busy, className = "btn" }: { label: string; busy: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${className} ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? busy : label}
    </button>
  );
}

function MenuSubmit({ label, name, value, busy = "Asking Claude…" }: { label: string; name?: string; value?: string; busy?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" name={name} value={value} className={`menu-item ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? busy : label}
    </button>
  );
}

export function DigestRow(p: Props) {
  const { card, person } = p;
  const [editing, setEditing] = useState(false);
  const draft = currentDraft(card);
  const text = finalTextOf(card);
  const frozen = ["approved", "edited", "skipped", "sent_to_print", "printed", "posted", "delivered"].includes(card.status);
  const held = card.status === "held";
  const [firstFlag, ...moreFlags] = card.flags;
  const ws = p.ws ?? "business";
  const cardHref = `${ws === "personal" ? "/me" : ""}/cards/${card.id}`;
  const W = <input type="hidden" name="ws" value={ws} />;

  return (
    <article className="card-panel-hero flex gap-5 p-5">
      <Link href={cardHref} className="shrink-0" title="Open the card">
        {p.preview ?? (
          <CardThumb width={200} brandHex={p.brandHex} accentHex={p.accentHex} template={draft?.artwork_brief.template} variant={draft?.artwork_brief.palette_variant} occasionType={p.occasionType} ordinal={p.ordinal} seed={card.seed} headline={held ? "" : (text?.front_headline ?? "")} />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link href={cardHref} className="text-[15px] font-medium hover:underline">
            {fullName(person)}
          </Link>
          <span className="text-sm text-ink-2">
            {p.occasionLabel}
            {person.kind === "client" && ` · ${person.clientCompanyName}`}
            <span className="text-ink-3"> · {formatShort(card.dueDate)}</span>
          </span>
          {card.status !== "drafted" && <StatusChip status={card.status} />}
          {p.collection && (
            <Link href={`/collections/${p.collection.id}`} className="chip chip-gold hover:opacity-80">
              collection · {p.collection.contributors} of {p.collection.invited} signed
            </Link>
          )}
          {p.gift && <span className="chip chip-gold">Gift · {giftLabel(p.gift)}</span>}
        </div>

        {firstFlag && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`chip ${firstFlag.kind === "check" ? "chip-red" : "chip-amber"}`}>{firstFlag.text}</span>
            {moreFlags.length > 0 && (
              <details className="menu-host inline-block">
                <summary className="chip chip-muted">+{moreFlags.length} more</summary>
                <div className="menu left-0 right-auto max-w-md">
                  {moreFlags.map((f, i) => (
                    <p key={i} className="px-3 py-1.5 text-xs text-ink-2">
                      {f.text}
                    </p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {text && (
          <div className="mt-3">
            {editing ? (
              <form
                action={async (fd) => {
                  await editCardAction(fd);
                  setEditing(false);
                }}
                className="grid gap-2"
              >
                <input type="hidden" name="id" value={card.id} />
                {W}
                <textarea name="inside_message" defaultValue={text.inside_message} rows={4} className="input font-display text-[17px] leading-relaxed" autoFocus />
                <div className="flex gap-2">
                  <Pending label="Save and approve" busy="Saving…" className="btn btn-primary" />
                  <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => !frozen && setEditing(true)}
                className={`block w-full rounded-lg border border-line/70 bg-white px-5 py-4 text-left ${frozen ? "cursor-default" : "hover:border-line hover:bg-paper/40"}`}
                title={frozen ? undefined : "Click to edit"}
              >
                <p className="font-display text-[17px] leading-relaxed text-ink">{text.inside_message}</p>
                <p className="mt-2 text-sm text-ink-2">
                  {text.sign_off} <span className="font-script text-2xl leading-none">{p.signerName.split(" ")[0]}</span>
                  <span className="text-ink-3"> · {text.signature_line}</span>
                </p>
              </button>
            )}
          </div>
        )}

        {!frozen && !editing && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {held ? (
              <form action={releaseHeldAction}>
                <input type="hidden" name="id" value={card.id} />
                {W}
                <Pending label="Draft anyway" busy="Drafting…" className="btn btn-primary" />
              </form>
            ) : (
              <form action={approveCardAction}>
                <input type="hidden" name="id" value={card.id} />
                {W}
                <Pending label="Approve" busy="…" className="btn btn-primary" />
              </form>
            )}
            {!held && (
              <button type="button" className="btn" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
            <form action={skipCardAction}>
              <input type="hidden" name="id" value={card.id} />
              {W}
              <Pending label="Skip" busy="…" className="btn btn-ghost" />
            </form>
            {!held && (
              <details className="menu-host ml-auto">
                <summary className="btn btn-ghost px-2" aria-label="More options">
                  …
                </summary>
                <div className="menu min-w-64">
                  <form action={regenerateCardAction}>
                    <input type="hidden" name="id" value={card.id} />
                    {W}
                    <MenuSubmit label="Rewrite it" />
                    <MenuSubmit label="Rewrite, warmer" name="preset" value="Warmer" />
                    <MenuSubmit label="Rewrite, shorter" name="preset" value="Shorter" />
                    <MenuSubmit label="Rewrite, more formal" name="preset" value="More formal" />
                  </form>
                  <div className="my-1 border-t border-line" />
                  <form action={generateImageAction} className="px-3 py-2 text-xs text-ink-3">
                    <input type="hidden" name="id" value={card.id} />
                    {W}
                    <label className="block">
                      Picture on the front
                      <textarea name="prompt" rows={2} placeholder={card.image ? `Now: ${card.image.prompt}` : "Describe it, or leave blank to draw from the card's own brief"} className="mt-1 block w-full rounded-md border border-line bg-white px-2 py-1 text-xs text-ink placeholder:text-ink-3" />
                    </label>
                    <div className="mt-1 flex items-center gap-1">
                      <MenuSubmit label={p.imageReady ? (card.image ? "Make a new picture" : "Make a picture") : "Make a picture (no image key set)"} busy="Painting…" />
                    </div>
                  </form>
                  {card.image && (
                    <form action={removeImageAction}>
                      <input type="hidden" name="id" value={card.id} />
                      {W}
                      <MenuSubmit label="Back to the brand artwork" busy="…" />
                    </form>
                  )}
                  {ws === "business" && (p.gift || card.occasionId) && (
                    <>
                      <div className="my-1 border-t border-line" />
                      <form action={setCardGiftAction} className="px-3 py-2 text-xs text-ink-3">
                        <input type="hidden" name="id" value={card.id} />
                        {W}
                        <label className="block">
                          Company gift
                          <select name="giftId" defaultValue={p.gift?.id ?? ""} className="mt-1 block w-full rounded-md border border-line bg-white px-1.5 py-1 text-xs text-ink" onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                            <option value="">No gift</option>
                            {GIFT_RANGE.filter((g) => g.fromPence > 0).map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name} · from £{g.fromPence / 100}
                              </option>
                            ))}
                          </select>
                        </label>
                      </form>
                    </>
                  )}
                  {ws === "business" && <div className="my-1 border-t border-line" />}
                  {ws === "business" && (
                  <form action={changeSignerAction} className="px-3 py-2 text-xs text-ink-3">
                    <input type="hidden" name="id" value={card.id} />
                    {W}
                    <label className="block">
                      Signed by
                      <select name="signerId" defaultValue={card.signerId} className="mt-1 block w-full rounded-md border border-line bg-white px-1.5 py-1 text-xs text-ink" onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                        {p.signers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {p.coSignerName && <span className="mt-1 block">and {p.coSignerName}</span>}
                  </form>
                  )}
                  {draft?.rationale && (
                    <>
                      <div className="my-1 border-t border-line" />
                      <p className="px-3 py-2 text-xs text-ink-3">
                        <span className="font-medium text-ink-2">Why this draft: </span>
                        {draft.rationale}
                      </p>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        )}
        {card.status === "skipped" && card.skipReason && <p className="mt-2 text-sm text-ink-3">Skipped: {card.skipReason}</p>}
      </div>
    </article>
  );
}

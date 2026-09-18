"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { approveCardAction, changeSignerAction, contributeManyAction, editCardAction, regenerateCardAction, releaseHeldAction, skipCardAction } from "@/app/actions";
import { StatusChip } from "./StatusChip";
import { CardThumb } from "./CardThumb";
import { formatShort } from "@/lib/dates";
import { currentDraft, finalTextOf, fullName, type Card, type OccasionType, type Person } from "@/lib/types";

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
};

function Pending({ label, busy, className = "btn" }: { label: string; busy: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${className} ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? busy : label}
    </button>
  );
}

function RegenerateForm({ cardId }: { cardId: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className={`btn ${pending ? "pulse-soft" : ""}`} disabled={pending}>
        {pending ? "Asking Claude…" : "Regenerate"}
      </button>
      <input name="hint" placeholder="with a note, e.g. mention the Leeds move" className="w-56 rounded-md border border-transparent bg-transparent px-2 py-1 text-xs text-ink placeholder:text-ink-3 focus:border-line focus:bg-white focus:outline-none" />
      {["Warmer", "Shorter", "More formal"].map((h) => (
        <button key={h} type="submit" name="preset" value={h} className="btn btn-sm btn-ghost" disabled={pending}>
          {h}
        </button>
      ))}
      <input type="hidden" name="id" value={cardId} />
    </>
  );
}

export function DigestRow(p: Props) {
  const { card, person } = p;
  const [editing, setEditing] = useState(false);
  const draft = currentDraft(card);
  const text = finalTextOf(card);
  const frozen = ["approved", "edited", "skipped", "sent_to_print", "printed", "posted", "delivered"].includes(card.status);
  const held = card.status === "held";

  return (
    <article className="card-panel-hero flex gap-5 p-5">
      <Link href={`/cards/${card.id}`} className="shrink-0" title="Open the card">
        {p.preview ?? (
          <CardThumb width={200} brandHex={p.brandHex} accentHex={p.accentHex} template={draft?.artwork_brief.template} variant={draft?.artwork_brief.palette_variant} occasionType={p.occasionType} ordinal={p.ordinal} seed={card.seed} headline={held ? "" : (text?.front_headline ?? "")} />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link href={`/cards/${card.id}`} className="text-[15px] font-medium hover:underline">
            {fullName(person)}
          </Link>
          <span className="text-sm text-ink-2">
            {p.occasionLabel}
            {person.kind === "client" && ` · ${person.clientCompanyName}`}
            <span className="text-ink-3"> · due {formatShort(card.dueDate)}</span>
          </span>
          {card.status !== "drafted" && <StatusChip status={card.status} />}
          {card.autoApproved && <span className="chip chip-muted">auto-approved</span>}
        </div>

        {card.flags.length > 0 && (
          <ul className="mt-2 flex max-w-prose flex-wrap gap-1.5">
            {card.flags.map((f, i) => (
              <li key={i} className={`chip ${f.kind === "check" ? "chip-red" : "chip-amber"}`}>
                {f.text}
              </li>
            ))}
          </ul>
        )}

        {p.collection && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-gold-bg/70 px-3 py-2">
            <Link href={`/collections/${p.collection.id}`} className="text-sm font-medium hover:underline">
              Team collection
            </Link>
            <div className="bar w-32 bg-white/70">
              <div className="bar-fill" style={{ width: `${Math.round((100 * p.collection.contributors) / Math.max(1, p.collection.invited))}%` }} />
            </div>
            <span className="text-xs text-ink-2">
              {p.collection.contributors} of {p.collection.invited} chipped in{p.collection.status === "closed" ? " · closed" : ""}
            </span>
            {p.collection.status === "open" && p.collection.contributors < p.collection.invited && (
              <form action={contributeManyAction} className="ml-auto">
                <input type="hidden" name="collectionId" value={p.collection.id} />
                <Pending label="Demo: team chips in" busy="…" className="btn btn-sm" />
              </form>
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
                title={frozen ? undefined : "Click to edit the inside message"}
              >
                <p className="font-display text-[17px] leading-relaxed text-ink">{text.inside_message}</p>
                <p className="mt-2 text-sm text-ink-2">
                  {text.sign_off} <span className="font-script text-2xl leading-none">{p.signerName.split(" ")[0]}</span>
                  <span className="text-ink-3"> · {text.signature_line}</span>
                </p>
              </button>
            )}
            {draft?.rationale && !editing && (
              <p className="mt-1.5 px-1 text-xs text-ink-3">
                <span className="font-medium text-ink-2">Why: </span>
                {draft.rationale}
              </p>
            )}
          </div>
        )}

        {!frozen && !editing && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {held ? (
              <form action={releaseHeldAction}>
                <input type="hidden" name="id" value={card.id} />
                <Pending label="Draft anyway" busy="Drafting…" className="btn btn-primary" />
              </form>
            ) : (
              <form action={approveCardAction}>
                <input type="hidden" name="id" value={card.id} />
                <Pending label="Approve" busy="…" className="btn btn-primary" />
              </form>
            )}
            {!held && (
              <button type="button" className="btn" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
            {!held && (
              <form action={regenerateCardAction} className="flex flex-wrap items-center gap-1">
                <RegenerateForm cardId={card.id} />
              </form>
            )}
            <form action={skipCardAction}>
              <input type="hidden" name="id" value={card.id} />
              <Pending label="Skip" busy="…" className="btn btn-ghost" />
            </form>
            {!held && (
              <form action={changeSignerAction} className="ml-auto flex items-center gap-1.5 text-xs text-ink-3">
                <input type="hidden" name="id" value={card.id} />
                <span>Signed by</span>
                <select name="signerId" defaultValue={card.signerId} className="rounded-md border border-line bg-white px-1.5 py-1 text-xs text-ink" onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                  {p.signers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {p.coSignerName && <span>and {p.coSignerName}</span>}
              </form>
            )}
          </div>
        )}
        {card.status === "skipped" && card.skipReason && <p className="mt-2 text-sm text-ink-3">Skipped: {card.skipReason}</p>}
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { approveCardAction, changeSignerAction, editCardAction, regenerateCardAction, releaseHeldAction, skipCardAction } from "@/app/actions";
import { StatusChip } from "./StatusChip";
import { CardThumb } from "./CardThumb";
import { formatShort } from "@/lib/dates";
import { currentDraft, finalTextOf, fullName, type Card, type OccasionType, type Person } from "@/lib/types";
import { pence } from "@/lib/costs";

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
  shortName: string;
  collection?: { id: string; contributors: number; invited: number; status: "open" | "closed" };
};

function Pending({ label, busy, className = "btn" }: { label: string; busy: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${className} ${pending ? "pulse-soft" : ""}`} disabled={pending}>
      {pending ? busy : label}
    </button>
  );
}

export function DigestRow(p: Props) {
  const { card, person } = p;
  const [editing, setEditing] = useState(false);
  const [regen, setRegen] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const draft = currentDraft(card);
  const text = finalTextOf(card);
  const frozen = ["approved", "edited", "skipped", "sent_to_print", "printed", "posted", "delivered"].includes(card.status);
  const last = card.versions[card.versions.length - 1];

  return (
    <article className={`card-panel flex gap-4 p-4 ${card.status === "skipped" ? "opacity-60" : ""}`}>
      <Link href={`/cards/${card.id}`} className="shrink-0">
        <CardThumb
          width={104}
          brandHex={p.brandHex}
          accentHex={p.accentHex}
          template={draft?.artwork_brief.template}
          variant={draft?.artwork_brief.palette_variant}
          occasionType={p.occasionType}
          ordinal={p.ordinal}
          seed={card.seed}
          headline={text?.front_headline ?? (card.status === "held" ? "Held" : "")}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Link href={`/cards/${card.id}`} className="font-medium hover:underline">
            {fullName(person)}
          </Link>
          <span className="text-sm text-ink-2">
            {p.occasionLabel}
            {person.kind === "client" && ` · ${person.clientCompanyName}`}
          </span>
          <span className="text-xs text-ink-3">due {formatShort(card.dueDate)}</span>
          <StatusChip status={card.status} />
          {p.collection && (
            <Link href={`/collections/${p.collection.id}`} className="chip bg-gold/15 text-[var(--amber-fg)] hover:bg-gold/30">
              collection · {p.collection.contributors} of {p.collection.invited} signed{p.collection.status === "closed" ? " · closed" : ""}
            </Link>
          )}
          {card.autoApproved && <span className="chip bg-paper-2 text-ink-3">auto-approved</span>}
          {last && last.source !== "template" && card.aiCostGbp > 0 && (
            <span className="text-[11px] text-ink-3" title={`${last.usage.input_tokens + last.usage.cache_read_input_tokens} in · ${last.usage.output_tokens} out`}>
              {last.source === "cache" ? "cached draft" : "live draft"} · {pence(card.aiCostGbp)}
            </span>
          )}
        </div>

        {card.flags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {card.flags.map((f, i) => (
              <li key={i} className={`chip ${f.kind === "check" ? "bg-[var(--red-bg)] text-[var(--red-fg)]" : "bg-[var(--amber-bg)] text-[var(--amber-fg)]"}`}>
                {f.text}
              </li>
            ))}
          </ul>
        )}
        {card.status === "skipped" && card.skipReason && <p className="mt-2 text-sm text-ink-3">Skipped: {card.skipReason}</p>}

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
                <textarea name="inside_message" defaultValue={text.inside_message} rows={4} className="input font-display text-[15px] leading-relaxed" autoFocus />
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
                className={`block w-full rounded-md p-2 text-left ${frozen ? "cursor-default" : "hover:bg-paper-2"}`}
                title={frozen ? undefined : "Click to edit the inside message"}
              >
                <p className="font-display text-[15px] leading-relaxed text-ink">{text.inside_message}</p>
                <p className="mt-1 text-sm text-ink-2">
                  {text.sign_off} <span className="font-script text-lg">{p.signerName.split(" ")[0]}</span>
                  <span className="text-ink-3"> · {text.signature_line}</span>
                </p>
              </button>
            )}
            {draft?.rationale && !editing && <p className="mt-1 px-2 text-xs text-ink-3">{draft.rationale}</p>}
          </div>
        )}

        {!frozen && (
          <div className="mt-3 flex flex-wrap items-center gap-2 px-2">
            {card.status === "held" ? (
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
            {card.status !== "held" && (
              <button type="button" className="btn" onClick={() => setEditing(true)}>
                Edit one line
              </button>
            )}
            {card.status !== "held" && (
              <button type="button" className="btn" onClick={() => setRegen((v) => !v)}>
                Regenerate
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => setSkipping((v) => !v)}>
              Skip
            </button>
            {card.status !== "held" && (
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

        {regen && !frozen && (
          <form
            action={async (fd) => {
              await regenerateCardAction(fd);
              setRegen(false);
            }}
            className="mt-2 flex flex-wrap items-center gap-2 px-2"
          >
            <input type="hidden" name="id" value={card.id} />
            <input name="hint" className="input max-w-sm" placeholder="e.g. more formal, shorter, mention the Leeds office move" />
            {["More formal", "Warmer", "Shorter"].map((h) => (
              <button key={h} type="submit" name="hint" value={h} className="btn text-xs">
                {h}
              </button>
            ))}
            <Pending label="Regenerate live" busy="Asking Claude…" className="btn btn-primary" />
          </form>
        )}

        {skipping && !frozen && (
          <form
            action={async (fd) => {
              await skipCardAction(fd);
              setSkipping(false);
            }}
            className="mt-2 flex flex-wrap items-center gap-2 px-2"
          >
            <input type="hidden" name="id" value={card.id} />
            <select name="reason" className="input max-w-xs">
              <option>Already handled personally</option>
              <option>Not appropriate right now</option>
              <option>Wrong recipient or signer</option>
              <option>Other</option>
            </select>
            <Pending label="Confirm skip" busy="…" />
          </form>
        )}
      </div>
    </article>
  );
}

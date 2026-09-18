// Build the renderable card from db state. Shared by preview, print page and PDF.
import { derivePalette } from "./colour";
import { resolveArtwork } from "./artwork";
import { signAsFor } from "./signers";
import type { RenderableCard } from "@/components/Card";
import { currentDraft, finalTextOf, type Card, type DB } from "./types";

export function renderableCard(db: DB, card: Card): RenderableCard | undefined {
  const company = db.company;
  const occ = db.occasions.find((o) => o.id === card.occasionId);
  const text = finalTextOf(card);
  if (!company || !occ || !text) return undefined;
  const draft = currentDraft(card);
  const art = resolveArtwork(draft?.artwork_brief.template, draft?.artwork_brief.palette_variant, occ.type, occ.ordinal, card.seed);
  const palette = derivePalette(company.brandHex, art.variant, company.accentHex);
  const signer = db.people.find((p) => p.id === card.signerId);
  const co = card.coSignerId ? db.people.find((p) => p.id === card.coSignerId) : undefined;
  const col = card.collectionId ? db.collections.find((c) => c.id === card.collectionId) : undefined;
  const signatures = col?.contributions
    .filter((c) => c.message.trim())
    .map((c) => {
      const p = db.people.find((x) => x.id === c.contributorId);
      return { name: p ? `${p.firstName} ${p.lastName[0]}.` : "A colleague", line: c.message };
    });
  return {
    text,
    palette,
    art,
    shortName: company.shortName,
    signAs: signer ? signAsFor(signer) : "",
    coSignAs: co ? signAsFor(co) : undefined,
    ref: `${company.id.slice(0, 2).toUpperCase()}-${card.dueDate.replace(/-/g, "").slice(2)}-${card.id.slice(-5)}`,
    signatures,
    personal: company.kind === "personal",
  };
}

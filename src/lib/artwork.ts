// Resolve the model's artwork choice to something renderable. Browser-safe.
import type { ArtTemplate, OccasionType, PaletteVariant } from "./types";

export type ResolvedArtwork = { template: ArtTemplate; variant: PaletteVariant; seed: number; ordinal?: number };

export const DEFAULT_TEMPLATE: Record<OccasionType, ArtTemplate> = {
  birthday: "confetti",
  "work-anniversary": "rings",
  welcome: "bands",
  leaver: "waves",
  retirement: "waves",
  "client-anniversary": "rings",
  "client-milestone": "dots",
  sympathy: "sprig",
  "get-well": "sprig",
  congratulations: "sparks",
};

export function resolveArtwork(template: ArtTemplate | undefined, variant: PaletteVariant | undefined, type: OccasionType, ordinal: number | undefined, seed: number): ResolvedArtwork {
  let t: ArtTemplate = template ?? DEFAULT_TEMPLATE[type];
  if (t === "numeral" && !(ordinal && ordinal >= 5)) t = "rings";
  if ((type === "sympathy" || type === "get-well") && t !== "sprig" && t !== "waves") t = "sprig";
  const v: PaletteVariant = variant ?? (type.startsWith("client") ? "formal" : type === "sympathy" || type === "get-well" ? "muted" : "bright");
  return { template: t, variant: v, seed, ordinal };
}

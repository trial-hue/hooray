import { z } from "zod";
import { ART_TEMPLATES, PALETTE_VARIANTS } from "../types";

// Flat schema, no min/max: lengths are enforced by checks.ts with readable violations.
export const ArtworkBriefSchema = z.object({
  template: z.enum(ART_TEMPLATES),
  palette_variant: z.enum(PALETTE_VARIANTS),
  style_note: z.string(),
});

export const DraftSchema = z.object({
  front_headline: z.string(),
  inside_message: z.string(),
  sign_off: z.string(),
  signature_line: z.string(),
  artwork_brief: ArtworkBriefSchema,
  flags: z.array(z.string()),
  rationale: z.string(),
});

export type DraftOutput = z.infer<typeof DraftSchema>;

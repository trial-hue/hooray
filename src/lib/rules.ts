// Channel rules: hard-coded policy per recipient kind and occasion.
import type { Company, Formality, Occasion, Person } from "./types";

export type ChannelRules = {
  formality: Formality;
  humour: "none" | "light";
  maxExclamations: 0 | 1;
  mentionAge: "never" | "allowed";
  mentionOrdinal: "no" | "required";
  voice: "i" | "we";
};

export function rulesFor(p: Person, occ: Occasion, c: Company | undefined): ChannelRules {
  const client = p.kind === "client";
  const solemn = occ.type === "sympathy" || occ.type === "get-well";
  const formality = c?.formality ?? "medium";
  return {
    formality: client || solemn ? "high" : formality,
    humour: client || solemn ? "none" : "light",
    maxExclamations: client || solemn || formality === "high" ? 0 : 1,
    mentionAge: "never",
    mentionOrdinal: occ.type === "work-anniversary" || occ.type === "client-anniversary" ? "required" : "no",
    voice: client ? "we" : "i",
  };
}

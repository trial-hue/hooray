// Fallback copy when the model refuses, fails checks twice, or is unavailable.
import type { DraftContext } from "./prompts";
import type { DraftOutput } from "./schema";
import { ordinalWord } from "../dates";

export function templateDraft(ctx: DraftContext): DraftOutput {
  const r = ctx.recipient;
  const name = r.preferredName ?? r.firstName;
  const sig = ctx.signer.preferredSignature ?? `${ctx.signer.firstName} ${ctx.signer.lastName}, ${ctx.signer.role}`;
  const co = ctx.coSigner ? ` and ${ctx.coSigner.preferredSignature ?? `${ctx.coSigner.firstName} ${ctx.coSigner.lastName}, ${ctx.coSigner.role}`}` : "";
  const firm = ctx.company.shortName;
  const n = ctx.occasion.ordinal ?? 0;
  const years = n <= 10 ? ordinalWord(n) : String(n);
  let d: Omit<DraftOutput, "flags" | "rationale">;
  switch (ctx.occasion.type) {
    case "birthday":
      d = { front_headline: `Happy birthday, ${name}`, inside_message: `Happy birthday from all of us at ${firm}. I hope the day is a good one and that you get some proper time to yourself. Enjoy it.`, sign_off: "With best wishes,", signature_line: sig + co, artwork_brief: { template: "confetti", palette_variant: "bright", style_note: "light confetti, plenty of paper" } };
      break;
    case "work-anniversary":
      d = { front_headline: `${cap(years)} years, ${name}`, inside_message: `${cap(years)} years with ${firm} today. Thank you for everything you have brought to the team in that time. It is noticed, and it matters.`, sign_off: "With thanks,", signature_line: sig + co, artwork_brief: { template: n >= 5 ? "numeral" : "rings", palette_variant: "formal", style_note: "restrained rings in brand colour" } };
      break;
    case "welcome":
      d = { front_headline: `Welcome, ${name}`, inside_message: `Welcome to ${firm}. The ${r.team} team is looking forward to having you, and there will be someone waiting to show you round on your first morning. Ask anything, as often as you need.`, sign_off: "With best wishes,", signature_line: sig + co, artwork_brief: { template: "bands", palette_variant: "bright", style_note: "diagonal bands with a name badge" } };
      break;
    case "client-anniversary":
      d = { front_headline: `${cap(years)} years together`, inside_message: `It has been ${years} years since ${r.clientCompanyName ?? r.team} first placed its trust in ${firm}. Thank you, ${name}, for the confidence you have shown in the team throughout. We look forward to the years ahead.`, sign_off: "With our thanks and best regards,", signature_line: sig, artwork_brief: { template: "rings", palette_variant: "formal", style_note: "concentric rings, calm" } };
      break;
    case "client-milestone":
      d = { front_headline: "Congratulations", inside_message: `Congratulations from all of us at ${firm} on ${ctx.occasion.label ?? "this achievement"}. It is a pleasure to see ${r.clientCompanyName ?? r.team} go from strength to strength. Thank you for letting us be part of it.`, sign_off: "With our warm regards,", signature_line: sig, artwork_brief: { template: "sparks", palette_variant: "formal", style_note: "a few bursts, restrained" } };
      break;
    case "sympathy":
      d = { front_headline: `Thinking of you, ${name}`, inside_message: `We were so sorry to hear your news. Please take whatever time you need, and let us carry anything we can while you do.`, sign_off: "With sympathy,", signature_line: sig, artwork_brief: { template: "sprig", palette_variant: "muted", style_note: "single sprig, lots of white" } };
      break;
    case "get-well":
      d = { front_headline: `Get well soon, ${name}`, inside_message: `Everyone here is thinking of you and hoping you are back on your feet soon. Please do not worry about anything at this end. Rest properly.`, sign_off: "With best wishes,", signature_line: sig, artwork_brief: { template: "sprig", palette_variant: "muted", style_note: "gentle sprig" } };
      break;
    default:
      d = { front_headline: `Congratulations, ${name}`, inside_message: `Congratulations from all of us at ${firm}. It is a pleasure to see your work recognised like this. Thank you for everything you bring to the team.`, sign_off: "With best wishes,", signature_line: sig, artwork_brief: { template: "sparks", palette_variant: "bright", style_note: "bursts in brand colour" } };
  }
  return { ...d, flags: ["Fallback template copy: the AI draft was unavailable. Please read before approving."], rationale: "Template copy used because the AI draft was refused, failed checks, or the service was unavailable." };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

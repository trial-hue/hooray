import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { DraftSchema, type DraftOutput } from "./schema";
import { SYSTEM_PROMPT, PROMPT_VERSION, companyBlock, buildUserMessage, type DraftContext } from "./prompts";
import { runChecks } from "./checks";
import { templateDraft } from "./template";
import { draftCacheKey, readCachedDraft, writeCachedDraft, sha256 } from "./cache";
import type { DraftVersion, Usage } from "../types";
import { aiCostGbp } from "../costs";

export const DRAFT_MODEL = process.env.DRAFT_MODEL ?? "claude-opus-5";

let client: Anthropic | undefined;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

const zero = (): Usage => ({ input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 });
function add(a: Usage, u: Anthropic.Usage): Usage {
  return {
    input_tokens: a.input_tokens + (u.input_tokens ?? 0),
    output_tokens: a.output_tokens + (u.output_tokens ?? 0),
    cache_read_input_tokens: a.cache_read_input_tokens + (u.cache_read_input_tokens ?? 0),
    cache_creation_input_tokens: a.cache_creation_input_tokens + (u.cache_creation_input_tokens ?? 0),
  };
}

export type DraftResult = {
  draft: DraftOutput;
  usage: Usage;
  attempts: number;
  source: "claude" | "cache" | "template";
  violations: string[]; // non-empty means needs_review
  refused?: boolean;
  ms: number;
  promptHash: string;
  model: string;
};

export function cacheKeyFor(ctx: DraftContext): string {
  const r = ctx.recipient;
  return draftCacheKey({
    occ: ctx.occasion.occurrenceKey,
    signer: ctx.signer.id,
    co: ctx.coSigner?.id ?? null,
    v: PROMPT_VERSION,
    model: DRAFT_MODEL,
    tone: ctx.company.toneWords,
    facts: r.publicFacts,
    leave: ctx.onLeaveNote ?? null,
  });
}

/** Draft one card. Uses the on-disk cache unless `bypassCache`. Never throws. */
export async function generateDraft(
  ctx: DraftContext,
  opts: { hint?: string; previous?: DraftOutput; bypassCache?: boolean; otherCompanyNames?: string[] } = {},
): Promise<DraftResult> {
  const t0 = Date.now();
  const key = cacheKeyFor(ctx);
  if (!opts.bypassCache && !opts.hint) {
    const cached = readCachedDraft(key);
    if (cached) {
      return { draft: cached.draft, usage: cached.usage, attempts: cached.attempts, source: "cache", violations: [], ms: Date.now() - t0, promptHash: cached.promptHash, model: cached.model };
    }
  }

  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    { type: "text", text: companyBlock(ctx.company), cache_control: { type: "ephemeral" } },
  ];
  const userMsg = buildUserMessage(ctx);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMsg }];
  if (opts.previous && opts.hint) {
    messages.push({ role: "assistant", content: JSON.stringify(opts.previous) });
    messages.push({ role: "user", content: `The manager asked for a change: "${opts.hint}". Rewrite the card accordingly. Keep what still works. Return the JSON object only.` });
  }
  const promptHash = sha256(DRAFT_MODEL + SYSTEM_PROMPT + companyBlock(ctx.company) + userMsg + (opts.hint ?? ""));

  let usage = zero();
  let last: DraftOutput | null = null;
  let lastViolations: string[] = [];

  for (let attempt = 1; attempt <= 2; attempt++) {
    let res: Awaited<ReturnType<Anthropic["messages"]["parse"]>>;
    try {
      res = await getClient().messages.parse({
        model: DRAFT_MODEL,
        max_tokens: 4096,
        thinking: { type: "adaptive" },
        output_config: { effort: "medium", format: zodOutputFormat(DraftSchema) },
        system,
        messages,
      });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError && attempt === 1) {
        const wait = Number(err.headers?.get?.("retry-after") ?? 5);
        await new Promise((r) => setTimeout(r, Math.min(wait, 20) * 1000));
        continue;
      }
      const msg = err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : String(err);
      const d = templateDraft(ctx);
      return { draft: d, usage, attempts: attempt, source: "template", violations: [`API error: ${msg.slice(0, 120)}`], ms: Date.now() - t0, promptHash, model: DRAFT_MODEL };
    }
    usage = add(usage, res.usage);
    if (res.stop_reason === "refusal") {
      const d = templateDraft(ctx);
      return { draft: d, usage, attempts: attempt, source: "template", violations: ["model refused"], refused: true, ms: Date.now() - t0, promptHash, model: DRAFT_MODEL };
    }
    const parsed: DraftOutput | null = res.parsed_output;
    if (!parsed) {
      messages.push({ role: "user", content: "That was not valid JSON for the schema. Return the JSON object only." });
      continue;
    }
    last = parsed;
    lastViolations = runChecks(last, ctx, opts.otherCompanyNames);
    if (lastViolations.length === 0) {
      const v: DraftVersion = { draft: last, createdAt: ctx.occasion.date, promptHash, model: DRAFT_MODEL, usage, attempts: attempt, source: "claude", hint: opts.hint, ms: Date.now() - t0 };
      if (!opts.hint) writeCachedDraft(key, v);
      return { draft: last, usage, attempts: attempt, source: "claude", violations: [], ms: Date.now() - t0, promptHash, model: DRAFT_MODEL };
    }
    if (attempt === 1) {
      messages.push({ role: "assistant", content: JSON.stringify(last) });
      messages.push({ role: "user", content: `The draft failed these checks:\n- ${lastViolations.join("\n- ")}\nReturn a corrected card as JSON. Change only what is needed to pass.` });
    }
  }
  // Two attempts, still failing: return the last draft for human review.
  if (last) return { draft: last, usage, attempts: 2, source: "claude", violations: lastViolations, ms: Date.now() - t0, promptHash, model: DRAFT_MODEL };
  const d = templateDraft(ctx);
  return { draft: d, usage, attempts: 2, source: "template", violations: ["unparseable output"], ms: Date.now() - t0, promptHash, model: DRAFT_MODEL };
}

export function costOf(model: string, usage: Usage): number {
  return aiCostGbp(model, usage);
}

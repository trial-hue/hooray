# Hooray

Set-and-forget occasion cards and team collections for companies. A company uploads a staff roster once; from then on every birthday, work anniversary, welcome and leaver produces a drafted, printed card that a manager approves in a weekly digest, and peer collections open on the occasions people actually give for.

Built on the Telemachus trial day, 18 September 2026, as an AI-native clone of Moonpig's economics for the B2B segment. The commercial case is in `docs/BUSINESS_PLAN.md`; the build spec and demo script are in `docs/SPEC.md`.

## Run it

```bash
# Node 24 (installed via nvm; node/npm are symlinked into ~/.local/bin)
cp .env.local.example .env.local
npm install
npm run dev                         # http://localhost:3000
```

**Claude access.** Either sign in once with the Anthropic CLI (`ant auth login`, a browser sign-in; the SDK then picks up the profile from `~/.config/anthropic` automatically), or put `ANTHROPIC_API_KEY=sk-ant-...` in `.env.local`. Don't do both: a set key shadows the login. The trial-day machine uses the login.

Optional env: `DRAFT_MODEL` (default `claude-opus-5`), `STANNP_API_KEY` (send real test proofs), `AI_DISABLED=1` (template copy, no API calls), `DATA_MODE=memory` (no disk writes).

## Scripts

```bash
AI_DISABLED=1 npx tsx scripts/smoke.ts              # full loop, headless, no API key: import → draft → approve/edit → leaver collection → dispatch → a simulated year
node --env-file=.env.local --import tsx scripts/smoke.ts   # same with real drafts (cached under data/drafts after the first run)
node --env-file=.env.local --import tsx scripts/eval.ts    # ten drafting cases through the model with the wording checks (~£0.20)
AI_DISABLED=1 npx tsx scripts/reset-demo.ts --staged      # reset to the demo's opening state
node scripts/console-check.mjs                             # browser console errors on the main pages (dev server must be running)
```

## The demo (about four minutes)

1. **Onboarding** → *Load Hartley & Crane* (50 staff, 10 clients). The daily job runs immediately: every occasion due within ten days is drafted.
2. **Calendar** → eight weeks of occasions, milestones marked.
3. **Digest** → three drafts to talk through: a birthday, a five-year anniversary (which opened a team collection), a welcome. Approve two, edit one line on the third. Show the held card (no home address) and the on-leave flag.
4. **Card page** → the front and inside at print size, the Docmail/Stannp cost, and the exact Stannp request. *Download print PDF* gives the 303×216mm two-page file with bleed and crop marks.
5. **People** → *Mark as leaving* on Rob Sinclair. A team collection opens for the Outsourcing team only. *Demo: eight colleagues chip in*. Open the card: eight handwritten lines inside.
6. **+1 week** twice → cards dispatch automatically five days before the date (auto-approval is the feature), print jobs move printed → posted → delivered, Rob's collection closes and he picks a gift.
7. **+1 month** a few times → the year runs itself. **Dashboard** → occasions under management, approve-without-edit rate, £1.39 a card, the Moonpig comparison, four people against 676.

## Hooray for people

A second workspace at `/me`: one person, the people they care about, the same drafting and print pipeline. Start at `/me/start` (three example people, or your own name), add contacts on `/me/people`, and the queue at `/me` works exactly like the business one. Data lives in `data/personal.json`, separate from the firm's `data/db.json`. The Google import page explains the flow; the live OAuth connection is not built. Pricing shown (£5.49 a card, £4.99 a month) is designed, not tested, and no payment is taken.

## How it works

- `src/lib/engine.ts` — the daily job: progress print jobs, create and draft cards due in `LEAD_DAYS` (10), dispatch cards due in `DISPATCH_DAYS` (5) with auto-approval of anything untouched.
- `src/lib/occasions.ts` — materialises birthdays (milestones at 30/40/50/60), work anniversaries (milestones at 1/3/5/10/15/20), welcomes, leavers and retirements from the roster.
- `src/lib/gate.ts`, `rules.ts`, `signers.ts` — policy in code: who never gets a card, who signs, how formal.
- `src/lib/ai/` — the drafting layer: versioned system prompt with few-shots, structured output via `messages.parse` + zod, 15 post-generation checks with one retry, template fallback, on-disk cache keyed by occasion + signer + prompt version, real token cost per card.
- `src/lib/collections.ts` — team-scoped collections, suggested amount, hidden amounts, fund-first-then-choose.
- `src/components/Card.tsx` + `src/lib/pdf.ts` — the card in millimetres, rendered once for the screen and printed to PDF by the installed Chrome via puppeteer-core.
- `src/lib/stannp.ts` — the print partner request; `test=true` returns a proof without dispatch when a key is set.
- `data/db.json` — the whole state, one JSON file. `data/drafts/` — the draft cache (committed so rehearsals cost nothing).

## Out of scope today

Real payments, authentication, email, live HR/CRM sync, image generation, the employee personal account, gift fulfilment, multi-tenancy.

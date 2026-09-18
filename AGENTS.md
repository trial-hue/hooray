<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project plan

Two documents define this build. Read both before changing product behaviour, and prefer them over anything in an earlier conversation.

- `docs/BUSINESS_PLAN.md` — the commercial case. Why this business, the economics, what is verified vs estimated.
- `docs/SPEC.md` — what to build, in priority order, and the demo script that defines "done".

Decisions that override earlier drafts:

1. Pricing is **£30 per employee per year, all inclusive**, not per card. Card cost is **£1.39** (Docmail, production) and **£1.15** (Stannp, prototype).
2. Collections fire on **leaver, retirement, milestone birthday, wedding, new baby** only. **Never on a routine birthday** — 78% of people contribute for a leaver, 22% for a routine birthday.
3. **No standing wishlist.** The pot is collected first, then the recipient picks from a curated range.
4. Collections are scoped to the person's **immediate team**, never company-wide.
5. Anything still pending at dispatch is **auto-approved**. This is a feature: the promise is that nobody has to do anything.
6. Print via **Stannp** with `test=true`, which returns a real proof PDF without charging.
7. Employee **consent is required** before a birthday can be marked. Payroll date of birth cannot be reused for celebrations without its own lawful basis.
8. The dashboard must compare against **Moonpig for Business at £3.60 a card** and **Moonpig's 676 employees**, not against consumer pricing.

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

### Revision 14:30, 18 September — three phases, and corrections to the Moonpig comparison

`docs/BUSINESS_PLAN.md` was rewritten. It now describes three phases on one loop: companies (phase 1, this year), employees as consumers (phase 2, from month two), everyone (phase 3). Today's build is phase 1. Nothing in decisions 1–8 changes. These are added:

9. **Compare margins against 55.9%, the Moonpig segment, not 58.4% group.** The group figure blends in the Experiences agency business at 93.8%. Label it "Moonpig segment, FY26".
10. **Moonpig has group cards.** Up to 50 contributors, manually created, shared by link, physical or digital. What they lack: a money pot, an HR or roster trigger, team scoping, recipient gift choice. Never say "not offered".
11. **Postage is Moonpig's cost problem, not print.** Shipping and logistics is £88.2m, 23.6% of revenue, about £2.45 per order, and grew 9.4% against 6.5% revenue growth. Our £1.39 is all-in including economy post. The dashboard comparison is a price list against a logistics operation.
12. **Gifts are 45% of Moonpig-brand revenue** (£123m attached against £8m standalone) on a 17.9% attach rate at ~£19 per attached order. Collections are the attach mechanism. **Gift value under management** is a headline metric on the dashboard: sum of collection pots plus client gift value.
13. **Consumer pricing is designed, not tested:** £5.49 per card including post, or £4.99 a month for up to twelve cards sent automatically. A CONSUMER block in costs.ts holds it. No consumer UI today.
14. **Named for next, not built today:** the employee personal account (the consent email doubles as the signup), Google calendar import via the People API, and preference learning from digest edits (an edit teaches the firm's voice for the next draft). Do not start these until the approve-without-edit baseline is measurable.

All figures in the plan carry **[V]** verified, **[D]** derived, **[E]** estimate or **[A]** from the reference build's model. Keep that discipline in any copy shown to the user.

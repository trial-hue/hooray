# Company-paid gifts on milestone and client cards

## Context

The plan says gifts are where the money moves: 39% of Moonpig plus Greetz revenue on an 18% attach rate, and "gift value under management" is a headline metric. The MVP has the collection side (a recipient picks from `GIFT_RANGE` when a pot closes) but not the company-paid side: a five-year anniversary, a milestone birthday or a client date that carries a gift alongside the card. That is the Account B revenue line, and today the dashboard fakes it as `clients × 10% × £50`.

This adds a policy-driven, auto-attached company gift on qualifying occasions, visible and swappable on the digest, summed for real on the dashboard. Built tonight in place of deploy. About an hour with the agent. No new dependencies, no payments, no fulfilment; the gift is recorded, priced and shown, the same as the collection gift choice is today.

Repo: `/Users/trialday/Desktop/Trial Day - Akshay Devon/hooray`

## Design

**Policy.** A gift auto-attaches at card creation (T-10) when the occasion is:
- staff `work-anniversary` with `isMilestone` (ordinal in `MILESTONE_YEARS`)
- staff `birthday` with `isMilestone` (age in `MILESTONE_AGES`)
- client `client-anniversary` with `isMilestone`, or any `client-milestone`

Default gift: the first `GIFT_RANGE` item whose `fromPence <= policy value`, else the cheapest. Default values from `UNIT`: staff milestone £50, client £50 (already `clientGiftValueGbp`). Leaver and retirement are excluded: those are collection-funded, not company-funded.

**Approver control.** The digest row shows a gift chip next to the collection chip. The `...` menu gets a "Gift" select (same pattern as the signer select) with the range plus "No gift". Auto-approval leaves the gift as attached, consistent with cards.

**Dashboard.** "Gift value under management" becomes `potTotal + Σ card.gift.valuePence` over cards with a company gift, split staff milestone / client in the sub-label. Add a "gift margin, estimate" line at `UNIT.giftMarginRate`. Remove the headcount estimate.

## Changes

### 1. Types — `src/lib/types.ts`
- `Card` (L205): add `gift?: CardGift` where `CardGift = { id: string; name: string; valuePence: number; paidBy: "company"; reason: "staff-milestone" | "client" }`.
- `Occasion` (L104): add `companyGiftEligible?: boolean`, parallel to `collectionEligible`.

### 2. Costs — `src/lib/costs.ts` UNIT block (L10–32)
- Add `staffMilestoneGiftValueGbp: 50` and `giftMarginRate: 0.25`. Keep `clientGiftValueGbp: 50`. Delete `clientGiftRate` once the dashboard no longer uses it.

### 3. Occasion rules — `src/lib/occasions.ts`
- L48–51 (staff anniversary): set `companyGiftEligible = isMilestone`.
- L33–35 (staff birthday): set `companyGiftEligible = isMilestone`.
- L56–61 (client anniversary): set `companyGiftEligible = isMilestone`.
- L71–72 (`client-milestone` from `p.milestones[]`): set `companyGiftEligible = true`.
- Leaver / retirement (L66–68): leave as is.

### 4. Gift helpers — `src/lib/collections.ts` (or a new `src/lib/gifts.ts` importing `GIFT_RANGE`)
- `defaultGiftFor(occ, person): CardGift | undefined` — picks by policy above.
- `setCardGift(card, giftId | null)` — swaps to a `GIFT_RANGE` item at its `fromPence`, or clears.

### 5. Engine — `src/lib/engine.ts` `ensureCards` (L113–128, near the collection-open at L147)
- After the card is created, if `occ.companyGiftEligible`, set `card.gift = defaultGiftFor(occ, person)`.

### 6. Server action — `src/app/actions.ts`
- `setCardGiftAction(cardId, giftId | "")` next to `chooseGiftAction` (L291). Mutates via the existing `mutate` pattern, revalidates the digest.

### 7. Digest UI
- `src/app/digest/page.tsx` L42–66: pass `gift={c.gift}` into `DigestRow`.
- `src/components/DigestRow.tsx`: add `gift?: CardGift` to `Props` (L12–26). Render a chip beside the collection chip (L77–81): "Gift · Northern food hamper · £60". In the `...` menu (L165–206), add a `<select>` bound to `setCardGiftAction` listing `GIFT_RANGE` plus "No gift", same markup as the signer select (L180–194).

### 8. Card page — `src/app/cards/[id]/page.tsx`
- One line in the sidebar: "Company gift: {name}, {value}. Fulfilled separately by drop-ship." Only when `card.gift` is set.

### 9. Dashboard — `src/app/dashboard/page.tsx` L37–41, L70
- Replace L40 with a real sum: `companyGiftTotal = cards.filter(c => c.gift).reduce(...)`, split by `gift.reason`.
- `giftUnderManagement = potTotal + companyGiftTotal`.
- Sub-label: `{pots} in collection pots · {staff} staff milestone gifts · {client} client gifts`.
- New row under it: "Gift margin, estimate" = `giftUnderManagement × UNIT.giftMarginRate`, labelled [E].

### 10. Smoke test — `scripts/smoke.ts`
- Assert that after a simulated year at least one staff milestone card and one client card carry `gift`, and that the dashboard total is non-zero.

## Out of scope tonight
Per-company gift policy settings, Stripe for gifts, supplier fulfilment, gift on the print file, gift attach on routine birthdays. All named in the plan as days 31–60.

## Verification
1. `AI_DISABLED=1 npx tsx scripts/smoke.ts` passes with the new assertions.
2. Load Hartley & Crane. Advance the clock until a staff milestone anniversary and a client milestone (Harriet Kettlewell, 2026-10-08) are in the queue. Both rows show a gift chip; a routine birthday does not.
3. Open `...` on a gifted row, change the gift, confirm the chip updates. Choose "No gift", confirm it clears.
4. Dashboard: "Gift value under management" is a real sum; the sub-label splits pots / staff / client; "Gift margin, estimate" shows 25% of it.
5. `node scripts/console-check.mjs` clean on digest, cards and dashboard.
6. Commit as "Company-paid gifts on milestone and client cards; dashboard sums real gift value".

## Paste for Cursor
> Read the plan at ~/.claude/plans/thought-what-about-swift-tome.md and implement it exactly. Do not add fulfilment, payments or settings. Commit when the smoke test passes.

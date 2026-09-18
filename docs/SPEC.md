# Build spec

**One sentence.** A company uploads a staff roster once, and from then on every occasion produces a drafted card that a manager approves in a weekly digest and a print API posts, with peer collections firing on the occasions people actually give for.

The demo has to prove four things and nothing else: the loop runs unattended, the drafting is good enough to approve unedited, the leaver collection works and no competitor has it, and the cost base beats Moonpig's.

---

## The demo script, which defines "done"

1. Upload a CSV of 50 staff for one company.
2. Advance the simulated clock through a year. Occasions accumulate on screen.
3. Stop at a week. The digest shows three drafts: a birthday, a five-year anniversary, a welcome.
4. Approve two. Edit one line on the third.
5. Open the print payload for one card. A real proof PDF is better than a generated one.
6. Mark someone as leaving. A team collection opens. Eight colleagues contribute. The card carries eight signatures. The recipient picks a gift.
7. Dashboard: the year's totals, approve-without-edit rate, cost per card, and the comparison against Moonpig.

If the clock reaches the end of the year and a manager never had to think about it, the thesis is demonstrated.

---

## Build order

**Tier 1, the loop. Without this there is no demo.**
- CSV import
- Occasion generation
- Simulated clock and daily job
- Card drafting
- Approval digest
- Print payload

**Tier 2, the differentiator. Build this before polishing Tier 1.**
- Leaver collection: contribution page, group signatures, recipient gift choice

**Tier 3, the argument. Cheap and high impact.**
- Metrics dashboard with the cost comparison

**Tier 4, only if hours remain.**
- Client roster alongside the staff roster
- Employee consent and personal account stub

---

## Data model

```
Company      id, name, brand_primary, brand_secondary, logo_url, signer_rule
Person       id, company_id, name, email, dob, start_date, end_date,
             manager_id, team, address_lines, postcode,
             consent_occasions (bool), consent_home_address (bool)
Occasion     id, person_id, type, date, is_milestone, collection_eligible
Draft        id, occasion_id, message, design_spec, signer_id,
             status (pending|approved|edited|skipped), edited_message
Order        id, draft_id, payload_json, proof_url, cost_pence, status
Collection   id, occasion_id, target_pence, suggested_pence, closes_on,
             gift_choice, status
Contribution id, collection_id, contributor_id, amount_pence, message
Clock        current_date
```

## Occasion rules

| Type | Trigger | Recurs | Collection |
|---|---|---|---|
| Birthday | dob | annual | no |
| Milestone birthday | dob at 30, 40, 50, 60 | annual | yes |
| Work anniversary | start_date | annual | no |
| Milestone anniversary | start_date at 1, 3, 5, 10, 15, 20 years | annual | yes |
| Welcome | start_date, first occurrence only | once | no |
| Leaver | end_date set | once | yes |
| Retirement | end_date with flag | once | yes |

Collection eligibility follows the survey data. 78% of people contribute for a leaver and 75% for a retirement, but only 22% for a routine birthday. Routine birthdays get the company card and nothing else.

## Timing rule

Keep it to one constant. Drafts are created at ten days before the occasion. Dispatch happens at five days before. Anything still pending at dispatch is auto-approved, because the product's promise is that nobody has to do anything.

Auto-approval is a feature, not a fallback. Say so in the demo.

## Drafting

Input to the model: recipient name, occasion type and number, team, tenure, relationship to signer, company tone, and a short free-text note about the person if the roster has one.

Output: a message of one to three sentences, plus a design spec of background, accent, motif and layout drawn from the company's brand colours. Use a small set of templated layouts rather than image generation. It is faster, it looks more corporate, and it will not produce something embarrassing on stage.

Show two contrasting drafts in the demo, a warm one for a long-serving colleague and a brief one for a new starter, so the tone difference is visible.

## Print

Use Stannp. REST, HTTP Basic auth, free plan, and `test=true` returns a proof PDF without charging. That proof is the artifact to put on screen, because a real call to a real print provider is worth more than a PDF you rendered yourself.

If the key does not arrive in time, generate the PDF locally and display the exact Stannp request payload next to it.

Name Docmail as the production supplier at £1.39 all-in, since it puts the card in an envelope.

## Collection flow

1. `end_date` is set on a person. The daily job fires a leaver occasion immediately.
2. A collection opens for that person's team, scoped to the immediate team rather than the company. A 200-person firm has roughly 400 occasions a year, so company-wide notification is spam by week two.
3. Each colleague sees a suggested amount. 65% of people say they do not know how much to give, so the suggestion is the product. Contributions are optional and amounts are hidden from everyone.
4. Contributors add a line to the shared card.
5. At close, the recipient picks a gift from a curated range. Do not build a standing wishlist. Nobody maintains one, and 72% say they would rather choose their own gift.
6. Fake the payments. A button that records a contribution is enough. Holding real contributions is regulated e-money activity and belongs nowhere near today.

## Dashboard

| Show | Why |
|---|---|
| Occasions under management | The roster is the asset |
| Cards drafted, approved, edited | Volume |
| Approve-without-edit rate | Proves the drafting is good enough |
| Cost per card at £1.39 | The cost base |
| Moonpig for Business at £3.60 plus admin time | The comparison |
| 4 people against Moonpig's 676 | The Telemachus point |

## Explicitly out of scope today

Real payments. Real authentication. Real email or SMS. Live HR or CRM integrations. Image generation. A mobile app. The employee personal account and calendar import. Gift fulfilment. Anything multi-tenant beyond one demo company.

## Seed data

One company, 50 people. Spread the dates so that advancing a year produces a steady stream rather than clusters. Include at least one five-year anniversary, one new starter, one milestone birthday, and one person you can mark as leaving on stage.

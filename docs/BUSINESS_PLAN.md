# Hooray

### Business unit plan: set-and-forget occasion cards and team collections for companies

*Telemachus trial day, 18 September 2026. **[V]** verified from the sources at the end. **[D]** derived by arithmetic from verified figures. **[E]** estimate, needs testing.*

---

## 1. The target

Moonpig Group plc, year to 30 April 2026. **[V]**

| | |
|---|---|
| Revenue | £373.0m |
| Gross margin | 58.4% |
| Adjusted EBITDA | £104.6m at 28.0% |
| Profit after tax | £51.7m |
| Free cash flow | £73.5m |
| Marketing | £38.7m, 10.4% of revenue |
| Average employees | 676, of which 143 in operations |
| Revenue per employee **[D]** | £552k |

Comfortably past the Telemachus threshold of more than $10m annual net profit. Running at roughly half the revenue-per-employee bar. No serious challenger in the category.

## 2. The thesis in one line

Moonpig holds 113 million occasion reminders, converts about 13% of them, employs 533 people outside the factory to manage that failure, spends roughly a new customer's entire first-year revenue to replace the ones who leave, and returns almost all its free cash flow to shareholders because it has nothing better to do with it.

We take the same loop, sell it to companies instead of consumers, and run it with four people.

## 3. The attack

This is the spine of the plan. Each row is a measured inefficiency, the structural change that removes it, and whether today's build proves it.

| # | Moonpig's inefficiency | Our structural attack | In the MVP today |
|---|---|---|---|
| 1 | 87% of reminders produce no order. 113m held, ~14.4m orders caused **[D]** | Draft the card first, ask for approval second. Anything untouched at dispatch goes anyway | **Built.** Rolling engine drafts at T-10, dispatches at T-5, auto-approves whatever nobody touched |
| 2 | Marketing of £38.7m against ~£39.5m of new-customer revenue **[D]** | Sell to the company. One signature buys a roster that regenerates occasions forever | **Built.** Roster import, 50 staff and 10 clients in the demo. Commercially unproven, no customer has paid |
| 3 | 533 of 676 staff outside operations **[V]** | No catalogue, no editor, no merchandising, no marketing department. Artwork generated per brand | **Built.** Templated layouts from company colours, no catalogue exists |
| 4 | The customer does ~7 minutes of unpaid work per card **[E]**, about 4.2m hours a year **[D]** | One tap to approve, or nothing at all | **Built.** Weekly digest, one-line edit, auto-approval |
| 5 | Shipping cost grew 9.4% against 6.5% revenue growth; >40% of card-only orders pay for tracked delivery **[V]** | Draft ten days ahead so economy post always arrives in time | **Built.** Ten-day lead, five-day dispatch, economy post assumed in costs |
| 6 | Same-day printing exists to serve panic buying caused by the failed reminder | Treat print as a supplier, never own a factory | **Built.** Stannp request payload and print-ready PDF with bleed and crop marks |
| 7 | Thousands of catalogue designs, licensing and merchandising to guess what the customer wants | Generate per person, per occasion, per brand | **Built.** Drafting layer with wording checks and an eval script |
| 8 | Growth is average order value, up 5.7%, while frequency fell to 2.92 **[V]** | Growth is new rosters plus expansion inside the account | **Partly.** Client rows exist in the demo roster. The client product is not built |
| 9 | Moonpig for Business is a spreadsheet uploader at £3.60 a card, absent from the annual report **[V]** | This is our entire product, not a side channel | **Built.** The whole application |
| 10 | Business channel already 39% below the consumer price, so improving it cannibalises **[V]** | We have no consumer channel to protect | Structural. Nothing to build |
| 11 | Plus discounts 30% to buy loyalty they should get free from the reminder data **[V]** | Retention is structural. The roster refills itself as people join and leave | Structural, expressed in per-seat pricing |
| 12 | Reusing payroll date of birth for celebrations has no lawful basis on its own | Ask each employee once. Consent is a product feature | **Built.** Consent gate, held cards where no home address is permitted, on-leave flag |
| 13 | Nobody automates the farewell collection, the highest-consent occasion **[V]** | Fire it from the roster the moment someone resigns | **Built.** Leaver and milestone collections, team-scoped, contributions and group signing |

## 4. What was built today

A working system, not a mock. Verified in the repository:

- **Rolling occasion engine** on a simulated clock. Progresses print jobs, drafts everything due in ten days, dispatches at five days with auto-approval.
- **Roster import** with staff and client rows, consent flags, delivery preference, leave status and per-person notes.
- **Drafting layer** producing per-person copy in the company's voice with the correct signer, plus wording checks and a ten-case evaluation script.
- **Card rendering** to a 303 by 216mm print PDF with bleed and crop marks, and the exact Stannp request payload.
- **Collections** on leaver, retirement, wedding, new baby and milestone occasions, scoped to the immediate team, with contributions, group signing and recipient gift choice.
- **Consent gate** blocking any occasion the employee has not agreed to.
- **Dashboard** carrying the economics against Moonpig's real figures.
- **Headless smoke test** running the entire loop and a simulated year without an API key.

**Not built, and honestly out of scope for one day:** live HR and CRM connectors, real payment handling, gift supplier fulfilment, employee personal accounts and the card allowance, authentication, billing, multi-tenancy.

## 5. The product

Connect the roster once. The calendar builds itself from birthdays, work anniversaries with tenure milestones, welcomes, leavers and client dates. Cards draft themselves in the company's voice, signed by the right manager. A weekly digest is the only human touch, and ignoring it still produces the right outcome. Collections fire on the occasions people actually give for: 78% of people contribute for a leaver, 22% for a routine birthday. **[V]**

## 6. Unit economics

Card cost verified at £1.39 all-in via Docmail, A5 card in a C5 envelope with economy post, and £1.15 via Stannp. **[V]**

**Account A, staff roster, 200 employees**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| 200 seats at £30/yr, all occasions plus six personal cards each | £6,000 | £1,343 | £4,657 |
| 37 collections, £145 average pot, 11% blended take **[E]** | £597 | £0 | £597 |
| **Total** | **£6,597** | £1,343 | **£5,254, 80%** |

**Account B, the same firm with 2,000 client contacts**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| Platform, 2,000 contacts at £0.50/yr | £1,000 | £100 | £900 |
| 2,000 cards at £3.60 | £7,200 | £2,780 | £4,420 |
| 200 client gifts at £50, 25% margin **[E]** | £2,500 | £0 | £2,500 |
| **Total** | **£10,700** | £2,880 | **£7,820, 73%** |

Fully expanded account: **£17,297 revenue, £13,074 gross profit.**

**On price.** £30 per employee per year sits inside a benefits budget, where Reward Gateway charges £72 to £96 and entry-level UK perks platforms start near £36. **[V]** Six personal cards cost us £8.34 and cost £35.34 at Moonpig's consumer counter. **[V]** The employer pays £30 and the employee personally receives £35 of value before the company's own occasions are counted. Moonpig cannot match that without undercutting its own consumer price.

## 7. Growth

### Week one

| | |
|---|---|
| Contract Docmail as the production print supplier, Stannp as the fallback | Removes the only external dependency |
| Replace faked contributions with Stripe Connect | Holding funds directly is regulated e-money activity |
| Ten design-partner firms onboarded free | The roster data is worth more than the revenue at this stage |
| One named warm introduction converted to a signed pilot | The operator's job, not the machine's |

### Days 1 to 30

Build the two connectors that remove the CSV: BambooHR and HiBob cover a large share of UK firms of this size. Ship the employee consent and personal-account flow, which is both the lawful basis for birthdays and the start of the consumer bridge. Get ten pilots live and instrument the one metric that matters, the share of drafts approved without edit.

**Gate to the next block:** approve-without-edit above 70% and at least five pilots asking to pay.

### Days 31 to 60

Convert pilots to paid and open the client-roster product, which is where account values multiply. Sign gift supplier terms so collections buy a real product rather than handing over a gift card, since the fee on a bare pot has been competed down to between 1% and 3%. **[V]** Add the first CRM connector.

**Gate:** 30 paying accounts and at least a quarter of them expanded to client rosters.

### Days 61 to 90

Scale the motion that works. A second print supplier for redundancy. Slack and Teams approval so the digest lives where managers already are. Begin the employee card allowance, which turns every roster into consumer accounts at no acquisition cost.

**Target at 90 days: £1m ARR**, matching the Telemachus first-unit bar. That needs roughly 150 accounts at £6.6k, or a mix of 100 staff accounts and 25 client-roster accounts. **[D]**

**Three things must be true for that number.** Onboarding stays under ten minutes, so the operator sells rather than implements. The approve-without-edit rate stays high enough that nobody needs to supervise it. And the client roster attaches to at least a quarter of accounts, because staff-only accounts alone do not clear the bar.

### Year one

| Route | Account value | Accounts for £3.1m |
|---|---|---|
| Fully expanded | £17.3k | ~180 |
| Staff only | £6.6k | ~470 |
| Blended, land then expand half | ~£11k | ~280 |

£3.1m of recurring revenue is four people at more than $1m each. Year one targets 300 accounts at an average of £7k, with expansion carrying year two past the bar.

**The upside, which is not the plan.** A 200-person firm runs about 37 collections a year with roughly 12 contributors each. **[V]** At 300 accounts that is around 36,000 employees a year putting a card into our checkout at no marginal cost. Google's People API returns contact birthdays under one OAuth consent on a web page **[V]**, so the personal calendar comes with them. This is the only route into Moonpig's £373m consumer pool without an advertising budget. Model it as optionality, never rely on it.

## 8. What the machine does and what the operator does

**Machine:** roster sync, occasion calendar, copy and design generation, approval digest, print orchestration, address validation, collection pages, gift sourcing, billing, support triage.

**Operator:** the first twenty customer relationships, the print supplier contract, corporate etiquette that exists nowhere online such as bereavement, parental leave and religious observance, and the politics of who may sign for whom.

## 9. Competition

| Player | Gap |
|---|---|
| Moonpig for Business, £3.60 a card **[V]** | Spreadsheet upload and 90-day scheduling. No API, no integration, no drafting, no collections |
| Thankbox, UK **[V]** | Digital cards and pots with some HR provisioning. One-off creation, no physical automation |
| Reachdesk, Sendoso, $15k+/yr **[V]** | Real HR triggers, but gifts at enterprise prices for enterprise buyers |
| Cardly, ~£2.05 UK-printed **[V]** | The customer builds their own automation and writes every message |
| Print.one Moments, Netherlands **[V]** | Closest full stack. Dutch connectors, templated copy, no approval step |
| Collection Pot, Givetastic, GiftRound **[V]** | Pots at 0% to 4.5%, manually created, no roster trigger |

No UK product combines native roster sync, AI-drafted copy, an approval digest, UK print and post, staff and client occasions in one system, and automated collections.

## 10. Risks and kill criteria

| Risk | Mitigation | Kill signal |
|---|---|---|
| Moonpig ships an HR integration | Channel conflict makes it costly for them | They launch one within six months |
| AI copy is not good enough | Approval digest and wording checks | Approve-without-edit below 60% at month three |
| Collections read as social pressure | High-consent occasions only, team-scoped, suggested amount, amounts hidden | Leaver participation below 50% |
| Date of birth reuse breaches purpose limitation | Consent gate, opt-out honoured | A customer's legal team blocks rollout |
| Holding contributions is regulated | Stripe Connect, never hold funds | No compliant provider at acceptable cost |
| Print supplier concentration | Two suppliers live by day 90 | Either fails on quality at volume |
| Account values stay small | Client roster and gift attach | Expansion below 30% by month nine |
| Sales slower than the wedge implies | Ten-minute onboarding, first month free | Acquisition cost above £2,000 or cycle beyond six weeks |

## 11. Capital and team

Four people: one operator selling and holding relationships, two engineers, one generalist covering supply, support and finance. Working capital is light. Cards are paid for before they are printed, and collections settle before they are spent.

---

## Sources

Moonpig Group plc FY26 Annual Report and Final Results RNS, 25 June and 10 July 2026, via moonpig.group and Investegate. Moonpig for Business pricing, moonpig.com/uk/business/pricing. Stannp pricing, stannp.com/uk/detailed-pricing. Docmail price list, cfhdocmail.com. Royal Mail Business Price Guide, April 2026. instantprint workplace collections survey, 2023, n=1,000. Collection Pot platform data via HR News. Thankbox, Collection Pot, Givetastic and GiftRound pricing pages. Reward Gateway and Perkbox pricing via GetApp UK and ITQlick. CIPD Reward Survey 2026. Google People API reference. Apple WWDC24 session 10121. Telemachus thesis from careers.telemachus.io and jobs.ashbyhq.com/telemachus.

The full inefficiency teardown with workings is in `docs/INEFFICIENCY.md`.

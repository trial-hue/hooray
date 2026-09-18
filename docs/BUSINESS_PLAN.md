# Hooray

### Business unit plan: occasion cards for companies, then for everyone

*Telemachus trial day, 18 September 2026. **[V]** verified from the sources at the end. **[D]** derived by arithmetic from verified figures. **[E]** estimate, needs testing.*

---

## 1. The target

Moonpig Group plc, year to 30 April 2026. **[V]**

| | |
|---|---|
| Revenue | £373.0m, of which Moonpig UK £284.5m |
| Gross margin | 58.4% |
| Adjusted EBITDA | £104.6m at 28.0% |
| Profit after tax | £51.7m |
| Free cash flow | £73.5m |
| Marketing | £38.7m, 10.4% of revenue |
| Active customers | 12.3m, ordering 2.92 times a year at £9.32 |
| Occasion reminders held | 113m |
| Average employees | 676, of which 143 in operations |
| Revenue per employee **[D]** | £552k |

Comfortably past the Telemachus threshold of more than $10m annual net profit. Half the revenue-per-employee bar. No serious challenger in the category. And the profit is consumer profit, which is where this plan has to end up.

## 2. The thesis in one line

Moonpig holds 113 million occasion reminders and converts about 13% of them, because a reminder hands the work to the customer. We do the work first and ask for approval second. We enter through companies, where acquisition costs a signature rather than £38.7m a year, and we reach consumers through the people who work there.

## 3. Three phases, one loop

The loop never changes: know an occasion, draft the card before anyone asks, approve in one tap, print and post, repeat next year. What changes is who pays and how they arrived.

| Phase | Who pays | How they arrive | What it proves |
|---|---|---|---|
| 1 · Companies | The employer, per seat | An operator's signature | The loop runs unattended and the drafting is good enough |
| 2 · Employees | The employer, then the employee | The consent email, the collection page, the card allowance | Consumers at zero acquisition cost, and the reminder calendar comes with them |
| 3 · Everyone | The consumer | The received card, referral, calendar import | The consumer product grows on its own loops without a marketing line |

Phase 1 is the business for the first year. Phase 2 starts in month two and is the bridge. Phase 3 is the destination, because that is where the £373m is, and the plan says how to get there without buying customers.

## 4. The attack

Each row is a measured inefficiency at the incumbent, the structural change that removes it, and whether today's build proves it.

| # | The inefficiency | Our structural attack | In the MVP today |
|---|---|---|---|
| 1 | 87% of reminders produce no order. 113m held, ~14.4m orders caused **[D]** | Draft first, approve second. Anything untouched at dispatch goes anyway | **Built.** Rolling engine drafts at T-10, dispatches at T-5, auto-approves |
| 2 | Marketing of £38.7m against ~£39.5m of new-customer revenue **[D]** | Acquire consumers through the employer, not through advertising | **Partly.** Roster import built. The employee account is not, and it is now on the critical path |
| 3 | 533 of 676 staff outside operations **[V]** | No catalogue, no editor, no merchandising, no marketing department | **Built.** Templated layouts from brand colours, no catalogue exists |
| 4 | The customer does ~7 minutes of unpaid work per card **[E]** | One tap, or nothing at all | **Built.** Weekly digest, one-line edit, auto-approval |
| 5 | Shipping cost grew 9.4% against 6.5% revenue; >40% of card-only orders pay for tracked delivery **[V]** | Draft ten days ahead so economy post always arrives in time | **Built.** Ten-day lead, five-day dispatch |
| 6 | Same-day printing exists to serve panic buying caused by the failed reminder | Treat print as a supplier, never own a factory | **Built.** Real print request and print-ready PDF |
| 7 | Reminders accumulated one at a time since 2011 | Import the calendar in one consent | **Not built.** Google People API returns contact birthdays under one OAuth scope **[V]** |
| 8 | Plus discounts 30% to buy loyalty the reminder data should deliver free **[V]** | A subscription that sends the cards, rather than one that discounts them | **Not built.** Consumer pricing is designed, not tested |
| 9 | Business channel 39% below consumer price, so improving it cannibalises **[V]** | We have no legacy channel to protect | Structural |
| 10 | Nobody automates the farewell collection, the highest-consent occasion **[V]** | Fire it from the roster the moment someone resigns | **Built.** Team-scoped collections with contributions and group signing |
| 11 | Reusing payroll date of birth for celebrations has no lawful basis alone | Ask each employee once. The consent email is also the consumer signup | **Built** as a gate. **Not built** as a signup |

## 5. The products

### 5a. Hooray for companies

Connect the roster once. The calendar builds itself from birthdays, work anniversaries with tenure milestones, welcomes, leavers and client dates. Cards draft themselves in the company's voice, signed by the right manager. A weekly digest is the only human touch, and ignoring it still produces the right outcome. Collections open on the occasions people actually give for: 78% contribute for a leaver, 22% for a routine birthday. **[V]**

Priced at £30 per employee per year, all occasions included, plus six personal cards for each employee's own family. That allowance is the bridge to 5b.

### 5b. Hooray for people

The same loop for your own life. Sign in with Google and the birthdays in your contacts become your calendar in one consent. Ten days before each one, the card exists: a design, a message drafted from what you have told us about the person, their address if we have it. One tap sends it. Nothing to browse, nothing to type, nothing to remember.

Against Moonpig, the difference is the order of operations. They send a reminder and wait. We send a finished card and wait. That is the whole product, and it is the difference between 13% conversion and whatever the seeded cohort turns out to convert at.

**Pricing, designed not tested. [E]**

| Tier | Price | What it covers |
|---|---|---|
| Per card | £5.49 including post | Matches Moonpig's £5.89 within a few pence |
| Subscription | £4.99 a month | Up to twelve cards a year, sent automatically, gifts at cost plus margin |

The subscription is positioned as insurance against forgetting, not as a discount. Moonpig Plus proves consumers will pay £10.99 a year for a card subscription; 1.2m of them do, and they place 23% of UK orders. **[V]** Ours sends the cards rather than discounting them.

**What the consumer product deliberately does not do.** Same-day rescue. If someone has forgotten and it is today, Moonpig's factory wins and we should not fight it. Our customer is the one who wants never to be in that position.

## 6. Unit economics

Card cost verified at £1.39 all-in via Docmail. **[V]**

**Company account A, staff roster, 200 employees**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| 200 seats at £30/yr | £6,000 | £1,343 | £4,657 |
| 37 collections, £145 average pot, 11% blended take **[E]** | £597 | £0 | £597 |
| **Total** | **£6,597** | £1,343 | **£5,254, 80%** |

**Company account B, the same firm with 2,000 client contacts**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| Platform, cards and client gifts | £10,700 | £2,880 | £7,820, 73% |

Fully expanded company account: **£17,297 revenue, £13,074 gross profit.**

**Consumer account, annual [E]**

| Type | Revenue | Cost | Gross profit |
|---|---|---|---|
| Subscriber, eight cards used | £59.88 | £11.12 | £48.76, 81% |
| Pay-per-card, 3.5 cards a year | £19.22 | £4.87 | £14.35, 75% |
| Blended at 10% subscribers | £23.28 | £5.49 | £17.79 |

For comparison, a Moonpig customer produces £27.22 of revenue a year and about £15.90 of gross profit, from which roughly £3.15 of marketing per active customer is spent to keep them. **[D]** Our blended consumer account is worth about the same before marketing and carries no marketing cost, because it arrived through an employer.

The 3.5 cards a year assumes proactive drafting lifts conversion above Moonpig's 2.92 orders. It is the number the seeded cohort will test first.

## 7. The path to scale

### Phase 1 · Companies, months 1 to 12

Four people above $1m each is roughly £3.1m of recurring revenue.

| Route | Account value | Accounts for £3.1m |
|---|---|---|
| Fully expanded | £17.3k | ~180 |
| Staff only | £6.6k | ~470 |
| Blended, land then expand half | ~£11k | ~280 |

Year one target: 300 accounts at an average of £7k, **£2.1m ARR**, with expansion into client rosters carrying year two past the bar.

### Phase 2 · Employees, months 2 to 24

Every signed company puts its staff in front of the product three ways. The consent email that the law requires. The collection page, which about 120 distinct employees in a 200-person firm touch each year. **[V]** And the card allowance, which is a benefit rather than a request.

| | Year one | Year two |
|---|---|---|
| Company accounts | 300 | 500 |
| Employees with a Hooray account **[E]** | 60,000 | 100,000 |
| Active as consumers, at 30% **[E]** | 18,000 | 30,000 |
| Consumer gross profit at £17.79 each **[D]** | £320k | £534k |
| Marketing spent to acquire them | £0 | £0 |

Small against the company revenue in year one. The point is not the revenue. It is that by the end of year two the unit holds 30,000 consumer accounts whose behaviour it can measure, acquired for nothing, before it has spent a pound on advertising.

### Phase 3 · Everyone, year two onwards

Three loops that do not need a marketing budget.

**The received card.** Every card arrives at a home with a small mark on the back. Moonpig does this too, but pays to acquire the sender. At 100,000 company and consumer cards a year and a 1.5% recipient conversion **[E]**, that is 1,500 new accounts a year that compound as volume grows.

**The calendar import.** A new consumer's reminders are seeded in one consent rather than typed in over years. It turns a sign-up into a customer with nine known occasions on day one.

**Referral.** Send a card, the recipient's first is free. Standard, and it works because the product is already in their hands.

Paid acquisition begins only when the seeded cohort has shown a lifetime value that a campaign can be priced against. That is the discipline that keeps this unit from becoming a second Moonpig with a smaller brand.

**Where it ends up. [E]** If the seeded cohort behaves like Moonpig's customers, consumer gross profit reaches about £1m by year three on the employer channel alone. If proactive drafting lifts conversion the way the thesis says it should, and the three loops add a further 20,000 accounts a year, the consumer line passes the company line in year four. Neither is promised. Both are measurable from month two.

## 8. Ninety days

| Block | Build | Gate |
|---|---|---|
| Days 1 to 30 | BambooHR and HiBob connectors. The consent email as the consumer signup. Ten free pilots | Approve-without-edit above 70%, five pilots asking to pay |
| Days 31 to 60 | Convert pilots to paid. Client-roster product. Gift supplier terms. Google calendar import live for employees | 30 paying accounts, a quarter expanded, first 2,000 employee accounts |
| Days 61 to 90 | Second print supplier. Slack and Teams approval. The card allowance switched on | £1m ARR, first consumer subscription taken |

**Week one, before any of it.** Contract Docmail. Stripe Connect under collections. One named pilot from the operator's own network.

The one change from the earlier plan: the employee account moves from "not built" to the first thirty days, because it is no longer an option, it is the bridge.

## 9. What the machine does and what the operator does

**Machine:** roster sync, occasion calendar, copy and design generation, approval digest, print orchestration, address validation, collection pages, calendar import, consumer notifications, gift sourcing, billing, support triage.

**Operator:** the first twenty company relationships, the print supplier contract, corporate etiquette that exists nowhere online, the politics of who may sign for whom, and the judgement about when the consumer cohort is ready for paid acquisition.

## 10. Competition

| Player | Gap |
|---|---|
| Moonpig for Business, £3.60 a card **[V]** | Spreadsheet upload and 90-day scheduling. No integration, no drafting, no collections |
| Moonpig consumer, £5.89 all-in **[V]** | Sends a reminder and waits. 87% of the time nothing happens |
| Moonpig Plus, £10.99/yr **[V]** | Discounts the card. Does not send it |
| Thankbox, UK **[V]** | Digital pots with some HR provisioning. No physical automation |
| Reachdesk, Sendoso, $15k+/yr **[V]** | HR triggers for gifts at enterprise prices |
| Print.one Moments, Netherlands **[V]** | Closest B2B full stack. Dutch connectors, no approval step |

No product on either side of the market drafts the card before being asked. That is the gap, and it is the same gap for a company and for a person.

## 11. Risks and kill criteria

| Risk | Mitigation | Kill signal |
|---|---|---|
| AI copy is not good enough | Approval digest, wording checks | Approve-without-edit below 60% at month three |
| Employees do not activate as consumers | The allowance is a benefit, not a request. Separate data controller, employer never sees it | Activation below 15% at month six |
| Consumers do not send more cards than at Moonpig | Proactive drafting, calendar import | Cards per consumer account below 2.5 at month twelve |
| The received-card loop does not convert | Referral and import carry it | Recipient conversion below 0.5% |
| Moonpig ships an HR integration | Channel conflict makes it costly for them | Within six months |
| Collections read as social pressure | High-consent occasions only, team-scoped, amounts hidden | Leaver participation below 50% |
| Paid acquisition is started too early | Started only against measured cohort LTV | Any paid spend before month twelve |
| Account values stay staff-only | Client roster and gift attach | Expansion below 30% by month nine |

## 12. Capital and team

Four people through phase one. A fifth, on consumer growth, when phase two has 10,000 active accounts to work with. Working capital is light: cards are paid for before they are printed and collections settle before they are spent. The consumer product adds no fixed cost, since it is the same engine with a different customer at the front.

---

## Sources

Moonpig Group plc FY26 Annual Report and Final Results RNS, 25 June and 10 July 2026, via moonpig.group and Investegate. Moonpig for Business pricing and Moonpig Plus FAQ, moonpig.com. Stannp and Docmail price lists. instantprint workplace collections survey, 2023. Collection Pot platform data via HR News. Reward Gateway pricing via GetApp UK. Google People API reference. Telemachus thesis from careers.telemachus.io and jobs.ashbyhq.com/telemachus.

Full inefficiency teardown with workings in `docs/INEFFICIENCY.md`. Presentation prep in `docs/QA_PREP.md`.

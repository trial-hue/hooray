# Hooray

### Business unit plan: occasion cards for companies, then for everyone

*Telemachus trial day, 18 September 2026, revised 14:30. **[V]** verified from Moonpig's FY26 annual report, directly or via the 16 September reference dossier. **[D]** derived by arithmetic from verified figures. **[E]** estimate, needs testing. **[A]** from the 16 September reference build's report, a model rather than a measurement.*

---

## 1. The target

Moonpig Group plc, year to 30 April 2026. **[V]**

| | |
|---|---|
| Revenue | £373.0m, of which Moonpig UK £284.5m |
| Gross margin, group | 58.4% |
| Gross margin, Moonpig segment | 55.9% |
| Gross margin, physical cards and gifts, Moonpig plus Greetz **[D]** | ~54.5% |
| Adjusted EBITDA | £104.6m at 28.0% |
| Profit after tax | £51.7m |
| Shipping and logistics | £88.2m, 23.6% of revenue |
| Marketing | £38.7m, 10.4% of revenue |
| Attached gifting | £123m, against £8m standalone |
| Active customers | 12.3m, ordering 2.92 times a year at £9.32 |
| Occasion reminders held | 113m |
| Average employees | 676, of which 143 in operations |
| Revenue per employee **[D]** | £552k |

The group margin blends in the Experiences agency business at 93.8%. **[V]** The right comparison for a physical card operation is the Moonpig segment at 55.9%, or the derived 54.5% for all physical revenue. This plan compares against 55.9% throughout and says so.

Comfortably past the Telemachus threshold of more than $10m annual net profit. Half the revenue-per-employee bar. No serious challenger in the category. The profit is consumer profit, which is where this plan has to end up.

## 2. The thesis in one line

Moonpig sells at the reminder. We sell at the contract. They hold 113 million occasions and convert about 13%, because a reminder hands the work to the customer at a bad moment. We draft the card first and ask for approval second. We enter through companies, where acquisition costs a signature rather than £38.7m a year, and reach consumers through the people who work there.

## 3. Three phases, one loop

| Phase | Who pays | How they arrive | What it proves |
|---|---|---|---|
| 1 · Companies | The employer, per seat | An operator's signature | The loop runs unattended and the drafting is good enough |
| 2 · Employees | The employer, then the employee | The consent email, the collection page, the card allowance | Consumers at zero acquisition cost, with the reminder calendar attached |
| 3 · Everyone | The consumer | The received card, referral, calendar import | The consumer product grows on its own loops without a marketing line |

Phase 1 is the business for the first year. Phase 2 starts in month two. Phase 3 is the destination, and section 7 says why it cannot be reached any other way.

## 4. The attack

Each row is a measured inefficiency at the incumbent, the structural change that removes it, and whether today's build proves it.

| # | The inefficiency | Our structural attack | In the MVP today |
|---|---|---|---|
| 1 | 87% of reminders produce no order. 113m held, ~14.4m orders caused **[D]** | Draft first, approve second. Anything untouched at dispatch goes anyway | **Built.** Rolling engine drafts at T-10, dispatches at T-5, auto-approves |
| 2 | They capture 18% of their own customers' card occasions: 3.5 cards a year against ~19 bought. Management now frames the opportunity as frequency, not penetration **[V]** | The roster supplies every occasion up front. Frequency is not a marketing problem, it is a data problem we do not have | **Built.** Occasion calendar from the roster |
| 3 | Marketing of £38.7m against ~£39.5m of new-customer revenue **[D]** | Acquire consumers through the employer, not through advertising | **Partly.** Roster import built. The employee account is on the critical path |
| 4 | 533 of 676 staff outside operations **[V]** | No catalogue, no editor, no merchandising, no marketing department | **Built.** Templated layouts from brand colours, no catalogue |
| 5 | Shipping is 23.6% of revenue, larger than the cost of inventories at 14.5% and larger than marketing and platform fees combined. It grew 9.4% against 6.5% revenue growth and drove the 1.2-point margin decline **[V]** | Draft ten days ahead, post economy. Our £1.39 is all-in, postage included | **Built.** Ten-day lead, five-day dispatch, economy post |
| 6 | Same-day printing exists to serve panic buying caused by the failed reminder | Treat print as a supplier, never own a factory | **Built.** Real print request and print-ready PDF |
| 7 | Gifts are 45% of Moonpig-brand revenue, yet only 17.9% of orders attach one, at ~£19 each **[V]** | Collections are the attach mechanism. The pot buys a sourced gift; the client roster buys a £50 one | **Built** for pots. **Not built** for sourcing |
| 8 | Their own words: generative AI commoditises design, so the moat migrates to manufacturing, fulfilment and first-party data **[V]** | Agreed on design. On fulfilment, £1.39 all-in says it has migrated to a price list. On data, a roster is first-party data we get in one signature | Structural |
| 9 | Reminders accumulated one at a time since 2011 | Import the calendar in one consent. Google's People API returns contact birthdays under one OAuth scope **[V]** | **Not built** |
| 10 | Plus discounts 30% to buy loyalty the data should deliver free **[V]** | A subscription that sends the cards rather than discounting them | **Not built.** Consumer pricing designed, not tested |
| 11 | Business channel 39% below consumer price, so improving it cannibalises **[V]** | No legacy channel to protect | Structural |
| 12 | Group cards exist: up to 50 contributors, manually created, shared by link. No pot, no roster trigger, no team scoping, no gift choice **[V]** | The collection opens itself the day someone resigns, for their team, with a pot, and the recipient chooses | **Built** |
| 13 | Reusing payroll date of birth for celebrations has no lawful basis alone | Ask each employee once. The consent email is also the consumer signup | **Built** as a gate. **Not built** as a signup |

## 5. The products

### 5a. Hooray for companies

Connect the roster once. The calendar builds itself. Cards draft themselves in the company's voice, signed by the right manager. A weekly digest is the only human touch, and ignoring it still produces the right outcome.

**The job the product does is to demonstrate effort without expending it.** The firm wants to look like it cares without anyone spending an hour. Auto-approval at dispatch is that promise in code.

**Quality is observable here, and nowhere else in the market.** A consumer card is send-and-forget; the sender never sees it land, so brand stands in for quality. Our recipient is a colleague three desks away. The card is seen, discussed and fed back the same day. No consumer player has that loop, and it is why approve-without-edit is a real signal rather than a proxy.

Collections open on the occasions people actually give for: 78% contribute for a leaver, 22% for a routine birthday. **[V]** They are scoped to the immediate team, contributions are private, and the recipient picks a gift when the pot closes. That last step is the attach mechanism, and the reason the pot matters more than its fee.

Priced at £30 per employee per year, all occasions included, plus six personal cards for each employee's own family. That allowance is the bridge to 5b.

### 5b. Hooray for people

The same loop for your own life. Sign in with Google and the birthdays in your contacts become your calendar in one consent. Ten days before each one, the card exists. One tap sends it.

Against Moonpig the difference is the order of operations. They send a reminder and wait. We send a finished card and wait.

| Tier **[E]** | Price | What it covers |
|---|---|---|
| Per card | £5.49 including post | Matches Moonpig's £5.89 within a few pence |
| Subscription | £4.99 a month | Up to twelve cards a year, sent automatically, gifts at cost plus margin |

Moonpig Plus proves consumers pay £10.99 a year for a card subscription; 1.2m do, placing 23% of UK orders. **[V]** Ours sends the cards rather than discounting them.

**What the consumer product deliberately does not do.** Same-day rescue. If someone has forgotten and it is today, Moonpig's factory wins. Our customer is the one who never wants to be in that position again.

## 6. Unit economics

Card cost verified at £1.39 all-in via Docmail, A5 card in a C5 envelope, economy post included. **[V]** Against Moonpig's own numbers, shipping alone is about £2.45 per order. **[D]** The comparison is not print against print. It is a price list against a logistics operation that is eating their margin.

**Company account A, staff roster, 200 employees**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| 200 seats at £30/yr | £6,000 | £1,343 | £4,657 |
| 37 collections, £145 average pot, 11% blended take **[E]** | £597 | £0 | £597 |
| **Total** | **£6,597** | £1,343 | **£5,254, 80%** |
| Gift value under management **[E]** | £5,365 | | the funnel and the catalogue position |

**Company account B, the same firm with 2,000 client contacts**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| Platform, 2,000 cards, 200 client gifts at £50 | £10,700 | £2,880 | £7,820, 73% |
| Gift value under management **[E]** | £10,000 | | |

Fully expanded company account: **£17,297 revenue, £13,074 gross profit, £15,365 of gift value under management.**

Gift value under management is a headline metric, not a footnote. At Moonpig, gifts are 45% of brand revenue on an 18% attach rate. Ours attaches through a mechanism the recipient wants, at a moment colleagues have already committed money to. The take on it is thin today because the sourcing is not built. When it is, that line is where the account value moves.

**Consumer account, annual [E]**

| Type | Revenue | Cost | Gross profit |
|---|---|---|---|
| Subscriber, eight cards used | £59.88 | £11.12 | £48.76, 81% |
| Pay-per-card, 3.5 cards a year | £19.22 | £4.87 | £14.35, 75% |
| Blended at 10% subscribers | £23.28 | £5.49 | £17.79 |

A Moonpig customer produces £27.22 of revenue a year and about £15.22 of gross profit at the segment margin, from which roughly £3.15 of marketing per active customer is spent to keep them. **[D]** Our blended consumer account is worth about the same before marketing and carries no marketing cost, because it arrived through an employer. The advantage is not a richer customer. It is a free one.

## 7. The path to scale

### Phase 1 · Companies, months 1 to 12

| Route | Account value | Accounts for £3.1m |
|---|---|---|
| Fully expanded | £17.3k | ~180 |
| Staff only | £6.6k | ~470 |
| Blended, land then expand half | ~£11k | ~280 |

Year one target: 300 accounts at an average of £7k, **£2.1m ARR**, with expansion into client rosters carrying year two past £3.1m, which is four people above $1m each.

### Phase 2 · Employees, months 2 to 24

| | Year one | Year two |
|---|---|---|
| Company accounts | 300 | 500 |
| Employees with a Hooray account **[E]** | 60,000 | 100,000 |
| Active as consumers, at 30% **[E]** | 18,000 | 30,000 |
| Consumer gross profit at £17.79 each **[D]** | £320k | £534k |
| Marketing spent to acquire them | £0 | £0 |

By the end of year two the unit holds 30,000 consumer accounts whose behaviour it can measure, before it has spent a pound on advertising.

### Phase 3 · Everyone, year two onwards

**Why not go straight to consumers.** The reference build on 16 September modelled exactly that: an £8 a month subscription with unlimited cards to a circle of fifteen. Paid-social acquisition came out at £45 a customer, with a range of £35 to £60, and payback at nine to ten months on one card a month, which is longer than a monthly subscriber typically lasts. Its conclusion was that paid social on its own does not work. **[A]** A second first-principles memo reached the same open question and left it as a hypothesis. The roster route has no marginal acquisition cost. That is not a preference, it is the only route that closes.

Three loops that do not need a marketing budget. The received card, with a small mark on the back; at 100,000 cards a year and 1.5% recipient conversion **[E]** that is 1,500 accounts a year, compounding with volume. The calendar import, which turns a sign-up into a customer with nine known occasions on day one. Referral, where the recipient's first card is free.

Paid acquisition begins only when the seeded cohort has shown a lifetime value a campaign can be priced against.

## 8. Ninety days

| Block | Build | Gate |
|---|---|---|
| Days 1 to 30 | BambooHR and HiBob connectors. The consent email as the consumer signup. Ten free pilots. **Named, not built:** preference learning from edits | Approve-without-edit above 70%, five pilots asking to pay |
| Days 31 to 60 | Convert pilots to paid. Client-roster product. Gift sourcing so pots buy a real product. Google calendar import for employees | 30 paying accounts, a quarter expanded, first 2,000 employee accounts |
| Days 61 to 90 | Second print supplier. Slack and Teams approval. The card allowance switched on | £1m ARR, first consumer subscription taken |

**Week one, before any of it.** Contract Docmail. Stripe Connect under collections. One named pilot from the operator's own network.

**Preference learning from edits.** When an approver edits a line, extract the durable preference, scope it to the company or the person, and feed it into the next draft. In B2B it compounds: one office manager's edits teach the whole firm's voice. It is the one feature from the reference build worth keeping, and it is named here so nobody builds it before the approve-without-edit baseline exists to measure it against.

## 9. Hypotheses

| Hypothesis | Status | Evidence |
|---|---|---|
| Produce and deliver a card at £3 or less, all-in | **Confirmed** | £1.39 via Docmail, A5 in C5, economy post **[V]** |
| A personalisation system for under £10k | **Confirmed** | Built today. Drafting with fifteen deterministic checks, cached, AI cost per card measured in the app |
| Repeat business depends on the trigger | **Not applicable** | The roster is the trigger. The seat is paid regardless |
| Consumer acquisition cost is viable through paid channels | **Falsified** | £45 CAC, nine to ten month payback, longer than subscriber life **[A]** |
| Employee consent uptake of 80% or more | Open | Falsified if a design partner's legal team blocks rollout or uptake is below 50% |
| Leaver collection participation of 50% or more | Open | Survey says 78% will give **[V]**. Measure in beta |
| Sales cycle of six weeks or less, acquisition cost of £2,000 or less | Open | Ten design partners, month one |
| Approve-without-edit of 60% or more by month three | Open, early signal today | On the dashboard. Real drafts now live |
| Employees activate as consumers at 30% | Open | Falsified below 15% at month six |
| Consumers send more cards than at Moonpig | Open | Falsified below 2.5 a year at month twelve |

## 10. What the machine does and what the operator does

**Machine:** roster sync, occasion calendar, copy and design generation, approval digest, print orchestration, address validation, collection pages, gift sourcing, calendar import, consumer notifications, billing, support triage.

**Operator:** the first twenty company relationships, the print supplier contract, corporate etiquette that exists nowhere online, the politics of who may sign for whom, and the judgement about when the consumer cohort is ready for paid acquisition.

## 11. Competition

| Player | What they have | The gap |
|---|---|---|
| Moonpig for Business, £3.60 a card **[V]** | Spreadsheet upload, 90-day scheduling | No integration, no drafting, no collections |
| Moonpig consumer, £5.89 all-in **[V]** | Brand, factory, 113m reminders | Sends a reminder and waits. 87% of the time nothing happens |
| Moonpig group cards **[V]** | Up to 50 contributors, shared by link, physical or digital | Manually created. No pot, no roster trigger, no team scoping, no gift choice |
| Moonpig Plus, £10.99/yr **[V]** | 1.2m subscribers | Discounts the card. Does not send it |
| Thankbox, UK **[V]** | Digital pots, some HR provisioning | No physical automation |
| Reachdesk, Sendoso, $15k+/yr **[V]** | HR triggers for gifts | Enterprise prices for enterprise buyers |
| Print.one Moments, Netherlands **[V]** | Closest B2B full stack | Dutch connectors, no approval step |

No product on either side of the market drafts the card before being asked. Feature parity with the incumbent's editor is the wrong frame; the reference build copied chat editing, alternates, undo and voice notes and none of it moved the economics. This plan stays on value-chain links, cost structure and headcount.

## 12. Risks and kill criteria

| Risk | Mitigation | Kill signal |
|---|---|---|
| AI copy is not good enough | Approval digest, wording checks, preference learning | Approve-without-edit below 60% at month three |
| Employees do not activate as consumers | The allowance is a benefit, not a request. Separate controller, employer never sees it | Activation below 15% at month six |
| Consumers do not send more than at Moonpig | Proactive drafting, calendar import | Below 2.5 cards a year at month twelve |
| Gift sourcing does not attach | Recipient choice at close, curated range | Sourced-gift conversion below 25% |
| The received-card loop does not convert | Referral and import carry it | Recipient conversion below 0.5% |
| Moonpig ships an HR integration | Channel conflict makes it costly for them | Within six months |
| Collections read as social pressure | High-consent occasions only, team-scoped, amounts hidden | Leaver participation below 50% |
| Paid acquisition started too early | Only against measured cohort lifetime value | Any paid spend before month twelve |
| Account values stay staff-only | Client roster and gift attach | Expansion below 30% by month nine |

## 13. Capital and team

Four people through phase one. A fifth, on consumer growth, when phase two has 10,000 active accounts to work with. Working capital is light: cards are paid for before they are printed and collections settle before they are spent. The consumer product adds no fixed cost, since it is the same engine with a different customer at the front.

---

## Sources

Moonpig Group plc FY26 Annual Report and Final Results RNS, 25 June and 10 July 2026, via moonpig.group and Investegate, read directly. Segment margins, gift attach, occasion capture and the AI posture quotation via the 16 September reference dossier, itself sourced to the same report. The 16 September reference build report for the consumer subscription model and its acquisition-cost result. Moonpig for Business pricing and Moonpig Plus FAQ, moonpig.com. Stannp and Docmail price lists. instantprint workplace collections survey, 2023. Collection Pot platform data via HR News. Reward Gateway pricing via GetApp UK. Google People API reference. Telemachus thesis from careers.telemachus.io and jobs.ashbyhq.com/telemachus.

Full inefficiency teardown with workings in `docs/INEFFICIENCY.md`. Presentation prep in `docs/QA_PREP.md`.

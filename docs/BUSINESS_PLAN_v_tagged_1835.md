# Hooray

### Business unit plan: occasion cards for companies, then for everyone

*Telemachus trial day, 18 September 2026, revised 19:00. **[V]** verified from Moonpig's FY26 annual report, directly or via the 16 September reference dossier, or from a named public source. **[D]** derived by arithmetic from verified figures. **[E]** estimate, needs testing. **[A]** from the 16 September reference build's model. **[C]** from the 6 August filings analysis's derivations.*

---

## Summary

Moonpig makes £51.7m a year converting about 13% of the 113 million occasions it knows about, because a reminder hands the work to the customer. Hooray drafts the card first and asks for approval second. It enters through companies, where one signature acquires hundreds of occasions at once and the cost is an operator's time rather than a marketing budget, and reaches consumers through the people who work there.

**The value proposition.** For £30 per employee per year, every person in the firm is noticed on every occasion without anyone doing anything, and each employee gets six cards a year for their own family. To the firm that is consistency: today the popular get cards and the quiet do not, remote staff get nothing, and the leaving collection is the job everyone dreads. To the employee it is a benefit they will actually use, about £35 of retail value, where perks platforms cost £72 to £96 a head and see single-digit utilisation. At the incumbent's own prices, that is £8,500 of card value for £6,000, before the automation and the collections. It is not cheap cards. It is nobody doing anything, and everyone being noticed.

**The moat.** The list of people and dates. Everything else is replicable. Companies are the door because a signature is the cheapest way to put the consumer product in front of hundreds of people who will build that list, and the headline metric is personal occasions under management, not revenue.

**What was built today.** The whole loop on a simulated clock: roster in, cards drafted, the digest emailed through Brevo (a real one went out this afternoon), the print request to Stannp (API trial approved by phone), collections with group signing and gift choice, company-paid gifts on milestones, a consent gate, and a personal workspace. Not built: hosting, payments, HR connectors, gift fulfilment. Each is named with a ninety-day sequence and a gate.

**The ask.** £850k for twelve months and four people, to reach 300 accounts, £2.1m of recurring revenue and 160,000 personal occasions, contribution-positive by month nine. Gates at thirty, sixty and ninety days, any of which can stop it.

**What I decided.** Consumer to companies. Per card to per seat. Collections only on the occasions people give for. No wishlist. Consumer as the destination with the company channel as the route in. Two other candidates' work informed this plan, and it says where.

---

## 1. The problem

### The incumbent

Moonpig Group plc, year to 30 April 2026. **[V]**

| | |
|---|---|
| Revenue | £373.0m, of which Moonpig UK £284.5m |
| Gross margin, Moonpig segment | 55.9% (group 58.4% blends in an agency business at 93.8%) |
| Adjusted EBITDA | £104.6m at 28.0% |
| Profit after tax | £51.7m |
| Free cash flow; returned to shareholders | £73.5m; about £65m |
| Marketing | £38.7m, 10.4% of revenue |
| Shipping and logistics | £88.2m, 23.6% of revenue, growing 9.4% against 6.5% revenue growth |
| Active customers; orders; average order value | 12.3m; 36.0m; £9.32 |
| Occasion reminders held | 113m |
| Employees | 676, of which 143 in operations |
| Revenue per employee **[D]** | £552k |

Past the Telemachus threshold of more than $10m net profit five times over. Half the revenue-per-employee bar. No serious challenger. And the profit is consumer profit, which is where this plan has to end up.

### What it gets wrong

| Finding | Figure |
|---|---|
| Reminders that produce no order | 87% **[D]**: 9.2 reminders held per customer, 2.92 orders, about 1.2 caused by a reminder. The CEO: "Most customers use Moonpig for only a small proportion of the occasions they celebrate." |
| Share of customers' own card occasions captured | 18% **[V]** |
| Marketing against new-customer revenue | roughly £1 per £1 **[D]** |
| Staff outside the factory | 533 of 676 **[V]** |
| Orders FY22 to FY26; average order value | down 9.5%; up 21% **[V]**. Growth is price, not demand |
| Gifting share of revenue; attach rate | 39%; 17.9%, growing 0.2 points a year **[V]** |
| Group cards | Exist, up to 50 contributors, manual, no pot, no roster trigger **[V]** |

A reminder transfers ten minutes of work to the customer at a bad moment, and nine times in ten nothing happens. Everything downstream, the panic, the tracked delivery now chosen on more than 40% of card-only orders, the same-day factory, exists because that first step failed. The category has not grown on volume in four years, and the incumbent's weaknesses are on the revenue side, frequency and attach, not the cost side.

### Why it won, and why none of it helps it now

Moonpig was founded in June 2000 and printed from Guernsey, where cards under £15 shipped VAT-free until April 2012. Funky Pigeon was building its own Guernsey facility when the relief ended. **[V]**

| What won it | Still available? | What we do instead |
|---|---|---|
| First mover, 2000 | No | Enter through a different door: the employer |
| Twelve years of VAT-free cards from Guernsey | No. Closed by law | Not needed; we do not compete on consumer price |
| Television, the jingle, £38.7m a year | Only to Moonpig, at that price | Acquisition is a signature, not an advert |
| The reminder database, 113m occasions | Only to Moonpig, converting at 13% | Get it from the roster in one signature; convert at 100% by construction |
| Own factories, same-day dispatch | Yes, but only matters at the last minute | Make it irrelevant: the card exists ten days early |
| Gift attach | Yes, at 18% and slow | Collections and milestone policy, where people already commit money |

The window closed by 2012. What still compounds is the list and the brand, and the brand costs £38.7m a year to hold. That is why the moat is shallow now, and why the FY26 annual report adds "agentic AI disintermediation" as a principal risk while the chief executive calls AI "an enabler within our model, rather than a structural change." **[V]** Both cannot be true.

## 2. The solution

**Moonpig sells at the reminder. We sell at the contract.**

### For companies

Connect the roster once. The calendar builds itself from birthdays, work anniversaries with tenure milestones, welcomes, leavers and client dates. Ten days before each, a card exists: drafted in the firm's voice, signed by the right manager. A weekly digest is the only human touch. Anything untouched at five days goes anyway; auto-approval is the feature, not the fallback. The job the product does is to demonstrate effort without expending it.

Collections open on the occasions people actually give for: 78% contribute for a leaver, 75% for a retirement, 22% for a routine birthday. **[V]** They are scoped to the immediate team, contributions are private, and the recipient picks a gift when the pot closes. The leaver collection, triggered from the roster the day someone resigns, exists nowhere else in the UK; a competitor scheduling from a spreadsheet cannot know who will resign in ninety days.

Milestone anniversaries and client dates carry a company-paid gift by policy, decided once. Quality is observable here in a way it is not for a consumer card: the recipient sits three desks away, and the card is seen and discussed the same day. That is why approve-without-edit is a real signal.

### For people

The same loop for your own life. Sign in with Google or Microsoft and the birthdays in your contacts become your calendar in one consent; both APIs return the field. **[V]** Apple grants access per contact since iOS 18. Facebook and the other networks closed friend data to third-party apps in 2018, so there is no social-network import and the plan does not claim one.

The social mechanic that works needs no platform: a share link that says "tell me your birthday". Each person adds their own date. Opt-in, cross-network, and every reply is a lead with an occasion attached.

Ten days before each occasion the card exists. One email: "Mum's birthday is in ten days. Here's the card." Send, change a line, or skip. Nothing goes without the tap, because it is the person's money. The subscription tier is the exception and auto-sends.

| Tier **[E]** | Price | Covers |
|---|---|---|
| Per card | £5.49 including post | Matches Moonpig's £5.89 within pence |
| Subscription | £4.99 a month | Up to twelve cards a year, sent automatically |

Moonpig Plus proves consumers pay £10.99 a year for a card subscription; 1.2m do. **[V]** Ours sends the cards rather than discounting them. What it deliberately does not do: same-day rescue. If it is today, Moonpig's factory wins.

### The evidence that people want this

| Finding | Figure |
|---|---|
| UK office workers' annual spend on office socialising, including birthday and leaving contributions | £1,715 **[V]** |
| Average workplace collection pot; contributors | £138; 12 **[V]** |
| Find organising a collection hard; do not know how much to give; would rather choose their own gift | 89%; 65%; 72% **[V]** |
| Perks platform cost per head; utilisation | £72 to £96; single digits **[V]** |
| Reminders set voluntarily at Moonpig | 113m **[V]** |
| Named customers of Moonpig for Business | Salesforce, Gousto **[V]** |
| The closest product, Print.one Moments, connects an HR system to printed cards in the Netherlands | Exists, with customers **[V]** |

We are not creating demand. People already spend, collect, remind and subscribe, and they do it badly. We organise it.

## 3. The moat is the list

Print, design, drafting, the digest, the collections page: all replicable. What cannot be built quickly is what Moonpig spent fifteen years accumulating. This plan is a plan for building a list faster and cheaper than Moonpig did.

| Route to a list | Yield per unit of effort | Cost per occasion |
|---|---|---|
| Paid consumer acquisition | One person, about 9 occasions | £45 a person, about £5 an occasion. Does not close **[A]** |
| A company roster alone | ~200 work occasions per signature | An operator's time; work occasions, not the personal list |
| The roster plus the allowance | 200 people with a reason to add their own family | The same signature. This is where the personal list starts |
| Contact import | 10 to 20 occasions per person in one consent **[E]** | Nothing, once built |
| The circle request | Every reply is an occasion and a lead | Nothing, and it compounds |

Companies are the door not because company cards are a large business but because the signature is the only self-funding way to put the consumer product in front of hundreds of people at no acquisition cost. The seat pays the salaries; the allowance builds the list. Three consequences: the consumer product is open from day one; import and the circle request are in the first thirty days; and the headline metric is personal occasions under management.

The honest scale: 300 companies, 30% of staff activating, nine contacts each is about 160,000 personal occasions in year one, against Moonpig's 113 million. **[E]** What makes a list four hundred times smaller matter is conversion, theirs at 13% and ours drafting first, and the two multipliers that cost nothing per occasion.

## 4. The market

| | Figure | Source |
|---|---|---|
| UK firms with 50 to 249 employees | 38,435 | ONS Business Population Estimates 2025 **[V]** |
| People employed by them | ~3.5m | ONS **[V]** |
| Staff seats at £30 if every one bought | ~£105m a year | **[D]** |
| Firms with 250 or more employees | 8,335, of which perhaps half are under 500 **[E]** | ONS **[V]** |
| Adding those, and client rosters at 2.6 times account value on the quarter of firms that have one | ~£200m addressable for the company product | **[E]** |
| The consumer pool | Moonpig UK £284.5m; the group £373m | **[V]** |

Year one at 300 accounts is 0.8% of the core band. The £3.1m bar at 280 blended accounts is 0.7%. Neither requires the category to grow; orders at the market leader fell 9.5% over four years and the plan does not need them to recover.

The company product alone is a business worth tens of millions. The consumer pool is where the profit is, and section 3 is the only route into it that closes.

## 5. Business model and unit economics

**Pricing.** £30 per employee per year for the staff roster, every occasion included plus six personal cards. £0.50 per client contact per year plus £3.60 a card for client rosters. Consumer at £5.49 a card or £4.99 a month. We match Moonpig's business price rather than undercut it: at 61% card margin we could survive a price war, and their floor is set by their own consumer price of £5.89.

**Card cost, verified.** £1.39 all in via Docmail, A5 in a C5 envelope, economy post included. £1.15 via Stannp. **[V]** Moonpig plus Greetz per order: average order value £9.32, cost of sales £4.24, gross profit £5.08, adjusted EBITDA £2.66, shipping £2.45, employment £1.55, marketing £1.07. **[V]** A sub-scale entrant pays thirty to sixty pence more per card than Moonpig does. **[C] [E]** We do not win on card cost and the plan never claims to. Our margin is subscription margin: print is £2.78 of a £30 seat, and the seat clears 70% even if card cost doubled.

**Account A, staff roster, 200 employees**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| 200 seats at £30 | £6,000 | £1,343 | £4,657 |
| 37 collections, £145 average pot, 11% blended take **[E]** | £597 | £0 | £597 |
| **Total** | **£6,597** | £1,343 | **£5,254, 80%** |
| Gift value under management **[E]** | £5,365 | | |

**Account B, the same firm with 2,000 client contacts**

| Line | Revenue | Cost | Gross profit |
|---|---|---|---|
| Platform, cards, 200 client gifts at £50 | £10,700 | £2,880 | £7,820, 73% |
| Gift value under management **[E]** | £10,000 | | |

Fully expanded: **£17,297 revenue, £13,074 gross profit, £15,365 of gift value under management.** Gifts are 39% of Moonpig's revenue on an 18% attach rate; ours attach through a mechanism the recipient wants, at a moment colleagues have already committed money.

**Consumer account, blended [E]**: £23.28 revenue, £17.79 gross profit a year, about what a Moonpig customer produces before the £3.15 a head they spend to keep them. The advantage is not a richer customer. It is a free one.

**Supply chain.** Print is bought, not built; Moonpig ran the Covid spike on outsourced fabrication and insourced later for margin, so in-house print is a phase-three question. Gifts are never held; Moonpig carries £8.7m of finished goods and all the markdown risk. Working capital runs the other way from the incumbent: Moonpig is financed by suppliers at 134-day terms, a new entrant gets 30 days, and we do not need them because seats are paid a year in advance. Postage rises from Royal Mail hit both sides; seat pricing absorbs ours. **[V]**

## 6. Go-to-market strategy

### Beachhead

UK professional services firms with 50 to 250 staff and a CRM: accountancy, law, financial advice, recruitment, estate agency. London first, because the operator and the Telemachus network are there. Four reasons this segment and not another. The HR data is clean and the headcount is stable. Every one of them has a client roster, which is the expansion. The partner feels the pain personally, because they are the one who ends up writing the leaving card. And a £6,000 ticket sits under the procurement threshold, so it is a decision rather than a process.

Not the beachhead: firms over a thousand staff, which is a procurement cycle; firms under twenty, which have no budget line; retail and hospitality, where turnover is high and home addresses are unreliable.

### Positioning

One line per buyer, and never the same line.

| Buyer | The line | Never say |
|---|---|---|
| Head of People | Every person noticed, every time, and a benefit each of them will actually use | "Saves your office manager time" |
| Managing Partner | Every client, every milestone, without you remembering | "Cheaper than Moonpig" |
| Founder, under 150 staff | Your name on every card, and you never think about it | Anything about cards |

### The motion: land, prove, expand

| Step | What happens | Days |
|---|---|---|
| Conversation | Twenty minutes. Ask how it is done today, then who would sign | 0 |
| Onboarding | CSV or connector, ten minutes. Consent email goes to staff | 1 |
| First digest | Lands the following Monday with real cards for real people | 7 |
| Pilot | First month free. Cards go out. The collection opens for the first leaver | 30 |
| Convert | Paid at day 30, on the approve-without-edit rate and the first collection | 30 |
| Expand | Client roster at day 60. Gift policy at renewal | 60 to 365 |

The champion is the office manager who does the job by hand today. They feel the pain, they do not hold the budget, and they walk the operator to the person who does. Benefits budgets are set annually, often January or April, so mid-year the pitch is a pilot from discretionary spend converting at renewal.

### Channels, by phase

**Phase one, the operator.** The Telemachus network for the first ten. LinkedIn outbound after that: people ops leads and managing partners at 50 to 250-person firms are findable by title and company size. Messages, not adverts.

**Phase two, the product.** The shared card. Leaving posts are among the most common on LinkedIn, and a card with eight handwritten lines is what gets photographed, in front of exactly the people who work at the next firm. About 37 collections a year per account; if a fifth are shared, that is seven posts per account reaching the recipient's network at zero cost. The consent email and the allowance put the consumer product in front of every employee.

**Phase two, partners, from month six.** HR-platform marketplaces, since BambooHR and HiBob both list integrations. Benefits brokers, who resell perks to exactly this segment. Accountancy and law networks, where one member firm's adoption is a reference for the rest.

**Phase three, the loops.** The circle request as a WhatsApp broadcast or a story. The received-card mark on every envelope. Referral. Paid social only after month twelve, against a measured lifetime value, targeting people who have already received a card.

### Funnel arithmetic, honestly

What one operator's outbound produces, at conservative rates. **[E]**

| Stage | Rate | Per week |
|---|---|---|
| Outbound messages | 20 a day | 100 |
| Replies | 5% | 5 |
| Conversations | all replies | 5 |
| Pilots | 50% of conversations | 2.5 |
| Paid at day 30 | 60% of pilots | 1.5 |

That is about six paid accounts a month, seventy a year, from one operator's cold outbound alone. The year-one target of 300 is four times that. The gap is closed three ways, and the plan depends on all three: the Telemachus network converts at several times the cold rate for the first thirty; the shared card turns every account into inbound from month three; and a second operator is the first hire after the day-ninety gate, funded from contribution. If none of the three materialises, year one is seventy accounts and £500k, and the kill criteria say so at month nine.

### What to measure

Reply rate, conversation-to-pilot, pilot-to-paid, days from first conversation to signature, expansion rate at day 60, and acquisition cost per account including the operator's time. The kill signals are acquisition cost above £2,000 or a cycle beyond six weeks.

### Sequence

| Quarter | Focus |
|---|---|
| One | London professional services, staff rosters, ten pilots to thirty paid |
| Two | Client rosters on every account that has one. Second city |
| Three | Multi-site groups: care homes, dealerships, agency chains, where one signature is thousands of contacts. Partner channels open |
| Four | Second operator. Consumer cohort measured; paid acquisition decision |

## 7. Competition

| Player | What they have | The gap |
|---|---|---|
| Moonpig for Business, £3.60 a card **[V]** | Spreadsheet upload, 90-day scheduling, Salesforce and Gousto | No integration, no drafting, no collections |
| Moonpig group cards **[V]** | 50 contributors by link | Manual; no pot, no roster trigger, no gift choice |
| Moonpig Plus, £10.99 a year **[V]** | 1.2m subscribers | Discounts the card, does not send it |
| Thankbox **[V]** | Digital pots, some HR provisioning | No physical automation |
| Reachdesk, Sendoso, $15k+ a year **[V]** | Real HR triggers | Gifts at enterprise prices for enterprise buyers |
| Print.one Moments, Netherlands **[V]** | Closest full stack | Dutch connectors, templated copy, no approval step |
| Collection Pot, Givetastic, GiftRound **[V]** | Pots at 0% to 4.5% | Manually created, no roster trigger |

No product on either side drafts the card before being asked. Feature parity with the incumbent's editor is the wrong frame; the plan stays on the contract, the roster and the collection.

## 8. What was built today

A working system on a simulated clock, in the repository, not mocked.

| Inefficiency at the incumbent | What Hooray does | Status |
|---|---|---|
| 87% of reminders produce no order | Draft first, approve second, auto-send at T-5 | **Built** |
| Marketing roughly equals new-customer revenue | Acquire through an operator closing firms | **Built**, unproven commercially |
| 533 of 676 staff outside the factory | No catalogue, editor or marketing department | **Built** |
| Shipping 23.6% of revenue and rising | Draft ten days early, economy post | **Built** |
| Same-day print serves panic buying | Print is a supplier, never a factory | **Built**: real request, print-ready PDF, live key |
| Gifts 39% of revenue on an 18% attach | Collections as the attach mechanism; company gifts on milestones | **Built** for pots and policy; sourcing not built |
| Group cards exist, manual, no trigger | The collection opens itself on resignation | **Built** |
| Payroll birthdays have no lawful basis for cards | Consent gate; the consent email is the consumer signup | **Built** as a gate |
| Reminders accumulated one at a time since 2011 | Contact import in one consent; the circle request | **Not built** |
| Plus discounts to buy loyalty | A subscription that sends the cards | **Not built**; pricing designed |
| Business channel 39% under consumer | No legacy channel to protect | Structural |

Also built: the weekly digest through Brevo, tested live this afternoon; a personal workspace with the business-and-people switch; a per-occasion personal email; a dashboard on the incumbent's real figures; a headless test of a whole simulated year. Not built: hosting, payments, live HR connectors, gift fulfilment, authentication, multi-tenancy.

## 9. Financials

Three years, from the unit economics above. Every figure **[E]** except where the unit cost is verified.

| | Year one | Year two | Year three |
|---|---|---|---|
| Company accounts | 300 | 500 | 750 |
| Average account value | £7,000 | £9,000 | £11,000 |
| Company revenue | £2.1m | £4.5m | £8.3m |
| Consumer accounts, active | 18,000 | 30,000 | 60,000 |
| Consumer revenue at £23.28 | £0.4m | £0.7m | £1.4m |
| **Revenue** | **£2.5m** | **£5.2m** | **£9.7m** |
| Gross profit, ~80% | £2.0m | £4.1m | £7.7m |
| Headcount | 4 | 5 | 7 |
| Team and infrastructure | £0.65m | £0.85m | £1.2m |
| **Contribution** | **£1.35m** | **£3.3m** | **£6.5m** |
| Revenue per employee | £625k | £1.0m | £1.4m |
| Personal occasions under management | 160,000 | 400,000 | 1,000,000 |

Four people above $1m each is reached in year two. Contribution-positive in year one, by month nine on the ninety-day ramp. The consumer line is small in revenue and large in what it proves: 60,000 accounts by year three whose behaviour can be measured before a pound is spent on advertising. Paid consumer acquisition starts only against that measured lifetime value, and any paid spend before month twelve is a kill signal.

## 10. Team and the ask

**Four people.** An operator who sells, holds the first twenty relationships, contracts the print supplier and supplies the context the internet does not hold: bereavement, parental leave, religious observance, who may sign for whom. Two engineers, one on the engine and connectors, one on print, collections and the dashboard. A generalist on supply, support, finance and compliance. A fifth person on consumer growth when phase two has 10,000 active accounts.

Four people is our cost structure, not our defence. Moonpig can deploy the same tools. The defence is the contract, the roster and the collection, and the list they build.

**The ask.** £850k for twelve months: £650k for the team, £100k for hosting, connectors and tooling, £100k of working capital. It buys 300 accounts, £2.1m of recurring revenue and 160,000 personal occasions, with the unit contribution-positive by month nine. Gates at thirty, sixty and ninety days; any of them can stop it, and the plan says which number does.

## 11. Risks and hypotheses

| Hypothesis | Status | Evidence, or the kill signal |
|---|---|---|
| An employee given six free cards adds their own family | **Open. The moat test** | Measured in the first pilot; kill below 15% at month six |
| A firm pays £30 a head | Open | Ten pilots; kill if acquisition cost exceeds £2,000 or the cycle exceeds six weeks |
| Drafts approved without edit | Open, early signal | On the dashboard; kill below 60% at month three |
| Leaver collection participation | Survey says 78% **[V]** | Measured in beta; kill below 50% |
| Accounts expand beyond staff-only | Open | Kill below 30% expansion by month nine |
| Consumers send more cards than at Moonpig | Open | Kill below 2.5 a year at month twelve |
| A card at £3 or less, all in | **Confirmed** | £1.39 **[V]** |
| A personalisation system for under £10k | **Confirmed** | Built today |
| Paid consumer acquisition is viable | **Falsified** | £45, nine-month payback **[A]** |
| Category volume growth is required | **Not required** | Orders fell 9.5% at the leader **[V]** |
| We are read as a cost play | Risk | Any pitch line that leads with "cheaper than Moonpig" |
| Moonpig ships an HR integration | Risk | Within six months; channel conflict makes it costly for them |
| Royal Mail rises pass through | Risk | Seat pricing absorbs it; card cost above £2.50 makes the per-card consumer tier unviable |

A plan that cannot say when to stop is not de-risked.

## 12. Ninety days

| Block | Build | Gate |
|---|---|---|
| Days 1 to 30 | The consumer product open from day one. Google and Microsoft contact import. The circle request. The consent email as the consumer signup. Two HR connectors. Ten free pilots from the operator's network and LinkedIn outbound | Employees adding personal contacts at 30% or more. Approve-without-edit above 70%. Five pilots asking to pay |
| Days 31 to 60 | Pilots convert to paid. Client-roster product. Gift sourcing so pots buy a real product. Per-occasion personal email live | 30 paying accounts, a quarter expanded, 20,000 personal occasions |
| Days 61 to 90 | Second print supplier. Slack and Teams approval. The received-card mark on every envelope | £1m ARR, 50,000 personal occasions, first consumer subscription |

Week one, before any of it: contract Docmail, Stripe Connect under collections, and one named pilot from the operator's own network. Named for later, not built until the approve-without-edit baseline exists: preference learning from digest edits, where one office manager's corrections teach the whole firm's voice.

## 13. What I would do differently

Build the collection flow before the dashboard, because it is the one thing no competitor has. Put the consumer product on day one from the start rather than arriving at it through the moat argument at five in the afternoon. And make the first customer call at ten in the morning rather than four.

---

## Sources

Moonpig Group plc FY26 Annual Report and Final Results RNS, June and July 2026, via moonpig.group and Investegate. Segment margins, gift attach, occasion capture and the AI posture quotation via the 16 September reference dossier. The 16 September reference build's report for the consumer acquisition model. Filings analysis of Moonpig Group plc, 6 August 2026, and its supplier findings from sustainability disclosures and the Companies House charges register. Moonpig founding and Guernsey VAT relief: Wikipedia, Printweek. ONS Business Population Estimates 2025. Moonpig for Business and Moonpig Plus, moonpig.com. Stannp and Docmail price lists. instantprint workplace collections survey, 2023, n=1,000. Collection Pot platform data via HR News. Nationwide office spending survey. Reward Gateway and Perkbox pricing via GetApp UK. Google People API and Microsoft Graph references. Apple WWDC24 on limited contact access. Telemachus thesis from careers.telemachus.io.

Full inefficiency teardown with workings in `docs/INEFFICIENCY.md`. The longer working draft of this plan in `docs/BUSINESS_PLAN_v_long_1830.md`.

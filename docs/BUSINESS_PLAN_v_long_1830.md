# Hooray

### Business unit plan: occasion cards for companies, then for everyone

*Telemachus trial day, 18 September 2026, revised 19:25. **[V]** verified from Moonpig's FY26 annual report, directly or via the 16 September reference dossier. **[D]** derived by arithmetic from verified figures. **[E]** estimate, needs testing. **[A]** from the 16 September reference build's report, a model rather than a measurement. **[C]** from the 6 August filings analysis's own derivations rather than directly from a filing.*

---

## Summary

Moonpig makes £51.7m a year converting about 13% of the 113 million occasions it knows about, because a reminder hands the work to the customer. Hooray drafts the card first and asks for approval second. It enters through companies, where one signature acquires hundreds of occasions at once and the cost is an operator's time rather than a marketing budget, and reaches consumers through the people who work there.

**The value proposition.** For £30 a head, every person in the firm is noticed on every occasion without anyone doing anything, and each employee gets six cards a year for their own family. To the firm that is consistency: today the popular get cards and the quiet do not, remote staff get nothing, and the leaving collection is the job everyone dreads. To the employee it is a benefit they will actually use, about £35 of retail value, where perks platforms cost £72 to £96 a head and see single-digit utilisation. At the incumbent's own prices, that is £8,500 of card value for £6,000, before the automation and the collections. The behaviour is proven: UK office workers already spend £1,715 a year on office occasions and 89% find organising them hard. What is not proven is that a firm pays £30 a head for this product, and the first ten pilots measure exactly that. It is not cheap cards. It is nobody doing anything, and everyone being noticed.

**The product.** A company connects its HR system once. Ten days before every birthday, work anniversary, welcome and leaver, a card exists: drafted in the firm's voice, signed by the right manager, printed and posted. A weekly digest is the only human touch, and ignoring it still sends the cards. When someone resigns, a collection opens for their team without anyone organising it, and the recipient picks a gift. That last part, a collection triggered from the roster the day someone leaves, exists nowhere else in the UK.

**The economics.** £30 per employee per year, every occasion included, sold into a benefits budget where the incumbents charge £72 to £96. A 200-person firm is worth £6,600 a year; with its client roster, £17,300. About 280 accounts is £3.1m of recurring revenue, four people above $1m each. We do not win on card cost. A sub-scale entrant pays more per card than Moonpig, and the plan never claims otherwise. The margin is the seat, and print is under £3 of it.

**The path.** Companies this year. Employees as consumers from month two, through the consent email the law already requires and a six-card personal allowance. Everyone from year two, on loops that need no marketing: the received card, the contact import, the circle request. The reference build priced paid consumer acquisition at £45 a customer with a nine-month payback. The employer route is the only one that closes.

**What was built today.** The whole loop on a simulated clock: roster in, cards drafted, the digest emailed through Brevo (a real one went out this afternoon), the print request to Stannp (API trial approved by phone), collections with group signing and gift choice, company-paid gifts on milestones, a consent gate, and a personal workspace. Not built: hosting, payments, HR connectors, gift fulfilment. Each is named with a ninety-day sequence and a gate before the next step.

**What kills it.** Drafts needing edits more than 40% of the time. Accounts staying staff-only. Employees not activating as consumers. Being read as a cost play. Each has a threshold and a date in section 12.

**The moat.** The list of people and dates. Everything else is replicable. Companies are the door because a signature is the cheapest way to put the consumer product in front of hundreds of people who will build that list, and the headline metric is personal occasions under management, not revenue.

**What I decided.** Consumer to companies. Per card to per seat. Collections only on the occasions people give for. No wishlist. Consumer as the destination with the company channel as the route in. Two other candidates' work informed this plan, and it says where.

---

## The case in numbers

Everything quantified, in one place. **[V]** verified, **[D]** derived, **[E]** estimate.

### The value proposition

**For £30 a head, every person in the firm is noticed on every occasion without anyone doing anything, and each employee gets six cards a year for their own family.**

To the firm: consistency and culture, with no admin. To the employee: a benefit they will use, worth about £35 a year at retail. To the operator: one signature acquires hundreds of occasions, and the cost is a salary, not an advertising line.

### What a 200-person firm gets for £6,000

| Item | Quantity | At the incumbent's own price | Value |
|---|---|---|---|
| Work-occasion cards: birthdays, anniversaries, welcomes, leavers | ~400 a year | £3.60, Moonpig for Business **[V]** | £1,440 |
| Personal cards for each employee's own family | 1,200 a year | £5.89, Moonpig consumer **[V]** | £7,068 |
| Collections opened automatically for leavers and milestones | ~37 a year | No incumbent offers this | |
| Drafting, signing, consent, posting, and nobody running it | | No incumbent offers this | |
| **Value at the incumbent's prices** | | | **£8,508** |
| **Price** | | | **£6,000** |
| **Card value per pound spent [D]** | | | **£1.42** |

The firm is not buying an intangible. It buys more card value than it pays for, at the incumbent's price list, and the automation and collections come on top. This arithmetic does not depend on any retention or engagement claim.

### The behaviour already exists, and is done badly

| Finding | Figure | Source |
|---|---|---|
| UK office workers' annual spend on office socialising, including birthday and leaving contributions | £1,715 | Nationwide survey **[V]** |
| Average workplace collection pot; contributors | £138; 12 | Collection Pot platform data **[V]** |
| Will contribute for a leaver / retirement / new baby / routine birthday | 78% / 75% / 54% / 22% | instantprint, n=1,000 **[V]** |
| Find organising a collection hard / do not know how much to give / would rather choose their own gift | 89% / 65% / 72% | Collection Pot survey **[V]** |
| Perks platform cost per employee per year; utilisation | £72 to £96; single digits | Reward Gateway, Perkbox **[V]** |
| Consumers paying £10.99 a year for a card subscription | 1.2m | Moonpig Plus **[V]** |
| Occasion reminders set voluntarily | 113m | Moonpig FY26 **[V]** |
| Named business customers of Moonpig for Business | Salesforce, Gousto | moonpig.com **[V]** |

### The incumbent, quantified

| Finding | Figure |
|---|---|
| Reminders held; orders; reminders that produce nothing | 113m; 36.0m; 87% **[V] [D]** |
| Share of customers' own card occasions captured | 18% **[V]** |
| Marketing spend; as share of revenue; against new-customer revenue | £38.7m; 10.4%; roughly £1 per £1 **[V] [D]** |
| Employees; outside operations; revenue per employee | 676; 533; £552k **[V] [D]** |
| Shipping and logistics; share of revenue; growth against revenue growth | £88.2m; 23.6%; 9.4% against 6.5% **[V]** |
| Gifting share of Moonpig plus Greetz revenue; attach rate; per attached order | 39%; 17.9%; ~£19 **[V]** |
| Orders FY22 to FY26; average order value change | down 9.5%; up 21% **[V]** |
| Free cash flow; returned to shareholders | £73.5m; ~£65m **[V]** |
| Group cards | Exist, up to 50 contributors, manual, no pot, no roster trigger **[V]** |

### Our unit economics

| Figure | Value |
|---|---|
| Card cost, all in, A5 in envelope, economy post | £1.39 **[V]** |
| Print as a share of a £30 seat | £2.78, under 10% **[D]** |
| Seat margin if card cost doubled | still above 70% **[D]** |
| Account A, 200 staff: revenue; gross profit; margin | £6,597; £5,254; 80% **[D] [E]** |
| Account B, plus 2,000 clients: revenue; gross profit | £17,297; £13,074 **[D] [E]** |
| Consumer account, blended gross profit per year | £17.79 **[E]** |
| Recurring revenue for four people above $1m each | £3.1m, about 280 accounts blended **[D]** |
| Market rate for handling a collection pot | 1.1% to 2.9% **[V]**; our blended take with a sourced gift 11% **[E]** |
| Paid consumer acquisition, cold social | £45 a customer, nine-month payback, does not close **[A]** |

### What is not yet proven

| Claim | Status | How it gets proven |
|---|---|---|
| A firm pays £30 a head | Unproven | Ten pilots, first paid conversion |
| Automation is worth four times Moonpig's £3.60 business rate | Unproven | Pilot conversion rate at renewal |
| Employees activate on the personal allowance at 30% | Unproven | Measured at month six; kill below 15% |
| Drafts approved without edit above 60% | Early signal | On the dashboard from day one; kill below 60% at month three |
| Leaver participation above 50% | Survey says 78% | Measured in beta |

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
| Cards, attached gifting, standalone gifting, Moonpig plus Greetz | £203.5m, £123.8m, £8.2m |
| Active customers | 12.3m, ordering 2.92 times a year at £9.32 |
| Occasion reminders held | 113m |
| Average employees | 676, of which 143 in operations |
| Revenue per employee **[D]** | £552k |

The group margin blends in the Experiences agency business at 93.8%. **[V]** The right comparison for a physical card operation is the Moonpig segment at 55.9%, or the derived 54.5% for all physical revenue. This plan compares against 55.9% throughout and says so.

Comfortably past the Telemachus threshold of more than $10m annual net profit. Half the revenue-per-employee bar. No serious challenger in the category. The profit is consumer profit, which is where this plan has to end up.

## 1b. Why Moonpig won, and why none of it helps it now

Moonpig was founded in June 2000 and printed from Guernsey, where cards under £15 shipped VAT-free under low-value consignment relief until April 2012. **[V]** Funky Pigeon, owned by WHSmith, was building its own Guernsey facility when the relief ended. **[V]**

| What won it | When | Still available? | What we do instead |
|---|---|---|---|
| First mover. Built the category of online personalised cards | 2000 | No. The category is built | Enter through a different door: the employer |
| Twelve years of VAT-free cards from Guernsey | 2000 to 2012 | No. Closed by law, and closed on Funky Pigeon mid-build | Not needed. We do not compete on consumer price |
| Television. Years of spend that made the name mean "online card" | 2005 onwards | Only to Moonpig, at £38.7m a year | Sidestep it. Acquisition is a signature, not an advert |
| The reminder database. 113m occasions entered one at a time | Compounding since ~2011 | Only to Moonpig, converting at 13% | Get it from the roster in one signature; convert at 100% by construction |
| Own factories, same-day dispatch. Speed for the customer who forgot | Insourced from FY21 | Yes, but only matters at the last minute | Make it irrelevant: the card exists ten days early |
| Gift attach, lifting average order value to £9.32 | Ongoing | Yes, at 18% attach, growing 0.2 points a year | Collections and milestone policy, where people already commit money |
| Bought Greetz rather than fight it | 2018 | Only with £73.5m of free cash flow | Not our fight |

**The pattern.** Moonpig won in a window: first mover, a tax arbitrage, and television in the era when television built brands. The window closed by 2012. What still compounds is the reminder database and the brand, and the brand costs £38.7m a year to hold. That is why the moat is shallow now and why the annual report lists agentic AI as a principal risk.

**Why competitors did not.** Funky Pigeon came a decade late, under-invested, and reached the Guernsey arbitrage as it closed. Thortful chose a designer marketplace and competes on variety, which the reminder loop does not reward. Card Factory owns the high street and treats online as an afterthought. None built the database; none could afford the television.

**What it means for this plan.** Every advantage above is closed, expensive, or made irrelevant by drafting early. The one that still compounds, the occasion database, is what a roster hands us in one signature. Entering through companies is not a preference. It is the only door that is not behind a moat built in 2005.

## 1c. The moat is the list. Everything else is replicable.

Print, design, drafting, the digest, the collections page: all of it can be built by anyone with the same tools. What cannot be built quickly is what Moonpig has spent fifteen years accumulating, 113 million occasions entered one at a time by people who wanted to be reminded. That is the only durable asset in the category, and this plan is a plan for building one faster and cheaper than Moonpig did.

| Route to a list | What one unit of effort yields | Cost per occasion |
|---|---|---|
| Paid consumer acquisition | One person, about 9 occasions | £45 a person, roughly £5 an occasion. Does not close **[A]** |
| A company roster alone | ~200 work occasions per signature | An operator's time. But work occasions, not the personal list |
| The roster plus the allowance | 200 people with a reason to add their own family | The same signature. This is where the personal list starts |
| Contact import, Google or Microsoft | 10 to 20 occasions per person in one consent **[E]** | Nothing, once built |
| The circle request | Every reply is an occasion and a lead | Nothing, and it compounds |

**So companies are the door, and not because company cards are a large business.** They are not. The signature is the only self-funding way to put the consumer product in front of hundreds of people at no acquisition cost. The seat pays the four salaries. The allowance builds the list.

**Three consequences for the rest of this plan.** The consumer product is live from day one, open to anyone, not a phase-two launch. The import and the circle request move into the first thirty days, because every week without them is a week the list is not growing. And the headline metric is not recurring revenue. It is **personal occasions under management**: birthdays Hooray knows about that Moonpig does not.

**The honest scale.** Three hundred companies, 30% of staff activating, nine contacts each is about 160,000 personal occasions in year one. **[E]** Moonpig holds 113 million. What makes a list four hundred times smaller matter is two things. Conversion: theirs runs at 13% because a reminder asks the customer to do the work, and ours drafts the card first. And the multipliers: import and the circle request are what turn 160,000 into a million, and they cost nothing per occasion.

**The first hypothesis changes.** It is not whether a firm pays £30 a head. It is whether an employee, given six free cards, adds their mother. That is the moat test, and it is measurable in the first pilot.

## 2. The thesis in one line

Moonpig sells at the reminder. We sell at the contract. They hold 113 million occasions and convert about 13%, because a reminder hands the work to the customer at a bad moment. We draft the card first and ask for approval second. We enter through companies, where one signature acquires hundreds of occasions and the cost is an operator rather than a £38.7m advertising line, and reach consumers through the people who work there.

An analysis of the filings dated 6 August reached the same conclusion from the numbers alone: attack the seams, frequency and attach, where the incumbent is visibly stuck, not the reminder graph head-on and not the cost base. This plan arrived there by a different route, through the value chain, and the two agree.

## 3. Three phases, one loop

| Phase | Who pays | How they arrive | What it proves |
|---|---|---|---|
| 1 · Companies | The employer, per seat | An operator's signature | The loop runs unattended and the drafting is good enough |
| 2 · Employees, from day one | The employer, then the employee | The consent email, the collection page, the card allowance | Consumers at zero acquisition cost, and the personal list starts |
| 3 · Everyone | The consumer | The received card, referral, calendar import | The consumer product grows on its own loops without a marketing line |

Phase 1 pays for the team. Phase 2 starts on day one, because the list is the moat and every employee is a door to it. Phase 3 is the destination, and section 7 says why it cannot be reached any other way.

## 4. The attack

Each row is a measured inefficiency at the incumbent, the structural change that removes it, and whether today's build proves it.

| # | The inefficiency | Our structural attack | In the MVP today |
|---|---|---|---|
| 1 | 87% of reminders produce no order: 9.2 reminders held per active customer, 2.92 orders of any kind, about 1.2 caused by a reminder **[V] [D]**. The CEO: "Most customers use Moonpig for only a small proportion of the occasions they celebrate." | Draft first, approve second. Anything untouched at dispatch goes anyway. The roster converts at 100% by construction: every occasion on it produces a card and the firm has paid for all of them | **Built.** Rolling engine drafts at T-10, dispatches at T-5, auto-approves |
| 2 | They capture 18% of their own customers' card occasions: 3.5 cards a year against ~19 bought. Management now frames the opportunity as frequency, not penetration **[V]** | The roster supplies every occasion up front. Frequency is not a marketing problem, it is a data problem we do not have | **Built.** Occasion calendar from the roster |
| 2a | Orders fell 9.5% from FY22 to FY26, 39.8m to 36.0m, while average order value rose 21%. Group revenue is up 1.3% on FY21. All growth is price and mix; frequency is 2.92 and falling **[V]** | We do not need the category to grow. A 200-person firm produces about 400 occasions a year whether or not anyone buys more cards nationally | Structural |
| 3 | Marketing of £38.7m against ~£39.5m of new-customer revenue **[D]** | Acquire through an operator closing firms, not through advertising. The cost is a salary already in the four-person base; the kill signal is £2,000 per account or a six-week cycle | **Partly.** Roster import built. The employee account is on the critical path |
| 4 | 533 of 676 staff outside operations **[V]** | No catalogue, no editor, no merchandising, no marketing department | **Built.** Templated layouts from brand colours, no catalogue |
| 5 | Shipping is 23.6% of revenue, larger than the cost of inventories at 14.5% and larger than marketing and platform fees combined. It grew 9.4% against 6.5% revenue growth and drove the 1.2-point margin decline **[V]** | Draft ten days ahead, post economy. Our £1.39 is all-in, postage included, and it is not lower than theirs per card; it is simply a line we buy rather than run | **Built.** Ten-day lead, five-day dispatch, economy post |
| 6 | Same-day printing exists to serve panic buying caused by the failed reminder | Treat print as a supplier, never own a factory | **Built.** Real print request and print-ready PDF |
| 7 | Gifts are 39% of Moonpig plus Greetz revenue, £132m of £335.5m, yet only 17.9% of orders attach one, at ~£19 each, and attach grows about 0.2 points a year **[V]** | Collections are the attach mechanism. The pot buys a sourced gift; the client roster buys a £50 one | **Built** for pots. **Not built** for sourcing |
| 8 | Their own words: generative AI commoditises design, so the moat migrates to manufacturing, fulfilment and first-party data **[V]** | Agreed on design. On fulfilment, it is available at a price list, so we need not own it, though we pay slightly more per card than they do. On data, a roster is first-party data we get in one signature | Structural |
| 8a | Full automation breaks on four things at 36m orders: moderating user uploads, IP exposure on generated artwork, physical exceptions, and a Christmas peak that print lines cannot absorb, with H1 free cash flow of £8.6m out of £73.5m **[V]** | No uploads, so nothing to moderate. Templated layouts from brand colours, no generated imagery. Office delivery by default. Work occasions are flat across the year, so no peak, no seasonal hiring, no H1 cash trough | **Built.** The failure modes are designed out, not handled |
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

**Why people want this: the evidence.** The behaviour is heavily evidenced. The willingness to pay for this product is not, and the plan says both.

| Evidence | What it shows |
|---|---|
| UK office workers spend £1,715 a year on office socialising, including birthday and leaving contributions **[V]** | The behaviour exists at scale and people already pay for it |
| Average workplace collection pot £138, 12 contributors **[V]** | Collections are frequent and real money |
| 78% chip in for a leaver, 22% for a routine birthday **[V]** | Participation is uneven; the quiet person gets nothing |
| 89% find organising a collection hard; 65% do not know how much to give **[V]** | The pain is documented, not assumed |
| Moonpig for Business names Salesforce and Gousto as customers **[V]** | Companies already buy occasion cards for staff |
| Print.one Moments connects an HR system to printed cards in the Netherlands **[V]** | Someone built this and firms use it |
| Reachdesk and Sendoso are venture-funded at $15k a year for HR-triggered gifting **[V]** | Enterprise pays for automated occasions |
| Firms pay £72 to £96 a head for perks platforms with single-digit utilisation **[V]** | The benefits budget exists and is spent on things nobody uses |
| 1.2m people pay £10.99 a year for Moonpig Plus; 113m reminders set voluntarily **[V]** | Consumers pay for cards on subscription and want reminding |

**The tangible number.** Six personal cards at Moonpig's counter price are £35.34. Across 200 staff that is £7,068 of retail value delivered to employees. Add 400 work-occasion cards at Moonpig's own business rate of £3.60, another £1,440. That is £8,500 of value at the incumbent's price list, for £6,000. **[D]** The firm buys £1.40 of card value per pound, plus the automation and the collections. That is the arithmetic to put in front of a Head of People, and it does not depend on any retention claim.

**What we cannot point to.** No firm has paid £30 a head. No evidence that automation is worth four times Moonpig's business rate to a buyer. No activation rate on the allowance. Those are the first three things the ten pilots measure.

We are not creating demand. People already spend, collect, remind and subscribe, and they do it badly. We organise it.

**The buyer.** Two rosters, two buyers, two budget lines.

| Roster | Who signs | Budget line | Why it fits |
|---|---|---|---|
| Staff | Head of People or People Ops Manager | Employee benefits | Already carries a perks platform at £72 to £96 a head with single-digit utilisation. £6,000 a year for a 200-person firm sits under the threshold where procurement engages |
| Clients | Managing Partner or Head of Business Development | Client entertainment | Larger, less scrutinised, and client gifts already come from it. The bigger cheque and Account B |
| Either, under ~150 staff | The founder or managing partner | Discretionary | No HR function; the signer is the person whose name goes on the card |

The champion is the office manager or team lead who currently buys the cards, passes them round and organises the collection. They feel the pain, they do not hold the budget, and they will walk the operator to the person who does. Ask how it is done today, then ask who would sign.

Benefits budgets are set annually, often January or April. Mid-year the pitch is a pilot from discretionary spend, converting at renewal, which is how the ninety-day plan is shaped. Do not pitch HR on saving the office manager's hours; £6,000 does not beat a hundred hours on arithmetic. Pitch HR on consistency and the personal allowance. Pitch the partner on client relationships. Neither is buying cards.

### 5b. Hooray for people

The same loop for your own life. Sign in with Google or Microsoft and the birthdays in your contacts become your calendar in one consent; both APIs return the field. **[V]** Apple grants contact access per contact since iOS 18, so it is the degraded path. Facebook and the other social networks closed friend data to third-party apps in 2018 **[V]**, so there is no social-network import, and the plan does not claim one.

The social mechanic that does work needs no platform: a share link that says "tell me your birthday". Each person adds their own date. It is opt-in, it crosses every network because it is a message rather than an API call, and every reply is a lead with a known occasion attached. It is how gift registries grow, and it is the third loop in phase three.

Ten days before each occasion, the card exists. One tap sends it.

**How the person hears about it.** Not a weekly digest; a person has about nine occasions a year, so most weeks would be empty. One email per occasion, ten days out: "Mum's birthday is in ten days. Here's the card." Three buttons: send, change a line, skip. Nothing goes without the tap, because it is the person's money. The subscription tier is the exception and auto-sends, which is what "sent for you" means. **Not built.** The company digest is built and tested; the per-occasion personal email and the scheduler that fires both on real time are week one alongside hosting.

Against Moonpig the difference is the order of operations. They send a reminder and wait. We send a finished card and wait.

| Tier **[E]** | Price | What it covers |
|---|---|---|
| Per card | £5.49 including post | Matches Moonpig's £5.89 within a few pence |
| Subscription | £4.99 a month | Up to twelve cards a year, sent automatically, gifts at cost plus margin |

Moonpig Plus proves consumers pay £10.99 a year for a card subscription; 1.2m do, placing 23% of UK orders. **[V]** Ours sends the cards rather than discounting them.

**What the consumer product deliberately does not do.** Same-day rescue. If someone has forgotten and it is today, Moonpig's factory wins. Our customer is the one who never wants to be in that position again.

## 6. Unit economics

Card cost verified at £1.39 all-in via Docmail, A5 card in a C5 envelope, economy post included. **[V]**

Moonpig plus Greetz per order, FY26: average order value £9.32, cost of sales £4.24, gross profit £5.08 at 54.5%, adjusted EBITDA £2.66. Shipping £2.45, employment £1.55, marketing £1.07. **[V]** Two things follow. First, half their cost base, shipping and inventories at £142.1m, is physical and immune to software, and a sub-scale entrant pays an estimated £0.30 to £0.60 *more* per card on postage and print than they do. **[C] [E]** We do not win on card cost and the plan does not need us to. Second, our margin is subscription margin, not card margin: at £30 a seat and about two cards per seat a year, print is £2.78 of the £30. The card cost could double and the seat would still clear 70%.

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

Gift value under management is a headline metric, not a footnote. At Moonpig plus Greetz, gifts are 39% of revenue on an 18% attach rate that grows about 0.2 points a year. Ours attaches through a mechanism the recipient wants, at a moment colleagues have already committed money to. The take on it is thin today because the sourcing is not built. When it is, that line is where the account value moves.

**Consumer account, annual [E]**

| Type | Revenue | Cost | Gross profit |
|---|---|---|---|
| Subscriber, eight cards used | £59.88 | £11.12 | £48.76, 81% |
| Pay-per-card, 3.5 cards a year | £19.22 | £4.87 | £14.35, 75% |
| Blended at 10% subscribers | £23.28 | £5.49 | £17.79 |

A Moonpig customer produces £27.28 of revenue a year **[C]** and about £15.25 of gross profit at the segment margin, from which roughly £3.15 of marketing per active customer is spent to keep them. **[D]** Our blended consumer account is worth about the same before marketing and carries no marketing cost, because it arrived through an employer. The advantage is not a richer customer. It is a free one.

Our company seat is £30 a year. The revenue per head is nearly identical to Moonpig's per active customer; the difference is that ours is contracted annually, costs a signature rather than £3.15 of marketing to keep, and covers every work occasion instead of about 18% of them.

## 6b. Supply chain position

Five things the incumbent's own disclosures settle. **[V]** unless marked.

**Print: buy in phase one, revisit at scale.** Moonpig runs a hybrid, majority in-house with a third-party print network that is load-bearing rather than nominal. It scaled through the Covid volume spike on outsourced card fabrication, then insourced from FY21 to lift gross margin from 49.3% to 58.4%. In-house print is not a day-one requirement; it is where margin ends up at 36m orders. Tangible capex is only £4.6m a year, so when the time comes it is more accessible than the industrial-printer mental model suggests. Their structure also carries legacy cost we do not inherit: a Guernsey factory whose output is air-freighted to the mainland, a relic of pre-2012 VAT treatment.

**Postage: nobody is insulated.** Moonpig discloses "cost increases above inflation from both Royal Mail and PostNL". Our £1.39 via Docmail carries the same exposure. Seat pricing absorbs it, since print is £2.78 of a £30 seat. The consumer per-card tier is the line that would feel it first.

**Gifts: never hold inventory.** Cards carry almost no stock risk; gifts carry all of it, £8.7m of finished goods at Moonpig and every markdown, expiry and obsolescence problem in the business. Drop-ship or marketplace only. Moonpig's own flowers are entirely outsourced to a single supplier per country, which is the model to copy and the concentration risk to avoid.

**Working capital: the customer finances us, not the supplier.** Moonpig runs on roughly minus £43m of working capital, payables at about 134 days against inventory turning in 51. Suppliers finance the business. A new entrant gets 30-day terms and does not inherit that. We do not need it: annual seats are paid in advance and collections settle before they are spent. That is a structurally better position than the incumbent's, and it does not depend on negotiating power we lack.

**Peak: designed out.** Christmas runs five to ten times baseline and H1 free cash flow is £8.6m of £73.5m. Work occasions are flat across the year. Attack table, row 8a.

The 60-person-day supply chain programme in the same analysis, print RFQs at five million cards, tariff matrices, competitor teardowns, is the right plan for a head-on consumer clone building its own physical operation. This plan does not need it in phase one, for the reason that runs through the whole document: we buy the loop's physical links at a price list and put the money into the contract, the roster and the collection.

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

Three loops that do not need a marketing budget. The received card, with a small mark on the back; at 100,000 cards a year and 1.5% recipient conversion **[E]** that is 1,500 accounts a year, compounding with volume. The contact import, which turns a sign-up into a customer with nine known occasions on day one. And the circle request, a share link asking each contact for their own birthday, which is opt-in, platform-independent, and turns every reply into a lead. Referral, where the recipient's first card is free, sits on top of all three.

Paid acquisition begins only when the seeded cohort has shown a lifetime value a campaign can be priced against.

## 7b. Distribution: social media is a channel, not a budget line

The plan declines to buy consumers on social media, because the reference build priced cold paid social at £45 a customer with a nine-month payback. **[A]** It does not decline social media. Four uses cost nothing and one is deferred.

**LinkedIn is the operator's outbound channel, phase one.** People ops leads, office managers and founders at UK firms of 50 to 500 staff are findable by title and company size. Direct messages, not advertising. The first fifty conversations come from here, alongside the operator's own network.

**The collection card is shareable content, phase two.** Leaving posts are among the most common on LinkedIn. A card with eight handwritten lines from colleagues is what gets photographed and posted. A 200-person firm runs about 37 collections a year; if a fifth of recipients share, that is seven posts per account per year, each reaching the recipient's network, with a small mark on the card. **[E]** The product generates its own reach, and it lands in front of exactly the people who work at the next firm.

**The circle request is a social mechanic, phase three.** "Tell me your birthday" travels as a WhatsApp broadcast, an Instagram story or a LinkedIn post. It needs no platform API and every reply is a lead with an occasion attached.

**Founder content throughout.** Posting what is being built, the numbers, the thesis. Cheap, slow, compounding, and standard for an AI-native unit.

**Paid social, deferred to month twelve, to the warm audience only.** The £45 figure was for strangers. Retargeting people who have received a Hooray card, or who work at a client firm, is a different economics. It is testable once the seeded cohort has a lifetime value to price a campaign against, and not before. Any paid spend before month twelve remains a kill signal.

Moonpig spends £38.7m a year buying strangers. We reach people the product has already touched.

## 8. Ninety days

| Block | Build | Gate |
|---|---|---|
| Days 1 to 30 | The consumer product open to anyone from day one. Google and Microsoft contact import. The circle request. The consent email as the consumer signup. BambooHR and HiBob connectors. Ten free pilots from the operator's network and LinkedIn outbound. **Named, not built:** preference learning | Employees adding personal contacts at 30% or more. Approve-without-edit above 70%. Five pilots asking to pay |
| Days 31 to 60 | Convert pilots to paid. Client-roster product. Gift sourcing so pots buy a real product. Per-occasion email for personal accounts | 30 paying accounts, a quarter expanded, 20,000 personal occasions under management |
| Days 61 to 90 | Second print supplier. Slack and Teams approval. The received-card mark on every envelope | £1m ARR, 50,000 personal occasions, first consumer subscription taken |

**Week one, before any of it.** Contract Docmail. Stripe Connect under collections. One named pilot from the operator's own network.

**Preference learning from edits.** When an approver edits a line, extract the durable preference, scope it to the company or the person, and feed it into the next draft. In B2B it compounds: one office manager's edits teach the whole firm's voice. It is the one feature from the reference build worth keeping, and it is named here so nobody builds it before the approve-without-edit baseline exists to measure it against.

## 9. Hypotheses

| Hypothesis | Status | Evidence |
|---|---|---|
| An employee given six free cards adds their own family | **Open. The moat test** | Measured in the first pilot; kill below 15% at month six |
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
| Category volume growth is required for the plan | **Not required** | Orders fell 9.5% FY22 to FY26 at the market leader **[V]**. The model is share of occasions within a firm, not share of a growing market |

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
| We are read as a cost play | The plan's margin is the seat, not the card. Never claim a print-cost advantage; claim the contract, the roster and the collection | Any pitch line that leads with "cheaper than Moonpig" |
| Royal Mail tariff rises pass through the print partner | Seat pricing absorbs it; print is under 10% of the seat. Two suppliers by day 90 | Card cost above £2.50 makes the consumer per-card tier unviable |
| Gift supplier concentration | Drop-ship from more than one supplier per category; never hold stock | A single supplier above 60% of gift value |

Context for all of the above: the incumbent's category has not grown on volume in four years, and its weaknesses are on the revenue side, frequency at 2.92 and attach at +0.2 points a year, not the cost side. **[V]**

## 13. Capital and team

Four people through phase one. That is our cost structure, not our defence: Moonpig can deploy the same tools, and cost efficiency is not defensible against a company that already holds 113m reminders. The defence is the contract, the roster and the collection. A fifth person, on consumer growth, when phase two has 10,000 active accounts to work with. Working capital is light: cards are paid for before they are printed and collections settle before they are spent. The consumer product adds no fixed cost, since it is the same engine with a different customer at the front.

---

## Sources

Moonpig Group plc FY26 Annual Report and Final Results RNS, 25 June and 10 July 2026, via moonpig.group and Investegate, read directly. Segment margins, gift attach, occasion capture and the AI posture quotation via the 16 September reference dossier, itself sourced to the same report. The 16 September reference build report for the consumer subscription model and its acquisition-cost result. Moonpig founding and Guernsey VAT relief: Wikipedia and Printweek. Filings analysis of Moonpig Group plc, 6 August 2026, 62 documents FY21 to FY26 with per-row citations, orders times average order value reconciled to reported revenue in every year FY23 to FY26; marked **[C]** where a figure is taken from its derivations rather than directly from a filing. Its supplier findings of the same date, from sustainability disclosures, SECR energy reporting and the Companies House charges register, for the make-versus-buy position, facilities, named carriers and working capital structure. Moonpig for Business pricing and Moonpig Plus FAQ, moonpig.com. Stannp and Docmail price lists. instantprint workplace collections survey, 2023. Collection Pot platform data via HR News. Reward Gateway pricing via GetApp UK. Google People API reference. Telemachus thesis from careers.telemachus.io and jobs.ashbyhq.com/telemachus.

Full inefficiency teardown with workings in `docs/INEFFICIENCY.md`. Presentation prep in `docs/QA_PREP.md`.

# Hooray

### A plan to take Moonpig's market with the data it isn't using

Akshay Devon, Telemachus trial day, 18 September 2026

---

## Summary

Moonpig makes £51.7m of profit after tax a year and converts about 13% of the 113 million occasions it knows about. It knows about them because customers typed them in, one at a time, over fifteen years. Then it sends a reminder email, and nine times out of ten nothing happens, because a reminder hands the work back to the customer at a bad moment.

Hooray drafts the card first and asks for approval second. It sells to companies, not to consumers, because one signature from a firm brings hundreds of occasions at once and the cost of getting it is an operator's time rather than an advertising budget. Then it reaches consumers through the people who work at those firms.

The pitch to a firm is simple. For £30 per employee per year, every person is noticed on every occasion, birthdays, work anniversaries, joining, leaving, without anyone having to remember anything, and each employee gets six cards a year for their own family. Today someone in the firm, usually the office manager, buys the cards, passes them round and organises the collection when a colleague leaves. It's late, it's uneven, and nobody enjoys doing it. At Moonpig's own prices the firm gets about £8,500 of card value for its £6,000, and that's before counting the automation. Perks platforms cost £72 to £96 a head, and their value depends on an employee choosing to log in and browse discounts. A card for your mother on her birthday doesn't depend on anything.

The thing that's actually defensible in this category is the list of people and dates. Everything else, print, design, drafting, can be built by anyone with the same tools. Companies are the door because a signature is the cheapest way to put the consumer product in front of hundreds of people who'll build that list. The number I'd watch above revenue is personal occasions under management.

Moonpig already has that list, and the point is what it doesn't do with it. Fifteen years of orders tell it who sends to whom, where they live, what relationship they have, what they wrote, and when. It uses that to send a reminder email. It doesn't infer next year's occasion from this year's card, doesn't notice that two customers sending to the same mother are siblings, doesn't convert the 36 million people who receive a card each year, and doesn't draft your message from the twelve you've already written. Hooray does all of that from the first day, with a list that's a fraction of the size, and that's how a fraction becomes a threat.

The aim isn't a business next to Moonpig. It's Moonpig's market. Taking a quarter of its UK revenue in five to seven years means about 1.8 million active consumers, which from 60,000 at year three is roughly doubling and a half each year. Years one to three build the machine and prove each loop compounds. That's the bet, and it's written down.

Today I built the loop and it runs: roster in, cards drafted, a weekly digest that actually emailed this afternoon through Brevo, a print request to Stannp who approved the API by phone, collections that open themselves when someone leaves, company-paid gifts on milestones, a consent gate, and a personal workspace. Hosting, payments, HR connectors and gift fulfilment aren't built, and the plan says when they would be.

I'm asking for £850k over twelve months for four people. That buys 300 accounts, £2.1m of recurring revenue and 160,000 personal occasions on the list, with the unit contribution-positive by month nine. There are gates at thirty, sixty and ninety days, and any of them can stop it.

---

## 1. The problem

### Moonpig

Moonpig Group's year to April 2026 looked like this.

| | |
|---|---|
| Revenue | £373.0m, of which the UK card business is £284.5m |
| Gross margin | 55.9% for the Moonpig segment. The group figure of 58.4% includes an experiences business that runs at 93.8% |
| Adjusted EBITDA | £104.6m, a 28% margin |
| Profit after tax | £51.7m |
| Free cash flow | £73.5m, of which about £65m went back to shareholders |
| Marketing | £38.7m, 10.4% of revenue |
| Shipping and logistics | £88.2m, 23.6% of revenue, growing faster than sales |
| Active customers and orders | 12.3m customers, 36 million orders, £9.32 per order |
| Occasion reminders held | 113 million |
| Employees | 676, of whom 143 work in operations |

A note on that gross margin, because the group figure is misleading. Moonpig owns an experiences business, Buyagift and Red Letter Days, which sells vouchers for spa days, driving experiences and the like. It reports a 93.8% gross margin, but only because it books revenue as commission rather than the face value of the voucher. It isn't a high-margin business in any real sense; it's an agency with accounting that flatters it. It was written down by £56.7m in FY25 and its revenue fell 4.5% last year. We don't need to replicate it. Experience vouchers are already in the range a recipient can choose from when a collection closes, sourced from a partner at a margin, and that's the right way to carry them: as an option, not a division.

It's past Telemachus's threshold of $10m net profit five times over. Revenue per employee is about £552k, roughly half the bar. There's no serious challenger. And the profit is consumer profit, which is where this plan has to end up eventually.

### What's wrong with it

Moonpig has already won the hardest thing in commerce: customers have voluntarily given it a list of the people they love and the dates that matter. The company then sends an email saying "don't forget," and 87% of the time the customer forgets anyway. That works out to about 9.2 reminders held per customer against 2.92 orders a year, of which roughly 1.2 were actually prompted by a reminder. The chief executive says as much in the annual report: most customers use Moonpig for only a small proportion of the occasions they celebrate. On its own figures, about 18% of its customers' card occasions are captured.

Everything downstream of that failure is expensive. The customer who forgot panics, orders late, and pays for tracked delivery, which more than 40% of card-only orders now do. Moonpig runs a same-day factory to cope. Shipping and logistics costs grew 9.4% last year against revenue growth of 6.5%, and that's what pulled the gross margin down. Meanwhile 533 of the 676 staff work outside the factory, on the catalogue, the editor, the marketing and the service, all of which exist to manage a demand problem that starts with the reminder not converting.

Only 143 of Moonpig's 676 staff work in operations, and the factory is genuinely lean: 143 people print and ship 36 million cards. The other 533 are the question. The annual report only splits them as administration, but the shape is clear from what the business does. There's a product and engineering organisation large enough to capitalise £11.8m of software a year. A marketing function spending £38.7m. A merchandising and design team maintaining thousands of card designs and the licensing behind them. Customer service, partly outsourced. Finance, people and legal. And the separate organisations for Greetz in the Netherlands and the experiences business. Are they necessary? For Moonpig's model, largely yes: a catalogue needs merchandisers, a consumer brand needs marketers, a bespoke editor needs a product team. For ours, most of it doesn't exist. Designs are generated, not merchandised. Acquisition is a contract, not a campaign. The editor is a weekly email. The only functions that survive are a small engineering team, an operator, and someone on supply and compliance. That's the four people in section 10, and it's a cost structure, not a moat.

Marketing is £38.7m a year. Revenue from new customers is about £39.5m. They spend roughly a new customer's entire first year to acquire them, and the active customer base grew 2.8%. Orders have actually fallen 9.5% since FY22 while the average order value rose 21%, so the growth is price, not demand. Gifts are 39% of revenue but only 17.9% of orders carry one, and that attach rate moves about 0.2 points a year.

Moonpig does offer group cards, up to fifty contributors sharing a link, and it launched a business product last October at £3.60 a card. Both are manual: someone uploads a spreadsheet, someone creates the group card. Neither has a money pot, a trigger from a roster, or a way for the recipient to choose a gift.

### What it does with its data

This is the part that matters most. For every one of 36 million orders a year, Moonpig knows who sent it, who received it and at what address, the relationship the sender labelled ("Mum," "Sister," "Boss"), the occasion, the design, the message written inside, whether a gift went with it, what was paid, and how many days before the occasion the order came in. Over fifteen years that's a corpus of real messages in the millions, a map of where something like 100 million people live and who cares about them, and 113 million reminders people entered on purpose.

What it does with all of that is send a reminder email seven days out, personalise the catalogue, and offer generic AI text generation as a feature. It doesn't infer that a card sent to Sarah every May means May is Sarah's birthday; it waits for you to type the reminder. It doesn't notice that you and another customer both send to the same "Mum" at the same address and are therefore siblings. It doesn't do anything deliberate with the 36 million people who receive a card each year beyond printing its name on the back. It doesn't draft your message from the ones you've already written. It doesn't stop reminding you about someone after you've sent them a sympathy card. It has the richest relationship dataset in the country and runs it like a mailing list.

That's the inefficiency this plan attacks. Not the factory, which is good, and not the cost base, which is fine. The data.

### Why Moonpig won, and why that doesn't help it now

Moonpig was founded in June 2000 and printed from Guernsey, where cards under £15 shipped to the UK without VAT until the relief was closed in April 2012. That's twelve years of a 20% price advantage during exactly the period it built its brand and its database. Funky Pigeon, WHSmith's competitor, was building its own Guernsey facility when the relief ended.

The other things that won it are equally unavailable now. It was first, and the category is built. It spent years on television when television built brands, and it still spends £38.7m a year to hold the position. It insourced its factories from FY21 to lift gross margin from 49% to 58%, and same-day dispatch matters to the customer who forgot, but not to one whose card was drafted ten days ago. It bought Greetz in the Netherlands rather than compete with it.

What's left compounding is the list and the brand. The brand costs £38.7m a year. The list converts at 13%. That's why the moat is shallower than it looks, and why this year's annual report added "agentic AI disintermediation" as a principal risk while the chief executive, in the same document, described AI as "an enabler within our model, rather than a structural change." Both of those can't be true.

## 2. What Hooray does

Moonpig sells at the reminder. We sell at the contract.

### For companies

A firm connects its HR system, or uploads a spreadsheet, once. The calendar builds itself: birthdays, work anniversaries with the milestone years flagged, new starters, leavers, and for firms that add their client list, client anniversaries and milestones. Ten days before each one a card exists, drafted in the firm's voice from what the roster knows about the person, signed by the right manager. The manager gets one email a week listing what's going out. They can approve, change a line, or hold one. If they do nothing, the cards go anyway at five days. That's the point of the product: it demonstrates that the firm cares without anyone in the firm having to expend the effort.

Collections work the same way. When someone is marked as leaving, or a milestone anniversary comes up, a collection opens for their immediate team. Colleagues contribute privately, sign the shared card, and when it closes the recipient picks a gift. I restricted collections to those occasions because the survey data is clear: 78% of people will chip in for a leaver and 75% for a retirement, but only 22% for a routine birthday. A routine birthday gets the company card and nothing else.

The leaver collection is the one thing in the product that no competitor has. Nobody can schedule a resignation ninety days out, so a spreadsheet-based product can't do it. The day someone resigns, Hooray opens the collection, and nobody has to organise it.

Milestone anniversaries and client dates also carry a company-paid gift, set by policy once and applied every time. The recipient of a work card sits three desks from the sender, so quality gets seen and talked about immediately. That's why the share of drafts approved without editing is a real measure of whether the drafting is good enough, not a proxy.

### For people

The same loop, for your own life. You sign in with Google or Microsoft and the birthdays already in your contacts become your calendar. Both APIs return the field. Apple only lets an app see contacts you pick individually, so iPhone users add people by hand. Facebook and the other social networks closed friends' data to third-party apps in 2018, so there's no social-network import, and I'm not going to pretend there is.

What does work socially is a share link that says "tell me your birthday." Each person adds their own date. It crosses every network because it's a message, not an API call, and every reply is a new occasion and a new lead.

Ten days before each occasion you get one email: Mum's birthday is in ten days, here's the card. Send it, change a line, or skip it. Nothing goes without the tap, because it's your money. The exception is the subscription, which sends automatically, because that's what "sent for you" means.

On pricing, I started with £5.49 a card or £4.99 a month for twelve, and I don't think that's right. Monthly billing doesn't match how occasions work, which is annually, and £4.99 a month for twelve cards is £5 a card, barely below the single-card price, so there's no reason to subscribe. Moonpig Plus has 1.2 million subscribers at £10.99 a year, which tells me two things: people will pay for a card subscription, and the entry price should be low. So the model I'd test is annual, in three tiers. Free: two cards a year for anyone, and six for anyone whose employer has a Hooray seat, which is the on-ramp from the company product. Circle: £29 a year for up to eight cards sent automatically, which is £3.63 a card against our cost of £1.39. Then £3.99 for each card beyond that. Annual billing means cash arrives upfront, as it does with company seats, and the customer decides once rather than twelve times. Moonpig Plus discounts the card. Ours sends it. None of this is tested and the first consumer cohort is where it gets tested.

One thing the consumer product deliberately won't do is same-day rescue. If you've forgotten and it's today, Moonpig's factory wins. Our customer is the person who never wants to be in that position again.

### Why I think people want this

The behaviour already exists at scale and it's done badly. UK office workers spend about £1,715 a year on office socialising, including birthday and leaving contributions. The average workplace collection is £138 from twelve people. Nine in ten people say organising a collection is hard, two-thirds don't know how much to give, and seven in ten would rather choose their own gift than receive one chosen for them. Firms pay £72 to £96 a head for perks platforms whose value depends on staff logging in to browse discounts. Moonpig's business product already has Salesforce and Gousto as customers. In the Netherlands, a company called Print.one connects HR systems to printed cards and has customers doing exactly this.

We're not creating demand. People already spend, collect, remind and subscribe. We organise it.

What I can't point to is a firm that has paid £30 a head for this product. That's what the first ten pilots are for.

## 3. What's defensible

Print, design, drafting, the weekly digest, the collections page: anyone with the same tools can build all of it. What can't be built quickly is what Moonpig spent fifteen years accumulating, a list of 113 million occasions that people entered because they wanted to be reminded. That's the only durable asset in the category, and this is a plan for building one faster and cheaper than Moonpig did.

The routes to a list are not equal. Paid consumer acquisition costs about £45 a person for roughly nine occasions, which is £5 an occasion, and on any reasonable model it doesn't pay back within a subscriber's lifetime. A company roster gives you 200 work occasions for an operator's time, but those are work occasions, not the personal list. The allowance is where the personal list starts: 200 people who now have a reason to add their own family. Contact import turns each of them into ten or twenty occasions in one consent. The circle request makes every reply an occasion and a lead. The last two cost nothing per occasion.

So companies are the door, and not because company cards are a large business. They aren't. The signature is the only self-funding way to put the consumer product in front of hundreds of people at no acquisition cost. The seat pays the salaries. The allowance builds the list.

Three things follow. The consumer product is open to anyone from the first day, not launched later. The contact import and the circle request are built in the first thirty days, because every week without them is a week the list isn't growing. And the number at the top of the dashboard is personal occasions under management, not revenue.

The honest scale is this. Three hundred companies, with 30% of staff activating and nine contacts each, is about 160,000 personal occasions in year one. Moonpig has 113 million. A list four hundred times smaller only matters if it converts better, and drafting the card first rather than sending a reminder is the whole bet on that.

## 3b. How the list grows without anyone typing

Moonpig's list grew by data entry: 113 million reminders, one at a time, over fifteen years. Ours has to grow faster from a smaller base, so every mechanic below is built to add occasions from behaviour rather than from forms. Moonpig has the data to do each of these and does none of them.

**Every card creates the next occasion.** Send a birthday card on 14 May and 14 May is on the list next year without being asked. A wedding card creates an anniversary. A new-baby card creates a birthday, every year, for a person who doesn't exist in any contact book yet. A moving-house card updates an address. A sympathy card stops the reminders for the person who died. The list learns from what people do.

**The graph, not the list.** Moonpig stores "Mum, 14 May." We store that you and your mother are connected, in both directions. When your brother imports his contacts and his "Mum" is the same person at the same address, the graph knows you're siblings and offers you his birthday. It offers you both one card to her, from the family. Moonpig has this graph implicit in fifteen years of orders and treats every customer as alone.

**The recipient is the next customer.** Thirty-six million cards a year land on doormats with Moonpig's name on the back. Ours carry a code that opens a page with the sender's name and date pre-filled: send one back. The recipient arrives with one occasion already on their list and a reason to add more. It's the largest acquisition channel in the category and the incumbent uses it as a logo.

**Drafts learn from what you write.** Every message a person writes, every line an approver changes in the weekly digest, shapes the next draft for that person or that firm. By the fourth card to your mother it sounds like you. In a company, one office manager's corrections teach the whole firm's voice. Moonpig has millions of real messages and offers a blank box.

**Infer, don't ask.** Import from Google or Microsoft contacts in one consent. Where a contact has no date, ask the circle, or infer from a card sent last year. The target is a list that's mostly inferred and barely typed.

**Learn the real list from the actions.** If someone skips the draft for a certain cousin three years running, stop drafting for the cousin. If they always send to a colleague on the day, draft that one earlier. Moonpig sends every reminder seven days out to everyone.

**Attach where people already spend.** Moonpig's gift attach is 18% flat. A 40th birthday, a 25th anniversary, a first Mother's Day: these are milestones the data can see, and they should attach at three times the rate. We set gift policy on milestones for firms already; the consumer version is a prompt on the same occasions.

**The address book.** Every circle reply, every card sent, is an address on file. Over time the unit knows where people's mothers live in a way no commercial database does. That's the moat inside the moat, and it's built one reply at a time.

Two of these, every card creating the next occasion and the recipient code, are cheap and go into the first thirty days. The graph and the drafting memory follow once there's data to learn from.

## 4. The market

The ONS counts 38,435 UK firms with 50 to 249 employees, employing about 3.5 million people between them. At £30 a seat that's £105m a year if every one of them bought. Adding the 8,335 firms with 250 or more staff, perhaps half of which are under 500, and client rosters on the quarter of firms that have one, I'd put the addressable market for the company product at around £200m.

That estimate treats client rosters as an add-on. In relationship businesses they're the whole account. A bank, a wealth manager, a private bank, an insurance broker, a commercial property agent, a law or accountancy firm with partners who hold client relationships: each relationship manager has somewhere between fifty and two hundred clients, and the firm's revenue depends on those relationships being warm. A card on the client's birthday, on the anniversary of their first deal, on their company's milestone, signed by the person they actually know, is exactly what a good relationship manager does by hand when they remember, and almost never does consistently. A bank with five hundred relationship managers is fifty thousand contacts under one signature. That's a different order of account from a 200-person accountancy firm, and it's where the client-roster line in the financials gets large. One caution for regulated firms: cards are fine, gifts fall under gifts-and-hospitality rules and the Bribery Act, so the gift policy has to be set per client tier and logged. The product already records every gift by policy; that's the compliance story, not a problem. Year one at 300 accounts is 0.8% of the core band. None of this needs the category to grow, and it isn't growing; orders at the market leader have fallen for four years.

The company product on its own is a business worth tens of millions. The consumer pool, £284.5m in the UK for Moonpig alone, is where the profit is, and section 3 is the only route into it I can find that pays for itself.

None of this is UK-specific. Print is bought from a local supplier wherever the card lands, so there's no factory to replicate; Moonpig itself serves Australia and the US through third-party fulfilment. A roster is a roster in any language, and the occasions are the same. The Netherlands is the obvious second market: Moonpig owns Greetz there, and a Dutch company already connects HR systems to printed cards, which says the buyer exists. Ireland is the same product with a different postcode. The US is several times the size of the UK and Hallmark's online business is not Moonpig's. The sequence I'd follow is the UK for the first two years, one European market in year two, and the US in year three, each entered the same way, through firms, with a local print partner and no marketing line.

## 5. Business model

The firm pays £30 per employee per year, all occasions included, plus six personal cards for each employee. Client rosters are £0.50 per contact per year plus £3.60 a card, which matches Moonpig's business price. I'm matching rather than undercutting on purpose: at 61% margin on a card we could survive a price war, and Moonpig can't go much lower without cutting under its own consumer price of £5.89.

A card costs us £1.39 all in through Docmail, A5 in a C5 envelope, second-class post included. Stannp is £1.15 without an envelope, which is fine for a prototype and wrong for a birthday card. I called Stannp this afternoon; they set up an API trial account on the phone, free for the first month with print and post charged per card, and the key was live by five o'clock. I should be plain about this: Moonpig's card costs less than ours. A sub-scale entrant pays something like thirty to sixty pence more per card than Moonpig, by my estimate. We don't win on card cost and the plan doesn't need us to. Print is £2.78 of a £30 seat. The card cost could double and the seat would still clear 70%.

For a 200-person firm on the staff roster alone:

| | Revenue | Cost | Gross profit |
|---|---|---|---|
| 200 seats at £30 | £6,000 | £1,343 | £4,657 |
| About 37 collections a year, £145 average pot, 11% blended take | £597 | | £597 |
| Total | £6,597 | £1,343 | £5,254 (80%) |

The cost line assumes 40% of staff use their personal allowance. If every one of them used all six cards, cost rises to £2,224 and margin holds at 63%, so the allowance is safe to offer.

If the same firm adds 2,000 client contacts:

| | Revenue | Cost | Gross profit |
|---|---|---|---|
| Platform, 2,000 cards, 200 client gifts at £50 | £10,700 | £2,880 | £7,820 (73%) |

A fully expanded account is £17,297 of revenue and £13,074 of gross profit, with about £15,000 of gift value passing through it. The collection take rate is thin, between 1% and 3% is the market rate for handling a pot, and I've assumed 11% blended on the basis that a quarter of pots buy a gift we source at 25% margin. That's an estimate. Gifts are 39% of Moonpig's revenue; ours attach through a mechanism the recipient wants, at a moment colleagues have already committed money.

A consumer account is worth about £23 of revenue and £18 of gross profit a year on my assumptions, which is roughly what a Moonpig customer produces before the £3.15 a head Moonpig spends to keep them. The point isn't a richer customer. It's a free one.

On the supply side, print is bought rather than built. Moonpig ran the Covid volume spike on outsourced fabrication and insourced afterwards for margin, so owning a press is a question for year three. We never hold gift inventory; Moonpig carries £8.7m of finished goods and all the markdown risk. Working capital runs the opposite way from the incumbent's: Moonpig is financed by its suppliers on 134-day terms, a new entrant would get 30 days, and we don't need them because seats are paid a year in advance. Royal Mail's price rises hit us and Moonpig alike.

## 6. Go-to-market

### Where to start

UK professional services firms with 50 to 250 staff and a CRM: accountancy, law, financial advice, recruitment, estate agency. London first, because I'm here and so is the Telemachus network. The HR data is clean and headcount is stable. Every one of them has a client roster, which is the expansion. The partner feels the pain personally because they're the one who ends up writing the leaving card. And £6,000 a year is under the threshold where procurement gets involved, so it's a decision, not a process.

Not firms over a thousand, which is a procurement cycle. Not firms under twenty, which have no budget line. Not retail or hospitality, where turnover is high and home addresses aren't reliable.

The exception to the size rule is relationship businesses, where the client roster is the account and the size of the firm is the size of the prize. A private bank, a wealth manager or a broker with hundreds of relationship managers is a procurement cycle worth running, because one signature is tens of thousands of contacts and the buyer, the head of client experience or the chief operating officer, already has a budget for exactly this and no way to do it consistently. Those go in quarter three, after the product has references from the smaller firms.

### Who buys and what to say

For the staff roster the buyer is the Head of People, and the budget is employee benefits, which already carries a perks platform at two to three times our price. The line is: every person noticed, every time, and a benefit each of them will actually use. Don't pitch on saving the office manager's hours; £6,000 doesn't beat a hundred hours on arithmetic.

For the client roster the buyer is the managing partner or head of business development, and the budget is client entertainment, which is larger and less scrutinised. The line is: every client, every milestone, without you remembering.

In firms under about 150 staff there's no HR function and the founder signs. The line is: your name on every card, and you never think about it.

The champion is the office manager who does the job by hand today. Ask how it's done, then ask who would sign. Benefits budgets are set annually, usually January or April, so mid-year the pitch is a pilot from discretionary spend converting at renewal.

Nobody, in any of these conversations, is buying cards. Never lead with "cheaper than Moonpig," because we aren't.

### How a sale happens

A twenty-minute conversation. Onboarding the next day, ten minutes: a CSV or a connector, and the consent email goes to staff. The first digest lands the following Monday with real cards for real people. The first month is free. At day 30 they convert or they don't, on the strength of the approval rate and, ideally, the first collection having opened for a leaver. At day 60 we add the client roster. At renewal we add the gift policy.

### Channels

In the first phase it's the operator. The Telemachus network for the first ten firms, then LinkedIn outbound: people ops leads and managing partners at firms of the right size are findable by title and headcount, and it's messages, not adverts.

In the second phase the product does some of the work. Leaving posts are among the most common things on LinkedIn, and a card with eight handwritten lines from colleagues is exactly what gets photographed and posted, in front of the people who work at the next firm. An account runs about 37 collections a year; if a fifth get shared, that's seven posts per account reaching the recipient's network at no cost. From month six, partners: the HR platforms have app marketplaces, benefits brokers resell to exactly this segment, and accountancy and law networks treat one member's adoption as a reference for the rest.

In the third phase it's the consumer loops: the circle request as a WhatsApp broadcast, the mark on the back of every card, referral. Paid social waits until month twelve and targets people who've already received a card, not strangers. Moonpig spends £38.7m a year buying strangers. We reach people the product has already touched.

### The funnel, honestly

One operator sending twenty messages a day gets about five replies a week at a 5% reply rate. If half become pilots and 60% of pilots convert at day 30, that's one and a half paid accounts a week, or about seventy a year from cold outbound alone. The year-one target of 300 is four times that.

The gap closes three ways and the plan needs all of them. The Telemachus network converts at several times the cold rate for the first thirty. The shared card turns every account into inbound from month three. And a second operator is the first hire after the ninety-day gate, paid for from contribution. If none of the three materialises, year one is seventy accounts and about £500k, and the kill criteria in section 11 say so at month nine.

What I'd measure: reply rate, conversation to pilot, pilot to paid, days from first conversation to signature, expansion at day 60, and acquisition cost per account including the operator's time. The kill signals are acquisition cost above £2,000 or a cycle longer than six weeks.

### Sequence

Quarter one is London professional services on staff rosters, ten pilots converting to thirty paid. Quarter two adds client rosters to every account that has one and opens a second city. Quarter three goes after multi-site groups, care homes, dealerships, agency chains, where one signature is thousands of contacts, and opens the partner channels. Quarter four brings the second operator and the decision on paid consumer acquisition, made against a measured cohort.

## 7. Competition

| | What they have | What they don't |
|---|---|---|
| Moonpig for Business, £3.60 a card | The brand, the factory, spreadsheet upload, Salesforce and Gousto | Integration, drafting, collections |
| Moonpig group cards | Up to 50 contributors sharing a link | A pot, a roster trigger, gift choice |
| Moonpig Plus, £10.99 a year | 1.2m subscribers | It discounts the card rather than sending it |
| Thankbox | Digital pots, some HR provisioning | Physical cards, automation |
| Reachdesk, Sendoso | Real HR triggers for gifts | Anything under $15k a year |
| Print.one Moments, NL | The closest full stack | English-market connectors, an approval step |
| Collection Pot and similar | Pots at 0% to 4.5% | Any trigger; it's all manual |

Nothing on either side of the market drafts the card before being asked. Copying Moonpig's editor features, chat editing, alternates, undo, wouldn't move the economics. I've stayed away from feature parity and kept to the contract, the roster and the collection.

## 8. What I built today

A working system on a simulated clock, in the repository, not mocked. The engine drafts every card ten days out and dispatches at five, auto-approving whatever nobody touched. The roster import handles staff and clients, consent flags, leave status and delivery preference. The drafting produces per-person copy in the firm's voice with the right signer, and there's a ten-case evaluation script with wording checks. Cards render to a print-ready PDF at trim size with bleed and crop marks, and the exact Stannp request is built. I rang Stannp at four; they activated an API trial for free on the call, and the key was in the app by five, so the request can send for real. Collections open on leavers, retirements, weddings, new babies and milestones, scoped to the team, with contributions, group signing and gift choice. Milestone and client cards carry a company-paid gift by policy. The consent gate blocks anything an employee hasn't agreed to. The weekly digest goes out through Brevo and a real one went to my inbox at 15:53. There's a personal workspace with a switch between the business and personal sides, and a per-occasion email for personal accounts. The dashboard runs on Moonpig's actual figures. A headless test runs a whole simulated year without an API key.

Not built: hosting, so it runs on my laptop; payments; live HR connectors, it's CSV today; gift fulfilment; authentication; multi-tenancy. The contact import and the circle request aren't built either. Each of these is in the ninety-day plan.

## 9. Financials

Three years, built from the unit economics above. All of it is an estimate except the card cost.

| | Year one | Year two | Year three |
|---|---|---|---|
| Company accounts | 300 | 500 | 750 |
| Average account value | £7,000 | £9,000 | £11,000 |
| Company revenue | £2.1m | £4.5m | £8.3m |
| Active consumer accounts | 18,000 | 30,000 | 60,000 |
| Consumer revenue | £0.4m | £0.7m | £1.4m |
| Revenue | £2.5m | £5.2m | £9.7m |
| Gross profit at about 80% | £2.0m | £4.1m | £7.7m |
| Headcount | 4 | 5 | 7 |
| Team and infrastructure | £0.65m | £0.85m | £1.2m |
| Contribution | £1.35m | £3.3m | £6.5m |
| Revenue per employee | £625k | £1.0m | £1.4m |
| Personal occasions under management | 160,000 | 400,000 | 1,000,000 |

Four people above $1m each happens in year two. The unit is contribution-positive in year one, around month nine on the ninety-day ramp.

### The endgame

The table stops at year three because that's what I can estimate. The aim beyond it is Moonpig's market, and it's worth writing down what that takes. Moonpig's UK business is £284.5m from customers who spend about £27 a year. A quarter of that in five to seven years is roughly £70m, which at £40 a year per consumer, more than Moonpig's because we convert more of the occasions we know about, is about 1.8 million active accounts. From 60,000 at year three, that's thirty times in four years, or roughly two and a half times each year. That's what the loops in section 3b have to deliver between them, and it's the honest size of the bet. Years one to three build the machine and prove each loop compounds. If they don't, the unit is a profitable business worth tens of millions and the plan says so in section 4. If they do, the incumbent's marketing cost per new customer rises until its model breaks, because every card we send is one it didn't. The consumer line is small in revenue and large in what it proves: 60,000 accounts by year three whose behaviour has been measured before a pound is spent on advertising. Paid acquisition only starts against that measured lifetime value, and any paid spend before month twelve is a reason to stop and ask why.

## 10. Team and what I'm asking for

Four people. An operator who sells, holds the first twenty relationships, contracts the print supplier and supplies the things that aren't on the internet: how a firm handles bereavement and parental leave, who's allowed to sign for whom, which client gets a bottle and which gets a book. Two engineers, one on the engine and the connectors, one on print, collections and the dashboard. A generalist across supply, support, finance and compliance. A fifth person on consumer growth once the second phase has 10,000 active accounts to work with.

Four people is our cost structure, not our defence. Moonpig can use the same tools. What's defensible is the contract, the roster, the collection, and the list they build.

I'm asking for £850k over twelve months: £650k for the team, £100k for hosting, connectors and tooling, £100k of working capital. It buys 300 accounts, £2.1m of recurring revenue and 160,000 personal occasions, with contribution positive by month nine. There are gates at thirty, sixty and ninety days, and section 11 says which number stops it at each one.

## 11. What would make me stop

| | Status | What settles it |
|---|---|---|
| An employee given six free cards adds their own family | Open. This is the moat test | Measured in the first pilot. Stop if activation is under 15% at month six |
| A firm pays £30 a head | Open | Ten pilots. Stop if acquisition cost passes £2,000 or the cycle passes six weeks |
| Drafts approved without editing | Open, early signal today | On the dashboard. Stop if under 60% at month three |
| Leaver collection participation | Survey says 78% | Measured in beta. Stop if under 50% |
| Accounts expand beyond staff-only | Open | Stop if under 30% expansion by month nine |
| Consumers send more cards than at Moonpig | Open | Stop if under 2.5 a year at month twelve |
| A card at £3 or less, all in | Confirmed at £1.39 | |
| A personalisation system for under £10k | Confirmed today | |
| Paid consumer acquisition pays back | It doesn't: about £45 a customer and a nine-month payback | |
| The category needs to grow | Not required. Orders fell 9.5% at the leader | |
| We get read as a cost play | A risk | Any pitch line that leads with "cheaper than Moonpig" |
| Moonpig ships an HR integration | A risk | Within six months. Channel conflict makes it costly for them, but not impossible |
| Royal Mail keeps raising prices | A risk | Seat pricing absorbs it. A card above £2.50 breaks the consumer per-card tier |

## 12. The first ninety days

In the first thirty days: the consumer product open to anyone, the Google and Microsoft contact import, the circle request, every sent card creating next year's occasion automatically, the consent email doubling as the consumer signup, two HR connectors, and ten free pilots from the Telemachus network and LinkedIn. The gate is employees adding personal contacts at 30% or more, drafts approved without editing above 70%, and five pilots asking to pay.

Days 31 to 60: pilots convert, the client-roster product opens, gift sourcing so that pots buy a real product, the per-occasion personal email live. The gate is 30 paying accounts, a quarter of them expanded, and 20,000 personal occasions on the list.

Days 61 to 90: a second print supplier, approval from Slack and Teams, the code on every card that lets the recipient send one back with the sender pre-filled. The gate is £1m of recurring revenue, 50,000 personal occasions, and the first consumer subscription.

Before any of that, in week one: contract Docmail, put Stripe Connect under the collections, and close one named pilot from my own network. I've deliberately left one thing for later: learning from digest edits, so that one office manager's corrections teach the whole firm's voice. It's the best idea I've deliberately left out, and it shouldn't be started until there's a baseline approval rate to measure it against.

## 13. What I'd do differently

I'd have built the collection flow before the dashboard, because it's the one thing nobody else has. I'd have put the consumer product on day one from the start rather than arriving at it through the moat argument at five in the afternoon. And I'd have made the first customer call at ten in the morning instead of four. The thing I'd keep is the afternoon spent on what Moonpig does with its data, because that's where the plan stopped being a niche and became a way in.

---

## Sources

Moonpig Group plc, FY26 Annual Report and Final Results, June and July 2026, via moonpig.group and Investegate, including the segment note, the employees note, the sustainability report and the chief executive's review. Companies House registers for the Moonpig group entities. Moonpig's founding and the Guernsey VAT relief: Wikipedia, Printweek. ONS Business Population Estimates 2025. Moonpig for Business and Moonpig Plus, moonpig.com. Stannp and Docmail price lists. instantprint workplace collections survey, 2023, n=1,000. Collection Pot platform data via HR News. Nationwide survey on office spending. Reward Gateway and Perkbox pricing via GetApp UK. Google People API and Microsoft Graph documentation. Apple WWDC24 session on limited contact access. Telemachus, careers.telemachus.io.

The inefficiency workings are in `docs/INEFFICIENCY.md`.

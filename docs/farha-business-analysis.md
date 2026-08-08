# فرحة Farha — Business Analysis

**Prepared:** 8 August 2026 · **Scope:** Tunisia + diaspora (France / Italy) ·
**Assumed budget:** near-zero (0–500 TND) · **Assumed founder time:** 15–25 h/week

This document answers six questions: what the product actually is to a paying
customer, what we need next, where the limitations are, whether this is a good
project, what income to expect this month and over the coming year, and whether the
market is really buying this. The publication plan lives in
[`farha-launch-plan.md`](./farha-launch-plan.md); the ordered task list with prices
lives in [`farha-checklist.md`](./farha-checklist.md).

Every market figure is sourced. Every product claim points at a file in this repo.

---

## 1. The product, walked as a customer

I went through the site the way a Tunisian bride's brother would — landing on
`index.html` on a phone, in Arabic, with no idea what this company is.

**What is being sold.** Not a template. A short *cinematic film* — real footage of
marble stairs, wisteria, rings on a mirrored floor — with the couple's names, date,
venue, programme, dress code, live countdown and a song, delivered as a link that
opens with a wax seal. Sixteen films sit on the shelf
(`public/js/shared/films.js`), covering six occasions: wedding, henna night,
birthday, newborn, graduation, save-the-date.

**The two ways to buy** (`public/js/site/21-offers.js`, prices in
`public/js/site/12-dashboard-control-bridge.js:16`):

| | Price | What you get | Delivery |
|---|---|---|---|
| **المجموعة** · The Collection | **99 DT** (was 110) | A film off the shelf, personalised · 3 revision rounds | 2 days |
| **التوقيع** · The Signature | **249 DT** | A film written for you alone, custom calligraphy · 5 revision rounds | 7 days |

**How you pay.** You don't, not online. A sheet opens with three tabs — D17, Flouci,
RIB — you transfer manually, screenshot it, and send the screenshot on WhatsApp
(`12-dashboard-control-bridge.js:230`). The owner checks the money landed, then mints
your invitation by hand from the dashboard (`src/admin/backend.js:526`).

**What your guests get.** This is where the product is genuinely strong. The link
unfurls in WhatsApp with the couple's own poster and names — there's a Netlify edge
function doing that per-invitation (`netlify/edge-functions/invite-preview.js`). Add
`?g=` and each guest is greeted by name. Inside: the film, a countdown, the
programme, the dress code, a maps link, RSVP buttons, and a moderated wall of
congratulations. The couple gets a private guest list at `?guests=…&k=…` with a
24-character key, locked down properly in `supabase/schema-10-locks.sql`.

**The honest verdict as a customer:** the craft is real and it is above the local
bar. What's missing is every signal that this is a *business* — no domain, no reviews,
no photographs of real weddings that used it, no way to pay with a card, and no name
on the invitation your guests are holding. For a purchase built entirely on trust in
someone's taste, that gap is the whole problem.

---

## 2. The market — are people actually buying this?

**Short answer: yes, but the ground is moving under it, and the window is seasonal.**

### The core market is shrinking
Tunisia's Institut National de la Statistique recorded **70,942 marriages in 2024**,
down from **78,115 in 2023** — a 9% fall in a single year — and down from roughly
**110,000 in 2014**. That is a market losing about a third of its volume per decade.
([webdo](https://webdo.tn/en/actualite/national/tunisia-weddings-and-births-in-free-fall-demography-rocks/396349/),
[Times of Tunis](https://timesoftunis-1.ghost.io/tunisian-men-now-marry-at-35-on-average-as-economic-pressure-and-shifting-values-push-back-the-wedding-age/))

The cause matters for pricing: the **minimum cost of a Tunisian wedding now exceeds
50,000 dinars** before dress and honeymoon, and the average age at first marriage has
risen to 35 for men. People aren't marrying less because they want to — they're
priced out.

**What that means for you:** against a 50,000 TND wedding, a 99 DT invitation is
**0.2% of the budget**. Price is not the objection you will hear. Trust is. Nobody
haggles over the invitation; they worry it will look cheap in front of 300 guests.
This is an argument for raising the Signature share, not for discounting.

### The season is short and you are at the end of it
The Tunisian wedding calendar runs **late May → September**, with two peaks: the
weeks after Eid al-Adha, and **August, when the diaspora comes home to marry in front
of grandparents**. Weddings themselves run 3 to 7 days.
([Carthage Magazine](https://carthagemagazine.com/tunisian-wedding/))

Invitations go out **4–8 weeks before the event**. So the *selling* months are
**April through July**, and the delivery months are May through September.

> **This is the most important fact in this document.** Today is 8 August 2026. Anyone
> marrying this month sent their invitations in June. **The 2026 season is over.**
> September 2026 to March 2027 is build time, not sell time. Your real launch is the
> 2027 season, and everything below is planned around that.

### The diaspora is your best customer and cannot pay you
Roughly **1.29 million Tunisians live abroad**, about 81% of them in Europe —
**~669,000 in France**, **~189,000 in Italy**.
([Tunisian diaspora](https://en.wikipedia.org/wiki/Tunisian_diaspora))

They are the ideal buyer: higher purchasing power, guests scattered across three
countries, and a wedding planned remotely where a WhatsApp link genuinely solves a
problem that a printed card cannot. They are also the ones who return each August.

And they **cannot buy from you today.** D17 is La Poste Tunisienne, Flouci is
Tunisian, and a RIB transfer from France is slow and expensive. There is no card
payment anywhere in the code. You named the diaspora as a target market; right now the
checkout excludes them entirely.

### Reach is not the constraint
Tunisia has **10.4 million internet users (84.3% penetration)**, **7.83 million social
media identities (63.3%)**, and **6.0 million adult TikTok users**.
([DataReportal Digital 2026: Tunisia](https://datareportal.com/reports/digital-2026-tunisia))
For a business selling something visual to people under 40, the audience is all on
one or two apps and reachable for free.

### The competition
| | Offer | Price |
|---|---|---|
| **Invitio.io** | Digital wedding invitations, Tunisia. Interactive card, built-in RSVP, 3 languages FR/AR/EN, shared by WhatsApp link. | **from 89 DT** ([invitio.io](https://invitio.io/)) |
| Print shops (Imprimerie Tunisie, Rapide Print, GoPrint, Megashop…) | Traditional cards, 250–350 g stock | Per-unit, plus design |
| Zaffacard, Zevanto | Arabic digital invitations, Gulf-facing | USD, not Tunisia-priced |

**Invitio is the one that matters.** It undercuts your Collection tier by 10 DT with a
near-identical feature list, in the same three languages, on the same channel.

You cannot win on price and you should not try. Your differentiator is that Invitio
sells an animated *card* and you sell a *film* with real cinematography and a scored
soundtrack. That difference is visible in two seconds on a phone — which is exactly
why your growth channel should be video, not text.

---

## 3. Unit economics

| Per Collection order (99 DT) | TND |
|---|---|
| Revenue | 99.00 |
| Payment fee — Konnect local card / e-dinar, 1.3% | −1.29 |
| Payment fee — Konnect international card, 2.9% (diaspora) | −2.87 |
| Hosting + storage + egress, marginal | ≈ −2.00 |
| **Gross margin** | **≈ 95.7 DT (96–97%)** |
| Founder labour | ≈ 2 h |

Konnect fees per [web6.tn](https://web6.tn/blog/paiement-en-ligne-tunisie-comparatif/):
registration is free, 1.3% on local cards and e-dinar, 2.9% on international cards.

Signature at 249 DT carries ~6–8 h of labour. Blended at an 80/20 Collection/Signature
mix: **average order value 129 DT, average labour ~3 h**.

**The business has almost no cost of goods. Its only real input is your time.** That
single fact drives every recommendation in this document: the levers that matter are
the ones that raise revenue *per hour worked*, not the ones that raise traffic.

---

## 4. Revenue forecast

### Model and assumptions

| Assumption | Value | Why |
|---|---|---|
| Collection / Signature mix | 80% / 20% | Current offer framing; Signature is deliberately scarce |
| Blended average order value | **129 DT** | 0.8 × 99 + 0.2 × 249 |
| Labour per order (blended) | **3 h** | 2 h Collection, ~7 h Signature |
| Guests per invitation | ~200 | Typical Tunisian wedding list |
| Guest → future customer | 0.5% | Guests are wedding-age and in-market; long lag |
| Viral coefficient (k) | ≈ 0.5, 4–6 month lag | **Requires the brand mark on the invitation — see §5** |
| Ad spend | **0** | Your stated budget |
| Season weighting | Orders peak Apr–Jul | Invitations precede events by 4–8 weeks |

Growth comes from four free channels only: the invitation viral loop, vendor
partnerships paid in commission, organic TikTok/Instagram from the 16 films you
already own, and Facebook wedding groups.

### Month by month — orders, and gross revenue in TND

| Month | Conservative | | Base | | Optimistic | |
|---|---:|---:|---:|---:|---:|---:|
| | orders | TND | orders | TND | orders | TND |
| **Aug 2026** | 0 | 0 | **1** | **129** | 2 | 258 |
| Sep 2026 | 1 | 129 | 3 | 387 | 6 | 774 |
| Oct 2026 | 2 | 258 | 5 | 645 | 9 | 1,161 |
| Nov 2026 | 3 | 387 | 6 | 774 | 11 | 1,419 |
| Dec 2026 | 4 | 516 | 8 | 1,032 | 12 | 1,548 |
| **2026 total** | **10** | **1,290** | **23** | **2,967** | **40** | **5,160** |
| Jan 2027 | 4 | 516 | 9 | 1,161 | 16 | 2,064 |
| Feb 2027 | 5 | 645 | 11 | 1,419 | 20 | 2,580 |
| Mar 2027 | 6 | 774 | 15 | 1,935 | 27 | 3,483 |
| Apr 2027 | 9 | 1,161 | 22 | 2,838 | 39 | 5,031 |
| May 2027 | 12 | 1,548 | 30 | 3,870 | 53 | 6,837 |
| Jun 2027 | 15 | 1,935 | 36 | 4,644 | 63 | 8,127 |
| **Jul 2027** | 16 | 2,064 | **38** | **4,902** | 67 | 8,643 |
| Aug 2027 | 12 | 1,548 | 28 | 3,612 | 49 | 6,321 |
| Sep 2027 | 7 | 903 | 16 | 2,064 | 28 | 3,612 |
| Oct 2027 | 5 | 645 | 12 | 1,548 | 21 | 2,709 |
| Nov 2027 | 4 | 516 | 12 | 1,548 | 21 | 2,709 |
| Dec 2027 | 5 | 645 | 15 | 1,935 | 26 | 3,354 |
| **2027 total** | **100** | **12,900** | **244** | **31,476** | **430** | **55,470** |
| **Rolling 12 mo** (Aug 26 – Jul 27) | **75** | **9,675** | **184** | **23,736** | **330** | **42,570** |

### Reading the numbers

**This month.** 0–2 orders, around 130 TND. The season is over and you have no
audience, no domain and no reviews. Any forecast promising more than that for August
2026 is guessing.

**The coming months (Sep–Dec 2026).** ~2,970 TND base case across four months. This
period is not a revenue period. Its job is to fix the five blockers, put eight real
invitations into eight real weddings, and collect the photographs and testimonials
that make the 2027 season sellable.

**The year.** **~23,700 TND gross over the next twelve months**, base case, with a
realistic range of **9,700 to 42,600 TND**. In 2027 as a calendar year, ~31,500 TND.

**Per hour, which is the number that actually matters.** 184 orders × 3 h ≈ 552 hours
→ **≈ 43 TND per hour**, averaging ~11 h/week across the year. That is a genuine
second income from a part-time business with near-zero capital at risk.

**Where it breaks.** Base-case July 2027 is 38 orders ≈ 114 hours ≈ **28 h/week**,
just past the 25 h/week ceiling you set. The optimistic case (67 orders in July) needs
**~50 h/week** and is simply not deliverable by one person. **Growth in this business
hits a labour wall before it hits a demand wall** — which is the strongest argument
for the levers in §6.

---

## 5. What we need next — five blockers

These are ordered. Each one either creates legal exposure, blocks revenue, or
disables the growth plan you chose.

### 1. Music licensing — the one that can end the business
`public/js/shared/films.js` names the soundtracks in its own comments: **Amr Diab
(الليلة), Elissa, Hussein Al Jasmi (فستانك الأبيض), Ed Sheeran (Perfect), Christina
Perri (A Thousand Years), Ludovico Einaudi (Nuvole Bianche)**. Thirteen 60-second
excerpts ship in `public/media/snd/`.

Two separate consequences:

- **Legal.** You are selling a commercial product built on unlicensed commercial
  recordings, from a public repo, under your own name and phone number.
- **Practical, and it kills the plan you chose.** Instagram and TikTok rights
  management will mute, block or geo-restrict exactly the clips you intend to post.
  Your entire zero-budget growth plan is organic video. Unlicensed audio switches it
  off before you start.

**Fix:** re-score every film from a commercially licensed library. Free route
(Pixabay Music, YouTube Audio Library, Free Music Archive CC0) costs **0 TND** and
works from day one. Paid route (Artlist or Epidemic Sound, ~199–299 USD/year ≈
**620–930 TND**) sounds meaningfully better. Start free; upgrade once revenue passes
~3,000 TND.

### 2. The diaspora cannot pay you
D17, Flouci and RIB are Tunisia-only. Integrate **Konnect** (1.3% local / 2.9%
international, free to register) so a card from Paris or Milan works. This is the
single change that opens your best-fit segment. It also removes the
screenshot-on-WhatsApp step that loses local customers at checkout.

### 3. Your advertising channel is switched off
I searched the delivered invitation for any brand mark, footer or link
(`16-editorial-invitation.js`, `17-wax-envelope.js`) — **there is none, and there is
no referral mechanism anywhere in the codebase.**

Think about what that means. Every invitation you sell is opened by 150–300 people,
on their phones, most of them at wedding-going age, at the exact moment they are most
impressed by it. **Not one of them can find out who made it.**

With no ad budget, this loop *is* your marketing. A single restrained line at the foot
of the guest view — «صُنعت بحبّ · فرحة» linking to the site — plus a referral credit
for the couple, is the highest-return change available in the entire project and it
costs nothing but an afternoon. The forecast above **assumes this exists**; without it,
drop to the conservative column.

### 4. Personal data in a public repo
`public/js/site/12-dashboard-control-bridge.js:31` hardcodes `wa:'21655787973'`,
`d17:'55787973'` and a full RIB as shipped defaults, in a public GitHub repository.
Move them to dashboard config or environment variables.

### 5. Bandwidth will fail exactly when you succeed
`public/media/` holds **42 MB of committed video and audio**, and the hero plays five
clips at once (`05-landing.js`). A landing visit can pull 10 MB+. Netlify's free tier
is 100 GB/month — roughly **10,000 landing visits**. One TikTok that lands takes the
site down mid-campaign, on the day it's working.

**Fix:** re-encode to H.265/AV1 targeting <800 KB per hero clip, serve posters first
and only decode on interaction, and put media behind Cloudflare's free CDN.

---

## 6. Limitations — the structural ones

These aren't bugs. They are the shape of the business, and they cap it.

**Revenue is tied to your hours.** There is no self-serve editor. Every invitation is
minted by hand from the dashboard. This is a service business wearing a product's
clothes: the margins are excellent and the ceiling is hard. At 15–25 h/week, your true
capacity is **40–50 orders/month**, and the base case reaches that in peak season.

**The market shrinks ~9% a year.** 110k marriages in 2014 → 78k in 2023 → 71k in 2024.
Growing inside a contracting market means taking share, and taking share means the
product has to be visibly better — which, fortunately, it is.

**A cheaper competitor is already there.** Invitio at 89 DT. Every month you spend not
building a portfolio of real weddings is a month they spend building theirs.

**No trust signals exist yet.** No domain, no Instagram, no TikTok, no Google
presence, no reviews, no photographs of a real Tunisian wedding using a Farha
invitation. For a taste-based purchase this is the binding constraint on conversion —
more than price, more than features.

**The free infrastructure tiers will run out.** Supabase free gives 500 MB database
and 1 GB storage; customer photo and music uploads will fill that within a season.
Supabase Pro is 25 USD/month (~78 TND).

**One author, no tests, no CI.** 50 commits, one contributor, no `.github/` directory,
no test suite. Fine today. It becomes a risk the moment you're delivering 38
invitations in a month and a regression ships on a Friday in July.

**Brand name is generic.** فرحة is an everyday Arabic word for joy, and `far7a.com` is
already in use by others. SEO and trademark will both be uphill. Not urgent, but it
argues for building on Instagram/TikTok handles and WhatsApp rather than on search.

---

## 7. Is this a good project?

**Yes as a high-margin, part-time, craft-led service business. No as a venture-scale
startup.** Both halves matter.

**What is genuinely good about it:**
- **Near-zero capital at risk.** Total year-one cash cost is ~1,200–1,700 TND. If it
  fails you have lost roughly one week's wages and gained a portfolio.
- **96–97% gross margin**, and it is cash-positive from the first sale.
- **A real product advantage.** The film, the wax seal, the per-guest greeting and the
  WhatsApp unfurl are better than what the local competition ships. That is not a
  marketing claim; it is in the code.
- **A built-in distribution loop** that no printed-card business can copy — once it's
  switched on.
- **Trilingual and RTL-first from the start**, which makes the diaspora market a
  configuration change rather than a rewrite.

**What is honestly not good about it:**
- A shrinking market, entered at the end of its season, against an established
  cheaper competitor.
- Revenue capped by one person's hours until a self-serve editor exists.
- An unlicensed-music dependency sitting under the whole catalogue.
- Roughly 24,000 TND in year one, base case. Real money for a side business; not a
  salary, and not a company you could hire into.

**The verdict:** build it, on the terms above — near-zero cash, 2027 season as the
real launch, the next seven months spent on the five blockers and on getting eight
real weddings into the portfolio. Judge it in September 2027. If the rolling twelve
months has cleared **~20,000 TND** with the loop working, the next decision is whether
to build the self-serve editor and break the labour ceiling. If it has cleared under
**8,000 TND**, the loop didn't fire and the honest move is to keep it as a boutique
service for referrals only, not a business to scale.

---

## 8. The three levers that cost nothing

Ranked by return per hour of work. None of them requires a customer you don't already
have, or a dinar you haven't already spent.

### Lever 1 — Sell the whole wedding, not one invitation
A Tunisian wedding is a **3-to-7-day event**: save-the-date, henna night, the wedding
itself, sometimes an outdoor day. You already have films for all of them
(`cat:'save'`, `'henna'`, `'wed'` in `films.js`) and you already sell them
individually.

Sell them as one package. A three-invitation set at, say, 249 DT instead of 297 DT
reads as a discount to the customer and **triples order value** for you — with one
conversation, one customer, and maybe 60% of the labour of three separate sales.

**Effect on the base case: +40–60% revenue with no new customers.** This is the
single most valuable line in this document.

### Lever 2 — Shift the mix toward Signature
Blended AOV is 129 DT at an 80/20 mix. At **60/40 it becomes 159 DT — +23% revenue
from the same number of customers.** The way to do it is not to discount Signature but
to make the Collection page show what Signature does differently, and to keep the
scarcity honest ("a few each month" is already in the copy).

### Lever 3 — Switch the viral loop on
See blocker 3. A brand mark on the guest view plus a referral credit. One afternoon of
work. The difference between the conservative and base columns in §4 is essentially
this one change.

---

## 9. Sources

- Marriage statistics — [webdo.tn](https://webdo.tn/en/actualite/national/tunisia-weddings-and-births-in-free-fall-demography-rocks/396349/) · [Times of Tunis](https://timesoftunis-1.ghost.io/tunisian-men-now-marry-at-35-on-average-as-economic-pressure-and-shifting-values-push-back-the-wedding-age/) · [Statista](https://www.statista.com/statistics/1185217/number-of-marriages-in-tunisia/)
- Wedding season, structure and cost — [Carthage Magazine](https://carthagemagazine.com/tunisian-wedding/) · [Fanack](https://fanack.com/tunisia/culture-of-tunisia/tunisian-weddings-a-tale-of-tradition-and-modernity/)
- Diaspora — [Tunisian diaspora](https://en.wikipedia.org/wiki/Tunisian_diaspora) · [Carthage Magazine](https://carthagemagazine.com/tunisians-abroad/)
- Digital penetration — [DataReportal Digital 2026: Tunisia](https://datareportal.com/reports/digital-2026-tunisia)
- Payment gateway fees — [web6.tn comparatif](https://web6.tn/blog/paiement-en-ligne-tunisie-comparatif/) · [Smartegy](https://smartegy.tn/les-moyens-de-paiement-e-commerce-en-tunisie-ou-en-est-on-en-2025/)
- Competitor pricing — [Invitio.io](https://invitio.io/)
- Meta ad benchmarks (context only, no spend planned) — [Adamigo country benchmarks](https://www.adamigo.ai/blog/meta-ads-cpm-cpc-benchmarks-by-country-2026)

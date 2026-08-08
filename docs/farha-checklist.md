# فرحة Farha — Costed Action Checklist

Ordered by what must happen first. Every item has a price in TND, an honest effort
estimate, and a deadline tied to the 2027 wedding season. Background in
[`farha-business-analysis.md`](./farha-business-analysis.md); the campaign itself in
[`farha-launch-plan.md`](./farha-launch-plan.md).

**Total cash to reach the 2027 season: ~1,200–1,650 TND.**
**Total time: ~550 hours across twelve months.**

---

## 🔴 Blockers — nothing gets published until these are done
*Target: done by 31 October 2026*

| # | Task | Cost | Effort | Deadline | Why |
|---|---|---:|---:|---|---|
| 1 | **Re-score all 16 films with licensed music.** Replace the Amr Diab / Elissa / Ed Sheeran / Christina Perri / Einaudi excerpts in `public/media/snd/` and the comments in `public/js/shared/films.js`. Free route: Pixabay Music, YouTube Audio Library, Free Music Archive (CC0). | **0** | 12 h | 30 Sep | Legal exposure on a commercial product — **and** TikTok/Instagram will mute exactly the clips your whole free growth plan depends on |
| 2 | **Add the brand mark to the guest invitation view.** One restrained line at the foot of `16-editorial-invitation.js` — «صُنعت بحبّ · فرحة» — linking to the site with a UTM tag. Currently absent. | **0** | 2 h | 30 Sep | 150–300 guests open every invitation and none can find out who made it. On a zero-cash budget this *is* the marketing |
| 3 | **Add a referral credit.** Couple gets 20 DT back per referred sale; unique code per invitation. | **0** | 6 h | 15 Oct | Makes the loop measurable and gives the couple a reason to name you |
| 4 | **Integrate Konnect.** Register, add the payment link flow, Supabase Edge Function for the webhook to flip orders to `مدفوع` automatically. 1.3% local cards/e-dinar, 2.9% international. | **0** to register | 10 h | 31 Oct | The diaspora — your best-fit segment — literally cannot pay you today. Also removes the screenshot-on-WhatsApp step that loses local buyers |
| 5 | **Remove personal data from the public repo.** `wa`, `d17` and the RIB are hardcoded at `12-dashboard-control-bridge.js:31`. Move to dashboard config / env vars. | **0** | 1 h | 15 Sep | Your phone number and bank account are in a public GitHub repository |
| 6 | **Fix the media weight.** Re-encode `public/media/inv/*.mp4` to H.265/AV1 under 800 KB per hero clip, poster-first with decode on interaction, media behind Cloudflare's free CDN. Currently 42 MB committed with 5 clips on the hero. | **0** | 8 h | 31 Oct | Netlify free is 100 GB/month ≈ 10,000 landing visits. One TikTok that lands takes the site down on the day it's working |

**Blocker subtotal: 0 TND · ~39 hours**

---

## 🟠 Foundations — the business needs these to look like a business
*Target: done by 30 November 2026*

| # | Task | Cost | Effort | Deadline |
|---|---|---:|---:|---|
| 7 | Buy and connect the domain (`.tn` or `.com`) | **40–60** | 1 h | 30 Sep |
| 8 | Create Instagram + TikTok accounts, claim handles, write bios in AR/FR | 0 | 2 h | 30 Sep |
| 9 | **Deliver 8 free seed invitations** to real couples marrying Sep–Dec. Choose for guest-list size. | 0 | 24 h | 15 Dec |
| 10 | Collect from each: photographs, a clip of it being opened, and a written testimonial in AR + FR | 0 | included | 31 Dec |
| 11 | Add a legal page section on music licensing once #1 is done | 0 | 1 h | 31 Oct |
| 12 | Set up UTM tracking + a simple weekly metrics review | 0 | 2 h | 15 Nov |

**Foundations subtotal: 40–60 TND · ~30 hours**

---

## 🟡 Revenue levers — highest return per hour in the whole project
*Target: live by 31 March 2027, before the season*

| # | Task | Cost | Effort | Effect |
|---|---|---:|---:|---|
| 13 | **Build the wedding package** — save-the-date + henna + wedding as one price (~249 DT vs 297 DT separately). Films for all three already exist in `films.js`. | 0 | 6 h | **+40–60% revenue, no new customers** |
| 14 | **Rework the offers page to sell Signature harder** — show what 249 DT buys that 99 DT doesn't. Keep the "a few each month" scarcity, it's true. | 0 | 4 h | Mix 80/20 → 60/40 lifts blended AOV 129 → 159 DT, **+23%** |
| 15 | **Public booking calendar** showing slots filling | 0 | 5 h | Honest scarcity; strongest conversion tool you have |
| 16 | French-language landing route for the diaspora | 0 | 4 h | Opens ~669k Tunisians in France, ~189k in Italy |
| 17 | Templatised intake form — all three languages captured at once | 0 | 3 h | Cuts labour per order, which is your real constraint |

**Levers subtotal: 0 TND · ~22 hours**
*These five items are worth more than every marketing dinar in this document.*

---

## 🟢 Publication — the campaign itself
*Running November 2026 → August 2027*

| # | Task | Cost | Effort | When |
|---|---|---:|---:|---|
| 18 | Cut 100+ vertical clips from the 16 films you already own | 0 | 15 h | Nov 2026 |
| 19 | Post 4–5×/week on TikTok + Instagram Reels, Arabic-first captions | 0 | 4 h/wk | Nov 26 → Aug 27 |
| 20 | Join Tunisian wedding/bride/marketplace Facebook groups; be useful for a month before mentioning yourself | 0 | 2 h/wk | Nov 26 onward |
| 21 | Sign 5–10 vendor partners (photographers, halls, planners, makeup, florists) at **20% commission, paid from revenue** | **0 up front** | 12 h | Dec 26 → Feb 27 |
| 22 | Give each partner a free invitation for their own use | 0 | 4 h | as signed |
| 23 | Diaspora outreach in French — Tunisian community groups in France and Italy | 0 | 2 h/wk | Mar 27 onward |
| 24 | Boost only already-proven posts | **300–350** | 3 h | Phases 1–3, peaking Apr–Jul |
| 25 | Ask every delivered customer for one clip of the invitation on a phone at their wedding | 0 | ongoing | throughout |

**Publication subtotal: 300–350 TND · ~200 hours**

---

## 🔵 Running costs

| Item | Cost | When |
|---|---:|---|
| Domain renewal | 40–60/yr | annual |
| Netlify + Cloudflare | 0 (free tiers) | — |
| Resend email | 0 (free tier) | — |
| Supabase Pro — 25 USD/mo, once uploads fill the 1 GB free tier | ~78/mo from ~month 6 → **~550** | Mar 2027 onward |
| Konnect fees, 1.3% local / 2.9% international, on ~23,700 TND | **~310–690** | as earned |
| Vendor commissions, 20% of referred sales | paid from revenue only | as earned |
| *Optional:* Artlist/Epidemic Sound upgrade | *620–930/yr* | only after 3,000 TND revenue |

---

## Totals

| | Cash (TND) | Hours |
|---|---:|---:|
| 🔴 Blockers | 0 | 39 |
| 🟠 Foundations | 40–60 | 30 |
| 🟡 Revenue levers | 0 | 22 |
| 🟢 Publication | 300–350 | 200 |
| 🔵 Running costs (12 mo) | 860–1,240 | — |
| Order fulfilment, 184 orders × 3 h | — | 552 |
| **Total** | **1,200–1,650** | **~840** |

Against base-case revenue of **~23,700 TND** over twelve months, cash cost is **5–7%
of revenue**. Effective return on your time ≈ **43 TND/hour**.

---

## The one-page version

**Do first, this month:** remove your phone and RIB from the public repo (1 h), add
the brand mark to the invitation (2 h), buy the domain (50 TND).

**Do by end of October:** re-score the music, integrate Konnect, fix the video weight.
Nothing gets published until these three are done.

**Do by end of December:** eight free invitations at eight real weddings, and come
away with photographs and testimonials.

**Do by end of March:** the wedding package, the Signature rework, the booking
calendar. These are worth more than every dinar of advertising in this plan.

**Then sell, April to July 2027.** That is the year.

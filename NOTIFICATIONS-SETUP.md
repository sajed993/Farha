# 🔔 Farha — Notifications setup (real, mostly free)

You now have THREE layers of new-order alerts:

## 1. In-dashboard (works immediately, zero setup)
When the dashboard is open, a new order triggers: a toast, a flashing
browser-tab title (🔔 طلب جديد!), a sound, and a desktop notification
(if you clicked "Allow" when the browser asked). Nothing to configure.

## 2. Email per order — FREE (recommended)
Uses Resend's free tier (3,000 emails/month).
1. Sign up: https://resend.com  → create an API key.
2. In Netlify → Site settings → Environment variables, add:
   - `RESEND_API_KEY` = re_xxxxxxxx
   - `OWNER_EMAIL`    = your@email.com
   - `FROM_EMAIL`     = onboarding@resend.dev  (or your verified domain)
3. Redeploy. Done — every order emails you automatically.
If these vars are missing, the site just skips email silently (no errors).

## 3. SMS to your phone — NOT free (optional)
Honest truth: there is no free SMS API anywhere. Cheapest realistic options
for Tunisia are ~0.03–0.05 DT per message via Twilio/Vonage. If you want it,
it's the same pattern as the email function — tell me and I'll add an SMS
function, but you'll need a paid Twilio/Vonage account. My recommendation:
rely on email (free) + the dashboard alerts, and add SMS only if you find
you're missing orders.

## Note on WhatsApp
A free "WhatsApp message to yourself per order" isn't reliably possible
without Meta's WhatsApp Business API (approval + cost) or a paid gateway.
Email is the free, dependable choice.

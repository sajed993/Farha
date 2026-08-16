---
name: better-ui
description: The house standard for anything a guest or the owner touches in Farha — what to build, how to verify it, and the rules the product is held to. Start here; it points at better-typography, better-colors, better-layout and better-accessibility.
---

# Building UI in Farha

Farha sells one thing: an invitation that opens like a film. The guest is on a
phone, one hand, often outdoors. The owner is one person running a business
from a dashboard. Every decision answers to those two.

## The four that go with this one

Load the specific skill when the work is specific:

- **better-typography** — any text, any language, anything drawn on canvas
- **better-colors** — any surface, any theme, any contrast question
- **better-layout** — any positioning, especially inside the invitation
- **better-accessibility** — any control, before anything ships

## Standing rules

These are the owner's, not preferences. Do not quietly relax them.

1. **No food or allergy content inside an invitation.** Ever.
2. **One song per film, never reused.** A check enforces it; it has already
   caught a mistake.
3. **The weddings are finished.** Ten of them, and they read correctly. Changes
   aimed at other occasions must not touch them.
4. **The website's outside design is loved.** Improve the invitation interior
   unless the site is explicitly the subject.
5. **The invitation is the product.** It gets the care; the dashboard gets the
   clarity.

## How this codebase is built

No build step for the site itself: numbered classic scripts in
`public/js/site/`, loaded in order by `index.html`. Numbers *are* the
dependency graph.

**A duplicate `const` in a classic script throws and takes the whole file with
it.** `EDI_ICONS` declared twice made the entire invitation stop existing.
Before naming a new global, grep for it.

Shared with the dashboard: `public/js/shared/` — the catalogue, the marks, the
wax. If the site and the dashboard both need to know a thing, it lives there,
or they drift.

Per-film settings flow: catalogue default → `readyCfg(id)` dashboard override →
`S.c` → the invitation. **A stored override beats the film**, which is correct
and has twice looked like a bug. Whatever a screen stores, that screen must
also show.

## Verification is not optional

The house method, in order of authority:

1. **Measure the DOM** — geometry, computed styles, event counts.
2. **Measure the pixels** — screenshot and read them. Every serious bug in this
   project was invisible to the first and obvious in the second: a 390px-wide
   window that passed 14/14 behaviour checks; a whole section still in daylight
   that the contrast audit could not see because it was painted with a
   gradient.
3. **Look at it.** Then look at it at 360px.

Suites live in the session scratchpad and run through `shot.mjs` /
`multishot.mjs` against `serve.mjs` on :5178. **The server dies between
sessions — restart it first.**

Write the assertion against the *fact*, not the *timing*. Wait for the element,
never for a duration; `waitEdi()` is the pattern. Three suites once reported a
new feature as a fault because they slept 3.2s and it took six.

**When a test fails, decide honestly whether the test or the code is wrong** —
and say which. Several assertions here were stale, vacuous, or measuring
startup instead of the thing they claimed. A test that cannot fail is worse
than no test.

## Before you call it done

- Both themes.
- 360 / 390 / 1280.
- Three languages if it has text.
- Keyboard.
- Reduced motion.
- Then re-run every suite, not just the new one.

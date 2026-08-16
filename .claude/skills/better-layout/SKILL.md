---
name: better-layout
description: Lay things out in Farha without the CSS traps this codebase has already hit — specificity, stacking, transformed ancestors, and full-bleed overlays. Use when positioning anything, especially inside the invitation or an opening screen.
---

# Layout

The invitation is a stack of full-screen sections inside a fixed scroller, with
overlays above them. Almost every layout bug here has come from one of five
things. Check them before writing the rule.

## The five traps, all of which have bitten

**1 · Specificity, against rules you did not write.**
`.wenv.es-bleed .wenv-env` is `(0,3,0)`. Styling `.es-window .wenv-env` at
`(0,2,0)` loses — silently. The aeroplane window came out 390px wide across the
whole screen and the content overflowed the viewport by 118px, because the
sizing rule never applied. **Before styling an element, grep for every rule
that already targets it and count.**

**2 · An animation beats an inline style.**
`hint.style.opacity = '0'` did nothing for seven opening styles because
`.wenv-hint` carries `animation: wenvPulse`. Kill the animation
(`.hid{animation:none;opacity:0}`), do not fight it.

**3 · A transformed ancestor is a containing block for `position:fixed`.**
`.edi-ph` runs a `transform: scale()` Ken-Burns. A fixed child of it positions
against it, not the viewport. Put fixed layers outside the transformed subtree
— see `.edi-sticky`, a direct child of `.edi`.

**4 · Blanket child selectors catch layers you meant to leave alone.**
`.lay-sticky .edi-s > *:not(.edi-ph){position:relative}` also caught
`.edi-frame` and `.edi-wash`, both `absolute` by design, and collapsed the
frame to **2px wide** — which put its centred crest 17.5px off. Name the
element you mean.

**5 · Full-bleed overlays sit above everything.**
`.es-fib`, `.es-rake`, `.es-vig` are at `z-index: 6`, above the whole stack.
They are an envelope's paper textures; over a photograph they wash it out. If a
new opening style is not made of paper, switch them off.

## The invitation's own shape

- `.edi` — `position:fixed; inset:0; overflow-y:auto`. **It** is the scroller.
- `.edi-s` — `min-height:100svh; overflow:hidden; isolation:isolate`.
- `.edi-in` — the content, `z-index` above the plate and the wash.
- `.edi-frame` / `.edi-wash` / `.edi-ph` — absolute layers. Leave their
  positioning alone.
- `.lay-sticky` — one film fixed behind everything, no plates built at all.

Use `svh`, not `vh`; phone chrome makes `vh` lie.

## Procedure

1. Grep every existing rule for the element and the classes it will carry.
2. Write the rule.
3. **Measure the geometry, do not look at one screenshot.** For each element:
   `getBoundingClientRect()`, plus `scrollHeight - clientHeight` on the
   container. Assert nothing sits outside the viewport.
4. Do it at **360, 390 and 430** wide. The window bug reproduced at all three
   and would have been caught by any of them.
5. Then screenshot, because geometry that measures correctly can still look
   wrong.

## The sweep

`checks/geometry.js` reports sideways scroll on the site and inside the
invitation, plus anything whose box lands outside the viewport, at whatever
width you run it. Deliberate bleed — drifting petals, `.rd-bleed` — shows up
too; read it, do not just count it.

It caught the close button being knocked out of `position:fixed` by a rule
added two minutes earlier, which is trap 1 in this very file.

## The lesson worth repeating

Behaviour tests pass while layout is broken. The aeroplane window scored 14/14
on "does the shade lift, do the views change" while being 390px wide with the
page overflowing behind a fixed overlay. **If you change layout, assert
geometry.** `winfit.js` is the pattern.

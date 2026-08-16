---
name: better-accessibility
description: Make Farha usable — contrast, keyboard, screen readers, motion, and the RTL specifics. Use when adding any control, section or theme, and before shipping anything a guest touches.
---

# Accessibility

The guests are the audience: a phone, one hand, often outdoors, often an older
relative. This is not a compliance exercise.

## Contrast

Targets: **4.5:1** body, **3:1** for ≥24px or ≥18.66px bold.

Measure it, do not judge it. The three passes and their blind spots are in
`better-colors`. In short: the DOM audit is blind to gradients, and over a film
only pixels are honest.

Two numbers this project has produced that should never recur: the hero
headline at **1.09:1** in dark mode, and the sticky-layout text at **1.04:1**.
Both looked fine in code.

**A thing that is deliberately hidden is not a contrast failure** — the day
name under an unscratched wax seal measures 3.39:1 and is supposed to. Say so
rather than "fixing" it.

## Keyboard and focus

- Every control is a real `<button>` or `<a>`. A `<div onclick>` is not
  reachable and not announced.
- Give focus a visible state: `:focus-visible{outline:2px solid var(--gold);
  outline-offset:3px}`. `.theme-btn` and `.edi-wa` are the pattern.
- Do not remove outlines to tidy a design.

## Screen readers, in Arabic

- Decorative SVG: `aria-hidden="true" focusable="false"`. Every mark in
  `EDI_MARKS` and every drawn ornament is decorative.
- An icon-only button needs `aria-label` **in the current language** — see
  `.theme-btn`, which relabels on toggle *and* on language change.
- A toggle carries `aria-pressed` and updates it. `themeMarkButtons()` is the
  worked example.
- Modals: `role="dialog" aria-modal="true"`, focus the first field, `Esc`
  closes. `openRsvp()` in `19-forms.js`.
- `<html lang>` and `dir` are set by `toggleLang()`. Anything that renders text
  must follow, or a screen reader reads Arabic with a French voice.

## Motion

Guests get films, Ken Burns, a lifting shade, confetti. All of it must stop:

```css
@media (prefers-reduced-motion: reduce){ /* transition:none; animation:none */ }
```

`lazyvWatch()` already bails entirely on reduced motion, `saveData`, and 2G.
Respect all three — data is money on a Tunisian phone plan.

## RTL specifics

- Use `inset-inline-start/end`, `margin-inline`, `padding-inline` — never
  `left`/`right` — for anything that must mirror.
- `text-align: start`, not `left`.
- Physical `inset` is correct for something that should **not** mirror (a
  full-bleed overlay).
- Check both directions; `toggleLang()` flips `dir` live without a reload.

## Touch

- 44×44 minimum. `.theme-btn` is 38px and only survives because it sits in a
  padded row — do not go smaller.
- `-webkit-tap-highlight-color: transparent` only where a custom press state
  replaces it.

## The audit

`checks/audit.js` is the sweep, run through `shot.mjs` against the local
server. It reports clickable non-controls, unlabelled icon buttons, tap targets
under 44px (counting a pseudo-element hit area), and decorative SVG a reader
would try to announce.

It has been wrong three times and each correction is worth knowing: an
`aria-hidden` **ancestor** already hides a subtree; a `div` with `role=button`
and `tabindex` **is** a control; and an inline link inside a sentence is not a
tap target with a size of its own. When it flags something, first decide
whether the check or the code is wrong.

## Procedure

1. Add the control with real semantics from the start.
2. Label it in three languages.
3. Measure contrast in **both** themes.
4. Tab through it.
5. Turn on reduced motion and confirm it is still usable, not just still.

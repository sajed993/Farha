---
name: better-typography
description: Set type for Farha — Arabic-first, three languages, RTL. Use when adding or changing any text on the site, inside an invitation, or drawn on a canvas (share cards, wax seals, reels). Covers the Arabic traps that look fine in code and wrong on screen.
---

# Type, in an Arabic product

Farha is Arabic first, French and English second. Almost every typographic bug
found in this codebase has been an Arabic bug that a Latin eye would not catch.
Read this before touching text.

## The faces already in the project

Declared in `public/css/site.css` `:root`:

| token | face | for |
|---|---|---|
| `--dispA` | Aref Ruqaa | Arabic display — names, headlines |
| `--serifA` | Amiri | Arabic body serif |
| `--bodyA` | IBM Plex Sans Arabic | Arabic UI and body |
| `--dispL` | Fraunces | Latin display |
| `--bodyL` | Karla | Latin body |
| `--num` | Fraunces | **numerals in every language** |

`--disp`, `--body`, `--serif` switch per language via `html[dir=ltr]`. Use the
generic ones; reach for `--dispA` only when a thing must stay Arabic whatever
the language is.

Per-film faces live in `EDI_WORDS`/`font-*` classes: `kufi`, `amiri`, `cairo`.
Weddings deliberately keep Aref Ruqaa — do not "improve" them.

## Rules that are not style preferences

**Never letter-space Arabic.** Canvas has no `letter-spacing`, and the obvious
workaround — inserting a hair space between characters — **severs the cursive
joins**. `عيد ميلاد` became a row of disconnected letters this way. In CSS,
`letter-spacing` on Arabic does the same thing. It is only ever for Latin.

**Direction follows the string, not the digits in it.**
- `14 سبتمبر 2026` is an RTL string containing Latin digits → `direction: rtl`.
  Forcing `ltr` reordered it to `سبتمبر 14 2026`.
- A phone number among Arabic is a Latin run → `direction: ltr`, or it renders
  `973 787 55`.
- On canvas set `ctx.direction` explicitly; the default inherits from nothing
  on a detached canvas.

**Numerals.** Arabic-Indic in Arabic (`toAr()`), Latin elsewhere — the helpers
already exist (`rdNum`, `toAr`). Latin digits in a column want
`font-variant-numeric: tabular-nums`.

**Arabic plurals have four forms** — one / pair / 3–10 / 11+. `notifCount()` in
`public/js/admin/07-notifications.js` is the worked example. «قبل 2 ساعات» and
«قبل 8 دقيقة» are both wrong.

**Line height.** Arabic needs more than Latin — the project sits at 1.85–1.95
for body. Do not copy a Latin 1.5 into an Arabic block.

## Procedure

1. Name the language(s) the string appears in. If it is user-visible it needs
   all three — `public/js/site/01-i18n-ar-fr-en.js`, three blocks.
2. Pick a token, never a raw family.
3. If it is drawn on canvas: load the face first
   (`await document.fonts.load('700 88px "Aref Ruqaa"')`) or it silently falls
   back, then set `direction` per the rule above.
4. **Render it and look.** Every Arabic type bug in this project was invisible
   in the code and obvious in a screenshot.
5. Check it at 360px wide. Arabic display faces are wide; long names wrap or
   overflow where Latin would not — `ogcFit()` in `10-share-card.js` is the
   shrink-to-fit pattern.

## Where the examples are

- Canvas Arabic done right: `public/js/admin/10-share-card.js`
- Per-occasion voice: `EDI_WORDS` in `public/js/site/16-editorial-invitation.js`
- Four-form plurals: `public/js/admin/07-notifications.js`

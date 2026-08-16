---
name: better-colors
description: Choose and apply colour in Farha — the token system, the two themes, and the per-film invitation palettes. Use when adding any surface, text colour, gradient or theme rule, or when something looks wrong in dark mode.
---

# Colour

Three palettes coexist and they are not interchangeable. Know which one you are
in before you write a single hex value.

## 1 · The site palette

`:root` in `public/css/site.css`. Everything on the marketing site reads from
these — 876 `var()` references, which is why a theme is a second set of values
rather than a second stylesheet.

Redefined under `html[data-theme=dark]`. The dark values were **sampled off a
reference the owner supplied**, not invented: `#19110B` ground, `#A2454F`
fills. Warm brown-black, never neutral grey — the whole brand is in the amber
family and a grey ground beside it reads as a different site.

## 2 · The invitation palettes

`.edi-veil-root.pal-<film>` — one per film, each **measured off that film's own
footage**. `--gold`, `--blush`, `--plum`, `--sage`, `--wax` are photographic
facts about the film. **Do not change them to fix a contrast problem.** Change
the paper.

## 3 · The wax colours

`WAX_COLS` in `public/js/shared/wax.js`, plus 22 photographed seals. Shared
with the dashboard so the picker and the invitation cannot drift.

## Tokens that do two jobs — the trap

A token named for a *colour* rather than a *role* will eventually need to move
in two directions at once. Two are already split; expect more:

| token | role | in dark |
|---|---|---|
| `--paper` | the light **ink** on the permanently dark bands (`#open`, `.footer`) | **stays light** |
| `--card` | a raised **surface** | goes dark |
| `--inv-bg` / `--inv-ink` | the inverse pill (dark chip, light text) | swap |

`--paper` was doing both and the first dark mode broke 14 surfaces. Before
overriding a token, count `color:var(--x)` against `background:...var(--x)`.

**The gold ramp is named for depth on paper and reads upside down on ink.**
`--gold-lo` is the *deepest* gold and it is what every invitation headline is
set in. In dark it points at `--gold-hi`. Overriding `--ink` alone and leaving
`--gold-lo`/`--ink-mute` made contrast *worse* than doing nothing — 1.04:1.

## Procedure

1. Decide which palette you are in.
2. Use a token. A raw hex in a component is how `#ready`, the nav glass and the
   filter chips ended up stuck in daylight while the rest of the page turned.
3. Write the light value, then the dark value, then **measure both**.
4. Never define a colour only inside `@media (prefers-color-scheme)` or only
   inside `[data-theme]`.

## Measuring, not guessing

Contrast has to be read off the rendered page:

- **The DOM audit** (`darkaudit.js` pattern): walk elements, compute the
  effective background by climbing until something is opaque, compare with the
  computed `color`. Fast, but **it reads `background-color` and is blind to
  gradients** — this is exactly why `#ready`, the whole film shelf, stayed in
  daylight and no test noticed.
- **The gradient sweep**: pull every colour out of every `background-image`
  gradient and flag bright ones. Catches what the first misses.
- **The pixel measurement**: screenshot, crop each text element's box, take the
  computed text colour against the median luminance of the crop. This is the
  only honest number over a photograph or a film. Percentile-based estimates
  moved 1.5 points on a percentile change — do not trust them.

Targets: 4.5:1 body, 3:1 for ≥24px or ≥18.66px bold.

## If text sits on moving footage

A gradient scrim cannot guarantee contrast against footage you do not control —
a bright frame always arrives. Give the type a defined surface. See
`.lay-sticky .edi-in::after`, and check it **at the film's brightest moment**,
not at whatever frame happened to be up.

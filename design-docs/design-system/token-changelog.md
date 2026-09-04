# Agentport DS — Token Changelog

How the token system got to its current shape: renames, reworks, dropped tokens, old values and the
reasons behind them. Human-readable, newest first. The **current** state (values, utilities, roles)
lives in [`tokens-reference.md`](tokens-reference.md) — this file is not a data source for ports or
syncs, it exists so that an old name in a run note, a Figma layer or a stale branch can be traced.

Reading aid: `old-neutral/NNN` refers to the grey palette that existed before the 2026-06-17 palette
rework; the ramp that is called `neutral` today was introduced by that rework (and was named `ink`
until 2026-08-31).

---

## 2026-09-04 — `ring` describes the focus border

The `use` sentence of `ring` said "Not a border and not a selection edge". Figma draws the focused
state of every field and control as a **border bound to `ring`** plus the ring/50 outline, so the
sentence contradicted the file it was supposed to describe — the token-column audit surfaced it as
seven identical role texts ("focus border + ring/50") failing the description rule. Resolved in favour
of the Figma reality: the focus border is now named as the legitimate use, and the boundary is drawn
against the *resting* edge (`border` / `input-border`) and the selection edge (`accent-border`) instead
of against the word "border". Pulled through all three places per the "Figma description = `use`" rule
(reference, Figma variable `Focus/ring`, `Colors.tsx`). Value, scopes and utilities are unchanged.

---

## 2026-08-31 — Descriptions audit, grey ramp rename, standalone `muted`

**Descriptions.** Every semantic token, dimension token, text style and effect style now carries
**one English sentence** that is identical in three places: the Figma variable / style description,
the `use` field in `tokens-reference.md`, and the Storybook foundations pages. Before the audit Figma
held a mix of German and English, ten empty descriptions and fourteen that described an earlier state.
The quality rules that came out of it (unambiguous, delimited from neighbouring tokens, semantic instead
of component names, group words never as adjectives) are recorded in the reference's "Rules" block.

**Grey primitive ramp `ink` → `neutral`.** The grey ramp introduced in June was called `ink`, which
collided with the semantic text-role suffix `-ink` (`card-ink`, `muted-ink`, …). Renamed to `neutral`:
Figma `Color/neutral/*` (13 variables, IDs unchanged), CSS `--ap-color-neutral-*`. The semantic suffix
`-ink` is untouched. Because the pre-June palette was also called `neutral`, older notes and tables
mark that one as `old-neutral/…` / `alt-neutral/…`.

**`muted` as a standalone colour.** `Muted/muted` existed in Figma since July without a CSS
counterpart, while `muted-ink` (meant as "text on muted-fill") was used as the generic secondary-text
colour everywhere. Now `muted` is the standalone de-emphasised colour (`--ap-sys-muted`,
`text-muted`, shape fill via `bg-muted`), and `muted-ink` is restricted to the `muted-fill` pair.
60+ call sites moved from `text-muted-ink` to `text-muted`; 120 Figma layers rebound. Consequence for
§6: stock `text-muted-foreground` now translates to `text-muted`, and `bg-muted` is only valid as a
shape / marker fill.

**Smaller changes.**
- `Inverse/inverse-ink/muted` → `Inverse/inverse-ink-muted` (leaf-name rule: the CSS var is built from
  the leaf, a nested group produced an ambiguous name). CSS `--ap-sys-inverse-ink-muted` unchanged.
- `background-fixed` removed from Figma, `tokens.css` and the docs — a theme-invariant white with no
  binding and no call site.
- `inverse-container-hover`: code and docs said 55 %, Figma held 70 %; the Figma value was adopted
  (`deep/900 @ 70%`, `#0d2531b2`).

**Consistency pass (reference ↔ code ↔ Figma).** `use` is now the Figma description verbatim (the SHAPE_FILL
footnotes moved into `note`); chart tokens carry their sentence per row; six utilities the code already used were
added to the crosswalk (`border-ring`, `bg-border`, `bg-primary-ink`, `bg-destructive-ink`, `border-primary-fill`,
`fill-dialog-fill`); `Font/scale` listed among the primitives. Figma side: `Brand/brand-ink` gained `SHAPE_FILL`,
`Primary/primary-fill` gained `STROKE_COLOR` (both already used that way in code), the 79 `Color/*` primitives were set
to scopes `[]` (alias-only, as the architecture states), the text style `Data/md` had its weight bound to
`Data/data-sm/weight` and now binds `Data/data-md/weight`, five `<format>/line-height` variables received the
value-store description the other nine already had, and two descriptions were reworded without an apostrophe
(the Plugin API returns it HTML-escaped). Storybook foundations aligned for scrim, chart-1…5 and elevation.

---

## 2026-07-01 — Inverse family completed, typography re-tiered

**Inverse.** Three new tokens for dark functional surfaces: `inverse-ink-muted` (neutral/400,
de-emphasised text on `inverse-fill`), `inverse-border` (deep/900) and the container trio
`inverse-container` / `-low` / `-hover` (deep/900 at 30 % / 20 % / 55 % — the hover value moved to
70 % on 2026-08-31). The container tokens are raw RGBA in Figma (an alias with alpha is impossible) and
`color-mix` in CSS, like `scrim`. `inverse-ink` moved from neutral/50 to neutral/75.

**Typography.**
- `title`: weight 600 → 800 (extrabold). Affects field titles / legends and dialog titles.
- `label` renamed to `label-md` in Figma; the utility `text-format-label-md` already carried that name,
  so no code churn (50+ call sites).
- `label-sm` new (11px / 500).
- `data-sm` re-tiered: was 11px / 400 / normal tracking, now 9px / 500 / wide — the same primitives as
  `eyebrow`, without the uppercase. Its former 11px role is taken over by the new `data-md`.

---

## 2026-06-19 — `secondary-fill`, brand pair, inset utilities

- `secondary` → `secondary-fill` (the `-fill` convention; value unchanged, still/100). Before the
  June rework it was the stock placeholder `#f5f5f5`. Button and Badge were re-clothed on it.
- `brand-fill` (deep/900) + `brand-ink` (signal/400) new: the on-dark brand moment. Closes the gap that
  the full brand hue signal/400 had no semantic token — the hero had worked around it with an
  arbitrary `var()`.
- The named spacing steps gained the inset family (`top/right/bottom/left`, `inset/inset-x/inset-y`,
  incl. negatives); position offsets now ride the same rhythm as gap and padding. No `--container`
  collision here, because inset has no container scale.

---

## 2026-06-18 — shadcn compat layer dissolved

The Figma group `shadcn Default/` — kept until then as a compatibility layer — was dissolved and the
colour semantics regrouped into `Base/ · Primary/ · Secondary/ · Muted/ · Accent/ · Destructive/ ·
Cards/ · Focus/ · Charts/` (organisational only; the CSS var is always built from the leaf name).

Leaf renames from the same step:
- `overlay` + `popover` consolidated into **one** raised-surface token `dialog`: `overlay-fill` →
  `dialog-fill`, `overlay-ink` → `dialog-ink`; `popover` / `popover-foreground` removed. No `--popover`
  left in the code.
- `card` → `card-fill` (`bg-card` → `bg-card-fill`).

---

## 2026-06-17 — Palette rework + `-fill` / `-ink` / `-border` naming system

**Palette.** The previous `neutral` + `cyan` primitives were replaced by seven OKLCH ramps
(generated with pencilcolor): `signal / still / deep` = the three brand-blue ramps (naming decision
"Signal / Still / Deep"), a de-tinted grey ramp (blue cast removed, chroma × 0.5, extra steps `25` and
`75` — called `ink` at the time, `neutral` since 2026-08-31) and the status family
`success / warning / error`. `neutral/800` became `#1E2229` (brand text, was `#1A2230`).

**Effect colours.** `glow` and `elevation` are bound to the ramps in CSS (`signal/400 @ 50%`,
`neutral/900 @ 18%` via `color-mix`). Figma cannot alias an effect colour onto a ramp (a colour binding
replaces the whole RGBA), so the `Effect/*` primitives there hold raw values (`#0098da` / `#1a2230`).
Decision: code is the source for effect colours; the divergence is accepted, no Figma to-do.

**Naming system.** Surface token = bare name or `-fill`, text / icon = `-ink` (replaces
`-foreground`), edges = `-border`. Since this step the DS colour utilities **diverge** from stock
shadcn — until then only the values were DS-specific, the class names matched. The full migration:

| old | new |
|---|---|
| `background` | `surface` |
| `foreground` | `ink` |
| `card-foreground` | `card-ink` |
| `muted` | `muted-fill` |
| `muted-foreground` | `muted-ink` (old-neutral/600) |
| `accent` (cyan/50) | `accent-fill` |
| `accent-foreground` (cyan/700) | `accent-ink` |
| `input` (neutral/450) | `input-border` |
| `input-background` | `input-fill` |
| `input-placeholder` (neutral/400) | `input-ink-placeholder` |
| `overlay` | `overlay-fill` (→ `dialog-fill` on 2026-06-18) |
| `overlay-foreground` | `overlay-ink` (→ `dialog-ink` on 2026-06-18) |
| `inverse` (neutral/900) | `inverse-fill` |
| `inverse-foreground` | `inverse-ink` |
| `sidebar` | `sidebar-fill` |
| `sidebar-primary` / `sidebar-accent` | `sidebar-primary-fill` / `sidebar-accent-fill` |
| `sidebar-*-foreground` | `sidebar-*-ink` |
| `primary-foreground` (white) | `primary-ink` (signal/100) |
| `secondary-foreground` | `secondary-ink` |
| `destructive-foreground` | `destructive-ink` |

**New:** `primary-fill` (dark action surface, deep/900), `accent-border` (still/200), `input-fill-high`
(neutral/400). **Dropped:** `primary` as a surface — `primary` is now the emphasis tone signal/600
(AA text / stroke, was cyan/500 `#0098da`) and the surface role moved to the separate dark
`primary-fill`.

**Value moves in the same step** (old grey palette → new ramps): `ring` old-neutral/700 →
neutral/800 · `border` old-neutral/200 → neutral/75 · `border-strong` old-neutral/700 → neutral/300
(now lighter) · `scrim` old-neutral/900 → neutral/900 × `scrim-opacity` · `destructive` placeholder
`#e7000b` → error/600. The typography format `input` was renamed to `data-lg`.

---

## 2026-06-11 — Namespace collisions fixed

- **Spacing steps off `--spacing-*`.** The named steps had lived on Tailwind's `--spacing-*`
  namespace, which feeds every sizing utility and resolves before `--container` — `max-w-md` became
  8px instead of 28rem. The steps moved to `@utility` blocks over `--space-step-*`, limited to gap /
  padding / margin; sizing utilities keep the stock container scale.
- **`text-<format>` → `text-format-<format>`.** The earlier format class names collided with
  Tailwind's generated colour utilities: `text-input` was a format class and the colour from
  `--color-input` at the same time (both rules in the CSS). Every composition utility is now
  `text-format-*`.

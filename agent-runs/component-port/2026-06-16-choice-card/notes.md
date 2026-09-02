# Choice Card — Figma component sets (run notes)

**Date:** 2026-06-16
**Scope:** FIGMA-ONLY. Built 3 component sets for the ChoiceCard family. Code already exists
and is the source of truth (`libs/ui/src/components/ui/choice-card/`), untouched here. No git, no
code, no catalog edit (parent updates the catalog from this report).

**File:** `nQSNLASjuLvgTh3we8Dp4s` ("Agentport DS") · Page "Shadcn Components" `3126:2`
**Section:** "Choice Card" `4107:1526` (created via `/figma-create-section`, auto-placed right of
the rightmost existing node). Headline `4107:1527`.

## What was built

Three SETS, each **2 axes — `checked` [off, on] × `state` [default, focus, disabled, invalid,
focus-invalid]** = 10 members (5×2 WRAP grid, checked-major: off row, then on row). **No hover axis**
(per spec). Switch uses control `size=default` only — no size axis on the card.

| Set | setId | checked=off members (default·focus·disabled·invalid·focus-invalid) | checked=on members |
|---|---|---|---|
| `.ChoiceCard/Checkbox` | `4112:1638` | `4110:1535` · `4110:1556` · `4110:1577` · `4110:1598` · `4110:1624` | `4111:1577` · `4111:1602` · `4111:1627` · `4111:1652` · `4111:1682` |
| `.ChoiceCard/Switch` | `4119:1750` | `4117:1638` · `4117:1661` · `4117:1684` · `4117:1707` · `4117:1735` | `4118:1694` · `4118:1717` · `4118:1740` · `4118:1763` · `4118:1791` |
| `.ChoiceCard/Radio` | `4124:1862` | `4122:1750` · `4122:1771` · `4122:1792` · `4122:1813` · `4122:1839` | `4123:1801` · `4123:1826` · `4123:1851` · `4123:1876` · `4123:1906` |

Set props (all three): `checked`, `state`. Controls-live verified (drove checked + state on a fresh
instance of each set, props switched correctly, test instances deleted).

## Anatomy (matches the code)

Each member = a **COMPONENT acting as the FieldLabel card surface** (HORIZONTAL auto-layout) that
**nests a real `.Field` instance**, whose `control` slot holds a **real control instance** matching
(checked, state):

- **Card surface** (the FieldLabel): white fill (unchecked) / primary tint (checked); stroke bound to
  `border` (`VariableID:3038:4`) weight 1 (unchecked); `corner-lg` bound (`VariableID:3073:4`);
  padding `p-md` bound (space-md `VariableID:3070:6`, 8px) — per code `*:data-[slot=field]:p-md`.
  Disabled → card node `opacity 0.5` (`group-data-[disabled=true]/field:opacity-50`).
- **Nested `.Field`** (FILL width, HUG height):
  - non-invalid states → main `3714:1018` (orientation=horizontal, invalid=false, controlPosition=trailing),
    `Show error#3692:20 = false`.
  - invalid / focus-invalid → main `3715:1019` (invalid=true), `Show error = true` → the FieldError
    text shows in the FieldContent column under the description.
  - control slot cleared of its default `.Input` and filled with the control instance.
  - title set via the nested `.Label` instance's `{Label}` text; description set in the description slot.

## Slot-default placeholder copy (2026-06-16, follow-up)

Per the DS placeholder convention (a component's default text must be a `{Semantic}` placeholder, like
`.Label`'s default `{Label}`="{Label}" — never committed copy), **all 30 set members** carry braced
placeholders matching their layer name (name=value):
- title node (layer `{Label}`, in the label slot) → `{Label}`
- description node (layer `{Field Description}`, in the description slot) → `{Field Description}`
60 text nodes updated (30 members × 2). Chose to mirror the layer names (`{Label}` / `{Field
Description}`) rather than card-semantic `{Title}`/`{Description}` — keeps name=value exactly like
`.Label`, and the layer names come from the nested `.Field`/`.Label` instances (can't be renamed
without structural edits to those instances).

**FieldError placeholder (follow-up):** the `{Error Message}` text node — present only in the 4
invalid/focus-invalid members per set (12 total) — also carried committed copy ("Please make a
selection" / "Please select an option"). Set all 12 → `{Error Message}` (name=value, mirrors layer name).
Verified single distinct value. Usage examples don't render errors → nothing to preserve there.

The **permanent usage-example instances keep realistic copy** (placeholders are for set members only):
Checkbox "Enable notifications" / "Get notified when something changes"; Switch "Marketing emails" /
"Receive emails…"; Radio group Standard/Express(selected)/Overnight with their descriptions. These are
explicit per-instance text overrides — when the member default was changed to the placeholder, the two
single-card examples (which had NO own override) inherited the placeholder, so their copy was
re-applied as explicit overrides. (Trap: editing a text node's `characters` inside a nested instance
invalidates sibling node IDs mid-`findAll` → resolve each target text by exact ID via
`getNodeByIdAsync`, one at a time, don't hold a `findAll` array across edits.)
- **Nested control** (per (checked,state), reused as instances of the existing sets — never rebuilt):
  - Checkbox set `3795:1184` — members per catalog (off/on × 5 states).
  - Switch set `3839:2` — `size=default` members per catalog.
  - RadioGroupItem set `3852:1206` — members per catalog.
  - The control already carries its own focus ring / invalid border / disabled opacity per state, so
    the card just sets the matching control member; no card-level ring is drawn (code has no card focus
    ring — focus lives on the control).

## CHECKED-STATE TINT (user-decided 2026-06-16 — FINAL, fully token-bound)

The checked members use the **two-cyan tint model** (user instruction "use accent for the fill and
primary for the stroke, accent foreground on the title for checked"):

- **Card fill → `accent`** (`VariableID:3037:14`, cyan/50 #e9f6fc — token `use`: "selection/active
  tint surface"). Bound, opacity 1.
- **Card stroke → `primary`** (`VariableID:3037:8`). Bound, weight 1.
- **Title (`{Label}`) → `accent-foreground`** (`VariableID:3038:2`, cyan/700 #0077a8 — token `use`:
  "readable cyan for text on accent tint ≈5:1"). Bound. Description stays `muted-foreground`.

All three are now **proper variable bindings** that **survive instancing** (the usage-example
instances picked up the change automatically) — because `accent`/`primary`/`accent-foreground` are
full-strength solid tokens with no per-paint opacity, unlike the earlier `primary/5`+`/30` approach.

**Superseded earlier deviation (resolved):** the first build used the code's literal `bg-primary/5` +
`border-primary/30` via an UNBOUND baked-RGB paint, because a variable-bound paint's per-paint opacity
did not survive instancing (rendered solid cyan in any instance). The two-cyan token model replaces
that — no opacity hack, fully token-linked. NOTE: this diverges from the current code
(`FieldLabel has-data-checked:bg-primary/5 border-primary/30`); if Figma is to be the source of truth
the code's checked tint should be updated to `bg-accent` + `border-primary` + title `text-accent-foreground`.

**Checked-invalid members:** keep the accent fill + primary stroke + accent-foreground title (card
surface stays in its checked tint); the invalid signal comes through the destructive control + red
FieldError, faithful to the code (card tint is checked-driven, not invalid-driven).

## Usage-example groups (permanent, T5)

One labeled group below each set, real instances composed only from the set's controls (white
backdrop + 16px padding for legible rendering of the semi-transparent tint):

- Checkbox: `4128:1862` — "Usage — selected single card" (one `checked=on,default` instance).
- Switch: `4128:1877` — "Usage — selected single card".
- Radio: `4129:1886` — "Usage — single-selection group": a 3-card group (Standard / Express
  [selected] / Overnight), each card a real instance, per-card title/description overridden via the
  nested editable `{Label}` / `{Field Description}` text. The selected card is instanced directly
  from the `checked=on` member (NOT created off-member then variant-swapped — swapping a variant on
  an off-member instance re-introduced the opacity-1 fill override).

## /figma-verify

**CLEAN** — final pass across all 3 sets + 3 usage groups (460 nodes): 0 text-as-icon (indicators
are real vectors from nested control instances), 0 clipped children, 0 padding asymmetry, 0 overlap.

## Tokens / variable IDs used

- `border` `VariableID:3038:4` — UNchecked card stroke (bound)
- `accent` `VariableID:3037:14` — CHECKED card fill (bound, solid)
- `primary` `VariableID:3037:8` — CHECKED card stroke (bound)
- `accent-foreground` `VariableID:3038:2` — CHECKED card title `{Label}` fill (bound)
- `corner-lg` `VariableID:3073:4` (card radius — bound)
- `space-md` `VariableID:3070:6` (card padding p-md — bound)
- destructive / muted-foreground / primary-foreground / ring etc. ride in via the nested
  `.Field` + control instances (not re-bound here).

## Known traps hit

- **clone() not used** — members built via `createComponent` + `createInstance` + slot-fill, so the
  .Field error-slot-degradation clone trap was avoided. The Field invalid member `3715:1019` already
  carries a healthy error slot (`4015:3`) in the FieldContent column (fixed in the Field re-port).
- **slot-fill in instance** — `[...controlSlot.children].forEach(c => c.remove())` then `appendChild`
  the control instance (appendChild adds, doesn't replace).
- **bound-paint opacity ≠ survives instancing** — bit the first `primary/5`+`/30` attempt; resolved by
  switching to the solid two-cyan token model (`accent`/`primary`/`accent-foreground`), now fully bound.
- **section-relative coords** — section children take section-relative x/y; placing at
  `section.x + offset` pushed sets ~9000px right (absolute). Fixed to relative `x=80, y=stacked`.

## Open items / for the parent

- Update `components-reference.md` with a new **ChoiceCard** entry (3 sets + member IDs + axes +
  usage groups + the two-cyan checked tint + code locator `libs/ui/src/components/ui/choice-card/`).
- **Code divergence to reconcile:** Figma checked tint is now `bg-accent` + `border-primary` + title
  `text-accent-foreground` (user-decided); the code still has `has-data-checked:bg-primary/5
  border-primary/30` (no title recolour). Sync the code to match if Figma is source of truth.

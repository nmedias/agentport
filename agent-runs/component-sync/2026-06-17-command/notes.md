# component-sync — Command — 2026-06-17

Figma → code reconciliation after the DS colour-semantics rework (`-fill`/`-ink`/`-border`
system). Read-only on Figma (Plugin MCP). Source of truth = live per-variant token bindings on
the six `.Command/*` sub-sets, file `ejFKo4MNuvC9TSDKOCUvyq`, page "Shadcn Components" `3126:2`.

The code already carried the correct *structure* and *non-colour* tokens (space/corner/typography
were untouched by the rework and matched Figma 1:1). This sync is a pure **colour-utility
re-clothing**: every old shadcn-style colour utility → its live `-fill`/`-ink` DS name.

## Live Figma colour bindings read (per sub-set, inner nodes)

### `.Command/Item` set `3559:2` (state default/selected/disabled/checked)
- item **surface** (selected only) → `shadcn Default/accent-fill`
- icon vector + label + shortcut (selected) → `shadcn Default/accent-ink`
- icon vector + label (default/disabled/checked) → `shadcn Default/ink`
- shortcut (default/disabled/checked) → `shadcn Default/muted-ink`
- check vector (checked) → `shadcn Default/ink`
- geometry: gap/pad = space-md/space-sm, radius = corner-sm (UNCHANGED by rework)

### `.Command/Input` set `3639:2` (variant default/palette)
- default: inputgroup fill `Input/input-fill`, stroke `Input/input-border`, radius corner-lg;
  placeholder `Input/input-ink-placeholder`; value `shadcn Default/ink`; search-line vector (icon)
  inherits ink. (InputGroup is a nested real instance — owns its own fill/stroke.)
- palette: wrapper fill `shadcn Default/card`, pad space-xl, gap space-lg; **caret rect fill
  `shadcn Default/primary`** (+ Effect Style Glow); placeholder `Input/input-ink-placeholder`;
  value `shadcn Default/ink`; Kbd instance fill `Inverse/inverse-fill`, Kbd label `Inverse/inverse-ink`.

### `.Command/Separator` set `3653:6` (variant default/labeled)
- default: single line fill `Border/border`
- labeled: label text `shadcn Default/muted-ink`, trailing rule rect `Border/border`;
  pad gap-md px-xl pt-lg pb-sm

### `.Command/Empty` `3564:3`
- message text `shadcn Default/muted-ink`, pad py space-2xl, Body text style

### `.Command/Group` set `3640:9` (variant default/palette)
- heading text `shadcn Default/muted-ink` (both variants), Eyebrow text style
- default: heading-wrap pad px-md py-sm; container pad space-xs
- palette: container pad px-md; heading rendered as nested `.Command/Separator[labeled]` instance
  (label `muted-ink`, rule `Border/border`) — the labeled-separator does the heading rhythm

### `.Command` root set `3642:2` (variant default/palette)
- panel fill `Overlay/overlay-fill` (both variants), stroke `Border/border` (1 / 1.5px),
  Effect Style Elevation, radius corner-xl (default) / corner-md (palette)
- nested instances (Input/Group/Separator/Item) carry the same bindings as their standalone sets

## Variable resolution (caret colour adjudication)
- `shadcn Default/primary` → alias `Color/signal/600` = **#0063bb**, scopes
  `[SHAPE_FILL, TEXT_FILL, STROKE_COLOR]` — the caret rect is a valid SHAPE_FILL of the accent tone.
- `shadcn Default/primary-fill` → `Color/deep/900` = #0d2531 (near-black) — a *different* colour.
- `shadcn Default/accent-fill` → `Color/deep/50` = #eaf8ff (selection tint).
- `shadcn Default/accent-ink` → `Color/signal/600` = #0063bb (same as primary).

## Change delta applied to command.tsx (colour utilities only)

| Sub-part / state | old utility | new utility |
|---|---|---|
| root panel (commandVariants base) | `bg-overlay text-overlay-foreground` | `bg-overlay-fill text-overlay-ink` |
| item selected surface | `data-selected:bg-accent` | `data-selected:bg-accent-fill` |
| item selected text + selected svg | `data-selected:text-accent-foreground` ×2 | `data-selected:text-accent-ink` ×2 |
| group container (both branches) | `text-foreground` | `text-ink` |
| group heading (both branches) | `**:[[cmdk-group-heading]]:text-muted-foreground` | `…text-muted-ink` |
| separator labeled label | `text-muted-foreground` | `text-muted-ink` |
| empty message | `text-muted-foreground` | `text-muted-ink` |
| default input field | `text-foreground placeholder:text-input-placeholder` | `text-ink placeholder:text-input-ink-placeholder` |
| default input search icon | `text-foreground` | `text-ink` |
| palette input field | `text-foreground placeholder:text-input-placeholder` | `text-ink placeholder:text-input-ink-placeholder` |
| shortcut hint | `text-muted-foreground` + `…:text-accent-foreground` | `text-muted-ink` + `…:text-accent-ink` |

UNCHANGED (name kept, value-only rework): `bg-card` (palette input wrapper), `bg-border`/`border`
(separator lines + group rule + panel stroke), `shadow-glow`/`shadow-elevation` (Effect Styles).
Kbd handles its own `inverse-fill`/`inverse-ink` internally — no command.tsx change.

All non-colour tokens (space-*, corner-*, text-format-*) already matched Figma — untouched.

## Deviation / FLAG: palette caret `bg-primary`

Figma binds the caret rect fill to the variable **`primary`** (= signal/600, #0063bb), scoped for
SHAPE_FILL. Code keeps **`bg-primary`** (the literal Figma-name utility). This is token-faithful to
the binding *and* renders the exact colour Figma shows, because `--color-primary` IS defined in
`tw-theme.css` (= `--ap-sys-primary` = signal/600), so Tailwind generates a live `bg-primary`.

It sits against tokens-reference §6 ("bg-primary GIBT ES NICHT") + §1 (primary's documented
utilities are `text-/border-/ring-primary`). Two alternatives were rejected:
- `bg-primary-fill` → deep/900 (#0d2531, near-black) = **wrong colour**, visual regression.
- `bg-accent-ink` → also signal/600, SHAPE_FILL-scoped, DS-legal as a fill, identical colour —
  but semantically odd ("ink" token used as a decorative bar fill) and renames away from the
  Figma source variable.

Kept `bg-primary` as the most faithful translation of the live binding; the §6 rule targets
mis-mapping *stock-shadcn* `bg-primary` (a button surface), not a Figma source that literally names
`primary` used as a shape fill. Surfaced here for the lead to adjudicate — if the DS wants the rule
enforced literally, switch to `bg-accent-ink` (same pixels).

## Structural deviations (pre-existing, unchanged — not colour)
- Prompt-divider = `border-b` on the palette input wrapper; Figma models it as a separate
  Separator instance in the composition (carried from the 2026-06-11 sync).
- Palette group-heading inset = px-md (16px C2 alignment); Figma labeled-separator default is px-xl.
- CommandDialog has no Figma axis (code-only Dialog nesting).
These were documented in `agent-runs/component-sync/2026-06-11-command/notes.md`; no change this run.

## Verification
- Live bindings read per variant for all six sub-sets (default + palette traversed separately).
- All target utilities confirmed present in `tw-theme.css`: `text-ink`, `text-muted-ink`,
  `bg-accent-fill`, `text-accent-ink`, `bg-overlay-fill`, `text-overlay-ink`,
  `text-input-ink-placeholder`.
- No story/spec assertion targets a renamed colour utility → behaviour unchanged; one comment in
  each of header/spec updated for accuracy. Gate NOT run (per instructions).

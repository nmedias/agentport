# /component-sync — ChoiceCard (Figma → code), 2026-06-17

Colour-token rework sync, same batch as button/kbd/badge/breadcrumb. DS colour semantics moved
to the `-fill`/`-ink`/`-border` system; re-clothed the choice-card checked-tint utilities to the
live Figma bindings.

## Scope

ChoiceCard is a DS-authored family: 3 thin wrappers (ChoiceCardCheckbox/Switch/Radio) over a
shared internal `ChoiceCardShell` (FieldLabel > Field). The **card surface, border, and title
tint live in `field.tsx`** (`FieldLabel` + `FieldTitle`), NOT in the wrapper files — the wrappers
and shell carry no colour utilities. The nested control colours (checkbox/switch/radio glyph) come
from the already-synced Checkbox/Switch/Radio components and were out of scope; this run reads only
the SHELL's own card surface / border / title / description.

## S2 — Live Figma bindings (READ-ONLY)

File `FIGMA_FILE_KEY`, page "Shadcn Components" 3126:2, Section "Choice Card" 4107:1526.
Sets: `.ChoiceCard/Checkbox` 4112:1638, `.ChoiceCard/Switch` 4119:1750, `.ChoiceCard/Radio` 4124:1862.
Read `paint.boundVariables.color` → `getVariableByIdAsync().name` on each member's card-shell
COMPONENT frame (surface fill + border stroke) and the title/description/error TEXT fills.

All three families bind the SAME card-shell tokens (verified checkbox off/on/invalid + radio/switch
off/on default):

| Card-shell part        | checked=off                | checked=on                  |
|------------------------|----------------------------|-----------------------------|
| surface fill           | white (unbound #ffffff)    | `shadcn Default/accent-fill`|
| border stroke (1px)    | `Border/border`            | `shadcn Default/accent-border` |
| title text fill        | `shadcn Default/ink`       | `shadcn Default/accent-ink` |
| description text fill  | `shadcn Default/muted-ink` | `shadcn Default/muted-ink`  |
| error text fill (inv.) | `shadcn Default/destructive` | `shadcn Default/destructive` |

Radius 8 (corner-lg), strokeWeight 1, padding p-md — unchanged, geometry not in scope.

## S3 — Diff (only differences, §6 crosswalk)

| Part / file                   | old code utility                    | live Figma var | new code utility            |
|-------------------------------|-------------------------------------|----------------|-----------------------------|
| FieldLabel checked stroke     | `has-data-checked:border-primary`   | `accent-border`| `has-data-checked:border-accent-border` |
| FieldTitle checked title fill | `...:text-accent-foreground`        | `accent-ink`   | `...:text-accent-ink`       |
| choice-card story captions    | `text-muted-foreground` (×9, 3 files) | `muted-ink`  | `text-muted-ink`            |

Already correct (no edit): `has-data-checked:bg-accent-fill` (= `accent-fill`), off-state border
via base-layer `border-border` (= `Border/border`), off-state title via inherited `text-ink`
(`text-format-label` is typography-only).

### Key finding — checked stroke is accent-border, NOT primary

Both the components-reference ChoiceCard `tint:` note (line 761, "Stroke primary 3037:8 cyan/500")
and the team-lead briefing predicted the checked stroke might still be `border-primary`. The LIVE
Figma binding on every `checked=on` member is **`accent-border`** (still/200), not `primary`.
The 2026-06-16 two-cyan model (accent-fill / primary / accent-foreground) was re-clothed in the
later colour rework to the accent trio (accent-fill / accent-border / accent-ink). So this is a
real delta, not just a §6 rename — `border-primary` → `border-accent-border`.

## S4 — Applied

`libs/ui/src/components/ui/field/field.tsx`:
- `FieldLabel`: `has-data-checked:border-primary` → `has-data-checked:border-accent-border`; comment
  updated (two-cyan → accent model, stroke now accent-border).
- `FieldTitle`: `group-has-data-checked/field-label:text-accent-foreground` → `...:text-accent-ink`;
  comment updated (accent-foreground cyan/700 → accent-ink signal/600).

`choice-card-{checkbox,radio,switch}.stories.tsx`: gallery caption eyebrows
`text-muted-foreground` → `text-muted-ink` (×3 per file).

Specs: no class/token-survival assertions in choice-card specs → no change.

## Scope deviation (flagged, NOT applied)

`field.tsx` is SHARED by the whole Field family. It still carries stale generic-Field tokens that
are NOT the choice-card checked-tint and apply to every plain field row:
- `FieldDescription`: `text-muted-foreground` → should be `text-muted-ink`
- `FieldSeparator`: `bg-background` → `bg-surface`, `text-muted-foreground` → `text-muted-ink`

Left untouched per "apply ONLY the choice-card delta, NO opportunistic rewrites." These belong to a
dedicated Field `/component-sync` (no Field sync run exists on branch `refine/token-color-rework`
yet — only Label of the family was synced 2026-06-17). The choice-card description text DOES render
through `FieldDescription`, so its tint is currently stale in code — but fixing it would re-clothe a
shared component beyond choice-card scope. Recommend a follow-up Field sync.

## Verification

`accent-ink`, `accent-border`, `accent-fill`, `muted-ink` all confirmed present in
`tw-theme.css`/`tokens.css` (theme bridge generates the utilities). Gate NOT run per instructions.

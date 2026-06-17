# Component-Sync — Checkbox (2026-06-17)

**Direction:** Figma → code (read-only Figma). Colour token rework `-fill`/`-ink`/`-border`.
**Set:** `.Checkbox` `3795:1184` (Section "Checkbox" `3791:1184`), page "Shadcn Components" `3126:2`,
file `FIGMA_FILE_KEY`. Axes `checked[off,on]` × `state[default,focus,disabled,invalid,focus-invalid]`,
10 members. Confirmed COMPONENT_SET, props `checked` + `state`.

## S2 — Live bindings (read-only, all 10 members)

Box = 16×16, `corner-sm` (Corner/corner-sm), strokeWeight 1px (unbound; geometry). Indicator FRAME holds a
`Vector` check glyph (9.9×7.01) on every `checked=on` member; `checked=off` members have NO vector child.

| Member | box fill | border stroke | check vector | effect |
|---|---|---|---|---|
| off / default | `Input/input-fill` | `Input/input-border` | — | none |
| off / focus | `Input/input-fill` | `shadcn Default/ring` | — | DROP_SHADOW `#4a5562@50%` spread 3 sbn:false |
| off / disabled | `Input/input-fill` | `Input/input-border` | — | none · node opacity 0.5 |
| off / invalid | `Input/input-fill` | `shadcn Default/destructive` | — | none (border-only) |
| off / focus-invalid | `Input/input-fill` | `shadcn Default/destructive` | — | DROP_SHADOW `destructive@20%` (#b01207@20%) spread 3 sbn:false |
| on / default | `shadcn Default/primary-fill` | `shadcn Default/primary-fill` | `shadcn Default/primary-ink` | none |
| on / focus | `shadcn Default/primary-fill` | `shadcn Default/ring` | `shadcn Default/primary-ink` | DROP_SHADOW `#4a5562@50%` spread 3 sbn:false |
| on / disabled | `shadcn Default/primary-fill` | `shadcn Default/primary-fill` | `shadcn Default/primary-ink` | none · node opacity 0.5 |
| on / invalid | `shadcn Default/destructive` | `shadcn Default/destructive` | `shadcn Default/destructive-ink` | none (border-only) |
| on / focus-invalid | `shadcn Default/destructive` | `shadcn Default/destructive` | `shadcn Default/destructive-ink` | DROP_SHADOW `destructive@20%` spread 3 sbn:false |

Notes:
- The indicator FRAME itself carries an invisible white fill (`visible:false`) — inert, not a binding.
- `checked=on,focus` strokes `ring` (NOT `primary-fill`) → focus border wins over the checked border, same as
  the code's `focus-visible:border-ring` overriding `data-checked:border-primary-fill`. No FLAG.
- Resting `invalid` members carry NO glow (effects:[]); only `focus-invalid` adds the destructive@20% glow.
  Matches the code's focus-gated destructive ring (width only via `focus-visible:ring-[3px]`).

## S3 — Diff vs code (§6 crosswalk), only differences

The code still used the OLD (pre-rework) utility names. The values were already role-correct; the rework
renamed the tokens, so this is a pure re-clothe to the live binding names + one new glyph-colour binding.

| Code (old) | Live Figma binding | Code (new) |
|---|---|---|
| `border-input` | `Input/input-border` | `border-input-border` |
| `bg-input-background` | `Input/input-fill` | `bg-input-fill` |
| `data-checked:bg-primary` ⚠ (`bg-primary` does not exist) | `shadcn Default/primary-fill` | `data-checked:bg-primary-fill` |
| `data-checked:border-primary` | `shadcn Default/primary-fill` | `data-checked:border-primary-fill` |
| `data-checked:text-primary-foreground` | `shadcn Default/primary-ink` | `data-checked:text-primary-ink` |
| `aria-invalid:aria-checked:bg-destructive` | `shadcn Default/destructive` (KEPT name) | unchanged |
| `aria-invalid:aria-checked:border-destructive` | `shadcn Default/destructive` (KEPT name) | unchanged |
| (glyph inherited primary-ink via text-current) | `shadcn Default/destructive-ink` | NEW `aria-invalid:aria-checked:text-destructive-ink` |

`aria-invalid:border-destructive` + `ring-destructive/20`, `focus-visible:border-ring` + `ring-ring/50`,
`corner-sm`, geometry (`size-4`, `[&>svg]:size-3.5`, `after:-inset-*`), `disabled:opacity-50`,
`group-has-disabled/field:opacity-50` — all already correct, untouched.

The authoritative point: the checked surface binds `primary-fill` (dark deep/900 #0d2531), NOT a
`bg-primary` (which doesn't exist — `primary` = accent text/border/ring tone). Old `bg-primary`/`border-primary`
were dead utilities after the rework.

## S4 — Code delta applied (checkbox.tsx only)

Single className string on `CheckboxPrimitive.Root`:
- `border-input` → `border-input-border`
- `bg-input-background` → `bg-input-fill`
- `data-checked:border-primary` → `data-checked:border-primary-fill`
- `data-checked:bg-primary` → `data-checked:bg-primary-fill`
- `data-checked:text-primary-foreground` → `data-checked:text-primary-ink`
- added `aria-invalid:aria-checked:text-destructive-ink` (new live binding for the checked-invalid glyph;
  previously the glyph inherited primary-ink via `text-current`).

Header comment rewritten to the live bindings (axis = checked × state; primary-fill/-ink, input-fill/-border,
destructive-ink notes). Indicator JSX unchanged (`text-current` still inherits the box's text colour, which is
now primary-ink when checked / destructive-ink when checked-invalid). No opportunistic rewrites.

Stories + spec: no colour-utility class strings present (compose via Field/Label, assert behaviour). Spec
guards `corner-sm` (unchanged). Nothing to mirror.

Verified all new utilities resolve in the @theme bridge (`tw-theme.css`): `--color-input-fill`,
`--color-input-border`, `--color-primary-fill`, `--color-primary-ink`, `--color-destructive-ink`. Old
`--color-input` / `--color-input-background` / `--color-primary-foreground` no longer exist.

## Not done (per instructions)
Did not run the gate, did not edit components-reference.md (returned the updated entry to the team lead),
did not write to Figma.

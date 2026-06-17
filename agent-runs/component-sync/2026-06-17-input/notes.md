# component-sync — Input (2026-06-17)

Figma → code reconciliation of `input` after the DS colour-semantics rework
(`-fill`/`-ink`/`-border` system). Read-only on Figma; delta applied to code.

## Source

- File: "Agentport DS" `FIGMA_FILE_KEY`, page "Shadcn Components" `3126:2`.
- Set `.Input` `3177:302` (Section "Input" `3176:302`).
- Axis = `state` [default, focus, filled, disabled, invalid, focus-invalid]. No CVA in code
  (single element); states are pseudo-/aria-driven.
- Code: `libs/ui/src/components/ui/input/input.tsx` (+ `.stories.tsx`, `.spec.tsx`).

## Structure (per member)

Each `state=*` member is a HORIZONTAL auto-layout COMPONENT carrying the field chrome,
with two TEXT children (only the relevant one shows per state):

```
state=*  (COMPONENT, container — fill + stroke + radius + padding live here)
 ├─ placeholder  (TEXT "{Placeholder}", Label text style)
 └─ value        (TEXT "{Value}", raw Hanken Grotesk Medium 14)
```

- Container: `h 32` (h-8), `strokeWeight 1` (border), radius/padding bound (see below),
  `primaryAxisAlignItems MIN`, `counterAxisAlignItems CENTER`, `itemSpacing 0`.
- All paints and geometry are **bound to named semantic variables** (library/remote vars —
  resolve via `figma.variables.getVariableByIdAsync`, not `figma.getVariableByIdAsync`).

## Live bindings (authoritative)

| Slot | Figma bound variable | px / value | DS utility |
|------|----------------------|-----------|------------|
| container fill (all states) | `Input/input-fill` | ink/25 #f9fcfd | `bg-input-fill` |
| stroke — default/filled/disabled | `Input/input-border` | ink/400 #7f848b | `border-input-border` |
| stroke — focus | `shadcn Default/ring` | ink/800 #1e2229 | focus stroke → `focus-visible:border-ring` |
| stroke — invalid + focus-invalid | `shadcn Default/destructive` | error/600 #b01207 | `aria-invalid:border-destructive` |
| placeholder text fill | `Input/input-ink-placeholder` | ink/500 #656971 | `placeholder:text-input-ink-placeholder` |
| value text fill | `shadcn Default/ink` | ink/900 #0d1016 | `text-ink` (file:text-ink) |
| radius (all corners) | `Corner/corner-lg` | 8px | `corner-lg` |
| padding top/bottom | `Space/space-xs` | 4px | `py-xs` |
| padding left/right | `Space/space-md` | 8px | `px-md` |
| placeholder text style | `Label` (S:4e0346…) | sans Medium 14 | `text-format-label` |

Effects (drop-shadow ring on the live pseudo-states):
- `state=focus`: DROP_SHADOW spread 3, ink/800 @ 50% → matches `focus-visible:ring-ring/50 ring-[3px]`.
- `state=focus-invalid`: DROP_SHADOW spread 3, error @ 20% → matches `aria-invalid:ring-destructive/20`.
- `state=disabled`: container `opacity 0.5` → matches `disabled:opacity-50`.

Geometry (`h-8`, `corner-lg`, `px-md`, `py-xs`, `file:h-6`) confirmed against the bindings —
**no geometry change**; this is a colour-only sync.

## Delta applied (code old → new)

Colour-utility renames only; the §6 `color_renames` crosswalk is authoritative.

| Part | Old | New | Reason |
|------|-----|-----|--------|
| border | `border-input` | `border-input-border` | `input`→`input-border` rename; Figma `Input/input-border` |
| surface | `bg-input-background` | `bg-input-fill` | `input-background`→`input-fill`; Figma `Input/input-fill` |
| placeholder | `placeholder:text-input-placeholder` | `placeholder:text-input-ink-placeholder` | `input-placeholder`→`input-ink-placeholder`; Figma `Input/input-ink-placeholder` |
| file text | `file:text-foreground` | `file:text-ink` | `foreground`→`ink`; value text bound `shadcn Default/ink` |
| selection fill | `selection:bg-primary` | `selection:bg-primary-fill` | `bg-primary` no longer exists (primary = accent-only); DS surface = `primary-fill` |
| selection text | `selection:text-primary-foreground` | `selection:text-primary-ink` | `primary-foreground`→`primary-ink` |

Unchanged (kept names, values may differ): `focus-visible:border-ring`, `ring-ring/50`,
`focus-visible:ring-[3px]`, `aria-invalid:border-destructive`, `aria-invalid:ring-destructive/20`.

Header comment rewritten to document the new clothing + the selection re-clothing rationale.
`Invalid` story comment updated (destructive is no longer a placeholder token — now error/600).

## Deviations / flags

- **`selection:bg-primary` / `selection:text-primary-foreground` have no Figma binding** —
  text selection isn't modelled in the `.Input` set. They are a stock-shadcn code-only carryover.
  Post-rework `bg-primary` is a **dead utility** (primary is accent-only: text/border/ring), so
  this pair had to be re-clothed regardless of Figma. Picked the DS "primary surface" pairing
  `bg-primary-fill` + `text-primary-ink` (same pairing the Button default uses) as the faithful
  equivalent of "filled selection highlight with readable text on it". Flagged as a role-pick, not
  a direct Figma binding. The sibling Textarea carries the identical pair and should get the same
  re-clothing in its own sync.
- Axis unchanged (6 states, same as before) → no members added/removed → no story/spec state
  mirroring needed. Spec assertions (placeholder render, `text-format-label` survives twMerge,
  aria-invalid, disabled) all still hold unchanged.

## Verification

- All six members traversed; every fill/stroke/radius/padding resolved to a named semantic var
  (no raw/unbound paints). Raw hex values cross-checked against the §1 ramp and matched 1:1.
- Did NOT run the gate (per instructions). Did NOT edit components-reference.md or write to Figma.

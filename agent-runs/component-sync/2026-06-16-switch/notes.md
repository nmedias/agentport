# component-sync — Switch (Figma → code), 2026-06-16

Scope: **invalid + focus-invalid** states. Set `.Switch` `3839:2` (page "Components" `3126:2`),
file `nQSNLASjuLvgTh3we8Dp4s`. Read-only on Figma.

## Delta (applied) — one change

The **unchecked-invalid track fill** diverged:

| member | property | Figma (live) | code before | code after |
|---|---|---|---|---|
| `size=*, checked=off, state=invalid` / `focus-invalid` | track fill | `shadcn Default/input` (grey) | `aria-invalid:data-unchecked:bg-destructive` (red) | **removed** → keeps `data-unchecked:bg-input` (grey); border stays `aria-invalid:border-destructive` |

Edit: removed `aria-invalid:data-unchecked:bg-destructive` from `switch.tsx`. checked-invalid keeps
`aria-invalid:data-checked:bg-destructive` (red track). Stale comment block updated.

This **reverts the 2026-06-12 sync** that had bound the track to destructive in BOTH positions; the user
reset the unchecked-invalid track to `input` (border-only invalid signal), matching `.Input` / `.Checkbox`.

## Already matched (no change)
- `off/invalid`: fill `input`, stroke `destructive`, no glow → code `bg-input` + `aria-invalid:border-destructive`, ring focus-gated.
- `off/focus-invalid`: + `destructive`@0.2 glow → `aria-invalid:ring-destructive/20` at `focus-visible:ring-[3px]`.
- `on/invalid`: fill `destructive`, stroke `destructive` → `aria-invalid:data-checked:bg-destructive` + border-destructive.
- `on/focus-invalid`: + `destructive`@0.2 glow.
- focus (non-invalid), default, disabled, checked, both sizes: unchanged, all match.

## Deviations
None new. `destructive` is bound in Figma as `shadcn Default/destructive ⚠` (⚠ placeholder token, raw hex,
not finalized) — authoritative binding, pre-existing flag; mapped 1:1 to `bg/border/ring-destructive`.

## Gate
typecheck ✅ · lint ✅ (1 pre-existing `main.ts` warning) · **210 tests** ✅ (124 jsdom + 84 story).
Visual: `npm run shoot ui-switch--all-states` → unchecked-invalid = grey track + red border (no red fill);
checked-invalid = red track; invalid+focus = + red focus-gated ring. Confirmed by Claude.

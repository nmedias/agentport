# component-sync — RadioGroup (2026-06-12)

Figma → code, read-only on Figma. Set `.RadioGroupItem` `3852:1206`, page `3126:2`.
Var-name → utility authority: tokens-reference.md §6/§7 (bound var name authoritative).

## S2 — live readout (per member)

| member | border (stroke) | fill | dot fill | radius | effect | opacity |
|---|---|---|---|---|---|---|
| default | `shadcn Default/input` | **`Input/input-background`** | — | `Corner/corner-full` | — | 1 |
| checked | `shadcn Default/primary` | `shadcn Default/primary` | `shadcn Default/primary-foreground` | corner-full | — | 1 |
| focus | `shadcn Default/ring` | `Input/input-background` | — | corner-full | DROP_SHADOW spread 3, ring@0.5 (color unbound) | 1 |
| disabled | `shadcn Default/input` | `Input/input-background` | — | corner-full | — | 0.5 |
| invalid | `shadcn Default/destructive ⚠` | `Input/input-background` | — | corner-full | DROP_SHADOW spread 3, destructive@0.2 | 1 |
| checked-invalid | **`shadcn Default/destructive ⚠`** | **`shadcn Default/destructive ⚠`** | **`shadcn Default/destructive-foreground ⚠`** | corner-full | DROP_SHADOW spread 3, destructive@0.2 | 1 |

Set members are layout-only (`layoutMode: NONE`, no itemSpacing) — RadioGroup CONTAINER gap not
present in this set; no container-gap delta to read. `gap-md` in code unchanged.

## S3/S4 — Delta applied (only what differs)

The user's two token adjustments to `.RadioGroupItem`:

1. **default fill — NEW binding `Input/input-background`** (§6 input-background → `bg-input-background`).
   Code had no base fill (transparent circle). → **added `bg-input-background`** to the base item class.
   Now applies to default/focus/disabled/invalid (the unchecked surface). checked/checked-invalid
   override via `data-checked:bg-primary` / `aria-invalid:aria-checked:bg-destructive`.

2. **checked-invalid — re-tinted fully destructive** (was: primary-border override / primary fill / dot
   primary-foreground). Live Figma binds border+fill `destructive ⚠` and dot `destructive-foreground ⚠`:
   - removed `aria-invalid:aria-checked:border-primary` → border now falls through to
     `aria-invalid:border-destructive`.
   - added `aria-invalid:aria-checked:border-destructive aria-invalid:aria-checked:bg-destructive`
     (override `data-checked:border-primary` / `data-checked:bg-primary`; placed AFTER data-checked for
     correct CSS source-order cascade).
   - dot span: added `group-aria-invalid/radio-group-item:bg-destructive-foreground` (the dot only mounts
     when checked, so the group-aria-invalid variant = checked-invalid). Overrides `bg-primary-foreground`.

Unchanged (correct bindings, not re-judged): checked primary border/fill + dot primary-foreground;
focus ring (`ring`, ring-[3px], ring/50); disabled opacity-50; invalid destructive border + ring/20;
corner-full; geometry (size-4 / size-2 dot / aspect-square / after:-inset-*).

## Variant add/remove
None. Same 6 states in Figma + code + stories (AllStates gallery already covers checked-invalid via
`value="checked-invalid" aria-invalid`). Token change only — no stories/spec change required.

## Deviations (code ≠ literal Figma binding)

| member | property | Figma binds | code uses | why |
|---|---|---|---|---|
| focus / invalid / checked-invalid | ring effect color | DROP_SHADOW color **raw/unbound** (ring@0.5, destructive@0.2) | `ring-ring/50`, `ring-destructive/20` | Figma effect colors are NOT bound to a variable (raw hex+alpha). Role-picked by §6: focus→ring, invalid→destructive. Pre-existing convention, unchanged. Design-side could bind these. |
| invalid / checked-invalid | destructive token | `shadcn Default/destructive ⚠` (⚠ = placeholder, stock hex) | `border/bg/text-destructive` + `destructive-foreground` | ⚠ placeholder token (status: placeholder in §1) — bound but not finalized design value. Propagated faithfully; flagged not-final. |

No wrong bindings. No raw-value-without-token on the swapped fills (input-background, destructive all bound).

## Catalog update (orchestrator applies — do NOT edit components-reference.md here)
RadioGroup entry:
- `vars:` — ADD `input-background` (default/unchecked fill, now bound) and `destructive-foreground`
  (checked-invalid dot). Keep input, primary, primary-foreground, ring, destructive, corner-full.
- `notes:` — checked-invalid is now FULLY destructive-tinted (border+fill+dot), reversing the prior
  "primary border wins" override; unchecked surface now filled (input-background, was transparent).

## Gate
S5 SKIPPED per orchestrator instruction (single shared gate run once). Not run here.

## Files edited
- libs/ui/src/components/ui/radio-group/radio-group.tsx (base class + dot span + rationale comment)

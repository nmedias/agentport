# Component Sync — `kbd` (2026-06-08)

Figma → code reconcile of the `.Kbd` set after a Figma restyle. Token-faithful, delta-only.

- **Figma:** set `.Kbd` `3217:308`, page `Shadcn Components` `3126:2`, file `FIGMA_FILE_KEY`.
- **Code:** `libs/ui/src/components/ui/kbd/kbd.tsx`.
- **Change captured:** the keycap was re-bound from the quiet light surface to an **inverted dark
  keycap**. Both variants (`content=text`, `content=icon`) changed identically.

## Delta applied

| member | property | Figma binding | code: was → now |
|---|---|---|---|
| both | surface fill | `Inverse/inverse` (#1a2230) | `bg-muted` → **`bg-inverse`** |
| `content=text` | text fill | `Inverse/inverse-foreground` (#fafbfc) | `text-muted-foreground` → **`text-inverse-foreground`** |
| `content=icon` | slot vector fill | `Inverse/inverse-foreground` | inherited via the same `text-*` swap (svg = currentColor) |

Comment block in `kbd.tsx` updated to reflect the inverted keycap (token-faithful, not opportunistic).

## Unchanged (verified, no delta)

- radius `Radius/radius-sm` → `rounded-sm`; padding L/R `Space/space-xs` → `px-xs`; gap `Space/space-xs`
  → `gap-xs`; text-style `Kbd` → `text-kbd`; geometry h20/minW20 → `h-5`/`min-w-5`.
- **Auto-layout:** `HORIZONTAL`, primary/counter `CENTER` → `inline-flex items-center justify-center` —
  unchanged.
- **Variants:** `content = text | icon` + `icon` slot — structure unchanged (the code models both via
  `children`); no variant add/remove/restructure.

## Deviations (code ≠ Figma binding)

**None.** Both changed properties were clean DS-variable bindings (`inverse`, `inverse-foreground`),
mapped 1:1 via the §6 crosswalk — no raw values, no semantically-wrong bindings, no role re-judgement.

## Gate

`nx test|typecheck|lint @agentport/ui` green (10 tests; 1 pre-existing unrelated lint warning in
`.storybook/main.ts`). Spec confirms `text-kbd` survives the rendered markup.

Story previews (Storybook :6006) — confirm the inverted dark keycap:
- Default — http://localhost:6006/?path=/story/ui-kbd--default
- SingleKeys — http://localhost:6006/?path=/story/ui-kbd--single-keys
- WithIcon — http://localhost:6006/?path=/story/ui-kbd--with-icon
- Group — http://localhost:6006/?path=/story/ui-kbd--group
- Combo — http://localhost:6006/?path=/story/ui-kbd--combo
- InText — http://localhost:6006/?path=/story/ui-kbd--in-text

## Note
The `Combo` story's `+` separator keeps `text-muted-foreground` — it sits on the page background
(outside the keycap), not inside a `Kbd`, so it is not part of this delta.

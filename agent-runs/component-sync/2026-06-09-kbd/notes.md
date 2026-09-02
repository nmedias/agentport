# Component-Sync — Kbd (Figma → Code, 2026-06-09)

Set `.Kbd` `3217:308` (page "Components" `3126:2`) → `libs/ui/src/components/ui/kbd/kbd.tsx`.

## Delta (applied)

**Variant add — new axis `emphasis` (high | low), default `high`.** The set now carries two
axes: `content` (text | icon) × `emphasis` (high | low) = 4 members. In the code only `emphasis`
becomes a prop (cva `kbdVariants`); `content` stays children-driven (icon = svg child, text = string).

| Member binding | Figma var | → Code utility |
|---|---|---|
| Fill `emphasis=high` | `Inverse/inverse` | `bg-inverse` (variant high) |
| Text/Icon `emphasis=high` | `Inverse/inverse-foreground` | `text-inverse-foreground` (variant high) |
| Fill `emphasis=low` | `shadcn Default/muted` | `bg-muted` (variant low — **new**) |
| Text/Icon `emphasis=low` | `shadcn Default/muted-foreground` | `text-muted-foreground` (variant low — **new**) |

Code: `emphasis` prop via cva, `defaultVariants: { emphasis: 'high' }` (= Figma `defaultVariant
content=text, emphasis=high`). Icon colour follows the text colour (svg currentColor) — no separate binding.
Export `kbdVariants` added (parity with `buttonVariants`). Stories: `Emphasis` story (high vs low) +
`argTypes.emphasis`. Spec: +2 guards (default high = bg-inverse, low = bg-muted).

## Unchanged (bound, matches the code 1:1 — no delta)

- Radius `Radius/radius-sm` → `rounded-sm` · gap `Space/space-xs` (4) → `gap-xs` · padX `Space/space-xs`
  (4) → `px-xs` · padY none.
- Text style "Kbd" (Geist Mono Medium, 11px) → `text-kbd`.
- Geometry: h 20 → `h-5` · minW 20 → `min-w-5` · `content=text` HUG → `w-fit` · `content=icon` FIXED 20.
- Icon slot: vector 9×9 in a 12px slot → `[&_svg…]:size-3` (12px).
- Tooltip context `in-data-[slot=tooltip-content]:` stays (no Figma signal, v4 idiom).

## Deviations

None. All bound variables map 1:1 via the §6 crosswalk; no raw values, no wrong
bindings. (`emphasis=low` is exactly the old stock-shadcn look — `muted`/`muted-foreground` — that the
original port had before an earlier sync switched it to the inverted keycap = `high`.)

## Gate

`nx test|typecheck|lint @agentport/ui` green — **18 tests** (kbd.spec 5). `text-kbd` survives the
rendered markup. **Storybook MCP (:6006) not started** → no `preview-stories`; visual
cross-check via Storybook still open (if needed `npm run storybook`, story `UI/Kbd › Emphasis`).

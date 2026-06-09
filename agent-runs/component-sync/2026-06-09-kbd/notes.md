# Component-Sync — Kbd (Figma → Code, 2026-06-09)

Set `.Kbd` `3217:308` (Page „Shadcn Components" `3126:2`) → `libs/ui/src/components/ui/kbd/kbd.tsx`.

## Delta (angewandt)

**Variant-Add — neue Achse `emphasis` (high | low), default `high`.** Das Set trägt jetzt zwei
Achsen: `content` (text | icon) × `emphasis` (high | low) = 4 Member. Im Code wird nur `emphasis`
zur Prop (cva `kbdVariants`); `content` bleibt children-getrieben (Icon = svg-Child, Text = String).

| Member-Binding | Figma-Var | → Code-Utility |
|---|---|---|
| Fill `emphasis=high` | `Inverse/inverse` | `bg-inverse` (Variant high) |
| Text/Icon `emphasis=high` | `Inverse/inverse-foreground` | `text-inverse-foreground` (Variant high) |
| Fill `emphasis=low` | `shadcn Default/muted` | `bg-muted` (Variant low — **neu**) |
| Text/Icon `emphasis=low` | `shadcn Default/muted-foreground` | `text-muted-foreground` (Variant low — **neu**) |

Code: `emphasis` Prop via cva, `defaultVariants: { emphasis: 'high' }` (= Figma `defaultVariant
content=text, emphasis=high`). Icon-Farbe folgt der Text-Farbe (svg currentColor) — kein eigener Bind.
Export `kbdVariants` ergänzt (Parität zu `buttonVariants`). Stories: `Emphasis`-Story (high vs low) +
`argTypes.emphasis`. Spec: +2 Guards (default high = bg-inverse, low = bg-muted).

## Unverändert (bound, matcht den Code 1:1 — kein Delta)

- Radius `Radius/radius-sm` → `rounded-sm` · Gap `Space/space-xs` (4) → `gap-xs` · padX `Space/space-xs`
  (4) → `px-xs` · padY none.
- Textstyle „Kbd" (Geist Mono Medium, 11px) → `text-kbd`.
- Geometrie: h 20 → `h-5` · minW 20 → `min-w-5` · `content=text` HUG → `w-fit` · `content=icon` FIXED 20.
- Icon-Slot: Vector 9×9 im 12px-Slot → `[&_svg…]:size-3` (12px).
- Tooltip-Kontext `in-data-[slot=tooltip-content]:` bleibt (kein Figma-Signal, v4-Idiom).

## Deviations

Keine. Alle gebundenen Variablen mappen 1:1 über den §6-Crosswalk; keine Roh-Werte, keine falschen
Bindings. (`emphasis=low` ist exakt der alte Stock-shadcn-Look — `muted`/`muted-foreground` — den der
ursprüngliche Port hatte, bevor er per früherem Sync auf die invertierte Keycap = `high` umgestellt wurde.)

## Gate

`nx test|typecheck|lint @agentport/ui` grün — **18 Tests** (kbd.spec 5). `text-kbd` überlebt das
gerenderte Markup. **Storybook-MCP (:6006) nicht gestartet** → kein `preview-stories`; visueller
Gegencheck über Storybook offen (bei Bedarf `npm run storybook`, Story `UI/Kbd › Emphasis`).

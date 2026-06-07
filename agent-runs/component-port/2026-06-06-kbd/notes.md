# Component Port — `kbd` (2026-06-06)

Initial shadcn → Figma → code port. Token-faithful: shadcn structure kept, re-clothed in DS tokens.

## Anatomy (T2)

shadcn `kbd` ships two parts, **no CVA**:
- `Kbd` — a `<kbd>` with one static class string. `pointer-events-none` + `select-none`, no
  pseudo-class states → per skill T2 a **content** axis, not a state axis.
- `KbdGroup` — a flex row container (`gap-1`).

Content the cap holds: a text glyph (`Ctrl`, `B`, `/`) **or** an svg icon (`[&_svg]:size-3`, e.g. ⌘).
→ Figma axis `content = text | icon`. Full matrix = 2.

## Mapping table (T3)

| stock | px / role | DS | why |
|---|---|---|---|
| `pointer-events-none`, `select-none` | behaviour | kept | static, non-interactive cap |
| `inline-flex items-center justify-center` | layout | kept | structural |
| `h-5`, `w-fit`, `min-w-5` | 20px h / min-w | kept numeric | control geometry ≠ spacing token (§6) |
| `gap-1` | 4px | `gap-xs` | spacing mapped by **px value** (4 → xs) |
| `px-1` | 4px | `px-xs` | spacing by px value (4 → xs) |
| `rounded-sm` | 4px | `rounded-sm` | radius-sm `use` = "Kleine Controls/Chips/Marker" — a key cap |
| `bg-muted` | surface | `bg-muted` | muted `use` = "Ruhige Chrome-Fläche (Chips, Tracks)" — the quiet cap; not `card`/`accent` (those mean elevated panel / selection) |
| `font-sans text-xs font-medium` | typo | `text-kbd` | DS has a **purpose-built** mono key format (`text-kbd`, Geist Mono 11/500, `use` = "Tastatur-Tasten-Text"). Replaces the dead `--text-*`/`--font-weight-*` reset utils (§6). Deliberate divergence: DS chose **mono**, stock was sans. |
| `text-muted-foreground` | text colour | `text-muted-foreground` | muted-foreground `use` = secondary text on light surfaces — the dim glyph; not `foreground` (too heavy for a passive hint) |
| `[&_svg:not([class*='size-'])]:size-3` | 12px icon | kept numeric | icon geometry ≠ spacing token |
| `[[data-slot=tooltip-content]_&]:bg-background/20 …:text-background` | contextual | kept (DS token + opacity) | opacity modifier on a DS token is valid (§6 keep_valid); **dropped** the `dark:` sibling — no dark mode yet |

## Figma (T4) — file `FIGMA_FILE_KEY`, page `Shadcn Components` (3126:2)

- Section **Kbd** `3215:302` (headline `3215:303`) — via `/figma-create-section`.
- Set **`.Kbd`** `3217:308`, props `content`, `icon#3217:1`:
  - `content=text` `3217:302` — editable text node `3217:303` ("Ctrl"), `minWidth=20`, HUG width.
  - `content=icon` `3217:304` — **slot** `icon` `3217:305` holding default `command-fill` vector
    (`RiCommandLine`/fill family; frame `3217:306`, vector `3217:307`), 20×20 square.
- Variable bindings (by ID): fill → `shadcn Default/muted` `VariableID:3037:12`; text+vector fill →
  `muted-foreground` `VariableID:3037:13`; 4 radii → `Radius/radius-sm` `VariableID:3073:2`;
  paddingL/R + itemSpacing → `Space/space-xs` `VariableID:3070:4`. Text style `Kbd`
  `S:ff0c98623563fcbf3d780ddfe8d7b746e09ae6c1,` (Geist Mono Medium 11).
- Vertical padding = raw 0 (height 20 fixed carries it; no token for zero).

### Findings
- **`createSlot()` works but is untyped** (skill red-flag confirmed) — returns a `SLOT` node. The
  slot defaults to a **fixed 100×100**, so the icon cap blew up to 108px wide and the icon floated
  above the cap. Fix: `slot.resize(12,12)` + `slot.clipsContent=false` → parent HUGs to 20px. A slot
  cannot `HUG` (layoutMode NONE), so it must be resized to its content.
- **TEXT component property can't be added to a variant post-combine** — `addComponentProperty`
  throws "Can only set component property definitions on a product component". Left the text key as a
  direct character override (valid Figma API) rather than ship a broken prop. The `icon` slot prop
  worked because `createSlot` ran *before* `combineAsVariants`.
- T4b exercised: text override "⌘K" honoured `min-w` (21px); `setProperties({content:'icon'})` flipped
  the variant; slot prop present. Test instances removed.

## Verify (T5)

`/figma-verify 3217:308` → **CLEAN** (0 flags). The ⌘ case is a **vector slot**, not a `⌘` text
glyph — which is exactly what the verifier flags as text-as-icon, so the icon modelling sidesteps it.
Padding symmetric (32/32/32/32; 4/4/0/0), no clipping/overlap.

## Code (T6) — `libs/ui/src/components/ui/kbd/`

`kbd.tsx` + `index.ts` barrel + `kbd.spec.tsx` + `kbd.stories.tsx`; re-exported in
`libs/ui/src/index.ts`. No `@remixicon/react` import in the component itself (icons are user-passed
`children`); stories demo with `RiCommandLine` etc.

- Gate **green**: `nx test` 10/10, `typecheck` clean, `lint` clean (1 pre-existing warning in
  `.storybook/main.ts`, unrelated). Spec asserts `text-kbd` survives in the rendered `className`
  (post-`cn()`/twMerge) → confirms T1 twMerge `text-format` group is in effect.

### Story previews (Storybook MCP, :6006)
- Default — http://localhost:6006/?path=/story/ui-kbd--default
- SingleKeys — http://localhost:6006/?path=/story/ui-kbd--single-keys
- WithIcon — http://localhost:6006/?path=/story/ui-kbd--with-icon
- Group — http://localhost:6006/?path=/story/ui-kbd--group
- Combo — http://localhost:6006/?path=/story/ui-kbd--combo
- InText — http://localhost:6006/?path=/story/ui-kbd--in-text

## Open items
- `text-background` utility: stock kbd's tooltip override uses `text-background`; the DS reference
  lists only `bg-background` for `--background`. The colour resolves (CSS var exists) but there is no
  documented `text-background` utility — harmless here (tooltip not built yet), revisit when a Tooltip
  component lands.
- No state axis by design (static element) — nothing missing.

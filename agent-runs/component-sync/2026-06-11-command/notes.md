# component-sync · 2026-06-11 · Command

Sync of the new Figma variant axes into the code (Figma → code). Sets: `.Command` `3642:2`,
`.Command/Input` `3639:2`, `.Command/Group` `3640:9`, `.Command/Separator` `3653:6` (all
`variant` axis, built 2026-06-11 from C2 frame `3554:859`). `.Command/Item` `3559:2` unchanged.
API decisions (user, plan `melodic-cooking-church.md` part B): variant only on the Command root +
context inheritance; items unchanged; CommandSeparator gets `label`.

## Delta (per member: Figma value → code utility)

| Member | Figma (live bindings) | Code |
|---|---|---|
| `.Command` palette | p 0 (raw) · `Corner/corner-md` · stroke 1.5 (raw) · `Overlay/overlay` · Effect `Elevation` | cva `palette: 'corner-md border-[1.5px]'` (no padding; overlay/elevation from the base), `data-variant` + `CommandVariantContext` provider |
| `.Command/Input` palette | row · `shadcn Default/card` · pad `space-xl` · gap `space-lg` · caret 2.5×18 `shadcn Default/primary` + Effect `Glow` (radius 1 raw) · value/placeholder text style `Input`, fills `foreground`/`Input/input-placeholder` · Kbd instance | Wrapper `flex items-center gap-lg border-b bg-card p-xl`; caret span `h-[18px] w-[2.5px] bg-primary shadow-glow`; input `min-w-0 flex-1 text-input text-foreground caret-primary placeholder:text-input-placeholder`; `<Kbd>Esc</Kbd>` |
| `.Command/Group` palette | container pad `[0, space-md, 0, space-md]` · heading = nested `.Command/Separator[labeled]` instance | Container `px-md`; heading via `**:[[cmdk-group-heading]]:` → `flex items-center gap-md px-md pt-lg pb-sm text-eyebrow uppercase text-muted-foreground` + `after:` rule (`h-px flex-1 bg-border`) — px deviation see Deviations |
| `.Command` palette · list slot | padT/padB `space-md` | `CommandList` + `py-md` (context) |
| `.Command/Separator` labeled | row `gap space-md` · pad `[space-lg, space-xl, space-sm, space-xl]` · label fill `muted-foreground`, textCase UPPER (style detached) · rule h1 fill `border`, FILL | `label` prop → `div role=separator` `flex items-center gap-md px-xl pt-lg pb-sm` + eyebrow span + `h-px flex-1 bg-border`; **same hide-on-search contract as the line form** (`useCommandState`, `alwaysRender` opt-out — sharpened on user review) |
| `.Command/Separator` default in p-0 panel | FILL in the borderless panel | line loses `-mx-xs` in the palette context (`h-px bg-border`) |
| CommandDialog (no Figma artefact) | — | `variant` pass-through; DialogContent + `corner-md border-[1.5px]` for palette |

Default members: all unchanged → no delta on the existing code (default class strings byte-identical,
existing specs still green).

## DEVIATIONS (code ≠ literal Figma binding)

| Member | Property | Figma says ↔ code uses | Why |
|---|---|---|---|
| `.Command/Group` palette | heading structure + px | nested `Separator[labeled]` instance with `px-xl` → label indent **24px** (Group px-md 8 + instance 16) ↔ heading styling `px-md` → indent **16px** | The instance nesting entered the file after the user gate (architecture dedup ok), but the instance's px-xl default shifted the label 8px against the approved C2 grid. **RESOLVED 2026-06-11:** instance padding in the Group member overridden to `space-md` (node 3645:1039) — label indent 16px, congruent with code + C2 frame, verified in example 3650:63. Consequence of the nesting: the `heading#3640:1` prop is inert in the palette member — group titles there run via the `label#3653:1` prop of the nested Separator instance. |
| `.Command` palette | prompt divider | own `Separator` instance between input and list ↔ `border-b` on the input wrapper | Code ergonomics: the consumer writes `<CommandInput/><CommandList/>` without a mandatory separator; visually identical. |
| `.Command` palette | footer divider | `Separator` instance after the list slot ↔ composition detail (story sets `<CommandSeparator alwaysRender/>`) | Not a component feature; deliberately left to the consumer. |
| `.Command/Input` palette | caret radius 1px (raw) | no radius | Invisible at 2.5px width; `rounded-*` is dead in the DS, 1px has no corner step. |
| `.Command/Input` palette | value+placeholder coexisting (mid-typing mock) | standard placeholder behaviour, real caret via `caret-primary` | The frame shows one state, not a ghost-text feature (plan decision). |
| `.Command/Separator` labeled + `.Command/Group` heading | text style `Eyebrow` **detached** (textCase-UPPER override detaches the style) | `text-eyebrow uppercase` | Pre-existing pattern defect also on the existing heading; code binds to the format. **Figma fix candidate:** re-apply the style, set UPPER again. |
| Items / Shortcut | frame shows px-xl/py-md/text-label + text-data meta | unchanged `px-md py-sm text-body` / `text-kbd` | User decision "items stay the same"; the 16px alignment comes via Group `px-md` instead. |

## Gate

`nx test|typecheck|lint @agentport/ui` green — **50 tests** (existing 42 + 8 new: default regression,
palette surface, context inheritance Input, labeled-rule heading, list py-md, separator labeled/mx,
dialog pass-through). Typography survival: `text-input` + `caret-primary` verified in the markup.

## Addendum (same day, after the run)

User refinements directly in the code (tables above = status at run time, not rewritten):
`caret-primary` removed again (standard caret), CommandDialog centred vertically
(`top-1/2 -translate-y-1/2` instead of `top-1/3`), list `max-h-96` instead of `max-h-72`, search icon
`text-foreground` instead of `opacity-50`. Additionally a repo-wide utility rename
`text-<format>` → `text-format-<format>` (collision with the Tailwind colour utility `text-input`
from `--color-input`; see tokens-reference §4) — affects all class mentions above.

## Storybook previews

- Palette: http://localhost:6006/?path=/story/ui-command--palette
- Palette In Dialog (⌘K): http://localhost:6006/?path=/story/ui-command--palette-in-dialog
- Palette Flat (labeled Separators): http://localhost:6006/?path=/story/ui-command--palette-flat
- Default (Regression): http://localhost:6006/?path=/story/ui-command--default

# Agentport DS — Component Reference (machine-readable)

One data source for component work: **where everything lives** — in Figma (section / set / node IDs)
and in code (folder / exports / barrel) — plus status, source, the deliberate DS deviations and the
Figma-only forks per component. **Everything an implementer needs is in the YAML blocks**; prose is a
one-line intro per section. Current state only — ports, revisions, sync rounds and removed artefacts
live in [`component-changelog.md`](component-changelog.md). Sister doc:
[`tokens-reference.md`](tokens-reference.md) — look up utilities / values referenced here there.

Sources: `libs/ui/src/components/ui/*`, `libs/ui/src/index.ts`, `libs/ui/{components.json,package.json}`,
Figma "Agentport DS". On drift: **code + Figma win** (update this doc, never the other way round). Figma
reads are read-only (pipeline rule).

## Rules

- **Baseline = `radix-nova`** (`components.json` `style`). `ui:add` pulls the denser Nova source; re-clothe
  it in DS tokens **by name**, not by Nova's raw scale. Never `shadcn init` under radix-nova. Details +
  globals plumbing (data-state custom variants): `handoff-component-port-open.md` §Nova baseline.
- **One folder per component:** `components/ui/<name>/` = `<name>.tsx` + `.stories.tsx` + `.spec.tsx` +
  `index.ts` (barrel `export * from './<name>'`), re-exported from the root barrel `libs/ui/src/index.ts`
  (otherwise unreachable via `@agentport/ui`).
- **Figma is the source of truth for values / density.** A bound variable is authoritative
  (tokens-reference §6 / §7 crosswalk). First port via `/shadcn-component-port`, Figma → code upkeep via
  `/component-sync` (read-only Figma). A code → Figma push is the exception, not the default (manual
  `use_figma`).
- **Status vocabulary** (`status`): `nova-aligned` = ported **and** aligned to the radix-nova density ·
  `ported` = ported, still new-york density · `pending` = not (yet / again) in code · `removed` =
  deliberately removed. `figma_synced: true` = at least one `/component-sync` or push round happened.
- **Geometry stays numeric** (`h-8`, `size-3`, `min-w-5`); only colour / typography / spacing / radius
  bind to tokens. No dark mode (light is the only mode).
- **Entry fields are current facts, never history.** `deviations` = deliberate departures from stock
  shadcn with the reason; `forks` = Figma-only axes / props and code-only parts — **never sync a fork
  back** as a CVA / prop; `figma_mechanics` = what an editor must know to change the set safely;
  `divergences` = code ↔ Figma structural differences that are **not** a delta for `/component-sync`;
  `open` = known gaps. Dates, old names and old values belong in the changelog.
- IDs are **Figma node IDs** in file `nQSNLASjuLvgTh3we8Dp4s` (configured in
  `.claude/skills/{shadcn-component-port,component-sync}/config.json`). They are stable (not session IDs).
- `code.stories` / `specs` / `cva` are read from the source (story file → Storybook title → story names; cva
  axes + defaults, `none` when the component has no cva) — the code side of the axis ↔ prop diff.
- `vars` / `styles` per entry = the semantic variables and styles **actually bound inside the component's
  Section** (incl. usage examples), read from the live file; typography part variables are represented by
  their text style.

## Schema (per component)

```
name · status · figma_synced · source{registry,item,style} ·
code{dir, exports[], barrel, types?, stories[], specs[], cva, variants?, internal?, code_only_parts?} ·
figma{section, set|component|composition…, members?, slots?, props?, axis, examples?, vars, styles} ·
skill · description · anatomy · deps? · deviations? · forks? · figma_mechanics? · divergences? · a11y? · open? · run_notes?
```

## Architecture

```yaml
figma:
  file_key: nQSNLASjuLvgTh3we8Dp4s
  file_name: "Agentport DS"
  components_page: { name: "Components", id: "3126:2" }   # every UI component set lives here
  other_pages: [Color, "----", Artboards]
baseline:
  shadcn_style: radix-nova            # components.json
  registry: "@shadcn"
modes: [light]
package: "@agentport/ui"              # components via the root barrel; blocks via the ./blocks subpath
pipeline:
  port: "shadcn (@shadcn/<item>, style radix-nova) → /shadcn-component-port: read anatomy → build token-bound Figma set → code on DS utilities"
  sync: "/component-sync: Figma change → code delta (read-only Figma)"
code_layout:
  components: "libs/ui/src/components/ui/<name>/  →  barrel libs/ui/src/index.ts  →  @agentport/ui"
  blocks:     "libs/ui/src/blocks/<screen>/<name>/  →  @agentport/ui/blocks[/<screen>]"
blocks:
  role: "presentational organisms composed from the primitives, one folder per screen"
  status: "layer exists (libs/ui/src/blocks/index.ts, export ./blocks); no organism ported"
commands:
  port:  "/shadcn-component-port <name>"
  sync:  "/component-sync <name>"
  skill_feedback: "/skill-feedback kind=component-port subject=<name>   # before a port / sync"
  gate:  "npx nx test|typecheck|lint @agentport/ui"
  nova_source: "https://ui.shadcn.com/r/styles/radix-nova/<component>.json   # inspect before ui:add"
variable_ids:   # VariableID:<id> of the semantic variables the components bind (resolved from the live file); names = tokens-reference
  surface: "3037:2"
  ink: "3037:3"
  dialog-fill: "3037:6"
  dialog-ink: "3037:7"
  primary-fill: "3037:8"
  primary-ink: "3037:9"
  muted-fill: "3037:12"
  muted-ink: "3037:13"
  muted: "4492:2666"
  accent-fill: "3037:14"
  accent-ink: "3038:2"
  destructive: "3038:3"
  destructive-ink: "3052:2"
  border: "3038:4"
  ring: "3038:6"
  input-fill: "3108:2"
  input-fill-high: "4197:9645"
  input-border: "4197:9644"
  input-ink-placeholder: "3043:3"
  inverse-ink-muted: "4663:4413"
  scrim: "3588:2"
  scrim-opacity: "3618:3"
  space-2xs: "3070:3"
  space-xs: "3070:4"
  space-sm: "3070:5"
  space-md: "3070:6"
  space-lg: "3070:8"
  space-xl: "3070:9"
  corner-sm: "3073:2"
  corner-md: "3073:3"
  corner-lg: "3073:4"
  corner-full: "3073:6"
  deleted: ["3038:5 (old shadcn Default/input)", "3116:2 (background-fixed)"]   # still resolvable by id, no bindings left — a hit on either is a regression
open:
  - "Page Artboards (1099:8958): reference screen 'Quiet' 1099:9710 (section 'Final') still carries content from the origin project — neutralise or remove before the file key is published."
  - "Figma debt across the input family: focus / invalid DROP_SHADOW effect colours are raw hex (unbound) instead of the ring / destructive variables; the code uses the role-correct tokens."
```

## Components

```yaml
- name: Badge
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: badge, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/badge/
    exports: [Badge, badgeVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/badge'"
    types: [BadgeProps]
    stories:
      - "badge.stories.tsx → UI/Badge (Default, Variants, WithIcon, Count, AsChild)"
    specs: [badge.spec.tsx]
    cva:
      badgeVariants: { variant: [default, secondary, destructive, outline, ghost, link], defaults: {variant: default} }
  figma:
    section: { name: "Badge", id: "3687:1016" }
    set: { name: "Badge", id: "3697:1016" }
    members: { default: "3691:2", secondary: "3691:7", destructive: "3691:12", outline: "3693:2", ghost: "3693:7", link: "3693:12" }
    slots: { icon: "icon#3697:0" }                  # leading-icon slot; default 12px check vector, empty → text only
    axis: { variant: [default, secondary, destructive, outline, ghost, link] }
    vars: [ink, border, corner-full, destructive, destructive-ink, primary, primary-fill, primary-ink, secondary-fill, secondary-ink, space-2xs, space-md, space-xs]
    styles: [text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "A compact status pill; variant carries the tone from solid emphasis to quiet outline/ghost. Informative by default — via asChild it wraps a real link or button and stays a pill."
  anatomy: "Single-element CVA span (asChild via Radix Slot, data-slot / data-variant, [&>svg]:size-3 icon)."
  deviations:
    - "All 6 Nova variants kept (ghost / link are Nova extras over the doc's 4) — in code and in the full Figma matrix."
    - "Shape: corner-full pill; text-format-label-md (no 12px sans format → role-picked 14px); px-md / py-2xs / gap-xs; h-5 / size-3 numeric."
    - "Colour: default bg-primary-fill + text-primary-ink · secondary bg-secondary-fill + text-secondary-ink · destructive SOLID bg-destructive + text-destructive-ink (stock is a /10 tint) · outline border + text-ink · ghost text-ink with muted-fill / muted-ink hover · link text-primary."
    - "Focus: border-ring + ring-ring/50 ring-[3px]; dark: dropped."
  divergences:
    - "asChild and the count-pill (font-mono tabular min-w-5) are code-level overrides, not Figma variants."
  run_notes: [agent-runs/component-port/2026-06-12-badge/, agent-runs/component-sync/2026-06-17-badge/]

- name: Button
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: button, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/button/
    exports: [Button, buttonVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/button'"
    types: [ButtonProps]
    stories:
      - "button.stories.tsx → UI/Button (Default, Icon, AllVariants, AllStates, AsChild, AllSizes, AllIconSizes)"
    specs: [button.spec.tsx]
    cva:
      buttonVariants: { variant: [default, destructive, outline, secondary, ghost, link], size: [default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg], defaults: {variant: default, size: default} }
  figma:
    section: { name: "Button", id: "3126:3" }
    base_section: { name: "Button · Base", id: "3145:2" }
    set: { name: "Button", id: "3164:312" }       # 220-member matrix variant × size × state
    base: { name: ".Button/Base", id: "3159:12" } # decoupled base set (surface / radius / padding + state-layer RECTANGLE)
    axis: { variant: [default, destructive, outline, secondary, ghost, link],
            size: [default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg],
            state: [default, hover, active, focus, disabled] }
    vars: [accent-fill, accent-ink, ink, surface, border, corner-lg, corner-md, destructive, destructive-ink, muted-fill, primary, primary-fill, primary-ink, secondary-fill, secondary-ink, space-md, space-sm, space-xs]
    styles: [text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "The action trigger: variant sets the semantic weight (solid primary through quiet ghost and link), size the geometry scale. One component covers text, text-with-icon and square icon-only buttons — icon-only requires its own accessible name. Via asChild a link can wear the button look without losing its semantics."
  anatomy: "CVA button; public API = variant + size (the geometry scale) + icon boolean — the square icon* cva keys are mapped in render, not public sizes."
  deviations:
    - "Nova size ladder (h-8 default, xs, per-size icon sizing, aria-expanded)."
    - "Colour: default bg-primary-fill + text-primary-ink · secondary bg-secondary-fill + text-secondary-ink · destructive bg-destructive + text-destructive-ink · outline bg-surface + border, hover bg-accent-fill / text-accent-ink · ghost hover accent-fill / accent-ink · link text-primary."
    - "Radius by name: corner-lg default, corner-md for xs / sm / icon-xs / icon-sm; text-format-label-md; dark: removed."
    - "Focus ring = ring-ring/50 ring-[3px]."
  forks:
    - "The state axis [default, hover, active, focus, disabled] is a Figma model of CSS states — code has no state prop; the icon* size keys are internal cva keys behind the icon boolean."
  figma_mechanics:
    - "hover / active are driven by a state-layer overlay on .Button/Base → code uses the /opacity idiom (bg-primary-fill/90 etc.)."
  a11y:
    - "Icon-only (icon boolean) requires aria-label / aria-labelledby at the type level."
  open:
    - "Figma focus effect colour is raw #4a5562 @ 50 % (unbound) — should bind ring."
    - "size=icon binds .Button/Base to corner-lg but the state-layer to corner-md — align to corner-lg (= code)."
  run_notes: [agent-runs/component-sync/2026-06-17-button/]

- name: Input
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: input, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/input/
    exports: [Input]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/input'"
    types: [InputProps]
    stories:
      - "input.stories.tsx → UI/Input (Default, WithLabel, WithDescription, WithError, Form, File, AllStates)"
    specs: [input.spec.tsx]
    cva: none
  figma:
    section: { name: "Input", id: "3176:302" }
    set: { name: "Input", id: "3177:302" }
    axis: { state: [default, focus, filled, disabled, invalid, focus-invalid] }   # no CVA in code
    focus_member: "3176:305"   # the canonical focus-glow recipe other sets copy verbatim
    focus_invalid_member: "3692:1249"   # the canonical focus-invalid recipe (destructive border + destructive/20 glow)
    vars: [ink, corner-lg, destructive, ring, input-border, input-fill, input-ink-placeholder, space-md, space-xs]
    styles: [text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "The single-line text field. It has no variants — focus, invalid, disabled and filled are live states driven by the control itself, not props. On its own it is unlabeled: it becomes a real form field only composed with the Field family."
  anatomy: "Single element, no CVA; state axis only."
  deviations:
    - "h-8 / corner-lg / px-md / py-xs / file:h-6; bg-input-fill (opaque, stock is transparent); text-format-label-md; placeholder text-input-ink-placeholder; selection bg-primary-fill / text-primary-ink."
    - "Focus border-ring + ring-ring/50 ring-[3px]; invalid border-destructive + ring-destructive/20 (focus-gated: ring width only from focus-visible). dark: removed."
  forks:
    - "focus-invalid is a Figma member only — code composes it from focus-visible: + aria-invalid:."
  a11y:
    - "The invalid state is driven by aria-invalid on the element (no prop); Field / FieldError supply it in composition."
  run_notes: [agent-runs/component-sync/2026-06-17-input/]

- name: Textarea
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: textarea, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/textarea/
    exports: [Textarea]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/textarea'"
    types: [TextareaProps]
    stories:
      - "textarea.stories.tsx → UI/Textarea (Default, WithLabel, WithDescription, WithError, AllStates)"
    specs: [textarea.spec.tsx]
    cva: none
  figma:
    section: { name: "Textarea", id: "3487:674" }
    set: { name: "Textarea", id: "3488:684" }
    axis: { state: [default, focus, filled, disabled, invalid, focus-invalid] }   # no CVA; sibling of Input
    vars: [ink, corner-lg, destructive, ring, input-border, input-fill, input-ink-placeholder, space-md]
    styles: [text:Label/md]
  skill: /shadcn-component-port
  description: "The multiline sibling of Input — same state behaviour, a taller box that grows with its content. Like Input, label and error text come from composing it with the Field family."
  anatomy: "Field twin of Input, taller; field-sizing-content (auto-grow)."
  deviations:
    - "min-h-16 / corner-lg / px-md / py-md; same colour clothing as Input. dark + disabled:bg-input/50 removed."
  forks:
    - "focus-invalid is a Figma member only (see Input)."
  a11y:
    - "The invalid state is driven by aria-invalid on the element (no prop)."
  figma_mechanics:
    - "Text top-aligned (counterAxis MIN), no truncation."
  run_notes: [agent-runs/component-port/2026-06-09-textarea/]

- name: InputGroup
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: input-group, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/input-group/
    exports: [InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/input-group'"
    types: [InputGroupAddonProps, InputGroupButtonProps]
    stories:
      - "input-group-addon.stories.tsx → UI/InputGroup/InputGroupAddon (Default)"
      - "input-group-button.stories.tsx → UI/InputGroup/InputGroupButton (Default)"
      - "input-group.stories.tsx → UI/InputGroup (Default, Icons, Text, WithLabel, Kbd_, Buttons, Textarea, States)"
    specs: [input-group.spec.tsx]
    cva:
      inputGroupAddonVariants: { align: [inline-start, inline-end, block-start, block-end], defaults: {align: inline-start} }
      inputGroupButtonVariants: { size: [xs, sm, icon-xs, icon-sm], defaults: {size: xs} }
  figma:
    section: { name: "Input Group", id: "3519:590" }
    addon: { name: "InputGroupAddon", id: "3520:606", axis: "align [inline-start, inline-end, block-start, block-end]", slot: content }
    button: { name: "InputGroupButton", id: "3545:694", axis: "size [xs, sm, icon-xs, icon-sm]",
              nests: "ghost .Button instance per size (xs → xs, sm → default, icon-xs → icon-xs, icon-sm → icon); Base radius → corner-sm on xs + icon-xs",
              content: "label = deep text override; icon = swapComponent .Button Icon → swap target (.InputGroup/Button Icon · copy 3546:677)" }
    input: { name: "InputGroupInput", id: "3522:590", prop: text }
    textarea: { name: "InputGroupTextarea", id: "3522:592", prop: text }
    text: { name: "InputGroupText", id: "3522:594", prop: text }
    composition: { name: "InputGroup", id: "3525:622", axes: "state [default, focus, disabled, invalid, focus-invalid] × layout [horizontal, vertical]", slot: content }
    examples: { headline: "3533:672", Icons: "3527:613", Text: "3527:650", Buttons: "3546:697", States: "3528:662 / 3528:681 / 3528:700", Textarea: "3547:711", Kbd: "3531:676" }   # example instances sit directly in the section
    axis: { composition_state: [default, focus, disabled, invalid, focus-invalid], composition_layout: [horizontal, vertical], addon_align: [inline-start, inline-end, block-start, block-end], button_size: [xs, sm, icon-xs, icon-sm] }
    vars: [ink, corner-lg, corner-md, corner-sm, destructive, destructive-ink, ring, input-border, input-fill, input-ink-placeholder, muted, muted-fill, muted-ink, space-md, space-sm, space-xs]
    styles: [text:Body, text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "Fuses a control and its adornments (icons, buttons, text) into one field: the group owns border, focus and invalid treatment, the control inside goes borderless. Addons sit beside the control or as a bar above/below it. State always originates from the inner control — the group has none of its own, it mirrors."
  anatomy: "6-part composite: the GROUP owns surface + border + focus / invalid / disabled (has-[control:focus-visible] / has-[aria-invalid] / has-disabled); controls are borderless (border-0 bg-transparent, data-slot=input-group-control)."
  deps: [Button, Input, Textarea, Kbd]
  deviations:
    - "Group carries bg-input-fill (opaque); Addon text-format-label-md + text-muted; Text text-format-body + text-muted; Button = ghost variant."
    - "invalid carries ring-[3px] + ring-destructive/20 (stock dropped the width)."
  forks:
    - "focus-invalid is a Figma member only — code composes it from has-[control:focus-visible] + has-[aria-invalid]."
  figma_mechanics:
    - "Three layers: container composition (state × layout) with a children slot, addon with a content slot, Input / Textarea / Text as text props."
    - "Button nests a real ghost .Button instance (not a standalone re-clothe) → token + component propagation; geometry delta via Base override, icon content via swapComponent (the DS Button exposes no free icon slot)."
    - "Kbd ⌘ is a vector (RiCommandLine), not a text glyph."
  a11y:
    - "The group renders role=group; its state classes are driven by the control's aria-invalid / disabled (has-[…]) — no prop of its own."
  run_notes: [agent-runs/component-port/2026-06-09-input-group/, agent-runs/component-port/2026-06-10-input-group/, agent-runs/component-sync/2026-06-17-input-group/]

- name: Kbd
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: kbd, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/kbd/
    exports: [Kbd, KbdGroup, kbdVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/kbd'"
    types: [KbdProps]
    stories:
      - "kbd.stories.tsx → UI/Kbd (Default, Emphasis, SingleKeys, WithIcon, Group, Combo, InText)"
    specs: [kbd.spec.tsx]
    cva:
      kbdVariants: { emphasis: [high, low], defaults: {emphasis: high} }
  figma:
    section: { name: "Kbd", id: "3215:302" }
    set: { name: "Kbd", id: "3217:308" }             # 2 axes content × emphasis = 4 members
    members:
      "content=text, emphasis=high": "3217:302"      # defaultVariant
      "content=icon, emphasis=high": "3217:304"
      "content=text, emphasis=low":  "3428:1385"
      "content=icon, emphasis=low":  "3428:1387"
    slots: { property: "icon#3217:1", nodes: { high: "3217:305", low: "3428:1388" } }  # 12px vector
    axis: { content: [text, icon], emphasis: [high, low] }   # content is children-driven; emphasis = code prop (default high)
    vars: [corner-sm, inverse-fill, inverse-ink, muted-fill, muted-ink, space-xs]
    styles: [text:Kbd]
  skill: /shadcn-component-port; /component-sync
  description: "A keycap for spelling keyboard shortcuts in the UI; emphasis switches between the loud inverted cap and a quiet one. Display-only — it never receives interaction; chords are several caps in a KbdGroup."
  anatomy: "Keycap span with an emphasis prop; KbdGroup = inline row."
  deviations:
    - "emphasis=high (default) = inverted dark keycap (bg-inverse-fill + text-inverse-ink); emphasis=low = quiet keycap (bg-muted-fill + text-muted-ink). text-format-kbd (Geist Mono); gap-xs / px-xs; corner-sm."
    - "Nova Kbd is metrically identical to new-york (no density change)."
  divergences:
    - "Tooltip-context overrides (in-data-[slot=tooltip-content]: bg-muted-fill / text-ink) are code-only stock carry-over with no Figma binding."
  run_notes: [agent-runs/component-sync/2026-06-09-kbd/, agent-runs/component-sync/2026-06-17-kbd/]

- name: Breadcrumb
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: breadcrumb, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/breadcrumb/
    exports: [Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/breadcrumb'"
    types: [BreadcrumbLinkProps]
    stories:
      - "breadcrumb.stories.tsx → UI/Breadcrumb (Default, TwoLevels, WithEllipsis, CustomSeparator, AsRouterLink)"
    specs: [breadcrumb.spec.tsx]
    cva: none
  figma:
    section: { name: "Breadcrumb", id: "3249:302" }
    composition: { name: "Breadcrumb", id: "3254:302" }        # items gap Space/space-sm (6px)
    segment_set: { name: "Segment", id: "3250:308" }
    segment_members: { "state=link": "3250:302", "state=link-hover": "3250:304", "state=page": "3250:306" }
    separator: { name: ".Separator", id: "3251:302" }            # icon 14px → size-3.5
    ellipsis: { name: "Ellipsis", id: "3251:305" }              # 20×20, icon 16px → size-4
    axis: { segment_state: [link, link-hover, page] }
    vars: [ink, muted, space-sm, space-xs]
    styles: [text:Body]
  skill: /shadcn-component-port; /component-sync
  description: "The path trail: composed from links, separators and the current-page leaf — no props, you assemble the parts. The key distinction is link vs. current page: the leaf is its own part carrying aria-current, not a styled link; an ellipsis part collapses long trails."
  anatomy: "Multipart: list + segments + separator / ellipsis glyphs."
  deviations:
    - "Colour: link rest text-muted, link-hover + page text-ink; separator / ellipsis icons inherit currentColor (no explicit class). Body → text-format-body."
    - "Gaps: item gap-xs (4px), list gap-sm (6px); ellipsis size-5; break-words → v4 wrap-break-word. Nova density decided in code and pushed to Figma."
  a11y:
    - "Breadcrumb = <nav aria-label='breadcrumb'>; BreadcrumbPage = role=link + aria-current=page + aria-disabled; separator / ellipsis are role=presentation + aria-hidden, the ellipsis carries a visually hidden 'More' label."
  forks:
    - "segment_state link-hover is a Figma member for the CSS hover; page = BreadcrumbPage (aria-current), not a prop of BreadcrumbLink."
  run_notes: [agent-runs/component-port/2026-06-08-breadcrumb/, agent-runs/component-sync/2026-06-17-breadcrumb/]

- name: Command
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: command, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/command/
    exports: [Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, commandVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/command'"
    types: [CommandDialogProps, CommandProps, CommandSeparatorProps]
    stories:
      - "command-dialog.stories.tsx → UI/Command/CommandDialog (Default, Palette, PaletteFlat)"
      - "command-separator.stories.tsx → UI/Command/CommandSeparator (Default)"
      - "command.stories.tsx → UI/Command (Default, Palette, PaletteFlat, Empty)"
    specs: [command.spec.tsx]
    cva:
      commandVariants: { variant: [default, palette], defaults: {variant: default} }
    variants: "variant: default | palette — ONLY on the Command root / CommandDialog (cva); Input / List / Group / Separator inherit via the module-internal CommandVariantContext (ToggleGroup idiom); data-variant on the root. CommandSeparator additionally takes a label prop (labeled rule, role=presentation div; same hide-on-search contract as the line form via useCommandState + alwaysRender)."
  figma:
    section: { name: "Command", id: "3555:679" }
    item:
      set: { name: "CommandItem", id: "3559:2" }
      axis: { state: [default, selected, disabled, checked] }
      props: "icon#3559:0 (INSTANCE_SWAP → Calendar) · showIcon#3559:5 (bool) · label#3559:10 (text) · shortcut#3559:15 (bool) · shortcutText#3559:20 (text)"
      members: { default: "3558:2", selected: "3558:7", disabled: "3558:12", checked: "3558:17" }
    input:
      set: { name: "CommandInput", id: "3639:2" }
      axis: { variant: [default, palette] }
      props: "value#3639:0 (text) · placeholder#3639:1 (text) — bound on the palette member only"
      members: { default: "3561:2", palette: "3638:8" }
      default: "nests an .InputGroup instance 3561:3 (opaque DS surface) + search vector + text-format-label-md placeholder"
      palette: "prompt row: bg-card-fill + p-xl + gap-lg · caret bar 2.5×18 (primary shape fill + Glow effect style) · value / placeholder text-format-data-lg (mono 18) · real .Kbd instance (content=text, emphasis=high) 'Esc'"
    separator:
      set: { name: "CommandSeparator", id: "3653:6" }
      axis: { variant: [default, labeled] }
      props: "label#3653:1 (text) — bound on the labeled member only"
      members: { default: "3564:2", labeled: "3653:5" }
      default: "1px line (border); full-bleed comes from the p-0 panel of the palette composition"
      labeled: "labeled rule: eyebrow label (textCase UPPER, muted) + trailing line (h1 fill, border) · gap-md px-xl pt-lg pb-sm — for free / flat compositions; CommandGroup[palette] still draws its own heading (cmdk auto-hide stays with the group route)"
    empty: { name: "CommandGroup/CommandEmpty", id: "3564:3", prop: "message (text)" }
    group:
      set: { name: "CommandGroup", id: "3640:9" }
      axis: { variant: [default, palette] }
      props: "heading#3640:1 (text, eyebrow UPPER)"
      slot: "items#3640:0"
      members: { default: "3565:2", palette: "3640:2" }
      palette: "heading = nested CommandSeparator[labeled] instance (px overridden to space-md → 16px label inset like the item icons) · container px-md py-0. The heading prop is INERT on the palette member — set group titles via the label prop of the nested separator instance."
    composition:
      set: { name: "Command", id: "3642:2" }
      axis: { variant: [default, palette] }
      slot: "list#3642:0"
      members: { default: "3566:2", palette: "3641:2" }
      default: "bg-dialog-fill + border + shadow-elevation + corner-xl + p-xs"
      palette: "bg-dialog-fill + border 1.5px + shadow-elevation + corner-md + p-0 · prompt divider + footer divider (CommandSeparator instances, fill) · list slot py-md · default slot content = demo (JUMP TO / SEARCH / RUN)"
    examples: { group: "Usage Examples 3875:1394", command-demo: "3573:2", palette-demo: "3650:63" }
    axis: { variant: [default, palette], item_state: [default, selected, disabled, checked], separator_variant: [default, labeled] }
    icons: { Calendar: "3557:4", Emotion: "3557:7", Calculator: "3557:10", User: "3557:13", Card: "3557:16", Settings: "3557:19", ArrowRight: "3644:4", Swap: "3644:7", Search: "3644:10", Play: "3644:13", Download: "3644:16" }
    vars: [accent-fill, accent-ink, ink, surface, border, card-fill, corner-lg, corner-md, corner-sm, corner-xl, dialog-fill, input-border, input-fill, input-ink-placeholder, inverse-fill, inverse-ink, muted, primary, space-2xl, space-lg, space-md, space-sm, space-xl, space-xs]
    styles: [effect:Elevation, effect:Glow, text:Body, text:Data/lg, text:Kbd, text:Label/md, text:Eyebrow]
  skill: /shadcn-component-port; /component-sync
  description: "The command palette: typing filters and re-ranks the list, with a built-in empty state. Composed from input, list, groups, items, shortcuts and separators; the same palette runs inline or inside a modal as the app's ⌘K launcher, and variant=\"palette\" reshapes it into that launcher form."
  anatomy: "Multi-composite on cmdk (Command root, Dialog wrapper, Input, List, Empty, Group, Item, Shortcut, Separator) with a variant axis default | palette."
  deps: [InputGroup, Button, Input, Textarea, Dialog, Kbd]
  deviations:
    - "Surface: panel = dialog-fill + border + shadow-elevation (overlay depth); search field = text-format-label-md (sans 14) on the opaque InputGroup (Nova's border-input/30 bg-input/30 dropped)."
    - "Selection = accent tint (data-selected bg-accent-fill + text-accent-ink), NOT the stock neutral grey."
    - "Group heading = text-format-eyebrow + uppercase (mono micro-label); shortcut = text-format-kbd; secondary text text-muted."
    - "Palette variant: prompt row bg-card-fill / p-xl / gap-lg with a static caret bar (bg-primary shape fill + shadow-glow), text-format-data-lg, Kbd Esc; list max-h-96; group-heading inset px-md."
    - "Icons: lucide → @remixicon/react (RiSearchLine / RiCheckLine)."
    - "CommandDialog wraps children as the Command root (new-york-v4 contract; Nova's bare-children source breaks the doc usage) — panel centred (top-1/2 -translate-y-1/2), p-0 + overflow-clip, inner Command border-0 / shadow-none, Item in-data-[slot=dialog-content]:corner-lg."
  forks:
    - "CommandDialog has no Figma artefact — the Command composition carries no dialog axis."
  figma_mechanics:
    - "Three layers: Item set, nested InputGroup, composition with list / items slots + reproduced example instance. Slots are built EMPTY (default slot content in instances is virtual / not removable); demo content lives in the palette member."
  divergences:
    - "Prompt divider: code border-b on the wrapper, Figma a Separator instance — structural, not a delta."
  a11y:
    - "CommandList renders role=listbox → only option / group children allowed: CommandSeparator renders its own role=presentation div (cmdk sets role after the prop spread), CommandEmpty renders a disabled role=option so the empty listbox has an allowed child and screen readers announce the no-results message."
  run_notes: [agent-runs/component-port/2026-06-10-command/, agent-runs/component-port/2026-06-11-command-dialog/, agent-runs/component-sync/2026-06-10-command/, agent-runs/component-sync/2026-06-11-command/, agent-runs/component-sync/2026-06-17-command/]

- name: Dialog
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: dialog, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/dialog/
    exports: [Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/dialog'"
    types: [DialogContentProps, DialogFooterProps, DialogProps]
    stories:
      - "dialog-content.stories.tsx → UI/Dialog/DialogContent (Default)"
      - "dialog-footer.stories.tsx → UI/Dialog/DialogFooter (Default)"
      - "dialog.stories.tsx → UI/Dialog (Default, BasicConfirm, DestructiveConfirm, ScrollableContent, StickyFooter, NoCloseButton)"
    specs: [dialog.spec.tsx]
    cva: none
  figma:
    section: { name: "Dialog", id: "3589:788" }
    composition:
      name: "Dialog"
      id: "3592:794"
      props: "title#3593:2 (text) · description#3593:3 (text) · showCloseButton#3593:4 · showFooter#3593:5 · showBody#3606:0 (bools)"
      slots: { body: "3609:890 (empty; wrapper body-region visible ↔ showBody)", footer: "3593:795 (default = DialogFooter instance 3593:796)" }
      nests: "ghost icon-sm .Button instance 3593:806 as Close (ABSOLUTE top-right, icon via swapComponent → .Dialog/Icon/Close)"
    footer: { name: "DialogFooter", id: "3591:788", slot: "actions#3591:789 (default: Cancel outline + Save default .Button instances)" }
    overlay: { name: "DialogOverlay", id: "3590:791", fill: "scrim (3588:2, alias → neutral/900) × layer opacity scrim-opacity (3618:3, alias → opacity/10) + BACKGROUND_BLUR 4" }
    icon: { name: ".Dialog/Icon/Close", id: "3590:790" }
    examples: { group: "Usage Examples 3875:1296", dialog-demo: "3595:807", scrollable-content: "3595:829", sticky-footer: "3598:840", no-close-button: "3603:858", dialog-on-overlay: "3604:888" }
    axis: { }   # composition with boolean props (showCloseButton / showFooter / showBody), no variant axis
    vars: [ink, surface, border, corner-lg, corner-md, corner-xl, dialog-fill, dialog-ink, muted, muted-fill, primary-fill, primary-ink, scrim, scrim-opacity, secondary-fill, secondary-ink, space-lg, space-md, space-sm, space-xl]
    styles: [effect:Elevation, text:Body, text:Label/md, text:Title]
  skill: /shadcn-component-port; /component-sync
  description: "The modal: scrim, focus trap, dismiss via corner close, footer close, Escape or overlay click. A DialogTitle is mandatory — it is the dialog's accessible name. The footer is its own part with an optional built-in close action."
  anatomy: "Radix composite (radix-ui Dialog); panel composition + footer + overlay as separate Figma components."
  deps: [Button]
  deviations:
    - "Panel = bg-dialog-fill + border + shadow-elevation + corner-xl (Nova's ring-1 ring-foreground/10 replaced — raised-surface depth like Command)."
    - "Scrim = the scrim token (neutral/900 @ 10 %, stock bg-black/10 dead) + backdrop-blur-xs."
    - "Title text-format-title (18/800; Nova 16/500 has no DS rung); body / description text-format-body, description text-muted."
    - "Footer = tinted Nova band (bg-muted-fill/50, border-t, bleed -mx-xl / -mb-xl, corner-b-xl) as its OWN component, default-instantiated in the footer slot; DialogFooter.showCloseButton (DS flat prop, default false) renders an outline Close button."
    - "Geometry numeric (top-2 / right-2, max-w-*)."
  forks:
    - "showBody / showFooter are Figma booleans for the demo composition — code composes body and DialogFooter as children; showCloseButton is a real DialogContent prop."
  figma_mechanics:
    - "Never bind visibility on a SLOT directly (it degrades to a FRAME) → a wrapper frame carries the showBody boolean."
    - "Scrim is its own DialogOverlay component; the panel composition stays scrim-free."
  a11y:
    - "Radix wires aria-labelledby / aria-describedby to DialogTitle / DialogDescription — every dialog needs a DialogTitle; the close button carries a visually hidden 'Close' label."
  divergences:
    - "CommandDialog reuses this Dialog (see Command)."
  run_notes: [agent-runs/component-port/2026-06-10-dialog/, agent-runs/component-sync/2026-06-17-dialog/]

- name: Separator
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: separator, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/separator/
    exports: [Separator]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/separator'"
    types: [SeparatorProps]
    stories:
      - "separator.stories.tsx → UI/Separator (Default, HorizontalBetweenBlocks, VerticalInRow, Orientations)"
    specs: [separator.spec.tsx]
    cva: none
  figma:
    section: { name: "Separator", id: "3675:1016" }
    set: { name: "Separator", id: "3676:1018" }
    members: { "orientation=horizontal": "3676:1016", "orientation=vertical": "3676:1017" }
    axis: { orientation: [horizontal, vertical] }   # static / non-interactive → content axis, NO CVA
    vars: [border]
    styles: []
  skill: /shadcn-component-port; /component-sync
  description: "A hairline divider, horizontal or vertical. decorative decides whether it is announced as a semantic separator or hidden from assistive tech — the line itself never changes."
  anatomy: "Static, non-interactive element (Radix Separator.Root)."
  a11y:
    - "decorative=true (default) → role=none / aria-hidden; decorative=false → role=separator + aria-orientation."
  deviations:
    - "1px line, fill bound to border (the default edge — NOT border-emphasis / -strong). Class string bg-border + data-horizontal:h-px/w-full + data-vertical:w-px/self-stretch; shrink-0 keeps the line in a flex row."
  run_notes: [agent-runs/component-port/2026-06-12-separator/, agent-runs/component-sync/2026-06-17-separator/, agent-runs/component-sync/2026-08-31-separator/]

- name: Label
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: label, style: radix-nova }   # co-ported via `ui:add field`
  code:
    dir: libs/ui/src/components/ui/label/
    exports: [Label]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/label'"
    types: [LabelProps]
    stories:
      - "label.stories.tsx → UI/Label (Default, WithInput, WithCheckbox, DisabledPeer)"
    specs: [label.spec.tsx]
    cva: none
  figma:
    section: { name: "Label", id: "3733:1022" }
    set: { name: "Label", id: "3735:1024" }
    members: { "state=default": "3734:1022", "state=disabled": "3735:1022" }   # disabled = opacity 0.5
    props: "label (children)#3735:0 (TEXT, default '{Label}' — children-driven text props use the (children) suffix + {…} default) · state (VARIANT [default, disabled])"
    axis: { state: [default, disabled] }
    nests_into: ".Field label slot (all Field members) as a real .Label instance"
    vars: [ink, space-md]
    styles: [text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "The caption that names a control via the htmlFor↔id pairing: clicking it focuses or toggles the control, screen readers read it as the field name. It has no state of its own — it only dims in reaction to a disabled control."
  anatomy: "Radix Label (LabelPrimitive.Root); single element, no CVA. Hard Field dependency (FieldLabel wraps Label)."
  deviations:
    - "text-format-label-md (14/500, fill ink); gap-md; select-none + group/peer-disabled opacity unchanged."
  forks:
    - "The state axis [default, disabled] is a Figma convenience so a real set exists — code has no label-state prop (disabled is group/peer-disabled-driven). Never sync back as a CVA."
  run_notes: [agent-runs/component-port/2026-06-12-field/, agent-runs/component-sync/2026-06-12-field-figma-revision/, agent-runs/component-sync/2026-06-17-label/]

- name: Field
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: field, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/field'"
    types: [FieldErrorProps, FieldProps]
    stories:
      - "field-error.stories.tsx → UI/Field/FieldError (Default)"
      - "field.stories.tsx → UI/Field (Default, InputField, TextareaField, Fieldset, Responsive, Invalid, Disabled, Horizontal)"
    specs: [field.spec.tsx]
    cva:
      fieldVariants: { orientation: [vertical, horizontal, responsive], defaults: {orientation: vertical} }
    code_only_parts: [FieldTitle, "orientation=responsive"]   # responsive = container query only (a wrap proxy is not a faithful Figma model)
  figma:
    section: { name: "Field", id: "3710:1016" }
    set: { name: "Field", id: "3716:1020" }
    members:
      "orientation=vertical, invalid=false, controlPosition=trailing":   "3712:1016"
      "orientation=vertical, invalid=true, controlPosition=trailing":    "3713:1017"
      "orientation=horizontal, invalid=false, controlPosition=trailing": "3714:1018"
      "orientation=horizontal, invalid=true, controlPosition=trailing":  "3715:1019"
      "orientation=horizontal, invalid=false, controlPosition=leading":  "3897:1240"
      "orientation=horizontal, invalid=true, controlPosition=leading":   "3897:1249"
    slots: { label: "label#3716:0", control: "control#3716:1", description: "description#3716:2", error: "error#3716:3" }
    bool_props: { "Show description": "Show description#3692:15 (default true)", "Show error": "Show error#3692:20 (default true)" }   # visibility of the description / error slot
    nests: ".Input (state=default 3176:303 / state=invalid 3176:311) as control-slot default; label slot nests a real .Label instance (3737:1022/1024/1026/1028); FieldSeparator idiom = .Separator 3676:1018 (not rebuilt)"
    horizontal_structure: "shadcn-canonical (field.tsx horizontal variant + Responsive story): FieldContent column LEFT (label + description + [error], VERTICAL gap-2xs) · control slot as SIBLING to the right · row flex-row items-start (counterAxis MIN) · FieldContent FILL / flex-1, control FIXED 160 · members HUG height (so the bool toggles reflow the column). FieldContent frames: 3714:1021 (horiz/false), 3715:1022 (horiz/true). Error slot sits IN the FieldContent column under description. Vertical members stack label → control → description → [error]."
    axis: { orientation: [vertical, horizontal], invalid: [false, true], controlPosition: [trailing, leading] }
    vars: [ink, corner-lg, destructive, input-border, input-fill, input-ink-placeholder, muted, space-2xs, space-md, space-xs]
    styles: [text:Body, text:Label/md]
  skill: /shadcn-component-port (+ references/composites.md); /component-sync
  description: "The layout-and-semantics layer for form rows: label, description and error arranged around any control, vertically or horizontally. It draws no surface — the control keeps its own look. Caveat: the wrapper is a group, so a plain <label for> cannot name a control through it — use the label slot."
  anatomy: "Multi-part composite WITHOUT a root element (~10 pure layout / typography / spacing / a11y parts, no own surface / border / shadow). Variant A: Figma = the Field ROW only; code = the full family (10 exports) — the code ↔ Figma cardinality gap is deliberate."
  deps: [Input, Textarea, Separator, Button, Label]
  deviations:
    - "gap-2 → gap-md, gap-0.5 → gap-2xs, gap-5 (20, no rung) → gap-xl (16, denser); text-sm → text-format-label-md / -body; legend text-base (16, no rung) → text-format-title (section-caption role); description text-muted; error text-destructive. dark: removed."
    - "Choice-card tint (shared by the FieldLabel choice-card family): FieldLabel has-data-checked:bg-accent-fill + has-data-checked:border-accent-border; FieldTitle group-has-data-checked/field-label:text-accent-ink — scoped to the card group so plain field rows are unaffected."
  forks:
    - "controlPosition [trailing, leading] is a Figma-only axis (real for horizontal only; vertical = trailing default) — code composes control-leading via child order. Never sync back as a prop."
    - "FieldLegend lives as a slot in .FieldSet and as its own set (see FieldLegend); FieldTitle and orientation=responsive are code-only."
  figma_mechanics:
    - "The four slots merge set-level (consistent names). Show description / Show error are bound on WRAPPER frames — visible is never bound on a slot directly (it degrades to a frame); a wrapper collapses the remaining height cleanly."
    - "clone() silently degrades a SLOT to a FRAME (drops slotContentId) — clone-derived members need their slots restored."
  a11y:
    - "Field renders role=group; a <label for> cannot name a control through it (see ChoiceCard aria-labelledby)."
  divergences:
    - "Radio invalid = group error (FieldSet level → separate destructive text, no per-field slot); Checkbox + Switch invalid examples reuse the .Field error slot."
  run_notes: [agent-runs/component-port/2026-06-12-field/, agent-runs/component-sync/2026-06-12-field-figma-revision/, agent-runs/component-sync/2026-06-12-field-text-properties/, agent-runs/component-sync/2026-06-17-field/]

- name: FieldLegend
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: field, style: radix-nova }   # part of the Field family (field.tsx)
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [FieldLegend]
    barrel: "via the field barrel"
    types: [FieldLegendProps]
    stories:
      - "field-legend.stories.tsx → UI/Field/FieldLegend (Default)"
    specs: [field.spec.tsx]
    cva: none
  figma:
    section: { name: "Field Legend", id: "3904:1246" }
    set: { name: "FieldLegend", id: "3909:1246" }
    members: { "variant=legend": "3908:1246", "variant=label": "3908:1248" }
    props: "legend (children)#3909:2 (TEXT, default '{Legend}'); variant (VARIANT [legend, label])"
    axis: { variant: [legend, label] }
    vars: [ink]
    styles: [text:Label/md, text:Title]
  skill: Figma revision (/figma-use)
  description: "The caption of a FieldSet: legend for a section title, label as the lighter form for nested sub-groups."
  anatomy: "Text component; variant maps onto the code prop FieldLegend.variant (NOT a fork — unlike Field.controlPosition)."
  deviations:
    - "variant=legend → text-format-title (section-caption role); variant=label → text-format-label-md; fill ink."
  run_notes: [agent-runs/component-sync/2026-06-12-field-figma-revision/]

- name: FieldSet
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: field, style: radix-nova }   # part of the Field family (field.tsx)
  code:
    dir: libs/ui/src/components/ui/field/        # exported from field/, no own folder
    exports: [FieldSet]
    barrel: "via the field barrel"
    stories:
      - "field.stories.tsx → UI/Field (Default, InputField, TextareaField, Fieldset, Responsive, Invalid, Disabled, Horizontal)"
    specs: [field.spec.tsx]
    cva: none
  figma:
    section: { name: "Field Set & Group", id: "3738:1026" }
    component: { name: "FieldSet", id: "3739:1026" }   # single component (no variant axis)
    slots: { legend: "legend#3741:0 (Title-text default 'Address')" }
    nests: "2× real .Field instance (vert/false 3712:1016): 3741:1028 + 3741:1038 (FILL width)"
    axis: { }   # single component, no variant axis
    vars: [ink, border, corner-lg, destructive, input-border, input-fill, input-ink-placeholder, muted, space-2xs, space-md, space-xl, space-xs]
    styles: [text:Body, text:Label/md, text:Title]
  skill: Figma revision (/figma-use)
  description: "Groups related Fields under a caption as a semantic <fieldset> — a pure structure part with no surface of its own."
  anatomy: "Surface-less composite: VERTICAL auto-layout gap-xl (bound), w FIXED / h HUG, NO fill / stroke; legend = slot with a title-text default. Code counterpart = <fieldset> flex-col gap-xl + FieldLegend."
  deps: [Field, FieldLegend]
  run_notes: [agent-runs/component-sync/2026-06-12-field-figma-revision/]

- name: FieldGroup
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: field, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [FieldGroup]
    barrel: "via the field barrel"
    types: [FieldGroupProps]
    stories:
      - "field-group.stories.tsx → UI/Field/FieldGroup (Default)"
    specs: [field.spec.tsx]
    cva:
      fieldGroupVariants: { orientation: [vertical, horizontal], defaults: {orientation: vertical} }
    props: { orientation: [vertical, horizontal] }   # fieldGroupVariants — DS extension over stock shadcn (which only knows Field orientation)
  figma:
    section: { name: "Field Set & Group", id: "3738:1026" }
    set: { name: "FieldGroup", id: "4285:1997" }
    members:
      "orientation=vertical":   "3742:1044"          # default variant
      "orientation=horizontal": "4280:73"
    axis: { orientation: [vertical, horizontal] }
    nests: "slot (VERTICAL gap-16) → Field → .Separator → Field. vertical: Separator orientation=horizontal (3742:1055), Fields FILL width. horizontal: slot HORIZONTAL, Fields HUG side by side, Separator orientation=vertical + layoutSizingVertical FILL (vertical divider, full row height)."
    vars: [ink, border, corner-lg, destructive, input-border, input-fill, input-ink-placeholder, muted, space-2xs, space-md, space-xl, space-xs]
    styles: [text:Body, text:Label/md, text:Title]
  skill: Figma revision (/figma-use); /component-sync
  description: "Stacks several Fields with a consistent rhythm — vertically by default, or as a wrapping horizontal row: the layout that checkbox and radio groups build on."
  anatomy: "Surface-less container: VERTICAL auto-layout gap-xl (bound), w-full, NO fill / stroke; groups several Fields with a divider (FieldSeparator = nested real .Separator instance, no own set). Code = <div> @container/field-group flex-col gap-xl; horizontal = flex-row flex-wrap + [&>[data-slot=field]]:w-auto."
  deps: [Field, Separator]
  deviations:
    - "orientation prop is a DS extension (counterpart of the RadioGroup container orientation → checkbox / radio groups get the same row capability)."
  run_notes: [agent-runs/component-sync/2026-06-12-field-figma-revision/, agent-runs/component-sync/2026-06-17-field/]

- name: Checkbox
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: checkbox, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/checkbox/
    exports: [Checkbox]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/checkbox'"
    types: [CheckboxProps]
    stories:
      - "checkbox.stories.tsx → UI/Checkbox (Default, Basic, Description, Indeterminate, GroupHorizontal, Disabled, Invalid, AllStates)"
    specs: [checkbox.spec.tsx]
    cva: none
  figma:
    section: { name: "Checkbox", id: "3791:1184" }
    set: { name: "Checkbox", id: "3795:1184" }   # 15 members, 5×3 WRAP grid
    members:   # row checked=off, then checked=on, then checked=indeterminate
      "checked=off, state=default":          "3792:1184"
      "checked=off, state=focus":            "3794:1184"
      "checked=off, state=disabled":         "3794:1185"
      "checked=off, state=invalid":          "3794:1186"   # border only, no glow
      "checked=off, state=focus-invalid":    "4063:2"       # border + destructive @20 % glow
      "checked=on, state=default":           "3792:1185"
      "checked=on, state=focus":             "4063:6"       # primary border + ring @50 % halo
      "checked=on, state=disabled":          "4063:9"       # opacity 0.5
      "checked=on, state=invalid":           "3794:1187"    # border only, no glow
      "checked=on, state=focus-invalid":     "4063:3"       # destructive fill + border + glow
      "checked=indeterminate, state=default":       "4303:73"
      "checked=indeterminate, state=focus":         "4304:73"
      "checked=indeterminate, state=disabled":      "4304:76"
      "checked=indeterminate, state=invalid":       "4304:79"   # dash destructive-ink
      "checked=indeterminate, state=focus-invalid": "4304:82"
    indicator: { glyph: "checked=on → RiCheckLine VECTOR (primary-ink); checked=indeterminate → RiSubtractLine dash VECTOR (M5 11H19V13H5z ×14/24, centred; primary-ink, destructive-ink on invalid)" }
    axis: { checked: [off, on, indeterminate], state: [default, focus, disabled, invalid, focus-invalid] }
    examples: { group: "Usage Examples 3822:2 (Field-composed, control-leading)", Basic: "3923:13", Description: "3926:38", ChoiceCard: "4044:1515 (Card + .Field control-trailing, checked .Checkbox)", Group: "3934:55 (.FieldLegend label)", Disabled: "3927:46", Invalid: "3932:29 (Field 4036:2, error slot)", AllStates: "3826:2" }   # all via real .Field instances
    vars: [ink, border, corner-lg, corner-sm, destructive, destructive-ink, ring, input-border, input-fill, muted, primary-fill, primary-ink, space-2xs, space-3xl, space-lg, space-md, space-xl, space-xs]
    styles: [text:Body, text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "The binary choice control, with an explicit \"indeterminate\" for parent/group states. Checked, invalid, disabled and focus combine freely as live states. A bare box has no accessible name — it needs a Label/Field or an aria-label."
  anatomy: "Single element + indicator (radix-ui Checkbox.Root / Indicator), no CVA → state axis like Input; box 16×16 numeric, corner-sm."
  deps: [Field, Label]
  deviations:
    - "Resting box bg-input-fill + border-input-border; checked = primary-fill fill + border with a primary-ink glyph (RiCheckLine vector, [&>svg]:size-3.5); indeterminate = primary-fill + dash glyph."
    - "invalid = border-destructive only; focus-invalid adds ring-destructive/20 (focus-gated ring — width only from focus-visible:ring-[3px]; deviates from stock ring-3); checked-invalid = solid bg-destructive + border-destructive with the glyph in destructive-ink."
    - "Focus = border-ring + ring-ring/50 ring-[3px]. dark: removed; group-has-disabled/field:opacity-50 kept."
  forks:
    - "focus-invalid is a Figma member only — code composes it from focus-visible: + aria-invalid:."
  a11y:
    - "A bare control has no accessible name — compose it with Label / Field or pass aria-label (the stories do); invalid is driven by aria-invalid (no prop)."
  figma_mechanics:
    - "Focus / invalid glow = literal-alpha DROP_SHADOW with showShadowBehindNode:false, copied VERBATIM from the Input focus member 3176:305 (a bound effect colour clobbers the /opacity → never bind it)."
    - "Usage-examples group = permanent real .Checkbox + .Label / .Field instances."
  open:
    - "checked=on, focus keeps a primary border in Figma — flag if compiled code shows a ring border there."
  run_notes: [agent-runs/component-port/2026-06-12-checkbox/, agent-runs/component-sync/2026-06-12-checkbox/, agent-runs/component-sync/2026-06-17-checkbox/]

- name: Switch
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: switch, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/switch/
    exports: [Switch]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/switch'"
    types: [SwitchProps]
    stories:
      - "switch.stories.tsx → UI/Switch (Default, AirplaneMode, Description, Sizes, Disabled, Invalid, AllStates)"
    specs: [switch.spec.tsx]
    cva: none
  figma:
    section: { name: "Switch", id: "3835:1193" }
    set: { name: "Switch", id: "3839:2" }                 # 3 axes size × checked × state, 20 members, 5×4 WRAP grid
    members:   # per size: row checked=off, then checked=on
      "size=default, checked=off, state=default":       "3837:2"
      "size=default, checked=off, state=focus":         "3837:6"
      "size=default, checked=off, state=disabled":      "3837:8"
      "size=default, checked=off, state=invalid":       "3837:10"   # border only, track destructive
      "size=default, checked=off, state=focus-invalid": "4069:2"
      "size=default, checked=on, state=default":        "3837:4"
      "size=default, checked=on, state=focus":          "4069:4"     # primary track + ring @50 % halo
      "size=default, checked=on, state=disabled":       "4069:6"     # opacity 0.5
      "size=default, checked=on, state=invalid":        "4069:8"     # destructive track, thumb right
      "size=default, checked=on, state=focus-invalid":  "4069:10"
      "size=sm, checked=off, state=default":            "3838:2"
      "size=sm, checked=off, state=focus":              "3838:6"
      "size=sm, checked=off, state=disabled":           "3838:8"
      "size=sm, checked=off, state=invalid":            "3838:10"
      "size=sm, checked=off, state=focus-invalid":      "4070:2"
      "size=sm, checked=on, state=default":             "3838:4"
      "size=sm, checked=on, state=focus":               "4070:4"
      "size=sm, checked=on, state=disabled":            "4070:6"
      "size=sm, checked=on, state=invalid":             "4070:8"
      "size=sm, checked=on, state=focus-invalid":       "4070:10"
    axis: { size: [default, sm], checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }
    examples: { group: "Usage Examples 3840:2 (Field-composed, control-trailing)", AirplaneMode: "3948:2", Description: "3952:2", ChoiceCard: "3979:2 (Card + .Field)", Sizes: "3959:2", Disabled: "3961:2", Invalid: "3966:2 (.Field error slot)", AllStates: "3842:15" }   # all via real .Field instances
    vars: [ink, surface, border, corner-full, corner-lg, destructive, ring, input-fill-high, primary-fill, space-2xs, space-3xl, space-lg, space-md]
    styles: [text:Body, text:Label/md]
  skill: /shadcn-component-port; /component-sync
  description: "An on/off toggle — track tints and thumb slides when checked; size adds a compact variant. Same composition rule as its siblings: the label comes from Label/Field, invalid is a live state, not a prop."
  anatomy: "Track (Root) + Thumb (radix-ui Switch); size [default, sm] is a manual prop (no CVA) × state."
  deps: [Field, Label]
  deviations:
    - "Geometry numeric: track default 32×18.4 / sm 24×14, thumb 16 / 12, corner-full; thumb offset = trackW − thumbW − 2px."
    - "Checked track bg-primary-fill; unchecked track bg-input-fill-high (an off track must read on white — muted-fill would be invisible; role over name); thumb bg-surface."
    - "invalid: unchecked = border-destructive only (track stays grey), checked = bg-destructive track; focus-invalid adds ring-destructive/20 (focus-gated ring, deviates from stock ring-3). Focus = border-ring + ring-ring/50 ring-[3px]. dark: removed."
  forks:
    - "focus-invalid is a Figma member only — code composes it from focus-visible: + aria-invalid:."
  a11y:
    - "A bare control has no accessible name — compose it with Label / Field or pass aria-label (the stories do); invalid is driven by aria-invalid (no prop)."
  figma_mechanics:
    - "Focus glow copied verbatim from the Input focus member 3176:305 (showShadowBehindNode:false)."
  run_notes: [agent-runs/component-port/2026-06-12-switch/, agent-runs/component-sync/2026-06-12-switch/, agent-runs/component-sync/2026-06-16-switch/, agent-runs/component-sync/2026-06-17-switch/]

- name: RadioGroup
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: radio-group, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/radio-group/
    exports: [RadioGroup, RadioGroupItem]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/radio-group'"
    types: [RadioGroupItemProps, RadioGroupProps]
    stories:
      - "radio-group-item.stories.tsx → UI/RadioGroup/Item (Default)"
      - "radio-group.stories.tsx → UI/RadioGroup (Default, Horizontal, Description, Fieldset, Disabled, Invalid, AllStates)"
    specs: [radio-group.spec.tsx]
    cva: none
  figma:
    section: { name: "RadioGroup", id: "3849:1206" }
    set: { name: "RadioGroupItem", id: "3852:1206" }       # only the item is a set; 2 axes checked × state, 10 members, 5×2 WRAP
    members:   # row checked=off, then checked=on
      "checked=off, state=default":       "3850:1206"
      "checked=off, state=focus":         "3850:1210"
      "checked=off, state=disabled":      "3851:1206"
      "checked=off, state=invalid":       "3851:1207"   # border only, no glow
      "checked=off, state=focus-invalid": "4066:2"
      "checked=on, state=default":        "3850:1207"
      "checked=on, state=focus":          "4066:6"       # primary border + ring @50 % halo
      "checked=on, state=disabled":       "4066:9"       # opacity 0.5
      "checked=on, state=invalid":        "3851:1208"    # border only, no glow
      "checked=on, state=focus-invalid":  "4066:3"       # destructive fill + border + dot destructive-ink + glow
    dot: { shape: "ELLIPSE 8px (size-2), fill primary-ink; visible on all checked=on members (checked-invalid: destructive-ink)" }
    group_container: "layout only (grid w-full gap-md) → NO variant set; represented in the examples as VERTICAL auto-layout itemSpacing=space-md"
    axis: { checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }
    examples: { group: "Usage Examples 3854:1206 (Field-composed)", Default: "3992:1324 (bare, per doc)", Description: "3996:1340 (.Field leading)", ChoiceCard: "3997:1358 (Card + .Field trailing)", Fieldset: "3998:1378 (.FieldLegend)", Disabled: "3999:1383 (bare)", Invalid: "4000:1385 (.Field rows + group error)", AllStates: "3857:1218" }
    vars: [ink, border, corner-full, corner-lg, destructive, destructive-ink, ring, input-border, input-fill, muted, primary-fill, primary-ink, space-2xs, space-3xl, space-lg, space-md, space-xl, space-xs]
    styles: [text:Body, text:Label/md, text:Title]
  skill: /shadcn-component-port; /component-sync
  description: "Single choice out of a set: the group carries the value and the layout, each RadioGroupItem is one option. Items behave like Checkbox — state-driven, named only through composition; the selection itself always lives on the group."
  anatomy: "Two parts: RadioGroup (layout container, grid w-full gap-md) + RadioGroupItem (interactive, state axis like Checkbox, corner-full circle with an inner dot instead of a glyph); item 16×16 numeric."
  deps: [Field, Label, FieldLegend]
  deviations:
    - "Resting circle bg-input-fill + border-input-border; checked = primary-fill fill + border with a primary-ink dot (ELLIPSE 8px / size-2)."
    - "invalid = border-destructive only; focus-invalid adds ring-destructive/20 (focus-gated, deviates from stock ring-3); checked-invalid = bg-destructive + border-destructive with the dot in destructive-ink (group-aria-invalid/radio-group-item:). Focus = border-ring + ring-ring/50 ring-[3px]. dark: removed."
  forks:
    - "focus-invalid is a Figma member only — code composes it from focus-visible: + aria-invalid:."
  a11y:
    - "A bare control has no accessible name — compose it with Label / Field or pass aria-label (the stories do); invalid is driven by aria-invalid (no prop)."
  figma_mechanics:
    - "Focus glow copied verbatim from the Input focus member 3176:305 (showShadowBehindNode:false — critical, the item is fill-less)."
    - "The group is layout only (no set)."
  divergences:
    - "Radio invalid is a group error at FieldSet level (separate destructive text), not a per-field error slot."
  open:
    - "checked=on, focus keeps a primary border in Figma — flag if compiled code shows a ring border there."
  run_notes: [agent-runs/component-port/2026-06-12-radio-group/, agent-runs/component-sync/2026-06-12-radio-group/]

- name: ChoiceCard
  status: nova-aligned
  figma_synced: true
  source: { registry: "DS-authored", item: choice-card, style: radix-nova }   # NO stock shadcn item; composes Field + Checkbox / Switch / RadioGroupItem + Label
  code:
    dir: libs/ui/src/components/ui/choice-card/
    exports: [ChoiceCardCheckbox, ChoiceCardSwitch, ChoiceCardRadio]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/choice-card'"
    types: [ChoiceCardCheckboxProps, ChoiceCardRadioProps, ChoiceCardShellProps, ChoiceCardSwitchProps]
    stories:
      - "choice-card-checkbox/choice-card-checkbox.stories.tsx → UI/ChoiceCards/ChoiceCardCheckbox (ChoiceCardStates)"
      - "choice-card-radio/choice-card-radio.stories.tsx → UI/ChoiceCards/ChoiceCardRadio (Group, ChoiceCardStates)"
      - "choice-card-switch/choice-card-switch.stories.tsx → UI/ChoiceCards/ChoiceCardSwitch (ChoiceCardStates)"
    specs: [choice-card-checkbox/choice-card-checkbox.spec.tsx, choice-card-radio/choice-card-radio.spec.tsx, choice-card-shell/choice-card-shell.spec.tsx, choice-card-switch/choice-card-switch.spec.tsx]
    cva: none
    internal: "ChoiceCardShell (presentational, NOT exported) + useFieldId (hook). Nested subfolders per wrapper + choice-card-shell/ + use-field-id.ts, each with its own index.ts barrel"
  figma:
    section: { name: "Choice Card", id: "4107:1526" }
    checkbox:
      set: { name: "ChoiceCardCheckbox", id: "4112:1638" }
      members:
        "checked=off": { default: "4110:1535", focus: "4110:1556", disabled: "4110:1577", invalid: "4110:1598", focus-invalid: "4110:1624" }
        "checked=on":  { default: "4111:1577", focus: "4111:1602", disabled: "4111:1627", invalid: "4111:1652", focus-invalid: "4111:1682" }
      usage_example: "4128:1862 (selected single card)"   # inside the examples group 4146:2080
    switch:
      set: { name: "ChoiceCardSwitch", id: "4119:1750" }   # control size=default, NO size axis
      members:
        "checked=off": { default: "4117:1638", focus: "4117:1661", disabled: "4117:1684", invalid: "4117:1707", focus-invalid: "4117:1735" }
        "checked=on":  { default: "4118:1694", focus: "4118:1717", disabled: "4118:1740", invalid: "4118:1763", focus-invalid: "4118:1791" }
      usage_example: "4128:1877 (selected single card)"
    radio:
      set: { name: "ChoiceCardRadio", id: "4124:1862" }
      members:
        "checked=off": { default: "4122:1750", focus: "4122:1771", disabled: "4122:1792", invalid: "4122:1813", focus-invalid: "4122:1839" }
        "checked=on":  { default: "4123:1801", focus: "4123:1826", disabled: "4123:1851", invalid: "4123:1876", focus-invalid: "4123:1906" }
      usage_example: "4129:1886 (single-selection group: Standard / Express / Overnight)"
    axis: { checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }   # no hover; set props = checked + state
    examples: { group: "Usage Examples 4146:2080", checkbox: "4128:1862", switch: "4128:1877", radio: "4129:1886" }
    nests: "real .Field instance in the FieldLabel card (horizontal control-trailing: 3714:1018 invalid=false / 3715:1019 invalid=true); control slot = real instance of the matching control member (.Checkbox 3795:1184 / .Switch 3839:2 / .RadioGroupItem 3852:1206 per checked × state); title = nested .Label. Controls REUSED, nothing detached."
    tint: "checked tint = the accent selection model, fully variable-bound: card fill accent-fill · stroke accent-border · title accent-ink (bound alpha paints do not survive instantiation → no /opacity paints)"
    placeholders: "card-semantic default texts: title {Title} · description {Description} · error {Error} (72 nodes over the 3 sets: 30 title + 30 description + 12 error, error on invalid / focus-invalid only). Mechanics: title via the .Label TEXT prop (label (children)#3735:0) → setProperties; description / error are raw slot texts → .characters override. Layer names stay {Label} / {Field Description} / {Error Message} (inherited from the .Field / .Label mains, locked in instances — no detach)."
    vars: [accent-border, accent-fill, accent-ink, ink, surface, border, corner-full, corner-lg, corner-sm, destructive, destructive-ink, ring, input-border, input-fill, input-fill-high, muted, primary-fill, primary-ink, space-2xs, space-3xl, space-md]
    styles: [text:Body, text:Label/md]
  skill: Figma build agent (/figma-build-rules) + /component-sync (checked tint)
  description: "Makes the whole card the click target for one choice — title, description and a checkbox, switch or radio in a single labelled surface that tints when checked. Stateless pass-through: controlled vs. uncontrolled is the consumer's decision; the radio form additionally needs its surrounding RadioGroup."
  anatomy: "DS-authored composite: the clickable choice card (title + description + form control). Code = 3 thin wrappers over a shared internal ChoiceCardShell (FieldLabel > Field); stateless pass-through (checked / defaultChecked / onCheckedChange, or the radio value) → the consumer decides controlled / uncontrolled."
  deps: [Field, Checkbox, Switch, RadioGroup, Label]
  deviations:
    - "title / description / error = ReactNode props (no compound / slot pattern; escape hatch = the raw Field primitives); invalid = !!error (ONE rule for data-invalid + FieldError render + aria-invalid; empty string = valid)."
    - "ChoiceCardCheckbox.checked / defaultChecked / onCheckedChange are boolean (indeterminate narrowed away): a leaf card is a binary single choice, the tri-state is a group / parent concept — no indeterminate story or Figma variant. Base Checkbox keeps indeterminate."
    - "Type trap: ComponentProps<Control> brings the HTML title attribute → Omit<…, 'title'>, otherwise ReactNode narrows to string."
  a11y:
    - "The .Field renders role=group and a <label for> cannot name the button through it (axe button-name) → every wrapper sets aria-labelledby on the FieldTitle id (`${id}-title`, shared via useFieldId), verified with axe against the real component. Radio: value REQUIRED, lives in <RadioGroup> (selection + onValueChange on the group)."
  run_notes: [agent-runs/component-port/2026-06-16-choice-card/, agent-runs/component-sync/2026-06-17-choice-card/]

- name: Select
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: select, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/select/
    exports: [Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/select'"
    types: [SelectContentProps, SelectItemProps, SelectProps, SelectTriggerProps, SelectValueProps]
    stories:
      - "select-content.stories.tsx → UI/Select/SelectContent (Default)"
      - "select-item.stories.tsx → UI/Select/SelectItem (Default, Typeahead)"
      - "select-trigger.stories.tsx → UI/Select/SelectTrigger (Default)"
      - "select-value.stories.tsx → UI/Select/SelectValue (Default)"
      - "select.stories.tsx → UI/Select (Default, Groups, Scrollable, Disabled, Invalid, TriggerStates)"
    specs: [select.spec.tsx]
    cva: none
  figma:
    section: { name: "Select", id: "4307:1997" }
    trigger:
      set: { name: "SelectTrigger", id: "4308:2029" }
      axis: { size: [default, sm], state: [default, focus, disabled, invalid, focus-invalid] }    # 10 members
      members:
        "size=default, state=default":       "4308:1997"
        "size=default, state=focus":         "4308:2001"
        "size=default, state=disabled":      "4308:2005"
        "size=default, state=invalid":       "4308:2009"   # border only (ring focus-gated)
        "size=default, state=focus-invalid": "4326:2363"   # destructive border + destructive/20 ring (DROP_SHADOW spread 3 a0.2, sbn:false)
        "size=sm, state=default":            "4308:2013"
        "size=sm, state=focus":              "4308:2017"
        "size=sm, state=disabled":           "4308:2021"
        "size=sm, state=invalid":            "4308:2025"
        "size=sm, state=focus-invalid":      "4326:2367"
      props: "value#4310:0 (TEXT '{Value}') + trailing chevron VECTOR (RiArrowDownSLine, muted). w=240 FIXED, h=32 / 28."
    item:
      set: { name: "SelectItem", id: "4313:2046" }
      axis: { state: [default, focus, disabled], selected: [false, true] }          # 6 members
      members:
        "state=default, selected=false":  "4313:2004"
        "state=default, selected=true":   "4313:2011"
        "state=focus, selected=false":    "4313:2018"
        "state=focus, selected=true":     "4313:2025"
        "state=disabled, selected=false": "4313:2032"
        "state=disabled, selected=true":  "4313:2039"
      props: "showIcon#4326:0 (BOOLEAN, default false) gates leadingIcon · leadingIcon#4313:6 (SLOT, default 16px RiUserLine) · label#4313:7 (TEXT '{Label}') · trailing check VECTOR (RiCheckLine, visible ↔ selected). focus = accent-fill + accent-ink."
      show_icon: "showIcon is bound on a FRAME wrapper 'iconWrap' around the leadingIcon slot per member (visible is never bound on the slot itself). Wrapper IDs: 4326:2317/2318/2319/2352/2353/2354."
    content:
      composition: { name: "SelectContent", id: "4314:1997" }                       # single recompose-able component (mirrors the Command surface 3642:2)
      slots: { items: "items#4314:0 (default 3 SelectItem instances)" }
      bool_props: { showScrollUp: "showScrollUp#4315:0 (default false)", showScrollDown: "showScrollDown#4315:1 (default false)" }
      scroll_buttons: { up: "4314:1998 (RiArrowUpSLine)", down: "4314:2023 (RiArrowDownSLine)" }
    group_set:
      component: { name: "SelectGroup", id: "4326:2371" }
      props: { label: "label#4326:8 (TEXT '{Label}', SelectLabel region px-sm / py-xs, text-format-label-md, muted)", items: "items#4326:7 (SLOT, default 2 SelectItem instances)" }
      note: "labeled group container = SelectLabel text + items slot, container p-xs; reusable, nests into the SelectContent items slot"
    composition_set:
      component: { name: "Select", id: "4326:2477" }
      nests: { trigger: "4326:2478 (SelectTrigger size=default, value='Banana')", content: "4326:2482 (SelectContent, layoutPositioning=ABSOLUTE)" }
      anchor: "composition = HORIZONTAL hug auto-layout (bounds 256×32 = trigger only). Content = ABSOLUTE child, y=36 (trigger h 32 + 4 gap), constraints MIN/MIN → anchored to the trigger's bottom-left. Figma cannot 'open' → this static composition IS the open-state model."
    separator: "nested real .Separator instance (main 3676:1016 horizontal) — between the two SelectGroups in the Groups example"
    group: { name: "Usage Examples", id: "4315:2106" }
    axis: { trigger_size: [default, sm], trigger_state: [default, focus, disabled, invalid, focus-invalid], item_state: [default, focus, disabled], item_selected: [false, true] }
    examples: { Open: "4327:2225 (Select composition 4326:2477, anchored)", Basic: "4315:2107", Groups: "4315:2324 (2× SelectGroup instance North America / Europe + .Separator, SelectContent instance 4326:2749)", Scrollable: "4315:2468", Invalid: "4316:2109 (nests .Field 3713:1017 vertical/invalid)" }
    vars: [accent-fill, accent-ink, ink, border, corner-lg, corner-md, destructive, dialog-fill, ring, input-border, input-fill, muted, space-md, space-sm, space-xs]
    styles: [effect:Elevation, text:Body, text:Label/md]
  skill: /shadcn-component-port (+ references/composites.md; Figma via a background build agent)
  description: "A picker whose closed trigger reads exactly like the sibling text fields (two sizes, same invalid/disabled behaviour), and whose open list is a raised overlay with highlighted options and a check on the current value. Compose with the Field family for label and error."
  anatomy: "Popover composite (radix-ui Select), 10 exports + 5 prop types; 3 sets + a top-level composition + an examples group in Figma. Figma cannot open → the open state is a static anchored composition (like Command / Dialog)."
  deps: [Field, Separator, Label]
  deviations:
    - "Trigger fill = bg-input-fill (Input parity; deliberate departure from Nova's transparent trigger — the closed trigger reads identically to Input / Textarea / InputGroup). Trigger = Input clone: corner-lg (sm: corner-md), border-input-border, focus border-ring + ring-ring/50 ring-[3px], invalid border-destructive + ring-destructive/20 (focus-gated), placeholder text-input-ink-placeholder, text-format-label-md, h-8 / h-7 numeric, chevron text-muted."
    - "Content = Command surface (bg-dialog-fill + border + shadow-elevation + corner-lg); Item = accent-fill / accent-ink highlight (= Command selection) + check, corner-md; Label text-format-label-md text-muted (12px sans → 14 role snap); Separator -mx-xs / my-xs bg-border."
    - "Icons: lucide → @remixicon/react (RiArrowDownSLine / RiArrowUpSLine / RiCheckLine). dark + the inert not-data-[variant=destructive] selector (Nova item has no variant prop) dropped."
  forks:
    - "selected (Figma boolean) = Radix data-state=checked, not a code prop. size axis = the real code prop SelectTrigger.size (no fork)."
    - "SelectLabel: code has its own component; Figma models it inside the SelectGroup component (no bare-label set)."
  a11y:
    - "The trigger's invalid state is driven by aria-invalid (no prop); Radix wires listbox / option roles and the typeahead (textValue) itself."
  divergences:
    - "SelectItem check: Figma = trailing layout vector (pr-md / right-2), code = absolute right-md + pr-3xl clearance (shadcn idiom) — visually equivalent, NOT a delta."
  figma_mechanics:
    - "Example headlines follow the sibling canon (Hanken Grotesk Regular 13, muted-ink)."
  run_notes: [agent-runs/component-port/2026-06-19-select/]

- name: Slider
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: slider, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/slider/
    exports: [Slider]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/slider'"
    types: [SliderProps]
    stories:
      - "slider.stories.tsx → UI/Slider (Default, Range, FieldSlider, Vertical, Disabled, AllStates)"
    specs: [slider.spec.tsx]
    cva: none
  figma:
    section: { name: "Slider", id: "4348:2225" }
    set: { name: "Slider", id: "4351:2225" }       # 12 members, 3 axes, 4×3 manual grid (mixed member sizes → no WRAP)
    members:
      "orientation=horizontal, thumbs=single, state=default":  "4350:2225"
      "orientation=horizontal, thumbs=single, state=focus":    "4350:2229"
      "orientation=horizontal, thumbs=single, state=disabled": "4350:2233"
      "orientation=horizontal, thumbs=range, state=default":   "4350:2237"
      "orientation=horizontal, thumbs=range, state=focus":     "4350:2242"
      "orientation=horizontal, thumbs=range, state=disabled":  "4350:2247"
      "orientation=vertical, thumbs=single, state=default":    "4350:2252"
      "orientation=vertical, thumbs=single, state=focus":      "4350:2256"
      "orientation=vertical, thumbs=single, state=disabled":   "4350:2260"
      "orientation=vertical, thumbs=range, state=default":     "4350:2264"
      "orientation=vertical, thumbs=range, state=focus":       "4350:2269"
      "orientation=vertical, thumbs=range, state=disabled":    "4350:2274"
    anatomy: "Root (NONE, clip=false) › Track (FRAME, clip=true, bg input-fill-high, corner-full) › Range (RECT, bg primary-fill, corner-full) + 1–2 Thumb (RECT 12×12, bg surface, border input-border 1px INSIDE, corner-full). horiz track 200×4 / vert 4×160. Range: horiz 0 → thumb, vert bottom → thumb, range between thumbs."
    axis: { orientation: [horizontal, vertical], thumbs: [single, range], state: [default, focus, disabled] }   # NO invalid state (stock Slider has none)
    examples: { group: "Usage Examples 4354:2225", Default: "4354:2226 (instance 4354:2228)", Range: "4354:2232 (instance 4354:2234)", Vertical: "4354:2242 (instance 4354:2244)", Disabled: "4354:2251 (instance 4354:2253)", FieldSlider: "4357:2254 (Field instance 4355:2238, control slot = range Slider instance 4356:2249, label 'Price Range', description wrapped)" }   # frame (instance)
    vars: [ink, surface, corner-full, input-border, input-fill-high, muted, primary-fill, space-md]
    styles: [text:Body, text:Label/md]
    focus_glow: "literal DROP_SHADOW radius 0 spread 3 ring (neutral/800) @50 % sbn:false — copied verbatim from the Input focus member 3176:305 (never bind the colour, it drops the /50). Per thumb on the focus members; members clip=false."
  skill: /shadcn-component-port (+ /figma-build-rules)
  description: "Value selection on a track, horizontal or vertical. Pass two values and it becomes a range — one thumb per value. Its accessible name must reach the thumbs, not the container; the component forwards one label to all of them."
  anatomy: "Radix Slider (radix-ui umbrella import = the full primitive, declared dep), no CVA → geometry + state axes like the Switch / Checkbox family. Parts: Root › Track (rail) › Range (fill) + N × Thumb (one per value; 2 = range)."
  deps: [Field]
  deviations:
    - "Track rail bg-input-fill-high (muted-fill would be invisible on white → Switch precedent 'an off track must read'; role over name); Range bg-primary-fill (the DS 'active / on' surface, like the Switch track / Checkbox box / Radio dot — NOT the primary emphasis tone); Thumb bg-surface + border-input-border (Nova border-ring role-corrected to the sibling resting border) + focus ring-ring/50 ring-[3px]; corner-full."
    - "Geometry numeric: size-3 thumb, h-1 / w-1 track (4px), min-h-40 vertical. dark + the inert disabled:* on the thumb (span, no :disabled) kept."
  forks:
    - "thumbs [single, range] is a Figma-only axis — code derives the thumb count from value.length (no prop). Never sync back."
  a11y:
    - "role=slider sits on the thumb → the component FORWARDS aria-label / aria-labelledby to every thumb (otherwise axe aria-input-field-name fails; a root label names nothing)."
  figma_mechanics:
    - "figma-verify reports 18 thumb ↔ track overlaps — intended handle-on-rail geometry (CLEAN by design)."
  run_notes: [agent-runs/component-port/2026-06-22-slider/]

- name: Popover
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: popover, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/popover/
    exports: [Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/popover'"
    types: [PopoverContentProps, PopoverProps]
    stories:
      - "popover-content.stories.tsx → UI/Popover/PopoverContent (Default)"
      - "popover.stories.tsx → UI/Popover (Default, SimpleContent, Anchored, Placements, Sides)"
    specs: [popover.spec.tsx]
    cva: none
  figma:
    section: { name: "Popover", id: "4365:2253" }   # 2278×2585 — encloses the floating panels (see root.structure)
    build_frame: { name: "Build", id: "4390:2364" } # white vertical auto-layout frame (HUG, itemSpacing space-2xl, padding space-xl) INSIDE the section — holds the masters + root set + usage examples (a Section is not an auto-layout container)
    content: { name: "PopoverContent", id: "4365:2255" }   # SINGLE member, NO state / variant set (data-[side] = motion, not a DS state)
    slot: { content: "content#4365:0" }                    # the open region; default = nested PopoverHeader instance
    header: { name: "PopoverHeader", id: "4367:2253", props: "title#4367:0 (TEXT, {Title}, Label style / dialog-ink) · description#4367:1 (TEXT, {Description}, Body style / muted)" }
    examples: { group: "Usage Examples 4368:2255", SimpleContent: "4368:2256 (PopoverContent instance 4368:2258, slot = configured PopoverHeader)", Dimensions: "4368:2272 (PopoverContent instance 4368:2274, slot = PopoverHeader + 4 Label / Input rows, real DS instances Label 3734:1022 / Input 3176:303)" }   # frame (instance)
    axis: { }   # content surface: NO axis (raised surface, no interactive state space)
    root:                                          # the FULL interactive overlay
      set: { name: "Popover", id: "4402:2589" }    # matches the code root export; members HUG the trigger (50×32)
      axis: { state: [closed, open], side: [top, right, bottom, left], align: [start, center, end] }  # 24 members; defaults open / bottom / center
      props: "trigger#4408:0 (SLOT, HUG, default DS Button — mirrors asChild; the child sets the slot W/H → the member hugs the trigger; the reaction sits on the member frame so a slot swap does not break the prototype)"
      structure: "each member = auto-layout HUG → footprint = trigger only (50×32), clipsContent=false; the trigger is the only flow child. TWO-STAGE ANCHOR: (1) 'Panel Position' = invisible (fills []) FIXED 50×32 auto-layout, ABSOLUTE child of the member, constraints = SIDE × ALIGN tracking [top → vert MIN · bottom → vert MAX · left → horiz MIN · right → horiz MAX; align start / center / end → MIN / CENTER / MAX on the parallel axis] → tracks the trigger edge when the (hugged) trigger resizes → constant gap, no overlap. (2) PopoverContent = ABSOLUTE child of Panel Position, constraints = GROW-AWAY [side axis INVERTED: bottom → MIN · top → MAX · left → MAX · right → MIN; parallel axis = align] → HUG growth moves AWAY from the trigger. sideOffset 8, NO reflow; closed = content visible=false. Set uses layoutMode GRID → 0 panel collisions. (Two stages because Figma constraints drive BOTH parent-resize tracking AND the self-growth anchor of an ABSOLUTE child, and the two need the OPPOSITE edge per side.) PANEL CONTAINMENT: members hug the trigger, so the panels float outside the members by design → the GRID set carries padding ≈ panel overhang + margin (padL/R 328, padT 105, padB 48; overhang = panel width 288 + gap 8 = 296 sideways, 73 up) AND the set width grows by the same amount (→ 2086) so the content area (1430) stays constant and the GRID does not wrap → the set frame encloses its own panels (panelsOutsideSet=0)."
      prototype: "closed → ON_CLICK CHANGE_TO matching open; open → ON_CLICK + ON_KEY_DOWN(Esc) CHANGE_TO matching closed (DISSOLVE 0.2s) — click-outside cannot be expressed on variant members"
      members_sample: { "open/bottom/center": "4399:2385", "closed/bottom/center": "4402:2469" }   # 24 total; each member = trigger slot + Panel Position anchor (with the nested PopoverContent)
    vars: [ink, border, corner-lg, dialog-fill, dialog-ink, input-border, input-fill, input-ink-placeholder, muted, muted-fill, primary-fill, primary-ink, space-2xs, space-lg, space-md, space-sm, space-xs]
    styles: [effect:Elevation, text:Body, text:Label/md]
  skill: /shadcn-component-port (+ /figma-build-rules; Figma rebuilds via a background agent)
  description: "A raised panel anchored to its trigger — no scrim, no focus trap unless modal; outside click or Escape dismisses. Unlike Dialog it does not name itself: an open panel needs an explicit accessible name."
  anatomy: "Radix Popover (radix-ui umbrella import = the full primitive, declared dep). Composite WITHOUT own state — Content is the only DS surface (Trigger / Anchor = pass-through, no class). 7 exports: stock 4 + PopoverHeader / Title / Description (Nova typography helpers)."
  deps: [Button, Label, Input]   # Figma only: Button = trigger-slot default, Label / Input in the Dimensions example
  deviations:
    - "Raised surface (sibling of Dialog / Command): bg-dialog-fill + text-dialog-ink · corner-lg (control-attached, NOT Dialog's corner-xl) · ring-1 ring-foreground/10 → border (Nova raised ring → DS border, like Dialog / Command) · shadow-md → shadow-elevation · gap-2.5 / p-2.5 (10px, no rung) → gap-md (8) / p-lg (12) by role · text-sm → text-format-body."
    - "Header: gap-0.5 → gap-2xs; Title text-sm / font-medium → text-format-label-md (compact caption, NOT Dialog's title 18 — a popover is compact); Description text-muted."
    - "Geometry numeric (w-72, z-50, sideOffset / align). Motion classes (data-[side] / data-open / data-closed) verbatim."
    - "Docgen: PopoverProps on the root (Omit + re-declare open / defaultOpen / onOpenChange / modal); PopoverContentProps = side / sideOffset / align / alignOffset / avoidCollisions / collisionPadding / sticky / hideWhenDetached."
  forks:
    - "state × side × align is a Figma-only interactive model — code drives side / align via PopoverContent props and open / closed via the Radix runtime → NO CVA, never sync back as props. The two-stage anchor mirrors what Radix Popper does at runtime → no code change."
  a11y:
    - "Radix gives the content role=dialog → axe aria-dialog-name requires an accessible name; Popover does NOT wire the title automatically (unlike the modal Dialog) → an open panel needs an explicit aria-label / aria-labelledby (documented in JSDoc + stories)."
  divergences:
    - "jsdom spec covers the closed path + defaultOpen only; the click-driven open → Escape flow lives in the Chromium play test (portal content mounts on open — no extra polyfill)."
  run_notes: [agent-runs/component-port/2026-06-22-popover/, agent-runs/component-port/2026-06-23-popover-figma/, agent-runs/component-port/2026-06-24-popover-a9-anchor/]

- name: Tooltip
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: tooltip, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/tooltip/
    exports: [Tooltip, TooltipContent, TooltipProvider, TooltipTrigger]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/tooltip'"
    types: [TooltipContentProps, TooltipProps]
    stories:
      - "tooltip-content.stories.tsx → UI/Tooltip/TooltipContent (Default)"
      - "tooltip.stories.tsx → UI/Tooltip (Default, Placement, WithKbd, IconTrigger)"
    specs: [tooltip.spec.tsx]
    cva: none
  figma:
    section: { name: "Tooltip", id: "4381:2356" }       # headline 4381:2357
    component: { name: "Tooltip", id: "4382:2356" }      # the content-chip component (no variant set — single member)
    slot: { name: "content", id: "4384:2356", prop: "content#4384:0", default: "{Label} TEXT (Label style, dialog-ink)" }
    arrow: { name: "arrow", id: "4414:2493" }            # down-pointing TRIANGLE: white fill (dialog-fill) + border stroke ONLY on the 2 slanted edges (base open = joins the chip); base overlaps 1px into the chip → connected pointer, no seam. showArrow#4418:0 toggles it (per-side member arrow swap in Tooltip Root)
    axis: { content: [slot] }                            # content chip: NO variant / state axis — only the open visual; content = SLOT (open children region)
    root:
      set: { name: "Tooltip Root", id: "4419:2781" }
      axis: { state: [closed, open], side: [top, right, bottom, left] }   # 8 members, lean (no align — tooltips centre); defaults open / top
      props: "trigger#4419:0 (SLOT, HUG, default DS Button — swappable trigger; the reaction sits on the member frame → swap-safe)"
      structure: "each member hugs the trigger (54×32); trigger = HUG slot with a DS Button default; content = Tooltip chip instance 4382:2356 as layoutPositioning=ABSOLUTE + clipsContent=false, anchored per side, sideOffset 6, centred; closed = chip + arrow visible=false. Per-side arrow: side=top uses the baked down arrow (showArrow=true); bottom / left / right set showArrow=false + a member-level oriented triangle (Figma cannot override arrow rotation in an instance, and rotating the instance rotates the label too)"
      prototype: "ON_HOVER ('While hovering') per closed member → CHANGE_TO matching open (DISSOLVE 0.15s); Figma auto-reverts on leave = open-on-hover / close-on-leave. No click, no Esc"
      build_frame: { name: "Build", id: "4420:2530" }    # white vertical auto-layout in the section (like Popover)
    examples: { group: "Usage Examples 4385:2366", Default: "4385:2368 (instance 4385:2370, slot 'Add to library')", WithKbd: "4385:2380 (instance 4385:2382, slot 'Save changes' + nested .Kbd instance 4385:2390 ⌘S)" }   # frame (instance)
    vars: [ink, border, corner-lg, corner-md, corner-sm, dialog-fill, dialog-ink, muted-fill, primary-fill, primary-ink, space-lg, space-md, space-sm, space-xs]
    styles: [effect:Elevation, text:Kbd, text:Label/md]
  skill: /shadcn-component-port (+ /figma-build-rules)
  description: "A hover/focus hint chip with a pointer arrow, delayed by the shared provider. It describes its trigger, it does not name it — an icon-only trigger still needs its own label."
  anatomy: "Radix Tooltip (radix-ui umbrella import = the full primitive, declared dep). Provider / Root / Trigger = behaviour wrappers without styling; only TooltipContent + its arrow carry classes → NO CVA, single surface (sibling of Badge / Kbd)."
  deps: [Button, Kbd]   # Figma only: Button = trigger-slot default, Kbd in the WithKbd example
  deviations:
    - "Core decision: stock Tooltip is an INVERTED dark chip (bg-foreground + text-background) — the DS has no inverted-overlay token → re-clothed on the consolidated raised overlay surface: bg-dialog-fill + text-dialog-ink + border (1px, Nova had none) + shadow-elevation (depth, stock is flat), like Dialog / Command. Tooltip is a LIGHT raised chip (recorded dark → light fork)."
    - "Geometry / typography: rounded-md → corner-md, gap-1.5 → gap-sm, px-3 → px-lg, py-1.5 → py-sm, text-xs → text-format-label-md (no 12px sans rung → 'short label' role, +2px snap). Arrow inherits dialog-fill (bg + fill), rounded-[2px] as arbitrary diamond geometry verbatim, rotate / translate numeric. Animation / layout / Radix transform-origin utilities verbatim (tokens-reference §6 keep_valid)."
    - "Docgen: TooltipProps (open / defaultOpen / onOpenChange / delayDuration) + TooltipContentProps (side / sideOffset / align / alignOffset) via Omit + re-declare; Provider / Trigger pass-through."
  forks:
    - "state × side is a Figma-only interactive model — code drives side via TooltipContent.side and open / close via the Radix hover runtime → NO CVA, never sync back."
  figma_mechanics:
    - "The content region is a SLOT (content#4384:0, {Label} default), NOT a text prop — code uses free children (text, or text + Kbd) → /figma-build-rules §Mechanism 'open, variably-many children → slot'; a text prop could not reproduce the WithKbd composition."
    - "Arrow = ABSOLUTE child, bottom-centre, half over the bottom edge; clipsContent=false on the component so arrow + shadow do not clip. figma-verify: arrow-on-chip overlap is by design."
  a11y:
    - "TooltipContent role=tooltip; Radix wires aria-describedby trigger → content in the open state. An icon-only trigger needs its OWN accessible name (a tooltip is a description, not a name) → IconTrigger story uses the DS Button icon boolean + mandatory aria-label."
  divergences:
    - "jsdom spec covers the closed / trigger path only; the open path runs in the Chromium Storybook play test."
  run_notes: [agent-runs/component-port/2026-06-22-tooltip/, agent-runs/component-port/2026-06-23-tooltip-figma/, agent-runs/component-port/2026-06-23-tooltip-root-mirror/]

- name: Item
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: item, style: radix-nova }   # registryDependencies: separator
  code:
    dir: libs/ui/src/components/ui/item/
    exports: [Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter, itemVariants, itemMediaVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/item'"
    types: [ItemMediaProps, ItemProps]
    stories:
      - "item-media.stories.tsx → UI/Item/ItemMedia (Default, Kinds)"
      - "item.stories.tsx → UI/Item (Default, Variants, Sizes, WithActions, WithImage, Group, WithHeaderFooter, Link, AllStates)"
    specs: [item.spec.tsx]
    cva:
      itemVariants: { variant: [default, outline, muted], size: [default, sm, xs], defaults: {variant: default, size: default} }
      itemMediaVariants: { variant: [default, icon, image], defaults: {variant: default} }
  figma:
    section: { name: "Item", id: "4494:2471" }          # headline 4494:2472
    set: { name: "Item", id: "4498:2551" }              # 9 members (variant × size); master = outline/default 4495:2471
    axis: { variant: [default, outline, muted], size: [default, sm, xs] }
    props: "media#4498:0 (SLOT, default = nested .ItemMedia instance variant=icon) · actions#4498:1 (SLOT, default chevron muted) · title#4499:0 (TEXT {Title}, Label, bound to ink) · description#4499:10 (TEXT {Description}, Body / muted)"
    media_set: { name: "ItemMedia", id: "4508:2544", axis: { variant: [default, icon, image] }, slot: "content#4508:3 (swappable glyph / image; icon default bound to ink)" }   # 3 members: default 4508:2534 / icon 4508:2537 / image
    group_component: { name: "ItemGroup", id: "4511:2575", slot: "items#4511:0", note: "vertical auto-layout, gap-xl; layout only (the responsive has-data gap cannot be modelled in Figma)" }
    examples:
      group: "Usage Examples 4501:2471"
      typelist: "4501:2472 — 3 muted instances, TEXT props drive invoice / contract / document (explorer NavListItem)"
      states: "4502:2498 — Base 4502:2502 · Hover 4502:2523 (muted-fill override) · Focus 4502:2544 (ring-ring/50 3px DROP_SHADOW, copied verbatim from the Select focus member 4308:2001 — NOT the generic Glow style) · Selected 4502:2565 (accent-fill + accent-ink title = call-site contract, NO set member)"
    state_axis: "DELIBERATELY examples-only (NOT a set axis): the hover / focus / selected delta is uniform over variant × size → 18 / 27 members would be redundant. The states live in the usage-examples States group (mirrors the AllStates story). Extend to variant × size × state (27) only if explicitly wanted."
    vars: [accent-fill, accent-ink, ink, surface, border, corner-lg, corner-sm, ring, muted, muted-fill, muted-ink, secondary-fill, space-lg, space-md, space-xl, space-xs]
    styles: [text:Body, text:Label/md]
  skill: /shadcn-component-port (+ /figma-build-rules, composites.md, /storybook-rules, /docgen-props)
  description: "The generic list row: leading media, title with description, trailing actions; variant and size scale it from a bordered card row to a dense line. It deliberately has no selected state — hover and focus exist only on its link form (asChild); selection stays a call-site concern."
  anatomy: "10-part composite (Item / Media / Content / Title / Description / Actions / Group / Separator / Header / Footer), full family ported. Generic list row → root-barrel primitive (not a block); use case = explorer NavListItem."
  deps: [Separator]
  deviations:
    - "Selection stays a CALL-SITE / block concern — Item is stock-faithful (no selected prop); a list-navigator block sets aria-current + the DS accent tint. Contrast: SelectItem has a selected axis only because Radix delivers an intrinsic selected state there."
    - "hover ([a]:hover:bg-muted-fill) + focus ring are LINK-ONLY by design — the [a]: selector; a bare div is not focusable → both states only on the asChild link form."
    - "DS mapping: rounded-lg → corner-lg; text-sm → text-format-body (base) / text-format-label-md (title) / body + text-muted (description); 10px padding / gap (gap-2.5 / py-2.5 / px-2.5) is OFF-GRID → snapped to named steps (default / sm = lg = 12, xs = md = 8) — the house snaps, no 2.5 / [10px] in the lib. Variants: outline border-border, muted bg-muted-fill/50."
    - "Dropped: xs:text-xs (12px) — no sub-14 sans format."
    - "Dependency audit: ui:add wrote a flat stock separator.tsx that shadowed the DS folder (file beats dir in resolution) → deleted; the import resolves to the barrel."
  forks:
    - "hover / focus / selected exist only as usage-example instances in Figma (see state_axis) — code drives them via CSS and the call-site aria-current; never add a state axis to the set."
  figma_mechanics:
    - ".Item set = variant × size (the real design axes); media + actions as SLOTS (swappable content), title / description as TEXT props ({Semantic} defaults); .ItemMedia = own 3-member set. State axis examples-only (see state_axis)."
  a11y:
    - "ItemGroup role=list → role=listitem on the children at the call site (axe aria-required-children)."
  open:
    - "No sub-14 sans format for the xs size (stock xs:text-xs)."
  run_notes: [agent-runs/component-port/2026-06-26-item/]

- name: Table
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: table, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/table/
    exports: [Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/table'"
    stories:
      - "table.stories.tsx → UI/Table (Default, Selectable, EmptyState, Alignment, ComponentCells, RowStates)"
    specs: [table.spec.tsx]
    cva: none
  figma:
    section: { name: "Table", id: "4514:2597" }
    head: { set: "TableHead", id: "4515:2603", axis: "align [left, center, right]", prop: "head (children)#4515:0 ({Head}); Label + ink, h-10, px-md" }
    cell: { set: "TableCell", id: "4515:2610", axis: "align [left, center, right]", prop: "cell (children)#4515:4 ({Cell}) TEXT + content#4527:0 SLOT — a cell also takes components (Checkbox / Badge / Button …); the text default sits IN the slot, swappable; Body + ink, p-md" }
    row: { set: "TableRow", id: "4520:2621", axis: "state [default, hover, selected]", slot: "cells#4520:3 (empty)", notes: "bottom border → border; hover muted-fill/50; selected accent-fill; minHeight 37" }
    composition: { name: "Table", id: "4521:2597", props: "content#4537:0 (SLOT, default = invoice interior) · showCaption#4522:1 (bool) · caption#4522:2 (text)", notes: "recompose-able: the content slot holds header + body + footer rows (slot default = baked invoice); caption boolean + text below. No showFooter (the footer is part of the slot content)" }
    examples: { group: "Usage Examples 4523:2635", Default: "4523:2636 (instance 4523:2638, slot default invoice + caption)", Selection: "4524:2682 (instance 4538:2802, row 2 selected)", Empty: "4524:2730 (instance 4538:2890, No results)", ComponentCells: "4529:2758 (instance 4538:2963, Checkbox + Badge)" }   # frame (instance); all = Table instances with the content slot filled
    axis: { head_align: [left, center, right], cell_align: [left, center, right], row_state: [default, hover, selected] }
    vars: [accent-fill, ink, border, corner-full, corner-sm, input-border, input-fill, muted, muted-fill, primary-fill, primary-ink, secondary-fill, secondary-ink, space-2xs, space-md, space-xl, space-xs]
    styles: [text:Body, text:Eyebrow, text:Label/md]
  skill: /shadcn-component-port (+ references/composites.md)
  description: "A data table whose API is pure composition: region, row and cell parts that pass everything through. Rows are the only interactive surface — neutral hover vs. accent-tinted selection, with selection set by the call site. Column alignment is applied per column on head and cells together."
  anatomy: "Multi-part composite WITHOUT a root element, 8 prop-less pass-through parts (Table / Header / Body / Footer / Row / Head / Cell / Caption), NO CVA. The only interaction axis = TableRow state. No code deps (ui:add wrote table.tsx only)."
  deps: [Checkbox, Badge]   # Figma only: the Component-cells example
  deviations:
    - "text-sm → text-format-body; head / footer font-medium → text-format-label-md; text-foreground → text-ink; caption text-muted; px-2 / p-2 → px-md / p-md; mt-4 → mt-xl; border-b / -t / -0 = width only, colour via the base layer (border-border), no class. dark: removed."
    - "Row tint: hover NEUTRAL (bg-muted-fill/50, like Item rows) ≠ selected ACCENT (bg-accent-fill, like the Command selection — muted-fill would be invisible for a selected row); text stays ink (stock does not recolour selected)."
  forks:
    - "TableRow state hover is a Figma member for the CSS hover; selected = data-state=selected set by the call site — neither is a code prop."
  figma_mechanics:
    - "Granularity Cell + Row + Table with align l / c / r: TableHead / TableCell sets (align axis, TEXT prop + content SLOT), TableRow set (state axis, cells slot built EMPTY + minHeight), Table composition (content slot holds header + body + footer rows). For a component cell: clear the text, put the component into the slot. Slot strategy: build empty, bake the demo, examples append-only."
  divergences:
    - "Footer cells stay Body in Figma; the code tfoot label weight is code-only (minor)."
  run_notes: [agent-runs/component-port/2026-06-26-table/]
```

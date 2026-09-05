# Agent Run — Artboard Build: Schema Browser (2 screens)

**Date** 2026-09-05 · **Kind** artboard build (code/design draft → Figma artboard, read-only DS)
**File** `nQSNLASjuLvgTh3we8Dp4s` "Agentport DS" · **Page** `Artboards` `8704:7644`
**Section** `Schema Browser · Artboards` `8707:2` (3200 × 1714)

| Artboard | Node | Size |
|---|---|---|
| `AppShell · Schema Browser / Resting` | `8707:4` | 1480 × 1434 |
| `AppShell · Schema Browser / Command Open` | `8719:485` | 1480 × 1434 |

**Source of the two screens** — the corrected design-canvas artboards built earlier this session
(`design-docs/canvas/schema-browser/Main.dc.html`, `Overlay.dc.html`), themselves a correction of the
"Quiet" reference screen in the Toolbox DS file (`xWC3VEdPxfwnMXwUI555Ra`, node `1099:9710`).

**Constraints honoured**
- No new Figma components, no new variables — the DS was read-only.
- No token overrides on any component instance (verified, §6).
- Every token-backed value on authored (non-instance) nodes is bound by variable id (verified: 0 unbound).
- Layer names English, speaking, named after the *future composition* they would become (§5).

---

## 1 · Sources read before building

| Source | Used for |
|---|---|
| `design-docs/design-system/components-reference.md` | component inventory, set/member node ids, live API per set, documented forks + `code_only_tokens` |
| `design-docs/design-system/tokens-reference.md` | token roles (`use` / `avoid`), the 14 text formats, effect model |
| `libs/ui/src/styles/tokens.css` | resolved values, used to confirm the Toolbox screen's palette is the Agentport palette |
| `.claude/skills/figma-build-rules` | binding recipes, slot mechanics, one-structural-mutation-per-call rule |
| `.claude/skills/figma-create-section` `config.json` | canonical Section wrapper (white, corner 12, headline Display @ inset 80) |
| `.claude/skills/figma-verify` | the pre-handoff check in §6 |
| `@remixicon/react@4.1.0` | exact vector paths for glyphs the DS icon set does not carry |

**Palette cross-check (evidence the Toolbox screen is Agentport DS):** the Figma variables bound on
`1099:9710` resolve exactly onto `tokens.css` — `Base/ink #0d1016` = `neutral-900`,
`Muted/muted-ink #656971` = `neutral-500`, `Border/border #e4e6eb` = `neutral-75`,
`Primary/primary-fill #0d2531` = `deep-900`, `Inverse/inverse-fill #00121c` = `deep-950`,
`Muted/muted-fill #f9fcfd` = `neutral-25`, `Cards/card-fill #f3f5fa` = `neutral-50`.

---

## 2 · Index of identified UI parts

72 parts identified before building. `Cat` = category (§3–§4): **A** mapped to an existing component ·
**B** mapped but needs a component update · **C** no component (drawn from tokens) · **D** missing
primitive · **E** composition candidate.

### Zone: TopBar (`8708:2`, full width, y 0–84)

| # | UI part | Meaning on screen | Position | Cat | Built as |
|---|---|---|---|---|---|
| P01 | TopBar | app-level chrome bar | y 0–84, full width | E | frame `8708:2` |
| P02 | ContextSwitcher | which backend + tenant the session is on | left, x 24 | B | frame `8708:4` |
| P03 | ConnectionSegment / StatusDot | connection is live | inside P02 | D | ellipse `8708:6`, fill `primary` |
| P04 | ContextSwitcher / SegmentDivider | splits host from tenant | inside P02 | A | `Separator[vertical]` `8708:8` |
| P05 | CommandLauncher / Trigger | opens the command palette | centred, 480 wide | A | `InputGroup[default,horizontal]` `8709:2` |
| P06 | Trigger / LeadingAddon | search affordance | inside P05 | A | `InputGroupAddon[inline-start]` |
| P07 | Trigger input | the query field | inside P05 | A | `InputGroupInput` |
| P08 | Trigger / TrailingAddon | holds the keycap | inside P05 | A | `InputGroupAddon[inline-end]` |
| P09 | Trigger / Shortcut | the ⌘K key hint | inside P08 | A | `Kbd[content=text, emphasis=high]` |
| P10 | LocaleSwitch | UI language | right, x ~1370 | D | frame `8709:10` |
| P11 | LocaleSwitch / GlobeIcon | language affordance | inside P10 | C | vector `8709:15` (RiGlobalLine) |

### Zone: NavRail (`8711:15`, x 0–56)

| # | UI part | Meaning | Position | Cat | Built as |
|---|---|---|---|---|---|
| P12 | NavRail | tool switch column | x 0–56, full height | E | frame `8711:15` |
| P13 | Tool · Schema (active) | current tool | rail, 1st | B | `Button[default, icon]` `8711:16` |
| P14 | Tool · Search / Relations / Settings | other tools | rail, 2–4 | A | `Button[ghost, icon]` `8711:25` `8711:33` `8711:38` |

### Zone: FilterPanel (`8712:37`, x 56–340)

| # | UI part | Meaning | Position | Cat | Built as |
|---|---|---|---|---|---|
| P15 | FilterPanel | source filters + entity navigation | x 56–340 | E | frame `8712:37` |
| P16 | SourceFilters / SectionLabel | names the filter block | top of P15 | C | text, style `Eyebrow` `8712:39` |
| P17 | SourceToggle ×2 | turn a data source on/off | under P16 | E | frames `8712:41` `8712:51` |
| P18 | SourceToggle / Switch | the on/off control | inside P17 | A | `Switch[sm, on, default]` `8712:42` `8712:52` |
| P19 | SourceToggle / Label | names the source | inside P17 | A | `Label[default]` `8712:44` `8712:54` |
| P20 | SourceToggle / Count | how many types the source contributes | inside P17 | B | `Badge[outline]` `8712:46` `8712:56` |
| P21 | SourceMeter / Bar | share of types per source | under P17 | D | frame `8713:50`, rects `8713:51` `8713:52` |
| P22 | SourceMeter / Legend ×2 | reads the bar | under P21 | D | frames `8713:54` `8713:57` |
| P23 | SourceMeter / Summary | how many types are active | under P22 | C | text, style `Body` `8713:60` |
| P24 | FilterPanel / Divider | separates filters from the list | mid panel | A | `Separator[horizontal]` `8713:61` |
| P25 | EntityList / GroupHeading ×2 | groups the list by source | above each group | C | text, style `Eyebrow` `8713:7135` `8713:7173` |
| P26 | EntityList / Entry ×4 | pick an object type | list body | A | `Item[default, xs]` `8713:7136` `8713:7160` `8713:7174` `8713:7186` |
| P27 | EntityList / Entry (current) | the type currently open | list body, 2nd | **B** | `Item[muted, xs]` `8713:7148` |
| P28 | EntityList / OverflowLink ×2 | reveal the truncated rest | end of each group | A | `Button[link, xs]` `8713:7198` `8713:7202` |

### Zone: WorkspaceColumn (`8714:88`, x 340–1140)

| # | UI part | Meaning | Position | Cat | Built as |
|---|---|---|---|---|---|
| P29 | WorkspaceColumn | the open record | x 340–1140 | E | frame `8714:88` |
| P30 | EntityHeader / Kind | what kind of thing is open | top | C | text, `Eyebrow` `8714:90` |
| P31 | EntityHeader / Name | which one | under P30 | C | text, `Display` `8714:91` |
| P32 | EntityHeader / Meta | counts at a glance | under P31 | C | text, `Eyebrow` `8714:92` |
| P33 | PropertySearch | filter the attribute list | under P32, 374 wide | A | `InputGroup[default,horizontal]` `8714:94` |
| P34 | PropertySearch / LeadingAddon | search affordance | inside P33 | A | `InputGroupAddon[inline-start]` |
| P35 | SchemaTable | the record's attribute list | below the header | A | `Table` `8716:7684` |
| P36 | SchemaTable / HeaderRow | column names | table top | A | `TableRow[default]` `8715:97` |
| P37 | HeaderCell ×5 | one column name each | header row | A | `TableHead[left]` ×5 |
| P38 | GroupDivider ×3 | groups attributes by origin | between blocks | **B** | `CommandSeparator[labeled]` `8716:107` `8716:7384` `8716:7571` |
| P39 | Row ×21 | one attribute | table body | A | `TableRow[default]` ×21 |
| P40 | Cell · Property | the attribute's name | col 1, 264 | A | `TableCell[left]` |
| P41 | Cell · Type | its data type | col 2, 126 | **B** | `TableCell[left]` |
| P42 | Cell · Cardinality | single or multi | col 3, 112 | **B** | `TableCell[left]` |
| P43 | Cell · Required (positive) | attribute is mandatory | col 4, 96 | **B** | `TableCell[left]` + vector `RequiredMark` |
| P44 | Cell · Required (negative) | attribute is optional | col 4, 96 | A | `TableCell[left]`, text `—` |
| P45 | Cell · Origin | which system owns it | col 5, 170 | **B** | `TableCell[left]` |
| P46 | Row rule / column rules | reading aids | table | B | `TableRow` bottom border (columns: none) |

### Zone: DetailPanel (`8717:483`, x 1140–1480)

| # | UI part | Meaning | Position | Cat | Built as |
|---|---|---|---|---|---|
| P47 | DetailPanel | context for the open record | x 1140–1480 | E | frame `8717:483` |
| P48 | Header / Kind | eyebrow | panel top | C | text, `Eyebrow` `8717:485` |
| P49 | DetailPanel / HeaderText | name + one-line summary | under P48 | **B** | `PopoverHeader` `8717:486` |
| P50 | DetailPanel / Divider | section break | mid panel | A | `Separator[horizontal]` `8717:489` |
| P51 | RelationSection / Label | names the section | under P50 | C | text, `Eyebrow` `8717:491` |
| P52 | RelationGraph | how the record connects | panel body | E | frame `8718:485` |
| P53 | RootNode / Marker | the record itself | graph root | C | ellipse `8718:487`, fill `ink` |
| P54 | RootNode / Text | its kind + name | beside P53 | C | `Eyebrow` + `Title` `8718:488` |
| P55 | Branches / spine + connectors | the link lines | graph body | C | 2px left stroke `8718:491` + rects, `border` |
| P56 | Branch / Node ×3 | a related thing | on each connector | C | ellipses, fill `muted` |
| P57 | Branch / Text ×3 | relation kind + target | beside each node | E | `Eyebrow` + `Label/md` |

### Zone: StatusBar (`8718:510`, y 1358–1434)

| # | UI part | Meaning | Position | Cat | Built as |
|---|---|---|---|---|---|
| P58 | StatusBar | ambient session context | bottom, full width | E | frame `8718:510` |
| P59 | Measurement axis | the hard cut above the bar | bar top edge | C | 2px top stroke, `border-strong` |
| P60 | StatusBar / BrandTick | brand device | x 26, on the axis | C | rect `8718:531`, fill `primary` |
| P61 | Field ×4 | one context fact each | left to right | E | `8718:511` `8718:517` `8718:522` `8718:527` |
| P62 | Field / StatusDot | connection is live | field 1 | D | ellipse `8718:513`, fill `primary` |
| P63 | Field / Label + Value | the fact | inside each field | E | `Eyebrow` + `Body` |
| P64 | StatusBar / FieldDivider ×3 | separates the fields | between fields | A | `Separator[vertical]` `8718:516` `8718:521` `8718:526` |

### Zone: Command-open screen only (`8719:485`)

| # | UI part | Meaning | Position | Cat | Built as |
|---|---|---|---|---|---|
| P65 | CommandLauncher / Scrim | the page behind is inert | full bleed, absolute | A | `DialogOverlay` `8719:8400` |
| P66 | CommandLauncher / Palette | the command surface | x 380, y 130, 720 wide | A | `Command[palette]` `8719:8401` |
| P67 | Palette prompt row | what you type | palette top | A | `CommandInput[palette]` (nested) |
| P68 | Palette / Esc keycap | how to dismiss | prompt row, right | A | `Kbd` (nested in `CommandInput[palette]`) |
| P69 | Palette group heading ×3 | groups the commands | list | A | `CommandSeparator[labeled]` (nested in `CommandGroup[palette]`) |
| P70 | Palette command item ×7 | one command | list | A | `CommandItem[default\|selected]` (nested) |
| P71 | Palette item icon ×7 | what kind of command | item, leading | A | `.Command/Icon/*` via `icon#3559:0` swap |
| P72 | Palette item shortcut ×7 | the key that runs it | item, trailing | A | `shortcut#3559:15` + `shortcut (children)#3559:20` |

---

## 3 · Categorisation

### 3.1 · A — mapped to an existing Figma component, used as an instance (no change needed)

27 top-level instances in the resting screen (178 counting nested ones). Distinct components used:

| Component | Set / node | Where | Controls driven |
|---|---|---|---|
| `Separator` | `3676:1018` | P04, P24, P50, P64 | `orientation` |
| `InputGroup` | `3525:622` | P05, P33 | `state`, `layout`, `content` slot |
| `InputGroupAddon` | `3520:606` | P06, P08, P34 | `align`, `content` slot |
| `InputGroupInput` | `3522:590` | P07 | `placeholder#3777:0` |
| `Kbd` | `3217:308` | P09 | `content`, `emphasis`, `label (children)#3692:44` |
| `Button` | `3164:312` | P14, P28 | `variant`, `size`, `state`, nested base `label (children)#3692:35`, `Button Icon (Only)#3516:10` |
| `Switch` | `3839:2` | P18 | `size`, `checked`, `state` |
| `Label` | `3735:1024` | P19 | `label (children)#3735:0` |
| `Item` | `4498:2551` | P26 | `variant`, `size`, `title#4499:0`, `description#4499:10`, `media` slot |
| `Table` | `4521:2597` | P35 | `showCaption#4522:1`, `content#4537:0` slot |
| `TableRow` | `4520:2621` | P36, P39 | `state`, `cells#4520:3` slot |
| `TableHead` | `4515:2603` | P37 | `align`, `head (children)#4515:0` |
| `TableCell` | `4515:2610` | P40, P44 | `align`, `cell (children)#4515:4`, `content#4527:0` slot |
| `DialogOverlay` | `3590:791` | P65 | — (scrim + `scrim` × `scrim-opacity`) |
| `Command` | `3642:2` | P66 | `variant=palette`, `list#3642:0` slot |
| `CommandInput` | `3639:2` | P67 | `placeholder#3639:1` |
| `CommandGroup` | `3640:9` | P69 | `variant=palette`, `items#3640:0` slot |
| `CommandSeparator` | `3653:6` | P38, P69 | `variant`, `label#3653:1` |
| `CommandItem` | `3559:2` | P70–P72 | `state`, `icon#3559:0`, `label (children)#3559:10`, `shortcut#3559:15`, `shortcut (children)#3559:20` |
| `PopoverHeader` | `4367:2253` | P49 | `title#4367:0`, `description#4367:1` |

### 3.2 · B — mapped, but the screen needs something the component does not have

| # | UI part | Mapped to | What is missing | Proposed change |
|---|---|---|---|---|
| P27 | current object type in the nav | `Item` `4498:2551` | no `selected` state. The catalog records this deliberately: `state_axis` is examples-only, selection is "a call-site contract, NO set member" (`components-reference.md` § Item). With the no-override rule the accent tint cannot be applied at all — the build had to fall back to `variant=muted`, which reads far weaker than intended. | add a `selected` boolean (not a full state axis) to the `Item` set, bound to `accent-fill` + `accent-ink` + `accent-border` — the tokens already exist and already carry exactly this role (`accent-fill`: "tint that marks state — selected rows, active items"). |
| P26/P27 | nav rows generally | `Item` | no way to suppress the description. `description#4499:10 = ""` still reserves its line box → every row is 59 px tall where a nav list wants ~32. | `showDescription` boolean on the `Item` set (mirrors `showIcon` on `SelectItem`), or turn description into a slot. |
| P38 | attribute group divider inside the table | `CommandSeparator[labeled]` `3653:6` | `TableRow.state` has only `default / hover / selected` — no section-header row; and the only labelled-rule component in the DS is namespaced to `Command`. | promote `CommandSeparator[labeled]` to a DS-level `LabeledSeparator`, **or** add a `group` value to `TableRow.state`. The former is the better abstraction (§5). |
| P41/P42/P45 | type · cardinality · origin cells | `TableCell` `4515:2610` | the cell binds `text:Body` (14 sans). Tabular machine values want `text-format-data-md` (Geist Mono 11) — the format exists, the cell cannot reach it. | `format` axis on `TableCell` (`text \| data`), binding `Body` vs `Data/md`. |
| P43 | required marker | `TableCell` content slot | the DS icon set has no check component (the only glyph components are the 11 `.Command/Icon/*`). Had to be drawn as a raw vector from `RiCheckLine`. | add `.Icon/Check` to the DS icon set — `RiCheckLine` is already used in code (`command.tsx`, `select.tsx`). |
| P46 | column rules | `Table` `4521:2597` | the Table composition draws row borders only; vertical column rules are not modelled. | optional `showColumnRules` boolean on `Table`, or a `divider` boolean on `TableCell`. |
| P02 | connection / tenant switcher | `SelectTrigger` `4308:2029` is the nearest (value + trailing chevron) | no leading-indicator slot and no second segment; a tenant switcher needs host + tenant + live-state dot. | a `leading` slot on `SelectTrigger` would cover the dot; the two-segment form is a composition (§5, `ContextSwitcher`). |
| P13 | active rail tool | `Button` `3164:312` | `variant=default` is used to mean "selected", but `default` semantically means "primary action", not "current". Also: no node-tree glyph exists, so the button keeps the base `.Button Icon` default. | selection in a nav rail is the same gap as P27 — one shared `selected` treatment for `Item` + `Button`; plus the icon-set gap below. |
| P20 | source count | `Badge[outline]` `3697:1016` | Badge binds `text:Label/md` (sans 14); a tabular counter wants mono. The code already diverges here — `components-reference.md` § Badge `divergences`: "the count-pill (font-mono tabular min-w-5) [is a] code-level override, not [a] Figma variant". | give `Badge` a `count` variant bound to `Data/md`, closing a divergence that already exists in code. |
| P05 | command launcher trigger | `InputGroup` | no "palette is open" state — on the second screen the trigger should read as inert. `InputGroup.state` has `default / focus / disabled / invalid / focus-invalid`. Dimming it would have been an ad-hoc opacity override, so it was left untouched. | reuse `state=disabled`, or accept that the scrim carries it (documented decision). |
| P49 | detail-panel header | `PopoverHeader` `4367:2253` | the only title+description pair in the DS, but its title binds `Label/md` (14/500) — visibly too small as a panel headline, and it is Popover-namespaced. | promote to `PanelHeader` with a `size` axis (`compact` = today's `Label/md`, `panel` = `Heading-sm`). |
| P71 | palette item icons | `CommandItem.icon` swap | works for all 7 items because the needed glyphs happen to exist. Not a defect — recorded so the dependency on an 11-glyph icon set is visible. | — |

### 3.3 · C — no component; drawn from frames/shapes/text bound to tokens

These are legitimate as raw nodes today — they are either pure typography (a text style, not a component)
or layout containers. Every one is fully token-bound (§6).

| # | UI part | Why no component | Tokens bound |
|---|---|---|---|
| P11 | globe glyph | icon, not a component (see 3.2/P43 — the DS icon set is 11 glyphs) | `muted` |
| P16, P25, P30, P32, P48, P51 | eyebrows / micro-labels | typography role; `text:Eyebrow` is a style, correctly not a component | `muted` + style `Eyebrow` |
| P23 | meter summary | plain body copy | `muted` + style `Body` |
| P31 | record name | plain display heading | `ink` + style `Display` |
| P53–P56 | relation graph marker, spine, connectors, nodes | diagram primitives; nothing comparable exists (see 3.5, `RelationGraph`) | `ink`, `border`, `muted` |
| P59, P60 | measurement axis + brand tick | brand device, deliberately not systematised | `border-strong`, `primary` |

### 3.4 · D — would be a **new primitive component** that does not exist yet

| Proposed primitive | Covers | Registry equivalent | Why it is a primitive, not a composition |
|---|---|---|---|
| `Meter` | P21 source-share bar | shadcn `progress` (not ported) | one non-interactive value-over-total bar; no children, no composition. Today it is 2 rects. It also has **no token pair of its own**: the build used `primary-fill` (documented as "the filled part of a range control") + `input-fill-high` ("resting track of a range or toggle control") — the range-control roles are the closest correct fit, and the `chart-*` series were rejected because the bar is a track, not a data series. |
| `StatusDot` | P03, P62 | none | a 6–8 px state marker with a semantic tone. Recurs twice on this screen alone. Blocked on a second gap: **the DS has no `success` / `warning` semantic colour** — `tokens.reference` §1 records "semantic tokens exist for error only (destructive); success / warning are ramps only". The build used `primary` (documented for "caret / marker shapes"), which says "brand", not "healthy". |
| `SegmentedControl` (or `ToggleGroup`) | P10 locale switch | shadcn `toggle-group` (not ported) | a 2–3 option exclusive choice rendered inline. Today three text nodes. |
| `Legend` | P22 meter legend | none | a swatch + label pair; the counterpart to `Meter`. Could equally be a `Badge` variant with a leading colour slot. |
| `.Icon/Check` (+ `.Icon/NodeTree`, `.Icon/Links`) | P43, P13, P14 | `@remixicon/react` | the DS icon set is 11 glyphs, all `.Command/Icon/*`. Three glyphs this screen needs are absent; `RiCheckLine` is already used in *code*. |

### 3.5 · E — would be a **composition** (blocks layer, `libs/ui/src/blocks/`)

Named for the DMS domain in general, not for this one screen — the question asked of each was
*what is it / what does it do / is there a generic equivalent*.

A composition earns its place when the *arrangement* carries a rule that would otherwise be
re-invented (and got wrong) on every screen — not when it is merely a box around some primitives.
The `Why a composition` column names that rule.

| Composition | Covers | What it is (generic) | Why a composition (not just layout, not a primitive) | Rough API |
|---|---|---|---|---|
| `AppShell` | P01, P12, P15, P29, P47, P58 | the frame every tool screen sits in: top bar, rail, side panel, content, detail panel, status bar | The rule is *which region owns what* — tool switching left, filtering next, the record in the middle, its context right, session facts at the foot. Every tool screen repeats it, and a screen that shuffles it breaks the user's spatial model. Holds no content of its own, so it can never be a primitive: it is pure region assignment. | slots `topBar`, `rail`, `sidebar`, `content`, `detail`, `statusBar`; `detail` collapsible |
| `NavRail` | P12–P14 | vertical icon navigation with exactly one current item | Single-selection across N `Button`s. No primitive owns "exactly one of these is current" — leave it to the call site and two rails end up marking the current tool differently (this build already had to use `variant=default` to mean "current", §3.2/P13). | `items[]`, `value`, `onValueChange` |
| `ContextSwitcher` | P02–P04 | switch the active workspace / tenant / connection, with its live state | Binds two facts (host, tenant) to one live status and one switch action. The composition exists so the indicator and the thing it indicates cannot drift — a green dot beside a stale tenant is worse than no dot. | `status`, `primary`, `secondary`, `onOpenChange` — the trigger half of a `Popover` |
| `FilterPanel` | P15–P24 | toggle a set of sources on/off and show their share | The meter is *derived* from the toggles; that derivation is the whole job. Leaving it to the call site is exactly how the source screen ended up claiming "23 von 23 Typen aktiv" beside toggles summing to 22. | `sources[]` (label, count, enabled), `onToggle` — composes `Switch`, `Label`, `Badge`, `Meter` |
| `EntityList` | P25–P28 | a grouped, selectable, truncating list of records | Three rules that only hold together: grouping, truncation, and selection. A truncated group still counts in its heading, and the current item may be inside the hidden remainder — a plain list of `Item`s cannot know that. | `groups[]`, `value`, `onSelect`, `overflowLabel` — composes `Item` |
| `DataGrid` | P35–P46 | a grouped attribute table with a column contract | `Table` ships the parts but nothing enforces that head and cells share widths and alignment — this build set five column widths by hand on 26 rows. The column contract is the composition. | `columns[]`, `groups[]`, `rows[]` — composes `Table`, `TableRow`, `TableHead`, `TableCell`, `LabeledSeparator` |
| `DetailPanel` | P47–P51 | context for whatever is currently selected | Owns the states no primitive owns: nothing selected, one thing selected, selection gone stale. A panel without a defined empty state is the most common half-built side panel. | slots `header`, `sections[]` — composes `PanelHeader`, `Separator` |
| `RelationGraph` | P52–P57 | a record's relations as a small node-link view | A layout algorithm (spine, branch anchoring, growth as branches are added), not a styling problem. This build placed it with a 2 px stroke and a hand-set 5 px inset — that arithmetic belongs in code, not in every screen. | `root`, `branches[]` (kind, target) |
| `StatusBar` | P58–P64 | ambient session facts, always visible | The set of facts *is* the contract — which four things an operator can always see without moving. That vocabulary is app-wide and belongs in one place, not re-chosen per screen. | `fields[]` (label, value, status?) — composes `MetaRow`, `Separator` |
| `CommandLauncher` | P05–P09, P65–P72 | the trigger and its palette as one pair | One feature living in two places plus a keyboard shortcut. Neither half makes sense alone: the trigger must reflect that the palette is open (§3.2/P05), the palette must know what the trigger showed. Splitting them is what leaves a lit-up trigger under an open overlay. | `commands[]`, `open`, `onOpenChange` — composes `InputGroup`, `Kbd`, `Dialog`, `Command` |
| `PanelHeader` | P30–P32, P48–P49, P54 | eyebrow + name + meta/summary — the standing header of any record surface | Listed here only because it currently spans four zones — **it is a primitive** (see the note below). Its rule is a fixed three-role hierarchy: what kind of thing, which one, what about it. | `kind`, `name`, `meta?`, `description?` |
| `MetaRow` | P57, P61–P63 | a labelled fact: micro-label above a value | Same — **a primitive**, listed here for its spread. Its rule is that the label is always subordinate to the value, in both size and colour; hand-built it drifts every time. 7 instances on one screen. | `label`, `value`, `status?` |

**Two of these are primitives in disguise and should be pulled out first:** `PanelHeader` (generalise
`PopoverHeader`) and `MetaRow` — they carry no domain logic and are used across every zone.

---

## 4 · Token evidence

Every authored value is bound by variable id. Full list of what the two screens bind:

| Group | Tokens bound | Bound on |
|---|---|---|
| surface | `surface` `3037:2` · `sidebar-fill` `3038:7` | AppShell, WorkspaceColumn, DetailPanel, StatusBar, ContextSwitcher / NavRail, FilterPanel |
| ink | `ink` `3037:3` · `muted` `4492:2666` | all body/label text, relation root marker, required marks |
| accent / brand | `primary` `4197:9643` | status dots (P03, P62), brand tick (P60) |
| control | `primary-fill` `3037:8` · `input-fill-high` `4197:9645` | meter segments + legend swatches |
| line | `border` `3038:4` · `border-emphasis` `3045:3` · `border-strong` `3049:2` | TopBar/rail/panel edges · locale divider · status-bar axis |
| corner | `corner-lg` `3073:4` · `corner-full` `3073:6` · `corner-sm` `3073:2` | ContextSwitcher · meter segments · legend swatches |
| space | `space-2xs` `3070:3` · `space-xs` `3070:4` · `space-sm` `3070:5` · `space-md` `3070:6` · `space-lg` `3070:8` · `space-xl` `3070:9` · `space-2xl` `3070:10` · `space-3xl` `3070:11` | every gap and padding on every authored frame |
| text styles | `Display` · `Title` · `Label/md` · `Label/sm` · `Body` · `Eyebrow` · `Data/md` | see per-part table §2 |

**Tokens reached only through component instances** (not bound by this build, listed for completeness):
`accent-fill` / `accent-ink` (CommandItem selected), `dialog-fill` + `effect:Elevation` (Command palette),
`scrim` × `scrim-opacity` (DialogOverlay), `inverse-fill` / `inverse-ink` (Kbd), `input-fill` /
`input-border` / `input-ink-placeholder` (InputGroup), `muted-fill` (Item muted), `card-fill`
(CommandInput palette prompt), `effect:Glow` (palette caret).

**Deliberate token decisions worth a second opinion**
1. **Meter colours** — `primary-fill` + `input-fill-high` (range-track roles) chosen over `chart-1` /
   `chart-2` (data-series roles). The chart pair was built first and rejected: brown/green against this
   cool chrome, and the bar reads as a track, not a series. Both readings are defensible.
2. **Status dot** — `primary`. There is no `success` token (§3.4). If a status family is ever added,
   P03 and P62 are its first two consumers.
3. **Status-bar axis** — `border-strong`, whose documented use is exactly "the one line that must
   dominate (axis, hard cut). Use sparingly." Used once per screen.

---

## 5 · Layer structure (for later replacement by composition instances)

Layer names are English and named after the composition each subtree would become, so swapping a
subtree for a future component instance is a one-node replace:

```
AppShell · Schema Browser / Resting              8707:4
├─ AppShell / TopBar                             8708:2      → AppShell slot: topBar
│  ├─ TopBar / Start ▸ ContextSwitcher           8708:4      → ContextSwitcher
│  ├─ CommandLauncher / Trigger                  8709:2      → CommandLauncher (trigger half)
│  └─ TopBar / End ▸ LocaleSwitch                8709:10     → SegmentedControl
├─ AppShell / Body                               8711:14
│  ├─ NavRail                                    8711:15     → NavRail
│  ├─ FilterPanel                                8712:37     → FilterPanel
│  │  ├─ FilterPanel / SourceFilters             8712:38     →   ├ SourceToggle ×2 + SourceMeter
│  │  └─ EntityList                              8713:7133   → EntityList
│  ├─ WorkspaceColumn                            8714:88
│  │  ├─ WorkspaceColumn / EntityHeader          8714:89     → PanelHeader
│  │  └─ SchemaTable                             8716:7684   → DataGrid
│  └─ DetailPanel                                8717:483    → DetailPanel
│     ├─ DetailPanel / Header                    8717:484    →   ├ PanelHeader
│     └─ DetailPanel / RelationSection           8717:490    →   └ RelationGraph
└─ StatusBar                                     8718:510    → StatusBar (4 × MetaRow)

AppShell · Schema Browser / Command Open         8719:485    (clone + 2 absolute children)
├─ CommandLauncher / Scrim                       8719:8400
└─ CommandLauncher / Palette                     8719:8401
```

---

## 6 · Checks

### 6.1 · All identified parts are in the report and categorised — **PASS**
72 parts identified, 72 in §2, each with exactly one primary category. Distribution:
**A 30 · B 11 · C 15 · D 5 · E 11** (= 72). Parts also referenced from a second category are
cross-linked in §3 — e.g. P27 is primary **B** (Item needs a selected state) and feeds **E**
(`EntityList`); P21 is primary **D** (`Meter`) and feeds **E** (`FilterPanel`).

### 6.2 · Components correctly set, artboard completely filled — **PASS**
- Resting screen: **27 top-level instances, 178 instances in total** (nested included).
- Command-open screen: **29 top-level, 204 total** (the clone plus `DialogOverlay` and the `Command` palette,
  whose nested `CommandInput` / `CommandGroup` / `CommandItem` / `CommandSeparator` / `Kbd` instances account for the delta).
- Every instance is a real DS main component (verified via `getMainComponentAsync`, §2 tables).
- No instance was detached; every variation was driven through a declared control
  (variant / text / boolean / instance-swap / slot).
- Both screens render complete: all 21 attribute rows, 3 group dividers, 4 status fields,
  7 command items with icons and shortcuts.

### 6.3 · No hard-coded colour / spacing / radius — **PASS (0 findings)**
`figma-verify` step 7 walked all 1257 visible nodes under `8707:2` and checked every fill, stroke,
padding, item-spacing and corner radius on **authored** (non-instance-descendant) nodes for an empty
`boundVariables` entry: **0 unbound token-backed values.**

The two intentional raw numbers, both geometry rather than token-backed properties (geometry stays
numeric per the DS rule "Geometry stays numeric (`h-8`, `size-3`); only colour / typography / spacing /
radius bind to tokens"):
- `RelationGraph / Branches` `paddingLeft = 5` — half the 12 px root marker minus the 2 px spine, so
  the spine passes through the marker's centre. Not a spacing step by intent.
- element sizes (`56` rail, `284` panel, `340` detail, `480` trigger, `374` search, column widths
  `264/126/112/96/170`, dots `6/7/10/12`, meter height `6`, brand tick `3×21`).

### 6.4 · Other `figma-verify` results

| Check | Result | Evidence |
|---|---|---|
| text-as-icon | **PASS** | 0 findings. Every glyph is a VECTOR: chevron, globe, required marks (RiArrowDownSLine / RiGlobalLine / RiCheckLine), rail glyphs via instance swap. |
| sibling overlap | **PASS** | 0 findings (every authored container is auto-layout). |
| clipped child | **1 FLAG, fixed** | `SourceToggle / Label` overflowed its instance box by 12 px — the label text "APP · osbbusinesspartners" is wider than 284 px allows. Shortened to "APP · osbbusinessp." on both screens (`8712:54`, `8719:522`); re-measured at −30 px, inside. Remaining 4 rows are 1 px vector-rounding **inside** `InputGroupAddon`'s own `icon` frame — component-internal, not this build's. |
| padding asymmetry | **35 HINTS, acknowledged** | all deliberate: panels pad top only (`NavRail` 16/0, `FilterPanel` 24/0, `DetailPanel / RelationSection` 24/0) because the column scrolls; `EntityHeader` 24/16; `RelationGraph / Branches` 16/0 and `Branch / Text` 12/0 (the connector supplies the left inset). The addon insets (8/0, 0/8) and the group-divider 12/6 are component-internal. |

### 6.5 · What is NOT faithful to the source draft, and why

| Draft intent | Built as | Reason |
|---|---|---|
| current nav row on `accent-fill` | `Item[muted]` | §3.2 P27 — no selected state, and tinting the instance would be a token override |
| table values in mono 11 px | `TableCell` `Body` 14 px | §3.2 P41 — no format axis on `TableCell` |
| table column headers in `Eyebrow` 9 px | `TableHead` `Label/md` 14 px | the component's bound format; no override |
| detail-panel title at `Heading-sm` 22 px | `PopoverHeader` title at `Label/md` 14 px | §3.2 P49 |
| launcher trigger dimmed while the palette is open | untouched | §3.2 P05 — no such state; the scrim carries it |
| rail "schema" glyph | base `.Button Icon` default | §3.4 — no node-tree icon component |
| single-line nav rows | 59 px rows | §3.2 — description cannot be suppressed |

---

## 7 · Follow-ups, in the order they unblock the most

1. **`Item` — `selected` boolean + `showDescription` boolean.** Unblocks P26/P27 and every future
   explorer list. Tokens already exist (`accent-fill` / `accent-ink` / `accent-border`).
2. **Promote `CommandSeparator[labeled]` → `LabeledSeparator`.** Unblocks P38 and any grouped list.
3. **`TableCell` — `format` axis (`text | data`).** Unblocks P41/P42/P45; `Data/md` already exists.
4. **Extend the DS icon set** — `.Icon/Check` first (already used in code), then `NodeTree`, `Links`.
5. **`PanelHeader`** — generalise `PopoverHeader` with a `size` axis. Unblocks P49 and P30–P32.
6. **`Badge` — `count` variant on `Data/md`.** Closes an already-recorded code↔Figma divergence.
7. **New primitives, in dependency order:** `Meter` (+ `Legend`), `StatusDot` (blocked on a
   `success` / `warning` semantic colour family), `SegmentedControl`.
8. **`MetaRow`** — the smallest, most reused missing piece (7 instances on one screen).

> `components-reference.md` and `component-changelog.md` are **not** updated by this run: nothing in the
> DS changed (read-only), and no component was ported or synced. If any follow-up above is executed,
> that is the run that updates the catalog.

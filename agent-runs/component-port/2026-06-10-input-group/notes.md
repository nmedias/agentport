# Component Port — input-group RE-PORT (2026-06-10)

shadcn `input-group` (radix-nova) → Agentport DS. **Re-port** after the composite-port skill rework
(SKILL.md spine + composites.md + figma-build.md). GREEN test of the new procedure: Examples-First
(T2.5 stories before Figma), Exposure-Surface + Done-Test, Composition-Plan user-ask, reproduced
example instances in Figma. Prior port: `agent-runs/component-port/2026-06-09-input-group/` (analysis base).

6-part composite, no root element. Deps: Button ✓, Input ✓, Textarea ✓, Kbd ✓ (all DS-ported).

## T2 — Anatomy (landed radix-nova source)

Parts (data-slot): `input-group` (container) · `input-group-addon` (CVA `align`) · `input-group-control`
(on Input + Textarea) · plus InputGroupButton (wraps Button ghost, CVA `size`) · InputGroupText (span).
- Container: no CVA; **states via `has-[]`**: focus (`has-[control:focus-visible]`), invalid
  (`has-[[aria-invalid=true]]`), disabled (`has-disabled`); block-addon / textarea → `flex-col` stack.
- `inputGroupAddonVariants.align`: inline-start / inline-end / block-start / block-end.
- `inputGroupButtonVariants.size`: xs / sm / icon-xs / icon-sm (ghost default).

**Dependency-Audit:** `ui:add input-group` wrote 4 flat files (button/input/textarea/input-group.tsx).
button/input/textarea already DS-ported as folders → flat stock copies **deleted** (would shadow the DS
folders on import resolution). input-group.tsx moved into its folder + barrel. No package.json/lock change.
→ skill-feedback #1 (shadowing failure mode not covered by the audit).

**Drift caught vs prior port:** stock invalid carries `ring-3` (width) AND `ring-destructive/20` (color);
prior DS port dropped the width on invalid (only `ring-destructive/20`, no `ring-[3px]`) → invalid ring
wouldn't render. Re-port fixes: invalid = border-destructive + ring-[3px] + ring-destructive/20.

## T2.5 — Example-Inventory (shadcn docs → stories)

Ported deps available: button, input, textarea, **kbd**, breadcrumb.
Not ported (skip-rule): dropdown-menu, tooltip, separator, label, spinner, popover, empty, button-group,
react-textarea-autosize, useCopyToClipboard.

| Doc example | Disposition | Reason |
|---|---|---|
| `input-group-icon` | **kept** → story `Icons` | icon addon placements (inline-start/-end/both/two-in-one) — pure, portable |
| `input-group-text` | **kept** → story `Text` | text prefix/suffix ($ / USD, https:// / .com, @company) + textarea char-count — pure |
| `kbd-input-group` | **kept** → story `Kbd` | search + ⌘K shortcut (leading icon + trailing Kbd group) — Kbd ✓ |
| `input-group-textarea` | **kept** → story `Textarea` | textarea + block-start/-end toolbars w/ borders — icons only |
| `input-group-button` | **kept (subset)** → story `Buttons` | trailing icon-button (copy) + trailing text-button (Search). Dropped the Popover row (un-ported) + clipboard hook |
| (matrix coverage) | **added** → story `States` | default/disabled/invalid container states — no single doc example isolates them |
| `input-group-demo` | **skipped** | composes DropdownMenu + Tooltip + Separator (un-ported). Portable sub-patterns (search+count text) covered by `Text` |
| `input-group-label` | **skipped** | needs Label + Tooltip |
| `input-group-tooltip` | **skipped** | needs Tooltip |
| `input-group-spinner` / `spinner-input-group` | **skipped** | needs Spinner. Disabled state covered by `States` |
| `input-group-dropdown` | **skipped** | needs DropdownMenu |
| `empty-input-group` | **skipped** | needs Empty (inner field dup of `Kbd`) |
| `input-group-custom` | **skipped** | needs react-textarea-autosize (npm) |
| `input-group-button-group` / `button-group-input-group` | **skipped** | needs ButtonGroup (+ Label/Tooltip) |

Canonical story set = Icons · Text · Kbd · Textarea · Buttons · States (+ Default hero).
Note: in-field Kbd uses `emphasis="low"` (quiet muted keycap) to match the stock addon affordance;
DS Kbd default is `high` (inverted), too heavy inside a field.

## T2.7 — Composition-Plan (user-confirmed 2026-06-10)

- **Figma:** REBUILD all 6 sets fresh (delete old Section 3491:674), in a new Section. + assembled
  recomposable InputGroup (slot-driven) + reproduced example instances.
- **Examples:** all 6 canonical as permanent proof instances (Icons, Text, Kbd, Buttons, Textarea, States).
- **In-field Kbd:** quiet (`emphasis="low"`).
- Exposure-model per part: Container = state Variant + children Slot · Addon = align Variant + content Slot ·
  Button = size Variant, **nests a real ghost `.Button` instance** (see Button re-nest below) · Input/Textarea/Text = Text prop.

## T3 — Translation (landed radix-nova stock → DS). px-value mapping; tokens by use/avoid.

**InputGroup container** — group owns surface+border+focus/invalid/disabled:
| stock (landed) | DS | why |
|---|---|---|
| (no light bg) | **bg-input-background** | DS fields opaque (use: "Eingabefeld-Fill (opak)"); stock leaves transparent. Command overrides per palette. |
| h-8 rounded-lg border border-input | same (h-8 numeric) | radius-lg=fields ✓; input=form-control border ✓ |
| transition-colors | transition-[color,box-shadow] | focus changes box-shadow |
| has-disabled:bg-input/50 + opacity-50 | has-[:disabled]:opacity-50 | DS disabled = opacity only |
| has-[control:focus-visible]:border-ring ring-3 ring-ring/50 | …ring-[3px] | group shows ring; ring-3→ring-[3px] |
| has-[aria-invalid]:border-destructive **ring-3** ring-destructive/20 | border-destructive **ring-[3px]** ring-destructive/20 | **FIX: keep ring width** (prior port dropped it → invalid ring didn't render). destructive=⚠ placeholder |
| has-[block-*]:h-auto/flex-col · has-[textarea]:h-auto | kept | block addons/textarea stack vertically |
| [&>input]:pl-1.5/pr-1.5 (inline) · pt-3/pb-3 (block) | pl-sm/pr-sm · pt-lg/pb-lg | px-value 6→sm, 12→lg |
| in-data-[combobox]:… · dark:* | dropped | no Combobox; single light mode |

**InputGroupAddon** (align CVA): gap-2→gap-md · py-1.5→py-sm · `text-sm font-medium`→**text-label** · text-muted-foreground kept · pl-2/pr-2→pl-md/pr-md · block px-2.5→px-md, pt-2/pb-2→pt-md/pb-md · `[&>kbd]:rounded-calc` dropped (DS Kbd owns radius) · svg size-4 + ml-nudges kept.
**InputGroupButton** (size CVA, wraps Button ghost): base gap-2→gap-md (text-sm/shadow-none dropped — Button owns text-label, DS flat) · xs h-6 gap-1→gap-xs rounded-calc(5)→rounded-sm px-1.5→px-sm svg-3.5 · icon-xs size-6 rounded-sm p-0 · icon-sm size-8 p-0 (geometry numeric).
**InputGroupText**: `text-sm`(Regular)→**text-body** · gap-2→gap-md · text-muted-foreground (Body vs addon's Label = the Regular/Medium distinction).
**InputGroupInput/Textarea** (borderless controls): flex-1 rounded-none border-0 bg-transparent ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 (+data-slot=input-group-control); Textarea resize-none py-2→py-md. shadow-none + dark:* dropped. Group owns surface/border/ring.

## T4 — Figma build (REBUILT fresh; old Section 3491:674 deleted)

DS file nQSNLASjuLvgTh3we8Dp4s · page "Shadcn Components" 3126:2 · **Section "Input Group" `3519:590`** (headline `3519:591`).
3-layer composite build + reproduced examples:

| node | id | axes / props |
|---|---|---|
| `.InputGroup/Addon` | `3520:606` | **align** [inline-start `3520:590` / inline-end `:594` / block-start `:598` / block-end `:602`] + **content** SLOT |
| `.InputGroup/Button` | `3545:694` | **size** [xs `3545:671` / sm `:676` / icon-xs `:681` / icon-sm `:688`]; each **nests a ghost `.Button` instance** (re-nest 2026-06-10, see below) |
| `.InputGroup/Input` | `3522:590` | TEXT prop (borderless, placeholder Label/input-placeholder) |
| `.InputGroup/Textarea` | `3522:592` | TEXT prop (borderless, top-aligned) |
| `.InputGroup/Text` | `3522:594` | TEXT prop (Body muted) |
| `.InputGroup` (composition) | `3525:622` | **state** [default/focus/disabled/invalid] × **layout** [horizontal/vertical] + **content** SLOT (children) |
| examples | Icons `3527:613` · Text `3527:650` · Buttons `3546:697` · States `3528:662`/`:681`/`:700` · Textarea `3547:711` · Kbd `3531:676` | container instances, slots filled from controls (Done-Test) |
| swap-target | `.InputGroup/Button Icon · copy` `3546:677` | persistent icon component the Buttons-example copy button swaps onto (DS Button has no free icon slot) |

Vars bound by ID: input-background `3108:2` · input(border) `3038:5` · ring `3038:6` · destructive⚠ `3038:3`
· foreground `3037:3` · muted-foreground `3037:13` · input-placeholder `3043:3` · radius-lg `3073:4` · radius-sm `3073:2`
· space-xs `3070:4` · sm `3070:5` · md `3070:6`. Text styles: Label `S:4e03…`, Body `S:7e1b…`. Kbd set `.Kbd` `3217:308`.

**Exposure-model per part (composite §1):**
- Container children → **Slot** (open, variably-many) + whole-level **state**/**layout** Variants.
- Addon align (4) → **Variant**; addon content → **Slot**.
- Button size (4) → **Variant**; **nests a real ghost `.Button` instance** (re-nest below).
- Input/Textarea placeholder/value, Text label → **Text property**.
- Kbd / icons composed → nested **instances** of the ported `.Kbd` set + Remix vectors.

**Button re-nest (2026-06-10, post-review — fixed a deviation):**
First build had `.InputGroup/Button` **standalone** (re-clothed), violating composites layer-2 ("nest the ported
component"). User flagged it; rebuilt to nest a real ghost `.Button` instance (`3164:312`) per size
(xs→xs, sm→default, icon-xs→icon-xs, icon-sm→icon). Mechanics (verified before committing):
- **Geometry delta** (InputGroup wants rounded-sm on xs/icon-xs vs DS rounded-md): the DS Button hides geometry
  in a nested `.Button/Base` instance — but `base.setBoundVariable('topLeftRadius',…)` **works** on it → radius re-bound to radius-sm. (Top-level Button instance is `lm:NONE`; overriding its padding/radius is a no-op — go one level into Base.)
- **Text content**: deep-override the inner `.Button/Base` TEXT characters — works.
- **Icon content**: the DS Button exposes **no free icon slot** (`Icon#3159:0` is a SLOT *type* but its default
  `.Button Icon` can't be `remove()`d in an instance, and there's no icon-component library). **`swapComponent`** on
  `.Button Icon` → a persistent icon component **works** → the Buttons-example copy button swaps onto
  `.InputGroup/Button Icon · copy` (`3546:677`). This is the "cost": each distinct icon needs a swap-target component.
- Code: `input-group.tsx` always composed `<Button variant="ghost">` (the standalone was a Figma-only deviation).
  Follow-up `refine(ui)` (`10bd4c2`): InputGroupButton now **forwards a mapped DS Button size** (xs→xs, sm→default,
  icon-xs→icon-xs, icon-sm→icon) so it inherits the DS geometry; CVA className slimmed to the delta (`rounded-sm` on
  xs/icon-xs). Mirrors the Figma nest. One `as never` cast bypasses Button's icon-size aria-label union (a11y = consumer's job).

**Build mechanics learned (→ figma-build.md candidates, see skill-feedback):**
- Slot-fill in an instance: `appendChild` **adds** (does not replace) → clear default children first (`[...slot.children].forEach(c=>c.remove())`), then append.
- Slot `layoutMode` is **locked** inside an instance → orientation (h/v) must be a container **Variant axis**, not an instance edit.
- Appending an instance into an instance-slot **invalidates the JS reference** → re-resolve the live child (`slot.children[i]` / mainComponent match) before setting `FILL`.
- `ui:add` writes deps **flat**; an already-ported folder dep gets shadowed by the flat stock copy → delete the flat copy.

## T5 — Verify

- Controls-live ✅: every variant (align/size/state/layout) + every slot exercised by building the 6 examples from controls; container variant matrix screenshotted (all 8 states render: border/focus-ring/disabled-opacity/invalid-ring).
- `/figma-verify` ✅ **CLEAN** after one fix: the Kbd `⌘` was a **text-as-icon** (Class-A) → replaced with a `RiCommandLine` **vector** in a `content=icon` low-emphasis Kbd (DS kbd guidance: modifier symbols are vectors). `K` stays text (a letter). 15 `.InputGroup/Addon` padding-asymmetry hits = **intentional** per-align insets (inline addons hug one side; block addons asymmetric top/bottom) — acknowledged.
- Reproduces usages ✅: the 6 permanent example instances rebuild the 6 canonical stories from the composition's controls (Done-Test proof).

## T6 — Code + gate

`libs/ui/src/components/ui/input-group/` (tsx + index + stories + spec); re-exported in `libs/ui/src/index.ts`.
Exports: InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea.
- **Fix vs prior port:** invalid state now carries `ring-[3px]` (width) alongside `ring-destructive/20` (colour) — the prior port dropped the width, so the invalid ring never rendered.
- Kbd story uses `<RiCommandLine />` inside `<Kbd>` (not the `⌘` glyph), matching Figma + DS kbd guidance.
- **Gate:** `nx test` ✅ 27/27 (5 input-group specs incl. text-label survives twMerge) · `nx typecheck` ✅ · `nx lint` ✅ (only pre-existing .storybook warning). jsdom polyfills not needed (input-group has no headless ResizeObserver/scrollIntoView mount).
- **Storybook (DS tokens):** Default · Icons · Text · Kbd · Buttons · Textarea · States — all live at
  `http://localhost:6006/?path=/story/ui-inputgroup--<name>`.

## Open items
- `destructive` ⚠ placeholder token (invalid state) — stock hex, not designed.
- Combobox-content focus overrides + `[&>kbd]:rounded-calc` dropped — re-add if a Combobox is ported / if Kbd radius needs the field-tuned calc.
- InputGroupButton icon sizes don't type-enforce aria-label (Button size not forwarded) — matches nova; consumers add it.
- **Next: Command re-port** (#3) — CommandInput builds on InputGroup + InputGroupAddon; CommandDialog needs a Dialog port first. cmdk jsdom polyfills already in test-setup.ts.

## Status: DONE — Figma rebuilt + CLEAN, code gate green, stories on DS tokens, Done-Test satisfied.

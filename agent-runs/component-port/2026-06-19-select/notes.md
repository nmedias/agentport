# Component-Port — Select (radix-nova → Agentport DS)

**Date:** 2026-06-19 · **Branch:** `feat/select-port` · **Skill:** `/shadcn-component-port` + `references/composites.md`
**Status:** in progress — Figma build delegated to a background agent (T4+T5); code (T6) in main.

## Decisions (user, T2.7)

- **Trigger fill = `bg-input-fill`** (Input parity). Nova source is `bg-transparent`; our field family
  (Input/Textarea/InputGroup) carries opaque `input-fill` → the closed trigger reads identically to its
  field siblings. Deliberate deviation from Nova.
- **Scope = full composite** — trigger set + item set + open content panel + permanent usage examples
  (done-test).

## Dependency audit (composite §2 T2)

`npm run ui:add -- select` wrote **only** `select.tsx` (flat) — **no** foreign component files (Nova Select
depends only on `radix-ui` + IconPlaceholder, no sub-components of its own). Audit clean.

- **KEEP the `radix-ui` umbrella import** — `"radix-ui": "^1.5.0"` is a declared dep in `libs/ui/package.json`;
  Dialog imports identically (`import { Dialog as DialogPrimitive } from 'radix-ui'`). Finding #3 (per-primitive)
  applied only to the Breadcrumb `Slot` case, not to full primitives. → Select: `import { Select as SelectPrimitive } from 'radix-ui'`.
- **`lucide-react` NOT installed** → icon swap to `@remixicon/react` (present, `^4.9.0`) is mandatory (finding #1):
  - `ChevronDownIcon` → `RiArrowDownSLine` (trigger + ScrollDownButton)
  - `ChevronUpIcon` → `RiArrowUpSLine` (ScrollUpButton)
  - `CheckIcon` → `RiCheckLine` (ItemIndicator)
  - `*-s-line` chevrons: verify the exact path from `node_modules/@remixicon/react` (the MCP may not list them).

## Anatomy (parts, data-slot)

| Part | data-slot | Role |
|---|---|---|
| Select | select | Radix root, no styling |
| SelectValue | select-value | display value (styled via trigger `*:data-[slot=select-value]`) |
| **SelectTrigger** | select-trigger | closed control button; CVA `size [sm,default]`; chevron-down |
| **SelectContent** | select-content | dropdown panel (portal); holds ScrollUp + viewport(items) + ScrollDown |
| **SelectItem** | select-item | option row; focus highlight + check indicator on the right |
| SelectGroup | select-group | `p-1` group container |
| SelectLabel | select-label | group caption (muted) |
| SelectSeparator | select-separator | full-bleed 1px line |
| SelectScrollUp/DownButton | select-scroll-* | scroll affordance with chevron |

## Composition plan / exposure model (Figma)

Select is a **popover composite** (dropdown portaled, only visible when "open"). Figma cannot "open" →
open state as a static composition (like Command/Dialog). Four build layers (composites.md T4):

1. **Trigger set** — `size [sm, default]` × `state [default, focus, disabled, invalid]` (8 members).
   Input clone: nest/mirror `.Input` (set `3177:302`, default member `3176:303`, focus `3176:305`, invalid `3176:311`).
   Value = TEXT slot/prop (placeholder default greyed, convention `{Value}`); chevron-down = fixed vector (RiArrowDownSLine, muted-ink).
   Focus/invalid glow = literal-alpha DROP_SHADOW `showShadowBehindNode:false` **verbatim from the `.Input` focus** (finding #30).
2. **Item set** — `state [default, focus, disabled]` + boolean `selected` (check visible). CommandItem pattern
   (mirror `CommandItem` set `3559:2`: state default/selected/disabled/checked). Label = TEXT prop; optional
   leading-icon slot; check on the right (RiCheckLine, visible when `selected`).
3. **Content panel composition** — Command surface (mirror `Command` composition `3642:2`): `dialog-fill` + `border`
   + `shadow-elevation` (effect style) + `corner-lg`; **slot** for items (variable count) + optional label/separator.
4. **Usage-examples group** (done-test) — labelled vertical AL group below the sets, pure instances:
   Basic · Groups (label + nested `.Separator` `3676:1018`) · Scrollable · Invalid (nested `.Field` instance).

Bind **every** property by variable **ID**. Section children = section-relative coords. Section via `/figma-create-section`.

## T3 — Mapping table (stock radix-nova → DS), per part

**Geometry stays numeric** (h-8/h-7, size-4, min-w-36); bind only colour/typo/spacing/radius. `dark:*` dropped everywhere.

### SelectTrigger
| stock | DS | why |
|---|---|---|
| `gap-1.5` (6) | `gap-sm` | §6 spacing by px |
| `rounded-lg` | `corner-lg` | field radius (= Input) |
| `data-[size=sm]:rounded-[min(--radius-md,10)]` | `data-[size=sm]:corner-md` | min() collapses to radius-md=6 |
| `border border-input` | `border border-input-border` | §6 color-rename |
| `bg-transparent` | **`bg-input-fill`** | **User decision** — Input parity (opaque field surface ink/25) |
| `py-2` (8) | `py-md` | under fixed h-8/h-7 only centring |
| `pr-2`/`pl-2.5` (8/10) | `px-md` (8/8) | symmetric = Input parity; pl-2.5(10)→md(8) snap (no 10 rung) |
| `text-sm` | `text-format-label` | form-control text (14/500, = Input value) |
| `data-placeholder:text-muted-foreground` | `data-placeholder:text-input-ink-placeholder` | placeholder role (= Input), NOT muted-ink |
| `focus-visible:border-ring` | (keep) | ring token name unchanged |
| `focus-visible:ring-3` / `aria-invalid:ring-3` | `ring-[3px]` | sibling convention (finding #31) |
| `focus-visible:ring-ring/50` | (keep) | |
| `aria-invalid:border-destructive` / `aria-invalid:ring-destructive/20` | (keep) | destructive = ⚠ placeholder, bound but not final |
| `disabled:cursor-not-allowed disabled:opacity-50` | (keep) | numeric |
| `data-[size=default]:h-8` / `data-[size=sm]:h-7` | (numeric) | control geometry |
| chevron `text-muted-foreground` `size-4` | `text-muted-ink` + `size-4` | icon currentColor role |
| `*:data-[slot=select-value]:…gap-1.5` | `gap-sm` | value-row gap |

### SelectContent
| stock | DS | why |
|---|---|---|
| `rounded-lg` | `corner-lg` | panel radius (= Command default) |
| `bg-popover` | `bg-dialog-fill` | popover→dialog consolidated (2026-06-18) |
| `text-popover-foreground` | `text-dialog-ink` | ditto |
| `shadow-md` | `shadow-elevation` | raised menu → depth carries meaning (= Command/Dialog) |
| `ring-1 ring-foreground/10` | `border border-border` | Command idiom: ring replaced by border (raised-surface depth) |
| `min-w-36`, `z-50`, `overflow-*`, animations | (keep) | sizing/plumbing; data-state animations are stock |

### SelectItem
| stock | DS | why |
|---|---|---|
| `gap-1.5` (6) | `gap-sm` | |
| `rounded-md` | `corner-md` | |
| `py-1` (4) | `py-xs` | |
| `pr-8` (32) | `pr-3xl` | check-indicator clearance (absolute right) |
| `pl-1.5` (6) | `pl-sm` | |
| `text-sm` | `text-format-label` | menu text (= trigger value) |
| `focus:bg-accent` | `focus:bg-accent-fill` | highlight = accent tint (= Command selection) |
| `focus:text-accent-foreground` | `focus:text-accent-ink` | |
| `data-disabled:opacity-50` + `pointer-events-none` | (keep) | |
| check span `absolute right-2` `size-4` | `right-md` + `size-4` | inset family §3; icon numeric |
| `not-data-[variant=destructive]:…` | **drop** | Nova SelectItem has NO `variant` prop → selector inert |

### SelectLabel
| stock | DS | why |
|---|---|---|
| `px-1.5` (6) / `py-1` (4) | `px-sm` / `py-xs` | |
| `text-xs` (12) | `text-format-label` | **no 12px sans** → role snap to 14 (findings #20/#28); hierarchy carried by colour |
| `text-muted-foreground` | `text-muted-ink` | quiet caption |

### SelectSeparator
| stock | DS | why |
|---|---|---|
| `-mx-1` (-4) / `my-1` (4) | `-mx-xs` / `my-xs` | |
| `h-px` | (numeric) | 1px line |
| `bg-border` | `bg-border` | name kept (only the value is new, as in the Separator port) |
| **Figma:** nest `.Separator` (horizontal, `3676:1018`) | | FieldSeparator idiom |

### SelectScrollUp/DownButton
| stock | DS |
|---|---|
| `bg-popover` | `bg-dialog-fill` |
| `py-1` (4) | `py-xs` |
| chevron `size-4` | (numeric, currentColor) |

### SelectGroup
| stock | DS |
|---|---|
| `p-1` (4) | `p-xs` |
| `scroll-my-1` | (numeric — no named scroll-margin family) |

## T2.5 — Example inventory (stories)

Source: `ui.shadcn.com/docs/components/select`. Structurally distinct, deduplicated:

| Example | kept/skip | Composition |
|---|---|---|
| Basic | kept (Default playground+play) | trigger + content + 1 group of items, placeholder |
| Groups | kept | SelectGroup + SelectLabel + SelectSeparator + items |
| Scrollable | kept | long list (timezones) → scroll buttons appear |
| Disabled | kept (States) | disabled item + disabled trigger |
| Sizes | kept (States) | sm + default trigger |
| Invalid / with Field | kept | `.Field` + `FieldLabel` + `FieldError` around the trigger (`aria-invalid`) — Field ✓ ported |
| "Align item with trigger" (position) | dedupe → Default control | position popper/item-aligned = prop, no structural story of its own |
| Form (react-hook-form) | **skip + log** | un-ported dep (react-hook-form) |
| RTL | **skip + log** | directionality, no DS structural concern |

## T6 — Code status (DONE)

- `select.tsx` re-clothed per T3 → `libs/ui/src/components/ui/select/` (folder + barrel `index.ts` + root-barrel re-export).
- Icons: lucide → `@remixicon/react` (RiArrowDownSLine/RiArrowUpSLine/RiCheckLine, verified present). `radix-ui` umbrella import KEPT (= Dialog convention; declared dep). Inert `not-data-[variant=destructive]` selector dropped (no `variant` prop in nova SelectItem).
- docgen: `SelectProps` (Omit+re-declare value/defaultValue/onValueChange/open/defaultOpen/onOpenChange/disabled/required/name) + `SelectTriggerProps` (`size` named-alias union + disabled). `/docgen-props` conformant.
- Stories: Default (playground + play: open→select Blueberry→assert value→blur) · Groups · Scrollable · Disabled · WithField (Field composition, invalid) · TriggerStates (size×state gallery, pseudo-focus). **Skip-log:** RTL (locale), Form/react-hook-form (un-ported dep).
- Spec: 6 jsdom tests (data-slot, combobox role, size default/sm, disabled, corner-lg + text-format-label survival). **No jsdom polyfill needed** — closed render only; the open-dropdown path runs in the Chromium storybook project.
- **GATE GREEN** (2026-06-19): `typecheck` ✓ · `test` ✓ (236 total: select.spec 6 + select.stories 6 incl. play + axe) · `lint` ✓ (0 errors; 46 pre-existing warnings, none in select/*).
- **Visual eyeball (shoot):** TriggerStates → input-fill + 3px focus ring-ring/50 + destructive invalid ring + sm<default height confirmed; WithField → real Field composition (label/desc/error + invalid ring). Open-dropdown visual = play-test render + token-parity with validated Command surface + Figma agent verify.

## T4+T5 — Figma build (DONE, background agent `figma-select-build`)

File `nQSNLASjuLvgTh3we8Dp4s`, page Components `3126:2`. **Section `Select` `4307:1997`**. `/figma-verify`
CLEAN across all 3 sets + composition + 4 examples (0 text-as-icon, 0 clip, 0 overlap); controls-live ALL PASS;
no orphan slot props. IDs complete in the catalog entry (`components-reference.md`).

- **Trigger set `4308:2029`** — `size [default, sm] × state [default, focus, disabled, invalid]` (8 members).
  value TEXT prop `{Value}` + chevron vector. Focus glow = `.Input` DROP_SHADOW VERBATIM (finding #30c);
  invalid glow synthesised (`.Input` invalid member `3176:311` carries `effects:[]` → nothing to copy — confirms #30c).
- **Item set `4313:2046`** — `state [default, focus, disabled] × selected [false, true]` (6 members). leadingIcon SLOT
  (default RiUserLine) + label TEXT + check vector (visible↔selected). focus = accent-fill + accent-ink.
- **Content composition `4314:1997`** — items SLOT + `showScrollUp`/`showScrollDown` bools; Command surface
  (dialog-fill + border + Elevation effect style + corner-lg).
- **Usage examples `4315:2106`** — Basic/Groups/Scrollable/Invalid (Invalid nests a real `.Field` instance `3713:1017`).
- Icons = Remix vectors via `createNodeFromSvg` (RiArrowDownSLine/-UpSLine/RiCheckLine/RiUserLine, 24-viewBox path
  pulled from the React export — the MCP does not list the `*-s-line` chevrons).

## Code↔Figma divergences (for a future `/component-sync` — do NOT read as a token delta)

- **D1 — SelectItem check positioning:** Figma = trailing layout vector at `pr-md`(8)/`right-2`; code = `absolute right-md`
  + `pr-3xl`(32) clearance (shadcn idiom). Visually equivalent, structurally different. **No code edit** — the code is
  faithful to the shadcn idiom.
- **SelectLabel** = Figma inline text in the content slot (no set of its own); code = `SelectLabel` component.
- **`size` axis** maps to the real code prop `SelectTrigger.size` (NO fork).
- **`selected` boolean** (Figma) = Radix `data-state=checked` (no code prop; pure styling).
- **Docs layout (option 2, user):** `meta.component=Select` + `subcomponents:{SelectTrigger}` → root props in the
  main ArgsTable, `size` in the SelectTrigger sub-table. The playground keeps the `size` control (story-local).

## Fix round 2026-06-20 (user review)

Code (main, commit `6867878`) + Figma (background agent `figma-select-fix`) in parallel. Findings → handoff #59–61 (+#57)
+ 4 sharpened (#46/#54/#55/#60). Gate green (236), figma-verify CLEAN across all 5 touched nodes.

**Code (main):**
- **Ring focus-gated** — `aria-invalid:ring-[3px]` removed → invalid-resting = border only, ring only from `focus-visible:`
  (= Input/Checkbox/Switch/Radio). Visually confirmed (TriggerStates: Invalid = border, Invalid+focus = border+ring).
- **subcomponents** = all exported parts (full composite API in the docs, one sub-ArgsTable per part).
- **Invalid story** (was `WithField`) — sibling pattern. **docgen** `SelectContentProps` (position/align).

**Figma (agent, IDs):**
- **FIX1** Trigger `focus-invalid` member per size → set `4308:2029` now 10 members (default `4326:2363`, sm `4326:2367`);
  invalid member ring stripped (border-only), focus-invalid = border + destructive/20 ring (mirror Input focus-invalid
  `3692:1249`). Built **code-faithful** (one ring, no second glow) — deliberate deviation from the brief's wording "both rings".
  Section widened to w=1560 (5-state grid overflowed → finding #54 width).
- **FIX2** Item `showIcon#4326:0` (BOOLEAN, def false; mirror CommandItem `showIcon#3559:5`); iconWrap FRAME gates the
  leadingIcon SLOT (finding #8 — never `visible` directly on the SLOT). Wrappers `4326:2317/2318/2319/2352/2353/2354`.
- **FIX3** `SelectGroup` own set `4326:2371` (label `4326:8` + items SLOT `4326:7`, p-xs).
- **FIX4** Top-level `Select` composition `4326:2477` (anchored open state: trigger `4326:2478` + ABSOLUTE content
  `4326:2482`, y=36 at trigger bottom-left; finding #59).
- **FIX5** Example headlines to the sibling canon (Regular 13 muted-ink, was ExtraBold 18 black); Groups rebuilt from 2
  SelectGroup instances + `.Separator` (content `4326:2749`); new Open block `4327:2225`. Group `4315:2106` children:
  [Open, Basic, Groups, Scrollable, Invalid]. Screenshot eyeball confirmed (headlines, focus-invalid distinction, anchor).

## Open items

- `destructive` (invalid ring/border) = ⚠ placeholder token — bound, not final (shared with Input/Field/Checkbox…).
- **Code↔Figma axis gap:** Figma now has a `focus-invalid` trigger member + `showIcon` item bool; the code expresses both
  implicitly (focus-gated ring via CSS; `showIcon` = simply omit/set the icon, no prop). No `/component-sync`
  needed — pure Figma modelling. SelectGroup set = Figma counterpart of the existing `SelectGroup` code component.

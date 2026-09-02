# Component Port — Command (cmdk) · 2026-06-10

Composite re-port via `/shadcn-component-port` + `references/composites.md`. Command was `removed`
(2026-06-09) awaiting the composite-skill rework; this is the re-port. Skill-feedback ON
(`skill-feedback.md`).

Baseline radix-nova. Source: `https://ui.shadcn.com/r/styles/radix-nova/command.json`
(`registryDependencies: [dialog, input-group]`, `dependencies: [cmdk ^1.1.1]`).

## T2 — Anatomy + Dependency-Audit

**Parts (all `data-slot`, no CVA — variation is cmdk data-attrs = state, not props):**

| Part | data-slot | role |
|---|---|---|
| `Command` (root) | `command` | palette surface (flex-col, overflow-hidden, rounded-xl, bg-popover) |
| `CommandInput` | wrapper `command-input-wrapper` + `command-input` | InputGroup + InputGroupAddon(search icon) + cmdk Input |
| `CommandList` | `command-list` | scroll container (max-h-72, no-scrollbar) |
| `CommandEmpty` | `command-empty` | empty-state row (centered) |
| `CommandGroup` | `command-group` | group; heading via `[cmdk-group-heading]` (px-2 py-1.5 text-xs medium muted) |
| `CommandSeparator` | `command-separator` | 1px divider (`-mx-1 h-px bg-border`) |
| `CommandItem` | `command-item` | selectable row; auto-appends a check icon (hidden unless data-checked & no shortcut) |
| `CommandShortcut` | `command-shortcut` | right-aligned shortcut hint (ml-auto, muted) |
| ~~`CommandDialog`~~ | — | **DEFERRED** (needs Dialog port, catalog status pending) |

**No CVA.** Item state (`data-selected`, `data-disabled`, `data-checked`) is driven by cmdk via
keyboard/pointer, surfaced as `data-*` attributes → in Figma these become a **state axis** on the item.

**Dependency-audit (`ui:add command` wrote 6 files flat — full transitive tree):**

| file landed flat | verdict | action |
|---|---|---|
| `button.tsx` | shadows DS `button/` folder | **deleted** (flat beats folder in resolution) |
| `input.tsx` | shadows DS `input/` | **deleted** |
| `textarea.tsx` | shadows DS `textarea/` | **deleted** |
| `input-group.tsx` | shadows DS `input-group/` | **deleted** |
| `dialog.tsx` | **un-ported** (only CommandDialog uses it) | **deleted** + CommandDialog deferred |
| `command.tsx` | the target | **moved** → `command/command.tsx` + barrel `index.ts` |

- IconPlaceholder → `ui:add` resolved to `lucide-react` (`SearchIcon`,`CheckIcon`); **not installed** →
  swapped to `@remixicon/react` `RiSearchLine`/`RiCheckLine` (dep-resolution fix, T2). See skill-feedback #1.
- CommandDialog removed (function + export) — consumes un-ported Dialog. See skill-feedback #2.
- After cleanup: `nx typecheck @agentport/ui` **green**. cmdk polyfills (ResizeObserver/scrollIntoView)
  already in `src/test-setup.ts` (named for Command). `no-scrollbar` @utility present in globals.css.

## T2.5 — Example-inventory + Stories

Docs give 2 examples; deduped to 1 portable usage + 1 skip.

| doc example | verdict | story |
|---|---|---|
| `command-demo` (inline palette: input, 2 groups, icons, disabled item, separator, shortcuts) | **kept** (canonical) | `Default` |
| `command-dialog` (same palette wrapped in CommandDialog, ⌘J) | **skipped** — needs un-ported Dialog (CommandDialog deferred) | — |
| (added for state coverage) no-results | derived | `Empty` (CommandEmpty visible via frozen non-matching search) |

- Stories: `UI/Command` — `Default`, `Empty`. Visual showcases (controls disabled), mirror InputGroup conventions. Icons = `@remixicon/react` (Calendar/Emotion/Calculator/User/BankCard/Settings3).
- Spec: render+headings, disabled item `data-disabled`, **filtering** (fireEvent.change → only match remains), **empty** state. `nx test @agentport/ui` → 31/31 green (cmdk filters in jsdom via the existing polyfills). No `@testing-library/user-event` in repo → drove search via `fireEvent.change`.
- Preview: http://localhost:6006/?path=/story/ui-command--default · http://localhost:6006/?path=/story/ui-command--empty

## T2.6/2.7 — Exposure-Surface + Composition-Plan (user-decided)

User answers: item states **+ checked** (4-state axis) · leading icon **Instance-Swap + on/off Boolean** ·
search field **opaque DS field** (nested InputGroup default look).

**Exposure-model per part:**

| sub-component | Figma model | why (§1) |
|---|---|---|
| `.Command/Item` | variant axis `state:[default,selected,disabled,checked]` · Boolean `icon` + Instance-Swap (leading) · Boolean `shortcut` + Text (trailing) · Text label | item states have no pseudo-class → state axis; one leading icon → swap; shortcut = short string → bool+text; checked shows trailing check vector |
| `.Command/Group` | Text heading + **Slot** items (default 2 items) | heading editable string → Text; items open/variably-many → Slot |
| `.Command/Input` | nests a real **`.InputGroup`** instance (opaque default) + search addon; placeholder Text | code composes InputGroup → reuse rule = nest instance, never re-clothe |
| `.Command/Separator` | 1px line bound to `border` | fixed element |
| `.Command/Empty` | centered Text (muted) | editable string → Text |
| `.Command` (composition) | palette surface + `.Command/Input` instance + list **Slot** | open region → Slot; no whole-level variant (CommandDialog deferred) |
| reproduced example | one `.Command` instance = the `Default` story, built from controls only | §0 Done-Test |

## T3 — Token mapping (stock nova → DS)

| part | stock | DS | why |
|---|---|---|---|
| **Command** (root) | `rounded-xl! bg-popover p-1 text-popover-foreground` | `rounded-xl bg-overlay p-xs text-overlay-foreground` | overlay.use **names Command** ("Popover/Command/Menu/Dropdown"); popover is only a back-compat alias. p-1(4)→p-xs. |
| **CommandInput** wrapper | `p-1 pb-0` | `p-xs pb-0` | px value |
| InputGroup override | `h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! …pl-2!` | *(dropped — opaque DS field)* | user chose opaque; every override was either nova-softening (drop) or already the InputGroup default (h-8/rounded-lg/pl-md). |
| cmdk input | `w-full text-sm …` | `w-full bg-transparent text-input placeholder:text-input-placeholder …` | **text-input** = the DS mono-18px "Command-/Eingabe-Text" format — Command is its home (the field-text=text-label rule is for *normal* fields, which this is not). |
| **CommandList** | `no-scrollbar max-h-72 scroll-py-1 overflow-… outline-none` | unchanged | all structural/geometry; `no-scrollbar` @utility exists; scroll-py-1 numeric kept. |
| **CommandEmpty** | `py-6 text-center text-sm` | `py-2xl text-center text-body text-muted-foreground` | py-6(24)→py-2xl; empty = secondary msg → muted-foreground. |
| **CommandGroup** | `p-1 text-foreground` + heading `px-2 py-1.5 text-xs font-medium text-muted-foreground` | `p-xs text-foreground` + heading `px-md py-sm text-eyebrow text-muted-foreground` | **text-eyebrow** = DS "Uppercase-Mikro-Labels" — group headings ARE section micro-labels (mono-uppercase, on-DS-brand). px-2→px-md, py-1.5→py-sm. |
| **CommandSeparator** | `-mx-1 h-px bg-border` | `-mx-xs h-px bg-border` | -mx-1(4)→-mx-xs; border token = standard divider. |
| **CommandItem** | `gap-2 rounded-sm px-2 py-1.5 text-sm … data-selected:bg-muted data-selected:text-foreground` | `gap-md rounded-sm px-md py-sm text-body … data-selected:bg-accent data-selected:text-accent-foreground` (+ icon `data-selected:*:[svg]:text-accent-foreground`) | **accent = DS selection tint** (accent.use="Selektions-/Aktiv-Tint", explicitly deviates from stock neutral grey); accent-foreground = readable cyan-on-tint. `in-data-[slot=dialog-content]:` dropped (dialog deferred). |
| **CommandShortcut** | `ml-auto text-xs tracking-widest text-muted-foreground group-data-selected:text-foreground` | `ml-auto text-kbd text-muted-foreground group-data-selected:text-accent-foreground` | **text-kbd** = DS "Tastatur-Tasten-Text" — shortcut hints are keyboard text; tracking-* is dead (reset) → drop. selected→accent-foreground to match item. |

Open T3 flags: ⚠ none placeholder-bound (accent/overlay/muted/border/eyebrow/kbd/input all designed). Verify in T6 that `text-eyebrow` applies uppercase (else add `uppercase`); confirm 18px `text-input` fits the h-8 InputGroup (bump if it clips).

## T4 — Figma build (file nQSNLASjuLvgTh3we8Dp4s, page "Components" 3126:2)

Section **Command** `3555:679` (right of Input Group). 3-layer composite build:

| node | id | notes |
|---|---|---|
| `.Command/Item` SET | `3559:2` | axis `state`[default `3558:2`, selected `3558:7`, disabled `3558:12`, checked `3558:17`]; props: `icon#3559:0` (INSTANCE_SWAP→Calendar), `showIcon#3559:5` (bool), `label#3559:10` (text), `shortcut#3559:15` (bool), `shortcutText#3559:20` (text). selected=bg-accent+accent-fg icon/label; disabled=opacity .5; checked=trailing check vector |
| `.Command/Input` | `3561:2` | wrapper pt-xs pb-0; **nests real `.InputGroup` instance** `3561:3` (reuse rule) — bypassed Addon, filled content slot with search vector + text-input placeholder; added container pad spaceMd + slot gap spaceSm |
| `.Command/Separator` | `3564:2` | 1px line, fill `border` |
| `.Command/Empty` | `3564:3` | centered text-body muted, py-2xl; `message#` text prop |
| `.Command/Group` | `3565:2` | `heading#3565:1` (text, eyebrow UPPER) + `items#3565:0` SLOT (2 default items) |
| `.Command` composition | `3566:2` | bg-overlay, rounded-xl, border, **shadow-elevation** (overlay depth), p-xs, clip; `.Command/Input` instance + `list#3566:0` SLOT = full command-demo (Suggestions[Cal sel/Emoji/Calc dis] · sep · Settings[Profile⌘P/Billing⌘B/Settings⌘S]) |
| Example instance | `3573:2` | standing Done-Test artifact (renders the demo from `.Command` controls) |
| icon comps | Calendar `3557:4` Emotion `3557:7` Calculator `3557:10` User `3557:13` Card `3557:16` Settings `3557:19` | 16px foreground-bound vectors, INSTANCE_SWAP targets |

**Slot lesson (→ skill-feedback #3):** slot DEFAULT content surfaces as virtual read-only children in
instances (append coexists, can't remove) → built slots EMPTY at component level, composed the demo via
real component-level children. `setProperties` on a group instance *materialised* its slot defaults as
real overrides (had to delete 2 stale items from g2).

## T5 — Verify
- **Controls live** ✓ — every control exercised building the demo (state, icon-swap ×6, label, shortcut bool+text, group heading, list+items slots, input). All took effect (screenshots).
- **Clean** ✓ — `/figma-verify`: 0 FLAGs (all icons vectors; `⌘P/B/S` not standalone → not text-as-icon). 1 HINT: `.Command/Input` `pt-xs pb-0` asymmetry = **intentional** (nova `p-1 pb-0`, field flush above list).
- **Reproduces usages** ✓ — `Default` story = `.Command` demo + example `3573:2` (from controls); `Empty` story = `.Command/Empty`.

## T6 — Code port

`command/command.tsx` rewritten per T3 (DS utilities). `'use client'` added; icons `@remixicon/react`.
Stories drop the manual `border` (root now owns `border shadow-elevation`). Spec gains a typo-survival
test (`text-input` on field, `text-body` on item — T1 twMerge guard). Re-exported in `index.ts` (T2).
- **Gate green:** `nx typecheck` ✓ · `nx test` **32/32** ✓ (incl. typo-survival; cmdk filter/empty in jsdom) · `nx lint` 0 errors (1 pre-existing warning in `.storybook/main.ts`, unrelated).
- DS typo classes confirmed in rendered markup (the survival test asserts them).
- Preview: http://localhost:6006/?path=/story/ui-command--default · http://localhost:6006/?path=/story/ui-command--empty

## T7 — done
- Catalog (`components-reference.md`): Command moved out of Removed → full entry (status nova-aligned, code, all Figma ids/axes/slots, deps, deviations); Dialog note + status_note updated.
- Skill-feedback: 3 findings in `skill-feedback.md` (IconPlaceholder→lucide swap · un-ported dep in a sub-part → defer the sub-part · slot-default content is virtual/additive in instances + setProperties materialises defaults). All open for user review.

## Open items
- **CommandDialog deferred** → re-add after a Dialog port (catalog Dialog: pending): re-add the function + export + a `CommandDialog` story; the dialog example is skipped until then.
- `.Command/Group` ships with 2 default items for library presentation (real children; shielded from the command's own g1/g2 which carry overrides).
- No placeholder (⚠) tokens used. Selection deliberately uses DS accent (cyan), not stock neutral grey.
- Not committed (on `master`; per CLAUDE.md a feature branch + ff-merge is the workflow — left for the user to direct).

## Open items
- CommandDialog deferred → re-add after Dialog port (catalog Dialog: pending).

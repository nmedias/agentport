# Component Port — Checkbox (code side)

Date: 2026-06-12 · Skill: `/shadcn-component-port` · Branch: `feat/form-toggles-port`
Scope: **code side only** (T2 → T2.5 → T3 → T6 → T7). T4/T5 (Figma) + shared-file
integration (root barrel, catalog) handled by the orchestrator. T1 pre-verified
(cn() extension complete).

## Anatomy (T2)

Source landed flat at `libs/ui/src/components/ui/checkbox.tsx`, moved into the
component folder. Single Radix Root with one fixed Indicator child — **not** a
multi-part composite (the Indicator is an internal, always-present slot, not a
separately-exposed `data-slot` part the consumer composes).

| Part | data-slot | Notes |
|---|---|---|
| Root | `checkbox` | `radix-ui` unified pkg — `CheckboxPrimitive.Root`. Renders `<button role="checkbox">`. |
| Indicator | `checkbox-indicator` | Holds the check glyph; only mounts when checked. |

- **Library:** `import { Checkbox as CheckboxPrimitive } from 'radix-ui'` (unified package).
- **No CVA** → Figma axis is **state**, not variant×size.
- **Icon:** lucide `CheckIcon` → `@remixicon/react` `RiCheckLine` (matches the Command port's check glyph).

### State axis (settled)

Distinct states the class string actually expresses:

| State | Driver | What changes |
|---|---|---|
| `default` (unchecked) | base | `border-input`, transparent fill, no glyph |
| `checked` | `data-checked:*` | `bg-primary` + `border-primary` + `text-primary-foreground`, glyph shows |
| `focus` | `focus-visible:*` | `border-ring` + `ring-ring/50 ring-[3px]` (live pseudo-state, not a static prop) |
| `disabled` | `disabled:*` | `opacity-50` + `cursor-not-allowed` (composes onto default or checked) |
| `invalid` | `aria-invalid:*` | `border-destructive` + `ring-destructive/20 ring-[3px]` |
| `checked-invalid` | `aria-invalid:aria-checked:border-primary` | checked fill kept; border returns to **primary** (not destructive) — the destructive ring still carries the error, the primary edge keeps the "selected" read |

`focus` is a live pseudo-state (no static prop). `disabled` is a modifier that
composes onto default **and** checked → in Figma it is cleanest as a boolean that
overlays, but as an explicit `state` axis member the minimum faithful set is
**default · checked · disabled · invalid · checked-invalid** (focus = interaction
overlay). Decided: model those 5 as the primary `state` axis; `focus` as the
interaction-state pattern (overlay), since it can co-occur with any.

## T3 — Mapping table (stock → DS)

Authority: `tokens-reference.md` §6 (translation) + §1/§2/§4 (token semantics).
`use`/`avoid` recorded for every non-obvious row.

| Stock class | DS utility/token | Why (use/avoid) |
|---|---|---|
| `rounded-[4px]` | `corner-sm` | §2: DS 4px radius for "kleine Controls/Chips/Marker" — exactly a checkbox box. ALL `rounded-*` dead under theme reset; `corner-*` is the only radius vocab. Drop the arbitrary `[4px]`. |
| `border border-input` | `border border-input` | §1 `input`: "Form-Control-Border; Fokus → ring". Same name, role fits 1:1 — the control edge that hands off to the ring on focus. |
| `data-checked:bg-primary` | `data-checked:bg-primary` | §1 `primary`: surface use "als Fläche … wenn die Fläche ‚selektiert/primär/hier handeln' bedeutet". Checked = selected → primary fill is the documented surface role. |
| `data-checked:border-primary` | `data-checked:border-primary` | Edge matches the fill so the box reads as one solid primary mark. |
| `data-checked:text-primary-foreground` | `data-checked:text-primary-foreground` | §1 `primary-foreground`: "Text/Icon auf primary-Fläche" — the check glyph sits on the primary fill, so icon-on-primary, NOT `foreground` (that's text-on-base). |
| `focus-visible:border-ring` | `focus-visible:border-ring` | §1 `ring`: "Fokus-Indikator". Same role. |
| `focus-visible:ring-ring/50 ring-3` | `focus-visible:ring-ring/50 ring-[3px]` | `ring-3`→`ring-[3px]` to match the **Input/InputGroup sibling** focus convention (they use `ring-[3px]`); keeps the field-family ring uniform. `/50` opacity-modifier kept (§6 keep_valid). |
| `aria-invalid:border-destructive` | same | §1 `destructive` = ⚠ **PLACEHOLDER** (stock hex `#e7000b`, `status: placeholder`, `use: tbd`). Bound but NOT finalized — same treatment as Input/Badge. |
| `aria-invalid:ring-destructive/20 ring-3` | `aria-invalid:ring-destructive/20 ring-[3px]` | ditto placeholder; `ring-3`→`ring-[3px]` for sibling-uniform ring width. |
| `aria-invalid:aria-checked:border-primary` | kept verbatim | checked-invalid keeps the primary edge — see state table. |
| `size-4` | `size-4` | §6 control_geometry: icon/box geometry stays **numeric**, not a spacing token. |
| `[&>svg]:size-3.5` | `[&>svg]:size-3.5` | icon geometry → numeric. |
| `after:-inset-x-3 after:-inset-y-2` | kept verbatim | invisible hit-target geometry → numeric (not a spacing token). |
| `transition-colors` / `transition-none` | kept | behaviour, no DS surface. |
| `peer relative flex … place-content-center` | kept | layout primitives, no token. |
| `group-has-disabled/field:opacity-50` | kept | Field integration (per brief — keep). |
| `disabled:opacity-50 disabled:cursor-not-allowed` | kept | behaviour/opacity, no DS surface. |
| ALL `dark:*` (`dark:bg-input/30`, `dark:aria-invalid:*`, `dark:data-checked:bg-primary`) | **dropped** | DS is light-only (§ rules: "Werte = Light-Mode (einziger Mode)"). |
| lucide `CheckIcon` | `@remixicon/react` `RiCheckLine` | §T6: icons = `@remixicon/react`; `RiCheckLine` matches the Command port. |

### ⚠ Placeholder tokens (NOT finalized)
- `destructive` / `destructive/20` (invalid border + ring) — stock hex, `status: placeholder`, `use: tbd`. Bound so the invalid state is wired, but the colour is undesigned. Flag for the design strand, same as Input/Badge.

## Stories (T2.5)

Source: `ui.shadcn.com/docs/components/checkbox` → `checkbox-demo` (the single demo
bundles 4 structurally distinct usages). Mirror of `input.stories.tsx` CSF pattern.
**Label is ported** → used directly. No Field-form example present in the demo → no skip.

| Story | Shows | Origin |
|---|---|---|
| `Default` | bare box, args drive checked/disabled | overview (args-driven) |
| `WithLabel` | checkbox + `Label` via htmlFor, `items-center gap-lg` | demo block 1 |
| `WithDescription` | `defaultChecked` + label + muted `<p>` description, `items-start` | demo block 2 |
| `Disabled` | disabled box + label | demo block 3 |
| `CardSelect` | bordered `Label` card as hit target, `has-data-checked:` tints the card | demo block 4 (DS-tokenized) |
| `AllStates` | gallery: default / checked / disabled / invalid / checked-invalid | added overview (exercises the full state axis, mirrors Input's `AllStates`) |

### Example inventory (auditable)
- **block 1 (default + label)** → kept-distinct (`WithLabel`).
- **block 2 (checked + label + description)** → kept-distinct (`WithDescription`).
- **block 3 (disabled + label)** → kept-distinct (`Disabled`).
- **block 4 (card-style label with custom blue override)** → kept-distinct as `CardSelect`, **DS-tokenized**: the stock `data-[state=checked]:bg-blue-600 / has-[[aria-checked=true]]:bg-blue-50` overrides are a per-instance customization (not a DS pattern) → dropped. Replaced with the component's own primary fill + `has-data-checked:border-primary has-data-checked:bg-accent` on the card (consistent with `field.tsx`'s `has-data-checked:border-primary`). `text-sm leading-none font-medium` → `text-format-body-strong`; `text-sm text-muted-foreground` → `text-format-body text-muted-foreground` (§4 dead-typo translation).
- **AllStates** → added (not in demo); covers the `invalid` + `checked-invalid` states the demo never shows, so the Figma set's full state axis has a story to verify against (T5).
- **Skips:** none — no example needed an un-ported dep.

Spacing translations in stories (§3, by px value): `gap-3`(12)→`gap-lg`, `gap-2`(8)→`gap-md`, `gap-1.5`(6)→`gap-sm`, `p-3`(12)→`p-lg`, `rounded-lg`→`corner-lg`.

## Gate-readiness (T6) — NOT run here

Per orchestrator constraint, no nx gate run (concurrent agents would collide).
Self-verified by sibling-pattern match:
- **twMerge survival:** `corner-sm` is asserted in the spec; `cn()` extension already knows the `corner-*` groups (verified: `field.tsx` uses `corner-sm`/`corner-lg`, `switch.tsx` uses `corner-full`). No `text-format-*` on the Root itself, so the typo-drop trap doesn't apply to the component (it does to the stories' `text-format-body*`, which are real utilities — verified in `tw-utilities.css` lines 87/94).
- **Headless lib (Radix) jsdom polyfill:** `libs/ui/src/test-setup.ts` already polyfills `ResizeObserver` + `scrollIntoView` (added for cmdk/Command). Radix Checkbox does not need additional polyfills — renders in jsdom like Switch (sibling spec renders fine).
- **Types:** `React.ComponentProps<typeof CheckboxPrimitive.Root>` — identical shape to the landed source; `RiCheckLine` import matches Command's usage.
- **preview-stories:** NOT run (storybook MCP / :6006 — would need the dev server; deferred to orchestrator's single gate pass so concurrent runs don't collide). URLs to be surfaced when the gate runs.

Open for orchestrator: run `npx nx test|typecheck|lint @agentport/ui` once; surface `preview-stories` URLs; add the root-barrel re-export of `./components/ui/checkbox`; add the catalog entry.

## Proposed Figma build spec (for the Figma builder)

- **Component:** `.Checkbox` set on the Components page, in a Section.
- **Axis:** single `state` axis (no variant×size). Members (full matrix):
  `default · checked · focus · disabled · invalid · checked-invalid`.
  (Minimum = 5 as above; add `focus` as a 6th member or as the interaction-state
  overlay pattern per `figma-build.md §interaction-state`.)
- **Geometry (all numeric):** box `16×16` (`size-4`), radius `corner-sm` (4px),
  border `1px`, glyph `14×14` (`size-3.5`), centered.
- **Per-member bindings:**

  | Member | Fill | Border | Glyph | Ring |
  |---|---|---|---|---|
  | default | none/transparent | `input` | hidden | — |
  | checked | `primary` | `primary` | shown, `primary-foreground` | — |
  | focus | none | `ring` | hidden | `ring` @ 50%, 3px |
  | disabled | none | `input` | hidden | — (+ 50% layer opacity) |
  | invalid | none | `destructive` ⚠ | hidden | `destructive` @ 20%, 3px |
  | checked-invalid | `primary` | `primary` | shown, `primary-foreground` | `destructive` @ 20%, 3px |

  All colour props **bound by variable ID** (`setBoundVariableForPaint` → reassign
  the returned paint). `destructive` is ⚠ placeholder — bind it but it is undesigned.
- **Icon slot:** the check glyph = the Indicator. Use a real vector check (Remix
  `RiCheckLine` equivalent) as an instance-swap-capable slot, `fills=[]` so it
  inherits `text-primary-foreground` via the bound fill; default = visible check.
- **Reuse:** no embedded DS sub-component (the glyph is a raw vector icon, not a
  ported component) → no nested instance needed.

## Files written (this run)

- `libs/ui/src/components/ui/checkbox/checkbox.tsx` (moved from flat + translated)
- `libs/ui/src/components/ui/checkbox/index.ts` (barrel)
- `libs/ui/src/components/ui/checkbox/checkbox.stories.tsx`
- `libs/ui/src/components/ui/checkbox/checkbox.spec.tsx`
- `agent-runs/component-port/2026-06-12-checkbox/notes.md` (this file)
- `agent-runs/component-port/2026-06-12-checkbox/skill-feedback.md`

NOT touched (orchestrator owns): `libs/ui/src/index.ts`, `components-reference.md`,
any Figma, any git, any nx gate.

# Component Port — RadioGroup (code side)

Date: 2026-06-12 · Skill: `/shadcn-component-port` · Branch: `feat/form-toggles-port`
Scope: **code side only** (T2 → T2.5 → T3 → T6 → T7). T4/T5 (Figma) + shared-file
integration (root barrel, catalog) handled by the orchestrator. T1 pre-verified
(cn() extension complete).

Exports: `RadioGroup` + `RadioGroupItem`. Sibling of the concurrently-ported
Checkbox + Switch (same `feat/form-toggles-port` batch, same form-toggle state
language). Closely mirrors Checkbox — same Radix unified pkg, same state axis —
but `corner-full` + an inner dot instead of a check glyph.

## Anatomy (T2)

Source landed flat at `libs/ui/src/components/ui/radio-group.tsx`, moved into the
component folder. Two parts, **not** a multi-part composite (the Indicator is an
internal always-present slot, not a separately-exposed `data-slot` the consumer
composes):

| Part | data-slot | Role |
|---|---|---|
| `RadioGroup` | `radio-group` | **Pure layout container** — `RadioGroupPrimitive.Root`, `grid w-full gap-2`. No state, no DS surface. |
| `RadioGroupItem` | `radio-group-item` | **The interactive control** — `RadioGroupPrimitive.Item`, renders `<button role="radio">`. Carries the whole state axis. |
| · Indicator | `radio-group-indicator` | `flex size-4 items-center justify-center`; only mounts when checked. |
| · inner dot | (none) | `<span>` — `size-2 corner-full bg-primary-foreground`, absolute-centred inside the indicator. |

- **Library:** `import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'` (unified package).
- **No CVA** → the item's Figma axis is **state**, not variant×size. The group is pure layout (no axis).
- **No icon** — the indicator's filled glyph is a plain `<span>` dot (`bg-primary-foreground`),
  not a vector. (Differs from Checkbox/Switch, which use a remix/check glyph.)

### Item state axis (settled)

Distinct states the item's class string actually expresses:

| State | Driver | What changes |
|---|---|---|
| `default` (unchecked) | base | `border-input`, transparent fill, no dot |
| `checked` | `data-checked:` (radix `data-state=checked`) | `border-primary` + `bg-primary` + `text-primary-foreground`; dot mounts |
| `focus` | `focus-visible:` | `border-ring` + `ring-ring/50 ring-[3px]` (live pseudo-state, not a static prop) |
| `disabled` | `disabled:` | `cursor-not-allowed` + `opacity-50` |
| `invalid` | `aria-invalid:` | `border-destructive` + `ring-destructive/20 ring-[3px]` (⚠ placeholder token) |
| `checked-invalid` | `aria-invalid:aria-checked:` | **distinct** — `border-primary` overrides the destructive border (selection wins; the ring still carries the error tint). Worth its own Figma member. |

The `after:-inset-x-3 after:-inset-y-2` pseudo-element is the invisible hit-target
expansion (kept numeric) — not a state.

## T3 — Translation mapping (stock → DS)

Stock item class (dark: variants stripped):
`group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground`

| stock | DS | why |
|---|---|---|
| `gap-2` (group, 8px) | `gap-md` | spacing by px-value (§3/§6): 8→md. `grid w-full` stays structural. |
| `rounded-full` (ring) | `corner-full` | DS radius vocabulary = `corner-*`; all `rounded-*` are dead under the theme reset (§2/§6). |
| `rounded-full` (inner dot) | `corner-full` | same — both circle radii. |
| `border border-input` | `border border-input` | the form-control border token (`use`: "Form-Control-Border; Fokus → ring"). Same role as Input/Checkbox. |
| `data-checked:bg-primary` | `data-checked:bg-primary` | `primary` `use`: "Brand accent for selection … As a surface … when the surface means selected" — a checked radio fill = exactly that. |
| `data-checked:border-primary` | `data-checked:border-primary` | selection border = primary (pairs with the fill). |
| `data-checked:text-primary-foreground` | `data-checked:text-primary-foreground` | `primary-foreground` `use`: "Text/icon on a primary surface" — sets the on-primary colour the dot inherits. |
| inner dot `bg-primary-foreground` | `bg-primary-foreground` | the dot must read on the filled (primary) circle → the on-primary token, not `background`/`card`. Chosen by role over same-value `#ffffff` lookalikes (background/overlay/primary-foreground all = white; only primary-foreground means "mark on primary"). |
| `focus-visible:border-ring` | `focus-visible:border-ring` | `ring` `use`: "Fokus-Indikator". |
| `focus-visible:ring-ring/50` | `focus-visible:ring-ring/50` | DS focus-ring convention (50% ring), mirrors Input. |
| `focus-visible:ring-3` | `focus-visible:ring-[3px]` | `ring-3` ≈ 3px; match Input's explicit `ring-[3px]` for consistency across the form family. |
| `aria-invalid:border-destructive` | same | ⚠ `destructive` is a **placeholder** token (stock hex `#e7000b`, `status: placeholder`, `use: tbd`) — bound but **not finalized**. Mirrors Input/Textarea/Checkbox. |
| `aria-invalid:ring-destructive/20` | same | ⚠ same placeholder; invalid focus-ring tint. |
| `aria-invalid:ring-3` | `aria-invalid:ring-[3px]` | `ring-3` ≈ 3px, consistent with focus. |
| `aria-invalid:aria-checked:border-primary` | same | checked-invalid override (selection border wins over destructive). |
| `size-4` / `size-2` (dot) / `aspect-square` | kept numeric | control/icon geometry ≠ spacing token (§6 control_geometry). |
| `after:-inset-x-3` / `after:-inset-y-2` | kept numeric | hit-target geometry (negative insets), not a spacing token. |
| `relative` / `absolute` / `-translate-*` / `top-1/2` / `left-1/2` / `flex` / `items-center` / `justify-center` / `shrink-0` / `outline-none` / `peer` / `group/radio-group-item` | kept | structural / positioning / behaviour — no DS surface. |
| all `dark:*` variants | dropped | single light mode (no dark mode yet). |

Note: the item has **no DS typography** — it's a pure graphic control (no text), so
there is no `text-format-*` class. The twMerge-survival guard for this component
is therefore on `corner-full` (the DS radius class), not a typo class.

## T2.5 — Example inventory (source: ui.shadcn.com/docs/components/radio-group + registry demos)

| Doc/registry example | Disposition | Reason |
|---|---|---|
| `radio-group-demo` (group + labels, one default-selected) | **kept** → `Default` story | the canonical group usage; Label is ported (`../label`), so reproduced verbatim (gap-3 → gap-lg). |
| disabled (docs page) | **kept** → `Disabled` story | group-level `disabled` — distinct interactive state. |
| with-description (docs "notifications"-style settings rows) | **kept** → `WithDescription` story | label + secondary description per option; common settings pattern. Uses ported Label + `text-format-body text-muted-foreground`. |
| state gallery | **added** → `AllStates` story | mirrors Input's gallery; exercises the full item state axis (default/checked/disabled/invalid/checked-invalid) — the set T5 verifies the Figma item against. Focus is live, shown by note (per Input convention). |
| **form example** (react-hook-form + `Form*` components) | **SKIPPED + LOGGED** | depends on the `form` component, **not ported** (no `libs/ui/src/components/ui/form/`). Per T2.5 skip-rule: don't stub, don't co-port. Missing dep: `Form`, `FormField`, `FormItem`, `FormControl`, `FormMessage`. |
| `dropdown-menu-radio-group` (registry demo) | **skipped** | a different component (`DropdownMenuRadioGroup`), not this `RadioGroup`; out of scope. |

## Code

`libs/ui/src/components/ui/radio-group/` — `radio-group.tsx` + `index.ts` (barrel
`export * from './radio-group'`) + `radio-group.stories.tsx` + `radio-group.spec.tsx`.

- **No new deps** — `radix-ui` unified pkg already present (^1.5.0); Label already ported.
- **No jsdom polyfill needed** — radix RadioGroup doesn't touch ResizeObserver/scrollIntoView
  on mount (the existing `test-setup.ts` polyfills suffice; not extended).
- **Spec** (`radio-group.spec.tsx`, 6 cases): renders one radio per item · default selection via
  `aria-checked` · click moves selection · **`corner-full` survives twMerge** (T1 guard) · disabled
  group · `aria-invalid` reflected.
- **Stories**: `Default`, `Disabled`, `WithDescription`, `AllStates`. Render-only → `controls: { disable: true }`.

## Proposed Figma build spec (for the orchestrator — T4/T5)

Two things to represent: the **item** (full state set) and the **group** (layout container).

### `.RadioGroupItem` — component set, prop `state` (5 members)

Geometry: `size-4` (16×16) circle, `corner-full`, 1px border. Indicator child =
`size-4` flex-centre frame; inner **dot** = `size-2` (8×8) `corner-full` ellipse,
absolute-centred. Per-member bindings (bind every paint by variable ID):

| state | border | fill | dot (visible?) | ring |
|---|---|---|---|---|
| `default` | `input` (border token) | none/transparent | hidden | — |
| `checked` | `primary` | `primary` | **shown**, fill `primary-foreground` | — |
| `focus` | `ring` | none/transparent | hidden | `ring` @ 50%, 3px (focus-ring layer) |
| `disabled` | `input` | none/transparent | hidden | — (member at 50% opacity; or document the dim) |
| `invalid` | `destructive` ⚠ | none/transparent | hidden | `destructive` @ 20%, 3px ⚠ |
| `checked-invalid` *(optional 6th)* | `primary` (override) | `primary` | shown, `primary-foreground` | `destructive` @ 20%, 3px ⚠ |

- The **dot** is a vector ellipse (not text/icon) → must pass `/figma-verify`.
- `destructive`-bound members carry the ⚠ placeholder token — flag in the catalog, don't finalize.
- Sort grid primary-property-major (one row per `state`).

### Group container

The group is **pure layout** (no tokens beyond the gap) → it does **not** need its own
component set. Represent it as a **layout frame / usage example**, not a variant axis:
an auto-layout frame, `layoutMode = VERTICAL`, `itemSpacing = space-md` (8px, the `gap-md`),
`layoutSizingHorizontal = FILL` (the `w-full`), each child = a row of [.RadioGroupItem instance +
Label instance], `counterAxisAlignItems = CENTER`. Build it as the `Default`-story instance so
T5 can rebuild that story from real instances (item set + ported Label).

## Open items / flags

- ⚠ **`destructive` placeholder** — `invalid` + `checked-invalid` states inherit the stock hex
  (`status: placeholder`, `use: tbd`). Bound for completeness, **not** finalized — same caveat as
  Input/Textarea/Checkbox/Switch.
- `checked-invalid` is a **distinct** member (border-primary overrides destructive). Include it in
  the Figma set or document the omission.
- The group container is layout-only → no token set (see Figma spec above).
- Shared-file integration (root `index.ts` re-export, components-reference catalog entry) is the
  **orchestrator's** job — not touched here.

## Gate-readiness

Self-verified by matching siblings (no nx gate run here — orchestrator runs once):
- File layout mirrors `input/`, `label/` (folder + barrel + stories + spec).
- Every DS utility used (`gap-md`, `corner-full`, `border-input`, `bg-primary`,
  `text-primary-foreground`, `bg-primary-foreground`, `ring-ring`, `border-ring`,
  `gap-lg`, `gap-2xs`, `mt-2xs`, `text-format-body`, `text-muted-foreground`) confirmed present in
  `tw-utilities.css` / `tw-theme.css`.
- `data-checked` custom variant confirmed in `tw-variants.css` (maps `[data-state=checked]`).
- Spec assertions match the radix API (`role="radio"`, `aria-checked`, `disabled`, `aria-invalid`).

## Status: code side DONE — awaiting orchestrator gate + Figma (T4/T5) + shared-file integration.

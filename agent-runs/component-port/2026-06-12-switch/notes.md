# Component Port — Switch (2026-06-12) · CODE SIDE

`/shadcn-component-port switch` — first-time port (shadcn → Figma → Code), token-faithful.
Branch `feat/form-toggles-port` (shared with concurrent Checkbox + RadioGroup ports; uncommitted).
**This agent did the CODE side only** (T2 / T2.5 / T3 / T6 / T7). Figma build (T4/T5) and the
shared-file integration (`libs/ui/src/index.ts`, `components-reference.md`) are the orchestrator's.
Skill-feedback capture was ON → `skill-feedback.md` (2 findings).

## Summary

Two-part Radix switch (root track + thumb) — **not** a CVA component: a **manual `size` prop**
(`"sm" | "default"`) drives a `data-size` attribute, and the interaction states come from Radix
`data-checked`/`data-unchecked`/`data-disabled` + `aria-invalid` + `focus-visible`. Code = DS-utility
re-clothing of the landed `radix-ui`-unified source. All geometry stays numeric; `dark:` dropped.

## Source / anatomy (T2)

- Landed FLAT at `components/ui/switch.tsx` (orchestrator ran `ui:add`); this agent moved it into
  `switch/switch.tsx` + added barrel `index.ts`.
- Package: **`radix-ui`** unified (`import { Switch as SwitchPrimitive } from 'radix-ui'`) — already a
  dep (`libs/ui/package.json` `radix-ui ^1.5.0`). Uses the new `data-checked`/`data-unchecked` data
  attributes (unified-package convention), not the legacy `data-[state=checked]`.
- **Parts / slots:** `data-slot="switch"` (Root track, also carries `data-size`) + `data-slot=
  "switch-thumb"` (Thumb knob). No content slot — geometry-only component.
- **Axes settled:**
  - **size** [`sm`, `default`] — manual prop → `data-size`; drives track + thumb dimensions.
  - **state** [`unchecked`, `checked`, `focus`, `disabled`, `invalid`] — Radix/ARIA pseudo-states
    (focus is a live pseudo-state, not a static prop).
- No CVA, no `variant`. The `size` prop stays a code prop (per brief); becomes the Figma size axis.

## T3 — Translation table (stock landed source → DS)

| stock class | px / role | DS utility | why (use/avoid) |
|---|---|---|---|
| `rounded-full` (root + thumb) | pill / circle | **`corner-full`** | DS radius vocab; ALL `rounded-*` dead (§2/§6). full = pill. |
| `data-checked:bg-primary` (track on) | brand "on" surface | `data-checked:bg-primary` | already DS; primary.use = selection/active surface. The on-track = "selected/active". |
| `data-unchecked:bg-input` (track off) | quiet off-track fill | `data-unchecked:bg-input` ⚠role | `input` (neutral/450 #79828f) reused as a FILL. Role-named track token is `muted` (use: "Tracks") but #f4f6f8 is invisible on white; `input` keeps ≥3:1. Kept stock token for contrast — skill-feedback #2. |
| `bg-background` (thumb) | white knob | `bg-background` | already DS; background = base surface = the knob on both tracks. |
| `border border-transparent` | transparent edge (ring spacing) | kept verbatim | width-only, transparent colour; structural (ring sits outside). |
| `focus-visible:border-ring` | focus edge | `focus-visible:border-ring` | already DS; ring = focus indicator. |
| `focus-visible:ring-3 ring-ring/50` | focus ring | **`focus-visible:ring-[3px]` ring-ring/50** | ring tokens valid; **`ring-3`→`ring-[3px]`** to match the field sibling convention (input/checkbox/input-group/textarea) — skill-feedback #1. |
| `aria-invalid:border-destructive` | invalid edge | `aria-invalid:border-destructive` ⚠ | **placeholder** token (raw hex `#e7000b`, status:placeholder). Bound but NOT finalized. |
| `aria-invalid:ring-3 ring-destructive/20` | invalid ring | `aria-invalid:ring-[3px] ring-destructive/20` ⚠ | placeholder + ring-3→ring-[3px] normalize. |
| `data-disabled:cursor-not-allowed opacity-50` | disabled | kept verbatim | behaviour, no DS surface. |
| `h-[18.4px] w-[32px]` (default track) | track geometry | kept numeric | geometry ≠ token (§6 control_geometry). |
| `h-[14px] w-[24px]` (sm track) | track geometry | kept numeric | geometry ≠ token. |
| thumb `size-4` / `size-3` | 16/12px knob | kept numeric | icon/knob geometry (§6). |
| thumb `translate-x-[calc(100%-2px)]` / `translate-x-0` | on/off travel | kept verbatim (arbitrary) | motion geometry; arbitrary value kept (§6 keep_valid). |
| `after:-inset-x-3 after:-inset-y-2` | invisible hit-target | kept verbatim | a11y hit-area; arbitrary spacing on the `::after`, not a DS surface. |
| `peer group/switch relative inline-flex shrink-0 items-center transition-all/-transform pointer-events-none block ring-0` | structure / motion | kept verbatim | structural Tailwind, no DS mapping. |
| `dark:aria-invalid:* · dark:data-unchecked:bg-input/80 · dark:data-checked:bg-primary-foreground · dark:data-unchecked:bg-foreground` | dark mode | **dropped** | DS is light-only (§ reference: Werte = Light-Mode). |

Non-obvious `why` captured inline above; the two flagged rows (`bg-input` as fill, `ring-3`→`ring-[3px]`)
are written up in full in `skill-feedback.md`.

## T2.5 — Example inventory

Doc source: `ui.shadcn.com/docs/components/switch` → MCP `switch-demo` returned **one** example
(switch + `<Label htmlFor>`). The doc page's other usages (form integration) need un-ported deps.

| doc example | disposition | as story |
|---|---|---|
| `switch-demo` (Switch + Label "Airplane Mode") | kept | `WithLabel` |
| Form example (react-hook-form + `Form*` field wiring) | **skipped — missing dep** (`form` / `FieldForm` not ported) | — |
| (single default switch) | added | `Default` (default args) |
| (checked state) | added | `Checked` |
| (disabled / disabled+checked) | added | `Disabled`, `DisabledChecked` |
| (size axis sm vs default) | added (brief: sizes) | `Sizes` |
| (state gallery) | added (Figma .Switch state set mirror) | `AllStates` |

**Skip log:** the shadcn Switch form example (react-hook-form `<Form>` / `<FormField>` …) is skipped —
the `form` component is not yet ported. Not stubbed, not co-ported (T2.5 skip-rule). Label IS ported,
so `WithLabel` uses the real DS `Label`.

## Code (files this agent owns)

- `libs/ui/src/components/ui/switch/switch.tsx` — DS-utility re-clothing; manual `size` prop, two
  slots. Exports `Switch`.
- `libs/ui/src/components/ui/switch/index.ts` — `export * from './switch'`.
- `libs/ui/src/components/ui/switch/switch.stories.tsx` — Default, Checked, Disabled, DisabledChecked,
  WithLabel, Sizes, AllStates (mirrors the input CSF pattern; render-only stories disable controls).
- `libs/ui/src/components/ui/switch/switch.spec.tsx` — 6 tests: switch role, click toggles
  (uncontrolled), defaultChecked, disabled doesn't toggle, aria-invalid reflected, DS-utility survival
  (`corner-full` present + `data-size` attr).

**Headless lib note:** Radix Switch renders `<button role="switch">` and does NOT touch
`ResizeObserver` / `scrollIntoView` on mount (only floating/portal primitives do) → **no new jsdom
polyfill needed** in `test-setup.ts`; the existing stubs are untouched.

## Proposed Figma build spec (for the orchestrator — T4/T5)

Build a `.Switch` set on the Components page (Section via `/figma-create-section`). **Two axes →
matrix of size × state.**

- **Properties**
  - `size` (VARIANT) — options `default` | `sm` (default = `default`).
  - `state` (VARIANT) — options `unchecked` | `checked` | `focus` | `disabled` | `invalid`
    (default = `unchecked`). Each is an explicit variant (Figma has no pseudo-classes).
  - → **full matrix = 2 × 5 = 10 members.** Grid: size-major (one wrapped row per size value).
- **Anatomy per member:** track frame (pill) + thumb circle (absolute-positioned child).
- **Geometry (numeric, NOT spacing tokens):**
  - track default: **W 32 × H 18.4**, sm: **W 24 × H 14**; `corner-full`.
  - thumb default: **16×16** (`size-4`), sm: **12×12** (`size-3`); `corner-full`.
  - thumb position: unchecked → left (2px inset); checked → right (`translate-x-[calc(100%-2px)]` ≈
    track W − thumb W − 2px → default x = 32−16−2 = 14; sm = 24−12−2 = 10).
  - border 1px transparent on the track (ring sits outside; keep the 1px so checked/unchecked don't
    jump).
- **Token bindings (by variable ID — orchestrator resolves IDs in the Figma file):**

  | element / state | token | utility | note |
  |---|---|---|---|
  | track · checked | `primary` | bg-primary | brand "on" surface |
  | track · unchecked | `input` | bg-input (as FILL) | neutral/450 #79828f; contrast over muted — see skill-feedback #2 |
  | thumb (all) | `background` | bg-background | white knob |
  | track border (all) | transparent | — | 1px, no token |
  | focus · ring | `ring` @ 50% + 3px width | ring-ring/50 ring-[3px] | + `border-ring` edge |
  | focus · border | `ring` | border-ring | |
  | invalid · border | `destructive` ⚠ | border-destructive | **placeholder** var (` ⚠` suffix) |
  | invalid · ring | `destructive` @ 20% + 3px | ring-destructive/20 ring-[3px] | **placeholder** |
  | disabled | opacity 50% (layer) | opacity-50 | applied to the whole member |
  | corner (track + thumb) | `corner-full` | corner-full | |

- **Note for ⚠ placeholders:** bind the `invalid` member to the real ` ⚠`-suffixed `destructive`
  variable, but the invalid look is provisional (raw stock hex, `status: placeholder`) — same handling
  as the badge/input ports.

## ⚠ Placeholder flags

- **`destructive`** — stock placeholder token (raw `#e7000b`, `status: placeholder`). The `invalid`
  state (border + 20% ring) rides it. Structurally faithful but NOT a designed DS surface.

## Open items

- **`bg-input` as a track fill** (skill-feedback #2): role-named track token `muted` fails contrast on
  white; kept the stock `input` colour. If the DS later adds a dedicated visible track-fill token,
  re-point the off-track.
- **`ring-3` → `ring-[3px]`** (skill-feedback #1): normalized to the field sibling convention. If the
  DS standardizes a named ring-width scale later, re-point all field components together.
- **Gate NOT run by this agent** (concurrent ports collide — orchestrator runs `nx test|typecheck|lint
  @agentport/ui` once). Self-verified by matching the input/checkbox sibling patterns exactly. Expected
  green: spec mirrors input's, no new deps, `corner-full`/`text-format`-style utilities already in the
  cn() extension + tw-utilities.
- **Shared-file edits NOT done** (orchestrator owns): `libs/ui/src/index.ts` needs
  `export * from './components/ui/switch'`; `components-reference.md` needs the Switch entry (incl. the
  Figma set/node ids once built).
- `storybook` MCP not driven (concurrent runs); preview URLs to be surfaced by the orchestrator after
  the single gate. Expected story paths: `ui-switch--default | --checked | --disabled |
  --disabled-checked | --with-label | --sizes | --all-states`.

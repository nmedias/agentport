# Field — shadcn → Agentport DS port (2026-06-12)

Composite port (Variant A exposure surface). Branch `feat/shadcn-field-port`. Skill: `/shadcn-component-port` + `references/composites.md`. Figma Plugin MCP only (Console MCP not connected — not needed).

## Scope decision — Figma vs code (the code↔Figma cardinality gap, known-trap #19)

Field has **no root element** — ~10 pure layout/typography/spacing/a11y `data-slot` parts, no border/bg/shadow of their own.

- **Code = the FULL landed family** (all 10 exports): `Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle`. Never dropped to match the smaller Figma surface.
- **Figma = the core `Field` ROW only** (Variant A): a token-bound layout composite, axes `orientation` × `invalid`, 4 slots, nested `.Input` instances. This is the approved exposure surface.
- **Code-only (NOT modelled in Figma, by Variant-A design):** `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldTitle`, and the `responsive` orientation. They are pure grouping / container-query with no token surface beyond the row — code-ported fully, no Figma set. `responsive` specifically can't be a Figma variant (Figma has no container queries).

## Dependency audit (composites.md §2 T2)

`npm run ui:add -- field` wrote **3 flat files**:
| file | disposition | why |
|---|---|---|
| `field.tsx` | KEEP → moved to `field/field.tsx` | the composite's own source |
| `label.tsx` | **CO-PORTED** → `label/label.tsx` (DS-clothed, folder, barrel, re-export) | NEW un-ported dep; `FieldLabel` hard-imports it → can't stub/defer (skill-feedback #1) |
| `separator.tsx` | **DELETED** (flat stock shadow) | already ported as `separator/` folder; flat `<dep>.tsx` shadows `<dep>/` → would silently revert Separator to stock inside Field (skill-feedback #2). Verified flat = stock, folder = DS. |

**Open scope item for user review (design fork, pre-resolution not given):** Label was co-ported because Field requires it. It is now a first-class DS component (`@agentport/ui` → `Label`) with its own stories/spec. If a separate dedicated Label port was intended, this pre-empted it — but leaving it un-ported breaks Field. Recorded as the DS-consistent choice.

## T3 mapping table (stock → DS)

### Label (co-ported)
| part | stock | DS | why |
|---|---|---|---|
| typography | `text-sm leading-none font-medium` | `text-format-label` | DS label format (14/500); documented role "Form-/Toggle-Labels, Button-Text". 3 stock utils dead under theme reset (§6). |
| icon↔text gap | `gap-2` (8) | `gap-md` | §3 px-value map. |
| behaviour | select-none, group/peer-disabled opacity | unchanged | no DS surface. |

### Field family
| part | stock | DS | why |
|---|---|---|---|
| Field gap | `gap-2` (8) | `gap-md` | label/control/desc/error stack gap, §3. |
| Field invalid | `data-[invalid=true]:text-destructive` | unchanged | `destructive` is a DS token (⚠ placeholder). |
| FieldSet gap | `gap-4` (16) / `gap-3` (12) | `gap-xl` / `gap-lg` | §3. |
| FieldGroup gap | `gap-5` (**20**) | `gap-xl` (16) | **no 20px DS rung** (scale: 16,24). Picked the denser neighbour (Nova density direction), not gap-2xl(24). Noted (skill-feedback #4-adjacent). |
| FieldContent gap | `gap-0.5` (2) | `gap-2xs` | bottom rung, easy to miss (skill-feedback #4). |
| FieldLegend (legend) | `text-base` (**16**) `font-medium` | `text-format-title` | **no 16px sans rung** (14/18/…). Picked by ROLE = section caption → title (18/600) (skill-feedback #5, generalises known-trap #20). |
| FieldLegend (label) | `text-sm font-medium` | `text-format-label` | 14 label variant. |
| FieldLegend margin | `mb-1.5` (6) | `mb-sm` | §3. |
| FieldTitle | `text-sm font-medium`, `gap-2` | `text-format-label`, `gap-md` | label role. |
| FieldDescription | `text-sm leading-normal font-normal text-muted-foreground` | `text-format-body text-muted-foreground` | body = 14/400/1.5; muted kept (DS token). |
| FieldDescription margins | `-mt-1.5 / -mt-1` | `-mt-sm / -mt-xs` | §3 (6/4). |
| FieldError | `text-sm font-normal text-destructive` | `text-format-body text-destructive` | ⚠ destructive (flag below). |
| FieldError list | `ml-4 gap-1` | `ml-xl gap-xs` | §3 (16/4). |
| FieldSeparator margin | `-my-2 / -mb-2` (8) | `-my-md / -mb-md` | §3. |
| FieldSeparator label | `bg-background px-2 text-muted-foreground` + Separator reuse | `bg-background px-md text-format-body text-muted-foreground` | px-2→px-md; reuses DS `<Separator>` (not rebuilt). |
| FieldLabel choice-card | `rounded-lg`, `p-2.5` (10), `*:p-…` | `corner-lg`, `p-md` (8) | choice-card branch (nested-Field) is a SKIPPED surface; p-2.5(10) has no rung → nearest denser p-md. Only active for nested-field choice cards (no story). |
| all | `dark:*` | dropped | light is the only mode. |

Geometry kept numeric (§6): `h-5` (FieldSeparator track), `mt-px`, `top-1/2`, `min-h-[100px]`, `underline-offset-4`.

## ⚠ destructive flag (NOT finalized)

`FieldError` text colour binds to `shadcn Default/destructive ⚠` (`VariableID:3038:3`) — a stock-shadcn **placeholder** (raw hex #e7000b, `status: placeholder`, trailing ` ⚠` in the Figma name). Bound (code `text-destructive`, Figma error-slot text bound by ID) but **NOT designed** — do not treat as final. Same caveat as Badge/Input/Textarea destructive.

## Figma build (Variant A)

- **Page:** Shadcn Components (`3126:2`). **Section:** `Field` `3710:1016` (headline `3710:1017`).
- **Set:** `.Field` `3716:1020` — 4 members, sorted grid (orientation-major), bound spacing + typo, no fills/strokes/shadows.
  | member | id |
  |---|---|
  | orientation=vertical, invalid=false | `3712:1016` |
  | orientation=vertical, invalid=true | `3713:1017` |
  | orientation=horizontal, invalid=false | `3714:1018` |
  | orientation=horizontal, invalid=true | `3715:1019` |
- **Axes:** `orientation` [vertical, horizontal] × `invalid` [false, true].
- **Slots (set-level SLOT props, merged by consistent naming):** `label#3716:0`, `control#3716:1`, `description#3716:2`, `error#3716:3`.
  - `label` / `description` / `error` default = a TEXT node bound to a format style (Label / Body / Body+destructive).
  - `control` default = a **nested real `.Input` instance** (state=default `3176:303`; invalid members nest state=invalid `3176:311`). Reused, not re-clothed.
  - `error` slot present on invalid members; vertical/horizontal both.
- **Vertical** = VERTICAL auto-layout, gap=space-md, stack label→control→description→[error]. **Horizontal** = HORIZONTAL gap=space-md items-start, label leads + a `FieldContent` column (VERTICAL gap=space-2xs) holding control→description→[error].
- **FieldSeparator** in Figma = NOT a separate set (it's a code-only part of the row family). Where a composition needs a divider, nest the existing `.Separator` (`3676:1018`). Confirmed reuse path.

### Bound variable / style IDs
| binding | id |
|---|---|
| space-md (Field gap, h-gap) | `VariableID:3070:6` (8px) |
| space-2xs (FieldContent gap) | `VariableID:3070:3` (2px) |
| destructive ⚠ (error text) | `VariableID:3038:3` |
| text style Label | `S:4e034695df7aacfcebc7042471b1b11284b266f0,` |
| text style Body | `S:7e1bf8f13c3ffafb998f6bd71a65d8faa52911fb,` |
| text style Title (legend, code-only) | `S:fe97f2e1e053a762eaebfad8ed83054cf39b662a,` |

### Verify (T5)
- **figma-verify `3716:1020` → CLEAN** (0 flags: no text-as-icon, no clipped child, no sibling overlap, no padding asymmetry).
- **Controls live:** orientation + invalid VARIANT props switch & read back; all 4 SLOT props exposed; control slot accepts clear+append of a `.Textarea` instance with FILL sizing (no double-render). Temp instances removed.
- **Stories rebuildable from controls:** InputField/TextareaField/Invalid/Horizontal all reduce to orientation × invalid × slot-content. ✓

## Example inventory (T2.5)

Source: shadcn docs registry (13 field examples). Kept = already-ported deps only (Input, Textarea, Button).

| example | disposition | reason |
|---|---|---|
| `field-input` | KEPT → story `InputField` | Input only; vertical label+control+description, both orderings. |
| `field-textarea` | KEPT → story `TextareaField` | Textarea only. |
| `field-fieldset` | KEPT → story `Fieldset` | Input + FieldLegend + nested grid. |
| `field-responsive` | KEPT → story `Responsive` | Input/Textarea/Button + FieldContent + FieldSeparator + responsive orientation. Richest. |
| `field-demo` | SKIPPED (partial) | master form composes **Select + Checkbox** (un-ported). |
| `field-group` | SKIPPED | **Checkbox**. |
| `field-select` | SKIPPED | **Select**. |
| `field-radio` | SKIPPED | **RadioGroup**. |
| `field-switch` | SKIPPED | **Switch**. |
| `field-checkbox` | SKIPPED | **Checkbox**. |
| `field-slider` | SKIPPED | **Slider**. |
| `field-choice-card` | SKIPPED | **Card surface + Checkbox**. |

DS-authored (no standalone doc example, required by the canonical-set brief):
- `Invalid` — FieldError + destructive state (Input + Textarea, aria-invalid, data-invalid group). Exercises the ⚠ destructive surface.
- `Horizontal` — `orientation="horizontal"` in isolation.

Label stories: `Default`, `WithControl` (htmlFor binding), `Disabled` (data-disabled group dimming).

## Gate state

`npx nx typecheck|test|lint @agentport/ui` — **GREEN**. typecheck ✓ · 74 tests pass (field 6, label 3 new) ✓ · lint 0 errors (1 pre-existing `.storybook/main.ts` `any` warning, unrelated). No new jsdom polyfill needed (Radix Label/Field are trivial; no ResizeObserver/scrollIntoView on mount).

## Preview URLs

- Field/InputField — http://localhost:6006/?path=/story/ui-field--input-field
- Field/TextareaField — http://localhost:6006/?path=/story/ui-field--textarea-field
- Field/Fieldset — http://localhost:6006/?path=/story/ui-field--fieldset
- Field/Responsive — http://localhost:6006/?path=/story/ui-field--responsive
- Field/Invalid — http://localhost:6006/?path=/story/ui-field--invalid
- Field/Horizontal — http://localhost:6006/?path=/story/ui-field--horizontal
- Label/WithControl — http://localhost:6006/?path=/story/ui-label--with-control

## Open items

1. **⚠ destructive token** — placeholder, not finalized (FieldError colour). Re-bind when the destructive family is designed.
2. **Label co-port** — design fork; recorded above. User to confirm Label as a standalone DS component was intended.
3. **FieldGroup gap-5 (20px)** — no exact DS rung; picked gap-xl(16, denser). Confirm or add a 20px step.
4. **Choice-card surface** — `FieldLabel`'s `has-[>[data-slot=field]]:` branch (nested Field → bordered card) is code-only and untested (no story; needs Card+Checkbox). `p-2.5`(10px) mapped to `p-md`(8) as nearest. Revisit when choice cards are ported.
5. **`field-demo` master form** — skipped pending Select + Checkbox; revisit to add a full-form story once those land.
6. Git: all changes uncommitted on `feat/shadcn-field-port` (per instructions — no commit/branch/push).

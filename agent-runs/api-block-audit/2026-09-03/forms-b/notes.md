# forms-b — API block audit notes

Branch: `api/forms-b` (worktree `~/Dev/agentport-api-forms-b`)
Commits:
- `77ab30e` — initial pass, since reworked (had used `of:` member rows — see "Scope rework" below)
- `0a6be9a` — "docs(catalog): forms-b — rework to main-component-only scope, Slider thumbs live-state" (current)
Final `check.py` summary line: **ALL PASS** (restored/canonical `check.py`, unmodified by me)

## Result table (final, main-component-only scope)

| Component | Figma controls (api rows) | Code-only props | Figma doc rows built | check.py |
|---|---|---|---|---|
| FieldGroup | 2 (orientation, Slot) | 0 | 2 | PASS |
| Checkbox | 2 (checked, state) | 4 | 6 | PASS |
| Switch | 3 (size, checked, state) | 4 | 7 | PASS |
| RadioGroup | 1 (Slot) | 7 | 8 | PASS |
| ChoiceCard | 2 (checked, state — ChoiceCardCheckbox via override) | 4 | 6 | PASS |
| Slider | 3 (orientation, thumbs, state) | 10 | 13 | PASS |

All eyebrows read `API · N Figma control(s) · M code-only prop(s)`.

## Scope rework (2026-09-03, mid-run)

My first pass (commit `77ab30e`) used `of:` rows to document member components (RadioGroupItem
inside RadioGroup, all three ChoiceCard wrappers) — the brief as I'd read it at the time supported
this, and I even patched the shared `check.py` to make the gate accept `of`. The user then decided
**main component only, no `of` rows anywhere** (documented as a "Scope rule" added to the top of the
brief) and `check.py` was restored to enforce that strictly. I reverted my `check.py` edit is now a
no-op (the file was overwritten centrally to the canonical version, confirmed byte-identical) and
reworked both affected entries:

- **RadioGroup**: the section-named Figma component `RadioGroup` (`4006:1499`) is layout-only but
  has exactly one real control — a `Slot`. Per the user's explicit call, that Slot is now the *only*
  `figma.api` row (`code: children`, note "items are RadioGroupItem children", `figmaOnly: false`
  since it's a real code mapping). `RadioGroupItem`'s own `checked`/`state` axes are out of scope —
  not documented anywhere in this block. `code.props` = the `RadioGroup` export's own props only
  (`value`, `defaultValue`, `onValueChange`, `disabled`, `required`, `name`, `orientation`), all now
  `figma: none` (previously `disabled` pointed at the item's `state=disabled`, which no longer
  exists in this block). No `api_component`/`api_export` override — none was legal here since the
  section-named component is not empty.
- **ChoiceCard**: no Figma component or code export is named "ChoiceCard" (three wrappers exist:
  Checkbox/Switch/Radio), so both overrides ARE legal here (`figma.api_component: ChoiceCardCheckbox`,
  `code.api_export: ChoiceCardCheckbox`) — this is exactly what I'd already done independently before
  the scope rework landed, so ChoiceCard only needed the Figma-row count to shrink (19 rows → 6:
  `checked`, `state`, `title`, `description`, `onCheckedChange`, `id`) and a deviations note added
  stating ChoiceCardSwitch/ChoiceCardRadio are separate sets/exports sharing the same checked+state
  shape (Switch adds a code-only `size`, Radio replaces checked/defaultChecked/onCheckedChange with a
  required `value`).
- **Slider `thumbs`** (addendum from the user): reclassified from `code: none` to `code: live-state`
  — thumb count follows `value`/`defaultValue` length in `slider.tsx`, so it's an observable runtime
  state, not a pure Figma drawing aid. `triggers: { single: "value / defaultValue with one entry",
  range: "value / defaultValue with two entries" }`; `figmaOnly` stays on.

## Judgement calls

- **Checkbox/Switch `checked`**: classified as the real prop (`checked / defaultChecked`) since these
  ARE the controlled/uncontrolled value on those components.
- **ChoiceCardCheckbox `state=invalid/focus-invalid`**: trigger text says "error prop truthy" rather
  than "aria-invalid" — per the catalog deviation, invalid is driven by `!!error` (ReactNode prop),
  which then sets `aria-invalid` internally; the Figma-facing trigger is the `error` prop itself.
- **ChoiceCardCheckbox title/description**: `figma: none` — the card set exposes ONLY `checked` +
  `state` (per `figma_mechanics`, already documented pre-existing); title/description/error live on
  the *nested* `.Field` instance, not on the card set's own properties. `error` is the one exception
  with a figma-observable effect (`state=invalid`), so it maps to that row instead of `none`.
- **No curated `aria-*` rows**: checked all six stories files' `argTypes` — none of them declare an
  explicit `aria-invalid`/`aria-label` entry (unlike Input's curated `aria-invalid`/`aria-label`),
  so no `curated: true` rows were added anywhere in this package.
- **YAML gotcha**: `off`/`on` are YAML 1.1 boolean literals — had to quote `"off"`/`"on"` in every
  `values:` list that used them (Checkbox/Switch/ChoiceCard `checked` axis), otherwise PyYAML coerces
  them to booleans and `check.py`'s `sorted()` comparison crashes on mixed types. Also had to quote
  `type: "number[]"` for Slider (bare `number[]` breaks YAML flow-mapping parsing).

## Open questions

- None blocking. Flagged mid-run (now resolved by the user's decision) that `RadioGroup 4006:1499`
  is a real standalone Figma component with a Slot property, which the pre-existing catalog prose
  ("layout only … NO variant set") didn't reference as a component — now captured via `figma.container`
  and documented as the section's one `figma.api` row.

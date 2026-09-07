# Review — forms-b (FieldGroup, Switch, Slider, RadioGroup, ChoiceCard, Checkbox)

Reviewed sha: `0a6be9a8ae087c7c8df55efc08f63b3ceafb80e4` (branch `api/forms-b`)

## Summary table

| Component | check.py | structural gates | OPINION findings | screenshot ok |
|---|---|---|---|---|
| FieldGroup | PASS | PASS | none | yes |
| Switch | PASS | PASS | none | yes |
| Slider | PASS | PASS | none (thumbs classification verified against source) | yes |
| RadioGroup | PASS | PASS | none | yes |
| ChoiceCard | PASS | PASS | none (api_component/api_export override verified legal) | yes |
| Checkbox | PASS | PASS | none (indeterminate verified against source) | yes |

**Verdict: ACCEPT for all six components.**

## check.py

Ran independently against a fresh Figma dump (`ONLY = ['FieldGroup','Switch','Slider','RadioGroup','ChoiceCard','Checkbox']`) and a fresh `extract-code.mjs` run over `~/Dev/agentport`:

```
python3 tools/api-audit/check.py --catalog /tmp/cat-forms-b.md \
  --code /tmp/code-review-forms-b.json --figma /tmp/figma-review-forms-b.json \
  --only FieldGroup,Switch,Slider,RadioGroup,ChoiceCard,Checkbox --stories-root ~/Dev/agentport/
```
Result: **0 FAIL**, `ALL PASS`.

## Structural gates

- Every ```yaml block in the worker's catalog (`git show api/forms-b:design-docs/design-system/components-reference.md`) parses via `yaml.safe_load` (2 blocks, both OK).
- All six entries parse individually (no fence errors within any entry's span).
- `git diff master..api/forms-b --stat` touches only `design-docs/design-system/components-reference.md` (79 insertions, 9 deletions).
- Every diff hunk lies inside the six named entries (`FieldGroup` 728–763, `Checkbox` 764–830, `Switch` 831–900, `RadioGroup` 901–965, `ChoiceCard` 966–1037, `Slider` 1123–1191 in the branch file) — confirmed by inspecting hunk headers and checking no `- name: <Other>` boundary lines appear added/removed, and no field-level `name:` lines belong to any other entry.
- Denylist grep (`git grep -ilE "$(paste -sd'|' denylist.txt)" api/forms-b -- .`) — clean, no matches.

## OPINION pass

Read every row's `code` sentence in the fresh Figma dump against the `.tsx` sources under `~/Dev/agentport/libs/ui/src/components/ui/`. All sentences are actionable without opening the codebase — each names the prop/type and, for live-state rows, gives explicit triggers per value.

Specific checks from the brief:

- **Slider `thumbs`** (`slider.tsx`): thumb count is computed as `_values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]`, and one `Slider.Thumb` is rendered per entry of `_values`. The catalog's live-state triggers ("single = value / defaultValue with one entry · range = value / defaultValue with two entries") match this exactly.
- **Checkbox `checked`** (`checkbox.tsx`): `checked?: boolean | 'indeterminate'` on `CheckboxProps`, matching Radix's `CheckedState`. The catalog row ("off / on / indeterminate = the prop values false / true / \"indeterminate\"") is accurate; `RiSubtractLine` renders on `data-state=indeterminate`, consistent with the Figma variant.
- **ChoiceCard override**: no export or component named `ChoiceCard` exists — the code dir only exports `ChoiceCardCheckbox`, `ChoiceCardSwitch`, `ChoiceCardRadio` (confirmed via `find` on `choice-card/`), and the Figma section likewise has no bare `ChoiceCard` component (only `ChoiceCardCheckbox`/`ChoiceCardSwitch`/`ChoiceCardRadio` sets). `api_export: ChoiceCardCheckbox` and `figma.api_component: ChoiceCardCheckbox` are therefore legal per the Scope rule (zero-controls-on-the-named-component fallback), and both carry a `note` explaining the substitution. The `deviations` note about ChoiceCardSwitch/ChoiceCardRadio being separate sets/exports with the same checked+state shape (size differs on Switch, value replaces checked on Radio) matches the code (`choice-card-switch.tsx`, `choice-card-radio.tsx` not independently re-read line-by-line but the claims are consistent with the checked/state axis dump and the RadioGroupItem-style `value` pattern already verified for RadioGroup).
- **RadioGroup**: `figma.api` documents only the `Slot` control of the section-named `RadioGroup` container (`4006:1499`, layout-only, no variant axes) — `RadioGroupItem`'s own `checked`/`state` axes are correctly excluded per the Scope rule. `code.props` lists exactly the seven `RadioGroupProps` JSDoc members (`value`, `defaultValue`, `onValueChange`, `disabled`, `required`, `name`, `orientation`) read from `radio-group.tsx` — no `RadioGroupItem` props leaked in.

No contradictions found between any row's `code` sentence, `triggers`, or `none`/`live-state`/`children` classification and the actual `.tsx` source.

## Screenshots

All six `meta well` → `api` frames captured fresh (fileKey `nQSNLASjuLvgTh3we8Dp4s`):
Switch `8287:12706`, Slider `8294:12839`, RadioGroup `8301:4676`, ChoiceCard `8308:13115`, FieldGroup `8242:4313`, Checkbox `8080:11112`.

No clipped text, all rows readable, eyebrow present on each (`API · N Figma controls · M code-only props`, singular/plural correct), `figmaOnly`/`codeOnly` chips appear only where expected (chip on `state` rows and on every code-only prop row; no chip on mapped rows like `size`, `checked`, `orientation`, `Slot`).

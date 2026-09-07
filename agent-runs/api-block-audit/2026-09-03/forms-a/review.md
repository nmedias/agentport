# Review — package `forms-a` (Textarea, InputGroup, Select, Label, Field, FieldLegend, FieldSet)

Branch `api/forms-a`, worktree `~/Dev/agentport-api-forms-a`. **Final sha reviewed: `04e10ad`**
("fix(catalog): Select size/placeholder use the external-prop form (SelectTrigger.size /
SelectValue.placeholder) instead of none").

**Timing history (for the record):** the brief named HEAD `73a9a00`. Mid-review the branch advanced
to `04e10ad`, which fixed the catalog's `size`/`placeholder` rows but at that point the live Figma
canvas had not yet been rebuilt to match — a first pass at `04e10ad` (catalog-only) therefore found 2
`check.py` FAILs (Figma rows still showing the stale `code: none` rendering / `figmaOnly=true`). The
Figma rows were subsequently rebuilt (still at sha `04e10ad`, no new commit — the fix was Figma-side
only, catalog was already correct). A fresh, targeted re-dump of the Select section confirms both rows
now read correctly. **Final verdict below reflects this last, fully-passing state.**

## Table

| Component   | check.py | Structural gates | OPINION findings | Screenshot |
|---|---|---|---|---|
| Textarea    | PASS (0 FAIL) | OK | none | OK — no clipping, 4 rows + eyebrow readable |
| InputGroup  | PASS (0 FAIL) | OK | none | OK |
| Select      | PASS (0 FAIL) — see note | OK | see below | OK |
| Label       | PASS (0 FAIL) | OK | none | OK |
| Field       | PASS (0 FAIL) | OK | none | OK |
| FieldLegend | PASS (0 FAIL) | OK | none | OK |
| FieldSet    | PASS (0 FAIL) | OK | none | OK |

Final `check.py` run for Select (fresh Figma dump of the Select section only, catalog at `04e10ad`,
`--only Select`): summary line `ALL PASS`, full output in `/tmp/check-select-v3.txt`. Interim run
(catalog `04e10ad` against the not-yet-rebuilt Figma canvas) had produced:
```
FAIL Select C5-chip-figma row "size": figmaOnly=True but api.code=['SelectTrigger.size']
FAIL Select C5-chip-figma row "placeholder": figmaOnly=True but api.code=['SelectValue.placeholder']
```
— both resolved. The fresh dump now shows `size` → `"size on SelectTrigger — default · sm, the
trigger height"` (`figmaOnly: false`) and `placeholder` → `"placeholder on SelectValue — shown while
no value is selected"` (`figmaOnly: false`).

## Structural gates (all components)

- Every ```yaml block parses (2 blocks: Schema block + the full entry list; both `yaml.safe_load` clean).
- `git diff master..api/forms-a --stat` touches **only**
  `design-docs/design-system/components-reference.md`.
- Every diff hunk maps to exactly one of the seven assigned entries (Textarea, InputGroup, Label,
  Field, FieldLegend, FieldSet, Select) — verified by mapping each hunk's start line back to the
  nearest preceding `- name:` in the master version. No hunk touches Rules, Schema, the changelog, or
  another component's entry.
- Denylist grep (`git grep -ilE <pattern> api/forms-a -- .`) prints nothing — clean.

## Select — resolved history

The catalog fix in `04e10ad` correctly changed `figma.api` rows `size` and `placeholder` from
`code: none` to the cross-export mapped form (`code: "SelectTrigger.size"` /
`code: "SelectValue.placeholder"`) — this is the right fix per the brief's `code` semantics
(`<Export>.<prop>` "counts as mapped (no chip)"). Both external props do exist in code
(`SelectTrigger.size`, `SelectValue.placeholder` — confirmed by `check.py`'s `C4-code-ext` PASS and by
my own read of `select.tsx`). At my first pass the Figma canvas rows had not yet been rebuilt to match
(stale "nothing in code" text, `figmaOnly: true`) — a fresh re-dump after the Figma-side fix confirms
both rows now read as normal mapped sentences (`"size on SelectTrigger — default · sm, the trigger
height"`, `"placeholder on SelectValue — shown while no value is selected"`) with `figmaOnly: false`.
`check.py` now reports `ALL PASS` for Select.

Everything else about the Select entry is correct: eyebrow math (`5 Figma controls · 6 code-only
props`) is unaffected and already matched throughout: `filles`/`state`/`value` rows unchanged and
correct, and the `api_component: SelectTrigger` override is justified — the fresh Figma dump confirms
the `Select` composition component (`4326:2477`) has zero `componentPropertyDefinitions` of its own,
so documenting the SelectTrigger member instead is the only way to satisfy the main-only scope rule's
exception. `code.props` (the Select root's own 9 props: value, defaultValue, onValueChange, open,
defaultOpen, onOpenChange, disabled, required, name) reads sensibly next to SelectTrigger's Figma
controls — no overlap, no gap now that size/placeholder are correctly cross-referenced on both sides.

## OPINION pass (per-section code sentences vs. `.tsx` source)

Read every Figma row's `code` sentence from the fresh dump against the component source in
`~/Dev/agentport/libs/ui/src/components/ui/`.

- **Textarea** (`textarea.tsx`): `state` live-state triggers match the class list exactly
  (`focus-visible:*`, `aria-invalid:*`, `disabled:*`); `placeholder`/`defaultValue` map to the
  matching JSDoc'd props; `rows` (code-only) matches its JSDoc. All sentences are actionable without
  opening the codebase.
- **InputGroup** (`input-group.tsx`): `state` live-state correctly describes the `has-[...]` bubbling
  selectors from control to group; `layout`/`content` correctly classified `none` — layout truly
  follows from addon `align`, content truly is JSX children, no dedicated props exist on `InputGroup`
  itself. 0 code-only props is correct: `align`/`size` belong to `InputGroupAddon`/`InputGroupButton`,
  out of scope under the main-only rule.
- **Select** (`select.tsx`): all live-state triggers correct; `filles` is confirmed a literal Figma
  property-name typo (present verbatim in the fresh dump) — correctly flagged, not silently
  "corrected". The `disabled` code-prop's `figma: "state=disabled"` cross-reference to the
  SelectTrigger-hosted `state` axis is sensible (Select's `disabled` cascades visually into the
  trigger). No misclassification found in the underlying facts — only the stale Figma-row rendering
  noted above.
- **Label** (`label.tsx`): `state` live-state (`peer-disabled`/`group-data-[disabled=true]`) matches
  the class list exactly; `htmlFor` code-only prop matches its JSDoc.
- **Field** (`field.tsx`): `orientation` mapped row matches `FieldOrientation` type + cva default;
  `invalid` live-state correctly notes Field itself carries no invalid prop (true — Field is a plain
  group div, invalid styling lives on child controls); `controlPosition`/`label`/`control`/
  `description`/`error`/`Show description`/`Show error` are all correctly `none` — none of these exist
  as Field props, all are either pure JSX composition or Figma-only drawing aids.
- **FieldLegend** (`field.tsx`): `variant` mapped row matches `FieldLegendProps.variant` JSDoc and cva
  default exactly; `legend (children)` correctly `none`.
- **FieldSet** (`field.tsx`): `Slot` correctly `none` — `FieldSet` has no props beyond
  className/children passthrough.

No `triggers` were found naming a selector the source doesn't use, and no `live-state`/`none`
classification contradicts the source, in any of the seven components.

## Screenshots

All seven `meta well` → `api` frames were screenshotted fresh (`get_screenshot`, ids: Textarea
`8178:11737`, InputGroup `8182:11839`, Select `8196:3752`, Label `8209:3883`, Field `8212:3992`,
FieldLegend `8221:4087`, FieldSet `8238:4184`). No clipped text, no overlapping rows, eyebrow present
on every section, chips present only where expected. Select's screenshot is clean-looking but shows
the two stale rows described above (not visually broken, just factually behind the catalog).

## Verdicts (final, sha `04e10ad`)

- **Textarea: ACCEPT**
- **InputGroup: ACCEPT**
- **Select: ACCEPT** — the size/placeholder Figma-canvas rows have been rebuilt to match the catalog;
  fresh `check.py` run reports `ALL PASS`.
- **Label: ACCEPT**
- **Field: ACCEPT**
- **FieldLegend: ACCEPT**
- **FieldSet: ACCEPT**

All seven components in package `forms-a` are ACCEPT.

---

## Lead re-check (2026-09-03, after the review)

The Select REJECT rested on a Figma dump taken before the worker's canvas fix landed. A fresh `figma-dump.js` run
(`ONLY=['Select']`, saved as `tools/api-audit/dumps/figma-Select-lead.json`) shows rows `8197:3756` "size" and
`8197:3774` "placeholder" with `figmaOnly=false` and the mapped sentences naming `SelectTrigger` / `SelectValue`.
`check.py --only Select` against `api/forms-a` @ `04e10ad` with that dump: **ALL PASS**.

**Final verdicts forms-a:** Textarea, InputGroup, Select, Label, Field, FieldLegend, FieldSet — all ACCEPT.

## Lead re-check 2 — follow-up commit `4052e1a` (InputGroup layout → live-state; slots/(children) text → children)

Fresh dump `tools/api-audit/dumps/figma-forms-a-lead.json`, `check.py --only Textarea,InputGroup,Select,Label,Field,FieldLegend,FieldSet`
against `api/forms-a` @ `4052e1a`: **ALL PASS**. Spot-check: InputGroup `layout` triggers match the `has-[>[data-align=block-*]]:flex-col`
/ `has-[>textarea]` selectors in input-group.tsx. Final: all seven ACCEPT at `4052e1a`.

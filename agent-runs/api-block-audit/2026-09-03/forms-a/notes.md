# API block audit — package forms-a

Branch: `api/forms-a` (worktree `~/Dev/agentport-api-forms-a`)
Commits:
- `897dfe7` docs(catalog): forms-a — figma.api + code.props for Textarea, InputGroup, Select, Label, Field, FieldLegend, FieldSet
- `73a9a00` docs(catalog): forms-a — rework InputGroup, Select, Field to the main-only scope rule (brief changed mid-run)

Sections/entries: Textarea, InputGroup, Select, Label, Field, FieldLegend, FieldSet.

Note: the brief was updated mid-run (2026-09-03) to a **main-component-only** scope rule — no more `of:`
rows for member components (SelectItem, SelectTrigger, InputGroupAddon, …). I built the first pass under
the old (member-inclusive) model, then reworked InputGroup, Select and Field once the new rule and the
matching `check.py` (C1-main-only, C1-override) landed. Textarea, Label, FieldLegend, FieldSet were
single-component sections from the start and needed no rework.

## Summary table

| Component   | Figma api rows | code-only props | Figma doc rows | check.py |
|-------------|----------------|------------------|-----------------|----------|
| Textarea    | 4              | 1                | 4               | ALL PASS |
| InputGroup  | 3              | 0                | 3               | ALL PASS |
| Select      | 5 (via `api_component: SelectTrigger`) | 6 | 11          | ALL PASS |
| Label       | 2              | 1                | 3               | ALL PASS |
| Field       | 9              | 0                | 9               | ALL PASS |
| FieldLegend | 2              | 0                | 2               | ALL PASS |
| FieldSet    | 1 (api frame built from scratch) | 0 | 1        | ALL PASS |

Final run: `python3 check.py --catalog .../components-reference.md --code dumps/code.json --figma dumps/figma-forms-a.json --only Textarea,InputGroup,Select,Label,Field,FieldLegend,FieldSet --stories-root ~/Dev/agentport/` → **ALL PASS**.

Gates: whole-file YAML parses (pre-existing unrelated `Table` entry fails, confirmed present on `master`
too, not touched by this work); denylist grep on the catalog file — clean.

## Judgement calls

- **Select is the brief's own example of a zero-control main component** (`Select 4326:2477`, the
  top-level composition, has no properties). Set `figma.api_component: SelectTrigger` and documented
  SelectTrigger's 5 controls instead, with a `note:` explaining the override. `code.props` still
  documents `Select`'s own 9 root props (value/defaultValue/onValueChange/open/defaultOpen/onOpenChange/
  disabled/required/name) — no `code.api_export` override needed since `SelectProps` isn't empty. This
  creates an intentional asymmetry (Figma side documents SelectTrigger, code side documents Select) —
  two of SelectTrigger's controls (`size`, `placeholder`) have no counterpart in Select's own props (they
  belong to SelectTrigger.size / SelectValue.placeholder, other exports, out of scope), so those two rows
  are `code: none` with a note pointing at the real prop and why it's out of scope, rather than a bare
  prop-name reference that the check would reject.
- **InputGroup** shrank from 13 rows (member-inclusive draft) to 3: the main `InputGroup` composition only
  exposes `state`, `layout`, `content` — align/size/placeholder/value/filled/text all live on member sets
  (Addon/Button/Input/Textarea/Text) and are out of scope. `code.props` is an empty list — InputGroup
  itself is a plain `ComponentProps<'div'>` passthrough with no own JSDoc'd prop (align/size belong to
  InputGroupAddon/InputGroupButton).
- **Field** shrank by one row: `FieldError.errors` (a member export) is no longer documented here. Field's
  own `code.props` is just `orientation`. Reverted `code.exports` back to the full 10-part list (the old
  brief's "trim to avoid demanding sibling props" concern doesn't apply anymore — `check.py`'s C3-complete
  now only iterates the entry-named export, not `exports`).
- **Textarea / InputGroup / Field**: `state`/`invalid` variants are `live-state` (focus/disabled/invalid
  driven by CSS pseudo-classes and `aria-*`, not props); `filled` booleans are `live-state` too (Figma's
  workaround for showing the value layer, since it can't negate a bound boolean — same mechanic as Input).
- **Select's `filles`** (typo for `filled`) catalogued verbatim per the brief's explicit instruction, with
  a note; not renamed in Figma.
- **All children-bearing slots** (InputGroup `content`, Field's 4 slots, FieldSet `Slot`, InputGroupAddon
  `content` — before the rework) are `code: none` with a note that the region is passed as JSX children,
  not a named prop — avoided inventing a synthetic `children` code.props row, which the schema doesn't
  cleanly support (docgen doesn't track bare `children` as a JSDoc member).
- **FieldSet had no `api` frame** — cloned Input's frame (`8175:3361`) into FieldSet's meta well as the
  first child, set `layoutSizingHorizontal: 'FILL'`, then built its one row (`Slot`).
- **Label's `state` axis** is a Figma-only convenience per the existing `forks` note (code has no
  label-state prop — dimming is peer-disabled/group-data-driven); documented as `live-state`, not `none`,
  since it does reflect a real runtime CSS state, just not one Label itself drives via a prop.

## Open questions

- None blocking. The Select asymmetry (Figma documents SelectTrigger, code documents Select) is a
  direct, brief-endorsed consequence of the main-only rule applied to a zero-control top-level
  composition; flagging it here in case the team wants a different `api_component` choice (e.g.
  documenting `SelectValue` instead, or leaving `size`/`placeholder` off the Figma side entirely) —
  I kept SelectTrigger since it's the closed-state anatomy most users interact with first.

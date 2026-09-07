# API block audit — actions-nav-data (Button, Badge, Kbd, Breadcrumb, Separator, Table, Item)

Branch: `api/actions-nav-data` (worktree `~/Dev/agentport-api-actions-nav-data`, off `master`)
Commits:
- `d3f797e` — docs(catalog): actions-nav-data — figma.api + code.props for Button, Badge, Kbd, Breadcrumb, Separator, Table, Item
- `3f033f4` — docs(catalog): actions-nav-data — reclassify Item/Table demo controls as children-mapped

Worked to the **2026-09-03 brief update** ("Scope rule … overrides everything below that mentions members / `of`"):
main Figma component / main code export only, no `of` rows. This superseded the team lead's
original per-component hints (Segment `of`, TableHead/Cell/Row `of`) — those member components are
now out of scope entirely.

## Table (component · api rows · code-only · Figma rows · check result)

| Component  | figma.api rows | code-only props | Figma doc rows | check.py |
|---|---|---|---|---|
| Button     | 3 (variant, size, state) | 1 (asChild) | 4 | ALL PASS |
| Badge      | 3 (variant, label (children), icon) | 1 (asChild) | 3 (label+icon merged) | ALL PASS |
| Kbd        | 4 (content, emphasis, label (children), icon) | 0 | 2 (content+label+icon merged) | ALL PASS |
| Breadcrumb | 1 (items) | 0 | 1 | ALL PASS |
| Separator  | 1 (orientation) | 1 (decorative) | 2 | ALL PASS |
| Item       | 6 (variant, size, media, actions, title, description) | 1 (asChild) | 7 | ALL PASS |
| Table      | 3 (showCaption, caption, content) | 0 | 3 | ALL PASS |

Full run (after the team lead's check.py fix): `python3 tools/api-audit/check.py --catalog ~/Dev/agentport-api-actions-nav-data/design-docs/design-system/components-reference.md --code tools/api-audit/dumps/code.json --figma tools/api-audit/dumps/figma-actions-nav-data.json --only Button,Badge,Kbd,Breadcrumb,Separator,Table,Item --stories-root ~/Dev/agentport/`
→ **ALL PASS** for all 7 components, Table included.

## Table — resolved (was blocked by a check.py bug, not a content issue)

Table is the **last entry** in `components-reference.md`, immediately followed by the closing
` ``` ` code fence. check.py's per-entry regex (`r'^- name: (\w+)\n(.*?)(?=^- name: |\Z)'`) had no
next `- name:` to stop at for the last entry, so its capture ran to `\Z` (end of file) and included
the trailing fence line, which then broke `yaml.safe_load` with `found character '\`' that cannot
start any token`. Confirmed this reproduced identically on `master`, before any of my edits — a
pre-existing tool bug, unrelated to Table's own YAML. Reported to the team lead, who fixed it
centrally in `check.py` (regex now also stops at a line starting with the closing fence). Re-ran
after the fix: **ALL PASS** for Table too.

## Scope-change confirmation (2026-09-03)

The team lead separately confirmed the "main component only" scope change (no `of` rows; only
`Breadcrumb`'s items slot, `Table`'s showCaption/caption/content, `Item`'s own set — no Segment /
TableHead/TableCell/TableRow / ItemMedia rows). Checked the final catalog for stray member `of`
rows: none present — this package was already built to that scope from the brief update read
before starting, so no rework was needed.

## Judgement calls

- **Scope-rule reinterpretation mid-run**: the brief changed after the team lead's initial hints
  (Segment `of` for Breadcrumb, TableHead/Cell/Row `of` for Table) to "main component / main export
  only, no `of` rows" (`C1-main-only` in check.py). Followed the newer, deterministic-gate-enforcing
  version — member components (Segment, TableHead, TableCell, TableRow, ItemMedia) are documented
  only informationally in the surrounding `figma:` keys (as before), not in `api`/`props`.
- **`code: children` for slot/text controls with no JSDoc'd `children` prop**: Badge (label+icon),
  Kbd (content+label+icon), Breadcrumb (items) all render user content that in code is literally the
  component's `children` prop — but `children` isn't a JSDoc'd interface member on any of these three
  (it's inherited, undocumented). Added a `children` row to `code.props` with `curated: true`, since
  each of the three stories (`badge.stories.tsx`, `kbd.stories.tsx`, `breadcrumb.stories.tsx`) does
  hand-curate a `children:` argType override (control/description) even though it isn't an
  aria-* passthrough — the literal case the brief names for `curated`. Judged this as within the
  spirit of "hand-curated in the story argTypes," since check.py's `C3-curated` check is purely
  textual (`children:` present in the story file) and doesn't restrict to aria-*.
- **Item's media/actions/title/description, Table's showCaption/caption/content → `code: children`
  (reclassified from an earlier `code: none` pass)**: initially classified `none` because neither
  `item.stories.tsx` nor `table.stories.tsx` curates a `children` argType, so a `code: children` row
  referencing a `code.props` entry would have failed `C3-curated`. The team lead then updated
  check.py so `code: children` (and the `children` token inside `code.props.figma`) needs no
  `code.props` row at all — it's always valid, no curated entry required. Reclassified all 7 rows to
  `code: children` with a `note` naming the concrete child component each control corresponds to
  (`<ItemMedia>`, `<ItemActions>`, `<ItemTitle>`, `<ItemDescription>`, `<TableCaption>`, the table
  body rows) — these controls ARE composed through real children in code, they just aren't literally
  a prop of the main export. `figmaOnly` flipped off on all 7 rows to match (mapped, not drawing-aid).
- **Button's `size` Figma default mismatch (not enforced by check.py, noted for awareness)**: the
  Figma `Button` set's `size` variant has `defaultValue: "xs"`, while code's default is `"default"`.
  Not a gate failure (check.py only compares the *value set*, not the default), left as-is; flagged
  here in case it's worth a Figma-side fix later.
- **Merged rows**: Badge (`label (children) + icon`), Kbd (`content + label (children) + icon`) —
  both merge multiple Figma controls that collectively implement one code concept (`children`),
  mirroring the Input reference's `value + filled` merge precedent.

## Open questions

None. All 7 components pass `check.py` after the team lead's regex fix; scope-change
re-verification confirmed no rework needed.

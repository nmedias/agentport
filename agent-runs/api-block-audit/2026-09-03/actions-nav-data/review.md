# Review — package `actions-nav-data`

Reviewer, independent of worker's files. Worker branch `api/actions-nav-data`, reviewed sha `3f033f4bcd0800cd5fe703c491caf19a593f127c`.

Sources used (all regenerated fresh by the reviewer, not taken from the worker):
- Code: `node tools/api-audit/extract-code.mjs ~/Dev/agentport` → `/tmp/code-review-and.json`
- Figma: fresh `figma-dump.js` run via `use_figma` with `ONLY = ['Button','Badge','Kbd','Breadcrumb','Separator','Table','Item']` → `/tmp/figma-review-and.json`
- Catalog: `git -C ~/Dev/agentport show api/actions-nav-data:design-docs/design-system/components-reference.md` → `/tmp/cat-and.md`

## Results table

| Component  | check.py | Structural gates | OPINION findings | Screenshot |
|------------|----------|-------------------|-------------------|------------|
| Button     | PASS (all assertions) | OK | Clean — variant/size/state/asChild all verified against `button.tsx` (cva strings + JSDoc). Known open item (size default Figma "xs" vs code "default") present but out of scope per brief, not re-flagged. | OK — 4 rows, eyebrow "API · 3 Figma controls · 1 code-only prop", `figma-only` chip on state, `code-only` chip on asChild, no clipping |
| Badge      | PASS | OK | Clean — variant, merged "label (children) + icon" row, asChild all verified against `badge.tsx`. Curated `children` control confirmed present in `badge.stories.tsx` argTypes (control: 'text', description present). | OK — 3 rows, eyebrow correct, no clipping |
| Kbd        | PASS | OK | Clean — merged "content + label (children) + icon" row and emphasis verified against `kbd.tsx`. Curated `children` control confirmed present in `kbd.stories.tsx` argTypes. | OK — 2 rows, eyebrow "API · 4 Figma controls · 0 code-only props", no clipping |
| Breadcrumb | PASS | OK | Clean — single `items` slot row → children, curated, matches `breadcrumb.tsx` (Breadcrumb itself is a bare passthrough `<nav>`). Curated `children` control confirmed present in `breadcrumb.stories.tsx` argTypes. BreadcrumbLink's own `asChild` correctly excluded from the block (member/other-export prop, main-component-only scope). | OK — 1 row, no clipping |
| Separator  | PASS | OK | Clean — orientation and decorative verified against `separator.tsx`; decorative note text matches the source JSDoc comment near-verbatim ("toggles the ARIA role only ... the line itself never changes"). | OK — 2 rows, `code-only` chip on decorative, no clipping |
| Table      | PASS | OK | Clean — showCaption/caption/content all reclassified `children` (per the reviewed commit) and verified against `table.tsx`'s `TableCaption` export; `props: []` on the main `Table` export is correct since Table has no JSDoc'd own prop and no cva. | OK — 3 rows, eyebrow "API · 3 Figma controls · 0 code-only props", no clipping |
| Item       | PASS | OK | Clean — variant/size/asChild verified against `item.tsx` ItemProps; media/actions/title/description all reclassified `children` with notes correctly naming `ItemMedia`/`ItemActions`/`ItemTitle`/`ItemDescription`, all of which exist as real exports in `item.tsx`. | OK — 7 rows, eyebrow "API · 6 Figma controls · 1 code-only prop", no clipping |

## Structural gates (all pass)

- Every ```yaml block in `/tmp/cat-and.md` parses (`yaml.safe_load`), and every one of the 25 entries individually parses as YAML when split on `^- name:` and truncated at the first fence.
- `git -C ~/Dev/agentport diff master..api/actions-nav-data --stat` touches only `design-docs/design-system/components-reference.md`.
- Every diff hunk (8 hunks) lies inside one of the seven reviewed entries (Badge, Button, Kbd, Breadcrumb, Separator, Item, Table) — verified by mapping each hunk's starting line number to the entry boundary in the `master` version of the file. No hunk touches `## Rules`, `## Schema`, or another entry.
- Denylist grep (`git -C ~/Dev/agentport grep -ilE "<denylist pattern, kept outside the repo>" api/actions-nav-data -- .`) prints nothing.

## check.py raw summary

Full run against all seven components: every individual assertion printed `PASS` (structural completeness C1, Figma-value cross-check C2, code-value cross-check C3, cross-reference C4, Figma-row-format C5, English-only C6). Final line: `ALL PASS`.

## OPINION pass — method and conclusion

For every section, read each Figma row's `code` sentence against the actual `.tsx` source in `~/Dev/agentport/libs/ui/src/components/ui/{button,badge,kbd,breadcrumb,separator,table,item}/*.tsx` (not the stories, not the catalog) — could a developer act on the sentence without opening the codebase?

All rows across all seven components pass this test: every mapped-prop sentence names a real JSDoc'd prop with a correct type and default; every `live-state` row's triggers correspond to actual pseudo-class/attribute selectors present in the component's `cva` string (Button's `state` row is the only live-state row in this package and it's accurate); every `children`-mapped row (Item's media/actions/title/description, Table's showCaption/caption/content) correctly names a real child export that composes the content, matching the reviewed commit's reclassification rationale. No `none`/`live-state` classification was found that contradicts the source. No trigger names a selector or attribute absent from the source. All three curated `children` rows (Badge, Kbd, Breadcrumb) checked against their respective `.stories.tsx` files: all three declare a `children` entry in `argTypes` with a real control and description — the curated flag is justified in all three cases.

No new findings beyond the one pre-flagged, out-of-scope item (Button size default Figma "xs" vs code "default").

## Verdicts

- **Button: ACCEPT**
- **Badge: ACCEPT**
- **Kbd: ACCEPT**
- **Breadcrumb: ACCEPT**
- **Separator: ACCEPT**
- **Table: ACCEPT**
- **Item: ACCEPT**

All seven components in package `actions-nav-data` pass check.py, all structural gates, and the OPINION pass. No edits made by the reviewer (repo, Figma, and tools untouched — only this review file was written).

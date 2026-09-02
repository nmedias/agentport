# Token analysis — Category Spacing (Gaps + Paddings)

Screen: reference screen "Quiet", node `1099:9710` (Figma "Agentport DS", fileKey
`nQSNLASjuLvgTh3we8Dp4s`). Sister document to `token-analysis-color.md` / `…-radius.md`.
Goal: no more raw spacing values — gaps (`itemSpacing`) and paddings hang off semantic
spacing tokens. One spacing system serves **both** (gap + padding).

> **Status:** Decided (**A-grid · B-tshirt · C one collection without reference tier · D raw**),
> collection built, **screen bound** (344 fields, 0 errors). Addenda: `space-lg`(10px)
> removed + scale renamed gaplessly (now **10 steps**); **radius semantics pulled into the same
> collection `semantic-dimension`** (spacing + radius together).

## Findings (screen scan)

- **123 auto-layout frames.** `0` dominates (gap ×186, padding ×207) — that is "no spacing",
  not a token.
- **Gaps (itemSpacing):** ~16 distinct values `1,3,4,6,7,8,9,10,12,14,15,16,17,21,112`.
- **Paddings:** ~22 distinct values `2,3,5,6,7,8,9,10,11,12,14,16,18,20,22,24,28,30,32,48,80`.
- Many **off-grid** (7, 9, 11, 14, 15, 17, 18, 21, 22, 28, 30) — the screen was **not** built
  on a strict 4px grid. Some off-grid values are however **highly frequent** and thus
  deliberate (see below), not noise.

## Raw value inventory

### Gaps (itemSpacing / counterAxisSpacing)

| px | Count | Occurrences |
|---|---|---|
| 0  | 186 | (no gap — kbd-key, type-row, required-cell, track, cnt …) |
| 1  | 2  | toggle-text |
| 3  | 1  | bar |
| 4  | 4  | Field·Active connection / SCOPE / USER / TOOL (status band fields) |
| 6  | 4  | Frame 1, source-toggles, share-bar |
| 7  | 6  | kbd-up-down, kbd-Enter, kbd-Esc |
| 8  | 12 | group-divider, grp-JUMP TO / SEARCH / RUN, icon rail |
| 9  | 2  | source-toggle-system / -custom |
| 10 | 5  | endpoint-switcher, property-search, sub-cardinality / -queryable / -source |
| 12 | 17 | palette-prompt, entry-* (command palette entries) |
| 14 | 1  | Cmd+K-pill |
| 15 | 1  | Frame 1 |
| 16 | 2  | palette-footer |
| 17 | 1  | Frame 1 |
| 21 | 1  | header |
| 112| 1  | **types-nav** (outlier — large layout offset) |

### Paddings

| px | Count | Occurrences |
|---|---|---|
| 0  | 207 | (no padding) |
| 2  | 13 | track, track-off, head |
| 3  | 12 | kbd-key |
| 5  | 12 | palette-esc, sub-cardinality / -queryable / -source |
| 6  | 6  | grp-JUMP TO / SEARCH / RUN |
| 7  | 22 | **kbd-key, type-row** (compact row padding, highly frequent) |
| 8  | 16 | palette-list, group-divider, endpoint-switcher, source-toggles, Cmd+K-pill |
| 9  | 34 | **palette-esc, entry-*** (palette entries, very frequent) |
| 10 | 17 | type-row, header, icon rail, source-toggles, head |
| 11 | 8  | palette-footer, property-search, source-toggles |
| 12 | 8  | endpoint-switcher, grp-* |
| 14 | 4  | property-search, palette-prompt |
| 16 | 21 | palette-prompt, icon rail, entry-* |
| 18 | 37 | **grp-*, palette-footer, group-divider, types-nav** (very frequent) |
| 20 | 1  | header |
| 22 | 2  | quiet-header, quiet-cta |
| 24 | 6  | types-nav, workspace-center, quiet-sec-hdr, quiet-cta, status-anchor-band |
| 28 | 10 | insp-detail-V, quiet-header, quiet-sec-hdr, quiet-cta, header, status-anchor-band |
| 30 | 3  | insp-detail-V, quiet-header |
| 32 | 27 | group-divider, workspace-center, head, row·* |
| 48 | 25 | group-divider, head, row·* |
| 80 | 1  | Frame 1 |

**Frequency heavies (deliberate values, not dupes):** padding 7 (×22), 9 (×34), 16 (×21),
18 (×37), 32 (×27), 48 (×25); gap 8 (×12), 12 (×17).

## Proposed scale (recommendation — 4px grid, T-shirt naming)

One shared spacing system for gap + padding. Recommendation: **consolidate onto a 4px
grid** and pull off-grid values to the nearest step (1–2px shifts, barely visible).
22+ raw values → **11 steps**.

Final scale (**10 steps** — `space-lg`=10px was removed afterwards, scale renamed
gaplessly; 10/11px thus fall onto `space-lg`=12):

| Token | px | consolidated from | covers |
|---|---|---|---|
| `space-2xs` | 2  | 1, 2, 3            | toggle inset, hairline gaps |
| `space-xs`  | 4  | 4, 5               | status band fields, esc inset |
| `space-sm`  | 6  | 6, 7               | kbd gaps, kbd/type-row padding, grp gap |
| `space-md`  | 8  | 8, 9               | group gaps, palette entry padding |
| `space-lg`  | 12 | 10, 11, 12, 13     | switcher/search gap, header padding, palette entry gap, grp padding |
| `space-xl`  | 16 | 14, 15, 16, 17, 18 | footer gap, icon rail, grp padding |
| `space-2xl` | 24 | 20, 21, 22, 24     | header gap, quiet-*, status band |
| `space-3xl` | 32 | 28, 30, 32         | insp-detail, row padding |
| `space-4xl` | 48 | 48                 | column padding (group divider, head) |
| `space-5xl` | 80 | 80                 | generous frame offset |

**Outlier `112` (types-nav, gap)** — see decision D.

## Decisions (structural)

- **A-grid** — consolidate onto the grid (11-step scale above); frequent values shifted by
  1–2px (7→6, 9→8, 18→16, 28→32 …). Layout shift minimal, screenshot confirms intact.
- **B-tshirt** — `space-2xs … space-6xl`.
- **C** — **no reference tier for spacing**; the spacing tokens directly (raw values, no
  alias) in **one** collection `semantic-dimension`. Name "dimension" chosen deliberately broad.
- **D** — outlier `112` (types-nav) left **raw**, skipped during binding.

**Addenda:**
- **`space-lg`=10px removed** — scale renamed gaplessly (12→lg, 16→xl, 24→2xl, 32→3xl,
  48→4xl, 80→5xl). 30 fields bound to 10px (raw values 10/11) re-pointed to `space-lg`=12.
  Scale now **10 steps**.
- **Radius added** — the 5 radius semantics (`radius-sm/md/lg/xl/full`) now **also live
  in `semantic-dimension`** (scope `CORNER_RADIUS`, still aliased to `reference-dimension`). The
  separate `semantic-radius` collection was deleted, `reference-dimension` (primitives) stays.
  → `semantic-dimension` = 10 spacing + 5 radius = **15 variables**.

## Implementation status (Figma)

Collection `semantic-dimension` — `VariableCollectionId:3070:2`, mode `value` (`3070:0`),
**15 FLOAT tokens** (did not exist before):

- **10 spacing** (Figma group `Space/`), direct values (no alias), scope `GAP`
  (gap **and** padding): `space-2xs 2 · space-xs 4 · space-sm 6 · space-md 8 · space-lg 12 ·
  space-xl 16 · space-2xl 24 · space-3xl 32 · space-4xl 48 · space-5xl 80`.
- **5 radius** (Figma group `Radius/`), scope `CORNER_RADIUS`, alias to `reference-dimension`:
  `radius-sm→4 · radius-md→6 · radius-lg→8 · radius-xl→16 · radius-full→full`.

*(Groups `Space/` + `Radius/` created by the user in Figma — leaf names unchanged. Primitive
collection `reference-radius` likewise renamed → `reference-dimension`.)*

**Base unit (CSS export):** `reference-dimension` additionally contains `space/base` = 4 (=4px,
= Tailwind's spacing base). In the CSS export (`tokens.css`) the spacing steps are in **rem** and
are computed from this base: `--space-base: 0.25rem` (4px), step = `calc(base × N)`
(2xs×0.5 · xs×1 · sm×1.5 · md×2 · lg×3 · xl×4 · 2xl×6 · 3xl×8 · 4xl×12 · 5xl×20). Figma cannot
compute → the steps stay direct values there; `space/base` is the documented unit.

**Screen binding** (`1099:9710`): **done** — 344 spacing fields (itemSpacing + 4 paddings per
auto-layout frame) bound (0 errors), 1 field skipped (112 gap, raw); radius bindings
re-pointed to the new tokens (136 corners). Bucket mapping (final): ≤3→2xs, ≤5→xs, ≤7→sm,
≤9→md, ≤13→lg(12), ≤19→xl(16), ≤26→2xl(24), ≤40→3xl(32), ≤64→4xl(48), otherwise 5xl(80).
Spacing distribution: `xl ×67 · md ×64 · lg ×55 · 3xl ×40 · sm ×38 · 2xs ×28 · 4xl ×25 ·
xs ×16 · 2xl ×10 · 5xl ×1`. Screenshot = structure intact.

## Decision log

| Step | Decision | Result in Figma |
|---|---|---|
| Philosophy | **A-grid** grid consolidation | 22+ raw values → 11 steps |
| Naming | **B-tshirt** | `space-2xs … space-6xl` |
| Collections | **C** one collection, no reference tier | `semantic-dimension`, mode `value`, direct values |
| Outlier 112 | **D** leave raw | 1 gap (types-nav) unbound |
| Screen binding | set tokens on `1099:9710` | 344 fields bound, 0 errors; structure intact |
| Addendum: `space-lg`=10 out | rename scale | 30 fields re-pointed to 12; 10 steps |
| Addendum: radius added | semantic radius → `semantic-dimension` | 5 new tokens, 136 corners re-pointed, `semantic-radius` deleted |
| Addendum 2026-06-11: `--spacing-*` collision | Steps moved from Tailwind's `--spacing-*` to `@utility` blocks (`--space-step-*`, gap/padding/margin only) — `--spacing-{step}` resolved before `--container` and overrode `max-w-md`/`w-sm`/`basis-*` (8px instead of the container scale) | CSS-only (globals.css); Figma unchanged, steps stay GAP-scoped. Details: tokens-reference §3 collision rule |
| Addendum 2026-06-11: reference consolidation | `reference-dimension` dissolved → primitives in the ONE `reference` collection, group `Dimension/` (`radius/*` + `space/base`, new IDs `3623:2…7`) | semantic-dimension aliases re-pointed (6); values/scopes unchanged |
| Addendum 2026-06-11: CSS naming `--ap-sys-*` | Semantic CSS vars = `--ap-sys-<leaf>` (`--ap-sys-space-md`, `--ap-sys-radius-lg`); CSS helper `--space-base` dropped (steps compute directly with `--ap-dimension-space-base`) | CSS-only; Figma names unchanged. Details: token-analysis-color decision log |

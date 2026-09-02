# Token analysis — Category Radius (corner radius)

Screen: reference screen "Quiet", node `1099:9710` (Figma "Agentport DS", fileKey
`nQSNLASjuLvgTh3we8Dp4s`). Sister document to `token-analysis-color.md`.
Goal: no more raw radii — all corner radii hang off semantic tokens that fit the
shadcn naming (`radius` base + `sm/md/lg/xl`, extended by `xs`/`full`).

> **Status:** Scale decided (**A1 + B2**), collections built, **screen bound**
> (34 nodes, 0 errors). `radius-xs`/`1px` rejected; r1 marks deliberately left raw.
> **Addendum:** the semantics have moved into the collection `semantic-dimension`
> (together with spacing) — `semantic-radius` deleted, `reference-dimension` (primitives, previously
> `reference-radius`) stays.
> **Update 2026-06-11 — reference consolidation:** `reference-dimension` is dissolved — the
> primitives now live in the **one** `reference` collection as group **`Dimension/radius/*`**
> (+ `Dimension/space/base`). New variable IDs (`3623:2…7`); the 6 semantic-dimension aliases were
> re-pointed, file sweep: 0 remaining bindings.
> **Update 2026-06-11 — corner vocabulary:** semantics renamed in Figma `Radius/radius-*` →
> **`Corner/corner-*`** (IDs unchanged); CSS `--ap-sys-corner-*`. Utilities are now
> **custom utilities `corner-*`** (+ sides/corners `corner-b-*` … and `corner-none`) via
> `--corner-step-*` lookup — same pattern as the space steps. **ALL `rounded-*` are dead**
> (`--radius-*: initial`, no re-mapping); twMerge knows the corner groups including
> side/corner conflicts (cn() extension).

## Findings (screen scan)

- **0 mixed-corner nodes** — all radii are uniform (no per-corner radius).
- **8 distinct raw values**, many suspiciously close (3/4, 6/7, 8/9) → near-duplicates.
- **Key insight — same raw value, two intentions** (analogous to the cyan split):
  - `track`/`track-off` (30×18, r9) and `seg-system/custom/rel` (96×6, r3) are **true
    pills** (radius = half the height) → want `radius-full`, not a fixed step.
  - `property-search` (374×39, r9) with the same r9 is **not** a pill, just a
    rounded field → fixed step.
  - `Cmd+K-pill` is named "pill" but is 640×46, r4 → **not** a pill, only slightly rounded.

## Raw value inventory

| Raw | Count | Occurrences (node names) | Role |
|---|---|---|---|
| **1**  | 4  | palette-caret ×2, C2·cmd-blue-tick, C·blue-tick | micro rounding on tiny marks |
| **3**  | 13 | kbd-key ×6, palette-esc ×2, endpoint-switcher, Frame, seg-system/custom/rel | small chips/keys/switcher **+ pill bars (seg-\*)** |
| **4**  | 5  | Cmd+K-pill, Tool·Schema(active), schema-active-marker, search-active-marker, type-row | small rounded bars/markers |
| **6**  | 2  | C2·palette-panel ×2 | command palette container |
| **7**  | 4  | type-row ×4 | row container (inner) |
| **8**  | 5  | Tool·Search/Links/Settings, source-toggle-system/custom | icon buttons, segments |
| **9**  | 4  | track ×2 (**pill**), track-off (**pill**), property-search (field) | mixed: pill **vs.** field |
| **16** | 1  | Quiet | app window / large surface |

Dimensions of the key nodes (for pill detection):

| Node | w×h | r | Pill? |
|---|---|---|---|
| Quiet | 1480×1434 | 16 | no |
| property-search | 374×39 | 9 | no (field) |
| track / track-off | 30×18 | 9 | **yes** |
| seg-system | 96×6 | 3 | **yes** |
| Tool·Search | 36×36 | 8 | no |
| source-toggle-system | 248×34 | 8 | no |
| type-row | 248×32 | 7 | no |
| Cmd+K-pill | 640×46 | 4 | no |
| endpoint-switcher | 258×33 | 3 | no |
| kbd-key | 87×20 | 3 | no |

## Proposed scale (consolidated, shadcn naming)

shadcn names radius as **one base `--radius` + steps `sm/md/lg/xl`**. Proposal: **keep the
real design values** (as with color — do not snap to shadcn defaults) and place them
into the naming scheme. 8 raw values → **4 real steps + xs + full**.

| Token | Value | consolidated from | covers | Source |
|---|---|---|---|---|
| `radius-sm`   | 4    | 3 + 4        | kbd keys, Cmd+K bar, switcher, active markers | shadcn |
| `radius-md`   | 6    | 6 + 7        | palette panel, type-row | shadcn |
| `radius-lg`   | 8    | 8 + 9(field)  | rail icons, toggles, property-search | shadcn |
| `radius-xl`   | 16   | 16           | app window, large surfaces | shadcn |
| `radius-full` | 9999 | 9(track) + 3(seg-\*) | pills: toggle tracks, share bars | **new** (shadcn style) |

**`radius-xs` (1px) rejected** — the r1 micro marks (palette-caret, blue-tick) are
negligible; handling during binding open (lift to `radius-sm` or leave raw/sharp).

## Decisions (structural)

- **A1** — keep the real design values, every step explicit (4/6/8/16); no calc model.
  Consequence for the CSS export: shadcn's `calc(--radius ± Npx)` chain is replaced by explicit
  values (set base `--radius` = `radius-lg` if needed, or omit it entirely).
- **B2** — own collection pair for radius (separate from the color "light" mode).

## Implementation status (Figma)

Two collections built (did not exist before):

- **`reference-dimension`** — `VariableCollectionId:3064:2`, mode `default` (`3064:0`),
  **5 FLOAT primitives**, all `scopes:[]` (via alias only): `radius/4`, `radius/6`,
  `radius/8`, `radius/16`, `radius/full` (=9999).
  *(Collection renamed by the user: `reference-radius` → `reference-dimension`, same ID.)*
- **Semantics in `semantic-dimension`** — `VariableCollectionId:3070:2`, mode `value`
  (shared with spacing; originally in `semantic-radius`/`3065:2`, now deleted).
  In Figma group **`Radius/`**. **5 FLOAT semantics**, scope `CORNER_RADIUS`,
  1 alias each to `reference-dimension`:
  `radius-sm`→`radius/4`, `radius-md`→`radius/6`, `radius-lg`→`radius/8`,
  `radius-xl`→`radius/16`, `radius-full`→`radius/full`.

**Screen binding** (`1099:9710`): **done** — 34 nodes bound to semantics across all 4 corners
(0 errors), 4 r1 marks deliberately skipped (raw). Pills detected via `r ≈ min(w,h)/2`
→ `radius-full`, the rest by value bucket (≤4→sm, ≤7→md, ≤9→lg, otherwise xl).
Distribution: `sm ×15 · md ×6 · lg ×6 · full ×6 · xl ×1`. Screenshot = visually unchanged.

## Decision log

| Step | Decision | Result in Figma |
|---|---|---|
| Value model | **A1** real values, explicit | one primitive per step, semantic aliases it |
| Collections | **B2** own pair | `reference-radius` + `semantic-radius`, mode `default` |
| xs | **rejected** (1px unnecessary) | `radius-xs` + `radius/1` deleted |
| Scale | sm4 / md6 / lg8 / xl16 / full | 5 primitives + 5 semantics aliased |
| r1 marks | **(b)** leave raw | 4 nodes (palette-caret, blue-tick) unbound |
| Screen binding | set tokens on `1099:9710` | 34 nodes bound, 0 errors; visually unchanged |
| Addendum: move | semantics → `semantic-dimension` | 5 new tokens (alias kept), 136 corners re-pointed, `semantic-radius` deleted |

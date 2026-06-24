# Skill feedback — component-port (2026-06-23-tooltip-root-mirror)

Task: restore the open/bottom Tooltip Root template (the user's hand-built variant) and mirror its
`Panel Position` + `Panel Content` structure to the other 7 members with correct per-side alignment.

## A — gap caused a defect (priority)

### /figma-build-rules  (also: figma-use gotchas)

**1 · Mirroring a template member — restructuring its MAIN breaks live instances (overrides dropped, instance node-id reassigned)**

| Field | Value |
|---|---|
| Why A | User-found defect. The task was "mirror this template member to the siblings"; it was misread as "rebuild the template." Rebuilding open/bottom's panel substructure (dissolve the `Panel Content` GROUP → convert `Panel Position` to auto-layout) silently broke a downstream instance: its text/size overrides were dropped and Figma reassigned the instance node id (`4388:2915` → `4388:3144`), and the panel then overlapped the trigger. User: "jetzt hast du es kaputt gemacht." |
| Gap | Neither skill warns that when a variant member is a TEMPLATE with live instances, a structural mutation of its main (reparent / group↔frame / auto-layout conversion) invalidates dependent instance overrides AND reassigns the instance's node id. Nor does it say: to propagate a template's structure to siblings, CLONE into the siblings — don't rebuild the template in place. |
| Verified | `getNodeByIdAsync('4388:2915')` → null after the restructure; the same instance reappeared as `4388:3144` at default size with the panel overlapping the trigger (screenshot). `resetOverrides()` cleaned it, but the user's override content was unrecoverable. |
| Candidate fix | Add a rule to §Composites / mirroring: to propagate a template member's structure to sibling variants, build/clone the structure INTO each sibling — never restructure the template member's own main in place when it has live instances. A structural mutation of a main (reparent, group↔frame, auto-layout conversion) is destructive to dependent instances (overrides dropped, instance node-id reassigned). If the template itself must change, warn first and expect to re-apply every instance's overrides. |
| Status | open |

## B — self-derived, result held (codify · deferred)

### /figma-build-rules

**2 · §Composites (Anchored overlay) — per-side panel anchoring for a 4-side overlay variant set**

| Field | Value |
|---|---|
| Why B | Self-derived the per-side constraint map; mirror verified correct on all 4 sides + prototype intact. |
| Gap | §Composites "Anchored overlay" says anchor the content to the trigger edge, but gives no per-side recipe for a top/bottom/left/right overlay variant set mirrored from one template member. |
| Verified | All 4 open members render the panel on the correct side, centered on the cross axis, with a constant gap when the trigger resizes (the constraint tracks the trigger edge); footprint stays = trigger (54×32); `ON_HOVER` reactions intact on all closed members. |
| Candidate fix | Recipe: wrap the chip (+ any member-level arrow) in a `Panel Position` frame (layoutMode NONE, `layoutPositioning=ABSOLUTE`, `fills=[]`, `clipsContent=false`, sized to the trigger box at 0,0) holding a `Panel Content` group; pin via per-side constraints so the panel tracks the relevant trigger edge and stays centered on the other axis — **bottom `CENTER/MAX` · top `CENTER/MIN` · left `MIN/CENTER` · right `MAX/CENTER`**. The HUG chip grows the panel in the auto-layout direction. Limitation to note: top/left long text grows TOWARD the trigger (auto-layout HUG only grows down/right) — fine for short labels; a true grow-away on top/left needs a bottom/right-anchored sub-layout, not a plain HUG. |
| Status | open |

### figma-use (gotchas)

**3 · Empty GROUP auto-dissolves; `setCurrentPageAsync` threw "Unknown node type" on an already-loaded page**

| Field | Value |
|---|---|
| Why B | Minor / env; routed around, result correct. |
| Gap | (a) Reparenting ALL children out of a GROUP auto-removes the group → a later reference to it throws "node does not exist." (b) `setCurrentPageAsync(pageNode)` threw `Internal Figma error: Unknown node type for node in getPublicNodeType` (script line 1) on a page that was already current/loaded; dropping the page-switch worked. |
| Verified | (a) `group.children` threw right after both children were moved out; (b) the script threw on the `setCurrentPageAsync` line, then ran clean once that line was removed. |
| Candidate fix | gotchas note: don't reference a GROUP after emptying it (Figma auto-dissolves empty groups). And: if the target page is already current/loaded, skip `setCurrentPageAsync` — a redundant switch can throw an internal `getPublicNodeType` error in some sessions. |
| Status | open |

### /figma-build-rules

**4 · §Composites — directional arrow as a `side` variant axis on the content component (kills duplicate arrows)**

| Field | Value |
|---|---|
| Why B | Self-derived from the user's "no duplicated arrow" directive; verified across the chip set + all 8 Root members. |
| Gap | The build skills model a per-side overlay arrow as a member-level arrow + a `showArrow` boolean on the content (B36). That DUPLICATES the arrow (one baked-but-hidden inside the content + one separate arrow per member) and scatters it across members. |
| Verified | Rebuilt the Tooltip chip into a `side` variant set (top/bottom/left/right), one arrow per variant on the matching edge (reused the existing oriented arrow frames — no rotation math); each Root member drives it via the nested chip instance's `side` variant prop; deleted all member-level arrows + the `showArrow` boolean. Verify: 0 stray member-level arrows, prototype + usage examples intact. |
| Candidate fix | For a directional arrow on overlay content (tooltip/popover), prefer a `side` variant axis ON THE CONTENT COMPONENT (one arrow per variant, on the edge facing the trigger) over a member-level arrow + `showArrow` boolean. The parent overlay set drives it via the nested instance's variant prop (Root `side` → content `side`, 1:1). One arrow per variant, zero duplication, nothing scattered at member level. Build the variants by reusing already-oriented arrow frames (clone), not by rotating one. Supersedes B36's member-level-arrow approach. |
| Status | open |

### figma-use (gotchas)

**5 · combineAsVariants — components must be on the SAME PAGE as the parent, not `figma.currentPage`**

| Field | Value |
|---|---|
| Why B | One atomic failure, routed around. |
| Gap | When building variant components to combine, appending them to `figma.currentPage` lands them on the wrong page when currentPage ≠ the build page (and `setCurrentPageAsync` may be unavailable — finding 3). `combineAsVariants` then throws "Grouped nodes must be in the same page as the parent." |
| Verified | Clones appended to `figma.currentPage`; `combineAsVariants(parent = build frame on page 3126:2)` threw "...same page as the parent". Moving the clones to the build page via `page.appendChild` (ancestor-walk to the PAGE), then combining, worked. |
| Candidate fix | Build/append variant clones onto the SAME page as the target parent — get the parent's page by walking ancestors to the PAGE node and `page.appendChild`, don't append to `figma.currentPage`. `combineAsVariants` requires every component AND the parent on one page; never assume currentPage is that page. |
| Status | open |

### /figma-build-rules

**6 · §Composites (Anchored overlay) — generalised positioning: decompose into SIDE (perpendicular) × ALIGN (parallel); the cross axis follows align (`CENTER` ⟺ align=center)**

| Field | Value |
|---|---|
| Why B | Generalised from the tooltip case. The tooltip ships only `align=center`, so the earlier per-side rule baked `CENTER` into the constraint — conflating one align value with the cross-axis. Wrong once align varies (a popover/dropdown with side × align). User: "center wenn align=center, wie bei Popover". |
| Gap | The anchored-overlay guidance (finding 2) gives a per-side constraint but bakes `CENTER` on the cross axis — only correct when there is no align axis. An overlay with start/center/end alignment must parameterise the cross axis by align. |
| Verified | Tooltip = `align=center` only → cross axis is `CENTER` (that single slice). Popover = state × side × align (start/center/end, 24 members) → the cross-axis alignment varies; center is one of three values, not a constant. |
| Candidate fix | Positioning rule — split the anchor into two orthogonal axes. **SIDE** (which trigger edge the overlay attaches to) drives the PERPENDICULAR-axis constraint that pins the overlay to that edge for a constant gap as the trigger resizes: top → (vertical) `MIN` · bottom → `MAX` · left → (horizontal) `MIN` · right → `MAX`. **ALIGN** (where along that edge it lines up with the trigger) drives the PARALLEL-axis constraint: start → `MIN` · center → `CENTER` · end → `MAX`. Compose `{horizontal, vertical}`: for top/bottom `vertical = side`, `horizontal = align`; for left/right `horizontal = side`, `vertical = align`. **`CENTER` ⟺ `align=center`, uniformly — the SAME rule as the popover**; the tooltip is not a special "align-less" case, it just ships only the align=center slice. Never bake CENTER into the constraint independently of align. Supersedes finding 2's centre-baked constraints. Caveat (panel ≫ trigger): the parallel constraint can overflow the member → keep the panel fixed at the inset and move the TRIGGER to encode start/center/end (alignment is relative; see B32). |
| Status | open |

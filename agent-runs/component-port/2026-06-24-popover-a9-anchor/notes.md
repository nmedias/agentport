# Popover — A9 anchored-overlay anchor rebuild (code→Figma, Figma-only) — 2026-06-24

Apply finding **A9** (`/figma-build-rules §Composites`, anchored overlay) to the live **Popover set
`4402:2589`** (24 members, `state × side × align`) so the overlay positioning is **constraint-driven
and resize-robust**, replacing the previous **hardcoded x/y offsets** with `constraints=MIN/MIN`.

File "Agentport DS" `nQSNLASjuLvgTh3we8Dp4s`, page "Components" `3126:2`. Plugin MCP only (whoami =
Manu). No detach. Figma-only model refinement — **no code change** (Radix Popper does the same at runtime).

## User goal + acceptance criteria

Adjust the Popover in Figma to the new A9 rule so that, **for all variants**:
1. The **gap** trigger↔panel does not change when a new trigger differs in height & width.
2. The panel **does not overlap** the trigger when the trigger content changes size.
3. The panel **does not overlap** the trigger when the **panel content** grows (longer/wider).

## The defect (before)

Each member: member `FIXED 50×32`, `PopoverContent` = `layoutPositioning=ABSOLUTE` with
`constraints={horizontal:MIN, vertical:MIN}` + **hardcoded** x/y offsets. Consequences:
- Member FIXED → swapping a bigger trigger into the HUG slot overflows; member bounds stay 50×32, so any
  edge-relative positioning anchors to the wrong box.
- MIN/MIN content → ignores trigger resize entirely (the original A9 bug: too-large gap / panel over the
  trigger) **and** grows down-right on content growth → into the trigger for top/left.

## Key empirical finding (drove the design)

**Figma `constraints` govern an ABSOLUTE auto-layout child's BEHAVIOUR in BOTH resize directions:**
- **Parent resize** (the member HUG-grows when the trigger grows): the child repositions per its
  constraints (MAX tracks the bottom/right edge, MIN the top/left, CENTER the centre).
- **Self HUG-growth** (the child's own content grows): the **same** constraints set the growth anchor —
  measured directly: `vertical=MAX` → bottom edge fixed, grows **up** (top moved −119, bottom 0);
  `vertical=MIN` → top fixed, grows **down** (top 0, bottom +119).

**Therefore a single constraint on the content cannot satisfy all three criteria.** Per side:
- Tracking the trigger edge on **trigger-resize** needs the **far** edge anchored (e.g. bottom→`MAX`).
- Growing **away** from the trigger on **content-grow** needs the **near** edge anchored (bottom→`MIN`).
These are the **opposite** edge on every side → two independent anchors are required. This is exactly why
A9 prescribes the **two-part anchor** (`Panel Position` + `Panel Content`), and why the "bottom/right
sub-anchor" caveat is in fact **mandatory** (not optional) once criterion 3 is in scope.

## The structure built (per member)

```
member (Auto-Layout VERTICAL, HUG both axes → footprint = trigger 50×32, clipsContent=false)
├─ trigger  (SLOT, HUG, default DS Button)              ← sole FLOW child; member HUGs it
└─ Panel Position (FRAME, FIXED 50×32, fills[], ABSOLUTE)   ← invisible anchor, TRACKS the trigger edge
   └─ PopoverContent (INSTANCE, ABSOLUTE)                   ← GROWS AWAY from the trigger
```

- **member → HUG** (`layoutSizingHorizontal/Vertical='HUG'`): footprint tracks the (swappable) trigger.
- **Panel Position** = FIXED-size invisible auto-layout, ABSOLUTE child of the member. FIXED so it never
  resizes — it only **moves** to stay glued to the tracked trigger edge × align-point when the member grows.
- **PopoverContent** = ABSOLUTE child of Panel Position; Panel Position never resizes, so the content faces
  no tracking job here and is free to use its constraints purely for **grow-away**.

### Constraint tables (`ALIGN`: start→MIN · center→CENTER · end→MAX)

| side | Panel Position (track edge) | Panel Content (grow away) |
|---|---|---|
| top    | `{h: ALIGN, v: MIN}` | `{h: ALIGN, v: MAX}` |
| bottom | `{h: ALIGN, v: MAX}` | `{h: ALIGN, v: MIN}` |
| left   | `{h: MIN, v: ALIGN}` | `{h: MAX, v: ALIGN}` |
| right  | `{h: MAX, v: ALIGN}` | `{h: MIN, v: ALIGN}` |

Panel Position carries A9's literal **SIDE × ALIGN** rule. Panel Content **inverts the side axis** (near
edge anchored) and keeps the **align axis** identical. `CENTER` is used **iff** `align=center` — never
hardcoded (A9's core correction). Content position within Panel Position = the original per-(side,align)
offsets (panel 288×65, trigger 50×32, sideOffset 8).

## Validation

**Throwaway rig** (rect member + rect trigger + HUG auto-layout content, 6 configs: 4 sides @ center +
bottom/start + bottom/end):
- Trigger → 90×56: gap stayed **8px, 0 overlap** on all 6.
- Content → 384×174: panel grew **away** (bottom↓, top↑, left←, right→; start/end kept their anchored
  edge), gap **8px, 0 overlap** on all 6.

**Real component** (member clones with real trigger SLOT + PopoverContent instance, 4 sides @ center):
- Fill trigger slot with 110×60 → member HUGs to 110×60, gap **8, 0 overlap** (all 4).
- Fill content slot → panel 364×235, gap **8, 0 overlap** (all 4).

**`/figma-verify` (set + section): CLEAN** — text-as-icon 0 · all 24 members HUG 50×32 · all 24 Panel
Position anchors invisible (`fills=[]`) · content nested in each · open reactions all `2`
(ON_CLICK+Esc), closed all `1` (ON_CLICK→open) — prototype intact · no overlap-at-rest on any of the 12
open members (gap=8). **Manual section check: PASS** — section `4365:2253` 1718×2528 (unchanged), SOLID
white, `sectionSpill=[]`, build frame `4390:2364` 1558×2288 (unchanged).

## Catalog delta — applied to `components-reference.md` Popover `root:` block (this session)

- `figma_synced` comment: + `A9 anchor rebuild 2026-06-24 (Figma-only)`.
- `props`: dropped the obsolete caveat ("absolute content offsets calculated for the default button size …
  a swapped trigger would need an offset adjustment") — A9 resolves exactly this.
- `structure`: rewritten to the two-stage anchor (Panel Position tracking + Panel Content grow-away),
  incl. the constraint tables and the empirical "constraints govern both" rationale.
- `note`: + Figma-model-fidelity (no code change) + the 06-24 verification numbers.

## Changed Figma node IDs

| Node | ID | Note |
|---|---|---|
| Popover set | `4402:2589` | unchanged id; 24 members restructured in place |
| · each member | (24) | `FIXED 50×32` → **HUG 50×32**; gained a `Panel Position` child |
| · Panel Position (×24) | new | FIXED 50×32, `fills=[]`, ABSOLUTE, SIDE×ALIGN tracking constraints |
| · PopoverContent (×24) | unchanged ids | reparented member→Panel Position; constraints MIN/MIN → grow-away |

Trigger SLOT `trigger#4408:0`, prototype reactions, token bindings, set name "Popover", grid — untouched
(the section was resized in the follow-up below).

## A9 feedback (for the eventual skill codification — `/figma-build-rules §Composites`)

A9's `Candidate fix` frames the "bottom/right sub-anchor" as a caveat ("pfeillos okay, sonst …"). This run
shows it is **load-bearing whenever content-grow-away (criterion 3) is required** — and the reason
(constraints govern an ABSOLUTE child's self-growth anchor too) should be stated, plus the two constraint
tables above. Single-level SIDE×ALIGN alone fixes the *trigger-resize* bug but **fails content-grow on
every side**. (Finding A9 stays open for the user to codify — skill not edited here.)

---

# Follow-up — section spill the verify missed (user flagged) — 2026-06-24

The user spotted that the **edge-column panels spill past the section's dashed border** onto the bare
canvas (left + right). My A9 section check had reported `sectionSpill=[]` — a **false PASS**.

## Why the check missed it

The section check (here and in the prior popover runs) compared only the section's **direct children**
(headline TEXT + `Build` frame) via `absoluteBoundingBox`. The Build frame's nominal box sits inside the
section, so it passed. But the overflow originates from the **panels nested ~5 levels down** (section →
Build → set → member → Panel Position → PopoverContent), which are **ABSOLUTE** and float outside their
ancestors. The check never recursed to those leaves. Two compounding traps:
- **`absoluteBoundingBox` of a mid-tree frame doesn't include a deep ABSOLUTE descendant's overflow.**
- **`absoluteRenderBounds` is unreliable here:** the COMPONENT_SET has `clipsContent=true`, so the panels'
  render bounds come back **clipped to the set** (≈1526 wide) even though they visibly render outside it —
  using render-bounds gives a *second* false PASS.

**Reliable check:** recurse to the visible `PopoverContent` **leaves** and union their
**`absoluteBoundingBox`** (unclipped geometry), then compare to the section box. That caught the real
152px-per-side spill.

Not caused by the A9 anchor change — member footprints (50×32) and panel offsets/grid are unchanged, so
this spill pre-existed today and the same weak check passed it in the earlier popover runs too.

## Fix

Corridor between **Slider** (right 11567) and **Tooltip** (left 13620) = 2053px — too narrow for the
**2022px** panel union + margins. So:
- **Section** `4365:2253` widened 1718→**2182** (x kept 11617; right 13335→13799).
- **Build frame** + headline **centered** at section-local x=312 (panels overflow symmetrically → equal
  80px margins; left-column panels now land on the white section fill left of the build frame).
- **Tooltip** section `4381:2356` nudged 13620→**13860** to clear the wider Popover (rightmost section —
  open space beyond it). Gaps after: Slider 50px, Tooltip 61px (no section overlap).

**Re-verify (reliable bbox leaf-union):** panel union 11697..13719 within section 11617..13799 → margins
left 80 / right 80 / top 305 / bottom 1449; `offenders=[]`. Screenshot: all panels on white, nothing on
canvas.

## New skill finding (for codification — `/figma-verify` §spill)

The §3 "Section/wrapper — child outside its filled area = spill FLAG" check must (a) **recurse to the
visible leaf nodes**, not stop at the wrapper's direct children, and (b) use **`absoluteBoundingBox`**, not
`absoluteRenderBounds` (clips under an ancestor's `clipsContent`) — else deep ABSOLUTE-overlay content
(popover/tooltip/dropdown panels) spills undetected. Logged to the handoff as a new A-finding.

## A9 feedback (for the eventual skill codification — `/figma-build-rules §Composites`)

A9's `Candidate fix` frames the "bottom/right sub-anchor" as a caveat ("pfeillos okay, sonst …"). This run
shows it is **load-bearing whenever content-grow-away (criterion 3) is required** — and the precise reason
(constraints govern an ABSOLUTE child's self-growth anchor too) should be stated, plus the two constraint
tables above. Single-level SIDE×ALIGN alone fixes the *trigger-resize* bug but **fails content-grow on
every side** (the anchored far edge forces growth toward the trigger). Suggest the skill record: two-stage
anchor = default for a 4-side overlay with HUG content; Panel Position FIXED + tracking constraints, Panel
Content side-axis **inverted**. (Finding A9 stays open for the user to codify — skill not edited here.)

---

# Follow-up 2 — panels still crossed the visible frame (user flagged again) — 2026-06-24

The section-widen fix put the panels on section-white but they **still crossed the Build frame** and the
**set's own dashed border**. Because A9 makes each member HUG its trigger, the overlay panels *by design*
float outside the members → outside the set's auto-sized frame → outside any wrapper. Widening an outer
container only moves the crossing outward; it never stops it.

## Real fix — pad the component set so its own frame encloses the panels

The set is `layoutMode: "GRID"`, `NO_WRAP`, primary axis **FIXED** width, padding 48. Panels overflow the
set by **296px** (panel 288 + gap 8) left/right and **73px** top (0 bottom — open members sit in the top
rows). So:
- `set.padding` L/R = **328** (296 + 32 margin), T = **105** (73 + 32), B = 48.
- `set.width` grown 1526 → **2086** by the *same* amount the L/R padding added, so the GRID **content area
  stays 1430** → columns don't squeeze, grid doesn't re-flow (verified `collisions=0`, member count 24).
- Result: `panelsOutsideSet=0` — the set's frame now contains every panel.

Then cascade: Build frame (HUG) follows to 2118 wide, **centered** in the section (`counterAxisAlignItems
=CENTER`, padding back to 16); section resized to wrap it with 80px inset → **2278×2585**; Tooltip section
nudged to `sectionRight+100`. Verified: panels ⊂ set ⊂ build ⊂ section; neighbor gaps Slider 50 / Tooltip
100; screenshot shows panels inside the set's dashed border, masters centered above, examples below, all on
white, nothing on canvas.

## Lesson (for codification — `/figma-build-rules`, overlay-display)

When members HUG their trigger and the overlay floats outside (A9), **the display container that must
enclose the panels is the SET itself, via padding** — not an outer wrapper. For a FIXED-axis GRID/auto
set: `padding = panelOverflow + margin` on each edge **and grow the fixed axis by the same total** to keep
the content area constant (else the grid squeezes/re-flows). Panel overflow per edge = panel size + gap on
the side axis (296 here), panel size + gap on the align axis only at the corners. This is the companion to
A11 (verify must catch it) and A9 (why the panels float in the first place).
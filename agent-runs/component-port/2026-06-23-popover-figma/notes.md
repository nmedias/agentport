# Popover — Figma rebuild (code→Figma push) — 2026-06-23

Item ④ from the popover review (handoff Offene Punkte #2 ④). A **code→Figma build/push** (the
documented exception to the read-only pipeline), governed by `/figma-build-rules` + `/figma-use`.
Two deliverables: **A** fix the broken section composition (finding A5), **B** model the `align`
prop the code has but Figma didn't (finding ④). Background agent, Plugin MCP only, no detach.

- File "Agentport DS" `FIGMA_FILE_KEY` · Page "Shadcn Components" `3126:2`.
- Figma connection: **Plugin MCP connected** (whoami = Manu, pro/expert). Figma-Console MCP (Desktop
  Bridge) was NOT connected, but the pipeline exception runs entirely on the Plugin MCP — proceeded.

---

## Deliverable A — section composition fix (finding A5)

### Confirmed defect (before)

Section `4365:2253` had **no auto-layout** and was sized **321×203**, while its children were freely
positioned and extended to **y≈946**:
- headline TEXT `4365:2254` (80,80) — fine as a label, but the small section fill made it read as an
  oversized white *card* containing only the headline;
- `PopoverContent` master `4365:2255` at y=200, `PopoverHeader` master `4367:2253` at y=340, and the
  `Usage Examples` frame `4368:2255` at y=480 — **all below y=203, i.e. spilling onto the dark page
  canvas**. The bare `PopoverHeader` master (dark `{Title}/{Description}` text) sat on the dark canvas
  → dark-on-dark, near-unreadable. (Screenshot evidence captured; matches A5 verbatim.)

Root cause (the A5 lesson): a Figma **SECTION is not an auto-layout container** — appended children are
not stacked/enclosed, and the section does not auto-grow.

### Fix applied

1. Created a **vertical Auto-Layout FRAME** `4390:2364` (name "Build") **inside** the section, **white
   SOLID fill** `{1,1,1}`, **HUG** both axes, `counterAxisAlignItems=MIN`. Bound spacing to DS tokens:
   `itemSpacing → space-2xl (VariableID:3070:10)`, padding (all four sides) `→ space-xl (VariableID:3070:9)`.
   Frame placed at (80,160) inside the section (below the headline).
2. **Re-parented** the three loose build children into the frame via `appendChild` (moves, **no
   detach, no rebuild**): `PopoverContent` master `4365:2255`, `PopoverHeader` master `4367:2253`,
   `Usage Examples` frame `4368:2255`. (Later the new PopoverRoot set was inserted before Usage Examples.)
3. **Headline normalized**: left as a direct **section child** label at (80,80) — the canonical Section
   anatomy (headline = label, build = inner frame). The "oversized card" impression is gone because the
   section fill now spans the whole composition, not just the headline.
4. **Resized the section** (`resizeWithoutConstraints`) to enclose the headline + frame with an 80px
   inset on all sides. Final section **1312×1133**.

### Result (verified)

- Section fill = SOLID white; **0 children spill past section bounds** (`sectionSpill: []`).
- White build frame fully contains all 4 artifacts (`buildFrameChildrenOutOfBounds: []`).
- Screenshot: headline normal-sized; PopoverContent master, PopoverHeader master, PopoverRoot set,
  Usage Examples all read on white, evenly stacked (space-2xl), nothing overlapping or on the dark canvas.

---

## Deliverable B — model `align` (finding ④)

The code (`popover.tsx` `PopoverContent.align`) has `start | center | end` (default `center`); Figma
modelled no alignment axis. **Built a real Popover Root composition** (the brief's preferred option,
not the content-axis fallback).

### What was built

A new component set **`PopoverRoot` `4393:2391`** with a single **`align` VARIANT axis**
`[start, center, end]` (default `center`, = the code default). Each member is a fixed-size,
`clipsContent=false`, transparent-fill composition that nests **real instances** (no detach):

- a real DS **Button** instance (the trigger, default member `3160:15`, deep-text override label
  "Open");
- a real **PopoverContent** instance (master `4365:2255`) below it with an 8px sideOffset gap.

The panel is fixed at the left inset; the **trigger moves** horizontally to encode `align` (alignment
is relative, so this reads identically to "panel aligned to trigger"):
- `align=start` — trigger.left = panel.left (trigger `4393:2372` at x=16);
- `align=center` — trigger centered over the panel (trigger `4392:2365` at x=135);
- `align=end` — trigger.right = panel.right (trigger `4393:2382` at x=254).

Built center first as a standalone component, validated by screenshot, then **cloned** to start/end and
repositioned the trigger (clone preserves the nested instances + bindings), then `combineAsVariants`
into the set, reordered to start/center/end (option order, sorted grid). The set was moved into the
section's white build frame (between the masters and Usage Examples).

### Decision note

Root composition was **practical** — built and clean. No fallback needed. The Button set has no text
property (label is a deep text override) — labelled via `findOne(TEXT)` + font-load + `characters`.
`align` maps 1:1 to the code prop (not a Figma-only fork).

---

## Verify

### `/figma-verify` (tree checks on PopoverRoot set `4393:2391` + build frame `4390:2364`)

| Check | Result |
|---|---|
| text-as-icon | **PASS** — 0 (no glyph-as-text; "Open" is a word label) |
| sibling overlap (non-AL) | **PASS** — 0 |
| AL padding asymmetry | **PASS** — 0 |
| clipped children | 6 hits, **all the Button's intrinsic `state-layer`** rectangle inside the
  reused Button instances (exactly fills its 50×32 parent, flush-by-design, `clipsContent=false`) —
  not introduced by this build, lives inside a reused instance (must not detach/edit). |

**Verdict: CLEAN** for the built nodes. (The 6 state-layer entries are Button anatomy, identical to
every Button instance in the file.)

### Manual section-composition check (the C7 gap — figma-verify doesn't cover it)

Programmatic + screenshot:
- Section `4365:2253` = 1312×1133, SOLID white fill; **sectionSpill = []** (no child past bounds).
- Build frame `4390:2364` = white SOLID fill; **buildFrameChildrenOutOfBounds = []**.
- Screenshot confirms: every part on white, no overlap, headline normal, nothing on the dark canvas.

**Manual check: PASS.**

### Sibling sections (flag-only, NOT fixed)

Checked Toggle `4374:2289`, Toggle Group `4374:2291`, Tooltip `4381:2356`: **all spillCount 0** — their
sections are correctly sized to enclose their children. None uses a white inner AL frame either, but they
don't need one because their sections were sized to fit. **The no-AL/undersized-section defect was
Popover-specific** (only Popover's section was left at 203px tall while content ran to ~946px).

---

## Catalog delta — apply to `design-docs/design-system/components-reference.md`, Popover entry

(Team-lead applies + commits — do NOT edit the catalog from this run.)

The Popover `figma:` block currently has: `section`, `content`, `slot`, `header`, `examples`, `vars`,
`effect`, `axis: { }` (empty). Apply:

1. **New: white build-frame wrapper** — record that the section now wraps its build in a white vertical
   Auto-Layout frame:
   ```
   build_frame: { name: "Build", id: "4390:2364" }   # white vertical AL (HUG), itemSpacing space-2xl, padding space-xl; holds masters + PopoverRoot + Usage Examples (A5 fix)
   ```
2. **New: PopoverRoot align composition** (new member of the `figma:` block):
   ```
   root:
     set: { name: "PopoverRoot", id: "4393:2391" }
     axis: { align: [start, center, end] }            # default center; maps 1:1 to code PopoverContent.align (NOT a fork)
     members: { start: "4393:2371", center: "4392:2364", end: "4393:2381" }
     nests: "real DS Button instance (trigger, default member 3160:15, label 'Open') + real PopoverContent instance (master 4365:2255); trigger moves horizontally to encode align; clipsContent=false so panel+shadow not clipped"
   ```
3. **`axis:`** — the top-level `axis: { }` stays empty for the **content** surface (no state axis), but
   the component now also carries the **PopoverRoot `align` axis** (recorded under `root.axis` above).
   Optionally note in the entry: `align now modelled (PopoverRoot set 4393:2391) — closes review item ④`.
4. **notes** — append a sentence: "2026-06-23 Figma rebuild (code→Figma): section composition fixed
   (A5 — children re-parented into a white vertical AL build frame `4390:2364`, section resized 1312×1133,
   nothing spills onto canvas); `align` modelled as a Popover Root set `4393:2391` (align axis
   start/center/end, real nested Button + PopoverContent instances). figma-verify CLEAN; manual
   section-composition check PASS."

### New / changed Figma node IDs (summary)

| Node | ID | Note |
|---|---|---|
| Build frame (white vertical AL) | `4390:2364` | NEW — A5 fix wrapper, inside section `4365:2253` |
| PopoverRoot set | `4393:2391` | NEW — `align` axis [start, center, end] |
| · align=start member | `4393:2371` | trigger `4393:2372` |
| · align=center member | `4392:2364` | trigger `4392:2365`, panel `4392:2369` |
| · align=end member | `4393:2381` | trigger `4393:2382` |
| Section (resized) | `4365:2253` | 321×203 → **1312×1133** |

Unchanged (reused, re-parented into the build frame): PopoverContent master `4365:2255`, PopoverHeader
master `4367:2253`, Usage Examples `4368:2255` (and its children).

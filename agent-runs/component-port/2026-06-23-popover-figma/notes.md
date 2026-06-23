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

---

# Follow-up — PopoverRoot extended to a FULL interactive-overlay model — 2026-06-23

Second task on the same run: the review found the first PopoverRoot (`4393:2391`) was a **static**
3-member `align`-only composition. The user wanted the **complete interactive-overlay model, full scope
("voll")** — all three axes + a swappable trigger + absolute content + an on-click prototype. Rebuilt
the PopoverRoot as a new 24-member set; the old static set `4393:2391` was **removed** (replaced in the
white Build frame). Reuse-not-rebuild on the nested instances (no detach).

## New set — `PopoverRoot` `4402:2589` (replaces the static `4393:2391`)

**Variant matrix — 3 axes, 24 members (full "voll"):**
`state` [closed, open] × `side` [top, right, bottom, left] × `align` [start, center, end] = **24**.
Plus an **INSTANCE_SWAP** property `trigger#4402:0` (default = DS Button member `3160:15`). Property
defaults: state=open, side=bottom, align=center.

- **open** (12 members): trigger + PopoverContent both present; content positioned per (side, align).
- **closed** (12 members): trigger only, the content instance `visible=false` (degenerate across
  side/align — visually identical trigger-only, as the user accepted; built anyway for the full axes
  AND because each closed member carries a distinct prototype reaction to its matching open member).

**Trigger as INSTANCE_SWAP (mirrors `asChild`):** the trigger is a real DS Button instance whose
`mainComponent` is bound to the set-level INSTANCE_SWAP prop `trigger#4402:0` → a consumer can swap in
their own control. Chose INSTANCE_SWAP over a Slot because the trigger must exist in all 24 members and
the **member frame** (not the swapped instance) carries the prototype click reaction → swapping the
trigger doesn't break the prototype.

**Content absolutely positioned (anchored overlay, no reflow):** each member is a **FIXED-size
(650×178) auto-layout COMPONENT** with `clipsContent=false`; the **trigger is the centered flow child**
and the **PopoverContent is `layoutPositioning=ABSOLUTE`** anchored to the trigger by (side, align) with
an 8px sideOffset gap. Toggling closed→open reveals/hides the absolute content WITHOUT reflowing the
trigger (the requirement). Trigger reference box centered at (296,73), 58×32; panel 288×65.

Absolute content positions (member-frame coords):
- `side=bottom` y=113 · `side=top` y=0 · `side=right` x=362 · `side=left` x=0
- horizontal align (top/bottom): start x=296 · center x=181 · end x=66
- vertical align (left/right): start y=73 · center y=57 · end y=40

**Why a FIXED auto-layout frame (Figma constraint — see skill-feedback):** `layoutPositioning=ABSOLUTE`
throws `Can only set … if the parent node has layoutMode !== NONE`. A Figma SECTION-style NONE frame
can't carry an ABSOLUTE child. So the member is an auto-layout frame (trigger = flow child, centered via
`primaryAxisAlignItems/counterAxisAlignItems=CENTER`), content = ABSOLUTE child by x/y. FIXED size so the
member has a stable bounding box for the variant grid.

**On-click prototype (`setReactionsAsync`, CHANGE_TO between variants):**
- each **closed** member: `ON_CLICK` → CHANGE_TO the matching **open** member (same side/align),
  DISSOLVE 0.2s.
- each **open** member: `ON_CLICK` → CHANGE_TO the matching **closed** member, AND
  `ON_KEY_DOWN [27/Esc]` → CHANGE_TO the matching closed member. (Click-outside isn't expressible on a
  variant member — that's overlay-background behaviour — so the open-state dismiss is click-on-member +
  Esc; demoable open/close flow.)
- Verified: closed bottom/center `4402:2469` → open `4399:2385`; open `4399:2385` → closed `4402:2469`
  (+ Esc). All 24 wired.

**Layout:** the set is a sorted WRAP grid (3 `align` columns × 8 `side`/`state` rows), placed in the
white Build frame `4390:2364` in the old set's slot (between the masters and Usage Examples). Section
`4365:2253` resized to **2334×2772**.

## Verify (extended set)

- `/figma-verify` tree checks on set `4402:2589` + build frame: **text-as-icon 0 · visible
  trigger↔panel overlap 0 · padding-asym 0 → CLEAN**. (ABSOLUTE panels don't overlap the trigger box —
  sideOffset keeps them apart; hidden closed panels excluded.)
- **Manual section-composition check: PASS** — section SOLID white, `sectionSpill=[]`,
  `buildFrameChildrenOutOfBounds=[]`, full matrix + masters + examples all read on white (screenshot).
- **Prototype (can't auto-verify):** screenshotted closed bottom/center (trigger only, trigger at the
  SAME position as open → no reflow) + open right/start (panel anchored right, top-aligned) + the full
  24-member grid. Reactions read back correctly (destinations point at the matching counterpart).

## Updated catalog delta — Popover entry `components-reference.md`

(Team-lead applies + commits.) The `root:` block added in commit 094095f described the **static** set
`4393:2391` — **replace it** with the interactive model:

```
root:
  set: { name: "PopoverRoot", id: "4402:2589" }          # was 4393:2391 (static align-only) — REMOVED/replaced
  axis: { state: [closed, open], side: [top, right, bottom, left], align: [start, center, end] }  # 24 members
  props: "trigger#4402:0 (INSTANCE_SWAP, default DS Button 3160:15 — mirrors asChild; swappable trigger)"
  defaults: "state=open, side=bottom, align=center"
  structure: "each member = FIXED 650×178 auto-layout, clipsContent=false; trigger = centered flow child (real DS Button instance); PopoverContent = layoutPositioning=ABSOLUTE anchored by side+align, sideOffset 8 (anchored overlay, no reflow). closed = content visible=false (trigger only)."
  prototype: "closed → ON_CLICK CHANGE_TO matching open; open → ON_CLICK + ON_KEY_DOWN(Esc) CHANGE_TO matching closed (DISSOLVE 0.2s). open/close flow demoable."
  members_sample: { "open/bottom/center": "4399:2385", "closed/bottom/center": "4402:2469" }   # 24 total in the set
  note: "state×side×align is a Figma-only interactive model; the code drives side/align via PopoverContent props and open/closed via Radix runtime — NOT a CVA. Do not sync state/side/align back as code props."
```

notes addendum: "2026-06-23 (follow-up): PopoverRoot rebuilt static→FULL interactive overlay — set
`4402:2589`, 24 members (state×side×align), INSTANCE_SWAP trigger (`asChild` proxy), absolute-positioned
content (anchored overlay, no reflow), on-click+Esc prototype (closed↔open). Old static set `4393:2391`
removed. figma-verify CLEAN; manual section check PASS. Section → 2334×2772."

### New / changed Figma node IDs (follow-up)

| Node | ID | Note |
|---|---|---|
| PopoverRoot set (interactive) | `4402:2589` | NEW — 24 members, state×side×align + trigger INSTANCE_SWAP |
| · base open/bottom/center | `4399:2385` | template member (trigger `4399:2386`, abs panel `4399:2390`) |
| · closed/bottom/center | `4402:2469` | trigger-only; prototype → open `4399:2385` |
| trigger swap prop | `trigger#4402:0` | INSTANCE_SWAP, default Button `3160:15` |
| old static PopoverRoot | `4393:2391` | **REMOVED** (replaced) |
| Section (resized again) | `4365:2253` | 1312×1133 → **2334×2772** |

---

# Refinement — HUG the trigger + rename PopoverRoot → Popover — 2026-06-23

Two follow-up refinements to set `4402:2589` (same run):

## 1. Each member HUGs the trigger (not the FIXED 650×178 box)

Changed all 24 members from FIXED 650×178 to **HUG both axes** (`primaryAxisSizingMode='AUTO'` +
`counterAxisSizingMode='AUTO'`): the member footprint is now **exactly the trigger = 50×32** (verified
all 24). The trigger is the only flow child (sits at origin); the **PopoverContent stays
`layoutPositioning=ABSOLUTE` + `clipsContent=false`** → absolute children are excluded from HUG sizing,
so the panel floats OUTSIDE the trigger-sized member bounds (correct for an overlay).

**Recomputed absolute content offsets** (relative to trigger at origin, trigger 50×32, panel 288×65,
sideOffset 8 — negative for top/left, as expected for a floating overlay):
- `side=bottom` y=40 · `side=top` y=−73 · `side=right` x=58 · `side=left` x=−296
- horizontal align (top/bottom): start x=0 · center x=−119 · end x=−238
- vertical align (left/right): start y=0 · center y=−16 · end y=−33

**Set-grid spacing:** trigger-sized members with overflowing panels would collide at the old
itemSpacing 48. Re-spaced the WRAP grid generously — **itemSpacing 640, counterAxisSpacing 180**
(maxWidth 1526 = 3 columns) — computed so the right-reaching panel of one member (+346 from its trigger)
clears the left-reaching panel of the next (−296). **Verified 0 member-to-member panel collisions** in
the set (full visual-extent bbox test). So the grid is cleanly SPACED, not overlapping — no by-design
overlap flag needed. (The component HUGs the trigger as required; the set-grid stays readable.)

## 2. Renamed set `PopoverRoot` → `Popover`

Set `4402:2589` renamed to **`Popover`** (matches the code's `Popover` root export). `PopoverContent`
master `4365:2255`, `PopoverHeader` master `4367:2253` keep their names.

## Verify (after HUG + rename)

- All 24 members = 50×32 (trigger-sized) — HUG confirmed.
- `/figma-verify`: text-as-icon 0, padding-asym 0 → CLEAN. Member panel-collision in set: **0**.
- Manual section-composition check: **PASS** — section SOLID white, `sectionSpill=[]`, `frameOut=[]`,
  full matrix + masters + examples read on white (screenshot). Build frame → 1558×2288, section resized
  1718×2528 (smaller than the FIXED-box version since members now hug).
- Prototype reactions, INSTANCE_SWAP `trigger#4402:0`, token bindings — all intact (untouched).

## Updated catalog delta — Popover entry `components-reference.md` (supersedes the prior `root:` block)

(Team-lead applies + commits.) Update the `root:` block:

```
root:
  set: { name: "Popover", id: "4402:2589" }              # RENAMED from "PopoverRoot"
  axis: { state: [closed, open], side: [top, right, bottom, left], align: [start, center, end] }  # 24 members
  props: "trigger#4402:0 (INSTANCE_SWAP, default DS Button 3160:15 — mirrors asChild; swappable trigger)"
  defaults: "state=open, side=bottom, align=center"
  structure: "each member HUGS the trigger (footprint = trigger 50×32, auto-layout HUG both axes); trigger = sole flow child at origin (real DS Button instance); PopoverContent = layoutPositioning=ABSOLUTE + clipsContent=false, floats OUTSIDE the trigger-sized bounds anchored by side+align, sideOffset 8 (anchored overlay, no reflow). closed = content visible=false (trigger only). Set WRAP grid spaced itemSpacing 640 / counterAxisSpacing 180 so overflowing panels don't collide (0 collisions)."
  prototype: "closed → ON_CLICK CHANGE_TO matching open; open → ON_CLICK + ON_KEY_DOWN(Esc) CHANGE_TO matching closed (DISSOLVE 0.2s). open/close flow demoable."
  members_sample: { "open/bottom/center": "4399:2385", "closed/bottom/center": "4402:2469" }   # 24 total
  note: "state×side×align is a Figma-only interactive model; the code drives side/align via PopoverContent props and open/closed via Radix runtime — NOT a CVA. Do not sync state/side/align back as code props."
```

notes addendum: "2026-06-23 (refinement): each member now HUGS the trigger (footprint = trigger 50×32,
not the FIXED 650×178 box); PopoverContent floats as an ABSOLUTE overlay outside those bounds (offsets
recomputed rel. trigger-at-origin). Set renamed PopoverRoot→Popover. WRAP grid spaced 640/180 → 0 panel
collisions. figma-verify CLEAN; manual section check PASS; section → 1718×2528."

### Changed Figma node IDs (refinement)

| Node | ID | Note |
|---|---|---|
| Set (renamed + members HUG) | `4402:2589` | `PopoverRoot`→**`Popover`**; 24 members each FIXED 650×178 → **HUG 50×32** |
| Section (resized) | `4365:2253` | 2334×2772 → **1718×2528** (members hug → smaller set) |

(Member IDs, trigger swap prop, prototype reactions, token bindings — unchanged. Absolute panel
positions recomputed in-place on the same panel nodes.)

# Tooltip — Figma Root overlay + A8 arrow fix (code→Figma push) — 2026-06-23

Tooltip's **A6 interactive-overlay model** (lean) + the **A8 arrow fix**, reusing the popover
overlay+slot recipe adapted for a tooltip. A code→Figma build (pipeline exception), Plugin MCP only,
no detach. File "Agentport DS" `FIGMA_FILE_KEY` · Page "Shadcn Components" `3126:2` ·
Tooltip section `4381:2356`.

---

## A8 — arrow fix (content chip `4382:2356`)

### Defect (before)

The tooltip chip carries a DS `border` (1px, `strokeAlign=INSIDE`, bound `border` `VariableID:3038:4`)
— a DS addition; stock tooltip was borderless. The arrow was a **borderless** 10×10 RECTANGLE rotated
−45° (a white diamond, fill `dialog-fill`, no stroke) sitting just below the chip's bottom edge → it
read **detached/seamed**: the chip's bottom border line ran straight across, and the borderless white
diamond floated below it, disconnected (screenshot `tooltip-arrow-before`).

### Fix (after)

Replaced the rotated-square arrow with a proper **down-pointing triangle pointer** (`createNodeFromSvg`):
- triangle 14 wide (base) × 7 tall (point), **white fill bound `dialog-fill`**;
- **`border` stroke on the TWO SLANTED edges only** — the top/base edge is OPEN (it joins the chip), so
  there's no border line across the base. (SVG: fill `M0 0 L14 0 L7 7 Z`; stroke path `M0 0 L7 7 L14 0`
  — an open polyline = no stroke on the top edge.)
- **base overlaps 1px UP into the chip body** (`y=29` on the 30-tall chip) so the triangle's white fill
  covers the chip's bottom-border pixel at the junction → **no seam, no gap**.

Result: the arrow reads as a CONNECTED pointer — its two stroked edges continue the chip's border down
to the point, white fill flush with the chip, no detached diamond (screenshot `tooltip-arrow-after`).
New arrow node `4414:2493` (a FRAME from the SVG, `layoutPositioning=ABSOLUTE`, centered, the two inner
VECTORs fill/stroke-bound to `dialog-fill`/`border`). Old arrow `4382:2358` removed.

### EXACT arrow approach for the tooltip.tsx CODE mirror

This is the standard CSS/SVG tooltip-arrow. Mirror it in `tooltip.tsx` (`TooltipArrow`):
- The arrow is a **triangle**, NOT a bordered square/diamond. Fill = the chip surface (`dialog-fill`);
  the **two slanted edges** carry the chip's `border` colour; the **base edge has no border** (it abuts
  the chip).
- **Overlap the chip edge by ~1px** (translate the arrow ~1px toward the chip / negative margin) so the
  chip's border on that edge is covered by the arrow fill → no seam.
- Radix's `TooltipArrow` renders an SVG triangle: give it `fill=dialog-fill`, and add the two slanted
  border edges (e.g. a slightly larger border-coloured triangle behind it, or `stroke` the two non-base
  edges), then nudge it 1px into the content. Radix auto-orients the arrow per `side`, which is why the
  CODE needs only ONE arrow (Figma needs the per-side orientation handled manually — see below).

---

## A6 — Tooltip Root (lean interactive overlay)

### Set — `Tooltip Root` `4419:2781`

**Lean matrix: `state` [closed, open] × `side` [top, right, bottom, left] = 8 members** (NO align axis —
tooltips center-align; user chose schlank). Defaults **state=open, side=top** (tooltip's default side).
Plus a merged **`trigger#4419:0` SLOT** prop.

- **Trigger = HUG SLOT** (default = DS Button instance `3160:15`, label "Hover"): sizing chain Button
  (54×32) → slot HUG (own HORIZONTAL auto-layout) → member HUG (54×32). Footprint = trigger. Same recipe
  as the popover trigger slot. (combineAsVariants merged the 8 slots to ONE prop automatically this time;
  re-bind+dedup pass ran anyway as a guard — 1 prop.)
- **Content = the Tooltip chip instance `4382:2356`** (the A8-fixed chip) as **`layoutPositioning=ABSOLUTE`
  + `clipsContent=false`**, anchored per side with **sideOffset 6**, center-aligned. Toggling closed→open
  reveals/hides the chip without reflowing the trigger.
- **closed** members = trigger only (chip + member-arrow `visible=false`).

### Per-side arrow direction (the real complication + how it was solved)

The chip's baked arrow points DOWN (good for `side=top`). For the other sides the arrow must point at the
trigger (bottom→up, left→right, right→left). **Figma constraint:** `rotation` CANNOT be overridden in an
instance (`This property cannot be overridden in an instance`), and rotating the whole chip instance
rotates the LABEL TEXT too (unreadable). So:
- Added a **`showArrow#4418:0` BOOLEAN** (default true) to the content chip, bound to the baked arrow's
  visibility.
- `side=top`: use the baked down-arrow (`showArrow=true`).
- `side=bottom/left/right`: `showArrow=false` (hide baked arrow) + a **member-level oriented triangle**
  (same border-aware build: white `dialog-fill`, `border` on the 2 slanted edges, 1px overlap) pointing
  up/right/left at the trigger. Text stays upright, arrow points correctly.

### Hover prototype (tooltip semantics)

Each **closed** member: **`ON_HOVER` ("While hovering")** → CHANGE_TO the matching **open** member (same
side), DISSOLVE 0.15s. Figma's While-hovering **auto-reverts to closed on mouse-leave** → open-on-hover /
close-on-leave, exactly tooltip behaviour. **No click, no Esc** (a tooltip isn't click-dismissed); no
open→closed reaction needed (the hover revert handles close). Reactions on the **member frame** (survive
slot swap). Verified: closed/top → open/top, etc.

### Placement + grid

Set sits in a **white vertical Auto-Layout build frame `4420:2530`** (white fill, HUG, space-2xl/space-xl
bindings) inside section `4381:2356`, with the chip master + Usage Examples (matches the popover section
composition). Set laid out as a WRAP grid: **4 columns (side) × 2 rows (state)**, itemSpacing 280 /
counterAxisSpacing 160 — **0 member-to-member collisions** (visual-extent test incl. floating chips).
Section resized to **1368×909**.

---

## Verify

- All 8 members 54×32 (trigger-sized HUG). ONE `trigger` SLOT prop. All 4 closed members carry ON_HOVER.
- `/figma-verify` tree checks: text-as-icon 0, padding-asym 0, member collision 0 → **CLEAN**.
- **Manual section-composition check: PASS** — section SOLID white, `sectionSpill=[]`, `frameOut=[]`,
  matrix + chip master + Usage Examples all read on white (screenshot `tt-section-final`).
- **Arrow: connected, no gap/seam** — before/after screenshots (`tooltip-arrow-before` / `-after`); the
  fix also propagates to the Usage-Examples chips (instances of `4382:2356`).
- Prototype (can't auto-verify): screenshotted closed (trigger only) + open (all 4 sides) members.

---

## Catalog delta — Tooltip entry `components-reference.md`

(Team-lead applies + commits.) Add a `root:` block + an arrow-fix note to the `arrow:` line.

```
root:
  set: { name: "Tooltip Root", id: "4419:2781" }
  axis: { state: [closed, open], side: [top, right, bottom, left] }   # 8 members, LEAN (no align — tooltips center)
  props: "trigger#4419:0 (SLOT, HUG, default = DS Button instance — swappable trigger)"
  defaults: "state=open, side=top"
  structure: "each member HUGS the trigger (footprint 54×32). Trigger = a HUG SLOT holding a DS Button default. Content = the Tooltip chip instance 4382:2356 as layoutPositioning=ABSOLUTE + clipsContent=false, anchored per side, sideOffset 6, center-aligned. closed = chip+arrow visible=false. Per-side arrow: side=top uses the chip's baked down-arrow (showArrow=true); side=bottom/left/right set showArrow=false + a member-level oriented triangle (Figma can't override arrow rotation in an instance, and rotating the instance rotates the label text)."
  prototype: "ON_HOVER ('While hovering') on each closed member → CHANGE_TO matching open (DISSOLVE 0.15s); Figma auto-reverts on leave = open-on-hover/close-on-leave. No click, no Esc. Reactions on the member frame."
  build_frame: { name: "Build", id: "4420:2530" }   # white vertical AL wrapper in the section (matches popover)
  note: "state×side = Figma-only interactive model; the code drives side via TooltipContent.side and open/close via Radix hover runtime — NOT a CVA. Trigger is a SLOT (reaction on the member frame → swap-safe)."
```

arrow-fix note on the content (`arrow:` line, content component `4382:2356`):
```
arrow: "down-pointing TRIANGLE pointer 4414:2493 (was a borderless rotated square 4382:2358 — A8 fix). White fill (dialog-fill) + border stroke on the 2 SLANTED edges only (base edge open = joins chip); base overlaps 1px into the chip so the chip's bottom-border seam is covered → reads as a CONNECTED pointer, not a detached diamond. showArrow#4418:0 boolean toggles it (for the per-side member-arrow swap in Tooltip Root)."
```

### New / changed Figma node IDs

| Node | ID | Note |
|---|---|---|
| Tooltip Root set | `4419:2781` | NEW — 8 members (state×side), trigger SLOT, ON_HOVER prototype |
| · open/top (base) | `4416:2493` | trigger slot `4418:2516`; baked down-arrow |
| · closed/top | `4419:2514` | trigger only |
| trigger SLOT prop | `trigger#4419:0` | merged, default DS Button |
| Content arrow (fixed) | `4414:2493` | triangle pointer — replaced square `4382:2358` |
| showArrow boolean | `showArrow#4418:0` | on content chip `4382:2356`, toggles baked arrow |
| Build frame | `4420:2530` | white vertical AL in section `4381:2356` |
| Section (resized) | `4381:2356` | 953×789 → **1368×909** |

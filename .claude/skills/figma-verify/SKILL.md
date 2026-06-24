---
name: figma-verify
description: "Deterministic pre-return check for any Figma build agent. Trigger before returning a built or redesigned node from design-punk or sketch-jammer runs, or when the user says 'verify the build', 'check icons', 'check clipping', 'check overlap', 'verify before handoff', 'is this icon a vector', 'pre-handoff check'."
user-invocable: false
---

# DS Figma Verify

Read-only pre-return check for a built/redesigned Figma node. Catches the
deterministic build defects the calling agent's eye and prose discipline do
not reliably enforce: text-node icons, clipped children, sibling overlap,
padding asymmetry, edge-bleeding colour mass without acknowledgement.

**Figma access:** Figma Plugin MCP only (`mcp__plugin_figma_figma__*`).

## Inputs

```
node:  Figma node URL or id   # REQUIRED. The built node to verify.
```

If no node was given, ask for it.

## Steps

**Throughout — skip `visible:false` nodes (and their subtrees) in every walk:** a toggled-off slot/part isn't a build defect.

1. **Capture.** `get_design_context` on the node — full tree with text contents,
   types, fills, padding values. Take `get_screenshot` at `maxDimension` ≥ 1200
   for the human-visible record only; checks below are tree-based.

2. **Walk every TEXT descendant.** Two classes of glyph, two rules.

   **Class A — always-icon glyphs.** Functional UI glyphs, never typography:
   `→ ← ↑ ↓ ↗ ↖ ↘ ↙ ⏎ ↵ × ✕ ✓ ✔ ⊕ ⊖ ⊗ ⌫ ⎋ ⏏ ⏵ ⏸ ⏹ ⏺ ⌘ ⌥ ⌃ ⇧`

   → **FLAG · text-as-icon.** Any text node whose visible content is exactly
   one of these chars (no other text in the node) — **regardless of font,
   size, or weight.** Arrows in chips, close glyphs, return-key marks, etc.
   are icons even at 10pt.

   **Class B — maybe-icon glyphs.** Often typography, sometimes icons:
   `· • ◦ ★ ☆ ✦ ✱` plus known icon words `info i check tick dot plus minus
   close menu`.

   → **FLAG · text-as-icon** only when ALL of:
   - text node content is exactly the glyph/word (standalone)
   - font is Bold/Semibold OR Medium-and-larger-than-body OR mono ≥ 16pt
   - parent is NOT a paragraph/body container (no sentence siblings)

   This avoids flagging `·` separators or bullets used as typography.

   **Fix for every FLAG.** Replace with vector from `search_icons` placed via
   `figma.createNodeFromSvg`, or component-instance from the icon library.

3. **Walk every CONTAINER and its direct children.** For each child, read its
   bounding box (`x / y / width / height`) and the parent's inner box (minus
   padding). Flag if:
   - `child.x < 0` OR `child.y < 0` OR
   - `child.x + child.width  > parent.width  - parent.paddingRight`  OR
   - `child.y + child.height > parent.height - parent.paddingBottom`

   → **FLAG · clipped child.** Report node-id, parent-id, and the overflow
   axis + amount. Fix: resize the parent, shrink the child, or set explicit
   truncation/wrap.
   - **Full-bleed child** — bbox matches the parent's **full** box (flush past the padding, e.g. a
     `state-layer` at 0,0,W,H), within 1px → **designated, not clipped** (skip / SOFT HINT); often a
     nested instance, un-editable without detach.
   - **Section/wrapper** is a container too — a child outside its **filled** area (on the bare canvas) is a
     spill FLAG, not CLEAN.
   - **Absolute overlay descendant** (`layoutPositioning=ABSOLUTE` floating outside its parent — anchored
     panels/menus) escapes a direct-children walk and is absent from any ancestor's `absoluteBoundingBox`.
     **Recurse to the visible leaf** and test its **`absoluteBoundingBox`** against *every* enclosing
     container it must stay inside — its own component/set frame **and** the section — flag if it exceeds
     **any** (checking only the outermost reads CLEAN while it still crosses an inner frame). **Never
     `absoluteRenderBounds`** here: it clips to the nearest `clipsContent` ancestor, so an overflowing
     panel reads in-bounds (false PASS).

4. **Walk every NON-AUTO-LAYOUT container.** For each pair of direct children
   with visible fills/strokes, test bbox intersection. Flag if any two children
   overlap by > 1px on both axes (auto-layout siblings cannot overlap, so skip
   those).

   → **FLAG · sibling overlap.** Report the two node-ids and the overlap
   region. Fix: reorder, reposition, or move into an auto-layout frame.
   - **Designated control overlap** — a child named like a **handle/thumb/knob** over a sibling
     **track/rail/groove** must sit on it by design → **SOFT HINT**, not FLAG (caller confirms).

5. **Walk every AUTO-LAYOUT FRAME.** For each, read `paddingLeft / Right /
   Top / Bottom`. Flag if:
   - `paddingLeft ≠ paddingRight` and difference > 1px, OR
   - `paddingTop ≠ paddingBottom` and difference > 1px

   → **SOFT HINT · padding asymmetry.** Report node-id and the unequal pair.
   Not auto-fail — intentional asymmetry is legitimate, but must be
   acknowledged in the calling notes.

6. **Walk every FRAME / RECTANGLE / VECTOR with solid fill.** Flag if any
   edge of the node is flush with (within 1px of) the outer container's edge:

   → **SOFT HINT · edge-flush mass.** Same status as slop-check's edge-flush
   hint — intentional vs. accidental crop is the caller's verdict; report so
   they can confirm.

## Output

Markdown table — id, check, PASS/FLAG/HINT, evidence — followed by:

- **Verdict:** `CLEAN` (0 flags, hints ok) · `FIX` (≥1 FLAG)
- **Per FLAG:** the one change that clears it
- **Per HINT:** one line asking the caller to confirm intent

## Boundaries

- Read-only. Skill diagnoses; the caller fixes.
- List is fixed. If something else looks broken, mention it in the verdict
  line — don't invent rows.
- This skill does not replace `slop-check` (aesthetic) or visual review —
  it covers deterministic build correctness only.

## Common rationalisations to refuse

| Excuse | Reality |
|---|---|
| "The mono `×` looks tighter than the Remix vector" | Caller's verdict. Skill still FLAGs — they can deviate consciously, not by accident. |
| "It's stylised as text, not as an icon" | If it carries icon semantics (close, info, check, status), it's an icon. FLAG. |
| "Only one tiny glyph" | One is enough — the original failure was a single `×`. FLAG. |
| "The font ships with that glyph natively" | Native ≠ vector. Text rendering and a vector node have different selection, scaling, and a11y. FLAG. |

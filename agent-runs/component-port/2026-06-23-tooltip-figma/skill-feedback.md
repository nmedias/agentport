# Skill-Feedback — Tooltip Root + arrow fix (2026-06-23)

Capture ON. Findings pre-sorted A/B/C × edit-target file (`.claude/skills/skill-feedback`):
A = gap caused a defect; B = self-derived, result held (codify, deferred); C = tooling/already-covered.
General, agent-directed phrasing (memory `skill-writing-style`). NEVER edit the target skills here.

---

### B — self-derived, result held (codify · deferred)

#### /figma-build-rules (§Composites / §Mechanism)

**B(tooltip-figma-1) · A directional arrow/pointer on a per-`side` overlay can't be reoriented in a
nested instance → hide it via a boolean + add a member-level oriented arrow (don't rotate the instance)**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived once two Figma constraints bit; result is clean (text upright, arrows point at the trigger). No defect shipped. |
| Gap | For an anchored overlay whose content carries a **directional pointer** (tooltip/popover arrow) and a per-`side` axis, the arrow must reorient per side. Two Figma limits aren't noted anywhere: (1) a child's `rotation` CANNOT be overridden in an instance (`This property cannot be overridden in an instance`); (2) rotating the whole content instance rotates its LABEL TEXT too (unreadable). So you can neither rotate the baked arrow per-member nor rotate the chip. |
| Verified | `arrow.rotation=180` on a nested chip instance threw; cloning+rotating the chip instance produced sideways/upside-down `{Label}` text. Solution that worked: add a `showArrow` BOOLEAN to the content (bound to the baked arrow's visibility) → for the non-default sides set `showArrow=false` and add a **member-level oriented triangle** (built fresh per direction); the default side keeps the baked arrow. Text upright, arrows correct. |
| Candidate fix | Note for a directional pointer on a per-side overlay: you cannot rotate a baked arrow inside a nested instance (instance `rotation` is non-overridable) and rotating the whole content rotates its text. Give the content a boolean to hide its baked arrow, then place a **member-level oriented arrow** per side (build one per direction). The code side is simpler — the runtime (e.g. Radix) auto-orients a single arrow per side, so only Figma needs the per-side arrow members. |
| Status | deferred. |

**B(tooltip-figma-2) · Connected-pointer (arrow) recipe for a BORDERED surface: a triangle with stroke
on the 2 slanted edges only + 1px overlap — NOT a bordered rotated square**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived from the A8 defect; the triangle reads connected, the square never did. No defect shipped (this WAS the fix). |
| Gap | Nothing covers how to draw a tooltip/popover arrow that reads CONNECTED to a **bordered** surface. A borderless rotated square (the common first build) reads detached/seamed once the surface has a border: the surface's edge-border draws across the arrow base, and a borderless diamond floats below it. |
| Verified | Borderless −45° square below a bordered chip = visible gap + seam. A triangle (base = the joining edge, open/no stroke; the 2 slanted edges stroked with the surface's border colour; white fill = surface fill; base overlapping ~1px into the surface so the fill covers the surface's edge-border pixel) reads as a clean connected pointer. |
| Candidate fix | Arrow-on-a-bordered-surface recipe: draw a TRIANGLE, not a rotated square. Fill = surface fill; stroke = the surface border colour on the **2 slanted edges only** (the base edge that joins the surface is OPEN — no stroke, so no border line across the base); overlap the base ~1px into the surface so its fill covers the surface's edge-border at the junction. Maps 1:1 to the CSS/SVG tooltip arrow (transparent base, coloured slanted edges, 1px overlap). |
| Status | deferred. |

#### /figma-build-rules (§Interaction states / prototype)

**B(tooltip-figma-3) · Hover-revealed overlay (tooltip) = `ON_HOVER` ("While hovering"), which
auto-reverts on leave → only ONE reaction (closed→open), no open→closed needed**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived from the reactions API; demoable hover flow. No defect. |
| Gap | The variant-prototype note (from the popover run) covers click toggles (ON_CLICK both directions + Esc). A hover-revealed overlay is different: Figma's `ON_HOVER` ("While hovering") trigger **auto-reverts to the source variant on mouse-leave**, so you wire only the closed→open direction; NO open→closed reaction (and no Esc — a tooltip isn't click-dismissed). |
| Verified | `ON_HOVER` → CHANGE_TO matching open on each closed member; on leave Figma returns to closed automatically = open-on-hover/close-on-leave. |
| Candidate fix | Add to the interactive-variant note: for a HOVER-revealed overlay (tooltip), use the `ON_HOVER` trigger (auto-reverts on leave) and wire ONLY closed→open — no reverse reaction, no Esc. Click-toggle overlays (popover) use ON_CLICK both ways + Esc; hover overlays use ON_HOVER one way. |
| Status | deferred. |

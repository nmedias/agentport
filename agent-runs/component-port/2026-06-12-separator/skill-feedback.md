# Skill Feedback — separator port (2026-06-12)

Capture of skill-improvement findings surfaced during the `separator` port run
(`/shadcn-component-port`, feedback capture ON). One block per finding; appended on the spot.
General phrasing — the rule, not "separator happened to…". Never edited the target skill; user applies.

## 1. T4 / figma-build — Section children use SECTION-RELATIVE coords, not page-absolute

**Gap:** `figma-build.md` and `snippets/build-variant-set.js` position the set with page-absolute
`x/y` (the snippet seeds `x=2000,y=2000`), and the SKILL says "place the set in a Section" without
noting the coordinate-system switch. Once a node is a child of a Figma **SECTION**, its `.x`/`.y`
are interpreted **relative to the section's top-left**, NOT page-absolute — so reusing an absolute
x (e.g. `set.x = section.absoluteBoundingBox.x + 80`) places the set thousands of px outside the
section, and a fit-resize then blows the section width up. (`absoluteBoundingBox.x` stays
page-absolute and is what reveals the discrepancy.)
**Verified:** headline `.x=80` → `absoluteBoundingBox.x=9153` (=sectionAbsX 9073 + 80) confirms
relative. Setting the set's `.x = sectionAbsX+80 = 9153` gave `absoluteBoundingBox.x=18226`
(=9073+9153) → it was treated as relative. Setting `.x=80, .y=178` placed it correctly; section
then resized to a tight 545×378.
**Candidate fix:** In `figma-build.md` (Section invariant) note: *after `combineAsVariants(comps,
section)` the set is a section child — set its position with SECTION-RELATIVE `.x/.y` (e.g. 80,
below the headline), never page-absolute. To fit the section, sum child `.x+.width` / `.y+.height`
(section-relative) + inset; do NOT mix in `absoluteBoundingBox` (page-absolute) — the two coord
systems differ by the section origin.* Same note belongs near the snippet's `set.x`/`set.y` lines.
**Status:** open


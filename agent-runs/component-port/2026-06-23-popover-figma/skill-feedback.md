# Skill-Feedback — Popover Figma rebuild (2026-06-23)

Capture ON. Findings pre-sorted A/B/C × edit-target file (`.claude/skills/skill-feedback`):
A = gap caused a defect; B = self-derived, result held (codify, deferred); C = tooling/repo/already-
covered. General, agent-directed phrasing (no run/component names in the eventual skill text — see
memory `skill-writing-style`). NEVER edit the target skills here.

This run **validates two already-tracked findings with fresh evidence** — A5 (`/figma-build-rules` +
`/figma-create-section`: a Section is not an AL frame) and C7 (`/figma-verify` scope gap). No NEW
class-A defects surfaced (the rebuild itself was clean once the AL-frame rule was applied).

---

### A — gap caused a defect (priority)

#### /figma-build-rules (§Variant set assembly / Section) + /figma-create-section

**A(popover-figma-1) · A Figma SECTION is not an auto-layout container → build children must go in a
white vertical AL frame INSIDE the section, and the section must be resized to fit** *(re-validates A5)*

| Feld | Inhalt |
|---|---|
| Why A | The earlier popover build left the section at 321×203 with children freely positioned out to y≈946. Result (confirmed this run): the section's white fill covered only the headline → it read as an oversized white card; the PopoverContent/PopoverHeader masters + Usage Examples spilled onto the DARK page canvas; the bare PopoverHeader master rendered dark text on the dark canvas (unreadable). A real, user-found defect. |
| Gap | Neither `/figma-build-rules` (§Section / §Variant set assembly) nor `/figma-create-section` states that a Figma SECTION has NO auto-layout and does NOT auto-grow — so appended children are neither stacked, enclosed by the fill, nor kept inside the section bounds. Without an explicit white-fill vertical AL frame (HUG) inside the section AND a `resizeWithoutConstraints` to fit, children overlap / spill onto the canvas (dark-on-dark, unreadable). |
| Verified | Before: `section 4365:2253` 321×203, children to y≈946, 3 children below the fill on dark canvas (screenshot). After: a white vertical AL build-frame `4390:2364` (HUG, itemSpacing space-2xl) holding all children + `section.resizeWithoutConstraints` → 1312×1133 → `sectionSpill: []`, `buildFrameChildrenOutOfBounds: []`, every part on white (screenshot). |
| Candidate fix | State in the Section-assembly rule: a Figma SECTION is not an auto-layout frame and does not auto-grow. Put build children into a **vertical Auto-Layout FRAME with a white fill, HUG sizing, DS itemSpacing**, created INSIDE the section, and append children there (never free-position them as direct section children). Keep the headline as the section-level label. After positioning, **resize the section to fit** (`resizeWithoutConstraints`, content + inset on all sides) — else children spill onto the dark canvas (dark text on dark = unreadable). `/figma-create-section` should cross-note this (its output Section needs such an inner frame for the build). |
| Status | offen — A5 already tracked; this run = confirming evidence + the resize-the-section addendum. |

---

### B — self-derived, result held (codify · deferred)

#### /figma-build-rules (§Composites — Anchored overlay)

**B(popover-figma-1) · Modelling a popover/anchored-overlay `align` axis: move the TRIGGER relative to
a fixed panel (alignment is relative) — a wide panel + narrow trigger won't fit if the trigger is fixed**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived geometry; the align set reads correctly. No defect shipped. |
| Gap | §Composites "Anchored overlay" says to anchor the overlay content to the trigger edge, but doesn't address the common case where the panel is much WIDER than the trigger (e.g. a 288px popover off a 58px button). Anchoring the panel to a fixed/centered trigger pushes the panel off the member frame for start/end. |
| Verified | With the trigger centered + panel anchored to it, `align=start` put the 288px panel at 191..479 (overflowing a 440px member). Inverting — panel fixed at the inset, trigger moved (start: trigger.left=panel.left, center: centered, end: trigger.right=panel.right) — fit in a 320px member and reads identically (alignment is relative). |
| Candidate fix | For an `align` axis on an anchored overlay where the panel is much wider than the trigger: keep the PANEL fixed at the inset and MOVE the trigger to encode align (start = trigger.left↔panel.left, center = centered, end = trigger.right↔panel.right). Reads the same as moving the panel (alignment is relative) and fits a member sized to the panel. Maps 1:1 to the code `align` prop — not a Figma-only fork. |
| Status | zurückgestellt. |

---

### C — tooling / repo / already covered

#### /figma-verify

**C(popover-figma-1) · figma-verify checks only the component SET, not the SECTION composition; needs a
canvas-spill / fill-contrast check** *(re-validates C7)*

| Feld | Inhalt |
|---|---|
| Why C | `/figma-verify` scope gap — the earlier popover run reported "figma-verify CLEAN" while the SECTION assembly was visibly broken (children spilling onto the dark canvas, A5). The set passed; the composition was never checked. |
| Gap | figma-verify walks the built component set/tree (vectors, clipping, overlap, padding) but does NOT verify the SECTION/wrapper composition: whether every child sits inside the section's filled area (no spill onto the page canvas) and whether a text fill has adequate contrast against its ACTUAL background (dark text on dark canvas). |
| Verified | This run had to run the section-containment + fill checks MANUALLY (programmatic `sectionSpill`/out-of-bounds + screenshot) — figma-verify's existing steps returned clean on the set while saying nothing about the section. The manual checks are exactly what caught/confirmed A5. |
| Candidate fix | Extend `/figma-verify` to optionally take the SECTION/wrapper node and additionally check: (a) every direct child within the section's filled bounds (no spill onto canvas), (b) a fill-contrast / dark-on-dark check (text fill vs its resolved background). |
| Bezug | Sister of C2/C3 (all /figma-verify heuristic/scope gaps). |
| Status | offen — C7 already tracked; this run = confirming evidence. |

**C(popover-figma-2) · figma-verify clipped-child check flags a child that exactly fills its parent
(flush = clipping by the `>` boundary), e.g. a Button's internal `state-layer`** *(minor heuristic)*

| Feld | Inhalt |
|---|---|
| Why C | figma-verify heuristic noise; build is correct, caller just confirms. |
| Gap | Step 3 (clipped child) flags `child.x+child.width > parent.width - paddingRight`. A child that EXACTLY fills its parent (a full-bleed overlay like a Button's `state-layer` RECT at 0,0,W,H) sits flush — with a strict `>` and a +1 tolerance it can read as clipped, even though it's intentional full-bleed (and lives inside a reused instance one must not edit). |
| Verified | The reused DS Button instances each reported their `state-layer` (50×32, exactly == parent 50×32, `clipsContent=false`) as "clipped" — 6 false positives; all intrinsic Button anatomy, not introduced. |
| Candidate fix | Treat a child whose bbox exactly equals the parent inner box (full-bleed, within tolerance) as a designated/expected case (skip or SOFT HINT), not a clipped FLAG — especially when it lives inside a nested instance (un-editable without detach). |
| Bezug | Sister of C2/C3/C7 (/figma-verify heuristic refinements); echoes C3 (designated-overlap allowlist). |
| Status | offen (Tooling). |

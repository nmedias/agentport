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

---

# Follow-up findings — interactive-overlay extension (2026-06-23)

The PopoverRoot was extended static→full interactive model (state×side×align + INSTANCE_SWAP trigger +
absolute content + prototype). New gaps below.

### A — gap caused a defect (priority)

#### /figma-build-rules (§Composites — Anchored overlay)

**A(popover-figma-2) · `layoutPositioning=ABSOLUTE` requires an AUTO-LAYOUT parent — it throws on a
NONE-layout frame; the anchored-overlay recipe must say so**

| Feld | Inhalt |
|---|---|
| Why A | §Composites "Anchored overlay" says model the open overlay as an `ABSOLUTE`/`layoutPositioning` child anchored to the trigger. Building the member as a NONE-layout frame (the natural choice for free-positioned children) and then setting `content.layoutPositioning='ABSOLUTE'` **errored**: `Can only set layoutPositioning = ABSOLUTE if the parent node has layoutMode !== NONE`. A burned iteration (atomic, so nothing was created, but a real wrong-approach failure). |
| Gap | The recipe names `ABSOLUTE`/`layoutPositioning` but doesn't state the Figma rule that `layoutPositioning='ABSOLUTE'` is **only settable when the parent has auto-layout** (`layoutMode !== NONE`). On a NONE frame all children are already free-positioned, so the property is both unnecessary AND throws — the agent must instead make the member an auto-layout frame (trigger = flow child) so the content can be a true ABSOLUTE child. |
| Verified | NONE-layout member + `content.layoutPositioning='ABSOLUTE'` → threw. Rebuilt member as a FIXED-size auto-layout frame (trigger flow child, centered via primary/counterAxisAlignItems) → `ABSOLUTE` content set cleanly; no reflow on open/close. |
| Candidate fix | In the anchored-overlay recipe: to use `layoutPositioning='ABSOLUTE'` for the floating content, the **parent must be an auto-layout frame** (`layoutMode!==NONE`); model the member as an auto-layout frame with the trigger as the (centered) flow child and the content as the ABSOLUTE child. A NONE-layout frame can't carry an ABSOLUTE child (free-positioning is already implicit there, but the property throws). Use a FIXED member size if a stable variant-grid bounding box is needed. |
| Status | offen — Skill-Edit ausstehend. |

### B — self-derived, result held (codify · deferred)

#### /figma-build-rules (§Mechanism / §Composites)

**B(popover-figma-2) · Swappable trigger on a stateful/prototyped overlay → INSTANCE_SWAP on the member,
not a Slot (the member frame must keep the click reaction)**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived; chose INSTANCE_SWAP over Slot, works. No defect. |
| Gap | §Mechanism maps "one swappable element that must be a component → Instance-Swap" and "open variably-many children → Slot". For a `asChild`-style swappable TRIGGER on a member that ALSO carries a prototype reaction, it doesn't say which wins. A Slot's default content is per-instance and would own the reaction; swapping it could drop the wiring. INSTANCE_SWAP keeps the trigger a stable child whose `mainComponent` is the swap point, while the **member frame** holds the reaction → swapping the trigger never breaks the prototype. |
| Verified | INSTANCE_SWAP prop `trigger#...` (default DS Button), trigger instance `mainComponent` bound to it; member frame carries the ON_CLICK reaction. Swappable + prototype intact. |
| Candidate fix | For a single swappable control (trigger/action) on a member that carries prototype reactions or must persist across variants, prefer **INSTANCE_SWAP** (bind the instance's `mainComponent` to a set-level swap prop, default = the DS component) over a Slot — the member frame keeps the reaction, swapping the control doesn't disturb it. Slot stays for open variably-many *content* regions. |
| Status | zurückgestellt. |

**B(popover-figma-3) · Variant↔variant prototype (open/close, toggle) = `NODE`/`CHANGE_TO` reactions via
`setReactionsAsync`; an overlay's "click-outside" dismiss isn't expressible on a variant member**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived from the reactions API; demoable flow built. No defect. |
| Gap | The build skill covers static variant matrices but has no note on wiring an interactive open/close (or any toggle) **between** variant members. The recipe: `setReactionsAsync([{ trigger:{type:'ON_CLICK'}, actions:[{type:'NODE', destinationId:<otherVariantId>, navigation:'CHANGE_TO', transition:{type:'DISSOLVE',easing,duration}}] }])`. Also: a real popover's **click-outside** dismiss is overlay-background behaviour, NOT expressible as a reaction on a variant member → the open-state dismiss is modelled as click-on-member + `ON_KEY_DOWN`(Esc, keyCode 27). |
| Verified | 24 members wired (closed→open ON_CLICK; open→closed ON_CLICK + Esc); read-back confirms destinations point at the matching counterpart. |
| Candidate fix | Add a short "interactive variant prototype" note: toggle/open-close between two variant members = `NODE`+`CHANGE_TO` reactions (`setReactionsAsync`), one per direction; for an overlay's dismiss, click-outside isn't available on a variant member (overlay-background only) → use click-on-member + `ON_KEY_DOWN`(Esc). Closed/open pairs must be distinct member nodes to carry distinct reactions (justifies "degenerate" closed members in a full state×… matrix). |
| Status | zurückgestellt. |

---

# Follow-up findings — INSTANCE_SWAP → SLOT trigger conversion (2026-06-23)

### B — self-derived, result held (codify · deferred)

**B(popover-figma-4) · CORRECTION to B33 — a SLOT works for a prototyped/stateful swappable trigger as
long as the reaction is on the MEMBER FRAME; a HUG slot is MORE flexible than INSTANCE_SWAP**

| Feld | Inhalt |
|---|---|
| Why B | The user preferred a SLOT and it works cleanly — B33's "prefer INSTANCE_SWAP over Slot for a prototyped/persistent trigger" was over-cautious. |
| Gap | B33 claimed INSTANCE_SWAP is the right choice for a swappable control on a member that carries prototype reactions, reasoning the slot's default content would "own" the reaction. That's wrong: the reaction lives on the **member frame**, not the slot or its content → a slot swap leaves the reaction intact. A SLOT is also MORE flexible than INSTANCE_SWAP (a HUG slot accepts ANY content, not only a same-size component instance) and gives the `asChild` semantics more faithfully. |
| Verified | Converted the trigger to a SLOT (default DS Button, HUG); all 24 members keep their ON_CLICK + ON_KEY_DOWN(Esc) reactions ON THE MEMBER FRAME (slot/Button carry none); prototype fires; sizing chain child→slot HUG→member HUG holds (all 50×32). |
| Candidate fix | Soften/correct B33: for a swappable control on a member that carries prototype reactions, EITHER a SLOT or INSTANCE_SWAP works — keep the reaction on the **member frame** (not the slot/content) and the swap is safe. Prefer a **SLOT** when the consumer should be able to drop in arbitrary content (a HUG slot accepts any child, mirrors `asChild` more faithfully); INSTANCE_SWAP only when the swap must be constrained to a fixed set of component instances. |
| Status | zurückgestellt — supersedes/corrects B33. |

**B(popover-figma-5) · Converting INSTANCE_SWAP→SLOT on an already-combined set: the HUG-slot mechanics + the prop-merge + the layout-regression trap**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived; conversion done, verified CLEAN. No defect shipped, but two non-obvious traps cost iterations. |
| Gap | §Slots covers building slots on standalone comps before combining, but not retrofitting a SLOT onto an already-combined variant set, nor the HUG-slot sizing, nor that disrupting member internal layout can eject a parent auto-layout's children. |
| Verified | (1) `slot.layoutSizingHorizontal='HUG'` THROWS — a SLOT isn't itself an auto-layout frame; give the slot its OWN auto-layout (`layoutMode='HORIZONTAL'`, padding 0, fills []) first, THEN HUG → sizing chain child→slot→member. (2) `createSlot()` on already-combined members made 24 separate un-merged SLOT props; merged by re-binding each `slot.componentPropertyReferences={slotContentId:'<one>'}` + deleting the 23 duplicates → one set-level prop. (3) the slot ops reset the SET's own auto-layout to NONE and ejected the build-frame's children to the section (collapsed the section); had to restore the set grid + re-parent. |
| Candidate fix | Note for retrofitting a SLOT onto a combined set: a SLOT needs its OWN auto-layout before HUG; createSlot post-combine yields N un-merged props → re-bind all to one `slotContentId` + delete duplicates; and slot/structure ops can silently reset the SET's auto-layout AND eject an ancestor auto-layout's children — re-assert the set's layout + the parent frame's children after, and re-run the section-composition check. |
| Status | zurückgestellt. |

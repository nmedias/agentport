# Skill feedback — component-port (2026-06-22-slider)

Capture-on-the-spot, pre-sorted by triage class × Edit-Target. `Candidate fix` = the edit template (general phrasing); `Why`/`Verified`/run-evidence are review-only and do NOT travel into the skill.

## A — gap caused a defect (priority)

### SKILL.md

**#2 · T6 — composite-role control: the accessible name must ride the role element, not the Root**

| Feld | Inhalt |
|---|---|
| Why A | Gate red — axe `aria-input-field-name` failed on multiple stories; only caught after the first `nx test`. |
| Gap | T6 says "rewrite per T3 + annotate the prop API"; nothing flags that when a wrapper's `role` widget is a CHILD (not the Root), passing `aria-label`/`aria-labelledby` to the component lands it on the Root and leaves the role element nameless → axe red. Sibling ports where Root *is* the role element (Switch button) hid this. |
| Verified | `<Slider aria-label="Volume" />` → Root div carries the label, but `role="slider"` is on the thumb `<span>` with no name → axe "ARIA input fields must have an accessible name". Forwarding the name to each thumb cleared it; gate green. |
| Candidate fix | Add a T6 a11y note: if the component's `role` widget is a nested element (slider thumb, listbox option, …), the component must FORWARD the consumer's `aria-label`/`aria-labelledby` to that element — passing them only to the Root names nothing. Applies per role element (e.g. one label per slider thumb; a range reuses the one name). *(also: /storybook-rules — a bare-control story still needs the name to reach the role element.)* |
| Status | open. |

## B — self-derived, result held (codify · deferred)

### /figma-build-rules

**#1 · §Mechanism — count-driven sibling geometry → Variant axis (not Boolean, not Slot)**

| Feld | Inhalt |
|---|---|
| Why B | Derived the axis model myself; user confirmed the 12-member scope. Build will hold. |
| Gap | §Mechanism maps "variably-many children → Slot" and "conditional layout → Variant axis", but not the case where the *count* of a data-driven sub-element changes the **geometry of a sibling** (e.g. a slider's range-fill spans *between* thumbs, so adding a 2nd thumb re-anchors the fill). It can't be a Boolean — Figma can't negate a property binding, so the single-fill rect can't hide when the 2nd element appears — and it isn't a Slot (the fill geometry is coupled, not free content). |
| Verified | Slider range-fill: single = 0→thumb, range = thumb1→thumb2. One boolean toggling thumb2.visible leaves the 0→thumb1 fill wrongly showing (no inverse binding). Two-rectangle + single-boolean fails the same way. |
| Candidate fix | Add a row/note: when a data-driven element *count* re-shapes a sibling's geometry (range fill, segmented track), model it as a **Variant axis** (`thumbs: single\|range`), not a Boolean (no property negation) nor a Slot (coupled geometry). It's a **Figma-only fork** when code derives the count from data (e.g. `value.length`) — don't sync it back as a prop. Multiplies the matrix like the conditional-layout row. |
| Status | open. |

## C — tooling / repo / already covered

**#3 · /figma-verify — sibling-overlap check flags an intentional "handle on rail" overlap**

| Feld | Inhalt |
|---|---|
| Why C | `/figma-verify` tooling heuristic (no skill-prose path); the build is correct, the caller just has to acknowledge. |
| Gap | step 4 (non-auto-layout sibling overlap) flags every slider Thumb↔Track pair (a thumb MUST sit on the rail). Any "handle on a rail" control (slider, scrollbar, range) trips it by design → 18 expected FLAGs that read as defects. |
| Verified | Slider set 4351:2225: 0 text / 0 clipped / 0 pad-asym, but 18 overlaps, all Track↔Thumb (ox 12, oy 4) — exactly one per thumb. |
| Candidate fix | Let `/figma-verify` treat a designated overlap as expected — e.g. skip pairs where one node's name matches a caller-supplied allowlist (Thumb/Handle over Track/Rail), or downgrade a fully-contained-child overlap (thumb bbox inside the member, sitting on a thin track) to a SOFT HINT the caller confirms. |
| Status | open (tooling). |

**#4 · snippets/build-variant-set.js — no scaffold for a geometry primitive (absolute track/range/handle)**

| Feld | Inhalt |
|---|---|
| Why C | Snippet-coverage gap; the prose (§Interaction states, B5 two-part toggle) covers the idea, I just hand-wrote the build. Reinforces the existing C1 ("no scaffold for composite sub-builds"). |
| Gap | `build-variant-set.js` is tuned for label/field members (HORIZONTAL auto-layout + text/icon child + surface fill). A geometry primitive — a `NONE`-layout Root with absolutely-positioned Track (clipping FRAME) + Range (fill RECT whose extent encodes the value) + N handle RECTs — has no scaffold; the whole member loop is bespoke. Slider is the 2nd datapoint after Switch (track+thumb). |
| Verified | Slider 12-member set built fully bespoke (custom mkThumb + per-orientation Track/Range/Thumb positioning); the skeleton's text/fill/HUG path was unusable. |
| Candidate fix | Add a geometry-primitive scaffold variant (Root `NONE` + absolute children, a `mkHandle` helper, per-orientation track/fill positioning, member opacity for disabled, per-handle glow) — or document that geometry primitives (slider/switch/progress) bypass the label/field skeleton and build members by hand. |
| Status | open (tooling/backlog). |

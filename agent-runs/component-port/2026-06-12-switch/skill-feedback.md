# Skill Feedback — Switch port (2026-06-12)

Capture was ON for this run. Target skill: `/shadcn-component-port`. Feedback only — not domain notes.

## 1. T3 / T6 — Stock `ring-3` vs the DS sibling convention `ring-[3px]`

**Gap:** T3 lists the dead-utility and geometry-vs-token rules but says nothing about the focus-ring
WIDTH utility. Stock shadcn ships the focus/invalid ring as `ring-3` (and `ring-3` is itself valid in
Tailwind v4). But every already-ported field sibling (input, checkbox, input-group, textarea) writes
the arbitrary form `ring-[3px]`, and the checkbox port even left a code comment "ring-[3px], not
ring-3, to match the sibling field convention". A new port that copies the stock `ring-3` verbatim
would pass the gate yet drift from the house convention — an inconsistency the skill never flags.

**Verified:** `grep -rn "ring-3\|ring-\[3px\]" libs/ui/src/components/ui/` → all four field siblings
use `ring-[3px]`; the only `ring-3` occurrences are in stock-source notes describing the rewrite
away from it. Normalized switch to `ring-[3px]` to match.

**Candidate fix:** Add a one-liner to T3 (geometry/keep-valid area): "Focus/invalid ring WIDTH —
stock ships `ring-N` (e.g. `ring-3`); the DS field family standardizes on the arbitrary form
`ring-[N px]` (`ring-[3px]`). Normalize to match the existing siblings rather than copying the stock
`ring-N` verbatim." Phrased generally so any future field port reuses it.

**Status:** open

## 2. T3 — `bg-input` used as a FILL when `input`'s only documented utility is a border

**Gap:** The §6 translation guidance picks tokens by `use`/`avoid`. Stock switch uses
`data-unchecked:bg-input` — i.e. the `input` colour as a TRACK FILL. But the tokens-reference entry
for `input` lists `utilities: [border-input]` and `use: "Form-Control-Border"` only; `muted` is the
token whose `use` literally says "Tracks". A strict use-driven pick would route the off-track to
`bg-muted`, which is wrong here: `muted` (#f4f6f8) is near-invisible on a white app surface, whereas
`input` (neutral/450 #79828f) keeps the off-track ≥3:1. The skill gives no rule for "the right ROLE
token fails contrast / the stock token is a border colour reused as a fill".

**Verified:** values from tokens-reference §1 — muted #f4f6f8 (≈1.04:1 on #ffffff, invisible) vs input
#79828f (≥3:1, documented). The orchestrator brief pre-decided `bg-input`; this run confirms the why.

**Candidate fix:** Add to T3 a note: "A token's documented `utilities`/`use` may be border-only yet
the stock component reuses that colour as a FILL (e.g. switch off-track `bg-input`). When the
role-correct fill token (here `muted` = 'Tracks') fails the contrast the component needs, keep the
stock colour token as a fill and record the contrast rationale — don't blindly re-point to the
role-named token." 

**Status:** open

## 3. T4 / figma-build.md §Interaction-states — invalid GLOW must be built, not copied off the sibling

**Gap:** The interaction-state pattern says "focus — a ring drop-shadow (`ring`/50, spread 3)" and the
brief's standard-1 says to copy the focus effect VERBATIM off `.Input` focus member `3176:305`. That
works for focus. But for the **invalid** glow there is nothing to copy verbatim: the `.Input`
`state=invalid` member (`3176:311`) carries ONLY a `destructive` border stroke and `effects: []` — no
glow at all. A build that "copies the invalid effect off the sibling like the focus one" would copy an
empty array and silently ship invalid with no halo. The invalid glow has to be CONSTRUCTED from the
focus-glow template with the destructive colour swapped in (destructive RGB @ a:0.2,
`showShadowBehindNode:false`), which the brief did spell out but the skill/figma-build text does not —
it only describes focus. A future port reading just the skill would under-build invalid.

**Verified:** read `3176:311` — `effects:[]`, single stroke bound to `VariableID:3038:3`. The focus
member `3176:305` has the one DROP_SHADOW. So focus = copy-verbatim, invalid = synthesize-from-template.

**Candidate fix:** In figma-build.md §Interaction-states, add an invalid row next to focus: "invalid —
a glow built from the SAME drop-shadow template as focus with the destructive colour (destructive RGB
@ ~0.2 alpha, unbound, `showShadowBehindNode:false`) + a `destructive`-bound border stroke. The field
sibling's invalid member may carry only the border and no effect — do NOT copy its (often empty)
effects array; synthesize the glow from the focus template."

**Status:** open

## 4. T4 — two-part geometry component (track + thumb) has no `state-layer`/Base recipe fit

**Gap:** The §Interaction-states recipe is written for a single content surface (Base instance + a
`state-layer` Surface tinted via layer-opacity, content pressed for active, etc.). The Switch is a
**two-part geometry** component (track Root + absolutely-positioned thumb) with NO text/content layer
and NO active/hover/tint states — its states are all expressed as track-fill swap, border+glow, layer
opacity, and thumb x-offset. Applying the Base/state-layer/tint machinery here would be over-build; the
right model is "10 flat standalone members → combineAsVariants", binding fill/stroke/effect/opacity per
member and moving the thumb child's x. The skill has a clear recipe for the button-family case but none
for the geometry-toggle case, so an agent could waste effort forcing the Base+tint pattern onto a switch.

**Verified:** the built set (10 members, no Base instance, no state-layer) passes controls-live (all 10
combos resolve, fills/thumb-x/effects correct) and figma-verify CLEAN — confirming the flat-member model
is sufficient and the tint/Base layer is unnecessary for a track+thumb toggle.

**Candidate fix:** Add a short note under §Interaction-states: "Two-part geometry toggles (switch:
track+thumb; no text/tint/active states) don't need the Base+state-layer machinery — build N flat
standalone members (size×state), bind track fill / border / effect / layer-opacity per member and set
the thumb child's offset numerically, then `combineAsVariants`. Reserve Base+state-layer for components
with a content surface that tints/presses (buttons, inputs)."

**Status:** open

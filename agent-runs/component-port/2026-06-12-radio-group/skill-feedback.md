# Skill-Feedback — RadioGroup port (component-port) · 2026-06-12

Run: code-side port of `RadioGroup` + `RadioGroupItem` into the Agentport DS
(T2/T2.5/T3/T6/T7; Figma T4/T5 + shared-file integration handled by the
orchestrator). Target skill: `/shadcn-component-port`.

## 1. T2 — "move the flat source" assumes the file is git-tracked

**Gap:** T2 step 2 says shadcn writes the source flat → "move to
`components/ui/<component>/<component>.tsx`". The skill doesn't say *how* to move.
The natural reflex (`git mv`) **fails** when the source was pre-landed by an
orchestrator (or by `ui:add`) and is still **untracked** — `git mv` errors with
`fatal: not under version control, source=…`. Plain `mv` is required for an
untracked file; `git mv` only works once the file is staged/committed.
**Verified:** in this run `git mv libs/ui/src/components/ui/radio-group.tsx …`
→ exit 128 `fatal: not under version control`. Plain `mv` succeeded.
**Candidate fix:** T2 step 2 — specify the move is a plain filesystem `mv` (the
freshly-landed source is untracked; `git mv` only applies if it's already tracked).
One line: *"Move with `mv` (the just-added source is untracked — `git mv` fails on
untracked files)."*
**Status:** open

## 2. T6 gate — "confirm the DS typography class survives twMerge" doesn't fit graphic-only controls

**Gap:** the T6 gate item says "confirm the DS typography class actually survives
in the rendered markup (twMerge drops it if T1 was skipped)". A purely graphic
control (RadioGroupItem: a circle + dot, **no text**) has **no** `text-format-*`
class — so that specific check is N/A. But the twMerge-collapse risk still exists
for the component's other DS utilities: here `corner-full` (a custom `corner-*`
utility) is exactly the kind of class twMerge would mishandle without the cn()
corner-group extension. The guard is right; it's just keyed to the wrong utility
family for text-less components.
**Verified:** RadioGroupItem renders no text node; its at-risk DS class is
`corner-full`. The spec guard was written against `corner-full` (radius) instead
of a typo class, and asserts it survives in `className`.
**Candidate fix:** generalise the T6 gate wording — *"confirm the component's
**at-risk DS custom utility** survives in the rendered markup (the typo
`text-format-*` for text components; the `corner-*` radius / named-spacing class
for graphic-only controls) — twMerge drops it if the matching cn() extension was
skipped."* Same for the T2.5/spec "twMerge guard" idiom.
**Status:** open

## 3. figma-build.md focus-ring pattern omits the `showShadowBehindNode` rule for transparent controls

**Gap:** `figma-build.md §Interaction states` describes focus as "a ring
drop-shadow (`ring`/50, spread 3)" and notes spread renders only when
`clipsContent=true` on the effect-bearing node — but says **nothing** about
`showShadowBehindNode`. On a **filled** control (Checkbox: opaque
primary/white box) the twin sets its invalid/checked-invalid glows with
`showShadowBehindNode:true` and it renders fine. On a **fill-less / transparent**
control (the radio circle: no fill on default/focus/invalid) `true` makes the
3px halo render *behind* the node where the transparent body lets the canvas
show through → the halo bleeds or reads as invisible. The radio therefore needs
`showShadowBehindNode:false` on **every** glow (focus AND invalid), i.e. it
diverges from the checkbox twin's invalid glow.
**Verified:** recon of Checkbox `invalid` (3794:1186) + `checked-invalid`
(3794:1187) → both glows `showShadowBehindNode:true`. The Input focus member
(3176:305, the canonical focus template) → `false`. Built the radio with `false`
on all three glow members; controls-live readback confirmed `sbn:false` across
focus/invalid/checked-invalid and the set renders clean.
**Candidate fix:** `figma-build.md §Interaction states` focus bullet — add:
*"Set `showShadowBehindNode:false` on the ring/glow effect for **fill-less /
transparent** controls (radio circle, ghost button); `true` lets the canvas
show through the body and the halo bleeds/disappears. Copy the effect object
verbatim off an existing `.Input` focus member rather than reconstructing it —
the literal unbound `ring` RGB @ a:0.5 and the `false` flag are easy to get
wrong by hand."*
**Status:** open

## 4. No item-set member can express "checked + disabled" — examples lose selection under a disabled group

**Gap:** the form-toggle state axis (default/checked/focus/disabled/invalid/
checked-invalid) is **single-axis**, so there is no `checked-disabled` member.
The shadcn `Disabled` story has the first option **checked** while the whole
group is `disabled` — irreproducible from a single `setProperties({state})`
call. T5's "rebuild every story from the controls" then has no control for it.
**Verified:** RadioGroup `Disabled` story = `defaultValue="one" disabled` (First
option selected + dimmed). Reproduced by setting the instance to `state:checked`
**plus an instance `opacity:0.5` override** — a legitimate property override (not
a structural edit, not a detach), matching the disabled member's 50% dim.
**Candidate fix:** figma-build.md §Interaction states (or the composite example
layer) — note that a single-axis state set cannot express orthogonal
combinations (checked×disabled); when an example needs one, layer it via an
**instance opacity/appearance override** on the nearest base state, and call it
out in notes — don't add a combinatorial member or detach.
**Status:** open

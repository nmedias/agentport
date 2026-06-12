# Skill Feedback — `/shadcn-component-port` (Checkbox run, 2026-06-12)

Capture toggled ON for this run. Feedback on the **skill**, not domain notes.

## 1. T2 (No-CVA state axis) — orthogonal modifiers vs a flat state enum

**Gap:** T2's "No CVA? → the Figma axis is `state` (default/focus/filled/disabled/invalid)"
presents the state axis as one **flat enum**. But several state drivers are
**orthogonal modifiers** that compose, not mutually-exclusive members: `disabled`
and `focus` each overlay onto *both* `default` and `checked`; `invalid` combines
with `checked` (the checkbox's `aria-invalid:aria-checked:border-primary` rule is a
genuine `checked × invalid` cell). A flat enum either explodes combinatorially
(default, checked, disabled, checked-disabled, invalid, checked-invalid, focus,
checked-focus…) or silently drops valid combinations. The skill gives no rule for
deciding which states are axis **members** vs which are **overlay modifiers**
(booleans / the interaction-state pattern).

**Verified:** the landed checkbox source carries `aria-invalid:aria-checked:border-primary`
— a real two-axis cell — yet `disabled:`/`focus-visible:` are pure overlays that
apply regardless of checked/invalid. No single flat enum represents this faithfully.

**Candidate fix:** in T2's "No CVA?" paragraph, add a sentence: *"When the class
string has state drivers that compose (e.g. `disabled:`/`focus-visible:` apply on
top of any other state, or a `aria-invalid:aria-checked:` combined rule), split them:
the mutually-exclusive ones are the `state` axis members, the composing ones are
boolean overlays / the interaction-state pattern (Figma `§interaction-state`). Don't
force orthogonal modifiers into one flat enum — it either explodes or drops cells."*

**Status:** open

## 2. T3 (sibling-consistency for non-token utilities) — `ring-3` vs `ring-[3px]`

**Gap:** T3 covers token picks (colour/spacing/radius) thoroughly but is silent on
**non-token utility-form consistency across a component family**. Stock checkbox/switch
ship `ring-3`; the already-ported field family (Input, InputGroup) standardized on
`ring-[3px]`. Both render 3px, so neither is "wrong" by value — but mixing the two
forms across sibling form controls is an inconsistency the skill never flags. T3's
`keep_valid` list even blesses `ring-[3px]` as an arbitrary value, implying it's
interchangeable with `ring-3`, with no guidance to align on what siblings already use.

**Verified:** `input.tsx`/`input-group.tsx` use `focus-visible:ring-[3px]`; the stock
checkbox/switch source uses `ring-3`. Picking `ring-[3px]` for the checkbox to match
the field family is a judgement the skill doesn't prompt.

**Candidate fix:** add a T3 bullet: *"For non-token utilities that have multiple
equivalent forms (`ring-3` vs `ring-[3px]`, `gap-x`/`gap` etc.), match the form the
already-ported sibling family uses — grep the neighbouring components first. Value
equivalence isn't enough; the codebase wants one form per family."*

**Status:** open

## 3. figma-build §interaction-state — binding a ring effect's colour clobbers the `/opacity` modifier

**Gap:** `figma-build.md §interaction-state` describes the focus ring as a
"ring drop-shadow (`ring`/50, spread 3)" and §Binding-recipes says to bind every
paint by variable ID. But an effect colour and a paint colour differ:
`setBoundVariableForEffect(effect,'color',ringVar)` resolves the variable to its
**full-opacity** colour and **discards the alpha** you set on `effect.color.a` — the
ring then renders at 100%, not 50%/20%. The skill never warns that the `ring/50`,
`destructive/20` opacity-modifier is **incompatible with binding the effect colour
to a variable**: you bind OR you carry the opacity, not both. The already-built
`.Input` sibling silently encodes the right answer — its focus/invalid ring effects
are **literal colours with `a:0.5`/`a:0.2`, `boundVariables.color:null`** (unbound),
exactly because binding would lose the alpha.

**Verified:** bound the ring effect via `setBoundVariableForEffect` → readback showed
`effects[0].color.a === 1` with `boundVariables.color` set, i.e. the 0.5/0.2 alpha I
passed was overwritten. Recon of `.Input` (`3176:305`, `3692:1249`): focus ring
`a:0.5 bound:null`, invalid ring `a:0.2 bound:null` — literal, unbound. Switched the
checkbox rings to the same literal-alpha approach to match the sibling and render the
correct opacity.

**Candidate fix:** add to §interaction-state (and the §Binding-recipes effect bullet):
*"A ring/glow that carries an opacity modifier (`ring/50`, `destructive/20`) must use a
**literal colour at that alpha** (`color.a = 0.5`), NOT a bound effect colour —
`setBoundVariableForEffect` resolves the variable at full opacity and discards the
effect's alpha. Binding and the opacity-modifier are mutually exclusive for effects.
Match the sibling family: read how an existing set encodes the same ring (the DS
`.Input` focus/invalid rings are literal `a:0.5`/`a:0.2`, unbound) and reuse that."*

**Status:** open (fix applied in this build: rings switched to literal alpha, readback confirms a:0.5 / a:0.2)

## 4. figma-build §interaction-state — focus glow needs `showShadowBehindNode:false` on a transparent control box

**Gap:** Finding #3 covered the *colour-alpha* half of the ring recipe (literal alpha,
not a bound effect colour). But there is a **second, independent** parameter the skill
never names: `DROP_SHADOW.showShadowBehindNode`. Figma defaults it to `true`. On an
opaque control (`.Input`, which has a fill) the difference is invisible. On a
**transparent / fill-less box** (a checkbox is `fills:[]`), `showShadowBehindNode:true`
draws the 0.5-alpha shadow *behind and through* the box's empty interior, so the inner
fill and the 3px outer spread merge into one flat, edgeless wash — the crisp outer halo
never reads. The DS focus convention (`.Input`) silently sets `showShadowBehindNode:false`
so the shadow paints **only** the spread region outside the node = a clean outer ring.
The skill's §interaction-state recipe ("ring drop-shadow, spread 3, /50") omits this flag
entirely, so a builder copying spread/alpha alone still produces an invisible/flat glow on
any transparent control (checkbox, radio, switch thumb).

**Verified:** the checkbox focus member already had the correct *colour* (literal
`a:0.5`, unbound) and stroke bound to `ring`, yet rendered with **no visible halo**.
Readback diff vs `.Input` `3176:305`: identical effect params EXCEPT
`showShadowBehindNode` — checkbox `true`, `.Input` `false`. The checkbox box also has
`fills:[]` (transparent) where `.Input` has an opaque fill, which is exactly the
condition that makes the flag matter. Setting `showShadowBehindNode:false` → re-screenshot
shows the subtle outer halo, matching `.Input`. (Root-cause correction to #3: the *binding*
was never the live bug on this member; the alpha was already literal. The actual
focus-state build error was the leftover default `showShadowBehindNode:true`.)

**Candidate fix:** extend the §interaction-state ring recipe to specify **both** params:
*"A focus/error ring drop-shadow must set `showShadowBehindNode:false` in addition to the
literal alpha. On a transparent / fill-less control (checkbox, radio, switch) the default
`true` lets the shadow bleed through the empty interior and the outer halo never reads —
it must be `false` so only the spread region outside the node is painted. Copy the full
effect object off the sibling (`.Input` focus) verbatim — spread, radius, offset, alpha
AND `showShadowBehindNode` — don't reconstruct it from the spread/alpha description alone."*

**Status:** open (fix applied in this build: focus effect `showShadowBehindNode` true→false, screenshot confirms halo)

## 5. T5 (Figma story-reproduction) — non-composite ports lose their permanent example instances

**Gap:** The port skill builds example/story-reproduction instances during T5 (mirroring
the code-side stories) but treats them as **throwaway scaffolding** — for a non-composite
component (single set, no embedded sub-components) the run deletes the story-reproduction
frame after verifying the set, leaving the component Section with only the bare variant
set and no usage examples. Every sibling Section that went through the composite path
(Input, Command, Dialog, InputGroup) keeps **permanent example instances** below its set;
the non-composite ports (Checkbox here) end up inconsistent — the Section looks half-built
and a consumer can't see WithLabel / WithDescription / Disabled / AllStates assembled from
real instances. The skill has no rule that T5 examples are a **permanent deliverable** for
*all* component kinds, nor that they must be built as **real nested instances** (real
`.Checkbox` + real `.Label`, driven via `setProperties`) rather than re-clothed copies.

**Verified:** the Checkbox Section `3791:1184` held only `[Checkbox text, .Checkbox set]`
— the story-reproduction frame the code-side stories describe (WithLabel, WithDescription,
Disabled, AllStates) was absent, while the Input/Command/Dialog/InputGroup Sections each
retain a permanent labelled example group. Rebuilt the four examples here as real nested
instances.

**Candidate fix:** add to T5: *"Story-reproduction example instances are a **permanent
Section deliverable for every component kind**, not just composites — do NOT delete them
after verifying the set. Build them as **real nested instances** of the ported component
(+ any real DS partners like `.Label`), driving state via `setProperties`; never
hand-build or re-clothe copies (example-instance slot content is non-editable per DS
convention). Lay them out in a labelled vertical auto-layout group below the set using DS
spacing tokens, mirroring the sibling Sections (Input/Command/InputGroup)."*

**Status:** ✅ written into `/shadcn-component-port` 2026-06-12 — Output/T5 + `figma-build.md §Usage-examples` (the permanent-examples deliverable + Done-Test lifted OUT of `composites.md` into the general path; applies to every port now).

## 6. figma-build §interaction-state — a glow-correctness fix must sweep ALL glow-bearing members, not just the reported one

**Gap:** When the `showShadowBehindNode` bug (#4) was fixed, only the **focus** member
got corrected — the **invalid** and **checked-invalid** members carry the same
`destructive/20` drop-shadow and kept the leftover default `showShadowBehindNode:true`.
The invalid member is `fills:[]` (transparent), so its halo bled exactly like the focus
one did; it stayed broken until the orchestrator swept it separately. The skill's
interaction-state recipe is per-state, so a builder fixing "the focus state" naturally
touches one member and considers it done — there's no rule that a glow-recipe change is a
**family-wide** correction across every member that carries that effect kind.

**Verified:** post-focus-fix readback of `.Checkbox` members — focus `showShadowBehindNode:false`
(fixed) but invalid (`3794:1186`) + checked-invalid (`3794:1187`) still `true`. The radio
build independently used `false` on all glow members, exposing the checkbox inconsistency.
Orchestrator set both checkbox invalid members to `false` (readback confirms `a:0.2`, `sbn:false`).

**Candidate fix:** add to §interaction-state: *"A glow-effect correction (alpha form,
`showShadowBehindNode`, spread) applies to EVERY member that carries that glow — focus AND
invalid AND checked-invalid — not only the one being inspected. After changing a glow recipe,
read back all glow-bearing members and confirm they match; transparent (`fills:[]`) members
show the defect, opaque-fill members hide it, so a screenshot of one member is not sufficient."*

**Status:** ✅ closed (orchestrator swept checkbox invalid + checked-invalid to showShadowBehindNode:false; readback confirms)

## 7. T2.5 (story authoring) — reproduce the doc's ACTUAL composition (Field family), not a hand-rolled div+Label

*(Applies to all three of this batch — Checkbox/Switch/RadioGroup; logged once here.)*

**Gap.** T2.5 says "fetch the doc's structurally-distinct examples" + "mirror an existing
component's `.stories.tsx`". An agent satisfies BOTH by hand-rolling
`<div className="flex"><Control/><Label/></div>` rows — which is what all three ports shipped.
But the shadcn `radix/*` docs for form controls compose with the **Field family**
(`Field orientation="horizontal"`, `FieldContent`, `FieldLabel`, `FieldDescription`, `FieldGroup`,
`FieldSet`+`FieldLegend`, and `FieldLabel` wrapping a `Field` for clickable "choice cards"). The bare
stories matched only the single *basic* example and missed the 5–6 Field-composed ones — even though
the Field family was already ported the same day. The T2.5 skip-rule ("example needs un-ported dep →
skip") never fired (Field IS ported), so the agents neither skipped nor used it; they simplified.

**Verified.** Docs (radix/checkbox|switch|radio-group): checkbox Basic/Description/Group/Disabled/Invalid,
switch Description/ChoiceCard/Disabled/Invalid/Size, radio Description/ChoiceCard/Fieldset/Disabled/Invalid
all use the Field family; only the basic/Default rows are bare. The three shipped `.stories.tsx` used
bare div+Label throughout (mirrored `input.stories.tsx`). User-reported.

**Candidate fix.** Add to T2.5: *"Reproduce each doc example's ACTUAL composition, not a simplified
layout. For form controls that is the ported **Field family** (Field/FieldContent/FieldLabel/
FieldDescription/FieldGroup/FieldSet/FieldLegend; `FieldLabel` wraps a `Field` for choice cards) —
read `field.stories.tsx` for the in-repo idiom. Prefer already-ported DS composition primitives over
a hand-rolled div+Label; only fall back to bare layout when the doc example itself is bare (the
basic/Default row). Before simplifying, check whether the needed composition primitive is already
ported. An example needing an un-ported dep (Table, react-hook-form) → skip AND log it in notes; never
silently simplify or omit."*

**Status:** ✅ written into `/shadcn-component-port` 2026-06-12 — T2.5 fidelity rule (reproduce the doc's
actual composition from the already-ported DS composition primitives; "mirror a sibling" = CSF boilerplate
only). Batch already reworked (all three `.stories.tsx`, gate green, 92 specs).

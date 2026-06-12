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

## 8. figma-build §Usage-examples — the `.Field` row is control-TRAILING; a checkbox/radio row is control-LEADING (no Field variant for it)

*(Surfaced rebuilding the Checkbox Usage-Examples group to match the Field-composed stories — Figma side.)*

**Gap.** §Usage-examples says "nest real instances of the set + any already-ported partner (label,
**field**, …)". For a checkbox/radio row that instruction is a trap: the ported `.Field` horizontal
orientation (`3714:1018`) is **control-TRAILING** — label/FieldContent LEFT, control RIGHT — because it
was built for an Input (text field with a trailing control). A checkbox/radio row is **control-LEADING**
(the box sits LEFT of the label). There is **no control-leading variant** of `.Field`, and its
`orientation` axis only offers horizontal(trailing)/vertical. A builder who dutifully nests the
`.Field` instance to "use the ported partner" gets the box on the wrong side. The skill never warns
that the Field row component encodes a control-position assumption that doesn't hold for selection
controls.

Compounding it: the **`.FieldSet`/`.FieldGroup`** components are single COMPONENTs exposing only
**generic slots** (`legend#…`, `Slot#…` body) — and **no standalone `.FieldLegend`/`.FieldLabel`
component exists** to reuse as a group legend/eyebrow. So for the "Group" (FieldSet) example there is
nothing component-shaped to reuse for the legend either; it's slotted text whichever way you go, and
filling those body/legend slots in an instance hits the locked-`layoutMode` + clear-defaults +
re-resolve-refs friction (§Slots) for no fidelity gain over composing the stack directly.

**Verified.** `.Field` `3714:1018` screenshot = `{Label}` LEFT, `{Placeholder}` input RIGHT
(control-trailing). `.FieldSet` `3739:1026` props = `{legend: SLOT, Slot: SLOT}` (two generic slots,
no variant for legend style). Page scan for `legend|fieldlabel` components → **none** (only `.FieldSet`,
`.FieldGroup`, `.Field`). Code cross-check (`field.tsx`): the checkbox row IS control-leading there —
`fieldVariants` horizontal is `flex-row items-center` with the Checkbox first in DOM and an
`[role=checkbox]:mt-px` nudge; the Figma `.Field` simply never modelled that DOM-order/leading case.
Built all 5 checkbox rows by **composing manually** — a real `.Checkbox` instance (left) + real `.Label`
instance (right) in a HORIZONTAL auto-layout, `itemSpacing` = `gap-md` (8, the code Field row's gap),
`counterAxisAlignItems=CENTER` (single-line) / `MIN` (label+secondary stack). The Group legend/desc +
checkbox list were composed manually too (legend = `Label`/eyebrow text style, desc = `Body`+
muted-foreground, list gap = `gap-lg` 12 matching `data-[slot=checkbox-group]:gap-lg`).

**Candidate fix (skill).** Add to §Usage-examples: *"The ported `.Field` horizontal row is
**control-trailing** (built for Input: label left, control right). For a **control-leading** row
(checkbox / radio / switch — box left, label right) do NOT nest `.Field`; compose the row directly —
a real control instance + a real `.Label` instance in a HORIZONTAL auto-layout, `itemSpacing`=`gap-md`,
`counterAxisAlignItems=CENTER` (or `MIN` when a description/error stacks under the label). `.FieldSet`/
`.FieldGroup` expose only generic slots and there is no standalone `.FieldLegend`/`.FieldLabel`
component — for a legend/grouped example, compose the legend (Label/eyebrow style) + description
(Body/muted) + the row list (gap-lg) as a vertical auto-layout rather than fighting the locked
instance slots."*

**Candidate fix (DS — for the orchestrator/user to decide).** Does `.Field` need a **control-leading
variant** (e.g. an `orientation=horizontal-leading`, or a `control-position: leading|trailing` axis)?
The code already supports control-leading rows for selection controls (checkbox/radio/switch all
compose `Field orientation="horizontal"` with the control first), so the Figma component is missing a
case the code relies on. Without it, every selection-control Usage-Examples group (Checkbox done here,
Radio + Switch pending) must hand-compose rows instead of nesting the Field partner — duplicated layout
logic, drift risk. **Recommendation: warranted** — add a control-leading horizontal case to `.Field`
(and ideally expose `.FieldLegend`/`.FieldLabel` as reusable text components) so selection-control rows
can nest a real Field instance like Input does.

**Status:** open (build worked around it by manual control-leading composition; DS change is a
recommendation for the orchestrator/user).

## 9. figma-build §Binding-recipes — `getVariableByIdAsync` needs the full `VariableID:` prefix; a bare id silently yields a black, unbound paint

**Gap.** §Binding-recipes says "bind every property by variable ID" and the recon tools return ids in
two shapes: variant/prop `boundVariables` come back as `VariableID:3037:13`, but
`getLocalVariablesAsync()` etc. expose the same id and it's tempting to pass the bare `3037:13`.
`figma.variables.getVariableByIdAsync('3037:13')` returns **`null`** (no throw), and
`setBoundVariableForPaint(paint,'color', null)` then produces a plain **black, unbound** paint — a
silent miss, not an error. The skill never states the canonical id form for the variable lookup, so the
first bind attempt produced a black description/error text that only the readback caught.

**Verified.** `getVariableByIdAsync('3037:13')` → null; readback of the text fill showed
`color:{0,0,0}, boundVariables:{}`. Re-running with `getVariableByIdAsync('VariableID:3037:13')` → the
real variable; readback then showed the resolved colour + `boundVariables.color = VariableID:3037:13`.

**Candidate fix.** Add to §Binding-recipes: *"`getVariableByIdAsync` requires the full
`VariableID:<x>:<y>` form — a bare `<x>:<y>` returns `null` (no throw), and binding with `null` yields a
silent black unbound paint. Always pass the `VariableID:`-prefixed id (the form `boundVariables` and
the recon dumps already use) and read the fill back to confirm `boundVariables.color` is set, not just
that a colour appeared."*

**Status:** open (fix applied in this build: re-bound with the prefixed id, readback confirms muted-foreground + destructive bound).

## 10. `.Field` invalid+leading member nests the error slot INSIDE the control slot → a control-leading row with an error renders the error under the control, clipping the label

*(Surfaced rebuilding the Checkbox Usage-Examples group to nest real `.Field` instances now that the
control-LEADING variant exists — finding #8's DS recommendation was acted on, so 4 of 5 blocks now reuse
a real `.Field`. This is the one block that still can't.)*

**Gap.** The new control-leading members (`3897:1240` invalid=false, `3897:1249` invalid=true) work
cleanly for Basic / Description / Disabled / Group rows — clear the control slot's default `.Input`,
append a `.Checkbox`, set the label, done. But the **invalid=true / leading** member (`3897:1249`)
places the `error-wrapper` as a **sibling of the control INSIDE the control slot** (the control slot is a
VERTICAL auto-layout containing `[Input, error-wrapper]`). That layout is correct for control-TRAILING
(control column is on the right, error stacks under the whole row), but for control-LEADING the control
column is on the LEFT, so the error text — which hugs to the full message width (~340px) — widens the
left control column and squeezes the `FieldContent`/label column to a few px, clipping
"Accept terms and conditions". The error also sits visually under the **checkbox**, not under the label
(measured: error text `absoluteBoundingBox.x` == instance left edge == checkbox x; label is ~348px to the
right). So a leading checkbox + error is both clipped and semantically wrong (error belongs under the
label span, not under the box).

**Verified.** Built the Invalid block from `3897:1249` (invalid=true, leading), filled control with
`.Checkbox` state=invalid, `Show error=true`, set the error text. Readback: control slot `HUG`, width
340 (= error width); `FieldContent` `FILL` collapsed to 44px; label text intrinsic 181px → clipped.
Screenshot confirmed: red box top-left, red error full-width below it, label "Accept terms and
conditions" not visible. The other 4 blocks (false/leading member) have no error slot in the control, so
they compose perfectly. Fell back to a **manual** Invalid row for this one block only — `.Checkbox`
state=invalid (left) + a vertical text column [`.Label` instance, destructive error text cloned from the
prior block to keep text-style + `VariableID:3038:3` binding] — per the task's "try `.Field` first, fall
back if blocked" rule.

**Candidate fix (DS — for the orchestrator/user to decide).** The error slot's parent should follow the
control POSITION: for control-leading, the `error-wrapper` belongs under `FieldContent` (the
label/description column), not under the control slot. Either (a) move the error-wrapper into
`FieldContent` for the leading members, or (b) make the error a full-row-width element below the
horizontal row rather than a child of the control column. As-is, the control-leading variant is usable
for label-only and label+description rows but NOT for label+error rows — every selection-control invalid
example (Checkbox here, Radio/Switch pending) must hand-compose the error row.

**Status:** open (build worked around it: Invalid block composed manually; Basic/Description/Disabled/Group
all reuse a real `.Field` leading instance. DS structural fix is a recommendation for the orchestrator/user).

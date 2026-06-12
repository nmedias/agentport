# Skill Feedback — /component-sync (run: 2026-06-12 Checkbox)

## 1. S3 Diff — "newly-bound property the code omits entirely" is an implicit case

**Gap:** S3's diff model is framed as *changed/re-bound var ⇒ utility swap* and *added/removed member ⇒
variant change*. It doesn't name the third case that actually drove this run: a property is now **bound
in Figma** that the code currently expresses as **no class at all** (an implicit default). Here the
unchecked box gained `Input/input-background` as a fill, but the original code had **no `bg-*`** on the
box (transparent by default). There's no "old utility" to swap — the diff is *absent class → add the
mapped utility*. An agent scanning only for "which existing class changed" can miss it, because nothing
in the class string changed; only Figma grew a binding the code never represented.

**Verified:** read-set-values.js returned `fill.var = "Input/input-background"` on
default/focus/disabled/invalid; the code's base class string had no `bg-*`. Correct action was to ADD
`bg-input-background`, not swap. (Mirror case also possible: Figma *removes* a fill the code hardcodes →
delete the class.)

**Candidate fix:** In S3, list three diff shapes explicitly: (a) re-bound var → swap utility; (b) member
added/removed → variant change; **(c) property newly bound where code had no class (implicit default) →
ADD the mapped utility; property unbound where code has one → REMOVE it.** Diff the *set of bound
properties*, not just the values of properties the code already names.

**Status:** open

## 2. S2 snippet — fill read is single-member; "checked vs unchecked fill" lives across members

**Gap:** The snippet reads each member's `m.fills` independently, which is correct, but the skill prose
never notes that for state-axis controls (Checkbox/Switch/Radio) the "fill changes on check" delta shows
up as **different fill vars on two different members** (e.g. checked = primary, checked-invalid =
destructive), which the code collapses into `data-*`/`aria-*` variant classes on one element. Mapping
member→variant-prefix is left to the agent's judgement with no pointer. Worked out fine here, but a note
would make it deterministic.

**Candidate fix:** Add a one-line note to S3: for a single-element component with a state axis, each
Figma *member* maps to a state *variant prefix* in the code (`state=checked` → `data-checked:`,
`state=invalid` → `aria-invalid:`, combined member → stacked `aria-invalid:aria-checked:`); diff each
member's bound props against the matching prefixed classes.

**Status:** open

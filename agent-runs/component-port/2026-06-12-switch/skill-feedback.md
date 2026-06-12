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

---

# Skill Feedback — Switch Usage-Examples REBUILD (2026-06-12, separate run)

Capture for the follow-up run: rebuild the Switch "Usage Examples" group as Field-composed stories
nesting **real `.Field`[trailing]** instances (control slot ← `.Switch`). Target: `figma-build.md
§Slots` + §Usage-examples. Feedback only. (The findings 1–4 above are from the original port — these
5–8 are new.)

## 5. §Slots — slot-DEFAULT text inside an instance is NOT editable; the `.characters` SETTER throws

**Gap:** §Slots covers filling a slot in an instance for *appended* nodes, but is silent on the
inverse: when a slot ships a **default text node** (`.Field`'s description `{Field Description}`, the
trailing-invalid `{Error Message}`), you cannot mutate that default's `.characters` in the instance.

- Symptom: `get_characters: Node with id "…" not found` on the **setter** line. The *read* of the
  same node works (font, style, segments all readable) — only the write throws. Looks like a stale-id
  bug; it isn't. Cost me 3 failed atomic scripts before diagnosing.
- Discriminator: does the text node carry `componentPropertyReferences.characters`? **Yes** → it's a
  component TEXT property, edit via `instance.setProperties({...})` (this is how `.Label`'s label
  worked first try). **No** (raw slot default) → must clear-and-append.

**Candidate fix:** one row under §Slots "Filling a slot IN AN INSTANCE":
> Slot **default text** is read-only in the instance — its `.characters` setter throws
> "node not found" (the *read* still works, which misleads). Drive editable text only via a
> component TEXT property (`setProperties`); for a plain-text slot default, clear the slot and
> append your own TEXT, carrying the style via `await node.setTextStyleIdAsync(styleId)` (read the
> style id off the **main** component's text node — that one is readable) + `layoutSizingHorizontal='FILL'`.

**Status:** open

## 6. §Slots — clearing a slot co-removes/re-injects sibling defaults; `[...children].forEach(remove)` is unsafe

**Gap:** §Slots prescribes `[...slot.children].forEach(c => c.remove())`. Broke twice:

- The trailing-**invalid** control slot ships TWO defaults (`.Input` + `error-wrapper`). Removing the
  first (`.Input`) **also drops** the sibling `error-wrapper` → the forEach's 2nd iteration hits a dead
  id → `remove: Node … not found`.
- After appending my switch into the emptied slot, Figma **re-injected** the default `error-wrapper`
  as a sibling of the switch (stray red `{Error Message}` rendered in the control column). Had to
  re-fetch the slot and remove the resurrected wrapper by name.

**Candidate fix:** replace the bare forEach in §Slots with a guarded per-id loop + a post-append sweep:
> Clear via id-snapshot, not a live forEach: `const ids = slot.children.map(c=>c.id); for (const id
> of ids){ const c = await figma.getNodeByIdAsync(id); if (c && !c.removed) c.remove(); }`. Removing
> one slot default can co-remove siblings, so iterate defensively. **After appending**, re-fetch the
> slot and remove any **re-injected default** (match by name) — Figma can resurrect slot defaults when
> the slot is emptied then refilled.

## 7. §Slots — `setProperties` re-renders the subtree; re-resolve in a SEPARATE `use_figma` call

**Gap:** §Slots' "re-resolve the live child" note is scoped to *append*. But any `setProperties` that
changes a variant or derived structure (e.g. `.Label` `state=disabled`, `.Field` `invalid=true`) also
re-renders the subtree. `setProperties(...)` then `findOne(control slot)` in the **same script**
crashed traversal (`findOne callback crashed: get_name: Node … not found` — transient dead nodes
mid-render). Splitting into two calls (set props → next call: re-resolve + fill) fixed it every time.

**Candidate fix:** generalize the re-resolve note: "Re-resolution must happen in a **fresh `use_figma`
call** after ANY `setProperties` that changes variant/derived structure — not only after append. Same
script = transient dead nodes during the re-render."

## 8. §Slots — narrow control in an `.Input`-sized slot needs NO sizing fight; don't HUG a control instance

The task warned the `.Field` control slot (built for `.Input`, FIXED ~160/174) might fight a narrow
32px `.Switch`. In practice the trailing member's control slot is already `lsh=HUG, lsv=HUG`: dropping
the switch let the slot hug to 32px and the FILL `FieldContent` pushed it to the right edge
automatically — **zero sizing intervention**. Also: `switchInstance.layoutSizingHorizontal='HUG'`
throws ("HUG can only be set on auto-layout frames or text children") — leave control **instances** at
their intrinsic FIXED size, never set HUG on them.

**Candidate fix (minor):** §Slots note: "A HUG control slot auto-hugs a narrow swapped-in control while
a sibling FILL region right-aligns it — no resize needed. Don't set HUG/FILL on the control **instance**
itself (instances reject it); size via the slot."

## Non-finding (component definition, out of scope — for the caller, no skill change)

`.Field` trailing-**invalid** places its `error-wrapper` **inside the control slot** (right column),
not in FieldContent — contrary to the task's stated assumption. Filling the control with a switch wipes
that error-wrapper, and its text is non-editable (Finding 5). So the **Invalid** story fell back to a
**manually composed error TEXT** appended below the field (style `S:7e1bf8f1…`, fill bound to error var
`VariableID:3038:3`). Field reuse stays clean for the label+switch row; only the error line is hand-placed.
This is a `.Field` definition trait, not a skill gap.

**Status:** all open

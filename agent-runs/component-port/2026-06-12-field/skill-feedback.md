# Skill Feedback — Field composite port (2026-06-12)

Target skill: `/shadcn-component-port` (+ `references/composites.md`). Feedback only — do NOT fold into the skill; the user applies.

## 1. composites.md §2 T2 audit — a landed dep can be a HARD co-dependency the composite *imports*, not just an optional foreign part

**Gap:** The dependency-audit (composites.md §2 T2) lists three dispositions for a landed foreign dep: **un-ported → port / stub / delete+defer**, or **already-ported folder → delete the flat shadow copy**. It frames the un-ported case as a *choice* (port OR stub OR delete+defer). But when the composite's OWN source `import`s that dep directly (here `FieldLabel` → `@/components/ui/label`, `radix-ui` Label), "stub" and "delete+defer" both **break the composite at runtime/typecheck** — the only valid disposition is **port it**. The audit doesn't distinguish "dep the composite hard-imports" (must port) from "dep that's just a sibling example/part" (can defer).
**Verified:** `grep` shows `label` is imported by `field.tsx` line 5 and nowhere else; deleting it would break Field's import. So delete+defer is not on the table.
**Candidate fix:** In §2 T2, split the un-ported case: *if the composite's own kept source imports the dep → port it (it's a hard co-dependency, not optional); stub/delete+defer apply only to deps used by sibling example/demo files you're not keeping.* Add Label to the "watch for co-ported primitives" list (Field, Form pull it in).

## 2. composites.md §2 T2 — "already-ported folder, delete flat shadow" confirmed; the flat copy is STOCK, not a re-export

**Gap (confirmation, minor):** The rule says delete the flat stock copy because `<dep>.tsx` shadows `<dep>/`. Verified concretely: `ui:add field` rewrote a flat `separator.tsx` that is **stock new-york** (different from the DS `separator/separator.tsx`, which carries the token comments + DS bindings). So the shadow is not a harmless duplicate — it would silently revert Separator to stock inside Field. The skill is correct; logging the concrete evidence so the next porter trusts the "delete it" step rather than diffing.
**Verified:** `diff` flat vs folder → DIFFERENT (flat = stock quotes/no DS comment; folder = DS-clothed). Module resolution prefers the file over the dir.
**Candidate fix:** none needed — rule is right. Optionally add "the flat copy is stock, so the shadow silently downgrades the DS dep — don't skip the delete even though `ui:add` reported no overwrite."

## 3. T3 / §6 spacing map — `gap-0.5` (2px) lands on `gap-2xs`, an easy-to-miss bottom rung

**Gap:** §6 `geometry_vs_token.spacing` lists worked examples down to `gap-1.5(6)→gap-sm` but not the 2px rung. Field uses `gap-0.5` (FieldContent: label/description/error stack) = 2px → `gap-2xs` (space-2xs, the only 2px step, §3). A porter scanning §6 sees no 2px example and might round to `gap-xs`(4px) or leave it numeric. The px-value rule (§3/§6) does resolve it (2px → 2xs) but the worked-example list stops at 6px.
**Verified:** §3 table: space-2xs = 2px, the only 2px step. FieldContent stock `gap-0.5` = 2px.
**Candidate fix:** extend §6's spacing example list with the bottom rung: `gap-0.5(2)→gap-2xs · py-0.5(2)→py-2xs`. (Badge port already hit `py-0.5→py-2xs` — recurring.)

## 4. T3 / known-trap #20 — no 16px sans format: FieldLegend `text-base` has NO exact rung, pick by role

**Gap:** Field's `FieldLegend` legend-variant is `text-base` (16px) + `font-medium`. The DS sans size ladder is 14/18/22/27/43 — **no 16px**. Known-trap #20 covers the 12px→14px (label role) case; 16px→18px is the same class of gap one rung up. A FieldLegend is a fieldset caption / section heading (role = section title), so `text-format-title` (18/600) is the role-fit, not body/label. The label-variant of FieldLegend stays `text-format-label` (14). Recording so the next porter picks by role rather than rounding 16→14 silently.
**Verified:** §4 ladder has no step between step-0 (14) and step-1 (18). FieldLegend renders a `<legend>` captioning a `<fieldset>` = section heading role.
**Candidate fix:** generalise known-trap #20 beyond 12px: "any stock size with no exact DS rung (12px, 16px, …) → pick the format by ROLE and note it; 16px section captions → text-format-title, 12px micro-labels → text-format-label."

## 5. figma-build.md "Reuse, don't rebuild" — nesting a LOCAL component can't go through importComponentByKeyAsync

**Gap:** figma-build.md says "nest a real instance" of an already-built DS component and the slot recipe assumes you have the component. But it doesn't say HOW to instantiate one that is LOCAL (unpublished) in the same file. `importComponentByKeyAsync(key)` — the obvious path, and the key is returned by `findAllWithCriteria`/recon — throws `Component with key "…" not found` for a local component (import-by-key only resolves PUBLISHED library components). For a same-file component you must resolve the variant node by ID (`getNodeByIdAsync('<variantNodeId>')`) and call `.createInstance()` on that COMPONENT node directly.
**Verified:** `importComponentByKeyAsync('7ab6…')` on the local `.Input` default variant → "not found"; the same set is reachable by node id `3176:303` (recon) and `.createInstance()` works on the node.
**Candidate fix:** add to figma-build.md "Reuse, don't rebuild" / Slots: *to nest a same-file (local) component, resolve the target variant COMPONENT node by ID and call `.createInstance()` — do NOT use importComponentByKeyAsync (that only resolves published library keys; on a local component it throws "key not found"). Recon should return the variant node IDs, not just keys, for any set you intend to nest.*

## 6. composites.md §0/§2-T4 — a NO-SURFACE composite (pure layout, no border/bg) needs guidance on what to model in Figma

**Gap:** composites.md assumes the composite has *some* token surface (InputGroup has bg+border+focus/invalid; Dialog has panel+scrim; Command has overlay). Field is the first composite that is **pure layout/typography/spacing/a11y — zero surface of its own** (the control inside carries the border/bg). The skill's 3-layer build + Done-Test still apply, but there's no rule for "what's the Figma exposure surface when the part has no fill/stroke/shadow at all?" The answer that worked: model the **structural ROW** (orientation × invalid + slots + a nested real control instance), bind ONLY spacing-gaps + typography formats, and explicitly declare the pure-grouping parts (FieldSet/Group/Legend) + any container-query behaviour (responsive) as **code-only** (no Figma set). The skill should name this case.
**Verified:** the whole `.Field` set has `fills=[]` on every member + slot; only itemSpacing (space-md/2xs) and text-style bindings carry tokens; figma-verify CLEAN; gate green with the grouping parts code-only.
**Candidate fix:** add a composites.md note: *"Surface-less composite (a layout/typography wrapper with no border/bg/shadow — e.g. Field): the Figma exposure surface is the structural ROW (its conditional-layout axis + state + slots + nested real control instances), bound to spacing + typography only. Pure grouping/legend/container wrappers and any container-query orientation are CODE-ONLY — port them fully but build no Figma set; record the code↔Figma cardinality gap (known-trap #19)."*

## 7. composites.md §1 Slot≠Slot — text parts as Figma SLOTs (not Text-properties) merge cleanly to set-level SLOT props

**Gap:** §1's table maps "editable string → **Text property**". For Field I built label/description/error as real Figma **Slots** (with a default text child carrying the format style) rather than Text-properties — because the brief wanted them swappable AND because consistent slot naming auto-merges them to ONE set-level SLOT property across all 4 variant members (so the porter recomposes any usage by dropping content into a slot, the §0 Done-Test contract). A Text-property would lock the part to a single editable string and wouldn't let a consumer drop in, say, a label-with-trailing-badge. The skill could note when to prefer a Slot-with-text-default over a bare Text-property for a composite's text regions.
**Verified:** 4 slots named label/control/description/error across 4 members → merged to exactly 4 set-level SLOT props (`label#…, control#…, description#…, error#…`); each accepts clear+append in an instance.
**Candidate fix:** add to §1: *"For a composite's text regions, prefer a **Slot with a text-node default** (bound to the format style) over a bare Text-property when the consumer may need to swap the region's content/structure, not just its string — consistent slot naming merges them to one set-level SLOT prop per region. Bare Text-property only when the region is strictly a single editable string."*

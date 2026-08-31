# Skill feedback — Select port (2026-06-19)

Run: `/shadcn-component-port select` (composite). Figma = background agent `figma-select-build`, code = main in parallel.
Findings = skill gaps + candidate fixes. **Not applied mid-run** (memory `skill-writing-style`). User reviews.

## Figma build (figma-build.md / composites.md / snippets) — from the background agent

**A. Slot merge happens at `combineAsVariants` time, NOT afterwards.** *(verified: instance exposed 6 un-merged
`leadingIcon#…` props)* — `§Slots` says "named consistently so it merges to ONE set-level SLOT property", but not
WHEN. `createSlot()` on every member of an ALREADY combined set → N separate same-named props (broken
instance API). Fix: build slots on the **standalone comps BEFORE `combineAsVariants`**. Explicit line in
`§Slots` / `§Variant set assembly`. *(= deviation D3 of this run: first built post-combine → deleted + rebuilt.)*

**B. `member.x = section.x + N` DOUBLE-offsets.** *(verified: content at abs x≈21000 for a section at x≈10600)* —
sharpens **#16**: section children take section-RELATIVE x/y (the headline sits at 80,80). The reflex `set.x = section.x + 80`
renders at `section.x + (section.x + 80)`. Fix: concrete WRONG/RIGHT in `composites.md` + `build-variant-set.js` —
child coords are **pure offsets from the section origin**, NEVER add `section.x`.

**C. Sections do NOT grow automatically with their children** — after positioning, `resizeWithoutConstraints` (hug),
otherwise the section stays headline-sized. Pairs with B. Belongs at the section invariant in `figma-build.md`.

**D. Instance slot-default removal is strictly ONE per `use_figma` call** *(sharpens #48)* — even with a re-fetch by
stable ID, the SECOND `slot.children[0].remove()` in the same tick throws "node not found". A guarded while loop
does NOT work in ONE call — every default child needs its own round trip (3 calls to empty 3 defaults).
Tighten `§Slots` "Filling a slot in an instance" accordingly.

## Code side (SKILL.md / composites.md / docgen-props / storybook-rules) — main

**E. KEEP the `radix-ui` umbrella import for full primitives — narrow finding #3.** Finding #3
("Radix umbrella → per-primitive") applied to the **Breadcrumb `Slot`-from-`radix-ui` case**. For a full primitive
(`Select`, `Dialog`), `import { Select as SelectPrimitive } from 'radix-ui'` is the project convention (Dialog identical)
and `radix-ui` a **declared** dep. The composite dep audit (§2 T2) should distinguish: keep the full-primitive umbrella,
only switch single sub-imports (`Slot`) to per-primitive.

**F. Composite doc prop across root + sub-part → `meta.component` + `subcomponents`.** *(storybook-rules/docgen-props gap)*
— Select has documentable props on TWO parts: root (`Select`: value/open/…) + trigger (`SelectTrigger`: size). The
Autodocs ArgsTable pulls only `meta.component`. Solution: `component: Select` + `meta.subcomponents = { SelectTrigger }` →
second ArgsTable; the sub-part control (`size`) lives as a **story-local** arg on Default (it does not reach the meta.component).
Rule for `/storybook-rules` (composite with prop split) + `/docgen-props` (annotate the sub-part, then subcomponents).

**G. Radix Select needs NO jsdom polyfill if the specs only render "closed".** SelectContent sits in the portal
(mounts only on open) → a spec that renders only trigger/root runs without `scrollIntoView`/`hasPointerCapture`. Cover the
open path (dropdown) via the Chromium storybook project (play). `§T6 Headless lib` could name the "closed-render spec
avoids the polyfill" heuristic.

## Build deviations (domain, for the record — not skill)

- **D1** SelectItem check = Figma trailing layout vector (`pr-md`/`right-2`); code = `absolute right-md` + `pr-3xl` clearance
  (shadcn idiom). Visually equivalent → marked for `/component-sync` as a known structural divergence, NO token delta.
- **D2** SelectItem padding `pl-sm`(6)/`pr-md`(8) asymmetric (the only verify hint) — intended.
- **D4** SelectLabel composed inline (no set of its own) — the brief lists it as layer-3 slot content.

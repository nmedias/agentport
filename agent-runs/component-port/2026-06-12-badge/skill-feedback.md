# Skill Feedback — 2026-06-12 badge port

Run: `/shadcn-component-port badge`, capture ON. Append one block per finding, on the spot.

## 1. T2 / T2.5 — landed source variant-set can exceed the doc/brief matrix

**Gap:** The skill's T2.5 says "source = ui.shadcn.com/docs/components/<x>" and the Figma matrix = "every value of every property". But the radix-nova `ui:add` source is **denser than stock** and can carry **extra CVA options** the public doc page never shows (badge landed with 6 variants — `default|secondary|destructive|outline|ghost|link` — vs the 4 the doc demos and the brief enumerate). The skill gives no rule for the case "landed CVA has more options than the canonical usage set / the brief Figma matrix names fewer". An agent can silently either (a) drop code options to match Figma, breaking the component, or (b) blow up the Figma matrix beyond the brief.
**Verified:** `libs/ui/src/components/ui/badge/badge.tsx` CVA `variant` = 6 keys; shadcn doc badge-demo + brief = 4. Nova baseline (MEMORY.md) explains the density delta.
**Candidate fix:** Add a T2 rule: *the code keeps the full landed CVA (never drop options to match a smaller doc/brief matrix — that breaks the component); the Figma matrix covers at least the brief/doc-named options, and SHOULD cover all landed CVA options unless the brief scopes it down — in which case note the code↔Figma axis gap explicitly in notes.* State which artifact is the source of truth for the axis cardinality.
**Status:** open

## 2. T3 — no DS typography format matches a 12px micro-label (badge `text-xs`)

**Gap:** §6 maps dead `text-xs` → "passende .text-format-* (§4)", but the 11 DS formats have **no 12px sans option**: `label`=14, `body`=14, `eyebrow`=9(mono/upper), `data`=11(mono). A 12px sans component label (badge, small chips) has no faithful format — the agent must round to `label` (14, +2px, larger than stock) with no skill guidance on the tradeoff (size fidelity vs using the nearest semantic role).
**Verified:** §4 size ladder — sans sizes available = 14/18/22/27/43; nothing at 12. Badge stock = 12px sans.
**Candidate fix:** §6/§4 should name the fallback rule for off-ladder sizes: *no exact format → pick by ROLE not px (badge label = `text-format-label`, accept the 14px snap) OR flag a missing DS micro-label format as an open item.* Currently the agent guesses.
**Status:** open

## 3. T4 / figma-build — placeholder variables carry a literal " ⚠" suffix in their Figma name

**Gap:** The placeholder color tokens (`secondary`, `destructive`, `chart-*`) are named in Figma with a trailing space + warning emoji — `shadcn Default/secondary ⚠`, `shadcn Default/destructive ⚠`. `recon.js` and the skill's binding examples match variables by `name.endsWith('/'+token)`, which **silently misses** these (the name ends in ` ⚠`, not `/secondary`). An agent following the skill literally fails to find the variable, then may wrongly conclude "no variable exists, bind raw hex" — exactly the placeholder rows the red-flag table warns about. tokens-reference §1 lists these as `primitive: raw` with `status: placeholder` but does NOT mention the ` ⚠` name suffix, so the lookup mismatch is invisible until you list every name.
**Verified:** `getLocalVariablesAsync` → semantic collection contains `shadcn Default/secondary ⚠`, `shadcn Default/destructive ⚠`, `shadcn Default/destructive-foreground ⚠`, `shadcn Default/secondary-foreground ⚠`, `chart-1..5 ⚠`. An `endsWith('/secondary')` filter returned `[]`; the broad name list found them.
**Candidate fix:** recon.js / figma-build.md should match placeholder tokens by a looser rule (`name.includes(token)` or strip a trailing ` ⚠` before compare) AND the skill should note that the DS marks placeholder variables with a ` ⚠` name suffix — so they ARE bindable (the red-flag "don't finalize" still holds, but bind to the real ⚠-variable, don't fall back to raw hex). tokens-reference §1 could record the suffix on the placeholder rows.
**Status:** open

## 4. T4 / figma-build — createComponent lands on the FIRST page unless you setCurrentPageAsync first; combineAsVariants then fails "same page"

**Gap:** `figma.currentPage` resets to the first page each `use_figma` call. `build-variant-set.js` opens with `setCurrentPageAsync(CFG.pageId)` so it's safe — but the skill never states this as an *invariant* for the incremental, multi-call build it itself recommends ("≤10 ops per call, screenshot after each step"). When an agent splits the component creation across several calls (the recommended pattern) and forgets to re-set the page at the top of EACH call, `createComponent()` silently appends to the wrong (first) page. The failure only surfaces later at `combineAsVariants(comps, section)` → `"Grouped nodes must be in the same page as the parent"`, far from the cause.
**Verified:** built 6 components across 2 `use_figma` calls without a page-set → all 6 landed on page `✦✦✦✦ Final ✦✦✦✦` (first page) while the target Section was on `Shadcn Components`; combine threw the same-page error. Re-parenting the components to the target page fixed it.
**Candidate fix:** figma-build.md "Incremental" / "Variant set assembly" should state: *every `use_figma` call that creates component nodes MUST `await figma.setCurrentPageAsync(targetPage)` as its first op (currentPage resets per call) — otherwise new nodes land on the first page and `combineAsVariants` fails with a misleading same-page error.* Make it a checklist item, not just an implicit feature of the snippet.
**Status:** open

## 5. T4 / figma-build — tinted bound surface (`bg-X/10`) needs a fallback-colour RESOLUTION recipe, not just "set the resolved colour"

**Gap:** figma-build.md says for a tinted bound paint: *"for opacity, set it plus the real resolved colour as the paint's fallback."* But a semantic variable's value is usually a `VARIABLE_ALIAS` → primitive → color, so "the real resolved colour" is not directly readable from `variable.valuesByMode[mode]` — you must walk the alias chain. The skill states the goal but gives no resolution snippet, so an agent either spreads the bound paint (the explicitly-banned move) or sets a wrong/black fallback. `build-variant-set.js` has no tinted-surface branch at all (only solid bound fills + a node-level `opacity` for disabled states, which would wrongly dim text too).
**Verified:** badge `destructive` = `bg-destructive/10`. `destructive` var value was an alias; needed a recursive `resolveColor(val)` (alias→getVariableByIdAsync→valuesByMode) to get `{r:.906,g:0,b:.043}` for the paint fallback before `{...paint, opacity:0.1}`. Result rendered the correct 10% red tint with the bound var retained.
**Candidate fix:** add a small "tinted bound surface" recipe to figma-build.md (and/or a `tintVar`+`tintOpacity` branch in build-variant-set.js): bind the paint, recursively resolve the variable's colour through any alias chain, set that as the paint's fallback colour, then set the paint-level `opacity`. Distinguish this from node-level `opacity` (which dims content too — only for disabled).
**Status:** open

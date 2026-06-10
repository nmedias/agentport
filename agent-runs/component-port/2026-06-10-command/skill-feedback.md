# Skill feedback — component-port: command (2026-06-10)

Target skill: `/shadcn-component-port` (+ `references/composites.md`, `references/figma-build.md`).
Captured on the spot during the run. User reviews + applies; never folded in here.

## 1. T2 audit (composites §2) — nova IconPlaceholder lands as `lucide-react`, not a DS-resolvable icon

**Gap:** The T2 dependency-audit (composites §2 T2) covers foreign **component** deps that `ui:add`
drags in flat (shadowing vs un-ported). It does **not** mention that radix-nova sources using the
registry artifact `IconPlaceholder` get rewritten by `ui:add` into **`lucide-react`** imports
(`import { SearchIcon, CheckIcon } from "lucide-react"`). `lucide-react` is **not installed** in this
repo (DS icon lib is `@remixicon/react`), so the landed source does not compile until swapped — a gate
break that looks like an icon-styling task but is really a dependency-resolution one.

**Verified:** `ui:add command` (radix-nova) landed `command.tsx` with `lucide-react` imports for the
two `IconPlaceholder` glyphs (search, check). `lucide-react` absent from both `package.json`s; remix
equivalents (`RiSearchLine`, `RiCheckLine`) confirmed present in `@remixicon/react`. Swapping them was
required for `nx typecheck` to pass.

**Candidate fix:** In the T2 audit (and/or figma-build.md "Icons" / SKILL T2 Land step) add: *"radix-nova
sources resolve the registry `IconPlaceholder` to `lucide-react` imports on `ui:add`; `lucide-react`
is not a DS dependency. Swap each to its `@remixicon/react` equivalent during the T2 audit (a
dependency-resolution fix that keeps the tree compiling — not the T6 cosmetic re-clothing)."*

**Status:** open

## 3. figma-build.md (Slots) — slot DEFAULT content makes per-instance composition additive; "remove() of default children in an instance" is unreliable

**Gap:** figma-build.md §Slots says to "drop a sensible default inside" the slot, and the slot-in-instance
note says *"remove() of a slot's default children IS allowed inside an instance."* In practice, building
the reproduced-example instances (composites.md T4 layer 4) — which fill slots in `.Command` / `.Command/Group`
INSTANCES — this is the single most error-prone step and the doc's guidance is partly wrong:
- A slot's **default** content surfaces in an instance as **virtual, read-only** children (ids like
  `I<inst>;<orig>`). Calling `.remove()` on them — or even reading `.name` — throws `Node ... not found`.
- `appendChild` to the slot **adds** real content but does **not** replace the virtual defaults — they
  **coexist** visibly (verified: a group instance with 2 default items + 1 appended → 3 items shown).
- Net: an instance whose slot has component-defined defaults **cannot** be reduced to exactly the
  example's content programmatically. The only reliable path is to build composition slots **EMPTY** in
  the component (remove defaults at the COMPONENT level, where children are real/removable), so instances
  fill cleanly via append.

**Verified:** `slot.children[0].remove()` and `slot.children.map(c=>c.name)` both threw
`Node with id I3569:2;3565:13 not found` on a `.Command/Group` instance. Append probe → childCount 3
(2 virtual defaults + 1 appended), screenshot showed all three. *Inconsistency:* removing `.InputGroup`'s
**single non-variant** content-slot default DID work in the same run — so removal seems to work for some
slot defaults (single plain instance) but not others (variant-instance defaults). Treat removal as
unreliable regardless.

**Candidate fix:** In figma-build.md §Slots, replace "drop a sensible default inside" + "remove() … is
allowed" with: *"If a slot is meant to be **composed per-instance** (reproduced examples, user
composition), build it **EMPTY** in the component — a slot's default content surfaces in instances as
virtual read-only children that cannot be reliably removed and that **coexist** with appended content
(append does NOT replace the default). Put 'sensible defaults' only in slots that instances won't
recompose. Empty an auto-layout slot's collapse with a minHeight/placeholder if needed."* Add to the
slot-in-instance list: *"appendChild ADDS alongside the virtual default — it does not replace it."*

**Extra gotcha (verified):** calling `instance.setProperties(...)` on an instance **materialises** its
inherited slot defaults into **real** overrides on that instance — after which they ARE removable
(unlike pure virtual defaults). Observed: two `.Command/Group` instances in the same list slot — the one
I'd called `setProperties({heading})` on kept its 2 default items after the component slot was emptied
(real overrides), the untouched one inherited the now-empty slot cleanly. Worth a one-liner: *"setProperties
on an instance flattens its inherited slot defaults to real children — empty the component slot BEFORE
instantiating, or delete the materialised children afterward."*

**Status:** open

## 2. T2 audit (composites §2) — un-ported dep consumed by a composite SUB-PART → defer the whole sub-part, not just the dep file

**Gap:** composites §2 T2 says an un-ported foreign dep must be "port / stub / delete+defer — never
leave one in the tree," which correctly gets `dialog.tsx` deleted. But Command's `CommandDialog`
sub-export *consumes* Dialog directly (imports `Dialog/DialogContent/...`). Deleting only `dialog.tsx`
leaves a dangling import in `command.tsx` → gate red. The actual move is to defer the **whole consuming
sub-part**: remove `CommandDialog` (its function + its line in `export {…}`) **and** skip its
doc-example/story, logging it for re-add once the dep is ported. The skill's skip-rule (T2.5) only
frames this for *examples*, not for a sub-export that is part of the component's own surface.

**Verified:** Removing `dialog.tsx` alone left `import { Dialog, … } from "@/components/ui/dialog"` +
the `CommandDialog` function referencing them. Removing `CommandDialog` + its export + (later) its
story example was required; `nx typecheck` green only after all of it. CommandDialog logged as deferred
(needs a Dialog port; catalog Dialog status = pending).

**Candidate fix:** In composites §2 T2 (un-ported dep branch) add: *"if an un-ported dep is consumed by
a **sub-part/sub-export** of the composite (not just a doc-example), defer that whole sub-part — remove
its code + its entry in the `export {}` barrel + its story — and log it for re-add when the dep lands.
Deleting only the dep file leaves a dangling import → gate red."*

**Status:** open

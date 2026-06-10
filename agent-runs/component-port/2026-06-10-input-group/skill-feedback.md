# Skill Feedback — /shadcn-component-port — run: InputGroup re-port (2026-06-10)

GREEN test of the reworked composite-port skill (3 files: SKILL.md + composites.md + figma-build.md).
Findings captured on the spot; user reviews + applies. Never edit the target skill mid-run.

## 1. composites.md §2 T2 / §3 trap-1 — Dependency-Audit misses the *shadowing* failure mode   [— ✅ written into composites.md]

**Gap:** The Dependency-Audit only frames the gate-break as "an **un-ported** foreign component left in
the tree" (`§3`: "gate break if an un-ported one is in the tree"; `§2 T2`: decide port / stub /
delete+defer). It misses the symmetric, sneakier case: when the dep is **already ported into a folder**
(`components/ui/button/button.tsx` + barrel), `ui:add <composite>` writes the dep **flat**
(`components/ui/button.tsx`). The flat file does **not** collide with the folder, so nothing is
overwritten and the audit's "is it ported?" check passes — but Node/TS module resolution prefers
`button.tsx` (file) over `button/` (dir), so the flat **stock** copy silently **shadows** the DS folder
version. Typecheck may still pass (same export surface), yet every `@/components/ui/button` import now
resolves to the stock, non-DS component → the port builds against the wrong base and the gate validates
a lie.

**Verified:** This run — `ui:add input-group` wrote `button.tsx`, `input.tsx`, `textarea.tsx`,
`input-group.tsx` all flat at `libs/ui/src/components/ui/`; the DS versions live at `.../button/button.tsx`
etc. No overwrite reported by the CLI ("Created 4 files"), so a naive audit sees no conflict.

**Candidate fix:** Add to composites.md §2 T2 (and/or §3 traps): after `ui:add`, list **flat** files
written; for any dep that is **already ported as a folder**, the stock flat copy **shadows** the DS
folder on import resolution → **delete the flat copy** (keep the folder). Decision matrix gains a row:
*already-ported (folder) → delete the flat stock copy* (distinct from *un-ported → port/stub/defer*).
One-liner: "An already-ported dep written flat shadows its DS folder — delete the flat copy, don't trust
'no overwrite' as 'no conflict'."

**Status:** ✅ written into composites.md (§2 T2 decision matrix + §3 trap-1) — 2026-06-10.

## 2. figma-build.md (Slots) — missing the slot-fill-IN-AN-INSTANCE mechanics (the composite example-build core)

**Gap:** figma-build.md's Slots section covers building a slot in a *component* (createSlot, fills=[],
own auto-layout, default content). It says **nothing** about *filling* a slot in an **instance** — which
is exactly what composites.md T4 layer-4 (reproduced example instances) requires, and is the single most
error-prone part of a composite port. Three non-obvious behaviours cost retries this run:
1. **append adds, does not replace.** `slot.appendChild(x)` on an instance's slot leaves the default
   content AND x (both render). To swap, **clear first**: `[...slot.children].forEach(c=>c.remove())`
   then append. (remove() of default slot children *is* allowed in an instance — verified.)
2. **slot `layoutMode` is locked in an instance.** Setting `slot.layoutMode='VERTICAL'` on an instance
   silently no-ops (stays as the main's direction). Direction must be baked into the component (or a
   variant axis), never changed per-instance.
3. **appending an instance into an instance-slot invalidates the JS reference.** After
   `slot.appendChild(partInstance)`, `partInstance.layoutSizingHorizontal='FILL'` throws "node … does not
   exist". Re-resolve the live child (`slot.children[i]`, or match by `getMainComponentAsync()`) and set
   sizing on that.

**Verified:** All three reproduced this run on the .InputGroup/Addon + .InputGroup container instances
(de-risk tests + the Icons example's first attempt threw on the stale FILL set, atomic-rolled-back, fixed
by re-resolving).

**Candidate fix:** Add a "Filling a slot in an instance" subsection to figma-build.md Slots:
clear-then-append; remove() works on instance slot defaults; layoutMode is instance-locked (bake
direction into the component / a variant axis); append invalidates the ref → re-resolve the live child
before sizing. This is the recipe composites.md T4 layer-4 silently assumes.

**Status:** ✅ written into figma-build.md (Slots → "Filling a slot IN AN INSTANCE" subsection) — 2026-06-10.

## 3. composites.md §1/§2 — a CSS `has-[]` conditional-LAYOUT needs a Figma variant axis (no instance-level layout)

**Gap:** composites.md §1 maps content variation → Slot/Swap/Variant/Text, but doesn't address
**conditional layout**: a composite whose *direction* flips on content (InputGroup goes `flex-col` via
`has-[>[data-align=block-*]]` / `has-[>textarea]`). Figma has no conditional layout and (finding #2)
slot direction is instance-locked, so the orientation **must** become a container **Variant axis**
(here `layout: horizontal|vertical`), doubling the state matrix. A porter following §1 alone models only
`state` and then can't reproduce the textarea/block examples (the slot won't stack).

**Verified:** This run — the container needed `state(4) × layout(2)` = 8 variants specifically because the
vertical (textarea) example can't be produced by editing a horizontal instance's slot.

**Candidate fix:** Add a row/note to composites.md §1: "**Conditional layout** (CSS `has-[]`/`flex-col`
that flips direction on content) → a **Variant axis** on the composition (e.g. `layout: horizontal|
vertical`), because Figma has no conditional layout and slot direction is instance-locked (figma-build.md).
Expect the state matrix to multiply by the layout axis."

**Status:** ✅ written into composites.md (§1 mechanism table: conditional-layout → Variant-axis row + note) — 2026-06-10.

## 4. composites.md layer-2 / figma-build.md — "nest the ported component" needs the HARD-CASE recipe (+ predecessor is not authoritative)

**Gap:** composites.md layer-2 ("a composed already-ported component = a real instance, never a rebuild") is
stated as a clean one-liner, but gives no recipe for the common hard case where the ported component **hides
geometry in a nested Base** and **gates content behind a non-removable slot default with no icon library**. Result:
a porter (me) saw the *prior* build had a standalone re-clothe, copied it, and silently violated layer-2 — the user
had to catch it. Two sub-gaps:
(a) **The existing/prior build is NOT authoritative** for the nest-vs-rebuild decision. A re-port must apply layer-2
    even when the predecessor was standalone — don't inherit the predecessor's shortcut.
(b) **No recipe for nesting when the component doesn't expose content/geometry.**

**Verified (this run, DS Button `3164:312`):**
- Top-level Button instance is `lm:NONE` → overriding its padding/radius is a no-op. Geometry lives one level down
  in the nested `.Button/Base` instance, where `setBoundVariable('topLeftRadius', radiusSm)` **does** work.
- Text content: deep-override the inner Base TEXT characters — works.
- Icon content: `Icon#3159:0` is a SLOT *type*, but its default `.Button Icon` **can't be `remove()`d** in an
  instance and there's **no icon-component library** → a raw SVG can't be injected. **`swapComponent`** on
  `.Button Icon` → a persistent icon component **does** work (the swap-target must persist = canvas cruft, one per icon).

**Candidate fix:** (1) composites.md layer-2: add "**A re-port is not bound by how the predecessor was built** —
apply the nest rule even if the old version was a standalone re-clothe." (2) figma-build.md (new note under
"Reuse, don't rebuild" / nesting): "**Nesting a component that doesn't expose content/geometry:** geometry often
lives in a nested `*/Base` instance (override one level down via `setBoundVariable`, not the `lm:NONE` top); text =
deep characters override; an icon behind a locked slot default (no icon library) needs **`swapComponent`** onto a
**persistent** icon component (one swap-target per icon = accepted cruft). If even that is too costly, flag the
*upstream* fix — expose a real fillable icon slot + label prop on the base component — rather than re-cloth standalone."

**Status:** open  ·  *(this run: Button re-nested per the above; user-confirmed)*

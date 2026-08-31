# Skill feedback — /shadcn-component-port · Dialog (2026-06-10)

## 1. T2 dependency audit — lucide IconPlaceholder finding reproduced (Command #1)

**Gap:** The skill (SKILL.md T2 / composites.md §2) still does not name the case: the nova source uses
`IconPlaceholder`; `ui:add` materialises it as a `lucide-react` import — the lib is not installed
→ the gate breaks if the swap only happens in T6.
**Verified:** Second hit in a row. Dialog landed with `import { XIcon } from "lucide-react"`
(Command run: identical with other icons). The registry JSON already names the Remix equivalent in the
`IconPlaceholder` call (`remixicon="RiCloseLine"`) — the translation is mechanically readable.
**Candidate fix:** Add to T2 (audit step): after `ui:add`, swap every `lucide-react` import line
to the `@remixicon/react` equivalent; the target icon is in the registry JSON as the
`remixicon` prop of the `IconPlaceholder`. Dep resolution in T2, not T6 cosmetics.
**Status:** open (confirms Command run finding #1; already recorded as open there)

## 2. figma-build.md · icon swap — hit the swap target by main name, not by /icon/ match

**Gap:** The nesting recipe (nested DS Button, icon via `swapComponent`) does not say HOW to identify the
swap target in the instance tree. A generic name match (`/icon/i` over the
main-component names) first hits the **`.Button/Base` instance** — whose member name `size=icon-sm`
contains "icon". The swap then replaces the whole Base (geometry/states gone), not the icon.
**Verified:** Dialog run, close button: the first swap hit `size=icon-sm` (Base) instead of `.Button Icon`;
visually inconspicuous (the X appeared correctly), structurally wrong — only detected via the return value.
Fix: swapped the Base back, then swapped exactly `mc.name === '.Button Icon'` → correct.
**Candidate fix:** Add to figma-build.md §Icons/Nesting: the swap target is the instance whose
**main component is exactly the dedicated icon/swap-target component** (name from the catalog, e.g.
`.Button Icon`); never match by substring over variant member names (`size=icon-*` collides).
After every swap check the result structurally (which main now hangs where), not just visually.
**Status:** open

## 3. figma-build.md/composites.md · slot defaults in instances — behaviour clarified (Command #3 refined)

**Gap:** Command finding #3 says flatly "default content virtual/read-only, build slots EMPTY".
The Dialog run (slot WITH a default instance, at the user's request) shows a more nuanced picture, which
neither figma-build.md ("remove() of slot defaults IS allowed") nor the Command finding captures correctly.
**Verified:** Dialog run, footer slot with default `.Dialog/Footer` instance:
1. A slot with a default presents itself in the instance as **FRAME, not SLOT** → `findOne(type==='SLOT')`
   does not find it (an empty slot stays SLOT). Match by **name**, not type.
2. Names/visible of the default children are **readable** (no node-not-found on read as in the Command run).
3. `remove()` of a default child **works**, but invalidates the sibling refs (a pre-cloned
   array → the second remove throws "Node not found"). → **One remove per re-resolve**:
   `while (slot.children.length) slot.children[0].remove()` pattern instead of `[...children].forEach(remove)`.
4. Append into an empty instance slot works directly; appended children likewise only mutable after a re-resolve.
**Candidate fix:** Replace figma-build.md §Slots "Filling a slot IN AN INSTANCE" with the
re-resolve invariant: **EVERY structural mutation in an instance slot (append AND remove) invalidates
all held child refs** → re-resolve before every follow-up operation; match slots in instances by name
(the type flips to FRAME with default content). Soften composites.md/Command #3 accordingly:
slots with a meaningful default are usable — defaults are removable/replaceable, just under the
re-resolve invariant.
**Status:** open

## 4. figma-build.md · slots — never bind visibility directly on a SLOT node (degrades to FRAME)

**Gap:** figma-build.md knows boolean props for visibility but does not warn: if you set
`componentPropertyReferences = { visible }` (+ `visible = false`) **directly on a SLOT node**,
**Figma silently converts the SLOT to a FRAME** — slot behaviour gone (instance appends throw
"New parent is an instance"), and **existing slot contents in instances are discarded**.
**Verified:** Dialog run: body slot bound via visible↔showBody → master node `type: FRAME`;
ex2/ex3 lost their filled bodies; appends failed. Fix verified: a wrapper FRAME
(`body-region`) carries boolean+visible, a fresh SLOT inside it — slot behaviour + instance fills ok.
**Candidate fix:** In figma-build.md §Slots: "An optional slot = wrapper FRAME (carries the
visibility boolean) + SLOT as its child. Visibility refs/visible directly on the SLOT degrade it
to a FRAME and discard instance contents." Additionally: master slot rebuilds AFTER built
example instances cost their slot overrides → define the surface finally first, then the examples (confirm the T4
order).
**Status:** open

## 5. figma-build.md · slots — an empty slot renders with a default height (~100px), not 0

**Gap:** "Default geometry is unreliable" names 100×100/HUG variants at CREATION time; but not that
a slot left empty stands in the layout with ~100px residual height despite `layoutSizingVertical='HUG'` —
an "open region, empty by default" slot produces visible slack in every instance without content.
**Verified:** Dialog run: body slot empty → body-less dialogs ~100px too tall (master 264 instead of 148).
Fix: wrapper with visibility boolean (default off) — default panel tight, identical to the code.
**Candidate fix:** Add to §Slots: put empty optional slots behind a visibility boolean on the wrapper
(pattern from finding #4); slots that always carry content are not affected.
**Status:** open

## 6. SKILL.md T2.5/T6 · stories — write play functions without DOM globals

**Gap:** T2.5 says nothing about the fact that the project's stories typecheck environment (`tsc --build`)
loads **no DOM lib**: `document`/`ownerDocument` in a play function break `nx typecheck`,
although tests/Storybook run. Portal components (Dialog, Popover …) invite exactly that
(content renders outside the canvas).
**Verified:** Dialog run: `within(document.body)` → TS2584; `canvasElement.ownerDocument` → TS2339.
Solution: assert via canvas-internal states (trigger `aria-expanded` via jest-dom matcher from
`storybook/test`) — typecheck green.
**Candidate fix:** T2.5 bullet: "Keep play functions free of DOM globals; for portal components assert via
the trigger's canvas-internal ARIA states (deep assertions into the portal belong in the spec,
not in the story)."
**Status:** open

## 7. T6 — the "rendered-output check" is toothless if only URLs are handed over

**Gap:** T6 says "preview-stories → surface every URL (rendered-output check)" — the run handed over the URLs
but never inspected the rendering. So the port shipped `sm:max-w-sm`, which through the
`--spacing-*`/`--container` collision (named steps shadowed the container scale in
w/min-w/max-w/basis) compiled to **6px** instead of 24rem. The gate (lint/test/typecheck) and spec
class assertions in principle never see compiled CSS values; /figma-verify only checks Figma.
The user found the bug, not the procedure. (Collision fixed since: steps via @utility only on
gap/p/m — tokens-reference §3 collision rule.)
**Verified:** Dialog run + follow-up fix 2026-06-11; dist CSS showed `max-width: var(--spacing-sm)` = 6px.
**Candidate fix:** Tighten T6: check at least one story **rendered** (browser/screenshot,
not just output the URL) with an eye on geometry (widths/heights plausible?); additionally, when using
T-shirt names on sizing utilities (`max-w-*`, `w-*`, `basis-*`), check against the tokens-reference §3
collision rule. Alternatively a dist-CSS grep of the new classes for expected values.
**Status:** open (the collision itself fixed in `5b62f77`; the procedural hole remains open)

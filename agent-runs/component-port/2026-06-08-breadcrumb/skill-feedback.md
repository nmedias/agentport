# Skill feedback — shadcn-component-port (run: Breadcrumb, 2026-06-08)

## 1. T6 Code — align Radix sub-package imports to the project convention, not the registry's

**Gap:** The skill's icon guidance (lucide → Remix) is covered, but it says nothing about the other
import the shadcn registry emits that diverges from the project: the **Radix Slot import**. The
current shadcn registry writes `import { Slot } from "radix-ui"` and uses `Slot.Root`. The project's
established components (e.g. `button.tsx`) import `import { Slot } from "@radix-ui/react-slot"` and use
`Slot` directly. `radix-ui` (the umbrella package) is present in node_modules only transitively — it is
**not a declared dependency** — so following the registry verbatim introduces a phantom-dependency
import.

**Verified:** `package.json` declares `@radix-ui/react-slot ^1.2.4`; `radix-ui` is absent from
dependencies/devDependencies but present in node_modules. `button.tsx:2` = `import { Slot } from
'@radix-ui/react-slot'`, `Comp = asChild ? Slot : 'button'`.

**Candidate fix:** Add a T6 line next to the icon rule: "Radix primitives — the registry may import
from the umbrella `radix-ui` package (e.g. `import { Slot } from "radix-ui"` + `Slot.Root`). Align to
the project's existing per-primitive import convention instead (`@radix-ui/react-slot`, `Slot`) and
confirm the package is a declared dependency — don't rely on the umbrella package if it's only present
transitively." Generalises beyond Slot to any Radix primitive a ported component pulls in.

**Status:** open

## 2. T4 build snippet — set AUTO sizing modes on the combined set, or vertical padding silently no-ops

**Gap:** `snippets/build-variant-set.js` (lines ~113-115) configures the combined set's `layoutMode`,
`layoutWrap`, `itemSpacing` and the four `padding*` values, but never sets `primaryAxisSizingMode` /
`counterAxisSizingMode`. After `combineAsVariants`, the set's counter-axis sizing can be FIXED, so
assigning `paddingTop`/`paddingBottom` does **not** grow the set — the padding is silently dropped on
that axis. It happened to work for the Button pilot (members are FIXED-height 36), but bit this run
where the members are HUG-height text: the set came out 21px tall (member height, no vertical padding)
until `counterAxisSizingMode = 'AUTO'` was set explicitly.

**Verified:** First build → `setH: 21` with `paddingTop/Bottom = 32` requested (horizontal padding DID
apply: width 358 incl. 64px). After re-running with `primaryAxisSizingMode = counterAxisSizingMode =
'AUTO'` + padding → `setH: 69` (21 + 48). Reproducible whenever set members hug rather than fixed.

**Candidate fix:** In the set-config block of the snippet, after `set.layoutMode = ...`, add
`set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';` before assigning padding —
so padding expands the set on both axes regardless of whether members are FIXED or HUG.

**Status:** open

## 3. T4 — no snippet template for multi-part composites (text segments, icon adornments, slot composition)

**Gap:** `build-variant-set.js` is generalised for Button + FIELD types (surface/stroke/label/icon on a
single set). A multi-part composite like Breadcrumb needs several different builds the snippet doesn't
template: (a) a text-only **segment set** (no fill/stroke, just a Body text node with bound colour +
a TEXT `Label` property), (b) standalone **icon-adornment** components (vector sized numerically, fill
bound), (c) a **composition component** wrapping a `createSlot()` auto-layout pre-filled with part
instances. The T2/T4 *prose* covers the model well, but each sub-build had to be hand-written. Not a
correctness bug — a missing scaffold.

**Candidate fix (optional):** Add a short composite scaffold (or a labelled section in the snippet) for
the three recurring composite sub-builds above — at minimum the `createSlot()` + instance-prefill
pattern, since that is the least obvious part of the API.

**Status:** open

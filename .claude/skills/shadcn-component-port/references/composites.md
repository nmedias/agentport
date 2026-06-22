# Composite Port — delta to SKILL.md (multi-part composites only)

**Scope:** multi-part composites = several `data-slot` parts that render independently, **no single
root element** (e.g. an input with adornments, a command palette, a dialog). Single-element ports →
SKILL.md unchanged.

**How to read:** SKILL.md is the spine. This file adds the **composite delta**; everything else is
unchanged. **General — not repeated here:** the **usage-example/story lifecycle** (SKILL.md — T2.5
stories-from-docs *before Figma*, in the doc's real composition; T5 build-each-story-as-a-permanent-example;
jsdom polyfill once-per-lib; T7 example-inventory); and the **Figma build mechanics**
(`references/figma-build.md` — binding by ID, slot config, the Base + `state`-axis interaction patterns,
`setBoundVariableForPaint`, `createSlot`, `combineAsVariants`, full matrix, sorted grid, Section, the
permanent **Usage-Examples** group + Done-Test).

## 1 · Mechanism — Slot ≠ Slot

Frontend "slot" (`children`) ≠ Figma Slot. The general **code-construct → Figma-property** table
(Text / Boolean / Variant / Instance-Swap / Slot / conditional-layout→Variant-axis) + its when-rules
moved to **`figma-build.md §Mechanism`** (applies to every port). Composite-specific here:

- **One composite usually combines several** — an editable string→Text, an optional element→Boolean,
  a finite choice (align/size/state)→Variant, a one-off swappable element→Instance-Swap, an open
  region→Slot, and any composed already-ported component→a nested instance of it.
- The **conditional-layout → Variant-axis** row bites hardest here: it **multiplies the matrix**
  (state × layout) — a porter modelling only `state` can't reproduce the column-stacking examples.

## 2 · Flow — overrides/extends T2–T7

**T2 — Anatomy + Dependency-Audit**
- As SKILL.md T2, **plus the audit (mandatory):** `ui:add <composite>` writes
  dependency-components **too**, always **flat** (`components/ui/<dep>.tsx`). List every written
  file; per foreign dep decide:
  - **un-ported** → port / stub / delete+defer. Never leave one in the tree — breaks the gate
    (seen: a composite's sub-part imported an un-installed icon lib → gate red). **delete+defer ≠ just the
    dep file** — a kept sub-part still importing it leaves dangling imports; remove the whole consuming
    sub-export (function + barrel line + story) and log it for re-add.
  - **already ported as a folder** (`components/ui/<dep>/`) → **delete the flat stock copy.** It does
    NOT collide with the folder, so `ui:add` reports no overwrite — but module resolution prefers
    `<dep>.tsx` (file) over `<dep>/` (dir), so the flat stock **shadows** the DS version: every import
    silently resolves to stock, typecheck still passes, the gate validates a lie. **"no overwrite" ≠
    "no conflict".** (Keep only the composite's own source; move it into its folder.)

**T2.5 — Examples → Stories** — general (SKILL.md). Composite wrinkle: the **skip-rule** bites hardest
here (a composite example often composes *another* component → skip + log if it isn't ported yet); and
write **one story per structurally-distinct composition**, not per part.

**T2.6 — Derive the Exposure-Surface** — a single-element port reads its control set straight off the
CVA (T2); a composite has **no CVA / no root**, so reconstruct it: union of what the stories vary = the
control set (Properties / Instance-Swaps / Slots), mapped per `figma-build.md §Mechanism`. *(That the
surface must reproduce every usage is the general Done-Test, `§Usage-examples`.)*

**Usage-contract from the doc examples, not the style-source** — cross-check the wrapper API against ≥1
doc example before T3; when the landed source and the doc disagree on the call-site shape (e.g. a wrapper
rendering `children` bare vs wrapped), reproduce the **doc example's** API and note the source deviation.

**Porting into an existing family?** Mirror the **nearest ported sibling's** exposure surface (read it
from the catalog) — don't derive a thinner one from stock source + brief: match the family's state-axis
convention (how focus / invalid / disabled combine + gate), expose optional elements as **booleans** (not
non-toggleable slot defaults), and give each API part its own story-file/doc page (`/storybook-rules`).
Mirror the sibling's *surface*, but still verify its *values* — a predecessor isn't blindly authoritative.

**T2.7 — Composition-Plan → ask the user** *(this IS the composite-ask SKILL.md T2 defers here)*
- Plan in plain language (user doesn't know shadcn): parts list, how they interplay, the
  story-set, the proposed exposure-model per part. Questions carry the recommended option
  **first** (`AskUserQuestion`). Forks: (1) **part-split** — which parts share one position
  (→ `state` axis, values keep the shadcn part names for code parity) vs. stand alone (own
  components); (2) **Slot vs Swap** per open content; (3) any **whole-level** variants on the
  composition; (4) each Slot's **default content**.

**T4 — Figma build (three layers + examples)**
1. **Base sub-components** — factor recurring config shared across large sets into an
   internal Base; members instance it and override only the **delta** (token edits then
   propagate). The Base sub-component pattern (`references/figma-build.md`), generalised to any recurring config.
2. **Nest existing instances** — a composed already-ported component = a real **instance** of it,
   never a rebuild (token edits propagate).
3. **Flexible composition component** — the composite as **one** recompose-able component
   (Props/Swap/Slots from §1); whole-level variants ride on it. Slot config per `references/figma-build.md`.
   - **Anchored overlay** (content floats at the trigger, not centred — Figma can't "open"): model the open
     state as a top-level composition — a trigger instance + the overlay content in an `ABSOLUTE` /
     `layoutPositioning` child anchored to the trigger edge, not just the separate trigger/content sets.
4. **Usage-Examples group** — the general permanent group (`references/figma-build.md §Usage-examples`);
   here it is build **layer 4**, reproduction running through slots / swaps / nested instances (= the
   Done-Test proof).
- Bind every property by variable **ID**. Section children = **section-relative** coords.

**T5 — Verify** — general (SKILL.md). Composite: the **permanent reproduced example instances** (T4 layer
4) are the standing proof — **non-trivial here** because reproduction runs through slots / swaps / nested
instances, not props alone (dropping an instance **into a slot** counts as a control; a hand-placed element
beside/without a slot does not). A story that can't be rebuilt from the composition's controls → surface
incomplete → back to T2.6.

**T7 — Notes** — general inventory in SKILL.md T7. Composite adds: **exposure-model per part** (which
variation → which mechanism + why) and any open foreign-dependency from the T2 audit.

## 3 · Composite traps *(additive to SKILL.md Red flags)*

- `ui:add <composite>` drags dependency-components in (always **flat**) → gate break: an **un-ported**
  one left in the tree, OR an **already-ported** one whose flat stock copy **shadows** its DS folder
  (`<dep>.tsx` beats `<dep>/` in resolution; typecheck still green) → delete the flat copy. See §2 T2.
- Section children: section-relative `x/y`, never add the section's abs-offset.
- *(`createSlot` untyped + `setBoundVariableForPaint` returns a new paint → `references/figma-build.md`;
  jsdom polyfill once-per-lib → SKILL.md.)*

## 4 · Red flags

- Example **hand-built** instead of reproducible from controls → surface incomplete.
- Flat `part` axis **mixing part kinds** → split by structure (interchangeable in one
  position → `state` axis with shadcn part names; structurally different → own components).
- Un-ported foreign component in the tree → gate breaks.

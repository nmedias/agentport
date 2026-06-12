# Composite Port — delta to SKILL.md (multi-part composites only)

**Scope:** multi-part composites = several `data-slot` parts that render independently, **no single
root element** (e.g. an input with adornments, a command palette, a dialog). Single-element ports →
SKILL.md unchanged.

**How to read:** SKILL.md is the spine. This file adds the **composite delta**; everything else is
unchanged. **General — not repeated here:** the **usage-example/story lifecycle** (SKILL.md — T2.5
stories-from-docs *before Figma*, T5 rebuild-each-story-from-controls, jsdom polyfill once-per-lib, T7
example-inventory); and the **Figma build mechanics** (`references/figma-build.md` — binding by ID,
slot config, the Base + `state`-axis interaction patterns, `setBoundVariableForPaint`, `createSlot`,
`combineAsVariants`, full matrix, sorted grid, Section).

## 0 · Principle — Exposure-Surface + Done-Test

Deliverable = the **Exposure-Surface**: the set of Figma controls (Properties /
Instance-Swaps / Slots) a Figma user recomposes **every** portable code-usage from.

**Done-Test (provable):** each *portable* doc-usage-example is reproducible in Figma from
the composition component's controls **alone**. One that isn't → surface incomplete →
iterate. Dropping an instance **into a slot counts as a control**; a hand-placed element
beside/without a slot does not. *(Past failure: example hand-built as a Frame, not
rebuildable from controls.)* This is SKILL.md T5's rebuild-check — **non-trivial here** because
reproduction runs through slots / swaps / nested instances, not props alone.

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
    (seen: a composite's sub-part imported an un-installed icon lib → gate red).
  - **already ported as a folder** (`components/ui/<dep>/`) → **delete the flat stock copy.** It does
    NOT collide with the folder, so `ui:add` reports no overwrite — but module resolution prefers
    `<dep>.tsx` (file) over `<dep>/` (dir), so the flat stock **shadows** the DS version: every import
    silently resolves to stock, typecheck still passes, the gate validates a lie. **"no overwrite" ≠
    "no conflict".** (Keep only the composite's own source; move it into its folder.)

**T2.5 — Examples → Stories** — general (SKILL.md). Composite wrinkle: the **skip-rule** bites hardest
here (a composite example often composes *another* component → skip + log if it isn't ported yet); and
write **one story per structurally-distinct composition**, not per part.

**T2.6 — Derive the Exposure-Surface**
- Union of what the stories vary = the exact set of Properties/Swaps/Slots (apply §1 per
  variation point).

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
4. **Reproduced example instances** — **one instance per portable doc-example**, built
   **only** from the component's controls (= the §0 Done-Test proof).
- Bind every property by variable **ID**. Section children = **section-relative** coords.

**T5 — Verify** — general (SKILL.md). Composite: the **permanent reproduced example instances** (T4
layer 4) are the standing proof; a story that can't be rebuilt from the composition's controls →
surface incomplete → back to T2.6.

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

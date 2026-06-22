---
name: shadcn-component-port
description: "Initial, first-time port of a shadcn/ui component into the Agentport DS — read its anatomy from the shadcn MCP, build a token-bound Figma component set with variants, then write the code on the DS utility vocabulary. Trigger when the user wants to add / port / rebuild / nachbauen a shadcn component (Button, Input, Card, Badge …) that does NOT exist in the DS yet, Figma + code together. To reconcile an ALREADY-built component after a Figma change, use /component-sync instead."
argument-hint: Which shadcn component you would like to import? 
---

# Shadcn Component Port (Initial · Shadcn → Figma → Code)

**First-time** port of one shadcn/ui component into the Agentport DS, **token-faithful**: keep shadcn
structure + variant logic, re-clothe in DS tokens only. For an already-built component whose Figma
set changed, this is the wrong skill — use `/component-sync`.

## Inputs / Output

```
in   component: shadcn item name (button, input, badge…)   REQUIRED
out  figma  .<Component> set on the Components page (every property bound to DS variables)
            + a permanent Usage-Examples group (real instances reproducing the stories) in its Section
     code   components/ui/<component>/ — <component>.tsx + .stories.tsx + .spec.tsx + barrel index.ts,
            on DS utilities; `npx nx test|typecheck|lint @agentport/ui` green
     notes  agent-runs/component-port/<YYYY-MM-DD>-<component>/notes.md
```

## Data Source

`design-docs/design-system/tokens-reference.md` = the only source for Figma var ↔ CSS var ↔
Tailwind utility ↔ value ↔ `use`/`avoid`; §6 = stock-shadcn → DS translation. **Never duplicate
token values into this skill** — it is the procedure, the reference is the data.

## Figma Rules

Plugin MCP only (`mcp__plugin_figma_figma__*`); load `/figma:figma-use` before every `use_figma`.
Every `use_figma` call passes four args — `skillNames:'figma-use'`, `fileKey` (`config.figma.fileKey`),
a non-empty `description`, `code`; the snippets show only the `code` body, the other three are
mandatory (omitting `fileKey`/`description` → `-32602 … required`).
Build in file `FIGMA_FILE_KEY` (`config.json`). **Never detach instances** — edit via
slots / properties / auto-layout only.

## Process

```
T1   Setup     cn() carries the text-format + named-spacing twMerge extensions (one-time)
T2   Anatomy   land the stock source locally → variant axes/slots + every stock class string
T2.5 Stories   shadcn doc usage-examples → Storybook stories (author per /storybook-rules), BEFORE Figma
T3   Translate stock classes → DS utilities (tokens-reference §6) → one mapping table
T4   Figma     token-bound set: full matrix, sorted grid, in a Section (recipes → figma-build.md)
T5   Verify    controls live · /figma-verify CLEAN · build every story as a permanent example + verify (token/values/px)
T6   Code      rewrite per T3 + annotate the prop API (/docgen-props); stories = the T2.5 set; headless lib → jsdom once/lib; gate green
T7   Notes     mapping table + node/var ids + example-inventory + findings
```

**Multi-part composite** (no root element — several `data-slot` parts, e.g. an input with adornments,
a command palette, a dialog) → **`references/composites.md`** overrides T2–T7 (Examples-First,
Exposure-Surface, 3-layer build). T1 + T3 and the shared T4 Figma rules still apply.

### T1 — Setup (Verify Every Run)

Tailwind-merge ignores globals.css / the config, so `cn()` in `libs/ui/src/lib/utils.ts` must register
**every DS custom-utility family a port overrides via className** — any family whose class names diverge
from twMerge's built-in scales (multi-property typography, named t-shirt spacing, the DS radius
vocabulary, DS shadows). Unregistered → two classes of one family both survive and CSS source order (not
className order) decides → the override is silently lost. Verify the families are registered before
porting; add any new at-risk family you introduce. Stock colours and the numeric scales need no
extension. *(Concrete class names + values live in `utils.ts` and `tokens-reference.md`, not here.)*

### T2 — Anatomy

Land the real source locally, then read it — that file is the rewrite's source of truth.
`view_items_in_registries` returns metadata only (no source despite its schema) — don't rely on it.

1. **Find** *(name unclear?)* — `search_items_in_registries({registries:['@shadcn'], query})`; take
   the `registry:ui` hit. Ignore the `registry:example` demos and the broken `[object Promise]`
   add-command field.
2. **Land** — if `libs/ui/src/components/ui/<component>/` is absent: **`npm run ui:add -- <component>`**
   (real source: project-correct `@/` imports + `data-slot`).
   - shadcn writes it **flat** → move (plain `mv` — the freshly-landed source is untracked, `git mv`
     throws) to `components/ui/<component>/<component>.tsx` + a barrel `index.ts` (`export * from './<component>'`).
   - Source lands with `lucide-react` icon imports (shadcn's IconPlaceholder) → swap each to its
     `@remixicon/react` equivalent (target glyph = the `remixicon` field in the registry JSON);
     `lucide-react` isn't installed → gate red otherwise.
   - *Offline / no CLI?* → `get_item_examples_from_registries({registries:['@shadcn'],
     query:'<component>'})` (`query` required) for the raw class strings.
3. **Extract** the anatomy — CVA variant axes + defaults · slots/parts (`data-slot`, `[&_svg]`) ·
   every stock class string (base + per-variant + per-size).

**No CVA?** A bare element with one class string (e.g. Input = one `<input>`) → the Figma axis is
**`state`** (default/focus/filled/disabled/invalid) or content, never a faked `variant×size`. Pick
the states the class string actually expresses (`focus-visible:`, `disabled:`, `aria-invalid:`,
placeholder-vs-value). A **static, non-interactive** element (`pointer-events-none`/`select-none`,
no pseudo-class states) has no state axis → the axis is **content** (e.g. text vs icon).

**Multi-part composition?** (no root element — several `data-slot` parts that render differently —
e.g. an input with adornments, a command palette, a dialog). **Different procedure — STOP and switch to
`references/composites.md`**: Exposure-Surface + Done-Test, Examples-First (T2.5), the Slot≠Slot
combination (the general construct→property table → `figma-build.md §Mechanism`), the user-ask
(part-split / Slot-vs-Swap / whole-level variants / slot defaults), and the 3-layer Figma build.
T1 + T3 (tokens) and the shared T4 Figma rules below still apply.

### T2.5 — Usage-examples → Stories (before Figma)

Author the canonical usage set as Storybook stories **before** building Figma, so Figma reproduces real
usages — not just the variant matrix. Stories run against the T2-landed `ui:add` source (working shadcn
code); T6 only re-clothes the look to DS tokens, the stories stay. **Write them to the house pattern via
`/storybook-rules`** (the three story roles, slim argTypes, `play` tests, a11y, the storybook-MCP
workflow); this section governs only WHICH examples to port.

- **Source:** `ui.shadcn.com/docs/components/<x>` (else `get_item_examples_from_registries`, `query`
  required). **All structurally distinct** examples, deduped — not every prop permutation.
- **Reproduce each example's ACTUAL composition** — the already-ported DS primitives the doc uses (a
  field/form-field family for form controls), per `/storybook-rules` (Usage-examples role). Never a
  simplified layout.
- **Skip-rule:** an example needing a **not-yet-ported** component → skip + log in `notes.md` (example
  name, missing dep). Don't stub, don't co-port. Confirm the primitive is genuinely
  un-ported *before* simplifying — a ported one must be used, not hand-rolled around.
- Output: the story-set = the canonical usage set. T5 verifies the Figma component against it **and**
  reproduces it as a **permanent Usage-Examples instance group** in the Section — **every port**, not
  just composites (recipe: `figma-build.md §Usage-examples`).

### T3 — Translate

Apply `tokens-reference.md` §6 into one explicit mapping table (drives T4 + T6):

- **Pick the token by its `use`/`avoid` semantics, not by name/value match.** Read each candidate's
  `use` (its intended role) and `avoid` (documented don'ts) in the reference before binding — multiple
  tokens can share a value yet mean different things (e.g. `primary` as a surface vs `accent-foreground`
  as text-on-tint, or `input-placeholder` vs `muted-foreground`). The right token is the one whose role
  fits, not the first that looks close.
- **Spacing/gap by px VALUE, not the Tailwind number**: `gap-2`=8→`gap-md`, `px-6`=24→`px-2xl`.
- Dead utilities (theme-reset) → DS replacement: `text-*` size / `font-*` / core colours → the right
  token; `shadow-*` → drop (DS is flat), use `shadow-elevation` if depth carries meaning.
- Control heights / icon sizes (`h-9`, `size-4`) stay **numeric** — geometry ≠ spacing token.


### T4 — Figma Build

Build the token-bound component set and place it in a **Section** on the `Components` page. Which Figma
property per code construct = **`figma-build.md §Mechanism`**; the Plugin-API recipes (binding by ID,
slots, icons, variant assembly, the interaction-state pattern) are in the same file. Invariants:

- **Full matrix** — every value of every property (a partial set reads as broken).
- **Sorted grid** — primary-property-major, one wrapped row per primary value (not scattered append order).
- **Bind every property by variable ID** — `setBoundVariableForPaint` returns a NEW paint (reassign;
  never spread a bound paint → it renders the fallback colour).
- **Slots** for swappable / variable content; config them (`fills=[]`, own auto-layout, sensible
  default) — never trust default geometry.
- **Reuse, don't rebuild** — if the component embeds an already-built DS component (icon, sub-part,
  another ported component), nest a real **instance** of it, never re-clothe a copy (token edits then
  propagate). For multi-part composites this is build layer 2 — see `references/composites.md`.
- **Interaction states** = a `state` axis (Figma has no pseudo-classes → each is an explicit variant).
- **Section** via `/figma-create-section` — never hand-roll `figma.createSection()`.

### T5 — Verify

Three checks on the built set, in order — **functional → clean → faithful**:

1. **Controls live** — instantiate the set and drive **every control** the component exposes, not just
   variant props: each variant / text / boolean / instance-swap property (`setProperties`), **and** each
   **slot** (fill or replace its content). Read each back, iterate until it takes effect. A control that
   exists but does nothing — slot with no default, unbound text, swap that won't take — is broken.
   Delete the test instances. *(Composite: exercise every part set **and** the composition, not just the
   top level.)*
2. **Clean** — `/figma-verify <setId>` must be **CLEAN** (vectors not text, no clipping/overlap,
   padding symmetry).
3. **Reproduces the usages (permanent)** — build every T2.5 story as a **permanent** instance in the
   Section (a labeled group below the set; recipe `figma-build.md §Usage-examples`), each from the
   component's controls alone (props / variants / slots), then compare token/values/pixels (zoom, raw
   px). A standing deliverable, not throwaway scaffolding — don't delete after verifying. A story you
   can't rebuild from controls = the surface is incomplete → fix the component (missing variant/slot),
   never hand-build or re-clothe the example.

### T6 — Code Port

Rewrite `components/ui/<component>/<component>.tsx` per the T3 table; re-export the folder in
`libs/ui/src/index.ts` if new. Icons = `@remixicon/react`.

- **Prop API docs**: annotate the `.tsx` so react-docgen surfaces the public props (Autodocs ArgsTable
  **and** storybook MCP `get-documentation`) — flat JSDoc props, `Omit`+re-declare for the curated
  Radix/DOM/CVA-derived props the docgen filter drops. Per **`/docgen-props`**.
- **Stories**: the T2.5 usage-example set, now running on DS tokens. **Reconcile them per
  `/storybook-rules`** (coverage: every variant×size/state in ≥1 story, overview story if the examples
  miss any; a `play` test for interactive components; the `shoot` / `preview-stories` rendered-output
  check).
- **Headless lib** (e.g. Radix, cmdk): components that touch any browser API jsdom doesn't implement on
  mount (e.g. `ResizeObserver`, `Element.prototype.scrollIntoView`, `matchMedia`, …) need a stub/polyfill
  in the vitest `setupFile` — **once per lib**, else **jsdom specs** can't
  render them. The `storybook` browser project runs in real Chromium → needs no polyfill.
- **Gate**: `npx nx test|typecheck|lint @agentport/ui` green — two Vitest projects (jsdom `.spec` units +
  the `storybook` browser project, Chromium + axe); a story that throws/regresses fails it.

### T7 — Notes + Catalog

Two artifacts — a port is **not done** until both exist:

1. **Run notes** — `agent-runs/component-port/<date>-<component>/notes.md`: mapping table, Figma node +
   variable ids, findings, gate state, `preview-stories` URLs, the **example-inventory** (each doc
   usage-example: kept-distinct / deduped-as-permutation-of-X / skipped-missing-dep — with reason; makes
   T5 auditable), open items (full matrix, missing states, placeholder ⚠ tokens). For each non-obvious
   mapping-table row record the **why** — the `use`/`avoid` reasoning that picked that token over a
   same-value lookalike (T3), so the decision is auditable and the next port reuses it.
2. **Component catalog** — `design-docs/design-system/components-reference.md`: add/refresh this
   component's entry — `status`, `source`, `code` (dir / exports / barrel), `figma` (set + node ids +
   axes/slots), `skill`, `notes`. This is the **authoritative locator the next port/sync reads first**
   (per CLAUDE.md), so a stale catalog mis-routes future work — keep it current; on a re-port update the
   ids/axes in place rather than leaving the old entry.

## Red Flags

| Trap | Reality |
|---|---|
| Treat `secondary`/`destructive`/`chart-*` as final | ⚠ placeholders (stock hex), not designed — flag, don't finalize. |

*(Plugin-API red flags — `componentPropertyDefinitions` only on the set, typings lag the runtime — live in `references/figma-build.md`.)*

## Boundaries

- One component per run, **initial port only**. An already-built component whose Figma changed →
  `/component-sync`. Signature redesign is `/design-punk`, not here.
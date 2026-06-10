---
name: shadcn-component-port
description: "Initial, first-time port of a shadcn/ui component into the Agentport DS — read its anatomy from the shadcn MCP, build a token-bound Figma component set with variants, then write the code on the DS utility vocabulary. Trigger when the user wants to add / port / rebuild / nachbauen a shadcn component (Button, Input, Card, Badge …) that does NOT exist in the DS yet, Figma + code together. To reconcile an ALREADY-built component after a Figma change, use /component-sync instead."
---

# shadcn Component Port (initial · shadcn → Figma → Code)

**First-time** port of one shadcn/ui component into the Agentport DS, **token-faithful**: keep shadcn
structure + variant logic, re-clothe in DS tokens only. For an already-built component whose Figma
set changed, this is the wrong skill — use `/component-sync`.

## Inputs / Output

```
in   component: shadcn item name (button, input, badge…)   REQUIRED
out  figma  .<Component> set on the Components page, every property bound to DS variables
     code   components/ui/<component>/ — <component>.tsx + .stories.tsx + .spec.tsx + barrel index.ts,
            on DS utilities; `npx nx test|typecheck|lint @agentport/ui` green
     notes  agent-runs/component-port/<YYYY-MM-DD>-<component>/notes.md
```

## Data source

`design-docs/design-system/tokens-reference.md` = the only source for Figma var ↔ CSS var ↔
Tailwind utility ↔ value ↔ `use`/`avoid`; §6 = stock-shadcn → DS translation. **Never duplicate
token values into this skill** — it is the procedure, the reference is the data.

## Figma rules

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
T2.5 Stories   shadcn doc usage-examples → Storybook stories, BEFORE Figma (the canonical usage set)
T3   Translate stock classes → DS utilities (tokens-reference §6) → one mapping table
T4   Figma     token-bound set: full matrix, sorted grid, in a Section (recipes → figma-build.md)
T5   Verify    controls live · /figma-verify CLEAN · rebuild every story from the controls (token/values/px)
T6   Code      rewrite per T3; stories = the T2.5 set; headless lib → jsdom once/lib; gate green
T7   Notes     mapping table + node/var ids + example-inventory + findings
```

**Multi-part composite** (no root element — several `data-slot` parts, e.g. an input with adornments,
a command palette, a dialog) → **`references/composites.md`** overrides T2–T7 (Examples-First,
Exposure-Surface, 3-layer build). T1 + T3 and the shared T4 Figma rules still apply.

### T1 — Setup (verify every run)

tailwind-merge ignores globals.css / the config, so `libs/ui/src/lib/utils.ts` `cn()` MUST extend
twMerge with **both** — add whichever is missing before porting:

```ts
extendTailwindMerge<'text-format'>({ extend: {
  theme: { spacing: ['2xs','xs','sm','md','lg','xl','2xl','3xl','4xl','5xl'] }, // named spacing → all spacing groups
  classGroups: { 'text-format': [{ text: [/* the 11 typo formats */] }] },      // typo formats ≠ text-color
}});
```

- No `text-format` group → `text-label` + `text-primary-foreground` both file under text-color,
  collapse → the typo class is silently **dropped**.
- No spacing theme → `gap-md`/`p-lg` unrecognised → a later `gap-lg` won't override an earlier
  `gap-md` (CSS source order wins, not className order).

Colours (`bg/border/text-*`) and radius (`sm/md/lg/xl`, standard scale) need no extension.

### T2 — Anatomy

Land the real source locally, then read it — that file is the rewrite's source of truth.
`view_items_in_registries` returns metadata only (no source despite its schema) — don't rely on it.

1. **Find** *(name unclear?)* — `search_items_in_registries({registries:['@shadcn'], query})`; take
   the `registry:ui` hit. Ignore the `registry:example` demos and the broken `[object Promise]`
   add-command field.
2. **Land** — if `libs/ui/src/components/ui/<component>/` is absent: **`npm run ui:add -- <component>`**
   (real source: project-correct `@/` imports + `data-slot`).
   - shadcn writes it **flat** → move to `components/ui/<component>/<component>.tsx` + add a barrel
     `index.ts` (`export * from './<component>'`).
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
mechanism model, the user-ask (part-split / Slot-vs-Swap / whole-level variants / slot defaults), and
the 3-layer Figma build. T1 + T3 (tokens) and the shared T4 Figma rules below still apply.

### T2.5 — Usage-examples → Stories (before Figma)

Always author the canonical usage set as Storybook stories **before** building Figma, so Figma
reproduces real usages — not just the variant matrix. Stories run against the T2-landed `ui:add`
source (working shadcn code); T6 only re-clothes the look to DS tokens, the stories stay.

- **Source:** `ui.shadcn.com/docs/components/<x>` (else `get_item_examples_from_registries`, `query`
  required). **All structurally distinct** examples, deduped — not every prop permutation.
- **Write each as a story:** if the `storybook` MCP is up (:6006) `get-storybook-story-instructions`
  first (canonical CSF/imports), write, then `preview-stories` → surface every URL. No MCP? Mirror an
  existing component's `.stories.tsx`.
- **Skip-rule:** an example needing a **not-yet-ported** component → skip + log in `notes.md` (example
  name, missing dep). Don't stub, don't co-port.
- Output: the story-set = the canonical usage set — what T5 verifies the Figma component against
  (composites also reproduce it as permanent Figma instances, see `references/composites.md`).

### T3 — Translate

Apply `tokens-reference.md` §6 into one explicit mapping table (drives T4 + T6):

- **Pick the token by its `use`/`avoid` semantics, not by name/value match.** Read each candidate's
  `use` (its intended role) and `avoid` (documented don'ts) in the reference before binding — multiple
  tokens can share a value yet mean different things (e.g. `primary` as a surface vs `accent-foreground`
  as text-on-tint, or `input-placeholder` vs `muted-foreground`). The right token is the one whose role
  fits, not the first that looks close.
- **Spacing/gap by px VALUE, not the Tailwind number**: `gap-2`=8→`gap-md`, `px-6`=24→`px-2xl`.
- Dead utilities (theme-reset) → DS replacement: `text-*` size / `font-*` / core colours → the right
  token; `shadow-*` → drop (DS is flat), or `shadow-elevation` if depth carries meaning.
- Control heights / icon sizes (`h-9`, `size-4`) stay **numeric** — geometry ≠ spacing token.
- Form fields: `bg-transparent` → `bg-input-background`. Field text = `text-label` — **not** `text-input` (that's the mono-18px command format).

### T4 — Figma build

Build the token-bound component set and place it in a **Section** on the `Components` page. Full
Plugin-API recipes — binding by ID, slots, icons, variant assembly, the interaction-state pattern —
are in **`references/figma-build.md`**. Invariants:

- **Full matrix** — every value of every property (a partial set reads as broken).
- **Sorted grid** — primary-property-major, one wrapped row per primary value (not scattered append order).
- **Bind every property by variable ID** — `setBoundVariableForPaint` returns a NEW paint (reassign;
  never spread a bound paint → it renders the fallback colour).
- **Slots** for swappable / variable content; config them (`fills=[]`, own auto-layout, sensible
  default) — never trust default geometry.
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
3. **Reproduces the usages** — rebuild every T2.5 story from the component's controls (props / variants
   / slots) and compare token/values/pixels (zoom, raw px). A story you can't rebuild from controls =
   the surface is incomplete → fix the component (missing variant/slot), never hand-build the example.

### T6 — Code port

Rewrite `components/ui/<component>/<component>.tsx` per the T3 table; re-export the folder in
`libs/ui/src/index.ts` if new. Icons = `@remixicon/react`.

- **Stories**: = the T2.5 usage-example set (already written, now running on DS tokens). Ensure every
  variant×size/state still appears in ≥1 story — add an overview story if the examples don't exercise
  them all. Re-run `preview-stories` → surface every URL (rendered-output check; the gate + `/figma-verify`
  don't see it).
- **Headless lib** (e.g. Radix, cmdk): components that touch `ResizeObserver` /
  `Element.prototype.scrollIntoView` on mount need a jsdom polyfill in the vitest `setupFile` —
  **once per lib** (like the `cn()` extension), else specs can't render them.
- **No dead controls**: render-only stories ignore args → `parameters: { controls: { disable: true } }`;
  elsewhere expose only the relevant ones (`controls: { include: [...] }`).
- **Gate**: `npx nx test|typecheck|lint @agentport/ui` green, and confirm the DS typography class
  actually survives in the rendered markup (twMerge drops it if T1 was skipped).

### T7 — Notes

`agent-runs/component-port/<date>-<component>/notes.md`: mapping table, Figma node + variable ids,
findings, gate state, `preview-stories` URLs, the **example-inventory** (each doc usage-example:
kept-distinct / deduped-as-permutation-of-X / skipped-missing-dep — with reason; makes T5 auditable),
open items (full matrix, missing states, placeholder ⚠ tokens). For each non-obvious mapping-table row
record the **why** — the `use`/`avoid` reasoning that picked that token over a same-value lookalike
(T3), so the decision is auditable and the next port reuses it instead of re-deriving it.

## Red flags

| Trap | Reality |
|---|---|
| Treat `secondary`/`destructive`/`chart-*` as final | ⚠ placeholders (stock hex), not designed — flag, don't finalize. |

*(Plugin-API red flags — `componentPropertyDefinitions` only on the set, typings lag the runtime — live in `references/figma-build.md`.)*

## Boundaries

- One component per run, **initial port only**. An already-built component whose Figma changed →
  `/component-sync`. Signature redesign is `/design-punk`, not here.
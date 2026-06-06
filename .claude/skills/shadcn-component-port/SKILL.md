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
Build in file `FIGMA_FILE_KEY` (`config.json`). **Never detach instances** — edit via
slots / properties / auto-layout only.

## Process

```
T1 Setup     cn() carries the text-format + named-spacing twMerge extensions (one-time)
T2 Anatomy   land the stock source locally → variant axes/slots + every stock class string
T3 Translate stock classes → DS utilities (tokens-reference §6) → one mapping table
T4 Figma     recon → token-bound component set, full matrix, sorted grid, in a Section
T5 Verify    /figma-verify → CLEAN before code
T6 Code      rewrite per T3; gate green
T7 Notes     mapping table + node/var ids + findings
```

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

1. *(name unclear?)* `search_items_in_registries({registries:['@shadcn'], query})` → take the
   `registry:ui` hit (ignore `registry:example` demos + the broken `[object Promise]` add-command field).
2. If `libs/ui/src/components/ui/<component>/` is absent: **`npm run ui:add -- <component>`** (real
   source, project-correct `@/` imports + `data-slot`). shadcn writes it **flat** → move to
   `components/ui/<component>/<component>.tsx` and add barrel `index.ts` (`export * from './<component>'`).
   *Offline / no CLI?* `get_item_examples_from_registries({registries:['@shadcn'], query:'<component>'})`
   (`query` required) for the raw class strings.
3. Extract: CVA variant axes + defaults, slots/parts (`data-slot`, `[&_svg]`), every stock class
   string (base + per-variant + per-size).

**No CVA?** A bare element with one class string (e.g. Input = one `<input>`) → the Figma axis is
**`state`** (default/focus/filled/disabled/invalid) or content, never a faked `variant×size`. Pick
the states the class string actually expresses (`focus-visible:`, `disabled:`, `aria-invalid:`,
placeholder-vs-value).

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

Recon (`snippets/recon.js`) then build (`snippets/build-variant-set.js`). Incremental: ≤10 ops per
`use_figma`, screenshot after each step. Bind every property to DS variables **by ID** (names carry
group paths like `shadcn Default/primary`):

- fills/strokes/text colour → `setBoundVariableForPaint(paint,'color',variable)` — returns a NEW
  paint, reassign it. **Never clone/spread a bound paint** (`{...boundPaint, opacity}`): it loses live
  resolution and renders the fallback colour (often black). Build fresh; if you need opacity, pass it
  plus the real resolved colour as the paint's fallback.
- radius / padding / gap → `node.setBoundVariable('topLeftRadius'|'paddingLeft'|'itemSpacing'|…, v)`
  (spacing vars are `GAP`-scoped → cover gap AND padding).
- typography → `setTextStyleIdAsync(formatId)` after `loadFontAsync` of that format's font.
- control height → `resize(w,h)` THEN `layoutSizingHorizontal='HUG'`, `…Vertical='FIXED'`.
- slottable / swappable content (icon, leading/trailing adornment, avatar, …) = a real Figma slot:
  `component.createSlot()`, named consistently so it merges to ONE set-level `SLOT` property; drop a
  sensible default inside (e.g. an icon → 16px `createNodeFromSvg`, inner VECTOR fill bound per
  variant). Slots are per-component → the prop appears only on owning variants (fine).
- icons → **Remix only**, never a text glyph (search via the Remix-icon MCP; code = `@remixicon/react`
  as `children`).
- `combineAsVariants(comps, section)`; name each `propA=valA, propB=valB` → props auto-derive. Append
  more with `set.appendChild(comp)` (merges by name; same-named slots/props collapse).

**Full matrix** — every value of every property, not a representative subset (a partial set reads as broken).

**Sorted grid** — never leave scattered append order. Reorder primary-property-major, secondary in
option order (`for v: for s`), `appendChild` in that sequence; `layoutWrap='WRAP'` and
`maxWidth = Σ(row widths)+gaps+padding` to wrap one row per primary value. Screenshot to confirm.

**Section** — place the set in a Section on the `Components` page; if absent, create it via
**`/figma-create-section`**  Never hand-roll `figma.createSection()`.

**Interaction states** = a `state` axis (Figma has no pseudo-classes → each is an explicit variant).
Pattern (validated on Button):

- **Base**: extract `.<Comp>/Base` (a set keyed on `size`) carrying structure/geometry; each
  `variant×size×state` member nests a base instance and overrides only its delta — base edits propagate.
- **Tint** = a dedicated `state-layer` Surface under the (always-opaque) content, driven by its
  **appearance/layer opacity** — never fill-opacity (not variable-bindable) nor node-opacity (dims the
  text too). Mirrors `bg-…/90`.
- **active** = tint + content pressed 1px down, absolutely positioned in a fixed-size member → no
  layout jump (code: `active:translate-y-px`).
- **focus** = a ring drop-shadow (`ring`/50, spread 3). Spread renders only when `clipsContent=true`
  on the effect-bearing node; keep ancestors `clipsContent=false` so the ring isn't clipped.
- **disabled** = member node opacity (dimming the text too is correct here).

### T5 — Verify

`/figma-verify <setId>` → must be **CLEAN** (vectors not text, no clipping/overlap, padding symmetry).

### T6 — Code port

Rewrite `components/ui/<component>/<component>.tsx` per the T3 table; re-export the folder in
`libs/ui/src/index.ts` if new. Icons = `@remixicon/react`.

- **Stories**: cover every variant×size/state in `.stories.tsx`. If the `storybook` MCP is up (:6006):
  `get-storybook-story-instructions` first (canonical CSF/imports/conventions), write, then
  `preview-stories` → surface every URL to the user (rendered-output check the gate + `/figma-verify`
  skip). No MCP? Mirror `button/button.stories.tsx`.
- **a11y**: an icon-only control (no text child) must require an accessible name — enforce
  `aria-label`/`aria-labelledby` at the **type level** (discriminated props, see `button.tsx` `size="icon"`).
- **Gate**: `npx nx test|typecheck|lint @agentport/ui` green, and confirm the DS typography class
  actually survives in the rendered markup (twMerge drops it if T1 was skipped).

### T7 — Notes

`agent-runs/component-port/<date>-<component>/notes.md`: mapping table, Figma node + variable ids,
findings, gate state, `preview-stories` URLs (T6), open items (full matrix, missing states,
placeholder ⚠ tokens). For each non-obvious mapping-table row record the **why** — the `use`/`avoid`
reasoning that picked that token over a same-value lookalike (T3), so the decision is auditable and
the next port reuses it instead of re-deriving it.

## Red flags

| Trap | Reality |
|---|---|
| Treat `secondary`/`destructive`/`chart-*` as final | ⚠ placeholders (stock hex), not designed — flag, don't finalize. |
| Read `componentPropertyDefinitions` off a variant | Readable only on the **set** (or a non-variant component) — throws on a single variant. |

## Boundaries

- One component per run, **initial port only**. An already-built component whose Figma changed →
  `/component-sync`. Signature redesign is `/design-punk`, not here.
- **Living skill — never "done".** Every port surfaces new DS-integration gotchas (twMerge groups,
  Figma slots, grid layout, a11y, the folder convention all came out of real ports). Fold each new
  learning back in — as a step or a red flag — before finishing the run, or the next port re-hits it.

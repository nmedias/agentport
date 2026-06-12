# Figma Build — recipes & mechanics 

The how-to for building a token-bound component set. **SKILL.md T4** states *what to produce*. This file is the Plugin-API *detail*.
Multi-part composites add three build layers on top — see `references/composites.md`.

## Approach

Recon (`snippets/recon.js`) → build (`snippets/build-variant-set.js`). **Incremental:** ≤10 ops per
`use_figma`, screenshot after each step. Bind every property to DS variables **by ID** (names carry
group paths like `shadcn Default/primary`).

## Mechanism — code construct → Figma property

What to model (**every port**, not just composites): decide **per consumer-variable content** by the
**nature of the variation**.

| Code construct | Figma | Rule |
|---|---|---|
| editable string | **Text property** | one label (placeholder, text) |
| fixed element on/off | **Boolean property** | always-same optional element |
| one of a *finite, author-defined* set | **Variant property** | states / sizes / aligns / disabled / focus / invalid |
| **one** swappable element, *must* be a component, parent drives look/size | **Instance-Swap** | a leading/trailing adornment, an action control inside a region |
| **open, variably-many** children; consumer sets count/order/kind | **Slot** | real `children`: list items, free-form region content |
| **conditional layout** — direction flips on content (CSS `has-[]`/`flex-col`, e.g. row↔column) | **Variant axis** | Figma has no conditional layout AND slot direction is instance-locked (§Slots) → a `layout: horizontal\|vertical` axis. **Multiplies the matrix** (state × layout). |

- **Slot when** consumer sets count/order/kind; variable length; no finite variant set.
- **Variant-axis when** the *layout* (not just content) changes conditionally — modelling only `state`
  then can't reproduce the column-stacking examples (the slot won't flip in an instance).
- **Swap when** exactly one position; content = component; persists across variants; parent override drives look/size.
- Code composes an **already-ported** component X → Figma nests an **instance of X** (never re-clothe);
  Swap only if several X-types should be choosable.

## Binding recipes

- **fills / strokes / text colour** → `setBoundVariableForPaint(paint,'color',variable)` — returns a
  **NEW** paint, reassign it. **Never clone/spread a bound paint** (`{...boundPaint, opacity}`): it
  loses live resolution → renders the fallback colour (often black). Build fresh; for opacity, set it
  plus the real resolved colour as the paint's fallback.
- **radius / padding / gap** → `node.setBoundVariable('topLeftRadius'|'paddingLeft'|'itemSpacing'|…, v)`
  (spacing vars are `GAP`-scoped → cover gap AND padding).
- **typography** → `setTextStyleIdAsync(formatId)` after `loadFontAsync` of that format's font.
- **control height** → `resize(w,h)` THEN `layoutSizingHorizontal='HUG'`, `…Vertical='FIXED'`.

## Slots (swappable / variable content)

Slottable content (icon, leading/trailing adornment, avatar, …) = a real Figma slot:
`component.createSlot()`, named consistently so it merges to ONE set-level `SLOT` property; drop a
sensible default inside (icon → `createNodeFromSvg`, inner VECTOR fill bound per variant). Slots are
per-component → the prop appears only on owning variants (fine).

**Config the slot — default geometry is unreliable** (seen `100×100/NONE/white-fill` AND `HUG/empty`
same session → never assume):
- `slot.fills=[]` — the default fill is opaque white → a box behind the content.
- give the slot **its own auto-layout** → slotted content becomes a real layout child (can align AND
  self-fit via child `FILL`, not just sit at coords).
- size by intent: **stable box** (key cap, avatar) = slot `FIXED`/`FILL` to fixed dims, content sits
  without growing it; **hug content** = slot `HUG/HUG`. Align (`CENTER/CENTER` …) is per-case, not a rule.
- Bare `resize()` w/o auto-layout freezes size AND leaves content unmanaged — avoid.

**Filling a slot IN AN INSTANCE** (what `composites.md` T4 layer-4 — reproduced example instances —
silently assumes; the build's most error-prone step):
- **`appendChild` adds, does not replace.** The default content stays AND your node renders → both
  show. **Clear first:** `[...slot.children].forEach(c => c.remove())`, then append. (`remove()` of a
  slot's default children IS allowed inside an instance.)
- **`slot.layoutMode` is locked in an instance** — setting it silently no-ops (stays the main's
  direction). Bake direction into the component, or make it a **Variant axis** (a CSS `has-[]` that
  flips `flex-row`↔`flex-col` → a `layout` axis on the composition, not a per-instance edit).
- **Appending an instance into an instance-slot invalidates the JS reference** — the node gets a new
  id in the instance context, so a later `child.layoutSizingHorizontal='FILL'` throws "node … does not
  exist". **Re-resolve the live child** (`slot.children[i]`, or match via `getMainComponentAsync()`)
  and set sizing/props on that. Set `FILL` AFTER append, on the re-resolved node.

## Icons

**Remix only**, never a text glyph. The Remix-icon MCP returns **names only** and **misses some
glyphs** (notably the `*-s-line` chevrons) → take the exact path from the installed package
(`npm pack remixicon` → `package/icons/<Category>/<name>.svg`) and confirm the React export
(`node -e "require('@remixicon/react').Ri<Name>"`). Code = `@remixicon/react` as `children`.

## Variant set assembly

- `combineAsVariants(comps, section)`; name each `propA=valA, propB=valB` → props auto-derive. Append
  more with `set.appendChild(comp)` (merges by name; same-named slots/props collapse).
- Component properties attach **by node type, not timing**: add TEXT/BOOL/INSTANCE_SWAP on the **set**
  or a standalone comp, then bind the node
  (`node.componentPropertyReferences = { characters|visible|mainComponent: id }`); prop ids change on
  combine → re-read.
- **Name every TEXT prop semantically + set its default — ALWAYS, every port, never the Figma default
  `text`:** name = the part's **semantic role** (`label`/`description`/`error`/`legend`/… — `label` is
  just an example); default value = that name in curly brackets, **`{Semantic}`** (`label`→`{Label}`,
  `error`→`{Error}`). If the text IS the comp's whole content/children (single-text comp) suffix the
  name **`(children)`** (`<name> (children)` = `{Name}`); a plain TEXT prop inside a larger comp keeps
  the bare name.
- **Full matrix** — every value of every property, not a representative subset (a partial set reads as broken).
- **Sorted grid** — never leave scattered append order. Reorder primary-property-major, secondary in
  option order (`for v: for s`), `appendChild` in that sequence; `layoutWrap='WRAP'` and
  `maxWidth = Σ(row widths)+gaps+padding` to wrap one row per primary value. Screenshot to confirm.
- **Section** — place the set in a Section on the `Components` page; if absent, create it via
  **`/figma-create-section`**. Never hand-roll `figma.createSection()`.

## Interaction states = a `state` axis

Figma has no pseudo-classes → each interaction state is an explicit variant. Pattern (validated on a
real port):

- **Base** — extract `.<Comp>/Base` (a set keyed on `size`) carrying structure/geometry; each
  `variant×size×state` member nests a base instance and overrides only its delta — base edits propagate.
- **Tint** — a dedicated `state-layer` Surface under the (always-opaque) content, driven by its
  **appearance/layer opacity** — never fill-opacity (not variable-bindable) nor node-opacity (dims the
  text too). Mirrors `bg-…/90`.
- **active** — tint + content pressed 1px down, absolutely positioned in a fixed-size member → no
  layout jump (code: `active:translate-y-px`).
- **focus** — a ring drop-shadow (`ring`/50, spread 3). Spread renders only when `clipsContent=true`
  on the effect-bearing node; keep ancestors `clipsContent=false` so the ring isn't clipped.
- **disabled** — member node opacity (dimming the text too is correct here).

## Red flags (Plugin-API)

| Trap | Reality |
|---|---|
| Read `componentPropertyDefinitions` off a variant | Readable only on the **set** (or a non-variant component) — throws on a single variant. |
| Decide a Plugin API is missing because it's not in the typings | Typings lag the runtime — probe it (enumerate keys / try in `use_figma`) before changing approach (e.g. `createSlot` runs but isn't typed). |

---
name: figma-build-rules
description: "Assemble a token-bound Figma component set (variant matrix) via the Figma Plugin MCP API — the build craft: code-construct→Figma-property mapping, binding paints/radius/padding/typography by variable ID, slots, variant-set assembly (full matrix, sorted grid), the interaction-state axis (Base+tint+glow), the permanent usage-examples group, and the controls-live→clean→faithful verify triad. Multi-part composites add a 3-layer build (Slot≠Slot, nested instances, flexible composition, anchored overlay). Trigger when building/assembling a Figma component set, variant matrix, or token-bound component from code. "
---

# Figma Build Rules (token-bound component set)

Build a **token-bound** Figma component set via the Plugin MCP API: keep the source component's
structure + variant logic, bind every property to the caller's design-system variables. The caller
supplies the build **file**, target **page**, **token/variable** source, **icon** set, Section-wrapper
helper and structural pre-handoff check; this skill is the **how** (mechanics + snippets).

## Inputs (caller-supplied)

Dual-mode: invoked **standalone** (you name these) or **delegated** from a host port/sync skill (it
supplies them). Either way the build needs:

```
in   file       Figma file key → the use_figma `fileKey` arg
     page        target page for the set
     tokens      the variable / text-style source to bind against (recon.js reads its catalog)
     icons       the icon set (vectors)
     section     a Section-wrapper helper for the canonical Section form — optional (else a plain Section)
     check       a structural pre-handoff check (vectors/clipping/overlap) for the clean gate
```

## Figma access (the contract)

- **Plugin MCP only** (`mcp__plugin_figma_figma__*`); load the **figma-use** skill before EVERY `use_figma`.
- Every `use_figma` call passes four args — `skillNames:'figma-use'`, `fileKey`, a non-empty `description`,
  `code`. Snippets show only the `code` body; omitting `fileKey`/`description` → `-32602 … required`.
- **Never detach instances** — edit via slots / properties / auto-layout only.
- **Incremental:** ≤10 ops per call, screenshot after each step.
- `figma.currentPage` resets to page 1 across calls → `await setCurrentPageAsync(target)` at the START of
  every call, else new nodes land on the wrong page and `combineAsVariants` throws "must be in the same page".
- **Bind every property by variable ID** (names carry group paths) — never by name.

## Approach

Recon (`snippets/recon.js`, read-only → variable/style/page maps to bind against), then build the set
**directly from the recipes below** (binding · slots · variant-set assembly · interaction states). Fill
the token IDs / target page+section / set name / text-style + font from the caller's token source —
`recon.js` ships placeholders, no project values.

## Mechanism — code construct → Figma property

What to model (**every build**): decide **per consumer-variable content** by the **nature of the variation**.

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
- Code composes an **already-built** component X → Figma nests an **instance of X** (never re-clothe);
  Swap only if several X-types should be choosable.
- **Swappable trigger on a prototyped member** — keep the reaction on the **member frame** (not the
  slot/content) so the swap is safe; prefer a **HUG slot** for arbitrary (`asChild`) content, INSTANCE_SWAP
  only for a fixed component set.

## Binding recipes

- **fills / strokes / text colour** → `setBoundVariableForPaint(paint,'color',variable)` — returns a
  **NEW** paint, reassign it. **Never clone/spread a bound paint** (`{...boundPaint, opacity}`): it
  loses live resolution → renders the fallback colour (often black). Build fresh; for opacity, set it
  plus the real resolved colour as the paint's fallback.
- **radius / padding / gap** → `node.setBoundVariable('topLeftRadius'|'paddingLeft'|'itemSpacing'|…, v)`
  (spacing vars are `GAP`-scoped → cover gap AND padding).
- **typography** → `setTextStyleIdAsync(formatId)` after `loadFontAsync` of that format's font.
- **control height** → `resize(w,h)` THEN `layoutSizingHorizontal='HUG'`, `…Vertical='FIXED'`.
- **variable lookup** → `getVariableByIdAsync` needs the full `VariableID:`-prefixed id; a bare `n:n`
  returns `null` silently → binding `null` yields an unbound (black) paint. Pass the id verbatim.

## Slots (swappable / variable content)

Slottable content (icon, leading/trailing adornment, avatar, …) = a real Figma slot:
`component.createSlot()`, named consistently so it merges to ONE set-level `SLOT` property — **the
merge happens at `combineAsVariants` time, so create slots on standalone comps BEFORE combining**;
`createSlot` on already-combined members yields N separate un-merged props. Drop a
sensible default inside (icon → `createNodeFromSvg`, inner VECTOR fill bound per variant; TEXT default →
a `{Semantic}` placeholder, never committed copy — §Variant set assembly). Slots are
per-component → the prop appears only on owning variants (fine).

**Config the slot — default geometry is unreliable** (seen `100×100/NONE/white-fill` AND `HUG/empty`
same session → never assume):
- `slot.fills=[]` — the default fill is opaque white → a box behind the content.
- give the slot **its own auto-layout** → slotted content becomes a real layout child (can align AND
  self-fit via child `FILL`, not just sit at coords).
- size by intent: **stable box** (key cap, avatar) = slot `FIXED`/`FILL` to fixed dims, content sits
  without growing it; **hug content** = slot `HUG/HUG`. Align (`CENTER/CENTER` …) is per-case, not a rule.
- Bare `resize()` w/o auto-layout freezes size AND leaves content unmanaged — avoid.

**Optional / toggleable slot** — bind a BOOLEAN property to the slot's `visible` directly; the slot stays
a fillable SLOT (no wrapper, no FRAME conversion). Keep the parent auto-layout so the off-state collapses
with no residual gap. (An empty *visible* slot still shows its ~100×100 default box — that's the slot
geometry, not the toggle; HUG-config it per above if it must stay visible-but-empty.)

**Cloning a variant member that owns a slot** — the clone stays a `SLOT` (NOT a FRAME), but its
`componentPropertyReferences.slotContentId` is cleared, because the slot property lives on the **set**,
not the member. After adding the clone as a new member, **re-bind** it
(`slot.componentPropertyReferences = { slotContentId: '<prop>#id' }`) — don't recreate it via
`createSlot()` (that auto-creates a second, zero-referenced slot property you'd then have to delete).
A standalone (non-member) component clone keeps the binding (the property is on the component itself).

**Retrofit a SLOT onto an already-combined set** — give the slot its own auto-layout before `HUG` (a SLOT
isn't an AL frame); `createSlot` post-combine makes N un-merged props → re-bind all to one `slotContentId`
+ delete the dups; slot/structure ops can silently reset the set's auto-layout and eject ancestor-AL
children → re-assert after.

**Filling a slot IN AN INSTANCE** (the reproduced example instances of §Composites layer 4 silently
assume this; the build's most error-prone step):
- **`appendChild` adds, does not replace** — clear the defaults first. But **one structural mutation per
  `use_figma` call**: the first remove/append invalidates every cached sibling ref in the same tick, so a
  second `slot.children[0].remove()` throws "node not found" (even re-reading `children[0]`). So
  `[...slot.children].forEach(remove)` / `while`-loops fail mid-way — clear N defaults across N calls. The
  same one-op-per-call limit covers append and deep `setProperties` into a nested-instance slot subtree.
- **`slot.layoutMode` is locked in an instance** — setting it silently no-ops (stays the main's
  direction). Bake direction into the component, or make it a **Variant axis** (a CSS `has-[]` that
  flips `flex-row`↔`flex-col` → a `layout` axis on the composition, not a per-instance edit).
- **Appending an instance into an instance-slot invalidates the JS reference** — the node gets a new
  id in the instance context, so a later `child.layoutSizingHorizontal='FILL'` throws "node … does not
  exist". **Re-resolve the live child** (`slot.children[i]`, or match via `getMainComponentAsync()`)
  and set sizing/props on that. Set `FILL` AFTER append, on the re-resolved node.

## Icons

**A vector component from the caller's icon set — never a text glyph.** If the icon source/MCP returns
names only (and may miss some glyphs), take the exact path from the installed package
(`<pkg>/icons/<…>.svg`) and confirm the framework export before use. Pass the icon as `children` in code.

- **Connected sub-shape on a bordered surface** (arrow/notch/tab) — built borderless it reads detached →
  stroke exposed edges only, overlap the joint seam.

## Variant set assembly

- `combineAsVariants(comps, section)`; name each `propA=valA, propB=valB` → props auto-derive. Append
  more with `set.appendChild(comp)` (merges by name; same-named slots/props collapse).
- Component properties attach **by node type, not timing**: add TEXT/BOOL/INSTANCE_SWAP on the **set**
  or a standalone comp, then bind the node
  (`node.componentPropertyReferences = { characters|visible|mainComponent: id }`); prop ids change on
  combine → re-read.
- **Every author-set default text = a `{Semantic}` placeholder — ALWAYS; never committed copy nor the
  Figma default `text`.** TEXT prop: name = the part's **semantic role** (`label`/`description`/`error`/
  `legend`/… — `label` is just an example); default value = that name in curly brackets, **`{Semantic}`**
  (`label`→`{Label}`, `error`→`{Error}`). If the text IS the comp's whole content/children (single-text
  comp) suffix the name **`(children)`** (`<name> (children)` = `{Name}`); a plain TEXT prop inside a
  larger comp keeps the bare name. **Slot-default / nested-instance text** (NOT an exposed prop) → set its
  `characters` to the same placeholder, mirroring the text node's layer name (**name = value**, like
  `.Label` is `{Label}`=`{Label}`). Committed copy lives ONLY in the permanent usage-examples
  (§Usage-examples), never in set members.
- **Full matrix** — every value of every property, not a representative subset (a partial set reads as broken).
- **Sorted grid** — never leave scattered append order. Reorder primary-property-major, secondary in
  option order (`for v: for s`), `appendChild` in that sequence; `layoutWrap='WRAP'` and
  `maxWidth = Σ(row widths)+gaps+padding` to wrap one row per primary value. Screenshot to confirm.
- **Section** — place the set in a Section on the target page. If a **Section-wrapper helper** was
  supplied, use it (the canonical Section form) and don't hand-roll `figma.createSection()` — the ban
  protects that canonical wrapper. No helper (standalone) → a plain `figma.createSection()` is fine.
- **Section coords & size** — a Section child's `x/y` are **relative to the Section origin**; set the
  offset directly (`set.x = 80`), never `section.absoluteBoundingBox.x + 80` (double-offsets thousands of
  px out). Sections **don't auto-grow** → after positioning, `section.resizeWithoutConstraints(w, h)` to
  fit content (width AND height).
- **Section ≠ auto-layout** → wrap the build in a vertical AL frame (surface fill, HUG, token gap) inside
  it; bare children don't stack (overlap/spill).

## Interaction states = a `state` axis

Figma has no pseudo-classes → each interaction state is an explicit variant. Validated pattern:

- **Base** — extract a `Base` sub-component (a set keyed on `size`) carrying structure/geometry; each
  `variant×size×state` member nests a base instance and overrides only its delta — base edits propagate.
- **Tint** — a dedicated `state-layer` Surface under the (always-opaque) content, driven by its
  **appearance/layer opacity** — never fill-opacity (not variable-bindable) nor node-opacity (dims the
  text too). Mirrors `bg-…/90`.
- **active** — tint + content pressed 1px down, absolutely positioned in a fixed-size member → no
  layout jump (code: `active:translate-y-px`).
- **focus / invalid (glow ring)** — a ring drop-shadow. Spread renders only when `clipsContent=true` on
  the effect-bearing node; keep ancestors `clipsContent=false` so the ring isn't clipped. Glow recipe:
  - **Never bind the effect colour to a variable** — binding resolves at the variable's full alpha and
    drops the literal `/50`,`/20` transparency (ring renders opaque). Set a literal colour at the target
    alpha + `boundVariables.color = null`; bind the border STROKE normally.
  - On transparent / fill-less nodes set `showShadowBehindNode: false` (default `true` bleeds the halo
    through the empty body so the outer ring never reads).
  - **Copy** the glow effect verbatim from an existing focus template (spread/radius/offset/alpha + flag),
    don't reconstruct; synthesize a sibling state's glow (e.g. invalid) from the same template at that
    state's colour + alpha.
  - A glow fix applies to **every** glow member (focus, invalid, combined), not just the reported one —
    transparent members expose the defect, opaque ones hide it; screenshot all.
- **disabled** — member node opacity (dimming the text too is correct here).

## Usage-examples group (every build)

The Section holds the variant set **and** a permanent **Usage-Examples** group reproducing the usage
stories as real instances — the standing proof the surface is complete. **Every build**, not just composites.
Build these **after the variant surface is final** — later master/slot edits drop the example instances' overrides.

- One **instance per structurally-distinct story**, composed **only** from the component's controls
  (Properties / Variants / Slots / nested instances) — never a hand-built or re-clothed copy.
- Nest **real instances** of the set + any already-built partner (label, field, …); drive state via
  `setProperties`. Example-instance slot content is non-editable → compose via instances, not by editing
  internals.
- Lay out in a labeled **vertical auto-layout** group below the set, design-system spacing-token gaps, one
  labeled block per example (mirror the sibling Sections).
- **Screenshot the group and eyeball it** — the structural pre-handoff check only verifies structure
  (vectors, clipping, overlap), not semantics: a wrong, mislabelled, or wrong-text-style example passes it.
  Confirm each block has its caption and the composition is correct.
- **Done-Test:** a story you can't rebuild from controls alone = incomplete surface → fix the component
  (missing variant / slot / swap), never hand-place the missing piece.

## Verify — functional → clean → faithful

Three checks on the built set, in order:

1. **Controls live** — instantiate the set and drive **every control** the component exposes, not just
   variant props: each variant / text / boolean / instance-swap property (`setProperties`), **and** each
   **slot** (fill or replace its content). Read each back, iterate until it takes effect. A control that
   exists but does nothing — slot with no default, unbound text, swap that won't take — is broken.
   Delete the test instances. *(Composite: exercise every part set **and** the composition, not just the top level.)*
2. **Clean** — run the caller's structural pre-handoff check on the **whole built composition** (the
   Section/wrapper with its set + examples), not just the variant set — else spill/overlap of the
   freely-placed Section children goes unseen. Vectors not text, no clipping/overlap, padding symmetry.
   Must come back CLEAN. **A green structural check is necessary, not sufficient:** confirm the *same*
   invariant in the rendered composition. If render and check disagree, the **render wins** — the check is
   scoped wrong (e.g. it tested only the outer wrapper while content crosses an inner frame; the boundary a
   consumer reads is the inner one), so fix the check's scope and re-run rather than declaring CLEAN.
3. **Reproduces the usages (permanent)** — build every usage story as a **permanent** instance in the
   Section (§Usage-examples), each from the component's controls alone, then compare token/values/pixels
   (zoom, raw px). A standing deliverable, not throwaway scaffolding. A story you can't rebuild from
   controls = the surface is incomplete → fix the component (missing variant/slot), never hand-build or re-clothe.

## Composites — multi-part (no root element)

A composite = several independently-rendering parts, **no single root** (e.g. an input with adornments, a
command palette, a dialog). The single-component rules above still apply; add these.

**Slot ≠ Slot** — a frontend "slot" (`children`) is NOT a Figma Slot. One composite usually combines
several mechanisms at once: an editable string→Text, an optional element→Boolean, a finite choice
(align/size/state)→Variant, a one-off swappable element→Instance-Swap, an open region→Slot, a composed
already-built component→a nested instance. The **conditional-layout → Variant-axis** row bites hardest
here — it **multiplies the matrix** (state × layout); modelling only `state` can't reproduce the
column-stacking examples.

**Three build layers + examples:**
1. **Base sub-components** — factor recurring config shared across large sets into an internal Base;
   members instance it and override only the **delta** (token edits then propagate). (§Interaction states.)
2. **Nest existing instances** — a composed already-built component = a real **instance** of it, never a
   rebuild (token edits propagate).
3. **Flexible composition component** — the composite as **one** recompose-able component
   (Props/Swap/Slots per §Mechanism); whole-level variants ride on it. Slot config per §Slots.
   - **Anchored overlay** (content floats at the trigger, not centred — Figma can't "open"): model the open
     state as a top-level composition — trigger a flow child, overlay an `ABSOLUTE`/`layoutPositioning` child
     (needs an auto-layout parent, `layoutMode≠NONE`). **Member HUGs the trigger** (footprint = trigger) so
     its bounds track a resized/swapped trigger. Position the panel from **two orthogonal constraint axes,
     never hardcoded offsets**: **SIDE** (which trigger edge) pins the perpendicular axis → constant gap on
     resize — `top→vert MIN · bottom→vert MAX · left→horiz MIN · right→horiz MAX`; **ALIGN** (where along the
     edge) sets the parallel axis — `start→MIN · center→CENTER · end→MAX`. **`CENTER` ⟺ `align=center`** —
     never hardcode the cross axis independent of align.
   - **Two-stage anchor** (when the panel must *also* grow away from the trigger as HUG content grows):
     Figma constraints govern an `ABSOLUTE` child in **both** senses — parent-resize tracking AND its own
     HUG-growth anchor — and each side needs the **opposite** edge for the two, so one element can't serve
     both. Split: (1) **Panel Position** — invisible (`fills=[]`) FIXED anchor, `ABSOLUTE`, carrying the
     SIDE×ALIGN *tracking* constraints above (glues to the trigger edge on resize); (2) **Panel Content** —
     `ABSOLUTE` child of Panel Position, side-axis constraint **inverted** (`bottom→MIN · top→MAX · left→MAX
     · right→MIN`), align axis = align → HUG-growth extends *away* from the trigger. Caveat (panel ≫ trigger,
     the parallel constraint can overflow): pin the panel at the inset and move the **trigger** to encode
     start/center/end instead (alignment is relative).
   - **Interactive (triggered) overlay** (popover/dropdown/select/tooltip-w/-trigger) — model: open/closed
     state axis · content as anchored `ABSOLUTE` child · trigger as Slot/instance-swap (`asChild`) ·
     open/dismiss prototype. A triggerless panel stays static.
   - **Containing the overlay variant set (display).** With HUG members the anchored content floats
     *outside* each member — hence outside the set's auto-sized frame — so it crosses every outer wrapper.
     The frame that must enclose the panels is **the set itself, via padding**; widening an outer container
     (wrapper/section) only relocates where they cross, never contains them. Measure each visible panel's
     overflow beyond the set per edge and pad the set by `overflow + margin` (side-axis overflow = panel
     extent along that axis + `sideOffset`). For a **fixed primary-axis** set (GRID / fixed AL), grow that
     axis by the same total padding so the content area stays constant → the grid doesn't squeeze or
     re-flow. (Verify per /figma-verify §3: each visible-leaf `absoluteBoundingBox` inside the set frame.)
4. **Usage-Examples group** (§Usage-examples) — here it is build **layer 4**, reproduction running through
   slots / swaps / nested instances (= the Done-Test proof). Non-trivial: dropping an instance **into a
   slot** counts as a control; a hand-placed element beside/without a slot does not.

## Red flags (Plugin-API)

| Trap | Reality |
|---|---|
| Read `componentPropertyDefinitions` off a variant | Readable only on the **set** (or a non-variant component) — throws on a single variant. |
| Decide a Plugin API is missing because it's not in the typings | Typings lag the runtime — probe it (enumerate keys / try in `use_figma`) before changing approach (e.g. `createSlot` runs but isn't typed). |
| Find a swap/lookup target by name **substring** over members | Member names embed `prop=value` → false-match, silently hits the wrong node. Match the target's **exact main-component name**; after a structural swap verify **structurally** (which main is nested where), not by screenshot. |
| Read `.height`/size right after toggling a child's `visible` | Plugin size reads don't reflect the visibility-driven auto-layout reflow — confirm collapse via screenshot, not size reads. |
| Clone a slot-owning member and re-`createSlot()` | The clone keeps the SLOT but clears its `slotContentId` (the prop lives on the set) → re-bind the reference; recreating spawns a zero-referenced duplicate prop (§Slots). |

# Component Port — Table (2026-06-26)

Initial shadcn → Figma → Code port of `table` into the Agentport DS. Multi-part composite
(no root element, 8 `data-slot` parts, no CVA). Skill: `/shadcn-component-port` (+ `references/composites.md`).

## Anatomy

8 prop-less pass-through parts (each spreads a native table-tag `ComponentProps`, only className/children):
`Table` (div container + `<table>`) · `TableHeader` (thead) · `TableBody` (tbody) · `TableFooter` (tfoot) ·
`TableRow` (tr) · `TableHead` (th) · `TableCell` (td) · `TableCaption` (caption). No CVA. The only
interaction surface is **TableRow** state (default / hover / selected). Dependency audit: `ui:add table`
wrote **only** `table.tsx` — no foreign deps, no lucide icons. Clean.

## T3 — Token mapping (stock → DS)

| Part | Stock | DS | Why |
|---|---|---|---|
| Table `<table>` | `text-sm` | `text-format-body` | 14/400 app body; cells inherit |
| TableHead | `font-medium` | `text-format-label` | only 14/500 format (head emphasis) |
| TableHead | `text-foreground` | `text-ink` | §6 rename |
| TableHead | `px-2` (8) | `px-md` | px-value mapping |
| TableHead | `h-10`, `[&:has([role=checkbox])]:pr-0` | unchanged | geometry numeric / behavioural |
| TableCell | `p-2` (8) | `p-md` | px-value mapping |
| TableFooter | `font-medium` | `text-format-label` | 14/500; cells inherit via tfoot |
| TableFooter | `bg-muted/50` | `bg-muted-fill/50` | §6 rename; neutral chrome band |
| TableFooter / Body / Header / Row | `border-t`/`border-b`/`border-0` | unchanged | width only; **colour = `border-border` via base-layer `* { @apply border-border }`** (no class) |
| TableRow | `hover:bg-muted/50` | `hover:bg-muted-fill/50` | **neutral** hover — matches Item (`[a]:hover:bg-muted-fill`); muted-fill #f9fcfd ≈ white |
| TableRow | `has-aria-expanded:bg-muted/50` | `has-aria-expanded:bg-muted-fill/50` | same hover-level affordance |
| TableRow | `data-[state=selected]:bg-muted` | `data-[state=selected]:bg-accent-fill` | **accent** selection tint — documented Selektions-Tint, like Command; muted-fill would be ~invisible for a *selected* row. **Text stays ink** (stock recolours no text; accent-fill #eaf8ff carries ink fine) |
| TableCaption | `text-sm` | `text-format-body` | (inherited anyway; kept explicit) |
| TableCaption | `text-muted-foreground` | `text-muted-ink` | §6 rename (see skill-feedback #2) |
| TableCaption | `mt-4` (16) | `mt-xl` | px-value mapping |
| all | `dark:` | dropped | light-only DS |

**Row-tint tone (hover neutral / selected accent) was a user decision** (AskUserQuestion, 2026-06-26),
not a silent name-match: stock uses `muted` for both; DS `muted-fill` is near-white so a name-faithful
selected row would be invisible. Hover = Item precedent (neutral), Selected = Command precedent (accent).

## Code

`libs/ui/src/components/ui/table/` — `table.tsx` (8 exports) + `table.stories.tsx` + `table.spec.tsx` +
`index.ts` barrel. Re-exported in `libs/ui/src/index.ts`. Props annotated via JSDoc (each part has a
role description; parts are passthrough → no curated flat props). No jsdom polyfill needed (no headless lib).

**Gate green:** typecheck ✓ (project-wide) · lint ✓ (0 errors) · unit specs ✓ (9/9, `table.spec.tsx`) ·
stories ✓ (5/5 browser + axe + play, via storybook MCP). Visual-verified via `shoot` (Default, RowStates,
Selectable) — row tints + footer band + caption faithful.

### Stories (preview URLs, Storybook :6006)
- Default — http://localhost:6006/?path=/story/ui-table--default
- Selectable (play) — http://localhost:6006/?path=/story/ui-table--selectable
- Empty State — http://localhost:6006/?path=/story/ui-table--empty-state
- Alignment — http://localhost:6006/?path=/story/ui-table--alignment
- Row States — http://localhost:6006/?path=/story/ui-table--row-states

## Figma (file ejFKo4MNuvC9TSDKOCUvyq, page "Shadcn Components" 3126:2)

Section **Table** `4514:2597`. User chose granularity **Cell + Row + Table** + align axis **left/center/right**.

| Node | id | axis / props |
|---|---|---|
| TableHead (set) | `4515:2603` | `align` [left,center,right] · TEXT `head (children)#4515:0` ({Head}) · Label + ink, h-10, px-md |
| TableCell (set) | `4515:2610` | `align` [left,center,right] · TEXT `cell (children)#4515:4` ({Cell}) **+ SLOT `content#4527:0`** · Body + ink, p-md |
| TableRow (set) | `4520:2621` | `state` [default,hover,selected] · SLOT `cells#4520:3` (empty) · bottom-border→border · hover muted-fill/50 · selected accent-fill · minHeight 37 |
| Table (composition) | `4521:2597` | **SLOT `content#4537:0`** (default = invoice interior) · BOOL `showCaption#4522:1` · TEXT `caption#4522:2`. Recompose-able: the content slot holds header+body+footer rows; caption below |
| Usage Examples (group) | `4523:2635` | **all 4 = Table instances** (content slot filled): Default (`4523:2638`, slot-default invoice + caption) · Selection (`4538:2802`, row2 selected) · Empty (`4538:2890`, No results) · Component cells (`4538:2963`, Checkbox + Badge) |

**Table composition is slot-based (2026-06-26 revision, user request "table component should be used in the
examples"):** the interior (header + body + footer rows) is a `content` SLOT whose default child is the baked
invoice — so the Table master + Default example show the invoice for free, and the other examples are Table
instances whose slot is filled with their own rows (clear the 1 default child + append the rows frame; the
old hand-built example frames were moved into the slots, not rebuilt). `showFooter` dropped (the footer band
is part of the slotted content). Earlier all examples but Default were hand-built frames not using the Table
component — fixed. (The clipping the user saw in the Default invoice was the pre-fix cell-bloat; the
text-in-slot height fix resolved it — verified 0 clipped text nodes across the section.)

**TableCell content model (2026-06-26 revision, user request "eine table cell nimmt auch components an"):**
the cell holds a `content` SLOT whose default child is the `{Cell}` text node bound to the
`cell (children)` TEXT prop. Text cells → use the text prop (default). Component cells → blank the text +
drop a component (Checkbox/Badge/Button) into the slot. Slot HUGs its content, aligned by the cell's
`align` axis (primaryAxisAlignItems). Retrofit gotcha hit + fixed: an **empty** slot is intrinsically
~100×100 (HUG doesn't collapse it) → bloated cells to 116px and propagated into the baked composition;
fix = nest the text INSIDE the slot so it's never empty (slot HUGs text/component → cell back to 37px).

**Bound variables:** ink `3037:3` · border `3038:4` · muted-fill `3037:12` · muted-ink `3037:13` ·
accent-fill `3037:14` · space-md `3070:6` · space-xl `3070:9` · text-styles Body `S:7e1bf8…` / Label
`S:4e0346…` / Eyebrow `S:c91d21…` (example labels).

**Verify triad:** controls-live ✓ (all variant/text/bool props + the `cells` SLOT merged to one set-level
prop; showFooter/showCaption collapse cleanly) · `/figma-verify` **CLEAN** (no text-icons/clipping/overlap/
padding-asym; the 3 "unbound strokes" = variant-set boundary chrome, not design strokes) · faithful ✓.

### Figma build deviations / decisions
- **Cells = TEXT prop + content slot** (slot added 2026-06-26 on user request — see skill-feedback #4). The
  cell holds a `content` slot (default = the bound `{Cell}` text) → text by default, or a swapped component
  (Checkbox/Badge/Button). Example "Component cells" proves it. *(Initial port shipped TEXT-prop-only — a
  too-thin surface; I should have asked the Slot-vs-Swap fork on cell content in T2.7.)*
- **Footer cells stay Body** (not Label-weight). Code `tfoot` adds `text-format-label` (font-medium); the
  Figma footer band's muted fill + top border carry the distinction. Minor, acknowledged divergence.
- **TableRow `cells` slot built EMPTY** (DS "Slots LEER gebaut" convention) + row `minHeight 37` so the
  state bars read in the set; examples fill via append-only (see skill-feedback #3). Demo content is baked
  into the Table composition / example frames, not into the row set members.

## Example-inventory (T2.5 doc examples → disposition)

| Doc example | Disposition | Reason |
|---|---|---|
| `table-demo` (invoice) | **kept-distinct** | canonical; only Table primitives → Story **Default** + Figma Table composition / Default example |
| `data-table-demo` (TanStack) | **skipped-missing-dep** | needs **DropdownMenu** (un-ported) + `@tanstack/react-table`. Its *capabilities* covered by DS-authored stories: selected-state + checkbox-cell → **Selectable** (uses ported Checkbox); empty row → **EmptyState**; numeric right-align → **Alignment** / **Default** |
| (DS-authored) | RowStates, Alignment | row state axis + align capability; Figma = TableRow set + Head/Cell align axes |

## Open items
- ~~Cells as TEXT-prop (no content slot)~~ **RESOLVED 2026-06-26** — content slot added; cells nest
  components (Component cells example).
- TableHead stays TEXT-prop (no content slot) → a select-all checkbox / sort button in a header isn't
  nestable in Figma yet. Same retrofit would apply if needed.
- Footer label-weight is code-only (Figma footer cells Body).
- `secondary`/`destructive` placeholder tokens — N/A here (table binds only ink/border/muted/accent, all real).

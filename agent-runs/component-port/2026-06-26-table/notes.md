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

## Figma (file FIGMA_FILE_KEY, page "Shadcn Components" 3126:2)

Section **Table** `4514:2597`. User chose granularity **Cell + Row + Table** + align axis **left/center/right**.

| Node | id | axis / props |
|---|---|---|
| TableHead (set) | `4515:2603` | `align` [left,center,right] · TEXT `head (children)#4515:0` ({Head}) · Label + ink, h-10, px-md |
| TableCell (set) | `4515:2610` | `align` [left,center,right] · TEXT `cell (children)#4515:4` ({Cell}) · Body + ink, p-md |
| TableRow (set) | `4520:2621` | `state` [default,hover,selected] · SLOT `cells#4520:3` (empty) · bottom-border→border · hover muted-fill/50 · selected accent-fill · minHeight 37 |
| Table (composition) | `4521:2597` | BOOL `showFooter#4522:0` · BOOL `showCaption#4522:1` · TEXT `caption#4522:2`. Bakes the invoice (header + 3 body rows + footer band + caption); body built from Row/Head/Cell instances |
| Usage Examples (group) | `4523:2635` | Default (Table instance) · Selection (header+2 rows, row2 selected) · Empty (No results) |

**Bound variables:** ink `3037:3` · border `3038:4` · muted-fill `3037:12` · muted-ink `3037:13` ·
accent-fill `3037:14` · space-md `3070:6` · space-xl `3070:9` · text-styles Body `S:7e1bf8…` / Label
`S:4e0346…` / Eyebrow `S:c91d21…` (example labels).

**Verify triad:** controls-live ✓ (all variant/text/bool props + the `cells` SLOT merged to one set-level
prop; showFooter/showCaption collapse cleanly) · `/figma-verify` **CLEAN** (no text-icons/clipping/overlap/
padding-asym; the 3 "unbound strokes" = variant-set boundary chrome, not design strokes) · faithful ✓.

### Figma build deviations / decisions
- **Cells use a TEXT property, not a content slot** → the Figma cell can't literally nest a Checkbox. The
  Selectable story's checkbox column is therefore represented by the **selected-row tint** only; the
  Checkbox is the separate ported component composed at the call site. Honest scoping (logged), not a
  surface gap for the table itself.
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
- Cells as TEXT-prop (no content slot) → no in-cell Checkbox/Badge nesting in Figma. Revisit with a content
  slot if rich-content cells become a real need (would also fully reproduce the Selectable checkbox column).
- Footer label-weight is code-only (Figma footer cells Body).
- `secondary`/`destructive` placeholder tokens — N/A here (table binds only ink/border/muted/accent, all real).

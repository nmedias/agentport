# Separator — shadcn → Agentport DS port (2026-06-12)

Initial port via `/shadcn-component-port`. Single static, non-interactive element (Radix
`Separator.Root`, `decorative` by default). Per SKILL T2, a static element has **no state axis** →
the axis is **content**; for separator the content axis is **`orientation` (horizontal | vertical)**,
driven by the `data-[orientation=…]` classes. No `variant×size` matrix fabricated — full matrix = the
2 orientations.

## Anatomy (T2)

- Source: `@shadcn` item `separator`, style **radix-nova** (`npm run ui:add -- separator`).
- No CVA. One class string on `<SeparatorPrimitive.Root data-slot="separator">`:
  `shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`
- `decorative=true` default → renders `role="none"` (non-semantic); `decorative={false}` →
  `role="separator"` + `aria-orientation`.
- Note: nova uses the v4 shorthand `data-horizontal:`/`data-vertical:` (= `data-[orientation=horizontal]`)
  and **`self-stretch`** for the vertical fill (stock new-york used `h-full`).

## Mapping table (T3 — stock → DS)

| stock class | DS utility | kind | note / why |
|---|---|---|---|
| `shrink-0` | `shrink-0` | layout | keep — stops the line collapsing in a flex row |
| `bg-border` | `bg-border` | **token** | DS `border` token (`--color-border`, `VariableID:3038:4`). Its `use` is literally "Standard-Kanten/**Trenner**" — the default divider. **Not** `border-emphasis`/`border-strong` (the heavier rungs of the line ladder). Class name unchanged, but the binding is now semantic, not a value coincidence. |
| `data-horizontal:h-px` | `data-horizontal:h-px` | geometry | 1px line thickness — numeric, NOT a spacing token (§6 control_geometry) |
| `data-horizontal:w-full` | `data-horizontal:w-full` | layout | fill cross-axis width |
| `data-vertical:w-px` | `data-vertical:w-px` | geometry | 1px line thickness — numeric |
| `data-vertical:self-stretch` | `data-vertical:self-stretch` | layout | fill cross-axis height (nova's stretch) |

**Why this is a degenerate port:** stock `bg-border` already names the DS `border` token (same utility),
and every other class is pure geometry/layout with no token equivalent. So the class string is
**unchanged** — but the T3 verdict is that it was *checked* against §6 by role (`use`/`avoid`), not
left by accident: `border` is the divider token, the 1px is geometry, the fills are layout.

## Figma (T4) — file `FIGMA_FILE_KEY`, page "Shadcn Components" (3126:2)

- Section **"Separator"** = `3675:1016` (headline `3675:1017`), placed 80px right of Dialog
  (3589:788), section-relative origin; tight fit 545×378.
- Component set **`.Separator`** = `3676:1018`, axis `orientation`:
  - `orientation=horizontal` = `3676:1016` (240×1 line)
  - `orientation=vertical` = `3676:1017` (1×40 line)
- Both members: SOLID fill **bound to `VariableID:3038:4`** (`shadcn Default/border`, semantic collection).
- No text, no icons, no slots (a 1px line is the whole component — nothing swappable).

### DS variable used
| token | figma var id | css var | utility |
|---|---|---|---|
| border | `VariableID:3038:4` | `--ap-sys-border` (`--color-border`) | `bg-border` |

## Verify (T5)

1. **Controls live** — instantiated the set, drove `orientation` → `horizontal` (read-back 240×1,
   fill `VariableID:3038:4`) and `vertical` (read-back 1×40, fill `VariableID:3038:4`). Both took
   effect; temp instance `3688:1016` deleted. PASS.
2. **`/figma-verify 3676:1018`** — tree walk: 0 TEXT nodes (no icon glyphs), auto-layout set
   (siblings can't overlap/clip), padding symmetric (40/40/40/40), both fills bound. **Verdict: CLEAN.**
3. **Reproduces the usages** — both doc stories are pure instances of one `orientation` value
   (horizontal line between blocks; vertical lines in a flex row). Rebuildable from the single
   `orientation` control; no story needs a variant/slot the set lacks. PASS.

## Example inventory (T2.5)

Source: `ui.shadcn.com/docs/components/separator` (confirmed via `get_item_examples_from_registries`
→ one `separator-demo`). The single demo contains **both** structurally distinct usages.

| doc example | disposition | reason |
|---|---|---|
| separator-demo (horizontal between text blocks) | **kept** → story `HorizontalBetweenBlocks` | block-flow rule, default orientation, `h-px w-full` |
| separator-demo (vertical in flex row "Blog/Docs/Source") | **kept** → story `VerticalInRow` | inline cross-stretch, `w-px self-stretch` — genuinely different anatomy |
| — | added `Orientations` overview | exercises both axis values in one frame (T6: ensure every value appears in ≥1 story) |

No examples skipped (no missing deps — separator has none).

## Code (T6)

- `libs/ui/src/components/ui/separator/` → `separator.tsx` + `separator.stories.tsx` +
  `separator.spec.tsx` + `index.ts` (barrel `export * from './separator'`).
- Re-exported in `libs/ui/src/index.ts` (`export * from './components/ui/separator'`).
- Headless lib: Radix Separator is trivial (no `ResizeObserver`/`scrollIntoView` on mount) → **no
  jsdom polyfill needed**; existing `test-setup.ts` (which has the cmdk polyfills) suffices.
- Stories preview URLs:
  - HorizontalBetweenBlocks — http://localhost:6006/?path=/story/ui-separator--horizontal-between-blocks
  - VerticalInRow — http://localhost:6006/?path=/story/ui-separator--vertical-in-row
  - Orientations — http://localhost:6006/?path=/story/ui-separator--orientations

## Gate state

`npx nx test|typecheck|lint @agentport/ui` — **all green**.
- test: 57 passed (separator = 4: default-horizontal, vertical, decorative/role, bg-border survival).
- typecheck: clean.
- lint: clean (only pre-existing `.storybook/main.ts` `any` warning, not ours).

## Open items

- None blocking. The DS `border` token used here is fully designed (no ⚠ placeholder).
- Parallel run: a sibling `badge` port shared the Figma session + git tree on branch
  `feat/shadcn-badge-separator-port`. My Separator section sits in the far-right lane (x≈9073);
  the badge export coexists in `index.ts`. All changes left uncommitted for user review.

## Skill feedback

One finding captured in `skill-feedback.md`:
1. **T4 / figma-build** — Section children use SECTION-RELATIVE coords (not page-absolute); the
   build snippet's absolute `set.x` placed the set far outside the section and blew up the fit-resize.

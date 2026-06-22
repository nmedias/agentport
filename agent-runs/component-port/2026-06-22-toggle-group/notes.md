# Port-Run — toggle-group (+ co-ported toggle) · 2026-06-22

**Branch:** `feat/shadcn-toggle-group-port`
**Worktree:** `.claude/worktrees/toggle-group-run` (own isolated path; the `.claude/worktrees/toggle-group`
path was contended by a sibling popover agent — created a uniquely-named worktree off `master` `b36abd4`).
**Subject:** `toggle-group` — HARD-DEPENDS on `toggle` (its items import `toggleVariants`) → **co-port `toggle`**
(Finding B10: a hard-imported dep the kept source imports directly MUST be co-ported, like Label↔Field).

## Plan
- Co-port BOTH `toggle` and `toggle-group` fully (own folder + Figma set + catalog entry + stories + spec each).
- Baseline radix-nova; re-clothe in DS tokens BY NAME.
- Figma build under single-connection mutex lock.

## Work log

### T1 — Setup (verified)
`cn()` (libs/ui/src/lib/utils.ts) already registers all at-risk twMerge groups: `text-format`,
named spacing, `corner-*`, DS shadows. Toggle's at-risk utilities = `text-format-label` (button text)
and `corner-lg`/`corner-md` (radius) → both covered. No new family introduced. T1 OK, no edit.

### T2 — Anatomy (landed via `npm run ui:add -- toggle-group` → wrote 2 flat files: toggle.tsx + toggle-group.tsx)

**radix-ui dep:** declared in libs/ui/package.json (`"radix-ui": "^1.5.0"`). Both sources use the
**umbrella** import (`import { Toggle as TogglePrimitive } from "radix-ui"`,
`import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"`) — matches sibling full-primitives
Select/Dialog (Finding B8/B13: full primitive keeps umbrella, no per-primitive switch). No `lucide-react`
in either source (icons come from consumer `children`).

**toggle.tsx** — single-element CVA (`TogglePrimitive.Root`, `data-slot=toggle`):
- CVA axes: `variant: [default, outline]`, `size: [default, sm, lg]`; defaults default/default.
- States expressed in the class string: on/off (`data-[state=on]:bg-muted` + `aria-pressed:bg-muted`),
  `hover:`, `focus-visible:` (ring), `disabled:opacity-50`, `aria-invalid:` (border/ring destructive).
- Stock classes → DS (T3): rounded-lg, text-sm font-medium, hover:bg-muted/text-foreground,
  focus-visible ring, border-input (outline), data-[state=on]:bg-muted/aria-pressed:bg-muted, dark: drop.
  `size=sm` carries `rounded-[min(var(--radius-md),12px)]` + `text-[0.8rem]` (both → DS forms).
- Geometry numeric: h-8/min-w-8/px-2.5 (default), h-7/min-w-7 (sm), h-9/min-w-9 (lg); svg size-4 / size-3.5.

**toggle-group.tsx** — composition Root + Item, reuses `toggleVariants` from `@/components/ui/toggle`
(HARD DEP → toggle co-ported, Finding B10):
- `ToggleGroupContext` propagates `variant`/`size`/`spacing`/`orientation` Root→Item (ToggleGroup-idiom).
- Root (`data-slot=toggle-group`): flex-row / `data-vertical:flex-col`, gap driven by `--gap`
  (spacing prop), rounded-lg. type single|multiple (Radix Root prop, not CVA).
- Item (`data-slot=toggle-group-item`): `shrink-0` + the `spacing=0` CONNECTED/segmented logic
  (rounded-none, first/last:rounded-l/r/t/b-lg, border-l-0/border-t-0, first:border-l/-t, z-10 on focus)
  + `toggleVariants({variant,size})`. Default spacing=2 = gapped (separate pills).

**Usage examples (doc):**
- toggle-demo: `<Toggle size=sm variant=outline>` with BookmarkIcon + "Bookmark" text (icon+text).
- toggle-group-demo: `<ToggleGroup variant=outline type=multiple>` with 3 icon-only items (Bold/Italic/Underline).
- Docs-page distinct forms: Toggle Default · Outline · With-text · Sizes(sm/lg) · Disabled;
  ToggleGroup Default(multiple) · Outline · single-type · Disabled · sizes · connected(spacing=0).
  Icons swap to @remixicon/react. No skip-rule deps (self-contained; no unported component composed).

### T3 — Translate (stock → DS mapping)

| Part | Stock class | DS | Why (use/avoid) |
|---|---|---|---|
| toggle base | `rounded-lg` | `corner-lg` | corner-lg `use` names "Toggles" explicitly |
| toggle base | `text-sm font-medium` | `text-format-label` | 14/500; `use` = Form-/Toggle-Labels, Button-Text |
| toggle base | `hover:bg-muted` | `hover:bg-muted-fill` | muted surface tint (-fill rework) |
| toggle base | `hover:text-foreground` | `hover:text-ink` | primary ink (foreground→ink) |
| toggle base | `aria-pressed:bg-muted` `data-[state=on]:bg-muted` | `…:bg-muted-fill` | the ON/selected fill — both kept (aria-pressed for group items, data-state for standalone) |
| toggle base | `gap-1` (4px) | `gap-xs` | px-value map (4→space-xs) |
| toggle base | focus `border-ring`/`ring-[3px]`/`ring-ring/50` | unchanged | ring name kept; ring-[3px] already the sibling form (B15) |
| toggle base | `aria-invalid:border-destructive`/`ring-destructive/20` | unchanged | destructive ⚠ placeholder name kept |
| toggle base | `dark:aria-invalid:ring-destructive/40` | **dropped** | no dark mode |
| outline | `border border-input` | `border border-input-border` | input border (border-input→input-border rework) |
| size default | `pr-2`/`pl-2` (8px icon-adjacent) | `pr-md`/`pl-md` | 8→space-md |
| size sm | `rounded-[min(--radius-md,12px)]` | `corner-md` | DS radius vocab; sm caps radius → corner-md (6px) |
| size sm | `text-[0.8rem]` (12.8px) | **dropped** | no sub-14 sans rung (B21/B23 off-ladder → base text-format-label by role governs) |
| size sm | `pr-1.5`/`pl-1.5` (6px) | `pr-sm`/`pl-sm` | 6→space-sm |
| toggle-group root | `rounded-lg` / `data-[size=sm]:rounded-[min(--radius-md,10px)]` | `corner-lg` / `data-[size=sm]:corner-md` | radius vocab |
| toggle-group root | `gap-[--spacing(var(--gap))]` | **kept verbatim** | consumer-controlled runtime gap (spacing prop) — dynamic data, not a static token |
| toggle-group item | `rounded-none`/`rounded-l-lg`/`rounded-r-lg`/`rounded-t-lg`/`rounded-b-lg` (connected) | `corner-none`/`corner-l-lg`/`corner-r-lg`/`corner-t-lg`/`corner-b-lg` | radius vocab (connected-bar joins) |
| toggle-group item | `px-2`/`pr-1.5`/`pl-1.5` (connected) | `px-md`/`pr-sm`/`pl-sm` | 8/6 → space-md/sm |
| toggle-group item | `border-l-0`/`border-t-0`/`first:border-l`/`first:border-t`, `z-10` | unchanged | border-width geometry + stacking |

Geometry kept numeric: `h-8`/`h-7`/`h-9`, `min-w-8/7/9`, `px-2.5` (10px, no rung), `size-4`/`size-3.5`.

### T2.5 / T6 — Code + Stories
- `toggle/` + `toggle-group/` folders, each `<name>.tsx` + `.stories.tsx` + `.spec.tsx` + barrel `index.ts`.
- Both re-exported in `libs/ui/src/index.ts` (toggle before toggle-group, dep order).
- **radix-ui umbrella kept** on both (Select/Dialog convention, B8/B13) — declared dep `^1.5.0`.
- **toggle**: CVA (`variant default/outline × size default/sm/lg`), local named-union types
  (`ToggleVariant`/`ToggleSize`) `... satisfies Record<…>` so docgen resolves the unions; flat JSDoc
  props. data-slot/data-variant/data-size. on/off via aria-pressed + data-state (not a CVA axis).
- **toggle-group**: Root+Item, context propagation (variant/size/spacing/orientation). **Type fix**:
  Radix `ToggleGroup.Root` props is a DISCRIMINATED UNION on `type` (single|multiple) → an
  `interface extends` over a union throws TS2312; used a `type … = ComponentProps<Root> & OwnProps`
  intersection instead (Item is a plain object → `interface extends` fine). Item reuses `toggleVariants`.
- Icons in stories = `@remixicon/react` (RiBold/Italic/Underline/AlignLeft/Center/Right/BookmarkLine).
- Stories: Default (playground + play, `userEvent.click` — raw `.click()` doesn't drive Radix in the
  Chromium story project), Variants, Sizes/SingleVsMultiple, States, Connected, Vertical, Disabled.
- Specs: jsdom (`fireEvent`) — toggle is a plain Radix button (no portal/ResizeObserver → no polyfill).
  DS-utility survival guards: `corner-lg` + `text-format-label` (toggle), `corner-lg` (group root).

### T4/T5 — Figma (file FIGMA_FILE_KEY, page Shadcn Components 3126:2)
- **Toggle Section** `4374:2289` · **Toggle set** `4375:2379` — 30 members
  `variant [default,outline] × size [default,sm,lg] × state [default,hover,on,focus,disabled]`.
  Bindings (by ID): fill muted-fill `3037:12` (hover/on), stroke input-border `4197:9644` (outline) /
  ring `3038:6` (focus), icon-fill ink `3037:3`, radius corner-lg `3073:4` / corner-md `3073:3` (sm).
  Focus = glow DROP_SHADOW copied verbatim from `.Input` focus `3176:305` (literal rgba(74,85,98,.5),
  spread 3, showShadowBehindNode:false, clip:true). disabled = member opacity 0.5. px-2.5 padding numeric.
  Usage-Examples group `4379:2313` (Variants / Sizes / States blocks).
- **Toggle Group Section** `4374:2291` · **ToggleGroup set** `4378:2329` — 4 members
  `variant [default,outline] × spacing [gapped,connected]`, each NESTING 3 REAL Toggle instances
  (B4/B9 — verified: 12 instances, all main=Toggle-set members, none detached). gapped itemSpacing=2,
  connected itemSpacing=0. Usage-Examples group `4379:2347` (Toolbar / Segmented bar / Ghost group).
- Verify: Toggle set CLEAN (30 members, 0 text-as-icon, 30 vector icons, 0 clip, 0 pad-asym);
  ToggleGroup CLEAN (4 members, 12 real Toggle instances, 0 text-as-icon). controls-live PASS (drove
  variant/size/state on Toggle, bindings read back as variable IDs).

### Figma vs Code axis-cardinality gaps (B14, noted)
- **Toggle `state` axis** = Figma-only (Code has no `state` prop — on/off is the Radix pressed state,
  hover/focus/disabled are CSS pseudo-classes). Modelled as the interaction-state axis per the build
  rules. Do NOT sync back as a CVA `state` axis.
- **ToggleGroup `spacing` axis** = Figma `gapped|connected` is a 2-value proxy for the Code's numeric
  `spacing` prop (0 = connected, >0 = gapped). Figma-only enum; Code keeps the number. NOT a Code prop fork.
- **ToggleGroup `orientation` + `size`**: NOT modelled as Figma axes (kept the set to variant×spacing for
  tractability). orientation shown in the code Vertical story; size scales items (covered by the Toggle
  set's size axis). Code carries both props fully. Deferred Figma axes, not a code gap.
- **Connected-bar inner corners**: Figma "connected" members show the 3 items touching with their own
  rounded corners (an approximation) — the true segmented look (flatten inner corners + shared border)
  isn't cleanly overridable on reused instances without detaching (B9 tradeoff). Code does it via the
  per-item `first/last:corner-*-lg` + `corner-none` classes. Acceptable Figma approximation, noted.

## Gate result
**GREEN** — `npx nx test|typecheck|lint @agentport/ui` all pass. **282 tests / 61 files** (jsdom specs +
storybook Chromium+axe). Worktree needed a real `npm ci` (git worktrees don't share node_modules; the
storybook browser project can't serve a symlinked node_modules) + a clean composite `dist` build (the
fresh worktree had no `.d.ts` outputs → TS6305 cascade until built). Both resolved.

## Example inventory (T7)
| Doc usage-example | Disposition |
|---|---|
| toggle-demo (size=sm, outline, Bookmark icon+text) | kept-distinct → States story (icon+text) |
| toggle Default / Outline / Sizes / Disabled (docs page) | kept-distinct → Variants/Sizes/States stories |
| toggle-group-demo (outline, multiple, 3 icon items) | kept-distinct → Default story |
| toggle-group single / connected / vertical / disabled (docs page) | kept-distinct → SingleVsMultiple/Connected/Vertical/Disabled stories |
No skipped examples — toggle/toggle-group compose no un-ported component (self-contained + icons).

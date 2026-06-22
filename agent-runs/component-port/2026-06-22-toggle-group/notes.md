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

## Gate result
(pending)

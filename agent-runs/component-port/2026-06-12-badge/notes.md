# Component Port — Badge (2026-06-12)

`/shadcn-component-port badge` — first-time port (shadcn → Figma → Code), token-faithful.
Branch `feat/shadcn-badge-separator-port` (shared with a sibling separator port; uncommitted).
Skill-feedback capture was ON → `skill-feedback.md` (4 findings).

## Summary

Single-element CVA badge (not a composite). Figma `.Badge` set keyed on the **`variant` axis**
(6 options) + an **`icon` SLOT** property. Code = DS-utility re-clothing of the landed radix-nova
source. Gate green, `/figma-verify` CLEAN.

## Source / anatomy (T2)

- `npm run ui:add -- badge` → flat `components/ui/badge.tsx` → moved into `badge/` + barrel.
- Landed source = **radix-nova baseline**, denser than the stock doc: CVA `variant` has **6** options
  (`default | secondary | destructive | outline | ghost | link`) vs the **4** the public doc-demos +
  brief enumerate. `ghost`/`link` are Nova extras. → kept ALL 6 in code (dropping options breaks the
  component); built ALL 6 in the Figma matrix too (full matrix). See skill-feedback #1.
- `data-slot="badge"`, `data-variant`, `asChild` (Radix `Slot.Root`), `[&>svg]:size-3!` icon sizing,
  `has-data-[icon=inline-start|inline-end]` icon-side padding mechanism.

## T3 — Translation table (stock landed-Nova → DS)

| stock class | px / role | DS utility | why (use/avoid) |
|---|---|---|---|
| `rounded-4xl` | full pill | **`corner-full`** | DS radius vocab; ALL `rounded-*` dead (§2/§6). 4xl = pill intent. |
| `text-xs font-medium` | 12px sans micro-label | **`text-format-label`** | No DS format at 12px sans (ladder = 14/18/22…). Pick by ROLE: label = chip/button text → snaps to 14px ⚠ (skill-feedback #2). |
| `bg-primary text-primary-foreground` | brand marker | `bg-primary text-primary-foreground` | already DS; default badge = "primary marker" (primary.use). |
| `bg-secondary text-secondary-foreground` | neutral chip | `bg-secondary text-secondary-foreground` ⚠ | **placeholder** token (raw hex, status:placeholder). Bound to the real Figma var `shadcn Default/secondary ⚠`. NOT finalized. |
| `bg-destructive/10 text-destructive` | error tint | `bg-destructive/10 text-destructive` ⚠ | **placeholder** token. 10% surface tint + destructive text/icon. Figma: bound var + paint opacity 0.1 + resolved fallback. NOT finalized. |
| `border-border text-foreground` (outline) | bordered neutral | `border-border text-foreground` | already DS; border = standard edge, foreground = primary text. |
| `hover:bg-muted hover:text-muted-foreground` (ghost) | quiet hover | same | muted = quiet chrome surface (muted.use). Static state = transparent + foreground. |
| `text-primary … hover:underline` (link) | text link | `text-primary` + underline | primary token; link variant. |
| `px-2` = 8 | pad-x | **`px-md`** | 8px → space-md (§3, per px-value). |
| `py-0.5` = 2 | pad-y | **`py-2xs`** | 2px → space-2xs. |
| `gap-1` = 4 | icon gap | **`gap-xs`** | 4px → space-xs. |
| `pr-1.5`/`pl-1.5` = 6 (icon side) | icon-side pad | **`pr-sm`/`pl-sm`** | 6px → space-sm. |
| `h-5` | 20px height | `h-5` numeric | control geometry (§6). |
| `[&>svg]:size-3!` | 12px icon | `[&>svg]:size-3!` numeric | icon geometry (§6). |
| `focus-visible:border-ring ring-[3px] ring-ring/50` | focus ring | kept (DS ring tokens + `ring-[3px]` arbitrary) | ring/ring valid; [3px] arbitrary kept. |
| `aria-invalid:border-destructive ring-destructive/20` | invalid | kept ⚠ | destructive placeholder. |
| `transition-all`, structural flex utils | — | kept | harmless / structural. |
| `dark:*` | dark mode | **dropped** | DS is light-only. |

## Figma — `.Badge` set

- file `nQSNLASjuLvgTh3we8Dp4s` · page **Components** `3126:2`
- Section **Badge** `3687:1016` (left lane, x=-151 y=1152, below Input — clear of the sibling
  Separator section at x=9073 and all other content)
- **Set** `.Badge` `3697:1016`
- **Properties:** `variant` (VARIANT, default `default`, options
  `default | secondary | destructive | outline | ghost | link`) · `icon#3697:0` (**SLOT**, leading,
  default = 12px check vector; empty it → text-only badge; replace it → any leading icon)
- **Members:**
  - `variant=default` `3691:2`
  - `variant=secondary` `3691:7`
  - `variant=destructive` `3691:12`
  - `variant=outline` `3693:2`
  - `variant=ghost` `3693:7`
  - `variant=link` `3693:12`
- Geometry: h-5 (20px FIXED) · HUG width · corner-full · px-md/py-2xs · gap-xs · `clipsContent=true`
  per member (= `overflow-hidden`). Label line-height pinned to 16px (fits the 16px inner box → no
  clip; ≈ "normal" for a 14px label).

### Variable bindings (by ID)

| token | Figma variable | id |
|---|---|---|
| foreground | `shadcn Default/foreground` | `VariableID:3037:3` |
| primary | `shadcn Default/primary` | `VariableID:3037:8` |
| primary-foreground | `shadcn Default/primary-foreground` | `VariableID:3037:9` |
| secondary ⚠ | `shadcn Default/secondary ⚠` | `VariableID:3037:10` |
| secondary-foreground ⚠ | `shadcn Default/secondary-foreground ⚠` | `VariableID:3037:11` |
| destructive ⚠ | `shadcn Default/destructive ⚠` | `VariableID:3038:3` |
| muted | `shadcn Default/muted` | `VariableID:3037:12` |
| muted-foreground | `shadcn Default/muted-foreground` | `VariableID:3037:13` |
| border | `shadcn Default/border` | `VariableID:3038:4` |
| ring | `shadcn Default/ring` | `VariableID:3038:6` |
| space-2xs (2) | `Space/space-2xs` | `VariableID:3070:3` |
| space-xs (4) | `Space/space-xs` | `VariableID:3070:4` |
| space-sm (6) | `Space/space-sm` | `VariableID:3070:5` |
| space-md (8) | `Space/space-md` | `VariableID:3070:6` |
| corner-full | `Corner/corner-full` | `VariableID:3073:6` |
| Label text style | `Label` | `S:4e034695df7aacfcebc7042471b1b11284b266f0,` |

Note: `secondary-foreground` is bound on the secondary member's label/icon; `destructive` doubles as
both the 10%-tint surface and the (full-opacity) text/icon on the destructive member.

## T5 — Verify

1. **Controls live** — instantiated `.Badge`, drove `variant` across all 6 (read-back ✓ for each),
   exercised the `icon` SLOT (cleared default + appended a star → replaced ✓; emptied → text-only
   badge renders clean ✓). Temp instances `3699:1016`, `3706:1016` deleted.
2. **Clean** — `/figma-verify 3697:1016` → **CLEAN** (0 flags): 6 vector icons (no text-as-icon),
   symmetric padding, no clipping after the line-height pin, no overlap.
3. **Reproduces usages** — variant axis rebuilds Default/Variants; SLOT rebuilds WithIcon (replace)
   and the no-icon usages (empty). Count (mono/min-w) + AsLink are code-level className/API overrides
   on top of the same look — Figma reproduces the colour + pill; the count geometry + asChild are not
   separate Figma variants (correct — they're shadcn className/Slot conventions).

## Example inventory (T2.5)

Doc source: `ui.shadcn.com/docs/components/badge` (badge-demo) + badge-outline/secondary/destructive.

| doc example | disposition | as story |
|---|---|---|
| badge-demo row 1 (4 variants) | kept (extended to all 6 landed variants) | `Variants` |
| badge-demo "Verified" (icon + label) | kept | `WithIcon` |
| badge-demo count pills (rounded-full, mono, 8/99/20+) | kept | `Count` |
| badge-outline | deduped — permutation of `Variants` (variant=outline) | — |
| badge-secondary | deduped — permutation of `Variants` | — |
| badge-destructive | deduped — permutation of `Variants` | — |
| (asChild — link badge; doc API, not a demo) | added | `AsLink` |
| (single default badge) | added | `Default` (default args) |

No example required a not-yet-ported component → nothing skipped.

## Code

- `libs/ui/src/components/ui/badge/badge.tsx` — CVA on DS utilities (6 variants), `asChild`, icon
  sizing. Exports `Badge`, `badgeVariants`.
- `libs/ui/src/components/ui/badge/badge.stories.tsx` — Default, Variants, WithIcon, Count, AsLink.
- `libs/ui/src/components/ui/badge/badge.spec.tsx` — 8 tests (children, label format, corner-full
  (not rounded), default/outline/secondary/destructive variants, asChild→anchor, className merge).
- `libs/ui/src/components/ui/badge/index.ts` — `export * from './badge'`.
- `libs/ui/src/index.ts` — added `export * from './components/ui/badge'` (line 1, before breadcrumb;
  sibling's separator export at line 8 left intact).

Icons: stories use `@remixicon/react` (`RiVerifiedBadgeFill`). Count pills use `font-mono tabular-nums`
(stock pattern) — `font-mono` is a structural family utility kept as-is for the count idiom.

### Preview URLs
- Default — http://localhost:6006/?path=/story/ui-badge--default
- Variants — http://localhost:6006/?path=/story/ui-badge--variants
- With Icon — http://localhost:6006/?path=/story/ui-badge--with-icon
- Count — http://localhost:6006/?path=/story/ui-badge--count
- As Link — http://localhost:6006/?path=/story/ui-badge--as-link

## Gate

`npx nx test|typecheck|lint @agentport/ui` — **GREEN** (run concurrently with the sibling separator port).
- test: 11 files / **65 tests pass** (badge = 8).
- typecheck: exit 0.
- lint: exit 0 (1 pre-existing warning in `.storybook/main.ts`, not badge).

## ⚠ Placeholder flags

- **`secondary` / `secondary-foreground`** — stock placeholder tokens (raw hex `#f5f5f5`/`#343434`,
  `status: placeholder`, Figma name suffix ` ⚠`). Bound to the real ⚠-variables, NOT a designed DS
  colour. The `secondary` badge look is provisional.
- **`destructive` / `destructive-foreground`** — same (raw `#e7000b`/`#fafafa`). The `destructive`
  badge (10% tint + red text + invalid ring) rides the placeholder.

These two variants are kept structurally faithful but must NOT be treated as final DS surfaces.

## Open items

- Code carries **6** variants; the brief named a 4-variant matrix — Figma built all 6 to keep the full
  matrix (skill-feedback #1). If the DS later scopes badge to 4, drop `ghost`/`link` from BOTH.
- `text-format-label` (14px) is +2px vs stock badge's 12px — no 12px sans format exists in the DS
  (skill-feedback #2). If a micro-label format is added later, re-point badge.
- `has-data-[icon=inline-start|inline-end]` icon-side padding (`pr-sm`/`pl-sm`) is a className
  mechanism only; not modelled as a Figma axis (the slot default is leading; trailing/explicit-side
  is a code concern). Acceptable for a chip.
- `asChild` + count-pill geometry are code-level (Slot API / className overrides), intentionally not
  separate Figma variants.

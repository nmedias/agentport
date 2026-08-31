# Notes — popover port (2026-06-22)

Branch: `feat/shadcn-popover-port` (from `b36abd4`).
Subject: shadcn `popover` (Radix Popover) → Agentport DS.

## Environment note (worktree mix-up — resolved)
- My branch `feat/shadcn-popover-port` was checked out in a SEPARATE worktree
  (`.claude/worktrees/toggle-group`), but the agent CWD was the MAIN dir `~/Dev/agentport`,
  which is the sibling tooltip agent's worktree (on `feat/shadcn-tooltip-port`). `git worktree list`
  initially showed only the main dir; the popover worktree surfaced later. All build work (code/stories/
  spec) was authored in the main dir, then RELOCATED into the correct worktree and committed there
  (`8296a6b`). The main/tooltip worktree was cleaned back to the sibling's state (my popover folder,
  run-artifacts, index.ts line, and catalog entry all reverted there — sibling's tooltip work untouched).
- Figma work is shared (not per-worktree), so it was unaffected.
- TYPECHECK CAVEAT: in this popover worktree `npx nx typecheck` reports 5 errors that are PURELY
  missing-typings infra (worktree node_modules lacks `@nx/react/typings/*.d.ts`, `vite/client.d.ts`,
  globals.css side-effect decl) — NONE reference popover. The identical popover code typechecks GREEN
  in the main dir (complete node_modules). spec (3) + stories (5, axe-clean) + lint (0 errors) are green
  in this worktree; the user's `npm run check` at merge runs in the fully-set-up tree.

## DS surface decision (from tokens-reference)
- 2026-06-18 rework: `overlay`+`popover` consolidated into ONE raised-surface token `dialog`.
  `popover`/`popover-foreground` REMOVED. So popover content =
  `bg-dialog-fill` + `text-dialog-ink` + `border` + `shadow-elevation` + `corner-*` + `p-*` + `text-format-*`.
  NO scrim, NO footer (those are Dialog-only).

## Downstream consumer (record only, do NOT build)
- popover + already-ported `command` compose the `combobox` endpoint-switcher from the
  explorer analysis. Out of scope for this port.

## T2 — Anatomy (radix-nova source, landed via `ui:add`)
Source `libs/ui/src/components/ui/popover.tsx` — 7 exports (Nova is richer than stock new-york-v4's 4):
- `Popover` (Root, data-slot=popover) — pass-through, no class
- `PopoverTrigger` (data-slot=popover-trigger) — pass-through, no class
- `PopoverContent` (data-slot=popover-content) — THE SURFACE, Portal-mounted raised panel
- `PopoverAnchor` (data-slot=popover-anchor) — pass-through
- `PopoverHeader` — `flex flex-col gap-0.5 text-sm` (Nova typo helper)
- `PopoverTitle` — `font-medium` (renders a div despite h2 type)
- `PopoverDescription` — `text-muted-foreground`
NO CVA. NO icons (no lucide → no swap needed). `radix-ui` umbrella import = correct for a full
primitive (B13/B8 — keep the umbrella, declared dep `radix-ui`).
Content class string (stock): `z-50 flex w-72 origin-(--radix-popover-content-transform-origin)
flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1
ring-foreground/10 outline-hidden duration-100 data-[side=*]:slide-in-* data-open:animate-in … data-closed:animate-out …`.

Axis decision: single raised-surface member (no variant×size; data-[side] = motion, not a DS state).
Family alignment: mirrors Dialog/Command panels — `bg-dialog-fill + border + shadow-elevation`
(both REPLACED Nova's `ring-1 ring-foreground/10` with `border` + the DS elevation token).
Reference clothing in-repo:
- Dialog content: `gap-xl corner-xl border bg-dialog-fill p-xl text-format-body text-dialog-ink shadow-elevation`
- Command default: `border bg-dialog-fill shadow-elevation` + `corner-xl p-xs`

## Work log
- T1 ✓ cn() already registers text-format / named-spacing / corner / shadow groups — no new at-risk family.
- T2 ✓ landed source, anatomy extracted (above).
- T2.5 ✓ stories authored (popover.stories.tsx + popover-content.stories.tsx).

## T2.5 — Example inventory (doc usage → stories)
Doc source: `ui.shadcn.com/docs/components/popover` → exactly ONE structurally-distinct example
(`popover-demo` = the "Dimensions" labelled-input form panel). All deps ported (Button ✓ Input ✓ Label ✓).
- `popover-demo` (Dimensions form) → kept as **Default** playground (Button trigger asChild + Header/
  Title/Description + 4 Label/Input rows). Reproduced with the real ported primitives, never div+label.
- Added (Nova API surface, not separate doc examples): **SimpleContent** (header/title/description only),
  **Anchored** (PopoverAnchor placement path), **Placements** (align start/center/end gallery axis).
- Sub-part page: **PopoverContent** (own props align/sideOffset) → `popover-content.stories.tsx`.
- Skipped: none (no doc example needs an un-ported dep). `combobox-popover` example = downstream
  combobox (popover + command) — OUT OF SCOPE per task brief, recorded as downstream consumer only.
- States gallery: NONE — popover content is a static raised surface with no pseudo-state axis
  (no focus/hover/disabled/invalid visual states). Gallery axis = placement (align), per house rule
  "display-only → gallery axis is variant/content, don't fake state rows".

## T3 — Stock class → DS token mapping (PopoverContent surface)
| stock | DS | why |
|---|---|---|
| `z-50` | `z-50` | layering, keep |
| `flex flex-col` | `flex flex-col` | layout, keep |
| `w-72` | `w-72` | geometry numeric (18rem default width); story overrides via className |
| `origin-(--radix-popover-content-transform-origin)` | same | Radix transform origin, keep |
| `gap-2.5` (10px) | `gap-md` (8) | no 10px rung; role = internal content stack gap (Dialog header uses gap-md) |
| `rounded-lg` | `corner-lg` | DEAD rounded-*; corner-lg = exact radius/8 map + "Buttons/Fields/Toggles" rung (control-attached panel, distinct from Dialog's large corner-xl) |
| `bg-popover` | `bg-dialog-fill` | `popover` token REMOVED 2026-06-18 → consolidated into `dialog` raised-surface |
| `p-2.5` (10px) | `p-lg` (12) | no 10px rung; role = compact control-grade panel padding (nearest rung, matches corner-lg "lg" family) |
| `text-sm` | `text-format-body` | DEAD text-*; body = app default fließtext (14, the panel's prose) |
| `text-popover-foreground` | `text-dialog-ink` | `popover-foreground` REMOVED → `dialog-ink` |
| `shadow-md` | `shadow-elevation` | DEAD shadow scale; depth carries meaning (raised overlay) → DS elevation |
| `ring-1 ring-foreground/10` | `border` | Nova raised-surface ring → DS family replaces with `border` (verbatim Dialog/Command) |
| `outline-hidden` | `outline-hidden` | keep |
| `duration-100` + `data-[side=*]:slide-in-*` + `data-open:*` + `data-closed:*` | unchanged | motion, not tokens, keep verbatim |

Helper parts:
| part | stock | DS |
|---|---|---|
| PopoverHeader | `flex flex-col gap-0.5 text-sm` | `flex flex-col gap-2xs text-format-body` (gap-0.5=2→gap-2xs; text-sm→body) |
| PopoverTitle | `font-medium` | `text-format-label` (14/500 = label format carries the medium weight; title-role caption) |
| PopoverDescription | `text-muted-foreground` | `text-format-body text-muted-ink` (muted-foreground→muted-ink; add body format since text-sm was on the header only — keep description legible) |

## T4/T5 — Figma build (Plugin MCP, fileKey ejFKo4MNuvC9TSDKOCUvyq, page "Shadcn Components" 3126:2)
Mutex held over the whole Figma phase, released before code. Connected (whoami=Manu).
- Section "Popover": **4365:2253** (x≈11687, auto-placed right of rightmost node)
- `PopoverContent` component: **4365:2255** — single member (no variant axis; data-[side]=motion not a DS
  state, so NO state set). Bindings: fill→dialog-fill (3037:6), stroke→border (3038:4) 1px,
  radius→corner-lg (3073:4), padding→space-lg (3070:8), gap→space-md (3070:6), effect→Elevation style,
  clipsContent=false (so the elevation shadow isn't clipped). counterAxis FIXED (w-72 default), HUG height.
  - `content` SLOT prop **content#4365:0** (the open region); default = a nested PopoverHeader instance.
- `PopoverHeader` component: **4367:2253** — Title (Text prop `title#4367:0`, Label style + dialog-ink)
  + Description (Text prop `description#4367:1`, Body style + muted-ink), gap space-2xs. Nested as the
  PopoverContent content-slot default; examples fill the slot with configured PopoverHeader instances.
- Usage-Examples group: **4368:2255** — 2 structurally-distinct popover SURFACES (the align/anchor
  variants are positioning props, same surface → not rebuilt as redundant panels):
  - Simple content (header-only) — PopoverContent inst 4368:2258, slot filled w/ a PopoverHeader inst.
  - Dimensions form (doc example) — PopoverContent inst 4368:2274, slot filled w/ header + 4 Label/Input
    rows (real DS instances: Label 3734:1022, Input 3176:303). filled inputs: placeholder blanked so only
    value shows (see skill-feedback B(popover-1)).
- **figma-verify CLEAN**: 0 text-icon / 0 clipped / 0 overlap / 0 padding-asymmetry across the section.
- Controls-live: the content slot accepts filled content via nested instances + PopoverHeader text props drive.

## T6 — Code port
- `popover.tsx` re-clothed per the T3 table (7 exports, `radix-ui` umbrella kept — full primitive, B13).
- Docgen: `PopoverContent` got an `Omit`+re-declare `PopoverContentProps` (align/sideOffset) → both
  surface in Autodocs + get-documentation with description + @default (verified via storybook MCP).
  `Popover` root = pass-through → API hand-authored in story argTypes (sanctioned case).
- Barrel: added `export * from './components/ui/popover'` to libs/ui/src/index.ts (alpha slot kbd→popover→radio-group).
- Spec (jsdom, B20-scoped): closed path (trigger present, aria-expanded=false, content unmounted) +
  `defaultOpen` path (content mounts WITHOUT the pointer-capture flow → no new polyfill needed) +
  token survival. The click-driven open→Escape flow lives in the Chromium play test, not jsdom.
  House idiom: `render()` return queries + `.className.toContain` / `.getAttribute().toBe` (no jest-dom).
- a11y FIX (finding A(popover-1)): Radix gives PopoverContent `role="dialog"` → axe `aria-dialog-name`
  failed on open-at-scan stories. Popover does NOT auto-wire its title (unlike modal Dialog) → added
  `aria-label` to every open-panel story's content; documented the requirement in the component JSDoc
  + stories contract comment. 5/5 stories axe-clean after.

## Gate result (lib)
- `npx nx test @agentport/ui` (popover): 3 jsdom specs PASS · 5 storybook stories PASS (Chromium + axe, 0 violations)
- `npx nx typecheck @agentport/ui`: PASS
- `npx nx lint @agentport/ui`: PASS (0 errors; the 46 warnings are pre-existing command.tsx aria-role, not popover)
- NOTE: the shared working dir also holds a sibling agent's in-progress `tooltip` files — a FULL-project
  storybook run may surface tooltip-story failures unrelated to popover. Popover files verified green in isolation.

## Findings captured (skill-feedback.md)
- A(popover-1) [/storybook-rules + T6 a11y]: portal overlay with role="dialog" needs an explicit accessible name or axe fails.
- B(popover-1) [/figma-build-rules §Usage-examples]: nesting a filled sibling Input → set value AND blank placeholder (filled-bool doesn't hide it).

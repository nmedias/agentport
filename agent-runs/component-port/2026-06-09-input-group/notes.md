# Component Port — input-group (2026-06-09)

shadcn `input-group` (radix-nova) → Agentport DS. Port #2 of 3 in the Command chain
(Textarea → **InputGroup** → Command). 6-part composite. Initial port (Figma + code).
Deps: Button ✓, Input ✓, Textarea (#1, this chain).

## Composite decisions (T2 ask, user-confirmed)

- **Own Figma sets for all 6 parts** (not code-only re-clothes) — incl. the 3 control wrappers.
- **All 4 addon aligns** (inline-start/-end, block-start/-end) — full nova API.

## Figma IDs (DS file nQSNLASjuLvgTh3we8Dp4s · page "Components" 3126:2 · Section "Input Group" 3491:674)

| node | id |
|---|---|
| Section "Input Group" | `3491:674` (headline `3491:675`) |
| `.InputGroup` container | `3495:698` — prop `state` (default/focus/disabled/invalid); nests Addon(inline-start)+Input instances |
| · state default/focus/disabled/invalid | `3495:674` / `:680` / `:686` / `:692` |
| `.InputGroup/Addon` | `3492:686` — prop `align` (inline-start `3492:674` / inline-end `:677` / block-start `:680` / block-end `:683`) |
| `.InputGroup/Button` | `3494:684` — prop `size` (xs `3494:674` / sm `:676` / icon-xs `:678` / icon-sm `:681`); ghost |
| `.InputGroup/Input` | `3493:674` (borderless transparent control) |
| `.InputGroup/Textarea` | `3493:676` (borderless, top-aligned) |
| `.InputGroup/Text` | `3493:678` (muted Body span) |

Vars: input-background `3108:2` · input(border) `3038:5` · ring `3038:6` · destructive ⚠ `3038:3`
· foreground `3037:3` · muted-foreground `3037:13` · input-placeholder `3043:3` · radius-lg `3073:4`
· radius-sm `3073:2` · space-2xs `3070:3` · space-xs `3070:4` · space-sm `3070:5` · space-md `3070:6`.
Text styles: Label `S:4e034695…`, Body `S:7e1bf8f1…`.

## T3 — Translation mapping (radix-nova stock → DS)

### InputGroup (container) — the group owns surface + border + focus/invalid/disabled
| stock | DS | why |
|---|---|---|
| (no light bg) | **bg-input-background** | DS fields are opaque (Input/Textarea precedent); nova leaves it transparent. Command overrides per its palette. |
| border border-input rounded-lg h-8 | same (geometry numeric) | form-control border + DS radius-lg |
| has-[control:focus-visible]:border-ring ring-3 ring-ring/50 | …ring-[3px] ring-ring/50 | the control owns focus; GROUP shows the ring (ring-3→ring-[3px]) |
| has-[aria-invalid]:border-destructive ring-destructive/20 | same | destructive ⚠ placeholder bubbles up |
| has-disabled:bg-input/50 + opacity-50 | has-[:disabled]:opacity-50 | DS disabled = opacity only; drop bg shift |
| has-[block-*]:flex-col / has-[textarea]:h-auto | kept | block addons + textarea stack the group vertically |
| has-[inline-start]:[&>input]:pl-1.5 / inline-end pr-1.5 | pl-sm / pr-sm | px-value (6→sm) input padding nudge |
| has-[block-end]:[&>input]:pt-3 / block-start pb-3 | pt-lg / pb-lg | px-value (12→lg) |
| in-data-[slot=combobox-content]:… | dropped | no Combobox in the DS yet |
| transition-colors / dark: | transition-[color,box-shadow] / dropped | focus changes box-shadow; single light mode |

### InputGroupAddon (align CVA)
| stock | DS | why |
|---|---|---|
| gap-2(8) / py-1.5(6) | gap-md / py-sm | px-value |
| text-sm font-medium text-muted-foreground | text-label text-muted-foreground | font-medium → Label format; addon affordance text |
| pl-2 / pr-2 (inline) | pl-md / pr-md | px-value |
| px-2.5(10) pt-2/pb-2 (block) | px-md pt-md/pb-md | px-value (10→md, 8→md) |
| [&>kbd]:rounded-[calc(--radius-5px)] | dropped | DS Kbd owns its own radius |
| [&>svg:not(size)]:size-4 / ml-[-0.3rem] nudges | kept | icon default + ghost-button/kbd alignment (arbitrary values valid §6) |

### InputGroupButton (size CVA, wraps Button ghost)
| stock | DS | why |
|---|---|---|
| base gap-2 text-sm shadow-none | gap-md (text/shadow dropped) | Button owns text-label; DS is flat |
| xs: h-6 gap-1 rounded-[calc(--radius-3px)] px-1.5 svg-3.5 | h-6 gap-xs rounded-sm px-sm svg size-3.5 | px-value; calc(8-3)=5≈radius-sm |
| icon-xs size-6 rounded-sm p-0 / icon-sm size-8 p-0 | same | geometry numeric |

### InputGroupText
| text-sm text-muted-foreground gap-2 | text-body text-muted-foreground gap-md | plain text-sm (Regular) → Body; distinct from the font-medium addon |

### InputGroupInput / InputGroupTextarea (borderless controls)
| flex-1 rounded-none border-0 bg-transparent ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 | same (+ data-slot=input-group-control) | the GROUP owns surface/border/ring; control goes transparent. Textarea: py-2→py-md, resize-none. dark: dropped. |

## Verify / Gate

- `/figma-verify 3495:698` (container) → **CLEAN**. Icons are VECTORs (search/close via createNodeFromSvg).
  One acknowledged HINT: container padding `pl=0 / pr=md` — intentional (inline-start addon owns the left inset).
- Gate: `nx typecheck` ✅ · `nx test` ✅ 27/27 (5 new input-group specs; text-label survives twMerge) ·
  `nx lint` ✅ (only pre-existing .storybook warning).
- **App-build CSS check** (apps/agentport/dist): the v4 has-/group-has-/data-align machinery emits — 25 `:has()`
  selectors incl. `.has-[[data-slot=input-group-control]:focus-visible]:border-ring`, the `data-align=block-start`
  flex-col rule, the `group/input-group` named group, and DS utilities `bg-input-background/pl-sm/py-md/pb-lg/
  field-sizing-content`.

## Code

`libs/ui/src/components/ui/input-group/` (tsx + index + stories + spec); re-exported in `libs/ui/src/index.ts`.
Exports: InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea.
Imports Button/Input/Textarea from `@/components/ui/*`.

## Open items
- `destructive` ⚠ placeholder token (invalid state).
- Combobox-content focus overrides dropped — re-add if a Combobox is ported.
- InputGroupButton icon sizes don't type-enforce aria-label (Button's size isn't forwarded) — matches nova; consumers add it.
- Next: Command (#3) — CommandInput builds on InputGroup + InputGroupAddon.

## Status: DONE — Figma CLEAN, code gate green, CSS variants verified.

## Code→Figma value audit (2026-06-09, post-port)

Re-read every set's bound values vs code; fixed drift in Figma (code = source of truth):
- **.InputGroup container** (3495:674/680/686/692): removed `itemSpacing` (was space-2xs → code has no gap)
  and `paddingRight` (was space-md → code group has no padding; addons provide all insets). Now gap=0, pad=0.
- **.InputGroup/Addon** (3492:*): added the base `py-sm` that was missing — inline-start/inline-end now
  paddingTop+Bottom=space-sm; block-start paddingBottom=space-sm (pt already md); block-end paddingTop=space-sm
  (pb already md). Matches the CVA base `py-sm` + per-align overrides.
- **.InputGroup/Button, /Input, /Textarea, /Text**: already matched code — no change.

## Code→Figma value audit — round 2 (pixel-deep, nested nodes)

First audit only checked top-level members; round 2 walked every nested node's raw px:
- **Container → nested .InputGroup/Input instance** (all 4 members): paddingLeft 0 → **6** (space-sm) —
  the `has-[>[data-align=inline-start]]:[&>input]:pl-sm` icon→text gap was missing.
- **.InputGroup/Button size=sm** (3494:676): itemSpacing 6 → **8** (space-md). The base `gap-md` wins over
  Button's default `gap-sm` (cn order: inputGroupButtonVariants applied last) — so sm = gap-md, not gap-sm.
- **.InputGroup/Textarea** (3493:676): paddingTop/Bottom 0 → **8** (space-md) — code `py-md` was missing.
Confirmed against raw px: Addon inline-start pl8/pt6/pb6/gap8, container input pl6, button sm gap8.

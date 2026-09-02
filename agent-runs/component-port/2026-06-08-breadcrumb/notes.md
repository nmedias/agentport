# Component Port — Breadcrumb (2026-06-08)

Initial shadcn → Figma → Code port. Multi-part composition.

## T1 — Setup
- `cn()` in `libs/ui/src/lib/utils.ts` already carries both extensions (text-format group + named
  spacing theme). ✓ no change needed.

## T2 — Anatomy (stock source: `libs/ui/src/components/ui/breadcrumb.tsx`, written flat by ui:add)

7 parts, no root element (multi-part composition):

| Part | El | Stock classes |
|---|---|---|
| Breadcrumb | nav | — (`aria-label="breadcrumb"`) |
| BreadcrumbList | ol | `flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5` |
| BreadcrumbItem | li | `inline-flex items-center gap-1.5` |
| BreadcrumbLink | a | `transition-colors hover:text-foreground` (asChild via radix Slot) |
| BreadcrumbPage | span | `font-normal text-foreground` (role=link, aria-current=page, aria-disabled) |
| BreadcrumbSeparator | li | `[&>svg]:size-3.5` + `<ChevronRight />` (role=presentation, aria-hidden) |
| BreadcrumbEllipsis | span | `flex size-9 items-center justify-center` + `<MoreHorizontal className="size-4" />` + sr-only "More" |

- No CVA, no variant/size axes anywhere.
- Icons stock = lucide (ChevronRight, MoreHorizontal) → must become Remix in DS port.

### Figma model (proposed, pending user confirm)
- **Segment set** `.Breadcrumb/Segment`, `state` axis = `link` | `page` (shadcn part names). Link
  carries the one meaningful interaction state (hover → foreground); page is static.
- **Separator** standalone component (chevron icon adornment).
- **Ellipsis** standalone component (more icon adornment, collapsed-trail marker).
- **Composition** `.Breadcrumb` = reusable component nesting segment + separator instances; variable
  length → a Slot, default = typical 3-segment trail (Home → Section → current Page).
- No whole-level variants (stock has none).

## T3 — Translate (draft mapping)

| Stock | → DS | px / why |
|---|---|---|
| `gap-1.5` (list, item) | `gap-sm` | 6px |
| `gap-2.5` (sm: list) | drop responsive → `gap-sm` base | DS port is single-density; sm: not modelled |
| `text-sm` + `font-normal` | `text-body` | 14/400 = body default |
| `text-muted-foreground` (list default) | `text-muted-foreground` | secondary text on light |
| `hover:text-foreground` (link) | `hover:text-foreground` | primary text on hover |
| `text-foreground` (page) | `text-foreground` | current page = primary text |
| `[&>svg]:size-3.5` (separator icon) | keep numeric `size-3.5` (14px) | icon geometry ≠ spacing |
| `size-9` (ellipsis box) | keep numeric | control geometry |
| `size-4` (ellipsis icon) | keep numeric (16px) | icon geometry |
| `transition-colors` | keep | animate namespace stays valid |
| `flex flex-wrap items-center` | keep | structural |

## T4 — Figma build (DONE)

File `nQSNLASjuLvgTh3we8Dp4s`, page `Components` (3126:2).
Section **Breadcrumb** `3249:302` (headline `3249:303`), placed right of the Kbd section.

| Node | id | notes |
|---|---|---|
| `.Breadcrumb` (composition) | `3254:302` | auto-layout H, gap-sm bound, wrap; holds a Slot |
| └ Slot `items` | `3254:303` | auto-layout H, gap-sm; default trail = 3 segments + 2 separators |
| `.Breadcrumb/Segment` (set) | `3250:308` | axis `state` + TEXT prop `Label` (`Label#3253:0`, default "Components") |
| └ state=link | `3250:302` | text fill → muted-foreground (3037:13) |
| └ state=link-hover | `3250:304` | text fill → foreground (3037:3) |
| └ state=page | `3250:306` | text fill → foreground (3037:3) |
| `.Breadcrumb/Separator` | `3251:302` | chevron vector (RiArrowRightSLine) 14px, fill → muted-foreground |
| `.Breadcrumb/Ellipsis` | `3251:305` | more vector (RiMoreLine) 16px in 36×36 box, fill → muted-foreground |

**Variables used:** muted-foreground `VariableID:3037:13`, foreground `VariableID:3037:3`,
space-sm `VariableID:3070:5`. **Text style:** Body `S:7e1bf8f13c3ffafb998f6bd71a65d8faa52911fb,`.

**Icons (Remix, path from `@remixicon/react` rendered output, MCP misses `*-s-line`):**
- `RiArrowRightSLine` → `M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z`
- `RiMoreLine` → three-dot path (System).

**T4b props exercise:** instantiated segment set, cycled state → fill resolves link=3037:13,
link-hover=3037:3, page=3037:3; `Label` text editable across all states. Test instance removed.

Note: adding the shared `Label` TEXT property reset the page variant's catalog text from "Breadcrumb"
to the property default "Components" — expected (one shared label property); states still distinguished
by colour. link-hover and page share foreground (correct: stock has both at text-foreground).

## T5 — Verify (CLEAN)
`/figma-verify 3249:302`: 10 text nodes all real text (no text-as-icon), 4 icon glyphs all VECTOR,
13 auto-layout frames no in-axis padding asymmetry, all auto-layout → no overlap. **CLEAN.**

## T6 — Code (DONE, gate green)

`libs/ui/src/components/ui/breadcrumb/` — `breadcrumb.tsx` + `index.ts` (barrel) + `.stories.tsx`
+ `.spec.tsx`; re-exported in `libs/ui/src/index.ts`. Flat `ui:add` file moved into the folder.

Final class translations:
- List: `flex flex-wrap items-center gap-sm break-words text-body text-muted-foreground`
- Item: `inline-flex items-center gap-sm`
- Link: `transition-colors hover:text-foreground`
- Page: `text-foreground` (`font-normal` dead → body weight inherited from list)
- Separator: `[&>svg]:size-3.5` + `<RiArrowRightSLine />`
- Ellipsis: `flex size-9 items-center justify-center` + `<RiMoreLine className="size-4" />`

Imports: `Slot` from `@radix-ui/react-slot` (project convention, NOT the registry's `radix-ui` umbrella
— see skill-feedback #1); icons from `@remixicon/react`.

**Gate:** `nx test` 15 passed (5 new) · `nx typecheck` clean · `nx lint` clean (1 pre-existing
warning in `.storybook/main.ts`, unrelated). DS typo classes confirmed in markup via spec assertions.

**Storybook previews:**
- Default — http://localhost:6006/?path=/story/ui-breadcrumb--default
- With Ellipsis — http://localhost:6006/?path=/story/ui-breadcrumb--with-ellipsis
- Two Levels — http://localhost:6006/?path=/story/ui-breadcrumb--two-levels

## T7 — Findings / open items
- secondary/destructive/chart-* not used here — no placeholder risk.
- Responsive `sm:gap-2.5` dropped (DS single-density). Flag if responsive density is wanted later.
- Skill-improvement findings captured in `skill-feedback.md` (Radix import convention; set AUTO sizing
  modes for padding; no composite snippet scaffold).

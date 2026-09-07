# API block audit — overlays (Tooltip, Popover, Dialog, Command)

Branch `api/overlays` in `~/Dev/agentport-api-overlays`. Two commits:
- `6456c44` — initial main-only build.
- `a78c3ad` — correction round after team-lead feedback: slots composed via JSX children now use
  `code: children` (not `none`); Popover's `state` (open/closed) reclassified from a prop-name
  mapping to `live-state` (matches the Input `filled` precedent). See "Correction round" below —
  supersedes two of the "Judgement calls" from the first pass (kept, struck through in spirit, for
  the trail).

## Model note (important — read first)

`check.py` was updated centrally mid-run to a stricter **main-only** model (no `of:` on any row at
all): `figma.api` documents only the Figma component **named like the section** (or an
`api_component` override when that one has zero controls of its own), and `code.props` documents
only the code export **named like the entry** (or `code.api_export`). Composite member parts
(TooltipContent, PopoverContent, DialogContent/DialogFooter/DialogTitle/DialogDescription,
CommandInput/CommandGroup/CommandItem/CommandSeparator) are **out of scope** — their own Figma
controls and JSDoc props are not required to appear anywhere in this entry. I confirmed this was
intentional (not a stale read) by checking `~/Dev/agentport-api-forms-a`'s already-committed Select
entry, which uses the same model (`api_component: SelectTrigger` with an explanatory `note:`).

This materially shrinks scope vs. the original brief text (which still shows `of:` examples) for
all four of my sections — none of the interesting composite-member controls (Tooltip Root's
trigger/state, PopoverContent's own surface, DialogFooter's actions slot, CommandInput's
placeholder/value/filled, CommandItem's state, CommandSeparator's label) are documented in `api:`
under this model. I flagged this to main before proceeding; no correction came back, and the
Select precedent confirmed the reading, so I built all four sections on it.

## Table

| Component | Figma main component | api rows | code-only rows | Figma rows built | check.py |
|---|---|---|---|---|---|
| Tooltip | `Tooltip` (content chip, 4441:73) | 2 (content, side) | 4 (open, defaultOpen, onOpenChange, delayDuration) | 6 | PASS |
| Popover | `Popover` (root set, 4402:2589) | 4 (trigger, state, side, align) | 2 (onOpenChange, modal) | 6 | PASS |
| Dialog | `Dialog` (composition, 3592:794) | 7 (footer, title (children), description (children), showCloseButton, showFooter, showBody, body) | 4 (open, defaultOpen, onOpenChange, modal) | 11 | PASS |
| Command | `Command` (composition, 3642:2) | 2 (list, variant) | 7 (label, shouldFilter, loop, value, defaultValue, onValueChange, filter) | 9 | PASS |

Final `check.py --only Tooltip,Popover,Dialog,Command`: **`ALL PASS`** (0 FAIL). Denylist grep clean.
Whole-file YAML parse: 25 entries parse; one pre-existing unrelated false-positive ("Table", the
Schema/Rules markdown fence) not in `--only`, not touched by me.

## Judgement calls

- **Popover's main component is the ROOT, not PopoverContent.** Unlike Select (whose composition
  has zero controls, forcing an `api_component` override to SelectTrigger), Popover's own root set
  (named exactly "Popover") already carries `trigger`/`state`/`side`/`align` — so no override, and
  PopoverContent's styled surface is simply out of scope. Same reasoning for Dialog (main =
  the composition, not DialogContent) and Command (main = the composition, not CommandInput/Item).
  Tooltip is the odd one out: its main-named component is the **content chip**, not "Tooltip Root" —
  so *that* one documents `content`/`side`, and Root's `trigger`/`state` axis is out of scope instead.
- **`code: "<Export>.<prop>"` external references**, verified by `check.py`'s `C4-code-ext` against
  the code extract directly (no code.props row needed in this entry) — used for: `Tooltip.side` →
  `TooltipContent.side`, `Popover.side`/`align` → `PopoverContent.side`/`align`, `Dialog.showCloseButton`
  → `DialogContent.showCloseButton`. This is the Select precedent (`SelectTrigger.size`,
  `SelectValue.placeholder`).
- **`code: none` for real-but-untracked capabilities** — e.g. Popover's `trigger` slot and
  Command's `list` slot both genuinely work as JSX children in code, but `children` is never
  JSDoc-redeclared on `PopoverProps`/`CommandProps` (unlike `Input`, which explicitly Omit+re-declares
  `placeholder`/`value` for docgen). Since `code.props` only tracks JSDoc'd members + curated
  aria-* passthroughs (verified: `curated: true` would need `children` to appear in
  `command.stories.tsx`/`popover.stories.tsx` argTypes as `children:` — it doesn't, unlike Badge/
  Breadcrumb which do), I classified these `none` with a note, following the same convention Select
  uses for `SelectTrigger.size`/`SelectValue.placeholder` being "out of scope" even though real.
- **Dialog's `footer` slot** is a documented Figma bug (already noted in the entry's `dangling:`
  field pre-existing my edit): the property exists but is bound to no layer. Kept `code: none` with
  a note pointing at the real slot (`DialogFooter.actions`, a separate export).
- **Dialog's `showFooter`/`showBody`** are genuine Figma-only demo toggles (no code prop drives
  them at all — in code the footer/body are just whatever children are composed) — this is the one
  case that cleanly fits the rule's literal "a Figma drawing aid" definition for `none`.
- **Popover's `state` (open/closed) → `code: "open / defaultOpen"`**, not `live-state`. Unlike
  Input's focus/hover pseudo-states, Popover's open/closed genuinely is driven by a settable
  `open`/`defaultOpen` prop on the same export, so I used the prop-name-list form (mirrors Input's
  `value / defaultValue` merged row) rather than `live-state`.
- **Command's `value`/`defaultValue`** conceptually correspond to `CommandItem.state=selected`, but
  since CommandItem is a separate export (out of scope), classified `figma: none` on the code side
  with a note rather than inventing a cross-reference that check.py has no case for from a
  code.props row (`C4-code-ref` only supports code.props → figma.api name references, not the
  reverse dotted form).
- Removed three now-legacy `figma.axis` fields (Command, Popover empty `{}`, Dialog empty `{}`,
  Tooltip `side` axis) per `C1-legacy-removed` — left all other structural sub-blocks (`item:`,
  `trigger`/`root:`, `composition:`, `footer:`, etc.) untouched; those aren't in scope for this pass.

## Correction round (commit `a78c3ad`)

Team lead sent three follow-up messages after the first pass: (1) confirmed the main-only model is
intentional, (2) corrected `side`/`align` to the external-prop form (`code: PopoverContent.side` —
I'd already built this in the first pass, so no change needed there), (3) corrected the `none`
classification for slots that are genuinely the JSX children region — `check.py` grew a `children`
special case (`C4-code-ref` skips it, no `code.props` row required) exactly for this. Applied:

- **Slots/text controls composed via JSX children → `code: children`, not `none`.** Reclassified:
  Tooltip `content`, Popover `trigger`, Dialog `footer`/`title (children)`/`description (children)`/`body`,
  Command `list`. This **supersedes** the "code: none for real-but-untracked capabilities" judgement
  call from the first pass — `children` is now a first-class case (rule brief §"code semantics"),
  not something I need to force into `none` for lack of a JSDoc'd prop.
- **Popover's `state` (open/closed) → `live-state`, not `code: "open / defaultOpen"`.** This
  **supersedes** that judgement call from the first pass. Team lead's reasoning (confirmed against
  the Input precedent): a visual variant that's driven by settable props but represents which
  member/layout renders is still a *live state* (like Input's `filled`, which is live-state
  triggered by "value / defaultValue set" even though value/defaultValue are real props) — not a
  direct prop-name mapping. `code.props`' `open`/`defaultOpen` rows still point `figma: "state=open"`
  forward at the same api row (that direction is unaffected — Input's `value`/`defaultValue` rows
  point at `figma: "value + filled"` the same way).
- Dialog's `footer` slot: kept the `dangling`-property note, now paired with `code: children` (the
  property is unbound in Figma, but the real-code mechanism — composing a `DialogFooter` child — is
  the children region, so `children` is more informative than `none` per the team lead's explicit
  call-out).
- `showFooter`/`showBody` (Dialog) stay `code: none` — confirmed by team lead's first message,
  unaffected by the children correction (they're pure Figma demo toggles with no code counterpart
  at all, not a children region).
- Figma row `figmaOnly` chips flipped accordingly: off for all the now-`children` rows (was on),
  on for Popover's `state` row (was off, since it moved from mapped to live-state).

Re-ran `check.py --only Tooltip,Popover,Dialog,Command` after each fix batch → **`ALL PASS`**.
Re-screenshotted all four `meta well` `api` frames after the correction — no clipping/overlap,
`figma-only`/`code-only` chips read correctly against the new classification.

## Open questions

- The main-only model leaves genuinely useful composite-member facts (e.g. CommandItem's
  `state=selected/disabled/checked`, CommandSeparator's `label`, TooltipContent's own `sideOffset`/
  `align`/etc. beyond `side`) formally undocumented in `figma.api` for good — worth a follow-up
  decision on whether per-member sub-entries should exist eventually, or whether the anatomy prose
  fields (`item:`, `separator:`, etc., already present) are considered sufficient.
- The `code: "<Export>.<prop>"` external-reference convention (Tooltip.side, Popover.side/align,
  Dialog.showCloseButton) is now explicitly documented in the brief's "code semantics" section as
  of the correction round — no longer an open question, confirmed by team lead's second message.

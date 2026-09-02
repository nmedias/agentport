# Field — Figma Revision (2026-06-12)

Figma-side design-feedback revision of the already-built `.Field` component (Agentport DS), per a
6-item user punch-list. **Figma-only** (no code touched, no git-write). Branch `feat/field-figma-revision`.
Plugin MCP only. Page "Components" (`3126:2`), fileKey `nQSNLASjuLvgTh3we8Dp4s`.

## Connection
Plugin MCP authenticated (Manu / <redacted>); file open; live read of `.Field` 3716:1020
succeeded → proceeded. (Figma-console Desktop Bridge was disconnected but is not required for this task.)

## Live state vs. catalog (verified before editing)
The set was **further along than the catalog snapshot**: it already carried the two boolean props
(`Show description#3692:15`, `Show error#3692:20`) and a `FieldContent` FRAME in the horizontal members
(wrapping control+description+error). Two issues surfaced on inspection: the booleans were bound `visible`
**directly on the SLOT nodes** (finding #8 anti-pattern, fragile), and FieldDescription text was **solid
black / unbound** (not muted).

## Per punch-list item

### 1a — FieldDescription font/colour  ✅ FIXED (was a real bug)
The description text style was correct (Body / Hanken Grotesk Regular), but the **fill was solid black
`{0,0,0}` with no bound variable** in every member — not muted. Bound all 4 description text fills to
`muted-foreground` (`VariableID:3037:13`). FieldError stays `destructive ⚠` (`VariableID:3038:3`).
Text nodes fixed: `3712:1023`, `3713:1024`, `3714:1026`, `3715:1027`.

### 1b — FieldContent grouping (horizontal)  ✅ APPLIED (was first mis-judged a fork, then corrected)
**Initial mistake (corrected):** I first kept FieldContent wrapping control+description+error with the
label leading, and logged 1b as a fork. That was wrong. The user's annotation IS the shadcn-canonical
structure. Re-read of the **Responsive story** (field.stories.tsx:111–117) + the `horizontal` variant
(field.tsx:79 `flex-row items-center has-[>[data-slot=field-content]]:items-start`) shows the canonical
composition:
```
<Field flex-row items-start>
  <FieldContent flex-col>   ← LEFT column: label + description (+ error)
    <FieldLabel/> <FieldDescription/> [<FieldError/>]
  </FieldContent>
  <control/>                ← SIBLING beside the column, RIGHT
</Field>
```
FieldContent (field.tsx:105) is just a `flex flex-col` column; the control is a sibling, NOT inside it.

**Applied to both horizontal members:**
- `horiz/false` `3714:1018` — moved `label` SLOT into FieldContent (top); FieldContent column now =
  label + description-wrapper; moved `control` SLOT out as a sibling beside FieldContent.
- `horiz/true` `3715:1019` — same; FieldContent column = label + description-wrapper + error-wrapper
  (error sits **inside the column, below description** — shadcn-faithful placement under label+desc).
- Field row: `flex-row`, counterAxis MIN = items-start. FieldContent `FILL`/flex-1; control `FIXED 160`
  beside it. **Members set to HUG height** so the visibility booleans reflow the column (without this the
  FIXED member height swallowed the toggle — caught + fixed during live-drive: 64→41→32px now works).
- FieldContent FRAMEs: `3714:1021` (horiz/false), `3715:1022` (horiz/true).
- Vertical members untouched (label→control→description→[error] stacked is correct there).

**Error placement note:** error slot lives **inside FieldContent, below description** — it aligns under
the label+description column (the most shadcn-faithful spot: FieldError is a column sibling of
FieldDescription, and in horizontal mode the column is FieldContent).

### 2 — FieldSet + FieldGroup as Figma components  ✅ BUILT (reverses code-only for these two)
New section **"Field Set & Group"** `3738:1026`. Both surface-less (finding #24: model structural grouping,
bind spacing + typo only, no fill/stroke).
- **`.FieldSet`** `3739:1026` — VERTICAL auto-layout, gap-xl (`space-xl`/16, bound), `<fieldset>` model.
  `legend` SLOT `legend#3741:0` with a Title text default ("Address", `text-format-title` 18/600 by role —
  finding #28). Nests 2 real `.Field` instances (`3741:1028`, `3741:1038`). Build note: an initial
  redundant TEXT legend prop (`legend2#3741:1`) was created alongside the slot and **deleted** → single
  clean `legend` SLOT.
- **`.FieldGroup`** `3742:1044` — VERTICAL auto-layout, gap-xl, w-full. Nests Field `3742:1045` →
  `.Separator` `3742:1055` → Field `3742:1056` (all FILL width).
Both nest LOCAL components via `getNodeByIdAsync('<variantNodeId>') + .createInstance()` (finding #26),
not `importComponentByKeyAsync`.

### 3 — `.Label` set + nest into FieldLabel  ✅ BUILT
New section **"Label"** `3733:1022`. **`.Label` set** `3735:1024`, axis `state` [default, disabled]:
- `state=default` `3734:1022` — HORIZONTAL auto-layout, gap-md (bound), text-default bound to the **Label**
  text style + **foreground** fill; `text#3735:0` TEXT prop. Mirrors `label.tsx` (text-format-label, gap-md).
- `state=disabled` `3735:1022` — clone at opacity 0.5 (the one real Label state; code drives it via
  group/peer-disabled, no CVA — modelled as a Figma state axis so it's a true *set*, not a lone component).
Replaced the **bare-TEXT label-slot default in all 4 `.Field` members** with nested real `.Label`
instances: `3737:1022` (Username) · `3737:1024` (Email) · `3737:1026` (Subscribe) · `3737:1028` (Email).
**Design fork:** the `state` axis is a Figma convenience — do NOT round-trip it into a code CVA on sync.

### 4 — FieldSeparator = reuse `.Separator`  ✅ DONE (inside task 2)
No dedicated FieldSeparator component. A real `.Separator` instance (`3742:1055`, orientation=horizontal,
main `3676:1016`) is nested only inside `.FieldGroup` where a divider is needed. The `.Field` row itself
has no separator — correct.

### 5 — Boolean props to hide Description & Error slots  ✅ FIXED to the safe pattern
The props already existed but were bound `visible` **directly on the SLOT** (anti-pattern, finding #8).
Converted all 5 bindings to the **wrapper-FRAME pattern**: each optional slot now sits inside a hugging
wrapper FRAME that carries the boolean's `visible`; the SLOT keeps only `slotContentId`. Wrappers:
description — `3729:1039` (vert/false), `3730:1020` (vert/true), `3731:1022` (horiz/false),
`3731:1023` (horiz/true); error — `3730:1021` (vert/true), `3731:1024` (horiz/true).
Booleans: `Show description#3692:15`, `Show error#3692:20` (both default true). **Verified live**
(vert/true instance): all-on 116px → description-off 87px → both-off 58px (no residual height, finding #9)
→ back-on 116px. The slots stayed SLOT type throughout (no silent SLOT→FRAME degradation).
After the 1b regroup, re-verified on a horiz/true instance: all-on 64px → description-off 41px →
both-off 32px → back-on 64px (the regroup initially left the horiz members FIXED-height which swallowed
the toggle; setting members + FieldContent to HUG restored the reflow).

### 6 — responsive via auto-layout WRAP  ❌ VERDICT: NOT a faithful proxy — keep responsive code-only
Built a throwaway wrap probe (label + 200px control in a HORIZONTAL `layoutWrap=WRAP` frame) at 180px and
420px width. It superficially mimics the swap (narrow → stacked, children y=12/38; wide → row, both y=12),
but the mechanism diverges on four load-bearing points:
1. **Overflow- vs breakpoint-driven.** Container-query `@md` swaps at a fixed container width (≈448px)
   regardless of content; wrap swaps on whether the children *fit* — so the breakpoint shifts per field
   with label length / control width. Non-deterministic vs. the deterministic CSS.
2. **Cannot flip child sizing.** Responsive does `@md:*:w-auto` (full-width control when stacked →
   intrinsic when inline). Wrap holds one sizing mode; it can't re-size the control across the swap.
3. **No alignment/grouping state change.** Responsive adds `@md:items-center` +
   `@md:has-[field-content]:items-start`; wrap has no equivalent discrete alignment swap.
4. **Continuum, not a discrete variant.** Wrap yields a single instance whose look silently depends on the
   width you resize it to — you still couldn't expose a clean `responsive` variant value.
→ Did **not** add a `responsive` orientation value. `responsive` stays code-only (container-query @md).
Probe nodes deleted.

## /figma-verify  →  CLEAN (all 4 sets)
Tree-based checks on `.Field` 3716:1020, `.Label` 3735:1024, `.FieldSet` 3739:1026, `.FieldGroup` 3742:1044
(`.Field` re-verified AFTER the 1b regroup):
- text-as-icon: 0 (all text nodes real captions/placeholders)
- clipped child: 0 · sibling overlap: 0 (auto-layout throughout) · padding asymmetry: 0 · edge-flush: 0
- Only non-auto-layout container = the nested `.Separator` instance (layoutMode NONE is inherent to a 1px
  line — expected, not a defect).
Live-drive confirmed: `.FieldSet`/`.FieldGroup` instantiate cleanly; `.Label` state=disabled → opacity 0.5
+ text prop sets caption; regrouped horiz/true reflows on the visibility booleans. Test instances removed.

## New / changed node IDs (summary)
| node | id |
|---|---|
| Label section | 3733:1022 |
| `.Label` set | 3735:1024 (default 3734:1022 · disabled 3735:1022; text#3735:0) |
| Label instances in .Field | 3737:1022 / 3737:1024 / 3737:1026 / 3737:1028 |
| Field Set & Group section | 3738:1026 |
| `.FieldSet` | 3739:1026 (legend SLOT legend#3741:0; nests 3741:1028, 3741:1038) |
| `.FieldGroup` | 3742:1044 (nests Field 3742:1045, .Separator 3742:1055, Field 3742:1056) |
| description wrappers (.Field) | 3729:1039 · 3730:1020 · 3731:1022 · 3731:1023 |
| error wrappers (.Field) | 3730:1021 · 3731:1024 |
| description text re-bound muted | 3712:1023 · 3713:1024 · 3714:1026 · 3715:1027 |

Bool props (existing, re-wired): `Show description#3692:15`, `Show error#3692:20`.
1b regroup also touched: label slots `3714:1019`/`3715:1020` (moved into FieldContent), control slots
`3714:1022`/`3715:1023` (moved out as siblings), FieldContent FRAMEs `3714:1021`/`3715:1022` + members
`3714:1018`/`3715:1019` (→ HUG height).

## Design forks / open items
1. **1b RESOLVED — applied, not a fork.** Horizontal members regrouped to the shadcn-canonical structure
   (FieldContent column = label+description+[error], control as a sibling). My initial "fork" judgment was
   wrong; corrected per the user's annotation (which matches field.stories.tsx Responsive + field.tsx:79).
2. **`.Label` state axis** — a Figma-side convenience; the code Label has no `state`/CVA. On a future
   Figma→code sync, do NOT introduce a label-state CVA from it.
3. **`destructive ⚠` placeholder** unchanged — FieldError still binds the stock placeholder token (not
   finalized), same caveat as the original port.
4. **FieldSet/FieldGroup now have Figma sets** but the code still treats them as plain grouping (catalog
   `code_only_parts` trimmed to FieldLegend/FieldTitle/responsive). No code change made (Figma-only task).
5. **Repo state:** catalog (`components-reference.md`) + this note edited, left uncommitted on
   `feat/field-figma-revision` per instructions.

# Checkbox — Figma Usage-Examples alignment to the Field-composed stories

Date: 2026-06-12 · Scope: **Figma only** (Plugin MCP, file `FIGMA_FILE_KEY`,
page `3126:2` "Shadcn Components"). Read-only on code/catalog/other components.

## Goal

Rebuild the "Usage Examples" group (`3822:2`) in the **Checkbox** Section (`3791:1184`)
so it mirrors the new **Field-composed** Storybook stories
(`libs/ui/src/components/ui/checkbox/checkbox.stories.tsx`): Basic, Description, Group,
Disabled, Invalid — keeping AllStates as the state gallery.

## What changed

- **Removed** the three old hand-rolled blocks: WithLabel `3823:2`, WithDescription
  `3825:2`, Disabled `3825:12`.
- **Kept** AllStates `3826:2` (state gallery: default/checked/focus/disabled/invalid/
  checked-invalid) unchanged.
- **Built** five new blocks in story order; final group order:
  `title · Basic · Description · Group · Disabled · Invalid · AllStates`.
- **Resized** the Section `3791:1184` 746→**1035**px tall so the taller group is
  contained with a symmetric 80px bottom inset (matches the 80px top inset).

## Rebuilt blocks (node ids + composition)

All rows are **control-LEADING** (checkbox left, label right), composed **manually**
because the ported `.Field` horizontal orientation is **control-TRAILING** (see Finding).
Every piece is a **real instance** of the DS sets (`.Checkbox` `3795:1184`, `.Label`
`3735:1024`), driven via `setProperties` / bound text fills — no detach, no re-clothe.

| Block | id | Composition | Control-leading handling |
|---|---|---|---|
| **Basic** | `3880:1225` | row(H, gap-md 8, center): `.Checkbox`[checked `3792:1185`] + `.Label`[default] "Accept terms and conditions" | manual H-AL row, box left |
| **Description** | `3881:1229` | row(H, gap-md, top): `.Checkbox`[checked] + text-stack(V, gap-2xs 2): `.Label`[default] "Accept terms and conditions" + Body text "By clicking this checkbox, you agree to the terms and conditions." (bound **muted-foreground** `VariableID:3037:13`) | manual; description stacked under label in a FieldContent-style column |
| **Group** | `3885:1233` | fieldset(V, gap-md 8): header(V, gap-2xs): legend "Sidebar" (Label/eyebrow style) + desc "Select the items to show in the sidebar." (Body, muted-foreground); then field-group(V, **gap-lg 12**): 3 rows — `.Checkbox`[checked]+"Recents", `.Checkbox`[checked]+"Home", `.Checkbox`[default]+"Applications" | manual; legend/desc + checkbox list composed (no reusable `.FieldLegend`; `.FieldSet` body is a generic slot) |
| **Disabled** | `3880:1233` | row(H, gap-md, center): `.Checkbox`[disabled `3794:1185`] + `.Label`[**state=disabled** `3735:1022`] "Accept terms and conditions" | manual; both control and label use their disabled state |
| **Invalid** | `3881:1239` | row(H, gap-md, top): `.Checkbox`[invalid `3794:1186`] + text-stack(V, gap-2xs): `.Label`[default] "Accept terms and conditions" + Body error "You must accept the terms and conditions to continue." (bound **destructive ⚠** `VariableID:3038:3`) | manual; error stacked under label |
| **AllStates** | `3826:2` | (kept) 6 `.Checkbox` instances, one per state | unchanged |

Block frame convention (mirrors the surviving siblings): each block = VERTICAL AL,
`itemSpacing:8`, a caption text (Hanken Grotesk Regular 13, literal muted fill
`rgb(0.39,0.42,0.48)` — matches the pre-existing captions). Group `3822:2` stays
VERTICAL AL `itemSpacing:32`, HUG.

## Component reuse — reused vs composed manually, and why

- **`.Checkbox` set** `3795:1184` — **reused** (real instances, state driven by the
  `state` variant). Every box in every row + AllStates.
- **`.Label` set** `3735:1024` — **reused** (real instances; text via the
  `label (children)#3735:0` TEXT prop; disabled via `state=disabled`).
- **`.Field` row** (`3714:1018` horizontal) — **NOT reused.** It is control-TRAILING
  (label/FieldContent left, control right — built for Input). A checkbox row is
  control-leading, so nesting it would put the box on the wrong side. Rows composed
  manually instead (H-AL, gap-md, box-then-label).
- **`.FieldSet` `3739:1026` / `.FieldGroup` `3742:1044`** — **NOT reused.** Both are
  single COMPONENTs exposing only **generic slots** (`legend`, `Slot`/body); there is
  **no standalone `.FieldLegend`/`.FieldLabel`** component to reuse for the Group
  legend/eyebrow. Filling those body/legend slots in an instance hits the locked-
  `layoutMode` + clear-defaults + re-resolve friction (figma-build §Slots) for no
  fidelity gain over composing the stack directly. So the Group was composed manually
  with DS spacing (legend = Label text style, desc = Body+muted, list gap = gap-lg),
  which reproduces the rendered FieldSet exactly. Real `.Checkbox`/`.Label` instances
  still used inside the rows.

## `.Field` control-leading finding (DS)

The ported `.Field` only models **control-trailing** horizontal rows (for Input). The
**code** (`field.tsx`) DOES support control-leading rows for selection controls
(checkbox/radio/switch compose `Field orientation="horizontal"` with the control first +
an `[role=checkbox]:mt-px` nudge) — so the Figma component is missing a case the code
relies on. **Recommendation: a control-leading horizontal case for `.Field` is
warranted** (e.g. an `orientation=horizontal-leading` or a `control-position:
leading|trailing` axis), and ideally exposing `.FieldLegend`/`.FieldLabel` as reusable
text components — otherwise every selection-control Usage-Examples group (Checkbox here;
Radio + Switch pending) must hand-compose rows, duplicating layout logic. For the
orchestrator/user to decide. (Logged in `skill-feedback.md §8`.)

## Spacing / token bindings used

- Row gap **gap-md (8)** = the code `Field` horizontal row gap (`flex gap-md`).
- Label+secondary stack **gap-2xs (2)** = code `FieldContent` (`flex-col gap-2xs`).
- Group checkbox list **gap-lg (12)** = code `data-[slot=checkbox-group]:gap-lg`.
- Description text → **muted-foreground** `VariableID:3037:13` (Body style
  `S:7e1bf8f13…`), bound by id (`setBoundVariableForPaint`, reassigned).
- Error text → **destructive ⚠** `VariableID:3038:3` (Body style), bound by id —
  ⚠ placeholder colour (stock hex `#e7000b`), wired but undesigned.
- Legend "Sidebar" → **Label** text style `S:4e034695…` (Hanken Grotesk Medium 14),
  matching `FieldLegend variant="label"` = `text-format-label`.

## Verify + screenshot

- `/figma-verify 3822:2` → **CLEAN** (0 flags, 0 hints): no text-as-icon, no clipped
  child, no sibling overlap, padding symmetric, all checkbox glyphs are vectors.
- `/figma-verify 3791:1184` (whole Section) → **CLEAN** (0 flags, 0 hints) after the
  Section resize.
- Final `get_screenshot` of the Section confirms all 7 blocks render inside the white
  card, in story order, no clipping.

## Boundaries respected

Only the Checkbox Section `3791:1184` was touched. No code, no catalog, no other
component, no Switch/Radio, no git, no detach.

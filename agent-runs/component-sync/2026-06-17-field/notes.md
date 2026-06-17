# component-sync — Field family — 2026-06-17

Figma→code reconciliation of the **field family** (`field.tsx`) after the DS colour-semantics
rework (the `-fill`/`-ink`/`-border` system). Source-of-truth = live Figma bindings, read-only;
crosswalk = `tokens-reference.md` §6.

Scope = ALL field-family parts in one file: Field, FieldLabel, FieldDescription, FieldError,
FieldGroup, FieldSet, FieldLegend, FieldTitle, FieldContent, FieldSeparator.

Figma (read-only): fileKey `FIGMA_FILE_KEY`, page "Shadcn Components" `3126:2`.
- `.Field` set `3716:1020`
- `.FieldLegend` set `3909:1246`
- `.FieldSet` component `3739:1026`
- `.FieldGroup` component `3742:1044`

## Live Figma bindings (inner nodes, bound variable NAMES)

Traversed every member; captured text fills, strokes, frame fills, spacing vars.

| Sub-part (Figma inner node) | bound variable (LIVE) | hex |
|---|---|---|
| Label text `{Label}` | `shadcn Default/ink` | #0d1016 |
| Field Description text | `shadcn Default/muted-ink` | #656971 |
| Error Message text | `shadcn Default/destructive` | #b01207 |
| FieldLegend variant=legend (Title style) | `shadcn Default/ink` | #0d1016 |
| FieldLegend variant=label (Label style) | `shadcn Default/ink` | #0d1016 |
| FieldSeparator (`.Separator` instance, FieldGroup) fill | `Border/border` | #e4e6eb |
| Input control fill | `Input/input-fill` | #f9fcfd |
| Input control stroke (valid) | `Input/input-border` | #7f848b |
| Input control stroke (invalid) | `shadcn Default/destructive` | #b01207 |
| Input placeholder text | `Input/input-ink-placeholder` | #656971 |

Spacing (bound, unchanged): Field row `Space/space-md` (8) · FieldContent `Space/space-2xs` (2) ·
FieldSet/FieldGroup `Space/space-xl` (16). Input padding `space-md`/`space-xs`, radius `corner-lg`.

> Input internals (fill/stroke/placeholder) belong to the `.Input` instance, NOT field.tsx —
> they are the Input component's own bindings (synced separately). Listed here only as traversal
> context; the field-family code carries no input colours.

## Diff vs current code (§6 crosswalk)

Only colour-utility renames — the rework is purely the `-foreground`→`-ink` / `accent`→`accent-fill`
family. Spacing/typography/radius already token-faithful (gap-md/-2xs/-xl, text-format-*, corner-lg).

| Code sub-part | utility old → new | Figma binding confirms |
|---|---|---|
| FieldDescription text | `text-muted-foreground` → `text-muted-ink` | muted-ink ✓ |
| FieldSeparator content span text | `text-muted-foreground` → `text-muted-ink` | muted-ink (separator content = muted role) ✓ |
| FieldSeparator content span fill | `bg-background` → `bg-surface` | surface (was: background) ✓ |
| FieldLabel checked card tint | `has-data-checked:bg-accent` → `has-data-checked:bg-accent-fill` | accent-fill (selection tint) ✓ |
| FieldTitle checked title | `group-has-data-checked/field-label:text-accent-foreground` → `text-accent-ink` | accent-ink ✓ |

**KEPT (name unchanged, only value moved):**
- FieldError `text-destructive` — `destructive` is a kept name; Figma Error text = `destructive`. ✓
  (Still a ⚠ stock PLACEHOLDER per the original port — bound, not finalized.)
- FieldLabel `has-data-checked:border-primary` — `primary` is now the accent token (text/border/ring,
  no fill). Stroke role kept; Figma choice-card stroke = primary (signal/600). ✓
- FieldDescription `[&>a:hover]:text-primary` — kept; primary as accent ink. ✓

FieldLegend, FieldSet, FieldGroup, FieldContent carry NO colour utilities — pure layout/typography.
Their text colour inherits `ink` via the base layer; Figma confirms legend/label fills = `ink`.
No delta on those parts beyond what's covered above.

## Applied (then stood down)

Only ONE edit landed in field.tsx before the team-lead took over central reconciliation (choice-card
edits the same file → write race): FieldLabel `bg-accent` → `bg-accent-fill` + the adjacent comment
re-worded (accent → accent-fill / accent-ink; cyan/50 → deep/50, cyan/500 → signal/600).
The remaining 4 renames (FieldDescription ×2, FieldSeparator ×2, FieldTitle) are handed to the lead.

## Deviations / notes

- No structural, spacing, typography, or radius changes — colour renames only.
- `controlPosition` (Figma) remains a design-fork, no code prop (per the original port note); not
  touched.
- responsive orientation stays code-only (container query; not in Figma).
- Stories: no colour utilities present (only placeholder text in Inputs) → no story changes needed.
- Spec asserts `text-destructive` (field.spec.tsx:44) — KEPT name, assertion still valid, no change.

figma-verify: not re-run (read-only sync, no Figma writes).

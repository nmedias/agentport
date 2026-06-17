# component-sync — InputGroup (2026-06-17)

Figma → code colour sync after the `-fill`/`-ink`/`-border` token rework. Read-only on Figma
(Plugin MCP). Sibling of the same-day button / kbd / badge / breadcrumb / separator syncs.

## Scope

InputGroup's OWN surfaces/text/addon only. The nested `.InputGroup/Button` (3545:694) is a ghost
`.Button` instance — its colours come from the already-synced Button; NOT re-synced here. Controls
(Input/Textarea) carry their own `data-slot=input-group-control` borderless overrides and inherit
the Input/Textarea components' own colour bindings — not part of this delta.

## Figma nodes (file `FIGMA_FILE_KEY`, page "Shadcn Components" 3126:2)

- Section "Input Group" `3519:590`
- Composition `.InputGroup` `3525:622` — COMPONENT_SET, 10 members
  (state[default,focus,disabled,invalid,focus-invalid] × layout[horizontal,vertical])
- Addon `.InputGroup/Addon` `3520:606` — 4 members (align[inline-start,inline-end,block-start,block-end])
- Text `.InputGroup/Text` `3522:594`

## Live bound-variable names read (S2, read-only)

Resolved via `figma.variables.getVariableByIdAsync` (NOTE: `figma.getVariableByIdAsync` throws —
must go through the `figma.variables` namespace).

Group surface/border (composition members):
- surface fill (all states)      → `Input/input-fill`           → `bg-input-fill`
- border default + disabled      → `Input/input-border`         → `border-input-border`
- border focus                   → `shadcn Default/ring`        → `border-ring`
- border invalid + focus-invalid → `shadcn Default/destructive` → `border-destructive`
- radius (4 corners)             → `Corner/corner-lg`           → `corner-lg`
- focus glow effect              → DROP_SHADOW spread 3, RAW `#4a5562 @ 50%` (unbound) → `ring-ring/50 ring-[3px]`
- focus-invalid glow effect      → DROP_SHADOW spread 3, RAW `#e7000b @ 20%` (unbound) → `ring-destructive/20 ring-[3px]`
- invalid-only member            → border swap, NO ring effect (matches code: ring only via has-aria-invalid)

Addon (`.InputGroup/Addon`, inline-start + block-start):
- icon vector fill               → `shadcn Default/muted-ink`   → `text-muted-ink`
- itemSpacing                    → `Space/space-md`             → `gap-md`
- py                             → `Space/space-sm`             → `py-sm`
- block-start px/pt              → `Space/space-md`             → `px-md`/`pt-md`

Text (`.InputGroup/Text`):
- text fill                      → `shadcn Default/muted-ink`   → `text-muted-ink`
- text style                     → `Body`                       → `text-format-body`

Input control (already its own component, not edited here): placeholder text → `Input/input-ink-placeholder`,
value text → `shadcn Default/ink`, padding → `Space/space-sm`. Addon text content in examples ($/USD) =
nested `.InputGroup/Text` instances → style `Body` + `muted-ink` (confirms InputGroupText = body/muted-ink).

## Diff (S3) — colour-only delta

Three OLD utilities still in code → re-clothed to the live `-fill`/`-ink`/`-border` names:

| line | old                  | new                  | live Figma binding          |
|------|----------------------|----------------------|-----------------------------|
| 37   | `bg-input-background`| `bg-input-fill`      | Input/input-fill            |
| 37   | `border-input`       | `border-input-border`| Input/input-border          |
| 50   | `text-muted-foreground` (addon CVA) | `text-muted-ink` | shadcn Default/muted-ink |
| 147  | `text-muted-foreground` (InputGroupText) | `text-muted-ink` | shadcn Default/muted-ink |

KEPT (verified live, names unchanged in the rework, only values moved):
`corner-lg`, `border-ring`, `ring-ring/50`, `border-destructive`, `ring-destructive/20`, `ring-[3px]`,
`text-format-label` (addon), `text-format-body` (Text). Typography/geometry/spacing untouched.

Header comment updated: live token names spelled out; the prior "destructive is a ⚠ placeholder" line
removed — `destructive` now binds a real DS semantic (error/600) per the rework.

## Apply (S4)

Edited `input-group.tsx` only (3 class strings + header comment). Stories + spec need NO colour edits
(they carry no colour-token classes — only `border-b`/`border-t`/`ml-auto`/`text-format-data`, all KEPT
names, plus typography/structure). No opportunistic rewrites.

## Not done (per task)

Gate not run; `components-reference.md` not edited (returned to lead); no Figma writes.

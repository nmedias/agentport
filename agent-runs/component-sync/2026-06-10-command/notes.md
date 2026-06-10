# Component Sync — Command (Figma → Code) · 2026-06-10

`/component-sync command`. Figma is authoritative; read-only on Figma. Synced the designer's style
adjustments back into `libs/ui/src/components/ui/command/command.tsx`.

## S2 — read scope
Dumped live bindings of every Command sub-component: `.Command/Item` set (4 members) `3559:2`,
`.Command/Input` `3561:2` (+ nested `.InputGroup` `3561:3`), `.Command/Separator` `3564:2`,
`.Command/Empty` `3564:3`, `.Command/Group` `3565:2`, `.Command` composition `3566:2`.

## S3/S4 — applied delta (1)

| node | property | Figma now | code before → after | why |
|---|---|---|---|---|
| `.Command/Input` cmdk input | text format | text-style **Label** (Hanken Grotesk Medium 14) | `text-input` (mono 18) → **`text-label`** | designer changed the search field from the mono command-format to the standard DS field text |

`placeholder:text-input-placeholder` (placeholder *colour*) unchanged. Spec typo-survival assertion
updated `text-input`→`text-label` (note: `placeholder:text-input-placeholder` contains the substring
"text-input", so the old assertion was a false-positive — now checks `text-label` explicitly).

## Observations — NO code change (deviations / Figma-only)

| node | observation | verdict |
|---|---|---|
| `.Command/Group` heading | text-style link **detached** (style=null) but raw values = **Eyebrow exactly** (Geist Mono Medium, 9px, 0.5px tracking, UPPER) | no visual delta → code stays `text-eyebrow uppercase`. The detachment is a Figma-only cosmetic; the format is unchanged. |
| `.Command/Input` → `.InputGroup` instance | container padding now reads `[0,0,0,0]` (was spaceMd in the build) | **Figma-only.** The code's CommandInput uses the real `InputGroup` + `InputGroupAddon`, whose own `pl-md`/`pl-sm` rules govern spacing — the Figma instance's manual padding was my Addon-bypass approximation and doesn't map to a code class. Field still renders inset correctly. |

Everything else (item states incl. accent-cyan selection, radius-sm/px-md/py-sm/gap-md, disabled opacity,
icon foreground/accent-foreground, separator border, empty text-body muted, palette overlay+border+
elevation, shortcut text-kbd) matches the build 1:1 — no delta.

## S5 — gate
`nx typecheck` ✓ · `nx test` **32/32** ✓ (typo-survival now asserts text-label + text-body) · `nx lint` 0 errors.
Preview: http://localhost:6006/?path=/story/ui-command--default · http://localhost:6006/?path=/story/ui-command--empty

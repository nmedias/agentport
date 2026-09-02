# Component Sync — Separator (2026-08-31)

**Purpose:** smoke test of the pipeline against the new Figma file `nQSNLASjuLvgTh3we8Dp4s`
("Agentport DS", a duplicate of the previous file — node IDs preserved). First `/component-sync` run
with the new `config.json` `fileKey`; expected and delivered: no delta.

## S1 — Locate

- Figma: page `Components` `3126:2` → set `Separator` `3676:1018` (resolved by id from the catalog,
  name confirmed live). Members `orientation=horizontal` `3676:1016`, `orientation=vertical` `3676:1017`.
- Code: `libs/ui/src/components/ui/separator/separator.tsx`.

## S2 — Live values (read-only, `snippets/read-set-values.js`)

| Member | Fill (bound var) | Size / sizing | Other |
|---|---|---|---|
| horizontal | SOLID `Border/border` #e4e6eb, opacity 1 | 288×1 · H `FILL`, V `FIXED`, minW 120 | no stroke/radius/padding/effects, no text/slot |
| vertical | SOLID `Border/border` #e4e6eb, opacity 1 | 1×24 · H `FIXED`, V `FILL`, minH 24 | no stroke/radius/padding/effects, no text/slot |

Variable resolution by id worked on the new file (`getVariableByIdAsync` → `Border/border`).

## S3 — Diff

Code: `shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`.
`Border/border` ↔ `bg-border` (tokens-reference §6, token `border`, primitive ink/75 #e4e6eb) — 1:1.
Geometry numeric (h-px / w-px) + FILL axis = `w-full` / `self-stretch`. **No delta. No deviations.**

## S4 — Apply

Nothing to apply.

## S5 — Gate

`npm run check` (lint + jsdom specs + story tests in Chromium + typecheck) — see the commit on
`chore/figma-file-binding`; run as part of binding the new file.

## S6 — Notes

Delta-free, deviation-free. Catalog entry unchanged except the dated file-switch note in the Meta block.

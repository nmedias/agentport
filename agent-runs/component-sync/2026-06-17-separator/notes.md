# component-sync — Separator (2026-06-17)

Figma→code reconcile after the DS colour-token rework (`-fill`/`-ink`/`-border` system).
Scope: `separator` only. Figma is READ-ONLY.

## Live Figma structure (READ)

- fileKey `ejFKo4MNuvC9TSDKOCUvyq`, page "Shadcn Components" `3126:2`.
- Section LIVE name: **"Separator"** id `3675:1016` (unchanged).
- Set LIVE name: **"Separator"** id `3676:1018` — type COMPONENT_SET.
  (Brief noted the set might read `.Separator`; live name is plain "Separator". The
  components-reference still records `.Separator` — corrected in the returned entry.)
- Members (full matrix = 2, one content axis `orientation`):
  - `orientation=horizontal` `3676:1016` — COMPONENT, 288×1px, cornerRadius 0, strokeWeight 1 (no strokes).
  - `orientation=vertical`   `3676:1017` — COMPONENT, 1×24px,  cornerRadius 0, strokeWeight 1 (no strokes).
- Both members: **one SOLID fill** (FRAME_FILL on the line node), `color #e4e6eb`,
  `paint.boundVariables.color` → variable **`Border/border`**. No strokes, no inner nodes.

## Diff (bound var → DS utility, §6 authoritative)

| Member | Figma bound var | Role | DS utility (§6) | Code today | Delta |
|---|---|---|---|---|---|
| horizontal | `Border/border` | line fill | `border` → `bg-border` | `bg-border` | none |
| vertical   | `Border/border` | line fill | `border` → `bg-border` | `bg-border` | none |

`Border/border` is on the §6 **KEPT-names** list (`unchanged: … border-border/-emphasis/-strong`):
the rework changed the value (now ink/75 `#e4e6eb`) but **not** the name. The fill is a surface →
utility `bg-border`, which is exactly what `separator.tsx` already carries. Geometry (1px line via
`h-px`/`w-px`, no radius) also matches Figma (1px, cornerRadius 0) — geometry, not a token, so out of
scope for a colour sync anyway.

## Result: NO DELTA

No edit applied to `separator.tsx`. The single bound variable (`border`) maps 1:1 to the existing
`bg-border` utility; nothing to translate. Any change would be an opportunistic rewrite (out of scope).
Header comment in `separator.tsx` already documents `bg-border → the DS border token` — still accurate,
left as-is. `.stories.tsx` uses `text-muted-foreground` (an OLD utility, now `text-muted-ink`), but
that is story chrome for **other** components and outside this component-sync's surgical scope — flagged
below, not changed.

## Deviations / flags

- **Set name divergence (catalog):** components-reference recorded the set as `.Separator`; live Figma
  name is `Separator`. Corrected in the returned YAML (set + section both "Separator").
- **Stories use stale `text-muted-foreground`** (separator.stories.tsx lines 22, 58, 70 area) — old
  utility, renamed to `text-muted-ink` in the rework. NOT touched: it is demo scaffolding, not the
  Separator's own clothing, and the brief scopes edits to `separator.tsx` token-faithfully. Surfacing
  for a future stories sweep.

## Verification

- Read both members' fill `boundVariables.color` → `getVariableByIdAsync` → `.name` = `Border/border`
  (guarded property access; no strokes present). Color value `#e4e6eb` matches the `border` token
  (ink/75) in tokens-reference §1.
- No write to Figma. No code change. Gate NOT run here (parent runs one consolidated gate).

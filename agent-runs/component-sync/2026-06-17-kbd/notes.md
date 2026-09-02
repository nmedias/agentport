# component-sync — kbd (2026-06-17)

Figma→code reconciliation after the DS colour-token rework (`-fill`/`-ink`/`-border` system).
ONE component: `kbd`. Read-only on Figma; the delta was applied to code.

## Figma structure (live, read-only)

- fileKey `nQSNLASjuLvgTh3we8Dp4s`, page "Shadcn Components" `3126:2`.
- Section **"Kbd"** `3215:302` (LIVE name unchanged).
- Set **"Kbd"** `3217:308` (LIVE name "Kbd", NOT ".Kbd" — see deviation D3).
- Axes: `content` (text | icon) × `emphasis` (high | low) = 4 members.
  - `content=text, emphasis=high` `3217:302` (default)
  - `content=icon, emphasis=high` `3217:304`
  - `content=text, emphasis=low`  `3428:1385`
  - `content=icon, emphasis=low`  `3428:1387`
- Surface fill + radius/padding/gap sit on the **component root**; text fill on the inner
  `{Label}` TEXT node; icon fill on the inner `Vector` (inside `command-fill` frame inside the
  `icon` SLOT). No strokes, no opacity (all =1), no effects on any member.

### Bound variables per member

| Member                       | root fill (var)            | text/icon fill (var)       | radius            | padding L/R       | gap               |
|------------------------------|----------------------------|----------------------------|-------------------|-------------------|-------------------|
| content=text, emphasis=high  | `Inverse/inverse-fill`     | `Inverse/inverse-ink`      | `Corner/corner-sm`| `Space/space-xs`  | `Space/space-xs`  |
| content=icon, emphasis=high  | `Inverse/inverse-fill`     | `Inverse/inverse-ink`      | `Corner/corner-sm`| `Space/space-xs`  | `Space/space-xs`  |
| content=text, emphasis=low   | `shadcn Default/muted-fill`| `shadcn Default/muted-ink` | `Corner/corner-sm`| `Space/space-xs`  | `Space/space-xs`  |
| content=icon, emphasis=low   | `shadcn Default/muted-fill`| `shadcn Default/muted-ink` | `Corner/corner-sm`| `Space/space-xs`  | `Space/space-xs`  |

Text style on `{Label}` = "Kbd" (Geist Mono Medium) — unchanged, matches `text-format-kbd`.
Padding top/bottom = 0 (unbound) → height held by `h-5` geometry in code; no change.

## Delta applied (only what differed)

Var→utility mapping via tokens-reference §1/§6 (bound var is authoritative).

| Member / part            | property        | code before                  | code after / Figma binding                        |
|--------------------------|-----------------|------------------------------|---------------------------------------------------|
| emphasis=high · surface  | bg              | `bg-inverse`                 | `bg-inverse-fill`  ← `Inverse/inverse-fill`        |
| emphasis=high · text/icon| text            | `text-inverse-foreground`    | `text-inverse-ink` ← `Inverse/inverse-ink`         |
| emphasis=low · surface   | bg              | `bg-muted`                   | `bg-muted-fill`    ← `shadcn Default/muted-fill`    |
| emphasis=low · text/icon | text            | `text-muted-foreground`      | `text-muted-ink`   ← `shadcn Default/muted-ink`     |

Unchanged (already matched live bindings): `gap-xs`, `px-xs`, `corner-sm`, `text-format-kbd`,
all geometry (`h-5`/`w-fit`/`min-w-5`/`size-3`).

### Files touched
- `kbd.tsx` — both variant strings re-clothed; tooltip-context base overrides + header comment (see D1/D2).
- `kbd.stories.tsx` — `text-muted-foreground`→`text-muted-ink` (Combo separator),
  `text-foreground`→`text-ink` (InText), `.Kbd`→`Kbd` comment.
- `kbd.spec.tsx` — assertions `bg-inverse`→`bg-inverse-fill`, `bg-muted`→`bg-muted-fill`.

## DEVIATIONS

| # | Where | What | Resolution |
|---|-------|------|------------|
| D1 | `kbd.tsx` base string | `in-data-[slot=tooltip-content]:bg-background/20` + `:text-background` — stock-shadcn tooltip-context override. **No Figma binding** (no tooltip-content member in the set). | Code-only carryover. Re-clothed by §6 rename (`bg-background`→`bg-surface`, `text-background`→`text-ink`) so the dead stock names don't linger. Not a Figma-sourced value — flagged. |
| D2 | header comment | Documented the old clothing (`inverse-foreground`, `.Kbd`). | Updated to the new bindings + noted tooltip override is code-only. |
| D3 | set name | components-reference recorded the set as `.Kbd`; LIVE Figma name is `Kbd` (no dot). Section also `Kbd`. | Corrected in the returned components-reference YAML (set name → `Kbd`). |

`command-fill` frame (icon members) is an invisible 12×12 white helper frame (`visible:false`) — not
a rendered surface, no binding consequence. Ignored.

## Verification
- Bound-var names read directly via `getVariableByIdAsync().name` (no role-guessing).
- Every changed class string traces 1:1 to a live bound var via §6 crosswalk.
- Gate NOT run here (parent runs one consolidated `npm run check`).

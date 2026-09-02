# Token analysis — Category Effects (shadow / glow)

Screen: reference screen "Quiet", node `1099:9710` (Figma "Agentport DS", fileKey
`nQSNLASjuLvgTh3we8Dp4s`). Sibling of `token-analysis-color/-radius/-spacing/-typography.md`.
Goal: no more raw effect values — shadows/glow hang off **effect styles** whose parts
are tokenized via variables.

> **Status:** Decided (**A-lean · B-token · glow/elevation**), built + applied to the screen.
> Category complete.
>
> **Update 2026-06-11 — first code consumer for glow:** the Command palette variant (libs/ui)
> uses `shadow-glow` on the prompt caret bar — the first `--ap-sys-shadow-glow` consumer in code
> (Figma counterpart: effect style `Glow` on `palette-caret` in the `.Command/Input` palette member 3638:8).
> `shadow-elevation` had already been in use on the Command root since the initial Command port.

## Findings (screen scan, read-only)

Only **2 effects** (both drop shadows; no blurs; no existing effect styles):

| Effect | Values | on (nodes) | Meaning |
|---|---|---|---|
| **Cyan glow** | `0/0 · blur 4 · spread 0 · rgba(0,159,227,.5)` ×4 | palette-caret ×2, cmd-blau-tick, blau-tick | Glow on the cyan marks |
| **Palette elevation** | `0/14 · blur 36 · spread −6 · rgba(26,34,48,.18)` ×2 | palette-panel ×2 | Drop shadow of the command palette |

**Color reference:** glow = `cyan/500` @ 50% · elevation = `neutral/900` @ 18%.

## Architecture decisions

- **Effects are not a variable type** (a shadow is always a composite) → the application level is
  necessarily an **effect style** (analogous to a text style). Variables carry only the *parts*.
- **A-lean** — `reference-effect` (the parts) + 2 effect styles that bind them. No semantic tier
  (overkill for 2 effects).
- **B-token** — shadow color as an **alpha color token** (color binding replaces the whole RGBA;
  `cyan/500` is opaque, hence separate tokens with alpha). They live in `reference-effect`. *Limitation:*
  no live alias to `cyan/500`/`neutral/900` possible (alpha) → RGB values mirrored, not linked.
- **Naming:** `glow` / `elevation`.

## Implementation status (Figma)

### `reference-effect` — `VariableCollectionId:3088:2`, mode `value` (`3088:0`)

> **Update 2026-06-11 — reference consolidation:** `reference-effect` is dissolved — the 10
> primitives now live in the **single** `reference` collection as group **`Effect/*`**
> (`Effect/glow/…`, `Effect/elevation/…`; scopes unchanged EFFECT_COLOR/EFFECT_FLOAT). New
> variable IDs (`3623:30…39`); both effect styles (Glow, Elevation) rebound to the new vars.

10 variables, grouped by effect; scopes `EFFECT_COLOR` / `EFFECT_FLOAT`:
- `glow/` — `color` rgba(0,159,227,.5) · `blur 4` · `spread 0` · `x 0` · `y 0`
- `elevation/` — `color` rgba(26,34,48,.18) · `blur 36` · `spread −6` · `x 0` · `y 14`

### Effect styles (application level)
- **`Glow`** — DropShadow, all 5 parts (`color/radius/spread/offsetX/offsetY`) bound to `glow/*`.
- **`Elevation`** — DropShadow, all 5 parts bound to `elevation/*`.

**Screen application** (`1099:9710`): **done** — `Glow` on 4 nodes, `Elevation` on 2 nodes
(raw effects replaced), 0 errors, screenshot visually unchanged.

## Decision log

| Step | Decision | Result in Figma |
|---|---|---|
| Depth | **A-lean** | `reference-effect` (parts) + 2 effect styles, no semantic tier |
| Shadow color | **B-token** (alpha tokens) | `glow/color`, `elevation/color` as COLOR with alpha |
| Naming | `glow` / `elevation` | 2 effect styles |
| Build | reference-effect + styles | 10 vars, 2 styles, 5 parts bound each |
| Screen application | assign styles | Glow ×4, Elevation ×2, 0 errors; visually unchanged |

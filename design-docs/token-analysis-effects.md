# Token-Analyse — Kategorie Effekte (Schatten / Glow)

Screen: Referenz-Screen „Quiet", node `1099:9710` (Figma „Agentport DS", fileKey
`FIGMA_FILE_KEY`). Schwester zu `token-analysis-color/-radius/-spacing/-typography.md`.
Ziel: keine rohen Effekt-Werte mehr — Schatten/Glow hängen an **Effect Styles**, deren Teile
über Variablen tokenisiert sind.

> **Status:** Entschieden (**A-lean · B-token · glow/elevation**), gebaut + am Screen angewandt.
> Kategorie komplett.

## Befund (Screen-Scan, read-only)

Nur **2 Effekte** (beide Drop-Shadows; keine Blurs; keine vorhandenen Effect Styles):

| Effekt | Werte | auf (Nodes) | Bedeutung |
|---|---|---|---|
| **Cyan-Glow** | `0/0 · blur 4 · spread 0 · rgba(0,159,227,.5)` ×4 | palette-caret ×2, cmd-blau-tick, blau-tick | Leuchten an den Cyan-Marken |
| **Palette-Elevation** | `0/14 · blur 36 · spread −6 · rgba(26,34,48,.18)` ×2 | palette-panel ×2 | Schlagschatten der Command-Palette |

**Farb-Bezug:** Glow = `cyan/500` @ 50% · Elevation = `neutral/900` @ 18%.

## Architektur-Entscheidungen

- **Effekte sind kein Variable-Typ** (ein Schatten ist immer Composite) → Anwendungs-Ebene ist
  zwingend ein **Effect Style** (analog Text Style). Variablen tragen nur die *Teile*.
- **A-lean** — `reference-effect` (die Teile) + 2 Effect Styles, die sie binden. Kein semantic-Tier
  (bei 2 Effekten Overkill).
- **B-token** — Schatten-Farbe als **Alpha-Color-Token** (Color-Binding ersetzt die ganze RGBA;
  `cyan/500` ist opak, also eigene Tokens mit Alpha). Liegen in `reference-effect`. *Limitation:*
  kein Live-Alias auf `cyan/500`/`neutral/900` möglich (Alpha) → RGB-Werte gespiegelt, nicht verlinkt.
- **Naming:** `glow` / `elevation`.

## Umsetzungsstand (Figma)

### `reference-effect` — `VariableCollectionId:3088:2`, Mode `value` (`3088:0`)
10 Variablen, gruppiert nach Effekt; Scopes `EFFECT_COLOR` / `EFFECT_FLOAT`:
- `glow/` — `color` rgba(0,159,227,.5) · `blur 4` · `spread 0` · `x 0` · `y 0`
- `elevation/` — `color` rgba(26,34,48,.18) · `blur 36` · `spread −6` · `x 0` · `y 14`

### Effect Styles (Anwendungs-Ebene)
- **`Glow`** — DropShadow, alle 5 Teile (`color/radius/spread/offsetX/offsetY`) an `glow/*` gebunden.
- **`Elevation`** — DropShadow, alle 5 Teile an `elevation/*` gebunden.

**Screen-Anwendung** (`1099:9710`): **fertig** — `Glow` auf 4 Nodes, `Elevation` auf 2 Nodes
(rohe Effekte ersetzt), 0 Fehler, Screenshot visuell unverändert.

## Entscheidungs-Log

| Schritt | Entscheidung | Ergebnis in Figma |
|---|---|---|
| Tiefe | **A-lean** | `reference-effect` (Teile) + 2 Effect Styles, kein semantic-Tier |
| Schatten-Farbe | **B-token** (Alpha-Tokens) | `glow/color`, `elevation/color` als COLOR mit Alpha |
| Naming | `glow` / `elevation` | 2 Effect Styles |
| Bauen | reference-effect + Styles | 10 Vars, 2 Styles, je 5 Teile gebunden |
| Screen-Anwendung | Styles zuweisen | Glow ×4, Elevation ×2, 0 Fehler; visuell unverändert |

# Token-Analyse — Kategorie Typografie

Screen: Referenz-Screen „Quiet", node `1099:9710` (Figma „Agentport DS", fileKey
`FIGMA_FILE_KEY`). Schwester zu `token-analysis-color/-radius/-spacing.md`.
Ziel: ein Typo-Token-System nach **Hybrid (III)** — Referenz-Teile als Variablen, zu
**Formaten** (Composition-Tokens) gebündelt, angewandt über **Figma Text Styles**.

> **Status:** Architektur entschieden, **3 Collections + 11 Text Styles gebaut + Screen angewandt**
> (223 Text-Nodes klassifiziert, 0 Fehler). Kategorie komplett.

## Befund (Screen-Scan, read-only)

- **223 Text-Nodes**, **keine** vorhandenen Text Styles.
- **Familien & Weights:** Hanken Grotesk (Regular 400 · Medium 500 · SemiBold 600 · Bold 700 ·
  ExtraBold 800) · Geist Mono (Regular 400 · Medium 500).
- **Font-Sizes** (Häufigkeit): `9×4 · 10×25 · 11×23 · 11.5×1 · 12×96 · 13×11 · 14×29 · 15×25 ·
  16×5 · 22×1 · 32×2 · 42×1` — dichter Cluster 9–16, dann Display-Sprünge.
- **Line-Heights:** überwiegend **AUTO** (Font-Default ≈ CSS `line-height: normal`); explizite
  Ratios nur bei Fließtext/Headings: `1.0` (32) · `1.1` (22) · `1.2` (Relation-Titel) ·
  `1.45/1.48` (Body 14).
- **Letter-Spacing:** 0 als Default; **positiv** auf Uppercase-Mono-Labels (0.4–0.8px / 4–5%);
  **negativ** auf Display-Headings (−0.1 bis −0.6px).

## Architektur-Entscheidungen

- **Hybrid (III)** — Variablen als Referenz-Teile → in Text Styles gebündelt.
- **Line-Height ist NICHT bindbar** in Figma → als Referenz-Ratios angelegt (`1.0/1.2/1.5`),
  im Text Style **roh** als % gesetzt (auto, wo das Design auto nutzt).
- **A-scale** (strenge Type-Scale-Ramp, 7 Steps `10·12·14·16·22·32·42`); Ist-Größen snappen:
  9→10 · 11/11.5→12 · **13/14/15→14** · 16 · 22 · 32 · 42. Einzige spürbare Verschiebung
  **15→14** (Property-Werte, SemiBold ×24 — Hierarchie künftig übers Weight statt Größe).
- **Weights zusammengelegt:** Bold 700 → ExtraBold 800 (700 kam nur 1× vor). Set:
  `regular 400 · medium 500 · semibold 600 · extrabold 800`.
- **Line-Height-Set:** `1.0 / 1.2 / 1.5` (+ AUTO). Explizite Ratio nur für `display`,
  `heading`, `heading-sm`, `body`; alle anderen Formate bleiben AUTO.
- **Tracking in px** (nicht %): Binding zwingt Letter-Spacing auf PIXELS → Werte als px.
  `tight −0.5 · normal 0 · wide 0.5` (entspricht den Ist-Werten).
- **Naming:** Referenz-Teile wert-/rollenbenannt; **Formate rollenbasiert**.
- Display 42 (Hero „invoice") gehört bewusst ins System; 32 + 42 bleiben getrennte Rollen.

## Umsetzungsstand (Figma)

### `reference-typo` — `VariableCollectionId:3081:2`, Mode `value` (`3081:0`)
20 Variablen, alle `scopes:[]` (nur via Alias), gruppiert:
- `family/` — `sans` = „Hanken Grotesk", `mono` = „Geist Mono" *(STRING)*
- `weight/` — `regular 400 · medium 500 · semibold 600 · extrabold 800` *(FLOAT)*
- `size/` — `base 16 · 10 · 12 · 14 · 16 · 22 · 32 · 42` *(FLOAT)*
- `line-height/` — `tight 1.0 · snug 1.2 · relaxed 1.5` *(FLOAT, Ratio; nicht bindbar)*
- `tracking/` — `tight −0.5 · normal 0 · wide 0.5` *(FLOAT, px)*

**Font-Sizes im CSS-Export:** in **rem** mit Anker `--font-size-base: 1rem` (16px = Root); `size/16`
referenziert die Base, die übrigen sind direkte rem-Werte (Typo ist modular, **kein** `calc(base × N)`
wie Spacing). `size/base` = 16 als dokumentierter Anker in Figma (px, kein calc).

### `semantic-typo` — `VariableCollectionId:3082:2`, Mode `value` (`3082:0`)
48 Variablen, **11 Format-Gruppen**, jeder Teil aliast `reference-typo`. Scopes: family
`FONT_FAMILY`, size `FONT_SIZE`, weight `FONT_WEIGHT`, tracking `LETTER_SPACING`,
line-height `[]` (nicht bindbar). LH-Teil nur bei `Display/Heading/Heading-sm/Body`.

| Format | family | size | weight | line-height | tracking |
|---|---|---|---|---|---|
| `Display`     | sans | 42 | extrabold | 1.0 (100%) | tight |
| `Heading`     | sans | 32 | extrabold | 1.2 (120%) | tight |
| `Heading-sm`  | sans | 22 | extrabold | 1.2 (120%) | tight |
| `Title`       | sans | 16 | semibold  | auto | normal |
| `Body`        | sans | 14 | regular   | 1.5 (150%) | normal |
| `Body-strong` | sans | 14 | semibold  | auto | normal |
| `Label`       | sans | 14 | medium    | auto | normal |
| `Eyebrow`     | mono | 10 | medium    | auto | wide |
| `Data`        | mono | 12 | regular   | auto | normal |
| `Kbd`         | mono | 12 | medium    | auto | normal |
| `Input`       | mono | 16 | regular   | auto | normal |

### Text Styles (Anwendungs-Ebene)
11 Figma Text Styles, je 4 gebundene Variablen (`fontFamily`, `fontSize`, `fontWeight`,
`letterSpacing`); Line-Height roh gesetzt (auto bzw. %). Namen = Format-Namen oben.

**Screen-Anwendung** (`1099:9710`): **fertig** — alle 223 Text-Nodes per Klassifizierung
(Family/Size/Weight → Format) einem Style zugewiesen, 0 Fehler, Screenshot intakt.
Mapping: Mono → `Eyebrow`(≤10) / `Data`(11–12 regular) / `Kbd`(11–12 medium) / `Input`(≥13);
Sans → `Display`(42) / `Heading`(32) / `Heading-sm`(22) / `Title`(16) / `Body-strong`(semibold) /
`Label`(medium) / `Body`(regular). Verteilung: `Data 98 · Body-strong 33 · Eyebrow 29 · Label 29 ·
Kbd 12 · Body 12 · Input 5 · Heading 2 · Display 1 · Heading-sm 1 · Title 1`.

## Entscheidungs-Log

| Schritt | Entscheidung | Ergebnis in Figma |
|---|---|---|
| Architektur | Hybrid (III) | Referenz-Teile → Formate → Text Styles |
| Size-Scale | A-scale (7 Steps) | `size/10–42`; 15→14 |
| Weights | 700 → 800 zusammengelegt | 4 Weights |
| Line-Height | nicht bindbar → Ratio-Referenz, roh gesetzt; auto wo Design auto | `1.0/1.2/1.5` |
| Tracking | px statt % (Binding zwingt PIXELS) | `−0.5 / 0 / 0.5` |
| Formate | 11 Rollen (inkl. `Input`, mono 16) | `semantic-typo`, 48 Vars |
| Text Styles | 11 Styles, 4 Bindings je | family/size/weight/tracking gebunden, LH roh |
| Screen-Anwendung | Styles auf `1099:9710` zuweisen | 223 Nodes klassifiziert, 0 Fehler; Screenshot intakt |

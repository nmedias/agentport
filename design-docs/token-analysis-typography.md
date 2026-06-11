# Token-Analyse — Kategorie Typografie

Screen: Referenz-Screen „Quiet", node `1099:9710` (Figma „Agentport DS", fileKey
`FIGMA_FILE_KEY`). Schwester zu `token-analysis-color/-radius/-spacing.md`.
Ziel: ein Typo-Token-System nach **Hybrid (III)** — Referenz-Teile als Variablen, zu
**Formaten** (Composition-Tokens) gebündelt, angewandt über **Figma Text Styles**.

> **Status:** Architektur entschieden, **3 Collections + 11 Text Styles gebaut + Screen angewandt**
> (223 Text-Nodes klassifiziert, 0 Fehler). Kategorie komplett.
>
> **Update 2026-06-11 — erster Code-Konsument für `Input`:** Die Command-palette-Variante (libs/ui)
> nutzt `text-format-input` (Mono 18) auf dem Prompt-Feld — erster Code-Konsument des Input-Formats
> (der Default-Command nutzt bewusst `text-format-label`, vgl. components-reference). Figma-Pendant:
> Text Style `Input` auf value/placeholder im `.Command/Input`-palette-Member 3638:8.
>
> **Update 2026-06-11 — Utility-Rename `text-<format>` → `text-format-<format>`:** der alte Name
> kollidierte mit Tailwinds generierten Farb-Utilities (`text-input` = Format-Klasse UND Farbe aus
> `--color-input` — beide Regeln im CSS). Alle 11 `@utility`-Klassen, alle Code-Nutzungen und der
> twMerge-Gruppen-Matcher (`utils.ts`) umbenannt; CSS-Variablen, Figma-Variablen und Text Styles
> unverändert. Details: tokens-reference §4.

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
- **Modulare Skala** (Ratio **1.25**, Base **14px** = Step 0/Body, display-lastig, 8 Steps
  `step-neg2…step-5`): `9 · 11 · 14 · 18 · 22 · 27 · 34 · 43`. `step-4` (34) ist **Reserve** (kein Format).
  Im CSS aus der Base berechnet: `round(calc(base × font-scale^n), 0.0625rem)` → gerundet auf ganze px.
  *(Frühere A-scale 10/12/14/16/22/32/42 abgelöst. Abweichungen: Eyebrow 10→9, Data 12→11, Body 14→14,
  Title 16→18, Heading-sm 22→22, Heading 32→27, Display 42→43.)*
- **Weights zusammengelegt:** Bold 700 → ExtraBold 800 (700 kam nur 1× vor). Set:
  `regular 400 · medium 500 · semibold 600 · extrabold 800`.
- **Line-Height-Set:** `1.0 / 1.2 / 1.5` (+ AUTO). Explizite Ratio nur für `display`,
  `heading`, `heading-sm`, `body`; alle anderen Formate bleiben AUTO.
- **Tracking in px** (nicht %): Binding zwingt Letter-Spacing auf PIXELS → Werte als px.
  `tight −0.5 · normal 0 · wide 0.5` (entspricht den Ist-Werten).
- **Naming:** Referenz-Teile wert-/rollenbenannt; **Formate rollenbasiert**.
- Display (Hero „invoice") = Top-Step `step-5` (43). `font-scale` ist als **eine Variable** steuerbar
  (CSS `--font-scale` + Figma `font-scale`) → ganze Skala über eine Zahl skalierbar.

## Umsetzungsstand (Figma)

### `reference-typo` — `VariableCollectionId:3081:2`, Mode `value` (`3081:0`)

> **Update 2026-06-11 — reference-Konsolidierung:** `reference-typo` ist aufgelöst — die 22
> Primitives leben jetzt in der **einen** `reference`-Collection als Gruppe **`Font/*`** (gleiche
> Unterstruktur: `Font/family/…`, `Font/weight/…`, `Font/size/…`, `Font/line-height/…`,
> `Font/tracking/…`; `font-scale` heißt jetzt **`Font/scale`**). Neue Variable-IDs (`3623:8…29`);
> alle 48 semantic-typo-Aliase umgehängt, Text-Styles unverändert (binden semantic-typo).
> CSS-Primitives folgen dem Figma-Pfad mit `--ap-`-Präfix: `--ap-font-family-sans`,
> `--ap-font-line-height-tight` (vorher `--leading-tight`), `--ap-font-scale` usw.
> **Update 2026-06-11 — semantic-typo umstrukturiert:** Org-Gruppe oben drauf, Token =
> `format/part`: `Display/display/family`, `Heading/heading/…` + `Heading/heading-sm/…`,
> `Body/body/…` + `Body/body-strong/…`, Title/Label/Eyebrow/Data/Kbd/Input je eigene Gruppe
> (48 Renames, IDs/Aliase/Text-Style-Bindings unverändert). CSS: `--text-<format>-<part>` →
> **`--ap-sys-<format>-<part>`**, `leading` → `line-height` (`--ap-sys-heading-sm-family`,
> `--ap-sys-body-line-height`). Utility-Klassen `text-<format>` unverändert.

22 Variablen, alle `scopes:[]` (nur via Alias), gruppiert:
- `family/` — `sans` = „Hanken Grotesk", `mono` = „Geist Mono" *(STRING)*
- `weight/` — `regular 400 · medium 500 · semibold 600 · extrabold 800` *(FLOAT)*
- `font-scale` — `1.25` (Modular-Ratio) · `size/base` — `14` *(FLOAT)*
- `size/` — `step-neg2 9 · step-neg1 11 · step-0 14 · step-1 18 · step-2 22 · step-3 27 ·
  step-4 34 (Reserve) · step-5 43` *(FLOAT)*
- `line-height/` — `tight 1.0 · snug 1.2 · relaxed 1.5` *(FLOAT, Ratio; nicht bindbar)*
- `tracking/` — `tight −0.5 · normal 0 · wide 0.5` *(FLOAT, px)*

**Font-Sizes im CSS-Export:** modulare Skala in **rem**, berechnet aus `--font-size-base` (0.875rem/14px)
× `--font-scale` (1.25)^n, gerundet via `round(…, 0.0625rem)` auf ganze px. Figma kann nicht rechnen
→ dort sind `size/step-*` die gerundeten Werte direkt; `font-scale` + `size/base` als dokumentierte Anker.

### `semantic-typo` — `VariableCollectionId:3082:2`, Mode `value` (`3082:0`)
48 Variablen, **11 Format-Gruppen**, jeder Teil aliast `reference-typo`. Scopes: family
`FONT_FAMILY`, size `FONT_SIZE`, weight `FONT_WEIGHT`, tracking `LETTER_SPACING`,
line-height `[]` (nicht bindbar). LH-Teil nur bei `Display/Heading/Heading-sm/Body`.

| Format | family | size (step) | weight | line-height | tracking |
|---|---|---|---|---|---|
| `Display`     | sans | 43 (step-5)    | extrabold | 1.0 (100%) | tight |
| `Heading`     | sans | 27 (step-3)    | extrabold | 1.2 (120%) | tight |
| `Heading-sm`  | sans | 22 (step-2)    | extrabold | 1.2 (120%) | tight |
| `Title`       | sans | 18 (step-1)    | semibold  | auto | normal |
| `Body`        | sans | 14 (step-0)    | regular   | 1.5 (150%) | normal |
| `Body-strong` | sans | 14 (step-0)    | semibold  | auto | normal |
| `Label`       | sans | 14 (step-0)    | medium    | auto | normal |
| `Eyebrow`     | mono | 9 (step-neg2)  | medium    | auto | wide |
| `Data`        | mono | 11 (step-neg1) | regular   | auto | normal |
| `Kbd`         | mono | 11 (step-neg1) | medium    | auto | normal |
| `Input`       | mono | 18 (step-1)    | regular   | auto | normal |

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
| Size-Scale (Update) | **modular**, Ratio 1.25, Base 14, 8 Steps | `size/step-neg2…step-5` (9–43), step-4 Reserve; `font-scale`+`size/base`; CSS via `round(calc())` |
| Weights | 700 → 800 zusammengelegt | 4 Weights |
| Line-Height | nicht bindbar → Ratio-Referenz, roh gesetzt; auto wo Design auto | `1.0/1.2/1.5` |
| Tracking | px statt % (Binding zwingt PIXELS) | `−0.5 / 0 / 0.5` |
| Formate | 11 Rollen (inkl. `Input`, mono 16) | `semantic-typo`, 48 Vars |
| Text Styles | 11 Styles, 4 Bindings je | family/size/weight/tracking gebunden, LH roh |
| Screen-Anwendung | Styles auf `1099:9710` zuweisen | 223 Nodes klassifiziert, 0 Fehler; Screenshot intakt |

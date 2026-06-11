# Token-Analyse — Kategorie Spacing (Gaps + Paddings)

Screen: Referenz-Screen „Quiet", node `1099:9710` (Figma „Agentport DS", fileKey
`FIGMA_FILE_KEY`). Schwester-Dokument zu `token-analysis-color.md` / `…-radius.md`.
Ziel: keine Roh-Spacing-Werte mehr — Gaps (`itemSpacing`) und Paddings hängen an semantischen
Spacing-Tokens. Ein Spacing-System bedient **beides** (Gap + Padding).

> **Status:** Entschieden (**A-grid · B-tshirt · C eine Collection ohne Reference-Tier · D roh**),
> Collection gebaut, **Screen gebunden** (344 Felder, 0 Fehler). Nachträge: `space-lg`(10px)
> entfernt + Reihe lückenlos umbenannt (jetzt **10 Steps**); **Radius-Semantics in dieselbe
> Collection `semantic-dimension` geholt** (Spacing + Radius gemeinsam).

## Befund (Screen-Scan)

- **123 Auto-Layout-Frames.** `0` dominiert (Gap ×186, Padding ×207) — das ist „kein Abstand",
  kein Token.
- **Gaps (itemSpacing):** ~16 distinkte Werte `1,3,4,6,7,8,9,10,12,14,15,16,17,21,112`.
- **Paddings:** ~22 distinkte Werte `2,3,5,6,7,8,9,10,11,12,14,16,18,20,22,24,28,30,32,48,80`.
- Viele **off-grid** (7, 9, 11, 14, 15, 17, 18, 21, 22, 28, 30) — der Screen wurde **nicht** auf
  einem strikten 4er-Raster gebaut. Manche off-grid-Werte sind aber **stark frequent** und damit
  bewusst (s. u.), kein Rauschen.

## Roh-Wert-Inventar

### Gaps (itemSpacing / counterAxisSpacing)

| px | Anz. | Vorkommen |
|---|---|---|
| 0  | 186 | (kein Gap — kbd-key, Typ-Zeile, pflicht-cell, track, cnt …) |
| 1  | 2  | toggle-text |
| 3  | 1  | bar |
| 4  | 4  | Feld·Aktive Verbindung / SCOPE / BENUTZER / WERKZEUG (Statusband-Felder) |
| 6  | 4  | Frame 1, Quell-Toggles, Anteils-Leiste |
| 7  | 6  | kbd-hoch-runter, kbd-Enter, kbd-Esc |
| 8  | 12 | Gruppen-Trenner, grp-SPRINGE ZU / SUCHE / FÜHRE AUS, Icon-Rail |
| 9  | 2  | Quell-Toggle-system / -custom |
| 10 | 5  | Endpoint-Switcher, Property-Suche, sub-Kardinalität / -Abfragbar / -Quelle |
| 12 | 17 | palette-prompt, entry-* (Command-Palette-Einträge) |
| 14 | 1  | Cmd+K-Pille |
| 15 | 1  | Frame 1 |
| 16 | 2  | palette-footer |
| 17 | 1  | Frame 1 |
| 21 | 1  | Header |
| 112| 1  | **Typen-Nav** (Ausreißer — großer Layout-Offset) |

### Paddings

| px | Anz. | Vorkommen |
|---|---|---|
| 0  | 207 | (kein Padding) |
| 2  | 13 | track, track-off, Kopf |
| 3  | 12 | kbd-key |
| 5  | 12 | palette-esc, sub-Kardinalität / -Abfragbar / -Quelle |
| 6  | 6  | grp-SPRINGE ZU / SUCHE / FÜHRE AUS |
| 7  | 22 | **kbd-key, Typ-Zeile** (kompaktes Zeilen-Padding, stark frequent) |
| 8  | 16 | palette-list, Gruppen-Trenner, Endpoint-Switcher, Quell-Toggles, Cmd+K-Pille |
| 9  | 34 | **palette-esc, entry-*** (Palette-Einträge, sehr frequent) |
| 10 | 17 | Typ-Zeile, Header, Icon-Rail, Quell-Toggles, Kopf |
| 11 | 8  | palette-footer, Property-Suche, Quell-Toggles |
| 12 | 8  | Endpoint-Switcher, grp-* |
| 14 | 4  | Property-Suche, palette-prompt |
| 16 | 21 | palette-prompt, Icon-Rail, entry-* |
| 18 | 37 | **grp-*, palette-footer, Gruppen-Trenner, Typen-Nav** (sehr frequent) |
| 20 | 1  | Header |
| 22 | 2  | ruhe-header, ruhe-cta |
| 24 | 6  | Typen-Nav, Arbeitsbereich-Mitte, ruhe-sec-hdr, ruhe-cta, Status-Anker-Band |
| 28 | 10 | insp-detail-V, ruhe-header, ruhe-sec-hdr, ruhe-cta, Header, Status-Anker-Band |
| 30 | 3  | insp-detail-V, ruhe-header |
| 32 | 27 | Gruppen-Trenner, Arbeitsbereich-Mitte, Kopf, Zeile·* |
| 48 | 25 | Gruppen-Trenner, Kopf, Zeile·* |
| 80 | 1  | Frame 1 |

**Frequenz-Heavies (bewusste Werte, keine Dupes):** Padding 7 (×22), 9 (×34), 16 (×21),
18 (×37), 32 (×27), 48 (×25); Gap 8 (×12), 12 (×17).

## Vorgeschlagene Skala (Empfehlung — 4er-Raster, T-Shirt-Naming)

Ein gemeinsames Spacing-System für Gap + Padding. Empfehlung: auf ein **4px-Raster
konsolidieren** und off-grid-Werte auf den nächsten Step ziehen (1–2px-Shifts, kaum sichtbar).
22+ Rohwerte → **11 Steps**.

Finale Skala (**10 Steps** — `space-lg`=10px wurde nachträglich entfernt, Reihe lückenlos
umbenannt; 10/11px fallen damit auf `space-lg`=12):

| Token | px | konsolidiert aus | deckt ab |
|---|---|---|---|
| `space-2xs` | 2  | 1, 2, 3            | Toggle-Inset, Hairline-Gaps |
| `space-xs`  | 4  | 4, 5               | Statusband-Felder, esc-Inset |
| `space-sm`  | 6  | 6, 7               | kbd-Gaps, kbd/Typ-Zeile-Padding, grp-Gap |
| `space-md`  | 8  | 8, 9               | Gruppen-Gaps, Palette-Einträge-Padding |
| `space-lg`  | 12 | 10, 11, 12, 13     | Switcher/Suche-Gap, Header-Padding, Palette-Eintrag-Gap, grp-Padding |
| `space-xl`  | 16 | 14, 15, 16, 17, 18 | Footer-Gap, Icon-Rail, grp-Padding |
| `space-2xl` | 24 | 20, 21, 22, 24     | Header-Gap, ruhe-*, Status-Band |
| `space-3xl` | 32 | 28, 30, 32         | insp-detail, Zeilen-Padding |
| `space-4xl` | 48 | 48                 | Spalten-Padding (Gruppen-Trenner, Kopf) |
| `space-5xl` | 80 | 80                 | großzügiger Frame-Offset |

**Ausreißer `112` (Typen-Nav, Gap)** — siehe Entscheidung D.

## Entscheidungen (strukturell)

- **A-grid** — aufs Raster konsolidieren (obige 11-Step-Skala); frequente Werte um 1–2px
  verschoben (7→6, 9→8, 18→16, 28→32 …). Layout-Shift minimal, Screenshot bestätigt intakt.
- **B-tshirt** — `space-2xs … space-6xl`.
- **C** — **kein Reference-Tier für Spacing**; die Spacing-Tokens direkt (Roh-Werte, kein
  Alias) in **einer** Collection `semantic-dimension`. Name „dimension" breit gewählt.
- **D** — Ausreißer `112` (Typen-Nav) **roh** gelassen, beim Binding übersprungen.

**Nachträge:**
- **`space-lg`=10px entfernt** — Reihe lückenlos umbenannt (12→lg, 16→xl, 24→2xl, 32→3xl,
  48→4xl, 80→5xl). 30 an 10px gebundene Felder (Rohwerte 10/11) auf `space-lg`=12 umgehängt.
  Skala jetzt **10 Steps**.
- **Radius dazu** — die 5 Radius-Semantics (`radius-sm/md/lg/xl/full`) leben jetzt **ebenfalls
  in `semantic-dimension`** (Scope `CORNER_RADIUS`, weiter Alias auf `reference-dimension`). Die
  separate `semantic-radius`-Collection wurde gelöscht, `reference-dimension` (Primitive) bleibt.
  → `semantic-dimension` = 10 Spacing + 5 Radius = **15 Variablen**.

## Umsetzungsstand (Figma)

Collection `semantic-dimension` — `VariableCollectionId:3070:2`, Mode `value` (`3070:0`),
**15 FLOAT-Tokens** (vorher nicht vorhanden):

- **10 Spacing** (Figma-Gruppe `Space/`), direkte Werte (kein Alias), Scope `GAP`
  (Gap **und** Padding): `space-2xs 2 · space-xs 4 · space-sm 6 · space-md 8 · space-lg 12 ·
  space-xl 16 · space-2xl 24 · space-3xl 32 · space-4xl 48 · space-5xl 80`.
- **5 Radius** (Figma-Gruppe `Radius/`), Scope `CORNER_RADIUS`, Alias auf `reference-dimension`:
  `radius-sm→4 · radius-md→6 · radius-lg→8 · radius-xl→16 · radius-full→full`.

*(Gruppen `Space/` + `Radius/` vom User in Figma angelegt — Leaf-Namen unverändert. Primitive-
Collection `reference-radius` ebenfalls umbenannt → `reference-dimension`.)*

**Grundeinheit (CSS-Export):** `reference-dimension` enthält zusätzlich `space/base` = 4 (=4px,
= Tailwinds Spacing-Basis). Im CSS-Export (`tokens.css`) sind die Spacing-Steps in **rem** und
werden aus dieser Basis berechnet: `--space-base: 0.25rem` (4px), Step = `calc(base × N)`
(2xs×0.5 · xs×1 · sm×1.5 · md×2 · lg×3 · xl×4 · 2xl×6 · 3xl×8 · 4xl×12 · 5xl×20). In Figma kann
nicht gerechnet werden → die Steps bleiben dort direkte Werte; `space/base` ist die dokumentierte Einheit.

**Screen-Binding** (`1099:9710`): **fertig** — 344 Spacing-Felder (itemSpacing + 4 Paddings je
Auto-Layout-Frame) gebunden (0 Fehler), 1 Feld übersprungen (112er-Gap, roh); Radius-Bindings
auf die neuen Tokens umgehängt (136 Ecken). Bucket-Mapping (final): ≤3→2xs, ≤5→xs, ≤7→sm,
≤9→md, ≤13→lg(12), ≤19→xl(16), ≤26→2xl(24), ≤40→3xl(32), ≤64→4xl(48), sonst 5xl(80).
Verteilung Spacing: `xl ×67 · md ×64 · lg ×55 · 3xl ×40 · sm ×38 · 2xs ×28 · 4xl ×25 ·
xs ×16 · 2xl ×10 · 5xl ×1`. Screenshot = Struktur intakt.

## Entscheidungs-Log

| Schritt | Entscheidung | Ergebnis in Figma |
|---|---|---|
| Philosophie | **A-grid** Raster-Konsolidierung | 22+ Rohwerte → 11 Steps |
| Naming | **B-tshirt** | `space-2xs … space-6xl` |
| Collections | **C** eine Collection, kein Reference-Tier | `semantic-dimension`, Mode `value`, direkte Werte |
| Ausreißer 112 | **D** roh lassen | 1 Gap (Typen-Nav) ungebunden |
| Screen-Binding | Tokens auf `1099:9710` setzen | 344 Felder gebunden, 0 Fehler; Struktur intakt |
| Nachtrag: `space-lg`=10 raus | Reihe umbenennen | 30 Felder auf 12 umgehängt; 10 Steps |
| Nachtrag: Radius dazu | semantic radius → `semantic-dimension` | 5 Tokens neu, 136 Ecken umgehängt, `semantic-radius` gelöscht |
| Nachtrag 2026-06-11: `--spacing-*`-Kollision | Steps von Tailwinds `--spacing-*` auf `@utility`-Blöcke (`--space-step-*`, nur gap/padding/margin) umgestellt — `--spacing-{step}` löste vor `--container` auf und überschrieb `max-w-md`/`w-sm`/`basis-*` (8px statt Container-Skala) | CSS-only (globals.css); Figma unverändert, Steps bleiben GAP-scoped. Details: tokens-reference §3 Kollisions-Regel |
| Nachtrag 2026-06-11: reference-Konsolidierung | `reference-dimension` aufgelöst → Primitives in der EINEN `reference`-Collection, Gruppe `Dimension/` (`radius/*` + `space/base`, neue IDs `3623:2…7`) | semantic-dimension-Aliase umgehängt (6); Werte/Scopes unverändert |

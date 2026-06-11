# Token-Analyse — Kategorie Radius (Corner-Radius)

Screen: Referenz-Screen „Quiet", node `1099:9710` (Figma „Agentport DS", fileKey
`FIGMA_FILE_KEY`). Schwester-Dokument zu `token-analysis-color.md`.
Ziel: keine Roh-Radien mehr — alle Corner-Radii hängen an semantischen Tokens, die ins
shadcn-Naming passen (`radius` Basis + `sm/md/lg/xl`, ergänzt um `xs`/`full`).

> **Status:** Skala entschieden (**A1 + B2**), Collections gebaut, **Screen gebunden**
> (34 Nodes, 0 Fehler). `radius-xs`/`1px` verworfen; r1-Marken bewusst roh gelassen.
> **Nachtrag:** die Semantics sind in die Collection `semantic-dimension` umgezogen
> (zusammen mit Spacing) — `semantic-radius` gelöscht, `reference-dimension` (Primitive, vorher
> `reference-radius`) bleibt.
> **Update 2026-06-11 — reference-Konsolidierung:** `reference-dimension` ist aufgelöst — die
> Primitives leben jetzt in der **einen** `reference`-Collection als Gruppe **`Dimension/radius/*`**
> (+ `Dimension/space/base`). Neue Variable-IDs (`3623:2…7`); die 6 semantic-dimension-Aliase wurden
> umgehängt, File-Sweep: 0 Rest-Bindungen.

## Befund (Screen-Scan)

- **0 Mixed-Corner-Nodes** — alle Radien sind uniform (kein per-Ecke-Radius).
- **8 distinkte Rohwerte**, viele verdächtig nah (3/4, 6/7, 8/9) → Near-Duplicates.
- **Schlüssel-Insight — gleicher Rohwert, zwei Intentionen** (analog zum Cyan-Split):
  - `track`/`track-off` (30×18, r9) und `seg-system/custom/rel` (96×6, r3) sind **echte
    Pillen** (Radius = halbe Höhe) → wollen `radius-full`, keinen festen Step.
  - `Property-Suche` (374×39, r9) ist mit demselben r9 **keine** Pille, nur ein
    gerundetes Feld → fester Step.
  - `Cmd+K-Pille` heißt „Pille", ist aber 640×46, r4 → **kein** Pill, nur leicht gerundet.

## Roh-Wert-Inventar

| Roh | Anz. | Vorkommen (Node-Namen) | Rolle |
|---|---|---|---|
| **1**  | 4  | palette-caret ×2, C2·cmd-blau-tick, C·blau-tick | Mikro-Rundung an winzigen Marken |
| **3**  | 13 | kbd-key ×6, palette-esc ×2, Endpoint-Switcher, Frame, seg-system/custom/rel | kleine Chips/Keys/Switcher **+ Pill-Balken (seg-\*)** |
| **4**  | 5  | Cmd+K-Pille, Werkzeug·Schema(aktiv), schema-aktiv-marker, suche-aktiv-marker, Typ-Zeile | kleine gerundete Bars/Marker |
| **6**  | 2  | C2·palette-panel ×2 | Command-Palette-Container |
| **7**  | 4  | Typ-Zeile ×4 | Zeilen-Container (innen) |
| **8**  | 5  | Werkzeug·Suche/Verknüpfungen/Einstellungen, Quell-Toggle-system/custom | Icon-Buttons, Segmente |
| **9**  | 4  | track ×2 (**Pill**), track-off (**Pill**), Property-Suche (Feld) | gemischt: Pille **vs.** Feld |
| **16** | 1  | Quiet | App-Fenster / große Fläche |

Dimensionen der Schlüssel-Nodes (für Pill-Erkennung):

| Node | w×h | r | Pill? |
|---|---|---|---|
| Quiet | 1480×1434 | 16 | nein |
| Property-Suche | 374×39 | 9 | nein (Feld) |
| track / track-off | 30×18 | 9 | **ja** |
| seg-system | 96×6 | 3 | **ja** |
| Werkzeug·Suche | 36×36 | 8 | nein |
| Quell-Toggle-system | 248×34 | 8 | nein |
| Typ-Zeile | 248×32 | 7 | nein |
| Cmd+K-Pille | 640×46 | 4 | nein |
| Endpoint-Switcher | 258×33 | 3 | nein |
| kbd-key | 87×20 | 3 | nein |

## Vorgeschlagene Skala (konsolidiert, shadcn-Naming)

shadcn benennt Radius als **eine Basis `--radius` + Steps `sm/md/lg/xl`**. Vorschlag: die
**echten Design-Werte behalten** (wie bei Farbe — nicht auf shadcn-Defaults snappen) und
ins Namensschema legen. 8 Rohwerte → **4 echte Steps + xs + full**.

| Token | Wert | konsolidiert aus | deckt ab | Quelle |
|---|---|---|---|---|
| `radius-sm`   | 4    | 3 + 4        | kbd-keys, Cmd+K-Bar, Switcher, aktiv-Marker | shadcn |
| `radius-md`   | 6    | 6 + 7        | Palette-Panel, Typ-Zeile | shadcn |
| `radius-lg`   | 8    | 8 + 9(Feld)  | Rail-Icons, Toggles, Property-Suche | shadcn |
| `radius-xl`   | 16   | 16           | App-Fenster, große Flächen | shadcn |
| `radius-full` | 9999 | 9(track) + 3(seg-\*) | Pillen: Toggle-Tracks, Anteils-Balken | **neu** (shadcn-Stil) |

**`radius-xs` (1px) verworfen** — die r1-Mikromarken (palette-caret, blau-tick) sind
vernachlässigbar; Behandlung beim Binding offen (auf `radius-sm` heben oder roh/scharf lassen).

## Entscheidungen (strukturell)

- **A1** — echte Design-Werte behalten, jeder Step explizit (4/6/8/16); kein calc-Modell.
  Konsequenz für CSS-Export: shadcns `calc(--radius ± Npx)`-Kette wird durch explizite Werte
  ersetzt (Basis `--radius` ggf. = `radius-lg` setzen oder ganz weglassen).
- **B2** — eigenes Collection-Paar für Radius (getrennt vom Farb-„light"-Mode).

## Umsetzungsstand (Figma)

Zwei Collections gebaut (vorher nicht vorhanden):

- **`reference-dimension`** — `VariableCollectionId:3064:2`, Mode `default` (`3064:0`),
  **5 FLOAT-Primitive**, alle `scopes:[]` (nur via Alias): `radius/4`, `radius/6`,
  `radius/8`, `radius/16`, `radius/full` (=9999).
  *(Collection vom User umbenannt: `reference-radius` → `reference-dimension`, ID gleich.)*
- **Semantics in `semantic-dimension`** — `VariableCollectionId:3070:2`, Mode `value`
  (gemeinsam mit Spacing; ursprünglich in `semantic-radius`/`3065:2`, jetzt gelöscht).
  In Figma-Gruppe **`Radius/`**. **5 FLOAT-Semantics**, Scope `CORNER_RADIUS`,
  je 1 Alias auf `reference-dimension`:
  `radius-sm`→`radius/4`, `radius-md`→`radius/6`, `radius-lg`→`radius/8`,
  `radius-xl`→`radius/16`, `radius-full`→`radius/full`.

**Screen-Binding** (`1099:9710`): **fertig** — 34 Nodes über alle 4 Ecken an Semantics
gebunden (0 Fehler), 4 r1-Marken bewusst übersprungen (roh). Pillen via `r ≈ min(w,h)/2`
erkannt → `radius-full`, Rest nach Wert-Bucket (≤4→sm, ≤7→md, ≤9→lg, sonst xl).
Verteilung: `sm ×15 · md ×6 · lg ×6 · full ×6 · xl ×1`. Screenshot = visuell unverändert.

## Entscheidungs-Log

| Schritt | Entscheidung | Ergebnis in Figma |
|---|---|---|
| Werte-Modell | **A1** echte Werte, explizit | je Step ein Primitive, Semantic aliast |
| Collections | **B2** eigenes Paar | `reference-radius` + `semantic-radius`, Mode `default` |
| xs | **verworfen** (1px unnötig) | `radius-xs` + `radius/1` gelöscht |
| Skala | sm4 / md6 / lg8 / xl16 / full | 5 Primitive + 5 Semantics aliased |
| r1-Marken | **(b)** roh lassen | 4 Nodes (palette-caret, blau-tick) ungebunden |
| Screen-Binding | Tokens auf `1099:9710` setzen | 34 Nodes gebunden, 0 Fehler; visuell unverändert |
| Nachtrag: Umzug | Semantics → `semantic-dimension` | 5 Tokens neu (Alias erhalten), 136 Ecken umgehängt, `semantic-radius` gelöscht |

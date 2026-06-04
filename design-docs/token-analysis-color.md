# Token-Analyse — Kategorie Farbe

**Screen:** „Quiet" — Referenz-Screen (Tabelle + Inspektor)
**Figma:** Agentport DS, fileKey `FIGMA_FILE_KEY`, node `1099:9710`
**Stand:** Screen nutzt **null Variablen** (`get_variable_defs` → `{}`) — komplett Raw-Values.
**Repo-Basis:** Standard-shadcn-Set in `libs/ui/src/styles/globals.css` vorhanden
(`background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, sidebar*`; keine `chart-*`).

---

## Umsetzungsstand (Figma)

Zweistufige Architektur in „Agentport DS": **`reference`** (Primitives, raw) → **`semantic`** (Alias) → später CSS-Export.

- **Collection `reference`** · Mode `default` · alle `scopes:[]` (nur via Alias nutzbar):
  - `base/white` `#FFFFFF`
  - `neutral/` `50 #FAFBFC · 100 #F4F6F8 · 200 #E6EAEE · 300 #C4CCD4 · 400 #979FA8 · 500 #6B7585 · 700 #4A5562 · 900 #1A2230` *(Lücken: 600, 800, 950)*
  - `cyan/` `50 #E9F6FC · 500 #009FE3 · 700 #0077A8` *(Lücken: 100–400, 600, 800–950)*
- **Collection `semantic`** · Mode `light` · **38 Variablen**:
  - **shadcn-Set vollständig** (`popover`/`popover-foreground` → `overlay`/`overlay-foreground` umbenannt; inkl.
    `destructive-foreground` + `chart-1…5`, die im Repo-`globals.css` fehlen).
  - 6 Custom (aliased): `input-placeholder`, `border-subtle`, `border-emphasis`, `border-strong`, `inverse`, `inverse-foreground`.
  - **9 Platzhalter** mit Raw-Hex + Marker ` ⚠` (kein Alias): `secondary`, `secondary-foreground`, `destructive`,
    `destructive-foreground`, `chart-1…5`.

- **Screen-Binding `1099:9710`:** **402 Solid-Paints** an Semantics gebunden (0 Fehler). Verteilung u. a.
  `muted-foreground` 178, `foreground` 61, `border-subtle` 42, `background` 41, `primary` 11, `card` 10.
  Mapping nach Fill/Stroke + Knoten-Namen (z. B. `#1A2230` FRAME→`inverse`, sonst→`foreground`; `#4A5562`
  Fill→`border-strong`, Stroke→`ring`; `Icon-Rail`→`sidebar`/`sidebar-border`; Palette-Flächen→`overlay`).
  **3 Anteils-Balken** (`seg-system/-custom/-rel`, `#9ea8b5`/`#ccd1d9`) **bewusst roh** gelassen (kein passender
  Token, monochrom-Entscheidung). Screenshot bestätigt: visuell unverändert; hellste Labels minimal dunkler
  (Folge der `text-tertiary`-Konsolidierung), nicht wahrnehmbar.

- **Rebind-Ausnahme:** Wire-„invoice" im Inspektor (`1099:10528`) von `accent-foreground` auf **`primary`**
  geändert (User-Entscheidung). Weicht von der Wert-Logik ab (`#0077a8`→`#009fe3`, heller): die freistehende
  Aktiv-Hervorhebung soll das helle Marken-Cyan tragen, nicht das dunkle Text-Cyan. `accent-foreground`
  bleibt für „Text **auf** accent-Tint" (Nav-/Palette-„invoice").

## Entscheidungs-Log

- **Custom Batch 1 — Text:** `text-tertiary` **verworfen** → hellgraue Labels nutzen `muted-foreground`
  (Vereinfachung; Labels dadurch minimal dunkler). `input-placeholder` **angelegt** als eigener Token,
  Wert `#979fa8` → neues Primitive `neutral/400`. Naming-Regel bestätigt: neue Tokens immer im
  bestehenden shadcn-Schema benennen.
- **Custom Batch 2 — Borders:** 2 statt 4 Tokens. `border-subtle` (Zeilen/Grid/Palette-Divider) und
  `border-emphasis` (Kopf-Regel/Wire) **angelegt**; `grid-line` + `divider-faint` **verworfen** (in
  `border-subtle` gebündelt). Keine neuen Primitives — Roh-Werte fallen in `neutral/200` (`#e0e5ed`≈)
  und `neutral/300` (`#bdc7d1`≈). `border-subtle` teilt vorerst den Wert mit `border`.
- **Custom Batch 3 — Inverse/Overlay:** `inverse` (→`neutral/900`) + `inverse-foreground` (→`neutral/50`)
  **angelegt** für die dunklen Tastatur-Pillen (Naming ohne `-surface`-Suffix, shadcn-konform:
  Fläche = bloßer Name, Text = `-foreground`). `popover-muted` **verworfen** — getönte Palette-Zone
  `#fbfcfd` nutzt `card`. Palette ist **kein Popover** → `popover`/`popover-foreground` **umbenannt** in
  `overlay`/`overlay-foreground` (CSS-Export aliasiert `--popover` auf `--overlay` für shadcn-Kompat.).
  Keine neuen Primitives.
- **Custom Batch 4 — Dekor & Marker:** nur **`border-strong`** (→`neutral/700`, = Wert von `ring`) für die
  Mess-Achse **angelegt** — als `border-*` benannt (nicht `rule-measure`), fügt sich in die Linien-Skala.
  `tick-accent`, `marker-required`, `status-connected` **kein eigener Token** → nutzen `primary`/`foreground`;
  Status-Punkt wartet auf die echte Status-Familie. Glow bleibt Effekt-Token (Schatten). Keine neuen Primitives.
- **Custom Batch 5 — Source:** **Option A (monochrom)**. Keine Quell-Farbfamilie. Quelle/Anteils-Leiste
  lösen über `muted-foreground` / `neutral/300` / `foreground` auf. Keine neuen Tokens/Primitives.
  → **Kategorie Farbe abgeschlossen.**
- **Nachtrag — shadcn-Set vervollständigt:** `destructive-foreground ⚠` + `chart-1…5 ⚠` als Platzhalter
  (Raw-Hex, shadcn-Defaults) **angelegt**, damit das volle shadcn-Set in Figma steht (waren im Repo-CSS nicht
  enthalten). Semantic-Collection jetzt 38 Variablen, davon 9 Platzhalter.

---

## Vorab: Farb-DNA des Screens

- **Monochrom + EIN Akzent.** Neutrale Graustufen-Rampe + ECM-Cyan `#009FE3`, dazu nur zwei
  Cyan-Ableitungen: dunkle Lesefassung `#0077A8` und Tint `#E9F6FC`. Mehr Buntfarbe gibt es nicht.
- **Keine Status-Ampel im Screen.** Kein Grün/Rot/Gelb. Der Verbindungs-Punkt ist Cyan (nicht grün),
  das Pflicht-Häkchen ist dunkle Tinte `#1A2230` (nicht grün). → `destructive`/Erfolg/Warnung müssen
  wir **erfinden**, nicht ableiten.
- **Quelle ist (noch) nicht farbkodiert.** System / Base / Custom laufen in derselben gedämpften Tinte;
  die Anteils-Leiste nutzt ein Grau für beide Hauptsegmente. → größte offene Designentscheidung (§7).
- **Viele Beinahe-Dubletten.** ~6 fast identische Neutral-Werte pro Rolle (z. B. `#e6eaee/#e6eaef`,
  `#f4f6f8/#f2f5f8/#f6f8fa`, `#6b7585/#6a7482/#737d8c`). Kollabieren beim Tokenisieren auf je einen Wert.

**Legende:** **[shadcn]** = bestehenden Token wiederverwenden (Wert auf unsere Palette setzen) ·
**[neu]** = neuer Token, den wir aufsetzen.

---

## 1 · Flächen / Surfaces

| Token | Quelle | Roh-Wert(e) | Wo im Layout |
|---|---|---|---|
| `--background` | **[shadcn]** | `#ffffff` | App-Grundfläche: Body, Header, Arbeitsbereich-Mitte, Typen-Nav-Spalte, Palette-Liste |
| `--card` | **[shadcn]** | `#fafbfc` | Inspektor-Panel rechts; Property-Suchfeld; **+ getönte Palette-Prompt/Footer-Zone** `#fbfcfd` (gebündelt) |
| `--overlay` *(war `popover`)* | **[shadcn→overlay]** | `#ffffff` | Command-Palette-Panel (weiße Liste). CSS-Export: `--popover` aliasiert `--overlay` (shadcn-Kompat.) |
| `--muted` | **[shadcn]** | `#f4f6f8` (+ Dubletten `#f2f5f8`, `#f6f8fa`) | „Chrome"-Flächen: Status-Anker-Band, Cmd-Prefix-Kästchen, Endpoint-Switcher, Toggle-Track |
| `--sidebar` | **[shadcn]** | `#f4f6f8` | Icon-Rail (linke 56px-Werkzeugleiste) |
| `--inverse` | **[neu]** → `neutral/900` | `#1a2230` | dunkle Tastatur-Pillen „Ctrl K" (Header) & „Esc" (Palette) |

---

## 2 · Text / Foreground

| Token | Quelle | Roh-Wert(e) | Wo im Layout |
|---|---|---|---|
| `--foreground` | **[shadcn]** | `#1a2230` | Primärtext: Typ-Headline „invoice", Property-Namen, Statusband-Werte, Switcher-Text, aktive Werte |
| `--muted-foreground` | **[shadcn]** | `#6b7585` (bündelt `#6a7482`, `#737d8c`, **und neu** `#979fa8`, `#8c96a6`, `#9ea8b5`) | Sekundär- **und** Tertiärtext (bewusst zusammengelegt): Tabellen-Zellen, Toggle-Labels, kbd-Text, „…N weitere"; **plus** Eyebrow-Labels (WO DU BIST, SCOPE, JUMP TO), Tabellen-Spaltenköpfe (PROPERTY/TYP…), Palette-Meta-Text |
| `--input-placeholder` | **[neu]** → `neutral/400` | `#979fa8` (bündelt `#b8c0c8`) | Platzhalter: „Befehl, Sprung oder Suche eingeben", „Property suchen …", „tippen für …" |
| `--inverse-foreground` | **[neu]** → `neutral/50` | `#f2f6f9` (≈ `#fafbfc`) | Text auf den dunklen Tastatur-Pillen |

> **Entscheidung (vereinfacht):** Es gibt **keine** dritte Textstufe `--text-tertiary`. Alle hellgrauen
> Labels/Spaltenköpfe/Meta (`#979fa8`-Familie) laufen auf `--muted-foreground`. Konsequenz: diese
> Labels werden minimal dunkler als im Screen (`#6b7585` statt `#979fa8`) — bewusst, zugunsten weniger
> Tokens. **`--input-placeholder` bleibt** als eigener Token (Wert `#979fa8` = Primitive `neutral/400`),
> weil Platzhalter eine klar abgegrenzte, wiederkehrende Rolle sind.

---

## 3 · Akzent — ECM-Cyan (Signatur)

| Token | Quelle | Roh-Wert(e) | Wo im Layout |
|---|---|---|---|
| `--primary` | **[shadcn]** | `#009fe3` | Marken-Cyan: aktiver Verbindungs-Punkt, Cmd-Caret-Tick, Palette-Caret, „example"-Hervorhebung im Statustext, aktiver Nav-/Achsen-Tick |
| `--primary-foreground` | **[shadcn]** | weiß / `#f2f6f9` | Text/Icon auf Cyan-Fläche (im Screen kaum belegt — für Buttons später) |
| `--accent` | **[shadcn]** | `#e9f6fc` | Selektions-/Aktiv-Fläche: aktive Typ-Zeile in der Nav, ausgewählter Palette-Eintrag „invoice" |
| `--accent-foreground` | **[shadcn]** | `#0077a8` (≈ `#0377a8`) | Text auf dem Cyan-Tint: „invoice" in aktiver Zeile/Palette, aktiver Wire-Node-Text im Inspektor |

> Hinweis: shadcn-`accent` ist per Default ein **neutrales** Hover-Grau. Wir belegen es hier mit dem
> **Cyan-Tint** (= Selektion). Falls später zusätzlich ein *neutrales* Row-Hover gebraucht wird,
> kommt dafür ein eigener `--hover-muted` **[neu]** dazu.

---

## 4 · Linien / Borders

| Token | Quelle | Roh-Wert(e) | Wo im Layout |
|---|---|---|---|
| `--border` | **[shadcn]** | `#e6eaee` (+ `#e6eaef`) | Standard-Kanten: Body/Header/Nav/Rail-Trenner, aktiver-Werkzeug-Marker, Inspektor-Kante, Property-Such-Rahmen |
| `--input` | **[shadcn]** | `#c4ccd4` | Control-Rahmen: Endpoint-Switcher; kbd-Tasten-Border (`#ccd4db`) |
| `--ring` | **[shadcn]** | `#4a5562` | Fokus/Betonung: 1.5px-Rahmen der Cmd+K-Pille & des Palette-Panels |
| `--border-subtle` | **[neu]** → `neutral/200` | `#e0e5ed` (bündelt `#dbe3eb` Grid, `#eaeef2` Palette-Divider, `#d4dae0`) | feine Trenner: Tabellen-Zeilentrenner, **vertikale Grid-Linien**, Palette-Divider |
| `--border-emphasis` | **[neu]** → `neutral/300` | `#bdc7d1` | Tabellen-Kopf-Unterstrich („kopf-rule") + Wire-Konnektoren im Inspektor |
| `--border-strong` | **[neu]** → `neutral/700` | `#4a5562` | schwerste/dunkelste Linie: 2px-**Mess-Achse** oben am Status-Anker-Band (Signatur-Motiv) |

> **Linien-Skala:** `border-subtle` < `border` < `border-emphasis` < `border-strong` (aufsteigendes Gewicht).
>
> **Entscheidung (2 statt 4):** `grid-line` und `divider-faint` **verworfen** → in `border-subtle`
> gebündelt. Auf Primitive-Ebene aliasieren alle Border-Tokens bestehende Tiers — **keine neuen
> Primitives**: `border`/`border-subtle` → `neutral/200` (`#e0e5ed`≈), `border-emphasis` → `neutral/300`
> (`#bdc7d1`≈), `border-strong` → `neutral/700` (`#4a5562`, = Wert von `ring`). `border-subtle` teilt
> sich aktuell den Wert mit `border`; der eigene Name hält den Divergenzpunkt offen.

---

## 5 · Signatur-Dekor & Marker

Vier Rollen — alle **wertgleich** zu vorhandenen Tokens; bewusst **kein** eigener Token (außer der Mess-Achse,
die als `border-strong` in die Linien-Skala §4 wanderte).

| Rolle | Wo im Layout | Lösung |
|---|---|---|
| Mess-Achse | 2px-Linie oben am Statusband | → **`border-strong`** (§4) |
| blau-Tick | Cmd-Pille-Prefix, Palette-Caret, Achsen-Tick | → **`primary`** (kein eigener Token). Glow `rgba(0,159,227,.5)` = Effekt-Token (Kategorie Schatten) |
| Pflicht-Häkchen | Spalte `PFLICHT` | → **`foreground`** (dunkle Tinte `#1a2230`, kein Grün; eigener Token erst, wenn Pflichtfelder eine Kennfarbe bekommen) |
| Verbindungs-Punkt | „verbunden": Header-Switcher + Statusband | → **`primary`** vorerst; gehört in die echte **Status-Familie** (§8), nicht hierher |

---

## 7 · Quelle / Source — **monochrom (Entscheidung: Option A)**

Quelle (System / Base / Custom / Relationship) bleibt bewusst **monochrom** — **keine** Quell-Farbfamilie.
Sie ist über Text + Position erkennbar, nicht über Farbe. Auflösung über bestehende Tokens:

| Element | Roh-Wert | Ziel-Token |
|---|---|---|
| `seg-system`, `seg-app` (Balkensegmente) | `#9ea8b5` | `muted-foreground` (≈ `neutral/400`-Tier) |
| `seg-rel` (Relationship-Segment) | `#ccd1d9` | `neutral/300`-Tier (≈ `border-emphasis`/`input`) |
| Quell-Spalte „SYSTEM / BASE·… / CUSTOM" | `#6b7585` | `muted-foreground` |
| Gruppen-Trenner „SYSTEM · EXAMPLE · 9" | `#1a2230`/`#6b7585` | `foreground` / `muted-foreground` |

> Verworfen: Quell-Farbfamilie (`source-system/-base/-custom/-relationship`). Hätte neue Buntfarben
> verlangt, die im Screen nicht existieren. Falls Quelle später visuell stärker getrennt werden soll,
> ist das eine echte **Palette-Erweiterung** — kein Ableiten aus diesem Screen.

---

## 8 · Im Screen abwesend, fürs DS aber nötig

Nirgends im Screen sichtbar — als **Platzhalter** (Raw-Hex + Marker ` ⚠`, kein Alias) angelegt, damit das
shadcn-Set vollständig ist. Werte noch zu designen:

- `secondary ⚠` `#f5f5f5` · `secondary-foreground ⚠` `#343434` — shadcn-Default-Grau.
- `destructive ⚠` `#e7000b` · `destructive-foreground ⚠` `#fafafa` — shadcn-Default-Rot/Off-White.
- `chart-1…5 ⚠` `#e76f51 · #2a9d8f · #264653 · #e9c46a · #f4a261` — shadcn-Default-Palette (Sea/Earth), für spätere Datenvisualisierung.

Noch **nicht** angelegt (kommt als eigenes Design):
- Status-Familie **offline / Fehler / Warnung** **[neu]** — „connected" ist Cyan; getrennte/fehlerhafte Verbindungen brauchen Rot/Amber.
- `--sidebar-primary` ist als shadcn-Token vorhanden (aliased `cyan/500`), im Screen aber ungenutzt.

---

## Zusammenfassung in Zahlen

- **20 distinkte Roh-Farbwerte** → kollabiert auf **2 Primitive-Familien** (`neutral` 8 Steps, `cyan` 3 Steps) + `base/white`.
- **Semantic-Layer:** 26 shadcn-Tokens (2 in `overlay*` umbenannt) + **6 Custom** angelegt:
  `input-placeholder`, `border-subtle`, `border-emphasis`, `border-strong`, `inverse`, `inverse-foreground`.
- Bewusst **kein** eigener Token: `tick-accent`, `marker-required`, `status-connected` (nutzen `primary`/`foreground`);
  `text-tertiary`, `grid-line`, `divider-faint`, `popover-muted` (in andere Tokens gebündelt).
- Offen: **Source** (Batch 5) · **Status-Familie** + **destructive/secondary** (§8, Platzhalter gesetzt).

---

## Roh-Wert-Inventar (Referenz)

| Roh-Wert | Vorkommen | Rolle (Ziel-Token) |
|---|---|---|
| `#1a2230` | Primärtext, dunkle Pillen, Pflicht-Häkchen | `--foreground` / `--inverse` (=`neutral/900`); Pflicht-Häkchen nutzt `--foreground` |
| `#4a5562` | Fokusrahmen, Mess-Achse | `--ring` / `--border-strong` (= `neutral/700`) |
| `#6b7585` | Tabellen-Sekundärtext (häufigster Wert) | `--muted-foreground` |
| `#6a7482` | Toggle-/kbd-Text | `--muted-foreground` (Dublette) |
| `#737d8c` | „…N weitere" Link | `--muted-foreground` (Dublette) |
| `#8c96a6` | Tabellen-Spaltenköpfe | `--muted-foreground` (zusammengelegt) |
| `#979fa8` | Eyebrow-Labels, Meta · Platzhalter | `--muted-foreground` (Labels) / `--input-placeholder` = `neutral/400` (Platzhalter) |
| `#9ea8b5` | Anteils-Leiste seg-system/custom | `--muted-foreground` (Source monochrom) |
| `#b8c0c8` | Palette-Platzhalter | `--input-placeholder` (gebündelt) |
| `#bdc7d1` | Kopf-Regel, Wire-Konnektoren | `--border-emphasis` → `neutral/300` |
| `#ccd1d9` | Anteils-Leiste seg-rel | `neutral/300`-Tier (Source monochrom) |
| `#ccd4db` | kbd-Border, Statusband-Divider | `--input` |
| `#c4ccd4` | Switcher-Border | `--input` = `neutral/300` |
| `#d4dae0` | Cmd-Prefix-Divider | `--border-subtle` → `neutral/200` |
| `#dbe3eb` | vertikale Grid-Linien | `--border-subtle` (gebündelt) |
| `#e0e5ed` / `#e0e5eb` / `#e0e5ea` | Zeilen-/Palette-Trenner | `--border-subtle` → `neutral/200` |
| `#eaeef2` | Palette-Gruppen-Linien | `--border-subtle` (gebündelt) |
| `#e6eaee` / `#e6eaef` | Standard-Kanten | `--border` |
| `#f2f5f8` / `#f4f6f8` / `#f6f8fa` | Chrome-Flächen | `--muted` / `--sidebar` |
| `#fafbfc` | Inspektor, Suchfeld | `--card` |
| `#fbfcfd` | Palette Prompt/Footer | `--card` (gebündelt) |
| `#f2f6f9` | Text auf dunkler Pille | `--inverse-foreground` → `neutral/50` |
| `#ffffff` | App-Grundfläche / Palette-Liste | `--background` / `--overlay` |
| `#009fe3` | Marken-Cyan / Status-Punkt / Tick | `--primary` (Status-Punkt & Tick nutzen `primary`) |
| `#0077a8` (≈ `#0377a8`) | Cyan-Text auf Tint | `--accent-foreground` |
| `#e9f6fc` | Cyan-Selektions-Fläche | `--accent` |
| `rgba(0,159,227,.5)` | Cyan-Glow (Tick-Shadow) | Effekt-Token (Kategorie Shadow) |

# Component-Port · Dialog (2026-06-10)

Erstport des shadcn **radix-nova dialog** in die Agentport DS — Composite-Verfahren
(composites.md), Figma + Code + neuer Token. Gate grün (39 Tests), /figma-verify CLEAN,
Done-Test über 4 reproduzierte Beispiel-Instanzen.

## Anatomie / Exposure-Surface

10 Code-Parts: `Dialog/Trigger/Portal/Close` (verhaltend, kein Rendering) + `Overlay`,
`Content` (showCloseButton-Prop, nestet ghost icon-sm Button + X), `Header`, `Footer`
(showCloseButton-Prop, getöntes Band mit Bleed), `Title`, `Description`. Kein CVA.

Exposure-Modell pro Variationspunkt (composites.md §1):

| Variationspunkt | Mechanismus | Wo |
|---|---|---|
| Titel / Beschreibung | Text-Props `title#`/`description#` | `.Dialog` |
| X-Close an/aus | Boolean `showCloseButton#` (Visibility der genesteten ghost `.Button`-Instanz) | `.Dialog` |
| Footer an/aus | Boolean `showFooter#` (Visibility des Footer-Slots) | `.Dialog` |
| Body-Inhalt (offen, n Kinder) | **Slot** `body#`, leer gebaut; `showBody#`-Boolean auf Wrapper (s. Findings) | `.Dialog` |
| Footer-Inhalt | **Slot** `footer#` mit **Default-`.Dialog/Footer`-Instanz** (User-Entscheidung) | `.Dialog` |
| Footer-Actions (n Buttons) | **Slot** `actions#` in `.Dialog/Footer`, Default = Cancel (outline) + Save (default) | `.Dialog/Footer` |
| Scrim | eigene Komponente `.Dialog/Overlay` (User-Entscheidung), nicht Teil der Panel-Komposition | — |

## User-Entscheidungen (T2.7)

1. **Scrim = eigene `.Dialog/Overlay`-Komponente**; `.Dialog` bleibt reines Panel.
2. **Neuer Semantic-Token `scrim`** statt totem `bg-black/10` (Details: token-analysis-color.md Batch 6).
3. **Footer fest verbaut** (Boolean) **aber als eigene `.Dialog/Footer`-Komponente default-instanziiert
   im Footer-Slot** — Band-Styling garantiert, Actions editierbar, Komponente swap-/wiederverwendbar.
4. **Titel = `text-title`** (18/600; nova 16/500 hat keine DS-Stufe; use = „Abschnitts-/Sektions-Titel").

## T3 — Mapping (stock → DS)

| Part | Stock (nova) | DS | Warum |
|---|---|---|---|
| Overlay | `bg-black/10` | `bg-scrim` | Core-Farben tot; **neuer Token** (neutral/900 @10%, Alpha im Token) |
| Overlay | `supports-backdrop-filter:backdrop-blur-xs` | behalten | Blur-Namespace nicht resettet |
| Content | `gap-4` / `p-4` | `gap-xl` / `p-xl` | 16px → space-xl (Mapping per px-Wert) |
| Content | `bg-popover text-popover-foreground` | `bg-overlay text-overlay-foreground` | overlay = bevorzugter Name; popover nur Legacy-Alias |
| Content | `text-sm` | `text-body` | tote font-size; Body-Default der App |
| Content | `ring-1 ring-foreground/10` | `border` + `shadow-elevation` | DS-Overlay-Tiefe (wie Command-Palette): echte Kante statt Hairline-Ring, Elevation trägt Bedeutung |
| Content | `rounded-xl`, `max-w-*`, `top-2 right-2` | behalten | radius-xl „Große Flächen/Fenster"; Geometrie numerisch |
| Header | `gap-2` | `gap-md` | 8px |
| Footer | `-mx-4 -mb-4 p-4` | `-mx-xl -mb-xl p-xl` | Bleed muss Panel-Padding (xl) spiegeln |
| Footer | `gap-2` | `gap-md` | 8px |
| Footer | `bg-muted/50`, `border-t`, `rounded-b-xl` | behalten | muted.use = „Bänder"; Opacity-Modifier auf DS-Token valide |
| Title | `text-base leading-none font-medium` | `text-title` | alle drei tot; Format trägt Größe+Gewicht+LH |
| Description | `text-sm text-muted-foreground` | `text-body text-muted-foreground` | Sekundärtext |
| Description | `*:[a]:underline …` Link-Styling | behalten | valide Namespaces |

## Figma — gebaute Assets (Section "Dialog" `3589:788`, Page `3126:2`)

- `.Dialog` (Komposition) `3592:794` — Panel 384 fix × HUG; fills→`overlay`, stroke→`border` (1, INSIDE),
  radius→`radius-xl` (clip), Effect-Style **Elevation**. Struktur: `content` `3592:795` (p/gap→`space-xl`)
  → [`header` `3592:796` (gap→`space-md`; `title` `3592:797` Style **Title** + `overlay-foreground`;
  `description` `3592:798` Style **Body** + `muted-foreground`), `body-region` (Wrapper, visible↔`showBody#3606:0`)
  → `body`-**Slot** `3609:890` (leer)] · `footer`-**Slot** `3593:795` (visible↔`showFooter#3593:5`,
  Default = `.Dialog/Footer`-Instanz `3593:796`) · `close` `3593:806` (ghost icon-sm `.Button`-Instanz,
  ABSOLUTE 348/8, Icon via swapComponent→`.Dialog/Icon/Close`; visible↔`showCloseButton#3593:4`).
  Props: `title#3593:2` · `description#3593:3` · `showCloseButton#3593:4` · `showFooter#3593:5` ·
  `showBody#3606:0` · Slots `footer#3593:1`, `body#3609:0`.
- `.Dialog/Footer` `3591:788` — Band: fill→`muted` @50% Paint-Opacity, strokeTop→`border`,
  rounded-b→`radius-xl`, p→`space-xl`, justify-end; `actions`-**Slot** `3591:789` (gap→`space-md`),
  Default = Cancel (outline `3591:790`) + Save changes (default `3591:794`) als echte `.Button`-Instanzen.
- `.Dialog/Overlay` `3590:791` — fill→**`scrim`** (`VariableID:3588:2`), Effect BACKGROUND_BLUR 4
  (= `backdrop-blur-xs`), 480×360 resizable.
- `.Dialog/Icon/Close` `3590:790` — 16×16, RiCloseLine-Vektor, fill→`foreground`.
- **Beispiel-Instanzen (Done-Test):** `dialog-demo` `3595:807` (nur Props; Footer-Default = Cancel+Save)
  · `scrollable-content` `3595:829` (showBody, Body-Slot gefüllt, showFooter=false)
  · `sticky-footer` `3598:840` (Body + Actions umgebaut auf einzelnen Close)
  · `no-close-button` `3603:858` (showCloseButton=false, Close-only-Footer)
  · `dialog-on-overlay` `3604:888` (Präsentation: Auto-Layout-Frame, Overlay ABSOLUTE inset-0,
  Panel zentriert in-flow — Overlay ist bewusst NICHT Teil der Komposition).
- Verwendete Variablen: overlay `3037:6` · overlay-foreground `3037:7` · muted `3037:12` ·
  muted-foreground `3037:13` · foreground `3037:3` · border `3038:4` · radius-xl `3073:5` ·
  space-md `3070:6` · space-xl `3070:9` · **scrim `3588:2` (neu)**.

## Example-Inventory (T2.5/T5)

| Doc-Beispiel (radix-base dialog-example) | Status |
|---|---|
| With Form | **adaptiert** → Story `Default`: Struktur (Header + 2-Aktionen-Footer Cancel/Save) behalten, Field/FieldGroup/FieldLabel-Zeilen entfernt (**un-portiert, geskippt**) |
| Scrollable Content | **kept-distinct** → Story `ScrollableContent` + Figma-Beispiel |
| With Sticky Footer | **kept-distinct** → Story `StickyFooter` + Figma-Beispiel |
| No Close Button | **kept-distinct** → Story `NoCloseButton` + Figma-Beispiel |
| Chat Settings | **skipped-missing-dep** (Tabs, Select, NativeSelect, Switch, Checkbox, Field, Tooltip un-portiert) |
| (alt new-york `dialog-demo`) | dedupe: = With Form mit Label/Input statt Field — gleiche Struktur |

## Code

- `libs/ui/src/components/ui/dialog/` — `dialog.tsx` + `.stories.tsx` (4 Stories) + `.spec.tsx`
  (7 Tests inkl. Typo-/Token-Survival) + Barrel; Root-Barrel-Export ergänzt.
- Deps: `radix-ui` (Dialog-Primitive, vorhanden), `@remixicon/react` (RiCloseLine), Button (genestet).
  `ui:add` schrieb flache `button.tsx` → **gelöscht** (Shadowing-Trap); `IconPlaceholder`→`lucide-react`
  → in T2 auf Remix geswappt (Command-Finding #1 reproduziert).
- jsdom: keine neuen Polyfills nötig (Radix Dialog rendert mit bestehendem Setup).
- Gate: `npm run check` grün (lint + test 39 + typecheck). Stories-tsconfig hat **keine DOM-lib** →
  Play-Functions ohne `document`/DOM-Globals schreiben (Assertion über Trigger-`aria-expanded`).
- Previews: `http://localhost:6006/?path=/story/ui-dialog--default` · `…--scrollable-content` ·
  `…--sticky-footer` · `…--no-close-button`

## Findings (Figma-Mechanik — Details in skill-feedback.md)

1. **SLOT niemals direkt visibility-binden:** `componentPropertyReferences={visible}` (+ `visible=false`)
   auf einem SLOT-Node **degradiert ihn zu FRAME** — Slot-Verhalten weg, Instanz-Slot-Inhalte verworfen
   (ex2/ex3 mussten neu befüllt werden). Fix: Wrapper-FRAME (`body-region`) trägt das Boolean, der SLOT
   bleibt unangetastet darin.
2. **Leerer Slot hat unzuverlässige Default-Höhe** (~100px trotz HUG) → body-los entstand Slack;
   `showBody`-Boolean (default false) blendet die Region aus → Default-Panel codegleich tight.
3. **Slot-Defaults in Instanzen:** lesbar; `remove()` geht, aber **jede Strukturmutation invalidiert
   alle gehaltenen Refs** — pro Operation neu auflösen; tief verschachtelte Defaults (Footer→Actions)
   brauchen z. T. **getrennte use_figma-Calls** (in-Call-Re-Resolve reicht nicht). Das direkte
   Slot-Default-**Instanz**-Kind selbst (Footer in `footer#`) ist **nicht entfernbar**
   („Removing this node is not allowed") — Abdeckung über `showFooter`-Boolean.
4. **Icon-Swap-Ziel exakt matchen** (`mc.name === '.Button Icon'`), nie `/icon/i` — `size=icon-sm`
   (Base-Member) kollidiert.

## /figma-verify

CLEAN (eigene Flags 0). 10 geerbte `state-layer`-Flags innerhalb `.Button/Base` (Button-interne
Anatomie, validiert im Button-Port, out-of-scope). Hints bewusst: Footer-Band edge-flush (Bleed),
Overlay edge-flush (Scrim), Padding überall symmetrisch.

## Offen

- **CommandDialog un-deferren** (separater Schritt): Funktion + Export + Story in `command/` re-adden —
  Dialog ist jetzt da. Katalog-Hinweis aktualisiert.
- `destructive` bleibt ⚠-Platzhalter (hier nicht verwendet).
- Scrim-Wert bei Änderung an `neutral/900` in Figma manuell nachziehen (Raw-RGBA, kein Alias möglich).

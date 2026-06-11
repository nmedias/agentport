# Skill-Feedback — /shadcn-component-port · Dialog (2026-06-10)

## 1. T2 Dependency-Audit — lucide-IconPlaceholder-Finding reproduziert (Command #1)

**Gap:** Skill (SKILL.md T2 / composites.md §2) nennt den Fall weiterhin nicht: nova-Source nutzt
`IconPlaceholder`; `ui:add` materialisiert ihn als `lucide-react`-Import — Lib ist nicht installiert
→ Gate bricht, wenn der Swap erst in T6 passiert.
**Verified:** Zweiter Treffer in Folge. Dialog landete mit `import { XIcon } from "lucide-react"`
(Command-Run: identisch mit anderen Icons). Registry-JSON nennt das Remix-Äquivalent bereits im
`IconPlaceholder`-Aufruf (`remixicon="RiCloseLine"`) — die Übersetzung ist mechanisch ablesbar.
**Candidate fix:** In T2 (Audit-Schritt) aufnehmen: nach `ui:add` jede `lucide-react`-Import-Zeile
auf das `@remixicon/react`-Äquivalent swappen; das Ziel-Icon steht im Registry-JSON als
`remixicon`-Prop des `IconPlaceholder`. Dep-Resolution in T2, keine T6-Kosmetik.
**Status:** open (bestätigt Command-Run-Finding #1; dort bereits als open erfasst)

## 2. figma-build.md · Icon-Swap — Swap-Target per Main-Namen treffen, nicht per /icon/-Match

**Gap:** Das Nesting-Rezept (genesteter DS-Button, Icon via `swapComponent`) sagt nicht, WIE das
Swap-Target im Instanz-Baum zu identifizieren ist. Ein generischer Namens-Match (`/icon/i` über die
Main-Component-Namen) trifft zuerst die **`.Button/Base`-Instanz** — deren Member-Name `size=icon-sm`
enthält „icon". Der Swap ersetzt dann die ganze Base (Geometrie/States weg), nicht das Icon.
**Verified:** Dialog-Run, Close-Button: erster Swap traf `size=icon-sm` (Base) statt `.Button Icon`;
visuell unauffällig (X erschien korrekt), strukturell falsch — nur am Rückgabewert erkannt.
Fix: Base zurückgeswappt, dann exakt `mc.name === '.Button Icon'` geswappt → korrekt.
**Candidate fix:** In figma-build.md §Icons/Nesting ergänzen: das Swap-Target ist die Instanz, deren
**Main-Component exakt das dedizierte Icon-/Swap-Target-Component** ist (Name aus dem Katalog, z. B.
`.Button Icon`); nie per Substring über Variant-Member-Namen matchen (`size=icon-*` kollidiert).
Nach jedem Swap das Ergebnis strukturell prüfen (welcher Main hängt jetzt wo), nicht nur visuell.
**Status:** open

## 3. figma-build.md/composites.md · Slot-Defaults in Instanzen — Verhalten präzisiert (Command #3 verfeinert)

**Gap:** Command-Finding #3 sagt pauschal „Default-Content virtuell/read-only, Slots LEER bauen".
Der Dialog-Run (Slot MIT Default-Instanz, auf User-Wunsch) zeigt ein differenzierteres Bild, das
weder figma-build.md („remove() of slot defaults IS allowed") noch das Command-Finding korrekt trifft.
**Verified:** Dialog-Run, footer-Slot mit Default-`.Dialog/Footer`-Instanz:
1. Slot mit Default präsentiert sich in der Instanz als **FRAME, nicht SLOT** → `findOne(type==='SLOT')`
   findet ihn nicht (leerer Slot bleibt SLOT). Match per **Name**, nicht Typ.
2. Namen/visible der Default-Kinder sind **lesbar** (kein Node-not-found beim Lesen wie im Command-Run).
3. `remove()` eines Default-Kinds **funktioniert**, invalidiert aber die Geschwister-Refs (vorab
   geklontes Array → zweites remove wirft „Node not found"). → **Ein remove pro Re-Resolve**:
   `while (slot.children.length) slot.children[0].remove()`-Muster statt `[...children].forEach(remove)`.
4. Append in leeren Instanz-Slot geht direkt; appendete Kinder ebenfalls erst nach Re-Resolve mutierbar.
**Candidate fix:** figma-build.md §Slots „Filling a slot IN AN INSTANCE" ersetzen durch das
Re-Resolve-Invariant: **JEDE Strukturmutation in einem Instanz-Slot (append UND remove) invalidiert
alle gehaltenen Kind-Refs** → vor jeder Folge-Operation neu auflösen; Slot in Instanzen per Name
matchen (Typ kippt mit Default-Content zu FRAME). composites.md/Command-#3 entsprechend abschwächen:
Slots mit sinnvollem Default sind benutzbar — Defaults sind entfern-/ersetzbar, nur eben unter dem
Re-Resolve-Invariant.
**Status:** open

## 4. figma-build.md · Slots — SLOT-Node nie direkt visibility-binden (degradiert zu FRAME)

**Gap:** figma-build.md kennt Boolean-Props für Visibility, warnt aber nicht: setzt man
`componentPropertyReferences = { visible }` (+ `visible = false`) **direkt auf einem SLOT-Node**,
**konvertiert Figma den SLOT still zu einem FRAME** — Slot-Verhalten weg (Instanz-Appends werfen
„New parent is an instance"), und **bestehende Slot-Inhalte in Instanzen werden verworfen**.
**Verified:** Dialog-Run: body-Slot per visible↔showBody gebunden → Master-Node `type: FRAME`;
ex2/ex3 verloren ihre gefüllten Bodies; Appends schlugen fehl. Fix verifiziert: Wrapper-FRAME
(`body-region`) trägt Boolean+visible, frischer SLOT darin — Slot-Verhalten + Instanz-Fills ok.
**Candidate fix:** In figma-build.md §Slots: „Ein optionaler Slot = Wrapper-FRAME (trägt das
visibility-Boolean) + SLOT als dessen Kind. Visibility-Refs/visible direkt am SLOT degradieren ihn
zu FRAME und verwerfen Instanz-Inhalte." Zusätzlich: Master-Slot-Umbauten NACH gebauten
Beispiel-Instanzen kosten deren Slot-Overrides → Surface erst final definieren, dann Beispiele (T4-
Reihenfolge bestätigen).
**Status:** open

## 5. figma-build.md · Slots — leerer Slot rendert mit Default-Höhe (~100px), nicht 0

**Gap:** „Default geometry is unreliable" nennt 100×100/HUG-Varianten beim ANLEGEN; nicht aber, dass
ein leer gelassener Slot trotz `layoutSizingVertical='HUG'` mit ~100px Resthöhe im Layout steht —
ein „offene Region, default leer"-Slot erzeugt sichtbaren Slack in jeder Instanz ohne Content.
**Verified:** Dialog-Run: body-Slot leer → body-lose Dialoge ~100px zu hoch (Master 264 statt 148).
Fix: Wrapper mit visibility-Boolean (default aus) — Default-Panel codegleich tight.
**Candidate fix:** §Slots ergänzen: leere optionale Slots hinter ein visibility-Boolean am Wrapper
legen (Muster aus Finding #4); Slots, die immer Content tragen, sind nicht betroffen.
**Status:** open

## 6. SKILL.md T2.5/T6 · Stories — Play-Functions ohne DOM-Globals schreiben

**Gap:** T2.5 sagt nichts dazu, dass die Stories-Typecheck-Umgebung des Projekts (`tsc --build`)
**keine DOM-lib** lädt: `document`/`ownerDocument` in einer Play-Function brechen `nx typecheck`,
obwohl Tests/Storybook laufen. Portal-Komponenten (Dialog, Popover …) verleiten genau dazu
(Inhalt rendert außerhalb des Canvas).
**Verified:** Dialog-Run: `within(document.body)` → TS2584; `canvasElement.ownerDocument` → TS2339.
Lösung: Assertion über canvas-interne Zustände (Trigger-`aria-expanded` via jest-dom-Matcher aus
`storybook/test`) — typecheck grün.
**Candidate fix:** T2.5-Bullet: „Play-Functions DOM-global-frei halten; bei Portal-Komponenten über
canvas-interne ARIA-Zustände des Triggers asserten (Deep-Assertions ins Portal gehören in die Spec,
nicht in die Story)."
**Status:** open

## 7. T6 — „rendered-output check" ist zahnlos, wenn nur URLs gereicht werden

**Gap:** T6 sagt „preview-stories → surface every URL (rendered-output check)" — der Run hat die URLs
gereicht, das Rendering aber nie inspiziert. So shippte der Port `sm:max-w-sm`, das durch die
`--spacing-*`/`--container`-Kollision (benannte Steps schatteten die Container-Skala in
w/min-w/max-w/basis) als **6px** statt 24rem kompilierte. Gate (lint/test/typecheck) und Spec-
Klassen-Assertions sehen kompilierte CSS-Werte prinzipiell nicht; /figma-verify prüft nur Figma.
Der User fand den Bug, nicht das Verfahren. (Kollision inzwischen gefixt: Steps via @utility nur auf
gap/p/m — tokens-reference §3 Kollisions-Regel.)
**Verified:** Dialog-Run + Folge-Fix 2026-06-11; Dist-CSS zeigte `max-width: var(--spacing-sm)` = 6px.
**Candidate fix:** T6 verschärfen: mindestens eine Story **gerendert prüfen** (Browser/Screenshot,
nicht nur URL ausgeben) mit Blick auf Geometrie (Breiten/Höhen plausibel?); zusätzlich bei Nutzung
von T-Shirt-Namen auf Sizing-Utilities (`max-w-*`, `w-*`, `basis-*`) gegen tokens-reference §3
Kollisions-Regel prüfen. Alternativ ein Dist-CSS-Grep der neuen Klassen auf erwartete Werte.
**Status:** open (Kollision selbst gefixt `5b62f77`; das Verfahrens-Loch bleibt offen)

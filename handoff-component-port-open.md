# Handoff — Component-Port: Offene Punkte + Skill-Findings (konsolidiert)

>  Locator/Status aller Components + Figma-Node-IDs:
> `design-docs/design-system/components-reference.md` (**zuerst lesen**), Token-Crosswalk:
> `design-docs/design-system/tokens-reference.md`, Run-Details: `agent-runs/`.

**Stand 2026-06-22:** `master` = **18 Components** ff (kein Remote, `npm run check` grün, 260 Tests / 57 Files).
**Slider** 06-22 portiert + per fast-forward auf `master` gemerged (s. Offene Punkte #2).
**Seit 06-12 (2026-06-16…06-19) dazu:** **ChoiceCard** portiert (DS-authored Composite — 3 dünne
Wrapper `ChoiceCardCheckbox`/`ChoiceCardSwitch`/`ChoiceCardRadio` über eine interne `ChoiceCardShell`
+ `useFieldId`-Hook; checked-Tint = Zwei-Cyan-Token-Modell, voll variabel-gebunden) und **Select**
portiert (volles Radix-Primitive, `radix-ui`-Umbrella behalten; Sub-Parts mit eigenen Story-Files).
Dazwischen ein **Component-Sync-Sweep 2026-06-17** (Figma→Code-Reconcile über ~18 Sets). Der Katalog
`components-reference.md` ist auf diesem Stand — die dortigen Node-IDs/Status sind autoritativ.

**Parallel-Batch 06-22 (tooltip · toggle · toggle-group · popover):** 4 Components portiert (Figma + Code;
3 Background-Agents parallel, Figma-Set-Build über einen `/tmp`-`mkdir`-Mutex serialisiert — eine
Plugin-Verbindung), zu **22 Components** auf Branch `feat/shadcn-port-batch` integriert (4 Commits, additive
`index.ts`/Katalog-Konflikte als Union aufgelöst, ff-bereit auf `master`). **Gate grün im voll aufgesetzten
Main-Tree: `npm run check` = 298 Tests / 66 Files** (lint + typecheck + test; ein Select-Portal-`play`-Test
flaky, im Re-Run grün — Bestand, nicht aus dem Batch). **NOCH NICHT auf `master` ge-ff-merged (User-Gate).**
`toggle` = co-portiert (Hard-Dep von toggle-group, Finding B10). Runs:
`agent-runs/component-port/2026-06-22-{tooltip,toggle-group,popover}/`.

Form-Toggle-Batch (Checkbox · Switch · RadioGroup) **gemerged** (Code + token-gebundene Figma-Sets +
permanente Usage-Examples + Figma→Code-Sync + Field-komponierte Stories) + Skill-Edit (usage-examples-
Deliverable + Doc-Treue ins `/shadcn-component-port` gehoben) gemerged. Standard: Glow = literal-Alpha
DROP_SHADOW `showShadowBehindNode:false` (verbatim vom `.Input`-Focus); Stories in Doc-Komposition (Field-Familie).
**FIGMA-NACHLAUF (extern, NICHT in git):** die 3 Usage-Example-Gruppen auf echtes `.Field`-Reuse umgebaut;
dafür `.Field` erweitert — `controlPosition [trailing,leading]`-Achse (control-leading für Checkbox/Radio) +
neues `.FieldLegend`-Set + invalid-error-Slot-Fix (Ursache: `clone()` degradiert SLOT→FRAME). `controlPosition`
= **Figma-only Fork** (kein Code-Prop). Details: Katalog `.Field`/`.FieldLegend` + die 3 `examples`-Einträge.
**18 Components** portiert + nova-aligned (Button, Input, Textarea, Kbd, Breadcrumb, InputGroup,
Command inkl. Palette-Variante + CommandDialog, Dialog, Badge, Separator, **Field (+ co-ported
Label)**, **Checkbox, Switch, RadioGroup**, **Select**, **ChoiceCard**, **Slider**) + Blocks-Layer
(`explorer/metadata-list`). Badge: 6 nova-Varianten (`ghost`/`link`
über die Brief-4, bewusst) mit `secondary`/`destructive` an ⚠-Platzhalter gebunden; Separator-Achse =
`orientation` (h/v); AsChild-Control-Footgun gefixt (#21). **Field = Surface-less Composite**
(`orientation × invalid` + 4 Slots, nur Spacing+Typo gebunden; FieldSet/Group/Legend/Title +
`responsive` = Code-only; FieldError→`destructive ⚠`); **Label public** (Hard-Dep von Field).
Composite-Verfahren validiert (**5×**: InputGroup/Command/Dialog/Field/ChoiceCard; Select = volles
Radix-Primitive, kein surface-less Composite), operativ in `/shadcn-component-port` (SKILL.md +
references/composites.md) + `/figma-build-rules` (Build-Mechanik + Snippets); Pflege via
`/component-sync` (Figma→Code).

**Skill-Architektur 2026-06-22 (diese Session):** `/figma-build-rules` **real ausgegliedert** aus
`/shadcn-component-port` (`8fa6872` Extraktion, `4973188` Grill-Härtung) — projekt-neutrales Build-Skill
(Plugin-API-Contract, Mechanism-Tabelle, Binding/Slots/Variant-Assembly, Interaction-State-Achse,
Usage-Examples, Verify-Triade, 3-Layer-Composite). `recon.js` + `build-variant-set.js` **verschoben** nach
`figma-build-rules/snippets/` + auf Platzhalter neutralisiert (kein fileKey/Font/Collection/SetName);
`read-set-values.js` bleibt bei `/component-sync`. Port/Sync **delegieren** ans Skill und behalten das
Projekt-Overlay (`config.json` — jetzt **inkl. `figma.font`**); `composites.md` = nur Port-Prozess-Delta
(Build-Mechanik → `/figma-build-rules §Composites`); `references/figma-build.md` gelöscht (→ Skill-Body).
Skill ist **dual-mode** (standalone + delegiert), description trägt jetzt eine negative Grenze gg. den
Voll-Port. Separat: `/storybook-rules` **projekt-neutral entkoppelt** (`692a4ac`) + um
Composite-Story-Doc-Regeln erweitert (`110ab0d`).

## Offene Punkte

1. **Skill-Findings** (Format + Triage s. **## Skill-Findings**; Formulierungs-Regel + „nie mid-run
   editiert" s. Blockquote dort). **Offen: nur B (27, zurückgestellt)** — selbst hergeleitet, Ergebnis
   stimmte → kodifizieren, kein Bugfix (Tabellen s. **### B**). Alle **erledigten** Findings (A-Strang
   06-22, Slider, A2/A4–A8, C1–C8) → **### Erledigt** (nicht in den Finding-Sections).
2. **Composite-Strang — nächster Schritt** (Verfahren mehrfach validiert, nichts blockiert): **Slider
   2026-06-22 PORTIERT + per fast-forward auf `master` gemerged** (`0df4af2`…`1ae9fab`; Gate grün
   260 Tests). Geometrie-Primitive wie Switch,
   kein CVA; Figma-Set 12 Member (`orientation × thumbs × state`, `thumbs` = Figma-only Fork) +
   Usage-Examples inkl. **FieldSlider → schaltet das beim Field-Port (06-12) übersprungene `field-slider`
   frei**. Details: `agent-runs/component-port/2026-06-22-slider/notes.md`, Katalog-Eintrag `Slider`.
   **Parallel-Batch 06-22 erledigt:** tooltip · toggle (co-port, Hard-Dep B10) · toggle-group · popover
   portiert (Figma + Code, Gate grün), auf `feat/shadcn-port-batch` ff-bereit. **`popover` + bereits
   portiertes `command` schalten den `combobox`-Endpoint-Switcher frei** (Explorer-Analyse) — offener
   nächster Block-Schritt, nicht gebaut. **Offener Folge-Punkt (Tooltip):** `kbd.tsx`
   `in-data-[slot=tooltip-content]:`-Override war für die alte DUNKLE Tooltip getunt → auf der neuen LIGHT-Chip
   near-invisible; bewusst nicht im Single-Port editiert. **Kbd-Touch-up ERLEDIGT 06-23** (`64cfaf8`): tooltip-content-Override
   `bg-surface/20`→`bg-muted-fill` (dezent, sichtbarer muted Keycap auf der Light-Chip; `text-ink` lesbar behalten), Gate grün + axe-clean. (s. B31 — der Skill-Edit „Sibling-Overrides vor dem Umtönen grep'en" bleibt als Leitplanke offen.)
   **Popover-Review 06-23:** Code/Docgen-Lücken (Root-Docgen + PopoverContent-Props + Sides-Story) gefixt
   auf `fix/component-review-polish` (s. A4, Gate grün 299). **④ Popover-Figma ERLEDIGT 06-23** (background agent
   `popover-figma`): Section gefixt — Children in ein weißes vertikales AL-Build-Frame `4390:2364` IN der Section
   re-parented, Section 321×203→1312×1133 → kein Spill (A5); `align` modelliert als **PopoverRoot-Set `4393:2391`**
   (align-Achse start/center/end, echte genestete Button+PopoverContent, kein Fork). figma-verify CLEAN + manueller
   Section-Check PASS; Katalog aktualisiert. Detail: `agent-runs/component-port/2026-06-23-popover-figma/notes.md`.
   **ERWEITERUNG 06-23 ERLEDIGT (s. A6):** Root-Modell static→voll interaktives Overlay — **PopoverRoot-Set `4402:2589`**
   (24 Member: open/closed × side × align), **HUG-SLOT-Trigger** (`asChild`-Proxy, default Button — Member-Frame trägt die
   Prototype-Reaction), Content `layoutPositioning=ABSOLUTE` (anchored, kein Reflow), **on-click+Esc-Prototype** (closed↔open).
   Member **HUGgen den Trigger** (Footprint=Trigger 50×32, Content floatet absolut außerhalb); alt `4393:2391` entfernt;
   Set **umbenannt PopoverRoot→Popover** (matcht Code-Root-Export); Section → 1718×2528. figma-verify CLEAN + Section-Check PASS; Katalog aktualisiert.
   Offen jetzt sonst: weiteres Composite (`/shadcn-component-port <name>`) oder Blocks-Arbeit auf den
   Palette-Bausteinen. *(ChoiceCard 06-16, Select 06-19, Slider 06-22, Batch-4 06-22 — alle erledigt.)*
3. **Dark-Mode-Token-Satz** in Figma + `.dark`-Block in globals.css (`--background-fixed` ausnehmen).
   Bis dahin: Light = einziger Mode.
4. **9 ⚠-Platzhalter-Tokens echt designen:** `secondary*`, `destructive*`, `chart-1…5`
   (`destructive` = invalid-State von `.Input`/`.Textarea`, jetzt auch Badge `secondary`/`destructive`-
   Varianten + Field `FieldError`). *(Übernommen aus `handoff-agentport-tokens-color.md`.)*
5. **Status-Familie** `connected/offline/error/warning`, **Anteils-Balken**, **Rail-Aktiv-Icons**.
   *(Ebenfalls aus dem Token-Handoff.)*


## Skill-Findings (konsolidiert · `/skill-feedback`-Format)

Aggregat über mehrere Port-/Sync-Runs (Quellen unten), dedupliziert, **pre-sortiert wie ein
`skill-feedback.md`**: Triage-Klasse **A → B → C**, darin nach **Ziel-Datei** gruppiert. Je Finding eine
**`Feld | Inhalt`-Tabelle** (Titelzeile + Zeilen `Why` · `Gap` · `Verified` · `Candidate fix` · `Status`).
**ID = Klasse + laufende Nummer in Anzeige-Reihenfolge** (`B1`…`B38`). Jeder Eintrag ist
**selbstständig** — hängen zwei Findings zusammen, steht das verwandte in Kurzform als `Bezug`-Zeile
(keine Sprung-Verweise zwischen Items). Die Run-Tags in Kursiv *(Badge #3)* = Quell-Nummer im
Quell-Run, unverändert. **User reviewt + wendet an** — Skills werden nie mid-run editiert.

> **Formulierungs-Regel für ALLE Finding-Edits (User 2026-06-22):** der in den Skill eingearbeitete Text
> ist **kompakt, generisch und agent-gerichtet** — KEIN Run-Bezug, KEINE Component-Namen (kein
> `.Button`/`Dialog`/…, kein „der X-Port"), keine User-Erklärungen; nur was der Agent zur Ausführung
> braucht. **Der Skill muss selbst vollständig sein:** Finding-/`skill-feedback.md`-/Run-Notes sind
> review-temporär und werden gelöscht → NICHT als dauerhafte Referenz verlinken; alles Ausführungs-
> relevante generisch in den Skill schreiben. Konkrete Belege/Beispiele sind reine Review-Evidenz und
> verschwinden mit jenen Dateien — nicht zur „Aufbewahrung" in den Skill ziehen. (= Memory `skill-writing-style`.)
> *(Run-Bezug/`Why`/`Verified` in DIESEM Tracker sind Review-Evidenz und korrekt — sie wandern NICHT mit
> in den Skill; nur der `Candidate fix` ist die Edit-Vorlage.)*

> **Triage-Achse** (= `/skill-feedback`): hat die Skill-Lücke etwas *gekostet*, oder bist du drumherum
> geroutet und trotzdem beim geplanten Ergebnis gelandet?
> - **A** — Lücke verursachte einen Defekt (Gate rot · Crash · Error · falsch gerendert · User fand den
>   Bug) → Skill-Edit = Leitplanke, **vorrangig**.
> - **B** — selbst hergeleitet, Ergebnis stimmte → Wissen kodifizieren, **kein** Bugfix → niedrige Prio.
> - **C** — Tooling/Repo-Fix oder schon abgedeckt (Entry = Evidenz).
>
> Grenzfall → die Klasse, deren *Test* zutrifft (korrekt erst NACH Defekt/verbrannter Iteration = A).
> *(Die `*(A)*`…`*(G)*`-/`#n`-Tags in den Titeln sind Run-interne Aufzählungen, NICHT die Klasse.)*

### Erledigt (chronologisch)

**Alle erledigten Findings sammeln sich hier** — die A/B/C-Sections unten führen nur noch Offenes/Deferred.

- **A-Strang (29, 2026-06-22)** in die 6 Skill-Dateien eingearbeitet (#62 verworfen).
- **Slider-Run (2026-06-22):** A #5 /storybook-rules (wrapper-render→`source.code`, S4-Promotion,
  `03178db`) · #2 → **A1** /shadcn-component-port T6 a11y (`8287d65`).
- **A2 · A4 · A5 · A6 · A7 · A8 (2026-06-23)** in 4 Skill-Dateien: **A2** /storybook-rules (`userEvent`
  statt rohem `element.click()`) · **A4** /docgen-props (Pass-through-Root ≠ prop-less → Omit+re-declare) ·
  **A5** /figma-build-rules + /figma-create-section (Section ≠ Auto-Layout → vertikales Build-AL-Frame) ·
  **A6** /figma-build-rules §Composites (interactive triggered overlay) · **A7** ebd. (`ABSOLUTE` braucht
  AL-Parent) · **A8** /figma-build-rules §Icons (connected sub-shape border-aware). **A3 verworfen**
  (Radix/shadcn-spezifisches a11y-Verhalten — gehört nicht ins framework-neutrale House-Pattern).
- **C1–C8 (2026-06-23):** **C1+C4** `build-variant-set.js` **gelöscht** (label/field-Zielfamilie
  durchportiert; neuere Ports umgehen es eh; Mechanik = Prosa in /figma-build-rules; Referenzen §Approach +
  T4 → „build from the recipes"; `recon.js` bleibt). **C2·C3·C7·C8** in /figma-verify: `visible:false`-Nodes
  skippen (C2) · Control-`handle/thumb/knob` über `track/rail/groove` → SOFT HINT (C3) · ganze Komposition
  statt nur Set prüfen (Caller: §Verify + T5) + Kind außerhalb der gefüllten Fläche = Spill-FLAG (C7, **ohne**
  Kontrast-Check) · full-bleed-Kind ≠ clipped (C8). **C5·C6** already covered im Memory
  `parallel-batch-worktree-pitfall`.

### A — gap caused a defect (priority)

**Keine offenen A-Findings** — erledigte s. **### Erledigt**.

### B — self-derived, result held (codify · deferred)

#### /figma-build-rules

**B1 · §Slots — Slot-Defaults in Instanzen: Re-Resolve-Invariant** *(Command #3 · Dialog #3)*

| Feld | Inhalt |
|---|---|
| Why B | one-remove-per-resolve-Verhalten selbst beobachtet, Slots korrekt gebaut. |
| Gap | §Slots deckt Instanz-Slot-Mutation nicht vollständig — Re-Resolve-Invariante, FRAME-vs-SLOT-Darstellung und Default-Materialisierung via `setProperties` fehlen. |
| Verified | Command-Run = virtuelle read-only Defaults (nicht entfernbar); Dialog-Run = lesbar + entfernbar unter Re-Resolve → Removal ist unzuverlässig. |
| Candidate fix | JEDE Strukturmutation (append UND remove) invalidiert gehaltene Kind-Refs → ein remove pro Re-Resolve (`while (slot.children.length) slot.children[0].remove()`), nie `[...children].forEach(remove)`. Slot MIT Default = in der Instanz FRAME (per Name matchen, leerer Slot bleibt SLOT); append ersetzt Defaults nicht (koexistieren sichtbar). `setProperties()` materialisiert geerbte Defaults → Component-Slot vor dem Instanziieren leeren / danach löschen. Per-Instanz komponierte Slots im Component LEER bauen. |
| Status | zurückgestellt. |

**B2 · §Binding recipes — Platzhalter-Vars tragen ` ⚠`-Namens-Suffix → `endsWith('/'+token)` verfehlt sie** *(Badge #3)*

| Feld | Inhalt |
|---|---|
| Why B | dok. `endsWith` gibt []; Agent band per vollem Namens-Scan korrekt (nicht Roh-Hex). |
| Gap | recon.js + die Binding-Beispiele matchen `name.endsWith('/'+token)`; die Placeholder-Tokens heißen `shadcn Default/secondary ⚠`, `…/destructive ⚠`, `chart-1…5 ⚠` (Space + Emoji) → still [] → Roh-Hex-Falle. |
| Verified | `endsWith('/secondary')` → []; voller Namens-Scan fand die ⚠-Vars. |
| Candidate fix | looser matchen (`includes` / trailing ` ⚠` strippen) UND notieren: die DS markiert Platzhalter mit ` ⚠` — sie SIND bindbar (an die echte ⚠-Var, nicht Roh-Hex; „nicht finalisieren" gilt weiter). *(also: recon.js, tokens-reference §1)* |
| Status | zurückgestellt. |

**B3 · §Binding recipes — Tinted bound surface (`bg-X/10`) braucht Alias-Resolve-Rezept** *(Badge #5)*

| Feld | Inhalt |
|---|---|
| Why B | Alias-Kette rekursiv aufgelöst → 10%-Rot mit erhaltener Bindung. |
| Gap | figma-build-rules sagt „Opacity + reale aufgelöste Farbe als Fallback", aber der Var-Wert ist meist `VARIABLE_ALIAS` → Primitive → Color, nicht direkt aus `valuesByMode` lesbar; ohne Rezept spreadet ein Agent den gebundenen Paint (verboten) oder setzt schwarz. |
| Verified | `bg-destructive/10` brauchte `resolveColor` über den Alias → 10%-Rot. |
| Candidate fix | „tinted bound surface"-Rezept: binden → Farbe rekursiv über die Alias-Kette auflösen → als Paint-Fallback setzen → Paint-Level-`opacity` (≠ Node-`opacity`, das dimmt Content mit — nur disabled). *(also: build-variant-set.js `tintVar`/`tintOpacity`-Branch)* |
| Status | zurückgestellt. |

**B4 · §Reuse/Nesting — lokale Component nesten = `.createInstance()` per Node-ID, NICHT `importComponentByKeyAsync`** *(Field #5)*

| Feld | Inhalt |
|---|---|
| Why B | importByKey warf „not found"; `getNodeByIdAsync` + `createInstance` ok. |
| Gap | „Reuse, don't rebuild" sagt „nest a real instance", aber nicht WIE für eine lokale (unpublished) Component im selben File; import-by-Key löst NUR publizierte Library-Components. |
| Verified | importByKey auf lokale `.Input`-Default → „not found"; node `3176:303` + `.createInstance()` ok. |
| Candidate fix | für Same-File die Variant-COMPONENT-Node per `getNodeByIdAsync('<variantNodeId>')` holen → `.createInstance()`. recon soll die Variant-Node-IDs liefern, nicht nur Keys. *(also: recon.js)* |
| Status | zurückgestellt. |

**B5 · §Variant set assembly — Two-Part-Geometrie-Toggle (Track+Thumb) braucht KEINE Base/state-layer-Maschinerie** *(Switch #4)*

| Feld | Inhalt |
|---|---|
| Why B | 10 flache Member ohne Base, controls-live + verify CLEAN. |
| Gap | figma-build-rules erklärt Base + state-layer für Content-Flächen; ein content-/tint-/active-loser Geometrie-Toggle braucht das nicht. |
| Verified | 10 flache Member, kein Base, controls-live + verify CLEAN. |
| Candidate fix | N flache Member (size×state) via `combineAsVariants`, Fill/Stroke/Effect/Layer-Opacity pro Member binden, Thumb-Kind-x numerisch versetzen. Base + state-layer nur für Content-Flächen (Buttons/Inputs). |
| Status | zurückgestellt. |

**B6 · §Slots — Fill-slot-in-instance: Zusätze zum Rezept** *(switch/radio/checkbox-examples)*

| Feld | Inhalt |
|---|---|
| Why B | clear+append / Read-back im Folge-Call funktionierte. |
| Gap | das §Slots-Rezept deckt die Instanz-Slot-Edge-Cases nicht. |
| Verified | — (aus den Example-Runs, nicht separat geprobt). |
| Candidate fix | Slot-Default-Text-Setter wirft „node not found" → clear+append, Read-back im SEPARATEN Call (Instanz-Slot-Mutation invalidiert die Node-ID im selben Tick); Clearing ko-entfernt/re-injiziert Sibling-Defaults → guarded per-id-Loop + Post-Append-Sweep; Text-Slots VOR dem control-Slot setzen; HUG-control-Slot hugt einen schmalen Control automatisch (nie die Instanz HUGen); Sibling-Slots via `query('SLOT[name=…]')`, nicht `findOne` über `componentPropertyReferences` (wirft auf stale nested-instance-IDs). |
| Status | zurückgestellt. |

**B7 · §Usage-examples — Selektions-Control + Field = control-leading** *(checkbox-examples)*

| Feld | Inhalt |
|---|---|
| Why B | `controlPosition`-Achse selbst gebaut, korrekt genestet. |
| Gap | §Usage-examples geht von einem control-trailing Field aus; eine Checkbox/Radio-Reihe ist control-LEADING. |
| Verified | — (Figma-only Fork gebaut, s. Katalog `.Field`/`.FieldLegend`). |
| Candidate fix | Example-Groups für Selektions-Controls nesten ein control-leading `.Field` (`controlPosition`-Achse, Figma-only Fork); Group-/Fieldset-Beispiele mit abweichender Item-Zahl vertikal komponieren (`.FieldSet` nestet fix 2 Fields). Per-field-Error → `.Field`-error-Slot; Gruppen-Error (FieldSet-Ebene) → separater Text. *(also: components-reference Katalog)* |
| Status | zurückgestellt. |

**B27 · §Mechanism — count-getriebene Sibling-Geometrie → Variant-Achse (nicht Boolean, nicht Slot)** *(Slider #1)*

| Feld | Inhalt |
|---|---|
| Why B | Achsen-Modell selbst hergeleitet; User bestätigte 12-Member-Scope. Build hält. |
| Gap | §Mechanism mappt „variabel-viele Kinder → Slot" und „conditional layout → Variant-Achse", aber nicht den Fall, dass die *Anzahl* eines daten-getriebenen Sub-Elements die **Geometrie eines Siblings** ändert (Range-Fill spannt ZWISCHEN den Handles → ein 2. Handle re-ankert den Fill). Kein Boolean (Figma kann eine Property-Bindung nicht negieren → der Single-Fill versteckt sich nicht, wenn das 2. Element erscheint), kein Slot (Fill-Geometrie gekoppelt, kein freier Inhalt). |
| Verified | Single = Start→Handle, Range = Handle1→Handle2; ein Boolean auf `handle2.visible` lässt den Start→Handle1-Fill fälschlich stehen (keine inverse Bindung). |
| Candidate fix | Notiz/Zeile: ändert die *Anzahl* eines daten-getriebenen Elements die Geometrie eines Siblings (Range-Fill, segmentierter Track) → als **Variant-Achse** modellieren (`thumbs: single\|range`), nicht Boolean (keine Property-Negation) noch Slot (gekoppelte Geometrie). **Figma-only Fork**, wenn der Code die Anzahl aus Daten ableitet (z. B. `value.length`) — nicht als Prop zurücksyncen. Multipliziert die Matrix wie die conditional-layout-Zeile. |
| Status | zurückgestellt. |

#### composites.md

**B8 · §2 T2 Dep-Audit — Radix-Umbrella-Import alignen** *(Breadcrumb #1)*

| Feld | Inhalt |
|---|---|
| Why B | lief transitiv; der Per-Primitive-Switch betrifft nur einzelne Sub-Imports. |
| Gap | Registry schreibt `import { Slot } from "radix-ui"` (+ `Slot.Root`); `radix-ui` ist nur transitiv vorhanden (Phantom-Dependency). |
| Verified | —. |
| Candidate fix | einzelne Sub-Imports auf die Projekt-Konvention per-Primitive umstellen (`@radix-ui/react-slot`, `Slot`) + declared-Dependency prüfen. *(also: SKILL.md T2)* |
| Bezug | Gegenstück (volle Primitives): ein **komplettes** Primitive (Select/Dialog) behält die `radix-ui`-Umbrella (`import { Select as SelectPrimitive } from 'radix-ui'`; deklarierte Dep, Dialog-Konvention) — nur einzelne Sub-Imports werden per-primitive. |
| Status | zurückgestellt. |

**B9 · Layer-2-Nesting — Hard-Case-Rezept + „Vorgänger ist nicht autoritativ"** *(InputGroup #4; via Dialog re-validiert)*

| Feld | Inhalt |
|---|---|
| Why B | Base-Override/Icon-Swap-Rezept selbst gefunden, an Dialog re-validiert. |
| Gap | kein Rezept für Components ohne exponierten Content/Geometrie; und keine Regel „Re-Port wendet die Nest-Regel an, auch wenn der Vorgänger standalone re-clothed war". |
| Verified | —. |
| Candidate fix | (a) Re-Port MUSS die Nest-Regel anwenden; (b) Geometrie liegt oft in der genesteten `*/Base`-Instanz (Top `lm:NONE` → eine Ebene tiefer per `setBoundVariable` overriden), Text = Deep-Characters-Override, Icon hinter gesperrtem Slot-Default = `swapComponent` auf ein persistentes Icon-Component (ein Swap-Target/Icon = akzeptierter Cruft). Alternativ Upstream-Fix flaggen (echter Icon-Slot + Label-Prop am Basis-Component). |
| Status | zurückgestellt. |

**B10 · §2 T2 Dep-Audit — Hard-importierte Dep MUSS portiert werden, nicht stub/defer** *(Field #1)*

| Feld | Inhalt |
|---|---|
| Why B | `Label` co-portiert (einziger gültiger Weg; Skill bot fälschlich stub/defer an). |
| Gap | §2 T2 listet port/stub/delete+defer als Wahl; importiert die behaltene Composite-Source die Dep direkt, brechen stub UND delete+defer das Composite (Runtime/Typecheck). |
| Verified | `label` nur in field.tsx:5 importiert. |
| Candidate fix | §2 T2 splitten — behaltene Composite-Source importiert die Dep → porten (harte Co-Dependency, nicht optional); stub/delete+defer gelten nur für Deps, die bloß nicht-behaltene Sibling-Example/Demo-Files nutzen. „co-ported primitives"-Watchlist. |
| Status | zurückgestellt. |

**B11 · Surface-less Composite — was in Figma modellieren?** *(Field #6)*

| Feld | Inhalt |
|---|---|
| Why B | nur ROW + Spacing/Typo gebunden, verify CLEAN. |
| Gap | composites.md nimmt irgendeine Token-Fläche an (InputGroup bg+border, Dialog Panel+Scrim); ein rein Layout/Typo/Spacing/a11y-Composite hat null eigene Fläche (Border/bg trägt das genestete Control). |
| Verified | alle Member + Slots `fills=[]`; nur itemSpacing + Text-Style-Bindings tragen Tokens; verify CLEAN. |
| Candidate fix | die strukturelle ROW modellieren (`orientation × invalid` + Slots + genestete echte Control-Instanz), nur Spacing-Gaps + Typo-Formate binden, die reinen Grouping-Teile (FieldSet/Group/Legend) + Container-Query (`responsive`) explizit als Code-only deklarieren (kein Figma-Set). Code↔Figma-Gap notieren. |
| Status | zurückgestellt. |

**B12 · §1 — Text-Regionen als SLOT (mit Text-Default), nicht als Text-Property** *(Field #7)*

| Feld | Inhalt |
|---|---|
| Why B | 4 Slots → 4 Set-Level-SLOT-Props (verified). |
| Gap | §1 mappt „editierbarer String → Text-Property"; das sperrt Content/Struktur-Swaps (z. B. Label + Trailing-Badge). |
| Verified | 4 Slots → 4 Set-Level-SLOT-Props, je clear+append in der Instanz. |
| Candidate fix | für Text-Regionen einen Slot-mit-Text-Default der Text-Property vorziehen, wenn der Consumer Content/Struktur tauschen können soll (konsistentes Slot-Naming merged über alle Member zu einer Set-Level-Prop); Text-Property nur bei strikt einzelnem editierbarem String. |
| Status | zurückgestellt. |

**B13 · §2 T2 Dep-Audit — `radix-ui`-Umbrella für VOLLE Primitives behalten** *(Select E)*

| Feld | Inhalt |
|---|---|
| Why B | richtige Wahl (Dialog-Konvention). |
| Gap | ein per-primitive-Switch wäre für ein volles Primitive falsch — es behält die Umbrella; der Switch gilt nur einem einzelnen Sub-Import (s. Bezug). |
| Verified | —. |
| Candidate fix | Dep-Audit §2 T2 splitten — Voll-Primitive-Umbrella behalten (`import { Select as SelectPrimitive } from 'radix-ui'`; deklarierte Dep), nur einzelne Sub-Imports auf per-primitive umstellen. *(also: SKILL.md T2)* |
| Bezug | Gegenstück (einzelner Sub-Import): `Slot` aus der `radix-ui`-Umbrella ist nur transitiv (Phantom-Dep) → auf per-primitive `@radix-ui/react-slot` umstellen + declared-Dependency prüfen. |
| Status | zurückgestellt. |

#### SKILL.md

**B14 · T2 — gelandete CVA kann die Doc/Brief-Matrix übersteigen → Achsen-Kardinalität festlegen** *(Badge #1)*

| Feld | Inhalt |
|---|---|
| Why B | 6 Varianten voll in Figma gebaut + im Code belassen (richtig). |
| Gap | die nova-`ui:add`-Source ist dichter als Stock und trägt CVA-Optionen, die die Doc-Page nie zeigt; kein Rule für „gelandete CVA > kanonischer Usage-Set / Brief-Matrix". |
| Verified | Badge 6 Code-Varianten (default·secondary·destructive·outline·ghost·link vs 4 Doc/Brief) voll in Figma gebaut, im Code belassen. |
| Candidate fix | Code behält die volle gelandete CVA (nie Optionen droppen); Figma deckt mind. die Brief/Doc-Optionen, SOLL alle gelandeten, außer der Brief scopt runter → Code↔Figma-Achsen-Gap in notes.md. Festlegen, welches Artefakt für die Achsen-Kardinalität autoritativ ist. *(also: tokens-reference)* |
| Status | zurückgestellt. |

**B15 · T3 — `ring-N` → `ring-[Npx]` (Sibling-Konvention)** *(Checkbox #2 · Switch #1)*

| Feld | Inhalt |
|---|---|
| Why B | Sibling-Konvention; funktional identisch (3px). |
| Gap | kein Rule, Stock-`ring-3` auf die Familien-Form zu normalisieren. |
| Verified | alle 4 Siblings (input/checkbox/input-group/textarea) = `ring-[3px]`. |
| Candidate fix | auf die Sibling-Form normalisieren, nicht `ring-N` verbatim. |
| Status | zurückgestellt. |

**B16 · T3 — Rollen-Token verfehlt Kontrast → Stock-Farb-Token als FILL behalten + Why notieren** *(Switch #2)*

| Feld | Inhalt |
|---|---|
| Why B | `bg-input` bewusst behalten (verified `muted`≈1.04:1 vs `input`≥3:1). |
| Gap | kein Rule für „rollen-korrekter Token verfehlt den nötigen Kontrast". |
| Verified | muted ≈1.04:1 vs input ≥3:1 auf Weiß. |
| Candidate fix | nicht blind auf den rollen-benannten Token umbiegen, wenn der den nötigen Kontrast verfehlt — Stock-Token als Fill behalten, Begründung in notes. |
| Status | zurückgestellt. |

**B17 · T2 — No-CVA State-Achse: mutually-exclusive Member vs. komponierende Overlays trennen** *(Checkbox #1)*

| Feld | Inhalt |
|---|---|
| Why B | korrekt als Member vs. komponierende Overlays modelliert. |
| Gap | kein Rule, einen no-CVA-State-Raum aufzuteilen. |
| Verified | —. |
| Candidate fix | mutually-exclusive (default/checked) = `state`-Achsen-Member; komponierend (`disabled:`/`focus-visible:`/`aria-invalid:aria-checked:`) = Boolean-Overlays / Interaction-State-Pattern. Nicht in ein flaches Enum zwingen (explodiert oder droppt Zellen). *(also: figma-build-rules, T5)* |
| Status | zurückgestellt. |

**B18 · T2 — Single-Achsen-State-Set kann orthogonale Kombis (checked×disabled) nicht ausdrücken → Instanz-Override** *(Radio #4)*

| Feld | Inhalt |
|---|---|
| Why B | legitimer Instanz-`opacity`-Override, in notes vermerkt. |
| Gap | kein Rule für eine orthogonale State-Kombi außerhalb der Achse. |
| Verified | —. |
| Candidate fix | z. B. „erste Option checked unter disabled Group" → Instanz auf `state:checked` + `opacity:0.5`-Override (kein Member, kein Detach), in notes. *(also: figma-build-rules)* |
| Status | zurückgestellt. |

**B19 · T2.5/T3 — twMerge-Survival-Guard auf „at-risk DS-Custom-Utility", nicht nur `text-format-*`** *(Radio #2)*

| Feld | Inhalt |
|---|---|
| Why B | richtige Utility (`corner-*`) identifiziert. |
| Gap | der Guard ist auf Typo gekeyt; ein grafik-only Control (Kreis+Dot, kein Text) hat keine Typo-Klasse → Risiko-Kandidat ist `corner-full`. |
| Verified | —. |
| Candidate fix | Guard auf die at-risk-Utility der Component keyen (Typo für Text, `corner-*`/named-spacing für grafik-only). |
| Status | zurückgestellt. |

**B20 · T6 — Radix-Composite braucht KEINEN jsdom-Polyfill, wenn Specs nur „closed" rendern** *(Select G)*

| Feld | Inhalt |
|---|---|
| Why B | erkannt, Spec lief grün. |
| Gap | T6-Headless-Heuristik fehlt für portal-mounted Content. |
| Verified | ein Trigger/Root-only-Spec lief ohne `scrollIntoView`/`hasPointerCapture`. |
| Candidate fix | portal-Content (mountet erst on-open) braucht den Polyfill nur, wenn ein Spec öffnet; den Open-Pfad übers Chromium-Storybook-Projekt (play) abdecken. *(also: /storybook-rules)* |
| Status | zurückgestellt. |

#### tokens-reference.md

**B21 · §4/§6 — Typo-Ladder hat kein 12px-Sans für Micro-Labels** *(Badge #2)*

| Feld | Inhalt |
|---|---|
| Why B | auf `text-format-label` gesnappt — Caveat „Agent rät". |
| Gap | §6 mappt totes `text-xs` → „passendes `text-format-*`", aber kein 12px-Sans existiert (`label`/`body`=14, `eyebrow`=9 mono/upper, `data`=11 mono). |
| Verified | —. |
| Candidate fix | Off-Ladder-Fallback benennen — kein exaktes Format → per ROLLE wählen (Micro-Label → `text-format-label`, 14px-Snap akzeptiert) ODER ein fehlendes DS-Micro-Label-Format als Open Item flaggen. *(also: SKILL.md T2)* |
| Status | zurückgestellt. |

**B22 · §6 — Spacing-Beispiele: untere Rung `gap-0.5`(2px)→`gap-2xs` fehlt** *(Field #3)*

| Feld | Inhalt |
|---|---|
| Why B | px-Wert-Regel → `gap-2xs` korrekt trotz unvollständiger Beispiel-Liste. |
| Gap | §6-Beispiele stoppen bei `gap-1.5(6)→gap-sm`; die 2px-Rung fehlt → Porter rundet evtl. auf `gap-xs`(4) oder lässt es numerisch. |
| Verified | `gap-0.5`=2px → `gap-2xs` (space-2xs, einzige 2px-Stufe). |
| Candidate fix | §6-Liste um die Bottom-Rung erweitern: `gap-0.5(2)→gap-2xs · py-0.5(2)→py-2xs`. *(Wiederkehrend — Badge traf schon `py-0.5→py-2xs`.)* |
| Status | zurückgestellt. |

**B23 · §4/§6 — 16px Sans hat keine exakte Rung → per ROLLE wählen** *(Field #4)*

| Feld | Inhalt |
|---|---|
| Why B | `text-format-title` (sinnvoll); verallgemeinert die Micro-Label-Rollen-Wahl auf jede fehlende Rung (s. Bezug). |
| Gap | die Sans-Ladder ist 14/18/22/27/43 — kein 16px; 16→18 ist dieselbe Klasse eine Stufe höher als 12→14. |
| Verified | §4-Ladder hat keine Stufe zwischen 14 und 18. |
| Candidate fix | jede Stock-Size ohne exakte DS-Rung per ROLLE wählen + notieren: 16px Section-Captions → `text-format-title` (18/600), 12px Micro-Labels → `text-format-label`. |
| Bezug | Aus der 12px-Regel verallgemeinert: ein 12px Micro-Label hat ebenfalls kein exaktes Sans-Format → snappt per Rolle auf `text-format-label` (14, +2px-Snap akzeptiert). |
| Status | zurückgestellt. |

#### /component-sync

**B24 · No-Delta / Premise-Mismatch ist ein First-Class-Outcome** *(Switch-sync #1)*

| Feld | Inhalt |
|---|---|
| Why B | korrekt gemeldet, nichts erfunden. |
| Gap | der Skill sagt nicht, dass ein leeres Delta ein gültiges Ergebnis ist. |
| Verified | der Live-Read matchte alles, obwohl der Task eine Änderung behauptete. |
| Candidate fix | der Live-Read überschreibt den behaupteten Grund; matcht alles → No-delta melden, einmal re-readen (stale/falscher Node ausschließen), KEINE Änderung erfinden um die Prämisse zu erfüllen (= Red-Flag „rewrite beyond the delta"). |
| Status | zurückgestellt. |

**B25 · S3 — Member→Variant-Prefix-Mapping benennen** *(Checkbox-sync #2)*

| Feld | Inhalt |
|---|---|
| Why B | korrekt angewandt (Doku-Naming). |
| Gap | S3 benennt das Member→State-Prefix-Mapping nicht. |
| Verified | —. |
| Candidate fix | bei Single-Element-State-Achse mappt jeder Figma-Member auf ein Code-State-Prefix (`state=checked`→`data-checked:`, `state=invalid`→`aria-invalid:`, kombiniert → gestapelt `aria-invalid:aria-checked:`); je Member die gebundenen Props gegen die prefixed Klassen diffen. |
| Status | zurückgestellt. |

**B26 · S2 — `use_figma`-Wrapper braucht `fileKey` + `description`** *(Radio-sync #3, minor/env)*

| Feld | Inhalt |
|---|---|
| Why B | minor/env, lief. |
| Gap | der Snippet-Header nennt `fileKey`/`description` nicht. |
| Verified | —. |
| Candidate fix | in S2 / Snippet-Header notieren (`fileKey` aus config.json + kurze `description`). *(also: read-set-values.js)* |
| Status | zurückgestellt. |

#### /docgen-props

**B28 · Discriminated-Union-Radix-Root: Props als `type = ComponentProps & Own`, nicht `interface extends`** *(toggle-group #2)*

| Feld | Inhalt |
|---|---|
| Why B | selbst hergeleitet; docgen + Build grün. |
| Gap | /docgen-props zeigt das Omit+re-declare-Muster für einen normalen Root, nicht für einen Root mit Discriminated-Union-Props (z. B. `type=single\|multiple`). |
| Verified | `interface … extends ComponentProps<Root>` warf TS2312 über die Union; `type … = ComponentProps<Root> & Own` typecheckt. |
| Candidate fix | bei einem Root mit Discriminated-Union-Props die Props als `type = ComponentProps<typeof Root> & {…}` (Intersection) deklarieren, NICHT `interface extends` (TS2312 — nur Object-Types/Statics extendbar). |
| Status | zurückgestellt. |

#### /figma-build-rules

**B29 · §Usage-examples — gefüllter genesteter Input: Value setzen UND Placeholder leeren** *(popover #2)*

| Feld | Inhalt |
|---|---|
| Why B | selbst gefunden; Beispiel sauber gerendert. |
| Gap | §Usage-examples sagt nicht, dass ein „filled"-Beispiel-Input beides braucht — Value setzen UND Placeholder-Text leeren; sonst überlagern sie sich sichtbar. |
| Verified | gesetzter Value + nicht-geleerter Placeholder rendern übereinander. |
| Candidate fix | beim Nesten eines gefüllten Input/Field in ein Usage-Example: Value setzen UND den Placeholder leeren (ein `filled`-Bool / nur-Value versteckt den Placeholder nicht). |
| Status | zurückgestellt. |

#### /shadcn-component-port

**B30 · T3 — invertierte Stock-Fläche → an raised-overlay-Token umkleiden + dark→light-Fork notieren** *(tooltip #1)*

| Feld | Inhalt |
|---|---|
| Why B | selbst entschieden; Tooltip korrekt umgekleidet, Verify CLEAN. |
| Gap | T3 nennt keinen Pfad für eine invertierte Stock-Fläche (`bg-foreground`/`text-background`), wenn das DS keinen invertierten-Overlay-Token hat. |
| Verified | stock-Tooltip = dunkle Chip; DS hat nur die konsolidierte raised-overlay-Fläche (`dialog-fill`) → Tooltip wird light. |
| Candidate fix | fehlt ein invertierter-Overlay-Token, die invertierte Stock-Fläche an die raised-overlay-Fläche umkleiden (bg-dialog-fill + border + shadow-elevation) und den dark→light-Fork in notes festhalten — nicht den invertierten Look erzwingen. |
| Status | zurückgestellt. |

**B31 · T3/T6 — vor dem Umtönen einer Fläche die `in-data-[slot=<this>]:`-Overrides der Sibling-Components grep'en** *(tooltip #2)*

| Feld | Inhalt |
|---|---|
| Why B | selbst erkannt; korrekt als Open Item geflaggt statt still kaputt zu lassen. |
| Gap | T3/T6 warnen nicht, dass ein bereits portierter Sibling (z. B. Kbd) einen `in-data-[slot=<diese-component>]:`-Kontext-Override trägt, der beim Flächen-Ton-Wechsel (dark→light) stale wird. |
| Verified | kbd.tsx `in-data-[slot=tooltip-content]:bg-surface/20 text-ink` für dunkle Tooltip getunt → auf light near-invisible. |
| Candidate fix | beim Umtönen einer Component-Fläche das Lib nach `in-data-[slot=<diese-component>]:` der genesteten Siblings grep'en; passt der Kontrast nicht mehr → als Open Item flaggen (Cross-Component-Override = Out-of-Scope für einen Single-Port). |
| Status | zurückgestellt. |

#### /figma-build-rules

**B32 · §Composites (Anchored overlay) — `align`-Achse: den TRIGGER relativ zum fixen Panel bewegen (Ausrichtung ist relativ)** *(Popover-Figma 06-23)*

| Feld | Inhalt |
|---|---|
| Why B | selbst hergeleitet; Align-Set liest korrekt, kein Defekt. |
| Gap | §Composites „Anchored overlay" sagt, den Overlay-Content an die Trigger-Kante zu ankern, deckt aber nicht den Fall, dass das Panel viel BREITER ist als der Trigger (z. B. 288px-Popover an 58px-Button) — ein fixer/zentrierter Trigger schiebt das Panel für start/end aus dem Member. |
| Verified | Trigger zentriert + Panel angeankert → align=start schob das 288px-Panel auf 191..479 (Member 440px übergelaufen); invertiert (Panel fix am Inset, Trigger bewegt: start trigger.left=panel.left · center zentriert · end trigger.right=panel.right) → passt in 320px-Member, liest identisch. |
| Candidate fix | Für eine `align`-Achse an einem Anchored-Overlay mit Panel ≫ Trigger: das PANEL am Inset fix lassen und den TRIGGER bewegen, um align zu kodieren (start/center/end). Liest gleich (Ausrichtung ist relativ), passt in einen panel-großen Member; mappt 1:1 auf das Code-`align`-Prop (kein Fork). |
| Status | zurückgestellt. |

**B33 · §Mechanism — tauschbarer Trigger auf einem prototypierten/stateful Overlay-Member → SLOT *oder* INSTANCE_SWAP (Reaction am Member-Frame); für `asChild`-artige beliebige Trigger einen HUG-SLOT bevorzugen** *(Popover-Figma 06-23, KORRIGIERT 06-23 via SLOT-Konvertierung)*

| Feld | Inhalt |
|---|---|
| Why B | selbst hergeleitet; INSTANCE_SWAP gewählt, funktioniert. |
| Gap | §Mechanism mappt „tauschbares Element, das Component sein muss → Instance-Swap" und „open variably-many Kinder → Slot", sagt aber nicht, was bei einem `asChild`-artigen tauschbaren TRIGGER gewinnt, wenn der Member zusätzlich eine Prototype-Reaction trägt. Ein Slot-Default ist per-Instanz und würde die Reaction besitzen → Swap könnte die Verdrahtung droppen. |
| Verified | INSTANCE_SWAP-Prop `trigger#…` (default DS-Button), Trigger-`mainComponent` daran gebunden; Member-Frame trägt die ON_CLICK-Reaction → Swap intakt. |
| Candidate fix | Für ein tauschbares Control (Trigger/Action) auf einem Member mit Prototype-Reactions: **Reaction am MEMBER-FRAME halten** (nicht an Slot/Inhalt) → dann ist der Swap sicher, egal ob SLOT oder INSTANCE_SWAP. **SLOT bevorzugen**, wenn der Consumer beliebigen Inhalt droppen können soll (ein HUG-Slot nimmt jedes Kind, spiegelt `asChild` treuer); INSTANCE_SWAP nur, wenn der Swap auf einen festen Satz Component-Instanzen beschränkt sein muss. *(Korrektur: B33 sagte ursprünglich fälschlich „INSTANCE_SWAP statt Slot".)* |
| Status | zurückgestellt. |

**B34 · §Composites — interaktives Variant↔Variant-Prototype (open/close, Toggle) via `setReactionsAsync` + CHANGE_TO; click-outside-Dismiss ist auf Variant-Membern nicht ausdrückbar** *(Popover-Figma 06-23)*

| Feld | Inhalt |
|---|---|
| Why B | selbst aus der Reactions-API hergeleitet; demoable Flow gebaut. |
| Gap | Die Build-Skills decken statische Variant-Matrizen, aber kein Wiring eines interaktiven open/close (oder Toggle) ZWISCHEN Variant-Membern. |
| Verified | 24 Member verdrahtet (closed→open ON_CLICK; open→closed ON_CLICK + Esc); Read-back bestätigt die Ziele. |
| Candidate fix | „Interactive variant prototype"-Notiz: Toggle/open-close zwischen zwei Variant-Membern = `NODE`+`CHANGE_TO`-Reactions (`setReactionsAsync`), je eine pro Richtung; für einen Overlay-Dismiss ist click-outside auf einem Variant-Member NICHT verfügbar (nur Overlay-Background) → click-on-member + `ON_KEY_DOWN`(Esc). closed/open-Paare müssen distinkte Member-Nodes sein (rechtfertigt die „degenerierten" closed-Member in einer vollen state×…-Matrix). |
| Status | zurückgestellt. |

**B35 · §Slots — eine SLOT nachträglich auf ein bereits kombiniertes Variant-Set retrofitten: HUG-Slot-Mechanik + Prop-Merge + Layout-Eject-Falle** *(Popover-Figma 06-23)*

| Feld | Inhalt |
|---|---|
| Why B | selbst hergeleitet; Konvertierung CLEAN, aber zwei nicht-offensichtliche Fallen kosteten Iterationen. |
| Gap | §Slots deckt Slots auf Standalone-Comps VOR dem Kombinieren, aber nicht das Retrofitten einer SLOT auf ein bereits kombiniertes Variant-Set, nicht die HUG-Slot-Größe, und nicht, dass das Stören der Member-Internals die Kinder eines Parent-Auto-Layouts auswirft. |
| Verified | (1) `slot.layoutSizingHorizontal='HUG'` wirft — eine SLOT ist selbst kein Auto-Layout-Frame; der Slot braucht ein EIGENES Auto-Layout (`layoutMode='HORIZONTAL'`, padding 0, fills []) ZUERST, dann HUG → Kette Kind→Slot→Member. (2) `createSlot()` auf bereits kombinierten Membern erzeugt N un-merged SLOT-Props → per `componentPropertyReferences={slotContentId:'<eine>'}` re-binden + Duplikate löschen → eine Set-Level-Prop. (3) Slot-/Struktur-Ops resetten das Auto-Layout des SETs auf NONE UND werfen die Kinder des Build-Frames in die Section → Set-Grid + Parent-Children danach wiederherstellen + Section-Check neu. |
| Candidate fix | Notiz fürs Retrofitten einer SLOT auf ein kombiniertes Set: SLOT braucht ein eigenes Auto-Layout vor HUG; createSlot post-combine → N un-merged Props → alle auf eine `slotContentId` re-binden + Duplikate löschen; Slot-/Struktur-Ops können das Set-Auto-Layout still resetten + Kinder eines Ancestor-Auto-Layouts auswerfen → Set-Layout + Parent-Frame-Children danach re-asserten, Section-Composition-Check neu fahren. |
| Status | zurückgestellt. |

**B36 · §Composites — per-side Arrow auf einem Overlay-Variant-Set: `rotation` ist in einer Instanz nicht overridebar (+ Instanz drehen dreht das Label) → `showArrow`-Boolean + Member-Level oriented Arrow** *(Tooltip-Figma 06-23)*

| Feld | Inhalt |
|---|---|
| Why B | selbst hergeleitet; per-side-Arrows korrekt, Text upright. |
| Gap | §Composites sagt nicht, wie man einen richtungs-abhängigen Arrow (Tooltip/Popover per side) über eine side-Achse modelliert. `rotation` wirft „cannot be overridden in an instance"; die ganze Chip-Instanz zu drehen dreht das Label mit (unlesbar). |
| Verified | side=top nutzt den baked Down-Arrow; bottom/left/right: `showArrow=false` (Boolean an der Chip) + ein Member-Level oriented Triangle (gleicher border-aware Bau) → Text upright, Arrow korrekt. |
| Candidate fix | für einen per-side-Arrow auf einer side-Achse: am Content-Chip einen `showArrow`-Boolean (toggelt den baked Default-side-Arrow); für die anderen Sides `showArrow=false` + ein Member-Level oriented Arrow (gleicher Bau, gedreht). Nie die Chip-Instanz drehen (Label kippt), kein `rotation`-Instanz-Override (wirft). Im Code unnötig — Radix orientiert einen Arrow auto. |
| Status | zurückgestellt. |

**B38 · §Composites — getriggertes Overlay mit Hover-Semantik (Tooltip): `ON_HOVER` ('While hovering') auto-revertet → EINE Reaction pro closed-Member** *(Tooltip-Figma 06-23)*

| Feld | Inhalt |
|---|---|
| Why B | selbst aus der Reactions-API hergeleitet; demoable Hover-Flow. |
| Gap | das interaktive-Overlay-Muster (A6/B34) deckt den CLICK-Toggle (Popover: open↔closed je eine Reaction), aber nicht die HOVER-Semantik des Tooltips. |
| Verified | je closed-Member `ON_HOVER` → CHANGE_TO matching open (DISSOLVE 0.15s); Figmas While-hovering revertet bei mouse-leave automatisch zu closed → open-on-hover/close-on-leave. Kein Click, kein Esc, KEINE open→closed-Reaction. |
| Candidate fix | für ein hover-getriggertes Overlay (Tooltip): `ON_HOVER` ('While hovering') am closed-Member → open; Figma auto-revertet bei Leave, also NUR eine Reaction pro closed-Member (kein open→closed). Gegenstück: ein click-getriggertes Overlay (Popover) braucht beide Richtungen (open→closed click+Esc, s. B34). |
| Status | zurückgestellt. |

### C — tooling / repo / already covered

**Keine offenen C-Findings** — erledigte s. **### Erledigt**.

## Quellen

- Findings im Original (mit Verified-Belegen): `agent-runs/component-port/
  {2026-06-08-breadcrumb,2026-06-10-input-group,2026-06-10-command,2026-06-10-dialog,
  2026-06-11-command-dialog,2026-06-12-badge,2026-06-12-separator,2026-06-12-field,
  2026-06-12-checkbox,2026-06-12-switch,2026-06-12-radio-group,2026-06-19-select,2026-06-22-slider,
  2026-06-22-tooltip,2026-06-22-toggle-group,2026-06-22-popover}/skill-feedback.md` +
  `agent-runs/component-sync/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md`
- Component-Locator/Status: `design-docs/design-system/components-reference.md` (zuerst lesen)
- Token-Crosswalk: `design-docs/design-system/tokens-reference.md` (§3 Kollisions-Regel,
  §4 `text-format-*`, §6 stock→DS, §7 Auto-Layout→Utilities)
- Run-Notes: `agent-runs/component-port/*/notes.md` + `agent-runs/component-sync/*/notes.md`
- Gate (Lib): `npx nx test|typecheck|lint @agentport/ui` · Voll-Gate: `npm run check`

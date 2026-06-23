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

1. **Skill-Findings** (unten, im `/skill-feedback`-Format: Klasse A/B/C → Ziel-Datei → Entry-Tabelle).
   **A-Strang 2026-06-22 KOMPLETT** in die 6 Skill-Dateien eingearbeitet (29 ✅; #62 verworfen). Offen:
   **B (27)** = zurückgestellt (Agent kam trotz Skill-Schweigen zum Ergebnis → Kodifizierung, kein
   Bugfix) + **C (C1 · C2 · C3 · C4)** = Tooling/Backlog. Skills werden nie mid-run editiert; Formulierungs-Regel
   s. Blockquote unter „Skill-Findings".
   **Slider-Run 2026-06-22 (5 Findings, Quelle `…/2026-06-22-slider/skill-feedback.md`):** A: #5
   (/storybook-rules wrapper-render→`source.code`, S4-Promotion) ✅ eingearbeitet (`03178db`) · #2 →
   **A1** (/shadcn-component-port T6 a11y) eingearbeitet (`8287d65`). B27 (/figma-build-rules) +
   C3 (/figma-verify) · C4 (build-variant-set.js) zurückgestellt.
   **Parallel-Batch 06-22 (9 Findings, Quellen `…/2026-06-22-{tooltip,toggle-group,popover}/skill-feedback.md`):**
   **A (2, offen, Prio)** = beide `/storybook-rules` (**A2** `userEvent` statt rohem `element.click()`; **A3**
   Portal-`role=dialog`-`aria-label`, auch `/shadcn-component-port` T6) — Gate-rot bis gefixt, Skill-Edit
   ausstehend. **B (4, zurückgestellt)** = **B28** /docgen-props (Union-Root `type=` statt `interface extends`) ·
   **B29** /figma-build-rules (filled Input: Value setzen + Placeholder leeren) · **B30/B31** /shadcn-component-port
   T3/T6 (invertierte Fläche umkleiden + Sibling-`in-data-[slot]:`-Override grep'en). **C (2)** = Env/Tooling
   (**C5** Worktree-`npm ci`/`dist` · **C6** nested-Worktree-Nx + `isolation:worktree`-Lehre). B20 (Portal-Spec)
   durch Tooltip re-bestätigt (3. Datenpunkt). Skills nie mid-run editiert — User reviewt + wendet an.
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
   near-invisible; bewusst nicht im Single-Port editiert → Kbd-Touch-up nachziehen (s. B31).
   **Popover-Review 06-23:** Code/Docgen-Lücken (Root-Docgen + PopoverContent-Props + Sides-Story) gefixt
   auf `fix/component-review-polish` (s. A4, Gate grün 299). **Offen ④ (Popover-Figma, eigener Schritt):**
   Set unvollständig + Section-Komposition kaputt (s. A5/C7) → (a) Section auf ein vertikales Auto-Layout-Frame
   (weißer HUG-Fill) umbauen, (b) `align`-Achse (start/center/end) am Content-Set ODER eine Popover-Root-
   Component ergänzen (Code hat `align`; Figma modelliert es nicht). Plugin/Figma-Desktop nötig (sonst read-only).
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
**ID = Klasse + laufende Nummer in Anzeige-Reihenfolge** (`B1`…`B27`, `C1`…`C4`). Jeder Eintrag ist
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

### A — gap caused a defect (priority)

Erledigte A-Findings stehen unter **Offene Punkte #1** (bereits-erledigt-Übersicht). **Offen (Batch 06-22, 2):**

#### /storybook-rules

**A2 · play-Test muss Radix via `userEvent` treiben, nicht roher `element.click()`** *(toggle-group #1)*

| Feld | Inhalt |
|---|---|
| Why A | roher DOM-`.click()` treibt den Radix-State im Chromium-Story-Projekt nicht → 2 play-Tests Gate-rot, bis auf `userEvent` umgestellt. |
| Gap | die play-Test-Regel sagt nicht, dass Interaktion mit Radix-/portal-Controls `@testing-library/user-event` braucht (echte async Pointer/Key-Sequenz), nicht `element.click()`/`fireEvent`. |
| Verified | toggle-group play 2× rot mit `.click()`, grün mit `await userEvent.click(...)`. |
| Candidate fix | in der play-Test-Regel festhalten: Interaktion mit Radix/portal-Controls IMMER über `userEvent` (async); roher `element.click()`/`fireEvent` triggert den Radix-State nicht. |
| Status | offen — Skill-Edit ausstehend. |

**A3 · Portal-`role=dialog`-Overlay ohne Auto-Titel braucht explizites `aria-label`/`-labelledby`** *(popover #1)*

| Feld | Inhalt |
|---|---|
| Why A | Popover-Content rendert `role="dialog"`, verdrahtet (anders als modaler Dialog) den Titel NICHT automatisch → axe `aria-dialog-name` rot, bis die offenen Stories `aria-label` tragen. |
| Gap | weder `/storybook-rules` noch `/shadcn-component-port` T6 nennen, dass ein nicht-modales `role=dialog`-Overlay (Popover/Combobox) einen expliziten Accessible Name pro offener Instanz braucht. |
| Verified | popover open-Story axe-rot ohne, grün mit `aria-label`. |
| Candidate fix | Regel: jede offene `role=dialog`/`role=tooltip`/`role=listbox`-Overlay-Instanz braucht einen Accessible Name (`aria-label`/`-labelledby`); modaler Dialog verdrahtet ihn via Title-Slot, Popover/Tooltip/Combobox NICHT → Story/Component muss ihn setzen. *(also: /shadcn-component-port T6 „name the role element")* |
| Status | offen — Skill-Edit ausstehend. |

**A4 · /shadcn-component-port T6 (+ /docgen-props) — Pass-through-Primitive-Root MUSS Omit+re-declare bekommen (nicht hand-argTypes); Content re-declariert den vollen kuratierten Satz** *(Popover-Review 06-23)*

| Feld | Inhalt |
|---|---|
| Why A | User fand im Review: Popover-Root war nacktes `ComponentProps<Root>` (kein Interface) → react-docgen liest nichts → Root-API in `argTypes` hand-dupliziert; `PopoverContentProps` re-deklarierte nur 2 von ~10 Props (ArgsTable unvollständig). Tooltip im selben Batch machte beides vollständig. |
| Gap | T6/`/docgen-props` erzwingt nicht, dass der Pass-through-Root eines Primitives ein Omit+re-declare-Interface bekommt (sonst kommt die Root-API nicht aus docgen → Anti-Pattern „Prop-Docs in argTypes"), noch dass Content den vollen kuratierten Placement/Behavior-Satz re-deklariert statt nur align/sideOffset. |
| Verified | `PopoverProps` (Omit+re-declare open/defaultOpen/onOpenChange/modal) + erweiterte `PopoverContentProps` (side/alignOffset/avoidCollisions/collisionPadding/sticky/hideWhenDetached); hand-argTypes entfernt; Gate grün (299). |
| Candidate fix | Regel: JEDER docgen-relevante Root/Part eines Pass-through-Primitives bekommt ein FLAT Omit+re-declare-Interface mit JSDoc — NIE Prop-Docs in `argTypes` hand-schreiben (genau das löst `/docgen-props` ab); Content/Trigger re-deklarieren den vollen kuratierten Prop-Satz (Placement + Behavior), nicht nur die 1-2 häufigsten. Tooltip = Referenz. |
| Status | offen — Skill-Edit ausstehend (Popover-Code bereits gefixt auf `fix/component-review-polish`). |

**A5 · /figma-build-rules (Section-Assembly) — DS-Section ist KEIN Auto-Layout-Frame → Build-Children in ein vertikales Auto-Layout INNERHALB der weißen Fläche hängen** *(Popover-Figma-Review 06-23)*

| Feld | Inhalt |
|---|---|
| Why A | User fand das Figma-Output kaputt: Headline-Card überdimensioniert + überlappt die 1. Instanz; PopoverHeader/Usage-Examples liegen auf dem DUNKLEN Canvas (dunkle Schrift auf dunkel = unlesbar). Ursache bestätigt: die Section hat KEIN Auto-Layout. |
| Gap | `/figma-build-rules` (+ `/figma-create-section`) sagt nicht, dass eine Figma-SECTION kein Auto-Layout-Frame ist → angehängte Children werden NICHT automatisch gestapelt/umschlossen; ohne ein eigenes vertikales Auto-Layout-Frame mit weißem Fill (HUG) überlappen/overflowen sie und spillen auf den dunklen Page-Canvas. |
| Verified | Section „Popover" 4365:2253: Children frei positioniert, kein AL → Overlap + Canvas-Spill (Screenshot). |
| Candidate fix | Regel: Build-Children NIE frei als Section-Children positionieren — ein vertikales Auto-Layout-FRAME (weißer Fill, HUG, itemSpacing aus DS) INNERHALB der Section anlegen und die Children dort einhängen (Headline normal dimensioniert). Sonst Overlap + Canvas-Spill (unlesbar). |
| Status | offen — Skill-Edit ausstehend; Figma-Rebuild = Offene Punkte #2 ④. |

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

### C — tooling / repo / already covered

**C1 · snippets/build-variant-set.js — kein Scaffold für Composite-Sub-Builds** *(Breadcrumb #3, optional)*

| Feld | Inhalt |
|---|---|
| Why C | Tooling-Backlog — die Prosa deckt es, nur ein Scaffold fehlt. |
| Gap | Text-Segment-Set, Icon-Adornment, `createSlot()` + Instance-Prefill sind nur als Prosa gedeckt; ein Scaffold (mind. fürs Slot+Prefill-Muster) fehlt. |
| Verified | —. |
| Candidate fix | Scaffold für das Slot+Prefill-Muster ergänzen. |
| Status | optional, Backlog. |

**C2 · /figma-verify — sollte `visible:false`-Nodes überspringen** *(radio-examples)*

| Feld | Inhalt |
|---|---|
| Why C | `/figma-verify`-Tooling-Refinement (kein Skill-Prosa-Pfad). |
| Gap | toggled-off Slots (`Show error/description=false`) erzeugen False-Positives bei clipped/overlap. |
| Verified | —. |
| Candidate fix | `/figma-verify` überspringt `visible:false`-Nodes. |
| Status | offen (Tooling). |

**C3 · /figma-verify — Sibling-Overlap-Check flaggt einen beabsichtigten „Handle auf Rail"-Overlap** *(Slider #3)*

| Feld | Inhalt |
|---|---|
| Why C | `/figma-verify`-Heuristik (kein Skill-Prosa-Pfad); Build korrekt, Caller muss nur bestätigen. |
| Gap | Step 4 (non-auto-layout Sibling-Overlap) flaggt jedes Slider-Thumb↔Track-Paar (das Thumb MUSS auf der Rail sitzen). Jedes „Handle auf Rail"-Control (Slider/Scrollbar/Range) trippt by-design → erwartete FLAGs lesen wie Defekte. |
| Verified | Slider-Set: 0 text / 0 clipped / 0 pad-asym, aber 18 Overlaps, alle Track↔Thumb (genau 1 pro Thumb). |
| Candidate fix | `/figma-verify` einen designierten Overlap als erwartet behandeln lassen — Paare überspringen, wo ein Node-Name einer Caller-Allowlist matcht (Thumb/Handle über Track/Rail), oder einen voll-enthaltenen-Kind-Overlap (Handle-bbox im Member auf dünnem Track) zu SOFT HINT herabstufen. |
| Bezug | Schwester von C2 (beide /figma-verify-Heuristik-Verfeinerungen). |
| Status | offen (Tooling). |

**C4 · snippets/build-variant-set.js — kein Scaffold für ein Geometrie-Primitive (absolute Track/Range/Handle)** *(Slider #4)*

| Feld | Inhalt |
|---|---|
| Why C | Snippet-Coverage-Lücke; die Prosa (§Interaction states, B5 Two-Part-Toggle) deckt die Idee, der Build war handgeschrieben. Verstärkt C1. |
| Gap | `build-variant-set.js` ist auf Label/Field-Member getunt (HORIZONTAL AL + Text/Icon-Kind + Surface-Fill). Ein Geometrie-Primitive — `NONE`-Root mit absolut positioniertem Track (clipping FRAME) + Range (Fill-RECT, dessen Ausdehnung den Wert kodiert) + N Handle-RECTs — hat kein Scaffold; die Member-Schleife ist komplett bespoke. Slider = 2. Datenpunkt nach Switch (Track+Thumb). |
| Verified | Slider-12-Member-Set voll bespoke gebaut (eigener Handle-Helper + per-orientation Track/Range/Handle-Positionierung); der Text/Fill/HUG-Pfad der Vorlage war unbrauchbar. |
| Candidate fix | Geometrie-Primitive-Scaffold-Variante (Root `NONE` + absolute Kinder, `mkHandle`-Helper, per-orientation Track/Fill-Positionierung, Member-Opacity disabled, per-Handle-Glow) — oder dokumentieren, dass Geometrie-Primitives (Slider/Switch/Progress) das Label/Field-Skelett umgehen und Member von Hand bauen. |
| Bezug | Verstärkt C1 (kein Scaffold für Composite-Sub-Builds). |
| Status | offen (Tooling/Backlog). |

**C5 · Worktree braucht echtes `npm ci` (kein symlinked node_modules) + sauberen `dist`-Build** *(toggle-group #3 · popover)*

| Feld | Inhalt |
|---|---|
| Why C | Env/Tooling — Code korrekt, nur das Worktree-Setup unvollständig. |
| Gap | ein frischer Worktree mit symlinked/partiellem `node_modules` lässt das Lib-Gate scheinbar scheitern: `@nx/react/typings/*`/`vite/client.d.ts` fehlen (typecheck), `@storybook/addon-vitest` setup-file-Import bricht (Chromium-Story-Projekt), TS6305 ohne `dist`-Build. |
| Verified | identischer Code typecheckt/testet grün im voll aufgesetzten Main-Tree; im Worktree 5 reine Typings-Infra-Fehler, keiner referenziert die Component. |
| Candidate fix | für Parallel-Worktree-Batches je Worktree ein echtes `npm ci` (kein Symlink) + Composite-`dist`-Build sicherstellen, ODER das authoritative `npm run check` nach dem Zusammenführen im Main-Tree fahren (Worktree-Gate nur indikativ). |
| Status | offen (Env/Tooling). |

**C6 · `isolation: worktree` aus einer Worktree-Session → genestete Worktrees brechen Nx + kollabieren Agents** *(Batch-Orchestrierung 06-22)*

| Feld | Inhalt |
|---|---|
| Why C | Orchestrierungs-/Harness-Lehre, kein Skill-Prosa-Pfad; die Agents haben sich selbst erholt. |
| Gap | Background-Agents mit `isolation: worktree` aus einer bereits ge-worktree-ten Session nesten die neuen Worktrees unter `.claude/worktrees/` IM Repo → Nx „projects defined in multiple locations"; zwei Agents landeten im Main-Tree statt im eigenen Worktree (CWD ≠ zugewiesenes Worktree). |
| Verified | `nx` rot bis untracked `.nxignore` (`.claude/worktrees`) + `nx reset`; tooltip+popover schrieben in den Main-Tree, popover relozierte + cleante selbst. |
| Candidate fix | solche Batches aus dem MAIN-Checkout starten (nicht aus einem Worktree) ODER Worktrees AUSSERHALB des Repo-Baums anlegen; vor dem Parallel-Lauf je Agent CWD == eigenes Worktree verifizieren; bei genesteten Worktrees `.nxignore` (`.claude/worktrees`) setzen. |
| Bezug | Schwester von C5 (beide Worktree-Env). |
| Status | offen (Tooling/Orchestrierung). |

**C7 · /figma-verify — prüft nur das Component-SET, nicht die Section-Komposition + kein Canvas-Spill/Kontrast-Check** *(Popover-Figma-Review 06-23)*

| Feld | Inhalt |
|---|---|
| Why C | `/figma-verify`-Scope-Lücke; der Agent meldete Popover „figma-verify CLEAN", aber die Section-Assembly war sichtbar kaputt (Overlap + Spill, s. A5). |
| Gap | verify lief auf dem PopoverContent-SET (0 overlap dort) und deckt die SECTION-Komposition (Headline + Instanzen + Examples) nicht ab; zudem kein Check auf „Kind außerhalb der gefüllten Section-Fläche / dunkler Text auf dunklem Canvas". |
| Verified | Set CLEAN gemeldet, Section visuell defekt (A5). |
| Candidate fix | `/figma-verify` zusätzlich die Section-/Wrapper-Komposition prüfen: Children innerhalb der gefüllten Fläche (kein Spill auf Canvas), kein Overlap der frei positionierten Section-Children, + ein Kontrast-/Fill-Check (Text-Fill vs. tatsächlicher Hintergrund). |
| Bezug | Schwester von C2/C3 (alle /figma-verify-Heuristik-/Scope-Lücken). |
| Status | offen (Tooling). |

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

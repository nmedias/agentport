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
**Entfernt 2026-06-24:** `toggle` + `toggle-group` komplett ausgebaut (Code-Ordner + Barrel-Exporte +
Katalog-Einträge + Run-Notes `2026-06-22-toggle-group/`) — wird in Figma neu gemacht. Aus dem Batch
bleiben im Code **tooltip · popover**.

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
   editiert" s. Blockquote dort). **Keine offenen A-Findings mehr (A9–A11 06-24 + Item A12/A13/B42/B43
   06-26 kodifiziert); offen nur noch B (zurückgestellt: B1–B13, B27, B41)** — selbst hergeleitet,
   Ergebnis stimmte → kodifizieren, kein Bugfix (Tabellen s. **### B**). Alle **erledigten** Findings
   (A-Strang 06-22, Slider, A2/A4–A8, A9–A11, C1–C8, Item A12/A13/B42/B43) → **### Erledigt** (nicht in den
   Finding-Sections).
2. **Composite-Strang — nächster Schritt** (Verfahren mehrfach validiert, nichts blockiert): **Slider
   2026-06-22 PORTIERT + per fast-forward auf `master` gemerged** (`0df4af2`…`1ae9fab`; Gate grün
   260 Tests). Geometrie-Primitive wie Switch,
   kein CVA; Figma-Set 12 Member (`orientation × thumbs × state`, `thumbs` = Figma-only Fork) +
   Usage-Examples inkl. **FieldSlider → schaltet das beim Field-Port (06-12) übersprungene `field-slider`
   frei**. Details: `agent-runs/component-port/2026-06-22-slider/notes.md`, Katalog-Eintrag `Slider`.
   **Parallel-Batch 06-22 erledigt:** tooltip · popover portiert (Figma + Code, Gate grün), auf
   `feat/shadcn-port-batch` ff-bereit; `toggle` + `toggle-group` 06-24 wieder entfernt (Figma-Neuaufbau).
   **`popover` + bereits
   portiertes `command` schalten den `combobox`-Endpoint-Switcher frei** (Explorer-Analyse) — offener
   nächster Block-Schritt, nicht gebaut. **Offener Folge-Punkt (Tooltip):** `kbd.tsx`
   `in-data-[slot=tooltip-content]:`-Override war für die alte DUNKLE Tooltip getunt → auf der neuen LIGHT-Chip
   near-invisible; bewusst nicht im Single-Port editiert. **Kbd-Touch-up ERLEDIGT 06-23** (`64cfaf8`): tooltip-content-Override
   `bg-surface/20`→`bg-muted-fill` (dezent, sichtbarer muted Keycap auf der Light-Chip; `text-ink` lesbar behalten), Gate grün + axe-clean. (Skill-Leitplanke „Sibling-`in-data-[slot]:`-Overrides vor dem Umtönen grep'en" = B31, eingearbeitet 06-23, s. ### Erledigt.)
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
   **Item 2026-06-26 PORTIERT** (Figma + Code, Gate grün 300; `.Item`-Set variant×size 9 Member +
   `.ItemMedia`-Set + `ItemGroup`-Component + Usage-Examples, figma-verify CLEAN; State-Achse bewusst
   examples-only). Schaltet den Explorer **NavListItem** (Typ-Liste) frei. User-Review fand
   5 Figma-Defekte → alle gefixt (media-Slot nestet `.ItemMedia` · Title/Icon an `ink` · Focus-Ring
   korrekt · ItemGroup als Component · ItemMedia content-Slot); Skill-Findings A12/A13/B42/B43. Offene
   Item-Punkte: `xs`-Description bleibt 14px (kein Sub-14-Sans-Format); `image`-ItemMedia nutzt grauen
   Platzhalter (kein Bild-Fill). Auf `feat/shadcn-item-port`, ff-bereit (noch nicht gemerged). Details:
   `agent-runs/component-port/2026-06-26-item/notes.md`, Katalog-Eintrag `Item`.
   Offen jetzt sonst: weiteres Composite (`/shadcn-component-port <name>`) oder Blocks-Arbeit auf den
   Palette-Bausteinen. *(ChoiceCard 06-16, Select 06-19, Slider 06-22, Batch-4 06-22, Item 06-26 — alle erledigt.)*
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
**ID = Klasse + laufende Nummer in Anzeige-Reihenfolge** (`B1`…`B27`). Jeder Eintrag ist
**selbstständig** — hängen zwei Findings zusammen, steht das verwandte in Kurzform als `Bezug`-Zeile
(keine Sprung-Verweise zwischen Items). Die Run-Tags in Kursiv *(Badge #3)* = Quell-Nummer im
Quell-Run, unverändert. **User reviewt + wendet an** — Skills werden nie mid-run editiert.

> **Formulierungs-Regel für Finding-Edits:** der eingearbeitete Text folgt den Skill Writing Rules
> (`.claude/skills/CLAUDE.md`). *Tracker-spezifisch* (steht nicht im Skill): Run-Bezug / `Why` /
> `Verified` hier sind Review-Evidenz und wandern NICHT mit in den Skill — nur der `Candidate fix` ist
> die Edit-Vorlage; Skills werden nie mid-run editiert.

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
- **B-Batch B28–B38 (2026-06-23, aus den Overlay-Builds):** **B28** /docgen-props (Discriminated-Union-Root →
  `type`-Intersection statt `interface extends`) · **B31** /shadcn-component-port T3 (vor dem Umtönen die
  Sibling-`in-data-[slot]:`-Overrides grep'en) · **B32** /figma-build-rules §Composites (align-Achse: Trigger
  bewegen, nicht Panel) · **B33** ebd. §Mechanism (swappable Trigger → Reaction am Member-Frame, HUG-Slot) ·
  **B35** ebd. §Slots (SLOT auf kombiniertes Set retrofitten). Rest des Batches verworfen.
- **A11 (2026-06-24)** in /figma-verify §3 eingearbeitet: Spill-Check für **ABSOLUTE-Overlay-Nachfahren** —
  bis zur sichtbaren Leaf rekursieren + deren `absoluteBoundingBox` gegen **jeden** umschließenden Container
  (eigene Component/Set-Frame **und** Section) testen, FLAG wenn sie *irgendeinen* überschreitet (nur den
  äußersten zu prüfen liest CLEAN, während sie eine innere Frame kreuzt); **nie** `absoluteRenderBounds`
  (clippt unter `clipsContent` → falsches PASS).
- **A9 (2026-06-24)** in /figma-build-rules §Composites kodifiziert: „Anchored overlay" vom alten
  Fixed-Member/Trigger-bewegen-Modell auf **HUG-Member + Constraint-Positionierung** umgeschrieben — SIDE
  pinnt die Senkrechte (top→vert MIN · bottom→MAX · left→horiz MIN · right→MAX), ALIGN die Parallele
  (start/center/end→MIN/CENTER/MAX), `CENTER ⟺ align=center`; **Zwei-Stufen-Anker** (Panel Position trackt
  die Kante / Panel Content invertierte Seitenachse → wächst weg) als eigener Bullet, weil constraints am
  ABSOLUTE-Kind BEIDE Richtungen (Tracking + Selbst-Wachstum) steuern und je Seite die Gegenkante brauchen.
  **Containment-Bullet (Set-Padding) ebenfalls kodifiziert** (§Composites Layer 3, „Containing the overlay
  variant set" — Set selbst padden, nicht äußerer Wrapper; bei fixed-axis-Set die Achse um dasselbe
  Padding mitwachsen, damit das Grid nicht umbricht).
- **A10 (2026-06-24)** in /figma-build-rules §Red flags eingearbeitet (Heading von „Red flags (Plugin-API)"
  auf „Red flags" generalisiert): No-Go — eine Variation faken durch Element-an-der-Instanz-ausblenden +
  Ersatz-danebenkleben (doppelt, prop-los, verstreut, Drift) → die abweichende Ausprägung als
  **Varianten-Achse** modellieren (eine pro Variante, prop-geschaltet), aus den gebauten Formen geklont.
  **Damit alle A-Findings erledigt.**
- **Item-Findings (2026-06-26)** kodifiziert: **A12** /figma-build-rules §Binding recipes (Lead: jede
  token-gedeckte Property binden; Literal nur wo kein Token existiert; `tokens`=SOLL, recon=ID; CSS-Erbe
  explizit binden) + /figma-verify Step 7 (SOFT HINT „unbound token-backed value"). **A13** ebd.
  §Composites Layer 2 (Part-Component → Parent-Slot-Default nestet die Instanz + eigener Content als Slot).
  **B42** ebd. §Red flags (named Effekt-Style ≠ Focus-Ring). **B43** ebd. §Composites (Build-scope per
  Part: Layout-only Container = Component ODER Frame, nicht für Peers mischen). Damit A12/A13 erledigt;
  offene B = nur die vor-Item zurückgestellten (B1–B13, B27, B41).
- **Table-Run (2026-06-26)** — Findings OFFEN in den A/B/C-Sections (noch nicht eingearbeitet): **A14**
  /figma-build-rules §Usage-examples (recompose-able Container-Composite → content-Slot, variierte Beispiele
  nie hand-bauen — Done-Test) · **A15** composites.md T2.7 (content-tragender Leaf = open content → Slot-vs-Swap
  fragen, nicht TEXT-Prop) · **A16** SKILL.md T2.5→T4 (Story geschrieben + Gate grün VOR jeder Figma-Aktion) ·
  **B44/B45** /figma-build-rules §Slots/§Mechanism (Many-Child-Slot leer bauen + append-only · „text-ODER-
  component"-Leaf = Slot mit prop-gebundenem Text-Default) · **C9** tokens-reference §6 (`text-muted-foreground`
  →`text-muted-ink`, schon abgedeckt).

### A — gap caused a defect (priority)

#### /figma-build-rules

**A14 · §Usage-examples / §Composites — recompose-able Container-Composite braucht content-Slot; variierte Beispiele nie hand-bauen (Done-Test-Miss)** *(Table #6)*

| Feld | Inhalt |
|---|---|
| Why A | 3 von 4 Usage-Examples waren hand-gebaute Frames statt Table-Instanzen; User fand es → Rework (Composition auf content-Slot umbauen + 3 Beispiele konvertieren). |
| Gap | §Usage-examples sagt „composed only from controls; never hand-build", warnt aber nicht: ein recompose-able Container-Composite (Table/List/Card-mit-Body), dessen Beispiele den Content *variieren*, braucht einen CONTENT-Slot (Default = ein gebackenes Demo) → jedes Beispiel = Instanz, die den Slot füllt. Falle: fixen Content in die Composition backen + variierte Beispiele als Geschwister-Frames hand-bauen (besteht den flüchtigen Blick, fällt den Done-Test). |
| Verified | nach Umbau auf content-Slot wurden alle 4 Beispiele echte Table-Instanzen (alte Frames in die Slots verschoben), 0 Regressionen, 0 geclippte Nodes. |
| Candidate fix | §Usage-examples (bzw. §Composites Build-Layer-4) ergänzen: recompose-able Container-Composite (Content variiert pro Beispiel) → Composition bekommt einen CONTENT-Slot (Default = EIN gebackenes Demo); jedes Beispiel = INSTANZ, die den Slot füllt, kein hand-gebauter Geschwister-Frame. |
| Status | offen. |

#### composites.md

**A15 · §2 T2.7 — content-tragender Leaf-Part defaultet auf open content (Slot-vs-Swap fragen), nicht TEXT-Prop** *(Table #4)*

| Feld | Inhalt |
|---|---|
| Why A | Zellinhalt still als TEXT-Prop (text-only) modelliert; User kam nach Handoff zurück und verlangte component-fähige Zellen → Round-Trip + Figma-Retrofit (content-Slot ins kombinierte Cell-Set). |
| Gap | T2.7 listet „Slot vs Swap per open content" als Fork, flaggt aber nicht, dass content-tragende Leaf-Parts in einem Data-Display-Composite (Zellen, Listenzeilen-Body, Menü-Item-Label) per Default OPEN content sind → der Agent kann still eine TEXT-Prop wählen + eine zu dünne Surface liefern. Der Done-Test maskierte es (Checkbox als „Call-Site" weg-scoped). |
| Verified | Data-Table-Doc-Demo nutzt Checkbox/Badge/Button in Zellen; User-Request „table cell nimmt auch components an". |
| Candidate fix | T2.7 ergänzen — ist der Inhalt eines Leaf-Parts Daten/Werte (Zelle, Zeilen-Body, Item-Label), per Default als open content behandeln → Slot-vs-Swap-vs-Text fragen, nicht auf TEXT-Prop defaulten; TEXT-Prop nur bei nachweislich text-only. *(also: SKILL.md T2.6)* |
| Status | offen. |

#### SKILL.md

**A16 · T2.5→T4 — harter Gate: keine Figma-Aktion (inkl. Recon) vor geschriebener + grüner Story** *(Table #1)*

| Feld | Inhalt |
|---|---|
| Why A | T4-Figma-Recon (recon.js, `whoami`) begonnen, bevor eine T2.5-Story geschrieben war; User unterbrach + redirectete. |
| Gap | T2.5 sagt „author … BEFORE Figma" nur als Parenthese; kein blockierender Checkpoint zwischen T2.5 und T4. „Doc-Beispiele gelesen" fühlt sich wie „T2.5 erledigt" an, ist es aber nicht. |
| Verified | vom User abgefangen, bevor Figma-Schreibzugriff erfolgte. |
| Candidate fix | am Ende von T2.5 ein harter Gate-Satz: „Keine Figma-Aktion — Recon eingeschlossen — bevor die Story-Datei geschrieben UND das Gate grün ist." Optional in composites.md §2 spiegeln (T2.6/T2.7 schieben noch mehr Schritte dazwischen). |
| Status | offen. |

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

**B41 · Red flags (Plugin-API) — leere GROUP löst sich auf · `setCurrentPageAsync`-Fehler · `combineAsVariants` braucht eine Page** *(Tooltip-Root-Mirror)*

| Feld | Inhalt |
|---|---|
| Why B | Je 1 atomarer Fehler, drumherum geroutet, Ergebnis korrekt. |
| Gap | Drei Plugin-API-Fallen fehlen in der Red-flags-Tabelle. |
| Verified | (a) alle Kinder aus einer GROUP raus → Figma löst die GROUP automatisch auf → spätere Referenz wirft „node does not exist". (b) `setCurrentPageAsync(page)` warf `Internal Figma error: Unknown node type … getPublicNodeType` auf einer schon geladenen/aktuellen Page; ohne Page-Switch lief's. (c) `combineAsVariants` warf „Grouped nodes must be in the same page as the parent", weil die Klone an `figma.currentPage` (≠ Build-Page) hingen. |
| Candidate fix | Red-flags-Zeilen: GROUP nach dem Leeren nicht mehr referenzieren (Figma löst leere GROUPs auto-auf). · Ist die Ziel-Page schon current/geladen, `setCurrentPageAsync` weglassen (redundanter Switch kann intern `getPublicNodeType` werfen). · `combineAsVariants` braucht ALLE Components + Parent auf EINER Page → Klone an die Parent-Page hängen (Ancestor-Walk zur PAGE + `page.appendChild`), nie an `figma.currentPage`. |
| Status | zurückgestellt. |

**B44 · §Slots / §Usage-examples — Many-Child-Slot LEER bauen + Demo backen; Beispiele append-only (nicht clear-then-refill)** *(Table #3)*

| Feld | Inhalt |
|---|---|
| Why B | selbst hergeleitet (2 Probe-Calls), Slots korrekt gebaut. Tabelle = Row→Cells→Table = bis zu 3 Slot-Ebenen mit vielen Kindern. |
| Gap | §Slots dokumentiert (a) Clearing von Instance-Slot-Defaults = ein Remove pro Call und (b) Append-Re-Resolve getrennt, verbindet sie aber nicht zur STRATEGIE für Slots mit vielen Kindern (Table-Cells, List-Items). |
| Verified | 3 gebackene Cells clearen → Fehler nach 1 Remove (`Node … not found`); in leeren Slot 2 appenden + letztes Kind neu auflösen → 0 Fehler. |
| Candidate fix | Slot mit vielen Kindern (deren Beispiele ihn füllen) LEER bauen, Demo-Content in ein Kompositions-Member backen (Konvention „Slots LEER gebaut"); Reproduktion **append-only** (letztes Kind für FILL/props neu auflösen); keine Defaults backen, die man später clearen muss (Instance-Slot-Default-Clear = one-remove-per-call). |
| Bezug | Re-Resolve-/one-remove-Invariante = B1 (§Slots); diese Finding hängt die *Strategie* dran (leer bauen statt clearen). |
| Status | zurückgestellt. |

**B45 · §Mechanism / §Slots — „text ODER component"-Leaf = content-Slot mit prop-gebundenem TEXT-Default (nicht leerer Slot neben Text)** *(Table #5)*

| Feld | Inhalt |
|---|---|
| Why B | beim Cell-Retrofit hergeleitet; korrekt gelöst (eine Iteration gekostet). |
| Gap | §Slots/§Mechanism sagt „drop a default inside" + „empty slot ~100×100", aber nicht als Pattern für ein Leaf, das *text ODER component* hält: der content-Slot bekommt als Default das **prop-gebundene TEXT-Node** (Text IN den Slot), nie ein leeres Slot-Feld neben dem Text. „Leerer Slot + Text als Geschwister" ist die Falle. |
| Verified | leerer Slot neben Text → Member 116px (Slot 100×100, HUG kollabiert nicht); Text in den Slot genestet → 37px, Slot HUGt Text, TEXT-Prop bindet weiter, Component-Swap (Checkbox/Badge) ok. |
| Candidate fix | Leaf, das Text ODER Component hält → EIN content-Slot, dessen Default das prop-gebundene Text-Node ist (Text in den Slot nesten); nie einen leeren Slot neben einem Text-Node führen (leerer Slot ist ~100×100 und bläht den Container). |
| Bezug | Generalisiert B12 (composites.md: Text-Region als SLOT-mit-Default statt Text-Prop) auf den „text-ODER-component"-Fall + die Empty-Slot-Bloat-Falle. |
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

### C — tooling / repo / already covered

#### tokens-reference.md

**C9 · §6 — stock `text-muted-foreground` → DS `text-muted-ink` (-ink-Suffix), schon abgedeckt** *(Table #2)*

| Feld | Inhalt |
|---|---|
| Why C | kein Defekt; das Mapping steht korrekt in §6 `color_renames`. User markierte es als wiederkehrende Stolperstelle (Sekundärtext: Caption, muted-Labels). |
| Gap | der Text-vs-Fläche-Suffix-Split (`-ink`=Text/Icon, `-fill`=Fläche) ist leicht zu vermischen → ein Port schreibt evtl. `text-muted` / `text-muted-fill` statt `text-muted-ink`. |
| Verified | §6 `color_renames`: `text-muted-foreground → text-muted-ink`; `item.tsx:176` nutzt `text-muted-ink`. |
| Candidate fix | bereits in §6 abgedeckt — beim Port konsequent §6 lesen statt nach Namens-Ähnlichkeit raten. Skill-Prosa bleibt token-namen-frei (`.claude/skills/CLAUDE.md`); Home = tokens-reference §6. Entry = Evidenz. |
| Status | abgedeckt. |

## Quellen

- Findings im Original (mit Verified-Belegen): `agent-runs/component-port/
  {2026-06-08-breadcrumb,2026-06-10-input-group,2026-06-10-command,2026-06-10-dialog,
  2026-06-11-command-dialog,2026-06-12-badge,2026-06-12-separator,2026-06-12-field,
  2026-06-12-checkbox,2026-06-12-switch,2026-06-12-radio-group,2026-06-19-select,2026-06-22-slider,
  2026-06-22-tooltip,2026-06-22-popover,2026-06-23-tooltip-root-mirror,2026-06-26-item,2026-06-26-table}/skill-feedback.md` +
  `agent-runs/component-sync/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md`
- Component-Locator/Status: `design-docs/design-system/components-reference.md` (zuerst lesen)
- Token-Crosswalk: `design-docs/design-system/tokens-reference.md` (§3 Kollisions-Regel,
  §4 `text-format-*`, §6 stock→DS, §7 Auto-Layout→Utilities)
- Run-Notes: `agent-runs/component-port/*/notes.md` + `agent-runs/component-sync/*/notes.md`
- Gate (Lib): `npx nx test|typecheck|lint @agentport/ui` · Voll-Gate: `npm run check`

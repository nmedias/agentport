# Handoff — Component-Port: Offene Punkte + Skill-Findings (konsolidiert)

> Ersetzt `handoff-agentport-component-port.md` + `handoff-composite-port.md` (beide gelöscht
> 2026-06-12). Alles **Erledigte** ist raus — Locator/Status aller Components + Figma-Node-IDs:
> `design-docs/design-system/components-reference.md` (**zuerst lesen**), Token-Crosswalk:
> `design-docs/design-system/tokens-reference.md`, Run-Details: `agent-runs/`.

**Stand 2026-06-12:** `master` = **15 Components** ff (kein Remote, `npm run check` grün, 92 Tests).
Form-Toggle-Batch (Checkbox · Switch · RadioGroup) **gemerged** (Code + token-gebundene Figma-Sets +
permanente Usage-Examples + Figma→Code-Sync + Field-komponierte Stories) + Skill-Edit (usage-examples-
Deliverable + Doc-Treue ins `/shadcn-component-port` gehoben) gemerged. Standard: Glow = literal-Alpha
DROP_SHADOW `showShadowBehindNode:false` (verbatim vom `.Input`-Focus); Stories in Doc-Komposition (Field-Familie).
**FIGMA-NACHLAUF (extern, NICHT in git):** die 3 Usage-Example-Gruppen auf echtes `.Field`-Reuse umgebaut;
dafür `.Field` erweitert — `controlPosition [trailing,leading]`-Achse (control-leading für Checkbox/Radio) +
neues `.FieldLegend`-Set + invalid-error-Slot-Fix (Ursache: `clone()` degradiert SLOT→FRAME). `controlPosition`
= **Figma-only Fork** (kein Code-Prop). Details: Katalog `.Field`/`.FieldLegend` + die 3 `examples`-Einträge.
**15 Components** portiert + nova-aligned (Button, Input, Textarea, Kbd, Breadcrumb, InputGroup,
Command inkl. Palette-Variante + CommandDialog, Dialog, Badge, Separator, **Field (+ co-ported
Label)**, **Checkbox, Switch, RadioGroup**) + Blocks-Layer (`explorer/metadata-list`). Badge: 6 nova-Varianten (`ghost`/`link`
über die Brief-4, bewusst) mit `secondary`/`destructive` an ⚠-Platzhalter gebunden; Separator-Achse =
`orientation` (h/v); AsChild-Control-Footgun gefixt (#21). **Field = Surface-less Composite**
(`orientation × invalid` + 4 Slots, nur Spacing+Typo gebunden; FieldSet/Group/Legend/Title +
`responsive` = Code-only; FieldError→`destructive ⚠`); **Label public** (Hard-Dep von Field).
Composite-Verfahren validiert (**4×**: InputGroup/Command/Dialog/Field), operativ in
`/shadcn-component-port` (SKILL.md + references/composites.md + references/figma-build.md); Pflege via
`/component-sync` (Figma→Code).

## Offene Punkte

1. **Skill-Findings einarbeiten** (Block unten) — User wendet an. **Triage 2026-06-22: alle Findings nach
   A/B/C sortiert — s. „Triage / Sortierung" unten. A-Fälle (Agent kam trotz Skill-Schweigen zum geplanten
   Ergebnis) = ZURÜCKGESTELLT (Kodifizierung, kein Bugfix → niedrige Prio); B-Fälle (Lücke verursachte einen
   Defekt) = aktiv/vorrangig.** **Noch offen: Findings 15–28** aus den
   Badge-/Separator-Runs, dem Badge-Stories-Refine (15–21) und dem Field-Composite-Run (22–28:
   Hard-Dep-muss-porten, Flat-Shadow-Evidenz, Surface-less-Composite-Rezept, Slot-statt-Text-Property,
   lokales Nesting via `createInstance`, 2px-Spacing-Rung, 16px-Typo-Rolle) — geprüft: keine davon im
   Skill (kein lucide/radix-ui/SizingMode-Treffer). **Eingearbeitet:** InputGroup #1–#3 (2026-06-10) +
   #29 Text-Property-Konvention + Mechanismus-Tabellen-Refactor (composites.md §1 → figma-build.md
   §Mechanism), beide figma-build.md 2026-06-12 — s. „Bereits eingearbeitet".
   **Neu 06-12 (Form-Toggle-Batch + erste `/component-sync`): Findings 30–45** — Glow-Rezept-Cluster
   (literal-Alpha / `showShadowBehindNode:false` / invalid-synthetisieren / Sweep-all-Member),
   `ring-[3px]`-Sibling-Konvention, Rollen-Token-Kontrast-Ausnahme, no-CVA-State-Achse, Examples =
   permanenter Deliverable, Stories in Doc-Komposition (Field-Familie), Geometrie-Toggle-Rezept, +
   `/component-sync` (bound≠Deviation, ADD-Diff-Form, no-delta-Outcome, Snippet-Indicator-Kind).
   **Davon 06-12 eingearbeitet:** #34 (Examples-Deliverable) + #36 (Doc-Komposition) — s. „Bereits
   eingearbeitet". Rest (30–33, 35, 37–45) offen.
   **Neu 06-12 (Figma-Example-Runs): Findings 46–51** (clone()→SLOT-Degradierung, createSlot-Orphan-Prop,
   fill-slot-in-instance-Zusätze, figma-verify überspringt visible:false, control-leading-`.Field`, VariableID-Präfix)
   — offen. **Neu 06-19 (Select-Port): Findings 52–58** — Slot-Merge-Timing · Section-Koord-Doppel-Offset (schärft #16) ·
   Section-Auto-Grow · 1-Removal-pro-Call (schärft #48) · radix-Umbrella-Scope (verengt #3) · Composite-Doc-Prop-Split
   (`subcomponents`) · Select-jsdom-Polyfill-Heuristik — offen.
   **Neu 06-20 (Select-Review): Findings 59–61** + #57-Schärfung — anchored-Overlay-Composition (Content als absolut-
   pos. Slot) · `/figma-verify` ist strukturell → Examples screenshotten (Analogon #11) · Sibling-Surface spiegeln
   (Trigger focus-invalid+gated Ring · Item showIcon-Bool · alle Doc-Subcomponents) — offen. SB2 (Invalid-Story) =
   kein Skill-Thema (kanonischer Example-Name, Port-Fehler).
   **Neu/korrigiert 06-21:** **#57 final umgeschrieben** — Composite-Sub-Parts dokumentieren = **eigenes Story-File
   je API-Part** (RadioGroupItem-Muster), NICHT `meta.subcomponents` (frühere Tracker-Beschreibung „subcomponents"
   ist überholt; die verbrannte subcomponents-Iteration bleibt als Warum drin). Angewandt auf **Select · Field ·
   Dialog · InputGroup · Command**; inkl. „Zwei Part-Page-Fallen" (source.code-Snippet bei Wrapper-render +
   Omit/re-declare geerbter Props für vollständige ArgsTable). **Finding 62** (neu) — flache Command-Palette =
   statisch → `shouldFilter={false}` (cmdk re-sortiert sonst Items über die scope-losen labeled Separatoren) — offen.
2. **Composite-Strang: nichts offen.** **Checkbox · Switch · RadioGroup 06-12 portiert** (Form-Toggle-Batch,
   Branch `feat/form-toggles-port`). **Select 06-19 portiert** (Composite, Branch `feat/select-port`; Figma via
   Background-Agent ausgelagert, Code parallel; Findings A–G s. u.). Kandidaten für den nächsten Schritt: **Slider**
   porten (letzter zurückgestellter Field-Control, s. #6), weiteres Composite (`/shadcn-component-port <name>`) oder
   Blocks-Arbeit auf den Palette-Bausteinen.
3. **Dark-Mode-Token-Satz** in Figma + `.dark`-Block in globals.css (`--background-fixed` ausnehmen).
   Bis dahin: Light = einziger Mode.
4. **9 ⚠-Platzhalter-Tokens echt designen:** `secondary*`, `destructive*`, `chart-1…5`
   (`destructive` = invalid-State von `.Input`/`.Textarea`, jetzt auch Badge `secondary`/`destructive`-
   Varianten + Field `FieldError`). *(Übernommen aus `handoff-agentport-tokens-color.md`.)*
5. **Status-Familie** `connected/offline/error/warning`, **Anteils-Balken**, **Rail-Aktiv-Icons**.
   *(Ebenfalls aus dem Token-Handoff.)*
6. **Field-Folgearbeit (zurückgestellte Beispiele).** **Update 06-12:** Checkbox/Switch/RadioGroup jetzt
   portiert → `field-checkbox`/`-switch`/`-radio` + `field-choice-card` sind baubar; die Field-komponierten
   Stories der drei Controls decken Choice-Card-/Group-/Fieldset-/Invalid-Muster bereits ab (der
   FieldLabel-`has-[data-slot=field]`-Branch ist damit erstmals real gerendert — Storybook). **Update 06-19:**
   **Select portiert** → `field-select` + `field-demo` (Voll-Formular) jetzt baubar. Offen bleibt nur noch
   `field-slider` (braucht **Slider**).
   Detail + Example-Inventory: `agent-runs/component-port/2026-06-12-field/notes.md` (Open items #4/#5).

## Nova-Baseline — Standing Notes (aus den gelöschten Handoffs übernommen)

- **Nie `shadcn init` unter radix-nova** — würde die Figma-DS-Schicht (globals.css) mit Nova-CSS
  überschreiben. `ui:add` injiziert NICHTS in globals.css (Component-Items tragen kein `cssVars/css`).
- Die **9 data-state Custom-Variants** (`data-open/closed/checked/.../vertical`) + `no-scrollbar`
  in globals sind token-freie Selector-Plumbing (verbatim aus einem Nova-Init nachgezogen,
  `4cdcdf5`) — damit Nova-Source-Klassen resolven; keine Werte.
- Nova-Source referenziert Utilities, die globals.css nicht hat (`rounded-4xl`, dead `text-xs`,
  `color-mix(--secondary)`, `dark:` inert) → **T3-Übersetzungsziele**, nicht Auto-Add.
  Re-Clothe-Regel: Dichte **per NAME** auf DS-Tokens mappen, nicht Novas Rohwerte/`--radius`-Skala.
- `/component-sync` ist **NUR Figma→Code**; ein Code→Figma-Push ist manuell via `use_figma`,
  nur auf explizite Ansage.
- cmdk-Polyfills (ResizeObserver/scrollIntoView) in `libs/ui/src/test-setup.ts` **belassen**;
  jsdom-Polyfill einmalig pro Headless-Lib (Radix Dialog brauchte keine neuen).
- Storybook (`npm run storybook`, :6006) **vor** Port/Sync starten, sonst kein `preview-stories`.
- Nova-Source vor `ui:add` ansehen: Registry-JSON `https://ui.shadcn.com/r/styles/radix-nova/<c>.json`.

## Skill-Findings (konsolidiert)

Quelle: `agent-runs/component-port/*/skill-feedback.md` — Breadcrumb (06-08) · InputGroup (06-10) ·
Command (06-10) · Dialog (06-10) · CommandDialog (06-11) · Badge (06-12) · Separator (06-12) ·
Field (06-12, + co-port Label) · **Checkbox/Switch/RadioGroup (06-12, Port + erstmals `/component-sync`)**.
Verified-Belege stehen in den Run-Dateien;
hier der deduplizierte Stand, gruppiert nach Ziel-Datei. **User reviewt + wendet an** — Skills werden
nie mid-run editiert.

> **Formulierungs-Regel für ALLE Finding-Edits (User 2026-06-22):** der in den Skill eingearbeitete Text
> ist **kompakt, generisch und agent-gerichtet** — KEIN Run-Bezug, KEINE Component-Namen (kein
> `.Button`/`Dialog`/…, kein „der X-Port"), keine User-Erklärungen; nur was der Agent zur Ausführung
> braucht. **Der Skill muss selbst vollständig sein:** Finding-/`skill-feedback.md`-/Run-Notes sind
> review-temporär und werden gelöscht → NICHT als dauerhafte Referenz verlinken; alles Ausführungs-
> relevante generisch in den Skill schreiben. Konkrete Belege/Beispiele sind reine Review-Evidenz und
> verschwinden mit jenen Dateien — nicht zur „Aufbewahrung" in den Skill ziehen. (= Memory `skill-writing-style`.)

### Triage / Sortierung (2026-06-22)

> **Sortier-Achse:** Hat die Skill-Lücke etwas *gekostet*, oder ist der Agent drumherum geroutet und
> trotzdem beim geplanten Ergebnis gelandet?
>
> - **A — selbst hergeleitet, Ergebnis stimmte** → Skill-Edit = Wissen kodifizieren, kein Bugfix.
>   **Bearbeitung ERSTMAL ZURÜCKGESTELLT** (User-Entscheid 2026-06-22): der Port lief korrekt, die
>   Kodifizierung spart nur künftiges Neu-Herleiten → niedrige Prio.
> - **B — Lücke verursachte einen Defekt** (Gate rot · Crash · geworfener Error · falsch gerendert ·
>   User fand den Bug) → Skill-Edit = Leitplanke. **Aktiv / vorrangig.**
> - **C — Tooling/Repo-Fix oder schon abgedeckt.**
>
> Grenzfall-Entscheide (User 2026-06-22): **#30 · #57 → B** (Ergebnis stimmte erst nach Defekt bzw.
> verbrannter `subcomponents`-Iteration); **#3 · #7 · #38 · #44 · #45 → A** (Konventions-/Prozess-Nuancen,
> lief). Die Verified-Belege je Finding stehen in der jeweiligen Sektion unten + den Run-Dateien.

#### A — zurückgestellt (26)

| # | Kurz | Warum A (Beleg) |
|---|------|-----------------|
| 3 | radix-Umbrella-Import | lief transitiv; #56 bestätigt: für volle Primitives ist Umbrella sogar richtig |
| 5 | Layer-2-Nesting-Hard-Case | Base-Override/Icon-Swap-Rezept selbst gefunden, an Dialog re-validiert |
| 7 | Slot-Default Re-Resolve-Invariant | one-remove-per-resolve-Verhalten selbst beobachtet, Slots gebaut |
| 17 | ⚠-Suffix-Matcher | dok. `endsWith` gibt []; Agent band per vollem Namens-Scan korrekt (nicht Roh-Hex) |
| 18 | Tinted bound surface | Alias-Kette rekursiv aufgelöst → 10%-Rot mit erhaltener Bindung (verified) |
| 19 | gelandete CVA > Brief | 6 Varianten voll in Figma gebaut + im Code belassen (richtig) |
| 20 | 12px-Sans per Rolle | auf `text-format-label` gesnappt — Caveat „Agent rät" |
| 22 | Hard-Dep co-porten | `Label` co-portiert (einziger gültiger Weg; Skill bot fälschl. stub/defer an) |
| 24 | Surface-less Composite | nur ROW + Spacing/Typo gebunden, verify CLEAN |
| 25 | Text-Region als Slot | 4 Slots → 4 Set-Level-Props (verified) |
| 26 | lokales Nesting | importByKey warf „not found"; `getNodeByIdAsync`+`createInstance` ok |
| 27 | 2px-Spacing-Rung | px-Wert-Regel → `gap-2xs` korrekt trotz unvollständiger Beispiel-Liste |
| 28 | 16px-Sans per Rolle | `text-format-title` (sinnvoll, generalisiert #20) |
| 31 | `ring-3`→`ring-[3px]` | Sibling-Konvention; funktional identisch (3px) |
| 32 | Rollen-Token-Kontrast | `bg-input` bewusst behalten (verified `muted`≈1.04:1 vs `input`≥3:1) |
| 33 | No-CVA-State-Achse | korrekt als Member vs. komponierende Overlays modelliert |
| 35 | orthogonale Kombi | legitimer Instanz-`opacity`-Override, in notes vermerkt |
| 38 | twMerge-Guard auf at-risk-Utility | richtige Utility (`corner-*`) identifiziert |
| 39 | Two-Part-Geometrie-Toggle | 10 flache Member ohne Base, controls-live + verify CLEAN |
| 42 | no-delta First-Class-Outcome | korrekt gemeldet, nichts erfunden |
| 44 | Member→Variant-Prefix-Mapping | korrekt angewandt (Doku-Naming) |
| 45 | wrapper `fileKey`+`description` | minor/env, lief |
| 48 | Fill-slot-in-instance-Rezept | clear+append / Read-back-im-Folge-Call funktionierte |
| 50 | control-leading `.Field` | `controlPosition`-Achse selbst gebaut, korrekt genestet |
| 56 | radix-Umbrella für volle Primitives | richtige Wahl (Dialog-Konvention; verengt #3) |
| 58 | kein jsdom-Polyfill (closed-only Spec) | erkannt, Spec lief grün |

#### B — vorrangig (1 offen · 28 ✅ + #62 verworfen — figma-build 14 · SKILL.md 3 · storybook-rules 4 · composites 4 · component-sync 3 — 2026-06-22)

> ✅ = eingearbeitet (s. „Bereits eingearbeitet" + Bundle). #8/#9/#46/#47 dabei live-korrigiert (Detail-
> Einträge maßgeblich). #62 verworfen (component-spezifisch). **Offen nur noch:** snippets (#13).

| # | Kurz | Status / was die Lücke kostete |
|---|------|--------------------------------|
| ✅ 1 | lucide → `@remixicon`-Swap | eingearbeitet (SKILL.md T2) |
| ✅ 2 | delete+defer ≠ nur Dep-Datei | eingearbeitet (composites.md §2 T2) |
| ✅ 4 | Usage-Contract aus Docs | eingearbeitet (composites.md §2 T2.6) |
| ✅ 6 | Swap-Ziel per exaktem NAMEN | eingearbeitet (Red-flags-Zeile) |
| ✅ 8 | optionaler Slot = Boolean an `visible` | eingearbeitet — **korrigiert: KEIN FRAME, Slot bleibt SLOT** |
| ✅ 9 | leerer Slot = 100×100 Default-Box | eingearbeitet — **korrigiert: kein HUG-Bug; Boolean+Auto-Layout kollabiert** |
| ✅ 10 | DOM-Globals + Portal-Asserts | eingearbeitet (storybook-rules §play/Cross-cutting) |
| ✅ 11 | Render-Verify Sizing-px | eingearbeitet (storybook-rules Gate; ohne Token-Pointer) |
| ✅ 12 | Shadow-Familie in twMerge | eingearbeitet (`utils.ts` Repo-Fix + T1; runtime+typecheck ✓) |
| 13 | AUTO-Sizing nach combine | vertikales Padding still gedroppt |
| ✅ 15 | `setCurrentPageAsync`-Invariante | eingearbeitet |
| ✅ 16 | Section-relative Koords | eingearbeitet |
| ✅ 21 | asChild-Control + eigene Story | eingearbeitet (storybook-rules Cross-cutting) |
| ✅ 30 | Glow-/Ring-Cluster | eingearbeitet (alle 4 Teile live verifiziert) |
| ✅ 37 | `mv` statt `git mv` | eingearbeitet (SKILL.md T2) |
| ✅ 40 | S3 Diff-Form ADD/REMOVE | eingearbeitet (component-sync S3 Tier 1; + blocked-delta-Punkt) |
| ✅ 41 | bound = Delta, nicht „Deviation" | eingearbeitet (component-sync Red flags) |
| ✅ 43 | read-set-values: Indicator-Shapes | eingearbeitet (Snippet + S2; syntax-geprüft) |
| ✅ 46 | Variant-Member-Clone | eingearbeitet — **korrigiert: bleibt SLOT, verliert nur `slotContentId` → re-binden** |
| ✅ 47 | createSlot-Orphan | eingearbeitet — nur beim Neu-Bauen; #46 re-bindet → meist obsolet |
| ✅ 51 | `VariableID:`-Präfix nötig | eingearbeitet (bare → `null`) |
| ✅ 52 | Slot-Merge zur combine-Zeit | eingearbeitet (nach combine = N Props) |
| ✅ 53 | Section-Kind-Koords (schärft #16) | eingearbeitet |
| ✅ 54 | Sections wachsen nicht auto | eingearbeitet (`resizeWithoutConstraints` B+H) |
| ✅ 55 | 1-Op pro Call (schärft #48) | eingearbeitet |
| ✅ 57 | Composite-Doc = Story-File je Part | eingearbeitet (storybook-rules neue Section) |
| ✅ 59 | Anchored-Overlay-Composite | eingearbeitet (composites.md §2 T4 Layer 3) |
| ✅ 60 | Examples screenshotten | eingearbeitet (Verify nur strukturell) |
| ✅ 61 | Sibling-Surface spiegeln | eingearbeitet (composites.md §2 T2.6; Doc-Page → storybook-rules) |
| — 62 | flache Palette `shouldFilter=false` | verworfen: component-spezifisch, inline in command.tsx + Stories |

#### C — Tooling/Repo / erledigt (3 + 3 ✅)

| # | Kurz | Status |
|---|------|--------|
| 14 | Snippet-Scaffold Composite-Sub-Builds | optional, Backlog |
| 23 | Flat-Shadow-Copy = STOCK | Regel schon eingearbeitet (#1) — hier nur Evidenz |
| 49 | figma-verify überspringt `visible:false` | figma-verify-Tooling-Refinement |
| 29 | Text-Property-Konvention | ✅ eingearbeitet (figma-build.md) |
| 34 | Examples = Deliverable | ✅ eingearbeitet (figma-build.md §Usage-examples) |
| 36 | Stories in Doc-Komposition | ✅ eingearbeitet (SKILL.md T2.5) |

#### B — gebündelt nach Ziel-Datei (Einarbeitungs-Reihenfolge)

> Pro Datei in **einem Rutsch** einarbeiten. „(auch: X)" = Finding berührt zusätzlich Datei X.
> Vorschlag-Reihenfolge: `figma-build.md` → `SKILL.md` → `composites.md` → `/component-sync` → Rest.
> Voller Wortlaut + Verified-Belege je Finding in den Sektionen unten.

**`figma-build.md` (14)** — ✅ **eingearbeitet 2026-06-22** (mehrere Claims live in Figma geprüft; #8/#9/#46/#47
dabei korrigiert — s. Detail-Einträge unten)
- **§Icons → Red flags:** **#6** Swap-/Lookup-Ziel per exaktem Main-NAMEN, nicht `/icon/i`-Substring
- **§Approach:** **#15** `setCurrentPageAsync` als Per-Call-Invariante *(dokumentiert)*
- **§Binding recipes:** **#51** `getVariableByIdAsync` braucht `VariableID:`-Präfix (bare → `null`) ✓verifiziert
- **§Slots:** **#52** Slot-Merge zur `combineAsVariants`-Zeit (Slots VOR dem Kombinieren) ✓ · **#8/#9** optionaler
  Slot = Boolean direkt an `visible` (KEIN Wrapper; Slot bleibt SLOT; leere Default-Box = 100×100) ✓korrigiert ·
  **#46/#47** Variant-Member-Clone behält SLOT, verliert nur `slotContentId` → re-binden statt neu bauen ✓korrigiert ·
  **#55** Instanz-Slot-Mutation strikt 1 Op pro Call ✓
- **§Variant set assembly:** **#16/#53/#54** Section-Kind-Koords section-relativ + Sections wachsen nicht automatisch
  (`resizeWithoutConstraints` B+H) ✓
- **§Interaction states:** **#30** Glow-Cluster (literal-Alpha statt Bind · `showShadowBehindNode:false` ·
  focus-copy/invalid-synth · sweep-all) ✓
- **§Usage-examples:** **#60** Examples screenshotten + eyeballen (Verify nur strukturell) *(auch: SKILL.md T5)*
- *Bonus Red-flags:* `.height` spiegelt Visibility-Reflow nicht → Screenshot ✓

**`SKILL.md` (3)** — ✅ **eingearbeitet 2026-06-22** (#2/#21/#61/#10/#11 re-homed → composites.md / storybook-rules)
- **T1 twMerge:** **#12** DS-Shadow-Familie registriert — Repo-Fix `utils.ts` (runtime + typecheck verifiziert)
  + T1 generisch umformuliert (keine DS-Token-Namen mehr) ✓
- **T2 „Land":** **#1** lucide → `@remixicon/react`-Swap · **#37** `mv` statt `git mv` (untracked source)

**`composites.md` (4)** — ✅ **eingearbeitet 2026-06-22** (#2/#61 re-homed aus SKILL.md; #62 verworfen)
- **#2** delete+defer ≠ nur die Dep-Datei → konsumierenden Sub-Export ganz raus (§2 T2) ✓
- **#4** Usage-Contract aus den Doc-Beispielen, nicht der Style-Source (Wrapper-API vor T3 cross-checken; §2 T2.6) ✓
- **#59** Anchored-Overlay → Open-State als `ABSOLUTE`/trigger-verankerter Child (§2 T4 Layer 3) ✓
- **#61** Sibling-Surface spiegeln: Figma-Surface (state-axis-Konvention, optionale Elemente als Boolean) +
  Doc-Page-Verweis auf `/storybook-rules` (§2 T2.6) ✓
- **#62** ~~flache Palette `shouldFilter=false`~~ → **verworfen** (component-spezifisch; inline in `command.tsx` + Stories)

**`/component-sync` (3)** — ✅ **eingearbeitet 2026-06-22**
- **#40** S3: Satz gebundener Props diffen — gebundene Prop ohne Code-Klasse → ADD, code-hardcoded von Figma
  gedroppt → REMOVE ✓
- **#41** gebundener Wert = Delta (1:1), nie „Deviation" (Red-flags-Zeile) ✓
- **#43** Snippet liest non-slot Indicator-Shapes (bound fill) mit + S2-Notiz ✓ (syntax-geprüft)
- **+ neu (User 2026-06-22):** Figma-Token ohne Code-Utility → **blocked delta** flaggen (Token-Layer-Arbeit,
  out of scope), raw nur als markierter Stopgap (S3 Tier 1 + S6) ✓

**`/storybook-rules` + `/docgen-props` (4)** — ✅ **eingearbeitet 2026-06-22**
- **#11** Render-Verify: nur die Sizing-px-Spezifik ergänzt (Eyeball-via-`shoot`/`preview-stories` existierte
  schon → keine Redundanz; ohne Token-Referenz-Pointer) ✓
- **#10** Portal-Asserts (Trigger-ARIA statt Portal-DOM; deep asserts in `.spec`) + DOM-Globals erlaubt ✓
- **#21** Structured-children-Boolean (`asChild`) → `control:false` + eigene Single-Element-Story ✓
- **#57** Composite-Sub-Parts = eigenes Story-File je API-Part (neue Section; `/docgen-props` als
  Voraussetzung referenziert — kein docgen-props-Edit nötig) ✓

**`snippets/build-variant-set.js` (1)**
- **#13** `primaryAxisSizingMode`/`counterAxisSizingMode = 'AUTO'` VOR der Padding-Zuweisung setzen
  *(zusätzlich berühren #16/#53 die `set.x/y`-Zeilen, #43 `read-set-values.js`)*

### Bereits eingearbeitet ✅ (nur zur Abgrenzung)

- **figma-build B-Findings (Batch 2026-06-22)** ✅ — 14 Findings in `figma-build.md`: #6 (Red flags),
  #15 (§Approach), #51 (§Binding recipes), #8/#9/#46/#47/#52/#55 (§Slots), #16/#53/#54 (§Variant set
  assembly), #30 (§Interaction states), #60 (§Usage-examples) + Bonus Red-flags-Zeile. **Live in Figma
  verifiziert**; #8/#9 (kein Wrapper — Slot bleibt SLOT) + #46/#47 (Variant-Clone behält SLOT, verliert
  nur `slotContentId` → re-binden) dabei **korrigiert**. Handoff-Detaileinträge #8/#9/#46/#47 nachgezogen.
- **SKILL.md B-Findings (Batch 2026-06-22)** ✅ — 3 SKILL.md-native: #12 (T1 twMerge — generisch
  umformuliert + Repo-Fix `utils.ts` Shadow-Gruppe, runtime + typecheck verifiziert), #1 + #37 (T2 „Land":
  lucide→`@remixicon`-Swap, plain `mv`). #2/#10/#11/#21/#61 re-homed → composites.md / storybook-rules.
  T1 zusätzlich von DS-Token-Namen befreit.
- **storybook-rules B-Findings (Batch 2026-06-22)** ✅ — 4 in `/storybook-rules`: #11 (nur Sizing-px-Spezifik
  ergänzt — Eyeball-via-`shoot` existierte schon, ohne Token-Pointer), #10 (Portal-Asserts + DOM-Globals),
  #21 (asChild → `control:false` + eigene Story), #57 (neue Section „Composite sub-parts → one file per
  API-part", NICHT `meta.subcomponents`; `/docgen-props` als Voraussetzung referenziert — kein docgen-props-Edit).
- **composites.md B-Findings (Batch 2026-06-22)** ✅ — 4 in `composites.md`: #2 (delete+defer ≠ nur die
  Dep-Datei), #4 (Usage-Contract aus den Doc-Beispielen), #59 (Anchored-Overlay → `ABSOLUTE`-verankerter
  Child), #61 (Sibling-Surface — Figma-Surface + Doc-Page-Verweis auf `/storybook-rules`). #62 verworfen
  (component-spezifisch, inline in `command.tsx` + Stories).
- **component-sync B-Findings (Batch 2026-06-22)** ✅ — 3 in `/component-sync`: #40 (S3 Satz gebundener Props
  diffen → ADD/REMOVE), #41 (gebundener Wert = Delta, nie „Deviation"), #43 (Snippet liest non-slot
  Indicator-Shapes mit; syntax-geprüft). **+ neu:** Figma-Token ohne Code-Utility → blocked delta (Token-
  Layer-Arbeit, out of scope; raw nur als markierter Stopgap).
- **Shadowing-Fall** im Dependency-Audit — bereits portierte Ordner-Dep wird von `ui:add` flach
  geschattet → flache Kopie löschen (InputGroup #1 → composites.md §2 T2 + §3 trap-1).
- **Slot-Fill-in-Instanz-Rezept** (InputGroup #2 → figma-build.md §Slots) — *#8/#9 eingearbeitet
  2026-06-22 (kein Wrapper; Slot bleibt SLOT) + #55 (1 Op/Call); #7 (A) bleibt zurückgestellt.*
- **Conditional-Layout → Variant-Achse** (`has-[]`-Direction-Flip; InputGroup #3 → figma-build.md §Mechanism, ex composites.md §1).
- **Text-Property-Konvention** ✅ *(User-Direktive #29; gilt für ALLE Ports, nicht nur Composites)* —
  jede Figma-TEXT-Property sprechend benennen + Default mit Curly-Brackets: Name = semantische Rolle
  (`label`/`description`/`error`/… — `label` nur Beispiel, nie der Default `text`), Value = `{Semantic}`
  (`label`→`{Label}`, `error`→`{Error}`); children-getrieben (Text = ganzer Content der Component) →
  Suffix `(children)`. **Eingearbeitet** in `figma-build.md §Variant set assembly` (Heimat — jeder Port
  via T4; NICHT composites-spezifisch, daher kein Eintrag in composites.md). *(Angewandt auf `.Field`-Familie
  06-12; `.Label` = `label (children)`/`{Label}`.)*
  **Backlog-Sweep (teilweise, 06-12):** Input-Familie nachgezogen — `.Input` (`3177:302`), `.Textarea`
  (`3488:684`), `.InputGroupInput` (`3522:590`), `.InputGroupTextarea` (`3522:592`): je Set/Component
  `placeholder` `{Placeholder}` + `value` `{Value}` + `filled` (bool, default false); Token
  placeholder=`input-placeholder`, value=`foreground` (beide gebunden, kein Raw-Hex). InputGroupInput/
  -Textarea trugen das **literale** generische `text`-Prop (`text#3522:0` / `text#3522:1`) → auf
  `placeholder` umgehängt + gelöscht (genau das #29-Ziel); Input/Textarea hatten gar kein Text-Prop →
  frisch ergänzt. **Toggle-Mechanik (User-Entscheid „Option 2"):** `filled` → `value.visible`, value als
  **absolut überlagernder** Text-Knoten OHNE bg-Cover — ein Figma-Boolean kann nicht invertieren
  (`componentPropertyReferences.visible` ist reine Referenz auf einen Prop-Namen, kein Negate; in den
  Plugin-Typings verifiziert), also überlappen placeholder+value bei `filled:true` sichtbar → akzeptiert
  (placeholder-Text beim Füllen leeren). Verworfen: bg-Cover-Frame (Hack, TEXT-Knoten trägt kein bg),
  `content`-Variante (sauber, aber Grid ×2). **Nebeneffekt:** `filled` hat EINEN Set-Default → das
  Varianten-Raster zeigt uniform `{Placeholder}`; die alten dunklen Demo-Strings (`invoice_2024` etc.)
  wandern in den value-Overlay (`filled:true`). **`.CommandInput` (`3639:2`) bewusst geskippt** (User):
  hat placeholder/value schon (dt. Defaults), kein `filled`; `palette` flach mit nicht-überlappendem
  value, `default` nestet eine `InputGroup`-Instanz → Overlay nur via Shared-Main-Edit/Detach → out of
  scope. **Noch offen:** weitere Components mit generischem `text`-Prop (falls vorhanden); Code-Parität
  nicht gesynct (`filled` = reines Figma-Modeling, `placeholder`/`value` sind im Code native Input-Props
  → kein zwingender `/component-sync`). Build via 4 parallele Agents + Input-Referenz (Recipe: 2 Steps —
  Props am Set/Component, dann value-Overlay absolut mirrored auf Placeholder-Geometrie).
- **Mechanismus-Tabelle → figma-build.md** ✅ *(Struktur-Refactor 06-12)* — die generelle
  „Code-Konstrukt → Figma-Property"-Tabelle (Text/Boolean/Variant/Instance-Swap/Slot/conditional-
  layout→Variant-axis) + When-Regeln aus `composites.md §1` nach **`figma-build.md §Mechanism`**
  verschoben (gilt für ALLE Ports, nicht nur Composites). `composites.md §1` behält nur die
  Composite-Pointe („combines several" + state×layout-Matrix); `SKILL.md` T2/T4-Pointer angepasst.
- **Usage-Examples = Deliverable für JEDEN Port + Doc-Treue** ✅ *(06-12; Findings 34 + 36)* — der
  „reproduce examples as permanent instances"-Deliverable + Done-Test aus `composites.md` **herausgehoben**
  nach **`figma-build.md §Usage-examples`** (generell, nicht mehr Composite-only); `SKILL.md` Output +
  T2.5 + T5 + Process-Tabelle ziehen nach (T2.5 fordert die echte Doc-Komposition aus geporteten
  Composition-Primitives statt `div`+Label; T5/Output machen die permanente Usage-Examples-Group zum
  Vertrag). `composites.md` behält nur die Composite-Nuance (Layer 4, läuft über Slots/Swaps + Pointer
  auf den generellen §Usage-examples). Generisch formuliert (keine Component-/Run-Referenzen, per Memory
  `skill-writing-style`).

### Offen — T2 Dependency-Audit (SKILL.md / composites.md §2)

1. **lucide-IconPlaceholder-Trap** *(2× reproduziert: Command #1, Dialog #1)* — nova-Source nutzt
   `IconPlaceholder`; `ui:add` materialisiert ihn als `lucide-react`-Import; die Lib ist nicht
   installiert → Gate rot. Fix gehört in T2 (Dep-Resolution, keine T6-Kosmetik): jede
   `lucide-react`-Zeile auf das `@remixicon/react`-Äquivalent swappen — das Ziel-Icon steht im
   Registry-JSON als `remixicon`-Prop des `IconPlaceholder`.
2. **Un-portierte Dep, die ein Sub-Part konsumiert → ganzen Sub-Part deferren** *(Command #2)* —
   nur die Dep-Datei löschen lässt dangling Imports zurück (CommandDialog→Dialog). Den
   konsumierenden Sub-Export komplett raus (Funktion + Barrel-Zeile + Story), für Re-Add loggen.
3. **Radix-Umbrella-Import alignen** *(Breadcrumb #1)* — Registry schreibt
   `import { Slot } from "radix-ui"` (+ `Slot.Root`); `radix-ui` ist nur transitiv vorhanden
   (Phantom-Dependency). Auf die Projekt-Konvention per-Primitive umstellen
   (`@radix-ui/react-slot`, `Slot`) + declared-Dependency prüfen; generalisiert auf jedes
   Radix-Primitive.

### Offen — composites.md (Anatomie / Layer-2)

4. **Usage-Contract kommt aus den Doc-Beispielen, nicht der Style-Source** *(CommandDialog #1)* —
   nova-CommandDialog rendert `{children}` bare (ohne `<Command>`-Wrapper) und bricht den
   Doc-Contract; new-york-v4 wrappt. Jede Composite-Wrapper-API vor T3 gegen mind. ein
   Doc-Beispiel cross-checken; bei Widerspruch die Call-Site-API des Beispiels reproduzieren
   und die Source-Abweichung notieren.
5. **Layer-2-Nesting: Hard-Case-Rezept + „Vorgänger ist nicht autoritativ"** *(InputGroup #4;
   via Dialog erneut validiert)* — (a) ein Re-Port muss die Nest-Regel anwenden, auch wenn der
   Vorgänger standalone re-clothed war; (b) Rezept für Components ohne exponierten
   Content/Geometrie: Geometrie liegt oft in der genesteten `*/Base`-Instanz (Top ist `lm:NONE` —
   eine Ebene tiefer per `setBoundVariable` overriden), Text = Deep-Characters-Override, Icon
   hinter gesperrtem Slot-Default = `swapComponent` auf ein **persistentes** Icon-Component
   (ein Swap-Target pro Icon = akzeptierter Cruft). Alternativ Upstream-Fix flaggen (echter
   Icon-Slot + Label-Prop am Basis-Component).

### Offen — figma-build.md (Slots / Icons)

*Der §Slots-Abschnitt ist nach den Dialog-Findings teilweise überholt — Findings 7–9 ersetzen ihn.*

6. **Icon-Swap-Target exakt per Main-Component-NAMEN matchen** *(Dialog #2)* — z. B.
   `mc.name === '.Button Icon'`; nie per `/icon/i`-Substring über Variant-Member-Namen
   (`size=icon-sm` der Base kollidiert → Swap ersetzt die ganze Base, visuell unauffällig).
   Nach jedem Swap strukturell prüfen (welcher Main hängt wo), nicht nur visuell.
7. **Slot-Defaults in Instanzen — Re-Resolve-Invariant** *(Command #3, durch Dialog #3
   verfeinert)* — JEDE Strukturmutation in einem Instanz-Slot (append UND remove) invalidiert
   alle gehaltenen Kind-Refs → ein remove pro Re-Resolve
   (`while (slot.children.length) slot.children[0].remove()`), nie `[...children].forEach(remove)`.
   Slot **mit** Default präsentiert sich in der Instanz als **FRAME** (per Name matchen, nicht
   Typ; leerer Slot bleibt SLOT). Verhalten variiert (Command-Run: virtuelle read-only Defaults,
   nicht entfernbar; Dialog-Run: lesbar + entfernbar unter Re-Resolve) → **Removal als
   unzuverlässig behandeln**; append ERSETZT Defaults nicht (koexistieren sichtbar). Gotcha:
   `instance.setProperties(...)` **materialisiert** geerbte Slot-Defaults zu echten Kindern —
   Component-Slot VOR dem Instanziieren leeren oder die materialisierten Kinder danach löschen.
   Per-Instanz komponierte Slots im Component **LEER** bauen.
8. **Optionaler Slot = Boolean direkt an `visible` (KEIN Wrapper, KEINE FRAME-Konversion)** *(Dialog #4
   war Fehldiagnose — live geprüft 2026-06-22)* — `componentPropertyReferences = { visible }` direkt am
   SLOT toggelt sauber; der Knoten bleibt `SLOT` (gleiche ID, ref greift, fillable). Parent auto-layout →
   Off-Variante kollabiert restlos (Screenshot-verifiziert). Der frühere „Wrapper-FRAME trägt das Boolean"-
   Fix **entfällt** (hing an der falschen FRAME-Diagnose). Separat/unbestritten, aber selbst noch nicht
   live geprüft: Master-Slot-Umbau NACH gebauten Beispiel-Instanzen kostet deren Overrides → Surface final
   vor Examples.
9. **Leerer Slot zeigt seine Default-Box (100×100), kein HUG-Bug** *(Dialog #5 reframed — live geprüft
   2026-06-22)* — die Resthöhe ist die Default-Slot-Geometrie, sichtbar nur wenn der Slot empty UND
   visible ist. Fix für optionale Slots = Boolean an `visible` (kollabiert im Auto-Layout, s. #8), KEIN
   Wrapper. Soll er sichtbar-aber-leer bleiben: HUG-konfigurieren (eigenes Auto-Layout, `fills=[]`).
   Methodik: Kollaps NICHT per `.height` messen (spiegelt den Visibility-Reflow nicht) → Screenshot.

### Offen — SKILL.md T2.5/T6 (Stories / Verify)

10. **Stories + DOM-Globals** *(CommandDialog #2, revidiert Dialog #6)* — Repo-Gap ✅ geschlossen
    (DOM-lib in `libs/ui/tsconfig.storybook.json` nachgerüstet); Skill-Edit offen: braucht ein
    Doc-Beispiel DOM-Globals in einer Story (globale Listener wie ⌘J), Stories-tsconfig auf die
    DOM-lib prüfen/nachrüsten statt das Beispiel zu strippen. Das Dialog-#6-Muster (Asserts über
    Trigger-ARIA statt Portal-Inhalt; Deep-Assertions in die Spec) bleibt gültig fürs separate
    Portal-außerhalb-Canvas-Problem.
11. **T6 „rendered-output check" ist zahnlos, wenn nur URLs gereicht werden** *(Dialog #7)* —
    der Dialog-Port shippte `sm:max-w-sm` als **6px** (Spacing/Container-Kollision); Gate +
    Spec-Klassen-Assertions sehen kompilierte CSS-Werte nicht, der User fand den Bug. Fix:
    mind. eine Story tatsächlich **gerendert** prüfen (Geometrie plausibel?); bei T-Shirt-Namen
    auf Sizing-Utilities (`max-w-*`, `w-*`, `basis-*`) gegen tokens-reference §3
    Kollisions-Regel prüfen, alternativ Dist-CSS-Grep der neuen Klassen. *(Die Kollision selbst
    ist gefixt, `5b62f77`; das Verfahrens-Loch bleibt.)*

### Offen — SKILL.md T1/T3 (twMerge)

12. **DS-Shadow-Semantik fehlt in den twMerge-Extensions** *(CommandDialog #3)* —
    `shadow-elevation`/`shadow-glow` sind nicht registriert → `cn('shadow-elevation',
    'shadow-none')` behält beide Klassen (CSS-Order entscheidet). Repo-Fix (shadow-Gruppe in
    `utils.ts`) ODER T1-Checklist-Zeile: jede DS-Utility-Familie, die ein Port per className
    overrided, muss in twMerge registriert sein — aktuell fehlen die Shadows.

### Offen — snippets/build-variant-set.js (Vor-Composite-Ära, weiter gültig)

13. **AUTO-Sizing nach `combineAsVariants` setzen** *(Breadcrumb #2)* — das Snippet setzt
    Padding, aber nie `primaryAxisSizingMode`/`counterAxisSizingMode = 'AUTO'`; bei
    HUG-Membern wird vertikales Padding still gedroppt. Beide Modi vor der Padding-Zuweisung
    auf AUTO setzen.
14. **Kein Snippet-Scaffold für Composite-Sub-Builds** *(Breadcrumb #3, optional)* —
    Text-Segment-Set, Icon-Adornment, `createSlot()` + Instance-Prefill sind nur als Prosa
    gedeckt; ein Scaffold (mind. fürs Slot+Prefill-Muster) fehlt.

### Offen — figma-build.md (Build-Mechanik: Page / Koordinaten / Platzhalter-Bindung) — neu 06-12

15. **`setCurrentPageAsync` als Invariante pro `use_figma`-Call** *(Badge #4)* — `figma.currentPage`
    resettet je Call auf die erste Page; teilt ein Agent den Build über mehrere Calls (das empfohlene
    Muster) und vergisst den Page-Set am Call-Anfang, landet `createComponent()` still auf der ersten
    Page → `combineAsVariants` wirft erst später `"must be in the same page as the parent"` (Ursache
    weit weg). `build-variant-set.js` macht es korrekt; fehlt als explizite Checklist-Zeile für den
    inkrementellen Multi-Call-Build. *(Verified: 6 Comps über 2 Calls ohne Page-Set → alle auf erster
    Page, combine rot; Re-Parenting fixte es.)*
16. **Section-Kinder in SECTION-RELATIVEN Koords positionieren** *(Separator #1)* — nach
    `combineAsVariants(comps, section)` ist das Set Section-Kind; `.x/.y` werden dann **relativ zur
    Section-Top-Left** interpretiert, nicht page-absolut. Eine absolute x
    (`section.absoluteBoundingBox.x + 80`) schiebt das Set tausende px aus der Section, der Fit-Resize
    bläst die Section auf. Fit über `child.x+width / .y+height` (section-relativ) + Inset rechnen; nie
    `absoluteBoundingBox` (page-absolut) mischen. Gehört an die Section-Invariante **und** an die
    `set.x/set.y`-Zeilen im Snippet. *(Verified: `.x=80` → `absoluteBoundingBox.x=9153` = sectionAbsX
    9073 + 80.)*
17. **Platzhalter-Variablen tragen ` ⚠`-Namens-Suffix → `endsWith('/'+token)` verfehlt sie**
    *(Badge #3)* — die Placeholder-Color-Tokens heißen in Figma `shadcn Default/secondary ⚠`,
    `…/destructive ⚠`, `…/destructive-foreground ⚠`, `chart-1…5 ⚠` (Space + Emoji). recon.js + die
    Binding-Beispiele matchen per `name.endsWith('/'+token)` → still `[]` → Agent bindet fälschlich
    Roh-Hex (genau die Red-Flag-Zeile). Fix: looser matchen (`includes` / trailing ` ⚠` strippen) UND
    notieren, dass die DS Platzhalter mit ` ⚠`-Suffix markiert — sie SIND bindbar (an die echte
    ⚠-Var, nicht Roh-Hex; „nicht finalisieren" gilt weiter). tokens-reference §1 könnte den Suffix an
    den Platzhalter-Zeilen vermerken. *(Verified: `endsWith('/secondary')` → `[]`; voller Namens-Scan
    fand die ⚠-Vars.)*
18. **Tinted bound surface (`bg-X/10`) braucht ein Alias-Resolve-Rezept, nicht nur „die aufgelöste
    Farbe setzen"** *(Badge #5)* — figma-build.md sagt „Opacity + reale aufgelöste Farbe als Fallback",
    aber der Var-Wert ist meist `VARIABLE_ALIAS` → Primitive → Color, also nicht direkt aus
    `valuesByMode` lesbar; man muss die Alias-Kette rekursiv laufen. Ohne Snippet spreadet ein Agent
    den gebundenen Paint (verbotener Move) oder setzt schwarz. Fix: „tinted bound surface"-Rezept in
    figma-build.md (+ `tintVar`/`tintOpacity`-Branch in `build-variant-set.js`): binden → Farbe
    rekursiv über die Alias-Kette auflösen → als Paint-Fallback setzen → Paint-Level-`opacity`.
    Abgrenzen vom Node-Level-`opacity` (dimmt Content mit — nur für disabled). *(Verified:
    `bg-destructive/10` brauchte `resolveColor` über den Alias → 10%-Rot mit erhaltener Bindung.)*

### Offen — SKILL.md T2 (Achsen-Scope) + tokens-reference §4/§6 (Typo-Ladder) — neu 06-12

19. **Gelandete CVA kann die Doc/Brief-Matrix übersteigen — Achsen-Kardinalität festlegen** *(Badge #1)*
    — die nova-`ui:add`-Source ist dichter als Stock und trägt CVA-Optionen, die die Doc-Page nie zeigt
    (Badge: 6 Varianten `default|secondary|destructive|outline|ghost|link` vs 4 in Doc/Brief). Kein
    Skill-Rule für „gelandete CVA > kanonischer Usage-Set / Brief-Matrix" → Agent droppt entweder
    Code-Optionen (bricht die Component) oder sprengt die Figma-Matrix. Fix (T2): *Code behält die volle
    gelandete CVA (nie Optionen droppen); Figma deckt mind. die Brief/Doc-Optionen, SOLL alle
    gelandeten decken, außer der Brief scopt runter — dann den Code↔Figma-Achsen-Gap in notes.md
    vermerken.* Festlegen, welches Artefakt für die Achsen-Kardinalität autoritativ ist. *(Badge: 6
    Code-Varianten voll in Figma gebaut, im Code belassen — nicht getrimmt.)*
20. **Typo-Ladder hat kein 12px-Sans für Micro-Labels** *(Badge #2)* — §6 mappt totes `text-xs` →
    „passende `text-format-*`", aber die 11 DS-Formate haben kein 12px-Sans: `label`/`body`=14,
    `eyebrow`=9 (mono/upper), `data`=11 (mono). Ein 12px-Sans-Label (Badge, kleine Chips) snappt auf
    `label` (14, +2px) ohne Guidance zum Tradeoff. Fix (§4/§6): Off-Ladder-Fallback benennen — *kein
    exaktes Format → per ROLLE wählen (Badge-Label = `text-format-label`, 14px-Snap akzeptiert) ODER
    ein fehlendes DS-Micro-Label-Format als Open Item flaggen.* Aktuell rät der Agent.

### Offen — SKILL.md T2.5/T6 (Stories / Verify) — Folgebefund 06-12 (ergänzt #10–#11)

21. **Strukturiert-Children-Boolean-Controls (`asChild`) auf Text-Stories disablen — Gegenmuster war
    längst etabliert** *(Badge, Folgebefund 06-12 — nicht aus dem Run-`skill-feedback`, beim Stories-
    Refine aufgetaucht)* — ein Boolean-Prop, das das gerenderte Element gegen sein Kind tauscht und
    **genau ein Element-Kind** braucht (`asChild` via Radix Slot), MUSS auf Stories mit Text-`children`
    als Storybook-Control **deaktiviert** sein — sonst crasht das Umschalten den Slot
    (`React.Children.only`) direkt im Controls-Panel. Der Badge-Port shippte eine `Default`-Story mit
    live `asChild`-Control über String-Children (`children:'Badge'`) → Toggle auf `true` ⇒ `Slot.Root`
    + String-Kind ⇒ Crash. Das Gegenmuster stand schon in `button.stories.tsx`
    (`argTypes.asChild: { control: false }` + dedizierte `AsChild`-Story mit hartkodiertem
    Single-Element-Kind), wird im Skill aber nirgends benannt → ein Agent, der nicht von einem bereits
    portierten Sibling abschreibt, baut den Footgun neu ein. Fix (T2.5/T6): *jedes Boolean-Prop, das ein
    strukturiertes Kind verlangt (`asChild` & Co.), in argTypes `control: false` setzen und in einer
    eigenen Story mit genau einem Element-Kind demonstrieren; vor dem Stories-Schreiben die
    Control-Scoping-Konventionen (`controls.include`, disablete Controls) von einem schon portierten
    Sibling übernehmen — Button ist die asChild-Referenz.* *(Repo-Fix: badge `Default` entschärft +
    `AsLink`→`AsChild` promotet auf Branch `refine/badge-aschild-story` (committet, ff in `master`);
    Skill-Edit offen.)*

### Offen — composites.md (Field = Surface-less Composite) — neu 06-12

22. **Hard-importierte Dep MUSS portiert werden — nicht stub/defer** *(Field #1)* — der Dep-Audit
    (§2 T2) listet für eine un-portierte Foreign-Dep drei Dispositionen (port / stub / delete+defer)
    als *Wahl*. Importiert die Composite-eigene Source die Dep aber direkt (hier `FieldLabel` →
    `@/components/ui/label`), brechen stub UND delete+defer das Composite (Runtime/Typecheck) → einzig
    gültig ist **porten**. Fix: §2 T2 splitten — *importiert die behaltene Composite-Source die Dep →
    porten (harte Co-Dependency, nicht optional); stub/delete+defer gelten nur für Deps, die bloß
    nicht-behaltene Sibling-Example/Demo-Files nutzen.* Label auf die „co-ported primitives"-Watchlist
    (Field/Form ziehen es rein). *(Verified: `label` nur in field.tsx:5 importiert.)*
23. **Flat-Shadow-Copy ist STOCK, nicht harmlos — Delete-Schritt nie überspringen** *(Field #2 — Regel
    schon eingearbeitet, InputGroup #1; hier nur Evidenz)* — `ui:add field` schrieb ein flaches
    `separator.tsx` = **stock new-york** (ohne DS-Kommentare/Bindings), das den DS-Ordner
    `separator/separator.tsx` via Modul-Resolution (File vor Dir) **still auf Stock zurückdreht**. Regel
    stimmt; Zusatz: *die flache Kopie ist Stock → der Shadow downgradet die DS-Dep still; Delete nicht
    überspringen, auch wenn `ui:add` „no overwrite" meldet.* *(Verified: `diff` flat vs folder → unterschiedlich.)*
24. **Surface-less Composite — was in Figma modellieren?** *(Field #6)* — composites.md nimmt an, das
    Composite habe *irgendeine* Token-Fläche (InputGroup bg+border, Dialog Panel+Scrim). Field ist das
    erste **rein Layout/Typo/Spacing/a11y — null eigene Fläche** (Border/bg trägt das genestete Control).
    Was funktioniert hat: die **strukturelle ROW** modellieren (`orientation × invalid` + Slots +
    genestete echte Control-Instanz), **nur** Spacing-Gaps + Typo-Formate binden, und die reinen
    Grouping-Teile (FieldSet/Group/Legend) + Container-Query (`responsive`) explizit als **Code-only**
    deklarieren (kein Figma-Set). Fix: Surface-less-Composite-Regel in composites.md + Code↔Figma-Gap
    notieren (known-trap #19). *(Verified: alle Member + Slots `fills=[]`; nur itemSpacing + Text-Style-
    Bindings tragen Tokens; verify CLEAN.)*
25. **Text-Regionen als SLOT (mit Text-Default), nicht als Text-Property** *(Field #7)* — §1 mappt
    „editierbarer String → Text-Property". Für Field wurden label/description/error als echte **Slots**
    (Text-Default am Format-Style) gebaut: konsistentes Slot-Naming merged sie über alle 4 Member zu
    **einer** Set-Level-SLOT-Prop pro Region (Done-Test-Vertrag) und erlaubt Struktur-Swaps (z. B. Label
    + Trailing-Badge), die eine Text-Property sperren würde. Fix: §1-Note — *für Text-Regionen eines
    Composites einen **Slot-mit-Text-Default** der Text-Property vorziehen, wenn der Consumer
    Content/Struktur tauschen können soll (nicht nur den String); Text-Property nur bei strikt einzelnem
    editierbarem String.* *(Verified: 4 Slots → 4 Set-Level-SLOT-Props, je clear+append in der Instanz.)*

### Offen — figma-build.md (Reuse / Nesting) — neu 06-12

26. **Lokale Component nesten = `.createInstance()` per Node-ID, NICHT `importComponentByKeyAsync`**
    *(Field #5)* — figma-build.md „Reuse, don't rebuild" sagt „nest a real instance", aber nicht WIE
    für eine **lokale** (unpublished) Component im selben File. `importComponentByKeyAsync(key)` (der
    offensichtliche Weg, Key kommt aus recon) wirft `Component with key "…" not found` — Import-by-Key
    löst NUR publizierte Library-Components. Für Same-File die Variant-COMPONENT-Node per
    `getNodeByIdAsync('<variantNodeId>')` holen und `.createInstance()` darauf. Fix: in „Reuse"/Slots
    aufnehmen; recon soll die Variant-Node-**IDs** liefern, nicht nur Keys. *(Verified: importByKey auf
    lokale `.Input`-Default → „not found"; node `3176:303` + `.createInstance()` ok.)*

### Offen — tokens-reference §6/§4 (Spacing- + Typo-Rungs) — neu 06-12

27. **§6-Spacing-Beispiele: untere Rung `gap-0.5`(2px)→`gap-2xs` fehlt** *(Field #3)* — §6 listet
    Beispiele runter bis `gap-1.5(6)→gap-sm`, aber nicht die 2px-Rung. Field nutzt `gap-0.5`=2px
    (FieldContent-Stack) → `gap-2xs` (space-2xs, einzige 2px-Stufe). Die px-Wert-Regel löst es, aber die
    Beispiel-Liste stoppt bei 6px → ein Porter rundet evtl. auf `gap-xs`(4) oder lässt es numerisch. Fix:
    §6-Liste um die Bottom-Rung erweitern: `gap-0.5(2)→gap-2xs · py-0.5(2)→py-2xs`. **(Wiederkehrend —
    Badge traf schon `py-0.5→py-2xs`.)**
28. **16px Sans hat keine exakte Rung → per ROLLE wählen (verallgemeinert #20)** *(Field #4)* —
    `FieldLegend` (legend-variant) ist `text-base`=16px; die Sans-Ladder ist 14/18/22/27/43 — **kein
    16px**. #20 deckt 12→14 (Label-Rolle); 16→18 ist dieselbe Klasse eine Stufe höher. Ein `<legend>`
    über einem `<fieldset>` = Section-Heading-Rolle → `text-format-title` (18/600), nicht body/label (die
    label-variant bleibt `text-format-label`/14). Fix: #20 verallgemeinern — *jede Stock-Size ohne exakte
    DS-Rung (12, 16, …) per ROLLE wählen + notieren: 16px Section-Captions → text-format-title, 12px
    Micro-Labels → text-format-label.* *(Verified: §4-Ladder hat keine Stufe zwischen 14 und 18.)*

### Offen — Form-Toggle-Batch (Checkbox/Switch/RadioGroup) — neu 06-12

Quelle: `agent-runs/component-port/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md`. Drei
State-Achsen-Controls (kein CVA, Sibling von Input; Switch zusätzlich `size`-Achse). Dups über die drei
Runs zusammengezogen.

**figma-build.md §Interaction-states (Glow-/Ring-Rezept — Cluster):**

30. **Ring/Glow: literal-Alpha + `showShadowBehindNode:false` + focus-copy/invalid-synth + Sweep-all**
    *(Checkbox #3/#4/#6 · Switch #3 · Radio #3 — zusammengefasst)* — vier Fallen, die §Interaction-states
    auslässt: **(a)** Effekt-Farbe NIE binden — `setBoundVariableForEffect(…,'color',…)` löst die Variable
    bei voller Deckkraft auf und verwirft `/50`,`/20` → Ring rendert 100 %. Literal-Farbe @ Alpha setzen
    (`ring` RGB @ a:0.5, `destructive` @ a:0.2, `boundVariables.color:null`); der Border-STROKE wird normal
    gebunden. **(b)** `showShadowBehindNode:false` auf transparenten/fill-losen Controls (Checkbox-Box,
    Radio-Kreis, Ghost) — Default `true` lässt den Halo durch den leeren Body bluten, der äußere Ring liest
    nie. **(c)** focus = Effekt-Objekt VERBATIM vom `.Input`-Focus-Member `3176:305` kopieren (Spread/Radius/
    Offset/Alpha UND das Flag, nicht rekonstruieren); invalid = aus demselben Template SYNTHETISIEREN
    (`destructive` @ a:0.2) — der `.Input`-`invalid`-Member `3176:311` trägt `effects:[]`, nichts zu kopieren.
    **(d)** eine Glow-Korrektur betrifft JEDEN Glow-Member (focus UND invalid UND checked-invalid), nicht nur
    den gemeldeten — transparente Member zeigen den Defekt, opake verstecken ihn (ein Member-Screenshot
    reicht nicht). Fix: focus/invalid-Bullets um (a)–(d) erweitern. *(Verified: `3176:311` effects:[]; Bind →
    a:1; Checkbox-invalid `sbn:true` vs `.Input` `false`.)*

**SKILL.md T3 (Ring-Width + Rollen-Token-Kontrast):**

31. **`ring-N` → `ring-[Npx]` (Sibling-Konvention)** *(Checkbox #2 · Switch #1)* — Stock liefert `ring-3`; die
    Field-Familie (input/checkbox/input-group/textarea) standardisiert auf `ring-[3px]`. Auf die Sibling-Form
    normalisieren, nicht `ring-N` verbatim. *(Verified: alle 4 Siblings = `ring-[3px]`.)*
32. **Rollen-Token verfehlt Kontrast → Stock-Farb-Token als FILL behalten + Why notieren** *(Switch #2)* —
    Switch-Off-Track = `bg-input`; das rollen-korrekte `muted` ("Tracks", #f4f6f8) ist auf Weiß unsichtbar,
    `input` (neutral/450) hält ≥3:1. Nicht blind auf den rollen-benannten Token umbiegen wenn der den nötigen
    Kontrast verfehlt — Stock-Token als Fill behalten, Begründung in notes. *(Verified: muted ≈1.04:1 vs input
    ≥3:1 auf Weiß.)*

**SKILL.md T2 (State-Achse) + T5 (Examples) + figma-build (orthogonale Kombis):**

33. **No-CVA State-Achse: mutually-exclusive Member vs. komponierende Overlays trennen** *(Checkbox #1)* —
    `disabled:`/`focus-visible:` überlagern BEIDE default+checked; `aria-invalid:aria-checked:` ist eine echte
    kombinierte Zelle. Nicht in ein flaches Enum zwingen (explodiert oder droppt Zellen): mutually-exclusive =
    `state`-Achsen-Member, komponierende = Boolean-Overlays / Interaction-State-Pattern.
34. **T5 Story-Reproduktionen = permanenter Section-Deliverable für JEDE Component-Art** *(Checkbox #5)* —
    nicht nur Composites; nach dem Verifizieren NICHT löschen, als echte genestete Instanzen bauen (+ `.Label`),
    gelabelte AL-Group unter dem Set. *(War der ursprüngliche „examples fehlen"-Bug; Checkbox nachgezogen.)*
    **✅ Eingearbeitet 06-12** → SKILL.md Output/T2.5/T5 + figma-build.md §Usage-examples (Deliverable aus
    composites.md herausgehoben → gilt für jeden Port).
35. **Single-Achsen-State-Set kann orthogonale Kombis (checked×disabled) nicht ausdrücken → Instanz-Override**
    *(Radio #4)* — z. B. „erste Option checked unter disabled Group": Instanz auf `state:checked` +
    `opacity:0.5`-Override (legitim — kein Member, kein Detach), in notes vermerken.

**SKILL.md T2.5 (Stories) + T2/T6 (Move / twMerge / Geometrie-Toggle):**

36. **Stories in der ECHTEN Doc-Komposition bauen (Field-Familie), nicht div+Label** *(Checkbox #7, gilt für
    alle 3 — User-Report)* — die `radix/*`-Docs komponieren Form-Controls mit der geporteten Field-Familie
    (`Field`/`FieldContent`/`FieldLabel`/`FieldDescription`/`FieldGroup`/`FieldSet`/`FieldLegend`; `FieldLabel`
    umschließt ein `Field` für Choice Cards). Geportete DS-Composition-Primitives den hand-gerollten Layouts
    vorziehen; nur wo das Doc-Beispiel selbst bare ist (basic/Default) bare bleiben. Un-ported-Dep-Beispiele
    (Table, react-hook-form) **skippen UND in notes loggen**, nie still vereinfachen. *(Alle 3 Stories 06-12
    auf Field-Komposition umgebaut, `field.stories.tsx` = In-Repo-Idiom, Gate grün.)*
    **✅ Eingearbeitet 06-12** → SKILL.md T2.5 (Fidelity-Regel, generisch formuliert).
37. **`mv`, nicht `git mv`, für die frisch-gelandete (untracked) Source** *(Radio #1)* — `git mv` wirft
    `not under version control` auf der untracked `ui:add`/orchestrator-Source; plain `mv`. *(Verified: exit 128.)*
38. **twMerge-Survival-Guard → „at-risk DS-Custom-Utility", nicht nur `text-format-*`** *(Radio #2)* — ein
    grafik-only Control (Radio: Kreis+Dot, kein Text) hat keine Typo-Klasse; der Risiko-Kandidat ist
    `corner-full` (Custom-`corner-*`). Guard auf die at-risk-Utility der Component keyen (Typo für Text,
    `corner-*`/named-spacing für grafik-only).
39. **Two-Part-Geometrie-Toggle (Track+Thumb) braucht KEINE Base/state-layer-Maschinerie** *(Switch #4)* — kein
    Content/Tint/Active-State; N flache Member (size×state) via `combineAsVariants`, Fill/Stroke/Effect/Layer-
    Opacity pro Member binden, Thumb-Kind-x numerisch versetzen. Base+state-layer nur für Content-Flächen
    (Buttons/Inputs). *(Verified: 10 flache Member, kein Base, controls-live + verify CLEAN.)*

### Offen — /component-sync (NEUE Skill-Quelle) — neu 06-12

Quelle: `agent-runs/component-sync/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md`. Erste
Sync-Findings im Handoff (S1–S6 = Figma-read → Diff → Code-Delta, read-only Figma).

40. **S3 dritte Diff-Form: Property neu gebunden wo Code KEINE Klasse hatte → ADD** *(Checkbox-sync #1 ·
    Radio-sync #2)* — S3 nennt nur „Wert re-bound → Swap" + „Member +/- → Variant". Fehlt: eine Figma-Bindung
    die der Code als impliziten Default (gar keine Klasse) ausdrückt (hier: unchecked-Box/-Kreis bekam
    `input-background`-Fill, Code hatte kein `bg-*`) → mappierte Utility **ADD**en (Gegenfall: Figma entfernt
    einen vom Code hartkodierten Fill → REMOVE). Den **Satz gebundener Properties** diffen, nicht nur Werte
    benannter Klassen.
41. **Eine gebundene Bindung die der Code anders rendert ist ein DELTA, keine „Deviation"** *(Switch-sync #3)*
    — der Sync-Agent las den Invalid-Track-Fill = `destructive` (gebunden), legte ihn als „Deviation" ab und
    meldete no-delta → checked-invalid-Switch blieb cyan (User-Report). S3-Tier-1: gebundener Var = autoritativ,
    1:1 mappen. „Deviation"-Status NUR für rohe/ungebundene Werte oder geflaggte Designer-Fehler — nie als
    Ausrede einen Live-Bound-Wert nicht zu propagieren. *(Orchestrator-Fix: `aria-invalid:data-checked/unchecked:bg-destructive`.)*
42. **No-Delta / Premise-Mismatch ist ein First-Class-Outcome** *(Switch-sync #1)* — der Live-Read überschreibt
    den im Task behaupteten Grund; matcht alles, ist das Delta leer (auch wenn „User hat X geändert"). No-delta
    melden, einmal re-readen (stale/falscher Node ausschließen), KEINE Änderung erfinden um die Prämisse zu
    erfüllen (= der `/component-sync`-Red-Flag „rewrite beyond the delta").
43. **`read-set-values.js` verfehlt non-slot Indicator-Kinder (Thumb-ELLIPSE, Radio-Dot)** *(Switch-sync #2 ·
    Radio-sync #1)* — das Snippet liest Member-Fill/Stroke + einen SLOT-Kind (vector/instance/text), aber NICHT
    eine non-slotted ELLIPSE/RECT (Switch-Thumb, Radio-Dot) → deren Fill-Bindung unsichtbar. Snippet erweitern:
    direkte `['ELLIPSE','RECTANGLE','VECTOR']`-Kinder mit gebundenem Fill mitlaufen; bei Two-Part-Controls den
    beweglichen/Indicator-Kind separat lesen.
44. **S3 Member→Variant-Prefix-Mapping benennen** *(Checkbox-sync #2)* — bei Single-Element-State-Achse mappt
    jeder Figma-Member auf ein Code-State-Prefix (`state=checked`→`data-checked:`, `state=invalid`→
    `aria-invalid:`, kombiniert → gestapelt `aria-invalid:aria-checked:`); je Member die gebundenen Props gegen
    die prefixed Klassen diffen.
45. **`use_figma`-Wrapper braucht `fileKey` + `description`** *(Radio-sync #3 — minor/env)* — in S2 /
    Snippet-Header notieren (`fileKey` aus config.json + kurze `description`).

### Offen — figma-build.md §Slots + §Usage-examples (Figma example-groups + `.Field` control-leading) — neu 06-12

Quelle: `agent-runs/component-port/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md` (Figma-Examples-
Runs) + `agent-runs/figma-field-controllead/2026-06-12/notes.md`. Aus dem Umbau der Usage-Example-Gruppen auf
echtes `.Field`-Reuse + dem `.Field`-control-leading/error-Slot-Fix.

46. **Variant-Member-Clone behält den SLOT, verliert nur die `slotContentId`-Bindung — KEIN FRAME** *(field-
    controllead/invalid-fix; live geprüft 2026-06-22)* — der Klon eines Variant-Members bleibt `SLOT`, aber
    `componentPropertyReferences` ist leer (`refs:{}`), weil die Slot-Property auf dem **Set** liegt, nicht am
    Member. Fix: nach dem Hinzufügen als neuer Member den Slot **re-binden** (`componentPropertyReferences =
    { slotContentId: '<prop>#id' }`) — NICHT via `createSlot()` neu bauen (alte, schwerere Annahme; s. #47).
    Standalone-Component-Clone behält die Bindung (Property liegt am Component selbst).
    **Update (Select-fix 06-20):** `clone()` ist SICHER für eine TEXT-*Property* — der `value#…`-prop-ref überlebt den
    Klon. Geklonte Text-Prop-Member (z. B. Trigger-Style-Member) NICHT über-rebuilden.
    *(Korrigiert: die frühere „degradiert zu FRAME"-Diagnose war falsch — der Slot-Typ bleibt, nur die Set-Bindung
    geht verloren. War der reale Kern des `.Field`-invalid-Flaws: ungebundener statt fehlender Slot.)*
47. **`createSlot()` legt je Aufruf eine Slot-Property an → Orphan nur beim Neu-Bauen** *(invalid-fix; live geprüft
    2026-06-22)* — `createSlot()` erzeugt automatisch eine Slot-Component-Property. Ruft man es auf, um einen
    geklonten Member-Slot „neu zu bauen", und bindet dann an eine bestehende Slot-ID, bleibt die Auto-Property
    zero-referenced → löschen. Mit dem korrigierten #46 (re-binden statt neu bauen) entsteht der Orphan gar nicht
    erst — daher nur relevant, falls man den createSlot-Weg doch geht.
48. **Fill-slot-in-instance — Zusätze zum §Slots-Rezept** *(switch/radio/checkbox-examples)* — Slot-Default-Text-
    Setter wirft „node not found" → clear+append, Read-back im SEPARATEN Call (Instanz-Slot-Mutation invalidiert
    die Node-ID im selben Tick); Clearing eines Slots ko-entfernt/re-injiziert Sibling-Defaults → guarded
    per-id-Loop + Post-Append-Sweep; Text-Slots VOR dem control-Slot setzen; HUG-control-Slot hugt einen schmalen
    Control automatisch (nie die Instanz HUGen); Sibling-Slots via `query('SLOT[name=…]')`, nicht `findOne` über
    `componentPropertyReferences` (wirft auf stale nested-instance-IDs).
49. **`/figma-verify` sollte `visible:false`-Nodes überspringen** *(radio-examples)* — toggled-off Slots
    (`Show error/description=false`) erzeugen sonst False-Positives bei clipped/overlap.
50. **Selektions-Control + Field = control-leading; control-trailing-Field passt nicht** *(checkbox-examples)* —
    eine Checkbox/Radio-Reihe ist control-LEADING; das Input-geformte `.Field` war nur control-trailing → die
    `controlPosition`-Achse gebaut (s. Katalog, Figma-only Fork). Example-Groups für Selektions-Controls nesten
    control-leading `.Field`; Group-/Fieldset-Beispiele mit abweichender Item-Zahl vertikal komponieren (`.FieldSet`
    nestet fix 2 Fields). Per-field-Error → `.Field`-error-Slot; Gruppen-Error (FieldSet-Ebene) → separater Text.
51. **`getVariableByIdAsync` braucht das `VariableID:`-Präfix** *(checkbox-examples)* — bare ID → still schwarzer
    unbound Paint.

### Offen — Select-Port (Composite, ausgelagerte Figma-Hälfte) — neu 06-19

Quelle: `agent-runs/component-port/2026-06-19-select/skill-feedback.md` (dort als A–G + Build-Deviations D1–D4
geführt; hier in die laufende Nummerierung konsolidiert → **#52–58**). Erster Port mit der Figma-Hälfte im
**Background-Agent** (baut Figma) + main (baut Code) **parallel** — das Auslagerungs-Muster funktioniert (eine
Plugin-Verbindung, Agent exklusiv auf Figma, main code-only).

**figma-build.md §Slots + §Variant set assembly (Agent):**

52. **Slot-Merge passiert zur `combineAsVariants`-Zeit, NICHT danach** *(A)* — `createSlot()` auf jedem Member eines
    BEREITS kombinierten Sets → N separate gleichnamige Props (kaputte Instanz-API; verified: Instanz exponierte 6
    un-merged `leadingIcon#…`). §Slots sagt „named consistently → merges to ONE", aber nicht WANN. Fix: Slots auf den
    **standalone Comps VOR** dem Kombinieren bauen. Explizite Zeile in §Slots / §Variant set assembly.
53. **Section-Kind-Koords = reine Offsets vom Section-Ursprung — nie `section.x` addieren** *(B; schärft #16)* — der
    Reflex `set.x = section.x + 80` rendert bei `section.x + (section.x + 80)` (verified: content bei abs x≈21000 für
    Section bei x≈10600). Konkretes WRONG/RIGHT in `build-variant-set.js` + composites.md.
54. **Sections wachsen NICHT automatisch mit den Kindern** *(C)* — nach dem Positionieren `resizeWithoutConstraints`
    (hug), sonst bleibt die Section headline-groß. Paart mit #53; gehört an die Section-Invariante in figma-build.md.
    **Update (Select-fix 06-20):** gilt für die **Breite** genauso — eine zusätzliche Variant-Spalte (focus-invalid →
    5-State-Raster) überlief die Section-Breite; `resizeWithoutConstraints` für Breite UND Höhe.
55. **Instanz-Slot-Default-Removal strikt EINS pro `use_figma`-Call** *(D; schärft #48)* — selbst mit Re-Fetch per
    stabiler ID wirft das ZWEITE `slot.children[0].remove()` im selben Tick „node not found"; eine guarded while-Schleife
    in EINEM Call geht NICHT (je Default-Kind ein eigener Round-Trip). §Slots „Filling a slot in an instance" verschärfen.
    **Update (Select-fix 06-20):** verallgemeinern — NICHT nur `remove`. **Jede** Mutation an einem nested-instance-Slot-
    Subtree (auch `setProperties` 2 Ebenen tief, z. B. SelectGroup-Items im Content-Slot labeln) invalidiert die gecachten
    Sibling-Node-Refs im selben Tick → eine Op pro `use_figma`-Call. #48/#55 decken append/remove UND deep setProperties.

**SKILL.md T2 (Dep-Audit) · /docgen-props + /storybook-rules · T6 (Code):**

56. **`radix-ui`-Umbrella für VOLLE Primitives behalten** *(E; verengt #3)* — #3 („Radix-Umbrella → per-primitive") galt
    nur dem `Slot`-aus-`radix-ui`-Fall (Breadcrumb). Volles Primitive (`Select`/`Dialog`) = Umbrella behalten
    (`import { Select as SelectPrimitive } from 'radix-ui'`; deklarierte Dep, Dialog-Konvention). Composite-Dep-Audit
    §2 T2 splitten: Voll-Primitive-Umbrella behalten, nur einzelne Sub-Imports auf per-primitive umstellen.
57. **Composite-Sub-Parts dokumentieren = eigenes Story-File je API-Part (RadioGroupItem-Muster), NICHT `meta.subcomponents`**
    *(F; finaler Stand nach Select-Review 06-20 — die Zwischenschritte unten als Lehre)* — ein Composite mit dokumentierbaren
    Sub-Part-Props (`SelectTrigger.size`, `SelectContent.position/align`, `SelectItem.value/…`, `SelectValue.placeholder`)
    bekommt **pro API-tragendem Part ein eigenes `<part>.stories.tsx`** mit `meta.component = <Part>`,
    `title: 'UI/<Parent>/<Part>'`, jede Story in den Parent-Kontext gewrappt (Radix braucht den Ancestor) — exakt wie
    `radio-group-item.stories.tsx` (war schon im Repo). Ergebnis: je Part eine eigene Autodocs-Seite mit **echter ArgsTable
    UND Live-Controls** (Controls = `args` der Story; ein Part ist nur live, wenn er `meta.component` ist). Die Hauptseite
    (`UI/Select`) dokumentiert nur den Root + die Usage-Kompositionen und verlinkt die Part-Seiten.
    **Warum NICHT `meta.subcomponents`** *(verbrannte Iteration)*: (a) `subcomponents` liefert nur **statische** Doc-Tabellen,
    NIE Controls; (b) ein prop-loser Pass-through (SelectGroup/Label/Separator/ScrollButtons = nur className/children,
    Radix-Rest vom propFilter gedroppt) erzeugt ein leeres **„Args table … couldn't be auto-generated"** (schlechter als
    weglassen). Mit eigenem File je API-Part entfällt beides — prop-lose Parts bekommen schlicht KEINE Seite (ihre Nutzung
    zeigen die Usage-Stories).
    **Voraussetzung:** der Part muss kuratierte flat-Props haben → ggf. ERST via `/docgen-props` annotieren (Select: Item
    `value/disabled/textValue`, Value `placeholder` nachgerüstet).
    **Controls-Hygiene auf der Part-Seite:** nur Props mit **beobachtbarem** Effekt als Control; eine Prop mit unsichtbarem
    Effekt (SelectItem `textValue` = Typeahead, no-op bei Text-Children) bleibt in der ArgsTable, aber `argTypes.<prop>.control = false`.
    **Ist der unsichtbare Effekt wichtig → dedizierte Verhaltens-Story mit `play`** auf der Part-Seite, in einer Komposition,
    wo die Prop wirklich greift (Select `Typeahead` als Sub-Story von SelectItem: non-text Children → Emoji-Flaggen, sodass
    `textValue` für type-to-select NÖTIG ist; play tippt auf dem closed Trigger + assertet die Auswahl). So wird die Prop
    bewiesen statt als toter Control angeboten. (s. #61c)
    **Angewandt (06-20): Select + Field + Dialog + InputGroup + Command** — alle nach diesem Muster: Select →
    `select-{trigger,content,item,value}.stories.tsx`; Field → `field-{group,legend,error}.stories.tsx` (FieldGroup
    `orientation`, FieldLegend `variant`, FieldError `errors`; die alte In-File-`FieldGroupExample`-Control-Story
    herausgezogen); Dialog → `dialog-{content,footer}.stories.tsx` (beide `showCloseButton`; play öffnet das Portal +
    assertet den Close-Button, Content-× im Footer-Beispiel aus, damit „Close" eindeutig); InputGroup →
    `input-group-{addon,button}.stories.tsx` (InputGroupAddon `align`, InputGroupButton `size`; Button-play assertet
    `data-size`, Addon display-only); Command → `command-{dialog,separator}.stories.tsx` (CommandDialog `variant`/
    `showCloseButton` controlled-open + Portal-play, CommandSeparator `label` = Labeled-Rule; cmdk-Root behält seinen
    `variant`-Control auf der Hauptseite). Bestätigt, dass das RadioGroupItem-Muster generalisiert; der nächste
    Composite-Port folgt ihm direkt (kein subcomponents-Umweg).
    **Zwei Part-Page-Fallen (CommandDialog-Review):** (1) **Snippet** — delegiert der `render` an eine Wrapper-Komponente
    (nötig bei controlled-open Composites ohne Trigger-Slot), zeigt „Show code" nur `<Demo/>`; explizites
    `parameters.docs.source.code` mit der vollen Implementierung setzen. (2) **ArgsTable unvollständig** — geerbte Props
    via `extends React.ComponentProps<typeof X>` tauchen NAMENTLICH auf, aber react-docgen verliert die JSDoc → leere
    Description/Default-Zeilen. Fix = die zu dokumentierenden geerbten Props **Omit + flach re-deklarieren** (JSDoc) im
    Part-Props-Interface (wie es DialogProps für open/defaultOpen/onOpenChange/modal tut; CommandDialogProps zog nach).
58. **Radix Select braucht KEINEN jsdom-Polyfill, wenn Specs nur „closed" rendern** *(G)* — SelectContent liegt im Portal
    (mountet erst on-open) → ein Trigger/Root-only-Spec läuft ohne `scrollIntoView`/`hasPointerCapture`; den Open-Pfad
    übers Chromium-Storybook-Projekt (play) abdecken. Heuristik für §T6 Headless lib.

### Offen — Select-Review (Defekte → Skill-Lücken) — neu 06-20

Quelle: User-Review des Select-Ports (Figma + Storybook). Drei neue Findings + zwei Schärfungen; die zugehörigen
Komponenten-Defekte werden separat gefixt (Code = main, Figma = Re-Brief des Background-Agents).

**composites.md (Anchored-Overlay-Composite):**

59. **Anchored-Overlay-Composite → Open-State braucht den Overlay-Part als ABSOLUT positionierten, am Trigger
    verankerten Slot** *(Select #6: „select main component fehlt")* — composites.md deckt bisher nur ZENTRIERTE
    Overlays (Dialog-Scrim, Command-Palette mittig). Select/Dropdown/Popover/Combobox sind *anchored*: Content schwebt
    unter/über dem Trigger. Figma kann nicht „öffnen" → eine **Top-Level-Composition** (`Select`) modellieren, die eine
    Trigger-Instanz + eine Content-Instanz in einem `ABSOLUTE`/`layoutPositioning`-Child (Anchor = Trigger-Kante) nestet —
    NICHT nur die getrennten Trigger-/Item-/Panel-Sets shippen. Das ist composites.md T4 Layer 3 für den anchored Fall;
    figma-build.md sollte das `layoutPositioning=ABSOLUTE`-Anchor-Rezept führen.

**SKILL.md T5 + figma-build.md §Usage-examples (Done-Test ist nicht nur strukturell):**

60. **`/figma-verify` ist STRUKTURELL — die reproduzierten Examples zusätzlich SCREENSHOTEN + eyeballen** *(Select #3
    headline-los · #7 Group-Example falsch + unverifiziert)* — Vektor/Clip/Overlap/Padding-Symmetrie passieren, aber die
    *semantische* Korrektheit eines Examples (richtige Komposition? jeder Block mit Label?) sieht der Verify NICHT → ein
    falsch oder headline-los gebautes Example besteht trotzdem. §Usage-examples sagt bereits „one labeled block per example
    (mirror the sibling Sections)" — der Build droppte die Headlines, der Agent screenshottete die Gruppe nie. Fix: T5
    Schritt 3 erzwingt einen **Screenshot der Usage-Examples-Gruppe** + Eyeball (Labels da? Komposition korrekt?). Figma-
    Analogon zu #11 (Code-Render-Check ist zahnlos ohne echtes Rendern).
    **Bestätigt (Select-fix 06-20):** die Original-Headlines waren NICHT gedroppt, sondern im falschen LAUTEN Stil
    (ExtraBold 18 black statt Sibling-Regular 13 muted), und das Groups-Example war eine nicht-reusable Komposition —
    beide bestanden `/figma-verify`, der nachgeholte Screenshot-Check fing beide. Verschärft die Pointe: der Verify sieht
    weder falschen Text-STIL noch eine semantisch-falsche-aber-strukturell-saubere Komposition.

**SKILL.md T2.6 + composites.md + /docgen-props/storybook-rules (Sibling-Surface spiegeln):**

61. **Ein Port in eine bestehende Familie/Composite muss die Exposure-Surface des NÄCHSTEN geporteten Siblings spiegeln —
    nicht eine dünnere aus Stock-Source + Brief ableiten** *(Select: 3 Instanzen)* — vor T2.6/T4 die Sibling-Surface aus
    dem Katalog lesen:
    - **(a) Trigger-State-Achse = Input-Familien-Kanon** — `focus-invalid` als kombinierter Member UND invalid-Ring
      **focus-gated** (`aria-invalid:ring-[3px]` RAUS, Breite nur aus `focus-visible:ring-[3px]`; Border + `ring-destructive/20`
      bleiben). 6 Siblings haben das (Input/Textarea/InputGroup/Checkbox/Switch/Radio); der Select-Trigger hatte nur
      `[default,focus,disabled,invalid]` + ungateten Ring.
    - **(b) Optionales Leading-Element = Boolean** — `showIcon`-Bool wie CommandItem (`showIcon#3559:5` + Icon-Slot/Swap),
      NICHT ein nicht-abschaltbarer Slot-Default. (= Mechanism-Tabelle „fixed element on/off → Boolean".)
    - **(c) Doc-Seite je API-Part** — jeder Part mit kuratierter eigener API bekommt ein eigenes Story-File
      (RadioGroupItem-Muster, NICHT `meta.subcomponents` → s. #57 für das Warum). Im Figma: eigene Parts (SelectGroup)
      als eigenes Set modellieren, nicht inline im Example.
    Querverweis #21 (Story-Control-Scoping vom Sibling übernehmen) + #5 (Caveat: Sibling-*Surface* ja, Sibling-*Werte*
    trotzdem prüfen — Vorgänger nicht blind autoritativ).

### Offen — Command/cmdk (flache Palette) — neu 06-21

62. **Flache Command-Palette (labeled `CommandSeparator` statt `CommandGroup`) MUSS `shouldFilter={false}`** *(Command
    flat-palette review)* — cmdk re-sortiert beim Filtern die *Items* nach Match-Score; ein labeled `CommandSeparator`
    ist KEIN Item (kein Scope) und bleibt fix → beim Tippen/Leeren driften die Items über die `alwaysRender`-Separatoren
    in die falsche Rubrik (sichtbarer „weird grouping"-Bug). Eine flache Liste ist **statisch** → `shouldFilter={false}`
    (kein Re-Sort) + `alwaysRender` auf den Captions. Gruppen (`CommandGroup`) bleiben die **suchbare** Alternative
    (cmdk sortiert innerhalb der Gruppe → Items bleiben in ihrer Sektion). `CommandDialog` reicht `shouldFilter` jetzt
    an die innere `Command` durch (vorher nicht möglich). Angewandt: CommandDialog `PaletteFlat`, inline `PaletteFlat`,
    `CommandSeparator`-Seite. *(Inline in command.tsx + den Stories dokumentiert.)*

## Quellen

- Findings im Original (mit Verified-Belegen): `agent-runs/component-port/
  {2026-06-08-breadcrumb,2026-06-10-input-group,2026-06-10-command,2026-06-10-dialog,
  2026-06-11-command-dialog,2026-06-12-badge,2026-06-12-separator,2026-06-12-field,
  2026-06-12-checkbox,2026-06-12-switch,2026-06-12-radio-group,2026-06-19-select}/skill-feedback.md` +
  `agent-runs/component-sync/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md`
- Component-Locator/Status: `design-docs/design-system/components-reference.md` (zuerst lesen)
- Token-Crosswalk: `design-docs/design-system/tokens-reference.md` (§3 Kollisions-Regel,
  §4 `text-format-*`, §6 stock→DS, §7 Auto-Layout→Utilities)
- Run-Notes: `agent-runs/component-port/*/notes.md` + `agent-runs/component-sync/*/notes.md`
- Gate (Lib): `npx nx test|typecheck|lint @agentport/ui` · Voll-Gate: `npm run check`

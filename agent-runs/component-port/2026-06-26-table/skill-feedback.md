# Skill feedback — component-port (2026-06-26-table)

## A — gap caused a defect (priority)

### .claude/skills/shadcn-component-port/SKILL.md

**1 · Process / T2.5→T4 ordering — Figma-Recon vor Story-Authoring gestartet**

| Field | Value |
|---|---|
| Why A | User musste unterbrechen, um zu redirecten — ich hatte bereits T4 begonnen (recon.js gelesen, `whoami` gegen Plugin-MCP), ohne **eine** T2.5-Story geschrieben zu haben. Kosten = vorgezogener Recon-Schritt + User-Intervention. |
| Gap | SKILL T2.5 sagt „author … BEFORE Figma" — aber nur als Parenthese in der Prozess-Tabelle. Es gibt **keinen blockierenden Checkpoint** zwischen T2.5 und T4. Die lineare T-Liste lässt einen vom *Sammeln* der Doc-Beispiele (T2.5-Quelle, `get_item_examples`) direkt in die Figma-Recon gleiten, ohne die Stories tatsächlich zu **schreiben** + grün zu fahren. „Doc-Beispiele gelesen" fühlt sich wie „T2.5 erledigt" an, ist es aber nicht. |
| Verified | — (vom User abgefangen, bevor Figma-Schreibzugriff erfolgte). |
| Candidate fix | In SKILL.md einen harten Gate-Satz am Ende von T2.5 ergänzen, generisch: *„Keine Figma-Aktion — Recon eingeschlossen — bevor die Story-Datei geschrieben UND das Gate grün ist."* Optional denselben Riegel in `references/composites.md` §2 (T2.5/T2.6-Übergang) spiegeln, da Composites über T2.6/T2.7 noch mehr Schritte zwischen Story und Build schieben. |
| Status | open |

### .claude/skills/shadcn-component-port/references/composites.md (T2.7)

**4 · T2.7 Composition-Ask — Zellinhalt still als TEXT-Prop gewählt statt Slot-vs-Swap zu fragen**

| Field | Value |
|---|---|
| Why A | User musste **nach** dem Handoff zurückkommen und component-fähige Zellen + ein neues Beispiel anfordern → Round-Trip + Figma-Rework (content-Slot in das bereits kombinierte Cell-Set nachrüsten). T2.7 listet „Slot vs Swap per open content" explizit als Fork, aber ich habe ihn auf **nichts** angewandt — ich habe den Zellinhalt eigenmächtig als TEXT-Prop (text-only) modelliert, ohne die Wahl zu surfacen. Eine Data-Table-Zelle ist kanonisch **open content** (Text, Checkbox, Badge, Button — die Doc-eigene data-table-Demo beweist es). |
| Gap | composites.md T2.7 nennt den Slot-vs-Swap-Fork, flaggt aber nicht, dass **content-tragende Leaf-Parts in einem Data-Display-Composite (Zellen, Listenzeilen-Body, Menü-Item-Label) per Default open content sind** → der Agent kann still eine TEXT-Prop wählen und eine zu dünne Surface ausliefern, die den realen „Zelle hält Component"-Bedarf verfehlt. Der Done-Test hat es nicht gefangen, weil ich die Checkbox als „Call-Site-Checkbox" weg-scoped hatte — das maskierte die Lücke. |
| Verified | User-Request 2026-06-26: „eine table cell nimmt aber auch components an" → content-Slot nachgerüstet. |
| Candidate fix | In references/composites.md T2.7 ergänzen: Wenn der Inhalt eines Leaf-Parts Daten/Werte sind (eine Zelle, ein Listenzeilen-Body, ein Menü-Item-Label), **per Default als open content behandeln** → Slot-vs-Swap-vs-Text fragen, NICHT auf TEXT-Prop defaulten. Eine TEXT-Prop ist nur richtig, wenn der Inhalt nachweislich text-only ist. (also: SKILL.md T2.6 Exposure-Surface.) |
| Status | open |

## B — self-derived, result held (codify · deferred)

### .claude/skills/figma-build-rules/SKILL.md (§Slots / §Usage-examples)

**3 · T4/T5 Figma — Slot-Strategie für Many-Child-Composites: leer bauen + Demo backen, Beispiele append-only**

| Field | Value |
|---|---|
| Why B | Selbst hergeleitet (2 Probe-Calls): Tabelle = Row→Cells→Table = bis zu 3 Slot-Ebenen mit vielen Kindern. Ergebnis korrekt (Beispiele sauber gebaut), kein Defekt. Kostete 2 Experiment-Calls, um die Grenze zu finden. |
| Gap | §Slots dokumentiert getrennt: (a) Clearing von Instance-Slot-Defaults invalidiert Sibling-Refs → **ein** Remove pro Call; (b) Append in Instance-Slot invalidiert die Ref → letztes Kind neu auflösen. Es **verbindet** beide nicht zur STRATEGIE: Für ein Composite, dessen Beispiele einen Slot mit vielen Kindern füllen (Table-Row-Cells, List-Items), den Slot **LEER** bauen (Demo-Content in ein dediziertes Kompositions-Member backen — die DS-Konvention „Slots LEER gebaut" aus dem Command-Katalog) → Reproduktion ist **append-only**, nie clear-then-refill. Sonst kostet jede Beispiel-Zeile (N Clears + M Appends) Calls. |
| Verified | Probe: 3 gebackene Cells clearen → Fehler nach 1 Remove (`Node … not found`); 2 Cells in leeren Slot appenden + letztes Kind neu auflösen (FILL/props) → 0 Fehler, beide platziert. |
| Candidate fix | In §Slots (oder §Usage-examples) ergänzen: *„Beispiele, die einen Slot mit vielen Kindern füllen → Slot LEER bauen, Demo-Content in ein Kompositions-Member backen; Reproduktion append-only (letztes Kind für FILL/props neu auflösen). Keine Defaults backen, die man später clearen muss — Instance-Slot-Defaults clearen ist one-remove-per-call."* |
| Status | open |

### .claude/skills/figma-build-rules/SKILL.md (§Slots / §Mechanism)

**5 · Figma — „text ODER component"-Leaf = content-Slot mit prop-gebundenem TEXT-Default (nicht leerer Slot neben Text)**

| Field | Value |
|---|---|
| Why B | Selbst hergeleitet beim Cell-Retrofit; korrekt gelöst. Erster Versuch (leerer content-Slot **neben** dem Text) blähte jede Zelle auf 116px (leerer Slot = intrinsisch ~100×100, HUG kollabiert ihn NICHT) und propagierte in die gebackene Composition → Fix: Text **in** den Slot nesten. Kostete eine Iteration. |
| Gap | §Slots sagt „drop a sensible default inside" + „empty slot shows ~100×100" — aber nicht als **Pattern** für ein Leaf, das *text ODER component* hält: der content-Slot bekommt als Default das **prop-gebundene TEXT-Node** (nicht ein separates leeres Slot-Feld neben dem Text). Damit ist der Slot nie leer (kein 100×100-Bloat), der Text bleibt über die TEXT-Prop editierbar UND gegen eine Component tauschbar. „Leerer Slot + Text als Geschwister" ist die Falle. |
| Verified | leerer Slot neben Text → Member 116px (Slot 100×100); Text in den Slot genestet → Member 37px, Slot HUGt Text (21px), TEXT-Prop bindet weiter, Component-Swap funktioniert (Checkbox/Badge). |
| Candidate fix | In §Slots/§Mechanism ergänzen: *„Leaf, das Text ODER eine Component hält → EIN content-Slot, dessen Default das prop-gebundene Text-Node ist (Text in den Slot nesten). Nie einen leeren Slot neben einem Text-Node führen — leerer Slot ist ~100×100 und bläht den Container."* |
| Status | open |

## C — tooling / repo / already covered

### design-docs/design-system/tokens-reference.md (§6)

**2 · T3 / Token-Mapping — stock `text-muted-foreground` → DS `text-muted-ink` (-ink-Suffix)**

| Field | Value |
|---|---|
| Why C | Kein Defekt — das Mapping ist in §6 `color_renames` bereits korrekt hinterlegt (`text-muted-foreground → text-muted-ink`). User hat es als wiederkehrende Stolperstelle markiert (Sekundärtext: Caption, muted-Labels). |
| Gap | Der Text-vs-Fläche-Suffix-Split (`-ink` = Text/Icon, `-fill` = Fläche) ist leicht zu vermischen — ein Port kann für Sekundärtext fälschlich `text-muted` / `text-muted-fill` schreiben statt `text-muted-ink`. |
| Verified | §6 `color_renames`: `{ stock: text-muted-foreground, ds: text-muted-ink }`. `item.tsx:176` nutzt `text-muted-ink` für Sekundärtext. |
| Candidate fix | Bereits in §6 abgedeckt — beim Port konsequent §6 lesen statt nach Namens-Ähnlichkeit raten. Wenn mehr Betonung gewünscht: Home ist tokens-reference §6 (die Daten), NICHT die Skill-Prosa (`.claude/skills/CLAUDE.md`: keine Token-Namen in Skills duplizieren). Kein Skill-Prosa-Edit. |
| Status | open |

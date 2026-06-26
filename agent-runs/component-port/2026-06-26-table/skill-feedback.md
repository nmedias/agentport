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

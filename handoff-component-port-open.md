# Handoff — Component-Port: Offene Punkte + Skill-Findings (konsolidiert)

> Ersetzt `handoff-agentport-component-port.md` + `handoff-composite-port.md` (beide gelöscht
> 2026-06-12). Alles **Erledigte** ist raus — Locator/Status aller Components + Figma-Node-IDs:
> `design-docs/design-system/components-reference.md` (**zuerst lesen**), Token-Crosswalk:
> `design-docs/design-system/tokens-reference.md`, Run-Details: `agent-runs/`.

**Stand 2026-06-12:** master `fdfa7a9`, alles gemergt (ff-only, kein Remote), Gates grün (53 Tests).
8 Components portiert + nova-aligned (Button, Input, Textarea, Kbd, Breadcrumb, InputGroup,
Command inkl. Palette-Variante + CommandDialog, Dialog) + Blocks-Layer (`explorer/metadata-list`).
Composite-Verfahren validiert (3× bestanden), operativ in `/shadcn-component-port` (SKILL.md +
references/composites.md + references/figma-build.md); Pflege via `/component-sync` (Figma→Code).

## Offene Punkte

1. **Skill-Findings einarbeiten** (Block unten) — User wendet an; Stand 2026-06-12 ist **nichts**
   davon im Skill (geprüft: kein lucide/radix-ui/SizingMode-Treffer in den Skill-Dateien).
   Ausnahme: InputGroup #1–#3 wurden bereits am 2026-06-10 eingearbeitet (s. „Bereits eingearbeitet").
2. **Composite-Strang: nichts offen.** Kandidaten für den nächsten Schritt: weiteres Composite
   porten (`/shadcn-component-port <name>`) oder Blocks-Arbeit auf den neuen Palette-Bausteinen.
3. **Dark-Mode-Token-Satz** in Figma + `.dark`-Block in globals.css (`--background-fixed` ausnehmen).
   Bis dahin: Light = einziger Mode.
4. **9 ⚠-Platzhalter-Tokens echt designen:** `secondary*`, `destructive*`, `chart-1…5`
   (`destructive` = invalid-State von `.Input`/`.Textarea`). *(Übernommen aus
   `handoff-agentport-tokens-color.md`.)*
5. **Status-Familie** `connected/offline/error/warning`, **Anteils-Balken**, **Rail-Aktiv-Icons**.
   *(Ebenfalls aus dem Token-Handoff.)*

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
Command (06-10) · Dialog (06-10) · CommandDialog (06-11). Verified-Belege stehen in den Run-Dateien;
hier der deduplizierte Stand, gruppiert nach Ziel-Datei. **User reviewt + wendet an** — Skills werden
nie mid-run editiert.

### Bereits eingearbeitet ✅ (nur zur Abgrenzung)

- **Shadowing-Fall** im Dependency-Audit — bereits portierte Ordner-Dep wird von `ui:add` flach
  geschattet → flache Kopie löschen (InputGroup #1 → composites.md §2 T2 + §3 trap-1).
- **Slot-Fill-in-Instanz-Rezept** (InputGroup #2 → figma-build.md §Slots) — *durch Dialog #3–#5
  unten teilweise überholt; der Abschnitt braucht das Update aus Findings 7–9.*
- **Conditional-Layout → Variant-Achse** (`has-[]`-Direction-Flip; InputGroup #3 → composites.md §1).

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
8. **SLOT-Node nie direkt visibility-binden** *(Dialog #4)* — `componentPropertyReferences =
   { visible }` direkt am SLOT konvertiert ihn still zu FRAME (Slot-Verhalten weg, bestehende
   Instanz-Slot-Inhalte verworfen). Muster: Wrapper-FRAME trägt das Boolean, frischer SLOT als
   Kind. Außerdem: Master-Slot-Umbauten NACH gebauten Beispiel-Instanzen kosten deren
   Overrides → Surface erst final definieren, dann Beispiele bauen.
9. **Leerer Slot rendert ~100px Resthöhe trotz HUG** *(Dialog #5)* — optionale leere Slots
   hinter das Visibility-Boolean am Wrapper legen (Muster aus #8); Slots mit permanentem
   Content sind nicht betroffen.

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

## Quellen

- Findings im Original (mit Verified-Belegen): `agent-runs/component-port/
  {2026-06-08-breadcrumb,2026-06-10-input-group,2026-06-10-command,2026-06-10-dialog,
  2026-06-11-command-dialog}/skill-feedback.md`
- Component-Locator/Status: `design-docs/design-system/components-reference.md` (zuerst lesen)
- Token-Crosswalk: `design-docs/design-system/tokens-reference.md` (§3 Kollisions-Regel,
  §4 `text-format-*`, §6 stock→DS, §7 Auto-Layout→Utilities)
- Run-Notes: `agent-runs/component-port/*/notes.md` + `agent-runs/component-sync/*/notes.md`
- Gate (Lib): `npx nx test|typecheck|lint @agentport/ui` · Voll-Gate: `npm run check`

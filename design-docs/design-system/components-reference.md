# Agentport DS — Component-Referenz (maschinenlesbar)

Eine Datenquelle für Component-Arbeit: **wo liegt was** — in Figma (Set/Node-IDs) und im Code
(Ordner/Exporte/Barrel) — plus Status, Quelle und die wichtigsten DS-Abweichungen pro Component.
Prosa = Regeln/Architektur; **YAML = Component-Daten**. Schwester-Doc: `tokens-reference.md`
(Token-Crosswalk) — die hier referenzierten Utilities/Werte dort nachschlagen.

Quelle: `libs/ui/src/components/ui/*`, `libs/ui/src/index.ts`, `libs/ui/{components.json,package.json}`,
`handoff-agentport-component-port.md`, Figma „Agentport DS". Bei Drift: **Code + Figma sind führend**
(dieses Doc nachziehen, nicht umgekehrt). Figma-Lesen ist read-only (Pipeline-Regel).

## Regeln

- **Baseline = `radix-nova`** (`components.json` `style`). `ui:add` zieht dichtere Nova-Source; im Code
  in DS-Tokens re-clothen (per NAME, nicht Novas Rohskala). Nie `shadcn init` unter radix-nova. Details
  + globals-Plumbing (data-state Custom-Variants): siehe `handoff-agentport-component-port.md` §Nova-Pivot.
- **Ein Ordner pro Component:** `components/ui/<name>/` = `<name>.tsx` + `.stories.tsx` + `.spec.tsx` +
  `index.ts` (Barrel `export * from './<name>'`). Re-Export der Component im Wurzel-Barrel
  `libs/ui/src/index.ts` (sonst nicht über `@agentport/ui` erreichbar).
- **Figma-Quelle der Wahrheit für Werte/Dichte.** Bound Variable = autoritativ (§6/§7-Crosswalk der
  tokens-reference). Erstport via `/shadcn-component-port`, Figma→Code-Pflege via `/component-sync`
  (read-only Figma). Ein Code→Figma-Push ist die Ausnahme, nicht der Default (manuell via `use_figma`).
- **Status-Vokabular** (Feld `status`): `nova-aligned` = portiert **und** auf die radix-nova-Dichte
  angeglichen · `ported` = portiert, noch new-york-Dichte · `pending` = noch nicht (wieder) im Code ·
  `removed` = bewusst entfernt. `figma-synced: true` = mind. ein `/component-sync`- oder Push-Durchlauf.
- **Geometrie bleibt numerisch** (`h-8`, `size-3`, `min-w-5`); nur Farbe/Typo/Spacing/Radius binden an
  Tokens. Kein Dark-Mode (Light = einziger Mode).
- IDs sind **Figma-Node-IDs** in der Datei `FIGMA_FILE_KEY`. Sie sind stabil (keine Session-IDs).

## Schema (pro Component)

```
name · status · figma_synced? · source{registry,item,style} ·
code{dir, exports[], barrel} ·
figma{page, section?, set_or_component, members?/slots?, axis} ·
skill · notes
```

## Architektur / Pipeline

```
shadcn (@shadcn/<item>, style radix-nova)
   → /shadcn-component-port: Anatomie lesen → Figma token-gebundenes Set bauen → Code auf DS-Utilities
   → /component-sync: Figma-Änderung → Code-Delta (read-only Figma)

Figma „Agentport DS"  fileKey FIGMA_FILE_KEY
   Page „Shadcn Components"  3126:2   ← alle UI-Component-Sets liegen hier
Code  libs/ui/src/components/ui/<name>/   →  Barrel libs/ui/src/index.ts  →  @agentport/ui
Blocks (Organismen)  libs/ui/src/blocks/<screen>/<name>/  →  @agentport/ui/blocks[/<screen>]
```

## Meta

```yaml
figma:
  file_key: FIGMA_FILE_KEY
  file_name: "Agentport DS"
  components_page: { name: "Shadcn Components", id: "3126:2" }
baseline:
  shadcn_style: radix-nova          # components.json (war new-york bis 2026-06-09)
  registry: "@shadcn"
modes: [light]                       # kein Dark-Mode
package: "@agentport/ui"              # Components über Wurzel-Barrel; Blocks via ./blocks-Subpath
status_note: >
  Branch chore/composite-port-skill (noch nicht auf master): radix-nova-Angleichung der 4 Altkomponenten
  + die Command-Re-Port-Kette. Neu portiert (nova, Figma+Code, Gate grün): Textarea.
  Composite-Port-Verfahren im Skill überarbeitet (3 Dateien). InputGroup wurde nach neuem Verfahren NEU
  portiert (Figma+Code, Gate grün, Done-Test) — GREEN-Test des Rework. Command (cmdk) bleibt vorerst
  entfernt; nächster Re-Port (hängt an InputGroup + einem Dialog-Port für CommandDialog).
```

## Components

```yaml
- name: Button
  status: nova-aligned
  figma_synced: false
  source: { registry: "@shadcn", item: button, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/button/
    exports: [Button, buttonVariants, ButtonProps]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/button'"
  figma:
    set: { name: ".Button", id: "3164:312" }      # volle 120er-Matrix variant × size × state
    base: { name: ".Button/Base", id: "3159:12" } # ausgekoppelter Basis-Slot
    axis: { variant: [default, destructive, outline, secondary, ghost, link],
            size: [default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg],
            state: [default, hover, active, focus, disabled] }
  skill: /shadcn-component-port
  notes: >
    Nova-Size-Ladder (h-8 default + xs und icon-xs/sm/lg, per-Size-Icon-Sizing, aria-expanded).
    DS behalten: Radius per NAME (rounded-lg/-md), Akzent-Cyan-Hover, solides destructive, text-label.
    Icon-only (size=icon*) verlangt aria-label/-labelledby auf Typ-Ebene. dark: entfernt.

- name: Input
  status: nova-aligned
  figma_synced: false
  source: { registry: "@shadcn", item: input, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/input/
    exports: [Input]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/input'"
  figma:
    section: { name: "Input", id: "3176:302" }
    set: { name: ".Input", id: "3177:302" }
    axis: { state: [default, focus, filled, disabled, invalid] }   # kein CVA im Code
  skill: /shadcn-component-port
  notes: >
    h-8 / rounded-lg / px-md / py-xs / file:h-6. bg-transparent → bg-input-background;
    text → text-label; placeholder:text-input-placeholder; focus border-ring + ring/50 ring-[3px];
    invalid destructive (⚠ Platzhalter-Token). dark: entfernt.

- name: Textarea
  status: nova-aligned
  figma_synced: true                            # Code→Figma Werte-Audit 2026-06-09 (Textarea stimmte bereits)
  source: { registry: "@shadcn", item: textarea, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/textarea/
    exports: [Textarea]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/textarea'"
  figma:
    section: { name: "Textarea", id: "3487:674" }
    set: { name: ".Textarea", id: "3488:684" }
    axis: { state: [default, focus, filled, disabled, invalid] }   # kein CVA; Sibling von Input
  skill: /shadcn-component-port (2026-06-09, Port #1 der Command-Kette)
  notes: >
    Feld-Zwilling von Input, höher. min-h-16 / rounded-lg / px-md / py-md; field-sizing-content (auto-grow).
    bg-transparent → bg-input-background; text → text-label; placeholder:text-input-placeholder;
    focus border-ring + ring/50 ring-[3px]; invalid destructive (⚠). Figma: Text top-aligned
    (counter=MIN), keine Truncation. dark: + disabled:bg-input/50 entfernt.

- name: InputGroup
  status: nova-aligned
  figma_synced: true                            # Re-port 2026-06-10: Figma komplett neu gebaut (Composition + Slots + Examples)
  source: { registry: "@shadcn", item: input-group, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/input-group/
    exports: [InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/input-group'"
  figma:
    section: { name: "Input Group", id: "3519:590" }                 # alt 3491:674 gelöscht (rebuild fresh)
    addon: { name: ".InputGroup/Addon", id: "3520:606", axis: "align [inline-start,inline-end,block-start,block-end]", slot: content }
    button: { name: ".InputGroup/Button", id: "3545:694", axis: "size [xs,sm,icon-xs,icon-sm]",
              nests: "ghost .Button instance per size (xs→xs, sm→default, icon-xs→icon-xs, icon-sm→icon); Base radius→radius-sm on xs+icon-xs",
              content: "label = deep text override; icon = swapComponent .Button Icon → swap-target (.InputGroup/Button Icon · copy 3546:677)" }
    input: { name: ".InputGroup/Input", id: "3522:590", prop: text }
    textarea: { name: ".InputGroup/Textarea", id: "3522:592", prop: text }
    text: { name: ".InputGroup/Text", id: "3522:594", prop: text }
    composition: { name: ".InputGroup", id: "3525:622", axes: "state [default,focus,disabled,invalid] x layout [horizontal,vertical]", slot: content }
    examples: { Icons: "3527:613", Text: "3527:650", Buttons: "3546:697", States: "3528:662/681/700", Textarea: "3547:711", Kbd: "3531:676" }
  skill: /shadcn-component-port (2026-06-10, Re-port; GREEN-Test des überarbeiteten Composite-Verfahrens)
  notes: >
    6-teiliges Composite, RE-PORT nach Skill-Rework. Deps: Button ✓, Input ✓, Textarea ✓, Kbd ✓. Die GRUPPE
    besitzt Fläche+Border+Focus/Invalid/Disabled (has-[control:focus-visible]/has-[aria-invalid]/has-disabled);
    Controls randlos (border-0 bg-transparent, data-slot=input-group-control). DS: Gruppe trägt bg-input-background
    (opak); Addon text-label muted; Text text-body muted; Button ghost. Figma neu = 3-Schichten + reproduzierte
    Beispiel-Instanzen (Done-Test): Container-Komposition (state×layout) mit Children-Slot, Addon mit content-Slot,
    Input/Textarea/Text als Text-Prop. **Button nestet eine echte ghost .Button-Instanz** (nicht standalone re-clothed)
    → Token+Component-Propagation; Geometrie-Delta via Base-Override, Icon-Content via swapComponent (DS-Button
    exponiert keinen freien Icon-Slot). FIX ggü. Vor-Port: invalid trägt jetzt ring-[3px] (Breite, vorher gedroppt)
    + ring-destructive/20. Kbd-⌘ als Vektor (RiCommandLine), nicht Text-Glyph.

- name: Kbd
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: kbd, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/kbd/
    exports: [Kbd, KbdGroup, kbdVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/kbd'"
  figma:
    section: { name: "Kbd", id: "3215:302" }
    set: { name: ".Kbd", id: "3217:308" }            # 2 Achsen: content × emphasis = 4 Member
    members:
      "content=text, emphasis=high": "3217:302"      # defaultVariant
      "content=icon, emphasis=high": "3217:304"
      "content=text, emphasis=low":  "3428:1385"
      "content=icon, emphasis=low":  "3428:1387"
    slots: { property: "icon#3217:1", nodes: { high: "3217:305", low: "3428:1388" } }  # 12px Vektor
    axis: { content: [text, icon], emphasis: [high, low] }   # content children-getrieben; emphasis = Code-Prop (default high)
  skill: /shadcn-component-port (+ /component-sync 2026-06-09 — emphasis-Achse)
  notes: >
    Nova-Kbd metrisch identisch zu new-york (keine Dichte-Änderung). emphasis=high (default) =
    invertierte dunkle Keycap (Inverse/inverse + inverse-foreground); emphasis=low = muted Keycap
    (shadcn muted/muted-foreground). text-kbd (Geist Mono); gap-xs/px-xs; rounded-sm; Tooltip-Kontext
    via v4 in-data-[slot=tooltip-content]:. content (text|icon) children-getrieben, nicht als Prop.

- name: Breadcrumb
  status: nova-aligned
  figma_synced: true                            # Code→Figma-Push der Nova-Dichte (2026-06-09)
  source: { registry: "@shadcn", item: breadcrumb, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/breadcrumb/
    exports: [Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/breadcrumb'"
  figma:
    section: { name: "Breadcrumb", id: "3249:302" }
    composition: { name: ".Breadcrumb", id: "3254:302" }       # items-Gap Space/space-sm (6px)
    segment_set: { name: ".Breadcrumb/Segment", id: "3250:308" }
    segment_members: { "state=link": "3250:302", "state=link-hover": "3250:304", "state=page": "3250:306" }
    separator: { name: ".Breadcrumb/Separator", id: "3251:302" }  # Icon 14px → size-3.5
    ellipsis: { name: ".Breadcrumb/Ellipsis", id: "3251:305" }    # 20×20, Icon 16px → size-4
    axis: { segment_state: [link, link-hover, page] }
  skill: /shadcn-component-port (+ Code→Figma-Push via use_figma)
  notes: >
    Multipart. Farben: link=muted-foreground, link-hover/page=foreground (Body→text-body).
    List- + Segment-Gap → Space/space-xs (4px) Item / Space/space-sm (6px) List; Ellipsis size-5;
    break-words → v4 wrap-break-word. Nova-Dichte wurde im Code entschieden und nach Figma gepusht.

- name: Dialog
  status: pending
  figma_synced: false
  source: { registry: "@shadcn", item: dialog, style: radix-nova }
  code: { dir: "—", exports: [], barrel: "—" }
  figma: { set: "tbd" }
  skill: /shadcn-component-port (geplant)
  notes: >
    Noch nicht portiert. Wird für CommandDialog gebraucht, sobald Command (nach der Skill-Überarbeitung)
    neu portiert ist.
```

## Pending / Removed

```yaml
- name: Command
  status: removed                                # entfernt 2026-06-09; Composite-Port-Verfahren wird im Skill überarbeitet, dann neu portiert
  reason: >
    Multi-Composite (cmdk, baut auf InputGroup). Code + Figma entfernt. Re-Port nach Überarbeitung
    des /shadcn-component-port-Composite-Verfahrens (Slot/Instance-Swap/Property-Modell, Usage-
    Examples-First). Hängt an einem neuen InputGroup-Run.
```

## Blocks (Organismen)

Präsentationale, domain-getypte Organismen pro Screen unter `libs/ui/src/blocks/<screen>/<name>/`,
ausgeliefert über Subpath. Orientieren sich visuell an `handoff-agentport-design-visual.md` (Referenz).

```yaml
- name: MetadataList
  layer: blocks
  screen: explorer
  code:
    dir: libs/ui/src/blocks/explorer/metadata-list/
    exports: [MetadataList, MetadataEntry, MetadataListProps]
    subpath: "@agentport/ui/blocks/explorer"
    barrel: "libs/ui/src/blocks/explorer/index.ts → export * from './metadata-list'"
  figma: { node: "tbd" }
  notes: "Erster Block. Weitere Organismen (WorkspaceHeader, PropertyTable, InspectorPanel, ListNavigator, StatusBar) folgen mit ihren WELLE-1/2-Primitives."
```

## Befehle / Skills

- Neuer Erstport: `/shadcn-component-port <name>` · Figma→Code-Sync: `/component-sync <name>`
- Vor Port/Sync Lücken-Logging: `/skill-feedback kind=component-port subject=<name>`
- Gate (Lib): `npx nx test|typecheck|lint @agentport/ui`
- Nova-Source vor `ui:add` ansehen: Registry-JSON `https://ui.shadcn.com/r/styles/radix-nova/<c>.json`
- Token-Crosswalk: `design-docs/design-system/tokens-reference.md`

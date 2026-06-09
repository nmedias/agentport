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
  Branch feat/shadcn-command-port (noch nicht auf master): radix-nova-Angleichung der 4 Altkomponenten
  + die Command-Re-Port-Kette. Neu portiert (nova, Figma+Code, Gate grün): Textarea, InputGroup (6-teilig),
  Command (cmdk). Dependency-Reihenfolge war Textarea → InputGroup → Command.
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
  figma_synced: true                            # Code→Figma Werte-Audit 2026-06-09: Container gap+padR entfernt, Addon py-sm ergänzt
  source: { registry: "@shadcn", item: input-group, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/input-group/
    exports: [InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/input-group'"
  figma:
    section: { name: "Input Group", id: "3491:674" }
    container: { name: ".InputGroup", id: "3495:698", axis: "state [default,focus,disabled,invalid]" }
    addon: { name: ".InputGroup/Addon", id: "3492:686", axis: "align [inline-start,inline-end,block-start,block-end]" }
    button: { name: ".InputGroup/Button", id: "3494:684", axis: "size [xs,sm,icon-xs,icon-sm]" }
    input: { name: ".InputGroup/Input", id: "3493:674" }
    textarea: { name: ".InputGroup/Textarea", id: "3493:676" }
    text: { name: ".InputGroup/Text", id: "3493:678" }
  skill: /shadcn-component-port (2026-06-09, Port #2 der Command-Kette)
  notes: >
    6-teiliges Composite. Deps: Button ✓, Input ✓, Textarea ✓. Die GRUPPE besitzt Fläche+Border+
    Focus/Invalid/Disabled (via has-[control:focus-visible] etc.); Controls sind randlos (border-0
    bg-transparent, data-slot=input-group-control). DS: Gruppe trägt bg-input-background (opak), nova
    lässt sie transparent; Command überschreibt. Addon text-label muted; Text text-body muted; Button
    ghost. ring-3→ring-[3px]; combobox-content-Overrides + [&>kbd]:rounded-calc gedroppt. v4 has-/
    group-has-/data-align im CSS verifiziert.

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

- name: Command
  status: nova-aligned                          # new-york-Port (0602bb3) entfernt (0d81650), nova-re-portiert (2026-06-09)
  figma_synced: true                            # Code→Figma Werte-Audit 2026-06-09: CommandInput border/30+gap-sm+padR0, Composition root-gap0+input-wrapper+list p-xs
  source: { registry: "@shadcn", item: command, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/command/
    exports: [Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/command'"
  figma:
    section: { name: "Command", id: "3497:686" }
    item_set: { name: ".CommandItem", id: "3498:722", axis: "state [default,selected,disabled] × trailing [shortcut,check]" }
    input: { name: ".CommandInput", id: "3499:689" }
    separator: { name: ".CommandSeparator", id: "3499:693" }
    empty: { name: ".CommandEmpty", id: "3499:695" }
    composition: { name: ".Command", id: "3500:689" }    # Palette: Input + List (Headings + Items + Separator)
  skill: /shadcn-component-port (2026-06-09, Port #3 der Command-Kette)
  notes: >
    cmdk-Composite, nova-re-portiert. CommandInput auf der portierten InputGroup + InputGroupAddon
    (h-10 für mono text-input). Selektion = DS accent-cyan (bg-accent/text-accent-foreground), NICHT
    novas neutrales bg-muted. CommandShortcut = Kbd (data-slot=command-shortcut). Gruppen-Heading
    text-eyebrow. CommandItem: nova checkable Checkmark (RiCheckLine, group-data-[checked]/
    group-has-[shortcut]:hidden) INKLUDIERT. Root rounded-xl + p-xs bg-popover; List no-scrollbar
    max-h-72. CommandDialog DEFERRED (Dialog un-portiert; in-data-[slot=dialog-content]-Hook bleibt).
    test-setup.ts polyfillt ResizeObserver/scrollIntoView für cmdk.

- name: Dialog
  status: pending                               # CommandDialog blockiert hierauf
  figma_synced: false
  source: { registry: "@shadcn", item: dialog, style: radix-nova }
  code: { dir: "—", exports: [], barrel: "—" }
  figma: { set: "tbd" }
  skill: /shadcn-component-port (geplant)
  notes: >
    Noch nicht portiert. Blockiert CommandDialog (Command trägt den Forward-Compat-Hook
    in-data-[slot=dialog-content]:rounded-lg). Sobald Dialog steht: CommandDialog ergänzen + exportieren.
```

## Pending / Removed

```yaml
- name: (keine offenen)                          # Command nova-re-portiert; Dialog steht oben unter Components als pending
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

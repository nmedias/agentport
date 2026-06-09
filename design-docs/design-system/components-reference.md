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
  Die radix-nova-Angleichung + Command-Removal liegen auf Branch feat/shadcn-command-port
  (noch nicht auf master). Command-Re-Port steht aus.
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

- name: Kbd
  status: nova-aligned
  figma_synced: true
  source: { registry: "@shadcn", item: kbd, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/kbd/
    exports: [Kbd, KbdGroup]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/kbd'"
  figma:
    section: { name: "Kbd", id: "3215:302" }
    set: { name: ".Kbd", id: "3217:308" }
    members: { "content=text": "3217:302", "content=icon": "3217:304" }
    slots: { icon: "3217:305" }                # 12px Remix-Vektor, INSTANCE_SWAP/createSlot
    axis: { content: [text, icon] }            # statisch, nicht-interaktiv → Content- statt State-Achse
  skill: /shadcn-component-port (+ /component-sync — inverted keycap)
  notes: >
    Nova-Kbd metrisch identisch zu new-york (keine Dichte-Änderung). text-kbd (Geist Mono);
    invertierte dunkle Keycap bg-inverse/text-inverse-foreground (Figma-Sync); gap-xs/px-xs;
    Tooltip-Kontext via v4 in-data-[slot=tooltip-content]:.

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
```

## Pending / Removed

```yaml
- name: Command
  status: removed                               # new-york-Port (0602bb3) entfernt (0d81650)
  figma_synced: false
  source: { registry: "@shadcn", item: command, style: radix-nova }
  code: { dir: "libs/ui/src/components/ui/command/ (gelöscht)", exports: [], barrel: "—" }
  figma: { set: "tbd (Nova-Re-Port)" }
  skill: /shadcn-component-port (geplant)
  notes: >
    Nächster Nova-Re-Port. ⚠ ui:add command schreibt unter radix-nova MEHRERE flache Dateien
    (button/input/textarea/dialog/input-group) — Strays shadowen DS-Components, brechen das Gate;
    nur das Ziel behalten, Deps port/stub/defer. CommandInput lehnt an InputGroup, CommandDialog an
    Dialog (beide un-portiert) → re-clothe-standalone vs. defer. Lessons im command-nova-Run.
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

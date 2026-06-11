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
  Dialog portiert (Composite-Verfahren, Figma+Code, Gate grün, Done-Test) inkl. Semantic-Token
  `scrim`; CommandDialog 2026-06-11 nachgerüstet (code-only, Branch feat/command-dialog-readd).
  Davor: Command (cmdk) + InputGroup-Re-Port nach dem überarbeiteten Composite-Verfahren,
  radix-nova-Angleichung der Altkomponenten, Textarea.
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
    DS behalten: Radius per NAME (corner-lg/-md, ehem. rounded), Akzent-Cyan-Hover, solides destructive, text-label.
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
    h-8 / corner-lg / px-md / py-xs / file:h-6. bg-transparent → bg-input-background;
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
    Feld-Zwilling von Input, höher. min-h-16 / corner-lg / px-md / py-md; field-sizing-content (auto-grow).
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
              nests: "ghost .Button instance per size (xs→xs, sm→default, icon-xs→icon-xs, icon-sm→icon); Base radius→corner-sm on xs+icon-xs",
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
    (shadcn muted/muted-foreground). text-kbd (Geist Mono); gap-xs/px-xs; corner-sm; Tooltip-Kontext
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
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-10; palette/labeled-Varianten 2026-06-11 via /component-sync nachgezogen
  source: { registry: "@shadcn", item: command, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/command/
    exports: [Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, commandVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/command'"
    variants: "variant: default | palette — NUR auf Command-Root/CommandDialog (cva); Input/List/Group/Separator erben via modul-internem CommandVariantContext (ToggleGroup-Idiom); data-variant am Root. CommandSeparator zusätzlich label-Prop (Labeled Rule, role=separator-div; gleicher hide-on-search-Vertrag wie die Linien-Form via useCommandState + alwaysRender)"
  figma:
    section: { name: "Command", id: "3555:679" }
    item:
      set: { name: ".Command/Item", id: "3559:2" }
      axis: { state: [default, selected, disabled, checked] }
      props: "icon#3559:0 (INSTANCE_SWAP→Calendar) · showIcon#3559:5 (bool) · label#3559:10 (text) · shortcut#3559:15 (bool) · shortcutText#3559:20 (text)"
      members: { default: "3558:2", selected: "3558:7", disabled: "3558:12", checked: "3558:17" }
    input:
      set: { name: ".Command/Input", id: "3639:2" }
      axis: { variant: [default, palette] }
      props: "value#3639:0 (text) · placeholder#3639:1 (text) — nur palette-Member gebunden"
      members: { default: "3561:2", palette: "3638:8" }
      default: "nests .InputGroup-Instanz 3561:3 (opake DS-Fläche) + Such-Vektor + text-input Placeholder"
      palette: "Prompt-Zeile: bg-card + p-xl + gap-lg · Caret-Bar 2.5×18 (primary + Effect-Style Glow) · value/placeholder text-input (Mono 18) · echte .Kbd-Instanz (content=text, emphasis=high) 'Esc'"
    separator:
      set: { name: ".Command/Separator", id: "3653:6" }
      axis: { variant: [default, labeled] }
      props: "label#3653:1 (text) — nur labeled-Member gebunden"
      members: { default: "3564:2", labeled: "3653:5" }
      default: "1px-Linie (border), full-bleed ergibt sich aus p-0-Panel der palette-Composition"
      labeled: "Labeled Rule: Eyebrow-Label (textCase UPPER, muted-foreground) + nachlaufende Linie (h1 fill, border) · gap-md px-xl pt-lg pb-sm — für freie/flache Kompositionen; CommandGroup[palette] zeichnet sein Heading weiterhin selbst (cmdk-Auto-Hide bleibt beim Gruppen-Weg)"
    empty: { name: ".Command/Empty", id: "3564:3", prop: "message (text)" }
    group:
      set: { name: ".Command/Group", id: "3640:9" }
      axis: { variant: [default, palette] }
      props: "heading#3640:1 (text, eyebrow UPPER)"
      slot: "items#3640:0"
      members: { default: "3565:2", palette: "3640:2" }
      palette: "Heading = genestete .Command/Separator[labeled]-Instanz (px auf space-md overridet → Label-Einzug 16px wie Item-Icons) · Container px-md py-0. ACHTUNG: heading-Prop ist im palette-Member inert — Gruppen-Titel via label-Prop der genesteten Separator-Instanz setzen"
    composition:
      set: { name: ".Command", id: "3642:2" }
      axis: { variant: [default, palette] }
      slot: "list#3642:0"
      members: { default: "3566:2", palette: "3641:2" }
      default: "bg-overlay + border + shadow-elevation + corner-xl + p-xs"
      palette: "bg-overlay + border 1.5px + shadow-elevation + corner-md + p-0 · Prompt-Divider + Footer-Divider (.Command/Separator-Instanzen, fill) · list-Slot py-md · Default-Slot-Content = C2-Demo (SPRINGE ZU / SUCHE / FÜHRE AUS)"
    examples: { command-demo: "3573:2", palette-demo: "3650:63" }
    icons: { Calendar: "3557:4", Emotion: "3557:7", Calculator: "3557:10", User: "3557:13", Card: "3557:16", Settings: "3557:19", ArrowRight: "3644:4", Swap: "3644:7", Search: "3644:10", Play: "3644:13", Download: "3644:16" }
  skill: /shadcn-component-port (2026-06-10, Composite-Port nach Skill-Rework; baut auf InputGroup)
  notes: >
    Multi-Composite (cmdk). Deps: InputGroup ✓ (als echte Instanz in .Command/Input genestet), Button/Input/
    Textarea ✓ (transitiv via InputGroup, flache ui:add-Schatten gelöscht), Dialog ✓ (CommandDialog nachgerüstet
    2026-06-11, code-only — KEIN Figma-Artefakt, .Command-Composition bleibt ohne Dialog-Achse; Panel top-1/3 +
    p-0 + overflow-clip, inneres Command border-0/shadow-none, Item in-data-[slot=dialog-content]:corner-lg!;
    Children = Palette-Teile, Wrapper liefert das Command-Root wie new-york-v4 — novas bare-children-Quelle
    bricht den Doc-Usage-Contract; Story InDialog = Doc-Demo inkl. ⌘J/Ctrl+J-Listener — DOM-lib dafür
    in tsconfig.storybook.json nachgerüstet — plus Button+Kbd-Trigger als Klick-Affordance). DS-Abweichungen:
    Palette = overlay-Fläche (overlay.use nennt Command) + border + shadow-elevation (Overlay-Tiefe); Such-Feld =
    text-label (Sans 14; in Figma vom Mono-text-input-Command-Format angepasst → /component-sync 2026-06-10)
    auf opaker InputGroup (novas border-input/30 bg-input/30 gedroppt);
    Selektion = accent-Cyan-Tint (data-selected bg-accent + text-accent-foreground), NICHT Stock-Neutralgrau;
    Group-Heading = text-eyebrow + uppercase (Mono-Micro-Label, text-xs/font-medium tot); Shortcut = text-kbd
    (tracking-* tot). IconPlaceholder→lucide bei ui:add → @remixicon/react (RiSearchLine/RiCheckLine). Figma:
    3 Schichten (Item-Set, genestete InputGroup, Composition mit list/items-Slots) + reproduzierte Beispiel-
    Instanz (Done-Test). Slots LEER gebaut (Default-Slot-Content in Instanzen virtuell/nicht entfernbar). Gate
    grün (32 Tests inkl. Typo-Survival text-input/text-body). jsdom-Polyfill lag bereits in test-setup.ts.
    PALETTE-VARIANTE (2026-06-11): variant-Achse [default, palette] auf Input/Group/Composition, Quelle =
    C2-Explorations-Frame 3554:859 (Page "Shadcn Components"); Figma-Member per Clone aus dem Frame gebaut
    → Token-Bindings (space/corner/shadcn-default/overlay/inverse, Effect-Styles Glow+Elevation, Text-Styles
    Input/Eyebrow/Kbd) mitgereist. Item-Set UNVERÄNDERT (User-Entscheid „items sind gleich"); 16px-Flucht via
    Group px-md statt Item-Padding. Demo-Inhalt lebt im palette-Member (DS-Konvention: Examples = pure
    Instanzen, Instanz-Slot-Content nicht editierbar). .Command/Separator als Set mit variant=labeled
    (Labeled Rule aus dem C2-grp-Row, label-Prop) — bewusst NEBEN dem Group[palette]-Heading (Gruppen-Weg
    behält cmdk-Auto-Hide, labeled-Separator für flache Kompositionen). CODE (via /component-sync, Stories
    Palette/PaletteInDialog/PaletteFlat, 50 Tests grün): palette-Input = Prompt-Zeile bg-card/p-xl/gap-lg mit
    statischer Glow-Caret-Bar + text-input/caret-primary + Kbd-Esc; Prompt-Divider = border-b am Wrapper
    (Figma: Separator-Instanz — strukturelle Abweichung); Group-Heading-Inset px-md (16px-Flucht) — Figma
    war kurz auf 24px (px-xl-Default der genesteten labeled-Separator-Instanz), Instanz-Padding-Override
    auf space-md hat das aufgelöst, Figma = Code = C2-Raster; Deviations komplett in
    agent-runs/component-sync/2026-06-11-command/notes.md.

- name: Dialog
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-10 (Figma + Code zusammen gebaut)
  source: { registry: "@shadcn", item: dialog, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/dialog/
    exports: [Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/dialog'"
  figma:
    section: { name: "Dialog", id: "3589:788" }
    composition:
      name: ".Dialog"
      id: "3592:794"
      props: "title#3593:2 (text) · description#3593:3 (text) · showCloseButton#3593:4 · showFooter#3593:5 · showBody#3606:0 (bools)"
      slots: { body: "3609:890 (leer; Wrapper body-region visible↔showBody)", footer: "3593:795 (Default = .Dialog/Footer-Instanz 3593:796)" }
      nests: "ghost icon-sm .Button-Instanz 3593:806 als Close (ABSOLUTE top-right, Icon via swapComponent→.Dialog/Icon/Close)"
    footer: { name: ".Dialog/Footer", id: "3591:788", slot: "actions#3591:789 (Default: Cancel outline + Save default .Button-Instanzen)" }
    overlay: { name: ".Dialog/Overlay", id: "3590:791", fill: "scrim (3588:2, Alias→neutral/900) × Layer-Opacity scrim-opacity (3618:3, Alias→opacity/10) + BACKGROUND_BLUR 4" }
    icon: { name: ".Dialog/Icon/Close", id: "3590:790" }
    examples: { dialog-demo: "3595:807", scrollable-content: "3595:829", sticky-footer: "3598:840", no-close-button: "3603:858", dialog-on-overlay: "3604:888" }
  skill: /shadcn-component-port (2026-06-10, Composite-Port; nestet Button)
  notes: >
    Radix-Composite (radix-ui Dialog). Deps: Button ✓ (genestete ghost-Instanz als X-Close; flacher
    ui:add-Schatten gelöscht), radix-ui ✓. DS-Abweichungen: Panel = bg-overlay + border + shadow-elevation
    (novas ring-1 ring-foreground/10 ersetzt — Overlay-Tiefe wie Command); Scrim = NEUER Token `scrim`
    (neutral/900 @10%, bg-black/10 tot) + backdrop-blur-xs; Titel = text-title (18/600; nova 16/500 ohne
    DS-Stufe); Body/Description = text-body. Footer = getöntes nova-Band (bg-muted/50, border-t, Bleed
    -mx-xl/-mb-xl) als EIGENE Komponente, default-instanziiert im footer-Slot (User-Entscheidung).
    Scrim als eigene .Dialog/Overlay-Komponente, Panel-Komposition bleibt scrim-frei. Figma-Mechanik:
    SLOT nie direkt visibility-binden (degradiert zu FRAME) → Wrapper-Frame trägt showBody-Boolean.
    Geometrie numerisch (top-2/right-2, max-w-*). Gate grün (39 Tests inkl. Token-Survival).
    CommandDialog nutzt diesen Dialog seit 2026-06-11 (Command-Katalog-Eintrag).
```

## Pending / Removed

```yaml
# Command: re-portiert 2026-06-10 (siehe Components-Liste oben).
# CommandDialog: nachgerüstet 2026-06-11 (Funktion + Export + Story InDialog in command/, code-only — siehe Command-Eintrag).
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

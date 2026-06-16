# Agentport DS — Component-Referenz (maschinenlesbar)

Eine Datenquelle für Component-Arbeit: **wo liegt was** — in Figma (Set/Node-IDs) und im Code
(Ordner/Exporte/Barrel) — plus Status, Quelle und die wichtigsten DS-Abweichungen pro Component.
Prosa = Regeln/Architektur; **YAML = Component-Daten**. Schwester-Doc: `tokens-reference.md`
(Token-Crosswalk) — die hier referenzierten Utilities/Werte dort nachschlagen.

Quelle: `libs/ui/src/components/ui/*`, `libs/ui/src/index.ts`, `libs/ui/{components.json,package.json}`,
Figma „Agentport DS". Bei Drift: **Code + Figma sind führend**
(dieses Doc nachziehen, nicht umgekehrt). Figma-Lesen ist read-only (Pipeline-Regel).

## Regeln

- **Baseline = `radix-nova`** (`components.json` `style`). `ui:add` zieht dichtere Nova-Source; im Code
  in DS-Tokens re-clothen (per NAME, nicht Novas Rohskala). Nie `shadcn init` unter radix-nova. Details
  + globals-Plumbing (data-state Custom-Variants): siehe `handoff-component-port-open.md` §Nova-Baseline.
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
  Form-Toggle-Batch 2026-06-12 (Branch feat/form-toggles-port): Checkbox · Switch · RadioGroup
  parallel portiert (Code-Seite 3 Agents parallel, Figma seriell wg. einer Plugin-Verbindung; Gate
  grün 92 Specs). Alle drei = State-Achse (kein CVA, Sibling von Input); Switch zusätzlich size-Achse.
  Standard etabliert: Focus-/Invalid-Glow = literal-alpha DROP_SHADOW mit showShadowBehindNode:false
  (verbatim von .Input-Focus 3176:305) + permanente Usage-Examples-Group mit echten .Label-Instanzen.
  Davor 2026-06-12: Field-Familie (+ Label/FieldSet/FieldGroup), Separator.
  Dialog portiert (Composite-Verfahren, Figma+Code, Gate grün, Done-Test) inkl. Semantic-Token
  `scrim`; CommandDialog 2026-06-11 nachgerüstet (code-only, Branch feat/command-dialog-readd).
  Davor: Command (cmdk) + InputGroup-Re-Port nach dem überarbeiteten Composite-Verfahren,
  radix-nova-Angleichung der Altkomponenten, Textarea.
```

## Components

```yaml
- name: Badge
  status: nova-aligned
  figma_synced: false
  source: { registry: "@shadcn", item: badge, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/badge/
    exports: [Badge, badgeVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/badge'"
  figma:
    section: { name: "Badge", id: "3687:1016" }
    set: { name: ".Badge", id: "3697:1016" }
    members: { default: "3691:2", secondary: "3691:7", destructive: "3691:12", outline: "3693:2", ghost: "3693:7", link: "3693:12" }
    slots: { icon: "icon#3697:0" }                  # leading-icon SLOT; default 12px check vector, empty→text-only
    axis: { variant: [default, secondary, destructive, outline, ghost, link] }
  skill: /shadcn-component-port (2026-06-12)
  notes: >
    Single-element CVA span (asChild via Radix Slot, data-slot/data-variant, [&>svg]:size-3 icon).
    Landed radix-nova source = 6 variants (ghost/link are Nova extras over the doc's 4) — all kept in
    code AND the full Figma matrix. DS: rounded-4xl→corner-full (full pill); text-xs font-medium→
    text-format-label (no 12px sans format → picked by role, snaps to 14px); px-2→px-md, py-0.5→py-2xs,
    gap-1→gap-xs, icon-side pr-1.5/pl-1.5→pr-sm/pl-sm; h-5/size-3 numeric; focus border-ring + ring/50
    ring-[3px]; dark: dropped. ⚠ secondary + destructive = stock PLACEHOLDER tokens (raw hex,
    Figma var name suffix " ⚠") — bound but NOT finalized. destructive surface = bg-destructive/10
    (paint opacity 0.1 + resolved fallback). asChild + count-pill (font-mono tabular min-w-5) are
    code-level overrides, not Figma variants. /figma-verify CLEAN, gate green (8 specs).

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
    DS behalten: Radius per NAME (corner-lg/-md, ehem. rounded), Akzent-Cyan-Hover, solides destructive, text-format-label.
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
    axis: { state: [default, focus, filled, disabled, invalid, focus-invalid] }   # focus-invalid = focus+invalid kombiniert (Figma-Member 2026-06-12; Code via focus-visible:+aria-invalid: zusammen, kein Sync). kein CVA im Code
  skill: /shadcn-component-port
  notes: >
    h-8 / corner-lg / px-md / py-xs / file:h-6. bg-transparent → bg-input-background;
    text → text-format-label; placeholder:text-input-placeholder; focus border-ring + ring/50 ring-[3px];
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
    axis: { state: [default, focus, filled, disabled, invalid, focus-invalid] }   # kein CVA; Sibling von Input; focus-invalid wie Input (Figma-Member 2026-06-12; Code via focus-visible:+aria-invalid:)
  skill: /shadcn-component-port (2026-06-09, Port #1 der Command-Kette)
  notes: >
    Feld-Zwilling von Input, höher. min-h-16 / corner-lg / px-md / py-md; field-sizing-content (auto-grow).
    bg-transparent → bg-input-background; text → text-format-label; placeholder:text-input-placeholder;
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
    composition: { name: ".InputGroup", id: "3525:622", axes: "state [default,focus,disabled,invalid,focus-invalid] x layout [horizontal,vertical]", slot: content }   # +focus-invalid 2026-06-12 (Figma-Member; Code via has-[control:focus-visible]+has-[aria-invalid], kein Sync)
    examples: { Icons: "3527:613", Text: "3527:650", Buttons: "3546:697", States: "3528:662/681/700", Textarea: "3547:711", Kbd: "3531:676" }
  skill: /shadcn-component-port (2026-06-10, Re-port; GREEN-Test des überarbeiteten Composite-Verfahrens)
  notes: >
    6-teiliges Composite, RE-PORT nach Skill-Rework. Deps: Button ✓, Input ✓, Textarea ✓, Kbd ✓. Die GRUPPE
    besitzt Fläche+Border+Focus/Invalid/Disabled (has-[control:focus-visible]/has-[aria-invalid]/has-disabled);
    Controls randlos (border-0 bg-transparent, data-slot=input-group-control). DS: Gruppe trägt bg-input-background
    (opak); Addon text-format-label muted; Text text-format-body muted; Button ghost. Figma neu = 3-Schichten + reproduzierte
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
    (shadcn muted/muted-foreground). text-format-kbd (Geist Mono); gap-xs/px-xs; corner-sm; Tooltip-Kontext
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
    Multipart. Farben: link=muted-foreground, link-hover/page=foreground (Body→text-format-body).
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
      default: "nests .InputGroup-Instanz 3561:3 (opake DS-Fläche) + Such-Vektor + text-format-input Placeholder"
      palette: "Prompt-Zeile: bg-card + p-xl + gap-lg · Caret-Bar 2.5×18 (primary + Effect-Style Glow) · value/placeholder text-format-input (Mono 18) · echte .Kbd-Instanz (content=text, emphasis=high) 'Esc'"
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
    2026-06-11, code-only — KEIN Figma-Artefakt, .Command-Composition bleibt ohne Dialog-Achse; Panel mittig
    zentriert (top-1/2 -translate-y-1/2, seit 2026-06-11 — vorher top-1/3) + p-0 + overflow-clip, inneres
    Command border-0/shadow-none, Item in-data-[slot=dialog-content]:corner-lg!;
    Children = Palette-Teile, Wrapper liefert das Command-Root wie new-york-v4 — novas bare-children-Quelle
    bricht den Doc-Usage-Contract; Story InDialog = Doc-Demo inkl. ⌘J/Ctrl+J-Listener — DOM-lib dafür
    in tsconfig.storybook.json nachgerüstet — plus Button+Kbd-Trigger als Klick-Affordance). DS-Abweichungen:
    Palette = overlay-Fläche (overlay.use nennt Command) + border + shadow-elevation (Overlay-Tiefe); Such-Feld =
    text-format-label (Sans 14; in Figma vom Mono-text-input-Command-Format angepasst → /component-sync 2026-06-10)
    auf opaker InputGroup (novas border-input/30 bg-input/30 gedroppt);
    Selektion = accent-Cyan-Tint (data-selected bg-accent + text-accent-foreground), NICHT Stock-Neutralgrau;
    Group-Heading = text-format-eyebrow + uppercase (Mono-Micro-Label, text-xs/font-medium tot); Shortcut = text-format-kbd
    (tracking-* tot). IconPlaceholder→lucide bei ui:add → @remixicon/react (RiSearchLine/RiCheckLine). Figma:
    3 Schichten (Item-Set, genestete InputGroup, Composition mit list/items-Slots) + reproduzierte Beispiel-
    Instanz (Done-Test). Slots LEER gebaut (Default-Slot-Content in Instanzen virtuell/nicht entfernbar). Gate
    grün (32 Tests inkl. Typo-Survival text-format-input/text-format-body). jsdom-Polyfill lag bereits in test-setup.ts.
    PALETTE-VARIANTE (2026-06-11): variant-Achse [default, palette] auf Input/Group/Composition, Quelle =
    C2-Explorations-Frame 3554:859 (Page "Shadcn Components"); Figma-Member per Clone aus dem Frame gebaut
    → Token-Bindings (space/corner/shadcn-default/overlay/inverse, Effect-Styles Glow+Elevation, Text-Styles
    Input/Eyebrow/Kbd) mitgereist. Item-Set UNVERÄNDERT (User-Entscheid „items sind gleich"); 16px-Flucht via
    Group px-md statt Item-Padding. Demo-Inhalt lebt im palette-Member (DS-Konvention: Examples = pure
    Instanzen, Instanz-Slot-Content nicht editierbar). .Command/Separator als Set mit variant=labeled
    (Labeled Rule aus dem C2-grp-Row, label-Prop) — bewusst NEBEN dem Group[palette]-Heading (Gruppen-Weg
    behält cmdk-Auto-Hide, labeled-Separator für flache Kompositionen). CODE (via /component-sync, Stories
    Palette/PaletteInDialog/PaletteFlat, 50 Tests grün): palette-Input = Prompt-Zeile bg-card/p-xl/gap-lg mit
    statischer Glow-Caret-Bar + text-format-input + Kbd-Esc (caret-primary wieder entfernt — Standard-Caret,
    User-Refinement 2026-06-11, ebenso Liste max-h-96 statt max-h-72 + Such-Icon text-foreground statt
    opacity-50); Prompt-Divider = border-b am Wrapper
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
    (neutral/900 @10%, bg-black/10 tot) + backdrop-blur-xs; Titel = text-format-title (18/600; nova 16/500 ohne
    DS-Stufe); Body/Description = text-format-body. Footer = getöntes nova-Band (bg-muted/50, border-t, Bleed
    -mx-xl/-mb-xl) als EIGENE Komponente, default-instanziiert im footer-Slot (User-Entscheidung).
    Scrim als eigene .Dialog/Overlay-Komponente, Panel-Komposition bleibt scrim-frei. Figma-Mechanik:
    SLOT nie direkt visibility-binden (degradiert zu FRAME) → Wrapper-Frame trägt showBody-Boolean.
    Geometrie numerisch (top-2/right-2, max-w-*). Gate grün (39 Tests inkl. Token-Survival).
    CommandDialog nutzt diesen Dialog seit 2026-06-11 (Command-Katalog-Eintrag).

- name: Separator
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-12 (Figma + Code zusammen)
  source: { registry: "@shadcn", item: separator, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/separator/
    exports: [Separator]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/separator'"
  figma:
    section: { name: "Separator", id: "3675:1016" }
    set: { name: ".Separator", id: "3676:1018" }
    members: { "orientation=horizontal": "3676:1016", "orientation=vertical": "3676:1017" }
    axis: { orientation: [horizontal, vertical] }   # statisch/non-interaktiv → Content-Achse, KEIN CVA
  skill: /shadcn-component-port (2026-06-12)
  notes: >
    Statisches, non-interaktives Element (Radix Separator.Root, decorative=true → role=none;
    decorative=false → role=separator + aria-orientation). Keine State-Achse, kein variant×size —
    Content-Achse = orientation. Volle Matrix = 2 Member. Beide Member: 1px-Linie, SOLID-Fill an
    border gebunden (VariableID:3038:4 = shadcn Default/border) — `border` ist der Trenner-Token
    (use: "Standard-Kanten/Trenner"), NICHT border-emphasis/-strong. Klassenstring unverändert ggü.
    nova (bg-border + data-horizontal:h-px/w-full + data-vertical:w-px/self-stretch): bg-border nennt
    bereits den DS-Token, Rest ist reine Geometrie (h-px/w-px numerisch) + Layout. shrink-0 hält die
    Linie im Flex-Row. Kein jsdom-Polyfill nötig (Radix Separator trivial). Gate grün (4 Tests:
    default-horizontal, vertical, decorative/role, bg-border-Survival).

- name: Label
  status: nova-aligned
  figma_synced: true                            # eigenes .Label-Set gebaut 2026-06-12 (Figma-Revision)
  source: { registry: "@shadcn", item: label, style: radix-nova }   # co-portiert via `ui:add field`
  code:
    dir: libs/ui/src/components/ui/label/
    exports: [Label]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/label'"
  figma:
    section: { name: "Label", id: "3733:1022" }
    set: { name: ".Label", id: "3735:1024" }
    members: { "state=default": "3734:1022", "state=disabled": "3735:1022" }   # disabled = opacity 0.5
    props: "label (children)#3735:0 (TEXT, default '{Label}' — Text-Property-Konvention 2026-06-12: children-getrieben → (children)-Suffix + {…}-Default) · state (VARIANT [default, disabled])"
    axis: { state: [default, disabled] }
    nests_into: ".Field label-Slot (alle 4 Member: 3737:1022/1024/1026/1028) — bare TEXT-Default 2026-06-12 durch echte .Label-Instanz ersetzt"
  skill: /shadcn-component-port (2026-06-12, Co-Dep von Field) + Figma-Revision (2026-06-12)
  notes: >
    Radix Label (LabelPrimitive.Root), als HARTE Field-Dependency mitportiert (FieldLabel wrappt Label;
    delete/defer würde Field brechen). Single-Element, kein CVA im Code. DS: text-sm leading-none font-medium →
    text-format-label (14/500, Rolle Form-/Toggle-Labels, fill=foreground); gap-2→gap-md (itemSpacing bound).
    select-none + group/peer-disabled Opacity unverändert. Eigene Stories (Default/WithControl/Disabled) + Spec
    (3 Tests inkl. text-format-label-Survival). FIGMA-REVISION 2026-06-12: eigenes .Label-Set gebaut (HORIZONTAL
    auto-layout gap-md, Title→nein, Label-Style + foreground; text-Prop). Achse state=[default,disabled] —
    disabled = opacity 0.5 (das einzige reale Label-State; im Code group/peer-disabled-getrieben, kein CVA → in
    Figma als state-Achse modelliert, damit ein echtes Set statt Einzel-Component). Als label-Slot-Default in
    allen 4 .Field-Membern genestet (finding #26: lokale Component via getNodeByIdAsync+createInstance). figma-verify CLEAN.
    DESIGN-FORK: state-Achse ist eine Figma-Konvenienz (Code hat kein label-state-Prop) — beim Code-Sync NICHT
    als CVA zurückspielen. OFFENER PUNKT bleibt: falls dedizierter Label-Port geplant war, hier vorweggenommen.

- name: Field
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-12 (Composite, Variant A; Figma + Code)
  source: { registry: "@shadcn", item: field, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/field'"
    code_only_parts: [FieldTitle, "orientation=responsive"]   # FieldSet/FieldGroup/FieldLegend jetzt MIT Figma; responsive bleibt Container-Query-only (Wrap kein faithful Proxy)
  figma:
    section: { name: "Field", id: "3710:1016" }
    set: { name: ".Field", id: "3716:1020" }
    members:
      "orientation=vertical, invalid=false, controlPosition=trailing":   "3712:1016"
      "orientation=vertical, invalid=true, controlPosition=trailing":    "3713:1017"
      "orientation=horizontal, invalid=false, controlPosition=trailing": "3714:1018"
      "orientation=horizontal, invalid=true, controlPosition=trailing":  "3715:1019"
      "orientation=horizontal, invalid=false, controlPosition=leading":  "3897:1240"   # NEU 06-12 control-leading
      "orientation=horizontal, invalid=true, controlPosition=leading":   "3897:1249"   # NEU 06-12 control-leading
    slots: { label: "label#3716:0", control: "control#3716:1", description: "description#3716:2", error: "error#3716:3" }
    bool_props: { "Show description": "Show description#3692:15 (default true)", "Show error": "Show error#3692:20 (default true)" }   # NEU: Sichtbarkeit description-/error-Slot
    nests: ".Input (state=default 3176:303 / state=invalid 3176:311) als control-Slot-Default; label-Slot nestet jetzt echte .Label-Instanz (3737:1022/1024/1026/1028); FieldSeparator-Idiom = .Separator 3676:1018 (nicht nachgebaut)"
    horizontal_structure: "shadcn-canonical (field.tsx:79 + Responsive-Story): FieldContent-Spalte LINKS (label + description + [error], VERTICAL gap-2xs) · control-Slot als SIBLING rechts daneben · Field-Row flex-row items-start (counterAxis MIN) · FieldContent FILL/flex-1, control FIXED 160 · Member HUG-Höhe (damit die Bool-Toggles die Spalte reflowen). FieldContent-FRAMEs: 3714:1021 (horiz/false), 3715:1022 (horiz/true). error-Slot sitzt IN der FieldContent-Spalte UNTER description. Vertikale Member: label→control→description→[error] gestapelt (unverändert)."
    axis: { orientation: [vertical, horizontal], invalid: [false, true], controlPosition: [trailing, leading] }   # controlPosition nur für horizontal real; vertical = trailing-Default (Figma-only Fork, kein Code-Prop)
  skill: /shadcn-component-port (+ references/composites.md, 2026-06-12) + Figma-Revision (2026-06-12) + control-leading-Revision (2026-06-12)
  notes: >
    Multi-Part-Composite OHNE Root-Element (~10 reine Layout/Typo/Spacing/a11y-Parts, KEINE eigene
    Fläche/Border/Schatten). VARIANT A: Figma = nur die Field-ROW (orientation×invalid, 4 Slots, genestete
    .Input-Instanzen, kein Fill/Stroke/Shadow); Code = VOLLE Familie (10 Exporte, known-trap #19 — Code↔Figma-
    Kardinalitätslücke bewusst). Code-only (kein Figma-Set): FieldLegend (lebt als Slot in .FieldSet),
    FieldTitle + orientation=responsive (Container-Query @md → Figma kann das nicht; Wrap-Proxy verworfen, s.
    Revision-Note). Deps: Input ✓, Textarea ✓, Separator ✓, Button ✓; Label NEU co-portiert (harte Field-Dep).
    DS: gap-2→gap-md, gap-0.5→gap-2xs, gap-5(20, kein Rung)→gap-xl(16, dichter); Typo text-sm→text-format-label/
    -body, legend text-base(16, kein Rung)→text-format-title (Rolle Section-Caption); FieldError = ⚠
    destructive-PLATZHALTER (VariableID:3038:3, bound aber NICHT final). dark: entfernt.
    4 Slots mergen set-level (konsistente Namen). figma-verify CLEAN.
    FIGMA-REVISION 2026-06-12: (1a) FieldDescription-Fill war fälschlich solid-black/unbound → an
    muted-foreground (VariableID:3037:13) gebunden über alle 4 Member; FieldError bleibt destructive ⚠.
    (1b) Horizontale Member umgebaut auf die shadcn-canonical Struktur: FieldContent-Spalte (label +
    description + [error]) LINKS, control-Slot als SIBLING rechts daneben (vorher invers: label führend,
    FieldContent=control+desc+error). Quelle = Responsive-Story (field.stories.tsx:111–117) +
    horizontal-Variante (field.tsx:79 flex-row items-start has-[field-content]). Member auf HUG-Höhe gesetzt,
    damit die Bool-Toggles die Spalte reflowen (verifiziert 64→41→32px). error im horiz Member sitzt in der
    FieldContent-Spalte unter description. (3) label-Slot-Default = echte .Label-Instanz statt bare TEXT.
    (5) zwei Bool-Props Show description / Show error toggeln description-/error-Slot-Sichtbarkeit — über
    WRAPPER-FRAME gebunden (finding #8: visible NIE direkt am SLOT; finding #9: Wrapper kollabiert Resthöhe
    sauber). Controls-live (orientation/invalid + 2 Bools + 4 Slots; control nimmt Swap an; Label-Instanz
    tauscht Caption). Stories: InputField/TextareaField/Fieldset/Responsive (Doc-Beispiele, nur portierte Deps)
    + Invalid/Horizontal (DS-authored). Skip-Log: Select/Checkbox/Radio/Switch/Slider/Choice-Card-Beispiele
    (un-ported Deps). Gate grün (6 Field-Specs). Kein jsdom-Polyfill nötig.
    FIGMA-REVISION 2026-06-12 (control-leading): additive controlPosition-Achse [trailing, leading] —
    bestehende 4 Member = trailing (IDs erhalten, nur umbenannt), 2 neue horizontale leading-Member (3897:1240
    h/f, 3897:1249 h/t): control LINKS + FieldContent RECHTS, top-aligned (= Code [role=checkbox]:mt-px).
    Schließt die Lücke (Code komponiert control-leading für Checkbox/Radio via child-order, Figma modellierte
    nur control-trailing). DESIGN-FORK: controlPosition ist Figma-Konvenienz (Code hat KEIN solches Prop) —
    beim /component-sync NICHT als CVA zurückspielen. Nestings (.FieldSet/.FieldGroup/Checkbox-Examples)
    verifiziert intakt. FieldLabel = .Label-Reuse (kein Duplikat); Choice-Card = Folge-Komposition (braucht Card).
    FIX 2026-06-12 (invalid error-slot): auf den 2 HORIZONTALEN invalid-Membern (3715:1019 trailing, 3897:1249
    leading) saß der error-Slot fälschlich IN der control-Spalte → Control-Befüllen sprengte das Layout. Ursache:
    clone() degradiert einen SLOT still zu FRAME (drop slotContentId) — die horizontalen Member waren clone-
    derived. Echten error#3716:3-SLOT in die FieldContent-Spalte (unter description) restauriert, an Show error
    gebunden; verifiziert (Control-Fill → error unter Label, kein Clip; Nestings intakt; figma-verify CLEAN).
    Damit reusen Checkbox+Switch-Invalid-Examples den .Field-error-Slot; Radio-Invalid = Gruppen-Error
    (FieldSet-Ebene → separater destructive-Text, kein per-field-Slot).

- name: FieldLegend
  status: nova-aligned
  figma_synced: true                            # Figma-Set 2026-06-12 (control-leading-Revision; vorher code-only)
  source: { registry: "@shadcn", item: field, style: radix-nova }   # Teil der Field-Familie (field.tsx)
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [FieldLegend]
    barrel: "via field-Barrel"
  figma:
    section: { name: "Field Legend", id: "3904:1246" }
    set: { name: ".FieldLegend", id: "3909:1246" }
    members: { "variant=legend": "3908:1246", "variant=label": "3908:1248" }
    props: "legend (children)#3909:2 (TEXT, default '{Legend}'); variant (VARIANT [legend, label])"
    axis: { variant: [legend, label] }
  skill: Figma-Revision (2026-06-12)
  notes: >
    Text-Component (war .Field code_only_part, jetzt eigenes Set — aus code_only_parts entfernt). variant=legend
    → text-format-title (18/600, Section-Caption-Rolle); variant=label → text-format-label (14/500); fill
    foreground (VariableID:3037:3). variant MAPPT aufs Code-Prop FieldLegend.variant (KEIN Fork — anders als
    Field.controlPosition). Text-Property-Konvention: legend (children)/{Legend}. figma-verify CLEAN.

- name: FieldSet
  status: nova-aligned
  figma_synced: true                            # Figma-Set 2026-06-12 gebaut (Revision; vorher code-only)
  source: { registry: "@shadcn", item: field, style: radix-nova }   # Teil der Field-Familie (field.tsx)
  code:
    dir: libs/ui/src/components/ui/field/        # Export aus field/, kein eigener Ordner
    exports: [FieldSet]
    barrel: "via field-Barrel"
  figma:
    section: { name: "Field Set & Group", id: "3738:1026" }
    component: { name: ".FieldSet", id: "3739:1026" }   # Einzel-Component (keine Variant-Achse)
    slots: { legend: "legend#3741:0 (Title-Text-Default 'Address', finding #25)" }
    nests: "2× echte .Field-Instanz (vert/false 3712:1016): 3741:1028 + 3741:1038 (FILL-Breite)"
  skill: Figma-Revision (2026-06-12)
  notes: >
    Surface-less Composite (finding #24): VERTICAL auto-layout gap-xl (space-xl/16, bound), w-FIXED/h-HUG,
    KEIN Fill/Stroke. legend = SLOT mit Title-Text-Default (text-format-title 18/600 by role, finding #28).
    Nestet echte .Field-Instanzen (finding #26). Code-Pendant = `<fieldset>` flex-col gap-xl + FieldLegend.
    figma-verify CLEAN, instanziierbar (h≈229). Build: redundante TEXT-Legend-Prop entfernt → nur legend-SLOT.

- name: FieldGroup
  status: nova-aligned
  figma_synced: true                            # Figma-Component 2026-06-12 gebaut (Revision; vorher code-only)
  source: { registry: "@shadcn", item: field, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [FieldGroup]
    barrel: "via field-Barrel"
  figma:
    section: { name: "Field Set & Group", id: "3738:1026" }
    component: { name: ".FieldGroup", id: "3742:1044" }
    nests: "Field 3742:1045 → .Separator 3742:1055 (horizontal, FieldSeparator-Idiom = reuse, task 4) → Field 3742:1056; alle FILL-Breite"
  skill: Figma-Revision (2026-06-12)
  notes: >
    Surface-less Container (finding #24): VERTICAL auto-layout gap-xl (space-xl/16, bound), w-full, KEIN
    Fill/Stroke. Gruppiert mehrere Fields mit Divider — FieldSeparator = genestete echte .Separator-Instanz
    (kein eigenes Set, task 4). Nestet echte .Field-Instanzen (finding #26). Code-Pendant = `<div>` @container/
    field-group flex-col gap-xl. figma-verify CLEAN, instanziierbar (h≈207).

- name: Checkbox
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-12 (Figma + Code; Focus-/Examples-Fix nachgezogen)
  source: { registry: "@shadcn", item: checkbox, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/checkbox/
    exports: [Checkbox]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/checkbox'"
  figma:
    section: { name: "Checkbox", id: "3791:1184" }
    set: { name: ".Checkbox", id: "3795:1184" }   # 2026-06-15 umgebaut → 2 Achsen (checked × state), 10 Member, 5×2 WRAP-Grid
    members:   # Reihe checked=off, dann checked=on
      "checked=off, state=default":       "3792:1184"
      "checked=off, state=focus":         "3794:1184"
      "checked=off, state=disabled":      "3794:1185"
      "checked=off, state=invalid":       "3794:1186"   # Glow gestrippt (border-only)
      "checked=off, state=focus-invalid": "4063:2"       # NEU (Border + destructive@20% Glow)
      "checked=on, state=default":        "3792:1185"
      "checked=on, state=focus":          "4063:6"       # NEU (primary-Border + ring@50% Halo)
      "checked=on, state=disabled":       "4063:9"       # NEU (opacity 0.5)
      "checked=on, state=invalid":        "3794:1187"    # war checked-invalid; Glow gestrippt
      "checked=on, state=focus-invalid":  "4063:3"       # NEU (destructive Fill+Border + Glow)
    indicator: { glyph: "RiCheckLine VECTOR, fill primary-foreground; sichtbar auf allen checked=on Membern" }
    axis: { checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }   # 2026-06-15: checked eigene Achse (war State-Achse mit checked/checked-invalid Sammelwerten)
    examples: { group: "Usage Examples 3822:2 (REBUILT 06-12 = Field-composed, control-leading)", Basic: "3923:13", Description: "3926:38", ChoiceCard: "4044:1515 (Card + .Field control-TRAILING per family, checked .Checkbox; 2026-06-13)", Group: "3934:55 (.FieldLegend label)", Disabled: "3927:46", Invalid: "4036:2 (.Field error-slot)", AllStates: "3826:2" }   # alle via echte .Field-Instanzen
    vars: { input: "3038:5", input-background: "3108:2", primary: "3037:8", primary-foreground: "3037:9", ring: "3038:6", destructive⚠: "3038:3", corner-sm: "3073:2" }
  skill: /shadcn-component-port (2026-06-12) + Figma-Fix (Focus + Usage-Examples) + /component-sync (2026-06-12)
  notes: >
    Single-Element + Indicator (radix-ui Checkbox.Root/Indicator), kein CVA → State-Achse wie Input.
    box 16×16 numerisch, corner-sm (4px). DS: border-input; checked = primary Fill+Border + primary-foreground
    Glyph; Glyph = RiCheckLine VEKTOR (lucide CheckIcon → @remixicon/react, [&>svg]:size-3.5 numerisch).
    focus = border-ring + ring@50% 3px DROP_SHADOW (literal-alpha, showShadowBehindNode:false — gebundene
    Effekt-Farbe clobbert die /opacity, daher Effekt-Objekt VERBATIM von .Input-Focus 3176:305 kopiert);
    invalid + checked-invalid = destructive ⚠ PLATZHALTER (raw hex, NICHT final) Border + destructive@20%
    Glow (sbn:false über alle 3 Glow-Member). dark: entfernt; group-has-disabled/field:opacity-50 behalten.
    Usage-Examples-Group = permanente echte .Checkbox- + .Label-Instanzen (WithLabel/WithDescription/Disabled/
    AllStates). figma-verify CLEAN, Gate grün (6 Specs inkl. corner-sm-Survival).
    SYNC 2026-06-12 (/component-sync): unchecked/focus/disabled/invalid-Box = bg-input-background
    (vorher transparent); checked-invalid = solides destructive Fill+Border
    (aria-invalid:aria-checked:bg/border-destructive, überschreibt data-checked:primary), Glyph
    bleibt primary-foreground (reitet auf der roten Fläche).
    CHOICE-CARD 2026-06-13 (Code→Figma-Push, Branch feat/checkbox-choice-card): DS-authored Story
    (radix-Checkbox-Docs haben KEINE Choice-Card; Parität zu Switch/Radio) — FieldLabel wrappt ein
    horizontales control-TRAILING Field (FieldContent: FieldTitle + FieldDescription, checked Checkbox
    rechts), Tint (has-data-checked:bg-primary/5 border-primary/30) ist Code-only Interaktions-State.
    Figma-Example 4044:1515 aus der Switch-ChoiceCard 3979:2 geklont (Card + .Field trailing geerbt),
    .Switch→.Checkbox checked via swapComponent (16×16, kein Stretch), 2 Texte gesetzt; zwischen
    Description und Group eingehängt. Card un-getinted = bewusst (Familien-Konsistenz; Switch/Radio-
    Cards ebenso). figma-verify CLEAN, Gate grün (92 Specs).
    FOCUS-GATED RING 2026-06-15 (Branch feat/checkbox-choice-card): aria-invalid:ring-[3px] ENTFERNT → der
    destructive-Ring (ring/20) ist focus-gated (Breite nur aus focus-visible:ring-[3px]) — invalid-resting = nur
    destructive-Border, invalid+focus = + roter Ring. Konsistent mit .Input; weicht von default-shadcn-checkbox
    ab (ring-3).
    FIGMA-RE-SYNC 2026-06-15 (Divergenz GESCHLOSSEN): Set auf 2 Achsen umgebaut (checked × state). Resting invalid
    (checked=off/on, state=invalid) = Glow gestrippt (effects:[], border-only wie .Input); NEU focus-invalid je checked
    = destructive Border + destructive@20% Glow (sbn:false, verbatim vom .Input-Recipe). Matrix-Vollständigkeit:
    checked=on × {focus, disabled} ergänzt — checked=on,focus = primary-Border + ring@50% Halo (bei focus+checked
    bewusst primary-Border behalten; FLAG, falls kompilierter Code dort ring-Border zeigt). Instanzen folgen per
    Node-Identität (kein Remap, verifiziert). Galerie 3826:2 zeigt weiter die kuratierten 6 (neue 4 optional). Stories: Default + ChoiceCard jetzt
    controllbar (5 State-Controls checked/disabled/invalid/hover/focus; hover/focus via
    storybook-addon-pseudo-states, arg-getrieben über pseudo-*-all-Wrapper) + ChoiceCardStates-Galerie.
    Gate grün. Selbe Behandlung 2026-06-15 auf Switch + Radio gespiegelt.

- name: Switch
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-12 (Figma + Code)
  source: { registry: "@shadcn", item: switch, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/switch/
    exports: [Switch]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/switch'"
  figma:
    section: { name: "Switch", id: "3835:1193" }
    set: { name: ".Switch", id: "3839:2" }                 # 2026-06-15 umgebaut → 3 Achsen (size × checked × state), 20 Member, 5×4 WRAP-Grid
    members:   # je size: Reihe checked=off, dann checked=on
      "size=default, checked=off, state=default":       "3837:2"
      "size=default, checked=off, state=focus":         "3837:6"
      "size=default, checked=off, state=disabled":      "3837:8"
      "size=default, checked=off, state=invalid":       "3837:10"   # Glow gestrippt (border-only, Track destructive)
      "size=default, checked=off, state=focus-invalid": "4069:2"     # NEU
      "size=default, checked=on, state=default":        "3837:4"
      "size=default, checked=on, state=focus":          "4069:4"     # NEU (primary Track + ring@50% Halo)
      "size=default, checked=on, state=disabled":       "4069:6"     # NEU (opacity 0.5)
      "size=default, checked=on, state=invalid":        "4069:8"     # NEU synthetisiert (destructive Track, Thumb rechts)
      "size=default, checked=on, state=focus-invalid":  "4069:10"    # NEU
      "size=sm, checked=off, state=default":            "3838:2"
      "size=sm, checked=off, state=focus":              "3838:6"
      "size=sm, checked=off, state=disabled":           "3838:8"
      "size=sm, checked=off, state=invalid":            "3838:10"    # Glow gestrippt
      "size=sm, checked=off, state=focus-invalid":      "4070:2"     # NEU
      "size=sm, checked=on, state=default":             "3838:4"
      "size=sm, checked=on, state=focus":               "4070:4"     # NEU
      "size=sm, checked=on, state=disabled":            "4070:6"     # NEU
      "size=sm, checked=on, state=invalid":             "4070:8"     # NEU synthetisiert
      "size=sm, checked=on, state=focus-invalid":       "4070:10"    # NEU
    axis: { size: [default, sm], checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }   # 2026-06-15: checked aus state herausgezogen (war unchecked/checked Sammelwerte)
    examples: { group: "Usage Examples 3840:2 (REBUILT 06-12 = Field-composed, control-trailing)", AirplaneMode: "3948:2", Description: "3952:2", ChoiceCard: "3979:2 (Card + .Field)", Sizes: "3959:2", Disabled: "3961:2", Invalid: "3966:2 (.Field error-slot)", AllStates: "3842:15" }   # alle via echte .Field-Instanzen
    vars: { primary: "3037:8", input: "3038:5", background: "3037:2", ring: "3038:6", destructive⚠: "3038:3", corner-full: "3073:6" }
  skill: /shadcn-component-port (2026-06-12) + /component-sync (2026-06-12)
  notes: >
    Track (Root) + Thumb (radix-ui Switch). 2 Achsen: size [default,sm] (manuelle Prop, kein CVA) × state.
    Geometrie numerisch: Track default 32×18.4 / sm 24×14, Thumb 16/12, corner-full, Thumb-Offset =
    trackW−thumbW−2px (default x≈14, sm x≈10). DS: checked Track = primary, unchecked Track = input (als
    FILL — muted #f4f6f8 wäre auf Weiß unsichtbar, input neutral/450 hält ≥3:1; Rolle≠Name, s. skill-feedback);
    Thumb = background (weiß). focus = border-ring + ring@50% 3px Glow (VERBATIM von .Input 3176:305,
    showShadowBehindNode:false); invalid = destructive ⚠ + destructive@20% (sbn:false). dark: entfernt.
    Usage-Examples-Group = echte .Switch- + .Label-Instanzen (WithLabel/Disabled/Sizes/AllStates).
    figma-verify CLEAN (Thumb clippt Track am Offset nicht), Gate grün (6 Specs).
    SYNC 2026-06-12 (/component-sync): invalid = destructive TRACK FILL in BEIDEN Positionen
    (aria-invalid:data-checked:bg-destructive + aria-invalid:data-unchecked:bg-destructive — 2-Attr-Selektoren
    überschreiben primary/input) — der Figma-Invalid-Member bindet die ganze Track-Fläche an destructive.
    Korrigiert eine Sync-Agent-Deviation (vorher nur Border+Ring, checked-invalid blieb cyan → User-Report).
    FOCUS-GATED RING 2026-06-15 (Branch feat/checkbox-choice-card): aria-invalid:ring-[3px] ENTFERNT → der
    destructive-Ring (ring/20) ist jetzt focus-gated (Breite nur aus focus-visible:ring-[3px]) — invalid-resting
    = destructive Track+Border ohne Ring, invalid+focus = + roter Ring. Konsistent mit .Input; weicht von
    default-shadcn-switch ab (ring-3).
    FIGMA-RE-SYNC 2026-06-15 (Divergenz GESCHLOSSEN): Set auf 3 Achsen umgebaut (size × checked × state). Resting
    invalid = Glow gestrippt (border-only); NEU focus-invalid je size×checked = + destructive@20% Glow. checked=on
    hatte KEINEN invalid-Member → synthetisiert: Checked-Member (Thumb rechts, primary Track) geklont, Track-Fill +
    Border auf destructive (Paints von off-invalid kopiert), kein/mit Glow. Außerdem checked=on × {focus, disabled}
    ergänzt. Instanzen (unchecked/checked) folgen per Node-Identität → checked=off/on, state=default (verifiziert).
    Galerie 3842:15 zeigt weiter die kuratierten States. Stories: Default + ChoiceCard jetzt controllbar (5 State-Controls
    checked/disabled/invalid/hover/focus; hover/focus via storybook-addon-pseudo-states) + ChoiceCardStates-Galerie. Gate grün.

- name: RadioGroup
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-12 (Figma + Code) — "RadioItem" = RadioGroupItem
  source: { registry: "@shadcn", item: radio-group, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/radio-group/
    exports: [RadioGroup, RadioGroupItem]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/radio-group'"
  figma:
    section: { name: "RadioGroup", id: "3849:1206" }
    set: { name: ".RadioGroupItem", id: "3852:1206" }       # nur das Item ist das Set; 2026-06-15 umgebaut → 2 Achsen (checked × state), 10 Member, 5×2 WRAP
    members:   # Reihe checked=off, dann checked=on
      "checked=off, state=default":       "3850:1206"
      "checked=off, state=focus":         "3850:1210"
      "checked=off, state=disabled":      "3851:1206"
      "checked=off, state=invalid":       "3851:1207"   # Glow gestrippt (border-only)
      "checked=off, state=focus-invalid": "4066:2"       # NEU
      "checked=on, state=default":        "3850:1207"
      "checked=on, state=focus":          "4066:6"       # NEU (primary-Border + ring@50% Halo)
      "checked=on, state=disabled":       "4066:9"       # NEU (opacity 0.5)
      "checked=on, state=invalid":        "3851:1208"    # war checked-invalid; Glow gestrippt
      "checked=on, state=focus-invalid":  "4066:3"       # NEU (destructive Fill+Border + Dot destructive-fg + Glow)
    dot: { shape: "ELLIPSE 8px (size-2), fill primary-foreground; sichtbar auf allen checked=on Membern (checked-invalid: destructive-foreground)" }
    group_container: "Layout-only (grid w-full gap-md) → KEIN Variant-Set; in den Examples als VERTICAL auto-layout itemSpacing=space-md repräsentiert"
    axis: { checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }   # 2026-06-15: checked eigene Achse (war State-Achse mit checked/checked-invalid Sammelwerten)
    examples: { group: "Usage Examples 3854:1206 (REBUILT 06-12 = Field-composed)", Default: "3992:1324 (bare, per Doc)", Description: "3996:1340 (.Field leading)", ChoiceCard: "3997:1358 (Card + .Field trailing)", Fieldset: "3998:1378 (.FieldLegend)", Disabled: "3999:1383 (bare)", Invalid: "4000:1385 (.Field rows + Gruppen-Error)", AllStates: "3857:1218" }
    vars: { input: "3038:5", input-background: "3108:2", primary: "3037:8", primary-foreground: "3037:9", destructive-foreground⚠: "bound (checked-invalid Dot)", ring: "3038:6", destructive⚠: "3038:3", corner-full: "3073:6", space-md: "3070:6", muted-foreground: "3037:13" }
  skill: /shadcn-component-port (2026-06-12) + /component-sync (2026-06-12)
  notes: >
    Zwei Teile: RadioGroup (Layout-Container, grid w-full gap-2→gap-md) + RadioGroupItem (interaktiv, State-Achse
    wie Checkbox, aber corner-full Kreis + Innen-Dot statt Glyph). Item 16×16 Kreis numerisch; Dot = ELLIPSE 8px
    (size-2), bg-primary-foreground. DS: border-input; checked = primary Border+Fill + primary-foreground Dot;
    focus = border-ring + ring@50% 3px Glow (VERBATIM von .Input 3176:305, showShadowBehindNode:false — kritisch,
    Item ist fill-less); invalid + checked-invalid = destructive ⚠ PLATZHALTER + destructive@20% (sbn:false).
    dark: entfernt. Gruppe = Layout-only (kein Set), als VERTICAL AL repräsentiert. Usage-Examples-Group =
    echte .RadioGroupItem- + .Label-Instanzen (Default/Disabled/WithDescription/AllStates). figma-verify CLEAN
    (Dot = Vektor), Gate grün (6 Specs).
    SYNC 2026-06-12 (/component-sync): unchecked-Kreis = bg-input-background (vorher transparent); checked-invalid
    voll destructive-getönt — Border+Fill (aria-invalid:aria-checked:bg/border-destructive) + Dot
    bg-destructive-foreground (group-aria-invalid/radio-group-item:), kehrt den vorherigen primary-Border-Override um.
    FOCUS-GATED RING 2026-06-15 (Branch feat/checkbox-choice-card): aria-invalid:ring-[3px] ENTFERNT → der
    destructive-Ring (ring/20) ist focus-gated (Breite nur aus focus-visible:ring-[3px]) — invalid-resting = nur
    destructive-Border, invalid+focus = + roter Ring. Konsistent mit .Input; weicht von default-shadcn ab (ring-3).
    FIGMA-RE-SYNC 2026-06-15 (Divergenz GESCHLOSSEN): Set auf 2 Achsen umgebaut (checked × state). Resting invalid
    (checked=off/on) = Glow gestrippt (border-only); NEU focus-invalid je checked = + destructive@20% Glow. checked=on
    × {focus, disabled} ergänzt (Matrix-Vollständigkeit). checked=on,focus = primary-Border + ring@50% Halo (FLAG s. Checkbox).
    Instanzen folgen per Node-Identität (kein Remap). Galerie 3857:1218 zeigt weiter die kuratierten 6. Stories: ChoiceCard jetzt controllbare Single-Card
    (5 State-Controls; hover/focus via storybook-addon-pseudo-states) + ChoiceCardStates-Galerie; die alte
    Zwei-Card-Doc-Demo lebt weiter als ChoiceCardGroup. Default bleibt Doc-Gruppe (kein bare-single-Item). Gate grün.

- name: ChoiceCard
  status: nova-aligned
  figma_synced: true                            # Figma-Sets 2026-06-16 gebaut (Background-Agent, Port-Skill-Regeln); checked-Tint Figma→Code-synced
  source: { registry: "DS-authored", item: choice-card, style: radix-nova }   # KEIN Stock-shadcn-Item; komponiert Field + Checkbox/Switch/RadioGroupItem + Label
  code:
    dir: libs/ui/src/components/ui/choice-card/
    exports: [ChoiceCardCheckbox, ChoiceCardSwitch, ChoiceCardRadio]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/choice-card'"
    internal: "ChoiceCardShell (presentational, NICHT exportiert) + useFieldId (Hook). Verschachtelte Subfolder je Wrapper + choice-card-shell/ + use-field-id.ts; je eigener index.ts-Barrel"
  figma:
    section: { name: "Choice Card", id: "4107:1526" }   # Page "Shadcn Components" 3126:2
    checkbox:
      set: { name: ".ChoiceCard/Checkbox", id: "4112:1638" }
      members:
        "checked=off": { default: "4110:1535", focus: "4110:1556", disabled: "4110:1577", invalid: "4110:1598", focus-invalid: "4110:1624" }
        "checked=on":  { default: "4111:1577", focus: "4111:1602", disabled: "4111:1627", invalid: "4111:1652", focus-invalid: "4111:1682" }
      usage_example: "4128:1862 (selected single card)"
    switch:
      set: { name: ".ChoiceCard/Switch", id: "4119:1750" }   # control size=default, KEINE size-Achse
      members:
        "checked=off": { default: "4117:1638", focus: "4117:1661", disabled: "4117:1684", invalid: "4117:1707", focus-invalid: "4117:1735" }
        "checked=on":  { default: "4118:1694", focus: "4118:1717", disabled: "4118:1740", invalid: "4118:1763", focus-invalid: "4118:1791" }
      usage_example: "4128:1877 (selected single card)"
    radio:
      set: { name: ".ChoiceCard/Radio", id: "4124:1862" }
      members:
        "checked=off": { default: "4122:1750", focus: "4122:1771", disabled: "4122:1792", invalid: "4122:1813", focus-invalid: "4122:1839" }
        "checked=on":  { default: "4123:1801", focus: "4123:1826", disabled: "4123:1851", invalid: "4123:1876", focus-invalid: "4123:1906" }
      usage_example: "4129:1886 (single-selection group: Standard/Express/Overnight)"
    axis: { checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }   # kein hover; Set-Props = checked + state
    nests: "echte .Field-Instanz im FieldLabel-Card (horizontal control-trailing: 3714:1018 invalid=false / 3715:1019 invalid=true); control-Slot = echte Instanz des passenden Control-Members (.Checkbox 3795:1184 / .Switch 3839:2 / .RadioGroupItem 3852:1206 je checked×state); Titel = genestete .Label. Controls WIEDERVERWENDET, nichts detacht."
    tint: "checked-Tint = Zwei-Cyan-Token-Modell, voll variabel-gebunden: Card-Fill accent (3037:14, cyan/50) · Stroke primary (3037:8, cyan/500) · Titel accent-foreground (3038:2, cyan/700). Ersetzt das frühere primary/5+/30 (gebundene Alpha-Paints überleben Instanziierung nicht → re-resolven zu opacity 1). Ersetzt auch die alten statischen ChoiceCard-Examples (4044:1515/3979:2/3997:1358) als kanonische Quelle."
  skill: Background-Figma-Agent (2026-06-16) + Figma→Code-Sync des checked-Tints (2026-06-16)
  notes: >
    DS-authored Composite (kein Stock-shadcn-Item): die klickbare Choice-Card (Titel + Beschreibung +
    Form-Control). Code = 3 dünne Wrapper über eine geteilte interne ChoiceCardShell (FieldLabel > Field);
    stateless pass-through (checked/defaultChecked/onCheckedChange bzw. Radios value durchgereicht →
    controlled/uncontrolled entscheidet der Consumer, kein eigener State/„double source of truth").
    title/description/error = ReactNode-Props (kein Compound/Slot-Pattern; Escape = rohe Field-Primitives);
    invalid = !!error (EINE Regel für data-invalid + FieldError-Render + aria-invalid; leerer String = valide).
    Typ-Falle: ComponentProps<Control> bringt HTML-`title` mit → Omit<…,'title'>, sonst verengt es ReactNode→string.
    a11y-BEFUND + FIX: das `.Field` rendert role="group", und ein <label for> kann seinen Namen NICHT durch ein
    role="group" hindurch an den Button vergeben → axe button-name VIOLATION (dom-accessibility-api war großzügig
    → Story-Test falsch-grün). Fix: jeder Wrapper setzt aria-labelledby auf die FieldTitle-id (`${id}-title`,
    geteilt via useFieldId-Hook); per axe gegen die echte Komponente verifiziert. Radio: value REQUIRED, lebt in
    <RadioGroup> (Auswahl + onValueChange auf der Gruppe).
    CHECKED-TINT 2026-06-16 (Figma→Code): User-Entscheid Zwei-Cyan-Modell (accent/primary/accent-foreground,
    voll token-gebunden — löst das Alpha-in-Instanzen-Problem des primary/5-Ansatzes). Code nachgezogen in
    field.tsx (geteilt, betrifft die ganze FieldLabel-Choice-Card-Familie): FieldLabel
    has-data-checked:bg-accent + has-data-checked:border-primary; FieldTitle
    group-has-data-checked/field-label:text-accent-foreground (scoped auf die Card-Gruppe → plain Field-Rows
    unberührt). Per `npm run shoot` visuell bestätigt (Cyan-Tint + Cyan-Titel; invalid = Card-Tint bleibt,
    Signal über roten Control + roten FieldError). Stories je Wrapper: Default (Playground + State-Preview +
    play-Smoke-Test) + ChoiceCardStates-Galerie; Radio zusätzlich Group (Exklusivitäts-play). Gate grün
    (210 Tests: 124 jsdom-Specs + 84 Story-Tests). Branch feat/choice-card.

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

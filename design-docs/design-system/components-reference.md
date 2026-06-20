# Agentport DS — Component-Referenz (maschinenlesbar)

Eine Datenquelle für Component-Arbeit: **wo liegt was** — in Figma (Set/Node-IDs) und im Code
(Ordner/Exporte/Barrel) — plus Status, Quelle und die wichtigsten DS-Abweichungen pro Component.
Prosa = Regeln/Architektur; **YAML = Component-Daten**. Schwester-Doc: `tokens-reference.md`
(Token-Crosswalk) — die hier referenzierten Utilities/Werte dort nachschlagen.

Quelle: `libs/ui/src/components/ui/*`, `libs/ui/src/index.ts`, `libs/ui/{components.json,package.json}`,
Figma „Agentport DS". Bei Drift: **Code + Figma sind führend**
(dieses Doc nachziehen, nicht umgekehrt). Figma-Lesen ist read-only (Pipeline-Regel).

> **Colour-Rework 2026-06-17 (`-fill`/`-ink`/`-border`-Token-System):** alle Components unten via
> `/component-sync` (Figma → Code) auf die neuen DS-Color-Utilities umgekleidet. Live-Figma-Set-Namen
> aktualisiert (Top-Level-Sets ohne führenden `.`; Composites flachgezogen, z. B. `.Command/Item`→`CommandItem`,
> `.Dialog/Footer`→`DialogFooter`, `.ChoiceCard/Checkbox`→`ChoiceCardCheckbox`; `.Button/Base` behält den Punkt).
> Per-Component Color-Deltas + Deviations: `agent-runs/component-sync/2026-06-17-<component>/notes.md`.
> Offene Figma-Schuld (mehrere Components): die Focus/Invalid-DROP_SHADOW-Effektfarben binden rohes Hex
> (unbound) statt der `ring`/`destructive`-Variablen — der Code nutzt die rollen-korrekten Tokens.

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
  figma_synced: true                            # colour sync 2026-06-17 (/component-sync) → -fill/-ink
  source: { registry: "@shadcn", item: badge, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/badge/
    exports: [Badge, badgeVariants]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/badge'"
  figma:
    section: { name: "Badge", id: "3687:1016" }
    set: { name: "Badge", id: "3697:1016" }         # Live-Name ohne führenden Punkt
    members: { default: "3691:2", secondary: "3691:7", destructive: "3691:12", outline: "3693:2", ghost: "3693:7", link: "3693:12" }
    slots: { icon: "icon#3697:0" }                  # leading-icon SLOT; default 12px check vector, empty→text-only
    axis: { variant: [default, secondary, destructive, outline, ghost, link] }
  skill: /shadcn-component-port (2026-06-12); /component-sync (2026-06-17)
  notes: >
    Single-element CVA span (asChild via Radix Slot, data-slot/data-variant, [&>svg]:size-3 icon).
    radix-nova source = 6 variants (ghost/link are Nova extras over the doc's 4) — all kept in code
    AND the full Figma matrix. Geometry: rounded-4xl→corner-full (full pill); text-format-label
    (no 12px sans → role-picked, 14px); px-2→px-md, py-0.5→py-2xs, gap-1→gap-xs; h-5/size-3 numeric;
    focus border-ring + ring/50 ring-[3px]; dark: dropped. Colour clothing (Figma Badge bindings,
    2026-06-17 -fill/-ink): default bg-primary-fill + text-primary-ink · secondary bg-secondary +
    text-secondary-ink · destructive NOW SOLID bg-destructive + text-destructive-ink (was /10 tint,
    hover→/80) · outline border + text-ink · ghost text-ink + muted-fill/-ink hover · link text-primary.
    Prior secondary/destructive ⚠ placeholder RESOLVED — both bind real DS semantics. asChild +
    count-pill (font-mono tabular min-w-5) are code-level overrides, not Figma variants.

- name: Button
  status: nova-aligned
  figma_synced: true   # 2026-06-17 colour sync (Step 3, /component-sync) → -fill/-ink token rework
  source: { registry: "@shadcn", item: button, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/button/
    exports: [Button, buttonVariants, ButtonProps]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/button'"
  figma:
    section: { name: "Button", id: "3126:3" }
    set: { name: "Button", id: "3164:312" }       # 220er-Matrix variant × size × state (Live-Name ohne führenden Punkt)
    base: { name: ".Button/Base", id: "3159:12" } # ausgekoppeltes Basis-Set (Fläche/Radius/Padding + state-layer RECTANGLE)
    axis: { variant: [default, destructive, outline, secondary, ghost, link],
            size: [default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg],
            state: [default, hover, active, focus, disabled] }
  skill: /shadcn-component-port   # colour re-clothed via /component-sync
  notes: >
    Nova-Size-Ladder (h-8 default + xs und icon-xs/sm/lg, per-Size-Icon-Sizing, aria-expanded).
    Colour-Clothing (Figma .Button-Bindings, 2026-06-17): default = bg-primary-fill + text-primary-ink ·
    secondary = bg-secondary + text-secondary-ink · destructive = bg-destructive + text-destructive-ink ·
    outline = bg-surface + border + hover bg-accent-fill/text-accent-ink · ghost = hover accent-fill/-ink ·
    link = text-primary. Radius per NAME (corner-lg/-md), text-format-label. Figma treibt hover/active
    über ein state-layer-Overlay → Code nutzt das /opacity-Idiom. Focus-Ring = ring-ring/50 (Figma-Effekt
    ist rohes #4a5562@50%, unbound → sollte an ring gebunden werden). Icon-only (size=icon*) verlangt
    aria-label/-labelledby auf Typ-Ebene. dark: entfernt.

- name: Input
  status: nova-aligned
  figma_synced: true                            # colour sync 2026-06-17 (/component-sync) → input-fill/-border/-ink-placeholder
  source: { registry: "@shadcn", item: input, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/input/
    exports: [Input]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/input'"
  figma:
    section: { name: "Input", id: "3176:302" }
    set: { name: "Input", id: "3177:302" }
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
    set: { name: "Textarea", id: "3488:684" }
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
    addon: { name: "InputGroupAddon", id: "3520:606", axis: "align [inline-start,inline-end,block-start,block-end]", slot: content }
    button: { name: "InputGroupButton", id: "3545:694", axis: "size [xs,sm,icon-xs,icon-sm]",
              nests: "ghost .Button instance per size (xs→xs, sm→default, icon-xs→icon-xs, icon-sm→icon); Base radius→corner-sm on xs+icon-xs",
              content: "label = deep text override; icon = swapComponent .Button Icon → swap-target (.InputGroup/Button Icon · copy 3546:677)" }
    input: { name: "InputGroupInput", id: "3522:590", prop: text }
    textarea: { name: "InputGroupTextarea", id: "3522:592", prop: text }
    text: { name: "InputGroupText", id: "3522:594", prop: text }
    composition: { name: "InputGroup", id: "3525:622", axes: "state [default,focus,disabled,invalid,focus-invalid] x layout [horizontal,vertical]", slot: content }   # +focus-invalid 2026-06-12 (Figma-Member; Code via has-[control:focus-visible]+has-[aria-invalid], kein Sync)
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
    set: { name: "Kbd", id: "3217:308" }             # 2 Achsen: content × emphasis = 4 Member (Live-Name ohne Punkt)
    members:
      "content=text, emphasis=high": "3217:302"      # defaultVariant
      "content=icon, emphasis=high": "3217:304"
      "content=text, emphasis=low":  "3428:1385"
      "content=icon, emphasis=low":  "3428:1387"
    slots: { property: "icon#3217:1", nodes: { high: "3217:305", low: "3428:1388" } }  # 12px Vektor
    axis: { content: [text, icon], emphasis: [high, low] }   # content children-getrieben; emphasis = Code-Prop (default high)
  skill: /shadcn-component-port (+ /component-sync 2026-06-09 emphasis-Achse, 2026-06-17 colour-rework)
  notes: >
    Nova-Kbd metrisch identisch zu new-york (keine Dichte-Änderung). emphasis=high (default) =
    invertierte dunkle Keycap (bg-inverse-fill + text-inverse-ink); emphasis=low = muted Keycap
    (bg-muted-fill + text-muted-ink). text-format-kbd (Geist Mono); gap-xs/px-xs (Space/space-xs);
    corner-sm. Tooltip-Kontext-Overrides (in-data-[slot=tooltip-content]:) sind code-only Stock-Carryover
    (keine Figma-Bindung) → §6-umgekleidet auf bg-surface/text-ink. content (text|icon) children-getrieben.

- name: Breadcrumb
  status: nova-aligned
  figma_synced: true                            # Code→Figma-Push der Nova-Dichte (2026-06-09); colour-rework re-synced 2026-06-17
  source: { registry: "@shadcn", item: breadcrumb, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/breadcrumb/
    exports: [Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/breadcrumb'"
  figma:
    section: { name: "Breadcrumb", id: "3249:302" }
    composition: { name: "Breadcrumb", id: "3254:302" }        # items-Gap Space/space-sm (6px); Live-Name ohne Punkt
    segment_set: { name: "Segment", id: "3250:308" }           # Live-Name (war .Breadcrumb/Segment)
    segment_members: { "state=link": "3250:302", "state=link-hover": "3250:304", "state=page": "3250:306" }
    separator: { name: ".Separator", id: "3251:302" }            # Icon 14px → size-3.5 (Live-Name .Separator)
    ellipsis: { name: "Ellipsis", id: "3251:305" }              # 20×20, Icon 16px → size-4 (Live-Name ohne Punkt)
    axis: { segment_state: [link, link-hover, page] }
  skill: /shadcn-component-port (+ Code→Figma-Push via use_figma; /component-sync 2026-06-17 colour)
  notes: >
    Multipart. Colour (Figma Segment-Set, 2026-06-17 -fill/-ink): link rest = text-muted-ink,
    link-hover + page = text-ink; Separator/Ellipsis-Icons erben currentColor (= muted-ink, kein
    expliziter Class). Body→text-format-body. List- + Segment-Gap → Space/space-xs (4px) Item /
    Space/space-sm (6px) List; Ellipsis size-5; break-words → v4 wrap-break-word. Nova-Dichte im Code
    entschieden und nach Figma gepusht.

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
      set: { name: "CommandItem", id: "3559:2" }
      axis: { state: [default, selected, disabled, checked] }
      props: "icon#3559:0 (INSTANCE_SWAP→Calendar) · showIcon#3559:5 (bool) · label#3559:10 (text) · shortcut#3559:15 (bool) · shortcutText#3559:20 (text)"
      members: { default: "3558:2", selected: "3558:7", disabled: "3558:12", checked: "3558:17" }
    input:
      set: { name: "CommandInput", id: "3639:2" }
      axis: { variant: [default, palette] }
      props: "value#3639:0 (text) · placeholder#3639:1 (text) — nur palette-Member gebunden"
      members: { default: "3561:2", palette: "3638:8" }
      default: "nests .InputGroup-Instanz 3561:3 (opake DS-Fläche) + Such-Vektor + text-format-data-lg Placeholder"
      palette: "Prompt-Zeile: bg-card-fill + p-xl + gap-lg · Caret-Bar 2.5×18 (primary + Effect-Style Glow) · value/placeholder text-format-data-lg (Mono 18) · echte .Kbd-Instanz (content=text, emphasis=high) 'Esc'"
    separator:
      set: { name: "CommandSeparator", id: "3653:6" }
      axis: { variant: [default, labeled] }
      props: "label#3653:1 (text) — nur labeled-Member gebunden"
      members: { default: "3564:2", labeled: "3653:5" }
      default: "1px-Linie (border), full-bleed ergibt sich aus p-0-Panel der palette-Composition"
      labeled: "Labeled Rule: Eyebrow-Label (textCase UPPER, muted-foreground) + nachlaufende Linie (h1 fill, border) · gap-md px-xl pt-lg pb-sm — für freie/flache Kompositionen; CommandGroup[palette] zeichnet sein Heading weiterhin selbst (cmdk-Auto-Hide bleibt beim Gruppen-Weg)"
    empty: { name: "CommandGroup/CommandEmpty", id: "3564:3", prop: "message (text)" }
    group:
      set: { name: "CommandGroup", id: "3640:9" }
      axis: { variant: [default, palette] }
      props: "heading#3640:1 (text, eyebrow UPPER)"
      slot: "items#3640:0"
      members: { default: "3565:2", palette: "3640:2" }
      palette: "Heading = genestete .Command/Separator[labeled]-Instanz (px auf space-md overridet → Label-Einzug 16px wie Item-Icons) · Container px-md py-0. ACHTUNG: heading-Prop ist im palette-Member inert — Gruppen-Titel via label-Prop der genesteten Separator-Instanz setzen"
    composition:
      set: { name: "Command", id: "3642:2" }
      axis: { variant: [default, palette] }
      slot: "list#3642:0"
      members: { default: "3566:2", palette: "3641:2" }
      default: "bg-dialog-fill + border + shadow-elevation + corner-xl + p-xs"
      palette: "bg-dialog-fill + border 1.5px + shadow-elevation + corner-md + p-0 · Prompt-Divider + Footer-Divider (.Command/Separator-Instanzen, fill) · list-Slot py-md · Default-Slot-Content = C2-Demo (SPRINGE ZU / SUCHE / FÜHRE AUS)"
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
    grün (32 Tests inkl. Typo-Survival text-format-data-lg/text-format-body). jsdom-Polyfill lag bereits in test-setup.ts.
    PALETTE-VARIANTE (2026-06-11): variant-Achse [default, palette] auf Input/Group/Composition, Quelle =
    C2-Explorations-Frame 3554:859 (Page "Shadcn Components"); Figma-Member per Clone aus dem Frame gebaut
    → Token-Bindings (space/corner/shadcn-default/overlay/inverse, Effect-Styles Glow+Elevation, Text-Styles
    Input/Eyebrow/Kbd) mitgereist. Item-Set UNVERÄNDERT (User-Entscheid „items sind gleich"); 16px-Flucht via
    Group px-md statt Item-Padding. Demo-Inhalt lebt im palette-Member (DS-Konvention: Examples = pure
    Instanzen, Instanz-Slot-Content nicht editierbar). .Command/Separator als Set mit variant=labeled
    (Labeled Rule aus dem C2-grp-Row, label-Prop) — bewusst NEBEN dem Group[palette]-Heading (Gruppen-Weg
    behält cmdk-Auto-Hide, labeled-Separator für flache Kompositionen). CODE (via /component-sync, Stories
    Palette/PaletteInDialog/PaletteFlat, 50 Tests grün): palette-Input = Prompt-Zeile bg-card-fill/p-xl/gap-lg mit
    statischer Glow-Caret-Bar + text-format-data-lg + Kbd-Esc (caret-primary wieder entfernt — Standard-Caret,
    User-Refinement 2026-06-11, ebenso Liste max-h-96 statt max-h-72 + Such-Icon text-foreground statt
    opacity-50); Prompt-Divider = border-b am Wrapper
    (Figma: Separator-Instanz — strukturelle Abweichung); Group-Heading-Inset px-md (16px-Flucht) — Figma
    war kurz auf 24px (px-xl-Default der genesteten labeled-Separator-Instanz), Instanz-Padding-Override
    auf space-md hat das aufgelöst, Figma = Code = C2-Raster; Deviations komplett in
    agent-runs/component-sync/2026-06-11-command/notes.md.
    A11Y 2026-06-16 (axe aria-required-children): CommandList rendert role="listbox" → erlaubt nur
    option/group-Kinder. Fix code-only: (1) CommandSeparator (beide Formen — labeled + line) rendert jetzt
    ein eigenes role="presentation"-div statt cmdks role="separator" (cmdk setzt role NACH dem Prop-Spread →
    per Prop nicht überschreibbar; Line-Form baut cmdks hide-on-search via useCommandState(search) nach).
    (2) CommandEmpty rendert ein eigenes div (Bedingung useCommandState(filtered.count===0) wie cmdk) als
    role="option" aria-disabled aria-selected=false → die sonst options-lose Listbox hat ein erlaubtes Kind +
    SR liest die No-Results-Meldung; kein cmdk-Item → außerhalb der Tastatur-Navigation. Spec auf
    role=presentation nachgezogen; Gate grün (205). Verbleibend bei a11y='error' nur noch color-contrast (Token).

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
      name: "Dialog"
      id: "3592:794"
      props: "title#3593:2 (text) · description#3593:3 (text) · showCloseButton#3593:4 · showFooter#3593:5 · showBody#3606:0 (bools)"
      slots: { body: "3609:890 (leer; Wrapper body-region visible↔showBody)", footer: "3593:795 (Default = .Dialog/Footer-Instanz 3593:796)" }
      nests: "ghost icon-sm .Button-Instanz 3593:806 als Close (ABSOLUTE top-right, Icon via swapComponent→.Dialog/Icon/Close)"
    footer: { name: "DialogFooter", id: "3591:788", slot: "actions#3591:789 (Default: Cancel outline + Save default .Button-Instanzen)" }
    overlay: { name: "DialogOverlay", id: "3590:791", fill: "scrim (3588:2, Alias→neutral/900) × Layer-Opacity scrim-opacity (3618:3, Alias→opacity/10) + BACKGROUND_BLUR 4" }
    icon: { name: ".Dialog/Icon/Close", id: "3590:790" }
    examples: { dialog-demo: "3595:807", scrollable-content: "3595:829", sticky-footer: "3598:840", no-close-button: "3603:858", dialog-on-overlay: "3604:888" }
  skill: /shadcn-component-port (2026-06-10, Composite-Port; nestet Button)
  notes: >
    Radix-Composite (radix-ui Dialog). Deps: Button ✓ (genestete ghost-Instanz als X-Close; flacher
    ui:add-Schatten gelöscht), radix-ui ✓. DS-Abweichungen: Panel = bg-dialog-fill + border + shadow-elevation
    (2026-06-18: bg-overlay-fill→bg-dialog-fill, s. Batch 7; novas ring-1 ring-foreground/10 ersetzt —
    Raised-Surface-Tiefe wie Command); Scrim = NEUER Token `scrim`
    (neutral/900 @10%, bg-black/10 tot) + backdrop-blur-xs; Titel = text-format-title (18/600; nova 16/500 ohne
    DS-Stufe); Body/Description = text-format-body. Footer = getöntes nova-Band (bg-muted/50, border-t, Bleed
    -mx-xl/-mb-xl) als EIGENE Komponente, default-instanziiert im footer-Slot (User-Entscheidung).
    Scrim als eigene .Dialog/Overlay-Komponente, Panel-Komposition bleibt scrim-frei. Figma-Mechanik:
    SLOT nie direkt visibility-binden (degradiert zu FRAME) → Wrapper-Frame trägt showBody-Boolean.
    Geometrie numerisch (top-2/right-2, max-w-*). Gate grün (39 Tests inkl. Token-Survival).
    CommandDialog nutzt diesen Dialog seit 2026-06-11 (Command-Katalog-Eintrag).

- name: Separator
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-12; colour-rework re-synced 2026-06-17 (no delta)
  source: { registry: "@shadcn", item: separator, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/separator/
    exports: [Separator]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/separator'"
  figma:
    section: { name: "Separator", id: "3675:1016" }
    set: { name: "Separator", id: "3676:1018" }     # Live-Name ohne führenden Punkt
    members: { "orientation=horizontal": "3676:1016", "orientation=vertical": "3676:1017" }
    axis: { orientation: [horizontal, vertical] }   # statisch/non-interaktiv → Content-Achse, KEIN CVA
  skill: /shadcn-component-port (2026-06-12); /component-sync (2026-06-17, no delta)
  notes: >
    Statisches, non-interaktives Element (Radix Separator.Root, decorative=true → role=none;
    decorative=false → role=separator + aria-orientation). Content-Achse = orientation, 2 Member.
    Beide Member: 1px-Linie, SOLID-Fill an `Border/border` gebunden — `border` ist ein im Colour-Rework
    BEHALTENER Name (nur Wert neu = ink/75 #e4e6eb), NICHT border-emphasis/-strong. Klassenstring
    unverändert (bg-border + data-horizontal:h-px/w-full + data-vertical:w-px/self-stretch): bg-border
    mappt 1:1 auf die Live-Bindung, Rest = Geometrie (h-px/w-px numerisch) + Layout. shrink-0 hält die
    Linie im Flex-Row. Colour-Sync 2026-06-17: KEIN Delta — kein Code-Edit.

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
    set: { name: "Label", id: "3735:1024" }
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
    set: { name: "Field", id: "3716:1020" }
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
    set: { name: "FieldLegend", id: "3909:1246" }
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
    component: { name: "FieldSet", id: "3739:1026" }   # Einzel-Component (keine Variant-Achse)
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
  figma_synced: true                            # Figma-Component 2026-06-12; orientation-Achse 2026-06-17 (Einzel-Component → Set)
  source: { registry: "@shadcn", item: field, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/field/
    exports: [FieldGroup]
    barrel: "via field-Barrel"
    props: { orientation: [vertical, horizontal] }   # NEU 2026-06-17: fieldGroupVariants (DS-Erweiterung über stock-shadcn, das nur Field orientation kennt)
  figma:
    section: { name: "Field Set & Group", id: "3738:1026" }
    set: { name: "FieldGroup", id: "4285:1997" }     # NEU 2026-06-17: combineAsVariants (vorher Einzel-Component 3742:1044)
    members:
      "orientation=vertical":   "3742:1044"          # = der frühere Einzel-Component (ID erhalten, Default-Variante)
      "orientation=horizontal": "4280:73"            # NEU 2026-06-17
    axis: { orientation: [vertical, horizontal] }
    nests: "Slot (VERTICAL gap-16) → Field → .Separator → Field. vertical: Separator orientation=horizontal (3742:1055), Fields FILL-Breite. horizontal: Slot HORIZONTAL, Fields HUG nebeneinander, Separator orientation=vertical + lV=FILL (vertikaler Divider, volle Reihenhöhe)."
  skill: Figma-Revision (2026-06-12) + orientation-Achse (2026-06-17, /figma-use)
  notes: >
    Surface-less Container (finding #24): VERTICAL auto-layout gap-xl (space-xl/16, bound), w-full, KEIN
    Fill/Stroke. Gruppiert mehrere Fields mit Divider — FieldSeparator = genestete echte .Separator-Instanz
    (kein eigenes Set, task 4). Nestet echte .Field-Instanzen (finding #26). Code-Pendant = `<div>` @container/
    field-group flex-col gap-xl. figma-verify CLEAN, instanziierbar (h≈207).
    ORIENTATION-ACHSE 2026-06-17: Einzel-Component → Set (combineAsVariants), Achse `orientation`
    (lowercase, wie Field/Separator). vertical = unverändert (gestapelt, horizontaler Divider). horizontal =
    Slot HORIZONTAL, Fields HUG nebeneinander, der Separator switcht auf die vorhandene vertical-Variante
    (3676:1016-Set) + lV=FILL → vertikaler Divider zwischen den Spalten. Set vertikal arrangiert (passt in die
    840er-Section, kein Überlauf). Code: fieldGroupVariants (vertical=flex-col / horizontal=flex-row flex-wrap +
    [&>[data-slot=field]]:w-auto). DS-Erweiterung über stock-shadcn (dort nur Field orientation). Pendant zur
    RadioGroup-Container-orientation → Checkbox-/Radio-Gruppen bekommen die gleiche Reihen-Fähigkeit.

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
    set: { name: "Checkbox", id: "3795:1184" }   # 2026-06-19: checked-Achse um indeterminate erweitert → 15 Member, 5×3 WRAP-Grid (war 2026-06-15: 2 Achsen, 10 Member, 5×2)
    members:   # Reihe checked=off, dann checked=on, dann checked=indeterminate
      "checked=off, state=default":          "3792:1184"
      "checked=off, state=focus":            "3794:1184"
      "checked=off, state=disabled":         "3794:1185"
      "checked=off, state=invalid":          "3794:1186"   # Glow gestrippt (border-only)
      "checked=off, state=focus-invalid":    "4063:2"       # NEU (Border + destructive@20% Glow)
      "checked=on, state=default":           "3792:1185"
      "checked=on, state=focus":             "4063:6"       # NEU (primary-Border + ring@50% Halo)
      "checked=on, state=disabled":          "4063:9"       # NEU (opacity 0.5)
      "checked=on, state=invalid":           "3794:1187"    # war checked-invalid; Glow gestrippt
      "checked=on, state=focus-invalid":     "4063:3"       # NEU (destructive Fill+Border + Glow)
      "checked=indeterminate, state=default":       "4303:73"  # 2026-06-19 (Klon on/default, Glyph→Dash)
      "checked=indeterminate, state=focus":         "4304:73"  # 2026-06-19 (Klon on/focus)
      "checked=indeterminate, state=disabled":      "4304:76"  # 2026-06-19 (Klon on/disabled)
      "checked=indeterminate, state=invalid":       "4304:79"  # 2026-06-19 (Klon on/invalid, Dash destructive-ink)
      "checked=indeterminate, state=focus-invalid": "4304:82"  # 2026-06-19 (Klon on/focus-invalid)
    indicator: { glyph: "checked=on → RiCheckLine VECTOR (primary-foreground 3037:9); checked=indeterminate → RiSubtractLine-Dash VECTOR (M5 11H19V13H5z ×14/24, zentriert; primary-foreground bzw. destructive-ink 3052:2 auf invalid)" }
    axis: { checked: [off, on, indeterminate], state: [default, focus, disabled, invalid, focus-invalid] }   # 2026-06-19: indeterminate als 3. checked-Wert (Box = on-Treatment, Glyph = Dash). 2026-06-15: checked eigene Achse (war State-Achse mit checked/checked-invalid Sammelwerten)
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
    Node-Identität (kein Remap, verifiziert). Galerie 3826:2 zeigt weiter die kuratierten 6 (neue 4 optional). Stories: Default
    (Playground, aria-label) + Basic (play) + Description/Group/Disabled/Invalid + AllStates-Galerie. Die klickbare Choice-Card
    ist eine eigene DS-Komponente (ChoiceCardCheckbox, choice-card/) — die früheren Inline-ChoiceCard/ChoiceCardStates-Stories
    sind migriert/entfernt. Gate grün. Selbe Behandlung 2026-06-15 auf Switch + Radio gespiegelt.
    INDETERMINATE 2026-06-19 (Code→Figma-Push): Code stylt jetzt den Tri-State — data-[state=indeterminate]
    = primary Fill (bzw. aria-invalid:data-[state=indeterminate] = destructive Fill), Indicator-Glyph via CSS
    data-state auf RiSubtractLine (Dash) statt RiCheckLine; checked-Story-Control = inline-radio false|true|
    indeterminate; neue Indeterminate-Story (defaultChecked, toBePartiallyChecked-play) + AllStates-Zeile.
    Figma gespiegelt: checked-Achse um indeterminate erweitert (5 Member als Klone der checked=on-Reihe,
    Glyph→Dash; invalid-Glyph erbt destructive-ink 3052:2). 15 Member, 5×3 WRAP. figma-verify CLEAN, Gate grün
    (typecheck + 11 Checkbox-Story-Tests). ChoiceCardCheckbox: NICHT gespiegelt — bewusst. indeterminate ist
    für eine Blatt-Karte (binäre Einzelauswahl) semantisch n/a (Tri-State = Gruppen-/Eltern-Konzept). Statt einen
    Phantom-State zu modellieren, wurde ChoiceCardCheckbox.checked/defaultChecked/onCheckedChange auf `boolean`
    verengt (2026-06-19) — schließt die alte „Typ behauptet indeterminate, kein Render/Test"-Lücke richtungsrichtig.

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
    set: { name: "Switch", id: "3839:2" }                 # 2026-06-15 umgebaut → 3 Achsen (size × checked × state), 20 Member, 5×4 WRAP-Grid
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
    Galerie 3842:15 zeigt weiter die kuratierten States. Stories: Default (Playground, aria-label) + AirplaneMode (play) +
    Description/Sizes/Disabled/Invalid + AllStates-Galerie (bare Controls mit aria-label). Inline-ChoiceCard/ChoiceCardStates
    2026-06-16 ENTFERNT (a11y-Harness-Cleanup; kanonisch jetzt ChoiceCardSwitch in choice-card/). Gate grün.
    SYNC 2026-06-16 (/component-sync, Figma→Code): unchecked-invalid Track auf `input` (grau) zurückgesetzt — nur
    Border destructive; checked-invalid bleibt destructive Track. `aria-invalid:data-unchecked:bg-destructive` ENTFERNT
    (hebt den 06-12-„beide-Positionen-rot"-Sync auf → wieder border-only wie .Input/.Checkbox). Per shoot verifiziert.

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
    set: { name: "RadioGroupItem", id: "3852:1206" }       # nur das Item ist das Set; 2026-06-15 umgebaut → 2 Achsen (checked × state), 10 Member, 5×2 WRAP
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
    Instanzen folgen per Node-Identität (kein Remap). Galerie 3857:1218 zeigt weiter die kuratierten 6. Stories: Default
    (Playground) + Description + Fieldset (play) + Disabled + Invalid + AllStates. Inline-ChoiceCard/ChoiceCardGroup/
    ChoiceCardStates 2026-06-16 ENTFERNT (a11y-Harness-Cleanup; kanonisch jetzt ChoiceCardRadio in choice-card/). Gate grün.

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
      set: { name: "ChoiceCardCheckbox", id: "4112:1638" }
      members:
        "checked=off": { default: "4110:1535", focus: "4110:1556", disabled: "4110:1577", invalid: "4110:1598", focus-invalid: "4110:1624" }
        "checked=on":  { default: "4111:1577", focus: "4111:1602", disabled: "4111:1627", invalid: "4111:1652", focus-invalid: "4111:1682" }
      usage_example: "4128:1862 (selected single card)"
    switch:
      set: { name: "ChoiceCardSwitch", id: "4119:1750" }   # control size=default, KEINE size-Achse
      members:
        "checked=off": { default: "4117:1638", focus: "4117:1661", disabled: "4117:1684", invalid: "4117:1707", focus-invalid: "4117:1735" }
        "checked=on":  { default: "4118:1694", focus: "4118:1717", disabled: "4118:1740", invalid: "4118:1763", focus-invalid: "4118:1791" }
      usage_example: "4128:1877 (selected single card)"
    radio:
      set: { name: "ChoiceCardRadio", id: "4124:1862" }
      members:
        "checked=off": { default: "4122:1750", focus: "4122:1771", disabled: "4122:1792", invalid: "4122:1813", focus-invalid: "4122:1839" }
        "checked=on":  { default: "4123:1801", focus: "4123:1826", disabled: "4123:1851", invalid: "4123:1876", focus-invalid: "4123:1906" }
      usage_example: "4129:1886 (single-selection group: Standard/Express/Overnight)"
    axis: { checked: [off, on], state: [default, focus, disabled, invalid, focus-invalid] }   # kein hover; Set-Props = checked + state
    nests: "echte .Field-Instanz im FieldLabel-Card (horizontal control-trailing: 3714:1018 invalid=false / 3715:1019 invalid=true); control-Slot = echte Instanz des passenden Control-Members (.Checkbox 3795:1184 / .Switch 3839:2 / .RadioGroupItem 3852:1206 je checked×state); Titel = genestete .Label. Controls WIEDERVERWENDET, nichts detacht."
    tint: "checked-Tint = Zwei-Cyan-Token-Modell, voll variabel-gebunden: Card-Fill accent (3037:14, cyan/50) · Stroke primary (3037:8, cyan/500) · Titel accent-foreground (3038:2, cyan/700). Ersetzt das frühere primary/5+/30 (gebundene Alpha-Paints überleben Instanziierung nicht → re-resolven zu opacity 1). Ersetzt auch die alten statischen ChoiceCard-Examples (4044:1515/3979:2/3997:1358) als kanonische Quelle."
    placeholders: "Card-semantische Default-Texte (2026-06-16): Titel {Title} · Description {Description} · Error {Error} (72 Nodes über alle 3 Sets: 30 Titel + 30 Description + 12 Error, Error nur invalid/focus-invalid). Mechanik: Titel an .Label-TEXT-Prop (label (children)#3735:0) → setProperties; Description/Error rohe Slot-Texte → .characters-Override. BEWUSST NICHT name=value: Layer-Namen bleiben {Label}/{Field Description}/{Error Message} (von .Field/.Label-Mains vererbt + in Instanzen gesperrt — kein Detach); Card-Semantik der {Semantic}-Konvention vorgezogen."
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
    BINARY-BY-DESIGN 2026-06-19: ChoiceCardCheckbox.checked/defaultChecked/onCheckedChange = `boolean`
    (von `boolean | 'indeterminate'` verengt). Eine Blatt-Karte ist eine binäre Einzelauswahl — der
    indeterminate-Tri-State ist ein Gruppen-/Eltern-Konzept und auf einer Karte semantisch n/a; daher
    KEINE indeterminate-Story/-Figma-Variante (kein Phantom-State in DS-Artefakten). Basis-Checkbox behält
    indeterminate (dort echt). Switch/Radio sind ohnehin binär bzw. single-select.

- name: Select
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-19; FIX-ROUND 2026-06-20 (Figma-Background-Agent): focus-invalid-Member + showIcon-Bool + SelectGroup-Set + anchored Select-Composition + Example-Headlines/Groups-Rebuild; figma-verify CLEAN
  source: { registry: "@shadcn", item: select, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/select/
    exports: [Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/select'"
    types: [SelectProps, SelectTriggerProps, SelectContentProps, SelectItemProps, SelectValueProps]
  figma:
    section: { name: "Select", id: "4307:1997" }
    trigger:
      set: { name: "SelectTrigger", id: "4308:2029" }
      axis: { size: [default, sm], state: [default, focus, disabled, invalid, focus-invalid] }    # 10 Member (focus-invalid 2026-06-20)
      members:
        "size=default, state=default":       "4308:1997"
        "size=default, state=focus":         "4308:2001"
        "size=default, state=disabled":      "4308:2005"
        "size=default, state=invalid":       "4308:2009"   # border-only (ring stripped 06-20 → focus-gated)
        "size=default, state=focus-invalid": "4326:2363"   # NEW: destructive border + destructive/20 ring (DROP_SHADOW spread3 a0.2, sbn:false)
        "size=sm, state=default":            "4308:2013"
        "size=sm, state=focus":              "4308:2017"
        "size=sm, state=disabled":           "4308:2021"
        "size=sm, state=invalid":            "4308:2025"   # border-only (ring stripped 06-20)
        "size=sm, state=focus-invalid":      "4326:2367"   # NEW
      props: "value#4310:0 (TEXT '{Value}') + trailing chevron VECTOR (RiArrowDownSLine, muted-ink). w=240 FIXED, h=32/28."
      focus_invalid: "06-20 FIX1: invalid-Ring focus-gated (Input-Familien-Kanon, finding #61a). invalid = nur destructive border (DROP_SHADOW von den invalid-Membern entfernt); focus-invalid = destructive border + destructive/20 ring (mirror Input focus-invalid 3692:1249 verbatim). Code rendert in focus-invalid genau EINEN destructive/20-Ring (kein zweiter Glow) — Brief-Wortlaut 'both rings' = lose; faithful to code. Grid size-major neu sortiert, Set w=1360, Section auf w=1560 verbreitert (sonst überlief das 5-State-Raster)."
    item:
      set: { name: "SelectItem", id: "4313:2046" }
      axis: { state: [default, focus, disabled], selected: [false, true] }          # 6 Member
      members:
        "state=default, selected=false":  "4313:2004"
        "state=default, selected=true":   "4313:2011"
        "state=focus, selected=false":    "4313:2018"
        "state=focus, selected=true":     "4313:2025"
        "state=disabled, selected=false": "4313:2032"
        "state=disabled, selected=true":  "4313:2039"
      props: "showIcon#4326:0 (BOOLEAN, def FALSE — 06-20 FIX2) gated leadingIcon · leadingIcon#4313:6 (SLOT, default 16px RiUserLine) · label#4313:7 (TEXT '{Label}') · trailing check VECTOR (RiCheckLine, visible↔selected). focus = accent-fill + accent-ink."
      show_icon: "06-20 FIX2: showIcon#4326:0 Boolean (default false), mirror CommandItem showIcon#3559:5. Mechanik (finding #8): visible NICHT direkt auf den SLOT gebunden → je Member ein FRAME-Wrapper 'iconWrap' um den leadingIcon-SLOT, wrapper.visible an showIcon#4326:0 gebunden. Default-Item hat KEIN Icon; Toggle-on zeigt RiUserLine. Wrapper-IDs: 4326:2317/2318/2319/2352/2353/2354."
    content:
      composition: { name: "SelectContent", id: "4314:1997" }                       # single recompose-able component (mirror Command surface 3642:2)
      slots: { items: "items#4314:0 (default 3 SelectItem-Instanzen)" }
      bool_props: { showScrollUp: "showScrollUp#4315:0 (def false)", showScrollDown: "showScrollDown#4315:1 (def false)" }
      scroll_buttons: { up: "4314:1998 (RiArrowUpSLine)", down: "4314:2023 (RiArrowDownSLine)" }
    group_set:                                                                      # NEW 06-20 FIX3 — SelectGroup als eigenes Set
      component: { name: "SelectGroup", id: "4326:2371" }
      props: { label: "label#4326:8 (TEXT '{Label}', SelectLabel-Region px-sm/py-xs, text-format-label, muted-ink)", items: "items#4326:7 (SLOT, default 2 SelectItem-Instanzen)" }
      note: "labeled group container = SelectLabel-Text + items-SLOT, container p-xs. Reusable; nistet in den SelectContent items-Slot. Ersetzt das frühere inline-SelectLabel (kein eigenes Set davor)."
    composition_set:                                                                # NEW 06-20 FIX4 — Top-level Select (open-state, anchored)
      component: { name: "Select", id: "4326:2477" }
      nests: { trigger: "4326:2478 (SelectTrigger size=default, value='Banana')", content: "4326:2482 (SelectContent, layoutPositioning=ABSOLUTE)" }
      anchor: "Composition = HORIZONTAL hug auto-layout (bounds=256×32 = nur Trigger). Content = ABSOLUTE-Child, y=36 (Trigger-h 32 + 4 Gap), constraints MIN/MIN → an Trigger-Bottom-Left verankert. Content zeigt Apple/Banana✓/Blueberry. composites.md T4 layer-3 anchored case (finding #59); Figma kann nicht 'öffnen' → diese statische Composition IST das Open-State-Modell."
    label: "06-20: SelectLabel jetzt als SelectGroup-Set modelliert (group_set oben). Code = eigene SelectLabel-Component (kein Figma-Set-Pendant für das bare Label)."
    separator: "genestete echte .Separator-Instanz (main 3676:1016 horizontal) — in Groups-Example zwischen den 2 SelectGroups"
    group: { name: "Usage Examples", id: "4315:2106" }
    examples: { Open: "4327:2225 (NEW 06-20: Select-Composition 4326:2477, anchored)", Basic: "4315:2107", Groups: "4315:2324 (REBUILT 06-20: 2× SelectGroup-Instanz North America/Europe + .Separator dazwischen, neue SelectContent-Instanz 4326:2749)", Scrollable: "4315:2468", Invalid: "4316:2109 (nestet .Field 3713:1017 vertical/invalid)" }
    example_headlines: "06-20 FIX5a: alle Block-Headlines auf Sibling-Kanon umgestellt (Hanken Grotesk Regular 13px, muted-ink — vorher ExtraBold 18px black). 5 Blocks (Open/Basic/Groups/Scrollable/Invalid), je Headline gerendert."
    vars: { input-fill: "3108:2", input-border: "4197:9644", ring: "3038:6", "destructive⚠": "3038:3", input-ink-placeholder: "3043:3", muted-ink: "3037:13", accent-fill: "3037:14", accent-ink: "3038:2", ink: "3037:3", dialog-fill: "3037:6", border: "3038:4", corner-lg: "3073:4", corner-md: "3073:3", space-2xs: "3070:3", space-xs: "3070:4", space-sm: "3070:5" }
  skill: /shadcn-component-port (+ references/composites.md, 2026-06-19; Figma = Background-Agent figma-select-build)
  notes: >
    Popover-Composite (radix-ui Select), 10 Exporte. Deps: radix-ui ✓ (Umbrella-Import behalten = Dialog-Konvention,
    deklarierte Dep), Field/Separator ✓ (in Examples genestet), Label ✓. lucide → @remixicon/react (RiArrowDownSLine/
    -UpSLine/RiCheckLine). ui:add schrieb nur select.tsx (keine Foreign-Component-Files). Figma kann nicht „öffnen" →
    offener Zustand als statische Composition (wie Command/Dialog). 3 Sets + Examples-Gruppe.
    USER-DECISIONS (T2.7): (1) Trigger-Fill = bg-input-fill (Input-Parität, bewusste Abweichung vom Nova-bg-transparent;
    der geschlossene Trigger liest identisch zu Input/Textarea/InputGroup). (2) Scope = volles Composite.
    DS-Clothing: Trigger = Input-Klon (corner-lg/sm corner-md, border-input-border, focus border-ring + ring/50
    ring-[3px], invalid destructive ⚠ + ring/20, placeholder→input-ink-placeholder, text-format-label, h-8/h-7 numerisch,
    Chevron muted-ink); Content = Command-Surface (dialog-fill + border + shadow-elevation + corner-lg, popover→dialog
    konsolidiert); Item = accent-fill/accent-ink-Highlight (= Command-Selektion) + Check, corner-md; Label text-format-label
    muted-ink (12px-Sans→14 Rolle-Snap, findings #20/#28); Separator -mx-xs/my-xs bg-border. dark: + inerter
    not-data-[variant=destructive]-Selektor (Nova-Item hat kein variant-Prop) gedroppt.
    DESIGN-FORKS / CODE↔FIGMA (für /component-sync): D1 SelectItem-Check = Figma trailing Layout-Vektor (pr-md/right-2),
    Code = absolute right-md + pr-3xl-Clearance (shadcn-Idiom, visuell äquivalent — NICHT als Delta lesen). SelectLabel =
    Figma inline (kein Set). `size`-Achse = echtes Code-Prop SelectTrigger.size (kein Fork). `selected`-Bool (Figma) =
    Radix data-state=checked (kein Code-Prop). Docs: meta.component=Select + subcomponents (Option 2, User) → Root-Props
    Haupt-ArgsTable, je Part eine Sub-ArgsTable. 06-20: subcomponents = die 4 Parts mit eigener API (Trigger/Content/
    Item/Value); prop-lose Pass-throughs (Group/Label/Separator/ScrollButtons) WEGGELASSEN (sonst leere „couldn't be
    auto-generated"-Tabs — findings #57/#61c). Controls (size/position/align) = Story-lokale args auf Default (subcomponents = nur Docs).
    docgen: SelectProps (value/defaultValue/onValueChange/open/defaultOpen/onOpenChange/disabled/required/name) +
    SelectTriggerProps (size) + SelectContentProps (position/align) + SelectItemProps (value/disabled/textValue) +
    SelectValueProps (placeholder) [alle 06-20]. Stories: Default (nur Select-Root-Controls; play: open→Blueberry→assert→blur) ·
    Groups · Scrollable · Disabled · Invalid (Field-Komposition; 06-20: war WithField) · TriggerStates (size×state, pseudo-focus) ·
    **Per-Subcomponent-Control-Stories** (06-20, je controls.include-scoped + play): TriggerControls (size/disabled) ·
    ContentControls (position/align) · ItemControls (value/disabled/textValue) · ValueControls (placeholder). Skip-Log: RTL (locale),
    Form/react-hook-form (un-ported Dep). KEIN jsdom-Polyfill (closed render im Spec; open-Pfad im Chromium-Storybook-
    Projekt). figma-verify CLEAN; Gate grün (typecheck + test 236 inkl. 6 Select-Specs + 6 Story-Tests mit axe + lint).
    FIX-ROUND 2026-06-20 (Figma-only, Background-Agent; Code parallel in main): (1) Trigger focus-invalid-Member
    je Größe (10 statt 8) + invalid-Ring focus-gated (invalid = border-only, focus-invalid = border + destructive/20-Ring;
    Input-Familien-Kanon, finding #61a). (2) Item showIcon-Boolean (def false, finding #61b/#8 — iconWrap-FRAME gated den
    leadingIcon-SLOT, NICHT der Slot direkt). (3) SelectGroup als eigenes Set 4326:2371 (label-TEXT + items-SLOT, finding #61c).
    (4) Top-level Select-Composition 4326:2477 (anchored open-state: Trigger + ABSOLUTE-Content, finding #59). (5) Example-
    Headlines auf Sibling-Kanon (Regular 13 muted-ink) + Groups korrekt aus 2 SelectGroup-Instanzen + Separator neu gebaut +
    Open-Example-Block ergänzt. figma-verify CLEAN über alle 5 berührten Knoten; controls-live PASS (showIcon-Toggle,
    SelectGroup items-Slot, Select-Composition-Instanz, focus-invalid beide Größen). Code-Seite (subcomponents-Vollständigkeit,
    focus-gated ring, Invalid-Story, docgen SelectContent) lief parallel in main (Task #7).

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

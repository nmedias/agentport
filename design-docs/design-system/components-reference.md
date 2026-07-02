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
    AND the full Figma matrix. Geometry: rounded-4xl→corner-full (full pill); text-format-label-md
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
    link = text-primary. Radius per NAME (corner-lg/-md), text-format-label-md. Figma treibt hover/active
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
    text → text-format-label-md; placeholder:text-input-placeholder; focus border-ring + ring/50 ring-[3px];
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
    bg-transparent → bg-input-background; text → text-format-label-md; placeholder:text-input-placeholder;
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
    (opak); Addon text-format-label-md muted; Text text-format-body muted; Button ghost. Figma neu = 3-Schichten + reproduzierte
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
    text-format-label-md (Sans 14; in Figma vom Mono-text-input-Command-Format angepasst → /component-sync 2026-06-10)
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
    text-format-label-md (14/500, Rolle Form-/Toggle-Labels, fill=foreground); gap-2→gap-md (itemSpacing bound).
    select-none + group/peer-disabled Opacity unverändert. Eigene Stories (Default/WithControl/Disabled) + Spec
    (3 Tests inkl. text-format-label-md-Survival). FIGMA-REVISION 2026-06-12: eigenes .Label-Set gebaut (HORIZONTAL
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
    DS: gap-2→gap-md, gap-0.5→gap-2xs, gap-5(20, kein Rung)→gap-xl(16, dichter); Typo text-sm→text-format-label-md/
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
    → text-format-title (18/600, Section-Caption-Rolle); variant=label → text-format-label-md (14/500); fill
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
      props: { label: "label#4326:8 (TEXT '{Label}', SelectLabel-Region px-sm/py-xs, text-format-label-md, muted-ink)", items: "items#4326:7 (SLOT, default 2 SelectItem-Instanzen)" }
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
    ring-[3px], invalid destructive ⚠ + ring/20, placeholder→input-ink-placeholder, text-format-label-md, h-8/h-7 numerisch,
    Chevron muted-ink); Content = Command-Surface (dialog-fill + border + shadow-elevation + corner-lg, popover→dialog
    konsolidiert); Item = accent-fill/accent-ink-Highlight (= Command-Selektion) + Check, corner-md; Label text-format-label-md
    muted-ink (12px-Sans→14 Rolle-Snap, findings #20/#28); Separator -mx-xs/my-xs bg-border. dark: + inerter
    not-data-[variant=destructive]-Selektor (Nova-Item hat kein variant-Prop) gedroppt.
    DESIGN-FORKS / CODE↔FIGMA (für /component-sync): D1 SelectItem-Check = Figma trailing Layout-Vektor (pr-md/right-2),
    Code = absolute right-md + pr-3xl-Clearance (shadcn-Idiom, visuell äquivalent — NICHT als Delta lesen). SelectLabel =
    Figma inline (kein Set). `size`-Achse = echtes Code-Prop SelectTrigger.size (kein Fork). `selected`-Bool (Figma) =
    Radix data-state=checked (kein Code-Prop). Docs (06-20, finaler Stand): KEIN `meta.subcomponents` — jeder API-Part hat
    ein EIGENES Story-File (RadioGroupItem-Muster, findings #57/#61c): `select-{trigger,content,item,value}.stories.tsx`,
    je `meta.component=Select*` + `title 'UI/Select/Select*'` + in `<Select>` gewrappt → eigene Autodocs-Seite
    (ui-select-select*) mit echter ArgsTable UND Live-Controls. Prop-lose Pass-throughs (Group/Label/Separator/ScrollButtons)
    = keine Seite. Hauptseite UI/Select = Root + Usage + verlinkt die Part-Seiten.
    docgen: SelectProps (value/defaultValue/onValueChange/open/defaultOpen/onOpenChange/disabled/required/name) +
    SelectTriggerProps (size) + SelectContentProps (position/align) + SelectItemProps (value/disabled/textValue) +
    SelectValueProps (placeholder) [alle 06-20]. Stories — select.stories (UI/Select): Default (voller Root-Playground;
    play: open→Blueberry→assert→blur) · Groups · Scrollable · Disabled · Invalid (Field-Komposition; 06-20: war WithField) ·
    TriggerStates (size×state, pseudo-focus). Part-Files (je Default-Playground + play): SelectTrigger (size/disabled) ·
    SelectContent (position/align) · SelectItem (value/disabled; textValue = ArgsTable, control:false — unsichtbarer
    Typeahead-Effekt) **+ Typeahead-Sub-Story** (Emoji-Flaggen → Text-Content startet mit Emoji, ohne textValue kein Match;
    play tippt „portugal" auf closed Trigger → selektiert) · SelectValue (placeholder). Skip-Log: RTL (locale),
    Form/react-hook-form (un-ported Dep). KEIN jsdom-Polyfill (closed render im Spec; open-Pfad im Chromium-Storybook-
    Projekt). figma-verify CLEAN; Gate grün (typecheck + test 241: 6 Select-Specs + Story-Tests über select.stories (6) +
    select-trigger/content/value (je 1) + select-item (2: Default + Typeahead), axe + lint).
    FIX-ROUND 2026-06-20 (Figma-only, Background-Agent; Code parallel in main): (1) Trigger focus-invalid-Member
    je Größe (10 statt 8) + invalid-Ring focus-gated (invalid = border-only, focus-invalid = border + destructive/20-Ring;
    Input-Familien-Kanon, finding #61a). (2) Item showIcon-Boolean (def false, finding #61b/#8 — iconWrap-FRAME gated den
    leadingIcon-SLOT, NICHT der Slot direkt). (3) SelectGroup als eigenes Set 4326:2371 (label-TEXT + items-SLOT, finding #61c).
    (4) Top-level Select-Composition 4326:2477 (anchored open-state: Trigger + ABSOLUTE-Content, finding #59). (5) Example-
    Headlines auf Sibling-Kanon (Regular 13 muted-ink) + Groups korrekt aus 2 SelectGroup-Instanzen + Separator neu gebaut +
    Open-Example-Block ergänzt. figma-verify CLEAN über alle 5 berührten Knoten; controls-live PASS (showIcon-Toggle,
    SelectGroup items-Slot, Select-Composition-Instanz, focus-invalid beide Größen). Code-Seite (subcomponents-Vollständigkeit,
    focus-gated ring, Invalid-Story, docgen SelectContent) lief parallel in main (Task #7).

- name: Slider
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-22 (Figma + Code zusammen gebaut)
  source: { registry: "@shadcn", item: slider, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/slider/
    exports: [Slider, SliderProps]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/slider'"
  figma:
    section: { name: "Slider", id: "4348:2225" }
    set: { name: "Slider", id: "4351:2225" }       # 12 Member, 3 Achsen, 4×3 manuelles Grid (gemischte Member-Größen → kein WRAP)
    members:
      "orientation=horizontal, thumbs=single, state=default":  "4350:2225"
      "orientation=horizontal, thumbs=single, state=focus":    "4350:2229"
      "orientation=horizontal, thumbs=single, state=disabled": "4350:2233"
      "orientation=horizontal, thumbs=range, state=default":   "4350:2237"
      "orientation=horizontal, thumbs=range, state=focus":     "4350:2242"
      "orientation=horizontal, thumbs=range, state=disabled":  "4350:2247"
      "orientation=vertical, thumbs=single, state=default":    "4350:2252"
      "orientation=vertical, thumbs=single, state=focus":      "4350:2256"
      "orientation=vertical, thumbs=single, state=disabled":   "4350:2260"
      "orientation=vertical, thumbs=range, state=default":     "4350:2264"
      "orientation=vertical, thumbs=range, state=focus":       "4350:2269"
      "orientation=vertical, thumbs=range, state=disabled":    "4350:2274"
    anatomy: "Root (NONE, clip=false) › Track (FRAME, clip=true, bg input-fill-high, corner-full) › Range (RECT, bg primary-fill, corner-full) + 1–2 Thumb (RECT 12×12, bg surface, border input-border 1px INSIDE, corner-full). horiz Track 200×4 / vert 4×160. Range: horiz 0→Thumb, vert bottom→Thumb, range zwischen Thumbs."
    axis: { orientation: [horizontal, vertical], thumbs: [single, range], state: [default, focus, disabled] }   # thumbs = Figma-only Fork (Code leitet Thumb-Zahl aus value.length ab, KEIN Prop — wie Field.controlPosition; NICHT als CVA zurücksyncen). KEIN invalid-State (stock-Slider hat keinen).
    examples: { group: "Usage Examples 4354:2225", Default: "4354:2228", Range: "4354:2234", Vertical: "4354:2244", Disabled: "4354:2253", FieldSlider: "Field-Instanz 4355:2238 (control-Slot = Range-Slider-Instanz 4356:2249, label 'Price Range', description gewrappt)" }
    vars: { input-fill-high: "4197:9645", primary-fill: "3037:8", input-border: "4197:9644", surface: "3037:2", corner-full: "3073:6" }
    focus_glow: "literal DROP_SHADOW radius:0 spread:3 ring(ink/800)@50% sbn:false — verbatim von .Input focus 3176:305 (Glow-Rezept: NIE binden, sonst droppt die /50). Pro Thumb auf den focus-Membern; Member clip=false."
  skill: /shadcn-component-port (+ /figma-build-rules, 2026-06-22)
  notes: >
    Radix Slider (radix-ui Umbrella-Import behalten = volles Primitive, deklarierte Dep, Dialog/Switch-Konvention),
    kein CVA → Geometrie + State-Achsen wie Switch/Checkbox-Familie. Parts: Root › Track (rail) › Range (fill) +
    N×Thumb (1 pro value; 2 = range). DS-Clothing: Track-rail = bg-input-fill-high (muted-fill #f9fcfd auf Weiß
    unsichtbar → Switch-Präzedenz „off-track muss lesen"; Rolle>Name); Range = bg-primary-fill (DS „active/on surface"
    = dunkles Navy deep/900, wie Switch-Track/Checkbox-Box/Radio-Dot — NICHT cyan primary); Thumb = bg-surface +
    border-input-border (nova border-ring rollen-korrigiert → input-border, Sibling-Resting-Border) + focus-Ring
    ring-ring/50 ring-[3px] (hover/focus-visible/active; ring-3→ring-[3px] B15). corner-full (rounded-full). Geometrie
    numerisch: size-3 Thumb, h-1/w-1 Track (4px), min-h-40 vertical. dark: + inerte disabled:* am Thumb (span, kein
    :disabled) belassen. A11Y: role="slider" sitzt am Thumb → Component FORWARDET aria-label/-labelledby an jeden Thumb
    (sonst axe aria-input-field-name rot; Root-Label benennt nichts). thumbs-Achse = Figma-only Fork (range = 2 values).
    Stories: Default (Playground + Keyboard-play) · Range · FieldSlider (Field-komponiert, schließt den 2026-06-12
    Field-Skip field-slider) · Vertical · Disabled · AllStates-Galerie. KEIN jsdom-Polyfill nötig (ResizeObserver/
    scrollIntoView lagen in test-setup.ts). figma-verify CLEAN-by-design (18 Thumb↔Track-Overlaps = beabsichtigte
    Handle-auf-Rail-Geometrie). Gate grün (260 Tests: 5 Slider-Specs + 6 Slider-Stories + axe).

- name: Popover
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-22; Figma-Rebuild 06-23; A9-Anchor-Umbau 2026-06-24 (Figma-only)
  source: { registry: "@shadcn", item: popover, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/popover/
    exports: [Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger, PopoverContentProps]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/popover'"
  figma:
    section: { name: "Popover", id: "4365:2253" }   # 06-23: 321×203→1312×1133 (A5-Fix) → 1718×2528 → 06-24 A9-Spill-Fix → 2278×2585. ECHTER Fix: der GRID-Set selbst bekommt Padding (s. root.structure), sodass seine EIGENE Frame die floatenden Overlay-Panels einschließt → kein Member/Set/Build/Section-Rand wird mehr von Panels gekreuzt. Build-Frame zentriert (counterAxisAlignItems CENTER, padding 16), Section umschließt mit 80px-Inset; Tooltip-Section nach rechts genudged für Platz. Spill-Check MUSS bis zu den sichtbaren PopoverContent-LEAVES rekursieren + absoluteBoundingBox nehmen (NICHT nur Direktkinder, NICHT absoluteRenderBounds — clippt unter set.clipsContent → falsches PASS)
    build_frame: { name: "Build", id: "4390:2364" } # NEU 06-23: weißes vertikales AL-Frame (HUG, itemSpacing space-2xl, padding space-xl) IN der Section — hält masters + PopoverRoot + Usage Examples (Section ≠ AL-Container → A5-Fix)
    content: { name: "PopoverContent", id: "4365:2255" }   # SINGLE member, KEIN State-/Variant-Set (data-[side]=Motion, kein DS-State)
    slot: { content: "content#4365:0" }                    # die offene Region; Default = genestete PopoverHeader-Instanz
    header: { name: "PopoverHeader", id: "4367:2253", props: "title#4367:0 (TEXT, {Title}, Label-Style/dialog-ink) · description#4367:1 (TEXT, {Description}, Body-Style/muted-ink)" }
    examples: { group: "Usage Examples 4368:2255", SimpleContent: "PopoverContent-Instanz 4368:2258 (Slot = konfig. PopoverHeader)", Dimensions: "PopoverContent-Instanz 4368:2274 (Slot = PopoverHeader + 4 Label/Input-Reihen, echte DS-Instanzen Label 3734:1022 / Input 3176:303)" }
    vars: { dialog-fill: "3037:6", dialog-ink: "3037:7", border: "3038:4", muted-ink: "3037:13", corner-lg: "3073:4", space-lg: "3070:8", space-md: "3070:6", space-2xs: "3070:3" }
    effect: { Elevation: "S:92c2d7…" }
    axis: { }   # Content-Fläche: KEINE Achse (erhabene Fläche, kein interaktiver State-Raum, Motion ≠ DS-State)
    root:                                          # 06-23 Follow-up: Popover (umbenannt von PopoverRoot) = VOLLES interaktives Overlay; 06-24: A9-ZWEI-STUFEN-ANKER (constraint-getrieben, resize-fest)
      set: { name: "Popover", id: "4402:2589" }    # Set-Name "Popover" (matcht Code-Root-Export); Member HUGgen den Trigger (50×32)
      axis: { state: [closed, open], side: [top, right, bottom, left], align: [start, center, end] }  # 24 Member; defaults open/bottom/center
      props: "trigger#4408:0 (SLOT, HUG, default DS-Button — spiegelt asChild; Kind bestimmt Slot-W/H → Member huggt den Trigger; Reaction am Member-Frame → Slot-Swap stört Prototype nicht)"
      structure: "je Member = Auto-Layout HUG → Footprint = nur Trigger (50×32), clipsContent=false; Trigger = einziges Flow-Kind. ZWEI-STUFEN-ANKER (A9, 06-24): (1) Panel Position = unsichtbares (fills[]) FIXED-50×32-Auto-Layout, ABSOLUTE Kind des Members, constraints=SIDE×ALIGN-TRACKING [top→vert MIN · bottom→vert MAX · left→horiz MIN · right→horiz MAX; align start/center/end → MIN/CENTER/MAX auf der Parallel-Achse] → trackt die Trigger-Kante, wenn der (geHUGgte) Trigger die Größe ändert → konstanter Gap, kein Überlapp. (2) PopoverContent = ABSOLUTE Kind der Panel Position, constraints=GROW-AWAY [Seitenachse INVERTIERT: bottom→MIN · top→MAX · left→MAX · right→MIN; Parallel-Achse = align] → HUG-Wachstum geht vom Trigger WEG (kein Überlapp). sideOffset 8, KEIN Reflow; closed = content visible=false. Set-Grid (layoutMode GRID) → 0 Panel-Kollisionen. (Grund für 2 Stufen: Figma-constraints steuern BEIDE — Parent-Resize-Tracking UND Selbst-Wachstums-Anker eines ABSOLUTE-Kinds — und die beiden brauchen je Seite die GEGENÜBERLIEGENDE Kante → eine Stufe kann nicht beides; empirisch belegt.) PANEL-CONTAINMENT (06-24): da Member den Trigger HUGgen, floaten die Panels per Design außerhalb der Member → ohne Gegenmaßnahme überstehen sie Set/Build/Section. Fix: der GRID-Set bekommt Padding ≈ Panel-Überstand+Marge (padL/R 328, padT 105, padB 48; Überstand = Panelbreite 288 + Gap 8 = 296 seitlich, 73 oben) UND die Set-Breite wächst um denselben Betrag (→ 2086), damit die Content-Area (1430) konstant bleibt und das GRID NICHT umbricht → die Set-Frame umschließt ihre eigenen Panels (verifiziert: panelsOutsideSet=0, 0 Kollisionen)."
      prototype: "closed → ON_CLICK CHANGE_TO matching open; open → ON_CLICK + ON_KEY_DOWN(Esc) CHANGE_TO matching closed (DISSOLVE 0.2s) — click-outside ist auf Variant-Membern nicht ausdrückbar"
      members_sample: { "open/bottom/center": "4399:2385", "closed/bottom/center": "4402:2469" }   # 24 total; je Member jetzt: Trigger-SLOT + Panel-Position-Anker (mit genestetem PopoverContent)
      note: "state×side×align = Figma-only interaktives Modell; Code treibt side/align via PopoverContent-Props + open/closed via Radix-Runtime → KEIN CVA, NICHT als Code-Props zurücksyncen. A9-Anker = Figma-Modell-Treue (Radix-Popper macht das gleiche zur Laufzeit) → KEINE Code-Änderung. Verifiziert 06-24: Trigger-Resize (50×32→110×60) + Content-Wachstum (288×65→364×235) → Gap bleibt 8, 0 Überlapp, alle 24 Varianten."
  skill: /shadcn-component-port (+ /figma-build-rules, 2026-06-22; Figma-Rebuild 2026-06-23)
  notes: >
    Radix Popover (radix-ui Umbrella-Import behalten = volles Primitive, deklarierte Dep, Dialog/Select-Konvention,
    B13). Composite OHNE eigenen State — Content = einzige DS-Fläche (Trigger/Anchor = Pass-through, kein Class).
    7 Exporte: Popover/Trigger/Content/Anchor (stock-4) + PopoverHeader/Title/Description (Nova-Typo-Helfer über
    new-york). KEIN CVA, KEIN State-/Variant-Set in Figma — eine erhabene Raised-Surface (Schwester von Dialog/Command:
    `overlay`+`popover` 2026-06-18 zu `dialog` konsolidiert → `bg-popover`/`text-popover-foreground` TOT). DS-Clothing
    (T3): bg-popover→bg-dialog-fill · text-popover-foreground→text-dialog-ink · rounded-lg→corner-lg (radius/8, control-
    attached, NICHT Dialogs corner-xl) · ring-1 ring-foreground/10→border (Nova-Raised-Ring → DS-border, verbatim
    Dialog/Command) · shadow-md→shadow-elevation · gap-2.5/p-2.5 (10px, keine Rung)→gap-md(8)/p-lg(12) per ROLLE
    (B22/B23) · text-sm→text-format-body. Header: gap-0.5→gap-2xs; Title text-sm/font-medium→text-format-label-md
    (kompakte Caption 14/500, NICHT Dialogs title 18 — Popover ist kompakt); Description muted-foreground→muted-ink.
    Geometrie numerisch (w-72, z-50, sideOffset/align). Motion-Klassen (data-[side]/data-open/data-closed) verbatim.
    Docgen (06-23-Fix A4): PopoverProps am Root (Omit+Re-Declare open/defaultOpen/onOpenChange/modal → ArgsTable aus
    react-docgen, hand-argTypes raus); PopoverContentProps auf den vollen kuratierten Satz erweitert (side/sideOffset/align/
    alignOffset/avoidCollisions/collisionPadding/sticky/hideWhenDetached) statt nur align/sideOffset; Sides-Story ergänzt.
    A11Y: Radix gibt dem Content role="dialog" → axe
    aria-dialog-name verlangt einen Accessible Name; Popover wired den Title NICHT auto (anders als modaler Dialog) →
    offenes Panel braucht explizites aria-label/-labelledby (in JSDoc + Stories dokumentiert; alle open-Stories benannt).
    jsdom-Spec B20-scoped: closed-Pfad + defaultOpen (mountet OHNE Pointer-Capture-Flow → KEIN neuer Polyfill); der
    klick-getriebene open→Escape-Flow lebt im Chromium-Play-Test. figma-verify CLEAN (0 text-icon/clipped/overlap/pad-
    asym). Gate grün (3 Specs + 5 Stories + axe). DOWNSTREAM: Popover + Command komponieren den combobox-Connection-
    Switcher (Explorer) — OUT OF SCOPE dieses Ports, nur als Consumer notiert.
    FIGMA-REBUILD 06-23 (code→Figma, background agent): (A5-Fix) Section-Komposition repariert — die frei
    positionierten Children (spillten auf den dunklen Canvas) in ein weißes vertikales AL-Build-Frame `4390:2364`
    re-parented (kein Detach), Section 321×203→1312×1133 → sectionSpill []; Headline normalisiert. (#4) `align`
    modelliert als Popover-Root-Set `4393:2391` (align-Achse start/center/end, echte genestete Button+PopoverContent).
    figma-verify CLEAN + manueller Section-Check PASS. FOLLOW-UP 06-23: PopoverRoot von static align-only auf
    VOLLES interaktives Overlay erweitert — Set `4402:2589`, 24 Member (state×side×align), HUG-SLOT-Trigger
    (asChild-Proxy), absoluter Content (anchored, kein Reflow), on-click+Esc-Prototype (closed↔open); alt
    `4393:2391` entfernt; Member HUGgen den Trigger (Footprint=Trigger, Content floatet absolut außerhalb), Set umbenannt „Popover"; Section → 1718×2528. figma-verify CLEAN + Section-Check PASS. Detail:
    agent-runs/component-port/2026-06-23-popover-figma/.
- name: Tooltip
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-22 (Figma + Code zusammen gebaut)
  source: { registry: "@shadcn", item: tooltip, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/tooltip/
    exports: [Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipProps, TooltipContentProps]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/tooltip'"
  figma:
    section: { name: "Tooltip", id: "4381:2356" }       # headline 4381:2357; 06-23 + Build-Frame 4420:2530 + Tooltip-Root-Set, resized 953×789→1368×909
    component: { name: "Tooltip", id: "4382:2356" }      # die Content-Chip-Component (kein Variant-Set — Single-Member)
    slot: { name: "content", id: "4384:2356", prop: "content#4384:0", default: "{Label} TEXT (Label-Style, dialog-ink)" }
    arrow: { name: "arrow", id: "4414:2493" }            # 06-23 A8-Fix: down-pointing TRIANGLE (war borderless rotated square 4382:2358 — entfernt). White fill (dialog-fill) + border-Stroke NUR auf den 2 SLANTED Edges (Base offen = joint die Chip); Base überlappt 1px in die Chip → connected Pointer, kein Gap/Seam. showArrow#4418:0 toggelt ihn (per-side Member-Arrow-Swap in Tooltip Root)
    axis: { content: [slot] }                            # Content-Chip: KEINE Variant/State-Achse — nur der Open-Visual; Content = SLOT (offene children-Region)
    root:                                                # NEU 06-23: Tooltip-Root = interaktives Overlay (schlank, A6)
      set: { name: "Tooltip Root", id: "4419:2781" }
      axis: { state: [closed, open], side: [top, right, bottom, left] }   # 8 Member, SCHLANK (kein align — Tooltips zentrieren); defaults open/top
      props: "trigger#4419:0 (SLOT, HUG, default DS-Button — tauschbarer Trigger; Reaction am Member-Frame → swap-safe)"
      structure: "je Member HUGgt den Trigger (54×32); Trigger = HUG-SLOT mit DS-Button-Default; Content = Tooltip-Chip-Instanz 4382:2356 als layoutPositioning=ABSOLUTE + clipsContent=false, per side verankert, sideOffset 6, center; closed = Chip+Arrow visible=false. Per-side-Arrow: side=top nutzt den baked Down-Arrow (showArrow=true); bottom/left/right setzen showArrow=false + ein Member-Level oriented Triangle (Figma kann Arrow-Rotation in einer Instanz nicht overriden, und das Drehen der Instanz dreht das Label mit)"
      prototype: "ON_HOVER ('While hovering') je closed-Member → CHANGE_TO matching open (DISSOLVE 0.15s); Figma auto-revertet bei Leave = open-on-hover/close-on-leave. Kein Click, kein Esc"
      build_frame: { name: "Build", id: "4420:2530" }    # weißes vertikales AL in der Section (wie Popover)
      note: "state×side = Figma-only interaktives Modell; Code treibt side via TooltipContent.side + open/close via Radix-Hover-Runtime → KEIN CVA, nicht zurücksyncen"
    vars: { dialog-fill: "3037:6", dialog-ink: "3037:7", border: "3038:4", corner-md: "3073:3", space-lg: "3070:8", space-sm: "3070:5" }
    styles: { text: "Label (S:4e034695…b266f0)", effect: "Elevation (S:92c2d7ac…66b42)" }
    examples: { group: "Usage Examples 4385:2366", Default: "4385:2370 (slot 'Add to library')", WithKbd: "4385:2382 (slot 'Save changes' + nested .Kbd-Instanz 4385:2390 ⌘S)" }
  skill: /shadcn-component-port (+ /figma-build-rules, 2026-06-22)
  notes: >
    Radix Tooltip (radix-ui Umbrella-Import behalten = volles Primitive, deklarierte Dep, Dialog/Select-
    Konvention; finding B13). Parts: Provider/Root/Trigger = verhaltens-Wrapper ohne Styling; nur
    TooltipContent + sein Arrow tragen Klassen → KEIN CVA, Single-Surface (Sibling von Badge/Kbd, kein
    surface-less Composite). DS-Abweichung (Kern-Entscheid): stock-Tooltip ist eine INVERTIERTE dunkle
    Chip (bg-foreground + text-background) — DS hat keinen invertierten-Overlay-Token → an die
    konsolidierte RAISED-OVERLAY-Fläche umgekleidet: bg-dialog-fill + text-dialog-ink + border (1px,
    nova hatte keine) + shadow-elevation (Tiefe, stock ist flach) wie Dialog/Command. Tooltip wird damit
    eine LIGHT raised Chip (recorded dark→light fork). Geometrie/Typo: rounded-md→corner-md, gap-1.5→gap-sm,
    px-3→px-lg, py-1.5→py-sm, text-xs→text-format-label-md (kein 12px-Sans-Rung → Rolle „kurzes Label", +2px
    Snap; B21/B23). Arrow erbt dialog-fill (bg+fill), rounded-[2px] als arbiträre Diamant-Geometrie verbatim,
    rotate/translate numerisch. Animations-/Layout-/Radix-transform-origin-Utilities verbatim (§6 keep_valid).
    FIGMA: Content-Region als SLOT modelliert (content#4384:0, {Label}-Default), NICHT TEXT-Prop — der Code
    nutzt freie `children` (Text, oder Text + Kbd) → /figma-build-rules §Mechanism „open variably-many
    children → Slot"; ein TEXT-Prop könnte die WithKbd-Komposition nicht reproduzieren (Done-Test). Arrow =
    ABSOLUTE-Kind (layoutPositioning), bottom-center, halb über die Unterkante (Pointer; clipsContent=false
    am Component, damit Arrow+Shadow nicht clippen). Usage-Examples-Group reproduziert Default + WithKbd aus
    Controls (WithKbd nestet eine echte .Kbd-Instanz). figma-verify CLEAN (0 text-icon/clipped/overlap/
    pad-asym; Arrow-auf-Chip-Overlap by-design = absolute Kind in AL-Frame, wie Slider Thumb-auf-Track C3).
    A11Y: TooltipContent role=tooltip; Radix verdrahtet aria-describedby Trigger→Content im Open-State;
    Icon-only-Trigger braucht EIGENEN accessible name (Tooltip = Beschreibung, kein Name) → IconTrigger-Story
    nutzt DS-Button `icon`-Bool + Pflicht-aria-label. Docgen: TooltipProps (open/defaultOpen/onOpenChange/
    delayDuration) + TooltipContentProps (side/sideOffset/align/alignOffset) via Omit+re-declare; Provider/
    Trigger pass-through. Stories: Default (Playground + hover→open play gg. Portal via within(document.body))
    · Placement (4 Seiten) · WithKbd (Kbd ported) · IconTrigger (a11y). jsdom .spec NUR closed/trigger-Pfad
    (B20: portal-mounted Content mountet erst on-open → kein zusätzlicher Polyfill; Open-Pfad übers Chromium-
    Storybook-play). Gate grün (tooltip-scoped): 4 jsdom-Specs + 4 Stories (Chromium + axe), typecheck + lint.
    OFFENER PUNKT (Kbd): kbd.tsx trägt `in-data-[slot=tooltip-content]:bg-surface/20 text-ink` — getunt für
    eine INVERTIERTE (dunkle) Tooltip; auf der gewählten LIGHT dialog-fill-Fläche liest das near-invisible.
    Bewusst NICHT im Tooltip-Port editiert (Scope = ein Component) → als Open Item geflaggt; WithKbd rendert
    die Kbd as-is. (Quelle: agent-runs/component-port/2026-06-22-tooltip/notes.md + skill-feedback.md.)

- name: Item
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-26 (Figma + Code zusammen gebaut); figma-verify CLEAN
  source: { registry: "@shadcn", item: item, style: radix-nova }   # registryDependencies: separator (flache Stock-Kopie gelöscht — shadowte den DS-Folder)
  code:
    dir: libs/ui/src/components/ui/item/
    exports: [Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter, itemVariants, itemMediaVariants, ItemProps, ItemMediaProps]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/item'"
    stories: "item.stories.tsx (UI/Item) + item-media.stories.tsx (UI/Item/ItemMedia — Per-API-Part-Page; nur Item+ItemMedia haben kuratierte Props, die 8 prop-losen Pass-throughs via Usage-Stories)"
  figma:
    section: { name: "Item", id: "4494:2471" }          # headline 4494:2472
    set: { name: "Item", id: "4498:2551" }              # 9 Member (variant × size); master = outline/default 4495:2471
    axis: { variant: [default, outline, muted], size: [default, sm, xs] }
    props: "media#4498:0 (SLOT, default = nested .ItemMedia-Instanz variant=icon) · actions#4498:1 (SLOT, default chevron muted-ink) · title#4499:0 (TEXT {Title}, Label, ink-gebunden) · description#4499:10 (TEXT {Description}, Body/muted-ink)"
    media_set: { name: "ItemMedia", id: "4508:2544", axis: { variant: [default, icon, image] }, slot: "content#4508:3 (swappable Glyph/Image; icon-Default an ink gebunden)" }   # 3 Member: default 4508:2534 / icon 4508:2537 / image
    group_component: { name: "ItemGroup", id: "4511:2575", slot: "items#4511:0", note: "vertikales AL, gap-xl; Layout-only (responsiver has-data-Gap nicht in Figma abbildbar)" }
    examples:
      group: "Usage Examples 4501:2471"
      typelist: "4501:2472 — 3 muted-Instanzen, TEXT-Props treiben invoice/contract/document (explorer NavListItem)"
      states: "4502:2498 — Base 4502:2502 · Hover 4502:2523 (muted-fill override) · Focus 4502:2544 (ring-ring/50 3px DROP_SHADOW, verbatim vom Select-Focus 4308:2001 kopiert — NICHT die generische Glow-Style) · Selected 4502:2565 (accent-fill + accent-ink title = call-site contract, KEIN Set-Member)"
    state_axis: "BEWUSST examples-only (NICHT als Set-Achse): hover/focus/selected-Delta ist uniform über variant×size → 18/27 Member wären redundant. Die States leben in der Usage-Examples-States-Gruppe (spiegelt die AllStates-Story). Extend zu variant×size×state (27) nur falls explizit gewünscht."
    vars: { ink: "3037:3", muted-fill: "3037:12", muted-ink: "3037:13", accent-fill: "3037:14", accent-ink: "3038:2", border: "3038:4", ring: "3038:6", space-xs: "3070:4", space-md: "3070:6", space-lg: "3070:8", space-xl: "3070:9", corner-sm: "3073:2", corner-lg: "3073:4" }
    styles: { text: "Label (S:4e034695…b266f0) + Body (S:7e1bf8f1…2911fb)", effect: "Glow (S:768ea662…1005fa7, focus)" }
  skill: /shadcn-component-port (+ /figma-build-rules, composites.md, /storybook-rules, /docgen-props; 2026-06-26)
  notes: >
    10-teiliges Composite (Item/Media/Content/Title/Description/Actions/Group/Separator/Header/Footer),
    volle Familie portiert. Generische Listenzeile → Root-Barrel-Primitiv (kein Block); Use-case =
    explorer NavListItem. KERN-ENTSCHEIDE: (1) Selektion bleibt CALL-SITE/Block-Sache — Item ist
    stock-treu (kein selected-Prop); der ListNavigator-Block setzt aria-current + DS-accent-Tint. Kontrast
    zu SelectItem (selected-Axis nur, weil Radix dort intrinsischen Selected-State liefert). (2) hover
    (`[a]:hover:bg-muted-fill`) + focus-ring sind LINK-ONLY by design — der [a]:-Selektor + ein bare-div
    ist nicht fokussierbar → beide States nur an der asChild-Link-Form. DS-Mapping: rounded-lg→corner-lg,
    text-sm→text-format-body (base) / text-format-label-md (title) / body+muted-ink (desc); 10px-Padding/Gap
    (gap-2.5/py-2.5/px-2.5) ist OFF-GRID → auf benannte Steps gesnappt (default/sm = lg=12, xs = md=8); das
    Haus snappt (kein 2.5/[10px] in der Lib). GEDROPPT: xs:text-xs (12px) — kein sub-14 Sans-Format (Open
    Item). Focus-Klassen unverändert (schon DS = badge/button). DEPENDENCY-AUDIT: ui:add schrieb flache
    separator.tsx (Stock) → shadowte den DS-Folder (file beats dir in resolution, typecheck grün auf einer
    Lüge) → flache Kopie GELÖSCHT, Import löst auf den Barrel. FIGMA: .Item-Set = variant×size (9, die
    echten Design-Achsen); media+actions als SLOTs (swappable content, §Mechanism), title/description als
    TEXT-Props ({Semantic}-Defaults); .ItemMedia eigenes 3-Member-Set. State-Achse examples-only (s.
    state_axis). figma-verify CLEAN (0 flags). STORIES: house-konform nach /storybook-rules (anfangs Badge
    statt Composite-Muster gespiegelt → korrigiert): item-media.stories.tsx als Per-Part-Page, AllStates via
    pseudo-states-Addon (hover/focusVisible) + Selected call-site, Cross-Links. a11y: ItemGroup role=list →
    role=listitem an den Kindern am Call-Site (axe aria-required-children). Docgen: ItemProps (variant/size/
    asChild) + ItemMediaProps (variant) via lokale Named-Aliase + Slot. Gate grün (300/300 inkl. Chromium+
    axe, typecheck, lint). REVIEW-FIXES (User-Review, 2026-06-26): (1) Item media-Slot-Default = genested
    .ItemMedia-Instanz statt Roh-Vektor; (2) Title + ItemMedia-Icon an `ink` gebunden (Recon hatte ink
    vergessen → roher Hex); (3) Focus-Ring korrekt (ring-ring/50 3px DROP_SHADOW, verbatim vom Select-Focus
    kopiert — vorher fälschlich die generische cyan Glow-Style); (4) ItemGroup als Component (4511:2575,
    items-Slot); (5) ItemMedia content-Slot (swappable). figma-verify CLEAN nach Fixes; Skill-Findings →
    skill-feedback.md (A1 Recon-ink-Tokens · A2 Composite-Part-Nesting+Slot). (Quelle:
    agent-runs/component-port/2026-06-26-item/notes.md + skill-feedback.md.)

- name: Table
  status: nova-aligned
  figma_synced: true                            # Erstport 2026-06-26 (Figma + Code zusammen gebaut)
  source: { registry: "@shadcn", item: table, style: radix-nova }
  code:
    dir: libs/ui/src/components/ui/table/
    exports: [Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption]
    barrel: "libs/ui/src/index.ts → export * from './components/ui/table'"
  figma:
    section: { name: "Table", id: "4514:2597" }
    head: { set: "TableHead", id: "4515:2603", axis: "align [left,center,right]", prop: "head (children)#4515:0 ({Head}); Label+ink, h-10, px-md" }
    cell: { set: "TableCell", id: "4515:2610", axis: "align [left,center,right]", prop: "cell (children)#4515:4 ({Cell}) TEXT + content#4527:0 SLOT — Zelle nimmt auch Components (Checkbox/Badge/Button …, Text-Default liegt IM Slot, swapbar); Body+ink, p-md" }
    row: { set: "TableRow", id: "4520:2621", axis: "state [default,hover,selected]", slot: "cells#4520:3 (leer)", notes: "bottom-border→border; hover muted-fill/50; selected accent-fill; minHeight 37" }
    composition: { name: "Table", id: "4521:2597", props: "content#4537:0 (SLOT, Default = Invoice-Interieur) · showCaption#4522:1 (bool) · caption#4522:2 (text)", notes: "recompose-able: content-Slot hält Header+Body+Footer-Rows (Slot-Default = gebackenes Invoice); Caption boolean+text darunter. showFooter entfallen (Footer = Teil des Slot-Contents)" }
    examples: { group: "4523:2635 (Usage Examples)", members: "ALLE = Table-Instanzen (content-Slot gefüllt): Default (4523:2638, Slot-Default Invoice + Caption) · Selection (4538:2802, Zeile 2 selected) · Empty (4538:2890, No results) · Component cells (4538:2963, Checkbox + Badge)" }
    axis: { head_align: [left, center, right], cell_align: [left, center, right], row_state: [default, hover, selected] }
  skill: /shadcn-component-port (+ references/composites.md, 2026-06-26)
  notes: >
    Multi-Part-Composite OHNE Root-Element, 8 prop-lose Pass-Through-Parts (Table/Header/Body/Footer/Row/
    Head/Cell/Caption), KEIN CVA. Einzige Interaktions-Achse = TableRow state. Deps: keine (ui:add schrieb
    nur table.tsx, keine lucide-Icons). DS-Mapping: text-sm→text-format-body; head/footer font-medium→
    text-format-label-md; text-foreground→text-ink; text-muted-foreground→text-muted-ink; px-2/p-2→px-md/p-md;
    mt-4→mt-xl; border-b/-t/-0 = nur Breite, Farbe via Base-Layer (border-border), kein Class.
    ROW-TINT (User-Entscheid 2026-06-26): hover NEUTRAL (bg-muted-fill/50, wie Item-Zeilen) ≠ selected
    ACCENT (bg-accent-fill, wie Command-Selektion — muted-fill #f9fcfd wäre für eine selektierte Zeile
    unsichtbar); Text bleibt ink (stock recolort selected nicht). dark: entfernt.
    FIGMA (User-Granularität „Cell+Row+Table", align l/c/r): TableHead/TableCell-Sets (align-Achse, TEXT-
    Prop), TableRow-Set (state-Achse, cells-SLOT LEER gebaut + minHeight), Table-Komposition (recompose-able:
    content-SLOT hält Header+Body+Footer-Rows, Slot-Default = Invoice; showCaption+caption-Props). Usage-Examples
    = 4 ECHTE Table-Instanzen (content-Slot gefüllt): Default/Selection/Empty/Component-cells.
    Cells = TEXT-Prop ({Cell}) PLUS content-SLOT (2026-06-26 nachgerüstet, User-Wunsch): Zelle nimmt auch
    Components (Checkbox/Badge/Button); Text-Default liegt IM Slot (swapbar), für eine Component-Zelle Text
    leeren + Component in den Slot. Beispiel „Component cells" (4529:2758). Footer-Cells bleiben Body
    (Code-tfoot label-weight = Code-only, minor Divergenz).
    Slot-Strategie: leer bauen, Demo backen, Beispiele append-only (skill-feedback #3). Gate grün (9 Specs +
    5 Stories Browser/axe/play). figma-verify CLEAN. Quelle:
    agent-runs/component-port/2026-06-26-table/notes.md + skill-feedback.md.

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

## Showcase-Frame (apps/agentport)

App-owned Präsentations-Components des decompose-Layers unter `apps/agentport/src/showcase/decompose/<name>/`
— **nicht** Teil von `@agentport/ui` (Frame ≠ App; abnehmbar). Ein Ordner pro Component (`.tsx` + `.stories.tsx`
[+ `.spec.tsx`] + Barrel), Stories im **App-Storybook** (`npm run storybook:app`, :6007, Titel `Showcase/Decompose/…`).
Tokens: DS-Utilities + Showcase-Level-Farben (`showcase-tokens.css`). Figma: Rail-Familie auf Page „Showcase"
(Demo-Section `4663:7155`); Verhaltens-Referenz `handoff-drill-rail-wireflow-konzept.md`.

```yaml
- name: DrillRailOrigin
  status: built
  figma_synced: true                            # Figma→Code-Erstbau 2026-07-02 (Figma war zuerst da, User-Design)
  source: { registry: none, item: custom-showcase-part }
  code:
    dir: apps/agentport/src/showcase/decompose/drill-rail-origin/
    exports: [DrillRailOrigin, DrillRailOriginProps, DrillRailOriginKind]
    barrel: "drill-rail-origin/index.ts (lokal; bewusst NICHT im decompose-Barrel — Public-Surface bleibt Decompose)"
  figma:
    set: { name: "Rail Origin", id: "4663:4325" }   # Live-Name; Wireflow-Handoff nennt ihn "Rail Origin Name"
    members: { "shadcn=false": "4663:4324", "shadcn=true": "4663:4326" }
    props: "showLabel (bool, default true)"
    axis: { shadcn: [false, true] }
  mapping: "Code-Prop origin ('custom'|'shadcn', default custom) ↔ Figma-Achse shadcn=false/true"
  skill: manueller Figma→Code-Erstbau (kein shadcn-Port; /storybook-rules + /docgen-props für Story/Props)
  notes: >
    Provenienz-Marker der Rail-Cards: 12px-Glyph (◆ Diamant-Vektor | shadcn-Logo, beide als inline-SVG
    size-3 numerisch, fill-current) + Origin-Wort. Bindings: Gap Space/space-xs → gap-xs · Wort Data/sm →
    text-format-data-sm · Farbe Inverse/inverse-ink → text-inverse-ink am Root (Glyph-Fill in Figma
    unbound #E4E6EB = inverse-ink-Wert → Code erbt via currentColor). Host-Re-Tint über className
    (Rail-Cards tinten den Glyph per Level-Farbe, Wireflow-Regel 7) — Story LevelTinted zeigt den
    Kontrakt mit text-level-*. Code-Delta ggü. Figma: showLabel=false rendert das Wort sr-only
    (A11y-Zusatz — Provenienz bleibt für SR benannt; Figma blendet den Text-Node aus). data-slot=
    "drill-rail-origin" + data-origin. Stories Default/LevelTinted/AllStates (dunkler
    bg-inverse-fill-Chip als Habitat, axe-Kontrast), Spec 4 Tests (sr-only-Kontrakt + Token-Survival).
    Erste Component der Rail-Familie — Familie seit 2026-07-02 komplett (Origin, Level,
    ChildrenItem, StorybookLink, Card inkl. Collapsed).

- name: DrillRailLevel
  status: built
  figma_synced: true                            # Figma→Code-Erstbau 2026-07-02 (Figma war zuerst da, User-Design)
  source: { registry: none, item: custom-showcase-part }
  code:
    dir: apps/agentport/src/showcase/decompose/drill-rail-level/
    exports: [DrillRailLevel, DrillRailLevelProps, DrillRailLevelKind]
    barrel: "drill-rail-level/index.ts (lokal; nicht im decompose-Barrel)"
  figma:
    set: { name: "Rail Level", id: "4663:4358" }
    members: { "Type=block": "4663:4356", "Type=primitive": "4663:4359", "Type=Screen": "4663:4703" }
    axis: { Type: [block, primitive, Screen] }    # ⚠ Casing-Ausreißer in Figma: "Screen" groß, Rest klein
    nests: "jede Member nestet eine echte DS-Badge-Instanz (block/primitive → secondary, Screen → default) mit Overrides: Fill/Ink → Level/*-Variablen, Text-Style → Data/sm, Höhe 16"
  mapping: "Code-Prop level ('screen'|'block'|'primitive', default block) ↔ Figma-Achse Type; Werte lowercase (Caps via CSS uppercase)"
  skill: manueller Figma→Code-Erstbau (/storybook-rules + /docgen-props für Story/Props)
  notes: >
    Tiefen-Leiter-Badge der Rail-Cards. Code spiegelt die Figma-Konstruktion: DS Badge
    (ohne variant-Prop, default — der Figma-Fork default/secondary ist rein konstruktiv,
    beide Farben werden overridet) + twMerge-Re-Clothing: bg-level-{level}-fill +
    text-level-{level} (Showcase-Token-Layer, ersetzt die default-Farben) ·
    text-format-data-sm (ersetzt text-format-label-md) · uppercase (Wort = lowercase
    NodeLevel-Wert). Höhe bleibt die Badge-eigene h-5 (20px) — bewusste Code-Abweichung
    vom 16px-Instanz-Override in Figma (User-Entscheid 2026-07-02: DS-Geometrie gewinnt). Level-Union lokal (DrillRailLevelKind, docgen kann Exclude<>
    nicht auflösen) + satisfies Record<NodeLevel,…> als beidseitiger Drift-Guard gegen die
    decompose-store-Leiter. Inertes Rest-Token [a]:hover:bg-primary-fill/80 bleibt nach
    Merge stehen (Anchor-Modifier, in der Rail nie aktiv). data-slot="drill-rail-level" +
    data-level. Stories Default/AllStates (dunkler Chip), Spec 3 Tests (Re-Clothing-Kontrakt).
    Kontraste text-auf-fill: screen 11.5:1 · block 4.75:1 · primitive 6.4:1 (axe-clean).

- name: DrillRailChildrenItem
  status: built
  figma_synced: true                            # Figma→Code-Erstbau 2026-07-02 (Figma war zuerst da, User-Design)
  source: { registry: none, item: custom-showcase-part }
  code:
    dir: apps/agentport/src/showcase/decompose/drill-rail-children-item/
    exports: [DrillRailChildrenItem, DrillRailChildrenItemProps, DrillRailChildrenItemLevel, DrillRailChildrenItemOrigin, DrillRailChildrenItemSize]
    barrel: "drill-rail-children-item/index.ts (lokal; nicht im decompose-Barrel)"
  figma:
    sets:                                        # EIN Code-Component mit size-Achse (User-Entscheid) — zwei Sets nur organisatorisch
      md: { name: "Rail Children item", id: "4663:4997", height: 37 }
      sm: { name: "Rail Children item Small", id: "4663:5629", height: 29 }
    axis: { State: [Default, Hover, Selected, Selected-Hover], Level: [notSet, Primitive, Block], Custom: [true, false] }
    props: "component name (text)"
    nests: "Rail Origin-Instanz (glyph-only, showLabel=false) rechts; Glyph-Fill in Hover/Selected-Members an Level/*-Variablen"
  mapping: >
    Code: size ('md'|'sm', default md) faltet die zwei Sets · Custom-Achse → origin
    ('custom'|'shadcn') · component name → children · State-Achse → selected-Prop
    (Selected) + CSS :hover (Hover/Selected-Hover; kein Prop) · Level [Primitive, Block]
    → level-Prop (required, 'block'|'primitive'; Figma "notSet" = Behelf des Default-
    Members, weil ein statisches Tool nicht hovern kann — im Code ist level immer bekannt).
  skill: manueller Figma→Code-Erstbau (/storybook-rules + /docgen-props für Story/Props)
  notes: >
    Drill-bare Kind-Zeile der PARTS-Liste einer Rail Card, echtes <button type=button>.
    Bindings: Fläche bg-inverse-container + hover:bg-inverse-container-hover · border-
    inverse-border · corner-sm · px-lg · gap-md · Name text-format-body + text-inverse-ink
    (flex-1 min-w-0 truncate) · py-md (md) / py-xs (sm). Höhen h-[37px]/h-[29px] fix
    (Figma inside-stroke; py-Tokens dokumentieren den Rhythmus, Flex zentriert).
    Glyph-Tint-Mechanik: nested DrillRailOrigin erbt currentColor → selected setzt
    text-level-{level} konstant, sonst group-hover/drill-item:text-level-{level}
    (Selected-Hover ergibt sich) — satisfies Record<Exclude<NodeLevel,'screen'>,…> bindet
    die level-Achse an die Tiefen-Leiter (Kinder nie screen). Code-only-Zusätze: focus-
    visible-Ring (DS-Idiom outline-none/border-ring/ring-[3px]/ring-ring/50 — Figma-Set hat
    kein Focus-Member) + aria-current bei selected. Set-Breite 260 ist Canvas-Konvention →
    Code w-full (Stories pinnen 260). data-slot="drill-rail-children-item" + data-size/
    -level/-selected. Stories Default (play: Klick=Drill)/InChildrenList/AllStates
    (pseudo-hover via Element-IDs — Addon-Klasse landet auf der Row = group, treibt bg UND
    Tint), Spec 5 Tests (size-Faltung, Tint-Kontrakt, origin-Forward, aria-current).

- name: DrillRailStorybookLink
  status: built
  figma_synced: true                            # Figma→Code-Erstbau 2026-07-02 (Figma war zuerst da, User-Design)
  source: { registry: none, item: custom-showcase-part }
  code:
    dir: apps/agentport/src/showcase/decompose/drill-rail-storybook-link/
    exports: [DrillRailStorybookLink, DrillRailStorybookLinkProps, DrillRailStorybookLinkLevel]
    barrel: "drill-rail-storybook-link/index.ts (lokal; nicht im decompose-Barrel)"
  figma:
    component: { name: "Rail StorybookLink", id: "4663:4416" }   # Einzel-Component, keine Varianten; 157×24
    nests: ".Button/Base-Instanz (3460:488) um das Label — h-24/px-sm/corner-md/gap-xs = die xs-Base des DS-Buttons"
    icons: "Book 20px + Pfeil 14px — die Vektoren SIND Remix-Glyphen im 24er-Grid (RiBookOpenLine / RiArrowRightUpLine, Pfad-verifiziert gegen @remixicon/react)"
    binding: "Label + Glyphen an Level/block (Master); die Karten-Master overriden den Tint pro Level"
  mapping: "children → Label · level ('screen'|'block'|'primitive', default block = Master) → Tint · href re-declared (docgen)"
  skill: manueller Figma→Code-Erstbau (/storybook-rules + /docgen-props für Story/Props)
  notes: >
    "Open in Storybook"-Link der Rail-Cards. Konstruktion = DS Button asChild → <a>
    (variant=link, size=xs — die xs-Base IST die Figma-.Button/Base-Pill), User-Entscheid
    2026-07-02: Button-Component nutzen + Remix Icons. Geometrie-Delta via Override:
    px-0 (Icons sitzen in Figma bündig AUSSERHALB der Label-Pill) + gap-sm (die px-sm der
    Pill wird zum 6px-Rhythmus) → 20+6+Label+6+14 = exakt der Figma-Kasten. Tint über
    currentColor: text-level-* ersetzt das text-primary der link-Variante (twMerge);
    hover/active-Underline + Focus-Ring = Button-link-Kontrakt (nicht Component-eigen).
    Icons aria-hidden (Name kommt aus children). data-slot="drill-rail-storybook-link"
    (überschreibt Buttons data-slot via Prop-Spread) + data-level. Stories Default (play:
    role link + href + Tint; kein Klick — würde das Story-iframe navigieren)/AllStates
    (3 Level-Tints), Spec 4 Tests (asChild-Anchor, Tint-Swap, xs-Base+Overrides, Remix-
    Glyphen). FIGMA-SCHULD (Wireflow-Handoff, offen): TEXT-Prop "Storybook Link" ist im
    Set nicht aufs .Button/Base-Label verdrahtet; Karten-Master nennen den Link-Node
    "Link" statt "Rail StorybookLink".

- name: DrillRailCard
  status: built
  figma_synced: true                            # Figma→Code-Erstbau 2026-07-02 (Figma war zuerst da, User-Design)
  source: { registry: none, item: custom-showcase-part }
  code:
    dir: apps/agentport/src/showcase/decompose/drill-rail-card/
    exports: [DrillRailCard, DrillRailCardName, DrillRailCardDescription, DrillRailCardProps, DrillRailCardNameProps, DrillRailCardLevel, DrillRailCardOrigin]
    barrel: "drill-rail-card/index.ts (lokal; nicht im decompose-Barrel)"
    assets: [texture.svg, drill-rail-card.css]   # EIN Alpha-SVG für alle Level (rekonstruiert aus den Figma-Quellen 4757:11400/11415/11424 "Halftone / Diamond") + Masken-Stack-CSS
  figma:
    sets:                                        # EIN Code-Component; Collapsed via open-Prop gefaltet (User-Entscheid)
      card: { name: "Rail Card", id: "4663:4535", axis: "Level [Block,Primitive,Screen] × Container [true,false] × State [Unselected,Selected,Hover]" }
      collapsed: { name: "Rail Card Collapsed", id: "4747:2028", axis: "Level × State × Custom", height: 32 }
    nests: "Rail Level + Rail Origin (Header, Origin neutral inverse-ink) · Rail StorybookLink · Rail Children item(s) im children-Slot · Collapsed: Origin glyph-only (Level-getintet, ALLE States — Wireflow-Regel 7) + Name + Chevron"
    texture: "Container=true-Member (alle States): GROUP blend=EXCLUSION opacity=5% → Gradient-Maske (alpha 1→0 top→bottom) + PATTERN-Paint (HORIZONTAL_HEXAGONAL, Quelle pro Level; 292×318, Ränder nahtlos horizontal)"
  mapping: >
    Composition über children: DrillRailCardName/-Description werden in die Info-Region
    gehoben, JEDES andere Kind = PARTS-Item — hasChildren/childrenCount werden ABGELEITET
    (keine Props; Figma-Props Count/hasChildren entfallen). Parent-Props: level (required)
    · container (bool) · origin ('custom'|'shadcn') · selected (State=Selected; Hover =
    CSS) · expandable (bool-Flag: Karte BESITZT den Toggle — uncontrolled, interner
    State) · defaultExpanded (Seed für uncontrolled, default true) · expanded
    (CONTROLLED override; false = Collapsed-Set) · onExpandedChange (meldet jeden
    Toggle mit dem NÄCHSTEN Zustand, beide Modi) · storybookHref (Link-Zeile entfällt
    ohne URL).
  skill: manueller Figma→Code-Erstbau (/storybook-rules + /docgen-props für Story/Props)
  notes: >
    Karten-Rezept (expanded = collapsed): unselected bg-inverse-fill ohne Stroke ·
    hover:bg-inverse-container-low · selected bg-inverse-container-low + 1px border-
    level-{level} (sonst border-transparent für stabile Geometrie). corner-lg · p-xl ·
    gap-lg; Collapsed h-8/px-xl/py-md/gap-sm, Name text-format-label-sm, Chevron
    RiArrowDownSLine size-3 (inverse-ink-muted). Container: Textur als EIN SVG-Alpha-
    Pattern (texture.svg — horizontal nahtlos, 292.333 = 27×10.827-Perioden; 55 Reihen-
    Gesetz aus dem Figma-Halftone geparst) als mask-image repeat-x × Fade-Gradient
    (mask-composite intersect, drill-rail-card.css — CSS-Datei, weil die url() Vite-
    Auflösung braucht); Farbe = bg-level-{level} am Element (die Figma-Dot-Fills SIND
    die Level-Akzente, verifiziert #9B87F5/#35C9B0/#A4E5FF) · absolute -inset-px -z-10 ·
    opacity-5 + mix-blend-exclusion; root `isolate` hält den Blend in der Karte.
    DrillRailCardName mit asChild (Radix Slot, @radix-ui/react-slot) — Headline-Level
    von außen wählbar; die Collapsed-Zeile entpackt das geslottete Element (Text ohne
    Heading in der Row). Name-Typo container-abhängig via
    group-data-container/drill-card: text-format-title (18) → text-format-heading-sm
    (22) — kein Context nötig. CONTAINS-Zeile: text-format-data-sm muted + RiArrowDownLine
    size-2 + "{n} PARTS". Header-Origin bleibt neutral (inverse-ink), NUR der Collapsed-
    Glyph ist level-getintet. Interaktion = TOGGLE mit controlled/uncontrolled-Pattern:
    expandable allein schaltet scharf und die Karte besitzt den State (uncontrolled,
    Seed defaultExpanded); expanded-Prop pinnt den State (controlled, Host wendet
    onExpandedChange an); ohne Flag statisches Display. Collapsed-Zeile wird <button
    aria-expanded=false> und feuert (true); expandiert wird der KOMPLETTE Header zur
    Collapse-Schaltfläche (aria-label="Collapse", feuert false; Chevron-Up als visuelle
    Affordance) — symmetrisch zur Collapsed-Zeile als Ganz-Zeilen-Ziel; Badge/Origin
    sind nicht-interaktiv, also valides Button-Innenleben. FIGMA-SCHULD: die Collapse-
    Affordance hat KEIN Figma-Gegenstück (minimal gehaltener Kandidat, Design offen). Die Rail nutzt controlled (Pfad = State-Owner). Stories
    Default (play: Count-Derivation + Info-Lifting)/ExpandCollapse (uncontrolled-Demo
    OHNE State-Owner, play: voller Zyklus + aria-expanded)/Uncontrolled (NUR
    expandable+defaultExpanded als scoped Live-Controls; key-Remount, weil der Seed nur
    beim Mount gelesen wird)/AncestorChain (Name via
    asChild als h2, Collapsed-Anker controlled gepinnt)/AllStates (pseudo-hover) +
    SUB-PART-SEITE
    drill-rail-card-name.stories.tsx (storybook-rules Composite-Regel: Part mit
    kuratiertem Prop → eigene Autodocs-Seite, Stories im festen Card-Scaffold, asChild
    control:false auf Text-Children + dedizierte AsChild-Demo, Cross-Links Eltern↔Part;
    Description = prop-loser Passthrough, KEINE Seite). Spec 9 Tests (Partition, State-
    Rezept, Textur+Heading-Flag, Collapsed-Faltung, uncontrolled-Zyklus, controlled-
    Pinning, expandable-Gate, asChild-Slotting+Unwrap).
    DEV-QUIRK (2026-07-02, betrifft alle neuen
    Showcase-Components): legt man eine NEUE Datei an, fehlen deren Tailwind-Kandidaten
    im bereits gecachten CSS-JS-Modul des laufenden Storybook-Dev-Servers (auch nach
    Reload/Neustart-Race) → vor dem Shoot `touch apps/agentport/src/styles.css`; Gate/
    Vitest kompilieren immer frisch.
```

## Befehle / Skills

- Neuer Erstport: `/shadcn-component-port <name>` · Figma→Code-Sync: `/component-sync <name>`
- Vor Port/Sync Lücken-Logging: `/skill-feedback kind=component-port subject=<name>`
- Gate (Lib): `npx nx test|typecheck|lint @agentport/ui`
- Nova-Source vor `ui:add` ansehen: Registry-JSON `https://ui.shadcn.com/r/styles/radix-nova/<c>.json`
- Token-Crosswalk: `design-docs/design-system/tokens-reference.md`

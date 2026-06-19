# Component-Port — Select (radix-nova → Agentport DS)

**Date:** 2026-06-19 · **Branch:** `feat/select-port` · **Skill:** `/shadcn-component-port` + `references/composites.md`
**Status:** in progress — Figma build delegated to a background agent (T4+T5); code (T6) in main.

## Decisions (user, T2.7)

- **Trigger fill = `bg-input-fill`** (Input-Parität). Nova-Source ist `bg-transparent`; unsere Feld-Familie
  (Input/Textarea/InputGroup) trägt opakes `input-fill` → der geschlossene Trigger liest identisch zu den
  Feld-Geschwistern. Bewusste Abweichung von Nova.
- **Scope = volles Composite** — Trigger-Set + Item-Set + offenes Content-Panel + permanente Usage-Examples
  (Done-Test).

## Dependency-Audit (composite §2 T2)

`npm run ui:add -- select` schrieb **nur** `select.tsx` (flat) — **keine** Foreign-Component-Files (Nova-Select
hängt nur an `radix-ui` + IconPlaceholder, keine eigenen Sub-Components). Audit sauber.

- **`radix-ui` Umbrella-Import BEHALTEN** — `"radix-ui": "^1.5.0"` ist deklarierte Dep in `libs/ui/package.json`;
  Dialog importiert identisch (`import { Dialog as DialogPrimitive } from 'radix-ui'`). Finding #3 (per-primitive)
  galt nur dem Breadcrumb-`Slot`-Fall, nicht vollen Primitives. → Select: `import { Select as SelectPrimitive } from 'radix-ui'`.
- **`lucide-react` NICHT installiert** → Icon-Swap auf `@remixicon/react` (vorhanden, `^4.9.0`) ist Pflicht (Finding #1):
  - `ChevronDownIcon` → `RiArrowDownSLine` (Trigger + ScrollDownButton)
  - `ChevronUpIcon` → `RiArrowUpSLine` (ScrollUpButton)
  - `CheckIcon` → `RiCheckLine` (ItemIndicator)
  - `*-s-line`-Chevrons: exakter Pfad aus `node_modules/@remixicon/react` verifizieren (MCP listet sie ggf. nicht).

## Anatomy (parts, data-slot)

| Part | data-slot | Rolle |
|---|---|---|
| Select | select | Radix Root, kein Styling |
| SelectValue | select-value | Display-Wert (gestylt über Trigger-`*:data-[slot=select-value]`) |
| **SelectTrigger** | select-trigger | geschlossener Control-Button; CVA-`size [sm,default]`; Chevron-down |
| **SelectContent** | select-content | Dropdown-Panel (Portal); hält ScrollUp + Viewport(items) + ScrollDown |
| **SelectItem** | select-item | Options-Zeile; focus-highlight + Check-Indikator rechts |
| SelectGroup | select-group | `p-1` Gruppen-Container |
| SelectLabel | select-label | Gruppen-Caption (muted) |
| SelectSeparator | select-separator | full-bleed 1px-Linie |
| SelectScrollUp/DownButton | select-scroll-* | Scroll-Affordance mit Chevron |

## Composition-Plan / Exposure-Model (Figma)

Select ist ein **Popover-Composite** (Dropdown portaled, nur „open" sichtbar). Figma kann nicht „öffnen" →
offener Zustand als statische Composition (wie Command/Dialog). Vier Build-Layer (composites.md T4):

1. **Trigger-Set** — `size [sm, default]` × `state [default, focus, disabled, invalid]` (8 Member).
   Input-Klon: nest/mirror `.Input` (Set `3177:302`, default-Member `3176:303`, focus `3176:305`, invalid `3176:311`).
   Value = TEXT-Slot/Prop (Placeholder-Default greyed, Konvention `{Value}`); Chevron-down = fixer Vektor (RiArrowDownSLine, muted-ink).
   Focus/Invalid-Glow = literal-Alpha DROP_SHADOW `showShadowBehindNode:false` **verbatim vom `.Input`-Focus** (Finding #30).
2. **Item-Set** — `state [default, focus, disabled]` + Boolean `selected` (Check sichtbar). CommandItem-Muster
   (mirror `CommandItem` Set `3559:2`: state default/selected/disabled/checked). Label = TEXT-Prop; optionaler
   Leading-Icon-Slot; Check rechts (RiCheckLine, sichtbar bei `selected`).
3. **Content-Panel-Composition** — Command-Surface (mirror `Command` composition `3642:2`): `dialog-fill` + `border`
   + `shadow-elevation` (Effect Style) + `corner-lg`; **Slot** für Items (variabel viele) + optional Label/Separator.
4. **Usage-Examples-Gruppe** (Done-Test) — gelabelte vertikale AL-Gruppe unter den Sets, reine Instanzen:
   Basic · Groups (Label + nested `.Separator` `3676:1018`) · Scrollable · Invalid (nested `.Field`-Instanz).

Bind **jede** Property per Variable-**ID**. Section-Kinder = section-relative Koords. Section via `/figma-create-section`.

## T3 — Mapping-Table (stock radix-nova → DS), per part

**Geometrie bleibt numerisch** (h-8/h-7, size-4, min-w-36); nur Farbe/Typo/Spacing/Radius binden. `dark:*` überall gedroppt.

### SelectTrigger
| stock | DS | why |
|---|---|---|
| `gap-1.5` (6) | `gap-sm` | §6 spacing by px |
| `rounded-lg` | `corner-lg` | Feld-Radius (= Input) |
| `data-[size=sm]:rounded-[min(--radius-md,10)]` | `data-[size=sm]:corner-md` | min() kollabiert auf radius-md=6 |
| `border border-input` | `border border-input-border` | §6 color-rename |
| `bg-transparent` | **`bg-input-fill`** | **User-Decision** — Input-Parität (opake Feld-Fläche ink/25) |
| `py-2` (8) | `py-md` | unter fixed h-8/h-7 nur Zentrierung |
| `pr-2`/`pl-2.5` (8/10) | `px-md` (8/8) | symmetrisch = Input-Parität; pl-2.5(10)→md(8)-Snap (kein 10er-Rung) |
| `text-sm` | `text-format-label` | Form-Control-Text (14/500, = Input-Value) |
| `data-placeholder:text-muted-foreground` | `data-placeholder:text-input-ink-placeholder` | Placeholder-Rolle (= Input), NICHT muted-ink |
| `focus-visible:border-ring` | (behalten) | ring-Token-Name unverändert |
| `focus-visible:ring-3` / `aria-invalid:ring-3` | `ring-[3px]` | Sibling-Konvention (Finding #31) |
| `focus-visible:ring-ring/50` | (behalten) | |
| `aria-invalid:border-destructive` / `aria-invalid:ring-destructive/20` | (behalten) | destructive = ⚠-Platzhalter, gebunden aber nicht final |
| `disabled:cursor-not-allowed disabled:opacity-50` | (behalten) | numerisch |
| `data-[size=default]:h-8` / `data-[size=sm]:h-7` | (numerisch) | Control-Geometrie |
| chevron `text-muted-foreground` `size-4` | `text-muted-ink` + `size-4` | Icon currentColor-Rolle |
| `*:data-[slot=select-value]:…gap-1.5` | `gap-sm` | Value-Row-Gap |

### SelectContent
| stock | DS | why |
|---|---|---|
| `rounded-lg` | `corner-lg` | Panel-Radius (= Command default) |
| `bg-popover` | `bg-dialog-fill` | popover→dialog konsolidiert (2026-06-18) |
| `text-popover-foreground` | `text-dialog-ink` | dito |
| `shadow-md` | `shadow-elevation` | erhabenes Menü → Tiefe trägt Bedeutung (= Command/Dialog) |
| `ring-1 ring-foreground/10` | `border border-border` | Command-Idiom: ring durch border ersetzt (Raised-Surface-Tiefe) |
| `min-w-36`, `z-50`, `overflow-*`, animations | (behalten) | Sizing/Plumbing; data-state-Animations sind stock |

### SelectItem
| stock | DS | why |
|---|---|---|
| `gap-1.5` (6) | `gap-sm` | |
| `rounded-md` | `corner-md` | |
| `py-1` (4) | `py-xs` | |
| `pr-8` (32) | `pr-3xl` | Check-Indikator-Clearance (absolute right) |
| `pl-1.5` (6) | `pl-sm` | |
| `text-sm` | `text-format-label` | Menü-Text (= Trigger-Value) |
| `focus:bg-accent` | `focus:bg-accent-fill` | Highlight = accent-Tint (= Command-Selektion) |
| `focus:text-accent-foreground` | `focus:text-accent-ink` | |
| `data-disabled:opacity-50` + `pointer-events-none` | (behalten) | |
| Check-span `absolute right-2` `size-4` | `right-md` + `size-4` | inset-Familie §3; Icon numerisch |
| `not-data-[variant=destructive]:…` | **droppen** | Nova-SelectItem hat KEIN `variant`-Prop → Selektor inert |

### SelectLabel
| stock | DS | why |
|---|---|---|
| `px-1.5` (6) / `py-1` (4) | `px-sm` / `py-xs` | |
| `text-xs` (12) | `text-format-label` | **kein 12px-Sans** → Rolle-Snap auf 14 (Findings #20/#28); Hierarchie trägt die Farbe |
| `text-muted-foreground` | `text-muted-ink` | quiet caption |

### SelectSeparator
| stock | DS | why |
|---|---|---|
| `-mx-1` (-4) / `my-1` (4) | `-mx-xs` / `my-xs` | |
| `h-px` | (numerisch) | 1px-Linie |
| `bg-border` | `bg-border` | Name behalten (nur Wert neu, wie Separator-Port) |
| **Figma:** nest `.Separator` (horizontal, `3676:1018`) | | FieldSeparator-Idiom |

### SelectScrollUp/DownButton
| stock | DS |
|---|---|
| `bg-popover` | `bg-dialog-fill` |
| `py-1` (4) | `py-xs` |
| chevron `size-4` | (numerisch, currentColor) |

### SelectGroup
| stock | DS |
|---|---|
| `p-1` (4) | `p-xs` |
| `scroll-my-1` | (numerisch — keine benannte scroll-margin-Familie) |

## T2.5 — Example-Inventory (Stories)

Quelle: `ui.shadcn.com/docs/components/select`. Strukturell-distinkt, dedupliziert:

| Example | kept/skip | Komposition |
|---|---|---|
| Basic | kept (Default playground+play) | Trigger + Content + 1 Gruppe Items, Placeholder |
| Groups | kept | SelectGroup + SelectLabel + SelectSeparator + Items |
| Scrollable | kept | lange Liste (Timezones) → Scroll-Buttons erscheinen |
| Disabled | kept (States) | disabled Item + disabled Trigger |
| Sizes | kept (States) | sm + default Trigger |
| Invalid / mit Field | kept | `.Field` + `FieldLabel` + `FieldError` um Trigger (`aria-invalid`) — Field ✓ portiert |
| „Align item with trigger" (position) | dedupe → Default-Control | position popper/item-aligned = Prop, kein eigenes Struktur-Story |
| Form (react-hook-form) | **skip + log** | un-ported Dep (react-hook-form) |
| RTL | **skip + log** | Direктionality, kein DS-Struktur-Belang |

## T6 — Code status (DONE)

- `select.tsx` re-clothed per T3 → `libs/ui/src/components/ui/select/` (folder + barrel `index.ts` + root-Barrel re-export).
- Icons: lucide → `@remixicon/react` (RiArrowDownSLine/RiArrowUpSLine/RiCheckLine, verified present). `radix-ui` umbrella import KEPT (= Dialog convention; declared dep). Inert `not-data-[variant=destructive]` selector dropped (no `variant` prop in nova SelectItem).
- docgen: `SelectProps` (Omit+re-declare value/defaultValue/onValueChange/open/defaultOpen/onOpenChange/disabled/required/name) + `SelectTriggerProps` (`size` named-alias union + disabled). `/docgen-props`-konform.
- Stories: Default (playground + play: open→select Blueberry→assert value→blur) · Groups · Scrollable · Disabled · WithField (Field-Komposition, invalid) · TriggerStates (size×state gallery, pseudo-focus). **Skip-log:** RTL (locale), Form/react-hook-form (un-ported dep).
- Spec: 6 jsdom tests (data-slot, combobox role, size default/sm, disabled, corner-lg + text-format-label survival). **No jsdom polyfill needed** — closed render only; the open-dropdown path runs in the Chromium storybook project.
- **GATE GREEN** (2026-06-19): `typecheck` ✓ · `test` ✓ (236 total: select.spec 6 + select.stories 6 incl. play + axe) · `lint` ✓ (0 errors; 46 pre-existing warnings, none in select/*).
- **Visual eyeball (shoot):** TriggerStates → input-fill + 3px focus ring-ring/50 + destructive invalid ring + sm<default height confirmed; WithField → real Field composition (label/desc/error + invalid ring). Open-dropdown visual = play-test render + token-parity with validated Command surface + Figma agent verify.

## T4+T5 — Figma build (DONE, Background-Agent `figma-select-build`)

File `FIGMA_FILE_KEY`, page Shadcn Components `3126:2`. **Section `Select` `4307:1997`**. `/figma-verify`
CLEAN über alle 3 Sets + Composition + 4 Examples (0 text-as-icon, 0 clip, 0 overlap); controls-live ALL PASS;
keine orphan slot-props. IDs vollständig im Katalog-Eintrag (`components-reference.md`).

- **Trigger-Set `4308:2029`** — `size [default, sm] × state [default, focus, disabled, invalid]` (8 Member).
  value-TEXT-Prop `{Value}` + Chevron-Vektor. Focus-Glow = `.Input`-DROP_SHADOW VERBATIM (finding #30c);
  invalid-Glow synthetisiert (`.Input`-invalid-Member `3176:311` trägt `effects:[]` → nichts zu kopieren — bestätigt #30c).
- **Item-Set `4313:2046`** — `state [default, focus, disabled] × selected [false, true]` (6 Member). leadingIcon-SLOT
  (default RiUserLine) + label-TEXT + Check-Vektor (visible↔selected). focus = accent-fill + accent-ink.
- **Content-Composition `4314:1997`** — items-SLOT + `showScrollUp`/`showScrollDown`-Bools; Command-Surface
  (dialog-fill + border + Elevation-Effect-Style + corner-lg).
- **Usage-Examples `4315:2106`** — Basic/Groups/Scrollable/Invalid (Invalid nestet echte `.Field`-Instanz `3713:1017`).
- Icons = Remix-Vektoren via `createNodeFromSvg` (RiArrowDownSLine/-UpSLine/RiCheckLine/RiUserLine, 24-viewBox-Pfad
  aus dem React-Export gezogen — MCP listet die `*-s-line`-Chevrons nicht).

## Code↔Figma-Divergenzen (für künftigen `/component-sync` — NICHT als Token-Delta lesen)

- **D1 — SelectItem-Check-Positionierung:** Figma = trailing Layout-Vektor bei `pr-md`(8)/`right-2`; Code = `absolute right-md`
  + `pr-3xl`(32) Clearance (shadcn-Idiom). Visuell äquivalent, strukturell verschieden. **Kein Code-Edit** — Code ist
  faithful zum shadcn-Idiom.
- **SelectLabel** = Figma inline-Text in der Content-Slot (kein eigenes Set); Code = `SelectLabel`-Component.
- **`size`-Achse** mappt aufs echte Code-Prop `SelectTrigger.size` (KEIN Fork).
- **`selected`-Boolean** (Figma) = Radix `data-state=checked` (kein Code-Prop; reines Styling).
- **Docs-Layout (Option 2, User):** `meta.component=Select` + `subcomponents:{SelectTrigger}` → Root-Props in der
  Haupt-ArgsTable, `size` in der SelectTrigger-Sub-Tabelle. Playground behält den `size`-Control (Story-lokal).

## Open items

- `destructive` (invalid-Ring/Border) = ⚠-Platzhalter-Token — gebunden, nicht final (geteilt mit Input/Field/Checkbox…).

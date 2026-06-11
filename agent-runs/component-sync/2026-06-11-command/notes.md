# component-sync · 2026-06-11 · Command

Sync der neuen Figma-Variant-Achsen in den Code (Figma → Code). Sets: `.Command` `3642:2`,
`.Command/Input` `3639:2`, `.Command/Group` `3640:9`, `.Command/Separator` `3653:6` (alle
`variant`-Achse, 2026-06-11 gebaut aus C2-Frame `3554:859`). `.Command/Item` `3559:2` unverändert.
API-Fixierungen (User, Plan `melodic-cooking-church.md` Teil B): variant nur auf der Command-Root +
Context-Vererbung; Items unverändert; CommandSeparator bekommt `label`.

## Delta (pro Member: Figma-Wert → Code-Utility)

| Member | Figma (live Bindings) | Code |
|---|---|---|
| `.Command` palette | p 0 (raw) · `Corner/corner-md` · stroke 1.5 (raw) · `Overlay/overlay` · Effect `Elevation` | cva `palette: 'corner-md border-[1.5px]'` (kein Padding; overlay/elevation aus der Base), `data-variant` + `CommandVariantContext`-Provider |
| `.Command/Input` palette | row · `shadcn Default/card` · pad `space-xl` · gap `space-lg` · Caret 2.5×18 `shadcn Default/primary` + Effect `Glow` (radius 1 raw) · value/placeholder Text-Style `Input`, fills `foreground`/`Input/input-placeholder` · Kbd-Instanz | Wrapper `flex items-center gap-lg border-b bg-card p-xl`; Caret-Span `h-[18px] w-[2.5px] bg-primary shadow-glow`; Input `min-w-0 flex-1 text-input text-foreground caret-primary placeholder:text-input-placeholder`; `<Kbd>Esc</Kbd>` |
| `.Command/Group` palette | Container pad `[0, space-md, 0, space-md]` · Heading = genestete `.Command/Separator[labeled]`-Instanz | Container `px-md`; Heading per `**:[[cmdk-group-heading]]:` → `flex items-center gap-md px-md pt-lg pb-sm text-eyebrow uppercase text-muted-foreground` + `after:`-Rule (`h-px flex-1 bg-border`) — px-Abweichung s. Deviations |
| `.Command` palette · list-Slot | padT/padB `space-md` | `CommandList` + `py-md` (Context) |
| `.Command/Separator` labeled | row `gap space-md` · pad `[space-lg, space-xl, space-sm, space-xl]` · Label fill `muted-foreground`, textCase UPPER (Style detached) · Rule h1 fill `border`, FILL | `label`-Prop → `div role=separator` `flex items-center gap-md px-xl pt-lg pb-sm` + Eyebrow-Span + `h-px flex-1 bg-border`; **gleicher hide-on-search-Vertrag wie die Linien-Form** (`useCommandState`, `alwaysRender`-Opt-out — Nachschärfung auf User-Review) |
| `.Command/Separator` default in p-0-Panel | FILL im randlosen Panel | Linie verliert `-mx-xs` im palette-Context (`h-px bg-border`) |
| CommandDialog (kein Figma-Artefakt) | — | `variant`-Pass-Through; DialogContent + `corner-md border-[1.5px]` bei palette |

Default-Member: alle unverändert → kein Delta am Bestand (Default-Klassenstrings byte-identisch,
Bestands-Specs unverändert grün).

## DEVIATIONS (Code ≠ literales Figma-Binding)

| Member | Property | Figma sagt ↔ Code nutzt | Warum |
|---|---|---|---|
| `.Command/Group` palette | Heading-Struktur + px | genestete `Separator[labeled]`-Instanz mit `px-xl` → Label-Einzug **24px** (Group px-md 8 + Instanz 16) ↔ Heading-Styling `px-md` → Einzug **16px** | Die Instanz-Nestung kam nach dem User-Gate ins File (Architektur-Dedup ok), aber der px-xl-Default der Instanz verschob das Label 8px gegen das approbierte C2-Raster. **AUFGELÖST 2026-06-11:** Instanz-Padding im Group-Member auf `space-md` overridet (Node 3645:1039) — Label-Einzug 16px, deckungsgleich mit Code + C2-Frame, im Beispiel 3650:63 verifiziert. Folge der Nestung: das `heading#3640:1`-Prop ist im palette-Member inert — Gruppen-Titel laufen dort über das `label#3653:1`-Prop der genesteten Separator-Instanz. |
| `.Command` palette | Prompt-Divider | eigene `Separator`-Instanz zwischen Input und Liste ↔ `border-b` am Input-Wrapper | Code-Ergonomie: Konsument schreibt `<CommandInput/><CommandList/>` ohne Pflicht-Separator; visuell identisch. |
| `.Command` palette | Footer-Divider | `Separator`-Instanz nach dem list-Slot ↔ Kompositions-Detail (Story setzt `<CommandSeparator alwaysRender/>`) | Kein Komponenten-Feature; bewusst beim Konsumenten. |
| `.Command/Input` palette | Caret-Radius 1px (raw) | ohne Radius | Bei 2.5px Breite unsichtbar; `rounded-*` ist im DS tot, 1px hat keine corner-Stufe. |
| `.Command/Input` palette | value+placeholder koexistent (Mid-Typing-Mock) | Standard-Placeholder-Verhalten, echte Caret via `caret-primary` | Frame zeigt einen Zustand, kein Ghost-Text-Feature (Plan-Fixierung). |
| `.Command/Separator` labeled + `.Command/Group` Heading | Text-Style `Eyebrow` **detached** (textCase-UPPER-Override löst den Style) | `text-eyebrow uppercase` | Pre-existing Pattern-Defekt auch am Bestands-Heading; Code bindet ans Format. **Figma-Fix-Kandidat:** Style re-applizieren, UPPER neu setzen. |
| Items / Shortcut | Frame zeigt px-xl/py-md/text-label + text-data-Meta | unverändert `px-md py-sm text-body` / `text-kbd` | User-Entscheid „items sind gleich"; 16px-Flucht stattdessen via Group `px-md`. |

## Gate

`nx test|typecheck|lint @agentport/ui` grün — **50 Tests** (Bestand 42 + 8 neue: Default-Regression,
Palette-Surface, Context-Vererbung Input, Labeled-Rule-Heading, List py-md, Separator labeled/mx,
Dialog-Pass-Through). Typo-Survival: `text-input` + `caret-primary` im Markup verifiziert.

## Storybook-Previews

- Palette: http://localhost:6006/?path=/story/ui-command--palette
- Palette In Dialog (⌘K): http://localhost:6006/?path=/story/ui-command--palette-in-dialog
- Palette Flat (labeled Separators): http://localhost:6006/?path=/story/ui-command--palette-flat
- Default (Regression): http://localhost:6006/?path=/story/ui-command--default

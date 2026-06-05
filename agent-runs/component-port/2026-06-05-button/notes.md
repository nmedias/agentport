# Component-Port Pilot — Button (2026-06-05)

Erster End-to-End-Durchgang shadcn → Figma → Code. Zweck: die wiederholbare Prozedur
entdecken (Skill-Seed, Phase C) und token-treu am Button verifizieren.

## Ergebnis (kurz)

- **Figma:** Component-Set `.Button` mit Properties `variant`×`size`, 9 Varianten, alle Fills/
  Strokes/Text/Radius/Padding/Gap an DS-Variablen gebunden, Typo via Text-Style `Label`,
  Icon als Vektor. `/figma-verify` = **CLEAN** (0 Flags).
- **Code:** `button.tsx` CVA auf DS-Utility-Vokabular portiert. libs/ui **Lint+Test+Typecheck grün**.
- **Kritischer Fix:** `cn()` musste erweitert werden, sonst verschluckt twMerge die `.text-*`-Typo-Klasse (s. u.).

## Quelle = `design-docs/design-system/tokens-reference.md`

Werte/Utilities/Semantik kommen aus der Referenz; der Pilot dupliziert sie nicht.

## B1 — shadcn-Anatomie

`button.tsx` (new-york) CVA: `variant` = default/secondary/outline/ghost/destructive/link;
`size` = default/sm/lg/icon. Slot-Pattern (`asChild`), Icon optional (`[&_svg]`).

## B2 — Figma-Build (Plugin MCP, `figma-use`)

Datei `FIGMA_FILE_KEY`. Inkrementell (≤10 Ops/Call), nach jedem Schritt Screenshot.

**Node-IDs:** Page `Components` 3126:2 · Section `Button` 3126:3 · Set `.Button` **3131:2**
· Komponenten 3127:2/4/6 (default,secondary,outline) · 3128:2/4/6 (ghost,destructive,link)
· 3129:2/4 (sm,lg) · 3130:2 (icon).

**Variable-IDs (semantic):** primary 3037:8 · primary-foreground 3037:9 · secondary ⚠ 3037:10 ·
secondary-foreground ⚠ 3037:11 · accent 3037:14 · accent-foreground 3038:2 · destructive ⚠ 3038:3 ·
border 3038:4 · background 3037:2 · foreground 3037:3. **(semantic-dimension):** radius-md 3073:3 ·
space-sm 3070:5 · space-md 3070:6 · space-lg 3070:8 · space-xl 3070:9 · space-2xl 3070:10.
**Text-Style:** Label `S:4e034695df7aacfcebc7042471b1b11284b266f0,`.
*(Variablennamen tragen Gruppenpfade, z. B. `shadcn Default/primary` — über die ID binden, nicht den Namen.)*

**Build-Rezept (component-agnostisch — Skill-Kern):**
1. Recon: `getLocalVariableCollectionsAsync` + `getLocalVariablesAsync` → Name→ID-Map; `getLocalTextStylesAsync` → Format→ID.
2. Pro Variante 1 `createComponent`, `layoutMode='HORIZONTAL'`, primary/counterAxis `CENTER`.
3. Text: `createText` → `setTextStyleIdAsync(formatId)` (Font vorher `loadFontAsync` — Label = Hanken Grotesk Medium), Fill via `setBoundVariableForPaint({type:'SOLID',color:{r,g,b}}, 'color', variable)` (gibt **neues** Paint zurück → zuweisen).
4. Fläche/Border: `c.fills = [boundPaint]` bzw. `c.strokes=[boundPaint]; strokeWeight=1; strokeAlign='INSIDE'`. Transparent (ghost/link) → `c.fills=[]`.
5. Radius/Padding/Gap binden: `c.setBoundVariable('topLeftRadius'|…|'paddingLeft'|'paddingRight'|'itemSpacing', variable)`. Spacing-Vars haben Scope `GAP` → decken Gap **und** Padding.
6. **Control-Höhe numerisch** (kein Token): `c.resize(w, h)` **dann** `layoutSizingHorizontal='HUG'`, `layoutSizingVertical='FIXED'` (resize resettet Sizing → danach setzen).
7. Icon-Size: `createNodeFromSvg(svg16)`, inneren VECTOR umfärben (Fill an `primary-foreground` binden), zentriert; Button fixed square.
8. `combineAsVariants(comps, section)`; Komponentennamen `variant=X, size=Y` → Properties werden automatisch abgeleitet. Set in Section legen, Wrap-Auto-Layout.

## B3 — `/figma-verify`: CLEAN

8 TEXT (alle „Button", Label-Format, keine Glyph-Icons) · 1 VECTOR (Plus) · 0 Overflow ·
Padding L=R symmetrisch · keine Overlaps.

## B4 — Code-Port (`button.tsx`)

Übersetzung nach Referenz §6 (über den **px-Wert** mappen, nicht die Tailwind-Zahl):

| Stock | → DS |
|---|---|
| `text-sm font-medium` | `text-label` |
| `shadow-xs` | entfernt (DS flach) |
| `gap-2` (8) | `gap-md` |
| `gap-1.5` (6) | `gap-sm` |
| `px-4` (16) | `px-xl` |
| `py-2` (8) | `py-md` |
| `px-3` (12) | `px-lg` |
| `px-6` (24) | `px-2xl` |
| `px-2.5` (10) | numerisch (kein Token) |
| `h-8/h-9/h-10`, `size-9`, `size-4` | numerisch (Control-Geometrie) |
| `rounded-md`, `bg-primary`, `text-primary-foreground`, `ring-ring/50`, `ring-[3px]`, `bg-primary/90` | unverändert (DS / gültig) |

## Kritischer Befund — twMerge verschluckt `.text-*` (component-agnostisch!)

`cn()` = `clsx` + `twMerge`. Stock-twMerge klassifiziert **jedes** `text-*` als „text-color"-Gruppe.
`text-label` + `text-primary-foreground` → als Konflikt gewertet → nur die letzte überlebt → **Typo-Klasse
fällt raus** (im gerenderten Markup fehlte `text-label`). Fix in `libs/ui/src/lib/utils.ts`:
`extendTailwindMerge<'text-format'>` mit eigener Gruppe für die 11 Formate (`{ text: [display,…,input] }`),
damit sie nur untereinander konfligieren, nie mit Text-Farben. **Diese Erweiterung ist Voraussetzung
dafür, dass die DS-Typo-Utilities in JEDER Component greifen** → gehört als Setup-Schritt in den Skill.

## Gate

- `libs/ui` (Button-Port): **Lint ✓ · Test ✓ · Typecheck ✓**; `text-label` überlebt cn() nach dem Fix.
- `npm run check` gesamt **rot nur** wegen `agentport:test` „should render the app title": Working-Tree hat
  uncommitteten Fremd-Edit `Agentport`→`agentport` in `app.tsx` (nicht aus diesem Pilot). Offen für User.

## Nachtrag — Voll-Matrix 24 + Icon-Slot (erledigt)

- Set `.Button` (`3131:2`) auf **alle 24** `variant`×`size` ergänzt (15 Komponenten nachgebaut, an die
  bestehenden Bindings/Styling-Map angelehnt). `/figma-verify` CLEAN (24 comps, 0 Overflow/Asymmetrie).
- **Icon = echter Figma-Slot** (nicht Instance-Swap): pro Icon-Größen-Variante `component.createSlot()`,
  konsistent `Icon` benannt → mergt zu **einer** set-weiten `SLOT`-Property (`Icon#3137:0`). Default-Content
  = Remix-`add-line`-Vektor (16px) im Slot, Fill je Variante an das Text-Token gebunden. Slots sind
  per-Component → die Property liegt nur auf den Icon-Varianten (ok). Code-Seitig ist das Pendant das
  `children`-Slot des Buttons (Remix-Komponente reinreichen).

## Offen / Folge

- ~~Voll-Matrix 24~~ erledigt (s. Nachtrag).
- Visuelle Storybook-Sichtprüfung (`npm run storybook`).
- Hover/Focus/Disabled sind im Code abgebildet, in Figma nur Default-State gebaut (Figma-Variants später).
- `secondary`/`destructive` = ⚠-Platzhalter (Stock-Hex), nicht final.
- Optional: Code Connect (Figma `.Button` 3131:2 ↔ `button.tsx`).

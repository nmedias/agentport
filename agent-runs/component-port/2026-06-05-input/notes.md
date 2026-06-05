# Component-Port — Input (2026-06-05)

Zweiter Lauf der `/component-port`-Pipeline (TDD-REFACTOR: Skill an einer zweiten Anatomie
validieren). Input ist bewusst *anders* als der Button-Pilot: **keine CVA-Varianten** im
Stock-shadcn → der einzige sinnvolle Figma-Achsenträger ist `state`.

## Ergebnis (kurz)

- **Figma:** Component-Set `.Input` mit Property `state` (5 Varianten: default · focus · filled ·
  disabled · invalid), alle Fills/Strokes/Text/Radius/Padding an DS-Variablen gebunden, Typo via
  Text-Style `Label`. `/figma-verify` = **CLEAN** (5 Member, 5 TEXT, 0 Flags/Hints).
- **Code:** `input.tsx` neu auf DS-Utility-Vokabular, `input.stories.tsx`, `input.spec.tsx`,
  Re-Export in `index.ts`. libs/ui **Test+Typecheck+Lint grün** (7 Tests).
- **Kein cn()-Fix nötig** — die `text-format`/Spacing-Erweiterung aus dem Button-Pilot trägt
  bereits; `text-body` überlebt twMerge (per Test abgesichert).

## Quelle = `design-docs/design-system/tokens-reference.md`

## Anatomie (T2)

Stock `input.tsx` (new-york-v4): **ein `<input>`**, `React.ComponentProps<'input'>`, **kein CVA**,
keine Varianten/Sizes. Parts: base · placeholder · `file:`-Pseudo · selection · focus-ring ·
`aria-invalid` · disabled. → Figma-Matrix = `state`-Achse (Interaktions-/Inhaltszustände), nicht
`variant×size`.

## Mapping-Tabelle (T3 — stock → DS, über den px-Wert)

| Stock | px | → DS | Grund |
|---|---|---|---|
| `h-9` | 36 | `h-9` | Control-Geometrie, numerisch |
| `w-full min-w-0` | — | unverändert | Struktur |
| `rounded-md` | 6 | `rounded-md` | Stock + Sibling-Button = rounded-md (s. offene Frage Radius) |
| `border border-input` | — | `border border-input` | DS-Token |
| `bg-transparent` | — | **`bg-input-background`** | DS-Felder sind **opak** (Border trägt die Erkennbarkeit) |
| `px-3` | 12 | `px-lg` | px-Wert-Map |
| `py-1` | 4 | `py-xs` | px-Wert-Map |
| `text-base` / `md:text-sm` | 16/14 | **`text-label`** | totes font-size → DS-Typo-Format. **Nicht `text-input`** (= mono 18px Command). *Stil im Figma-DS nachträglich von Body auf Label (Medium 14) gesetzt — wie Button; Code zog nach.* |
| `shadow-xs` | — | entfernt | tot, DS flach |
| `transition-[color,box-shadow]` | — | unverändert | Struktur |
| `placeholder:text-muted-foreground` | — | **`placeholder:text-input-placeholder`** | dedizierter DS-Token |
| `file:text-sm file:font-medium` | — | `file:text-label` | totes font-size/weight → DS-Format |
| `file:*` (Rest), `selection:*` | — | unverändert | Struktur / gültige DS-Token |
| `disabled:…` | — | unverändert | gültig |
| `focus-visible:border-ring ring-ring/50 ring-[3px]` | — | unverändert | gültige DS-Token + arbitrary |
| `aria-invalid:border-destructive ring-destructive/20` | — | unverändert (⚠ destructive Platzhalter) | gültig, Token noch Stock-Hex |
| `dark:*`, `md:text-sm` | — | entfernt | kein Dark-Mode; size in text-body gefaltet |

## Figma-Build (T4)

Datei `FIGMA_FILE_KEY` · Page `Components` 3126:2.
- Section **`Input`** `3176:302` (weiß + Headline „Input" Inter Bold 36 — wie Button-Sections).
- Set **`.Input`** `3177:302`, Property `state`. Member: default `3176:303` · focus `3176:305` ·
  filled `3176:307` · disabled `3176:309` · invalid `3176:311`.

**Variable-IDs (semantic):** input(border) 3038:5 · input-background 3108:2 · input-placeholder 3043:3 ·
foreground 3037:3 · ring 3038:6 · destructive ⚠ 3038:3. **(semantic-dimension):** radius-md 3073:3 ·
space-lg 3070:8 (px) · space-xs 3070:4 (py). **Text-Style:** Label `S:4e034695df7aacfcebc7042471b1b11284b266f0,`
(nachträglich von Body umgestellt).

**State-Rezept (flach, kein nested Base — Input braucht keinen):**
- default/filled/disabled = `border-input`; focus = `border-ring` + Ring; invalid = `border-destructive` + Ring.
- Ring = Drop-Shadow (spread 3, offset 0, radius 0): focus = ring @ 50 %, invalid = destructive @ 20 %.
- **Focus-Ring sichtbar nur mit `clipsContent=true` am effekt-tragenden Node** (Button-Learning,
  hier auch ohne Base-Nesting bestätigt) — Set `clipsContent=false`, damit der Ring nicht clippt.
- filled/invalid = Wert-Text in `foreground`; default/focus/disabled = Placeholder in `input-placeholder`.
- disabled = `opacity=0.5` am Member.
- Text-Child: `layoutSizingHorizontal='FILL'`, `textTruncation='ENDING'`, `maxLines=1`.

## `/figma-verify` (T5): CLEAN

5 Member · 5 TEXT (kein Glyph-Icon) · 0 Overflow · Padding L=R / T=B symmetrisch · keine Overlaps.

## Code-Port (T6)

`input.tsx` token-treu (s. Mapping). `input.spec.tsx` deckt u. a. **„text-body überlebt twMerge"** ab
(Regression-Guard für T1). Gate `nx test|typecheck|lint @agentport/ui` grün; 1 Lint-Warning ist
vorbestehend (`.storybook/main.ts`), nicht aus diesem Lauf.

## Learnings → in den Skill zurückgespielt

1. **Keine Stock-Varianten → `state`-Achse.** Wenn das CVA leer ist (oder es gar kein CVA gibt),
   ist die sinnvolle Figma-Achse `state` (oder Inhalt) — nicht `variant×size`. (T2/T4 ergänzt.)
2. **Feld-`bg-transparent` → `bg-input-background`** (DS-Felder opak). (Red-Flag ergänzt.)
3. **`placeholder:text-muted-foreground` → `placeholder:text-input-placeholder`** (dedizierter Token).
4. **`text-input` ist NICHT das Standard-Feld-Format** (mono 18px Command-Input) — Standardfelder =
   `text-body`. Namensfalle. (Red-Flag ergänzt.)
5. clipsContent-Ring-Regel auch ohne Base-Nesting gültig (bestätigt, keine Skill-Änderung nötig).

## Offene Punkte

- **Radius-Divergenz:** Referenz §2 sagt „Felder = radius-lg (8px)", Button + Input nutzen aber
  `rounded-md` (6px, Stock). Bewusst für Sibling-Konsistenz gehalten → DS-Entscheidung offen
  (beide gemeinsam auf radius-lg heben oder Referenz-`use` anpassen).
- **`destructive` bleibt ⚠ Platzhalter** (Stock-Hex) — invalid-State nicht final.
- **Focus-Ring-Effektfarbe roh** (ring @ 50 %, nicht variablen-gebunden) — wie Button-Pilot; Effekt-
  farben sind in Figma nicht als gebundene Variable gesetzt. Bei Bedarf später Effect-Style/Binding.

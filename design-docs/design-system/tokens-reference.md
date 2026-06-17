# Agentport DS — Token-/Format-Referenz (maschinenlesbar)

Eine Datenquelle für Component-Arbeit (Figma-Nachbau + Code-Verdrahtung). Prosa = Regeln/Architektur;
**YAML = Token-Daten** (Crosswalk Figma → CSS → Utility → Wert + `use`/`avoid`-Semantik).

Quelle: `token-analysis-{color,radius,spacing,typography,effects}.md`, `libs/ui/src/styles/`
(`tokens.css` + Tailwind-Config `tw-theme.css`/`tw-utilities.css`/`tw-variants.css`, Entry
`globals.css`), `Agentport/design-direction.md`. Bei Drift: **`tokens.css`/`tw-theme.css`/
`tw-utilities.css`** für Werte/Utilities, `token-analysis-*` für Semantik.

## Regeln

- **Semantik nur aus Quelle — kein Raten.** `use` = generische Rolle des Tokens; `avoid` = dokumentierte
  Einschränkung. Wo die Quelle nichts hergibt: `tbd`, Feld weglassen. Keine screen-spezifischen Beispiele.
- **`status: placeholder`** = Stock-shadcn-Default, noch nicht designt → nicht als final behandeln.
- Werte = Light-Mode (einziger Mode); Dark existiert noch nicht.
- Primitives sind intern (nicht im `@theme`) → in Komponenten nur **Semantics**, keine `bg-cyan-500`/`rounded-4`-Utilities.

## Schema

```
token | css_var | primitive | value | utilities | use | avoid? | status? | note?
```

## Architektur

```
Figma „Agentport DS" (fileKey FIGMA_FILE_KEY)
  reference = Primitives, EINE Collection mit Gruppen Color/ Dimension/ Font/ Effect (scopes:[]
              alias-only; Ausnahme Effect/* = EFFECT_*-Scopes, direkt von den Effect Styles gebunden)
  semantic* = Semantics (Alias → Primitive)
  CSS-Naming: Primitives = --ap-<figma-pfad-mit-dashes> (Color/signal/600 → --ap-color-signal-600,
              Font/family/sans → --ap-font-family-sans). Semantics = --ap-sys-<token-leaf> —
              Figma-Gruppen sind rein organisatorisch (Overlay/overlay-fill → --ap-sys-overlay-fill,
              Input/input-ink-placeholder → --ap-sys-input-ink-placeholder; shadcn Default/ ist flach,
              Sidebar/Chart-Untergruppen aufgelöst). semantic-typo: Org-Gruppe oben drauf,
              Token = format/part (Heading/heading-sm/family → --ap-sys-heading-sm-family;
              leading heißt line-height). Schatten: --ap-sys-shadow-glow/-elevation — sys-Tier
              nur im CSS (kein Figma-Pendant; Effect Styles binden die Effect/*-Teile direkt).
              Figma ohne Präfix.
        │ Export → libs/ui/src/styles/tokens.css   (:root: PRIMITIVES, dann SEMANTICS via var())
        │ Brücke → libs/ui/src/styles/tw-theme.css (@theme inline) + tw-utilities.css (@utility) +
        │          tw-variants.css (@custom-variant) — Entry/Seam: globals.css (importiert alle)
```

---

## 1 · Farbe

Primitives (intern; Figma-Gruppe `Color/` — die YAML nutzt die Kurz-Pfade, CSS = `--ap-color-…`).
**2026-06-17:** `neutral`+`cyan` ersetzt durch 7 OKLCH-Rampen (pencilcolor). `signal/still/deep`
= die drei OS-Blau-Rampen (Naming-Entscheid „Signal/Still/Deep", OS bleibt); `ink` = neutralisierte
Graustufen (Blaustich raus, C ×0.5) inkl. Sonderstufen `25`+`75`; `success/warning/error` = Status-Familie.

```yaml
base/white: "#ffffff"   # --ap-color-base-white
signal: { 50: "#c4feff", 100: "#a4e5ff", 200: "#7cceff", 300: "#51b6f3", 400: "#009fe3", 500: "#0081d2", 600: "#0063bb", 700: "#00459c", 800: "#002779", 900: "#000854", 950: "#010034" }   # Brand = signal/400 #009FE3; AA-Primary auf Weiß ab 600 (#0063BB ≥4.5:1)
still:  { 50: "#d8fbff", 100: "#bde4fd", 200: "#9fcdeb", 300: "#80b7d9", 400: "#61a1c8", 500: "#3a8cba", 600: "#0077a8", 700: "#005685", 800: "#003761", 900: "#00193d", 950: "#00001e" }
deep:   { 50: "#eaf8ff", 100: "#cfdde6", 200: "#b2c4cf", 300: "#97abb7", 400: "#7c93a0", 500: "#617c8b", 600: "#476575", 700: "#314f5e", 800: "#1e3947", 900: "#0d2531", 950: "#00121c" }
ink:       { 25: "#f9fcfd", 50: "#f3f5fa", 75: "#e4e6eb", 100: "#d5d8dd", 200: "#b8bbc0", 300: "#9b9fa5", 400: "#7f848b", 500: "#656971", 600: "#4b5059", 700: "#343840", 800: "#1e2229", 900: "#0d1016", 950: "#020306" }   # ink/800 = #1E2229 (Brand-Text, war #1A2230)
success:   { 50: "#defeec", 100: "#c6ead6", 200: "#abd7bf", 300: "#91c4a8", 400: "#76b192", 500: "#57a07a", 600: "#298058", 700: "#005f3a", 800: "#00401f", 900: "#002207", 950: "#000700" }
warning:   { 50: "#fff0c8", 100: "#fbd9ac", 200: "#eac18a", 300: "#d9a967", 400: "#c8923f", 500: "#af7000", 600: "#944f00", 700: "#753100", 800: "#541500", 900: "#340000", 950: "#160000" }
error:     { 50: "#ffe3d9", 100: "#ffc6bb", 200: "#fca69a", 300: "#e98779", 400: "#d66859", 500: "#c54235", 600: "#b01207", 700: "#8e0000", 800: "#6a0000", 900: "#440000", 950: "#220000" }
opacity:   { 10: "10% — Figma-Wert 10 (Opacity-Variablen = 0–100-Skala), CSS --ap-color-opacity-10: 10%" }
```

> **Effect-Farben** `glow`/`elevation` im CSS **an die neuen Rampen gebunden** (User-Entscheid):
> `glow` → `signal/400`, `elevation` → `ink/900`. Figmas `Effect/*` halten noch die alten Roh-Werte
> (#0098da / #1a2230) → bei Gelegenheit in Figma nachziehen (Code↔Figma-Divergenz an dieser Stelle).

**Naming-Rework 2026-06-17 (Figma):** Color-Semantics auf ein **`-fill`/`-ink`/`-border`-System**
umgestellt. Flächen-Token = bloßer Name oder `-fill`, Text/Icon = `-ink` (ersetzt `-foreground`),
Kanten = `-border`. Utilities aus `--color-{name}`: `bg-{name}`, `text-{name}`, `border-{name}`,
`ring-{name}` (Border-Utility verdoppelt: `border-border`, `border-accent-border`, `border-input-border`).

Migration alt→neu: `background`→`surface` · `foreground`→`ink` · `card-foreground`→`card-ink` ·
`muted`→`muted-fill` · `muted-foreground`→`muted-ink` · `accent`→`accent-fill` ·
`accent-foreground`→`accent-ink` · `input`→`input-border` · `input-background`→`input-fill` ·
`input-placeholder`→`input-ink-placeholder` · `overlay`→`overlay-fill` · `overlay-foreground`→`overlay-ink` ·
`inverse`→`inverse-fill` · `inverse-foreground`→`inverse-ink` · `sidebar`→`sidebar-fill` ·
`sidebar-*-foreground`→`sidebar-*-ink` · `primary-foreground`→`primary-ink` · `secondary-foreground`→`secondary-ink` ·
`destructive-foreground`→`destructive-ink`. **Neu:** `primary-fill`, `accent-border`, `input-fill-high`.
**Weggefallen:** `primary` als Fläche (jetzt Akzent-Ton signal/600 + separater dunkler `primary-fill`).
`popover`/`popover-foreground` bleiben (shadcn-Compat-Alias → overlay).

Werte = Light-Mode. `note` zeigt den alten Wert/Namen. Detaillierte `use`/`avoid`-Semantik +
AA-Belege werden in **Schritt 3** (per Component) verfeinert — hier zunächst Rampen-Crosswalk + Rolle.

```yaml
# Core surface + ink (Figma: shadcn Default/)
- { token: surface,     css_var: --ap-sys-surface,     primitive: base/white,     value: "#ffffff", utilities: [bg-surface],          use: "App-Grundfläche.", note: "war: background" }
- { token: ink,         css_var: --ap-sys-ink,         primitive: ink/900,        value: "#0d1016", utilities: [text-ink],            use: "Primärtext/-Icon (kein FRAME_FILL → keine Fläche; dunkle Fläche = inverse-fill).", note: "war: foreground" }
- { token: card,        css_var: --ap-sys-card,        primitive: ink/50,         value: "#f3f5fa", utilities: [bg-card],             use: "Erhabene/sekundäre Panel-Fläche." }
- { token: card-ink,    css_var: --ap-sys-card-ink,    primitive: ink/900,        value: "#0d1016", utilities: [text-card-ink],       use: "Text auf card.", note: "war: card-foreground" }
- { token: muted-fill,  css_var: --ap-sys-muted-fill,  primitive: ink/25,         value: "#f9fcfd", utilities: [bg-muted-fill],       use: "Ruhige Chrome-Fläche.", note: "war: muted" }
- { token: muted-ink,   css_var: --ap-sys-muted-ink,   primitive: ink/500,        value: "#656971", utilities: [text-muted-ink],      use: "Sekundärtext.", note: "war: muted-foreground (neutral/600)" }

# Primary / secondary / accent (Figma: shadcn Default/)
- { token: primary,        css_var: --ap-sys-primary,        primitive: signal/600, value: "#0063bb", utilities: [text-primary, border-primary, ring-primary], use: "Marken-Akzent (AA auf Weiß) als Text/Icon/Stroke; kein FRAME_FILL → Fläche = primary-fill.", note: "war: cyan/500 #0098da" }
- { token: primary-fill,   css_var: --ap-sys-primary-fill,   primitive: deep/900,   value: "#0d2531", utilities: [bg-primary-fill],  use: "Dunkle Primary-Fläche (Buttons).", note: "neu" }
- { token: primary-ink,    css_var: --ap-sys-primary-ink,    primitive: signal/100, value: "#a4e5ff", utilities: [text-primary-ink], use: "Ink auf primary-fill.", note: "war: primary-foreground (weiß)" }
- { token: secondary,      css_var: --ap-sys-secondary,      primitive: still/100,  value: "#bde4fd", utilities: [bg-secondary],     use: "Sekundär-Fläche.", note: "war Platzhalter #f5f5f5" }
- { token: secondary-ink,  css_var: --ap-sys-secondary-ink,  primitive: deep/900,   value: "#0d2531", utilities: [text-secondary-ink], use: "Text auf secondary.", note: "war: secondary-foreground" }
- { token: accent-fill,    css_var: --ap-sys-accent-fill,    primitive: deep/50,    value: "#eaf8ff", utilities: [bg-accent-fill],   use: "Selektions-/Aktiv-Tint.", note: "war: accent (cyan/50)" }
- { token: accent-ink,     css_var: --ap-sys-accent-ink,     primitive: signal/600, value: "#0063bb", utilities: [text-accent-ink],  use: "Text auf accent-fill.", note: "war: accent-foreground (cyan/700)" }
- { token: accent-border,  css_var: --ap-sys-accent-border,  primitive: still/200,  value: "#9fcdeb", utilities: [border-accent-border], use: "Accent-Kante.", note: "neu" }

# Destructive (Figma: shadcn Default/)
- { token: destructive,     css_var: --ap-sys-destructive,     primitive: error/600, value: "#b01207", utilities: [bg-destructive, text-destructive, border-destructive], use: "Fehler/Zerstörende Aktion.", note: "war Platzhalter #e7000b. STROKE_COLOR → auch ring-destructive (Focus)." }
- { token: destructive-ink, css_var: --ap-sys-destructive-ink, primitive: error/50,  value: "#ffe3d9", utilities: [text-destructive-ink, border-destructive-ink], use: "Text/Kante auf destructive.", note: "war: destructive-foreground" }

# Ring + borders
- { token: ring,            css_var: --ap-sys-ring,            primitive: ink/800, value: "#1e2229", utilities: [ring-ring, outline-ring],   use: "Fokus-Indikator.", note: "war neutral/700" }
- { token: border,          css_var: --ap-sys-border,          primitive: ink/75,  value: "#e4e6eb", utilities: [border-border],              use: "Standard-Kante (Base-Layer).", note: "war neutral/200" }
- { token: border-emphasis, css_var: --ap-sys-border-emphasis, primitive: ink/200, value: "#b8bbc0", utilities: [border-border-emphasis],     use: "Betonte Linie." }
- { token: border-strong,   css_var: --ap-sys-border-strong,   primitive: ink/300, value: "#9b9fa5", utilities: [border-border-strong],       use: "Schwerste Linie.", note: "war neutral/700 — jetzt heller" }

# Sidebar (Figma: shadcn Default/)
- { token: sidebar-fill,         css_var: --ap-sys-sidebar-fill,         primitive: ink/25,        value: "#f9fcfd", utilities: [bg-sidebar-fill],          use: "Sidebar-/Rail-Fläche.", note: "war: sidebar" }
- { token: sidebar-ink,          css_var: --ap-sys-sidebar-ink,          primitive: ink/900,       value: "#0d1016", utilities: [text-sidebar-ink],         use: "Text in Sidebar." }
- { token: sidebar-primary-fill, css_var: --ap-sys-sidebar-primary-fill, primitive: deep/900,   value: "#0d2531", utilities: [bg-sidebar-primary-fill, text-sidebar-primary-fill],  use: "Sidebar-Akzent-Fläche (auch als Text/Icon).", note: "war: sidebar-primary" }
- { token: sidebar-primary-ink,  css_var: --ap-sys-sidebar-primary-ink,  primitive: signal/200, value: "#7cceff", utilities: [text-sidebar-primary-ink], use: "Text auf sidebar-primary-fill." }
- { token: sidebar-accent-fill,  css_var: --ap-sys-sidebar-accent-fill,  primitive: deep/50,    value: "#eaf8ff", utilities: [bg-sidebar-accent-fill],   use: "Aktiv-Tint in der Sidebar.", note: "war: sidebar-accent" }
- { token: sidebar-accent-ink,   css_var: --ap-sys-sidebar-accent-ink,   primitive: signal/600, value: "#0063bb", utilities: [text-sidebar-accent-ink],  use: "Text auf sidebar-accent-fill." }
- { token: sidebar-border,       css_var: --ap-sys-sidebar-border,       primitive: ink/50,        value: "#f3f5fa", utilities: [border-sidebar-border],    use: "Sidebar-Trenner." }
- { token: sidebar-ring,         css_var: --ap-sys-sidebar-ring,         primitive: ink/800,       value: "#1e2229", utilities: [ring-sidebar-ring],        use: "Fokus in der Sidebar." }

# Charts — jetzt rampen-gebunden (Figma: shadcn Default/)
- { token: chart-1, css_var: --ap-sys-chart-1, primitive: warning/700, value: "#753100", utilities: [bg-chart-1, border-chart-1] }
- { token: chart-2, css_var: --ap-sys-chart-2, primitive: success/600, value: "#298058", utilities: [bg-chart-2, border-chart-2] }
- { token: chart-3, css_var: --ap-sys-chart-3, primitive: deep/900, value: "#0d2531", utilities: [bg-chart-3, border-chart-3] }
- { token: chart-4, css_var: --ap-sys-chart-4, primitive: warning/400, value: "#c8923f", utilities: [bg-chart-4, border-chart-4] }
- { token: chart-5, css_var: --ap-sys-chart-5, primitive: error/500,   value: "#c54235", utilities: [bg-chart-5, border-chart-5] }

# Overlay + popover + scrim (Figma: Overlay/)
- { token: overlay-fill,        css_var: --ap-sys-overlay-fill,        primitive: base/white, value: "#ffffff", utilities: [bg-overlay-fill],        use: "Erhabene Overlay-Fläche (Popover/Command/Menu).", note: "war: overlay" }
- { token: overlay-ink,         css_var: --ap-sys-overlay-ink,         primitive: ink/900,    value: "#0d1016", utilities: [text-overlay-ink],       use: "Text auf overlay." }
- { token: popover,             css_var: --ap-sys-popover,             primitive: "alias → overlay-fill", value: "#ffffff", utilities: [bg-popover],            use: "shadcn-Compat-Alias → overlay-fill." }
- { token: popover-foreground,  css_var: --ap-sys-popover-foreground,  primitive: "alias → overlay-ink",  value: "#0d1016", utilities: [text-popover-foreground], use: "shadcn-Compat-Alias → overlay-ink." }
- { token: scrim,               css_var: --ap-sys-scrim,               primitive: "ink/900 × scrim-opacity", value: "color-mix(in srgb, #0d1016 10%, transparent)", utilities: [bg-scrim], use: "Modal-Backdrop-Dimmer — ohne Opacity-Modifier.", note: "war neutral/900" }
- { token: scrim-opacity,       css_var: --ap-sys-scrim-opacity,       primitive: opacity/10, value: "10%", utilities: [], use: "FLOAT, Scope OPACITY — komponiert scrim." }

# Input (Figma: Input/)
- { token: input-ink-placeholder, css_var: --ap-sys-input-ink-placeholder, primitive: ink/500, value: "#656971", utilities: [text-input-ink-placeholder], use: "Platzhaltertext.", note: "war: input-placeholder (neutral/400)" }
- { token: input-fill,            css_var: --ap-sys-input-fill,            primitive: ink/25,  value: "#f9fcfd", utilities: [bg-input-fill],               use: "Feld-Fill (opak).", note: "war: input-background" }
- { token: input-fill-high,       css_var: --ap-sys-input-fill-high,       primitive: ink/400, value: "#7f848b", utilities: [bg-input-fill-high],          use: "Betonter Feld-Fill.", note: "neu" }
- { token: input-border,          css_var: --ap-sys-input-border,          primitive: ink/400, value: "#7f848b", utilities: [border-input-border],         use: "Feld-Border.", note: "war: input (neutral/450)" }

# Inverse (Figma: Inverse/)
- { token: inverse-fill, css_var: --ap-sys-inverse-fill, primitive: deep/950, value: "#00121c", utilities: [bg-inverse-fill],  use: "Dunkle Fläche (invertierte Chips/Pillen).", note: "war: inverse (neutral/900)" }
- { token: inverse-ink,  css_var: --ap-sys-inverse-ink,  primitive: ink/50,      value: "#f3f5fa", utilities: [text-inverse-ink], use: "Text auf inverse-fill." }

# Theme-invariant
- { token: background-fixed, css_var: --ap-sys-background-fixed, primitive: base/white, value: "#ffffff", utilities: [bg-background-fixed], use: "Theme-invariante weiße Fläche (Toggle-Knob).", avoid: "Im künftigen .dark NICHT überschreiben." }
```

**Linien-Leiter (aufsteigend):** `border` (ink/75) < `border-emphasis` (ink/200) < `border-strong` (ink/300).
**Primary-Modell (neu):** `primary` = Akzent-Ton (signal/600, AA-Text/Stroke) · `primary-fill` = dunkle Fläche (deep/900) + `primary-ink` (signal/100) als Text darauf.
**Accent-Trio:** `accent-fill` (Tint) · `accent-ink` (Text darauf) · `accent-border` (Kante).
**Status-Familie jetzt vorhanden:** `destructive` (error). `success`/`warning` existieren als Rampen (Charts), eigene Semantic-Tokens dafür noch tbd.

---

## 2 · Corner (Radius)

Primitives (`reference`, Gruppe `Dimension/radius`, intern): `4·6·8·16·full(9999)`. Semantics
(Figma-Gruppe `Corner/`) aliasen, Scope `CORNER_RADIUS`. Utilities = **Custom-Utilities
`corner-*`** via `--corner-step-*`-Lookup (gleiches Muster wie die Space-Steps);
Seiten/Ecken: `corner-t/r/b/l-*` + `corner-tl/tr/br/bl-*`, dazu statisch `corner-none`.

```yaml
- { token: corner-sm,   css_var: --ap-sys-corner-sm,   primitive: radius/4, value: 4px,    utilities: [corner-sm],   use: "Kleine Controls/Chips/Marker." }
- { token: corner-md,   css_var: --ap-sys-corner-md,   primitive: radius/6, value: 6px,    utilities: [corner-md],   use: "Mittlere Container." }
- { token: corner-lg,   css_var: --ap-sys-corner-lg,   primitive: radius/8, value: 8px,    utilities: [corner-lg],   use: "Buttons, Felder, Icon-Buttons, Toggles." }
- { token: corner-xl,   css_var: --ap-sys-corner-xl,   primitive: radius/16, value: 16px,   utilities: [corner-xl],   use: "Große Flächen/Fenster." }
- { token: corner-full, css_var: --ap-sys-corner-full, primitive: radius/full, value: 9999px, utilities: [corner-full], use: "Pillen (Radius ≈ min(w,h)/2)." }
```

**Tot:** ALLE `rounded-*` (`--radius-*: initial`, kein Re-Mapping) — das DS-Radius-Vokabular
ist ausschließlich `corner-*`. twMerge kennt die corner-Gruppen samt Seiten-/Ecken-Konflikten
(cn()-Extension in `libs/ui/src/lib/utils.ts`).

---

## 3 · Spacing (Gap + Padding, ein System)

Ein System für Gap **und** Padding (Figma-Scope `GAP`); `m-*` als Code-Idiom (§7). Einziges
Primitive ist die Grundeinheit `Dimension/space/base` → `--ap-dimension-space-base` (4px); die
Steps sind in Figma **direkte Werte** (nur `space-xs` aliast die Grundeinheit), im CSS
`calc(base × n)`. Step nach benötigter Abstandsgröße wählen. Utilities **benannt** — via
`@utility` auf `--space-step-*`, **nur** für die Familien `gap/gap-x/gap-y`, `p/px/py/pt/pr/pb/pl`,
`m/mx/my/mt/mr/mb/ml` inkl. Negative `-m…` (die YAML listet `p-`/`gap-` stellvertretend) — **plus
numerisch** (`p-4`/`gap-2`/`h-9` über die `--spacing`-Basis); beide gültig, numerische nicht
entfernen. Kein `use` pro Step — die Wahl läuft über den px-Wert (§6), nicht über Semantik.

**Kollisions-Regel (2026-06-11):** Die Steps liegen bewusst **nicht** auf Tailwinds `--spacing-*` —
der Namespace füttert alle Sizing-Utilities und löst **vor** `--container` auf (`max-w-md` wäre sonst
8px statt 28rem). T-Shirt-Namen auf `w-*`/`max-w-*`/`min-w-*`/`basis-*` = **Container-Skala** (Stock);
`h-*`/`size-*` kennen keine benannten Steps (Geometrie numerisch, §6).

```yaml
- { token: space-2xs, css_var: --ap-sys-space-2xs, primitive: "— (direkt)", value: 2px,  utilities: [p-2xs, gap-2xs] }
- { token: space-xs,  css_var: --ap-sys-space-xs,  primitive: space/base,   value: 4px,  utilities: [p-xs,  gap-xs] }
- { token: space-sm,  css_var: --ap-sys-space-sm,  primitive: "— (direkt)", value: 6px,  utilities: [p-sm,  gap-sm] }
- { token: space-md,  css_var: --ap-sys-space-md,  primitive: "— (direkt)", value: 8px,  utilities: [p-md,  gap-md] }
- { token: space-lg,  css_var: --ap-sys-space-lg,  primitive: "— (direkt)", value: 12px, utilities: [p-lg,  gap-lg] }
- { token: space-xl,  css_var: --ap-sys-space-xl,  primitive: "— (direkt)", value: 16px, utilities: [p-xl,  gap-xl] }
- { token: space-2xl, css_var: --ap-sys-space-2xl, primitive: "— (direkt)", value: 24px, utilities: [p-2xl, gap-2xl] }
- { token: space-3xl, css_var: --ap-sys-space-3xl, primitive: "— (direkt)", value: 32px, utilities: [p-3xl, gap-3xl] }
- { token: space-4xl, css_var: --ap-sys-space-4xl, primitive: "— (direkt)", value: 48px, utilities: [p-4xl, gap-4xl] }
- { token: space-5xl, css_var: --ap-sys-space-5xl, primitive: "— (direkt)", value: 80px, utilities: [p-5xl, gap-5xl] }
```

---

## 4 · Typografie — 11 Formate

Composition-Utilities (`@utility text-format-<format>` in tw-utilities.css, mehrwertig:
family+size+weight+line-height+tracking) → **eine Klasse** statt einzelner `text-`/`font-`-Utilities
(Letztere durch Theme-Reset tot, §6). **Naming `text-format-*` (seit 2026-06-11):** der frühere
Name `text-<format>` kollidierte mit Tailwinds generierten Farb-Utilities — `text-input` war
gleichzeitig Format-Klasse und Farbe aus `--color-input` (beide Regeln im CSS). Jedes Format
besteht aus **5 Teil-Tokens**: Figma
`<OrgGruppe>/<format>/<part>` (semantic-typo; Text-Styles binden sie) ↔ CSS
`--ap-sys-<format>-<part>`. Org-Gruppen: Display · Heading (heading, heading-sm) · Title ·
Body (body, body-strong) · Label · Eyebrow · Data · Kbd · Input.

Primitives (intern; Figma-Gruppe `Font/` — die YAML nutzt die Kurz-Pfade, CSS = `--ap-font-…`):

```yaml
family:      { sans: "Hanken Grotesk", mono: "Geist Mono" }                 # --ap-font-family-sans/-mono
weight:      { regular: 400, medium: 500, semibold: 600, extrabold: 800 }   # --ap-font-weight-*
size:        { base: 14, step-neg2: 9, step-neg1: 11, step-0: 14, step-1: 18, step-2: 22, step-3: 27, step-4: "34 (spare)", step-5: 43 }
             # --ap-font-size-step-* — modulare Skala: base × scale^n; Font/scale = 1.25 → --ap-font-scale
line-height: { tight: 1.0, snug: 1.2, relaxed: 1.5 }                        # --ap-font-line-height-*
tracking:    { tight: "-0.5px", normal: "0", wide: "0.5px" }                # --ap-font-tracking-*
```

Formate (`primitive` = Kurz-Pfade unter `Font/`; `line-height: normal` = nur CSS, **kein**
Figma-Teil-Token — diese Formate haben 4 statt 5 Figma-Vars):

```yaml
- token: display
  css_var: "--ap-sys-display-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-5, weight: weight/extrabold, line-height: line-height/tight, tracking: tracking/tight }
  value: { family: sans, size: 43, weight: 800, line-height: 1.0, tracking: "-0.5px" }
  utilities: [text-format-display]
  use: "Hero-Headline."

- token: heading
  css_var: "--ap-sys-heading-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-3, weight: weight/extrabold, line-height: line-height/snug, tracking: tracking/tight }
  value: { family: sans, size: 27, weight: 800, line-height: 1.2, tracking: "-0.5px" }
  utilities: [text-format-heading]
  use: "Überschrift."

- token: heading-sm
  css_var: "--ap-sys-heading-sm-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-2, weight: weight/extrabold, line-height: line-height/snug, tracking: tracking/tight }
  value: { family: sans, size: 22, weight: 800, line-height: 1.2, tracking: "-0.5px" }
  utilities: [text-format-heading-sm]
  use: "Kleinere Überschrift."

- token: title
  css_var: "--ap-sys-title-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-1, weight: weight/semibold, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 18, weight: 600, line-height: normal, tracking: "0" }
  utilities: [text-format-title]
  use: "Abschnitts-/Sektions-Titel."

- token: body
  css_var: "--ap-sys-body-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/regular, line-height: line-height/relaxed, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 400, line-height: 1.5, tracking: "0" }
  utilities: [text-format-body]
  use: "Fließtext; Body-Default der App."

- token: body-strong
  css_var: "--ap-sys-body-strong-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/semibold, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 600, line-height: normal, tracking: "0" }
  utilities: [text-format-body-strong]
  use: "Betonter Fließtext."

- token: label
  css_var: "--ap-sys-label-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-format-label]
  use: "Labels: Form-/Toggle-Labels, Button-Text."

- token: eyebrow
  css_var: "--ap-sys-eyebrow-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg2, weight: weight/medium, line-height: normal, tracking: tracking/wide }
  value: { family: mono, size: 9, weight: 500, line-height: normal, tracking: "0.5px" }
  utilities: [text-format-eyebrow]
  use: "Uppercase-Mikro-Labels."

- token: data
  css_var: "--ap-sys-data-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg1, weight: weight/regular, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 11, weight: 400, line-height: normal, tracking: "0" }
  utilities: [text-format-data]
  use: "Tabellarische Mono-Daten (auch Dateinamen u. ä.)."

- token: kbd
  css_var: "--ap-sys-kbd-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg1, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 11, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-format-kbd]
  use: "Tastatur-Tasten-Text."

- token: input
  css_var: "--ap-sys-input-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-1, weight: weight/regular, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 18, weight: 400, line-height: normal, tracking: "0" }
  utilities: [text-format-input]
  use: "Command-/Eingabe-Text."
  avoid: "Typo-Klasse — nicht mit dem Farb-Token input (--ap-sys-input, Form-Border) verwechseln; die alte Klasse text-input kollidierte genau damit (Grund des text-format-*-Renames)."
```

*Line-Height in Figma nicht bindbar → im Text-Style roh (auto/%); im CSS
`--ap-font-line-height-*` bzw. `normal`.*

---

## 5 · Effekte

In Figma **Effect Styles** „Glow"/„Elevation", die die `Effect/*`-Primitives direkt binden — das
sys-Tier (`--ap-sys-shadow-*`) existiert **nur im CSS** (Architektur-Block). Farbe folgt den
Color-Primitives via `color-mix`.

Primitives (intern; Figma-Gruppe `Effect/`, Scopes EFFECT_COLOR/EFFECT_FLOAT — die YAML nutzt die
Kurz-Pfade, CSS = `--ap-effect-…`):

```yaml
glow:      { x: 0, y: 0, blur: 4, spread: 0, color: "cyan/500 @ 50% (color-mix)" }        # --ap-effect-glow-*
elevation: { x: 0, y: 14, blur: 36, spread: -6, color: "neutral/900 @ 18% (color-mix)" }   # --ap-effect-elevation-*
```

```yaml
- token: shadow-glow
  css_var: --ap-sys-shadow-glow
  primitive: "glow/* (5 Teile: x y blur spread color)"
  value: "0 0 4px 0 · cyan/500 @ 50%"
  utilities: [shadow-glow]
  use: "Glow an Brand-Marken (Fokus/Aktiv-Akzent)."
  note: "Figma: Effect Style „Glow" bindet die Teile direkt — kein semantic-Var."

- token: shadow-elevation
  css_var: --ap-sys-shadow-elevation
  primitive: "elevation/* (5 Teile: x y blur spread color)"
  value: "0 14px 36px -6px · neutral/900 @ 18%"
  utilities: [shadow-elevation]
  use: "Schlagschatten erhabener Overlays/Menüs."
  note: "Figma: Effect Style „Elevation" bindet die Teile direkt — kein semantic-Var."
```

**Sonst flach:** Tiefe wird angedeutet, nicht gestapelt. Stock-`shadow-xs/sm/md/lg` sind tot (§6).

---

## 6 · Stock-shadcn → Agentport-Vokabular

Der Theme-Reset in `globals.css` setzt mehrere Tailwind-Default-Namespaces auf `initial`. Darauf bauende
Stock-Klassen sind **tot** → beim Portieren jeder Component übersetzen.

```yaml
dead_utilities:   # durch Reset entfernt → Ersatz
  - { stock: "text-xs/sm/base/lg/… (font-size)", reset: "--text-*: initial",        replace: "passende .text-format-*-Klasse (§4)" }
  - { stock: "font-normal/medium/semibold/bold", reset: "--font-weight-*: initial",  replace: "Gewicht steckt in der .text-format-*-Klasse" }
  - { stock: "font-sans/font-mono (family)",     reset: "--font-*: initial",         replace: "Familie steckt in der .text-format-*-Klasse (mono → text-format-data/-kbd/-eyebrow/-input)" }
  - { stock: "tracking-*",                       reset: "--tracking-*: initial",     replace: "steckt in der .text-format-*-Klasse" }
  - { stock: "leading-*",                        reset: "--leading-*: initial",      replace: "steckt in der .text-format-*-Klasse" }
  - { stock: "shadow-xs/sm/md/lg/xl",            reset: "--shadow-*: initial",       replace: "weglassen (flach) ODER shadow-elevation, wenn Tiefe Bedeutung trägt" }
  - { stock: "Core-Farben (text-red-500 …)",     reset: "--color-*: initial",        replace: "nur DS-Semantics; text-white/current/transparent bleiben" }

# Color-Utility-Renames (2026-06-17): Bis zum Rework hießen die Farb-Utilities wie stock-shadcn
# (nur Werte DS-eigen). Seit dem -fill/-ink/-border-System DIVERGIEREN die Namen → stock-shadcn-Klassen
# (Nova/ui:add) müssen pro Component übersetzt werden. Hier die kanonische Tabelle:
color_renames:
  - { stock: bg-background,                  ds: bg-surface }
  - { stock: "text-foreground / bg-foreground", ds: "text-ink  (KEIN bg-ink — keine Fläche; dunkle Fläche = bg-inverse-fill)" }
  - { stock: text-card-foreground,           ds: text-card-ink }
  - { stock: bg-muted,                       ds: bg-muted-fill }
  - { stock: text-muted-foreground,          ds: text-muted-ink }
  - { stock: bg-accent,                      ds: bg-accent-fill }
  - { stock: text-accent-foreground,         ds: text-accent-ink }
  - { stock: "bg-primary",                   ds: "bg-primary-fill  (dunkle Fläche; bg-primary GIBT ES NICHT — primary = Akzent text-/border-/ring-primary)" }
  - { stock: text-primary-foreground,        ds: text-primary-ink }
  - { stock: text-secondary-foreground,      ds: text-secondary-ink }
  - { stock: text-destructive-foreground,    ds: text-destructive-ink }
  - { stock: border-input,                   ds: border-input-border }
  - { stock: bg-input-background,            ds: bg-input-fill }
  - { stock: "placeholder (input-placeholder)", ds: text-input-ink-placeholder }
  - { stock: "bg-overlay / text-overlay-foreground", ds: "bg-overlay-fill / text-overlay-ink" }
  - { stock: "bg-inverse / text-inverse-foreground", ds: "bg-inverse-fill / text-inverse-ink" }
  - { stock: bg-sidebar,                     ds: bg-sidebar-fill }
  - { stock: text-sidebar-foreground,        ds: text-sidebar-ink }
  - { stock: "bg-sidebar-primary / text-sidebar-primary-foreground", ds: "bg-sidebar-primary-fill / text-sidebar-primary-ink" }
  - { stock: "bg-sidebar-accent / text-sidebar-accent-foreground",   ds: "bg-sidebar-accent-fill / text-sidebar-accent-ink" }
  - { unchanged: "Name BLEIBT (nur Wert neu): bg-card, bg-popover/text-popover-foreground (Compat-Alias), bg-secondary, bg-destructive/text-destructive, border-border/-emphasis/-strong, ring-ring/outline-ring, border-sidebar-border, ring-sidebar-ring, bg-chart-1..5, bg-background-fixed" }
  - { neu: "Tokens ohne stock-Pendant: accent-border, primary-fill, input-fill-high, sidebar-*-ink (Text auf Akzentflächen)" }

geometry_vs_token:
  spacing: "Padding/Gap/Margin → benanntes Token MAPPE ÜBER DEN px-WERT: gap-2(8)→gap-md · gap-1.5(6)→gap-sm · px-4(16)→px-xl · py-2(8)→py-md · px-3(12)→px-lg · px-6(24)→px-2xl."
  control_geometry: "Control-Höhen/Icon-Maße (h-9/h-8/h-10, size-9, size-4) NUMERISCH lassen — nicht auf der Spacing-Skala. Geometrie ≠ Spacing-Token."
  radius: "Radius-Vokabular = corner-sm/md/lg/xl/full (+ corner-none, Seiten corner-b-* usw.); ALLE rounded-* sind TOT (--radius-*: initial, kein Re-Mapping)."

keep_valid:
  - "Container-T-Shirt-Namen auf Sizing-Utilities: max-w-sm/md/…, w-lg, basis-md = --container-Skala (24rem/28rem/…), KEINE Spacing-Steps (§3 Kollisions-Regel)"
  - "Opacity-Modifier auf DS-Tokens: bg-primary-fill/90, ring-ring/50, outline-ring/50"
  - "Arbitrary values: ring-[3px], size-[18px]"
  - "Numerische Spacing-Utilities: p-4, gap-2, h-9, size-4"
  - "Struktur-Namespaces: --breakpoint-*, --container-*, --animate-*, --default-*, --spacing"

border_width_vs_color: "border = 1px Breite, getrennt von der Farbe. Base-Layer `* { @apply border-border outline-ring/50 }` setzt die Default-Farbe; abweichende Linien via zum Beispiel border-border-subtle/-emphasis/-strong."
```

---

## 7 · Auto-Layout → Utilities (Figma → Tailwind)

Figma-Auto-Layout-Properties → className-Utilities.
Display = `flex`/`inline-flex` (Komponente wählt); die Properties darunter setzen Richtung, Abstand,
Ausrichtung, Sizing. **Gap und Padding laufen über die Spacing-Skala (§3) — Mapping per px-Wert.**

```yaml
layoutMode:                # Layout-Modus
  HORIZONTAL: flex-row
  VERTICAL:   flex-col
  GRID:       "grid        # eigene Properties → grid-Block unten"
  NONE:       "kein Auto-Layout (Block/absolut)"
itemSpacing: "gap-<step>           # §3, per px-Wert (8→gap-md …)"
padding:     "p-/px-/py-<step>     # §3, per px-Wert; Einzelseiten pl-/pr-/pt-/pb-"
primaryAxisAlignItems:     # Hauptachse → justify-*
  MIN: justify-start · CENTER: justify-center · MAX: justify-end · SPACE_BETWEEN: justify-between
counterAxisAlignItems:     # Querachse → items-*
  MIN: items-start · CENTER: items-center · MAX: items-end · BASELINE: items-baseline
layoutSizingHorizontal:    # Member-Breite
  FIXED: "w-<n> (numerisch, Control-Geometrie)" · HUG: w-fit · FILL: "w-full / flex-1 (Flex-Child)"
layoutSizingVertical:      # Member-Höhe
  FIXED: "h-<n> (numerisch)" · HUG: h-fit · FILL: "h-full / flex-1"
layoutWrap:                # nur Flex
  NO_WRAP: "(default)" · WRAP: flex-wrap
grid:                      # nur layoutMode GRID — eigene Props (NICHT itemSpacing/primary/counter)
  gridRowCount/gridColumnCount: "grid-rows-<n> / grid-cols-<n>"
  gridRowGap/gridColumnGap:     "gap-y-<step> / gap-x-<step>   # §3, per px-Wert"
  gridRow/ColumnSizes:          "FLEX → fr · FIXED → px (arbitrary grid-cols-[…])"
  per-Child:                    "gridRow/ColumnSpan → row-/col-span-<n> · Anchor (0-based) → row-/col-start-<n+1> · gridChildH/V-Align MIN/CENTER/MAX/AUTO → justify-self-*/self-*"
```

**`primaryAxis*` = Hauptachse = `justify-*`, `counterAxis*` = Querachse = `items-*`** — richtungsunabhängig
(Tailwind-`justify`/`items` sind ebenfalls Haupt-/Querachse). FIXED-Maße bleiben **numerisch** (Geometrie ≠ Spacing-Token, vgl. §6).

**`margin` — wann statt gap/padding:** Figma-Auto-Layout liefert nur **gap** (zwischen Kindern) + **padding**
(Container-Inset) — das ist die **Default-Übersetzung** für Abstände. `margin` (§3 `m-*`) ist kein Ersatz dafür,
sondern ein Code-Idiom für Intents, die gap/padding nicht tragen — jeder mit eigenem Figma-Signal:
- **Push-to-end / Verteilen** → Figma `primaryAxisAlignItems = SPACE_BETWEEN/MAX` → `justify-*` (oder `ml-auto`
  für ein einzelnes trailing-Element), **nicht** aus einem gap abgeleitet.
- **Überlappung / Einzelversatz**, den ein *uniformer* gap nicht kann → in Figma ein Spacer- oder
  `ABSOLUTE`-Child (`layoutPositioning`) → strukturell spiegeln, nicht per margin überdecken.

Einen Figma-gap/-padding **nie** in margin umwandeln; Default = gap/padding. Ein
bestehendes `m-*` im Code ist code-eigen (keine Figma-Quelle → nicht aus Figma diffbar).

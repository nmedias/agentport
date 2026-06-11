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
  CSS-Naming: Primitives = --ap-<figma-pfad-mit-dashes> (Color/neutral/50 → --ap-color-neutral-50,
              Font/family/sans → --ap-font-family-sans). Semantics = --ap-sys-<token-leaf> —
              Figma-Gruppen sind rein organisatorisch (Overlay/overlay → --ap-sys-overlay,
              Input/input-placeholder → --ap-sys-input-placeholder; shadcn Default/ ist flach,
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

Primitives (intern; Figma-Gruppe `Color/` — die YAML nutzt die Kurz-Pfade, CSS = `--ap-color-…`):

```yaml
base/white: "#ffffff"                                        # --ap-color-base-white
neutral: { 50: "#fafbfc", 100: "#f4f6f8", 200: "#e6eaee", 300: "#c4ccd4", 400: "#979fa8", 450: "#79828f", 500: "#6b7585", 600: "#636c7b", 700: "#4a5562", 900: "#1a2230" }   # --ap-color-neutral-*
cyan:    { 50: "#e9f6fc", 500: "#0098da", 700: "#0077a8" }   # cyan/500 = Brand #009FE3 → #0098DA (≥3:1, WCAG 1.4.11)
opacity: { 10: "10% — Figma-Wert 10 (Opacity-Variablen = 0–100-Skala), CSS --ap-color-opacity-10: 10%" }
```

Utilities aus `--color-{name}`: `bg-{name}`, `text-{name}`, `border-{name}`, `ring-{name}`. Für
`border-*`-Namen lautet die Border-Utility `border-border-emphasis` usw.

```yaml
- token: background
  css_var: --ap-sys-background
  primitive: base/white
  value: "#ffffff"
  utilities: [bg-background]
  use: "Basis-Flächenfarbe (App-Grundfläche)."

- token: foreground
  css_var: --ap-sys-foreground
  primitive: neutral/900
  value: "#1a2230"
  utilities: [text-foreground, bg-foreground]
  use: "Primärtext/-Icon auf Basis-Flächen."

- token: card
  css_var: --ap-sys-card
  primitive: neutral/50
  value: "#fafbfc"
  utilities: [bg-card]
  use: "Erhabene/sekundäre Panel-Fläche."

- token: card-foreground
  css_var: --ap-sys-card-foreground
  primitive: neutral/900
  value: "#1a2230"
  utilities: [text-card-foreground]
  use: "Text auf card (shadcn-Paarung)."

- token: primary
  css_var: --ap-sys-primary
  primitive: cyan/500
  value: "#0098da"
  utilities: [bg-primary, text-primary]
  use: "Brand-Akzent für Selektion/Fokus/Primäraktion und freistehende Aktiv-Hervorhebung. Als Fläche nur, wenn die Fläche „selektiert/primär/hier handeln“ bedeutet."
  avoid: "Text auf hellem Grund (≥3:1, aber <4.5 → dafür accent-foreground); dekorative Flächen-Einfärbung."

- token: primary-foreground
  css_var: --ap-sys-primary-foreground
  primitive: base/white
  value: "#ffffff"
  utilities: [text-primary-foreground]
  use: "Text/Icon auf primary-Fläche."

- token: muted
  css_var: --ap-sys-muted
  primitive: neutral/100
  value: "#f4f6f8"
  utilities: [bg-muted]
  use: "Ruhige Chrome-Fläche (Bänder, Chips, Tracks)."

- token: muted-foreground
  css_var: --ap-sys-muted-foreground
  primitive: neutral/600
  value: "#636c7b"
  utilities: [text-muted-foreground]
  use: "Sekundär-/Tertiärtext auf hellen Flächen."
  note: "AA ≥4.5 auf background/card/sidebar."

- token: accent
  css_var: --ap-sys-accent
  primitive: cyan/50
  value: "#e9f6fc"
  utilities: [bg-accent]
  use: "Selektions-/Aktiv-Tint-Fläche."
  note: "Abweichung von Stock-shadcn (dort neutrales Hover-Grau) — hier = Selektion. Neutrales Row-Hover bräuchte eigenen Token."

- token: accent-foreground
  css_var: --ap-sys-accent-foreground
  primitive: cyan/700
  value: "#0077a8"
  utilities: [text-accent-foreground]
  use: "Lesbares Cyan für Text auf accent-Tint (≈5:1)."
  avoid: "Nicht primary für Text-auf-hell."

- token: border
  css_var: --ap-sys-border
  primitive: neutral/200
  value: "#e6eaee"
  utilities: [border-border]
  use: "Standard-Kanten/Trenner (global via Base-Layer gesetzt)."

- token: input
  css_var: --ap-sys-input
  primitive: neutral/450
  value: "#79828f"
  utilities: [border-input]
  use: "Form-Control-Border; Fokus → ring; Fill → input-background."
  note: "≥3:1 (WCAG 1.4.11 / BITV)."

- token: ring
  css_var: --ap-sys-ring
  primitive: neutral/700
  value: "#4a5562"
  utilities: [ring-ring, outline-ring]
  use: "Fokus-Indikator (Base-Layer setzt outline-ring/50)."

- token: overlay
  css_var: --ap-sys-overlay
  primitive: base/white
  value: "#ffffff"
  utilities: [bg-overlay]
  use: "Erhabene Overlay-Fläche (Popover/Command/Menu/Dropdown)."

- token: overlay-foreground
  css_var: --ap-sys-overlay-foreground
  primitive: neutral/900
  value: "#1a2230"
  utilities: [text-overlay-foreground]
  use: "Text auf overlay."

- token: popover
  css_var: --ap-sys-popover
  primitive: alias → --ap-sys-overlay
  value: "#ffffff"
  utilities: [bg-popover]
  use: "Alias auf overlay für shadcn-Komponenten, die --popover referenzieren."
  note: "In neuen Komponenten ist overlay der bevorzugte Name."

- token: popover-foreground
  css_var: --ap-sys-popover-foreground
  primitive: alias → --ap-sys-overlay-foreground
  value: "#1a2230"
  utilities: [text-popover-foreground]
  use: "s. popover."

- token: sidebar
  css_var: --ap-sys-sidebar
  primitive: neutral/100
  value: "#f4f6f8"
  utilities: [bg-sidebar]
  use: "Sidebar-/Rail-Fläche."

- token: sidebar-foreground
  css_var: --ap-sys-sidebar-foreground
  primitive: neutral/900
  value: "#1a2230"
  utilities: [text-sidebar-foreground]
  use: "Text auf sidebar."

- token: sidebar-primary
  css_var: --ap-sys-sidebar-primary
  primitive: cyan/700
  value: "#0077a8"
  utilities: [bg-sidebar-primary]
  use: "Sidebar-Akzent-Fläche."

- token: sidebar-primary-foreground
  css_var: --ap-sys-sidebar-primary-foreground
  primitive: base/white
  value: "#ffffff"
  utilities: [text-sidebar-primary-foreground]
  use: "Text auf sidebar-primary."

- token: sidebar-accent
  css_var: --ap-sys-sidebar-accent
  primitive: cyan/50
  value: "#e9f6fc"
  utilities: [bg-sidebar-accent]
  use: "Aktiv-/Selektions-Tint in der Sidebar."

- token: sidebar-accent-foreground
  css_var: --ap-sys-sidebar-accent-foreground
  primitive: cyan/700
  value: "#0077a8"
  utilities: [text-sidebar-accent-foreground]
  use: "Text auf sidebar-accent."

- token: sidebar-border
  css_var: --ap-sys-sidebar-border
  primitive: neutral/200
  value: "#e6eaee"
  utilities: [border-sidebar-border]
  use: "Sidebar-Trenner."

- token: sidebar-ring
  css_var: --ap-sys-sidebar-ring
  primitive: neutral/700
  value: "#4a5562"
  utilities: [ring-sidebar-ring]
  use: "Fokus in der Sidebar."

- token: input-placeholder
  css_var: --ap-sys-input-placeholder
  primitive: neutral/400
  value: "#979fa8"
  utilities: [text-input-placeholder]
  use: "Platzhaltertext in Feldern."
  note: "Bewusst dezent (kein AA-Ziel)."

- token: input-background
  css_var: --ap-sys-input-background
  primitive: neutral/100
  value: "#f4f6f8"
  utilities: [bg-input-background]
  use: "Eingabefeld-Fill (opak)."
  note: "Abhebung gering → Erkennbarkeit trägt die Border (input)."

- token: background-fixed
  css_var: --ap-sys-background-fixed
  primitive: base/white
  value: "#ffffff"
  utilities: [bg-background-fixed]
  use: "Theme-invariante weiße Fläche."
  avoid: "Im künftigen .dark NICHT überschreiben."

- token: border-emphasis
  css_var: --ap-sys-border-emphasis
  primitive: neutral/300
  value: "#c4ccd4"
  utilities: [border-border-emphasis]
  use: "Betonte Linie (stärker als border)."

- token: border-strong
  css_var: --ap-sys-border-strong
  primitive: neutral/700
  value: "#4a5562"
  utilities: [border-border-strong]
  use: "Schwerste/dunkelste Linie."

- token: inverse
  css_var: --ap-sys-inverse
  primitive: neutral/900
  value: "#1a2230"
  utilities: [bg-inverse]
  use: "Dunkle Fläche auf hellem Grund (invertierte Chips/Pillen)."

- token: inverse-foreground
  css_var: --ap-sys-inverse-foreground
  primitive: neutral/50
  value: "#fafbfc"
  utilities: [text-inverse-foreground]
  use: "Text auf inverse."

- token: scrim
  css_var: --ap-sys-scrim
  primitive: "neutral/900 (Farbe) — Stärke komponiert via scrim-opacity"
  value: "color-mix(in srgb, #1a2230 var(--ap-sys-scrim-opacity), transparent)"
  utilities: [bg-scrim]
  use: "Modal-Backdrop-Dimmer (Dialog-Overlay); Alpha komponiert via scrim-opacity — ohne Opacity-Modifier verwenden."
  avoid: "Keine Flächen-Tönung unterhalb von Modal-Ebene; nicht mit zusätzlichem /NN-Modifier stapeln."
  note: "Figma: scrim = Alias → neutral/900 (voll-opak); die 10% liegen als Layer-Opacity-Binding (scrim-opacity) auf .Dialog/Overlay — als Fill ohne dieses Binding ist scrim voll-opak dunkel."

- token: scrim-opacity
  css_var: --ap-sys-scrim-opacity
  primitive: opacity/10
  value: "10%"
  utilities: []
  use: "Stärke des Modal-Backdrops — komponiert --scrim (color-mix) bzw. die Layer-Opacity der Overlay-Komponente."
  note: "FLOAT-Token, Scope OPACITY. Figma-Wert 10 (Opacity-Variablen = 0–100-Prozent-Skala) ↔ CSS 10%."

- token: secondary
  css_var: --ap-sys-secondary
  primitive: raw
  value: "#f5f5f5"
  utilities: [bg-secondary, text-secondary]
  status: placeholder
  use: tbd

- token: secondary-foreground
  css_var: --ap-sys-secondary-foreground
  primitive: raw
  value: "#343434"
  utilities: [text-secondary-foreground]
  status: placeholder
  use: tbd

- token: destructive
  css_var: --ap-sys-destructive
  primitive: raw
  value: "#e7000b"
  utilities: [bg-destructive, text-destructive]
  status: placeholder
  use: tbd

- token: destructive-foreground
  css_var: --ap-sys-destructive-foreground
  primitive: raw
  value: "#fafafa"
  utilities: [text-destructive-foreground]
  status: placeholder
  use: tbd

- token: chart-1..5
  css_var: --ap-sys-chart-1 … --ap-sys-chart-5
  primitive: raw
  value: ["#e76f51", "#2a9d8f", "#264653", "#e9c46a", "#f4a261"]
  utilities: [bg-chart-1 … text-chart-5]
  status: placeholder
  use: tbd
```

**Linien-Leiter (aufsteigend):** `border` < `border-emphasis` < `border-strong`.
**Zwei-Cyan-Modell:** helles `primary` (Flächen/Marken) vs. dunkles `accent-foreground` (Text auf Tint) — Verwechslung = AA-Bruch.
**Kein Token (tbd):** Status-Familie `connected/offline/error/warning`.

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

Composition-Utilities (`@utility text-<format>` in tw-utilities.css, mehrwertig:
family+size+weight+line-height+tracking) → **eine Klasse** statt einzelner `text-`/`font-`-Utilities
(Letztere durch Theme-Reset tot, §6). Jedes Format besteht aus **5 Teil-Tokens**: Figma
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
  utilities: [text-display]
  use: "Hero-Headline."

- token: heading
  css_var: "--ap-sys-heading-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-3, weight: weight/extrabold, line-height: line-height/snug, tracking: tracking/tight }
  value: { family: sans, size: 27, weight: 800, line-height: 1.2, tracking: "-0.5px" }
  utilities: [text-heading]
  use: "Überschrift."

- token: heading-sm
  css_var: "--ap-sys-heading-sm-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-2, weight: weight/extrabold, line-height: line-height/snug, tracking: tracking/tight }
  value: { family: sans, size: 22, weight: 800, line-height: 1.2, tracking: "-0.5px" }
  utilities: [text-heading-sm]
  use: "Kleinere Überschrift."

- token: title
  css_var: "--ap-sys-title-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-1, weight: weight/semibold, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 18, weight: 600, line-height: normal, tracking: "0" }
  utilities: [text-title]
  use: "Abschnitts-/Sektions-Titel."

- token: body
  css_var: "--ap-sys-body-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/regular, line-height: line-height/relaxed, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 400, line-height: 1.5, tracking: "0" }
  utilities: [text-body]
  use: "Fließtext; Body-Default der App."

- token: body-strong
  css_var: "--ap-sys-body-strong-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/semibold, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 600, line-height: normal, tracking: "0" }
  utilities: [text-body-strong]
  use: "Betonter Fließtext."

- token: label
  css_var: "--ap-sys-label-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-label]
  use: "Labels: Form-/Toggle-Labels, Button-Text."

- token: eyebrow
  css_var: "--ap-sys-eyebrow-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg2, weight: weight/medium, line-height: normal, tracking: tracking/wide }
  value: { family: mono, size: 9, weight: 500, line-height: normal, tracking: "0.5px" }
  utilities: [text-eyebrow]
  use: "Uppercase-Mikro-Labels."

- token: data
  css_var: "--ap-sys-data-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg1, weight: weight/regular, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 11, weight: 400, line-height: normal, tracking: "0" }
  utilities: [text-data]
  use: "Tabellarische Mono-Daten (auch Dateinamen u. ä.)."

- token: kbd
  css_var: "--ap-sys-kbd-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg1, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 11, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-kbd]
  use: "Tastatur-Tasten-Text."

- token: input
  css_var: "--ap-sys-input-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-1, weight: weight/regular, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 18, weight: 400, line-height: normal, tracking: "0" }
  utilities: [text-input]
  use: "Command-/Eingabe-Text."
  avoid: "Typo-Klasse — nicht mit dem Farb-Token input (--ap-sys-input, Form-Border) verwechseln."
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
  - { stock: "text-xs/sm/base/lg/… (font-size)", reset: "--text-*: initial",        replace: "passende .text-*-Format-Klasse (§4)" }
  - { stock: "font-normal/medium/semibold/bold", reset: "--font-weight-*: initial",  replace: "Gewicht steckt in der .text-*-Klasse" }
  - { stock: "font-sans/font-mono (family)",     reset: "--font-*: initial",         replace: "Familie steckt in der .text-*-Klasse (mono → text-data/-kbd/-eyebrow/-input)" }
  - { stock: "tracking-*",                       reset: "--tracking-*: initial",     replace: "steckt in der .text-*-Klasse" }
  - { stock: "leading-*",                        reset: "--leading-*: initial",      replace: "steckt in der .text-*-Klasse" }
  - { stock: "shadow-xs/sm/md/lg/xl",            reset: "--shadow-*: initial",       replace: "weglassen (flach) ODER shadow-elevation, wenn Tiefe Bedeutung trägt" }
  - { stock: "Core-Farben (text-red-500 …)",     reset: "--color-*: initial",        replace: "nur DS-Semantics; text-white/current/transparent bleiben" }

geometry_vs_token:
  spacing: "Padding/Gap/Margin → benanntes Token MAPPE ÜBER DEN px-WERT: gap-2(8)→gap-md · gap-1.5(6)→gap-sm · px-4(16)→px-xl · py-2(8)→py-md · px-3(12)→px-lg · px-6(24)→px-2xl."
  control_geometry: "Control-Höhen/Icon-Maße (h-9/h-8/h-10, size-9, size-4) NUMERISCH lassen — nicht auf der Spacing-Skala. Geometrie ≠ Spacing-Token."
  radius: "Radius-Vokabular = corner-sm/md/lg/xl/full (+ corner-none, Seiten corner-b-* usw.); ALLE rounded-* sind TOT (--radius-*: initial, kein Re-Mapping)."

keep_valid:
  - "Container-T-Shirt-Namen auf Sizing-Utilities: max-w-sm/md/…, w-lg, basis-md = --container-Skala (24rem/28rem/…), KEINE Spacing-Steps (§3 Kollisions-Regel)"
  - "Opacity-Modifier auf DS-Tokens: bg-primary/90, ring-ring/50, outline-ring/50"
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

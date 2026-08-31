# Agentport DS — Token / Format Reference (machine-readable)

One data source for component work (Figma build + code wiring). Prose = rules / architecture;
**YAML = token data** (crosswalk Figma → CSS → utility → value + `use` / `avoid` semantics).

Sources: `token-analysis-{color,radius,spacing,typography,effects}.md`, `libs/ui/src/styles/`
(`tokens.css` + Tailwind config `tw-theme.css` / `tw-utilities.css` / `tw-variants.css`, entry
`globals.css`). On drift: **`tokens.css` / `tw-theme.css` / `tw-utilities.css`** win for values and
utilities, `token-analysis-*` for semantics.

## Rules

- **Semantics come from a source — never guessed.** `use` = the generic role of the token and its
  boundary to neighbouring tokens (when to use it, when not); `avoid` = a documented restriction.
  Where the source is silent: `tbd` or omit the field. No screen-specific examples, no component
  names — roles are phrased semantically (components change, roles don't).
- **Descriptions are unambiguous.** Group words (`primary`, `secondary`, `accent`, `brand`, `muted`,
  `inverse`) are never used as adjectives in another token's description — only as explicit
  references ("use accent-fill"). `-fill` / `-ink` always describe a text-on-surface pair; standalone
  colours (`ink`, `primary`, `muted`) have no surface partner and are shape/text only.
- **`use` is the canonical sentence** — the same text sits on the Figma variable description and in
  the Storybook foundations (`Colors.tsx`, `SpacingRadius.tsx`, `Typography.tsx`). Change it here,
  then push to both.
- **`status: placeholder`** = stock shadcn default, not yet designed → never treat as final.
  (Currently unused — every former placeholder has been designed; the rule stays for future ports.)
- Values = light mode (the only mode); dark does not exist yet.
- Primitives are internal (not in `@theme`) → components use **semantics only**, never
  `bg-cyan-500` / `rounded-4`-style utilities.

## Schema

```
token | css_var | primitive | value | utilities | use | avoid? | status? | note?
```

## Architecture

```
Figma "Agentport DS" (fileKey ejFKo4MNuvC9TSDKOCUvyq)
  reference = primitives, ONE collection with groups Color/ Dimension/ Font/ Effect (scopes: []
              alias-only; exception Effect/* = EFFECT_* scopes, bound directly by the Effect Styles)
  semantic* = semantics (alias → primitive); four collections: semantic (colour), semantic-dimension
              (space + corner), semantic-typo (14 formats × 5 parts), plus reference
  CSS naming: primitives = --ap-<figma-path-with-dashes> (Color/signal/600 → --ap-color-signal-600,
              Font/family/sans → --ap-font-family-sans). Semantics = --ap-sys-<token-leaf> —
              Figma groups are organisational only (Dialog/dialog-fill → --ap-sys-dialog-fill,
              Input/input-ink-placeholder → --ap-sys-input-ink-placeholder; the shadcn Default/
              group was dissolved 2026-06-18 → Base/ Primary/ Secondary/ Muted/ Accent/ Destructive/
              Cards/ Focus/ Charts/).
              semantic-typo: organisational group on top, token = format/part
              (Heading/heading-sm/family → --ap-sys-heading-sm-family; leading is called line-height).
              Shadows: --ap-sys-shadow-glow / -elevation — sys tier exists in CSS only (no Figma
              counterpart; the Effect Styles bind the Effect/* parts directly). Figma has no prefix.
        │ Export → libs/ui/src/styles/tokens.css   (:root: PRIMITIVES, then SEMANTICS via var())
        │ Bridge → libs/ui/src/styles/tw-theme.css (@theme inline) + tw-utilities.css (@utility) +
        │          tw-variants.css (@custom-variant) — entry / seam: globals.css (imports all)
```

---

## 1 · Colour

Primitives (internal; Figma group `Color/` — the YAML uses the short paths, CSS = `--ap-color-…`).
**2026-06-17:** old `neutral` + `cyan` replaced by 7 OKLCH ramps (pencilcolor). `signal / still / deep`
= the three brand-blue ramps (naming decision "Signal / Still / Deep"); `neutral` = de-tinted greys
(blue cast removed, C × 0.5) incl. the extra steps `25` + `75`; `success / warning / error` = status family.
**2026-08-31:** ramp `ink` renamed to **`neutral`** (Figma `Color/neutral/*`, CSS `--ap-color-neutral-*`);
"old-neutral/…" in the notes = the pre-rework palette. The semantic suffix `-ink` (text role) stays.

```yaml
base/white: "#ffffff"   # --ap-color-base-white
signal: { 50: "#c4feff", 100: "#a4e5ff", 200: "#7cceff", 300: "#51b6f3", 400: "#009fe3", 500: "#0081d2", 600: "#0063bb", 700: "#00459c", 800: "#002779", 900: "#000854", 950: "#010034" }   # brand = signal/400 #009FE3; AA text on white from 600 (#0063BB ≥ 4.5:1)
still:  { 50: "#d8fbff", 100: "#bde4fd", 200: "#9fcdeb", 300: "#80b7d9", 400: "#61a1c8", 500: "#3a8cba", 600: "#0077a8", 700: "#005685", 800: "#003761", 900: "#00193d", 950: "#00001e" }
deep:   { 50: "#eaf8ff", 100: "#cfdde6", 200: "#b2c4cf", 300: "#97abb7", 400: "#7c93a0", 500: "#617c8b", 600: "#476575", 700: "#314f5e", 800: "#1e3947", 900: "#0d2531", 950: "#00121c" }
neutral:       { 25: "#f9fcfd", 50: "#f3f5fa", 75: "#e4e6eb", 100: "#d5d8dd", 200: "#b8bbc0", 300: "#9b9fa5", 400: "#7f848b", 500: "#656971", 600: "#4b5059", 700: "#343840", 800: "#1e2229", 900: "#0d1016", 950: "#020306" }   # neutral/800 = #1E2229 (brand text, was #1A2230)
success:   { 50: "#defeec", 100: "#c6ead6", 200: "#abd7bf", 300: "#91c4a8", 400: "#76b192", 500: "#57a07a", 600: "#298058", 700: "#005f3a", 800: "#00401f", 900: "#002207", 950: "#000700" }
warning:   { 50: "#fff0c8", 100: "#fbd9ac", 200: "#eac18a", 300: "#d9a967", 400: "#c8923f", 500: "#af7000", 600: "#944f00", 700: "#753100", 800: "#541500", 900: "#340000", 950: "#160000" }
error:     { 50: "#ffe3d9", 100: "#ffc6bb", 200: "#fca69a", 300: "#e98779", 400: "#d66859", 500: "#c54235", 600: "#b01207", 700: "#8e0000", 800: "#6a0000", 900: "#440000", 950: "#220000" }
opacity:   { 10: "10% — Figma value 10 (opacity variables use the 0–100 scale), CSS --ap-color-opacity-10: 10%" }
```

> **Effect colours** `glow` / `elevation` are bound to the ramps in CSS (user decision):
> `glow → signal/400 @ 50%`, `elevation → neutral/900 @ 18%` (via `color-mix`). **Not representable
> 1:1 in Figma:** an effect colour there is a raw RGBA in the `Effect/*` primitive — a colour binding
> replaces the whole RGBA, a live alias onto a ramp is impossible. Figma's `Effect/*` therefore hold
> raw values on purpose (#0098da / #1a2230); **code is the source** for the effect colours, the
> divergence is accepted (no Figma to-do).

**Naming rework 2026-06-17 (Figma):** colour semantics moved to a **`-fill` / `-ink` / `-border`
system**. Surface token = bare name or `-fill`, text / icon = `-ink` (replaces `-foreground`),
edges = `-border`. Utilities from `--color-{name}`: `bg-{name}`, `text-{name}`, `border-{name}`,
`ring-{name}` (border utility doubles up: `border-border`, `border-accent-border`, `border-input-border`).

Migration old → new: `background` → `surface` · `foreground` → `ink` · `card-foreground` → `card-ink` ·
`muted` → `muted-fill` · `muted-foreground` → `muted-ink` · `accent` → `accent-fill` ·
`accent-foreground` → `accent-ink` · `input` → `input-border` · `input-background` → `input-fill` ·
`input-placeholder` → `input-ink-placeholder` · `overlay` → `overlay-fill` · `overlay-foreground` → `overlay-ink` ·
`inverse` → `inverse-fill` · `inverse-foreground` → `inverse-ink` · `sidebar` → `sidebar-fill` ·
`sidebar-*-foreground` → `sidebar-*-ink` · `primary-foreground` → `primary-ink` · `secondary-foreground` → `secondary-ink` ·
`destructive-foreground` → `destructive-ink`. **New:** `primary-fill`, `accent-border`, `input-fill-high`.
**Dropped:** `primary` as a surface (now the emphasis tone signal/600 + a separate dark `primary-fill`).

**Naming rework 2026-06-18 (Figma):** shadcn-compat layer dissolved (further away from the shadcn
default). The `shadcn Default/` group is gone — tokens regrouped (`Base/ · Primary/ · Secondary/ · Muted/ ·
Accent/ · Destructive/ · Cards/ · Focus/ · Charts/`; organisational only, **no** CSS effect — leaf-name rule).
Leaf renames: `overlay` + `popover` consolidated into **one** raised-surface token **`dialog`**
(`overlay-fill` → `dialog-fill`, `overlay-ink` → `dialog-ink`; `popover` / `popover-foreground` **removed**) ·
`card` → `card-fill`.

**Semantics rework 2026-08-31 (descriptions audit):** `Muted/muted` — a Figma-only token until now —
became the **standalone de-emphasised colour** (`--ap-sys-muted`, `text-muted`); `muted-ink` is
restricted to text on `muted-fill` (the pair rule). `Inverse/inverse-ink/muted` renamed to
`Inverse/inverse-ink-muted` (leaf rule). `background-fixed` **removed** (no binding, no call site).
`inverse-container-hover` **55 % → 70 %** (Figma value adopted). All Figma descriptions, this file and
the Storybook foundations now share one English sentence per token.

Values = light mode. `note` shows the old value / name.

```yaml
# Core surface + ink (Figma: Base/ · Cards/ · Muted/)
- { token: surface,     css_var: --ap-sys-surface,     primitive: base/white,  value: "#ffffff", utilities: [bg-surface],          use: "App base surface.", note: "was: background" }
- { token: ink,         css_var: --ap-sys-ink,         primitive: neutral/900, value: "#0d1016", utilities: [text-ink, "bg-ink¹/fill-ink¹"],  use: "Default text / icon colour. Shape fill only — no frame fill (dark surfaces use inverse-fill). ¹SHAPE_FILL allowed → bg-ink/fill-ink ONLY for shape / marker fills, NOT as a container / frame surface.", note: "was: foreground" }
- { token: card-fill,   css_var: --ap-sys-card-fill,   primitive: neutral/50,  value: "#f3f5fa", utilities: [bg-card-fill],        use: "Raised / secondary panel surface.", note: "was: card" }
- { token: card-ink,    css_var: --ap-sys-card-ink,    primitive: neutral/900, value: "#0d1016", utilities: [text-card-ink],       use: "Text on card-fill.", note: "was: card-foreground" }
- { token: muted-fill,  css_var: --ap-sys-muted-fill,  primitive: neutral/25,  value: "#f9fcfd", utilities: [bg-muted-fill],       use: "Low-emphasis surface that recedes behind content — footer strips, row hover, quiet variants of a control. Content panels use card-fill instead.", note: "was: muted" }
- { token: muted-ink,   css_var: --ap-sys-muted-ink,   primitive: neutral/500, value: "#656971", utilities: [text-muted-ink],      use: "Text / icon on muted-fill only. For de-emphasised text on any other surface use muted.", note: "was: muted-foreground (old-neutral/600). 2026-08-31: restricted to the muted-fill pair — 60+ call sites moved to text-muted." }
- { token: muted,       css_var: --ap-sys-muted,       primitive: neutral/500, value: "#656971", utilities: [text-muted, "bg-muted¹/fill-muted¹"], use: "De-emphasised text, icon or marker on surfaces other than muted-fill — descriptions, hints, group headings, secondary glyphs. Shape fill only — no frame fill (surfaces use muted-fill). ¹SHAPE_FILL allowed → bg-muted ONLY for shape / marker fills.", note: "new in code 2026-08-31 (existed in Figma since 2026-07 without a CSS counterpart)" }

# Primary / secondary / accent (Figma: Primary/ · Secondary/ · Accent/)
- { token: primary,        css_var: --ap-sys-primary,        primitive: signal/600, value: "#0063bb", utilities: [text-primary, border-primary, ring-primary, "bg-primary¹/fill-primary¹"], use: "Emphasis colour for interactive text and glyphs on light surfaces (AA on white) — links, link-style actions, caret / marker shapes. Shape fill only — no frame fill (surfaces use primary-fill). On dark surfaces use brand-ink; for state tints use accent-fill. ¹SHAPE_FILL allowed → bg-primary/fill-primary ONLY for shape / marker fills (a rectangle / vector in Figma), NOT as a container / frame surface.", note: "was: cyan/500 #0098da" }
- { token: primary-fill,   css_var: --ap-sys-primary-fill,   primitive: deep/900,   value: "#0d2531", utilities: [bg-primary-fill],  use: "Dark surface of the main action and of the checked / on state of a control (check box, radio dot, switch track, filled range). Pairs with primary-ink.", note: "new" }
- { token: primary-ink,    css_var: --ap-sys-primary-ink,    primitive: signal/100, value: "#a4e5ff", utilities: [text-primary-ink], use: "Text / icon on primary-fill only.", note: "was: primary-foreground (white)" }
- { token: secondary-fill, css_var: --ap-sys-secondary-fill, primitive: still/100,  value: "#bde4fd", utilities: [bg-secondary-fill], use: "Light surface of the secondary action — secondary buttons, badges. Lower weight than primary-fill; for quiet chrome use muted-fill. Pairs with secondary-ink.", note: "was: secondary (renamed 2026-06-19, -fill convention); before that placeholder #f5f5f5. Button / Badge re-clothed." }
- { token: secondary-ink,  css_var: --ap-sys-secondary-ink,  primitive: deep/900,   value: "#0d2531", utilities: [text-secondary-ink], use: "Text / icon on secondary-fill only.", note: "was: secondary-foreground" }
- { token: accent-fill,    css_var: --ap-sys-accent-fill,    primitive: deep/50,    value: "#eaf8ff", utilities: [bg-accent-fill],   use: "Tint that marks state — selected rows, active items, hover on list entries. Not an action surface (that is secondary-fill / primary-fill). Pairs with accent-ink and accent-border.", note: "was: accent (cyan/50)" }
- { token: accent-ink,     css_var: --ap-sys-accent-ink,     primitive: signal/600, value: "#0063bb", utilities: [text-accent-ink],  use: "Text / icon on accent-fill only.", note: "was: accent-foreground (cyan/700)" }
- { token: accent-border,  css_var: --ap-sys-accent-border,  primitive: still/200,  value: "#9fcdeb", utilities: [border-accent-border], use: "Edge of an accent-fill area — outlines the selected / active item. Not a focus ring (use ring).", note: "new" }

# Brand (Figma: Brand/) — on-dark brand moment (new 2026-06-19)
- { token: brand-fill, css_var: --ap-sys-brand-fill, primitive: deep/900,   value: "#0d2531", utilities: [bg-brand-fill], use: "Dark surface reserved for brand moments — hero, intro, wordmark panels. Not for functional dark chrome (use inverse-fill). Pairs with brand-ink." }
- { token: brand-ink,  css_var: --ap-sys-brand-ink,  primitive: signal/400, value: "#009fe3", utilities: [text-brand-ink, "bg-brand-ink¹/fill-brand-ink¹"], use: "Signal-blue text, icon or marker on brand-fill only — the one place the full brand hue (signal/400) is used. On light surfaces use primary. Shape fill only — no frame fill. ¹SHAPE_FILL → bg-brand-ink ONLY as shape / marker fill.", note: "new — closes the former signal/400 semantic gap (previously worked around in the hero via an arbitrary var())" }

# Destructive (Figma: Destructive/)
- { token: destructive,     css_var: --ap-sys-destructive,     primitive: error/600, value: "#b01207", utilities: [bg-destructive, text-destructive, border-destructive, ring-destructive], use: "Colour of irreversible actions and errors — delete buttons, invalid-field borders, error text, its focus ring. One token for fill, text and stroke. Not for warnings (no token yet). Pairs with destructive-ink when used as a surface.", note: "was placeholder #e7000b. STROKE_COLOR → also ring-destructive (focus)." }
- { token: destructive-ink, css_var: --ap-sys-destructive-ink, primitive: error/50,  value: "#ffe3d9", utilities: [text-destructive-ink, border-destructive-ink], use: "Text / icon / edge on a destructive surface only.", note: "was: destructive-foreground" }

# Ring + borders (Figma: Focus/ · Border/)
- { token: ring,            css_var: --ap-sys-ring,            primitive: neutral/800, value: "#1e2229", utilities: [ring-ring, outline-ring],   use: "Keyboard-focus indicator on light surfaces. Not a border and not a selection edge (use accent-border).", note: "was old-neutral/700" }
- { token: border,          css_var: --ap-sys-border,          primitive: neutral/75,  value: "#e4e6eb", utilities: [border-border],              use: "Default edge — dividers, card and field outlines on light surfaces. Start here; step up only when a line must read stronger.", note: "was old-neutral/200" }
- { token: border-emphasis, css_var: --ap-sys-border-emphasis, primitive: neutral/200, value: "#b8bbc0", utilities: [border-border-emphasis],     use: "Second step of the line ladder — table header rules, group separators that must stand out from border." }
- { token: border-strong,   css_var: --ap-sys-border-strong,   primitive: neutral/300, value: "#9b9fa5", utilities: [border-border-strong],       use: "Top step of the line ladder — the one line that must dominate (axis, hard cut). Use sparingly.", note: "was old-neutral/700 — now lighter" }

# Sidebar (Figma: Sidebar/) — no sidebar component exists yet; the family mirrors the main layer for a future one
- { token: sidebar-fill,         css_var: --ap-sys-sidebar-fill,         primitive: neutral/25,  value: "#f9fcfd", utilities: [bg-sidebar-fill],          use: "Surface of the navigation sidebar / rail. Only inside the sidebar; elsewhere use surface or muted-fill.", note: "was: sidebar" }
- { token: sidebar-ink,          css_var: --ap-sys-sidebar-ink,          primitive: neutral/900, value: "#0d1016", utilities: [text-sidebar-ink],         use: "Default text / icon on sidebar-fill." }
- { token: sidebar-primary-fill, css_var: --ap-sys-sidebar-primary-fill, primitive: deep/900,    value: "#0d2531", utilities: [bg-sidebar-primary-fill, text-sidebar-primary-fill],  use: "Surface of the sidebar's main action (e.g. the workspace / brand button); also usable as its text / icon colour. Pairs with sidebar-primary-ink.", note: "was: sidebar-primary" }
- { token: sidebar-primary-ink,  css_var: --ap-sys-sidebar-primary-ink,  primitive: signal/200,  value: "#7cceff", utilities: [text-sidebar-primary-ink], use: "Text / icon on sidebar-primary-fill only." }
- { token: sidebar-accent-fill,  css_var: --ap-sys-sidebar-accent-fill,  primitive: deep/50,     value: "#eaf8ff", utilities: [bg-sidebar-accent-fill],   use: "Tint of the active / hovered navigation item. Pairs with sidebar-accent-ink.", note: "was: sidebar-accent" }
- { token: sidebar-accent-ink,   css_var: --ap-sys-sidebar-accent-ink,   primitive: signal/600,  value: "#0063bb", utilities: [text-sidebar-accent-ink],  use: "Text / icon on sidebar-accent-fill only." }
- { token: sidebar-border,       css_var: --ap-sys-sidebar-border,       primitive: neutral/50,  value: "#f3f5fa", utilities: [border-sidebar-border],    use: "Dividers and the sidebar edge." }
- { token: sidebar-ring,         css_var: --ap-sys-sidebar-ring,         primitive: neutral/800, value: "#1e2229", utilities: [ring-sidebar-ring],        use: "Keyboard-focus indicator inside the sidebar." }

# Charts — ramp-bound (Figma: Charts/); use = "Data-series colour N of 5 — assign in order (series 1 → chart-1). Carries no status meaning even where the hue matches a status ramp; for errors use destructive."
- { token: chart-1, css_var: --ap-sys-chart-1, primitive: warning/700, value: "#753100", utilities: [bg-chart-1, border-chart-1] }
- { token: chart-2, css_var: --ap-sys-chart-2, primitive: success/600, value: "#298058", utilities: [bg-chart-2, border-chart-2] }
- { token: chart-3, css_var: --ap-sys-chart-3, primitive: deep/900,    value: "#0d2531", utilities: [bg-chart-3, border-chart-3] }
- { token: chart-4, css_var: --ap-sys-chart-4, primitive: warning/400, value: "#c8923f", utilities: [bg-chart-4, border-chart-4] }
- { token: chart-5, css_var: --ap-sys-chart-5, primitive: error/500,   value: "#c54235", utilities: [bg-chart-5, border-chart-5] }

# Dialog + scrim (Figma: Dialog/ · Scrim/) — overlay + popover consolidated into `dialog` 2026-06-18
- { token: dialog-fill,         css_var: --ap-sys-dialog-fill,         primitive: base/white,  value: "#ffffff", utilities: [bg-dialog-fill],        use: "Surface of anything floating above the layout — dialogs, popovers, menus, command palette, tooltips. Pairs with dialog-ink and the Elevation effect. For in-flow panels use card-fill.", note: "was: overlay-fill / popover" }
- { token: dialog-ink,          css_var: --ap-sys-dialog-ink,          primitive: neutral/900, value: "#0d1016", utilities: [text-dialog-ink],        use: "Default text / icon on dialog-fill.", note: "was: overlay-ink / popover-foreground" }
- { token: scrim,               css_var: --ap-sys-scrim,               primitive: "neutral/900 × scrim-opacity", value: "color-mix(in srgb, #0d1016 10%, transparent)", utilities: [bg-scrim], use: "Colour of the backdrop that dims the page behind a modal dialog. Full-alpha alias; the strength comes from scrim-opacity on the overlay layer (CSS composes both via color-mix) — no opacity modifier on top.", note: "was old-neutral/900" }
- { token: scrim-opacity,       css_var: --ap-sys-scrim-opacity,       primitive: opacity/10,  value: "10%", utilities: [], use: "Strength of the modal backdrop (10 %). FLOAT, scope OPACITY — bound to the overlay layer's opacity in Figma; composes with scrim." }

# Input (Figma: Input/)
- { token: input-ink-placeholder, css_var: --ap-sys-input-ink-placeholder, primitive: neutral/500, value: "#656971", utilities: [text-input-ink-placeholder], use: "Placeholder / hint text inside a field. The entered value uses ink; helper text outside the field uses muted.", note: "was: input-placeholder (neutral/400)" }
- { token: input-fill,            css_var: --ap-sys-input-fill,            primitive: neutral/25,  value: "#f9fcfd", utilities: [bg-input-fill],               use: "Resting surface of an editable field — text inputs, selects, check boxes before they are checked. Pairs with ink for the value and input-ink-placeholder for the hint.", note: "was: input-background" }
- { token: input-fill-high,       css_var: --ap-sys-input-fill-high,       primitive: neutral/400, value: "#7f848b", utilities: [bg-input-fill-high],          use: "Resting track of a range or toggle control (the unfilled part). The filled / on part is primary-fill. Same tone as input-border so control and edge read as one.", note: "new" }
- { token: input-border,          css_var: --ap-sys-input-border,          primitive: neutral/400, value: "#7f848b", utilities: [border-input-border],         use: "Edge of fields and controls (AA against surface). Deliberately stronger than border; for the focused state add ring.", note: "was: input (neutral/450)" }

# Inverse (Figma: Inverse/) — dark functional surfaces. 2026-07-01: + ink-muted / border / container trio; inverse-ink neutral/50 → neutral/75.
- { token: inverse-fill,            css_var: --ap-sys-inverse-fill,            primitive: deep/950,        value: "#00121c",   utilities: [bg-inverse-fill],            use: "Dark functional surface — icon rail, keyboard badges, dark chips. Not for brand moments (use brand-fill). Pairs with inverse-ink.", note: "was: inverse (neutral/900)" }
- { token: inverse-ink,             css_var: --ap-sys-inverse-ink,             primitive: neutral/75,      value: "#e4e6eb",   utilities: [text-inverse-ink],           use: "Default text / icon on inverse-fill.", note: "2026-07-01: was neutral/50" }
- { token: inverse-ink-muted,       css_var: --ap-sys-inverse-ink-muted,       primitive: neutral/400,     value: "#7f848b",   utilities: [text-inverse-ink-muted],     use: "De-emphasised text / icon on inverse-fill — the dark-surface counterpart of muted.", note: "new 2026-07-01; Figma renamed Inverse/inverse-ink/muted → Inverse/inverse-ink-muted 2026-08-31 (leaf rule)" }
- { token: inverse-border,          css_var: --ap-sys-inverse-border,          primitive: deep/900,        value: "#0d2531",   utilities: [border-inverse-border],      use: "Dividers and edges on inverse-fill.", note: "new 2026-07-01" }
- { token: inverse-container,       css_var: --ap-sys-inverse-container,       primitive: "deep/900 @30%", value: "#0d25314d", utilities: [bg-inverse-container],       use: "Resting inner panel on inverse-fill (card in the rail) — deep/900 at 30 %.", note: "new 2026-07-01; raw RGBA in Figma (no alias possible), color-mix in CSS like scrim" }
- { token: inverse-container-low,   css_var: --ap-sys-inverse-container-low,   primitive: "deep/900 @20%", value: "#0d253133", utilities: [bg-inverse-container-low],   use: "Idle / inactive inner panel on inverse-fill — deep/900 at 20 %.", note: "new 2026-07-01; color-mix" }
- { token: inverse-container-hover, css_var: --ap-sys-inverse-container-hover, primitive: "deep/900 @70%", value: "#0d2531b2", utilities: [bg-inverse-container-hover], use: "Hovered / active inner panel on inverse-fill — deep/900 at 70 %.", note: "new 2026-07-01 at 55 %; 2026-08-31: code / docs aligned to the Figma value 70 %" }
```

**Line ladder (ascending):** `border` (neutral/75) < `border-emphasis` (neutral/200) < `border-strong` (neutral/300).
**Primary model:** `primary` = emphasis tone (signal/600, AA text / stroke) · `primary-fill` = dark surface (deep/900) + `primary-ink` (signal/100) as text on it.
**Standalone colours vs pairs:** `ink`, `primary`, `muted` (and `brand-ink`) carry `SHAPE_FILL` but **no** `FRAME_FILL`. So `bg-ink` / `bg-primary` / `bg-muted` (or `fill-*`) are **valid for shape / marker fills** (a rectangle / vector in Figma — e.g. the command caret), but **not** as a container / frame surface. Container surfaces = the `-fill` tokens (`primary-fill`, `muted-fill`, `inverse-fill`). Every `-ink` belongs to exactly one `-fill`.
**Accent trio:** `accent-fill` (tint) · `accent-ink` (text on it) · `accent-border` (edge).
**Status family:** `destructive` (error) exists. `success` / `warning` exist as ramps (charts); dedicated semantic tokens for them are still tbd.

---

## 2 · Corner (radius)

Primitives (`reference`, group `Dimension/radius`, internal): `4 · 6 · 8 · 16 · full (9999)`. Semantics
(Figma group `Corner/`) alias them, scope `CORNER_RADIUS`. Utilities = **custom utilities
`corner-*`** via a `--corner-step-*` lookup (same pattern as the space steps);
sides / corners: `corner-t/r/b/l-*` + `corner-tl/tr/br/bl-*`, plus the static `corner-none`.

```yaml
- { token: corner-sm,   css_var: --ap-sys-corner-sm,   primitive: radius/4,    value: 4px,    utilities: [corner-sm],   use: "Smallest radius — tick boxes, keycaps, markers and rows nested inside a panel." }
- { token: corner-md,   css_var: --ap-sys-corner-md,   primitive: radius/6,    value: 6px,    utilities: [corner-md],   use: "Compact size class of a control (small / icon-only sizes), tooltips, menu rows." }
- { token: corner-lg,   css_var: --ap-sys-corner-lg,   primitive: radius/8,    value: 8px,    utilities: [corner-lg],   use: "Regular size class of a control — fields, standard buttons, floating panels, in-flow items. Default; start here." }
- { token: corner-xl,   css_var: --ap-sys-corner-xl,   primitive: radius/16,   value: 16px,   utilities: [corner-xl],   use: "Windows — dialogs and other large floating surfaces." }
- { token: corner-full, css_var: --ap-sys-corner-full, primitive: radius/full, value: 9999px, utilities: [corner-full], use: "Pills and circles — toggles, radio dots, slider parts, badges. Only for shapes meant to read as round." }
```

**Dead:** ALL `rounded-*` (`--radius-*: initial`, no re-mapping) — the DS radius vocabulary is
exclusively `corner-*`. twMerge knows the corner groups incl. side / corner conflicts
(cn() extension in `libs/ui/src/lib/utils.ts`).

---

## 3 · Spacing (gap + padding, one system)

One system for gap **and** padding (Figma scope `GAP`); `m-*` as a code idiom (§7). The only
primitive is the base unit `Dimension/space/base` → `--ap-dimension-space-base` (4px); the steps are
**direct values** in Figma (only `space-xs` aliases the base unit), `calc(base × n)` in CSS. Pick the
step by the distance needed. Utilities are **named** — via `@utility` on `--space-step-*`, for the
families `gap/gap-x/gap-y`, `p/px/py/pt/pr/pb/pl`, `m/mx/my/mt/mr/mb/ml` and the inset family
`top/right/bottom/left` + `inset/inset-x/inset-y` (added 2026-06-19 — position offsets ride the same
rhythm; **no** `--container` collision as with sizing, because inset has no container scale), each
incl. negatives `-m…` / `-top…` (the YAML lists `p-` / `gap-` as representatives) — **plus numeric**
(`p-4` / `gap-2` / `top-6` / `h-9` via the `--spacing` base), fractions (`left-1/2`) and keywords
(`inset-auto`) through the core utilities; all valid, do not remove. The `use` per step is a role
hint, not a rule — the choice runs over the px value (§6).

**Collision rule (2026-06-11):** the steps deliberately do **not** live on Tailwind's `--spacing-*` —
that namespace feeds every sizing utility and resolves **before** `--container` (`max-w-md` would be
8px instead of 28rem). T-shirt names on `w-*` / `max-w-*` / `min-w-*` / `basis-*` = **container scale**
(stock); `h-*` / `size-*` have no named steps (geometry is numeric, §6).

```yaml
# use suffix on every step: "One scale for gap, padding and margin — pick the step by the distance needed."
- { token: space-2xs, css_var: --ap-sys-space-2xs, primitive: "— (direct)", value: 2px,  utilities: [p-2xs, gap-2xs], use: "Hairline — vertical padding of the smallest pill, gap between stacked micro-elements." }
- { token: space-xs,  css_var: --ap-sys-space-xs,  primitive: space/base,   value: 4px,  utilities: [p-xs,  gap-xs],  use: "Gap inside a control (icon to label); tightest inner padding." }
- { token: space-sm,  css_var: --ap-sys-space-sm,  primitive: "— (direct)", value: 6px,  utilities: [p-sm,  gap-sm],  use: "Inner padding of small controls; gap in inline text runs." }
- { token: space-md,  css_var: --ap-sys-space-md,  primitive: "— (direct)", value: 8px,  utilities: [p-md,  gap-md],  use: "Default — gap between siblings, standard control padding. Start here." }
- { token: space-lg,  css_var: --ap-sys-space-lg,  primitive: "— (direct)", value: 12px, utilities: [p-lg,  gap-lg],  use: "Padding of list rows and floating panels; gap between a control and its label block." }
- { token: space-xl,  css_var: --ap-sys-space-xl,  primitive: "— (direct)", value: 16px, utilities: [p-xl,  gap-xl],  use: "Padding of windows and panels; gap between groups." }
- { token: space-2xl, css_var: --ap-sys-space-2xl, primitive: "— (direct)", value: 24px, utilities: [p-2xl, gap-2xl], use: "Vertical breathing room of empty / placeholder states." }
- { token: space-3xl, css_var: --ap-sys-space-3xl, primitive: "— (direct)", value: 32px, utilities: [p-3xl, gap-3xl], use: "Reserved space for a trailing indicator inside a row." }
- { token: space-4xl, css_var: --ap-sys-space-4xl, primitive: "— (direct)", value: 48px, utilities: [p-4xl, gap-4xl], use: "Page and section margins of a layout." }
- { token: space-5xl, css_var: --ap-sys-space-5xl, primitive: "— (direct)", value: 80px, utilities: [p-5xl, gap-5xl], use: "Editorial / hero spacing only." }
```

---

## 4 · Typography — 14 formats

Composition utilities (`@utility text-format-<format>` in tw-utilities.css, multi-value:
family + size + weight + line-height + tracking) → **one class** instead of individual `text-` / `font-`
utilities (the latter are dead through the theme reset, §6). **Naming `text-format-*` (since 2026-06-11):**
the earlier name `text-<format>` collided with Tailwind's generated colour utilities — `text-input` was
a format class and the colour from `--color-input` at the same time (both rules in the CSS). Every
format consists of **5 part tokens**: Figma `<OrgGroup>/<format>/<part>` (semantic-typo; the text
styles bind family / size / weight / tracking) ↔ CSS `--ap-sys-<format>-<part>`. Org groups: Display ·
Heading (heading, heading-sm) · Title · Lead · Body (body, body-strong) · Label (label-md, label-sm) ·
Eyebrow · Data (data-sm, data-md, data-lg) · Kbd.

Primitives (internal; Figma group `Font/` — the YAML uses the short paths, CSS = `--ap-font-…`):

```yaml
family:      { sans: "Hanken Grotesk", mono: "Geist Mono" }                 # --ap-font-family-sans/-mono
weight:      { regular: 400, medium: 500, semibold: 600, extrabold: 800 }   # --ap-font-weight-*
size:        { base: 14, step-neg2: 9, step-neg1: 11, step-0: 14, step-1: 18, step-2: 22, step-3: 27, step-4: "34 (spare)", step-5: 43 }
             # --ap-font-size-step-* — modular scale: base × scale^n; Font/scale = 1.25 → --ap-font-scale
line-height: { tight: 1.0, snug: 1.2, relaxed: 1.5, normal: "CSS keyword (STRING primitive Font/line-height/normal)" }   # --ap-font-line-height-*
tracking:    { tight: "-0.5px", normal: "0", wide: "0.5px" }                # --ap-font-tracking-*
```

Formats (`primitive` = short paths under `Font/`). **Line height in Figma:** a text style cannot bind
line height, so every `<format>/line-height` variable is a **value store for export only** (D12) —
all 14 formats have 5 Figma vars (70 in `semantic-typo`); the style itself carries the raw auto/%
value. `line-height: normal` resolves to the `Font/line-height/normal` STRING primitive.

The `use` sentence per format is the same text that sits on the Figma text style.

```yaml
- token: display
  css_var: "--ap-sys-display-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-5, weight: weight/extrabold, line-height: line-height/tight, tracking: tracking/tight }
  value: { family: sans, size: 43, weight: 800, line-height: 1.0, tracking: "-0.5px" }
  utilities: [text-format-display]
  use: "Hero headline — one per page at most."

- token: heading
  css_var: "--ap-sys-heading-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-3, weight: weight/extrabold, line-height: line-height/snug, tracking: tracking/tight }
  value: { family: sans, size: 27, weight: 800, line-height: 1.2, tracking: "-0.5px" }
  utilities: [text-format-heading]
  use: "Page / section heading."

- token: heading-sm
  css_var: "--ap-sys-heading-sm-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-2, weight: weight/extrabold, line-height: line-height/snug, tracking: tracking/tight }
  value: { family: sans, size: 22, weight: 800, line-height: 1.2, tracking: "-0.5px" }
  utilities: [text-format-heading-sm]
  use: "Sub-heading inside a section."

- token: title
  css_var: "--ap-sys-title-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-1, weight: weight/extrabold, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 18, weight: 800, line-height: normal, tracking: "0" }
  utilities: [text-format-title]
  use: "Title of a panel, group or dialog; the largest text inside a component."
  note: "2026-07-01: weight 600 → 800 (extrabold). Affects field titles / legends + dialog titles."

- token: lead
  css_var: "--ap-sys-lead-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-1, weight: weight/regular, line-height: line-height/relaxed, tracking: tracking/normal }
  value: { family: sans, size: 18, weight: 400, line-height: 1.5, tracking: "0" }
  utilities: [text-format-lead]
  use: "Large intro paragraph under a heading."

- token: body
  css_var: "--ap-sys-body-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/regular, line-height: line-height/relaxed, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 400, line-height: 1.5, tracking: "0" }
  utilities: [text-format-body]
  use: "Running text; the app default."

- token: body-strong
  css_var: "--ap-sys-body-strong-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/semibold, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 600, line-height: normal, tracking: "0" }
  utilities: [text-format-body-strong]
  use: "Emphasised run inside body text."

- token: label-md
  css_var: "--ap-sys-label-md-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-0, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 14, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-format-label-md]
  use: "Default UI label — control labels, button text, field labels."
  note: "2026-07-01: Figma rename label → label-md; the utility deliberately stays `text-format-label-md` (53+ call sites, no rename churn)."

- token: label-sm
  css_var: "--ap-sys-label-sm-{family,size,weight,line-height,tracking}"
  primitive: { family: family/sans, size: size/step-neg1, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: sans, size: 11, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-format-label-sm]
  use: "Small UI label — secondary controls, dense rows."
  note: "new 2026-07-01."

- token: eyebrow
  css_var: "--ap-sys-eyebrow-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg2, weight: weight/medium, line-height: normal, tracking: tracking/wide }
  value: { family: mono, size: 9, weight: 500, line-height: normal, tracking: "0.5px" }
  utilities: [text-format-eyebrow]
  use: "Uppercase micro-label above a title or group (mono, tracked)."

- token: data-sm
  css_var: "--ap-sys-data-sm-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg2, weight: weight/medium, line-height: normal, tracking: tracking/wide }
  value: { family: mono, size: 9, weight: 500, line-height: normal, tracking: "0.5px" }
  utilities: [text-format-data-sm]
  use: "Micro mono value — meta, slugs, counters."
  note: "2026-07-01: re-tiered — was 11px/400/normal; the 11px role is now data-md. (Spec = eyebrow, but without the sans caps.)"

- token: data-md
  css_var: "--ap-sys-data-md-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg1, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 11, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-format-data-md]
  use: "Tabular mono value — identifiers, paths, property values."
  note: "new 2026-07-01; takes over the previous data-sm 11px role."

- token: data-lg
  css_var: "--ap-sys-data-lg-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-1, weight: weight/regular, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 18, weight: 400, line-height: normal, tracking: "0" }
  utilities: [text-format-data-lg]
  use: "Large mono value — the text of a command / query input."
  avoid: "Typography class — not to be confused with the colour token input-border (--ap-sys-input-border, field edge)."
  note: "was: input"

- token: kbd
  css_var: "--ap-sys-kbd-{family,size,weight,line-height,tracking}"
  primitive: { family: family/mono, size: size/step-neg1, weight: weight/medium, line-height: normal, tracking: tracking/normal }
  value: { family: mono, size: 11, weight: 500, line-height: normal, tracking: "0" }
  utilities: [text-format-kbd]
  use: "Keycap text."
```

---

## 5 · Effects

In Figma the **Effect Styles** "Glow" / "Elevation" bind the `Effect/*` primitives directly — the
sys tier (`--ap-sys-shadow-*`) exists **only in CSS** (architecture block). Colour follows the colour
primitives via `color-mix`. The `use` sentence is the same text that sits on the Figma effect style.

Primitives (internal; Figma group `Effect/`, scopes EFFECT_COLOR / EFFECT_FLOAT — the YAML uses the
short paths, CSS = `--ap-effect-…`):

```yaml
glow:      { x: 0, y: 0, blur: 4, spread: 0, color: "signal/400 @ 50% (color-mix)" }    # --ap-effect-glow-* · Figma style holds raw #0098da
elevation: { x: 0, y: 14, blur: 36, spread: -6, color: "neutral/900 @ 18% (color-mix)" }  # --ap-effect-elevation-* · Figma style holds raw #1a2230
```

```yaml
- token: shadow-glow
  css_var: --ap-sys-shadow-glow
  primitive: "glow/* (5 parts: x y blur spread color)"
  value: "0 0 4px 0 · signal/400 @ 50%"
  utilities: [shadow-glow]
  use: "Halo on an emphasised marker — focus / active halo on small shapes. Not a depth cue."
  note: "Figma: Effect Style \"Glow\" binds the parts directly — no semantic var. Colour is raw there; CSS composes signal/400 at 50 % via color-mix."

- token: shadow-elevation
  css_var: --ap-sys-shadow-elevation
  primitive: "elevation/* (5 parts: x y blur spread color)"
  value: "0 14px 36px -6px · neutral/900 @ 18%"
  utilities: [shadow-elevation]
  use: "Drop shadow of surfaces floating above the layout (dialog-fill). The only depth cue in the system — everything else stays flat."
  note: "Figma: Effect Style \"Elevation\" binds the parts directly — no semantic var. Colour is raw there; CSS composes neutral/900 at 18 % via color-mix."
```

**Otherwise flat:** depth is implied, not stacked. Stock `shadow-xs/sm/md/lg` are dead (§6).

---

## 6 · Stock shadcn → Agentport vocabulary

The theme reset in `globals.css` sets several Tailwind default namespaces to `initial`. Stock classes
built on them are **dead** → translate when porting each component.

```yaml
dead_utilities:   # removed by the reset → replacement
  - { stock: "text-xs/sm/base/lg/… (font-size)", reset: "--text-*: initial",        replace: "the matching .text-format-* class (§4)" }
  - { stock: "font-normal/medium/semibold/bold", reset: "--font-weight-*: initial",  replace: "weight lives in the .text-format-* class" }
  - { stock: "font-sans/font-mono (family)",     reset: "--font-*: initial",         replace: "family lives in the .text-format-* class (mono → text-format-data-sm/-data-md/-data-lg/-kbd/-eyebrow)" }
  - { stock: "tracking-*",                       reset: "--tracking-*: initial",     replace: "lives in the .text-format-* class" }
  - { stock: "leading-*",                        reset: "--leading-*: initial",      replace: "lives in the .text-format-* class" }
  - { stock: "shadow-xs/sm/md/lg/xl",            reset: "--shadow-*: initial",       replace: "drop it (flat) OR shadow-elevation when depth carries meaning" }
  - { stock: "core colours (text-red-500 …)",    reset: "--color-*: initial",        replace: "DS semantics only; text-white/current/transparent stay" }

# Colour utility renames (2026-06-17): until the rework the colour utilities were named like stock
# shadcn (only the values were DS-specific). Since the -fill/-ink/-border system the names DIVERGE →
# stock shadcn classes (Nova / ui:add) must be translated per component. The canonical table:
color_renames:
  - { stock: bg-background,                  ds: bg-surface }
  - { stock: "text-foreground / bg-foreground", ds: "text-ink  (NO bg-ink as a surface; dark surface = bg-inverse-fill)" }
  - { stock: text-card-foreground,           ds: text-card-ink }
  - { stock: bg-muted,                       ds: "bg-muted-fill (surface). bg-muted stays valid ONLY as a shape / marker fill of the standalone muted colour (2026-08-31)" }
  - { stock: text-muted-foreground,          ds: "text-muted (de-emphasised text on any surface). text-muted-ink ONLY for text sitting on bg-muted-fill (2026-08-31 pair rule)" }
  - { stock: bg-accent,                      ds: bg-accent-fill }
  - { stock: text-accent-foreground,         ds: text-accent-ink }
  - { stock: "bg-primary (as a container surface)", ds: "bg-primary-fill (dark surface). bg-primary stays valid ONLY as a shape / marker fill (SHAPE_FILL, no FRAME_FILL) — e.g. the command caret" }
  - { stock: text-primary-foreground,        ds: text-primary-ink }
  - { stock: text-secondary-foreground,      ds: text-secondary-ink }
  - { stock: text-destructive-foreground,    ds: text-destructive-ink }
  - { stock: border-input,                   ds: border-input-border }
  - { stock: bg-input-background,            ds: bg-input-fill }
  - { stock: "placeholder (input-placeholder)", ds: text-input-ink-placeholder }
  - { stock: "bg-popover / text-popover-foreground (also bg-overlay / text-overlay-foreground)", ds: "bg-dialog-fill / text-dialog-ink  (overlay + popover consolidated into `dialog` 2026-06-18)" }
  - { stock: bg-card,                        ds: bg-card-fill }
  - { stock: "bg-inverse / text-inverse-foreground", ds: "bg-inverse-fill / text-inverse-ink" }
  - { stock: bg-sidebar,                     ds: bg-sidebar-fill }
  - { stock: text-sidebar-foreground,        ds: text-sidebar-ink }
  - { stock: "bg-sidebar-primary / text-sidebar-primary-foreground", ds: "bg-sidebar-primary-fill / text-sidebar-primary-ink" }
  - { stock: "bg-sidebar-accent / text-sidebar-accent-foreground",   ds: "bg-sidebar-accent-fill / text-sidebar-accent-ink" }
  - { rename: "bg-secondary → bg-secondary-fill (Figma secondary → secondary-fill, 2026-06-19, -fill convention; value unchanged still/100). Button + Badge re-clothed." }
  - { unchanged: "name STAYS (only the value is new): bg-destructive/text-destructive, border-border/-emphasis/-strong, ring-ring/outline-ring, border-sidebar-border, ring-sidebar-ring, bg-chart-1..5" }
  - { new: "tokens without a stock counterpart: accent-border, primary-fill, input-fill-high, sidebar-*-ink (text on the sidebar tints), brand-fill/brand-ink (on-dark brand moment, 2026-06-19 — bg-brand-fill / text-brand-ink), muted (standalone, 2026-08-31 — text-muted)" }
  - { removed: "background-fixed (2026-08-31 — no binding, no call site; theme-invariant white had no consumer)" }

geometry_vs_token:
  spacing: "padding / gap / margin → named token, MAPPED BY THE px VALUE: gap-2(8) → gap-md · gap-1.5(6) → gap-sm · px-4(16) → px-xl · py-2(8) → py-md · px-3(12) → px-lg · px-6(24) → px-2xl."
  control_geometry: "control heights / icon sizes (h-9/h-8/h-10, size-9, size-4) stay NUMERIC — not on the spacing scale. Geometry ≠ spacing token."
  radius: "radius vocabulary = corner-sm/md/lg/xl/full (+ corner-none, sides corner-b-* etc.); ALL rounded-* are DEAD (--radius-*: initial, no re-mapping)."

keep_valid:
  - "container t-shirt names on sizing utilities: max-w-sm/md/…, w-lg, basis-md = --container scale (24rem/28rem/…), NOT spacing steps (§3 collision rule)"
  - "opacity modifiers on DS tokens: bg-primary-fill/90, ring-ring/50, outline-ring/50"
  - "arbitrary values: ring-[3px], size-[18px]"
  - "numeric spacing utilities: p-4, gap-2, h-9, size-4"
  - "structural namespaces: --breakpoint-*, --container-*, --animate-*, --default-*, --spacing"

border_width_vs_color: "border = 1px width, separate from the colour. The base layer `* { @apply border-border outline-ring/50 }` sets the default colour; deviating lines via e.g. border-border-emphasis / -strong."
```

---

## 7 · Auto-layout → utilities (Figma → Tailwind)

Figma auto-layout properties → className utilities.
Display = `flex` / `inline-flex` (the component chooses); the properties below set direction, spacing,
alignment, sizing. **Gap and padding run over the spacing scale (§3) — mapped by px value.**

```yaml
layoutMode:                # layout mode
  HORIZONTAL: flex-row
  VERTICAL:   flex-col
  GRID:       "grid        # own properties → grid block below"
  NONE:       "no auto-layout (block / absolute)"
itemSpacing: "gap-<step>           # §3, by px value (8 → gap-md …)"
padding:     "p-/px-/py-<step>     # §3, by px value; single sides pl-/pr-/pt-/pb-"
primaryAxisAlignItems:     # main axis → justify-*
  MIN: justify-start · CENTER: justify-center · MAX: justify-end · SPACE_BETWEEN: justify-between
counterAxisAlignItems:     # cross axis → items-*
  MIN: items-start · CENTER: items-center · MAX: items-end · BASELINE: items-baseline
layoutSizingHorizontal:    # member width
  FIXED: "w-<n> (numeric, control geometry)" · HUG: w-fit · FILL: "w-full / flex-1 (flex child)"
layoutSizingVertical:      # member height
  FIXED: "h-<n> (numeric)" · HUG: h-fit · FILL: "h-full / flex-1"
layoutWrap:                # flex only
  NO_WRAP: "(default)" · WRAP: flex-wrap
grid:                      # layoutMode GRID only — own props (NOT itemSpacing / primary / counter)
  gridRowCount/gridColumnCount: "grid-rows-<n> / grid-cols-<n>"
  gridRowGap/gridColumnGap:     "gap-y-<step> / gap-x-<step>   # §3, by px value"
  gridRow/ColumnSizes:          "FLEX → fr · FIXED → px (arbitrary grid-cols-[…])"
  per-child:                    "gridRow/ColumnSpan → row-/col-span-<n> · anchor (0-based) → row-/col-start-<n+1> · gridChildH/V-Align MIN/CENTER/MAX/AUTO → justify-self-*/self-*"
```

**`primaryAxis*` = main axis = `justify-*`, `counterAxis*` = cross axis = `items-*`** — direction-independent
(Tailwind `justify` / `items` are main / cross axis too). FIXED sizes stay **numeric** (geometry ≠ spacing token, cf. §6).

**`margin` — when instead of gap / padding:** Figma auto-layout only provides **gap** (between children) +
**padding** (container inset) — that is the **default translation** for distances. `margin` (§3 `m-*`) is not a
substitute but a code idiom for intents gap / padding cannot carry — each with its own Figma signal:
- **Push-to-end / distribute** → Figma `primaryAxisAlignItems = SPACE_BETWEEN/MAX` → `justify-*` (or `ml-auto`
  for a single trailing element), **not** derived from a gap.
- **Overlap / single offset** a *uniform* gap cannot express → a spacer or `ABSOLUTE` child
  (`layoutPositioning`) in Figma → mirror structurally, don't paper over with margin.

**Never** convert a Figma gap / padding into margin; default = gap / padding. An existing `m-*` in code is
code-only (no Figma source → not diffable from Figma).

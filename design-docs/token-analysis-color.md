# Token analysis — Category Color

**Screen:** "Quiet" — reference screen (table + inspector)
**Figma:** Agentport DS, fileKey `nQSNLASjuLvgTh3we8Dp4s`, node `1099:9710`
**Status:** Screen uses **zero variables** (`get_variable_defs` → `{}`) — raw values throughout.
**Repo baseline:** Standard shadcn set present in `libs/ui/src/styles/globals.css`
(`background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, sidebar*`; no `chart-*`).

---

## Implementation status (Figma)

Two-tier architecture in "Agentport DS": **`reference`** (primitives, raw) → **`semantic`** (alias) → CSS export later.

- **Collection `reference`** · mode `default` · all `scopes:[]` (usable only via alias):
  > **Update 2026-06-11 — consolidation:** `reference` is now the **only** primitive collection,
  > with the top-level groups **`Color/ · Dimension/ · Font/ · Effect/`** (`reference-dimension`/`-typo`/
  > `-effect` dissolved; their primitives recreated → new IDs, 54 aliases + 2 effect styles
  > re-pointed, sweep 0 residual bindings). The color primitives below have since been named `Color/base/white`,
  > `Color/neutral/*`, `Color/cyan/*`, `Color/opacity/*` — rename only, **IDs unchanged**.
  - `base/white` `#FFFFFF`
  - `neutral/` `50 #FAFBFC · 100 #F4F6F8 · 200 #E6EAEE · 300 #C4CCD4 · 400 #979FA8 · 450 #79828F · 500 #6B7585 · 600 #636C7B · 700 #4A5562 · 900 #1A2230` *(gaps: 800, 950; `450` added for the AA input border, `600` for `muted-foreground`)*
  - `cyan/` `50 #E9F6FC · 500 #0098DA · 700 #0077A8` *(gaps: 100–400, 600, 800–950)* — `500` darkened from
    brand `#009FE3` to **`#0098DA`** so that `primary` marks reach **≥3:1** on white (WCAG 1.4.11).
  > **2026-08-31:** Ramp `ink` renamed → **`neutral`**. Beware the name collision: the `neutral/` values in the inventory above
  > (`50 #FAFBFC …`) are the **old** pre-rework palette, not this ramp.
  > **Update 2026-06-17 — palette swap (pencilcolor OKLCH):** `neutral`+`cyan` as reference primitives
  > **replaced** by **7 full ramps** (11 steps each, `neutral` — `ink` until 2026-08-31 — 13 incl. `25`/`75`):
  > **`signal`** (brand cyan, `400 #009FE3`, AA primary from `600 #0063BB`), **`still`** (muted,
  > `600 #0077A8` = old accent-foreground), **`deep`** (navy cyan), **`neutral`** (neutralized gray scale,
  > blue cast removed C ×0.5; `800 #1E2229` ≈ old brand text `#1A2230`), **`success`/`warning`/`error`**
  > (status family — fills the gap left open in §8). `base/white` + `opacity/10` remain. CSS paths
  > `--ap-color-<ramp>-<step>`. **Semantic rewire (which step maps to which ramp) = step 2**, not yet
  > reflected here; the tables below still describe the old screen-derivation state.
  > **Update 2026-06-17 (step 2):** Semantic rework reflected in code — new
  > **`-fill`/`-ink`/`-border` system** (`background`→`surface`, `foreground`→`ink`, all
  > `-foreground`→`-ink`; new `primary-fill`/`accent-border`/`input-fill-high`). Full
  > token→ramp crosswalk in `design-docs/design-system/tokens-reference.md` §1; old→new migration in `design-docs/design-system/token-changelog.md`.
  > The screen tables below remain the old derivation state (not updated).
- **Collection `semantic`** · mode `light` · **44 variables** (as of 2026-06-18):
  - Fully on the `-fill`/`-ink`/`-border` system (2026-06-17). The raised surface has been named
    **`dialog-fill`/`dialog-ink`** (group `Dialog/`) since **2026-06-18** — `overlay` **and** the shadcn compat
    aliases `popover`/`popover-foreground` consolidated into **one** token `dialog`; `popover*` **removed** without
    replacement (code no longer references `--popover`; see batch 7).
  - Group `shadcn Default/` **dissolved** → tokens reorganized into `Base/ · Primary/ · Secondary/ ·
    Muted/ · Accent/ · Destructive/ · Cards/ · Sidebar/ · Charts/ · Focus/` (purely organizational, no
    CSS effect). In the process `card` → **`card-fill`** (group `Cards/`).
  - 7 custom (aliased): `input-placeholder`, `border-emphasis`, `border-strong`, `inverse`,
    `inverse-foreground`, `scrim` (→ `neutral/900`) + `scrim-opacity` (FLOAT → `opacity/10`;
    see batch 6 update). *(`border-subtle` removed 2026-06-10, see log.)*
  - `background-fixed` *(**removed** 2026-08-31 — never bound, never consumed in code; paragraph kept as history)* — **alias to `base/white`**, **theme-invariant**: stays white in light **and** dark.
    For the **toggle knob** (3× `knob`, previously on `background` → would have turned dark in dark mode).
    The fix holds because `base/white` lives in the single-mode `reference` collection; when a dark mode is
    added later, the dark value of `background-fixed` must keep **the same alias**.
  - `input-background` (group `Input/`) — **alias to `neutral/100`** (opaque), input field fill
    (`property-search`), replaces `card`. *(Opacity approach rejected: paint opacity is not variable-bindable in
    Figma; the earlier `background-opacity` token was removed again.)* Note from the
    AA check: on near-white surfaces a light fill barely lifts off (~1.08:1) — a perceivable field boundary
    must come from the **border** (see AA section).
  - **9 placeholders** with raw hex + marker ` ⚠` (no alias): `secondary`, `secondary-foreground`, `destructive`,
    `destructive-foreground`, `chart-1…5`.
  - **Groups** (purely organizational — token leaf names unchanged):
    `shadcn Default/` (**flat** since 2026-06-11 — `Sidebar/`/`Chart/` subgroups dissolved),
    `Overlay/`, `Input/`, `Border/`, `Inverse/`; `background-fixed` ungrouped *(removed 2026-08-31)*.
    For the CSS export only the leaf name counts, prefixed: `shadcn Default/background` →
    `--ap-sys-background`, `Overlay/overlay` → `--ap-sys-overlay`.

- **Screen binding `1099:9710`:** **402 solid paints** bound to semantics (0 errors). Distribution incl.
  `muted-foreground` 178, `foreground` 61, `border-subtle` 42, `background` 41, `primary` 11, `card` 10.
  Mapping by fill/stroke + node name (e.g. `#1A2230` FRAME→`inverse`, otherwise→`foreground`; `#4A5562`
  fill→`border-strong`, stroke→`ring`; `Icon-Rail`→`sidebar`/`sidebar-border`; palette surfaces→`overlay`).
  **3 share bars** (`seg-system/-custom/-rel`, `#9ea8b5`/`#ccd1d9`) **deliberately left raw** (no matching
  token, monochrome decision). Screenshot confirms: visually unchanged; lightest labels minimally darker
  (consequence of the `text-tertiary` consolidation), not perceptible.

- **Rebind exception:** wire "invoice" in the inspector (`1099:10528`) changed from `accent-foreground` to **`primary`**
  (user decision). Deviates from the value logic (`#0077a8`→`#009fe3`, lighter): the free-standing
  active highlight should carry the light brand cyan, not the dark text cyan. `accent-foreground`
  remains for "text **on** accent tint" (nav/palette "invoice").

## AA check (WCAG, light mode)

**Text (4.5):** foreground 15.96 ✅; **muted-foreground** after the fix (`neutral/600` #636C7B):
bg 5.30 · card 5.12 · sidebar 4.89 — **✅ everywhere** (previously `neutral/500`: card 4.50 / sidebar 4.30 ❌).
`accent-foreground`/accent 4.53 ✅. **Placeholder** (#979FA8) 2.68 — deliberately subtle (fails).

**Non-text (3:1, WCAG 1.4.11):**
- **Input field border** — **fixed (option 1):** `input` from `#C4CCD4` → **`neutral/450` #79828F**.
  Now / bg **3.89** · / card **3.75** · / fill (neutral/100) **3.59** → **✅ ≥3:1** (BITV-proof, with margin).
- **Input fill lift** (`neutral/100`) / bg 1.08 · / card 1.05 → does **not** reach 3:1 (impossible on near-white
  surfaces) — hence the **border** carries the recognizability (see above), the fill only a slight hint.
- **Focus ring** (`ring` #4A5562) / bg **7.59** · / fill 7.01 → **✅**.
- `primary` mark / bg — **fixed:** brand cyan `cyan/500` from `#009FE3` → **`#0098DA`** → **3.23:1** ≥3:1 ✅
  (affects all primary marks/surfaces/track/highlight; shift visually imperceptible). Glow color adjusted accordingly.
- Divider (`border` 1.21) = decorative, exempt.

**Status:** text AA ✅ (muted-foreground), input field border ✅ (neutral/450), primary marks ✅ (cyan/500 #0098DA).
Deliberately low (not a fail target): placeholder (subtle), input fill lift (border carries the recognizability).

## Decision log

- **Sync 2026-06-19 — brand token + secondary rename (Figma → code):** Figma token change adopted.
  (1) NEW group **`Brand/`** with `brand-fill` (→`deep/900` #0d2531) + `brand-ink` (→`signal/400`
  #009FE3) — finally gives the on-dark brand cyan its own semantic token (previously worked around in the hero via an arbitrary
  `var(--ap-color-signal-400)`). Utilities: `bg-brand-fill` / `text-brand-ink`.
  (2) **`secondary` → `secondary-fill`** renamed (-fill convention; value unchanged `still/100`).
  Code: `tokens.css` + `tw-theme.css` (bridge); Button + Badge re-clothed (`bg-secondary`→`bg-secondary-fill`
  incl. Badge spec); Foundations Colors page (Brand group + rename); `tokens-reference.md` §1/§6.
  **No** primitive values changed (all resolved values unchanged).
- **Custom batch 1 — text:** `text-tertiary` **rejected** → light gray labels use `muted-foreground`
  (simplification; labels thereby minimally darker). `input-placeholder` **created** as its own token,
  value `#979fa8` → new primitive `neutral/400`. Naming rule confirmed: always name new tokens within the
  existing shadcn scheme.
- **Custom batch 2 — borders:** 2 tokens instead of 4. `border-subtle` (row/grid/palette dividers) and
  `border-emphasis` (header rule/wire) **created**; `grid-line` + `divider-faint` **rejected** (bundled
  into `border-subtle`). No new primitives — raw values fall into `neutral/200` (`#e0e5ed`≈)
  and `neutral/300` (`#bdc7d1`≈). `border-subtle` shares its value with `border` for now.
  > **Update 2026-06-10:** `border-subtle` **removed** (code + Figma) — identical in value to `border` and never
  > used in code; `border` is already the subtle default. Fine dividers use `border`. Line ladder
  > now 3 steps: `border` < `border-emphasis` < `border-strong`.
- **Custom batch 3 — inverse/overlay:** `inverse` (→`neutral/900`) + `inverse-foreground` (→`neutral/50`)
  **created** for the dark keyboard pills (naming without `-surface` suffix, shadcn-conformant:
  surface = bare name, text = `-foreground`). `popover-muted` **rejected** — the tinted palette zone
  `#fbfcfd` uses `card`. The palette is **not a popover** → `popover`/`popover-foreground` **renamed** to
  `overlay`/`overlay-foreground` (CSS export aliases `--popover` to `--overlay` for shadcn compat).
  No new primitives.
- **Custom batch 4 — decor & markers:** only **`border-strong`** (→`neutral/700`, = value of `ring`) **created** for the
  measure axis — named as `border-*` (not `rule-measure`), fits into the line scale.
  `tick-accent`, `marker-required`, `status-connected` **no token of their own** → use `primary`/`foreground`;
  the status dot waits for the real status family. Glow remains an effect token (shadow). No new primitives.
- **Custom batch 5 — source:** **option A (monochrome)**. No source color family. Source/share bar
  resolve via `muted-foreground` / `neutral/300` / `foreground`. No new tokens/primitives.
  → **Category Color complete.**
- **Custom batch 6 — scrim (2026-06-10, Dialog port):** `scrim` **created** (group `Overlay/`,
  `VariableID:3588:2`) for the modal backdrop (Dialog overlay; nova's `bg-black/10` is dead in the DS).
  Value = **raw RGBA `#1A2230` @ 10 %** (= `neutral/900` @ 10 %) — **no alias possible**, because the alpha
  lives in the token and Figma aliases cannot change opacity; derivation documented in the variable
  description (update manually when `neutral/900` changes). Scopes `FRAME_FILL`/`SHAPE_FILL`.
  CSS: `--scrim: color-mix(in srgb, var(--neutral-900) 10%, transparent)` (tokens.css) →
  `--color-scrim` (globals.css) → `bg-scrim`. Blur (`backdrop-blur-xs`) stays a utility, not a token.
  > **Update 2026-06-11 — scrim-opacity:** raw RGBA **dissolved**. New: primitive **`opacity/10` = 10**
  > (reference, alias-only; Figma opacity variables use the **0–100 percent scale** — 0.1 would yield
  > 0.1 %) + semantic **`scrim-opacity`** (`Overlay/`, `VariableID:3618:3`, alias → opacity/10, scope
  > OPACITY). `scrim` is now a **true alias → neutral/900** (fully opaque); the 10 % sit as a
  > **layer opacity binding** on `.Dialog/Overlay` — **node opacity IS variable-bindable** (unlike
  > paint opacity, cf. the input-background decision above). Consequence: scrim as a fill
  > alone is fully opaque dark; the strength is carried by the component. CSS composes both:
  > `--opacity-10: 10%` (primitive) · `--scrim-opacity: var(--opacity-10)` ·
  > `--scrim: color-mix(in srgb, var(--neutral-900) var(--scrim-opacity), transparent)` —
  > `bg-scrim` unchanged for consumers.
- **Naming convention CSS primitives (2026-06-11):** all reference CSS vars are named
  **`--ap-<figma-path-with-dashes>`** (`Color/neutral/50` → `--ap-color-neutral-50`,
  `Font/family/sans` → `--ap-font-family-sans`, `Effect/glow/spread` → `--ap-effect-glow-spread`);
  Figma carries **no** prefix. Aligned in the process:
  Figma group `Typo/` → **`Font/`**, `Typo/font-scale` → **`Font/scale`**; CSS `--leading-*` →
  `--ap-font-line-height-*`, `--radius-pill` → `--ap-dimension-radius-full` (= Figma `radius/full`),
  `--space-base` value → primitive `--ap-dimension-space-base`; the 10 **effect primitives**
  (`--ap-effect-{glow,elevation}-{x,y,blur,spread,color}`) now also exist in CSS and
  compose `--shadow-glow`/`--shadow-elevation`.
- **Naming convention CSS semantics (2026-06-11, same day):** semantics are named
  **`--ap-sys-<token-leaf>`** (`--ap-sys-background`, `--ap-sys-input-placeholder`,
  `--ap-sys-radius-lg`, `--ap-sys-space-md`) — Figma groups are pure organization, the token
  is the leaf. `shadcn Default/Sidebar/` + `/Chart/` **dissolved** in Figma (flat under
  `shadcn Default/`). Applies to `semantic` + `semantic-dimension`; `semantic-typo` updated the same day
  (org group + format/part — see token-analysis-typography); `--shadow-*` likewise →
  `--ap-sys-shadow-glow/-elevation` (sys tier only in CSS, no Figma counterpart). The CSS helper `--space-base` is dropped — the space steps compute directly
  from `--ap-dimension-space-base`. Tailwind theme keys (`--color-*`, `--radius-*` in tw-theme.css)
  remain unprefixed (Tailwind namespaces), only their **values** point to `--ap-sys-*`.
- **Addendum — shadcn set completed:** `destructive-foreground ⚠` + `chart-1…5 ⚠` **created** as placeholders
  (raw hex, shadcn defaults) so that the full shadcn set exists in Figma (were not included in the repo
  CSS). Semantic collection now 38 variables, 9 of them placeholders.
- **Custom batch 7 — Dialog consolidation (2026-06-18, "further away from the shadcn default"):** the shadcn
  compat layer in Figma **dissolved**. (1) Group `shadcn Default/` **removed** → tokens regrouped
  (`Base/ · Primary/ · Secondary/ · Muted/ · Accent/ · Destructive/ · Cards/ · Sidebar/ · Charts/ · Focus/`;
  leaf names unchanged ⇒ **no** CSS effect). (2) `overlay` + `popover`/`popover-foreground` consolidated into **one**
  raised-surface token **`dialog`** (group `Dialog/`): `overlay-fill`→`dialog-fill`,
  `overlay-ink`→`dialog-ink`; the compat aliases `popover*` **dropped without replacement**. (3) `card` → **`card-fill`**
  (group `Cards/`, consistency with the `-fill` system). Values/aliases of all three **unchanged**
  (base/white · neutral/900 · neutral/50). Code updated: `tokens.css` + `tw-theme.css` (token seam), consumers
  `dialog.tsx`/`command.tsx` (+ specs): `bg-overlay-fill`→`bg-dialog-fill`, `text-overlay-ink`→`text-dialog-ink`,
  `bg-card`→`bg-card-fill`. Crosswalk `tokens-reference.md` §1/§6 updated. No more `--popover` in code.

---

## Preface: the screen's color DNA

- **Monochrome + ONE accent.** Neutral gray-scale ramp + signal cyan (brand `#009FE3`, in the token `cyan/500` = `#0098DA` for AA), plus only two
  cyan derivatives: dark reading variant `#0077A8` and tint `#E9F6FC`. There is no further chromatic color.
- **No status traffic light in the screen.** No green/red/yellow. The connection dot is cyan (not green),
  the required-field checkmark is dark ink `#1A2230` (not green). → `destructive`/success/warning we have to
  **invent**, not derive.
- **Source is not (yet) color-coded.** System / Base / Custom run in the same muted ink;
  the share bar uses one gray for both main segments. → biggest open design decision (§7).
- **Many near-duplicates.** ~6 almost identical neutral values per role (e.g. `#e6eaee/#e6eaef`,
  `#f4f6f8/#f2f5f8/#f6f8fa`, `#6b7585/#6a7482/#737d8c`). Collapse to one value each when tokenized.

**Legend:** **[shadcn]** = reuse existing token (set value to our palette) ·
**[new]** = new token that we set up.

---

## 1 · Surfaces

| Token | Origin | Raw value(s) | Where in the layout |
|---|---|---|---|
| `--background` | **[shadcn]** | `#ffffff` | App base surface: body, header, workspace center, type nav column, palette list |
| `--card` | **[shadcn]** | `#fafbfc` | Inspector panel on the right; property search field; **+ tinted palette prompt/footer zone** `#fbfcfd` (bundled) |
| `--overlay` *(was `popover`)* | **[shadcn→overlay]** | `#ffffff` | Command palette panel (white list). CSS export: `--popover` aliases `--overlay` (shadcn compat) |
| `--muted` | **[shadcn]** | `#f4f6f8` (+ duplicates `#f2f5f8`, `#f6f8fa`) | "Chrome" surfaces: status anchor band, cmd prefix box, endpoint switcher, toggle track |
| `--sidebar` | **[shadcn]** | `#f4f6f8` | Icon rail (left 56px toolbar) |
| `--inverse` | **[new]** → `neutral/900` | `#1a2230` | dark keyboard pills "Ctrl K" (header) & "Esc" (palette) |

---

## 2 · Text / Foreground

| Token | Origin | Raw value(s) | Where in the layout |
|---|---|---|---|
| `--foreground` | **[shadcn]** | `#1a2230` | Primary text: type headline "invoice", property names, status band values, switcher text, active values |
| `--muted-foreground` | **[shadcn]** | `#636C7B` (`neutral/600`, **AA fix**; previously `#6b7585`/`neutral/500`) (bundles `#6a7482`, `#737d8c`, **and newly** `#979fa8`, `#8c96a6`, `#9ea8b5`) | Secondary **and** tertiary text (deliberately merged): table cells, toggle labels, kbd text, "…N more"; **plus** eyebrow labels (WHERE YOU ARE, SCOPE, JUMP TO), table column headers (PROPERTY/TYPE…), palette meta text |
| `--input-placeholder` | **[new]** → `neutral/400` | `#979fa8` (bundles `#b8c0c8`) | Placeholders: "Enter a command, jump or search", "Search property …", "type to …" |
| `--inverse-foreground` | **[new]** → `neutral/50` | `#f2f6f9` (≈ `#fafbfc`) | Text on the dark keyboard pills |

> **Decision (simplified):** There is **no** third text level `--text-tertiary`. All light gray
> labels/column headers/meta (`#979fa8` family) run on `--muted-foreground`. Consequence: these
> labels become minimally darker than in the screen (`#6b7585` instead of `#979fa8`) — deliberately, in favor of fewer
> tokens. **`--input-placeholder` stays** as its own token (value `#979fa8` = primitive `neutral/400`),
> because placeholders are a clearly delimited, recurring role.

---

## 3 · Accent — signal cyan (signature)

| Token | Origin | Raw value(s) | Where in the layout |
|---|---|---|---|
| `--primary` | **[shadcn]** | `#0098DA` (`cyan/500`, AA; brand `#009FE3`) | Brand cyan: active connection dot, cmd caret tick, palette caret, "example" highlight in the status text, active nav/axis tick |
| `--primary-foreground` | **[shadcn]** | white / `#f2f6f9` | Text/icon on cyan surface (barely used in the screen — for buttons later) |
| `--accent` | **[shadcn]** | `#e9f6fc` | Selection/active surface: active type row in the nav, selected palette entry "invoice" |
| `--accent-foreground` | **[shadcn]** | `#0077a8` (≈ `#0377a8`) | Text on the cyan tint: "invoice" in the active row/palette, active wire node text in the inspector |

> Note: shadcn `accent` is a **neutral** hover gray by default. Here we assign it the
> **cyan tint** (= selection). If a *neutral* row hover is needed later in addition,
> a separate `--hover-muted` **[new]** will be added for it.

---

## 4 · Lines / Borders

| Token | Origin | Raw value(s) | Where in the layout |
|---|---|---|---|
| `--border` | **[shadcn]** | `#e6eaee` (+ `#e6eaef`) | Standard edges: body/header/nav/rail dividers, active tool marker, inspector edge, property search frame |
| `--input` | **[shadcn]** | `#79828F` (`neutral/450`, **AA**; previously `#c4ccd4`) | **Input field frame** (shadcn: `border-input`) — `property-search` (stroke `border`→`input`). Darkened to ≥3:1 (WCAG 1.4.11 / BITV). Focus = `ring` (command bar `Cmd+K-pill`). Input **fill** = `input-background` (see above), not `card`. |
| `--ring` | **[shadcn]** | `#4a5562` | Focus/emphasis: 1.5px frame of the Cmd+K pill & the palette panel |
| `--border-subtle` | **[new]** → `neutral/200` | `#e0e5ed` (bundles `#dbe3eb` grid, `#eaeef2` palette divider, `#d4dae0`) | fine dividers: table row dividers, **vertical grid lines**, palette dividers |
| `--border-emphasis` | **[new]** → `neutral/300` | `#bdc7d1` | Table header underline ("header rule") + wire connectors in the inspector |
| `--border-strong` | **[new]** → `neutral/700` | `#4a5562` | heaviest/darkest line: 2px **measure axis** at the top of the status anchor band (signature motif) |

> **Line scale:** `border-subtle` < `border` < `border-emphasis` < `border-strong` (ascending weight).
>
> **Decision (2 instead of 4):** `grid-line` and `divider-faint` **rejected** → bundled into
> `border-subtle`. At the primitive level all border tokens alias existing tiers — **no new
> primitives**: `border`/`border-subtle` → `neutral/200` (`#e0e5ed`≈), `border-emphasis` → `neutral/300`
> (`#bdc7d1`≈), `border-strong` → `neutral/700` (`#4a5562`, = value of `ring`). `border-subtle` currently shares
> its value with `border`; the separate name keeps the divergence point open.

---

## 5 · Signature decor & markers

Four roles — all **identical in value** to existing tokens; deliberately **no** token of their own (except the measure axis,
which moved into the line scale §4 as `border-strong`).

| Role | Where in the layout | Resolution |
|---|---|---|
| Measure axis | 2px line at the top of the status band | → **`border-strong`** (§4) |
| Blue tick | Cmd pill prefix, palette caret, axis tick | → **`primary`** (no token of its own). Glow `rgba(0,159,227,.5)` = effect token (category shadow) |
| Required checkmark | Column `REQUIRED` | → **`foreground`** (dark ink `#1a2230`, no green; own token only once required fields get a signature color) |
| Connection dot | "connected": header switcher + status band | → **`primary`** for now; belongs in the real **status family** (§8), not here |

---

## 7 · Source — **monochrome (decision: option A)**

Source (System / Base / Custom / Relationship) deliberately stays **monochrome** — **no** source color family.
It is recognizable via text + position, not via color. Resolved via existing tokens:

| Element | Raw value | Target token |
|---|---|---|
| `seg-system`, `seg-app` (bar segments) | `#9ea8b5` | `muted-foreground` (≈ `neutral/400` tier) |
| `seg-rel` (relationship segment) | `#ccd1d9` | `neutral/300` tier (≈ `border-emphasis`/`input`) |
| Source column "SYSTEM / BASE·… / CUSTOM" | `#6b7585` | `muted-foreground` |
| Group divider "SYSTEM · EXAMPLE · 9" | `#1a2230`/`#6b7585` | `foreground` / `muted-foreground` |

> Rejected: source color family (`source-system/-base/-custom/-relationship`). Would have
> required new chromatic colors that do not exist in the screen. If source is to be separated more strongly visually later,
> that is a genuine **palette extension** — not a derivation from this screen.

---

## 8 · Absent from the screen, but needed for the DS

Visible nowhere in the screen — created as **placeholders** (raw hex + marker ` ⚠`, no alias) so that the
shadcn set is complete. Values still to be designed:

- `secondary ⚠` `#f5f5f5` · `secondary-foreground ⚠` `#343434` — shadcn default gray.
- `destructive ⚠` `#e7000b` · `destructive-foreground ⚠` `#fafafa` — shadcn default red/off-white.
- `chart-1…5 ⚠` `#e76f51 · #2a9d8f · #264653 · #e9c46a · #f4a261` — shadcn default palette (sea/earth), for later data visualization.

Not **yet** created (comes as its own design):
- Status family **offline / error / warning** **[new]** — "connected" is cyan; disconnected/faulty connections need red/amber.
- `--sidebar-primary` exists as a shadcn token (aliased `cyan/500`), but is unused in the screen.

---

## Summary in numbers

- **20 distinct raw color values** → collapsed to **2 primitive families** (`neutral` 8 steps, `cyan` 3 steps) + `base/white`.
- **Semantic layer:** 26 shadcn tokens (2 renamed to `overlay*`) + **6 custom** created:
  `input-placeholder`, `border-subtle`, `border-emphasis`, `border-strong`, `inverse`, `inverse-foreground`.
- Deliberately **no** token of their own: `tick-accent`, `marker-required`, `status-connected` (use `primary`/`foreground`);
  `text-tertiary`, `grid-line`, `divider-faint`, `popover-muted` (bundled into other tokens).
- Open: **Source** (batch 5) · **status family** + **destructive/secondary** (§8, placeholders set).

---

## Raw value inventory (reference)

| Raw value | Occurrence | Role (target token) |
|---|---|---|
| `#1a2230` | Primary text, dark pills, required checkmark | `--foreground` / `--inverse` (=`neutral/900`); required checkmark uses `--foreground` |
| `#4a5562` | Focus frame, measure axis | `--ring` / `--border-strong` (= `neutral/700`) |
| `#6b7585` | Table secondary text (most frequent value) | `--muted-foreground` |
| `#6a7482` | Toggle/kbd text | `--muted-foreground` (duplicate) |
| `#737d8c` | "…N more" link | `--muted-foreground` (duplicate) |
| `#8c96a6` | Table column headers | `--muted-foreground` (merged) |
| `#979fa8` | Eyebrow labels, meta · placeholder | `--muted-foreground` (labels) / `--input-placeholder` = `neutral/400` (placeholder) |
| `#9ea8b5` | Share bar seg-system/custom | `--muted-foreground` (source monochrome) |
| `#b8c0c8` | Palette placeholder | `--input-placeholder` (bundled) |
| `#bdc7d1` | Header rule, wire connectors | `--border-emphasis` → `neutral/300` |
| `#ccd1d9` | Share bar seg-rel | `neutral/300` tier (source monochrome) |
| `#ccd4db` | kbd border, status band divider | `--input` |
| `#c4ccd4` | Switcher border | `--input` = `neutral/300` |
| `#d4dae0` | Cmd prefix divider | `--border-subtle` → `neutral/200` |
| `#dbe3eb` | Vertical grid lines | `--border-subtle` (bundled) |
| `#e0e5ed` / `#e0e5eb` / `#e0e5ea` | Row/palette dividers | `--border-subtle` → `neutral/200` |
| `#eaeef2` | Palette group lines | `--border-subtle` (bundled) |
| `#e6eaee` / `#e6eaef` | Standard edges | `--border` |
| `#f2f5f8` / `#f4f6f8` / `#f6f8fa` | Chrome surfaces | `--muted` / `--sidebar` |
| `#fafbfc` | Inspector, search field | `--card` |
| `#fbfcfd` | Palette prompt/footer | `--card` (bundled) |
| `#f2f6f9` | Text on dark pill | `--inverse-foreground` → `neutral/50` |
| `#ffffff` | App base surface / palette list | `--background` / `--overlay` |
| `#009fe3` | Brand cyan / status dot / tick | `--primary` (token value AA-darkened to `#0098DA`) |
| `#0077a8` (≈ `#0377a8`) | Cyan text on tint | `--accent-foreground` |
| `#e9f6fc` | Cyan selection surface | `--accent` |
| `rgba(0,159,227,.5)` | Cyan glow (tick shadow) | Effect token (category shadow) |

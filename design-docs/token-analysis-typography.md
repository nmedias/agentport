# Token analysis — Category Typography

Screen: reference screen "Quiet", node `1099:9710` (Figma "Agentport DS", fileKey
`nQSNLASjuLvgTh3we8Dp4s`). Sister to `token-analysis-color/-radius/-spacing.md`.
Goal: a typography token system following **Hybrid (III)** — reference parts as variables,
bundled into **formats** (composition tokens), applied via **Figma text styles**.

> **Status:** Architecture decided, **3 collections + 11 text styles built + applied to the screen**
> (223 text nodes classified, 0 errors). Category complete.
>
> **Update 2026-06-11 — first code consumer for `Input`:** The command-palette variant (libs/ui)
> uses `text-format-input` (mono 18) on the prompt field — first code consumer of the Input format
> (the default Command deliberately uses `text-format-label`, cf. components-reference). Figma counterpart:
> text style `Input` on value/placeholder in the `.Command/Input` palette member 3638:8.
>
> **Update 2026-06-11 — utility rename `text-<format>` → `text-format-<format>`:** the old name
> collided with Tailwind's generated color utilities (`text-input` = format class AND color from
> `--color-input` — both rules in the CSS). All 11 `@utility` classes, all code usages and the
> twMerge group matcher (`utils.ts`) renamed; CSS variables, Figma variables and text styles
> unchanged. Details: tokens-reference §4.
>
> **Update 2026-06-19 — Data group + new `Lead` format (Figma → code):** `Input` renamed → **`Data/data-lg`**
> (values identical: mono, 18/step-1, regular) and `Data` → **`Data/data-sm`** (mono, 11/step-neg1,
> regular) — the two mono data formats are now one `Data/` group (sm/lg). New: **`Lead`** (sans,
> 18/step-1, regular, LH `relaxed` 1.5, tracking normal) = large intro/lead body text, sits between
> `Title` and `Body`. **Now 12 formats / 53 vars** (previously 11/48 — `Lead` adds 5 parts incl. the LH var).
> Utilities `text-format-data-sm`/`-data-lg`/`-lead`; consumers renamed (the Command prompt now uses
> `text-format-data-lg`). The format table + `semantic-typo` count below reflect this state;
> the build record (text style application, decision log) remains the 2026-06-11 snapshot.
> *Figma observation:* the text style **`Label`** is currently wrongly bound to `Lead/lead/*`
> (shows 18/regular instead of 14/medium) — the variable `Label/label/*` itself is correct; to be fixed in Figma.

## Findings (screen scan, read-only)

- **223 text nodes**, **no** existing text styles.
- **Families & weights:** Hanken Grotesk (Regular 400 · Medium 500 · SemiBold 600 · Bold 700 ·
  ExtraBold 800) · Geist Mono (Regular 400 · Medium 500).
- **Font sizes** (frequency): `9×4 · 10×25 · 11×23 · 11.5×1 · 12×96 · 13×11 · 14×29 · 15×25 ·
  16×5 · 22×1 · 32×2 · 42×1` — dense cluster 9–16, then display jumps.
- **Line heights:** predominantly **AUTO** (font default ≈ CSS `line-height: normal`); explicit
  ratios only on body text/headings: `1.0` (32) · `1.1` (22) · `1.2` (relation title) ·
  `1.45/1.48` (body 14).
- **Letter spacing:** 0 as default; **positive** on uppercase mono labels (0.4–0.8px / 4–5%);
  **negative** on display headings (−0.1 to −0.6px).

## Architecture decisions

- **Hybrid (III)** — variables as reference parts → bundled into text styles.
- **Line height is NOT bindable** in Figma → created as reference ratios (`1.0/1.2/1.5`),
  set **raw** as % in the text style (auto where the design uses auto).
- **Modular scale** (ratio **1.25**, base **14px** = step 0/body, display-heavy, 8 steps
  `step-neg2…step-5`): `9 · 11 · 14 · 18 · 22 · 27 · 34 · 43`. `step-4` (34) is **reserve** (no format).
  Computed from the base in CSS: `round(calc(base × font-scale^n), 0.0625rem)` → rounded to whole px.
  *(Earlier A-scale 10/12/14/16/22/32/42 superseded. Deviations: Eyebrow 10→9, Data 12→11, Body 14→14,
  Title 16→18, Heading-sm 22→22, Heading 32→27, Display 42→43.)*
- **Weights merged:** Bold 700 → ExtraBold 800 (700 occurred only once). Set:
  `regular 400 · medium 500 · semibold 600 · extrabold 800`.
- **Line-height set:** `1.0 / 1.2 / 1.5` (+ AUTO). Explicit ratio only for `display`,
  `heading`, `heading-sm`, `body`; all other formats stay AUTO.
- **Tracking in px** (not %): binding forces letter spacing to PIXELS → values as px.
  `tight −0.5 · normal 0 · wide 0.5` (matches the as-is values).
- **Naming:** reference parts named by value/role; **formats role-based**.
- Display (hero "invoice") = top step `step-5` (43). `font-scale` is controllable as **one variable**
  (CSS `--font-scale` + Figma `font-scale`) → the whole scale can be scaled via a single number.

## Implementation status (Figma)

### `reference-typo` — `VariableCollectionId:3081:2`, mode `value` (`3081:0`)

> **Update 2026-06-11 — reference consolidation:** `reference-typo` is dissolved — the 22
> primitives now live in the **one** `reference` collection as group **`Font/*`** (same
> substructure: `Font/family/…`, `Font/weight/…`, `Font/size/…`, `Font/line-height/…`,
> `Font/tracking/…`; `font-scale` is now called **`Font/scale`**). New variable IDs (`3623:8…29`);
> all 48 semantic-typo aliases re-pointed, text styles unchanged (they bind semantic-typo).
> CSS primitives follow the Figma path with the `--ap-` prefix: `--ap-font-family-sans`,
> `--ap-font-line-height-tight` (previously `--leading-tight`), `--ap-font-scale` etc.
> **Update 2026-06-11 — semantic-typo restructured:** org group on top, token =
> `format/part`: `Display/display/family`, `Heading/heading/…` + `Heading/heading-sm/…`,
> `Body/body/…` + `Body/body-strong/…`, Title/Label/Eyebrow/Data/Kbd/Input each their own group
> (48 renames, IDs/aliases/text-style bindings unchanged). CSS: `--text-<format>-<part>` →
> **`--ap-sys-<format>-<part>`**, `leading` → `line-height` (`--ap-sys-heading-sm-family`,
> `--ap-sys-body-line-height`). Utility classes `text-<format>` unchanged.

22 variables, all `scopes:[]` (via alias only), grouped:
- `family/` — `sans` = "Hanken Grotesk", `mono` = "Geist Mono" *(STRING)*
- `weight/` — `regular 400 · medium 500 · semibold 600 · extrabold 800` *(FLOAT)*
- `font-scale` — `1.25` (modular ratio) · `size/base` — `14` *(FLOAT)*
- `size/` — `step-neg2 9 · step-neg1 11 · step-0 14 · step-1 18 · step-2 22 · step-3 27 ·
  step-4 34 (Reserve) · step-5 43` *(FLOAT)*
- `line-height/` — `tight 1.0 · snug 1.2 · relaxed 1.5` *(FLOAT, ratio; not bindable)*
- `tracking/` — `tight −0.5 · normal 0 · wide 0.5` *(FLOAT, px)*

**Font sizes in the CSS export:** modular scale in **rem**, computed from `--font-size-base` (0.875rem/14px)
× `--font-scale` (1.25)^n, rounded via `round(…, 0.0625rem)` to whole px. Figma cannot compute
→ there `size/step-*` are the rounded values directly; `font-scale` + `size/base` as documented anchors.

### `semantic-typo` — `VariableCollectionId:3082:2`, mode `value` (`3082:0`)
53 variables, **12 format groups**, each part aliases `reference-typo`. Scopes: family
`FONT_FAMILY`, size `FONT_SIZE`, weight `FONT_WEIGHT`, tracking `LETTER_SPACING`,
line-height `[]` (not bindable). LH part only on `Display/Heading/Heading-sm/Lead/Body`.

| Format | family | size (step) | weight | line-height | tracking |
|---|---|---|---|---|---|
| `Display`     | sans | 43 (step-5)    | extrabold | 1.0 (100%) | tight |
| `Heading`     | sans | 27 (step-3)    | extrabold | 1.2 (120%) | tight |
| `Heading-sm`  | sans | 22 (step-2)    | extrabold | 1.2 (120%) | tight |
| `Title`       | sans | 18 (step-1)    | semibold  | auto | normal |
| `Lead`        | sans | 18 (step-1)    | regular   | 1.5 (150%) | normal |
| `Body`        | sans | 14 (step-0)    | regular   | 1.5 (150%) | normal |
| `Body-strong` | sans | 14 (step-0)    | semibold  | auto | normal |
| `Label`       | sans | 14 (step-0)    | medium    | auto | normal |
| `Eyebrow`     | mono | 9 (step-neg2)  | medium    | auto | wide |
| `Data-sm`     | mono | 11 (step-neg1) | regular   | auto | normal |
| `Data-lg`     | mono | 18 (step-1)    | regular   | auto | normal |
| `Kbd`         | mono | 11 (step-neg1) | medium    | auto | normal |

### Text styles (application layer)
11 Figma text styles, each with 4 bound variables (`fontFamily`, `fontSize`, `fontWeight`,
`letterSpacing`); line height set raw (auto or %). Names = format names above.

**Screen application** (`1099:9710`): **done** — all 223 text nodes assigned to a style via
classification (family/size/weight → format), 0 errors, screenshot intact.
Mapping: mono → `Eyebrow`(≤10) / `Data`(11–12 regular) / `Kbd`(11–12 medium) / `Input`(≥13);
sans → `Display`(42) / `Heading`(32) / `Heading-sm`(22) / `Title`(16) / `Body-strong`(semibold) /
`Label`(medium) / `Body`(regular). Distribution: `Data 98 · Body-strong 33 · Eyebrow 29 · Label 29 ·
Kbd 12 · Body 12 · Input 5 · Heading 2 · Display 1 · Heading-sm 1 · Title 1`.

## Decision log

| Step | Decision | Result in Figma |
|---|---|---|
| Architecture | Hybrid (III) | reference parts → formats → text styles |
| Size scale | A-scale (7 steps) | `size/10–42`; 15→14 |
| Size scale (update) | **modular**, ratio 1.25, base 14, 8 steps | `size/step-neg2…step-5` (9–43), step-4 reserve; `font-scale`+`size/base`; CSS via `round(calc())` |
| Weights | 700 → 800 merged | 4 weights |
| Line height | not bindable → ratio reference, set raw; auto where the design uses auto | `1.0/1.2/1.5` |
| Tracking | px instead of % (binding forces PIXELS) | `−0.5 / 0 / 0.5` |
| Formats | 11 roles (incl. `Input`, mono 16) | `semantic-typo`, 48 vars |
| Text styles | 11 styles, 4 bindings each | family/size/weight/tracking bound, LH raw |
| Screen application | assign styles on `1099:9710` | 223 nodes classified, 0 errors; screenshot intact |

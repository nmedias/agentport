# component-sync — Label (2026-06-17)

Figma→code reconcile after the DS colour-token rework (`-fill`/`-ink`/`-border` system).
Scope: `label` only. Figma is READ-ONLY.

## Live Figma structure (READ)

- fileKey `nQSNLASjuLvgTh3we8Dp4s`, page "Components" `3126:2`.
- Section LIVE name: **"Label"** id `3733:1022` (unchanged).
- Set LIVE name: **"Label"** id `3735:1024` — type COMPONENT_SET.
  (Brief / catalog noted the set as `.Label`; live name is plain "Label", same as the
  Badge/Button/Separator pattern — leading dot dropped on the live node. Corrected in the
  returned entry.)
- Members (full matrix = 2, one content axis `state`), each HORIZONTAL auto-layout,
  itemSpacing 8 (= gap-md), one inner TEXT child:
  - `state=default`  `3734:1022` — opacity **1**; inner TEXT `{Label}` (`3734:1023`).
  - `state=disabled` `3735:1022` — opacity **0.5**; inner TEXT `{Label}` (`3735:1023`).
- **Inner TEXT fill (both members):** one SOLID fill, `paint.boundVariables.color` →
  variable **`shadcn Default/ink`**, color `#0d1016` (ink/900).
- **Inner TEXT style (both members):** text style **`Label`** (Hanken Grotesk **Medium**, 14px)
  → DS format `label` (14/500) → `text-format-label`.
- Disabled is **opacity only** (member opacity 0.5) — the TEXT fill stays `ink`, not a separate
  dimmed colour token.

## Diff (bound var → DS utility, §6 authoritative)

| Prop | Figma bound var/value | Role | DS utility (§6) | Code today | Delta |
|---|---|---|---|---|---|
| text fill (default) | `shadcn Default/ink` | text colour | `ink` → `text-ink` (inherited) | inherits `text-ink` (base layer) | none |
| text fill (disabled) | `shadcn Default/ink` @ member-opacity 0.5 | text colour | `ink` + opacity dim | inherits `text-ink` + `peer-/group-disabled:opacity-50` | none |
| text style | `Label` (Hanken Medium 14) | typography | `text-format-label` | `text-format-label` | none |
| itemSpacing 8 | — | gap | `gap-md` | `gap-md` | none |

### Why the fill is NO DELTA

The TEXT fill binds **`ink`** — in the rework `foreground` was renamed to `ink` (§6:
`text-foreground` → `text-ink`). `label.tsx` carries **no explicit colour class**: it relies on
inherited `currentColor`, and the base layer `globals.css:41` (`body { @apply bg-surface text-ink
text-format-body }`) cascades `text-ink` down to the label. So the live `ink` binding is already
satisfied by inheritance — exactly the same mechanism that satisfied the old `foreground` binding
before the rename (same CSS var, new name). There is **no `bg-ink`** (ink is a text/icon role only),
so no surface utility is involved. Nothing stale to translate in the className.

The disabled member is pure **opacity 0.5** in Figma — mirrored by the existing
`group-data-[disabled=true]:opacity-50` / `peer-disabled:opacity-50` behaviour. Not a colour token,
out of a colour sync's scope, and already correct.

## Result: NO CLASSNAME DELTA

`label.tsx` className string is **unchanged**. The only edit applied is a **header-comment update**:
added a colour line recording the verified `ink` fill binding (and that it arrives via the base-layer
cascade, with `foreground` → `ink` per the rework) so the file's documentation matches the live
binding. No `.stories.tsx` / `.spec.tsx` change — neither carries any colour utility (only `gap-md`
and `text-format-label`, both kept names).

## Deviations / flags

- **Set name divergence (catalog):** components-reference recorded the set as `.Label`; live Figma
  name is `Label` (leading dot dropped on the live node). Corrected in the returned YAML.
- **Catalog note said `fill=foreground`:** stale post-rework. Updated to `fill=ink` in the returned
  entry (the bound variable is `ink`; `foreground` is its pre-rework name).
- **No design-fork change:** the Figma `state=[default,disabled]` axis remains a Figma convenience
  (Code has no `state` prop — disabled is group/peer-driven). Per the catalog's standing note, NOT
  spun back into a CVA. Untouched.

## Verification

- Read both members' inner-TEXT `fills[0].boundVariables.color` → `figma.variables.getVariableByIdAsync`
  → `.name` = `shadcn Default/ink` (guarded property access; SOLID fill confirmed; colour `#0d1016`
  matches the `ink` token, ink/900, in tokens-reference §1).
- Read text style = `Label` (Hanken Grotesk Medium 14) → `text-format-label`; itemSpacing 8 → `gap-md`.
- Member opacity: default 1, disabled 0.5 — matches the code's opacity dimming.
- No write to Figma. Code change = header comment only (className unchanged). Gate NOT run here
  (parent runs one consolidated gate).

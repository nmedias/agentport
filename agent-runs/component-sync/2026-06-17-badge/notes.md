# component-sync — Badge (2026-06-17)

Figma → code reconciliation of the `.Badge` set after the `-fill`/`-ink`/`-border` colour rework.
Read-only on Figma; delta applied to code only.

## Figma source

- File `ejFKo4MNuvC9TSDKOCUvyq`, page "Shadcn Components" (`3126:2`).
- Set node `3697:1016` — metadata frame name **"Badge"**, symbol/internal name **".Badge"**.
  Section `3687:1016` name **"Badge"**. IDs unchanged from the catalog.
- 6 variants (variant axis): default `3691:2` · secondary `3691:7` · destructive `3691:12` ·
  outline `3693:2` · ghost `3693:7` · link `3693:12`. All 74×20.

## Structure read (per variant member)

Each `variant=*` COMPONENT is an auto-layout HORIZONTAL row, padding `[2,8,2,8]`, itemSpacing 4,
center/center, radius 9999. The **surface fill / stroke live on the component root**; the
**text ink lives on the `{Label}` TEXT child**; the **icon ink lives on the inner
`icon → icon-vector → Vector` stroke** (slot `icon`, default check vector, 1.5 stroke weight).
Text ink and icon ink share the same bound variable in every variant.

Shared bound dimensions (identical across all 6):
- radius → `Corner/corner-full` → `corner-full`
- padding → `Space/space-2xs` (TB) + `Space/space-md` (LR) → `py-2xs px-md`
- gap → `Space/space-xs` → `gap-xs`
- text style → `Label` (S:4e03…) → `text-format-label`; size/family/weight/tracking bound to `Label/label/*`

These shared bindings already matched the code — no delta on geometry/typography/spacing.

## Colour bindings (authoritative) → DS utility

| Variant | Figma surface var | Figma ink var (text+icon) | Figma stroke var |
|---|---|---|---|
| default | `shadcn Default/primary-fill` | `shadcn Default/primary-ink` | — |
| secondary | `shadcn Default/secondary` | `shadcn Default/secondary-ink` | — |
| destructive | `shadcn Default/destructive` (opacity 1) | `shadcn Default/destructive-ink` | — |
| outline | — | `shadcn Default/ink` | `Border/border` (1px) |
| ghost | — | `shadcn Default/ink` | — |
| link | — | `shadcn Default/primary` | — |

## Delta applied (code-before → code-after)

| Member | Property | Code-before | Code-after / Figma binding |
|---|---|---|---|
| default | surface | `bg-primary` | `bg-primary-fill` (`primary-fill`) — `bg-primary` does not exist (§6) |
| default | text/icon ink | `text-primary-foreground` | `text-primary-ink` (`primary-ink`) |
| default | hover | `[a]:hover:bg-primary/80` | `[a]:hover:bg-primary-fill/80` |
| secondary | text/icon ink | `text-secondary-foreground` | `text-secondary-ink` (`secondary-ink`) |
| destructive | surface | `bg-destructive/10` (tint) | `bg-destructive` solid (Figma now full-opacity fill) |
| destructive | text/icon ink | `text-destructive` | `text-destructive-ink` (`destructive-ink`) |
| destructive | hover | `[a]:hover:bg-destructive/20` | `[a]:hover:bg-destructive/80` (deepened to match solid fill) |
| outline | text/icon ink | `text-foreground` | `text-ink` (`ink`) |
| outline | hover | `[a]:hover:bg-muted [a]:hover:text-muted-foreground` | `[a]:hover:bg-muted-fill [a]:hover:text-muted-ink` |
| ghost | base ink | (inherited) | `text-ink` added (Figma binds `ink`) |
| ghost | hover | `hover:bg-muted hover:text-muted-foreground` | `hover:bg-muted-fill hover:text-muted-ink` |
| link | text ink | `text-primary` | unchanged (name kept; value-only change via tokens.css) |

Base CVA string unchanged — `border-ring`/`ring-ring/50`, `aria-invalid:border-destructive
ring-destructive/20`, geometry (`h-5`, `[&>svg]:size-3!`), spacing, `corner-full` all already correct.
No variant added or removed → stories/spec matrix unchanged; only stale class-name assertions and
two comments updated.

Files touched: `badge.tsx` (CVA + header comment), `badge.spec.tsx` (3 assertions:
`bg-primary`→`bg-primary-fill` ×2, `text-foreground`→`text-ink`, `text-destructive`→`bg-destructive`),
`badge.stories.tsx` (Default + Variants comments — dropped the now-false "placeholder tokens" note).

## Deviations

None. Every colour paint was bound to a DS variable (no raw/unbound paints, no role-guessing).
The earlier `secondary`/`destructive` "stock placeholder" flag is **resolved**: both now bind to
real DS semantic tokens (`secondary`, `destructive`/`destructive-ink`), so the ⚠ is dropped.

## Verification

- Target utilities confirmed present in `tw-theme.css` `@theme`: `--color-primary-fill`,
  `-primary-ink`, `-secondary`, `-secondary-ink`, `-destructive`, `-destructive-ink`, `-ink`,
  `-border`, `-muted-fill`, `-muted-ink`, `-primary`.
- Gate NOT run here (parent runs one consolidated gate).

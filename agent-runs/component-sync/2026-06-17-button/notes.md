# component-sync — button (2026-06-17)

**Figma:** set `Button` `3164:312` (Section `Button` `3126:3`, page `Components` `3126:2`),
base set `.Button/Base` `3159:12`. 220 members (variant 6 × size 8 × state 5).
**Code:** `libs/ui/src/components/ui/button/button.tsx`.
**Trigger:** Step-3 colour re-clothing after the Figma `-fill`/`-ink`/`-border` token rework (Step 2).

## Structure read (S2)

Each member = COMPONENT > INSTANCE `.Button/Base` (surface fill + radius/padding/gap) >
RECTANGLE `state-layer` (hover/active tint via opacity) + TEXT `{Label}` (ink). Material-style
state-layer: the resting fill is on `.Button/Base`, hover/active feedback is the `state-layer`
opacity, focus is a DROP_SHADOW (spread 3), disabled is component opacity 0.5.

## Applied delta (S4) — colour only

| variant | property | code before | code after (Figma binding) |
|---|---|---|---|
| default | surface | `bg-primary` | `bg-primary-fill` (primary-fill / deep-900) |
| default | text | `text-primary-foreground` | `text-primary-ink` (signal-100) |
| default | hover/active | `bg-primary/90` | `bg-primary-fill/90` |
| destructive | text | `text-white` | `text-destructive-ink` (error-50) |
| destructive | surface/hover | `bg-destructive` / `/90` | unchanged (token name kept; value error-600) |
| outline | surface | `bg-background` | `bg-surface` |
| outline | hover/active/aria-expanded | `bg-accent` / `text-accent-foreground` | `bg-accent-fill` / `text-accent-ink` |
| secondary | text | `text-secondary-foreground` | `text-secondary-ink` (deep-900) |
| ghost | hover/active/aria-expanded | `bg-accent` / `text-accent-foreground` | `bg-accent-fill` / `text-accent-ink` |
| link | text | `text-primary` | unchanged (name kept; value signal-600) |
| base cva | focus/invalid | `ring-ring/50` `border-ring` `border-destructive` `ring-destructive/20` | unchanged (token names kept) |

Geometry (radius/padding/gap/height per size), text-style (Label → `text-format-label`) and the
focus mechanism are **unchanged** — only the colour tokens moved.

## Deviations (code ≠ literal Figma binding) — actionable

| member · property | Figma says | code uses | why |
|---|---|---|---|
| default/secondary/destructive · hover/active | `state-layer` overlay: muted-fill@10% (default), secondary@20% (secondary), destructive-ink@10% (destructive) over the base | `bg-<token>/90` resp. `/80` opacity idiom | code has no state-layer element; the repo idiom for hover feedback is a `/opacity` modifier on the base fill. Direction matches (slight lighten). Not a 1:1 overlay. |
| all · focus ring | DROP_SHADOW spread 3, **raw** `#4a5562 @ 50%` (old neutral/700, **unbound**) | `ring-ring/50 ring-[3px]` + `border-ring` | Figma effect colour is an unbound raw value (stale old ring colour). Code uses the role-correct `ring` token. **Figma fix:** bind the focus shadow colour to the `ring` variable. |

## Verification

- Geometry sampled at sizes sm/xs/icon/lg + default → all radius/padding/gap vars match the code
  size ladder (corner-md/-lg, px-md/-sm, gap-xs/-sm, h-7/6/8/9). No geometry delta.
- No variant/size/state added or removed → stories + spec need no structural change.
  `button.spec.tsx` asserts `bg-destructive` (kept) + geometry (kept) → still green.

## Gate (S5)

`npx nx typecheck @agentport/ui` ✓ · `lint` ✓ (1 pre-existing react-refresh warning on the
`buttonVariants` export, 0 errors) · `test` ✓ **205/205** (incl. storybook Chromium project).

Visual: pending — Storybook preview/shoot (see session).

## Docs

`components-reference.md` Button entry updated: live Figma names/ids (`Button` set `3164:312`,
Section `3126:3`, base `.Button/Base` `3159:12`), `figma_synced: true`, colour-clothing notes.

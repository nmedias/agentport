# component-sync — switch (2026-06-17)

**Figma:** set `.Switch` `3839:2` (Section `Switch` `3835:1193`, page `Components`
`3126:2`). 20 members, axes `size[default,sm] × checked[off,on] × state[default,focus,disabled,
invalid,focus-invalid]`. Colour depends on checked×state (not size) → sampled all 10 size=default
members READ-ONLY.
**Code:** `libs/ui/src/components/ui/switch/switch.tsx` (+ stories, spec).
**Trigger:** Step-3 colour re-clothing after the Figma `-fill`/`-ink`/`-border` token rework (Step 2).

## Structure read (S2)

Each member = COMPONENT (the track / radix `Switch.Root`) with one child ELLIPSE `thumb`. No
state-layer node — resting fill is on the track, focus = DROP_SHADOW, disabled = component
opacity 0.5. Bound variables sampled per checked×state at size=default:

| checked×state | track fill | track stroke | track effect | thumb fill |
|---|---|---|---|---|
| off / default       | `Input/input-fill-high` | transparent (opacity 0) | — | `shadcn Default/surface` |
| off / focus         | `input-fill-high` | `shadcn Default/ring` | DROP_SHADOW `ring`@50% spread 3 | `surface` |
| off / disabled      | `input-fill-high` | transparent | — (track opacity 0.5) | `surface` |
| off / invalid       | `input-fill-high` | `shadcn Default/destructive` | — | `surface` |
| off / focus-invalid | `input-fill-high` | `destructive` | DROP_SHADOW `destructive`@20% spread 3 | `surface` |
| on / default        | `shadcn Default/primary-fill` | transparent | — | `surface` |
| on / focus          | `primary-fill` | transparent | DROP_SHADOW `ring`@50% spread 3 | `surface` |
| on / disabled       | `primary-fill` | transparent | — (track opacity 0.5) | `surface` |
| on / invalid        | `destructive` | `destructive` | — | `surface` |
| on / focus-invalid  | `destructive` | `destructive` | DROP_SHADOW `destructive`@20% spread 3 | `surface` |

Radius (all members): all four corners bound to `Corner/corner-full`. Geometry: track 32×18.4
(default), thumb 16×16, thumb x = 1 (off) / 14 (on). Stroke weight 1px.

## Applied delta (S4) — colour only

| element · state | code before | code after (Figma binding) |
|---|---|---|
| track · checked (on)   | `data-checked:bg-primary`   | `data-checked:bg-primary-fill` (`primary-fill` / deep-900 #0d2531) |
| track · unchecked (off)| `data-unchecked:bg-input`   | `data-unchecked:bg-input-fill-high` (`input-fill-high` / ink-400 #7f848b) |
| thumb · all            | `bg-background`             | `bg-surface` (`surface` / base-white) |

Stories: `AllStates` caption spans `text-muted-foreground` → `text-muted-ink` (×10) — the old
name is a DEAD utility post-rework (`--color-muted-foreground` is only in the commented-out stock
block; live `@theme` defines `--color-muted-ink`). Matches the live convention (kbd story uses
`text-muted-ink`). Spec asserts only `corner-full` + `data-size` (both kept) → no spec change.

Kept (token name unchanged, value moved in the rework, binding still correct):
- `aria-invalid:data-checked:bg-destructive` — checked-invalid track fill = `destructive` ✓.
- `focus-visible:border-ring` / `focus-visible:ring-ring/50` — focus stroke + glow = `ring` ✓.
- `aria-invalid:border-destructive` / `aria-invalid:ring-destructive/20` — invalid stroke +
  focus-gated red glow = `destructive` ✓.
- `corner-full`, all geometry (`h-[18.4px]`/`w-[32px]`/`h-[14px]`/`w-[24px]`, `size-4`/`size-3`,
  `translate-x-[calc(100%-2px)]`), `data-disabled:opacity-50` — unchanged.

The focus-gated ring (the red `ring-destructive/20` glow whose width comes only from
`focus-visible:ring-[3px]`, no `aria-invalid:ring-[3px]`) matches the Figma members exactly:
resting invalid carries no DROP_SHADOW, focus-invalid carries the destructive@20% shadow.

## Deviations (code ≠ literal Figma binding) — actionable

| member · property | Figma says | code uses | why |
|---|---|---|---|
| all focus · ring glow | DROP_SHADOW spread 3, **raw** `#4a5562 @ 50%` (old neutral/700, **unbound**) | `ring-ring/50` | Figma effect colour is an unbound raw value (stale old ring colour, same as the button sync found). Code uses the role-correct `ring` token. **Figma fix:** bind the focus shadow colour to the `ring` variable. |
| all focus-invalid · ring glow | DROP_SHADOW spread 3, **raw** `#e7000b @ 20%` (old stock destructive, **unbound**) | `ring-destructive/20` | same: effect colour is an unbound stale hex. Code uses the role-correct `destructive` token. **Figma fix:** bind to `destructive`. |

No structural deviation: the unchecked track fill is `input-fill-high` (ink/400 #7f848b) — the DS
now has a dedicated emphasized-field-fill token for this role, so the old "`input` border token
used as a fill (role≠name)" workaround documented in the prior notes is **resolved**. The fill hex
is unchanged (old `input` was neutral/450 → now `input-fill-high` ink/400 #7f848b, both mid-grey
≥3:1 on white); only the token name moved.

## Verification

- All 10 size=default members read; colour is size-invariant (sm members share the same bindings,
  verified against components-reference member ids — not re-sampled per the brief).
- No variant/size/state added or removed → stories matrix + spec need no structural change.
- New utilities confirmed live in `tw-theme.css`: `--color-primary-fill` (86),
  `--color-input-fill-high` (131), `--color-surface` (77).
- Gate NOT run (per brief).

## Docs

`components-reference.md` Switch entry updated by the team lead from this run's report: live Figma
names/ids, `figma_synced: true`, colour-clothing notes (checked→primary-fill, unchecked→
input-fill-high, thumb→surface).

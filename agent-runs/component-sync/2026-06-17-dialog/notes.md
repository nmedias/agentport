# component-sync — Dialog (2026-06-17)

Figma → code colour reconcile after the DS `-fill`/`-ink`/`-border` token rework.
Read-only on Figma (Plugin MCP). Source of truth: live bound-variable names on the
Dialog Figma surfaces, crosswalked via `tokens-reference.md` §6 (color_renames).

## Scope

Dialog is a composite. Synced surfaces = the Dialog's OWN panel/header/footer/overlay
+ title/description text. The nested ghost icon-sm `.Button` close instance draws its
colours from the already-synced Button — NOT re-synced here.

## Figma nodes (file FIGMA_FILE_KEY, page "Shadcn Components" 3126:2)

- Section "Dialog" `3589:788`
- Composition `.Dialog` `3592:794`
- Footer `.Dialog/Footer` `3591:788`
- Overlay `.Dialog/Overlay` `3590:791`
- Close icon `.Dialog/Icon/Close` `3590:790`

## Live bound-variable readout (S2)

Panel `.Dialog` (3592:794):
- surface fill → `Overlay/overlay-fill`
- border stroke → `Border/border` (1px)
- shadow → effectStyle **Elevation** (DROP_SHADOW r36 s-6 y14, colour bound `Effect/elevation/color`)
- radius → `Corner/corner-xl`
- content frame padding + itemSpacing → `Space/space-xl`; header itemSpacing → `Space/space-md`

Title TEXT (3592:797): fill → `Overlay/overlay-ink`; textStyle **Title**
Description TEXT (3592:798): fill → `shadcn Default/muted-ink`; textStyle **Body**

Footer `.Dialog/Footer` (3591:788):
- band fill → `shadcn Default/muted-fill` (paint opacity 1 — no /50 in Figma)
- border stroke → `Border/border` (top)
- bottom radius → `Corner/corner-xl`
- padding → `Space/space-xl`; actions itemSpacing → `Space/space-md`

Overlay `.Dialog/Overlay` (3590:791):
- scrim fill → `Overlay/scrim`; layer opacity bound `Overlay/scrim-opacity`; BACKGROUND_BLUR 4

Close icon vector (3590:789): fill → `shadcn Default/ink` (inherited by the nested Button's swap target — not a Dialog-owned surface)

## Diff + delta applied (S3/S4)

Five token renames in `dialog.tsx` (§6 crosswalk), token-faithful, no opportunistic rewrites:

| Part | old | new | Figma var |
|---|---|---|---|
| Panel surface | `bg-overlay` | `bg-overlay-fill` | `Overlay/overlay-fill` |
| Panel text | `text-overlay-foreground` | `text-overlay-ink` | `Overlay/overlay-ink` |
| Description text | `text-muted-foreground` | `text-muted-ink` | `shadcn Default/muted-ink` |
| Description link hover | `hover:text-foreground` | `hover:text-ink` | code-only (§6 foreground→ink) |
| Footer band | `bg-muted/50` | `bg-muted-fill/50` | `shadcn Default/muted-fill` |

No delta (verified identical): panel `border` + `shadow-elevation` + `corner-xl` +
`p-xl`/`gap-xl`; header `gap-md`; title `text-format-title`; description `text-format-body`;
footer `border-t` + `corner-b-xl` + `p-xl`/`gap-md` + `-mx-xl -mb-xl` bleed; overlay
`bg-scrim` + `backdrop-blur-xs`. `scrim` and `border` are KEPT names in the rework (only
their values changed) → no class edit.

## Footer /50 note

Figma binds the footer band to `muted-fill` at full paint opacity; the code keeps the
`/50` opacity modifier (the original "getöntes nova-Band" intent — a code-level tint
the Figma var name can't carry). Per "no opportunistic rewrites" the `/50` is preserved;
only the token base `muted`→`muted-fill` is renamed. Spec asserts `bg-muted-fill/50`,
confirming the target.

## Mirrored (S4)

- `dialog.spec.tsx`: token-survival asserts `bg-overlay` → `bg-overlay-fill`,
  `bg-muted/50` → `bg-muted-fill/50`.
- `dialog.stories.tsx`: no colour-token class strings present → nothing to mirror.
- Header comment in `dialog.tsx` updated (rename log + `neutral-900` → `ink-900` for scrim).

## Not done (per instructions)

Did not run the gate, did not edit components-reference.md, did not write to Figma.

# Component-Sync — Checkbox (Figma → code)

Date: 2026-06-12 · Skill: /component-sync (S1–S4 + S6; S5 gate run once by orchestrator) · **Read-only on Figma**.

- Set `.Checkbox` `3795:1184` · page `3126:2` · file `FIGMA_FILE_KEY`.
- Members: default `3792:1184` · checked `3792:1185` · focus `3794:1184` · disabled `3794:1185` · invalid `3794:1186` · checked-invalid `3794:1187`.
- Edit target: `libs/ui/src/components/ui/checkbox/checkbox.tsx`.

## Live Figma bindings (S2, read-set-values.js)

| member | fill var | stroke var | glyph fill | radius | effect | member-opacity |
|---|---|---|---|---|---|---|
| default | `Input/input-background` | `shadcn Default/input` | — | `Corner/corner-sm` | none | 1 |
| checked | `shadcn Default/primary` | `shadcn Default/primary` | `primary-foreground` | corner-sm | none | 1 |
| focus | `Input/input-background` | `shadcn Default/ring` | — | corner-sm | DROP_SHADOW ring/50 spread 3 | 1 |
| disabled | `Input/input-background` | `shadcn Default/input` | — | corner-sm | none | **0.5** |
| invalid | `Input/input-background` | `shadcn Default/destructive ⚠` | — | corner-sm | DROP_SHADOW destructive/20 spread 3 | 1 |
| checked-invalid | `shadcn Default/destructive ⚠` | `shadcn Default/destructive ⚠` | `primary-foreground` | corner-sm | DROP_SHADOW destructive/20 spread 3 | 1 |

Var IDs (confirmed): input-background `3108:2` · input `3038:5` · primary `3037:8` · primary-foreground `3037:9` · ring `3038:6` · destructive⚠ `3038:3` · corner-sm `3073:2`.

## Delta vs. original bindings + current code (S3)

Two properties changed from the original port; everything else (corner-sm, input border, ring focus, primary checked fill, primary-foreground glyph, destructive ring/border on unchecked-invalid, member opacity 0.5 on disabled) is unchanged.

| member | property | Figma binding (var · id) | code utility: old → new |
|---|---|---|---|
| default/focus/disabled/invalid (base) | box fill | `Input/input-background` · `3108:2` | *(none, transparent)* → `bg-input-background` |
| checked-invalid | box fill | `shadcn Default/destructive ⚠` · `3038:3` | `data-checked:bg-primary` (carried) → add `aria-invalid:aria-checked:bg-destructive` |
| checked-invalid | box border | `shadcn Default/destructive ⚠` · `3038:3` | `aria-invalid:aria-checked:border-primary` → `aria-invalid:aria-checked:border-destructive` |

Mapping per §6/§7 crosswalk: `input-background` → `bg-input-background`; `destructive ⚠` → `bg-destructive`/`border-destructive` (placeholder token, see deviation). All bindings mapped 1:1 from the authoritative var name; no re-judgement.

The `aria-invalid:aria-checked:` combinator variants are more specific than the single `data-checked:`/`aria-invalid:` variants, so they win regardless of class source order — the checked-invalid box renders destructive fill + border + white glyph (matches the screenshot: solid red box with white check).

## Variant add/remove

None. Set still has the same 6 state members → no change to `.stories.tsx` / `.spec.tsx`. The `AllStates` story and the `corner-sm` survival guard remain valid.

## Deviations (code ≠ literal Figma binding)

| member | property | Figma says | code uses | why |
|---|---|---|---|---|
| invalid · checked-invalid | border / fill / ring colour | `shadcn Default/destructive ⚠` (placeholder, stock hex `#e7000b`, NOT designed) | `border-destructive` / `bg-destructive` / `ring-destructive/20` | Bound var IS the placeholder token — code maps to its DS utility 1:1. Flagged: the destructive family is `status: placeholder` (tokens-reference §1), not finalized — same ⚠ as Input/Badge. Not a designer error, just an un-finalized token; propagated faithfully. |

No raw/unbound values found — every property the box reads is bound to a DS variable.

## Gate

NOT run here (orchestrator runs `npx nx test|typecheck|lint @agentport/ui` once after all three syncs). The `corner-sm` survival spec is unaffected; `bg-input-background`/`bg-destructive` are valid DS utilities (tokens-reference §1).

## Catalog patch (for orchestrator)

`components-reference.md` Checkbox entry (line ~514 `vars:` + ~518–523 `notes:`):
- **`vars:`** — add `input-background: "3108:2"` (newly bound box fill). Existing 6 entries unchanged.
- **`notes:`** — the line "checked = primary Fill+Border …" should note the box now carries `bg-input-background` in unchecked states; and "invalid + checked-invalid = destructive ⚠ … Border + … Glow" should record that **checked-invalid is now a solid destructive Fill+Border** (was primary-fill-kept). Glyph stays primary-foreground.

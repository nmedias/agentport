# tok/actions — Button, Badge, Kbd

Branch `tok/actions` in `~/Dev/agentport-tok-actions` (from `master`, `a50361f`). One commit `ddaec79`.

## Table — chips before → after · gate result

| Section | Chips before (roled/bare) | Chips after (roled/bare) | Removed | Roles added/rewritten | code_only_tokens | check.py |
|---|---|---|---|---|---|---|
| Button | 11 / 8 | 13 / 6 | none | +2 new roled rows: `ink`, `muted-fill` (moved bare → roled) | `ring` (focus, set defect — see `open`) | ALL PASS |
| Badge  | 10 / 4  | 10 / 4  | none | none | `muted-fill`, `muted-ink`, `ring`, `space-sm` (all: static set has no hover/focus/icon-padding state) | ALL PASS |
| Kbd    | 4 / 3   | 4 / 3   | none | none | `ink` (tooltip-context override, no Figma member) | ALL PASS |

Final gate line (all three sections, merged overrides + fresh figma dump):
```
python3 check.py --only Button,Badge,Kbd --figma dumps/figma-actions.json \
  --overrides /tmp/overrides-actions.json \
  --catalog ~/Dev/agentport-tok-actions/design-docs/design-system/components-reference.md
→ ALL PASS  (43 T2-code-missing PASS incl. 6 as T2-divergence INFO, 6 T2-stale-divergence PASS, all other checks 0 FAIL)
```

## Judgement calls

- **Button `ink` (T8-bare-family → roled).** Traced the binding: on every variant member, `{Label}`
  and the icon `Vector` fall back to `ink` at rest for `outline`/`ghost` only (verified by reading
  `labelFill` on `variant=outline/ghost, size=default, state=default` — both resolve to bare `ink`,
  while `variant=link` resolves to `primary` and `variant=default` icon resolves to `primary-ink`).
  This matches the code: `outline`/`ghost` set no resting text-color class, so it inherits the DS
  default (`ink`). Named the role **"outline / ghost resting label"** to sit next to the existing
  **"outline / ghost hover fill"/"hover label"** pair (`accent-fill`/`accent-ink`) — same vocabulary,
  resting vs. hover made explicit. Inserted the row right after `border` (`outline border`), before
  the hover pair, matching the resting → hover reading order.
- **Button `muted-fill` (T8-bare-family → roled).** Traced the binding to the `state-layer` RECTANGLE
  present in every variant/size/state member (catalog `figma_mechanics` already documents this
  overlay). Sampled the fill per variant: `default` (primary) hover/active → `muted-fill` @ 10–20%
  opacity; `secondary` hover/active → `secondary-fill` (not muted-fill, already covered by its own
  roled chip); `outline`/`ghost` hover/active → `accent-fill` @ opacity 1 (already the roled
  `accent-fill` chip). So the bare `muted-fill` binding belongs specifically to the **default/primary**
  variant's hover/press feedback — a darkening tint layered on top of `primary-fill`. Role: **"default
  fill hover/press tint"** (masks to the existing `primary-fill` chip name "default fill" via the T5
  masking rule, no bare group word). Inserted right after `primary-ink`, before `secondary-fill`, so
  the primary triad (fill/label/tint) reads together.
- **Button `ring` (T2-code-missing → `code_only_tokens`, not a chip).** Confirmed this is the
  pre-existing catalog `open` item ("Figma focus effect colour is raw #4a5562 @ 50% — should bind
  ring") — a **set defect**, not a documented UI divergence. Per rule 6 it still needs the structured
  `code_only_tokens` row (the gate has no other way to go green), but the `why` says explicitly this
  is the open defect, and the `open` list item stays untouched (brief instruction: keep it there).
- **Badge — all 4 code_only_tokens (`muted-fill`, `muted-ink`, `ring`, `space-sm`).** Checked the
  Figma `Badge` set's `componentPropertyDefinitions`: only `variant` (6 values), `label (children)`,
  `icon` slot — **no `state` axis at all** (unlike Button's `state: [default, hover, active, focus,
  disabled]`). Badge is a static pill in Figma; hover/focus/icon-edge-padding are pure code
  interaction states with nothing to bind against. All four are genuine divergences, not set defects —
  no `open` entry added (nothing for Figma to fix without adding a state axis, which is out of this
  round's scope).
- **Kbd `ink` (T2-code-missing → `code_only_tokens`).** The code class
  `in-data-[slot=tooltip-content]:text-ink` only fires when a `Kbd` is nested inside `Tooltip`
  content — a parent-context override the Kbd component set can't model on its own (no "inside
  Tooltip" member). The catalog's `divergences` list already named this in prose
  ("Tooltip-context overrides … are code-only stock carry-over with no Figma binding"); added the
  structured `code_only_tokens` row alongside it — the prose stays as-is (rules keep `divergences`
  for the free-text read, `code_only_tokens` for the gate-checkable one).

## Figma writes

Only Button's `meta well > tokens > Token List` changed: removed 2 bare `chip` instances (`ink`,
`muted-fill`) from `unroled`, cloned 2 `token row` instances from the `primary-ink` template, set
`token`/`role`/`showRole=true`, inserted at the correct display-order indices. Badge and Kbd needed
**no Figma writes** — every gap there was a code-only divergence, not a missing role. Re-dumped after
the write; the dump confirms exact display order:
`primary-fill, primary-ink, muted-fill, secondary-fill, secondary-ink, destructive, destructive-ink,
surface, border, ink, accent-fill, accent-ink, primary`.

## Screenshots

`agent-runs/token-column-audit/2026-09-04/actions/screenshots/` —
`button-meta-well.png`, `badge-meta-well.png`, `kbd-meta-well.png`. All three: no clipping, rows
readable, `unroled` wraps cleanly (Button's `unroled` now 6 chips: `corner-md`, `corner-lg`,
`space-xs`, `space-sm`, `space-md`, `text:Label/md`).

## Blocked / open items

- None newly blocked. Pre-existing `open` items on Button (raw `#4a5562` focus, `corner-lg`/
  `corner-md` icon-size mismatch) left untouched per the brief.

## Notes for the reviewer

- The worktree's denylist grep (`git grep -ilE '<denylist>'`) matches the catalog file, but the hit is
  **pre-existing** at line 39 of `## Rules` ("The token-column gate (`tools/token-audit/check.py`,
  the legacy repo) accepts a listed token …") — a reference to the tooling repo name, already in `master`
  before this worktree branched, not introduced by this round's diff (`git diff` for this commit
  touches only the 3 `code_only_tokens` blocks, none containing a denylist word). Flagging so the
  controller doesn't chase a false positive against this branch specifically; the pre-existing line is
  outside this package's scope to fix.
- `T2-figma-only` WARN (3, unchanged) — all pre-existing scale/text chips without a 1:1 code utility
  name (`space-*`, `text:*`), normal per the brief's decision table.

## Review fixes applied (amend, new hash `b4b6233`)

Applied the controller's vocabulary decision + 5 review nits: Button `surface` role → "outline resting
surface" (only `surface` uses the word "surface"; all `-fill` tokens keep "fill"); Badge `destructive`
role → "destructive fill" (dropped "(solid)"); Kbd `inverse-fill` role → "high cap fill" (dropped
"(inverted)"); Button `muted-fill` role → "hover/press tint on the default fill"; both `ring`
`code_only_tokens.why` texts now start with "Keyboard-focus border and ring — …"; Badge
`muted-fill`/`muted-ink` `why` texts rewritten to say "outline (anchor) / ghost hover" and note the
source gating accurately (outline is `[a]:hover:`-gated — only fires when rendered as a link via
asChild — ghost is plain `hover:`). Re-dumped Figma after the 4 role-text writes, re-ran the gate
(`--only Button,Badge,Kbd`) → ALL PASS, amended the commit (no trailers).

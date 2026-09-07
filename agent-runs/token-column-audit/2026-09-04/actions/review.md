# Review — tok/actions (Button, Badge, Kbd)

Independent reviewer pass. Nothing was edited. Fresh Figma dump taken by the reviewer
(`/tmp/figma-review-actions.json`, file `nQSNLASjuLvgTh3we8Dp4s`, page `Components`, sections
`Button, Badge, Kbd`), gate run against the worker's branch catalog
(`git show tok/actions:design-docs/design-system/components-reference.md` → `/tmp/cat-actions.md`)
and the worker's delta merged into `/tmp/overrides-review-actions.json`.

## Verdict

| Section | check.py | Opinion findings | Screenshot | Verdict |
|---|---|---|---|---|
| Button | ALL PASS | 1 should-fix (`surface` role says "fill"), 2 nits | ok | **accept** |
| Badge  | ALL PASS | 2 nits (`destructive` parenthetical, `why` wording) | ok | **accept** |
| Kbd    | ALL PASS | 1 should-fix (shared vocabulary "fill" vs "surface"), 1 nit | ok | **accept** |

No blocking finding. All three sections can be accepted as delivered; the should-fix items are
vocabulary consistency, not correctness, and one of them is a package-wide convention question that
belongs to the controller, not to this worker.

## Gate

```
python3 check.py --only Button,Badge,Kbd \
  --figma /tmp/figma-review-actions.json \
  --overrides /tmp/overrides-review-actions.json \
  --catalog /tmp/cat-actions.md
→ ALL PASS
```

Per-check totals: `T1-dead` 40/0/0, `T1-missing` 40/0/0, `T2-code-missing` 43/0/0,
`T2-stale-divergence` 6/0/0, `T5-*` 27/0/0 each, `T6-pair` 7/0/0, `T7-word-ban` 17/0/0,
`T8-bare-family` 13/0/0, `T8-member-token` 40/0/0. Only WARN: `T2-figma-only` 3
(Button `border`, `ink`, `muted-fill` — no 1:1 DS utility name in the entry's exports; all three are
genuinely bound in the set, see the verification below, so the WARN is noise, not a defect).

My dump independently confirms the column is exactly the truth set in all three sections:

| Section | chips (roled + bare) | `vars` + `styles` | `mvars` | `msrc` | `off` |
|---|---|---|---|---|---|
| Button | 13 + 6 = 19 | 18 + 1 = 19 | none | none | none |
| Badge  | 10 + 4 = 14 | 13 + 1 = 14 | none | none | none |
| Kbd    | 4 + 3 = 7   | 6 + 1 = 7   | none | none | none |

Nothing in these three sections reaches the set through a foreign member, so criterion rule 3 and the
tie-break never apply here. The catalog `vars` / `styles` lists already matched the live dump on
`master`, which is why the worker's commit adds only `code_only_tokens` and changes no `vars` line.

## Verification of the worker's two Button claims

Read-only inspection of set `3164:312`, all `size=default` members, per variant and state.

**`ink` rests on the outline/ghost label — confirmed.** The `{Label}` fill resolves to bare `ink` on
`outline` and `ghost` in every state except hover/active (which resolve to `accent-ink`), while
`link` resolves to `primary` and `default`/`secondary`/`destructive` to their own `-ink`. The role
"outline / ghost resting label" is true and pairs correctly with `accent-ink` "outline / ghost hover
label".

**`muted-fill` is the default-variant state-layer tint — confirmed.** The `state-layer` rectangle
binds `muted-fill` on the `default` variant only, at node opacity `0` at rest and `0.1` on
hover/active. The other variants bind a different token on the same layer: `secondary` →
`secondary-fill` @ 0.2, `destructive` → `destructive-ink` @ 0.1, `outline`/`ghost` → `accent-fill`
@ 1.0. So `muted-fill` has exactly one job in this set and the role names it correctly.

**Button focus `ring` — confirmed as a set defect, not a code deviation.** The focus member's
`.Button/Base` carries an unbound `DROP_SHADOW`, colour `rgb(0.2902, 0.3333, 0.3843)` alpha `0.5`,
spread `3`, `effectStyleId` null. That is `#4A5562` at 50 % with a 3 px spread — exactly the code's
`focus-visible:ring-ring/50 ring-[3px]` and exactly the pre-existing `open` item. The worker's
decision to file the structured `code_only_tokens` row while leaving `open` in place is right: the
gate has no other way to go green, and the `why` says out loud that this is the defect.

## Verification of the `code_only_tokens` rows

Every `why` was checked against the component source, not the worker's notes.

| Row | Source line | Verdict |
|---|---|---|
| Badge `muted-fill` | `outline: '… [a]:hover:bg-muted-fill …'`, `ghost: 'hover:bg-muted-fill …'` | correct |
| Badge `muted-ink` | same two variants, `hover:text-muted-ink` | correct |
| Badge `ring` | base cva `focus-visible:border-ring focus-visible:ring-ring/50` | correct |
| Badge `space-sm` | base cva `has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm` | correct |
| Button `ring` | base cva `focus-visible:border-ring focus-visible:ring-ring/50` | correct, see above |
| Kbd `ink` | base cva `in-data-[slot=tooltip-content]:text-ink` | correct |

The "no state axis on the Badge set" reasoning also holds: the Badge set's only axis is `variant`,
matching the code's single `BadgeVariant` axis, so there is no hover or focus member to bind against.
The same selector that carries Kbd's `ink` override also carries `in-data-[slot=tooltip-content]:bg-muted-fill`,
and `muted-fill` is already a bound chip, so it correctly needs no divergence row.

## Removals and promotions

The worker removed no chip. Two bare chips were promoted to roled rows, `ink` and `muted-fill`, both
on Button; my dump confirms both tokens are own bindings of the set (`vars`), so a role was the right
call under criterion rule 2 and not a removal. Badge and Kbd needed no Figma write, which my dump
confirms: their columns are unchanged and already complete.

## Screenshots

Captured live from the three `meta well` frames.

- **Button** `8110:3000`, 878 × 452. Thirteen roled rows readable, `unroled` wraps to two lines
  (`corner-md corner-lg space-xs space-sm space-md` / `text:Label/md`), no clipping. Eyebrow reads
  `18 VARS · 1 STYLES`, matching the dump.
- **Badge** `8113:11432`, 800 × 350. Ten rows, `unroled` on one line, clean.
- **Kbd** `8115:11534`, 800 × 230. Four rows, `unroled` on one line, clean.

**No overlap with the block below in any section.** All three `<Name> · doc` frames are VERTICAL
auto-layout with `itemSpacing 36`, and the measured gaps are exact (Button meta well ends 1109, shelf
starts 1145; Badge 986 → 1022; Kbd 832 → 868). Button's meta well grew by two rows and simply pushed
the variants plate down. No re-pack needed.

## Findings, ranked

### Blocking

None.

### Should fix

**1. Shared vocabulary: "fill" where the brief says "surface" (package-wide, controller decision).**
The brief's shared vocabulary fixes container fill = "surface" (`resting surface`, `checked surface`,
`panel surface`). Every `-fill` role in this package says "fill" instead. The sharpest instance is
Button `surface` → **"outline resting fill"**: the token is literally named `surface`, its `use` line
reads "App base surface.", and the role calls it a fill. Proposed text: **"outline resting surface"**.
The same applies to Kbd **"high cap fill (inverted)"** / **"low cap fill"** → proposed
**"high-emphasis cap surface"** / **"low-emphasis cap surface"**, and, read strictly, to Button and
Badge "default fill" / "secondary fill" / "destructive fill".

I do **not** recommend this worker changes it in three sections alone. Twenty-two other sections use
the same "fill" wording, and a partial rename would leave the audit less consistent than it is now.
This is one decision for the controller: either "fill" is accepted as the established word for a
variant's own surface, or all 25 sections change together in a separate sweep.

**2. Kbd roles are otherwise good — "glyph" is correct, not a vocabulary slip.** Flagged here only so
it is not "fixed" by mistake in a later pass: Kbd's own API block calls its content "a text glyph, or
a modifier symbol passed as an icon", so "high cap glyph" / "low cap glyph" uses the component's own
vocabulary and correctly delimits the ink from the fill. `high` / `low` mirror the `emphasis` axis.
Leave as is.

### Nits

**3. Badge `destructive` → "destructive fill (solid)".** The parenthetical delimits against nothing:
Badge has exactly one destructive variant, and the outline variant does not use this token. Button's
row for the same token reads plain "destructive fill". Proposed: **"destructive fill"**.

**4. Kbd `inverse-fill` → "high cap fill (inverted)".** "(inverted)" restates the token's own group
name and adds no information a reader does not already have from the chip. Proposed: drop the
parenthetical, i.e. **"high cap surface"** (or "high cap fill" if finding 1 is decided against).

**5. Button `muted-fill` → "default fill hover/press tint".** Accurate and correctly delimited, but it
scans as a sub-item of the "default fill" row two lines above rather than as its own token. Proposed:
**"hover/press tint on the default fill"**. Cosmetic only.

**6. Button `ink` → "outline / ghost resting label".** `ink` is the label colour in the focus and
disabled members too, not only at rest; hover/active are the sole exception. "resting" is the brief's
own vocabulary word and the pairing with `accent-ink` "hover label" makes the intent clear, so this is
acceptable as written. Noted for completeness, no change recommended.

**7. `why` wording on the two `ring` rows.** Both `code` fields correctly list
`focus-visible:border-ring` alongside `focus-visible:ring-ring/50`, but both `why` texts speak only of
"the ring". The token also paints the focus **border**. Proposed for Badge: "Keyboard-focus border and
ring — the static Badge set has no focus-state member, so neither is drawn."

**8. Badge `muted-fill` / `muted-ink` `why` says "Ghost/outline hover".** On `ghost` the hover fires
unconditionally; on `outline` it is gated to anchors (`[a]:hover:`). Proposed: "Ghost hover fill (and
outline hover when the badge wraps a link)".

## Denylist

```
git -C ~/Dev/agentport-tok-actions grep -ilE "<denylist pattern, kept outside the repo>"
→ design-docs/design-system/components-reference.md
```

Exactly one hit, at line 39, in the `## Rules` prose about the token-column gate — the single line the
brief says to ignore. `master` now has zero hits, and the worker's commit does not touch line 39, so
the two changes sit in different hunks. A rebase of `tok/actions` onto current `master` keeps the fix
and merges clean; a plain `--ff-only` will not apply because `master` has moved.

## Catalog integrity

The commit `ddaec79` adds nine lines and changes nothing else: three `code_only_tokens` blocks, one per
section. No `vars` / `styles` line was touched, which is correct — I re-derived all three lists from my
own dump and they already matched. The `open` list on Button is intact.

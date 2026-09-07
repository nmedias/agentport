# Worker notes — nav-data (Breadcrumb, Separator, Table, Item)

Branch `tok/nav-data` in `~/Dev/agentport-tok-nav-data`, one commit, amended twice, final hash
`2000828` "docs(catalog): tok/nav-data — figma.vars + code_only_tokens for Item, Table"
(`1b5a5fa` → `005de73` after round 1 → `2000828` after round 2, amended in place each time, no
trailers). Delta `agent-runs/token-column-audit/2026-09-04/nav-data/roles-delta.json`.
Fresh dump `tools/token-audit/dumps/figma-nav-data.json` (re-dumped after every Figma edit round —
this is the state the final gate run below checked against).

**Amendment round 1 (post-review):** added the required `open:` line to Item's catalog entry —
`"muted variant binds .Description to muted-ink; code paints text-muted regardless of variant — bind
muted (standalone) or drop the per-variant binding."` — per the reviewer's exact wording (brief rule 6:
a set defect goes into `open`). Gate re-run after the addition: still **ALL PASS** (the `open:` field
isn't gate-checked, it's documentation).

**Amendment round 2 (post-review):** four fixes from the reviewer, all applied to Figma + catalog,
gate re-run, still **ALL PASS**:
1. Separator `border` role **"hairline fill (the default edge, not -emphasis)" → "divider line"** — the
   old text overflowed the row's 340 px width and used "fill" for what is structurally an edge/border
   token, not a fill. New text is short, unambiguous, and matches the shared vocabulary (edge = "border"
   family, but the plain descriptive noun "divider line" reads better here than repeating "border").
2. Item `secondary-fill` role **"photo-thumbnail placeholder fill" → "image placeholder fill"** — the
   Figma variant is literally named `image` (`ItemMediaVariant = 'image'`), not "photo-thumbnail"; my
   original text invented a synonym instead of naming the actual variant. Controller vocabulary
   decision: "fill" stays in every `-fill` token's role text (so `muted-fill`'s existing role "muted
   variant fill + link hover tint" needed no change).
3. Item `muted-ink` role **"description text on the muted-fill variant" → "description text + glyph on
   the muted-fill variant"** — my original text only named the `.Description` TEXT binding and missed
   that the same 3 `variant=muted` members also bind the decorative `Vector` (the chevron/icon glyph
   next to it) to `muted-ink`. Re-checked the earlier Figma inspection output: yes, both `.Description`
   and `Vector` are bound in each of the 3 members — the original role text under-described the actual
   binding.
4. Item `ring` `code_only_tokens.why` corrected — my original text said the focus classes exist "on the
   asChild link form", implying they're conditionally applied there. Re-read `item.tsx`: the
   `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` classes sit
   unconditionally in the `itemVariants` base string (every Item gets them, not just asChild renders) —
   they only ever *fire* on the asChild form because a bare `<div>` never receives `focus-visible` in
   the first place. The `why` now separates "classes are set unconditionally" from "the state only
   fires when the render is focusable", instead of conflating the two.

Also fixed per the reviewer: the `T2-figma-only` WARN explanation below (item 5) — see "Gate result".
Left untouched per explicit instruction: eyebrow counts, Separator's original clipping issue (now moot
— the shorter "divider line" text resolves the overflow that caused it, so no controller action needed
there after all).

## Table (section-wide chips before → own-set chips after)

| | before | after |
|---|---|---|
| roled | ink, border, muted-fill, accent-fill, muted (5) | unchanged |
| bare | input-border, input-fill, primary-fill, primary-ink, secondary-fill, secondary-ink, corner-sm, corner-full, space-2xs, space-xs, space-md, space-xl, text:Body, text:Eyebrow, text:Label/md (15) | space-md, space-xl, text:Body, text:Label/md (4) |

**Removed (11):** `input-border`, `input-fill`, `primary-fill`, `primary-ink`, `secondary-fill`,
`secondary-ink`, `corner-sm`, `corner-full`, `space-2xs`, `space-xs`, `text:Eyebrow` — none of these
are bound by Table's own component set (`TableHead`/`TableCell`/`TableRow`/`Table` composition); the
dump's `vars`/`styles` confirm they never appear as `bound`. Cross-checked against the catalog's old
`figma.vars`/`.styles`, which the baseline flagged as section-wide (captured across all Table usage
examples, not the set) — narrowed both to the dump's own-bound list in the catalog.

**T6-pair (2) resolved by the same removal:** `primary-ink`/`secondary-ink` were flagged as inks
without their fill partners bound — both inks were themselves in the T1-dead removal list, so the
pair failure disappears once they're gone. No `open` entry needed; this was not a genuine set defect,
just two more dead chips.

**Judgement call:** none of the 11 needed a `code_only_tokens` catalog entry — they aren't used by
Table's own code (`table.tsx` is a pure pass-through, no cva, no DS-utility literal for these tokens)
and aren't Figma-bound either. Plain removals per rule 4 / decision-table row `T1-dead`.

## Item (section-wide chips before → own-set chips after)

| | before | after |
|---|---|---|
| roled | ink, muted, muted-fill, border, ring, accent-fill, accent-ink (7) | ink, muted, muted-fill, border, muted-ink, secondary-fill (6) |
| bare | surface, muted-ink, secondary-fill, corner-sm, corner-lg, space-xs, space-md, space-lg, space-xl, text:Body, text:Label/md (11) | corner-sm, corner-lg, space-xs, space-md, space-lg, space-xl, text:Body, text:Label/md (8) |

**Removed as dead (4):**
- `surface` (bare) — not bound anywhere, not used in code (`item.tsx` has no `bg-surface`/`text-surface`
  utility; the one hit was the English word "surface" in a comment). Plain removal, no divergence entry.
- `accent-fill` / `accent-ink` (roled) — only ever bound by the **usage-example** "Selected" state
  instance (`4502:2565`), confirmed via the catalog's own `state_axis` note ("the hover / focus /
  selected delta is uniform... lives in the usage-examples States group") and `deviations`
  ("Selection stays a CALL-SITE / block concern — Item is stock-faithful, no selected prop"). Also
  matches the code: `bg-accent-fill text-accent-ink` appears only in `item.stories.tsx` (a call-site
  demo), never in `item.tsx`. Per goal rule 1 ("truth set = the component set, not the section" /
  "tokens that live only in usage examples... are not chips"), this is a clean removal, not a
  documented divergence — the tokens aren't a component-owned utility at all.
- `ring` (roled) — **judgement call, documented as a divergence, not a plain removal.** `item.tsx`'s
  base class list unconditionally includes `focus-visible:border-ring focus-visible:ring-[3px]
  focus-visible:ring-ring/50` (own DS utility, not a usage-example artifact), but the Figma set has no
  focus member — the ring only exists in the states usage-example group
  (`4502:2544`, explicitly noted as "copied verbatim from the Select focus member... NOT the generic
  Glow style"). This is exactly rule 6's case (code paints a state via a DS utility, Figma set draws no
  such member) → removed the chip and added
  `figma.code_only_tokens: [{ token: ring, code: "focus-visible:border-ring …", why: "…" }]` to the
  catalog entry instead of a silent drop.

**Promoted bare → roled (2), T8-bare-family:**
- `muted-ink` → role **"description text + glyph on the muted-fill variant"** (round-2 wording; round-1
  text "description text on the muted-fill variant" under-described the binding). Traced the actual
  binding: the Item set's `variant=muted` members (3 of 9) bind both `.Description` TEXT and the
  decorative `Vector` glyph to `muted-ink`, while the other 6 members (`default`/`outline` × size) bind
  `.Description` to plain `muted` (and don't bind the Vector the same way). Code (`item.tsx`
  `ItemDescription`) always applies `text-muted`, with no variant-aware branching — **this is a genuine
  Figma set defect** (the `muted` variant's description text should also be `muted`, matching code, not
  `muted-ink`), confirmed by inspecting the actual bound nodes in Figma. I did **not** fix the binding —
  component sets are out of scope for this round ("Figma writes only to chips / rows inside `meta well >
  tokens`... never the component sets"). Since the token really is bound in the set, T8-bare-family
  correctly requires a role, so I gave it one, wrote a role text that's honest about what it labels
  (not "resting" or implying it's intentional), and flagged the mismatch in Open (now the catalog's own
  `open:` line, added in round-1 amendment). Pair rule satisfied structurally (`muted-fill` is bound in
  the section).
- `secondary-fill` → role **"image placeholder fill"** (round-2 wording; round-1 text "photo-thumbnail
  placeholder fill" invented a synonym instead of naming the actual Figma variant, which is literally
  `image`). Bound on `ItemMedia`'s `image` variant's placeholder `RECTANGLE` (`4508:2543`) — a
  Figma-only stand-in swatch for where a real `<img>` would sit; the code's `image` variant of
  `itemMediaVariants` carries no background colour class at all (size/overflow/corner only, the real
  `<img>` covers it). This produces a `T2-figma-only` WARN (no DS utility for this token in the
  exports), which is expected per the brief ("bound in Figma, no 1:1 utility is normal") — it's a
  placeholder swatch, not a design usage of `secondary-fill`'s documented "secondary action" role; the
  role text says what it actually is rather than repeating the canonical `use` sentence.

## Breadcrumb / Separator

Breadcrumb passed the baseline gate and the review unchanged; reviewed role text against the `use`
sentence, no changes made:
- Breadcrumb `muted` → "link resting label" / `ink` → "link-hover label + current page": both speaking,
  delimited from each other (resting vs. hover+current), no group-word or component-name violations.

Separator's `border` role needed a round-2 fix (see Amendment round 2, item 1): the original
"hairline fill (the default edge, not -emphasis)" overflowed the row's 340 px width and used "fill" for
an edge token → replaced with **"divider line"**, short, unambiguous, and (as a side effect) the
shorter text also resolves the row-overflow/clipping the screenshot showed in round 1 — no controller
re-pack needed for that specific issue after all.

## Gate result (final, fresh dump)

```
cd tools/token-audit
python3 check.py --only Breadcrumb,Separator,Table,Item \
  --figma dumps/figma-nav-data.json \
  --overrides /tmp/overrides-nav-data.json \
  --catalog ~/Dev/agentport-tok-nav-data/design-docs/design-system/components-reference.md
```
→ **ALL PASS** (0 FAIL). Remaining WARNs (expected, not failures), 4 total across the package:

- `T2-figma-only` on Table `border` and Item `ink`: **not an unknown-utility gap** — both come from the
  global base layer in `libs/ui/src/styles/globals.css`, not from a component-local class. Confirmed by
  reading the file: `@layer base { * { @apply border-border outline-ring/50; } body { @apply bg-surface
  text-ink text-format-body; } }`. Every element inherits `border-border` and the document body inherits
  `text-ink`, so neither `table.tsx` nor `item.tsx` (nor any other component) ever writes `border-*` or
  `text-ink` as a literal class of its own — the extractor (which scans component files) correctly finds
  nothing to attribute the binding to. This is expected structural noise from how the DS applies its two
  most universal defaults, not a documentation gap.
- `T2-figma-only` on Item `muted-ink` / `secondary-fill`: genuinely component-specific WARNs, already
  explained above — a Figma set defect (`muted-ink`) and a placeholder swatch with no code counterpart
  (`secondary-fill`).

1× `T2-divergence` INFO confirms the `ring` entry parses.

## Blocked / open items

- **Item `muted-ink` on the `muted` variant is a Figma set defect** (binds `muted-ink` where code
  uniformly uses `muted`) — not fixed (out of scope for a worker: no component-set edits). **Resolved
  in round 1:** the catalog now carries the reviewer's exact wording as an `open:` line on Item —
  `"muted variant binds .Description to muted-ink; code paints text-muted regardless of variant — bind
  muted (standalone) or drop the per-variant binding."` Still not fixed on the Figma set itself (still
  out of a worker's writable scope), just documented.
- **Stale `eyebrow` counts**: Item's eyebrow instance still reads "16 VARS · 2 STYLES" and Table's
  reads "17 VARS · 3 STYLES" — both are the pre-edit section-wide counts. Per the Figma column model
  doc ("first child is the eyebrow instance — leave it") and the reviewer's explicit instruction
  ("eyebrow counts are controller work, leave them"), left untouched both rounds.
- ~~Separator role text may be clipping~~ — **resolved as a side effect of round 2**: the reviewer's
  requested shorter role text ("divider line") no longer overflows the row, so there's nothing left for
  the controller to re-pack on this specific item.

## Judgement calls (summary, one line each)

1. Table: removed 11 bare chips wholesale — none bound by the component set (own-binding check, not a
   guess).
2. Table: 2 `T6-pair` failures resolved as a side effect of #1, no separate action needed.
3. Item: removed `surface` (dead, unused) and `accent-fill`/`accent-ink` (usage-example-only per goal
   rule 1) as plain removals.
4. Item: removed `ring` as a chip but preserved it as a documented `code_only_tokens` divergence — code
   really does paint it, Figma really doesn't bind it on the set.
5. Item: promoted `muted-ink` to a roled chip with an honest role text, while flagging the underlying
   `muted`-variant binding as a Figma set defect I did not fix (out of my writable scope).
6. Item: promoted `secondary-fill` to a roled chip describing its real Figma-only role (image
   placeholder swatch), accepting the resulting `T2-figma-only` WARN as expected.
7. Breadcrumb: reviewed, left unchanged — role texts already speaking and delimited.
8. (round 2) Separator `border`: shortened to "divider line" per reviewer — old text overflowed the row
   and misused "fill" for an edge token.
9. (round 2) Item `secondary-fill`: renamed to "image placeholder fill" — named the actual Figma variant
   instead of a synonym.
10. (round 2) Item `muted-ink`: expanded to "description text + glyph on the muted-fill variant" — the
    original text missed that the bound `Vector` glyph is part of the same binding, not just the text.
11. (round 2) Item `ring` divergence `why`: corrected to say the focus utility classes are unconditional
    in the base cva string, separating "classes are always present" from "the state only ever fires on
    a focusable (asChild) render."
12. (round 2) `T2-figma-only` WARNs for Table `border` / Item `ink` traced to the global base layer in
    `globals.css`, not an extractor gap — documented instead of left unexplained.

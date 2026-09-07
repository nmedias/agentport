# Review — nav-data (Breadcrumb, Separator, Table, Item)

Independent reviewer. Nothing edited. Fresh own Figma dump `/tmp/figma-review-nav-data.json`
(file `nQSNLASjuLvgTh3we8Dp4s`, page `Components`), worker branch tip `tok/nav-data` = `005de73`
(amended — it now carries the Item `open` line the worker's notes said it had deferred).

## Result

| Section | check.py | Opinion findings | Screenshot |
|---|---|---|---|
| Breadcrumb | ALL PASS | none — both roles speaking and delimited | ok |
| Separator | ALL PASS | 1 should-fix (role clips + wrong vocabulary) | **clipped** |
| Table | ALL PASS | none on the roles; 1 nit on the notes' WARN reading | ok |
| Item | ALL PASS | 2 should-fix (vocabulary), 2 nits | ok |

Gate, my dump + worker branch catalog + worker delta:

```
python3 check.py --only Breadcrumb,Separator,Table,Item --figma /tmp/figma-review-nav-data.json \
  --overrides /tmp/overrides-review-nav-data.json --catalog /tmp/cat-nav-data.md
→ ALL PASS   (0 FAIL, 4 WARN T2-figma-only, 1 INFO T2-divergence, 24 checks)
```

Verdict: **Breadcrumb accept · Table accept · Item fix first (role wording) · Separator fix first (clipping)**.

## What I verified independently

- **All 15 removals are correct.** My own dump's `vars` / `mvars` for Table contain only
  `accent-fill, border, ink, muted, muted-fill, space-md, space-xl` (+ styles `text:Body`,
  `text:Label/md`); `mvars` is empty. None of the 11 removed tokens (`input-border`, `input-fill`,
  `primary-fill`, `primary-ink`, `secondary-fill`, `secondary-ink`, `corner-sm`, `corner-full`,
  `space-2xs`, `space-xs`, `text:Eyebrow`) is an own binding. Same for Item's 4 (`surface`, `ring`,
  `accent-fill`, `accent-ink`) — absent from both `vars` and `mvars`.
- **The Item `muted` / `muted-ink` claim is exact.** I read the set `4498:2551` member by member:
  the 3 `variant=muted` members bind `.Description` **and** the trailing decorative `Vector` to
  `muted-ink`; the 6 `default` / `outline` members bind both to `muted`. `item.tsx`'s
  `ItemDescription` applies `text-muted` unconditionally, with no variant branch. The set defect is
  real and the `open` line the worker added states it correctly.
- **`code_only_tokens` for `ring` matches the source.** `itemVariants`' base string literally
  contains `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`, and the
  catalog's own `states` note records that the ring exists only in the usage-example States group
  (`4502:2544`), not as a set member. `ring` is correctly absent from my dump's Item `vars`.
- **Catalog `figma.vars` / `.styles` match my dump exactly** for all four sections (Breadcrumb 458,
  Separator 652, Item, Table). The whole file parses (2 yaml blocks, 0 failures).
- **Denylist:** one hit, `components-reference.md:39` — exactly the `## Rules` line about the gate
  that was fixed on master after the branch (`git grep` on master returns nothing). Ignored as
  instructed. No other hit.

## Findings, ranked

### Blocking
None.

### Should fix

1. **Separator — the role text is clipped, and it is the wrong vocabulary.** Confirmed, not refuted:
   the `{Role}` TEXT node is 232 px wide at x=128 inside a 340 px row (`tokens` frame 388 px minus
   2 × 24 padding), so it overflows by 20 px and the frame cuts it at "not -empha". This is a
   role-length problem the worker could fix without touching the container. It also breaks two brief
   rules: "fill" is used for what the shared vocabulary calls a border, and the parenthetical
   delimits against `border-emphasis`, a token that is not in this section at all — Separator has
   exactly one roled token, so nothing needs delimiting.
   Proposed role: **`the divider line`** (fits at ~80 px, `border`'s T7 rule only bans
   "strongest" / "dominant", so it passes).

2. **Item `muted-fill` — "fill" for a container.** The brief's shared vocabulary is explicit:
   container fill = "surface", and "do not invent new families".
   Proposed role: **`muted variant surface + link hover tint`**.

3. **Item `secondary-fill` — same, plus a wrong name.** "photo-thumbnail placeholder fill" says
   "fill" for a container, and the variant it describes is called `image`, not photo-thumbnail
   (`itemMediaVariants` → `image`).
   Proposed role: **`image placeholder surface`**.

### Nits

4. **Item `muted-ink` omits the glyph.** The same 3 members bind a trailing `Vector` to `muted-ink`,
   not just `.Description`. Proposed: **`description text + glyph on the muted-fill variant`**.
   (Keeping the literal token name "muted-fill" is what keeps the generated `-ink` pair rule happy —
   do not swap it for a bare "surface".)

5. **The `ring` divergence `why` is slightly over-narrow.** It says the state belongs to "the asChild
   link form". The three classes sit unconditionally in the `itemVariants` base string, so a
   consumer-supplied `tabIndex` triggers them on a plain `<div>` too. Everything else in the `why`
   is exact. Proposed clause: "focus-visible state from the base class list — a bare `<div>` is not
   focusable, so in practice it surfaces on the `asChild` link form".

6. **Stale eyebrow counts contradict the columns.** Table's eyebrow still reads "17 VARS · 3 STYLES"
   against 7 vars / 2 styles now shown; Item's reads "16 VARS · 2 STYLES" against 12 / 2. The worker
   was right to leave it (the brief says "first child is the eyebrow instance — leave it"), but the
   page now states a wrong number directly above the corrected column. Controller re-pack item.

7. **The notes under-explain the `T2-figma-only` WARNs.** "No single named utility the extractor
   recognises" is the right conclusion but not the cause. The cause is the global base layer in
   `libs/ui/src/styles/globals.css` — `* { @apply border-border outline-ring/50 }` and
   `body { @apply bg-surface text-ink … }`. `table.tsx` writes bare `border-b` / `border-t` and
   `item.tsx` never writes `text-ink`; both really do paint the token, just through the base layer
   the code extractor does not scan. Worth naming exactly, because it will recur in every package.

## Screenshots

Taken via `await node.screenshot({scale:1.5})` on each section's `meta well`.

- **Breadcrumb** (`8411:5715`, 800 × 152) — clean, 2 rows readable, `unroled` one line, no overlap.
- **Separator** (`8422:5773`, 800 × 232) — **role text clipped** (finding 1). Otherwise fine, no
  `unroled` frame, which criterion rule 5 allows.
- **Table** (`8432:5904`, 840 × 294) — clean, 5 rows readable, 4 bare chips wrap on one line.
- **Item** (`8444:6073`, 1452 × 538) — clean, 6 rows readable, 8 bare chips on one line.

No meta well overlaps the block below: each section holds a single `· doc` child whose bounds sit
inside the section height (Breadcrumb 80–1262 of 1342, Separator 80–1026 of 1106, Table 80–3293 of
3395, Item 80–2889 of 2969).

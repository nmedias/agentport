# Token-column audit — overlays (Dialog, Command, Popover, Tooltip)

Branch: `tok/overlays` in `~/Dev/agentport-tok-overlays` (from `master`), single amended commit
`acfa0a7` (`docs(catalog): tok/overlays — figma.vars + code_only_tokens for Dialog, Command,
Popover, Tooltip`). No trailers.

Delta: `agent-runs/token-column-audit/2026-09-04/overlays/roles-delta.json`
Screenshots: `agent-runs/token-column-audit/2026-09-04/overlays/screenshots/{tooltip,popover,dialog,command}.png`

## History of this package

1. First pass, against the original `figma-dump.js` ("own binding wins" tie-break): 37 FAIL → ALL
   PASS. Reported, flagged that the trigger/footer/search Button+InputGroup+Kbd tokens looked
   structurally member-only even though the dump counted them as own.
2. Team lead confirmed the finding; the user decided the dump should stop at foreign-instance
   boundaries (second round, `figma-dump.js`/`check.py` rewritten, `mby` provenance chains added).
   This package was reworked against the new dump — see below.

## Final gate (after the rework)

```
python3 check.py --only Dialog,Command,Popover,Tooltip \
  --figma dumps/figma-overlays.json \
  --overrides /tmp/overrides-overlays.json \
  --catalog ~/Dev/agentport-tok-overlays/design-docs/design-system/components-reference.md
```
→ **ALL PASS** (0 FAIL). One FAIL surfaced mid-rework (`Command T2-code-missing text:Label/md`,
see below) and was resolved with a third `code_only_tokens` row.

## Table: section · chips before rework → after rework · removed (member now) · code_only_tokens

| Section | roled+bare before rework | roled+bare after rework | removed (now member, per `mby`) | code_only_tokens |
|---|---|---|---|---|
| Tooltip | 7 + 6 = 13 | 4 + 4 = 8 | muted-fill, primary-fill, primary-ink (roled, via Button); corner-lg, space-md (bare, via Button) | unchanged (none) |
| Popover | 8 + 7 = 15 | 5 + 6 = 11 | muted-fill, primary-fill, primary-ink (roled, via Button); space-sm (bare, via Button) | unchanged (none) |
| Dialog | 13 + 9 = 22 | 9 + 5 = 14 | primary-fill, primary-ink, secondary-fill, secondary-ink (roled, via Button); corner-md, corner-lg, text:Label/md, space-sm (bare, via Button) | unchanged (none) |
| Command | 16 + 14 = 30 | 15 + 13 = 28 | inverse-ink (roled, via Kbd); text:Label/md (bare, via InputGroup) | +1 new row (text:Label/md — see below), 2 unchanged (dialog-ink, text:Eyebrow) |

## What changed and why (provenance-boundary rework)

The new `figma-dump.js` stops the "own" walk at a nested instance of a foreign DS component —
everything under that instance (its bindings, its variant-as-placed) belongs to the member, not the
section, full stop. This exactly matches what I'd found and flagged after the first pass: the
trigger `.Button/Base` baked into every Tooltip/Popover variant, the two footer action Buttons +
close-icon vector in Dialog, and the nested `InputGroup`/`Kbd` instances in Command were never really
Tooltip/Popover/Dialog/Command's own paint — the previous dump only credited them as "own" because
its subtree walk didn't stop at instance boundaries.

For each section I:
1. Removed the now-member **roled** rows (`node.remove()` on the `token row` instance) and dropped
   their entries from `roles-delta.json`.
2. Removed the now-member **bare** chips from `unroled`.
3. Re-dumped, narrowed `figma.vars`/`figma.styles` in the catalog to the new own set, and re-ran the
   gate.

Concretely:
- **Tooltip / Popover**: lost `muted-fill` / `primary-fill` / `primary-ink` (the trigger Button's
  surface, main-fill and label) — all now documented in the Button section instead. Tooltip also
  lost the scale chips `corner-lg` / `space-md` (Button's own radius/gap); Popover lost `space-sm`.
  `corner-md` (Tooltip) / `corner-lg` (Popover) stayed as the section's own — a genuinely different
  corner step than what the Button's own radius binds, so no collision.
- **Dialog**: lost `primary-fill` / `primary-ink` (the footer's primary Save-style action) and
  `secondary-fill` / `secondary-ink` (the footer's secondary/outline action) — both belong to the
  footer Buttons now, along with `corner-md` / `corner-lg` / `space-sm` / `text:Label/md`. Dialog
  kept `ink` (the close-icon Vector `.Dialog/Icon/Close` is Dialog's OWN private icon component, not
  part of the Button instance) and `muted-fill` (the footer band tint sits on Dialog's own
  `DialogFooter` frame, not inside the nested Button).
- **Command**: lost `inverse-ink` (the "Esc" `Kbd` instance's label — now in `mvars` with chain
  `Kbd`). `inverse-fill` (the same Kbd instance's chip surface) does NOT appear in `mby`/`mvars` in
  this dump, so it stays own — kept its roled row ("esc key chip surface"). Also lost the bare
  `text:Label/md` (now credited to the nested `InputGroup`'s own input/textarea text style, chain
  `InputGroup>InputGroupInput`/`InputGroup>InputGroupTextarea`).

## New code_only_tokens row (Command)

`text:Label/md` / `text-format-label-md`: `CommandInput`'s **default**-variant
`CommandPrimitive.Input` sets `text-format-label-md` directly on its own JSX element
(`command.tsx`, the `w-full bg-transparent text-format-label-md text-ink placeholder:…` className) —
that's Command's own code, not delegated to `InputGroup`. But in Figma that text node physically sits
inside the nested `InputGroup` instance's own subtree, so the provenance boundary now credits the
binding to `InputGroup`, not to Command's own set. Real code/Figma divergence, not a set defect —
added as the third `code_only_tokens` row (after `dialog-ink`, `text:Eyebrow` from the first pass,
both unaffected by this rework).

## Judgement calls (carried over + new)

- All judgement calls from the first pass (T1-dead removals, the `muted` T5-group-word fix, the two
  original `code_only_tokens` rows) are unchanged by the rework and still hold — see git history of
  this file for the first-pass text if needed; superseded content removed here to avoid duplicating
  the now-corrected "own binding" reasoning.
- Verified per section, from the fresh `mby` chains, that every removed token's chain terminates in
  `Button` / `Kbd` / `InputGroup` before treating it as member — no blind trust of `mvars` alone.
- Dialog's `ink` and `muted-fill` were double-checked against the new dump specifically because they
  look similar to the removed Button tokens: both are absent from `mby`/`mvars` and present in `vars`,
  confirming they're painted by Dialog's own nodes (the private close-icon component and the
  `DialogFooter` frame's own tint), not by the nested Button.

## Review round (2026-09-04, after the rework)

Reviewer fixes folded into the same amended commit, no separate commit:

1. Command `border`: "panel border (palette 1.5px)" → **"panel border + separator line"** — `border`
   also binds the `CommandSeparator` set's own 1px line (Command's own component per `sources`), not
   just the palette panel outline; the old text only named the panel.
2. Dialog `muted-fill`: "footer band tint" → **"footer band fill"** — vocabulary fix, container fill
   is "fill" not "tint" (nothing else in the section vocabulary uses "tint").
3. Command `card-fill`: "palette prompt row" → **"palette prompt row fill"** — every other roled fill
   token in this round names itself "… fill"; this one was missing the noun.
4. Dialog `border`: "panel border" → **"panel + footer border"** — `border` also binds
   `DialogFooter`'s own `border-t` (the footer's top divider), not just the panel outline.
5. Dialog `scrim`: "overlay fill" → **"backdrop fill"** — "overlay" collided with the *layer* wording
   used for `scrim-opacity` ("overlay layer opacity"); "backdrop" reads unambiguously as the thing
   behind the modal, matches the token's own `use` sentence ("the backdrop that dims the page").
6. Popover + Dialog `dialog-ink`: "panel text" → **"panel title text"**, verified by inspecting the
   live bindings — in both sections `dialog-ink` binds ONLY the title `TEXT` node
   (`PopoverHeader > title`, `Dialog > content > header > title`); the body/description text binds
   `muted` instead (`PopoverDescription` = `text-muted`, `DialogDescription` = `text-muted`). "panel
   text" over-claimed scope the binding doesn't have.
7. Command `primary`: "palette caret bar" → **"palette caret bar fill"** — vocabulary decision this
   round: "fill" stays on `-fill`-named tokens (`accent-fill` → "selected item fill" unchanged) AND on
   standalone colours used as a shape fill here (`primary`'s own `use`: "shape fill only"), so the
   caret bar's fill gets the same noun as the panel/prompt-row fills for consistency.

   All 7 re-applied in Figma (`setProperties` on the existing `token row` instances, not
   remove+re-add) and in `roles-delta.json`; re-dumped, re-gated: **ALL PASS**, no new FAIL introduced.
   None of the 7 needed a `T7-word-ban` check beyond what's already in the table (`border`'s ban is
   "strongest"/"dominant", not present; `scrim`'s ban is "opacity", not present in "backdrop fill").

8a. **Correction of an earlier claim.** My FIRST-pass notes (before the provenance rework, since
    overwritten) listed Dialog's `ink` chip among the tokens "reached ONLY through a nested member
    instance (the footer action Buttons + close-icon Vector in Dialog)". That was wrong for `ink`
    specifically: `.Dialog/Icon/Close` (id `3590:790`) is Dialog's OWN private icon component — a
    section-local `.`-prefixed base component, not part of the `.Button/Base` instance tree — so `ink`
    was never a member token. The rework dump confirms this (`ink` sits in `vars`, never appears in
    `mby`/`mvars`), and `ink` correctly stayed a roled chip ("close icon") through both passes. The
    *actual* member tokens removed from Dialog in the rework were `primary-fill` / `primary-ink` /
    `secondary-fill` / `secondary-ink` (the two footer Buttons) plus the scale chips `corner-md` /
    `corner-lg` / `space-sm` / `text:Label/md` — `ink` was never among them. (This note exists because
    the reviewer flagged the stale claim in my very first pass report; the notes.md file itself was
    already rewritten correctly during the rework — see "Judgement calls" above, which double-checks
    `ink` explicitly.)

8b. **T2-figma-only WARNs, walked per the decision table** (`chip has no DS utility … reviewer
    decides`) — all 10 read and decided, none needs a fix:
    - **Dialog `border`, Popover `border`, Tooltip `border`** — the bare Tailwind class `border` (no
      colour suffix) already resolves to the `border` token via the DS's default `--tw-border-color`
      override in `globals.css`; there is no separate `border-border` utility string in the code for
      `code_chips()` to match against. Expected gap in the utility-name matcher, not a divergence —
      chip stays.
    - **Dialog `scrim-opacity`** — `tokens-reference.md` declares this token `utilities: []` by design
      (brief rule 7, FLOAT/OPACITY, composed into `bg-scrim` via `color-mix`, no utility of its own).
      Expected, not a gap — chip stays.
    - **Dialog `ink`** — bound on the close-icon glyph in Figma; in code the icon color comes from the
      `Button` component's own default icon styling (`variant="ghost"` wraps `<RiCloseLine />`), not a
      literal utility class declared in `dialog.tsx` itself. Figma-only binding relative to Dialog's
      own exports, exactly the case rule 6/decision-table describes — chip stays.
    - **Command `corner-lg`** — genuinely used in code
      (`in-data-[slot=dialog-content]:corner-lg!` on `CommandItem`), but wrapped in a compound
      variant + important-modifier selector the `base_utility()` matcher doesn't strip. Matcher gap,
      not a real gap — chip stays (code confirms the binding).
    - **Command `input-border` / `input-fill` / `surface` / `inverse-fill`** — all painted through a
      composed child (`<InputGroup>` for the search field wrapper, private icon-frame swatches, the
      nested `<Kbd>Esc</Kbd>` chip) rather than a literal utility string in `command.tsx` itself; the
      utility class lives in the child component's own file. Normal composition pattern, not a
      divergence — chips stay.

## Re-dump against `figma-dump.js` 0f8aba3 (placement overrides inside a foreign instance count as own)

Re-pasted the latest committed script (harvests placement/override paints the SECTION itself set on a
node inside a placed foreign instance, e.g. ChoiceCard's own override on a nested Field's label — see
the script's `overrides`/`overriddenFields` walk) and re-dumped all four sections. Diffed byte-for-byte
against the prior dump: **identical** for all four — `vars`/`mvars`/`styles`/`mstyles`/`mby` unchanged.
Expected: none of Tooltip/Popover/Dialog/Command place an override on a node inside a foreign instance
(the trigger Button, footer Buttons, InputGroup, Kbd are all placed at their template defaults, no
section-level paint override on their internals) — the new harvesting logic has nothing to pick up
here. Gate re-run with the fresh dump: **ALL PASS**, same as before. No catalog change, so no new
commit — `acfa0a7` still reflects the current state exactly.

## Blocked items

None. All 4 sections reached ALL PASS after the rework and the review round.

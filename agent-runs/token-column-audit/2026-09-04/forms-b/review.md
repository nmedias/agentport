# Review — token-column audit, package forms-b

Independent reviewer pass on branch `tok/forms-b` (agentport, tip `69fca21`, worktree
`~/Dev/agentport-tok-forms-b`). Nothing was edited. Fresh dump taken by the reviewer with the
current committed `tools/token-audit/figma-dump.js` (`0f8aba3`), two calls
(`FieldSet,FieldGroup,Checkbox,Switch` + `Slider,RadioGroup,ChoiceCard`), merged into
`/tmp/figma-review-forms-b.json`.

**Verdict: accept all seven sections.** Three should-fix items and four nits below, none of them
blocking; one is a controller item, not a worker defect.

## Gate

```
cd tools/token-audit
python3 merge-overrides.py ../../agent-runs/token-column-audit/2026-09-04/forms-b/roles-delta.json \
  -o /tmp/overrides-review-forms-b.json
python3 check.py --only FieldSet,FieldGroup,Checkbox,Switch,Slider,RadioGroup,ChoiceCard \
  --figma /tmp/figma-review-forms-b.json --overrides /tmp/overrides-review-forms-b.json \
  --catalog /tmp/cat-forms-b.md
→ ALL PASS — 0 FAIL, 21 WARN (all T2-figma-only), 611 PASS
```

The reviewer dump is field-identical to the worker's `dumps/figma-forms-b.json` for `roled`, `bare`,
`vars`, `mvars`, `styles`, `mstyles`, `other`, `off` in all seven sections — the worker's dump was
honest. The 21 WARNs are the expected `T2-figma-only` noise (geometry / space chips and the
ChoiceCard chips whose utilities live in `field.tsx`, not in the three ChoiceCard exports).

Catalog gates on the branch: the file's `yaml` blocks parse (2 blocks, 0 failures); the denylist scan
`git grep -inE "$(paste -sd'|' …/denylist.txt)" -- design-docs` returns exactly one hit,
`components-reference.md:39` (the `## Rules` schema note containing a legacy repo name), which predates the
branch and is the sanctioned exception. The branch touches exactly the seven package entries
(FieldSet, FieldGroup, Checkbox, Switch, RadioGroup, ChoiceCard, Slider) and nothing else.

## Per section

| Section | check.py | Opinion findings | Screenshot |
|---|---|---|---|
| FieldSet | ALL PASS | none — `border` "nested separator line" is accurate and correctly distinguished from FieldGroup's | ok, reads as a column |
| FieldGroup | ALL PASS | none | ok |
| Checkbox | ALL PASS | nit 5 (`ring` is the only role in the family carrying "×3px") | ok |
| Switch | ALL PASS | nit 4 (`destructive` uses "/" where the two sibling controls use "·"), nit 6 (`surface`) | ok |
| Slider | ALL PASS | should-fix 3 (`code_only_tokens.ring` code string + why), nit 6 (`surface`) | ok |
| RadioGroup | ALL PASS | none | ok |
| ChoiceCard | ALL PASS | should-fix 1 (`destructive` role not speaking), nit 6, nit 7 (`figma.vars` includes the adopted member tokens without a note) | ok |

## Verifications carried out

**Removals.** The gate proves the removals mechanically on my own dump: `T1-missing` PASS (51) means
every token the seven sets own-bind has a chip, and `T1-dead` PASS (51) means no chip lacks a
binding. So the chip set is exactly the own-binding set, and every removed chip — Checkbox / Switch /
Slider 26, plus the FieldSet / FieldGroup / RadioGroup batches — is provably not an own binding.
Spot-reading `mvars` / `mby` confirms the reasoning: FieldSet's dropped `ink`, `muted`, `input-fill`,
`destructive`, `text:Body`, `text:Title` all arrive through `FieldGroup`, `FieldGroup>Field`,
`Field>Input`, `Field>Label` or `FieldLegend`; RadioGroup's dropped `ink` / `muted` arrive only
through `Field`. No `ownMembers` list applies to either, matching the controller's decision.

**FieldSet `border` (worker claim: placement override on the nested separator).** Confirmed by a
read-only probe on the set `3739:1026`. The only paint override in the component sits on a
`.Separator` instance at the path `Slot > FieldGroup[INSTANCE] > Slot > .Separator[INSTANCE]`, with
`overriddenFields: [fills, height, width]` and `fills` bound to `Border/border`. It is recorded on
the `.Separator` instance nested inside the boundary `FieldGroup` instance, which is exactly the case
"gate change 3" harvests as own. The role "nested separator line" names it correctly.

**ChoiceCard `accent-ink` (worker claim: bound on the label inside the placed Field).** Confirmed.
In every `checked=on` member of ChoiceCardCheckbox, ChoiceCardSwitch and ChoiceCardRadio the node
`{Label}` at `Field[INSTANCE] > FieldContent > label[SLOT] > Label[INSTANCE] > {Label}[TEXT]` carries
a `fills` paint bound to `Accent/accent-ink`, recorded as an override on the nearest enclosing
`Label` instance. The code agrees: `field.tsx:164` paints
`group-has-data-checked/field-label:text-accent-ink` on FieldTitle, and the code calls that part the
title — so "checked card title" matches both sides.

**ChoiceCard `ownMembers` roles.** Six tokens are adopted via `INFO T8-own-member` (`corner-full`,
`corner-sm`, `destructive-ink`, `input-border`, `input-fill-high`, `primary-ink`, chains through
`Field>Checkbox`, `Field>RadioGroupItem`, `Field>Switch`). Each "nested control …" role names what
the control paints and is delimited from its neighbour: checked fill vs checked mark, resting fill vs
resting border, invalid vs invalid glyph, focus border, switch track fill. The card's own five
(`accent-fill`, `accent-border`, `accent-ink`, `surface`, `border`) all read as the card — checked
fill / checked border / checked title vs resting card fill / resting card border — so a reader can
tell card from control at a glance. Only `destructive` breaks the pattern (finding 1).

**`code_only_tokens`.** Three rows, all opened in the source.
FieldSet `space-lg` — `field.tsx:19` carries
`has-[>[data-slot=checkbox-group]]:gap-lg has-[>[data-slot=radio-group]]:gap-lg`, verbatim as
documented; the `why` is correct. FieldGroup `space-lg` — `field.tsx:57` carries
`data-[slot=checkbox-group]:gap-lg`, verbatim; correct. Slider `ring` — the token is genuinely used,
but the `code` string is a paraphrase (finding 3).

**Screenshots.** All seven meta wells captured at scale 1. No clipping, all rows readable, `unroled`
wraps cleanly on one line everywhere (ChoiceCard's four bare chips included), and every well keeps a
36 px gap to the `variants plate (shelf)` below — no overlap anywhere. FieldSet's column is short
(one roled row plus two bare chips, 124 px well) but it still reads as a proper column: the eyebrow,
the roled row and the chip wrap sit in the same rhythm as the other sections, and the API block
beside it is equally short, so the well stays balanced rather than looking truncated.

## Findings, ranked

**Blocking — none.**

### Should fix

1. **ChoiceCard `destructive`: "nested control invalid" does not say what it paints.** Every one of
   its twelve neighbours names a paint job; this one names a state. The sibling sections are explicit
   for the same token (Checkbox "invalid border · checked-invalid fill", RadioGroup the same).
   Propose: `"nested control invalid border + fill"`. The `use` sentence ("one token for fill, text
   and stroke") supports the longer form.

2. **The eyebrow line of all seven token columns is stale — a controller item, not a worker defect.**
   The columns now contradict their own headings: FieldSet and FieldGroup read "Tokens · 12 vars · 3
   styles" over 3 chips and 0 styles, Checkbox "18 vars · 2 styles" over 8 chips, Switch "13 vars · 2
   styles" over 6, Slider "8 vars · 2 styles" over 5, RadioGroup "18 vars · 3 styles" over 9,
   ChoiceCard "21 vars · 2 styles" over 17. No gate check reads the eyebrow, and the brief's rule 5
   confines worker writes to chips and rows, so the worker was right not to touch it. The refresh
   script shipped alongside the dump fix in `0f8aba3` should run over the package (very likely over
   all 25 sections) before handoff.

3. **Slider `code_only_tokens.ring`: the `code` string is not the literal utility and the `why`
   under-describes the state.** `slider.tsx:128` paints `ring-ring/50` unconditionally together with
   `hover:ring-[3px] focus-visible:ring-[3px] active:ring-[3px]`; there is no
   `focus-visible:ring-ring/50` class in the file, and the halo is a hover / focus / active halo, not
   a focus halo only. The reasoning about the raw DROP_SHADOW in the set is right and should stay.
   Propose `code: "ring-ring/50 (+ hover / focus-visible / active:ring-[3px])"` and a `why` opening
   "the hover / focus / active halo is a literal DROP_SHADOW …".

### Nits

4. **Switch `destructive` punctuation.** "invalid border / checked-invalid track" joins two different
   paint jobs with "/", while Checkbox and RadioGroup use "·" for exactly that structure and reserve
   "/" for alternatives of one paint ("checked / indeterminate fill + border"). Propose
   `"invalid border · checked-invalid track"`.

5. **Checkbox `ring` is the only role in the family carrying the ring width.** "focus border + ring/50
   ×3px" versus "focus border + ring/50" in Switch and RadioGroup, although all three components use
   `ring-[3px]` in code. Propose dropping "×3px" from Checkbox for parity (or adding it to all three,
   but shorter is better here).

6. **The `surface` token's roles use the word "fill".** Switch and Slider say "thumb fill", ChoiceCard
   "resting card fill + switch thumb". The shared vocabulary reserves "surface" for the container
   fill, and the controller's tie-break reads as "fill" for `-fill` tokens and "surface" for the
   `surface` token. Propose "thumb surface" (Switch, Slider) and "resting card surface + toggle
   thumb" (ChoiceCard). Low confidence: if the tie-break is meant only as a ban on "surface" for
   `-fill` tokens, the current texts are fine and consistent across the three sections.

7. **ChoiceCard `figma.vars` carries the six adopted member tokens without a note.** The list
   includes `corner-full`, `corner-sm`, `destructive-ink`, `input-border`, `input-fill-high`,
   `primary-ink`, which are `mvars` in the dump and become own only through `ownMembers`. That makes
   `figma.vars` match the chip set, which is the more useful reading, but it deviates from the
   brief's literal "`figma.vars` = dump `vars` + `styles`" and a later reader diffing the two will
   trip over it. Propose one line next to `tint:`, e.g. "vars include the control tokens adopted via
   ownMembers (Checkbox / Switch / RadioGroupItem) — see the section's members list".

## Integration note

The branch is based on `a50361f`; `master` has since moved five commits ahead to `ce1b611` and now
carries the actions, overlays, nav-data and forms-a entries. A plain diff of `master..tok/forms-b`
therefore shows those other entries as removals. The branch must be rebased onto current `master`
before the fast-forward, or the merge will revert the other packages' catalog work. The forms-b diff
against its own base is clean and scoped to the seven entries, so the rebase should be mechanical.

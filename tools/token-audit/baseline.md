# Token-column gate — baseline run (2026-09-04)

First run of `tools/token-audit/check.py` against the untouched state. **Red as expected** — the run
is the work list for the token round, not a defect of the gate.

## Run

```
node tools/token-audit/extract-code.mjs > tools/token-audit/dumps/code.json   # agentport libs/ui
# figma-dump.js via use_figma, in batches of <= 6 sections (20 kB response cap), merged into:
#   tools/token-audit/dumps/figma.json
cd tools/token-audit && python3 check.py --all              # or: --only Button,Badge   --quiet-info
```

Snapshot: agentport `d08bfb1` on `master` (`npm run check` green), this repo on
`chore/portfolio-extract`. Figma file `nQSNLASjuLvgTh3we8Dp4s`, page `Components`, read-only for the dump.

**Result: `146 FAIL`, 195 WARN, 3668 PASS over all 25 sections** (exit 1).

> Three runs so far, same dump date:
> `137 / 3200` first run → `130 / 3207` after the `ring` decision (rule gap 1, seven `T7-word-ban`
> resolved by changing the `use` sentence, not the role texts) → `146 / 3668` once the `unroled`
> criterion existed and T8 went sharp. The last step is not a regression: T8 stopped being a WARN
> placeholder and became 57 real failures (`T8-bare-family` 44 + `T8-member-token` 13), while
> `T1-missing` fell from 42 to **0** because the dump now knows which bound tokens only arrive through
> a nested member instance and are therefore not chips at all (criterion rule 3).

## Per check

| Check | What it asserts | PASS | FAIL | WARN |
|---|---|---:|---:|---:|
| T0-column | section has a `tokens` frame in the meta well | 25 | 0 | 0 |
| T0-unroled-frame | bare chips imply an `unroled` frame | 25 | 0 | 0 |
| T0-code-export | every catalog export exists in the code extract | 25 | 0 | 0 |
| T1-dead | every chip is bound somewhere in the section's components | 311 | **57** | 0 |
| T1-missing | every token the section's OWN components bind has a chip | 298 | 0 | 0 |
| T1-duplicate | no chip twice | 25 | 0 | 0 |
| T1-off-collection | bound variables outside `semantic` / `semantic-dimension` | 0 | 0 | 30 |
| T2-code-missing | a token the code uses via a DS utility has a chip | 203 | **27** | 0 |
| T2-figma-only | chip without a DS utility in the code — reviewer decides | 0 | 0 | 165 |
| T3-canonical | every chip name is a token in tokens-reference | 368 | 0 | 0 |
| T4-role-source | `token row` ⇔ `DOC.roles` entry | 139 | 0 | 0 |
| T4-role-text | Figma role text == doc-overrides text | 139 | 0 | 0 |
| T4-bare-roled | bare chip has no `DOC.roles` entry | 229 | 0 | 0 |
| T4-dead-role | no `DOC.roles` entry without a chip | 139 | 0 | 0 |
| T4-showRole / -role-empty / -unroled-frame | chip mechanics | 736 | 0 | 0 |
| T5-one-sentence | role is one sentence / phrase | 139 | 0 | 0 |
| T5-component-name | role names no component from the catalog | 139 | 0 | 0 |
| T5-group-word | no group word as an adjective outside its own group | 138 | **1** | 0 |
| T6-pair | an `<x>-ink` chip requires `<x>-fill` bound in the section | 22 | **4** | 0 |
| T7-word-ban | per-token word bans (`token_rules.py`) | 93 | 0 | 0 |
| T8-bare-family | only space-* / corner-* / text:* may be bare (criterion 1+2) | 120 | **44** | 0 |
| T8-member-token | a token that only a nested member instance binds is not a chip (criterion 3) | 355 | **13** | 0 |

## Per section

| Section | FAIL | WARN | PASS |   | Section | FAIL | WARN | PASS |
|---|---:|---:|---:|---|---|---:|---:|---:|
| Table | 13 | 12 | 163 | | Slider | 6 | 5 | 95 |
| Checkbox | 12 | 12 | 168 | | FieldGroup | 5 | 14 | 144 |
| Command | 12 | 16 | 301 | | FieldSet | 5 | 14 | 141 |
| Popover | 9 | 15 | 177 | | Badge | 4 | 0 | 178 |
| RadioGroup | 9 | 12 | 194 | | Button | 3 | 3 | 224 |
| Switch | 9 | 9 | 130 | | Input | 3 | 0 | 116 |
| ChoiceCard | 8 | 23 | 217 | | Textarea | 3 | 1 | 106 |
| Dialog | 8 | 18 | 231 | | FieldLegend | 1 | 1 | 35 |
| Field | 8 | 4 | 136 | | Kbd | 1 | 0 | 88 |
| Tooltip | 8 | 15 | 148 | | Breadcrumb | 0 | 0 | 59 |
| Item | 7 | 6 | 184 | | Label | 0 | 1 | 35 |
| InputGroup | 6 | 7 | 177 | | Separator | 0 | 0 | 18 |
| Select | 6 | 7 | 203 | | | | | |

## What the 146 failures are

**T1-dead (57) — the biggest block, and one systematic cause.** Concentrated in Checkbox 12, Table 11,
Switch 9, Slider 5, RadioGroup 5, Item 4. The dead chips are mostly `space-*` (17), text styles
(`text:Body` 4, `text:Label/md` 3, `text:Title` 2, `text:Eyebrow` 2, `text:Kbd` 1) and neutral colours
(`ink` 3, `border` 3, `muted` 2).

Cause, verified on Checkbox: the **component set binds far less than the section shows**. The Checkbox
set is 15 variants of the box alone — zero text nodes, no spacing, no typography. The label, the row
gap and the group spacing live in the section's *usage examples*, not in the set. The current chips
were generated from the catalog's `figma.vars` / `.styles`, which were captured section-wide.

This is exactly the question the goal settles by rule ("the Figma set says what the component binds →
the target set of chips; the only truth for it"), so the gate checks against the set — **confirmed by
the user on 2026-09-04**. A sizeable share of these 57 are therefore chip *removals*, not fixes; the
worker decides per chip whether the token leaves the column or the binding belongs on the set.

**T1-missing — 42 in the first runs, 0 now.** Every one of them turned out to be a member token: the
column did not mention `accent-fill`, `primary`, `surface`, `secondary-*` … in Popover, Tooltip and
Dialog because those arrive through the nested Button, not through the overlay itself. Since the dump
carries provenance, T1-missing runs over the section's own bindings only and is clean — the same
tokens now surface as `T8-member-token` where they *are* shown as chips.

**T8-bare-family (44).** Colour / effect chips sitting bare in `unroled` although the set binds them,
so criterion rule 2 asks for a role: `ink` 9, `effect:Elevation` 5, `primary-ink` / `primary-fill` /
`muted-fill` / `input-ink-placeholder` 3 each, `surface` / `secondary-fill` / `muted` / `border` 2 each.
By section: Command 9, ChoiceCard 7, Dialog 6, Tooltip 4, Popover 4, then a long tail of 1–2.

**T8-member-token (13).** Chips that only a nested foreign component binds — Dialog `surface`, Popover
and Tooltip `ink` + `space-xs` (all from the nested Button), FieldSet / FieldGroup `destructive` +
`space-2xs` (from Field / Input), RadioGroup `corner-lg` + `space-xs` (from Field / Label), InputGroup
`muted-fill` + `destructive-ink` (from Button). Per criterion rule 3 they belong in the member's own
section, not here. The dump names the source component in every message (`msrc`).

**T2-code-missing (27) — the code counter-check earns its keep.** Real gaps, e.g.

- `Badge`: `hover:bg-muted-fill`, `hover:text-muted-ink`, `focus-visible:ring-ring/50`, `pr-sm/pl-sm`
- `Button`: `focus-visible:ring-ring/50` — matches the catalog's own open item ("Figma focus effect
  colour is raw `#4a5562` @ 50 %, unbound — should bind `ring`")
- `Input` / `Textarea`: `selection:bg-primary-fill` + `selection:text-primary-ink`
- `Field`: the whole checked-ChoiceCard tint (`accent-fill` / `accent-border` / `accent-ink`), `bg-surface`,
  `text-format-title`
- `Select` / `Command`: `text-dialog-ink`

**T7-word-ban — 7 in the first run, 0 now.** `ring`'s role reads "focus border + ring/50" in Checkbox,
Input, InputGroup, RadioGroup, Select, Switch, Textarea, while tokens-reference said "Not a border".
Decided in favour of the Figma reality (agentport `6354abe`): the `use` sentence now names the focus
border, and the T7 rule for `ring` bans what the new sentence actually delimits against — `ring` as a
*resting* edge or as a *selection* edge. "border" is legal only inside the phrase "focus border"
(`forbid_re` in `token_rules.py`). The seven role texts were **not** touched.

**T6-pair (4).** `Item` shows `accent-ink` without `accent-fill` bound, `Table` shows `primary-ink` and
`secondary-ink` without their fills, and `InputGroup` shows `muted-ink` while `muted-fill` only reaches
the set through the nested Button. The pair rule names the reason behind four chips that are also
flagged elsewhere.

**T5-group-word (1).** `Command` → `muted`: "group heading + secondary text" uses *secondary* as an
adjective for a non-secondary token.

**WARNs worth reading, not failing (195).** `T2-figma-only` 165 — chips with no DS utility in the
entry's exports; a large share are the `space-*` / text-style chips of the T1-dead block, so the two
lists overlap. `T1-off-collection` 30 — five raw `Effect/elevation/*` and `Effect/glow/*` primitive
bindings each in Select, Popover, Dialog, Tooltip, Command; that is how an Effect Style binds its parts
(§5 `effects_model`), so it is expected noise, listed for completeness.

## Rule gaps found while building (open for the reviewer)

1. ~~**`ring` "focus border"**~~ **resolved 2026-09-04, agentport `6354abe`.** The DS draws the focus
   state in Figma as a border bound to `ring` plus a ring/50 outline; the `use` sentence claimed the
   opposite. The sentence moved, not the seven role texts — pulled through tokens-reference, the Figma
   variable `Focus/ring` (`VariableID:3038:6`) and `Colors.tsx` per the "Figma description = `use`" rule,
   plus a `token-changelog.md` entry. The T7 rule was re-derived from the new sentence.
2. ~~**`unroled` has no definition**~~ **resolved 2026-09-04:** the criterion is `doc-overrides.json`
   → `_fields.unroled` (five rules). T8 checks it deterministically — rule 1+2 as `T8-bare-family`,
   rule 3 as `T8-member-token` off the dump's provenance, rule 4 as T1, rule 5 by asserting nothing.
   The gate reads any key containing "unroled" in `_fields`, falling back to `_readme`.
3. **Component set vs. section as the token source** (see T1-dead above) — **decided 2026-09-04: the
   component set stays the source.** `figma-dump.js` is unchanged; the T1-dead chips that come from
   usage examples are removals, and the workers decide them per chip. The catalog's `figma.vars` is
   therefore too wide for at least Checkbox / Table / Switch / Slider and needs to follow after the round.
4. **No `use` sentence for `scrim-opacity` in role terms** — it is a FLOAT with no utility, shown as a
   chip in Dialog ("overlay layer opacity"). It passes, but it is the one chip that is not a colour /
   dimension / style in the usual sense; worth a `_readme` note.
5. ~~**`Separator` has no `unroled` frame at all**~~ — covered: criterion rule 5 allows an empty or
   absent `unroled`, and Separator is one of the three clean sections.

6. ~~**What counts as a component's own binding?**~~ **superseded the same day — see "Gate change 2"
   below; the paragraph is kept as history.** Original text: confirmed by the user 2026-09-04: own binding
   wins. `ChoiceCard` reaches `input-fill` / `primary-fill` / `input-border` … both ways — its own
   `ChoiceCard*` sets bind them *and* the nested Checkbox / Switch / RadioGroupItem instances do — so it
   keeps its "nested control" roles. `Popover` / `Tooltip` / `Dialog` sit on the other side: their `ink`,
   `surface`, `space-xs` arrive *only* via the Button and are correctly not chips. The tie-break is the
   `- bound` in `check.py` and is recorded in the comment there and in `figma-dump.js`; settled, not to
   be re-derived.

## Gate extension 2026-09-04 (controller, before the worker round)

`T2-code-missing` had no way to go green when the code paints a token the set does not bind (Badge
hover `muted-fill`, Input `selection:bg-primary-fill`, Button's raw-hex focus): a chip needs a binding
(T1-dead) and workers never touch the sets. The handoff anticipated a "documented deviation"; it now
exists as the catalog field `figma.code_only_tokens: [{ token, code, why }]` (schema + rule in
`components-reference.md`). T2-code-missing accepts a listed token and prints `INFO T2-divergence`;
`T2-stale-divergence` fails a row the code no longer uses, that the set binds, that is a chip anyway,
or that has no `why`. Baseline after the change: unchanged, 146 FAIL / 195 WARN / 3668 PASS.

## Gate change 2 — provenance boundary (2026-09-04, during the worker round)

The overlays worker found that the dump's own/member split did not stop at instance boundaries: `findAll`
descended into a placed foreign instance and credited its bindings to the section, so Tooltip "owned"
its trigger Button's `primary-fill`, and ChoiceCard looked as if its own nodes bound the control colours.
A read-only measurement with a boundary walk showed the truth (Tooltip own = border, corner-md,
dialog-fill, dialog-ink, space-lg, space-sm; ChoiceCard own = accent-border, accent-fill, border,
corner-lg, space-md, surface). **User decision: boundary + anatomy list.** `figma-dump.js` now stops at a
foreign instance, scans the placed subtree for slot content (the Checkbox in Field's slot) and records
the provenance chain per member token (`mby`, e.g. `Field>Checkbox`). `doc-overrides.json` gained
`<Section>.ownMembers` (documented in `_fields`); ChoiceCard lists Checkbox / Switch / RadioGroupItem and
keeps its "nested control" roles, everyone else lists nothing. `check.py` adopts member tokens whose chain
contains a listed name (`INFO T8-own-member`) and fails a listed name that matches no member
(`T8-own-member-stale`). Rule gap 6 above ("own binding wins") is thereby superseded.

## Gate change 3 — placement overrides (2026-09-04, during the worker round)

forms-b found the boundary walk's blind spot: ChoiceCard binds `accent-ink` on the label INSIDE its
placed Field instance (checked card title) — an override at placement, invisible to the own walk
(stops at Field) and to the member walk (reads Field's template). Figma records such an override on
the NEAREST enclosing instance (the Label inside the Field), so `figma-dump.js` now reads `overrides`
of the boundary instance and of every instance nested in it and harvests exactly the overridden
paint / style fields as OWN. Measured effect: ChoiceCard +accent-ink; InputGroup +corner-sm, space-xs,
space-sm (its own xs-button overrides on the nested Button — matching the code's DS delta, so the
corner-sm `code_only_tokens` row became stale); FieldSet +border (its .Separator override); Tooltip /
Dialog unchanged. RadioGroup gets no `ownMembers` (its nested Field / Label are content, like
FieldSet's) — consistent with the second decision.

## Final run (2026-09-04, end of the worker round)

Fresh dump of all 25 sections (six batches, script at its third revision), merged catalog on agentport
`master`, merged `doc-overrides.json`: **3047 PASS · 0 FAIL · 77 WARN — ALL PASS.** Chips 368 → 246,
roled rows 139 → 151, `code_only_tokens` 31 rows over 15 entries. The 77 WARN are `T1-off-collection` 30
(Effect primitives behind an effect style) and `T2-figma-only` 47 (chips without a 1:1 utility — walked
per section in the package notes). Eyebrow counts refreshed in 16 sections
(`refresh-eyebrows.js`). Package record: `agent-runs/token-column-audit/2026-09-04/<pkg>/{notes,review}.md`.

## Notes for workers

- The gate is **shared and read-only**. Fix Figma, `doc-overrides.json` or the catalog — never
  `check.py` / `token_rules.py` / the extractors. (Lesson from the API round.)
- `--only <Section,…>` scopes a run to one package; the summary block stays.
- `INFO … use "…"` prints the token's generic `use` sentence next to the section role text — that is the
  line to read when judging whether a role is *speaking*. Suppress with `--quiet-info`.
- Re-dump Figma before a review; the dump is a snapshot, not a live read.

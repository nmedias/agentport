# forms-a — worker notes (2026-09-04)

Sections: Input, Textarea, InputGroup, Select, Label, Field, FieldLegend.
Branch: `tok/forms-a` (agentport worktree `~/Dev/agentport-tok-forms-a`), one amended commit `4e19445` (chain: `43196e5` → `21092bf` round 2 → `d976117` round 3 → `4e19445` round 4).
Delta: `agent-runs/token-column-audit/2026-09-04/forms-a/roles-delta.json`.
Screenshots: `agent-runs/token-column-audit/2026-09-04/forms-a/screenshots/*.png`.

Baseline (this package, before any edit): 27 FAIL (`--only Input,Textarea,InputGroup,Select,Label,Field,FieldLegend`).
Round 1 result: ALL PASS with the original (own-binding-wins) `figma-dump.js`.
**Round 2 (2026-09-04, controller rule change — provenance boundary):** the dump was rewritten to stop the "own" walk at any nested instance of a foreign component (it no longer descends into a placed instance and credits its subtree to the section); re-dumping with the new script moved 2 of my 7 sections. Reworked both, re-gated, re-screenshotted, amended the commit (no new trailer).
**Round 3 (2026-09-04, reviewer findings):** 2 blocking role-text fixes (Input `ink`, Select `open:` line) + 4 role rewrites (InputGroup/Select `ink`/`muted`) + 1 code_only_tokens attribution fix (Field `space-xl`) + notes corrections, applied in the same amended commit.
**Round 4 (2026-09-04, controller rule change — placement overrides count as own):** the dump was extended to harvest paint/style overrides the section places on a node inside a foreign instance (e.g. InputGroupButton's `corner-sm` override on the nested Button's xs/icon-xs size) as the section's own binding, not the member's. Re-dumping with the committed script moved only InputGroup (`corner-sm` and `space-xs` became own again); Field unaffected, confirmed by dump not assumption. Put the `corner-sm`/`space-xs` bare chips back, dropped the now-stale `corner-sm` `code_only_tokens` row, updated `figma.vars`, re-gated, re-screenshotted, amended.
Final: **ALL PASS** (`python3 check.py --only Input,Textarea,InputGroup,Select,Label,Field,FieldLegend --figma dumps/figma-forms-a.json --overrides /tmp/overrides-forms-a.json --catalog ~/Dev/agentport-tok-forms-a/design-docs/design-system/components-reference.md`).

## Table — chips before → after

| Section | chips before (roled+bare) | chips after | removed | roles added/rewritten | code_only_tokens | check result |
|---|---|---|---|---|---|---|
| Input | 5 + 5 = 10 | 6 + 4 = 10 | 0 | `ink` → "entered value text" (new; round 3 fix, was "file-picker label" — see judgement call #18) | `primary-fill`, `primary-ink` (selection highlight) | PASS |
| Textarea | 5 + 4 = 9 | 6 + 3 = 9 | 0 | `ink` → "entered text" (new) | `primary-fill`, `primary-ink` (selection highlight) | PASS |
| InputGroup | 6 + 12 = 18 → 7 + 5 = 12 (round 2) → 7 + 7 = 14 (round 4) | 7 + 7 = 14 | round 1: `muted-ink` (dead), `muted-fill`, `destructive-ink` (member-only via Button); round 2: bare `corner-sm` (dead at that point), `corner-md` + `space-xs` (member-only via Button); round 4: `corner-sm` + `space-xs` bare chips **added back** — the placement-override-aware dump now credits InputGroupButton's own `corner-sm` override (and the `space-xs` it implies on the xs/icon-xs Button size) as InputGroup's own binding, not the Button's | `ink` → "entered text + addon button label" (round 3, was "entered text"), `muted` → "addon icon + prefix text" (round 3, was "addon / text label") | `space-lg` (block-align padding push); round 2's `corner-sm` row **dropped in round 4** (stale — the set binds it again, so it's a chip, not a divergence) | PASS |
| Select | 9 + 9 = 18 | 11 + 6 = 17 | `text:Body` (dead) | `ink` → "trigger value + item label" (round 3, was "value text"), `effect:Elevation` → "dropdown elevation" (new, round 1), `muted` → "group heading + chevron icon" (round 3, was "label / chevron") | `dialog-ink`, `input-ink-placeholder`, `space-3xl`; `open:` line added (round 3, see #19) | PASS |
| Label | 1 + 2 = 3 | 1 + 2 = 3 | 0 | none | none | PASS (already green) |
| Field | 6 + 6 = 12 → 4 + 5 = 9 (round 2) | 4 + 5 = 9 | round 2: roled rows `ink` → "label text" and `input-ink-placeholder` → "nested control placeholder" removed (now member-only via nested Input/Label), bare chip `text:Label/md` removed (same reason) | round 2: none rewritten, 2 rows removed (see left) | `accent-border`, `accent-fill`, `accent-ink`, `space-lg`, `space-sm`, `space-xl`, `surface`, `text:Title` (round 1, 8 rows), + `text:Label/md` (round 2), + round 3 fix: `space-xl`'s `code` field corrected from "gap-xl (FieldSet)" to "gap-xl (FieldGroup fieldGroupVariants, field.tsx:57)" — I had misattributed the declaration in round 1 | PASS |
| FieldLegend | 1 + 2 = 3 | 1 + 2 = 3 | 0 | none | `space-sm` (`mb-sm`) | PASS |

## Judgement calls

1. **`ink` promoted from bare to roled in Input / Textarea / InputGroup / Select.** The set binds it as an own token in all four (criterion rule 2: every colour the set binds needs a role or is not a chip). Roles are deliberately distinct per section, not a copy-pasted "text colour": Input's only code usage of `ink` is `file:text-ink` (the file-picker button label) → "file-picker label"; Textarea and InputGroup have no explicit `text-ink` class at all (the value text relies on inherited default colour, matching the WARN `T2-figma-only`) → "entered text"; Select likewise has no explicit usage → "value text" (covers both the trigger's displayed value and un-highlighted item text).
2. **`effect:Elevation` promoted from bare to roled in Select.** Per criterion rule 2, effect styles the set binds need a role too (not just colours) — role "dropdown elevation", matches the `shadow-elevation` utility on `SelectContent`.
3. **InputGroup: `muted-ink` removed (T1-dead).** Not bound anywhere — neither the section's own components nor a nested member (dump `mvars` doesn't list it either). A genuinely dead chip, not a member-token case.
4. **InputGroup: `muted-fill` / `destructive-ink` removed (T8-member-token).** Both reach the set only through the nested `.Button/Base` / `Button` instance (InputGroupButton's ghost variant) — documented in Button's own section, not chips here.
5. **Select: `text:Body` removed (T1-dead).** Not in the set's own bound styles (only `effect:Elevation` + `text:Label/md`); was a stale leftover in `unroled`.
6. **Figma `figma.vars`/`figma.styles` catalog fields updated for InputGroup (removed `destructive-ink`, `muted-fill`, `muted-ink`) and Select (removed `text:Body` from `styles`)** to match the dump's own-binding set exactly, per the schema rule "own bindings only, tokens reaching the set only through a nested member are not listed."
7. **8 `code_only_tokens` rows on Field are all attributable to sibling exports bundled in the same `field.tsx` file, not Field's own row.** Field's `code.exports` deliberately lists the whole family (10 exports, documented cardinality gap in `anatomy`), so `extract-code.mjs`'s per-declaration extraction still unions FieldSet/FieldSeparator/FieldSet/FieldLabel/FieldTitle/FieldLegend classes into the T2 check for Field. Each row's `why` names the actual declaration and, where that declaration has its own doc section (FieldLegend), notes the duplication. This is the pragmatic path within worker scope — not a gate change (the code.exports list is a correct fact, not a bug) and not a chip (none of these are drawn by Field's own row-only set).
8. **FieldLegend `space-sm` (`mb-sm`) is a real own gap**, not a Field-file artefact: the legend's bottom margin has no sibling node in Figma to bind a gap token against (single text layer).
9. **Select `dialog-ink`**: code sets it once on `SelectContent` as a text-colour fallback; each row (`SelectItem`, `SelectLabel`) binds its own `ink`/`accent-ink` directly in Figma, so there's no single content-level node to point `dialog-ink` at. Treated as a normal "no Figma counterpart" divergence, not a set defect — no `open` entry added.
10. **Select `input-ink-placeholder`**: the trigger member's placeholder/value swap is modelled with the `filles` boolean only (per the catalog's own `figma_mechanics` note), not a bound placeholder-colour state — so there's nothing to bind. Considered borderline (arguably a set gap Figma *could* close by binding the placeholder TEXT layer's fill), but the existing catalog note frames the double-text construction as an accepted quirk rather than a listed defect, so I did not add a new `open` line — flagging here for the reviewer to weigh in.
11. **Select `space-3xl` (`pr-3xl`)**: already documented in the catalog's own `divergences` as "NOT a delta" (Figma draws the check as a non-layout trailing vector). `code_only_tokens` `why` references that existing note rather than restating it.
12. **InputGroup `space-lg`**: the block-start/block-end addon toolbar pushes matching padding onto the nested input/textarea; Figma draws block-start/block-end as separate static frames without modelling that compensating push.

### Round 2 — provenance-boundary rework (controller rule change)

13. **InputGroup `corner-sm` removed (T1-dead, round 2).** Under the tightened boundary this token no longer shows up anywhere in the traversal — own or member (`mvars`/`mby` both silent on it) — so it is a straightforward dead chip, not "member via Button" as the controller's summary of their own measurement suggested; my fresh dump is unambiguous and `check.py` confirms T1-dead, not T8-member-token, so I removed it on that basis.
14. **InputGroup `corner-md` / `space-xs` removed (T8-member-token, round 2).** Both now resolve only through the nested `Button` chain (`mby`: `["Button","Button>.Button/Base"]`) — the walk used to descend into the placed Button instance and credit its radius/gap to InputGroup; now it stops at the instance boundary, so these are the Button's own tokens.
15. **InputGroup `corner-sm` added as `code_only_tokens` (round 2).** Once the bare chip was removed, `T2-code-missing` surfaced a real gap: `InputGroupButtonVariants` applies `corner-sm` directly on the xs/icon-xs wrapper (a DS delta shrinking the nested Button's own `corner-md`, per the code comment). There is no Figma node distinct from the nested Button to bind this override to.
16. **Field: `ink` and `input-ink-placeholder` roled rows removed, `text:Label/md` bare chip removed (T8-member-token, round 2).** All three now resolve only through the nested `Input`/`Label` instances (`mby` chains `["Input","Label"]`, `["Input"]`, `["Input","Label"]`) — Field's own row (label/control/description/error slots) draws no colour or type style of its own; every one of these was previously credited to Field only because the old walk descended past the slot's placed Input/Label instance.
17. **Field `text:Label/md` added as `code_only_tokens` (round 2).** Removing the bare chip surfaced a real gap: `FieldTitle` (Field's own export, the choice-card title) uses `text-format-label-md` directly in code, but that style no longer has an own Figma binding on Field's row — it only reaches the set through the nested Input/Label member, same reasoning as #7 above.

### Round 3 — reviewer findings

18. **Input `ink` role fixed: "file-picker label" → "entered value text" (BLOCKING).** My round-1 reasoning read the role off the one explicit code usage (`file:text-ink`, the file-picker button label), inverting rule 1 (Figma-set-binds-it is the truth, not the code class). The set actually binds `ink` on the value TEXT layer itself — Input has no file-picker anatomy in Figma at all (the `type=file` state isn't a separate Figma variant, per the component's own `anatomy` note: "state axis only", no file-specific member). Corrected to describe what the set draws: the entered value's text colour.
19. **Select: added `open:` line for the placeholder/ink mismatch (BLOCKING).** `SelectTrigger`'s placeholder TEXT layer binds `ink`, not `input-ink-placeholder` — a genuine Figma set defect: it contradicts the trigger's own documented "Input parity" deviation (the trigger is supposed to read identically to Input, which does bind `input-ink-placeholder` on its placeholder layer). Added as `open:` per the "set defect additionally stays in `open`" rule, kept the existing `code_only_tokens` row for `input-ink-placeholder` (the code still needs documenting regardless of the underlying defect).
20. **InputGroup `ink` → "entered text + addon button label", `muted` → "addon icon + prefix text" (role rewrites).** Both tokens now cover more than my round-1 phrasing implied once I looked again at where they bind across InputGroup's own components: `ink` reaches both the nested Input/Textarea's value text (own, per `InputGroupInput`/`InputGroupTextarea`) and `InputGroupButton`'s label text; `muted` covers both `InputGroupText`'s icon (`text-muted` on the `svg` selector) and its prefix/suffix text content — the previous "entered text" / "addon / text label" wording undersold the actual coverage.
21. **Select `ink` → "trigger value + item label", `muted` → "group heading + chevron icon" (role rewrites).** Same correction pattern: `ink` is bound on both the trigger's displayed value text and the (non-highlighted) item label text; `muted` is bound on both the group heading (`SelectLabel`) and the trailing chevron icon — "value text" / "label / chevron" undersold what each token actually paints across the set's own members.
22. **Field `space-xl` `code_only_tokens` field corrected.** Round 1 attributed `gap-xl` to `FieldSet` — wrong declaration; it's `fieldGroupVariants` on `FieldGroup` (`field.tsx:57`). `FieldSet`'s own gaps are `gap-xl`/`gap-lg` too (`flex flex-col gap-xl has-[…]:gap-lg`) which made the misattribution easy to miss on a skim; fixed to name `FieldGroup` specifically with the line reference.
23. **Vocabulary decision (controller): "fill" stays for `-fill` tokens.** No change needed — `input-fill` → "trigger resting fill" (Select) already used "fill", not "surface"; confirmed correct as-is.

### T2-figma-only WARNs, section by section (review finding #8)

8 WARNs remained after round 3, all reviewed as normal ("Figma-only binding, no 1:1 code utility" is expected for a colour a TEXT node always carries even when code never sets an explicit class for it — the alternative would be leaving the text unstyled in Figma, which the doc chips would then also miss):

- **Textarea `ink`, InputGroup `ink`, Select `ink`, Label `ink`** (4 WARNs): in each case Figma's own value/caption TEXT layer carries an explicit `ink` fill (Figma always binds *some* fill on a text node), but the corresponding code declaration never sets an explicit `text-ink` class — the browser's inherited default text colour already renders as `ink` (the DS's own base text colour), so there is nothing to add in code. Same reasoning as judgement call #1's Textarea/InputGroup/Select cases, now also covering Label.
- **InputGroup `input-ink-placeholder`** (1 WARN): bound on the nested Input/Textarea's own placeholder TEXT layer (`InputGroupInput`/`InputGroupTextarea` wrap `Input`/`Textarea`, whose own `.tsx` declarations carry `placeholder:text-input-ink-placeholder` — but `extract-code.mjs` attributes classes per *declaration name*, and `InputGroupInput`'s own declaration doesn't repeat that class, it inherits it by wrapping `Input`). Structurally the same "own binding, no own code class" case as the four `ink` WARNs.
- **Field `input-border`, `input-fill`** (2 WARNs — corrected count: my round-1 report said "four Field input-* ones stay", but `ink` and `input-ink-placeholder` moved to member-only in round 2 and dropped off the WARN list entirely, so only these two remain). Field.tsx deliberately paints no surface of its own (`anatomy`: "It draws no surface — the control keeps its own look"); the Figma set's control-slot wrapper carries a placeholder fill/border (`input-fill`/`input-border`) to preview what the default control looks like when no override fills the slot. The code never paints Field itself with these tokens — the real control (Input/Textarea/Select) supplies its own surface — so there is genuinely no code utility to point to, by design, not by omission.

**Round 4 adds a 9th WARN**: **InputGroup `space-xs`** — the bare chip put back once the placement-override dump made it own again; no literal `space-xs` string sits in InputGroup's own `.tsx` declarations (it's implied by `InputGroupButton`'s xs/icon-xs size mapping onto the nested Button, not spelled out as a class InputGroup itself owns) — same "own Figma binding, no own code class" shape as the others above.

### Correction on the denylist remark

My round-1 report said the whole catalog file matches the denylist. More precisely: the match is a **single line**, `## Rules` → the `figma.code_only_tokens` bullet, which names the tool as "`tools/token-audit/check.py`, the legacy repo" — the word "the legacy repo" itself is on the denylist. Per the team lead, this is **already fixed on `master`**; my branch forked before that fix, so it still carries the old wording. Not touched — it's outside my 7-entry scope and the fix already exists upstream; a rebase/merge will pick it up.

### Round 4 — placement-override dump change (controller rule change)

24. **InputGroup `corner-sm` / `space-xs`: bare chips restored, `corner-sm` `code_only_tokens` row dropped (round 4).** The dump was extended to harvest overrides the section places on a node *inside* a foreign instance (`figma-dump.js` header, "Overrides at placement") as the section's own binding. `InputGroupButtonVariants`'s `corner-sm` on xs/icon-xs is exactly such an override on the nested Button — it now counts as InputGroup's own, undoing round 2's removal. `check.py` flagged the resulting state precisely: `T1-missing` on both tokens (bound, no chip) and `T2-stale-divergence` on the `code_only_tokens` row (the set binds it now, so a divergence row is wrong). Fixed both — added the bare chips back (cloned from the existing `corner-lg`/`space-sm` chips, corner-*/space-* ascending order preserved), removed the stale row, updated `figma.vars`.
25. **Field unaffected by round 4 — confirmed by dump, not assumed.** The controller's message said "Field may or may not change"; I re-dumped it explicitly rather than skip it, and it came back byte-identical to its round-2/3 state (`ink`/`input-ink-placeholder`/`ring`/`text:Label/md` still member-only via Input/Label) — Field has no placement overrides of this kind to harvest.

## Blocked / open questions for the reviewer

- Resolved in round 3: Select `input-ink-placeholder` (item #10 in round 1) — the controller confirmed it as a genuine set defect and asked for an `open:` line, added (judgement call #19).
- Nothing else open from my side; all review findings and both dump-rule changes applied.

## Gate line (final, round 4 — placement-override dump)

```
ALL PASS
  T0-code-export         PASS     7  FAIL     0  WARN     0
  T0-column              PASS     7  FAIL     0  WARN     0
  T0-unroled-frame       PASS     7  FAIL     0  WARN     0
  T1-dead                PASS    65  FAIL     0  WARN     0
  T1-duplicate           PASS     7  FAIL     0  WARN     0
  T1-missing             PASS    65  FAIL     0  WARN     0
  T1-off-collection      PASS     0  FAIL     0  WARN     5
  T2-code-missing        PASS    74  FAIL     0  WARN     0
  T2-figma-only          PASS     0  FAIL     0  WARN     9
  T2-stale-divergence    PASS    18  FAIL     0  WARN     0
  T3-canonical           PASS    65  FAIL     0  WARN     0
  T4-bare-roled          PASS    29  FAIL     0  WARN     0
  T4-dead-role           PASS    36  FAIL     0  WARN     0
  T4-role-empty          PASS    36  FAIL     0  WARN     0
  T4-role-source         PASS    36  FAIL     0  WARN     0
  T4-role-text           PASS    36  FAIL     0  WARN     0
  T4-showRole            PASS    65  FAIL     0  WARN     0
  T4-unroled-frame       PASS    29  FAIL     0  WARN     0
  T5-component-name      PASS    36  FAIL     0  WARN     0
  T5-group-word          PASS    36  FAIL     0  WARN     0
  T5-one-sentence        PASS    36  FAIL     0  WARN     0
  T6-pair                PASS     1  FAIL     0  WARN     0
  T7-word-ban             PASS    25  FAIL     0  WARN     0
  T8-bare-family          PASS    29  FAIL     0  WARN     0
  T8-member-token        PASS    65  FAIL     0  WARN     0
```

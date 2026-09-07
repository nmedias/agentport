# forms-a — independent review (2026-09-04)

Reviewer, read-only. Nothing in Figma, the worktree or the delta was edited.

Inputs, all re-derived:

- Fresh Figma dump (`figma-dump.js` verbatim, two calls, merged): `/tmp/figma-review-forms-a.json`
- Worker catalog: `git -C ~/Dev/agentport show tok/forms-a:… > /tmp/cat-forms-a.md`
- Worker delta merged: `/tmp/overrides-review-forms-a.json`
- Gate log: `/tmp/check-forms-a.txt`

```
python3 check.py --only Input,Textarea,InputGroup,Select,Label,Field,FieldLegend \
  --figma /tmp/figma-review-forms-a.json --overrides /tmp/overrides-review-forms-a.json \
  --catalog /tmp/cat-forms-a.md
→ ALL PASS   (exit 0; 0 FAIL, 17 WARN — 5 T1-off-collection + 12 T2-figma-only)
```

The worker's final gate line reproduces exactly on a fresh dump. Every `figma.vars` / `figma.styles`
list in the branch catalog matches my dump byte-for-byte for all seven entries.

## Table

| Section | check.py | opinion findings | screenshot |
|---|---|---|---|
| Input | ALL PASS | **1 blocking** — `ink` role describes an anatomy the set does not draw | ok |
| Textarea | ALL PASS | none | ok |
| InputGroup | ALL PASS | 2 should-fix — `ink` role too narrow, `muted` role ambiguous; stale eyebrow count | ok |
| Select | ALL PASS | 1 blocking (missing `open`), 2 should-fix roles, 1 nit; stale eyebrow count | ok |
| Label | ALL PASS | none (untouched, already green) | ok |
| Field | ALL PASS | none — the 8 sibling-export rows are honest | ok |
| FieldLegend | ALL PASS | none | ok |

Screenshots taken with `await node.screenshot({scale:1})` on each `meta well`. No clipping, every row
readable, `unroled` wraps cleanly in one or two lines. No overlap with the block below in any section —
meta-well bottom to next sibling top is 36 px everywhere (Input 1110→1146, Textarea 993→1029,
InputGroup 1486→1522, Select 1999→2035, Label 763→799, Field 1509→1545, FieldLegend 651→687).

## Which node binds what (independent probe)

A second read-only pass collected the node that carries each colour binding. This is the evidence
behind the role findings.

| Section | token | bound on |
|---|---|---|
| Input | `ink` | `Input > value [TEXT] "{Value}"` — nothing else |
| Textarea | `ink` | `Textarea > value [TEXT] "{Value}"` |
| InputGroup | `ink` | `InputGroupButton > {Label}` + `InputGroupButton > Vector`, `InputGroupInput > value`, `InputGroupTextarea > value`, `.InputGroupExampleIcon > Vector` |
| InputGroup | `muted` | `InputGroupAddon > Vector` (icon), `InputGroupText > "https://"` |
| Select | `ink` | `SelectTrigger > value "{Value}"` **and** `SelectTrigger > value "{Placeholder}"`, `SelectItem > label` + `Vector`, `SelectContent > label` + `Vector`, `SelectGroup > label` + `Vector` |
| Select | `muted` | `SelectTrigger > Vector` (chevron), `SelectContent > Vector`, `SelectGroup > label` |
| Field | `ink` / `muted` / `input-ink-placeholder` | `{Label}` / `{Field Description}` / `placeholder` |
| Label, FieldLegend | `ink` | the single `{Label}` / `{Legend}` text layer |

## Findings, ranked

### Blocking

**1. Input `ink` = "file-picker label" is not what the set paints.**
The Input set binds `ink` on exactly one node, the `value` TEXT layer. There is no file-picker anatomy
in Figma at all — the entry's own API block says *"type — default 'text'; file switches to the picker
anatomy, not drawn in Figma"*. The role was derived from the code class `file:text-ink` in
`input.tsx`, not from the set, which inverts rule 1 (truth = the component set). It also contradicts
the printed `use` line for `input-fill`: *"Pairs with ink for the value"*. A reader of the column
learns nothing about the value text and is pointed at a state Figma never shows.
Proposed role: **`entered value text`** — delimited from `input-ink-placeholder` ("placeholder text")
and true of the one node that carries the binding.

**2. Select needs an `open` line for the placeholder colour.**
The worker flagged this himself (notes item 10) and decided against it. I would add it. Both coincident
TEXT layers in `SelectTrigger` — the value one and the placeholder one — bind `ink`. The entry's own
`deviations` block specifies the trigger as an Input clone including *"placeholder
text-input-ink-placeholder"*, and the code does exactly that
(`data-placeholder:text-input-ink-placeholder`). So the set contradicts its own documented spec: Figma
*could* bind `input-ink-placeholder` on the placeholder layer and instead binds `ink`. The existing
`figma_mechanics` note documents the double-text *construction* and the `filles` typo; it says nothing
about the token, so it does not cover this. `code_only_tokens` stays correct either way (no chip — the
set does not bind the token), but rule 6 asks for the `open` line on top when the set could bind it and
binds something else.
Proposed `open` entry: *"SelectTrigger's placeholder TEXT layer binds `ink`, not
`input-ink-placeholder` — contradicts the trigger's own Input-parity deviation; rebind when the set is
next touched."*

### Should fix

**3. InputGroup `ink` = "entered text" is narrower than the binding.** The set also paints
`InputGroupButton`'s label and its icon with `ink`, and both live inside the section (own binding, not
a member hop). Proposed: **`entered text + addon button label`**.

**4. Select `ink` = "value text" is narrower than the binding.** The set paints item labels, the group
heading rows and the content labels with `ink` too — the list is the larger half of the component.
Proposed: **`trigger value + item label`**.

**5. Select `muted` = "label / chevron" is ambiguous.** Three chips in this section carry the word
"label" (`accent-ink` "item highlight label", `muted` "label / chevron", plus `ink` "value text"), and
a reader cannot tell which label `muted` means. The binding is the group heading plus the chevron
glyph. Proposed: **`group heading + chevron icon`** — uses the shared vocabulary ("icon" for glyphs).

**6. InputGroup `muted` = "addon / text label" reads as two kinds of label.** The binding is the addon
icon and the addon's static prefix text. Proposed: **`addon icon + prefix text`**.

**7. Two eyebrow counts are now stale** (controller item, not the worker's — the brief says leave the
eyebrow instance alone). `InputGroup` reads "Tokens · 16 vars · 2 styles" against 13 own vars;
`Select` reads "3 styles" against 2. The other five are correct (Input 9/1, Textarea 8/1, Label 2/1,
Field 10/2, FieldLegend 1/2). The gate does not check the eyebrow, so this survives a green run.

### Nits

**8. Select `input-fill` = "trigger resting fill"** uses "fill" where the shared vocabulary says a
container fill is a "surface" (the sibling sections all say "surface"). Proposed: *trigger resting
surface*.

**9. Field `space-xl` `code` field is slightly incomplete** — it names `gap-xl (FieldSet)` and
`ml-xl (FieldError bullet list)`, but `fieldGroupVariants` (FieldGroup, `field.tsx:57`) also uses
`gap-xl`. The `why` is unaffected.

**10. The T2-figma-only WARNs are only partly discussed in the notes.** Judgement call 1 covers the
`ink` WARNs. The InputGroup `corner-md` / `space-xs` and the four Field `input-*` WARNs are not
mentioned; the decision table asks the worker to say in the notes why each such chip stays.

**11. The notes' denylist claim is overstated.** They report a pre-existing file-level hit from
the denylist words. Running the word-level grep, the single hit in `design-docs` is line 39,
the `## Rules` sentence naming a legacy repo — the one the controller already fixed on master. Nothing
else matches.

## Verified without finding

- **Every removal is correct.** InputGroup `muted-ink` appears in neither `vars` nor `mvars` — a truly
  dead chip. InputGroup `muted-fill` and `destructive-ink` are in `mvars` with `msrc` = `.Button/Base`,
  `Button` — member-only, criterion rule 3. Select `text:Body` is in neither `styles` nor `mstyles`.
- **Field's 8 sibling-export rows are honest.** Each `code` field names the paint-owning export in
  parentheses — `FieldLabel` for `accent-border` / `accent-fill`, `FieldTitle` for `accent-ink`,
  `FieldSet` for `space-lg` / `space-xl`, `FieldSeparator` for `surface`, `FieldLegend` for `space-sm`
  / `text:Title` — and I confirmed each class in `field.tsx` (lines 19, 41, 57, 145-164, 207, 242). The
  `why` on each says why Field's own row-only set has no counterpart: the checked-choice-card look
  belongs to ChoiceCard, and the rest belongs to siblings that have their own doc sections. The union
  comes from `code.exports` bundling the whole `field.tsx` family, which is a correct fact about the
  entry, not a gate bug.
- **All 17 `code_only_tokens` rows check out against source.** `selection:bg-primary-fill` /
  `selection:text-primary-ink` in `input.tsx` and `textarea.tsx`; `has-[>[data-align=block-start]]:
  [&>input]:pb-lg` / `pt-lg` in `input-group.tsx:29`; `text-dialog-ink` (`select.tsx:127`),
  `data-placeholder:text-input-ink-placeholder` (`:87`), `pr-3xl` (`:176`); `mb-sm`
  (`field.tsx:41`).
- **`effect:Elevation` = "dropdown elevation"** matches both the `use` sentence and `shadow-elevation`
  on `SelectContent`.
- **Denylist**: `git grep -inE` over `design-docs` in the worktree returns one line, the accepted
  legacy-repo-name mention in `## Rules`.

## Verdict

| Section | verdict |
|---|---|
| Input | fix first (finding 1) |
| Textarea | accept |
| InputGroup | accept with fixes (3, 6, 7) |
| Select | fix first (finding 2), plus 4, 5, 7, 8 |
| Label | accept |
| Field | accept |
| FieldLegend | accept |

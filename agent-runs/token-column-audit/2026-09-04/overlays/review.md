# Review — token-column audit, package `overlays` (Dialog, Command, Popover, Tooltip)

Independent reviewer. Nothing was edited: no Figma writes, no catalog writes, no delta writes.

Worker output under review: branch `tok/overlays` (agentport, worktree `~/Dev/agentport-tok-overlays`,
commit `c801f1c`), delta `overlays/roles-delta.json`, notes `overlays/notes.md`.

## Method

Own fresh dump (`figma-dump.js` verbatim, `ONLY = ['Dialog','Command','Popover','Tooltip']`, file
`nQSNLASjuLvgTh3we8Dp4s`, page `Components`) → `/tmp/figma-review-overlays.json`. Worker's delta merged
into `/tmp/overrides-review-overlays.json`, worker's branch catalog into `/tmp/cat-overlays.md`.

```
python3 check.py --only Dialog,Command,Popover,Tooltip \
  --figma /tmp/figma-review-overlays.json \
  --overrides /tmp/overrides-review-overlays.json \
  --catalog /tmp/cat-overlays.md
```

Gate summary (my dump, my run):

```
T0-code-export 4/0/0 · T0-column 4/0/0 · T0-unroled-frame 4/0/0
T1-dead 80/0/0 · T1-duplicate 4/0/0 · T1-missing 80/0/0 · T1-off-collection 0/0/25
T2-code-missing 54/0/0 · T2-figma-only 0/0/28 · T2-stale-divergence 2/0/0
T3-canonical 80/0/0
T4-bare-roled 36/0/0 · T4-dead-role 44/0/0 · T4-role-empty 44/0/0 · T4-role-source 44/0/0
T4-role-text 44/0/0 · T4-showRole 80/0/0 · T4-unroled-frame 36/0/0
T5-component-name 44/0/0 · T5-group-word 44/0/0 · T5-one-sentence 44/0/0
T6-pair 9/0/0 · T7-word-ban 28/0/0 · T8-bare-family 36/0/0 · T8-member-token 80/0/0
ALL PASS   (exit 0)
```

Reproduced independently: **0 FAIL, 53 WARN, 869 PASS**. The 25 `T1-off-collection` WARN are the
expected `Effect/elevation/*` and `Effect/glow/*` primitive bindings behind the two Effect Styles.

## Result table

| Section | check.py | opinion findings | screenshot |
|---|---|---|---|
| Dialog  | ALL PASS | 1 should-fix (`muted-fill` "tint"), 2 nits (`border` incomplete, `scrim` wording) | ok |
| Command | ALL PASS | 2 should-fix (`border` role, `accent-fill` "fill"), 2 nits (`card-fill`, `primary`) | ok |
| Popover | ALL PASS | 1 nit (`dialog-ink` "panel text") | ok |
| Tooltip | ALL PASS | 1 nit ("chip" reused in two senses across the package) | ok |

Screenshots: all four `meta well` frames render clean — rows readable, `unroled` wraps on one line
(Command on two), no clipping, `clipsContent=true` with content well inside. Vertical clearance to the
next block (`variants plate (shelf)`): Dialog 36 px, Command 36 px. Tooltip and Popover meta wells sit
inside their doc frame with 651 px / 2014 px of headroom. No re-pack needed.

## Catalog cross-check

`figma.vars` and `figma.styles` on `tok/overlays` are **set-identical** to my fresh dump's own
`vars` / `styles` for all four sections. No stale or invented entry.

`code_only_tokens` (Command, 2 rows) — both confirmed against
`~/Dev/agentport/libs/ui/src/components/ui/command/command.tsx`:

| token | code | verdict |
|---|---|---|
| `dialog-ink` | `text-dialog-ink` | **confirmed.** `commandVariants` line 28 sets it on the root wrapper. My dump's Command `vars` contains `dialog-fill` but not `dialog-ink` — no node in the set binds it. The `why` is accurate. |
| `text:Eyebrow` | `text-format-eyebrow` | **confirmed.** Applied on `[cmdk-group-heading]` in both variants (lines 257, 258) and on the shortcut span (line 294). My dump's Command `styles` has no `text:Eyebrow`. The `why` is accurate. |

## Removals — verified against my own dump

Every removal checks out; none of the removed tokens is an own binding.

| Section | removed | evidence in my dump |
|---|---|---|
| Tooltip | `ink`, `space-xs` | in `mvars` (member-only, `msrc` = Button) |
| Tooltip | `corner-sm`, `text:Kbd` | in neither `vars`/`styles` nor `mvars`/`mstyles` — not bound at all |
| Popover | `ink`, `space-xs` | in `mvars` |
| Popover | `input-border`, `input-fill`, `input-ink-placeholder` | not bound anywhere in the Popover set |
| Dialog | `surface` | in `mvars` |
| Dialog | `space-lg` | not bound |
| Command | `text:Eyebrow` | not in `styles`; correctly re-homed as a `code_only_tokens` row |

`scrim-opacity` (Dialog) is present as a roled row with the role **"overlay layer opacity"** — confirmed,
bound own on `DialogOverlay`.

---

## SPECIAL TASK — provenance table

Method: read-only walk of each section's own component roots. For every node I recorded the path from
the root and whether the walk had already crossed an `INSTANCE` whose main component lives **outside**
the section. `own` = the binding sits on a node the section itself owns. `via-member(<name>)` = every
binding of that token sits inside a nested instance of a foreign component.

### Tooltip (roots: `Tooltip`, `Tooltip Root`)

| token | role text | bound on | verdict |
|---|---|---|---|
| `dialog-fill` | chip surface + arrow fill | `Tooltip/side=right` · `…/Tooltip/arrow/Vector` | own |
| `dialog-ink` | chip label | `Tooltip/side=right/content/label` | own |
| `border` | chip border + arrow stroke | `Tooltip/side=right` · `…/arrow/Vector` | own |
| `effect:Elevation` | chip drop shadow | `Tooltip/side=right` | own |
| `muted-fill` | trigger hover surface | `Tooltip Root/state=closed, side=right/trigger/Button/.Button/Base/state-layer` | **via-member(Button)** |
| `primary-fill` | trigger surface | `Tooltip Root/state=closed, side=right/trigger/Button/.Button/Base` | **via-member(Button)** |
| `primary-ink` | trigger label | `…/trigger/Button/.Button/Base/{Label}` | **via-member(Button)** |

### Popover (roots: `PopoverContent`, `PopoverHeader`, `Popover`)

| token | role text | bound on | verdict |
|---|---|---|---|
| `dialog-fill` | panel surface | `Popover/state=closed, side=left, align=end/Panel Position/PopoverContent` | own |
| `dialog-ink` | panel text | `PopoverHeader/title` | own |
| `border` | panel border | `…/Panel Position/PopoverContent` | own |
| `muted` | description text | `PopoverHeader/description` | own |
| `effect:Elevation` | panel drop shadow | `…/Panel Position/PopoverContent` | own |
| `muted-fill` | trigger hover surface | `Popover/state=closed, …/trigger/Button/.Button/Base/state-layer` | **via-member(Button)** |
| `primary-fill` | trigger surface | `…/trigger/Button/.Button/Base` | **via-member(Button)** |
| `primary-ink` | trigger label | `…/trigger/Button/.Button/Base/{Label}` | **via-member(Button)** |

### Dialog (roots: `Dialog`, `DialogOverlay`, `DialogFooter`, `.Dialog/Icon/Close`)

| token | role text | bound on | verdict |
|---|---|---|---|
| `dialog-fill` | panel surface | `Dialog` | own |
| `dialog-ink` | panel text | `Dialog/content/header/title` | own |
| `border` | panel border | `Dialog` **and** `DialogFooter` | own |
| `scrim` | overlay fill | `DialogOverlay` | own |
| `scrim-opacity` | overlay layer opacity | `DialogOverlay` | own |
| `muted` | description text | `Dialog/content/header/description` | own |
| `muted-fill` | footer band tint | `DialogFooter` (own) **+** `DialogFooter/actions/Button/.Button/Base/state-layer` | own (dual — own wins, correct) |
| `ink` | close icon | `.Dialog/Icon/Close/Vector` (own) **+** `Dialog/close/.Button/Base/.Button Icon/Vector` | own (dual — own wins, correct) |
| `effect:Elevation` | panel drop shadow | `Dialog` | own |
| `primary-fill` | primary action surface | `DialogFooter/actions/Button/.Button/Base` | **via-member(Button)** |
| `primary-ink` | primary action label | `DialogFooter/actions/Button/.Button/Base/{Label}` | **via-member(Button)** |
| `secondary-fill` | secondary action surface | `DialogFooter/actions/Button/.Button/Base` (+ `state-layer`) | **via-member(Button)** |
| `secondary-ink` | secondary action label | `DialogFooter/actions/Button/.Button/Base/{Label}` | **via-member(Button)** |

Note: the worker's notes list Dialog `ink` as reached only through a member. That is **wrong** — `ink`
is bound directly on the section-owned `.Dialog/Icon/Close` component. The outcome (keep it roled) is
right, the stated reason is not.

### Command (roots: `Command`, `CommandInput`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandGroup/CommandEmpty`, 11 × `.Command/Icon/*`)

| token | role text | bound on | verdict |
|---|---|---|---|
| `dialog-fill` | panel surface | `Command/variant=palette` · `Command/variant=default` | own |
| `border` | panel border (palette 1.5px) | `CommandSeparator/variant=labeled/grp-line` · `CommandSeparator/variant=default` · `Command` | own |
| `accent-fill` | selected item fill | `CommandItem/state=selected` | own |
| `accent-ink` | selected item label | `CommandItem/state=selected/label` · `…/shortcut` | own |
| `muted` | group heading + quiet text | `CommandGroup/CommandEmpty/message` · `CommandSeparator/variant=labeled/label` (own) **+** InputGroup | own (dual — own wins, correct) |
| `card-fill` | palette prompt row | `CommandInput/variant=palette` | own |
| `primary` | palette caret bar | `CommandInput/variant=palette/palette-caret` | own |
| `ink` | search text + item label and icon | `.Command/Icon/*/Vector` and item labels (49 bindings) | own |
| `surface` | icon frame surface | `.Command/Icon/Download`, `.Command/Icon/Play`, … | own |
| `input-ink-placeholder` | search placeholder | `CommandInput/variant=palette/Frame 1/placeholder` (own) **+** `CommandInput/variant=default/inputgroup/content/placeholder` | own (dual — own wins, correct) |
| `effect:Elevation` | panel drop shadow | `Command/variant=palette` · `Command/variant=default` | own |
| `effect:Glow` | palette caret bar glow | `CommandInput/variant=palette/palette-caret` | own |
| `input-fill` | search field surface | `CommandInput/variant=default/inputgroup` | **via-member(InputGroup)** |
| `input-border` | search field border | `CommandInput/variant=default/inputgroup` | **via-member(InputGroup)** |
| `inverse-fill` | esc key chip surface | `CommandInput/variant=palette/Kbd` | **via-member(Kbd)** |
| `inverse-ink` | esc key chip label | `CommandInput/variant=palette/Kbd/{Label}` | **via-member(Kbd)** |

### Summary

**14 of the 44 roled tokens in this package are painted exclusively by a nested foreign instance** and
are nonetheless classified `own` by the dump: Tooltip 3, Popover 3, Dialog 4, Command 4.

**Why the dump says `own`.** `figma-dump.js` walks each root with `node.findAll(() => true)` under
`member=false`. That traversal does not stop at instance boundaries, so every descendant *inside* a
nested Button / InputGroup / Kbd instance is credited to the section's own walk. The separate
`member=true` hop into the foreign main component marks the same variable ids as `member`, but the
tie-break `mvars = mvars \ vars` then drops them back into `vars`.

**Why some Button tokens still land in `mvars`.** The split is decided by *which Button variant is
instantiated*. The trigger in Tooltip and Popover is the default (primary) Button, so
`primary-fill` / `primary-ink` / `muted-fill` are reached inside the section subtree and become `own`,
while `ink` / `surface` / `space-xs` — painted only by the outline / ghost variants — are reached only
through the foreign set walk and stay `mvars`. **The own/member split for the overlays is therefore an
artefact of variant choice, not a property of the design system.** Tooltip removing `ink` (via Button)
while keeping `primary-fill` (also via Button) is the same provenance class treated two opposite ways.

**Independent corroboration from the code side.** All 14 via-member tokens also raise
`T2-figma-only` — the section's own exports contain no DS utility for them, because the code that
paints them lives in `button.tsx` / `input-group.tsx` / `kbd.tsx`. The two checks agree.

**Consequence if criterion rule 3 were applied to the real provenance:** 14 roled rows would leave the
columns (Tooltip 7→4, Popover 8→5, Dialog 13→9, Command 16→12) and the corresponding
`figma.vars` entries would shrink in all four catalog entries.

This is a controller decision about the rule and the dump, **not a worker defect**. The brief states the
tie-break is settled and not to be re-derived, and the worker followed it, said so explicitly in the
notes, and flagged the dump limitation. The gate cannot go green any other way today: removing the rows
trades `T8-bare-family` for `T1-missing`, because `T1-missing` reads `vars` literally.

---

## Findings, ranked

### Blocking

**B1 — `figma-dump.js` credits nested foreign-instance bindings to the section's own walk.**
14 roled tokens in this package (see the provenance table) are painted only by a nested Button,
InputGroup or Kbd, yet the dump reports them as own bindings. Which of a member's tokens land in `vars`
versus `mvars` depends on which variant of the member happens to be instantiated, so the boundary the
`unroled` criterion rule 3 draws is not actually being drawn. Blocking as a **rule / gate decision for
the controller**, not as a change the worker should make. Fix belongs in the dump: stop the `member=false`
traversal at an instance whose main component lives outside the section, and let the foreign hop be the
only source for those tokens. Re-running the round for `overlays` afterwards is cheap — the delta is
14 row removals and 14 `figma.vars` entries.

### Should fix

**S1 — Command `border`: "panel border (palette 1.5px)".** The role names the panel edge and a stroke
width, but by binding count the token is overwhelmingly the **separator line** (`CommandSeparator`
default and labeled, plus the `Command` panel). A reader cannot tell from the role that the group
dividers are this token. The parenthetical is a geometry note, not a role.
Proposed: **`panel border + separator line`**.

**S2 — Command `accent-fill`: "selected item fill".** The shared vocabulary fixes container fill =
"surface"; "fill" is not in the list and reads as a second family next to `dialog-fill` / `muted-fill`,
whose roles both say "surface".
Proposed: **`selected item surface`** (pairs cleanly with `accent-ink` = "selected item label").

**S3 — Dialog `muted-fill`: "footer band tint".** "tint" is the vocabulary of `accent-fill` (its `use`
sentence literally begins "Tint that marks state"), while `muted-fill`'s own `use` says "Low-emphasis
surface". Using "tint" here blurs the two.
Proposed: **`footer band surface`**.

### Nits

**N1 — Command `card-fill`: "palette prompt row".** Names the region but no vocabulary noun, unlike
every other surface role in the section. Proposed: **`palette prompt row surface`**.

**N2 — Dialog `border`: "panel border".** The token is bound on `Dialog` *and* on `DialogFooter` (the
footer's top rule). The role mentions only the panel. Proposed: **`panel + footer border`**.

**N3 — Dialog `scrim`: "overlay fill".** Its `use` sentence calls it "the backdrop that dims the page".
Echoing the source would delimit it more sharply from `scrim-opacity` ("overlay layer opacity"), which
correctly keeps "overlay layer". Proposed: **`backdrop fill`**.

**N4 — Popover / Dialog `dialog-ink`: "panel text".** In both sections the only binding is the header
*title* node, not body text. "panel text" is broad enough to collide conceptually with `muted` =
"description text". Proposed: **`panel title text`** in both.

**N5 — "chip" carries two senses inside one package.** Tooltip uses it for the tooltip bubble
(`dialog-fill` = "chip surface", `dialog-ink` = "chip label", `border` = "chip border + arrow stroke"),
Command uses it for the keyboard badge (`inverse-fill` = "esc key chip surface"). Both are legal per
section and Tooltip's usage matches the catalog's own prose ("Tooltip is a LIGHT raised chip"), so this
is only a cross-section readability nit. No change proposed.

**N6 — Command `primary`: "palette caret bar".** The token is a shape fill; the role names the shape
but not what it paints. `effect:Glow` next to it says "palette caret bar glow", so the two are
delimited. Proposed if touched anyway: **`palette caret bar fill`**.

**N7 — 28 `T2-figma-only` WARN not walked in the notes.** The decision table asks the worker to read
each one and say in the notes why the chip stays. The notes argue the tie-break generally but do not go
through the list. 14 of the 28 are the via-member tokens of finding B1, so reading them would have
surfaced the same evidence from the code side.

**N8 — notes inaccuracy.** The judgement-calls section lists Dialog `ink` among the tokens
"structurally reached ONLY through a nested member instance". It is bound directly on the
section-owned `.Dialog/Icon/Close` component. The decision is right, the reason is not.

### Not findings

- Denylist on `tok/overlays`: exactly one hit,
  `design-docs/design-system/components-reference.md:39` in `## Rules` ("`tools/token-audit/check.py`,
  the legacy repo"). That is the acceptable line named in the brief. Nothing else.
- `T1-off-collection` (25 WARN): expected `Effect/elevation/*` + `Effect/glow/*` primitive bindings.
- `T6-pair`: 9 PASS, no ink without its fill anywhere in the package.
- Command `muted` rewritten from "group heading + secondary text" to "group heading + quiet text":
  correct resolution of the `T5-group-word` failure, and it matches the `use` sentence.

## Verdict

| Section | verdict |
|---|---|
| Dialog  | accept (S3 + N2 + N3 recommended) |
| Command | accept (S1 + S2 recommended) |
| Popover | accept (N4 recommended) |
| Tooltip | accept |

All four sections are green on an independently produced dump, the catalog matches the live file, both
divergence rows are confirmed in the source, every removal is justified, and the screenshots are clean.
The role texts are speaking and delimited; the three should-fix items are vocabulary drift, not errors of
fact. Finding **B1** is escalated to the controller as a rule/gate question — it does not block accepting
this worker's output, but it does mean the overlays columns are 14 rows wider than criterion rule 3
intends.

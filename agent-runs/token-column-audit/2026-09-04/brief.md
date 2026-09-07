# Brief — Token column audit (all 25 doc sections)

Figma file `nQSNLASjuLvgTh3we8Dp4s`, page `Components`. Catalog `~/Dev/agentport/design-docs/design-system/components-reference.md`,
token reference `~/Dev/agentport/design-docs/design-system/tokens-reference.md` (read its `## Rules` first).
Goal + decisions: `agent-runs/token-column-audit/2026-09-04/goal.md`. Work list + reading of every failure class:
`tools/token-audit/baseline.md`. Read all three before touching anything.

Tools live in `tools/token-audit/`: `check.py` (the gate), `token_rules.py`, `extract-code.mjs`, `figma-dump.js`
(read-only use_figma script), `merge-overrides.py`, `dumps/code.json` (fresh code extract — the code is NOT changed by this work).
**The gate is shared and read-only for workers.** Never edit `check.py`, `token_rules.py`, the extractors, `figma-dump.js`,
`merge-overrides.py`. If the gate seems wrong, write it into your notes as "blocked" and move on. (Lesson from the API round.)

## Goal
Every doc section's token column (`meta well` → frame `tokens`) shows exactly the tokens the section's **component set** binds,
each colour / effect / opacity token with a short, speaking role, scale tokens (`space-*`, `corner-*`, `text:*`) bare in `unroled`.
Green = `check.py` ALL PASS for your sections, with a fresh Figma dump.

## The rules (all user decisions, 2026-09-04 — not up for debate)
1. **Truth set = the component set**, not the section. Tokens that live only in usage examples (label text, group gaps) are not chips.
2. **`unroled` criterion** (`doc-overrides.json` → `_fields.unroled`): (1) only `space-*` / `corner-*` / `text:*` may be bare;
   (2) every colour / effect / opacity token the set binds gets a role — or is not a chip; (3) tokens that reach the set only
   through a nested member instance of another DS component (the Buttons inside Dialog) are not chips here — the member's own
   section documents them; (4) truth = set; (5) `unroled` may be empty or absent.
3. **Provenance boundary (user decision 2026-09-04, second round — supersedes the earlier "own binding wins" tie-break).** The dump
   walk STOPS at a nested instance of a foreign component: everything under that instance, including the variant as placed, is the
   member's. `vars`/`styles` = own, `mvars`/`mstyles` = member-only, `mby` = the chain each member token came through
   (`Field>Checkbox`). The one editorial exception is `<Section>.ownMembers` in `doc-overrides.json`: nested components that are part
   of THIS component's anatomy — their tokens count as own and get roles. Today only ChoiceCard lists members (Checkbox, Switch,
   RadioGroupItem). Nobody else adds an `ownMembers` list in this round; if you think a section needs one, say so in notes.md as a
   question and treat the tokens as member meanwhile. Consequences: Tooltip / Popover / Dialog lose the Button tokens, FieldSet /
   FieldGroup / RadioGroup lose the nested Field tokens, ChoiceCard keeps its control tokens but loses the Field label text.
4. **`T1-dead` = mostly chip removals**, not additions. A chip whose token the set does not bind leaves the column; you never add
   a binding to a set to rescue a chip.
5. **Figma writes only to chips / rows inside `meta well > tokens` of YOUR sections.** Never the component sets, never `Doc/*`
   components, never other sections, never detach, never move things out of the meta well.
6. **Documented divergence** (`figma.code_only_tokens`, catalog): a token the code paints via a DS utility but the set does not
   bind (hover / selection / focus state Figma does not draw, or a raw value the set still carries, e.g. Button's raw `#4a5562`
   focus) is NO chip; it goes into the catalog entry as `figma.code_only_tokens: [{ token, code: "<utility>", why: "…" }]`.
   `why` must come from the source (read the `.tsx`) — what state the utility paints and why Figma has no bound counterpart.
   A set defect (Figma could bind it, but binds raw / wrong) additionally stays or goes into `open`. The gate fails a stale row.
7. `scrim-opacity` (Dialog) is the one non-colour / non-scale chip; it keeps its role ("overlay layer opacity").

## Role text rules (question 2 of the goal — the reviewer judges these, the gate only checks the form)
- One short phrase per token, the component-specific concretisation of the generic `use` sentence the gate prints as
  `INFO … use <token>: role "…" || use "…"`. Read that line for every roled token; the role must not contradict the `use`.
- Unambiguous and delimited from the neighbouring tokens of the same section: two tokens never get the same role text; a reader must
  be able to tell from the role alone which token paints what.
- No component name (`T5-component-name`), group words (primary / secondary / accent / brand / muted / inverse) never as an adjective
  for a token outside that group (`T5-group-word`) — say "quiet text" not "secondary text" for `muted`.
- Per-token word bans in `token_rules.py` (`T7`) — read the `why` there when one fires.
- Shared vocabulary (use these words, not synonyms): container fill = "surface" (`resting surface`, `checked surface`, `panel surface`);
  text/icon = "label" for control text, "text" for content, "icon" for glyphs; edge = "border"; focus = "focus border" / "focus ring";
  the -ink of a -fill = "<state> label" / "text on <state> surface". Do not invent new families ("box fill", "chrome").
- Pair rule (`T6`): an `<x>-ink` chip needs `<x>-fill` bound in the set. If the set binds an ink without its fill, that is a Figma set
  defect — do not hide it; record it in notes as blocked + catalog `open`, leave the FAIL.

## Figma column model (what you edit)
- `meta well > tokens`: first child is the `eyebrow` instance (leave it). Roled rows are `Doc/Token-Chip` instances named
  `token row` (`showRole=true`, props `token#8074:0`, `role#8074:1`), usually inside a nested frame `Token List`; bare chips are
  instances named `chip` (`showRole=false`) inside the wrap frame `unroled`. Component set `Doc/Token-Chip` = `8074:2898`.
- Order: roled rows in the key order of the section's `roles` object (that is how the builder renders them) — write the roles in
  display order and reorder the Figma rows to match. Bare chips: `corner-*` → `space-*` → `text:*`, each ascending
  `2xs xs sm md lg xl 2xl 3xl full`.
- Add a roled row: `clone()` an existing `token row` of the same section, `setProperties`, `insertChild` at the right index of
  `Token List` (or `tokens` if there is no `Token List`). Bare: clone an existing `chip` into `unroled`. If `unroled` is missing and
  you need one: horizontal auto-layout frame, `layoutWrap='WRAP'`, no fill, `layoutSizingHorizontal='FILL'`, vertical HUG,
  `itemSpacing` + `counterAxisSpacing` bound to the `space-sm` variable (see `build-section.snippet.js` PHASE `tokens`).
- Remove: `node.remove()`. Move bare → roled: remove the chip, add a row. Read back (dump) after each batch of writes.
- ≤ 10 operations per use_figma call, re-fetch nodes by id per call (`figma.getNodeByIdAsync`), `setCurrentPageAsync('Components')`
  once per call. Other workers write to other sections of the same file concurrently — touch only yours.

## Decision table (per gate line)
| Gate line | What to do |
|---|---|
| `T1-dead` chip X not bound | remove chip X (and its role from the delta) |
| `T8-member-token` chip X only via member | remove chip X; notes: "documented in <member> section" |
| `T8-bare-family` colour/effect bare | set binds it → write a role, make it a `token row`; set does not bind it → remove |
| `T1-missing` bound X has no chip | colour/effect → roled row with role; scale → bare chip |
| `T2-code-missing` code uses X | set binds X → chip (see above); else → `code_only_tokens` row in the catalog, `why` from the `.tsx` |
| `T2-stale-divergence` | fix or drop the `code_only_tokens` row |
| `T5-*` / `T7-*` | rewrite the role |
| `T6-pair` | see Pair rule; usually a T1-dead ink to remove — if the set really binds the ink alone, blocked + `open` |
| `T2-figma-only` WARN | read it, decide, say in notes why the chip stays (bound in Figma, no 1:1 utility is normal for space/effect) |
| `T1-off-collection` WARN | expected for Effect primitives; nothing to do |

## Procedure (worker)
1. `git -C ~/Dev/agentport worktree add ~/Dev/agentport-tok-<pkg> -b tok/<pkg> master` — edit the catalog ONLY there. Do not create
   a tooling worktree; tooling writes go to your package folder only (step 5).
2. Dump your sections: run `figma-dump.js` via use_figma with `ONLY = [...]` (≤ 6 sections per call; 7 sections = two calls, merge the
   objects), save verbatim to `tools/token-audit/dumps/figma-<pkg>.json`. Baseline check:
   `cd tools/token-audit && python3 check.py --only <A,B,…> --figma dumps/figma-<pkg>.json --catalog ~/Dev/agentport-tok-<pkg>/design-docs/design-system/components-reference.md`
3. Per section, in this order: (a) decide every chip by the table — the dump tells you `vars`/`styles` (own), `mvars`/`mstyles`
   (member-only, `msrc` names the member); (b) write the final `roles` object (display order) into
   `agent-runs/token-column-audit/2026-09-04/<pkg>/roles-delta.json` as `{ "<Section>": { "roles": {…} } }` (full
   replacement per section, only `roles`, only your sections); (c) update the catalog entry in your worktree: `figma.vars` /
   `figma.styles` = exactly the set's own bound tokens (dump `vars` + `styles`, sorted as the entry already is), `code_only_tokens`
   where rule 6 applies, `open` where a set defect surfaced; (d) apply the Figma edits.
4. Re-dump, then run the gate with your merged overrides until ALL PASS:
   `python3 merge-overrides.py ../../agent-runs/token-column-audit/2026-09-04/<pkg>/roles-delta.json -o /tmp/overrides-<pkg>.json`
   `python3 check.py --only <A,B,…> --figma dumps/figma-<pkg>.json --overrides /tmp/overrides-<pkg>.json --catalog ~/Dev/agentport-tok-<pkg>/design-docs/design-system/components-reference.md`
   Gates in the worktree: the whole catalog parses (`yaml.safe_load` on every ```yaml block), denylist
   the neutrality grep against ~/Dev/agentport-tok-<pkg> (denylist kept outside the repo) prints nothing.
5. Screenshot each section's `meta well` (get_screenshot on the meta well node, or `await node.screenshot()`) into
   `agent-runs/token-column-audit/2026-09-04/<pkg>/screenshots/` — no clipping, rows readable, `unroled` wraps cleanly.
   If a meta well grew and now overlaps the next block, note it (the controller re-packs), do not re-layout the section yourself.
6. Commit once in the worktree: `docs(catalog): tok/<pkg> — figma.vars + code_only_tokens for <A, B, …>` — English, **no
   `Co-Authored-By`, no `Claude-Session` trailer** (repo convention). Write `<pkg>/notes.md`: table (section · chips before → after ·
   removed · roles rewritten · code_only_tokens · check result), judgement calls (every removal, every divergence, every role you
   rewrote and why), blocked items, open questions. Report branch name + notes path + delta path + final gate line.

Language English everywhere. Denylist words (origin product / company names) never. Do not push. Do not merge.
Worker model: Sonnet. Time box: if a section is blocked by a set defect or a gate question, write it down and continue with the next.

## Packages
| pkg | sections |
|---|---|
| forms-a | Input, Textarea, InputGroup, Select, Label, Field, FieldLegend |
| forms-b | FieldSet, FieldGroup, Checkbox, Switch, Slider, RadioGroup, ChoiceCard |
| actions | Button, Badge, Kbd |
| overlays | Dialog, Command, Popover, Tooltip |
| nav-data | Breadcrumb, Separator, Table, Item |

## Procedure (reviewer, after the worker)
Independent of the worker's files: re-run `figma-dump.js` yourself for the package's sections (fresh), run `check.py` against the
worker's branch catalog (`git -C ~/Dev/agentport show tok/<pkg>:design-docs/design-system/components-reference.md > /tmp/cat-<pkg>.md`)
and the worker's delta merged into a temp overrides. Then the non-mechanical part, reported as **opinion**: for every roled token read
the role against the INFO `use` line and the section's neighbours — is it speaking, delimited, in the shared vocabulary? For every
`code_only_tokens` row open the `.tsx` and confirm the `why`. For every removal check the dump that the token is really not an own
binding. Screenshot every meta well. Report a table: section · check.py result · opinion findings · screenshot ok. Never edit anything.

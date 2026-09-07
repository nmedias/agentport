# Brief — Doc-section API block audit (all 25 sections)

Figma file `nQSNLASjuLvgTh3we8Dp4s`, page `Components`. Catalog `~/Dev/agentport/design-docs/design-system/components-reference.md`.
Reference implementation (already done, ALL PASS): section **Input** `8173:3304`, catalog entry `- name: Input`. Read both first.
Tools live in `tools/api-audit/`: `extract-code.mjs` (code side), `figma-dump.js` (Figma side, read-only use_figma script),
`check.py` (the gate), `dumps/code.json` (fresh extract — code is not changed by this work).

## Goal
Every doc section's API block ("meta well" → frame `api`) states, for one component, **what you can set in Figma and what you set in code,
and how they correspond** — readable without opening the codebase. The catalog carries the same facts as structured data; the block is
derived from it. The block was previously generated from the variant axis only and showed neither Figma properties nor code props.

## Scope rule (decided 2026-09-03, overrides everything below that mentions members / `of`)
**Main component only.** `figma.api` lists the controls of the ONE Figma component named like the section (its set or standalone
component). `code.props` lists the props of the ONE export named like the entry. Member components (SelectItem, SelectTrigger,
InputGroupAddon, CommandItem, TableRow, Segment, RadioGroupItem, DialogContent …) are NOT documented in the API block — no `of` rows.
Only when the section-named Figma component has **zero** controls (e.g. `Select 4326:2477`) may the entry set
`figma.api_component: <MemberName>` to document that one member instead (state it in `note`); same for code with
`code.api_export` when the entry-named export has no documented props. The check enforces this (C1-main-only, C1-override).

## Catalog model (per entry)
```yaml
figma:
  api:   # ONE row per Figma control of the MAIN component (variants, text, boolean, slot) — see Scope rule
    - { name: <figma property name without #id>, kind: variant|text|boolean|slot, values: [...]   # variants only
        id: "<node:index>"   # text/boolean/slot only — variants carry no id
        code: <prop name> | live-state | none,
        triggers: { <value>: "<what produces it in code>" }   # required when code = live-state
        note: "..." }   # optional
code:
  props:   # every JSDoc'd member of the MAIN export's Props interface + its cva axes; plus curated a11y passthroughs — see Scope rule
    - { name: <prop>, type: <type text>, default: <default>   # default only when the JSDoc @default / cva defaultVariants says so
        figma: <api name> | "<api name>=<value>" | "<a> + <b>" | none,
        curated: true   # only for aria-* passthroughs hand-curated in the story argTypes (they are not interface members)
        note: "..." }
```
`code` semantics — the three cases, nothing else:
- **prop name** → the control maps to a prop of that name (write `"value / defaultValue"` when two props share the control).
- **`live-state`** → no prop; a runtime state of the element. `triggers` names what produces each value: `:focus-visible`, `disabled`,
  `aria-invalid`, `data-state=open`, `value / defaultValue set`, `:hover`, `:active`, "focus + invalid", … `filled` IS a live state.
- **`<Export>.<prop>`** → the control maps to a prop that lives on another export of the same module (e.g. Popover `side` →
  `PopoverContent.side`). Counts as mapped (no chip); the `code` sentence names the export. The check verifies the prop exists.
- **`none`** → nothing in code; a Figma drawing aid (e.g. `composition_state`, `thumbs`, example-only booleans like `showScrollUp`).
Slots / text / booleans that are composed in code through child components (ItemMedia, ItemTitle, TableCaption, DialogTitle …):
`code: children` + a `note` naming the child component. `children` needs no `code.props` row. `none` is reserved for controls with
no code counterpart at all.
Remove `figma.axis` and `figma.properties`, and any string-valued `figma.props`. Object-valued `figma.props`/`slots` that describe the
same controls are replaced by `api` rows too (keep `slots` only if it carries node ids not expressible in `api`; usually drop it).
Do NOT edit `## Rules`, `## Schema` or the changelog (done centrally). Do NOT touch other entries.

## Figma block model (frame `api` inside `meta well`)
- One `Doc/API-Row` instance (component `8059:2771`, props `property#8059:0`, `values#8059:2`, `code#8059:3`, `figmaOnly#8059:1`,
  `codeOnly#8582:0`) per row. Reuse the section's existing rows (setProperties), clone `8175:3369` (Input) for more, delete surplus.
  Keep the eyebrow instance first. Never detach, never edit Doc/* components.
- Sections **without** an `api` frame (Popover, Dialog, FieldSet): clone frame `8175:3361` (Input's api frame) into the section's
  `meta well` as **first** child (before `tokens`), set `layoutSizingHorizontal = 'FILL'`, then rebuild its rows.
- **property** label = api `name`. Merged rows join labels with ` + ` (Input: `value + filled`) — allowed only when the controls
  describe the same thing. Code-only rows: label = prop name.
- **values**: variants = catalog values joined with ` · ` in catalog order; text = `text`; boolean = `off / on`; slot = `slot`;
  code-only rows = the value set (`string`, `boolean`, `handler`, or the union members).
- **code**: a sentence a developer acts on. Mapped: `<prop>: <type> — <what it does>`. Live state: `no prop — live state: <value> = <trigger> · …`.
  None: `nothing in code — <why the control exists in Figma>`. Code-only: `<prop> — <what it does>[; default …]`. Never `—` alone,
  never the words FIGMA-ONLY / CODE-ONLY (the chips say it), never the template `pseudo-state (…)`.
- **chips**: `figmaOnly` on ⇔ every control in the row has `code` live-state or none. `codeOnly` on ⇔ the row is a code-only prop. Else both off.
- **eyebrow** (`label (children)#8056:2` on the eyebrow instance): `API · <N> Figma controls · <M> code-only props`, N = number of
  `figma.api` entries, M = number of `code.props` with `figma: none`. Singular `control`/`prop` when 1.
- Language English. Denylist words (origin product/company) never.

## Procedure (worker)
1. `git -C ~/Dev/agentport worktree add ~/Dev/agentport-api-<pkg> -b api/<pkg> master` — edit the catalog ONLY in that worktree.
2. Figma dump of your sections: run `figma-dump.js` via use_figma with `ONLY = [...your sections]`; save the returned JSON verbatim to
   `tools/api-audit/dumps/figma-<pkg>.json`. Read the code: the `.tsx` of each component (JSDoc interfaces, cva) and the
   story `argTypes` (curated aria-*). `dumps/code.json` is the machine view of the same source.
3. Write `figma.api` + `code.props` per entry. Then build the Figma rows. Small use_figma scripts (≤ 10 ops), re-fetch nodes by id per call,
   read back after each write. Other agents write to other sections of the same file concurrently — touch only your sections.
4. Re-dump your sections (fresh JSON) and run
   `python3 tools/api-audit/check.py --catalog <worktree>/design-docs/design-system/components-reference.md --code tools/api-audit/dumps/code.json --figma <your dump> --only <A,B,…> --stories-root ~/Dev/agentport/`
   until **ALL PASS**. Gates in the worktree: the whole file parses (`yaml.safe_load` on every ```yaml block + each entry), denylist
   the neutrality grep against <worktree> (denylist kept outside the repo) prints nothing.
5. Screenshot each section's `meta well` (get_screenshot, nodeId of the meta well frame) — no clipping, rows readable.
6. Commit once on your branch: `docs(catalog): <pkg> — figma.api + code.props for <A, B, …>`. Write
   `agent-runs/api-block-audit/2026-09-03/<pkg>/notes.md`: table (component · api rows · code-only · Figma rows · check result),
   judgement calls (what you classified as live-state/none and why), open questions. Report the branch name + notes path.

## Procedure (reviewer)
Independent of the worker's files: re-run `figma-dump.js` yourself (fresh), run `node tools/api-audit/extract-code.mjs ~/Dev/agentport > /tmp/code-review.json`
yourself, run `check.py` against the worker's branch catalog (`git -C ~/Dev/agentport show api/<pkg>:design-docs/design-system/components-reference.md > /tmp/cat-<pkg>.md`).
Then the non-mechanical part, reported separately as **opinion**: for every section, read each row's `code` sentence against the `.tsx`
source and say whether a developer could act on it without the codebase; flag any `none`/`live-state` classification that contradicts
the source. Screenshot every meta well. Report a table: component · check.py result · opinion findings · screenshot ok. Never edit anything.

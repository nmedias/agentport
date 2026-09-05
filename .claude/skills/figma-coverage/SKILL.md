---
name: figma-coverage
description: "Audit any UI artifact against an existing design system and report what it already covers and what it does not — an exhaustive part inventory, each part resolved to a component and to tokens by identity, then classified: mapped · mapped-but-needs-a-component-update · no component · missing primitive · missing composition. Trigger when the user hands over a screen, frame, section, node, mockup, code file or screenshot and asks which parts exist in the DS, what is missing, what would have to be built or extended, or wants a coverage / gap / mapping report before a build. Read-only: analyses, never builds. To build the artifact from the mapping, use /figma-compose."
argument-hint: Which UI artifact should be audited against the design system?
---

# Figma Coverage (UI artifact → DS coverage report)

Inventory every part of one UI artifact, resolve each to the design system, classify the gaps, emit the
report. **Read-only in the design tool and in the library** — the report is the only output. Building
the artifact from this mapping is the sibling skill `/figma-compose`.

## Inputs / Output

```
in   artifact  REQUIRED. What to audit — a design-tool node / frame / section, a code file or
               component, a rendered page, or a screenshot. Mixed inputs are fine.
     catalog   the machine-readable component catalog: what exists, where it lives, which controls
               each component declares, its documented deviations / forks / known gaps
     tokens    the machine-readable token + type-format reference: roles (when to use, when not),
               values, and the crosswalk to code
     library   the live component library — design-tool file + page, and/or the code package
     icons     the project's declared icon source (a package, a registry, an icon set)
     rules     the constraints a later build must run under. Default, unless the caller widens them:
               no new components, no new tokens, no overrides of token-backed values on instances
     out       report path. Default `agent-runs/<kind>/<YYYY-MM-DD>-<subject>/report.md`.
               Omitted and no default wanted → return the report, write nothing.
out  report    per §T7. Nothing else is created or modified, in any tool.
```

## Data Source

`catalog` + `tokens` are the **only** sources for what exists and what a token means. Never map from
recall of a component library, and never duplicate token or component names into this skill — it is
the procedure, they are the data.

## Process

```
T1  Frame       resolve inputs; read catalog + token reference BEFORE looking at the artifact
T2  Inventory   enumerate every part — completed BEFORE any mapping
T3  Resolve     per part: value→token, part→component, by identity — never by name
T4  Classify    each part into exactly one of A–E, via the decision test
T5  Abstract    name the D / E candidates by role; state the rule each composition carries
T6  Map         decompose the artifact into the subtrees a build would replace
T7  Report      the §T7 contract, in order, every section required
T8  Check       run the checks; each states a verdict and a number
```

---

### T1 — Frame

- Read `catalog` and `tokens` first. An audit written before them is recall, not an audit.
- Design-tool artifact → read its structure and its **live** bindings, not its rendered appearance.
- Code artifact → read the source; resolve imports to their modules.
- Screenshot-only artifact → say so in the report header; every resolution in T3 is then a candidate,
  not a fact, and the whole pass lands on the `Unverified` list unless a second source confirms it.
- Record `rules`. Every classification in T4 is relative to them.

### T2 — Inventory (before any mapping)

The inventory is the unit of work. A mapping-first pass silently drops whatever no component reminded
it of — the parts with no component are exactly the ones worth reporting.

- Walk the artifact and give **every visible part** an id, a name, one line of meaning ("what does this
  tell the user"), and its position.
- One row per part **kind**, with `×N` when it repeats. Never merge two kinds into one row.
- A part is anything a reader can point at: region · control · adornment · marker · rule · label ·
  glyph · state · brand device. Regions and lines that carry no content of their own count.
- Include the states the artifact **shows**, and record the states it does not.
- Stop descending when the next level is a component's internals.
- Group rows by zone so position is readable without coordinates; give each zone its own anchor.
- A zone identical to one already audited elsewhere is carried over **by reference** — name the prior
  report, say how identity was established, and count its parts here. Never re-word it, never drop it.

### T3 — Resolve (identity, never name)

- **Component identity** — resolve an instance to its **main component**; resolve an import to its
  module. Never infer identity from a layer name, a name substring, or an id namespace: variant members
  embed `prop=value` in their names, and an instance's sub-node ids only resemble the main's.
- **Token** — resolve every observed value (colour · type format · spacing · radius · effect) to a
  token **and cite the token's id**. An artifact drafted outside the system needs this value→token pass
  before any component mapping is meaningful.
- **Role check** — a value that resolves numerically but is used against the token's documented role is
  a **finding**, not a match (a line token used as text colour; a data-series token on a control track).
  A borderline use you checked and cleared is named as **checked and clear** — the same token can be
  on-role in one place and off-role in another; silence makes both read as violations.
- **Icons** — check glyphs against `icons`. A glyph with no counterpart there is a finding.
- **Snapshot vs. live** — a catalog is a snapshot and drifts. Where `library` is reachable, confirm the
  ids you cite against it. Where it is not, resolve from the catalog and put **the whole resolution
  pass** on the `Unverified` list as snapshot-based, naming what would confirm it.
- Anything unresolved goes on the `Unverified` list. Never fill a gap with a guess.

### T4 — Classify (exactly one home per part)

Run in order; first hit wins.

```
Does a component exist whose PURPOSE covers this part?
├─ no  → is it typography, a layout region, or a one-off mark?
│        ├─ yes → C   no component needed; author from tokens
│        └─ no  → is it one reusable element with no internal arrangement rule?
│                 ├─ yes → D   missing primitive
│                 └─ no  → E   missing composition
└─ yes → can the part be reproduced from that component's DECLARED CONTROLS ALONE, under `rules`?
         ├─ yes → A   mapped
         └─ no  → B   mapped, needs a component update
```

- **B is the point of the report.** Run the test, do not assume it. Drive the controls the part needs,
  or read the catalog for their existence. A look reachable only by overriding an instance is **B**.
- Purpose covers, not appearance: a component that merely *looks* close is not a match.
- C is not a gap. D and E are.
- One primary row per part. A part may feed a second category — cross-reference it, never duplicate it.
- **B rows carry the proposed change**, phrased as a control the component would gain — not as a fix
  to this artifact.

### T5 — Abstract the D / E candidates

Names must survive a different artifact in the same domain.

- Ask of each: *what is it · what does it do · is there a generic equivalent · what is its API*.
- Name by **role**. Never by the artifact's subject matter, and never by the layer names it happened to
  carry — an artifact that already uses good names is not evidence that you abstracted.
- Per **E**, state the **rule the arrangement carries**: the thing that would otherwise be re-invented,
  and got wrong, on the next screen. No such rule → it is layout, not a composition; drop it to C.
- A candidate that is really a primitive says so in its own row.
- Order D by what unblocks the most; note where a registry the project already uses ships an equivalent.

### T6 — Map the decomposition

One tree of the artifact: what a build would replace, node by node. It is the hand-off to the build
skill, and it is the coverage proof a part list cannot give — a list can be complete while the
structure has no home for half of it.

- One row per region / subtree, nested as the artifact nests. Not per part.
- **The root row is the artifact, every row under it is a future component.** The root becomes the
  frame name and may say what the artifact is; nothing below it may. That split is the whole reason a
  subtree name can outlive the screen it was read from.
- Each row: the artifact's own **anchor** (node id, or file + position) · the T5 name that would replace
  that subtree · what it resolves to (one instance · a composition candidate · authored parts).
- Every zone of T2 appears. A subtree with no candidate is a gap the report **states**, never omits.
- Name a subtree after what it would become, never after what it currently contains.
- These names become layer names in the build, so each is written **as an identifier**: the project's
  identifier language whatever the artifact's own language is, in its identifier form — no spaces, no
  prose, no subject matter. A grouped selectable list of records is `EntityList`; not
  `Selectable Record List`, and not the name of whatever records this artifact happens to list.

### T7 — Report (contract)

The report **is** these sections, in this order. Every one is required; an empty one says "none".

```
1  Header        artifact identity + anchors · provenance chain · target · date · rules honoured
2  Sources read  one row per source, and what it was used for
3  Inventory     the T2 table per zone: id · part · meaning · position · category · resolved-to
4  Categorisation   4.1–4.5, ONE section, each sub-heading in the full form below
5  Decomposition map  the T6 tree
6  Token evidence   values the artifact must bind itself, then values arriving through instances,
                    then the deliberate decisions worth a second opinion
7  Findings beyond coverage    role-violating tokens · undesigned states · glyph provenance ·
                    identifier language · product- or customer-specific content · bare-marker a11y
8  Not faithful under `rules`  intent · what the rules permit instead · the B row that forces it
9  Follow-ups     ordered by what unblocks the most
10 Checks         per T8: one line per check — verdict · number · evidence
11 Method + Unverified  which calls / files established coverage; what could not be confirmed
```

Sub-headings of §4 — each restates what the category claims, so a reader never re-derives it:

```
4.1  A — mapped to an existing component, reproducible from its declared controls (no change needed)
4.2  B — mapped, but the artifact needs something the component does not have
4.3  C — no component; authored from tokens (typography · layout region · one-off mark)
4.4  D — would be a new primitive that does not exist yet
4.5  E — would be a new composition that does not exist yet
```

- Every A / B row cites the component **id**; every token cites its **id**; every zone cites its anchor;
  every inventory row names its resolution **with** that id.
- §8 carries one row per look the `rules` force weaker, each pointing at the B row behind it. No B row
  behind it → it is an opinion, not a constraint; drop it.
- Close with one line: catalog and changelog stay untouched, and why.
- Write the report in the language of the target directory's existing run notes.

### T8 — Check

Each check is one line of §10: **verdict** (PASS · FLAG · n/a) · a **number or a named node set** ·
one clause of evidence. A check with neither is not a check.

- **Coverage** — parts inventoried = parts classified. Name any part not carried over.
- **Category integrity** — one primary category per part; the distribution, summed, equals the total.
  Name one cross-referenced part as the example of what a second category looks like.
- **B ran** — how many B rows were driven against the live library vs. read from the catalog. All-catalog
  is allowed only where `library` was unreachable — and then §11 says so.
- **Token resolution** — values resolved / values with no token at all. The second number is a finding
  in §7, never a footnote.
- **Structure** — every zone of T2 reaches §5; name any subtree without a candidate.
- **Abstraction** — no D / E name carries the artifact's subject matter.
- **Unverified** — non-empty unless every resolution was confirmed against a source.

## Red Flags

| Trap | Reality |
|---|---|
| Identify a component from a layer name, name substring, or an instance's sub-node id namespace | Variant members embed `prop=value`; sub-node ids only resemble the main's. Resolve the main component. |
| Map first, inventory later | The parts no component reminds you of are the report's whole value. Inventory is T2 for a reason. |
| File a part as "not covered" because the component lacks one state | The component covers it — that is **B**, and B is where the actionable work lives. |
| File a component extension under "risks" or "next steps" | Every finding has exactly one home. A scattered finding is an unfindable one. |
| Assume the mapping works because the component looks right | The mapping is a claim about controls under `rules`. Drive them or read the catalog. |
| Name a candidate after the screen you just read | Names outlive artifacts. Role, not subject matter. |
| Merge repeated parts into "all of the X" | One row per kind, `×N` for repeats. Merging is how parts vanish. |
| Resolve a value numerically and call it a match | A token has a role. Off-role use is a finding. |
| Leave an unresolved part out rather than on the `Unverified` list | An honest gap is usable; a silent one is not. |
| Spread A–E over top-level sections | They are one decision taken five ways. One section, five sub-headings — otherwise the distribution has no home. |
| Hand over a part list and call the structure self-evident | A complete list still fails at the decomposition. That map is T6, and it is what a build starts from. |
| Report a check as passed without a number | A verdict with no count and no node set is a feeling. |
| Build, fix or annotate the artifact "while you are in there" | Read-only. Building is `/figma-compose`. |

## Boundaries

- **Read-only** everywhere: design tool, library, artifact. The report is the only thing written.
- Diagnoses; does not design. Proposed changes are named and scoped, never implemented.
- Does not update the component catalog or changelog — nothing in the system changed.
- Not a visual or aesthetic critique, and not a structural build check (that is a pre-handoff check).

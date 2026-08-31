# Skill feedback — component-port (2026-06-26-table)

## A — gap caused a defect (priority)

### .claude/skills/shadcn-component-port/SKILL.md

**1 · Process / T2.5→T4 ordering — Figma recon started before story authoring**

| Field | Value |
|---|---|
| Why A | User had to interrupt to redirect — I had already begun T4 (read recon.js, `whoami` against the Plugin MCP) without having written **a single** T2.5 story. Cost = a prematurely pulled-forward recon step + user intervention. |
| Gap | SKILL T2.5 says "author … BEFORE Figma" — but only as a parenthesis in the process table. There is **no blocking checkpoint** between T2.5 and T4. The linear T list lets you slide from *collecting* the doc examples (T2.5 source, `get_item_examples`) straight into Figma recon without actually **writing** the stories + running them green. "Doc examples read" feels like "T2.5 done", but it is not. |
| Verified | — (caught by the user before any Figma write access happened). |
| Candidate fix | Add a hard gate sentence at the end of T2.5 in SKILL.md, generic: *"No Figma action — recon included — before the story file is written AND the gate is green."* Optionally mirror the same lock in `references/composites.md` §2 (T2.5/T2.6 transition), since composites push even more steps between story and build via T2.6/T2.7. |
| Status | open |

### .claude/skills/shadcn-component-port/references/composites.md (T2.7)

**4 · T2.7 composition ask — cell content silently chosen as TEXT prop instead of asking slot vs swap**

| Field | Value |
|---|---|
| Why A | User had to come back **after** the handoff and request component-capable cells + a new example → round trip + Figma rework (retrofitting a content slot into the already combined Cell set). T2.7 lists "Slot vs Swap per open content" explicitly as a fork, but I applied it to **nothing** — I modelled the cell content as a TEXT prop (text-only) on my own authority without surfacing the choice. A data-table cell is canonically **open content** (text, checkbox, badge, button — the docs' own data-table demo proves it). |
| Gap | composites.md T2.7 names the slot-vs-swap fork, but does not flag that **content-bearing leaf parts in a data-display composite (cells, list-row body, menu-item label) are open content by default** → the agent can silently pick a TEXT prop and ship a surface that is too thin, missing the real "cell holds a component" need. The done test did not catch it because I had scoped the checkbox away as a "call-site checkbox" — that masked the gap. |
| Verified | User request 2026-06-26: "but a table cell also accepts components" → content slot retrofitted. |
| Candidate fix | Add to references/composites.md T2.7: if the content of a leaf part is data/values (a cell, a list-row body, a menu-item label), **treat it as open content by default** → ask slot vs swap vs text, do NOT default to a TEXT prop. A TEXT prop is only right when the content is demonstrably text-only. (also: SKILL.md T2.6 exposure surface.) |
| Status | open |

### .claude/skills/figma-build-rules/SKILL.md (§Usage-examples / §Composites)

**6 · Done-test miss — composition baked fixed content → varied examples hand-built instead of component instances**

| Field | Value |
|---|---|
| Why A | User found that 3 of 4 usage examples (Selection/Empty/Component-cells) were **hand-built frames**, not Table component instances → rework (restructure the composition onto a content slot + convert 3 examples). The composition baked a **fixed** invoice (no content slot) → the varied examples could not be built as instances → I hand-built them as sibling frames. Exactly the done-test trap. |
| Gap | §Usage-examples/§Composites says "composed only from controls; never hand-build". For a **recompose-able container composite** (Table/List/Card-with-body) whose examples *vary the content*, that means: the composition needs a **CONTENT SLOT** (default = one baked demo) → every example is an **instance** that fills the slot. The skill does not explicitly warn against the seductive alternative: bake fixed content into the composition + hand-build the varied examples as sibling frames. That passes a cursory glance but fails the done test (the examples do not use the component). |
| Verified | 3 hand-built frames → after rebuilding the Table composition onto a content slot, all 4 examples became real Table instances (slot-filled, old frames moved into the slots); 0 regressions, 0 clipped nodes. |
| Candidate fix | Add to §Usage-examples (or §Composites build layer 4): *"Recompose-able container composite (content varies per example) → the composition gets a CONTENT slot (default = ONE baked demo). Every example is an INSTANCE that fills the slot — NO hand-built sibling frame. Baking fixed content + hand-building varied examples fails the done test (examples do not use the component)."* |
| Status | open |

## B — self-derived, result held (codify · deferred)

### .claude/skills/figma-build-rules/SKILL.md (§Slots / §Usage-examples)

**3 · T4/T5 Figma — slot strategy for many-child composites: build empty + bake demo, examples append-only**

| Field | Value |
|---|---|
| Why B | Self-derived (2 probe calls): table = Row→Cells→Table = up to 3 slot levels with many children. Result correct (examples built cleanly), no defect. Cost 2 experiment calls to find the boundary. |
| Gap | §Slots documents separately: (a) clearing instance-slot defaults invalidates sibling refs → **one** remove per call; (b) appending into an instance slot invalidates the ref → re-resolve the last child. It does **not connect** the two into a STRATEGY: for a composite whose examples fill a slot with many children (table row cells, list items), build the slot **EMPTY** (bake the demo content into a dedicated composition member — the DS convention "slots built EMPTY" from the Command catalog) → reproduction is **append-only**, never clear-then-refill. Otherwise every example row costs (N clears + M appends) calls. |
| Verified | Probe: clearing 3 baked cells → error after 1 remove (`Node … not found`); appending 2 cells into an empty slot + re-resolving the last child (FILL/props) → 0 errors, both placed. |
| Candidate fix | Add to §Slots (or §Usage-examples): *"Examples that fill a slot with many children → build the slot EMPTY, bake demo content into a composition member; reproduction append-only (re-resolve the last child for FILL/props). Do not bake defaults that must be cleared later — clearing instance-slot defaults is one-remove-per-call."* |
| Status | open |

### .claude/skills/figma-build-rules/SKILL.md (§Slots / §Mechanism)

**5 · Figma — "text OR component" leaf = content slot with prop-bound TEXT default (not an empty slot next to text)**

| Field | Value |
|---|---|
| Why B | Self-derived during the cell retrofit; solved correctly. First attempt (empty content slot **next to** the text) bloated every cell to 116px (empty slot = intrinsically ~100×100, HUG does NOT collapse it) and propagated into the baked composition → fix: nest the text **inside** the slot. Cost one iteration. |
| Gap | §Slots says "drop a sensible default inside" + "empty slot shows ~100×100" — but not as a **pattern** for a leaf that holds *text OR component*: the content slot gets the **prop-bound TEXT node** as its default (not a separate empty slot field next to the text). That way the slot is never empty (no 100×100 bloat), the text stays editable via the TEXT prop AND swappable for a component. "Empty slot + text as siblings" is the trap. |
| Verified | empty slot next to text → member 116px (slot 100×100); text nested into the slot → member 37px, slot HUGs the text (21px), TEXT prop still binds, component swap works (Checkbox/Badge). |
| Candidate fix | Add to §Slots/§Mechanism: *"Leaf that holds text OR a component → ONE content slot whose default is the prop-bound text node (nest the text into the slot). Never keep an empty slot next to a text node — an empty slot is ~100×100 and bloats the container."* |
| Status | open |

## C — tooling / repo / already covered

### design-docs/design-system/tokens-reference.md (§6)

**2 · T3 / token mapping — stock `text-muted-foreground` → DS `text-muted-ink` (-ink suffix)**

| Field | Value |
|---|---|
| Why C | No defect — the mapping is already correctly recorded in §6 `color_renames` (`text-muted-foreground → text-muted-ink`). User flagged it as a recurring stumbling point (secondary text: caption, muted labels). |
| Gap | The text-vs-surface suffix split (`-ink` = text/icon, `-fill` = surface) is easy to mix up — a port can wrongly write `text-muted` / `text-muted-fill` for secondary text instead of `text-muted-ink`. |
| Verified | §6 `color_renames`: `{ stock: text-muted-foreground, ds: text-muted-ink }`. `item.tsx:176` uses `text-muted-ink` for secondary text. |
| Candidate fix | Already covered in §6 — during a port, consistently read §6 instead of guessing by name similarity. If more emphasis is wanted: home is tokens-reference §6 (the data), NOT the skill prose (`.claude/skills/CLAUDE.md`: do not duplicate token names in skills). No skill-prose edit. |
| Status | open |

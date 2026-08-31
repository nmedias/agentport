# Handoff — Component Port: Open Items + Skill Findings (consolidated)

>  Locator/status of all components + Figma node IDs:
> `design-docs/design-system/components-reference.md` (**read first**), token crosswalk:
> `design-docs/design-system/tokens-reference.md`, run details: `agent-runs/`.

**Status 2026-06-22:** `master` = **18 components** ff (no remote, `npm run check` green, 260 tests / 57 files).
**Slider** ported 06-22 + fast-forward merged onto `master` (see Open items #2).
**Added since 06-12 (2026-06-16…06-19):** **ChoiceCard** ported (DS-authored composite — 3 thin
wrappers `ChoiceCardCheckbox`/`ChoiceCardSwitch`/`ChoiceCardRadio` over an internal `ChoiceCardShell`
+ `useFieldId` hook; checked tint = two-cyan-token model, fully variable-bound) and **Select**
ported (full Radix primitive, `radix-ui` umbrella kept; sub-parts with their own story files).
In between, a **component-sync sweep 2026-06-17** (Figma→code reconcile across ~18 sets). The catalog
`components-reference.md` reflects this state — the node IDs/status there are authoritative.

**Parallel batch 06-22 (tooltip · toggle · toggle-group · popover):** 4 components ported (Figma + code;
3 background agents in parallel, Figma set build serialized via a `/tmp` `mkdir` mutex — one
plugin connection), integrated to **22 components** on branch `feat/shadcn-port-batch` (4 commits, additive
`index.ts`/catalog conflicts resolved as a union, ff-ready onto `master`). **Gate green in the fully set-up
main tree: `npm run check` = 298 tests / 66 files** (lint + typecheck + test; one Select portal `play` test
flaky, green on re-run — pre-existing, not from the batch). **NOT YET ff-merged onto `master` (user gate).**
`toggle` = co-ported (hard dep of toggle-group, finding B10). Runs:
`agent-runs/component-port/2026-06-22-{tooltip,toggle-group,popover}/`.
**Removed 2026-06-24:** `toggle` + `toggle-group` fully removed (code folders + barrel exports +
catalog entries + run notes `2026-06-22-toggle-group/`) — will be redone in Figma. From the batch,
**tooltip · popover** remain in the code.

Form-toggle batch (Checkbox · Switch · RadioGroup) **merged** (code + token-bound Figma sets +
permanent usage examples + Figma→code sync + Field-composed stories) + skill edit (usage-examples
deliverable + doc fidelity lifted into `/shadcn-component-port`) merged. Standard: glow = literal-alpha
DROP_SHADOW `showShadowBehindNode:false` (verbatim from the `.Input` focus); stories in doc composition (Field family).
**FIGMA FOLLOW-UP (external, NOT in git):** the 3 usage-example groups rebuilt on real `.Field` reuse;
for that, `.Field` extended — `controlPosition [trailing,leading]` axis (control-leading for Checkbox/Radio) +
new `.FieldLegend` set + invalid-error slot fix (cause: `clone()` degrades SLOT→FRAME). `controlPosition`
= **Figma-only fork** (no code prop). Details: catalog `.Field`/`.FieldLegend` + the 3 `examples` entries.
**18 components** ported + nova-aligned (Button, Input, Textarea, Kbd, Breadcrumb, InputGroup,
Command incl. palette variant + CommandDialog, Dialog, Badge, Separator, **Field (+ co-ported
Label)**, **Checkbox, Switch, RadioGroup**, **Select**, **ChoiceCard**, **Slider**) + blocks layer
(structure, no organisms yet). Badge: 6 nova variants (`ghost`/`link`
beyond the brief's 4, deliberately) with `secondary`/`destructive` bound to ⚠ placeholders; Separator axis =
`orientation` (h/v); AsChild control footgun fixed (#21). **Field = surface-less composite**
(`orientation × invalid` + 4 slots, only spacing+typography bound; FieldSet/Group/Legend/Title +
`responsive` = code-only; FieldError→`destructive ⚠`); **Label public** (hard dep of Field).
Composite procedure validated (**5×**: InputGroup/Command/Dialog/Field/ChoiceCard; Select = full
Radix primitive, not a surface-less composite), operational in `/shadcn-component-port` (SKILL.md +
references/composites.md) + `/figma-build-rules` (build mechanics + snippets); maintenance via
`/component-sync` (Figma→code).

**Skill architecture 2026-06-22 (this session):** `/figma-build-rules` **actually extracted** from
`/shadcn-component-port` (`8fa6872` extraction, `4973188` grill hardening) — project-neutral build skill
(Plugin API contract, mechanism table, binding/slots/variant assembly, interaction-state axis,
usage examples, verify triad, 3-layer composite). `recon.js` + `build-variant-set.js` **moved** to
`figma-build-rules/snippets/` + neutralized to placeholders (no fileKey/font/collection/set name);
`read-set-values.js` stays with `/component-sync`. Port/sync **delegate** to the skill and keep the
project overlay (`config.json` — now **incl. `figma.font`**); `composites.md` = port-process delta only
(build mechanics → `/figma-build-rules §Composites`); `references/figma-build.md` deleted (→ skill body).
Skill is **dual-mode** (standalone + delegated), description now carries a negative boundary against the
full port. Separately: `/storybook-rules` **decoupled to project-neutral** (`692a4ac`) + extended with
composite-story doc rules (`110ab0d`).

## Open items

1. **Skill findings** (format + triage see **## Skill findings**; wording rule + "never edited
   mid-run" see the blockquote there). **No open A findings left (A9–A11 06-24 + Item A12/A13/B42/B43
   codified 06-26); only B remain open (deferred: B1–B13, B27, B41)** — self-derived,
   result held → codify, no bugfix (tables see **### B**). All **done** findings
   (A strand 06-22, Slider, A2/A4–A8, A9–A11, C1–C8, Item A12/A13/B42/B43) → **### Done** (not in the
   finding sections).
2. **Composite strand — next step** (procedure validated multiple times, nothing blocked): **Slider
   2026-06-22 PORTED + fast-forward merged onto `master`** (`0df4af2`…`1ae9fab`; gate green
   260 tests). Geometry primitive like Switch,
   no CVA; Figma set 12 members (`orientation × thumbs × state`, `thumbs` = Figma-only fork) +
   usage examples incl. **FieldSlider → unlocks the `field-slider` that was skipped during the Field port
   (06-12)**. Details: `agent-runs/component-port/2026-06-22-slider/notes.md`, catalog entry `Slider`.
   **Parallel batch 06-22 done:** tooltip · popover ported (Figma + code, gate green), ff-ready on
   `feat/shadcn-port-batch`; `toggle` + `toggle-group` removed again 06-24 (Figma rebuild).
   **`popover` + the already
   ported `command` unlock the `combobox` endpoint switcher** (explorer analysis) — open
   next blocks step, not built. **Open follow-up (Tooltip):** the `kbd.tsx`
   `in-data-[slot=tooltip-content]:` override was tuned for the old DARK tooltip → near-invisible on the new LIGHT
   chip; deliberately not edited in the single port. **Kbd touch-up DONE 06-23** (`64cfaf8`): tooltip-content override
   `bg-surface/20`→`bg-muted-fill` (subtle, visible muted keycap on the light chip; `text-ink` kept readable), gate green + axe-clean. (Skill guardrail "grep the sibling `in-data-[slot]:` overrides before recoloring" = B31, incorporated 06-23, see ### Done.)
   **Popover review 06-23:** code/docgen gaps (root docgen + PopoverContent props + sides story) fixed
   on `fix/component-review-polish` (see A4, gate green 299). **④ Popover Figma DONE 06-23** (background agent
   `popover-figma`): section fixed — children re-parented into a white vertical AL build frame `4390:2364` INSIDE the section,
   section 321×203→1312×1133 → no spill (A5); `align` modeled as **PopoverRoot set `4393:2391`**
   (align axis start/center/end, real nested Button+PopoverContent, no fork). figma-verify CLEAN + manual
   section check PASS; catalog updated. Detail: `agent-runs/component-port/2026-06-23-popover-figma/notes.md`.
   **EXTENSION 06-23 DONE (see A6):** root model static→fully interactive overlay — **PopoverRoot set `4402:2589`**
   (24 members: open/closed × side × align), **HUG-SLOT trigger** (`asChild` proxy, default Button — the member frame carries the
   prototype reaction), content `layoutPositioning=ABSOLUTE` (anchored, no reflow), **on-click+Esc prototype** (closed↔open).
   Members **HUG the trigger** (footprint=trigger 50×32, content floats absolutely outside); old `4393:2391` removed;
   set **renamed PopoverRoot→Popover** (matches the code root export); section → 1718×2528. figma-verify CLEAN + section check PASS; catalog updated.
   **Item 2026-06-26 PORTED** (Figma + code, gate green 300; `.Item` set variant×size 9 members +
   `.ItemMedia` set + `ItemGroup` component + usage examples, figma-verify CLEAN; state axis deliberately
   examples-only). Unlocks the explorer **NavListItem** (type list). User review found
   5 Figma defects → all fixed (media slot nests `.ItemMedia` · title/icon bound to `ink` · focus ring
   correct · ItemGroup as component · ItemMedia content slot); skill findings A12/A13/B42/B43. Open
   Item points: `xs` description stays 14px (no sub-14 sans format); `image` ItemMedia uses a gray
   placeholder (no image fill). On `feat/shadcn-item-port`, ff-ready (not yet merged). Details:
   `agent-runs/component-port/2026-06-26-item/notes.md`, catalog entry `Item`.
   Otherwise open now: another composite (`/shadcn-component-port <name>`) or blocks work on the
   palette building blocks. *(ChoiceCard 06-16, Select 06-19, Slider 06-22, batch-4 06-22, Item 06-26 — all done.)*
3. **Dark-mode token set** in Figma + `.dark` block in globals.css (exclude `--background-fixed`).
   Until then: light = the only mode.
4. **Design the 9 ⚠ placeholder tokens for real:** `secondary*`, `destructive*`, `chart-1…5`
   (`destructive` = invalid state of `.Input`/`.Textarea`, now also Badge `secondary`/`destructive`
   variants + Field `FieldError`).
5. **Status family** `connected/offline/error/warning`, **proportion bars**, **rail active icons**.
   *(Also from the token handoff.)*


## Skill findings (consolidated · `/skill-feedback` format)

Aggregate across multiple port/sync runs (sources below), deduplicated, **pre-sorted like a
`skill-feedback.md`**: triage class **A → B → C**, grouped by **target file** within. One
**`Field | Content` table** per finding (title line + rows `Why` · `Gap` · `Verified` · `Candidate fix` · `Status`).
**ID = class + running number in display order** (`B1`…`B27`). Each entry is
**self-contained** — if two findings are related, the related one appears in short form as a `Related` row
(no jump references between items). The run tags in italics *(Badge #3)* = source number in the
source run, unchanged. **User reviews + applies** — skills are never edited mid-run.

> **Wording rule for finding edits:** the incorporated text follows the Skill Writing Rules
> (`.claude/skills/CLAUDE.md`). *Tracker-specific* (not in the skill): run reference / `Why` /
> `Verified` here are review evidence and do NOT travel into the skill — only the `Candidate fix` is
> the edit template; skills are never edited mid-run.

> **Triage axis** (= `/skill-feedback`): did the skill gap *cost* something, or did you route around
> it and still land on the planned result?
> - **A** — gap caused a defect (gate red · crash · error · rendered wrong · user found the
>   bug) → skill edit = guardrail, **priority**.
> - **B** — self-derived, result held → codify knowledge, **no** bugfix → low priority.
> - **C** — tooling/repo fix or already covered (entry = evidence).
>
> Borderline → the class whose *test* applies (correct only AFTER a defect/burned iteration = A).
> *(The `*(A)*`…`*(G)*`/`#n` tags in the titles are run-internal enumerations, NOT the class.)*

### Done (chronological)

**All done findings collect here** — the A/B/C sections below list only open/deferred items.

- **A strand (29, 2026-06-22)** incorporated into the 6 skill files (#62 discarded).
- **Slider run (2026-06-22):** A #5 /storybook-rules (wrapper-render→`source.code`, S4 promotion,
  `03178db`) · #2 → **A1** /shadcn-component-port T6 a11y (`8287d65`).
- **A2 · A4 · A5 · A6 · A7 · A8 (2026-06-23)** in 4 skill files: **A2** /storybook-rules (`userEvent`
  instead of raw `element.click()`) · **A4** /docgen-props (pass-through root ≠ prop-less → Omit+re-declare) ·
  **A5** /figma-build-rules + /figma-create-section (Section ≠ Auto Layout → vertical build AL frame) ·
  **A6** /figma-build-rules §Composites (interactive triggered overlay) · **A7** ibid. (`ABSOLUTE` needs an
  AL parent) · **A8** /figma-build-rules §Icons (connected sub-shape border-aware). **A3 discarded**
  (Radix/shadcn-specific a11y behavior — does not belong in the framework-neutral house pattern).
- **C1–C8 (2026-06-23):** **C1+C4** `build-variant-set.js` **deleted** (label/field target family
  fully ported; newer ports bypass it anyway; mechanics = prose in /figma-build-rules; references §Approach +
  T4 → "build from the recipes"; `recon.js` stays). **C2·C3·C7·C8** in /figma-verify: skip `visible:false`
  nodes (C2) · control `handle/thumb/knob` over `track/rail/groove` → SOFT HINT (C3) · check the whole composition
  instead of only the set (caller: §Verify + T5) + child outside the filled surface = spill FLAG (C7, **without**
  contrast check) · full-bleed child ≠ clipped (C8). **C5·C6** already covered in the memory
  `parallel-batch-worktree-pitfall`.
- **B batch B28–B38 (2026-06-23, from the overlay builds):** **B28** /docgen-props (discriminated-union root →
  `type` intersection instead of `interface extends`) · **B31** /shadcn-component-port T3 (grep the
  sibling `in-data-[slot]:` overrides before recoloring) · **B32** /figma-build-rules §Composites (align axis: move the
  trigger, not the panel) · **B33** ibid. §Mechanism (swappable trigger → reaction on the member frame, HUG slot) ·
  **B35** ibid. §Slots (retrofit SLOT onto a combined set). Rest of the batch discarded.
- **A11 (2026-06-24)** incorporated into /figma-verify §3: spill check for **ABSOLUTE overlay descendants** —
  recurse down to the visible leaf + test its `absoluteBoundingBox` against **every** enclosing container
  (own component/set frame **and** section), FLAG if it exceeds *any* of them (checking only the
  outermost reads CLEAN while it crosses an inner frame); **never** `absoluteRenderBounds`
  (clips under `clipsContent` → false PASS).
- **A9 (2026-06-24)** codified in /figma-build-rules §Composites: "Anchored overlay" rewritten from the old
  fixed-member/move-the-trigger model to **HUG member + constraint positioning** — SIDE
  pins the perpendicular (top→vert MIN · bottom→MAX · left→horiz MIN · right→MAX), ALIGN the parallel
  (start/center/end→MIN/CENTER/MAX), `CENTER ⟺ align=center`; **two-stage anchor** (panel position tracks
  the edge / panel content inverted side axis → grows away) as its own bullet, because constraints on the
  ABSOLUTE child control BOTH directions (tracking + self-growth) and each side needs the opposite edge.
  **Containment bullet (set padding) also codified** (§Composites layer 3, "Containing the overlay
  variant set" — pad the set itself, not the outer wrapper; on a fixed-axis set, grow the axis by the same
  padding so the grid does not wrap).
- **A10 (2026-06-24)** incorporated into /figma-build-rules §Red flags (heading generalized from "Red flags (Plugin-API)"
  to "Red flags"): no-go — faking a variation by hiding an element on the instance +
  gluing a substitute next to it (duplicated, prop-less, scattered, drift) → model the deviating form as a
  **variant axis** (one per variant, prop-switched), cloned from the built shapes.
  **With that, all A findings are done.**
- **Item findings (2026-06-26)** codified: **A12** /figma-build-rules §Binding recipes (lead: bind every
  token-covered property; literal only where no token exists; `tokens`=TARGET, recon=ID; bind CSS inheritance
  explicitly) + /figma-verify step 7 (SOFT HINT "unbound token-backed value"). **A13** ibid.
  §Composites layer 2 (part component → parent slot default nests the instance + own content as slot).
  **B42** ibid. §Red flags (named effect style ≠ focus ring). **B43** ibid. §Composites (build scope per
  part: layout-only container = component OR frame, do not mix for peers). With that A12/A13 done;
  open B = only those deferred pre-Item (B1–B13, B27, B41).
- **Table run (2026-06-26)** — findings OPEN in the A/B/C sections (not yet incorporated): **A14**
  /figma-build-rules §Usage-examples (recompose-able container composite → content slot, never hand-build
  varied examples — done test) · **A15** composites.md T2.7 (content-bearing leaf = open content → ask slot-vs-swap,
  not TEXT prop) · **A16** SKILL.md T2.5→T4 (story written + gate green BEFORE any Figma action) ·
  **B44/B45** /figma-build-rules §Slots/§Mechanism (build many-child slot empty + append-only · "text-OR-
  component" leaf = slot with prop-bound text default) · **C9** tokens-reference §6 (`text-muted-foreground`
  →`text-muted-ink`, already covered).

### A — gap caused a defect (priority)

#### /figma-build-rules

**A14 · §Usage-examples / §Composites — recompose-able container composite needs a content slot; never hand-build varied examples (done-test miss)** *(Table #6)*

| Field | Content |
|---|---|
| Why A | 3 of 4 usage examples were hand-built frames instead of Table instances; user found it → rework (rebuild the composition on a content slot + convert 3 examples). |
| Gap | §Usage-examples says "composed only from controls; never hand-build", but does not warn: a recompose-able container composite (Table/List/Card-with-body) whose examples *vary* the content needs a CONTENT slot (default = one baked demo) → each example = an instance that fills the slot. Trap: bake fixed content into the composition + hand-build the varied examples as sibling frames (passes a cursory glance, fails the done test). |
| Verified | after rebuilding on a content slot, all 4 examples became real Table instances (old frames moved into the slots), 0 regressions, 0 clipped nodes. |
| Candidate fix | extend §Usage-examples (or §Composites build layer 4): recompose-able container composite (content varies per example) → the composition gets a CONTENT slot (default = ONE baked demo); each example = INSTANCE that fills the slot, no hand-built sibling frame. |
| Status | open. |

#### composites.md

**A15 · §2 T2.7 — content-bearing leaf part defaults to open content (ask slot-vs-swap), not TEXT prop** *(Table #4)*

| Field | Content |
|---|---|
| Why A | cell content silently modeled as a TEXT prop (text-only); user came back after handoff and demanded component-capable cells → round trip + Figma retrofit (content slot into the combined Cell set). |
| Gap | T2.7 lists "slot vs swap per open content" as a fork, but does not flag that content-bearing leaf parts in a data-display composite (cells, list-row body, menu-item label) are OPEN content by default → the agent can silently pick a TEXT prop + deliver a surface that is too thin. The done test masked it (Checkbox scoped away as a "call site"). |
| Verified | data-table doc demo uses Checkbox/Badge/Button in cells; user request "table cell also accepts components". |
| Candidate fix | extend T2.7 — if a leaf part's content is data/values (cell, row body, item label), treat it as open content by default → ask slot-vs-swap-vs-text, do not default to a TEXT prop; TEXT prop only when demonstrably text-only. *(also: SKILL.md T2.6)* |
| Status | open. |

#### SKILL.md

**A16 · T2.5→T4 — hard gate: no Figma action (incl. recon) before a written + green story** *(Table #1)*

| Field | Content |
|---|---|
| Why A | T4 Figma recon (recon.js, `whoami`) started before a T2.5 story was written; user interrupted + redirected. |
| Gap | T2.5 says "author … BEFORE Figma" only as a parenthetical; no blocking checkpoint between T2.5 and T4. "Doc examples read" feels like "T2.5 done", but is not. |
| Verified | caught by the user before any Figma write access happened. |
| Candidate fix | a hard gate sentence at the end of T2.5: "No Figma action — recon included — before the story file is written AND the gate is green." Optionally mirror in composites.md §2 (T2.6/T2.7 push even more steps in between). |
| Status | open. |

### B — self-derived, result held (codify · deferred)

#### /figma-build-rules

**B1 · §Slots — slot defaults in instances: re-resolve invariant** *(Command #3 · Dialog #3)*

| Field | Content |
|---|---|
| Why B | one-remove-per-resolve behavior observed first-hand, slots built correctly. |
| Gap | §Slots does not fully cover instance slot mutation — re-resolve invariant, FRAME-vs-SLOT representation and default materialization via `setProperties` are missing. |
| Verified | Command run = virtual read-only defaults (not removable); Dialog run = readable + removable under re-resolve → removal is unreliable. |
| Candidate fix | EVERY structural mutation (append AND remove) invalidates held child refs → one remove per re-resolve (`while (slot.children.length) slot.children[0].remove()`), never `[...children].forEach(remove)`. Slot WITH default = FRAME in the instance (match by name, an empty slot stays SLOT); append does not replace defaults (they coexist visibly). `setProperties()` materializes inherited defaults → empty the component slot before instantiating / delete afterwards. Build per-instance composed slots EMPTY in the component. |
| Status | deferred. |

**B2 · §Binding recipes — placeholder vars carry a ` ⚠` name suffix → `endsWith('/'+token)` misses them** *(Badge #3)*

| Field | Content |
|---|---|
| Why B | documented `endsWith` returns []; agent bound correctly via a full name scan (not raw hex). |
| Gap | recon.js + the binding examples match `name.endsWith('/'+token)`; the placeholder tokens are named `shadcn Default/secondary ⚠`, `…/destructive ⚠`, `chart-1…5 ⚠` (space + emoji) → silently [] → raw-hex trap. |
| Verified | `endsWith('/secondary')` → []; full name scan found the ⚠ vars. |
| Candidate fix | match more loosely (`includes` / strip the trailing ` ⚠`) AND note: the DS marks placeholders with ` ⚠` — they ARE bindable (to the real ⚠ var, not raw hex; "do not finalize" still applies). *(also: recon.js, tokens-reference §1)* |
| Status | deferred. |

**B3 · §Binding recipes — tinted bound surface (`bg-X/10`) needs an alias-resolve recipe** *(Badge #5)*

| Field | Content |
|---|---|
| Why B | alias chain resolved recursively → 10% red with the binding preserved. |
| Gap | figma-build-rules says "opacity + real resolved color as fallback", but the var value is usually `VARIABLE_ALIAS` → primitive → color, not directly readable from `valuesByMode`; without a recipe an agent spreads the bound paint (forbidden) or sets black. |
| Verified | `bg-destructive/10` needed `resolveColor` across the alias → 10% red. |
| Candidate fix | "tinted bound surface" recipe: bind → resolve the color recursively across the alias chain → set as paint fallback → paint-level `opacity` (≠ node `opacity`, which dims the content too — disabled only). *(also: build-variant-set.js `tintVar`/`tintOpacity` branch)* |
| Status | deferred. |

**B4 · §Reuse/Nesting — nesting a local component = `.createInstance()` by node ID, NOT `importComponentByKeyAsync`** *(Field #5)*

| Field | Content |
|---|---|
| Why B | importByKey threw "not found"; `getNodeByIdAsync` + `createInstance` ok. |
| Gap | "Reuse, don't rebuild" says "nest a real instance", but not HOW for a local (unpublished) component in the same file; import-by-key resolves ONLY published library components. |
| Verified | importByKey on the local `.Input` default → "not found"; node `3176:303` + `.createInstance()` ok. |
| Candidate fix | for same-file, fetch the variant COMPONENT node via `getNodeByIdAsync('<variantNodeId>')` → `.createInstance()`. recon should deliver the variant node IDs, not just keys. *(also: recon.js)* |
| Status | deferred. |

**B5 · §Variant set assembly — two-part geometry toggle (track+thumb) needs NO Base/state-layer machinery** *(Switch #4)*

| Field | Content |
|---|---|
| Why B | 10 flat members without Base, controls-live + verify CLEAN. |
| Gap | figma-build-rules explains Base + state layer for content surfaces; a content-/tint-/active-less geometry toggle does not need that. |
| Verified | 10 flat members, no Base, controls-live + verify CLEAN. |
| Candidate fix | N flat members (size×state) via `combineAsVariants`, bind fill/stroke/effect/layer opacity per member, offset the thumb child x numerically. Base + state layer only for content surfaces (buttons/inputs). |
| Status | deferred. |

**B6 · §Slots — fill-slot-in-instance: additions to the recipe** *(switch/radio/checkbox-examples)*

| Field | Content |
|---|---|
| Why B | clear+append / read-back in the follow-up call worked. |
| Gap | the §Slots recipe does not cover the instance-slot edge cases. |
| Verified | — (from the example runs, not probed separately). |
| Candidate fix | slot default text setter throws "node not found" → clear+append, read-back in a SEPARATE call (instance slot mutation invalidates the node ID in the same tick); clearing co-removes/re-injects sibling defaults → guarded per-id loop + post-append sweep; set text slots BEFORE the control slot; a HUG control slot hugs a narrow control automatically (never HUG the instance); sibling slots via `query('SLOT[name=…]')`, not `findOne` over `componentPropertyReferences` (throws on stale nested-instance IDs). |
| Status | deferred. |

**B7 · §Usage-examples — selection control + Field = control-leading** *(checkbox-examples)*

| Field | Content |
|---|---|
| Why B | `controlPosition` axis built first-hand, nested correctly. |
| Gap | §Usage-examples assumes a control-trailing Field; a Checkbox/Radio row is control-LEADING. |
| Verified | — (Figma-only fork built, see catalog `.Field`/`.FieldLegend`). |
| Candidate fix | example groups for selection controls nest a control-leading `.Field` (`controlPosition` axis, Figma-only fork); compose group/fieldset examples with a differing item count vertically (`.FieldSet` nests a fixed 2 Fields). Per-field error → `.Field` error slot; group error (FieldSet level) → separate text. *(also: components-reference catalog)* |
| Status | deferred. |

**B27 · §Mechanism — count-driven sibling geometry → variant axis (not boolean, not slot)** *(Slider #1)*

| Field | Content |
|---|---|
| Why B | axis model self-derived; user confirmed the 12-member scope. Build holds. |
| Gap | §Mechanism maps "variably many children → slot" and "conditional layout → variant axis", but not the case where the *count* of a data-driven sub-element changes the **geometry of a sibling** (range fill spans BETWEEN the handles → a 2nd handle re-anchors the fill). Not a boolean (Figma cannot negate a property binding → the single fill does not hide when the 2nd element appears), not a slot (fill geometry coupled, no free content). |
| Verified | single = start→handle, range = handle1→handle2; a boolean on `handle2.visible` wrongly leaves the start→handle1 fill in place (no inverse binding). |
| Candidate fix | note/row: if the *count* of a data-driven element changes a sibling's geometry (range fill, segmented track) → model as a **variant axis** (`thumbs: single\|range`), not a boolean (no property negation) nor a slot (coupled geometry). **Figma-only fork** when the code derives the count from data (e.g. `value.length`) — do not sync back as a prop. Multiplies the matrix like the conditional-layout row. |
| Status | deferred. |

**B41 · Red flags (Plugin-API) — empty GROUP dissolves · `setCurrentPageAsync` error · `combineAsVariants` needs a page** *(Tooltip root mirror)*

| Field | Content |
|---|---|
| Why B | 1 atomic error each, routed around, result correct. |
| Gap | three Plugin API traps are missing from the red-flags table. |
| Verified | (a) all children moved out of a GROUP → Figma dissolves the GROUP automatically → a later reference throws "node does not exist". (b) `setCurrentPageAsync(page)` threw `Internal Figma error: Unknown node type … getPublicNodeType` on an already loaded/current page; without the page switch it ran. (c) `combineAsVariants` threw "Grouped nodes must be in the same page as the parent" because the clones hung on `figma.currentPage` (≠ build page). |
| Candidate fix | red-flags rows: do not reference a GROUP after emptying it (Figma auto-dissolves empty GROUPs). · If the target page is already current/loaded, omit `setCurrentPageAsync` (a redundant switch can throw `getPublicNodeType` internally). · `combineAsVariants` needs ALL components + parent on ONE page → attach the clones to the parent page (ancestor walk to the PAGE + `page.appendChild`), never to `figma.currentPage`. |
| Status | deferred. |

**B44 · §Slots / §Usage-examples — build many-child slot EMPTY + bake the demo; examples append-only (not clear-then-refill)** *(Table #3)*

| Field | Content |
|---|---|
| Why B | self-derived (2 probe calls), slots built correctly. Table = Row→Cells→Table = up to 3 slot levels with many children. |
| Gap | §Slots documents (a) clearing instance slot defaults = one remove per call and (b) append re-resolve separately, but does not connect them into the STRATEGY for slots with many children (table cells, list items). |
| Verified | clearing 3 baked cells → error after 1 remove (`Node … not found`); appending 2 into an empty slot + re-resolving the last child → 0 errors. |
| Candidate fix | build a slot with many children (whose examples fill it) EMPTY, bake demo content into a composition member (convention "slots built EMPTY"); reproduction **append-only** (re-resolve the last child for FILL/props); do not bake defaults that must later be cleared (instance slot default clear = one-remove-per-call). |
| Related | re-resolve/one-remove invariant = B1 (§Slots); this finding attaches the *strategy* (build empty instead of clearing). |
| Status | deferred. |

**B45 · §Mechanism / §Slots — "text OR component" leaf = content slot with prop-bound TEXT default (not an empty slot next to text)** *(Table #5)*

| Field | Content |
|---|---|
| Why B | derived during the cell retrofit; solved correctly (cost one iteration). |
| Gap | §Slots/§Mechanism says "drop a default inside" + "empty slot ~100×100", but not as a pattern for a leaf that holds *text OR component*: the content slot gets the **prop-bound TEXT node** as its default (text INTO the slot), never an empty slot field next to the text. "Empty slot + text as siblings" is the trap. |
| Verified | empty slot next to text → member 116px (slot 100×100, HUG does not collapse); text nested into the slot → 37px, slot HUGs the text, TEXT prop still binds, component swap (Checkbox/Badge) ok. |
| Candidate fix | leaf that holds text OR component → ONE content slot whose default is the prop-bound text node (nest the text into the slot); never keep an empty slot next to a text node (an empty slot is ~100×100 and bloats the container). |
| Related | generalizes B12 (composites.md: text region as SLOT-with-default instead of text prop) to the "text-OR-component" case + the empty-slot bloat trap. |
| Status | deferred. |

#### composites.md

**B8 · §2 T2 dep audit — align the Radix umbrella import** *(Breadcrumb #1)*

| Field | Content |
|---|---|
| Why B | worked transitively; the per-primitive switch affects only individual sub-imports. |
| Gap | the registry writes `import { Slot } from "radix-ui"` (+ `Slot.Root`); `radix-ui` is only present transitively (phantom dependency). |
| Verified | —. |
| Candidate fix | switch individual sub-imports to the project convention per-primitive (`@radix-ui/react-slot`, `Slot`) + check the declared dependency. *(also: SKILL.md T2)* |
| Related | counterpart (full primitives): a **complete** primitive (Select/Dialog) keeps the `radix-ui` umbrella (`import { Select as SelectPrimitive } from 'radix-ui'`; declared dep, Dialog convention) — only individual sub-imports go per-primitive. |
| Status | deferred. |

**B9 · Layer-2 nesting — hard-case recipe + "the predecessor is not authoritative"** *(InputGroup #4; re-validated via Dialog)*

| Field | Content |
|---|---|
| Why B | Base-override/icon-swap recipe found first-hand, re-validated on Dialog. |
| Gap | no recipe for components without exposed content/geometry; and no rule "a re-port applies the nest rule even if the predecessor was re-clothed standalone". |
| Verified | —. |
| Candidate fix | (a) a re-port MUST apply the nest rule; (b) geometry often lives in the nested `*/Base` instance (top `lm:NONE` → override one level deeper via `setBoundVariable`), text = deep characters override, icon behind a locked slot default = `swapComponent` to a persistent icon component (one swap target/icon = accepted cruft). Alternatively flag an upstream fix (real icon slot + label prop on the base component). |
| Status | deferred. |

**B10 · §2 T2 dep audit — a hard-imported dep MUST be ported, not stubbed/deferred** *(Field #1)*

| Field | Content |
|---|---|
| Why B | `Label` co-ported (the only valid path; the skill wrongly offered stub/defer). |
| Gap | §2 T2 lists port/stub/delete+defer as a choice; if the kept composite source imports the dep directly, stub AND delete+defer break the composite (runtime/typecheck). |
| Verified | `label` imported only in field.tsx:5. |
| Candidate fix | split §2 T2 — kept composite source imports the dep → port it (hard co-dependency, not optional); stub/delete+defer apply only to deps used merely by non-kept sibling example/demo files. "co-ported primitives" watchlist. |
| Status | deferred. |

**B11 · Surface-less composite — what to model in Figma?** *(Field #6)*

| Field | Content |
|---|---|
| Why B | only ROW + spacing/typography bound, verify CLEAN. |
| Gap | composites.md assumes some token surface (InputGroup bg+border, Dialog panel+scrim); a purely layout/typography/spacing/a11y composite has zero surface of its own (border/bg is carried by the nested control). |
| Verified | all members + slots `fills=[]`; only itemSpacing + text style bindings carry tokens; verify CLEAN. |
| Candidate fix | model the structural ROW (`orientation × invalid` + slots + nested real control instance), bind only spacing gaps + typography formats, declare the pure grouping parts (FieldSet/Group/Legend) + container query (`responsive`) explicitly as code-only (no Figma set). Note the code↔Figma gap. |
| Status | deferred. |

**B12 · §1 — text regions as SLOT (with text default), not as text property** *(Field #7)*

| Field | Content |
|---|---|
| Why B | 4 slots → 4 set-level SLOT props (verified). |
| Gap | §1 maps "editable string → text property"; that locks out content/structure swaps (e.g. label + trailing badge). |
| Verified | 4 slots → 4 set-level SLOT props, each clear+append in the instance. |
| Candidate fix | for text regions prefer a slot-with-text-default over the text property when the consumer should be able to swap content/structure (consistent slot naming merges across all members into one set-level prop); text property only for a strictly single editable string. |
| Status | deferred. |

**B13 · §2 T2 dep audit — keep the `radix-ui` umbrella for FULL primitives** *(Select E)*

| Field | Content |
|---|---|
| Why B | right choice (Dialog convention). |
| Gap | a per-primitive switch would be wrong for a full primitive — it keeps the umbrella; the switch applies only to an individual sub-import (see Related). |
| Verified | —. |
| Candidate fix | split dep audit §2 T2 — keep the full-primitive umbrella (`import { Select as SelectPrimitive } from 'radix-ui'`; declared dep), switch only individual sub-imports to per-primitive. *(also: SKILL.md T2)* |
| Related | counterpart (individual sub-import): `Slot` from the `radix-ui` umbrella is only transitive (phantom dep) → switch to per-primitive `@radix-ui/react-slot` + check the declared dependency. |
| Status | deferred. |

#### SKILL.md

**B14 · T2 — landed CVA can exceed the doc/brief matrix → fix the axis cardinality** *(Badge #1)*

| Field | Content |
|---|---|
| Why B | 6 variants fully built in Figma + kept in the code (correct). |
| Gap | the nova `ui:add` source is denser than stock and carries CVA options the doc page never shows; no rule for "landed CVA > canonical usage set / brief matrix". |
| Verified | Badge 6 code variants (default·secondary·destructive·outline·ghost·link vs 4 doc/brief) fully built in Figma, kept in the code. |
| Candidate fix | code keeps the full landed CVA (never drop options); Figma covers at least the brief/doc options, SHOULD cover all landed ones, unless the brief scopes down → code↔Figma axis gap in notes.md. Decide which artefact is authoritative for the axis cardinality. *(also: tokens-reference)* |
| Status | deferred. |

**B15 · T3 — `ring-N` → `ring-[Npx]` (sibling convention)** *(Checkbox #2 · Switch #1)*

| Field | Content |
|---|---|
| Why B | sibling convention; functionally identical (3px). |
| Gap | no rule to normalize stock `ring-3` to the family form. |
| Verified | all 4 siblings (input/checkbox/input-group/textarea) = `ring-[3px]`. |
| Candidate fix | normalize to the sibling form, not `ring-N` verbatim. |
| Status | deferred. |

**B16 · T3 — role token misses contrast → keep the stock color token as FILL + note the why** *(Switch #2)*

| Field | Content |
|---|---|
| Why B | `bg-input` deliberately kept (verified `muted`≈1.04:1 vs `input`≥3:1). |
| Gap | no rule for "role-correct token misses the required contrast". |
| Verified | muted ≈1.04:1 vs input ≥3:1 on white. |
| Candidate fix | do not blindly bend to the role-named token if it misses the required contrast — keep the stock token as fill, rationale in notes. |
| Status | deferred. |

**B17 · T2 — no-CVA state axis: separate mutually-exclusive members from composing overlays** *(Checkbox #1)*

| Field | Content |
|---|---|
| Why B | correctly modeled as members vs. composing overlays. |
| Gap | no rule for splitting a no-CVA state space. |
| Verified | —. |
| Candidate fix | mutually-exclusive (default/checked) = `state` axis members; composing (`disabled:`/`focus-visible:`/`aria-invalid:aria-checked:`) = boolean overlays / interaction-state pattern. Do not force into a flat enum (explodes or drops cells). *(also: figma-build-rules, T5)* |
| Status | deferred. |

**B18 · T2 — single-axis state set cannot express orthogonal combinations (checked×disabled) → instance override** *(Radio #4)*

| Field | Content |
|---|---|
| Why B | legitimate instance `opacity` override, recorded in notes. |
| Gap | no rule for an orthogonal state combination outside the axis. |
| Verified | —. |
| Candidate fix | e.g. "first option checked under a disabled group" → instance on `state:checked` + `opacity:0.5` override (no member, no detach), in notes. *(also: figma-build-rules)* |
| Status | deferred. |

**B19 · T2.5/T3 — twMerge survival guard on "at-risk DS custom utility", not only `text-format-*`** *(Radio #2)*

| Field | Content |
|---|---|
| Why B | right utility (`corner-*`) identified. |
| Gap | the guard is keyed to typography; a graphics-only control (circle+dot, no text) has no typography class → the at-risk candidate is `corner-full`. |
| Verified | —. |
| Candidate fix | key the guard to the component's at-risk utility (typography for text, `corner-*`/named spacing for graphics-only). |
| Status | deferred. |

**B20 · T6 — Radix composite needs NO jsdom polyfill if specs render only "closed"** *(Select G)*

| Field | Content |
|---|---|
| Why B | recognized, spec ran green. |
| Gap | T6 headless heuristic missing for portal-mounted content. |
| Verified | a trigger/root-only spec ran without `scrollIntoView`/`hasPointerCapture`. |
| Candidate fix | portal content (mounts only on open) needs the polyfill only if a spec opens; cover the open path via the Chromium Storybook project (play). *(also: /storybook-rules)* |
| Status | deferred. |

#### tokens-reference.md

**B21 · §4/§6 — typography ladder has no 12px sans for micro labels** *(Badge #2)*

| Field | Content |
|---|---|
| Why B | snapped to `text-format-label` — caveat "agent guesses". |
| Gap | §6 maps dead `text-xs` → "matching `text-format-*`", but no 12px sans exists (`label`/`body`=14, `eyebrow`=9 mono/upper, `data`=11 mono). |
| Verified | —. |
| Candidate fix | name the off-ladder fallback — no exact format → choose by ROLE (micro label → `text-format-label`, 14px snap accepted) OR flag a missing DS micro-label format as an open item. *(also: SKILL.md T2)* |
| Status | deferred. |

**B22 · §6 — spacing examples: bottom rung `gap-0.5`(2px)→`gap-2xs` missing** *(Field #3)*

| Field | Content |
|---|---|
| Why B | px-value rule → `gap-2xs` correct despite the incomplete example list. |
| Gap | the §6 examples stop at `gap-1.5(6)→gap-sm`; the 2px rung is missing → a porter may round to `gap-xs`(4) or leave it numeric. |
| Verified | `gap-0.5`=2px → `gap-2xs` (space-2xs, the only 2px step). |
| Candidate fix | extend the §6 list by the bottom rung: `gap-0.5(2)→gap-2xs · py-0.5(2)→py-2xs`. *(Recurring — Badge already hit `py-0.5→py-2xs`.)* |
| Status | deferred. |

**B23 · §4/§6 — 16px sans has no exact rung → choose by ROLE** *(Field #4)*

| Field | Content |
|---|---|
| Why B | `text-format-title` (sensible); generalizes the micro-label role choice to every missing rung (see Related). |
| Gap | the sans ladder is 14/18/22/27/43 — no 16px; 16→18 is the same class one step higher than 12→14. |
| Verified | the §4 ladder has no step between 14 and 18. |
| Candidate fix | choose every stock size without an exact DS rung by ROLE + note it: 16px section captions → `text-format-title` (18/600), 12px micro labels → `text-format-label`. |
| Related | generalized from the 12px rule: a 12px micro label likewise has no exact sans format → snaps by role to `text-format-label` (14, +2px snap accepted). |
| Status | deferred. |

#### /component-sync

**B24 · No-delta / premise mismatch is a first-class outcome** *(Switch-sync #1)*

| Field | Content |
|---|---|
| Why B | reported correctly, nothing invented. |
| Gap | the skill does not say that an empty delta is a valid result. |
| Verified | the live read matched everything although the task claimed a change. |
| Candidate fix | the live read overrides the claimed reason; if everything matches → report no-delta, re-read once (rule out a stale/wrong node), invent NO change to satisfy the premise (= red flag "rewrite beyond the delta"). |
| Status | deferred. |

**B25 · S3 — name the member→variant prefix mapping** *(Checkbox-sync #2)*

| Field | Content |
|---|---|
| Why B | applied correctly (documentation naming). |
| Gap | S3 does not name the member→state prefix mapping. |
| Verified | —. |
| Candidate fix | for a single-element state axis each Figma member maps to a code state prefix (`state=checked`→`data-checked:`, `state=invalid`→`aria-invalid:`, combined → stacked `aria-invalid:aria-checked:`); per member, diff the bound props against the prefixed classes. |
| Status | deferred. |

**B26 · S2 — `use_figma` wrapper needs `fileKey` + `description`** *(Radio-sync #3, minor/env)*

| Field | Content |
|---|---|
| Why B | minor/env, ran. |
| Gap | the snippet header does not mention `fileKey`/`description`. |
| Verified | —. |
| Candidate fix | note in S2 / snippet header (`fileKey` from config.json + a short `description`). *(also: read-set-values.js)* |
| Status | deferred. |

### C — tooling / repo / already covered

#### tokens-reference.md

**C9 · §6 — stock `text-muted-foreground` → DS `text-muted-ink` (-ink suffix), already covered** *(Table #2)*

| Field | Content |
|---|---|
| Why C | no defect; the mapping is correctly in §6 `color_renames`. User marked it as a recurring stumbling block (secondary text: caption, muted labels). |
| Gap | the text-vs-surface suffix split (`-ink`=text/icon, `-fill`=surface) is easy to mix up → a port may write `text-muted` / `text-muted-fill` instead of `text-muted-ink`. |
| Verified | §6 `color_renames`: `text-muted-foreground → text-muted-ink`; `item.tsx:176` uses `text-muted-ink`. |
| Candidate fix | already covered in §6 — during a port, consistently read §6 instead of guessing by name similarity. Skill prose stays free of token names (`.claude/skills/CLAUDE.md`); home = tokens-reference §6. Entry = evidence. |
| Status | covered. |

## Sources

- Findings in the original (with Verified evidence): `agent-runs/component-port/
  {2026-06-08-breadcrumb,2026-06-10-input-group,2026-06-10-command,2026-06-10-dialog,
  2026-06-11-command-dialog,2026-06-12-badge,2026-06-12-separator,2026-06-12-field,
  2026-06-12-checkbox,2026-06-12-switch,2026-06-12-radio-group,2026-06-19-select,2026-06-22-slider,
  2026-06-22-tooltip,2026-06-22-popover,2026-06-23-tooltip-root-mirror,2026-06-26-item,2026-06-26-table}/skill-feedback.md` +
  `agent-runs/component-sync/2026-06-12-{checkbox,switch,radio-group}/skill-feedback.md`
- Component locator/status: `design-docs/design-system/components-reference.md` (read first)
- Token crosswalk: `design-docs/design-system/tokens-reference.md` (§3 collision rule,
  §4 `text-format-*`, §6 stock→DS, §7 Auto Layout→utilities)
- Run notes: `agent-runs/component-port/*/notes.md` + `agent-runs/component-sync/*/notes.md`
- Gate (lib): `npx nx test|typecheck|lint @agentport/ui` · full gate: `npm run check`

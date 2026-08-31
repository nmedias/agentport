# Agentport DS — Component Changelog

How the component catalog got to its current shape: ports, re-ports, Figma revisions, sync rounds,
removed artefacts and the decisions behind them. Human-readable, newest first. The **current** state
(node IDs, axes, exports, deviations, open items) lives in
[`components-reference.md`](components-reference.md) — this file is not a locator; it exists so that a
node ID in an old run note, a stale branch name or a former token name can be traced.

Token-level history (renames, palette rework, dropped tokens) is in
[`token-changelog.md`](token-changelog.md) and is only referenced here where it changed a component.

---

## 2026-08-31 — Figma file switch, file cleanup, descriptions audit, catalog restructure

**Figma file.** The DS moved to its own file `ejFKo4MNuvC9TSDKOCUvyq` ("Agentport DS"), a duplicate of the
previous file — every node ID in the catalog stayed valid (page `Shadcn Components` keeps `3126:2`;
verified via Plugin MCP: 26 sections, probe IDs Table / Checkbox / Select found).

**File cleanup (Plugin MCP).** Orphaned section **Toggle** `4802:2819` removed (set + usage examples, 61
components — Toggle had had no code counterpart since 2026-06-24). Page `Color`: frame `4178:2` (brand
colours) removed, frame `Colors` `4197:9989` relabelled to the variable / CSS names. Collection
`reference`: 33 ramp variables `Color/os-{signal,still,deep}/*` → `Color/{signal,still,deep}/*`; grey ramp
`Color/ink/*` → `Color/neutral/*`. Four `semantic` descriptions neutralised. Collection `showcase` (6 vars,
0 bindings) deleted. Command section: separator labels "Springe zu / Suche / Führe aus" (German for
"Jump to / Search / Run") → "Jump to / Search / Run" (= stories).

**Descriptions audit.** One English role sentence per token across Figma variable / style descriptions,
`tokens-reference.md` and the Storybook foundations (52 `semantic` + 15 `semantic-dimension` + 14 text
styles + 2 effect styles). Component-relevant structural changes: `Muted/muted` (`4492:2666`) became the
standalone `--ap-sys-muted` / `text-muted`; 120 bindings on `Muted/muted-ink` outside `muted-fill` were
rebound to `Muted/muted` (64 main nodes + 56 instance overrides) and 62 code call sites moved from
`text-muted-ink` to `text-muted`. `Inverse/inverse-ink/muted` → `Inverse/inverse-ink-muted` (`4663:4413`).
`background-fixed` (`3116:2`) deleted. `inverse-container-hover` aligned to the Figma value 70 %.

**Catalog restructure.** `components-reference.md` rewritten in English: history moved into this file,
free-text `notes` replaced by structured fields (`anatomy`, `deps`, `deviations`, `forks`,
`figma_mechanics`, `divergences`, `a11y`, `open`, `run_notes`), `vars` maps re-verified against the live
file. The scan found 15 usage-example instance overrides in Checkbox / Switch / RadioGroup still bound to the
deleted variable `3038:5` (old `shadcn Default/input`); rebound to what the main components bind (`input-border`
for the Checkbox / Radio stroke, `input-fill-high` for the Switch track) — page scan afterwards: 0 dead bindings.

---

## 2026-06-26 — Item and Table ported

**Item** (`4494:2471`): 10-part composite ported as a root-barrel primitive. Review fixes on the same
day: media-slot default = nested `.ItemMedia` instance instead of a raw vector; title + ItemMedia icon
bound to `ink` (the recon had left raw hex); focus ring copied verbatim from the Select focus member
(`4308:2001`) instead of the generic Glow style; `ItemGroup` added as a component (`4511:2575`, items
slot); `ItemMedia` content slot made swappable.

**Table** (`4514:2597`): 8-part composite. Row-tint decision: hover neutral (`bg-muted-fill/50`, like Item
rows), selected accent (`bg-accent-fill`, like the Command selection — `muted-fill` would be invisible
for a selected row). Cells gained a `content` slot in addition to the text prop the same day (user
request) so a cell can hold a component (Checkbox / Badge / Button); example "Component cells"
(`4529:2758`).

---

## 2026-06-24 — Popover two-stage anchor (Figma only)

Popover root set `4402:2589`: every member got a constraint-driven **two-stage anchor** (invisible "Panel
Position" frame tracking the trigger edge + `PopoverContent` growing away from the trigger), so trigger
resize and content growth keep an 8px gap with zero overlap across all 24 variants. Panel containment:
the GRID set received padding (L/R 328, T 105, B 48) and grew to 2086 wide so its own frame encloses the
floating panels; section 1718×2528 → 2278×2585. No code change (Radix Popper does the same at runtime).
Lesson recorded: a spill check must recurse to the visible `PopoverContent` leaves and use
`absoluteBoundingBox`, not `absoluteRenderBounds`.

---

## 2026-06-23 — Popover / Tooltip Figma rebuilds, Popover docgen

**Popover.** (A5) Section composition repaired: free-positioned children re-parented into a white
vertical auto-layout build frame `4390:2364` (section 321×203 → 1312×1133). (#4) `align` modelled as a
root set `4393:2391` — superseded the same day by the **full interactive overlay** set `4402:2589`
(24 members state × side × align, HUG-slot trigger as `asChild` proxy, absolute content, click + Esc
prototype); `4393:2391` removed; set renamed "Popover". (A4) `PopoverProps` via Omit + re-declare,
`PopoverContentProps` extended to the full curated set; Sides story added.

**Tooltip.** Build frame `4420:2530`; root set `Tooltip Root` `4419:2781` (8 members state × side, hover
prototype); (A8) arrow replaced by a down-pointing triangle `4414:2493` with stroke only on the slanted
edges (the borderless rotated square `4382:2358` removed). Section resized 953×789 → 1368×909.

---

## 2026-06-22 — Slider, Popover, Tooltip ported

Slider (`4348:2225`, 12 members orientation × thumbs × state), Popover (`4365:2253`, single
`PopoverContent` member — no state set) and Tooltip (`4381:2356`, single chip component) ported with
`/figma-build-rules`. Tooltip core decision: stock is an inverted dark chip; the DS has no inverted
overlay token, so it was re-clothed on the raised overlay surface (`dialog-fill` + `dialog-ink` + border +
`shadow-elevation`) — a recorded dark → light fork. Kbd's tooltip-context override was flagged then as
tuned for a dark chip; it now reads on `muted-fill`.

---

## 2026-06-20 — Select fix round (Figma only, background agent)

(1) Trigger `focus-invalid` members per size (`4326:2363` / `4326:2367`, 10 instead of 8); invalid ring
focus-gated (invalid = border only). (2) Item `showIcon` boolean `#4326:0` (default false) via an
`iconWrap` frame per member — never on the slot itself. (3) `SelectGroup` as its own component
`4326:2371` (label text + items slot), replacing the earlier inline SelectLabel. (4) Top-level `Select`
composition `4326:2477` (anchored open state: trigger + ABSOLUTE content). (5) Example headlines on the
sibling canon (Hanken Grotesk Regular 13, `muted-ink`), Groups example rebuilt from two `SelectGroup`
instances + Separator, Open example added. Code side in parallel: per-part story files
(`select-{trigger,content,item,value}.stories.tsx`), focus-gated ring, Invalid story, docgen.

---

## 2026-06-19 — Select ported, Checkbox indeterminate, ChoiceCardCheckbox binary

**Select** (`4307:1997`) ported as a full composite; user decisions: trigger fill = `bg-input-fill`
(Input parity, deliberate departure from Nova's transparent trigger), scope = full composite.

**Checkbox.** Code styles the tri-state (`data-[state=indeterminate]` = `primary-fill`, dash glyph
`RiSubtractLine`); Figma `checked` axis extended by `indeterminate` — 5 members cloned from the
`checked=on` row (`4303:73`, `4304:73/76/79/82`), 15 members, 5×3 WRAP.

**ChoiceCardCheckbox** deliberately **not** mirrored: `checked` / `defaultChecked` / `onCheckedChange`
narrowed to `boolean` — a leaf card is a binary single choice, the tri-state is a group / parent concept,
so no phantom indeterminate story or Figma variant.

Same day (token level): `secondary` → `secondary-fill`; Button and Badge re-clothed.

---

## 2026-06-18 — Raised-surface consolidation

`overlay` + `popover` → one token `dialog` (see token changelog). Dialog panel `bg-overlay-fill` →
`bg-dialog-fill`; stock `bg-popover` / `text-popover-foreground` dead from here on (Popover, Select
content, Tooltip and Command all sit on `dialog-fill`).

---

## 2026-06-17 — Colour rework applied to every component

All components re-clothed via `/component-sync` (Figma → code) onto the `-fill` / `-ink` / `-border`
utilities. Live Figma set names updated: top-level sets without the leading dot, composites flattened
(`.Command/Item` → `CommandItem`, `.Dialog/Footer` → `DialogFooter`, `.ChoiceCard/Checkbox` →
`ChoiceCardCheckbox`; `.Button/Base` keeps the dot). Per-component colour deltas and deviations:
`agent-runs/component-sync/2026-06-17-<component>/notes.md`. Badge `destructive` became a solid fill
(was a /10 tint). Separator: no delta (`border` kept its name, only the value changed).

**FieldGroup** gained an `orientation` axis: the single component `3742:1044` was combined into set
`4285:1997` (vertical = the former component, horizontal = `4280:73`); code `fieldGroupVariants`
(DS extension over stock shadcn, which only knows Field orientation).

Open Figma debt recorded then: the focus / invalid DROP_SHADOW effect colours bind raw hex instead of the
`ring` / `destructive` variables (the code uses the role-correct tokens).

---

## 2026-06-16 — ChoiceCard, Command a11y, Switch invalid track, story cleanup

**ChoiceCard** Figma sets built by a background agent (`4112:1638` / `4119:1750` / `4124:1862`, each
checked × state) nesting real `.Field` + control instances; card-semantic default texts ({Title} /
{Description} / {Error}, 72 nodes). Checked tint decided as the **two-token accent model** (card fill
`accent-fill`, stroke then `primary`, title `accent-ink`) — fully variable-bound, replacing the earlier
`primary/5` + `/30` alpha approach whose bound alpha paints did not survive instantiation. Code followed
in `field.tsx` (later the stroke moved to `accent-border` with the colour rework).

**Command a11y** (axe `aria-required-children`): `CommandSeparator` renders its own `role="presentation"`
div (cmdk sets `role` after the prop spread), `CommandEmpty` renders as a disabled `role="option"` so the
listbox always has an allowed child.

**Switch** sync: unchecked-invalid track reset to the input grey (border only); the 06-12 "both positions
red" rule removed. Inline ChoiceCard stories removed from Switch / RadioGroup (canonical: `choice-card/`).

---

## 2026-06-15 — Focus-gated invalid ring, checked × state axes

Checkbox, Switch, RadioGroup: `aria-invalid:ring-[3px]` removed — the destructive ring is focus-gated
(width only from `focus-visible:ring-[3px]`); invalid resting = destructive border only. Consistent with
Input, deviates from stock shadcn (`ring-3`).

Figma re-sync closed the divergence: sets rebuilt on explicit axes — Checkbox `checked × state`
(10 members), Switch `size × checked × state` (20 members, `checked=on, invalid` synthesised), RadioGroup
`checked × state` (10 members). Resting invalid members lost their glow; new `focus-invalid` members carry
the destructive @20 % glow. Instances followed by node identity, no remap.

---

## 2026-06-13 — Checkbox choice-card example

DS-authored choice-card story for Checkbox (parity with Switch / Radio); Figma example `4044:1515`
cloned from the Switch choice card `3979:2` with the control swapped (code → Figma push).

---

## 2026-06-12 — Form-toggle batch, Field family, Label, Separator, Badge

**Batch** (branch `feat/form-toggles-port`): Checkbox · Switch · RadioGroup ported in parallel (three
code agents, Figma serial because of the single plugin connection). Standard established: focus /
invalid glow = literal-alpha DROP_SHADOW with `showShadowBehindNode:false`, copied verbatim from the Input
focus member `3176:305`; permanent usage-examples group with real `.Label` instances. Same-day syncs:
unchecked boxes / circles = `bg-input-background` (then), checked-invalid = solid destructive.

**Field family** (composite, variant A: Figma = the field row only, code = the full 10-export family) with
**Label** co-ported as a hard dependency (own set `3735:1024`, `state` axis as a Figma convenience) and
**Separator** (`3676:1018`). Field Figma revisions the same day: description fill bound to
`muted-foreground` (was solid black); horizontal members rebuilt to the shadcn-canonical structure
(FieldContent column left, control as sibling right); label slot default = real `.Label` instance;
`Show description` / `Show error` booleans bound on wrapper frames (never on the slot); additive
`controlPosition` axis with two leading members `3897:1240` / `3897:1249`; error-slot fix on the two
horizontal invalid members (clone had degraded the slot to a frame). **FieldLegend** (`3909:1246`),
**FieldSet** (`3739:1026`) and **FieldGroup** (then `3742:1044`) received Figma sets / components.

**Badge** ported (6 Nova variants incl. ghost / link). Input, Textarea and InputGroup gained a
`focus-invalid` member (Figma only; code composes it from `focus-visible:` + `aria-invalid:`).

Text-property convention set: children-driven text props are named `<name> (children)` with a `{…}`
default.

---

## 2026-06-11 — Command palette variant, CommandDialog

`variant` axis `[default, palette]` on CommandInput / CommandGroup / Command composition, built by cloning
the exploration frame `3554:859`; `CommandSeparator` set with `variant=labeled` (labeled rule). Item set
unchanged (user decision "items are the same"); 16px alignment via group `px-md`. Code followed via
`/component-sync` (stories Palette / PaletteInDialog / PaletteFlat); user refinements: standard caret
colour, list `max-h-96`, search icon `text-foreground`. **CommandDialog** re-added code-only (branch
`feat/command-dialog-readd`), panel centred (`top-1/2`, was `top-1/3`).

---

## 2026-06-10 — Command, Dialog, InputGroup re-port

**InputGroup** re-ported after the composite-procedure rework: Figma rebuilt from scratch (section
`3519:590`; old section `3491:674` deleted) as three layers + reproduced example instances; the button
part nests a real ghost `.Button` instance. Fix over the previous port: invalid carries `ring-[3px]` +
`ring-destructive/20`.

**Command** ported (multi-composite on cmdk, nests InputGroup). Search field format adjusted in Figma
from the mono input format to `label-md` (synced). Stock lucide icons → `@remixicon/react`.

**Dialog** ported together with the new semantic token `scrim` (+ `scrim-opacity`); footer as its own
component instantiated in the footer slot (user decision); slot visibility via wrapper frame.

---

## 2026-06-09 — radix-nova baseline

`components.json` style switched new-york → **radix-nova**; the existing components (Button, Input, Kbd,
Breadcrumb) aligned to the Nova density. Textarea ported (port #1 of the Command chain; values audit
showed Figma already matched). Kbd: `emphasis` axis synced. Breadcrumb: Nova density decided in code and
pushed to Figma. Earlier ports (Button, Input, Kbd, Breadcrumb) predate this entry.

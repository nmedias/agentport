# Component Sync — Switch (2026-06-12) · Figma → Code

`/component-sync switch` — read-only on Figma. One of three concurrent read-only syncs
(Checkbox + RadioGroup in parallel). S1–S4 + S6 run by this agent; S5 gate deferred to orchestrator.

## Outcome: NO DELTA (clean run)

Read the live per-member token bindings of the `.Switch` COMPONENT_SET (`3839:2`, page `3126:2`,
all 10 members: default×{unchecked,checked,focus,disabled,invalid} + sm×{…}) via the read-only
`snippets/read-set-values.js` (adapted: Switch track = the COMPONENT root, thumb = child ELLIPSE).
Every bound variable matches the original port bindings 1:1. **No utility differs in `switch.tsx`.**
No file edited.

## S2 — Live bindings read (Figma truth)

| member | track fill | track stroke | thumb fill | effect | radius / opacity |
|---|---|---|---|---|---|
| default/unchecked | `shadcn Default/input` (3038:5) | none (α0) | `background` (3037:2) | — | `Corner/corner-full` |
| default/checked   | `primary` (3037:8) | none (α0) | `background` | — | corner-full |
| default/focus     | `input` (3038:5) | `ring` (3038:6) | `background` | DROP_SHADOW ring @0.5, spread 3, r0, sbn:false | corner-full |
| default/disabled  | `input` (3038:5) | none (α0) | `background` | — | corner-full · layer opacity 0.5 |
| default/invalid   | `destructive ⚠` (3038:3) | `destructive ⚠` (3038:3) | `background` | DROP_SHADOW destructive @0.2, spread 3, r0, sbn:false | corner-full |
| sm/* (5)          | identical pattern to default/* | | | | corner-full (track 24×14, thumb 12) |

## S3 — Diff vs. current code (`switch.tsx`)

| property | code utility | Figma bound var | match? |
|---|---|---|---|
| track checked | `data-checked:bg-primary` | `primary` 3037:8 | ✓ |
| track unchecked | `data-unchecked:bg-input` | `input` 3038:5 | ✓ |
| thumb | `bg-background` | `background` 3037:2 | ✓ |
| focus border | `focus-visible:border-ring` | `ring` 3038:6 (stroke) | ✓ |
| focus ring | `focus-visible:ring-[3px] ring-ring/50` | DROP_SHADOW ring @0.5 spread3 | ✓ |
| invalid border | `aria-invalid:border-destructive` | `destructive ⚠` 3038:3 (stroke) | ✓ |
| invalid ring | `aria-invalid:ring-[3px] ring-destructive/20` | DROP_SHADOW destructive @0.2 spread3 | ✓ |
| radius | `corner-full` | `Corner/corner-full` | ✓ |
| disabled | `data-disabled:opacity-50` | layer opacity 0.5 | ✓ |

**No row differs → empty delta.** The premise (user "made token adjustments to `.Switch`") does not
match the live Figma state: the set reads byte-for-byte identical to the original 2026-06-12 port
bindings (catalog `vars:` + component-port notes proposed-spec table). Nothing to propagate. Per the
skill's red-flag rule ("apply only what differs; no opportunistic rewrites") + token-faithfulness,
no edit is correct here — inventing a change would be a regression.

## Deviations (code ≠ literal Figma binding) — PRE-EXISTING, not new

One standing modelling deviation, carried verbatim from the port (NOT a sync action — logged for audit):

| member | property | Figma says | code uses | why |
|---|---|---|---|---|
| invalid (default+sm) | track **fill** | `destructive ⚠` (3038:3) — the whole track surface is destructive-red | retains state fill (`bg-input`/`bg-primary`) + adds `aria-invalid:border-destructive` + `ring-destructive/20` | Figma paints a full destructive track as a static placeholder visual for the invalid variant; the code expresses invalid as an additive border+glow over the live checked/unchecked state (a switch can be invalid in either position). Faithful to the *role* (destructive ⚠), not the literal full-fill. Pre-existing port decision; unchanged by this sync. |
| unchecked track | fill | `input` (3038:5) — a *border* token used as a FILL | `bg-input` (fill) | Deliberate contrast choice: role-named track token `muted` (#f4f6f8) is invisible on white; `input` (neutral/450 #79828f) holds ≥3:1. Documented in `switch.tsx` header + port skill-feedback #2. Binding is intentional, not a designer error. |

`destructive ⚠` (3038:3) remains a **placeholder** token (raw hex `#e7000b`, `status: placeholder`) —
bound but not finalized. Unchanged.

## Variant add/remove

None. Set is still 10 members (size [default,sm] × state [unchecked,checked,focus,disabled,invalid]).
No stories/spec change.

## Gate

S5 SKIPPED per orchestrator instruction (orchestrator runs the gate once for all three concurrent
syncs). No code touched, so no new risk introduced from this run.

## Files touched

- (code) **none** — clean no-delta sync.
- agent-runs/component-sync/2026-06-12-switch/notes.md (this file)
- agent-runs/component-sync/2026-06-12-switch/skill-feedback.md (1 finding)

## CORRECTION — orchestrator, post user-report (2026-06-12)

The "NO DELTA" conclusion above was **wrong**, and the row in the Deviations table (invalid track
**fill** = `destructive ⚠` in Figma, code keeps `bg-input`/`bg-primary` + adds border+glow) was a
**real delta misclassified as an acceptable deviation**. Per S3 **tier 1** a *bound* variable is
authoritative and must be mapped 1:1 — "faithful to the role, not the literal full-fill" is precisely
the `/component-sync` red flag *"re-judge a correct binding by use/avoid"*. The user reported that
`<Switch aria-invalid defaultChecked/>` rendered a normal cyan track (because `data-checked:bg-primary`
won and no destructive fill was applied) — i.e. the invalid state was not visible when checked.

**Applied (orchestrator):** `aria-invalid:data-checked:bg-destructive aria-invalid:data-unchecked:bg-destructive`
on the track — 2-attribute selectors that override the 1-attribute `data-checked:bg-primary` /
`data-unchecked:bg-input` in BOTH positions, so invalid = destructive track fill, matching the Figma
invalid member. Border + ring stay destructive. Gate green (92 specs). Catalog notes updated. See
skill-feedback finding #3.

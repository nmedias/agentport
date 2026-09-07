# Worker notes — token-column audit, package forms-b

Sections: FieldSet, FieldGroup, Checkbox, Switch, Slider, RadioGroup, ChoiceCard.
Branch `tok/forms-b` in `~/Dev/agentport-tok-forms-b` (from `master` `a50361f`), three commits:
`81fb254` (round 1, "own binding wins" tie-break) → `bb2cb40` (round 2, reconciled with the
provenance-boundary dump rewrite + ChoiceCard `ownMembers`) → `69fca21` (round 3, reconciled with the
override-harvesting dump fix — FINAL, ALL PASS). Figma file `nQSNLASjuLvgTh3we8Dp4s`, page
`Components`. `dumps/figma-forms-b.json` in `tools/token-audit/dumps/` holds the final (round-3) fresh dump.

## Three rounds

**Round 1** (own-binding tie-break — `figma-dump.js` credited a section with everything reachable by
`findAll`, including inside nested foreign instances). Result: FieldSet/FieldGroup/RadioGroup picked up
`ink`/`muted`/`input-fill`/etc. from their nested Field examples as "own"; ChoiceCard picked up its
Checkbox/Switch/RadioGroupItem control tokens the same way. Gate: ALL PASS.

**Round 2** (controller rewrite, dump commit `f4d4dc3`): the walk now STOPS at a nested instance of a
foreign component — everything under it is the member's, full stop. The only escape hatch is
`doc-overrides.json` → `<Section>.ownMembers`, which names components that are genuinely part of THIS
component's own anatomy; only ChoiceCard has one (`[Checkbox, Switch, RadioGroupItem]`), pre-populated
by the controller. Re-dumped all seven sections fresh, reconciled the delta and the catalog. Left one
FAIL: ChoiceCard's `accent-ink` had no way to register as own OR member — flagged as a dump gap rather
than silently dropped, since it is genuinely bound in Figma (confirmed by direct node trace) and
already documented in the catalog's `tint` note.

**Round 3** (controller fix, dump commit `0f8aba3`): the diagnosis was right — the dump now reads
`overrides` of a boundary instance and everything nested in it, harvesting the overridden paint/style
fields as own (Figma records an override on the nearest enclosing instance, e.g. the Label inside the
Field, not the Field itself). Re-dumped fresh again: FieldSet's `border` (a placement override on the
nested `.Separator`) and ChoiceCard's `accent-ink`/`destructive`/`input-fill`/`primary-fill`/`ring`
(placement overrides on the checked-state members) came back as own. Added FieldSet's `border` roled
row back to Figma, dropped ChoiceCard's now-resolved `open:` note, re-ran the gate: **ALL PASS**.
FieldGroup and RadioGroup were unaffected by round 3 (their own set had no placement overrides beyond
what round 2 already found).

## Final gate line (fresh dump, worker's branch catalog `69fca21`, merged overrides)

```
cd tools/token-audit
python3 check.py --only FieldSet,FieldGroup,Checkbox,Switch,Slider,RadioGroup,ChoiceCard \
  --figma dumps/figma-forms-b.json --overrides /tmp/overrides-forms-b.json \
  --catalog ~/Dev/agentport-tok-forms-b/design-docs/design-system/components-reference.md
→ ALL PASS (0 FAIL, 21 WARN — all T2-figma-only, expected: space-*/text:* / geometry-only chips
  have no 1:1 DS utility, which is normal per the brief's decision table)
```

## Table — section · round 1 → round 2 → round 3 · what moved · final result

| Section | round-1 chips | round-2 chips | round-3 change | final result |
|---|---|---|---|---|
| FieldSet | 6 roled + 7 bare = 13 | 0 roled + 2 bare = 2 | `border` came back own (placement override on the nested `.Separator`, harvested by the round-3 fix) — added the roled row back → 1 roled + 2 bare = 3 | PASS |
| FieldGroup | 6 roled + 6 bare = 12 | 1 roled + 2 bare = 3 | unaffected | PASS |
| Checkbox | 7 roled + 1 bare = 8 | unchanged | unaffected (atomic set, no nested foreign instances) | PASS |
| Switch | 6 roled + 0 bare = 6 | unchanged | unaffected | PASS |
| Slider | 5 roled + 0 bare = 5 | unchanged | unaffected | PASS |
| RadioGroup | 10 roled + 4 bare = 14 | 8 roled + 1 bare = 9 | unaffected | PASS |
| ChoiceCard | 13 roled + 4 bare = 17 | 13 roled + 4 bare = 17 (1 dump gap on `accent-ink`) | `accent-ink` (+ destructive/input-fill/primary-fill/ring, already chips) came back own as placement overrides — chip set unchanged, gap resolved | PASS |

## Judgement calls (one line each)

- **FieldGroup's `border` stays own after the rewrite, FieldSet's does not** — traced both: FieldGroup's
  own component nests a real `.Separator` INSTANCE directly (its stroke override sits at that instance's
  own level, before any foreign-instance boundary, so the boundary walk still sees it); FieldSet nests
  the Separator two hops deep, behind a foreign `.FieldGroup` instance, so the boundary stops before
  reaching it. Both traces came from direct node inspection, not inference from the dump's summary alone.
- **RadioGroup `ink`/`muted` — kept in round 1, correctly dropped in round 2.** Round 1's own-binding
  logic credited them because the container's nested `.Field`/`.Label` content was walked without a
  boundary; round 2's stricter walk stops at that `.Field` instance, and neither token's provenance
  chain touches `RadioGroupItem` (the only component the section itself defines) — no `ownMembers` entry
  applies. Per the brief, did NOT add an `ownMembers` list for RadioGroup on my own judgement; if the
  round-2 controller wants RadioGroup's container content documented as its own anatomy, that is a
  question for them, not a worker default.
- **ChoiceCard's `ownMembers` adoption reproduces round 1's chip set almost exactly** for the 10 control
  tokens (primary-fill, primary-ink, input-fill, input-border, destructive, destructive-ink, ring,
  input-fill-high, corner-sm, corner-full) — confirms the two mechanisms (old blanket tie-break vs. new
  explicit `ownMembers`) agree on what ChoiceCard's anatomy actually is, once ChoiceCard's Field-derived
  `ink`/`muted` are excluded (those were always a category error: text that names the option, not part
  of the control itself).
- **`accent-ink` — flagged as a dump gap in round 2, resolved in round 3.** Direct node trace on the
  `checked=on, state=focus-invalid` ChoiceCardCheckbox member confirmed `FieldContent > label > Label >
  {Label}` is bound to `Accent/accent-ink`, a paint override applied only at ChoiceCard's own placement
  of the foreign `.Field` instance. Kept the chip/role and left the round-2 `T1-dead` FAIL as blocked
  rather than deleting a true design fact to force green (per the brief's "gate seems wrong → blocked,
  move on" instruction) — the controller's round-3 override-harvesting fix confirmed the diagnosis and
  resolved it structurally; no catalog content needed to change beyond removing the now-stale `open:` note.
- **FieldSet's `border` — same override mechanism, opposite direction.** Round 2 dropped it (member-only,
  chain through the foreign `.FieldGroup>Separator`); round 3's override harvest reads `overrides` of the
  boundary instance (`.FieldGroup`) and everything nested in it, so the `.Separator`'s stroke override —
  applied at FieldSet's own placement, per Figma's "override recorded on the nearest enclosing instance"
  rule — is now correctly read as FieldSet's own decision. Added the roled row back rather than leaving
  it bare or dropped.
- **Slider's `ring` code-vs-Figma gap** and the **FieldSet/FieldGroup `space-lg`** code_only_tokens
  entries from round 1 are untouched by the boundary rewrite (they concern the code counter-check, not
  own/member provenance) — carried forward unchanged.

## Blocked / open

- **Nothing open for this package as of round 3.** The one round-2 dump gap (`accent-ink`) is resolved;
  gate is ALL PASS.
- **RadioGroup could arguably want an `ownMembers` entry** for its container's nested `.Field`/`.Label`
  content (so `ink`/`muted` would come back), by analogy with ChoiceCard — **the controller decided NO**
  (2026-09-04, in the same message that shipped the round-3 fix): "its nested Field/Label are content
  like FieldSet's, consistent with the second decision; leave ink/muted out." Settled, not re-raised.
- **Pre-existing denylist hit, not introduced by this worker**: line 39 of `components-reference.md`
  (the `## Rules`-adjacent schema note the controller added in `a50361f`, before any worker branch)
  contains a legacy repo name. Confirmed via `git show a50361f:...| sed -n '39p'` that this
  predates my branch; my diff introduces zero denylist hits (`git diff --cached` grep clean all three
  rounds).

## Deliverables

- Branch: `tok/forms-b` in `~/Dev/agentport-tok-forms-b`, commits `81fb254` → `bb2cb40` → `69fca21` (final).
- Delta: `agent-runs/token-column-audit/2026-09-04/forms-b/roles-delta.json` (final state, round 3)
- Notes: this file.
- Screenshots (final, round 3 for FieldSet; round 2 for FieldGroup/RadioGroup/ChoiceCard, unchanged
  since round 2; round 1 unchanged for Checkbox/Switch/Slider):
  `agent-runs/token-column-audit/2026-09-04/forms-b/screenshots/*.png`
- Fresh dump: `tools/token-audit/dumps/figma-forms-b.json` (post-round-3 state, ALL PASS)

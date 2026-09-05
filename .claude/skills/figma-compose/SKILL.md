---
name: figma-compose
description: "Compose a screen, artboard or page in Figma out of an existing design system — every mapped part placed as a real component instance driven through its declared controls, everything else authored from bound tokens, layers named after the compositions they would become. Trigger when the user wants a mockup, draft, screen or reference layout rebuilt / nachgebaut in the DS Figma file using only what already exists there, with no new components and no token overrides. Consumes the mapping from /figma-coverage; run that first when there is none. For building a component SET (variant matrix), use /figma-build-rules instead."
argument-hint: Which screen should be composed, and into which Figma page?
---

# Figma Compose (mapping → screen in the DS file)

Assemble one screen from an **existing** design system: mapped parts become real instances driven
through their declared controls, unmapped parts become token-bound frames, nothing new is published.
Producing the mapping is `/figma-coverage`; building a component **set** is `/figma-build-rules`.

## Inputs / Output

```
in   mapping   REQUIRED. From /figma-coverage: the per-part classification (A–E + resolved ids) AND
               its decomposition map — the subtree tree the layer names come from.
               Missing → run /figma-coverage first; composing without it re-invents the audit badly.
     artifact  the source the screen is composed from (draft, node, code, mockup)
     target    file + page to build on; a Section-wrapper helper if the project has one
     catalog   the component catalog — the declared controls of each component
     tokens    the token + type-format reference — roles and ids
     icons     the project's icon source, and the icon COMPONENTS available as swap targets
     check     the project's structural pre-handoff check
     rules     default: no new components, no new tokens, no override of a token-backed value on an
               instance, no detaching
out  screen    one frame per state, inside a Section on `target`
     notes     what was built, the fidelity deltas `rules` forced, and the verification results
```

## Figma Rules

**Mechanics → `/figma-build-rules`**: the Plugin-MCP contract, binding by variable id, slot
configuration, the one-structural-mutation-per-instance-per-call limit, and the red-flag table. This
skill adds only what composing a *screen from finished components* needs on top.

**Never detach. Never publish a new component.** A part with no component stays an artboard-local
frame and is already recorded as a gap by the mapping — absorbing it silently is the failure this
skill exists to prevent.

## Process

```
T1  Preflight   read the mapping; check whether `target` already holds a version of this screen
T2  Shell       Section + one frame per state + the zone skeleton, zones empty
T3  Compose     zone by zone, outside-in — §T3 instance recipe per mapped part
T4  Author      unmapped parts as token-bound frames, bound by variable id
T5  States      second state = clone the first, then add only the delta
T6  Verify      complete · controls live · every token-backed value bound · structural · faithful
T7  Notes       built inventory · fidelity deltas · verification results
```

---

### T1 — Preflight

- Read `mapping`. It decides per part whether T3 (mapped) or T4 (unmapped) applies, and per subtree
  via its decomposition map. **Do not re-derive it while building** — a mapping made mid-build is the
  audit done badly and unrecorded.
- **Check `target` before writing.** If a version of this screen already exists there, build a sibling
  to diff against; never overwrite or delete someone's frame without being asked.
- Resolve every id the mapping cites once, up front: variables, text/effect styles, component mains,
  icon components. Ids, not names.
- Content copy follows the artifact's language.

### T2 — Shell

- One Section on `target` (the project's helper if there is one), one frame per state inside it.
- The map's top level is the zone skeleton. Lay those zones in as **empty auto-layout containers
  first**, then fill. Filling as you go hides layout faults until they are expensive.
- **Layer names come from the map** — copy each subtree's name out of it character for character. The
  artifact's own words are in front of you here and the map's are not, so the failure is naming a layer
  after what the zone *says* while citing the map row it came from. A map row reading
  `1:20 · EntityList` makes the layer `EntityList`, never the heading that zone displays.

### T3 — Instance recipe (every mapped part)

Order matters — each step exists because the next one fails without it.

```
resolve main component by id        never by layer name, name substring, or id namespace
create instance
set EVERY property while it is still free      variant · text · boolean · instance-swap
clear the slot defaults it must not keep       one removal per call, per instance subtree
fill its slots with already-configured nodes
append into the parent
re-resolve the live child, THEN size it        the append gives it a new identity
```

- **Configure before append.** Once a node sits inside another instance's slot, changing it is a deep
  mutation, limited to one per call; a free node takes all its properties in one go.
- **A slot may ship a default** — an icon, a demo, a placeholder row. Appending adds beside it, so
  clear what must not stay. **Remove exactly one child per call.** The first removal invalidates every
  sibling reference held in that tick, so `slot.children.forEach(remove)`, `[...children].forEach`, a
  `while (children.length)` loop and a re-read `children[0]` all fail after the first — including when
  the line above them states this rule. N defaults means N calls, or a `hidden`-style control if the
  component declares one.
- **A control may live on a nested private base** rather than on the set. If a property the part needs
  is absent from the instance, look for it on the nested instance and set it there. Absent there too →
  the part is **B**, not A: record it, do not hand-build the missing piece.
- **Icons ride a swap property to an icon COMPONENT.** Never clone a glyph out of another frame, never
  a text glyph. No icon component for the glyph → keep the component's default, draw a vector only if
  the screen is unreadable without it, and record the missing icon as a gap either way.
- **A default that the component ships and the design did not ask for stays** unless a control removes
  it. It is evidence of what the component is, not a mistake to paint over.

### T4 — Author the unmapped parts

Parts the mapping put in C / D / E have no component. They become plain frames — but **fully bound**:

- Every colour, radius, spacing and gap bound **by variable id**; typography via a text/effect style.
- Pick the token by **role**, not by matching the artifact's raw value. One value often carries two
  roles; the wrong one is a finding a reviewer will hit later.
- A token whose scope excludes the property cannot be used for it — a shape-fill-only colour is not a
  container surface.
- **Geometry stays numeric.** Element sizes and grid widths are layout, not tokens; say so in T7 so a
  reviewer does not read them as unbound.
- These frames are **not** components and are not published. They are already reported as gaps.

### T5 — Second state

Clone the finished frame, then add only what differs — an overlay, a scrim, an open panel. Rebuilding
a second state from scratch guarantees the two drift.

### T6 — Verify

1. **Complete** — count the parts the mapping classified A / B against the parts actually placed, and
   the repeats against their `×N`. Name every part left out and why. A screen that passes every check
   below can still be missing rows, and nothing else here would notice.
2. **Controls live** — every property you drove reads back and renders. Screenshot each zone as it
   completes; a property that sets cleanly and renders nothing is the common silent failure.
3. **Nothing unbound** — walk the built tree and assert that every token-backed property on every
   **authored** node carries a variable binding. Instance internals belong to their components; the
   authored nodes are yours. Report the count, not an impression.
4. **Structural** — run `check` over the whole composition, Section included, and clear its findings
   or state why each remains.
5. **Faithful** — compare against the artifact and list every deviation `rules` forced.

### T7 — Notes

- What was built: instances per component, with ids; authored frames, with ids.
- **Fidelity deltas** — every place the DS produced a weaker answer than the artifact asked for, and
  which mapping row (B / D / E) explains it. This list is the run's most useful output.
- Verification results from T6, as numbers.
- The catalog is **not** updated: nothing in the system changed.

## Red Flags

| Trap | Reality |
|---|---|
| Hand-draw a frame that looks like a component the DS already ships | The point of the run is what exists. Instantiate it, or it is a **B** finding — never a lookalike. |
| "It is still a token, not a raw hex, so binding a fill on the instance is fine" | A bound override is still an override. If the state needs it, the component lacks the control → record it as **B** and use the nearest declared control. |
| "The component is close enough, I will just adjust it a little on the instance" | Adjusting on the instance is how a fork starts. The delta belongs in the notes, not in the file. |
| Clone a glyph, row or group out of another artboard | A clone carries no component link and no controls. Resolve the main and instantiate. |
| Set properties after appending into a slot | Deep mutation, one per call, and stale references. Configure while free. |
| Append into a slot that still holds its default | Append adds, it does not replace. Clear first. |
| Clear a slot with a loop — `forEach(remove)`, `while (children.length)`, or re-reading `children[0]` | Every sibling reference goes stale on the first removal. Quoting the one-per-call rule in a comment above the loop does not make the loop work. One removal, one call. |
| Size a child before appending it to its auto-layout parent | Fill/hug sizing needs the parent. Append, re-resolve, then size. |
| Build the whole screen, then look at it | Screenshot per zone. A silent render failure found at the end costs the whole zone. |
| Re-derive the mapping while building because it is quicker | Then the audit exists only in your head and ships in nothing. Run `/figma-coverage`. |
| Publish the unmapped parts as components "since they are built anyway" | They were never designed, reviewed or token-audited as components. They are gaps, and gaps are reported. |
| Overwrite the version of the screen already on the target page | Build a sibling. Deleting someone's frame is not this skill's call. |

## Boundaries

- Composes an **artboard**, never a component or a component set (that is `/figma-build-rules`).
- Creates no components, no variables, no styles; detaches nothing.
- Does not decide coverage — that is `mapping`. A part the mapping did not classify stops the run.
- Does not update the component catalog or changelog.
